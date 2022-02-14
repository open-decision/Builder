import * as BuilderNode from "../Node/BuilderNode";
import { z } from "zod";
import { BaseTree } from "./shared";
import {
  enablePatches,
  produceWithPatches,
  applyPatches as immerApplyPatches,
} from "immer";
import * as BuilderRelation from "../Relation/BuilderRelation";
import { circularConnection } from "./BuilderTree";
import { merge } from "remeda";
import { DeepPartial } from "utility-types";
enablePatches();

export const Type = BaseTree.extend({
  treeData: BuilderNode.Record,
  selectedNodeId: z.string().optional(),
  selectedRelationId: z.string().optional(),
});

export type TTree = z.infer<typeof Type>;

export const Patch = z.object({
  op: z.enum(["replace", "remove", "add"]),
  path: z.array(z.union([z.string(), z.number()])),
  value: z.any().optional(),
});

export const Patches = z.array(Patch);

export type TPatch = z.infer<typeof Patch>;
export type TPatches = z.infer<typeof Patches>;

export function create(name: string): TTree {
  const newTree = {
    treeData: {},
    name,
    startNode: "",
  } as TTree;

  return newTree;
}

export const applyPatches = (patches: TPatch[]) => (tree: TTree) =>
  immerApplyPatches(tree, patches);

// ------------------------------------------------------------------
// State updater functions

export type TreeUpdateReturn = readonly [TTree, TPatch[], TPatch[]];
type NodeUpdateFn<TParams extends { nodeId: string }> = (
  params: TParams
) => (tree: TTree) => TreeUpdateReturn;
type RelationUpdateFn<TParams extends { nodeId: string; relationId: string }> =
  (params: TParams) => (tree: TTree) => TreeUpdateReturn;

export const addNode =
  (node: BuilderNode.TNode) =>
  (tree: TTree): TreeUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      // Assign the node to the treeData object by its id.
      draft.treeData[node.id] = node;

      // If no startNode exists assign the new nodes id to the startNode.
      // This in effect makes it so, that the first Node automatically becomes the startNode.
      if (draft.startNode === "") draft.startNode = node.id;
    });

export type UpdateNodePayload = {
  nodeId: string;
  node: Partial<BuilderNode.TNode>;
};
export const updateNode: NodeUpdateFn<UpdateNodePayload> =
  ({ nodeId, node }) =>
  (tree: TTree): TreeUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      // Get the old state of the Node.
      const oldNode = draft.treeData[nodeId];

      // Merge the old with the new state and assign that to the treeData with the id of the Node.
      draft.treeData[nodeId] = {
        ...oldNode,
        ...node,
      };
    });

export type UpdateNodeNamePayload = {
  nodeId: string;
  name: string;
};

export const updateNodeName: NodeUpdateFn<UpdateNodeNamePayload> =
  ({ nodeId, name }) =>
  (tree: TTree): TreeUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      draft.treeData[nodeId].name = name;
    });

export type UpdateNodePositionPayload = {
  nodeId: string;
  position: BuilderNode.TCoordinates;
};

export const updateNodePosition: NodeUpdateFn<UpdateNodePositionPayload> =
  ({ nodeId, position }) =>
  (tree: TTree): TreeUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      draft.treeData[nodeId].position = position;
    });

export type UpdateNodeContentPayload = {
  nodeId: string;
  content: BuilderNode.TNode["content"];
};
export const updateNodeContent: NodeUpdateFn<UpdateNodeContentPayload> =
  ({ nodeId, content }) =>
  (tree: TTree): TreeUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      draft.treeData[nodeId].content = content;
    });

export type UpdateNodeRelationsPayload = {
  nodeId: string;
  relations: Record<string, BuilderRelation.TRelation>;
};
export const updateNodeRelations: NodeUpdateFn<UpdateNodeRelationsPayload> =
  ({ nodeId, relations }) =>
  (tree: TTree): TreeUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      draft.treeData[nodeId].relations = relations;
    });

export const deleteNodes =
  (ids: string[]) =>
  (tree: TTree): TreeUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      // We loop over all the provided ids to allow for multiple Nodes to be deleted at once.
      ids.forEach((id) => {
        delete draft.treeData[id];

        // If the deletedNode is currently selected remove that selection.
        if (id === draft.selectedNodeId) draft.selectedNodeId = "";

        // Remove the Node from all the targets of other Nodes.
        for (const nodeId in draft.treeData) {
          const node = draft.treeData[nodeId];

          for (const nodeRelation in node.relations) {
            const relation = node.relations[nodeRelation];

            if (relation.target === id) {
              delete relation.target;
            }
          }
        }
      });
    });

const isCircularRelation =
  (nodeId: string, target: string) =>
  (tree: TTree): boolean => {
    const isCircular = circularConnection(tree)({
      source: nodeId,
      target,
    });

    if (isCircular) return true;

    return false;
  };

export const addRelation =
  (nodeId: string, relation: Omit<BuilderRelation.TRelation, "id">) =>
  (tree: TTree): TreeUpdateReturn => {
    const newRelation = BuilderRelation.create(relation);

    // We produce the new context inside this function, because we need to validate that the
    // added relation is not circular before comitting this to the state.
    const [newTree, patches, inversePatches] = produceWithPatches(
      tree,
      (draft) => {
        draft.treeData[nodeId].relations[newRelation.id] = newRelation;
      }
    );

    if (isCircularRelation(nodeId, relation?.target ?? "")(newTree))
      return [tree, [] as TPatch[], [] as TPatch[]];

    return [newTree, patches, inversePatches];
  };

export const updateRelation =
  (nodeId: string, relation: BuilderRelation.TRelation) =>
  (tree: TTree): TreeUpdateReturn => {
    const [newTree, patches, inversePatches] = produceWithPatches(
      tree,
      (draft) => {
        const oldValue = draft.treeData[nodeId].relations[relation.id];

        draft.treeData[nodeId].relations[relation.id] = {
          ...oldValue,
          ...relation,
        };
      }
    );

    if (isCircularRelation(nodeId, relation?.target ?? "")(newTree))
      return [tree, [] as TPatch[], [] as TPatch[]];

    return [newTree, patches, inversePatches];
  };

export type UpdateRelationAnswerPayload = {
  nodeId: string;
  relationId: string;
  answer: string;
};

export const updateRelationAnswer: RelationUpdateFn<UpdateRelationAnswerPayload> =

    ({ nodeId, relationId, answer }) =>
    (tree) =>
      produceWithPatches(tree, (draft) => {
        draft.treeData[nodeId].relations[relationId].answer = answer;
      });

export type UpdateRelationTargetPayload = {
  nodeId: string;
  relationId: string;
  target: string;
};

export const updateRelationTarget: RelationUpdateFn<UpdateRelationTargetPayload> =

    ({ nodeId, relationId, target }) =>
    (tree) => {
      const [newTree, patches, inversePatches] = produceWithPatches(
        tree,
        (draft) => {
          draft.treeData[nodeId].relations[relationId].target = target;
        }
      );

      if (isCircularRelation(nodeId, target)(newTree))
        return [tree, [] as TPatch[], [] as TPatch[]];

      return [newTree, patches, inversePatches];
    };

export const deleteRelations =
  (nodeId: string, relationIds: string[]) =>
  (tree: TTree): TreeUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      relationIds.forEach((relationId) => {
        delete draft.treeData[nodeId].relations[relationId];
      });
    });

export const updateTree = (newTree: DeepPartial<TTree>) => (oldTree: TTree) =>
  merge(oldTree, newTree);

export {
  circularConnection,
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
  isUnique,
} from "./shared";
