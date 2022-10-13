import { Tree } from "../type-classes";

export const deletePluginEntity = (tree: Tree.TTree) => (entityKey: string) => {
  if (!tree.pluginEntities) return;
  if (!tree.pluginEntities[entityKey]) return;

  delete tree.pluginEntities[entityKey];
};
