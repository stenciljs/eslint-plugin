import type { Rule } from "eslint";
import {
  getDecoratorList,
  isPrivate,
  stencilComponentContext,
  stencilDecorators,
} from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "This rule catches own class attributes marked as public.",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    const parserServices = context.sourceCode.parserServices;
    return {
      ...stencil.rules,
      PropertyDefinition: (node: any) => {
        if (!stencil.isComponent()) {
          return;
        }

        const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const decorators = getDecoratorList(originalNode);

        const stencilDecorator =
          decorators &&
          decorators.some((dec: any) =>
            stencilDecorators.includes(dec.expression.expression.escapedText)
          );

        if (!stencilDecorator && !isPrivate(originalNode)) {
          context.report({
            node: node,
            message: `Own class properties cannot be public`,
            fix(fixer) {
              const sourceCode = context.getSourceCode();
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
