/**
 * @fileoverview ESLint rules specific to Stencil JS projects.
 * @author Tom Chinery <tom.chinery@addtoevent.co.uk>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
import ts from 'typescript';
import type { Rule } from 'eslint';
import { stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches Stencil Prop names that share names of Global HTML Attributes.',
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
    const parserServices = context.sourceCode.parserServices;
    const typeChecker = parserServices.program.getTypeChecker() as ts.TypeChecker;

    return {
      ...stencil.rules,
      'MethodDefinition[kind=method][key.name=render] ReturnStatement': (node: any) => {
        if (!stencil.isComponent()) {
          return;
        }
        const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node.argument) as ts.MethodDeclaration;
        const type = typeChecker.getTypeAtLocation(originalNode);
        if (type && type.symbol && type.symbol.escapedName === 'Array') {
          context.report({
            node: node,
            message: `Avoid returning an array in the render() function, use <Host> instead.`
          });
        }
      }
    };
  }
};

export default rule;
