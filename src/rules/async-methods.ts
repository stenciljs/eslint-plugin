import type { Rule } from "eslint";
import ts from "typescript";
import { stencilComponentContext } from "../utils";
import { isThenableType } from "tsutils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "This rule catches Stencil public methods that are not async.",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
    type: "problem",
    fixable: "code",
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();
    const parserServices = context.sourceCode.parserServices;
    if (!parserServices?.esTreeNodeToTSNodeMap || !parserServices?.program) {
      return { ...stencil.rules };
    }
    const typeChecker = parserServices.program.getTypeChecker() as ts.TypeChecker;

    return {
      ...stencil.rules,
      "MethodDefinition > Decorator[expression.callee.name=Method]": (decoratorNode: any) => {
        if (!stencil.isComponent()) {
          return;
        }
        const node = decoratorNode.parent;
        // an async method always returns a Promise, even if its type can't be resolved
        if (node.value.async && !node.value.generator) {
          return;
        }
        const method = parserServices.esTreeNodeToTSNodeMap.get(node);
        const signature = typeChecker.getSignatureFromDeclaration(method);
        const returnType = typeChecker.getReturnTypeOfSignature(signature!);
        if (!isThenableType(typeChecker, method, returnType)) {
          context.report({
            node: node.key,
            message: `External @Method() ${node.key.name}() must return a Promise. Consider prefixing the method with async, such as @Method() async ${node.key.name}().`,
            fix(fixer) {
              // adding `async` is not enough here, these have to be changed by hand
              if (node.value.returnType || node.value.generator || node.kind !== "method") {
                return null;
              }
              // a computed name starts at its opening bracket: `['name']`
              const name = node.computed
                ? context.sourceCode.getTokenBefore(node.key, (token) => token.value === "[")!
                : node.key;
              return fixer.insertTextBefore(name, "async ");
            },
          });
        }
      },
    };
  },
};

export default rule;
