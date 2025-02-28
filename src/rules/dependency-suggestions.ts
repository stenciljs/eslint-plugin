import type { Rule } from 'eslint';
import ts from 'typescript';
import { stencilComponentContext } from '../utils';
import * as tsutils from 'tsutils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule can provide suggestions about dependencies in stencil apps',
      recommended: true
    },
    schema: [],
    type: 'suggestion',
  },

  create(context): Rule.RuleListener {
    return {
      'ImportDeclaration': (node: any) => {
        const importName = node.source.value;
        const message = SUGGESTIONS[importName];
        if (message) {
          context.report({
            node,
            message
          });
        }
      }
    };
  }
};

const SUGGESTIONS: {[importName: string]: string} = {
  'classnames': `Stencil can already render conditional classes:
  <div class={{disabled: condition}}>`,
  'lodash': `"lodash" will bloat your build, use "lodash-es" instead: https://www.npmjs.com/package/lodash-es`,
  'moment': `"moment" will bloat your build, use "dayjs", "date-fns" or other modern lightweight alternaitve`,
  'core-js': `Stencil already include the core-js polyfills only when needed`,
}

export default rule;
