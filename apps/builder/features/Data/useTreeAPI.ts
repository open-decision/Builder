import {
  TCreatePublishedTreeInput,
  TCreateTreeInput,
  TCreateTreeOutput,
  TDeletePublishedTreeInput,
  TDeleteTreeInput,
  TGetTreeOutput,
  TGetTreesOutput,
  TUpdateTreeInput,
  TDeleteTreeOutput,
  TUpdateTreeOutput,
  TCreatePublishedTreeOutput,
  TDeletePublishedTreeOutput,
  TGetTreeDataOutput,
  TGetTreePreviewOutput,
} from "@open-decision/api-specification";
import { APIError, isAPIError, ODError } from "@open-decision/type-classes";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { OD, proxiedOD } from "../Data/odClient";
import { z } from "zod";
import { useNotificationStore } from "../../config/notifications";
import { createYjsDocumentIndexedDB } from "./utils/createYjsDocumentIndexedDB";
import { Tree, Node, TreeClient } from "@open-decision/tree-type";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { createTreeClientWithPlugins } from "@open-decision/tree-client";
import { PlaceholderNodePlugin } from "@open-decision/node-editor";
import { FetchJSONReturn } from "@open-decision/api-helpers";

const PlaceholderNode = new PlaceholderNodePlugin();

export const treesQueryKey = ["Trees"] as const;
export const treeQueryKey = (treeUuid: string) =>
  [...treesQueryKey, treeUuid] as const;

export const treeDataQueryKey = (treeUuid: string) =>
  [treeUuid, "TreeData"] as const;

export type useDeleteOptions = UseMutationOptions<
  FetchJSONReturn<TDeleteTreeOutput>,
  APIError<void>,
  TDeleteTreeInput
>;

export type useCreateOptions = UseMutationOptions<
  FetchJSONReturn<TCreateTreeOutput>,
  APIError<TCreateTreeOutput>,
  TCreateTreeInput
>;

export type useUpdateOptions = UseMutationOptions<
  FetchJSONReturn<TUpdateTreeOutput>,
  APIError<void>,
  TUpdateTreeInput
>;

export type useArchiveOptions = UseMutationOptions<
  FetchJSONReturn<TUpdateTreeOutput>,
  APIError<void>,
  Pick<TUpdateTreeInput, "params">
>;

export type usePublishOptions = UseMutationOptions<
  FetchJSONReturn<TCreatePublishedTreeOutput>,
  APIError<void>,
  TCreatePublishedTreeInput
>;

export type useUnpublishOptions = UseMutationOptions<
  FetchJSONReturn<TDeletePublishedTreeOutput>,
  APIError<void>,
  TDeletePublishedTreeInput
>;

export type useImportOptions = UseMutationOptions<
  FetchJSONReturn<TCreateTreeOutput>,
  APIError<void>,
  { event: ProgressEvent<FileReader> }
>;

export type useExportOptions = UseMutationOptions<
  string,
  APIError<void>,
  { name: string }
>;

export const useTreeAPI = () => {
  const queryClient = useQueryClient();

  const invalidateTrees = (uuid?: string) => {
    uuid ? queryClient.invalidateQueries(treeQueryKey(uuid)) : null;
    queryClient.invalidateQueries(treesQueryKey);
  };

  const { addNotificationFromTemplate } = useNotificationStore();
  type notification = Parameters<typeof addNotificationFromTemplate>[0] | false;

  const useTreesQuery = <TData = FetchJSONReturn<TGetTreesOutput>>(options?: {
    staleTime?: number;
    select?: (data: FetchJSONReturn<TGetTreesOutput>) => TData;
  }) => {
    return useQuery(
      treesQueryKey,
      () => proxiedOD.trees.getCollection({}),
      options
    );
  };

  const useTreeQuery = <TData = FetchJSONReturn<TGetTreeOutput>>(
    uuid: string,
    options?: {
      select?: (data: FetchJSONReturn<TGetTreeOutput>) => TData;
      staleTime?: number;
      enabled?: boolean;
      initialData?: FetchJSONReturn<TGetTreeOutput>;
      onSuccess?: (data: TData) => void;
    }
  ) =>
    useQuery(
      treeQueryKey(uuid),
      () => proxiedOD.trees.getSingle({ params: { uuid } }),
      options
    );

  const useTreeData = <TData = FetchJSONReturn<TGetTreeDataOutput>>(
    uuid: string,
    options?: {
      staleTime?: number;
      select?: (data: FetchJSONReturn<Tree.TTree>) => TData;
      enabled?: boolean;
    }
  ) => {
    return useQuery(
      treeDataQueryKey(uuid),
      () => OD.trees.data.get({ params: { uuid } }),
      options
    );
  };

  const useTreePreview = <TData = FetchJSONReturn<TGetTreePreviewOutput>>(
    uuid: string,
    options?: {
      staleTime?: number;
      select?: (data: FetchJSONReturn<Tree.TTree>) => TData;
      enabled?: boolean;
    }
  ) => {
    return useQuery(
      treeDataQueryKey(uuid),
      () => OD.trees.data.getPreview({ params: { uuid } }),
      {
        ...options,
        retry: (failureCount, error) => {
          if (isAPIError(error) && error.code === "PREVIEW_NOT_ENABLED") {
            return false;
          }
          return failureCount < 3;
        },
      }
    );
  };

  const useCreate = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useCreateOptions & { notification?: notification } = {}) => {
    return useMutation(
      ["createTree"],
      async (data) => {
        const response = await proxiedOD.trees.create(data);
        const yDoc = new Y.Doc();
        new IndexeddbPersistence(response.data.uuid, yDoc);

        const yMap = yDoc.getMap("tree");

        const treeClient = new TreeClient({
          nodes: {},
          pluginEntities: {},
          edges: {},
          startNode: "",
        });

        const node = PlaceholderNode.create({})(treeClient);
        const yNodes = new Y.Map<Node.TRecord>([[node.id, node]]);

        yMap.set("startNode", node.id);
        yMap.set("nodes", yNodes);
        yMap.set("edges", new Y.Map());
        yMap.set("pluginEntities", new Y.Map());

        return response;
      },
      {
        ...options,
        onSuccess: (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "createProject")
            : null;
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees();
          return onSettled?.(...params);
        },
      }
    );
  };

  const useDelete = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useDeleteOptions & { notification?: notification } = {}) =>
    useMutation(
      ["deleteTree"],
      async (data) => {
        return proxiedOD.trees.delete(data);
      },
      {
        ...options,
        onSuccess: async (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "deleteProject")
            : null;
          return onSuccess?.(...params);
        },
        onSettled: async (...params) => {
          invalidateTrees();
          return onSettled?.(...params);
        },
      }
    );

  const useUpdate = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useUpdateOptions & {
    notification?: notification;
  } = {}) =>
    useMutation(["updateTree"], (data) => proxiedOD.trees.update(data), {
      ...options,
      onSuccess: (...params) => {
        notification !== false
          ? addNotificationFromTemplate(notification ?? "updateProject")
          : null;
        return onSuccess?.(...params);
      },
      onSettled: (...params) => {
        invalidateTrees(params[2].params.uuid);
        return onSettled?.(...params);
      },
    });

  const useUnArchive = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useArchiveOptions & { notification?: notification } = {}) =>
    useMutation(
      ["unarchiveTree"],
      ({ params }) =>
        proxiedOD.trees.update({
          body: { status: "ACTIVE" },
          params,
        }),
      {
        ...options,
        onSuccess: (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "unarchived")
            : null;
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(params[2].params.uuid);
          return onSettled?.(...params);
        },
      }
    );

  const useArchive = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useArchiveOptions & { notification?: notification } = {}) =>
    useMutation(
      ["archiveTree"],
      ({ params }) =>
        proxiedOD.trees.update({
          body: { status: "ARCHIVED" },
          params,
        }),
      {
        ...options,
        onSuccess: (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "archived")
            : null;
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(params[2].params.uuid);
          return onSettled?.(...params);
        },
      }
    );

  const usePublish = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: usePublishOptions & { notification?: notification } = {}) =>
    useMutation(
      ["publishTree"],
      (data) => proxiedOD.trees.publishedTrees.create(data),
      {
        ...options,
        onSuccess: (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "published")
            : null;
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(params[2].params.treeUuid);
          return onSettled;
        },
      }
    );

  const useUnPublish = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useUnpublishOptions & { notification?: notification } = {}) =>
    useMutation(
      ["unpublishTree"],
      (data) => {
        return proxiedOD.publishedTrees.delete(data);
      },
      {
        ...options,
        onSuccess: (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "unpublished")
            : null;
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(params[2].params.uuid);
          return onSettled?.(...params);
        },
      }
    );

  const useImport = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useImportOptions & { notification?: notification } = {}) =>
    useMutation(
      ["importTree"],
      async ({ event }) => {
        try {
          const result = event.target?.result;

          if (!result || !(typeof result === "string")) throw result;
          const parsedResult = JSON.parse(result);

          const TreeImportType = z.object({
            name: z.string(),
            treeData: createTreeClientWithPlugins(parsedResult["treeData"])
              .treeClient.Type,
          });

          const validatedResult = TreeImportType.safeParse(parsedResult);
          if (!validatedResult.success) {
            console.error(validatedResult.error);
            throw validatedResult;
          }

          const data = validatedResult.data;

          const response = await proxiedOD.trees.create({
            body: { name: data.name },
          });

          createYjsDocumentIndexedDB(data.treeData, response.data.uuid);

          queryClient.invalidateQueries(treesQueryKey);
          return response;
        } catch (error) {
          throw new ODError({
            code: "IMPORT_INVALID_FILE",
            message: "The provided file is invalid.",
          });
        }
      },
      {
        ...options,
        onSuccess: (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "import")
            : null;
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees();
          return onSettled?.(...params);
        },
      }
    );

  function createFile(data: object) {
    return new Blob([JSON.stringify(data)], { type: "application/json" });
  }

  const useExport = (
    uuid: string,
    {
      onSuccess,
      ...options
    }: useExportOptions & { notification?: notification } = {}
  ) => {
    return useMutation(
      ["exportTree"],
      async (data) => {
        const { data: treeData } = await proxiedOD.trees.data.get({
          params: { uuid },
        });

        return new Promise<string>((resolve) => {
          return setTimeout(() => {
            const file = createFile({
              name: data?.name,
              treeData,
            });

            return resolve(URL.createObjectURL(file));
          }, 2000);
        });
      },
      {
        ...options,
        onSuccess: (...params) => {
          return onSuccess?.(...params);
        },
      }
    );
  };

  return {
    treesQueryKey,
    treeQueryKey,
    treeDataQueryKey,
    useTreesQuery,
    useTreeQuery,
    useTreeData,
    useDelete,
    useCreate,
    useUpdate,
    useArchive,
    useUnArchive,
    usePublish,
    useUnPublish,
    useImport,
    useExport,
    useTreePreview,
  };
};
