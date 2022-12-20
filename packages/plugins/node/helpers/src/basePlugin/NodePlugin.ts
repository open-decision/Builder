import {
  Node,
  Plugin,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { merge } from "remeda";
import { z } from "zod";
import { getNodeCollection } from "./utils/getNodeCollection";
import { getNodeSingle } from "./utils/getNodeSingle";

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) => Node.Type.extend({ data: Type, type: z.literal(typeName) });

export abstract class NodePlugin<
  TType extends z.ZodType = any,
  TTypeName extends string = any
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  pluginType = "node" as const;
  protected declare defaultData: any;

  constructor(Type: TType, typeName: TTypeName) {
    super(mergeTypes(Type, typeName));

    this.typeName = typeName;
  }

  create =
    (data: Partial<Omit<z.infer<typeof this.Type>, "id" | "type">>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const newNode = treeClient.nodes.create.node(
        merge(
          {
            type: this.typeName,
            data: this.defaultData,
          },
          data
        )
      );

      return this.Type.parse(newNode);
    };

  get get() {
    return {
      single:
        (nodeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
          getNodeSingle<z.infer<typeof this.Type>>(treeClient, nodeId),
      collection:
        (nodeIds?: string[]) =>
        (treeClient: TTreeClient | TReadOnlyTreeClient) =>
          getNodeCollection<Record<string, z.infer<typeof this.Type>>>(
            treeClient,
            nodeIds
          ),
    };
  }

  get subscribe() {
    return {
      single: (nodeId: string) => (treeClient: TReadOnlyTreeClient) =>
        getNodeSingle<z.infer<typeof this.Type>>(treeClient, nodeId),
      collection: (nodeIds: string[]) => (treeClient: TReadOnlyTreeClient) =>
        getNodeCollection<Record<string, z.infer<typeof this.Type>>>(
          treeClient,
          nodeIds
        ),
    };
  }
}
