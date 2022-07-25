import { TLoginOutput } from "@open-decision/auth-api-specification";
import { ODError } from "@open-decision/type-classes";
import { useRouter } from "next/router";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useLogoutMutation(
  config?: Omit<UseMutationOptions<TLoginOutput>, "mutationFn">
) {
  const router = useRouter();

  return useMutation<any, ODError>(
    ["logout"],
    () => {
      return fetch("/api/external-api/auth/logout", {
        method: "POST",
      });
    },
    { onSuccess: () => router.push("/auth/login"), ...config }
  );
}
