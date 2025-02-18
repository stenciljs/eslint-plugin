import { Rule } from 'eslint';
import { stencilComponentContext } from '../utils';

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
    const { parserServices } = context;
    const implementedSlots = new Set<string>();

    return {
      ...stencil.rules,
      'ClassDeclaration:exit': (node: any) => {
        if (stencil.isComponent()) {
          const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
          const jsDoc = originalNode.jsDoc;
          const documentedSlots: Set<string> = new Set(jsDoc[0].tags
            .filter((tag: any) => tag.tagName.escapedText === "slot")
            .map((tag: any) => tag.comment.split("-")[0].trim() || "<default>")
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
