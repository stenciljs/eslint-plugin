import type { Rule } from 'eslint';
import { decoratorName, getDecorator, stencilComponentContext, stencilDecorators } from '../utils';

type DecoratorsStyleOptionsEnum = 'inline' | 'multiline' | 'ignore';

interface DecoratorsStyleOptions {
  prop?: DecoratorsStyleOptionsEnum;
  state?: DecoratorsStyleOptionsEnum;
  element?: DecoratorsStyleOptionsEnum;
  event?: DecoratorsStyleOptionsEnum;
  method?: DecoratorsStyleOptionsEnum;
  watch?: DecoratorsStyleOptionsEnum;
  listen?: DecoratorsStyleOptionsEnum;
}

const ENUMERATE = ['inline', 'multiline', 'ignore'];
const DEFAULTS: DecoratorsStyleOptions = {
  prop: 'ignore',
  state: 'ignore',
  element: 'ignore',
  event: 'ignore',
  method: 'ignore',
  watch: 'ignore',
  listen: 'ignore'
};
const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches Stencil Decorators not used in consistent style.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [
      {
        type: 'object',
        properties: {
          prop: {
            type: 'string',
            enum: ENUMERATE
          },
          state: {
            type: 'string',
            enum: ENUMERATE
          },
          element: {
            type: 'string',
            enum: ENUMERATE
          },
          event: {
            type: 'string',
            enum: ENUMERATE
          },
          method: {
            type: 'string',
            enum: ENUMERATE
          },
          watch: {
            type: 'string',
            enum: ENUMERATE
          },
          listen: {
            type: 'string',
            enum: ENUMERATE
          }
        }
      }],
    type: 'layout'
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    const opts = context.options[0] || {};
    const options = { ...DEFAULTS, ...opts };

    function checkStyle(decorator: any) {
      const decName = decoratorName(decorator);
      const config = options[decName.toLowerCase()];
      if (!config || config === 'ignore') {
        return;
      }

      const node = decorator.parent;
      const decoratorEndLine = decorator.loc.end.line;
      const memberStartLine = node.key.loc.start.line;
      const isOnSameLineAsMember = decoratorEndLine === memberStartLine;

      if (config === 'multiline') {
        // For multiline: the next element (next decorator or member) must start on a different line.
        // Use all decorators on the node, not just filtered Stencil ones, so non-Stencil
        // decorators on the same line are correctly detected as adjacency violations.
        const allDecorators: any[] = node.decorators || [];
        const indexInAll = allDecorators.indexOf(decorator);
        const nextDecorator = indexInAll >= 0 ? allDecorators[indexInAll + 1] : undefined;
        const nextStartLine = nextDecorator ? nextDecorator.loc.start.line : memberStartLine;
        if (decoratorEndLine === nextStartLine) {
          context.report({
            node: node,
            message: `The @${decName} decorator can only be applied as multiline.`,
          });
        }
      } else if (config === 'inline' && !isOnSameLineAsMember) {
        context.report({
          node: node,
          message: `The @${decName} decorator can only be applied as inline.`,
        });
      }
    }

    function getStyle(node: any) {
      if (!stencil.isComponent() || !options || !Object.keys(options).length) {
        return;
      }
      const decorators: any[] = getDecorator(node);
      decorators.filter((dec) => stencilDecorators.includes(decoratorName(dec))).forEach(checkStyle);
    }

    return {
      ...stencil.rules,
      'PropertyDefinition': getStyle,
      'MethodDefinition[kind=method]': getStyle
    };
  }
};

export default rule;
