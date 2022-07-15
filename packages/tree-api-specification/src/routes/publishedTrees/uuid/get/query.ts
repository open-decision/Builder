import { TContext, Get, safeFetch } from "@open-decision/api-helpers";
import { publishedTreesSingle } from "../../../../urls";
import { TGetPublishedTreeInput } from "./input";
import { getPublishedTreeOutput, TGetPublishedTreeOutput } from "./output";

export const getPublishedTree =
  (context: TContext): Get<TGetPublishedTreeInput, TGetPublishedTreeOutput> =>
  async (inputs, config) => {
    let combinedUrl = publishedTreesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      {},
      { validation: getPublishedTreeOutput }
    );
  };
