// Ported from DefinitelyTyped

declare module 'node-xmpp-client' {
  declare export class Client {
    connection: Connection;

    Stanza: Stanza;
    constructor(options: XmppOptions): this;
    connect(): void;
    disconnect(): void;
    on(event: string, c: (e: any, d: any) => any): void;
    send(stanza: any): void;
  }

  declare export class Connection extends events$EventEmitter {
    constructor(opts?: any): this;
    socket: net$Socket;
  }

  declare export class Stanza extends Element {
    constructor(name: string, attr: any): this;
    from: string;
    to: string;
    id: string;
    type: string;
  }

  declare export class Element {
    name: string;
    parent: Element;
    children: Element[];
    attrs: any;

    constructor(name: string, attrs?: any): this;

    /**
     * if (element.is('message', 'jabber:client')) ...
     **/
    is(name: string, xmlns?: any): boolean;

    /**
     * without prefix.
     */
    getName(): string;

    /**
     * retrieves the namespace of the current element, upwards recursively
     **/
    getNS(): any;

    /**
     * find the namespace to the given prefix, upwards recursively
     **/
    findNS(prefix: string): any;

    /**
     * Recursiverly gets all xmlns defined, in the form of {url:prefix}
     **/
    getXmlns(): any;

    setAttrs(attrs: any): void;

    /**
     * xmlns can be null, returns the matching attribute.
     **/
    getAttr(name: string, xmlns?: any): any;

    /**
     * xmlns can be null
     **/
    getChild(name: string, xmlns?: any): Element;

    /**
     * xmlns can be null
     **/
    getChildren(name: string, xmlns?: any): Element[];

    /**
     * xmlns and recursive can be null
     **/
    getChildByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element;


    /**
     * xmlns and recursive can be null
     **/
    getChildrenByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element[];

    getText(): string;

    getChildText(name: string, xmlns: any): string;

    /**
     * Return all direct descendents that are Elements.
     * This differs from `getChildren` in that it will exclude text nodes,
     * processing instructions, etc.
     */
    getChildElements(): Element[];

    /** returns uppermost parent */
    root(): Element;

    tree(): Element;

    /** just parent or itself */
    up(): Element;

    /** create child node and return it */
    c(name: string, attrs?: any): Element;

    /** add text node and return element */
    t(text: string): Element;

    /**
     * Either:
     *   el.remove(childEl)
     *   el.remove('author', 'urn:...')
     */
    remove(el: Element, xmlns?: any): Element;

    clone(): Element;

    text(val: string): string;

    attr(attr: any, val: any): any;

    toString(): string;

    toJSON(): any;

    write(writer: any): void;

    nameEquals(el: Element): boolean;

    attrsEquals(el: Element): boolean;

    childrenEquals(el: Element): boolean;

    equals(el: Element): boolean;
  }

  declare export interface XmppOptions {
    jid: string,
    password: string,
    host?: string,
    port?: number,
    reconnect?: boolean,
    autostart?: boolean,
    register?: boolean,
    legacySSL?: boolean,
    credentials?: any,
    actAs?: string,
    disallowTLS?: boolean,
    preferred?: string,
    bosh?: Bosh
  }

  declare export interface Bosh {
    url?: string,
    prebind(error: any, data: any): void
  }

  /**
   * JSX compatible API, use this function as pragma
   * https://facebook.github.io/jsx/
     Returns a Stanza if name is presence, message or iq an ltx Element otherwise.
   * @param name name of the element
   * @param attrs attribute key/value pairs
  */
  declare export function createStanza(name: string, attrs?: any): Element;

  declare export class IQ mixins Stanza {
    constructor(attrs?: any): this;
  }

  declare export class Message mixins Stanza {
    constructor(attrs?: any): this;
  }

  declare export class Presence mixins Stanza {
    constructor(attrs?: any): this;
  }

  declare export class JID {
    local: string;
    domain: string;
    resource: string;
    constructor(local: string, domain?: string, resource?: string): this;
    parseJID(jid: string): void;
    toString(unescape?: any): string;

    /**
     * Convenience method to distinguish users
     */
    bare(): JID;

    /**
     * Comparison function
     */
    equals(other: JID): boolean;

    /**
     * http://xmpp.org/rfcs/rfc6122.html#addressing-localpart
     */
    setLocal(local: string, escape?: any): void;
    getLocal(unescape?: any): string;

    /**
     * http://xmpp.org/rfcs/rfc6122.html#addressing-domain
     */
    setDomain(value: string): void;
    getDomain(): string;

    /**
     * http://xmpp.org/rfcs/rfc6122.html#addressing-resourcepart
     */
    setResource(value: string): void;
    getResource(): string;
  }
}
