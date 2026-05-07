import type { Rule } from 'eslint';
import { getDecorator, isPrivateESTree, stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches Stencil Methods marked as private or protected.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem'
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();
    return {
      ...stencil.rules,
      'MethodDefinition[kind=method]': (node: any) => {
        if (stencil.isComponent() && getDecorator(node, 'Method')) {
          if (isPrivateESTree(node)) {
            context.report({
              node: node,
              message: `Class methods decorated with @Method() cannot be private nor protected`
            });
          }
        }
      }
    };
  }
};

export default rule;
