import { EntityPluginType } from "@open-decision/tree-type";
import { z } from "zod";
import { InputPlugin, InputPluginBaseType } from "../../helpers";
import { updateRequired } from "../../helpers/utils/inputMethods";

export const typeName = "text" as const;

const DataType = z.object({ required: z.boolean() });

export const TextInputPluginType = InputPluginBaseType(typeName, DataType);

export type TTextInput = EntityPluginType<typeof TextInputPluginType>;

export class TextInputPlugin extends InputPlugin<TTextInput> {
  constructor() {
    super(typeName, TextInputPluginType, { required: false });

    this.defaultData = { required: false };
  }

  updateRequired = updateRequired<TTextInput>();
}
