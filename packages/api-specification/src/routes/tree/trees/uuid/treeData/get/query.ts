import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { treeDataSingle } from "../../../../urls";
import { TGetTreeDataInput } from "./input";
import { getTreeDataOutput } from "./output";

export const getTreeData =
  (context: TContext) =>
  async (inputs: TGetTreeDataInput, config?: QueryConfig) => {
    let combinedUrl = treeDataSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;
    return await context.fetchFunction(
      combinedUrl,
      { cache: "no-cache" },
      { validation: getTreeDataOutput }
    );
  };
