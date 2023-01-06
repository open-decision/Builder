import { TContext, prefixUrl, QueryConfig } from "@open-decision/api-helpers";
import { verifyEmailUrl } from "../urls";
import { TVerifyEmailInput } from "./input";
import { verifyEmailOutput } from "./output";

export const verifyEmail =
  (context: TContext) =>
  async (inputs: TVerifyEmailInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      verifyEmailUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await context.fetchFunction(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { validation: verifyEmailOutput, ...context.config }
    );
  };
