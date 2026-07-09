import type { Rule } from "eslint";
import { stencilComponentContext } from "../utils";

const varsList = new Set<string>();

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "This rule catches Stencil Watch for not defined variables in Prop or State.",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
    type: "suggestion",
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    function getVars(node: any) {
      if (!stencil.isComponent()) {
        return;
      }
      // node is the Decorator, parent is PropertyDefinition/MethodDefinition
      const memberNode = node.parent;
      const varName = memberNode.key?.name || memberNode.key?.value;
      if (varName) {
        varsList.add(varName);
      }
    }

    function checkWatch(node: any) {
      if (!stencil.isComponent()) {
        return;
      }
      // node is the Decorator; the Watch argument is the first arg of the call expression
      const varName = node.expression?.arguments?.[0]?.value;
      if (varName && !varsList.has(varName) && !isReservedAttribute(varName.toLowerCase())) {
        context.report({
          node: node,
          message: `Watch decorator @Watch("${varName}") is not matching with any @Prop() or @State()`,
        });
      }
    }

    return {
      ClassDeclaration: stencil.rules.ClassDeclaration,
      "PropertyDefinition > Decorator[expression.callee.name=Prop]": getVars,
      "MethodDefinition[kind=get] > Decorator[expression.callee.name=Prop]": getVars,
      "MethodDefinition[kind=set] > Decorator[expression.callee.name=Prop]": getVars,
      "PropertyDefinition > Decorator[expression.callee.name=State]": getVars,
      "MethodDefinition[kind=method] > Decorator[expression.callee.name=Watch]": checkWatch,
      "ClassDeclaration:exit": (node: any) => {
        if (!stencil.isComponent()) {
          return;
        }
        stencil.rules["ClassDeclaration:exit"](node);
        varsList.clear();
      },
    };
  },
};

// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
const GLOBAL_ATTRIBUTES = [
  "about",
  "accessKey",
  "autocapitalize",
  "autofocus",
  "class",
  "contenteditable",
  "contextmenu",
  "dir",
  "draggable",
  "enterkeyhint",
  "hidden",
  "id",
  "inert",
  "inputmode",
  "id",
  "itemid",
  "itemprop",
  "itemref",
  "itemscope",
  "itemtype",
  "lang",
  "nonce",
  "part",
  "popover",
  "role",
  "slot",
  "spellcheck",
  "style",
  "tabindex",
  "title",
  "translate",
  "virtualkeyboardpolicy",
];

const RESERVED_PUBLIC_ATTRIBUTES = new Set([...GLOBAL_ATTRIBUTES].map((p) => p.toLowerCase()));

function isReservedAttribute(attributeName: string) {
  return RESERVED_PUBLIC_ATTRIBUTES.has(attributeName.toLowerCase());
}

export default rule;
