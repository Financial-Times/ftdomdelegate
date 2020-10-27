export default Delegate;
/**
 * DOM event delegator
 *
 * The delegator will listen
 * for events that bubble up
 * to the root node.
 *
 * @constructor
 * @param {Node|string} [root] The root node or a selector string matching the root node
 */
declare function Delegate(root?: Node | string): void;
declare class Delegate {
    /**
     * DOM event delegator
     *
     * The delegator will listen
     * for events that bubble up
     * to the root node.
     *
     * @constructor
     * @param {Node|string} [root] The root node or a selector string matching the root node
     */
    constructor(root?: Node | string);
    /**
     * Maintain a map of listener
     * lists, keyed by event name.
     *
     * @type Object
     */
    listenerMap: any;
    /** @type function() */
    handle: () => any;
    _removedListeners: any[];
    root(root?: Node | string): Delegate;
    /**
     * The root node at which
     * listeners are attached.
     *
     * @type Node
     */
    rootElement: Node;
    captureForType(eventType: string): boolean;
    on(eventType: string, selector: string | undefined, handler: () => any, useCapture?: boolean): Delegate;
    off(eventType?: string, selector?: string, handler?: () => any, useCapture: any): Delegate;
    fire(event: Event, target: Node, listener: any): boolean;
    destroy(): void;
}
