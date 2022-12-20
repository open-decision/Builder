import { EdgePlugin } from "@open-decision/plugins-edge-helpers";
import { NodePlugin } from "@open-decision/plugins-node-helpers";
import { Tree, TreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { merge } from "remeda";

export const createTreeClient = <
  TExtendedTree extends Omit<Tree.TTree, "startNode" | "edge">,
  NodePlugins extends Record<string, NodePlugin>,
  ConditionPlugins extends Record<string, EdgePlugin>,
  NodeType extends z.ZodType,
  ConditionType extends z.ZodType
>(
  plugins: {
    nodes: [NodePlugins, NodeType];
    edges: [ConditionPlugins, ConditionType];
    pluginEntities?: z.ZodTypeAny;
  },
  tree: Omit<Tree.TTree, "inputs" | "nodes"> & TExtendedTree
) => {
  const mergedTreeTypes = Tree.Type.merge(
    z.object({
      edges: z.record(plugins.edges[1]),
      nodes: z.record(plugins.nodes[1]),
      pluginEntities: plugins.pluginEntities ? plugins.pluginEntities : z.any(),
    })
  );

  const treeClient = new TreeClient(tree);

  const treeClientWithTypes = merge(treeClient, {
    Type: mergedTreeTypes,
    nodes: {
      Type: plugins.nodes[1],
    },
    edges: {
      Type: plugins.edges[1],
    },
  });

  return treeClientWithTypes;
};

export type TTreeClient = ReturnType<typeof createTreeClient>;
