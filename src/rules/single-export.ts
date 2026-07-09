import type { Rule } from "eslint";
import ts from "typescript";
import { getDecorator } from "../utils";

const MESSAGE = `To allow efficient bundling, modules using @Component() can only have a single export which is the component class itself. Any other exports should be moved to a separate file. For further information check out: https://stenciljs.com/docs/module-bundling`;

const TYPE_ONLY_DECLARATIONS = new Set(["TSInterfaceDeclaration", "TSTypeAliasDeclaration"]);

interface ExportedItem {
  name?: string;
  node: any;
}

/** Finds every top-level, @Component()-decorated class -- exported or not. */
function findComponentClasses(body: any[]): any[] {
  const found: any[] = [];
  for (const node of body) {
    const candidate =
      node.type === "ClassDeclaration"
        ? node
        : node.type === "ExportNamedDeclaration" || node.type === "ExportDefaultDeclaration"
          ? node.declaration
          : undefined;
    if (candidate?.type === "ClassDeclaration" && getDecorator(candidate, "Component")) {
      found.push(candidate);
    }
  }
  return found;
}

/**
 * Local names bound to type-only declarations/imports at the top level of the module.
 * Used as a fallback for resolving bare `export { X }` specifiers when no type checker
 * is available -- with a checker, `isSpecifierTypeOnly` resolves this precisely instead.
 */
function collectTypeOnlyNames(body: any[]): Set<string> {
  const names = new Set<string>();
  for (const node of body) {
    if (TYPE_ONLY_DECLARATIONS.has(node.type)) {
      names.add(node.id.name);
    } else if (node.type === "ImportDeclaration") {
      for (const specifier of node.specifiers) {
        if (
          node.importKind === "type" ||
          (specifier.type === "ImportSpecifier" && specifier.importKind === "type")
        ) {
          names.add(specifier.local.name);
        }
      }
    }
  }
  return names;
}

/**
 * `export { X }` resolves to an alias symbol pointing at X's declaration, not a symbol
 * with X's own flags -- has to be resolved through the alias to see whether X is a type.
 */
function isTypeOnlySymbol(symbol: ts.Symbol, typeChecker: ts.TypeChecker): boolean {
  const resolved =
    (symbol.flags & ts.SymbolFlags.Alias) !== 0 ? typeChecker.getAliasedSymbol(symbol) : symbol;
  return (resolved.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) !== 0;
}

/**
 * Resolves whether a bare `export { X }` specifier is bound to a type. Prefers the type
 * checker when available -- `getSymbolAtLocation` on the specifier's local identifier is
 * always safe because that identifier lives in the file being linted, so this never runs
 * into the "declaration lives in another file" problem that made a symbol-first approach
 * (walking `getExportsOfModule` results back to their declarations) unreliable for
 * re-exports. Falls back to the same-file syntactic heuristic when no checker is present.
 */
function isSpecifierTypeOnly(
  specifier: any,
  typeOnlyNames: Set<string>,
  typeChecker: ts.TypeChecker | undefined,
  parserServices: any,
): boolean {
  if (typeChecker && parserServices) {
    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(specifier.local);
    const symbol = tsNode && typeChecker.getSymbolAtLocation(tsNode);
    if (symbol) {
      return isTypeOnlySymbol(symbol, typeChecker);
    }
  }
  return typeOnlyNames.has(specifier.local.name);
}

function collectExportedItems(
  body: any[],
  typeOnlyNames: Set<string>,
  typeChecker: ts.TypeChecker | undefined,
  parserServices: any,
): ExportedItem[] {
  const items: ExportedItem[] = [];

  for (const node of body) {
    if (node.type === "ExportNamedDeclaration") {
      if (node.exportKind === "type") {
        continue;
      }
      if (node.source) {
        // re-export from another module (`export { x } from './y'`) -- always a violation;
        // resolving the individual re-exported bindings isn't worth the cross-module reach
        if (node.specifiers.length > 0) {
          items.push({ node });
        }
        continue;
      }
      if (node.declaration) {
        if (TYPE_ONLY_DECLARATIONS.has(node.declaration.type)) {
          continue;
        }
        if (node.declaration.type === "VariableDeclaration") {
          for (const declarator of node.declaration.declarations) {
            const isIdentifier = declarator.id.type === "Identifier";
            items.push({
              name: isIdentifier ? declarator.id.name : undefined,
              node: isIdentifier ? declarator.id : declarator,
            });
          }
        } else {
          items.push({ name: node.declaration.id?.name, node: node.declaration });
        }
      } else {
        for (const specifier of node.specifiers) {
          if (
            specifier.exportKind === "type" ||
            isSpecifierTypeOnly(specifier, typeOnlyNames, typeChecker, parserServices)
          ) {
            continue;
          }
          items.push({ name: specifier.local.name, node: specifier });
        }
      }
    } else if (node.type === "ExportDefaultDeclaration") {
      if (TYPE_ONLY_DECLARATIONS.has(node.declaration.type)) {
        continue;
      }
      items.push({
        name:
          node.declaration.type === "Identifier"
            ? node.declaration.name
            : node.declaration.id?.name,
        node: node.declaration,
      });
    } else if (node.type === "ExportAllDeclaration") {
      if (node.exportKind === "type") {
        continue;
      }
      items.push({ node });
    }
  }

  return items;
}

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        "This rule catches modules that expose more than just the Stencil Component itself.",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
    type: "problem",
  },

  create(context): Rule.RuleListener {
    const parserServices = context.sourceCode.parserServices;
    const typeChecker =
      parserServices?.esTreeNodeToTSNodeMap && parserServices?.program
        ? (parserServices.program.getTypeChecker() as ts.TypeChecker)
        : undefined;

    return {
      Program: (program: any) => {
        const body = program.body;
        const componentClasses = findComponentClasses(body);
        if (componentClasses.length === 0) {
          return;
        }

        const typeOnlyNames = collectTypeOnlyNames(body);
        const exportedItems = collectExportedItems(
          body,
          typeOnlyNames,
          typeChecker,
          parserServices,
        );

        for (const component of componentClasses) {
          for (const item of exportedItems) {
            if (item.node === component || (item.name && item.name === component.id?.name)) {
              continue;
            }
            context.report({ node: item.node, message: MESSAGE });
          }
        }
      },
    };
  },
};

export default rule;
