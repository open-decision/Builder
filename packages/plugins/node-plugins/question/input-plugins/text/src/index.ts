import { InputPluginObject } from "@open-decision/input-plugins-helpers";
import { TTreeClient } from "@open-decision/tree-type";
import { BuilderComponent } from "./builder";
import { DataType, TTextInput, TextInputPlugin } from "./plugin";
import { RendererComponent } from "./renderer";

export * from "./plugin";

export const createTextInputPlugin = (treeClient: TTreeClient) => {
  return {
    plugin: new TextInputPlugin(treeClient),
    type: "text",
    BuilderComponent: {
      PrimaryActionSlot: undefined,
      InputConfigurator: BuilderComponent,
    },
    RendererComponent,
  };
};