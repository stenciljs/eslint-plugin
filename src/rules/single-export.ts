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
    const hasTypeChecker = parserServices?.esTreeNodeToTSNodeMap && parserServices?.program;

    if (hasTypeChecker) {
      // Type-checker path: uses symbol table for precise export detection
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

    // ESTree fallback: find exported value declarations that aren't the @Component class
    const componentClassNames: Set<string> = new Set();
    const exportedValues: { node: any; name: string }[] = [];

    return {
      'ClassDeclaration': (node: any) => {
        const component = getDecorator(node, 'Component');
        if (component && node.id) {
          componentClassNames.add(node.id.name);
        }
      },
      'ExportNamedDeclaration': (node: any) => {
        // Skip type-only exports
        if (node.exportKind === 'type') {
          return;
        }
        if (node.declaration) {
          if (node.declaration.type === 'ClassDeclaration' && node.declaration.id) {
            exportedValues.push({ node: node.declaration.id, name: node.declaration.id.name });
          } else if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
            exportedValues.push({ node: node.declaration.id, name: node.declaration.id.name });
          } else if (node.declaration.type === 'VariableDeclaration') {
            for (const decl of node.declaration.declarations) {
              if (decl.id?.name) {
                exportedValues.push({ node: decl.id, name: decl.id.name });
              }
            }
          } else if (node.declaration.type === 'TSInterfaceDeclaration' || node.declaration.type === 'TSTypeAliasDeclaration') {
            // Type-only, skip
            return;
          }
        }
        if (node.specifiers) {
          for (const spec of node.specifiers) {
            if (spec.exportKind === 'type') continue;
            if (spec.exported?.name) {
              exportedValues.push({ node: spec.exported, name: spec.exported.name });
            }
          }
        }
      },
      'ExportDefaultDeclaration': (node: any) => {
        if (node.declaration?.id?.name) {
          exportedValues.push({ node: node.declaration.id, name: node.declaration.id.name });
        } else {
          exportedValues.push({ node: node, name: 'default' });
        }
      },
      'Program:exit': () => {
        if (componentClassNames.size === 0) {
          return;
        }
        // Mimic the type-checker behavior: for each component, report all other exports
        for (const componentName of componentClassNames) {
          for (const exported of exportedValues) {
            if (exported.name !== componentName) {
              context.report({
                node: exported.node,
                message: `To allow efficient bundling, modules using @Component() can only have a single export which is the component class itself. Any other exports should be moved to a separate file. For further information check out: https://stenciljs.com/docs/module-bundling`
              });
            }
          }
        }
      }
    };
  }
};

export default rule;
