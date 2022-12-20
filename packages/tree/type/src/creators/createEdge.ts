import { Edge, Tree } from "../type-classes";
import { v4 as uuid } from "uuid";
import { isValidEdge } from "../validators";
import { ODError } from "@open-decision/type-classes";

export type NewEdgeData = Omit<Edge.TEdge, "id">;

/**
 * Used to create a valid new edge. This needs the full tree to make sure the edge is valid.
 */
export const createEdge =
  (tree: Tree.TTree) =>
  <TEdgeType extends Edge.TEdge>(edge: NewEdgeData) => {
    // Make sure the edge does not connect the node to itself.
    if (edge.source === edge.target)
      return new ODError({
        code: "CONNECTED_TO_SELF",
        message: "A node cannot connect to itself",
      });

    // Create the edge object
    const newEdge = {
      id: uuid(),
      ...edge,
    } as TEdgeType;

    // Validate the created edge object, based on the rest of the tree.
    const isEdgeValid = isValidEdge(tree)(newEdge);

    if (isEdgeValid instanceof ODError) return isEdgeValid;

    return newEdge;
  };
