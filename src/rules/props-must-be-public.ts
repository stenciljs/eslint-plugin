import type { Rule } from 'eslint';
import ts from 'typescript';
import { getDecorator, isPrivate, stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches Stencil Props marked as private or protected.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem',
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    const parserServices = context.sourceCode.parserServices;
    return {
      ...stencil.rules,
      'PropertyDefinition': (node: any) => {
        if (stencil.isComponent() && getDecorator(node, 'Prop')) {
          const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node) as ts.Node;
          if (isPrivate(originalNode)) {
            context.report({
              node: node,
              message: `Class properties decorated with @Prop() cannot be private nor protected`
            });
          }
        }
      }
    };
  }
};

export default rule;
