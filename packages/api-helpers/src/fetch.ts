import { APIError, isAPIError } from "@open-decision/type-classes";
import {
  FetchBlobFunction,
  FetchJSONFunction,
} from "./fetchClientFunctionHelpers";
import { z } from "zod";

const getResponseData = async (response: Response) => {
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json") && response.status !== 204) {
    data = await response.json();
  }

  return data;
};

export const safeFetch = async (
  url: string,
  {
    body,
    headers,
    ...options
  }: Omit<RequestInit, "body"> & {
    body?: Record<string, any>;
  },
  { retry = 0 }: { retry?: number }
) => {
  let retries = 0;

  const fetchFn = async (): Promise<Response> => {
    try {
      return await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });
    } catch (error) {
      if (retries < retry) {
        retries++;
        return await fetchFn();
      } else {
        throw new APIError({
          code: "OFFLINE",
          message:
            error instanceof Error ? error.message : "Error without message",
        });
      }
    }
  };

  let response = await fetchFn();

  try {
    if (response?.status >= 400) {
      if (retries < retry) {
        retries++;
        response = await fetchFn();
      } else {
        throw await getResponseData(response);
      }
    }

    return response;
  } catch (error) {
    console.error(error);
    if (isAPIError(error)) throw error;
    if (error instanceof z.ZodError) throw error;

    throw new APIError({
      code: "UNEXPECTED_ERROR",
      message: "Something unexpected happened when fetching from the API.",
    });
  }
};

export const safeFetchJSON: FetchJSONFunction = async (...params) => {
  const response = await safeFetch(...params);

  const data = await getResponseData(response);

  if (!data) {
    return { data: response, status: response.status };
  }

  const parsedData = params[2].validation?.parse(data) ?? data;

  return {
    data: parsedData,
    status: response.status,
  };
};

export const safeFetchBlob: FetchBlobFunction = async (...params) => {
  const response = await safeFetch(...params);

  return { data: await response.blob(), status: response.status };
};
