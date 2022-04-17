import { Tree, Input } from "../type-classes";
import { pipe } from "remeda";
import { createInput, NewInputData } from "../creators";
/**
 * @description Always adds a new Input to the tree. There are no rules so this
 * will never fail.
 *
 * @params - Accepts a partial or full Input. A partial Input is used to create a new Input,
 * while a full Input is directly added to the Tree.
 */
export const addInput = (tree: Tree.TTree) => (input: Input.TInput) => {
  if (!tree.inputs) tree.inputs = {};

  tree.inputs[input.id] = input;
};

export const createAndAddInput = (tree: Tree.TTree) => (input?: NewInputData) =>
  pipe(input, createInput, addInput(tree));