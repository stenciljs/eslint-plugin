import { Rule } from 'eslint';
import { getJSDocComments, stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Ensures slots are documented with JSDoc.',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [],
    type: 'problem',
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();
    const implementedSlots = new Set<string>();

    return {
      ...stencil.rules,
      'ClassDeclaration:exit': (node: any) => {
        if (stencil.isComponent()) {
          const jsDocs = getJSDocComments(node, context.sourceCode);

          const documentedSlots: Set<string> = new Set(
            (jsDocs.length && jsDocs[0].tags.length
              ? jsDocs[0].tags.filter((tag: any) => tag.tagName === "slot")
              : []
            ).map((tag: any) => {
              const c = tag.comment.trim();
              if (!c || c === '-' || c.startsWith('- ')) return '<default>';
              const idx = c.indexOf(' - ');
              return idx === -1 ? c : c.slice(0, idx).trim();
            })
          );

          const missingDocSlots = Array.from(implementedSlots).filter(slot => !documentedSlots.has(slot));
          const nonImplementedSlots = Array.from(documentedSlots).filter(slot => !implementedSlots.has(slot));

          missingDocSlots.forEach(slot => {
            context.report({
              node,
              message: slot === "<default>" ? "The default @slot must be documented." : `The @slot '${slot}' must be documented.`,
            });
          });

          nonImplementedSlots.forEach(slot => {
            context.report({
              node,
              message: slot === "<default>" ? "The default @slot is not implemented." : `The @slot '${slot}' is not implemented.`,
            });
          });
        }

        implementedSlots.clear();
        stencil.rules["ClassDeclaration:exit"](node);
      },

      JSXElement(node: any): void {
        if (node.openingElement.name.name !== "slot") return;

        const nameAttribute = node.openingElement.attributes.find((attribute: any) => attribute.name.name === "name");
        const slotName = nameAttribute && nameAttribute.value ? nameAttribute.value.value : "<default>";
        implementedSlots.add(slotName);
      },
    };
  },
};

export default rule;
