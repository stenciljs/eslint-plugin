import type { Rule } from 'eslint';
import { getDecorator, parseDecorator, stencilComponentContext } from '../utils';

const DEFAULTS = ['stencil', 'stnl', 'st'];

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches usages banned prefix in component tag name.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'string'
        },
        minLength: 1,
        additionalProperties: false
      }
    ],
    type: 'problem'
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
        const [opts] = parseDecorator(component);
        if (!opts || !opts.tag) {
          return;
        }
        const tag = opts.tag;
        const options = context.options[0] || DEFAULTS;
        const match = options.some((t: string) => tag.startsWith(`${t}-`));

        if (match) {
          context.report({
            node: node,
            message: `The component with tag name ${tag} have a banned prefix.`
          });
        }
      }
    };
  }
};

export default rule;
