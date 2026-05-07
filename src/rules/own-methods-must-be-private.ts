import type { Rule } from 'eslint';
import {
  hasStencilDecorator,
  isPrivateESTree,
  stencilComponentContext,
  stencilLifecycle,
} from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "This rule catches own class methods marked as public.",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    return {
      ...stencil.rules,
      "MethodDefinition[kind=method]": (node: any) => {
        if (!stencil.isComponent()) {
          return;
        }

        const methodName = node.key.name || node.key.value;
        const isStencilCycle = stencilLifecycle.includes(methodName);

        if (!hasStencilDecorator(node) && !isStencilCycle && !isPrivateESTree(node)) {
          context.report({
            node: node,
            message: `Own class methods cannot be public`,
            fix(fixer) {
              const sourceCode = context.sourceCode;
              const tokens = sourceCode.getTokens(node);
              const publicToken = tokens.find(token => token.value === 'public');

              if (publicToken) {
                return fixer.replaceText(publicToken, 'private');
              } else {
                return fixer.insertTextBefore(node.key, 'private ');
              }
            }
          });
        }
      },
    };
  },
};

export default rule;
