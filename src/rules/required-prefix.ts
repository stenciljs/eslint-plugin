import type { Rule } from 'eslint';
import { getDecorator, parseDecorator, stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches required prefix in component tag name.',
      category: 'Possible Errors',
      recommended: false
    },
    schema: [
      {
        type: 'array',
        minLength: 1,
        additionalProperties: false
      }
    ],
    type: 'layout'
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    return {
      ...stencil.rules,
      'ClassDeclaration': (node: any) => {
        const component = getDecorator(node, 'Component');
        if (!component) {
          return;
        }
        const [{ tag }] = parseDecorator(component);
        const options = context.options[0];
        const match = options.some((t: string) => tag.startsWith(t));

        if (!match) {
          context.report({
            node: node,
            message: `The component with tagName ${tag} have not a valid prefix.`
          });
        }
      }
    };
  }
};

export default rule;
