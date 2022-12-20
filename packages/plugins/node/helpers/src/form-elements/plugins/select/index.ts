import { SelectInputRendererComponent } from "./ui/SelectInputRenderer";
import {
  SelectInputConfigurator,
  SelectInputPrimaryActionSlot,
} from "./ui/SelectInputEditor";
import { SelectInputPlugin } from "./selectPlugin";

export * from "./selectPlugin";
export type { TSelectInput } from "./selectPlugin";

const plugin = new SelectInputPlugin();

export const SelectInputPluginObject = {
  plugin,
  type: plugin.typeName,
  BuilderComponent: {
    PrimaryActionSlot: SelectInputPrimaryActionSlot,
    InputConfigurator: SelectInputConfigurator,
  },
  RendererComponent: SelectInputRendererComponent,
};
