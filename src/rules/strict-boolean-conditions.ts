/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as ts from "typescript";

import type { Rule } from 'eslint';

const OPTION_ALLOW_NULL_UNION = "allow-null-union";
const OPTION_ALLOW_UNDEFINED_UNION = "allow-undefined-union";
const OPTION_ALLOW_STRING = "allow-string";
const OPTION_ALLOW_ENUM = "allow-enum";
const OPTION_ALLOW_NUMBER = "allow-number";
const OPTION_ALLOW_MIX = "allow-mix";
const OPTION_ALLOW_BOOLEAN_OR_UNDEFINED = "allow-boolean-or-undefined";
const OPTION_ALLOW_ANY_RHS = "allow-any-rhs";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: `Restricts the types allowed in boolean expressions. By default only booleans are allowed.
      The following nodes are checked:
      * Arguments to the \`!\`, \`&&\`, and \`||\` operators
      * The condition in a conditional expression (\`cond ? x : y\`)
      * Conditions for \`if\`, \`for\`, \`while\`, and \`do-while\` statements.`,
      category: 'Possible Errors',
      recommended: true
    },
    schema: [{
      type: "array",
      items: {
        type: "string",
        enum: [
          OPTION_ALLOW_NULL_UNION,
          OPTION_ALLOW_UNDEFINED_UNION,
          OPTION_ALLOW_STRING,
          OPTION_ALLOW_ENUM,
          OPTION_ALLOW_NUMBER,
          OPTION_ALLOW_BOOLEAN_OR_UNDEFINED,
          OPTION_ALLOW_ANY_RHS
        ],
      },
      minLength: 0,
      maxLength: 5,
    }],
    type: 'problem'
  },

  create(context): Rule.RuleListener {
    const parserServices = context.sourceCode.parserServices;
    const program = parserServices.program;
    const rawOptions = context.options[0] || ['allow-null-union', 'allow-undefined-union', 'allow-boolean-or-undefined']
    const options = parseOptions(rawOptions, true);
    const checker = program.getTypeChecker() as ts.TypeChecker;

    function walk(sourceFile: ts.SourceFile): void {
      ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
          case ts.SyntaxKind.PrefixUnaryExpression: {
            const {
              operator,
              operand
            } = node as ts.PrefixUnaryExpression;
            if (operator === ts.SyntaxKind.ExclamationToken) {
              checkExpression(operand, node as ts.PrefixUnaryExpression);
            }
            break;
          }

          case ts.SyntaxKind.IfStatement:
          case ts.SyntaxKind.WhileStatement:
          case ts.SyntaxKind.DoStatement: {
            const c = node as ts.IfStatement | ts.WhileStatement | ts.DoStatement;
            // If it's a boolean binary expression, we'll check it when recursing.
            checkExpression(c.expression, c);
            break;
          }

          case ts.SyntaxKind.ConditionalExpression:
            checkExpression((node as ts.ConditionalExpression).condition, node as ts.ConditionalExpression);
            break;

          case ts.SyntaxKind.ForStatement: {
            const {
              condition
            } = node as ts.ForStatement;
            if (condition !== undefined) {
              checkExpression(condition, node as ts.ForStatement);
            }
          }
        }

        return ts.forEachChild(node, cb);
      });

      function checkExpression(node: ts.Expression, location: Location): void {
        const type = checker.getTypeAtLocation(node);
        const failure = getTypeFailure(type, options);
        if (failure !== undefined) {
          if (failure === TypeFailure.AlwaysTruthy &&
            !options.strictNullChecks &&
            (options.allowNullUnion || options.allowUndefinedUnion)) {
            // OK; It might be null/undefined.
            return;
          }
          const originalNode = parserServices.tsNodeToESTreeNodeMap.get(node);
          context.report({
            node: originalNode,
            message: showFailure(location, failure, isUnionType(type), options),
          })
        }
      }
    }

    return {
      'Program': (node: any) => {
        const sourceFile = parserServices.esTreeNodeToTSNodeMap.get(node);
        walk(sourceFile);
      }
    };
  }
};



interface Options {
  strictNullChecks: boolean;
  allowNullUnion: boolean;
  allowUndefinedUnion: boolean;
  allowString: boolean;
  allowEnum: boolean;
  allowNumber: boolean;
  allowMix: boolean;
  allowBooleanOrUndefined: boolean;
  allowAnyRhs: boolean;
}

function parseOptions(ruleArguments: string[], strictNullChecks: boolean): Options {
  return {
    strictNullChecks,
    allowNullUnion: has(OPTION_ALLOW_NULL_UNION),
    allowUndefinedUnion: has(OPTION_ALLOW_UNDEFINED_UNION),
    allowString: has(OPTION_ALLOW_STRING),
    allowEnum: has(OPTION_ALLOW_ENUM),
    allowNumber: has(OPTION_ALLOW_NUMBER),
    allowMix: has(OPTION_ALLOW_MIX),
    allowBooleanOrUndefined: has(OPTION_ALLOW_BOOLEAN_OR_UNDEFINED),
    allowAnyRhs: has(OPTION_ALLOW_ANY_RHS),
  };

  function has(name: string): boolean {
    return ruleArguments.indexOf(name) !== -1;
  }
}

function getTypeFailure(type: ts.Type, options: Options): TypeFailure | undefined {
  if (isUnionType(type)) {
    return handleUnion(type, options);
  }

  const kind = getKind(type);
  const failure = failureForKind(kind, /*isInUnion*/ false, options);
  if (failure !== undefined) {
    return failure;
  }

  switch (triState(kind)) {
    case true:
      // Allow 'any'. Allow 'true' itself, but not any other always-truthy type.
      // tslint:disable-next-line no-bitwise
      return isTypeFlagSet(type, ts.TypeFlags.Any | ts.TypeFlags.BooleanLiteral) ? undefined : TypeFailure.AlwaysTruthy;
    case false:
      // Allow 'false' itself, but not any other always-falsy type
      return isTypeFlagSet(type, ts.TypeFlags.BooleanLiteral) ? undefined : TypeFailure.AlwaysFalsy;
    case undefined:
      return undefined;
  }
}

function isBooleanUndefined(type: ts.UnionType): boolean | undefined {
  let isTruthy = false;
  for (const ty of type.types) {
    if (isTypeFlagSet(ty, ts.TypeFlags.Boolean)) {
      isTruthy = true;
    } else if (isTypeFlagSet(ty, ts.TypeFlags.BooleanLiteral)) {
      isTruthy = isTruthy || (ty as ts.IntrinsicType).intrinsicName === "true";
    } else if (!isTypeFlagSet(ty, ts.TypeFlags.Void | ts.TypeFlags.Undefined)) { // tslint:disable-line:no-bitwise
      return undefined;
    }
  }
  return isTruthy;
}

function handleUnion(type: ts.UnionType, options: Options): TypeFailure | undefined {
  if (options.allowBooleanOrUndefined) {
    switch (isBooleanUndefined(type)) {
      case true:
        return undefined;
      case false:
        return TypeFailure.AlwaysFalsy;
    }
  }

  for (const ty of type.types) {
    const kind = getKind(ty);
    const failure = failureForKind(kind, /*isInUnion*/ true, options);
    if (failure !== undefined) {
      return failure;
    }
  }
  return undefined;
}

/** Fails if a kind of falsiness is not allowed. */
function failureForKind(kind: TypeKind, isInUnion: boolean, options: Options): TypeFailure | undefined {
  switch (kind) {
    case TypeKind.String:
    case TypeKind.FalseStringLiteral:
      return options.allowString ? undefined : TypeFailure.String;
    case TypeKind.Number:
    case TypeKind.FalseNumberLiteral:
      return options.allowNumber ? undefined : TypeFailure.Number;
    case TypeKind.Enum:
      return options.allowEnum ? undefined : TypeFailure.Enum;
    case TypeKind.Promise:
      return TypeFailure.Promise;
    case TypeKind.Null:
      return isInUnion && !options.allowNullUnion ? TypeFailure.Null : undefined;
    case TypeKind.Undefined:
      return isInUnion && !options.allowUndefinedUnion ? TypeFailure.Undefined : undefined;
    default:
      return undefined;
  }
}

export type Location = |
  ts.PrefixUnaryExpression |
  ts.IfStatement |
  ts.WhileStatement |
  ts.DoStatement |
  ts.ForStatement |
  ts.ConditionalExpression |
  ts.BinaryExpression;

export const enum TypeFailure {
  AlwaysTruthy,
  AlwaysFalsy,
  String,
  Number,
  Null,
  Undefined,
  Enum,
  Mixes,
  Promise
}

const enum TypeKind {
  String,
  FalseStringLiteral,
  Number,
  FalseNumberLiteral,
  Boolean,
  FalseBooleanLiteral,
  Null,
  Undefined,
  Enum,
  AlwaysTruthy,
  Promise
}

/** Divides a type into always true, always false, or unknown. */
function triState(kind: TypeKind): boolean | undefined {
  switch (kind) {
    case TypeKind.String:
    case TypeKind.Number:
    case TypeKind.Boolean:
    case TypeKind.Enum:
      return undefined;

    case TypeKind.Null:
    case TypeKind.Undefined:
    case TypeKind.FalseNumberLiteral:
    case TypeKind.FalseStringLiteral:
    case TypeKind.FalseBooleanLiteral:
      return false;

    case TypeKind.AlwaysTruthy:
    case TypeKind.Promise:
      return true;
  }
}

function getKind(type: ts.Type): TypeKind {
  return is(ts.TypeFlags.StringLike) ? TypeKind.String :
    is(ts.TypeFlags.NumberLike) ? TypeKind.Number :
    is(ts.TypeFlags.Boolean) ? TypeKind.Boolean :
    isObject('Promise') ? TypeKind.Promise :
    is(ts.TypeFlags.Null) ? TypeKind.Null :
    is(ts.TypeFlags.Undefined | ts.TypeFlags.Void) ? TypeKind.Undefined // tslint:disable-line:no-bitwise
    :
    is(ts.TypeFlags.EnumLike) ? TypeKind.Enum :
    is(ts.TypeFlags.BooleanLiteral) ?
    ((type as ts.IntrinsicType).intrinsicName === "true" ? TypeKind.AlwaysTruthy : TypeKind.FalseBooleanLiteral) :
    TypeKind.AlwaysTruthy;

  function is(flags: ts.TypeFlags) {
    return isTypeFlagSet(type, flags);
  }

  function isObject(name: string) {
    const symbol = type.getSymbol();
    return (symbol && symbol.getName() === name)
  }
}


function binaryBooleanExpressionKind(node: ts.BinaryExpression): "&&" | "||" | undefined {
  switch (node.operatorToken.kind) {
    case ts.SyntaxKind.AmpersandAmpersandToken:
      return "&&";
    case ts.SyntaxKind.BarBarToken:
      return "||";
    default:
      return undefined;
  }
}

function stringOr(parts: string[]): string {
  switch (parts.length) {
    case 1:
      return parts[0];
    case 2:
      return `${parts[0]} or ${parts[1]}`;
    default:
      let res = "";
      for (let i = 0; i < parts.length - 1; i++) {
        res += `${parts[i]}, `;
      }
      return `${res}or ${parts[parts.length - 1]}`;
  }
}

function isUnionType(type: ts.Type): type is ts.UnionType {
  return isTypeFlagSet(type, ts.TypeFlags.Union) && !isTypeFlagSet(type, ts.TypeFlags.Enum);
}

function showLocation(n: Location): string {
  switch (n.kind) {
    case ts.SyntaxKind.PrefixUnaryExpression:
      return "operand for the '!' operator";
    case ts.SyntaxKind.ConditionalExpression:
      return "condition";
    case ts.SyntaxKind.ForStatement:
      return "'for' condition";
    case ts.SyntaxKind.IfStatement:
      return "'if' condition";
    case ts.SyntaxKind.WhileStatement:
      return "'while' condition";
    case ts.SyntaxKind.DoStatement:
      return "'do-while' condition";
    case ts.SyntaxKind.BinaryExpression:
      return `operand for the '${binaryBooleanExpressionKind(n)}' operator`;
  }
}

function showFailure(location: Location, ty: TypeFailure, unionType: boolean, options: Options): string {
  const expectedTypes = showExpectedTypes(options);
  const expected = expectedTypes.length === 1 ?
    `Only ${expectedTypes[0]}s are allowed` :
    `Allowed types are ${stringOr(expectedTypes)}`;
  const tyFail = showTypeFailure(ty, unionType, options.strictNullChecks);
  return `This type is not allowed in the ${showLocation(location)} because it ${tyFail}. ${expected}.`;
}

function showExpectedTypes(options: Options): string[] {
  const parts = ["boolean"];
  if (options.allowNullUnion) {
    parts.push("null-union");
  }
  if (options.allowUndefinedUnion) {
    parts.push("undefined-union");
  }
  if (options.allowString) {
    parts.push("string");
  }
  if (options.allowEnum) {
    parts.push("enum");
  }
  if (options.allowNumber) {
    parts.push("number");
  }
  if (options.allowBooleanOrUndefined) {
    parts.push("boolean-or-undefined");
  }
  return parts;
}

function showTypeFailure(ty: TypeFailure, unionType: boolean, strictNullChecks: boolean) {
  const is = unionType ? "could be" : "is";
  switch (ty) {
    case TypeFailure.AlwaysTruthy:
      return strictNullChecks ?
        "is always truthy" :
        "is always truthy. It may be null/undefined, but neither " +
        `'${OPTION_ALLOW_NULL_UNION}' nor '${OPTION_ALLOW_UNDEFINED_UNION}' is set`;
    case TypeFailure.AlwaysFalsy:
      return "is always falsy";
    case TypeFailure.String:
      return `${is} a string`;
    case TypeFailure.Number:
      return `${is} a number`;
    case TypeFailure.Null:
      return `${is} null`;
    case TypeFailure.Undefined:
      return `${is} undefined`;
    case TypeFailure.Enum:
      return `${is} an enum`;
    case TypeFailure.Promise:
      return "promise handled as boolean expression";
    case TypeFailure.Mixes:
      return "unions more than one truthy/falsy type";
  }
}

function isTypeFlagSet(obj: any, flag: any) {
  return (obj.flags & flag) !== 0;
}

declare module "typescript" {
  // No other way to distinguish boolean literal true from boolean literal false
  export interface IntrinsicType extends ts.Type {
    intrinsicName: string;
  }
}

export default rule;
