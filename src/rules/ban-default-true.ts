import type { Rule } from 'eslint';
import { getDecorator, stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches Stencil Props defaulting to true.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem',
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    return {
      ...stencil.rules,
      'PropertyDefinition': (node: any) => {
        const propDecorator = getDecorator(node, 'Prop');
        if (!(stencil.isComponent() && propDecorator)) {
          return;
        }

        if (node.value?.value === true) {
          context.report({
            node: node,
            message: `Boolean properties decorated with @Prop() should default to false`
          });
        }
      }
    };
  }
};

export default rule;
