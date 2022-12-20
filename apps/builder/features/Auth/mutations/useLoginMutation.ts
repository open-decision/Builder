import { safeFetchJSON } from "@open-decision/api-helpers";
import { TLoginInput, TLoginOutput } from "@open-decision/api-specification";
import { APIError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useLoginMutation(
  config?: Omit<
    UseMutationOptions<
      TLoginOutput,
      APIError<TLoginInput>,
      TLoginInput["body"],
      unknown
    >,
    "mutationFn"
  >
) {
  return useMutation<any, APIError<TLoginInput>, any, unknown>(
    ["login"],
    ({ email, password }) => {
      return safeFetchJSON(
        "/api/external-api/auth/login",
        {
          body: { email, password },
          method: "POST",
        },
        {}
      );
    },
    config
  );
}
