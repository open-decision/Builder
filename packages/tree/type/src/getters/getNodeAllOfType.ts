import { pickBy } from "remeda";
import { INode } from "../plugin";
import { Tree } from "../type-classes";

export const getNodeAllOfType =
  (tree: Tree.TTree) =>
  <TType extends INode>(type?: TType["type"]) => {
    return pickBy(tree.nodes, (node) => node.type === type) as Record<
      string,
      TType
    >;
  };