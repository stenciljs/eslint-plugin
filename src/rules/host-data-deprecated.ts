/**
 * @fileoverview ESLint rules specific to Stencil JS projects.
 * @author Tom Chinery <tom.chinery@addtoevent.co.uk>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches usage of hostData method.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem'
  },

  create(context): Rule.RuleListener {

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    const stencil = stencilComponentContext();
    return {
      ...stencil.rules,
      'MethodDefinition[key.name=hostData]': (node: any) => {
        if (stencil.isComponent()) {
          context.report({
            node: node.key,
            message: `hostData() is deprecated and <Host> should be used in the render function instead.`
          });
        }
      }
    };
  }
};

export default rule;
