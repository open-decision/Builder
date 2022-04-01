import * as Tree from "../Tree/Tree";
import * as Edge from "../Edge/Edge";
import * as Node from "../Node/Node";
import * as Relation from "../Relation/Relation";

import { z } from "zod";
import { pipe, filter, map, reduce, uniq, merge, groupBy } from "remeda";
import { createAdjacencyList, depthFirstSearch } from "./utils";
import { DeepPartial } from "utility-types";

export const Type = z.object({
  nodes: Node.Array.optional(),
  edges: Edge.Array.optional(),
  startNode: z.string().optional(),
});

// ------------------------------------------------------------------
// Methods

export function createTreeMethods(tree: Tree.TTree) {
  // ------------------------------------------------------------------
  // Tree
  function updateStartNode(startNode: string) {
    tree.startNode = startNode;
  }

  // ------------------------------------------------------------------
  // Nodes

  function getNode(nodeId: string) {
    return tree.nodes?.find((node) => node.id === nodeId);
  }

  function getRelation(nodeId: string, relationId: string) {
    return getNode(nodeId)?.data.relations.find(
      (relation) => relation.id === relationId
    );
  }

  function addNode(node: Parameters<typeof Node.create>[0]) {
    const newNode = Node.create(node);

    if (!tree.nodes) tree.nodes = [];

    tree.nodes?.push(newNode);
    if (!tree.startNode) tree.startNode = newNode.id;

    return newNode;
  }

  function updateNodeName(nodeId: string, name: string) {
    const node = getNode(nodeId);
    if (!node) return;

    node.data.name = name;
  }

  function updateNodePosition(nodeId: string, position: Node.TCoordinates) {
    const node = getNode(nodeId);
    if (!node) return;

    node.position.x = position.x;
    node.position.y = position.y;
  }

  function updateNodeContent(
    nodeId: string,
    content: Node.TNodeData["content"]
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.data.content = content;
  }

  function updateNodeRelations(
    nodeId: string,
    relations: Node.TNodeData["relations"]
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.data.relations = relations;
  }

  function deleteNodes(ids: string[]) {
    const nodes = tree.nodes?.filter((node) => !ids.includes(node.id));
    const edges = tree.edges?.filter(
      (edge) => !ids.includes(edge.source || edge.target)
    );

    tree.nodes = nodes;
    tree.edges = edges;
  }

  function addAssociatedNode(
    nodeId: string,
    newNodeData: Parameters<typeof Node.createNewAssociatedNode>[1],
    edgeId: string
  ) {
    const node = getNode(nodeId);

    const newNode = !node
      ? Node.create(newNodeData)
      : Node.createNewAssociatedNode(node, newNodeData);

    if (!tree.nodes) tree.nodes = [];
    tree.nodes?.push(newNode);
    if (!tree.startNode) tree.startNode = newNode.id;

    edgeId
      ? updateEdgeTarget(edgeId, newNode.id)
      : addEdge({ source: nodeId, target: newNode.id, type: "default" });

    return newNode;
  }

  // ------------------------------------------------------------------
  // Relations

  function addRelation(nodeId: string) {
    const newRelation = Relation.create();

    getNode(nodeId)?.data.relations.push(newRelation);
    return newRelation;
  }

  // ------------------------------------------------------------------
  // Edges

  function getEdge(edgeId: string) {
    return tree.edges?.find((edge) => edge.id === edgeId);
  }

  /**
   * @summary Adds an edge to the tree under certain conditions.
   * @description
   * This functions adds a new edge if the following conditions are true:
   * - Does not connect to itself
   * - Edge does not already exist
   * - The Edge would not result in a circularly connected tree
   *
   * @param edge - The data for the edge that should be added.
   * @param relationId - Since edges are associated to Nodes through the relations key this also adds a new relation to the source node. This behavior can be adjusted by passing a relationId as a second parameter. The new Edge is then added to that relation instead.
   */
  function addEdge(
    edge: Parameters<typeof Edge.create>[0],
    relationId?: string
  ) {
    // ------------------------------------------------------------------
    // Edge Creation Rules
    // Make sure the edge does not already exist based on the combination of source and target.
    if (
      tree.edges?.find(
        (existingEdge) =>
          existingEdge.source === edge.source &&
          existingEdge.target === edge.target
      )
    ) {
      return new Error(
        "Eine Verbindung zwischen diesen Knoten existiert bereits."
      );
    }
    // Make sure the edge does not result in a circular connection.
    const isCircular = circularConnection(edge);

    if (isCircular)
      return new Error(
        "Knoten können nicht mit vorherigen Knoten verbunden sein."
      );

    // ------------------------------------------------------------------
    // Only after the above rules did not cause an early exist are we starting to modify anything in the edges array.
    const newEdge = Edge.create(edge);

    // Edge.create might return an error that we return similarly to the above rules.
    if (newEdge instanceof Error) return newEdge;

    // If there is no edges array yet assign it.
    if (!tree.edges) tree.edges = [];

    //
    if (!relationId) {
      const newRelation = addRelation(edge.source);
      tree.edges?.push(newEdge);

      getRelation(newEdge.source, newRelation.id)?.edges.push(newEdge.id);
    } else {
      const relation = getRelation(newEdge.source, relationId);
      if (!relation)
        throw new Error(
          `The edge cannot be added to relation ${relationId} on node ${edge.source}, because it does not exist.`
        );

      tree.edges?.push(newEdge);
      relation.edges.push(newEdge.id);
    }

    return newEdge;
  }

  function updateEdge(
    edge: DeepPartial<Edge.TEdge> & { id: Edge.TEdge["id"] }
  ) {
    const existingEdgeIndex = tree.edges?.findIndex(
      (existingEdge) => existingEdge.id === edge.id
    );

    if (!existingEdgeIndex || !tree.edges) return;

    tree.edges[existingEdgeIndex] = merge(
      tree.edges?.[existingEdgeIndex],
      edge
    );
  }

  function deleteEdges(ids: string[]) {
    const { toDelete, rest } = groupBy(tree.edges ?? [], (edge) =>
      ids.includes(edge.id) ? "toDelete" : "rest"
    );

    tree.edges = rest;

    toDelete.forEach((edge) => {
      const sourceNode = getNode(edge.source);
      const targetNode = getNode(edge.target);

      if (sourceNode) {
        const sourceNodeRelations = sourceNode?.data.relations.filter(
          (relation) => relation.edges.includes(edge.id)
        );
        sourceNode.data.relations = sourceNodeRelations;
      }

      if (targetNode) {
        const targetNodeRelations = targetNode?.data.relations.filter(
          (relation) => relation.edges.includes(edge.id)
        );
        targetNode.data.relations = targetNodeRelations;
      }
    });
  }

  function updateEdgeTarget(edgeId: string, newTarget: string) {
    const edge = getEdge(edgeId);
    if (!edge) return;

    edge.target = newTarget;
  }

  function updateEdgeSource(edgeId: string, newSource: string) {
    const edge = getEdge(edgeId);
    if (!edge) return;

    edge.source = newSource;
  }

  function updateEdgeAnswer(edgeId: string, newAnswer: string) {
    const edge = getEdge(edgeId);
    if (!edge) return;

    edge.data.answer = newAnswer;
  }

  /**
   * Get the immediate parents of the node with the provided id.
   */
  const getParents = (node: Node.TNode): string[] =>
    pipe(
      tree.edges ?? [],
      reduce((acc: string[], edge) => {
        if (edge.target === node.id) return [...acc, edge.source];

        return acc;
      }, []),
      uniq()
    );

  /**
   * Get the immediate Children of the node with the provided id.
   */
  const getChildren = (nodeId: string) => {
    return pipe(
      tree.edges ?? [],
      // Filter out relations without targets
      filter((edge) => edge.source === nodeId),
      // Return an array of the target ids
      map((edge) => edge.target)
    );
  };

  const circularConnection = ({
    source,
    target,
  }: {
    source: string;
    target: string;
  }): boolean => {
    const nodesOnPaths = getPaths(source).flatMap((path) => path);

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };

  const getPaths = (nodeId: string) => {
    const adjacencyList = createAdjacencyList(tree.edges ?? []);

    return depthFirstSearch(nodeId, adjacencyList);
  };

  const getConnectableNodes = (nodeId: string): string[] => {
    const nodesOnPath = getPaths(nodeId).flatMap((path) => path);
    const nodesChildren = getChildren(nodeId);

    return pipe(
      tree.nodes ?? [],
      Object.values,
      filter(
        (iteratedNode) =>
          iteratedNode.id !== nodeId &&
          !nodesOnPath.includes(iteratedNode.id) &&
          !nodesChildren.includes(iteratedNode.id)
      ),
      map((node) => node.id)
    );
  };

  return {
    updateStartNode,
    getNode,
    getRelation,
    getEdge,
    addNode,
    updateNodeName,
    updateNodePosition,
    updateNodeContent,
    updateNodeRelations,
    deleteNodes,
    addAssociatedNode,
    addRelation,
    addEdge,
    updateEdge,
    deleteEdges,
    updateEdgeTarget,
    updateEdgeSource,
    updateEdgeAnswer,
    getParents,
    getChildren,
    circularConnection,
    getPaths,
    getConnectableNodes,
  };
}

export type TTree = z.infer<typeof Type>;
