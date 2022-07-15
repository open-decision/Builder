import {
  TContext,
  Post,
  prefixUrl,
  safeFetch,
} from "@open-decision/api-helpers";
import { refreshTokenUrl } from "../../urls";
import { TRefreshTokenInput } from "./input";
import { refreshTokenOutput, TRefreshTokenOutput } from "./output";

export const refreshToken =
  (
    context: TContext
  ): Post<Omit<TRefreshTokenInput, "cookies">, TRefreshTokenOutput> =>
  async (_, config) => {
    const combinedUrl = prefixUrl(
      refreshTokenUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        headers: { ...context.headers, ...config?.headers },
        method: "POST",
      },
      { validation: refreshTokenOutput.passthrough() }
    );
  };
