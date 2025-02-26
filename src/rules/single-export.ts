import type { Rule } from 'eslint';
import ts from 'typescript';
import { getDecorator } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches modules that expose more than just the Stencil Component itself.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem'
  },

  create(context): Rule.RuleListener {
    const parserServices = context.sourceCode.parserServices;
    const typeChecker = parserServices.program.getTypeChecker() as ts.TypeChecker;
    return {
      'ClassDeclaration': (node: any) => {
        const component = getDecorator(node, 'Component');
        if (component) {
          const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
          const nonTypeExports = typeChecker.getExportsOfModule(
              typeChecker.getSymbolAtLocation(originalNode.getSourceFile())!)
              .filter(symbol => (symbol.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) === 0)
              .filter(symbol => symbol.name !== originalNode.name.text);

          nonTypeExports.forEach(symbol => {
            const errorNode = (symbol.valueDeclaration)
                ? parserServices.tsNodeToESTreeNodeMap.get(symbol.valueDeclaration).id
                : parserServices.tsNodeToESTreeNodeMap.get(symbol.declarations?.[0]);

            context.report({
              node: errorNode,
              message: `To allow efficient bundling, modules using @Component() can only have a single export which is the component class itself. Any other exports should be moved to a separate file. For further information check out: https://stenciljs.com/docs/module-bundling`
            });
          });
        }
      }
    };
  }
};

export default rule;
