/**
 * @fileoverview ESLint rules specific to Stencil JS projects.
 * @author Tom Chinery <tom.chinery@addtoevent.co.uk>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { stencilComponentContext } from '../utils';
import { JSDOM } from 'jsdom';

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

    const checkName = (node: any) => {
      if (!stencil.isComponent()) {
        return;
      }
      const decoratorName = node.expression.callee.name;
      if (decoratorName === 'Prop' || decoratorName === 'Method') {
        const propName = node.parent.key.name;
        if (isReservedMember(propName)) {
          context.report({
            node: node.parent.key,
            message: `The @${decoratorName} name "${propName} conflicts with a key in the HTMLElement prototype. Please choose a different name.`
          });
        }
        if (propName.startsWith('data-')) {
          context.report({
            node: node.parent.key,
            message: 'Avoid using Global HTML Attributes as Prop names.'
          });
        }
      }
    };
    return {
      ...stencil.rules,
      'PropertyDefinition > Decorator[expression.callee.name=Prop]': checkName,
      'MethodDefinition[kind=method] > Decorator[expression.callee.name=Method]': checkName
    };
  }
};

// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
const GLOBAL_ATTRIBUTES = [
  'about',
  'accessKey',
  'autocapitalize',
  'autofocus',
  'class',
  'contenteditable',
  'contextmenu',
  'dir',
  'draggable',
  'enterkeyhint',
  'hidden',
  'id',
  'inert',
  'inputmode',
  'id',
  'itemid',
  'itemprop',
  'itemref',
  'itemscope',
  'itemtype',
  'lang',
  'nonce',
  'part',
  'popover',
  'role',
  'slot',
  'spellcheck',
  'style',
  'tabindex',
  'title',
  'translate',
  'virtualkeyboardpolicy',
];

const JSX_KEYS = [
  'ref',
  'key'
];

function getHtmlElementProperties(): string[] {
  const { window: win } = new JSDOM();
  const { document: doc } = win;
  const htmlElement = doc.createElement("tester-component"); // creates a custom element base (HTMLElement)
  const relevantInterfaces = [win.HTMLElement, win.Element, win.Node, win.EventTarget];
  const props = new Set<string>();

  let currentInstance = htmlElement;
  while (currentInstance && relevantInterfaces.some(relevantInterface => currentInstance instanceof relevantInterface)) {
    Object.getOwnPropertyNames(currentInstance).forEach((prop: string) => props.add(prop));
    currentInstance = Object.getPrototypeOf(currentInstance);
  }

  return Array.from(props);
}

const RESERVED_PUBLIC_MEMBERS = new Set([
  ...GLOBAL_ATTRIBUTES,
  ...getHtmlElementProperties(),
  ...JSX_KEYS
].map(p => p.toLowerCase()));

function isReservedMember(memberName: string) {
  return RESERVED_PUBLIC_MEMBERS.has(memberName.toLowerCase());
}

export default rule;
