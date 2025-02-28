import type { Rule } from 'eslint';
import ts from 'typescript';
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

    const parserServices = context.sourceCode.parserServices;
    const opts = context.options[0] || {};
    const options = { ...DEFAULTS, ...opts };

    function checkStyle(decorator: any) {
      const decName = decoratorName(decorator);
      const config = options[decName.toLowerCase()];
      if (!config || config === 'ignore') {
        return;
      }
      const decoratorNode = parserServices.esTreeNodeToTSNodeMap.get(decorator) as ts.Node;
      const decoratorText = decoratorNode.getText()
        .replace('(', '\\(')
        .replace(')', '\\)');
      const text = decoratorNode.parent.getText();
      const separator = config === 'multiline' ? '\\r?\\n' : ' ';
      const regExp = new RegExp(`${decoratorText}${separator}`, 'i');
      if (!regExp.test(text)) {
        const node = decorator.parent;
        context.report({
          node: node,
          message: `The @${decName} decorator can only be applied as ${config}.`,
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
