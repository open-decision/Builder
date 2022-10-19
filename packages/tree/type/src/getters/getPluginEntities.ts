import { Tree } from "../type-classes";
import { pick } from "remeda";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";

export const getPluginEntities =
  (tree: Tree.TTree) =>
  <TType extends z.ZodTypeAny>(
    entityKey: string,
    ids: string[],
    type: TType
  ) => {
    if (!tree.pluginEntities) return undefined;
    if (!tree.pluginEntities[entityKey]) return undefined;

    const data = pick(tree.pluginEntities[entityKey], ids);

    const parsedEntities = z.record(type).safeParse(data);

    if (!parsedEntities.success) {
      console.error(parsedEntities.error);
      throw new ODProgrammerError({
        code: "INVALID_REQUESTED_PLUGIN_ENTITY",
        message: "The requested plugin entity is not of the provided type.",
      });
    }

    return data as Record<string, z.infer<TType>>;
  };