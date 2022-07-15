import {
  TContext,
  Post,
  prefixUrl,
  safeFetch,
} from "@open-decision/api-helpers";
import { resetPasswordUrl } from "../../urls";
import { TResetPasswordInput } from "./input";
import { resetPasswordOutput, TResetPasswordOutput } from "./output";

export const resetPassword =
  (context: TContext): Post<TResetPasswordInput, TResetPasswordOutput> =>
  async (inputs, config) => {
    const combinedUrl = prefixUrl(
      resetPasswordUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
      },
      { validation: resetPasswordOutput }
    );
  };
