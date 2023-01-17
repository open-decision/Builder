import {
  INodePlugin,
  NodePluginWithVariable,
  TNodeId,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import {
  DecisionNodeInputPlugins,
  TDecisionNodeInputs,
} from "./createInputPlugins";
import {
  addInput,
  getInputByNode,
  getNodesByInput,
  TInputId,
} from "@open-decision/plugins-node-helpers";
import {
  ISelectVariable,
  SelectVariablePlugin,
} from "@open-decision/plugins-variable-select";
import { match } from "ts-pattern";
import { TRichText } from "@open-decision/rich-text-editor";
import { forEachObj } from "remeda";

const SelectVariable = new SelectVariablePlugin();

export type TDecisionNodeVariable = ISelectVariable;

export const typeName = "decision" as const;

export interface IDecisionNode extends INodePlugin<typeof typeName> {
  content?: TRichText;
  input?: TInputId;
}

export class DecisionNodePlugin extends NodePluginWithVariable<
  IDecisionNode,
  TDecisionNodeVariable
> {
  inputPlugins = DecisionNodeInputPlugins;

  constructor() {
    super(typeName);
  }

  create =
    ({
      position = { x: 0, y: 0 },
      ...data
    }: Partial<Omit<IDecisionNode, "id" | "type">>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return treeClient.nodes.create.node<IDecisionNode>({
        type: this.type,
        position,
        ...data,
      });
    };

  inputs = {
    getByNode: getInputByNode<IDecisionNode, TDecisionNodeInputs>(this),
    add: addInput,
  };

  getByInput = getNodesByInput(this);

  connectInputAndNode =
    (nodeId: TNodeId, inputId: TInputId) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      // We get the input just to validate that it exists.
      treeClient.pluginEntity.get.single("inputs", inputId);

      node.input = inputId;
    };

  disconnectInputAndNode = (nodeId: TNodeId) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    if (!node) return;

    delete node.input;
  };

  updateInput =
    (nodeId: TNodeId, newInputId: TInputId) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.input = newInputId;
    };

  updateNodeContent =
    (nodeId: TNodeId, content: IDecisionNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.content = content;
    };

  override delete = (ids: TNodeId[]) => (treeClient: TTreeClient) => {
    const nodes = this.getCollection(ids)(treeClient);

    if (!nodes) return;

    treeClient.nodes.delete(ids);

    forEachObj.indexed(nodes, (value, id) => {
      const edges = treeClient.edges.get.byNode(id);
      treeClient.edges.delete(
        [
          ...Object.values(edges?.source ?? {}),
          ...Object.values(edges?.target ?? {}),
        ]
          .filter((edge) => edge.source === id || edge.target === id)
          .map((edge) => edge.id)
      );

      if (value.input) {
        DecisionNodeInputPlugins.plugins.select.delete([value.input])(
          treeClient
        );
      }
    });
  };

  getVariable =
    (nodeId: TNodeId, answers: any) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const variable = this.createVariable(nodeId)(treeClient);

      if (!variable) return undefined;

      return answers[variable.escapedName] as TDecisionNodeVariable;
    };

  private getVariableData =
    (nodeId: TNodeId) => (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;
      if (!node.input) return;

      const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
        "inputs",
        node.input
      );

      if (!input) return;

      return { node, input };
    };

  createVariable =
    (nodeId: TNodeId, valueId?: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const data = this.getVariableData(nodeId)(treeClient);

      if (!data) return undefined;

      return match(data.input)
        .with({ type: "select" }, (input) => {
          if (!data.node.name) return undefined;

          const variable = SelectVariable.create({
            id: data.node.id,
            name: data.node.name,
            values: input.answers,
          });

          if (valueId) {
            return SelectVariable.addValue(variable, valueId);
          }

          return variable;
        })
        .run();
    };
}
