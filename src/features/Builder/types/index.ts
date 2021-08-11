import * as T from "io-ts";

// The following types describe the configuration objects used in
// the node-editor.

/**
 * The NodeConfig describes a certain type of preconfigured node. This is used to share the configuration of a node type across many uses in the state.
 */
export type nodeConfig = {
  /**
   * The type of this NodeType. Basically the name of the NodeType.
   */
  type: string;
  /**
   * The label is the name given to the node in the UI.
   */
  label: string;
  /**
   * The precconfigured inputPorts of a NodeType.
   */
  inputPorts?: portConfig[];
  /**
   * The precconfigured outputPorts of a NodeType.
   */
  outputPorts?: portConfig[];
  /**
   * A root Node is an entry point into the tree.
   */
  root?: boolean;
  /**
   * Needs to be true for Nodes of this type to be **addable** in the node-editor.
   */
  addable?: boolean;
  /**
   * Needs to be true for Nodes of this type to be **deletable** in the node-editor.
   */
  deletable?: boolean;
  /** A human readable description of this NodeType. */
  description?: string;
  /**
   * Ranks a NodeType to make them sortable based on their importance.
   */
  sortPriority?: number;
  color?: string;
  width?: number;
  height?: number;
};

/**
 * The NodeTypes is an object indexed by the name of the node types. Each key has a NodeConfig assosciated.
 */
export type nodeTypes = Record<string, nodeConfig>;

/**
 * Similar to a NodeConfig is a PortConfig used to preconfigure a certain type of port. This way a port type can be shared across many uses by its name.
 */
export type portConfig = {
  /**
   * The type of this PortType. Basically the name of this PortType.
   */
  type: string;
  /**
   * The human readable label of this PortType.
   */
  label: string;
  name: string;
  /**
   * The color of this PortType.
   */
  color: string;
  /**
   * By default Ports only accept Connections of their own type. The accepted Connections can be extended by providing other PortTypes type properties.
   */
  acceptTypes?: string[];
};

/**
 * The PortTypes is an object indexed by the name of the port types. Each key has a PortConfig associated with it.
 */
export type portTypes = Record<string, portConfig>;

//------------------------------------------------------------------------------

//The following types describe the objects used as part of the node-editors state.

/**
 * The position of nodes is tracked as x and y coordinates.
 */
export type coordinates = [number, number];

/**
 * A Node is the main type of element in the node-editor. The properties of a node are  focused on information unique to each Node in the Editor even if the type of Node is used more than once. The shared configuration of a Node are part of the NodeConfig which is associated via the type property.
 */
export type node = {
  id: string;
  coordinates: coordinates;
  type: string;
  name: string;
};

/**
 * The Nodes are an object indexed by a unique string. Each key has a Node assosciated.
 */
export type nodes = Record<string, node>;

/**
 * A Tuple of coordinates to describe start and end points of something.
 */
export type connectionCoordinates = [coordinates, coordinates];

/**
 * The information associated with an individual connection.
 */
export type connection = string;

/**
 * The Object holding all the connections. Each property is the nodeId of the originating node. Each associated value is an array of all the connections connected to this node.
 */
export type connections = Record<string, connection[]>;

/**
 * Describes the data used to communicate necessary information about a node to connection calculations.
 */
export type nodePositionalData = {
  coordinates: coordinates;
  width: number;
  height: number;
};

// ------------------------------------------------------------------
// Runtime Types

// TreeConfig Types
// ------------------------------------------------------------------

const PortConfig = T.type({
  type: T.string,
});

const NodeConfig = T.type({
  type: T.string,
  label: T.string,
  description: T.string,
  inputPorts: T.array(PortConfig),
  outputPorts: T.array(PortConfig),
});

const PortTypes = T.record(T.string, PortConfig);
const NodeTypes = T.record(T.string, NodeConfig);

const TreeConfig = T.type({
  nodeTypes: NodeTypes,
  portTypes: PortTypes,
});

// TreeState Types
// ------------------------------------------------------------------

const ElementData = T.type({
  label: T.string,
});

const Coordinates = T.type({
  x: T.number,
  y: T.number,
});

const NodeState = T.intersection([
  T.type({
    id: T.string,
    position: Coordinates,
    type: T.string,
  }),
  T.partial({
    data: ElementData,
    isHidden: T.boolean,
    draggable: T.boolean,
    selectable: T.boolean,
    connectable: T.boolean,
  }),
]);

const EdgeState = T.intersection([
  T.type({
    id: T.string,
    source: T.string,
    target: T.string,
  }),
  T.partial({
    type: T.string,
    label: T.string,
    animated: T.boolean,
    isHidden: T.boolean,
    data: ElementData,
  }),
]);

const Elements = T.array(T.union([NodeState, EdgeState]));

const TreeState = T.type({ treeName: T.string, elements: Elements });

/**
 * The main Type for a complete Tree.
 */
export const Tree = T.type({
  config: TreeConfig,
  state: TreeState,
});

export type TNodeConfig = T.TypeOf<typeof NodeConfig>;
export type TNodeTypes = T.TypeOf<typeof NodeTypes>;
export type TElementData = T.TypeOf<typeof ElementData>;
export type TEdge = T.TypeOf<typeof EdgeState>;
export type TNode = T.TypeOf<typeof NodeState>;
export type TTree = T.TypeOf<typeof Tree>;
export type TElements = T.TypeOf<typeof Elements>;
