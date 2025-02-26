import type { Rule } from 'eslint';
import ts from 'typescript';
import { getDecorator, parseDecorator, stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches Stencil Props marked as non readonly.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'layout',
    fixable: 'code'
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    const parserServices = context.sourceCode.parserServices;
    return {
      ...stencil.rules,
      'PropertyDefinition': (node: any) => {
        const propDecorator = getDecorator(node, 'Prop');
        if (stencil.isComponent() && propDecorator) {
          const [opts] = parseDecorator(propDecorator);
          if (opts && opts.mutable === true) {
            return;
          }

          const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node) as ts.Node;
          const hasReadonly = !!(
              ts.canHaveModifiers(originalNode) &&
              ts.getModifiers(originalNode)?.some(m => m.kind === ts.SyntaxKind.ReadonlyKeyword)
          );
          if (!hasReadonly) {
            context.report({
              node: node.key,
              message: `Class properties decorated with @Prop() should be readonly`,
              fix(fixer) {
                return fixer.insertTextBefore(node.key, 'readonly ');
              }
            });
          }
        }
      }
    };
  }
};

export default rule;
