import { client } from "@open-decision/api-client";
import { safeFetchJSON } from "@open-decision/api-helpers";

export const OD = client({
  urlPrefix: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
  fetchFunction: safeFetchJSON,
  headers: {
    credentials: "include",
  },
});

export const proxiedOD = client({
  requestOrigin: "client",
  urlPrefix: `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/api/external-api`,
  fetchFunction: safeFetchJSON,
  headers: {
    credentials: "include",
  },
});
