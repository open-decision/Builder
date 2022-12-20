import { NodePlugin } from "@open-decision/plugins-node-helpers";
import { RichText } from "@open-decision/rich-text-editor";
import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const typeName = "document" as const;

export const DataType = z.object({
  content: RichText.optional(),
  templateUuid: z.string().uuid().optional(),
});

export class DocumentNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor() {
    super(DataType, typeName);

    this.defaultData = {
      content: [],
      templateUuid: "",
    };
  }

  getByTemplateUuid =
    (templateUuid: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const nodes = this.get.collection()(treeClient);

      return Object.values(nodes ?? {}).filter(
        (node) => node.data?.templateUuid === templateUuid
      );
    };

  updateNodeContent =
    (nodeId: string, content: z.infer<typeof this.Type>["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      node.data.content = content;
    };

  updateTemplateUuid =
    (nodeId: string, newTemplateUuid: string) => (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      node.data.templateUuid = newTemplateUuid;
    };
}

export type TDocumentNode = z.infer<DocumentNodePlugin["Type"]>;
