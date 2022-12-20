import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { publishedTreesSingle } from "../../urls";
import { TDeletePublishedTreeInput } from "./input";

export const deletePublishedTree =
  (context: TContext) =>
  async (inputs: TDeletePublishedTreeInput, config?: QueryConfig) => {
    let combinedUrl = publishedTreesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      {}
    );
  };
