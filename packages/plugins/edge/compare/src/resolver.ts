import {
  getCurrentNode,
  MissingAnswerOnInterpreterContextError,
  MissingEdgeForThruthyConditionError,
} from "@open-decision/interpreter";
import { EdgeResolver } from "@open-decision/plugins-edge-helpers";
import { SingleSelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { ODProgrammerError } from "@open-decision/type-classes";
import { TCompareEdge } from "./plugin";

const SingleSelectVariable = new SingleSelectVariablePlugin();

export const resolver: EdgeResolver<TCompareEdge> =
  (treeClient) => (edge) => (context) => {
    const currentNode = getCurrentNode(treeClient, context);

    if (!currentNode)
      throw new ODProgrammerError({
        code: "INTERPRETER_WITHOUT_CURRENT_NODE",
        message: "Interpreter has no current node that is on the tree.",
      });

    const condition = edge.data.condition;

    if (!condition || !edge.target) return { state: "failure" };

    // Get a possibly existing answer from the interpreter context
    const existingAnswer = context.answers[currentNode.id];

    // We expect there to be an answer on the interpreter context.
    // Not finding an answer on the interpreter context is a programmer error.
    if (!existingAnswer) throw new MissingAnswerOnInterpreterContextError();
    const answerOfType = SingleSelectVariable.safeParse(existingAnswer);

    if (
      !answerOfType.data.value ||
      !condition.valueIds.includes(answerOfType.data.value)
    )
      return { state: "failure" };

    if (edge) return { state: "success", target: edge.target };

    // If we could not find an edge for this condition, we return an error, because the
    // condition is thruthy but cannot be resolved without a valid edge.
    return { state: "error", error: new MissingEdgeForThruthyConditionError() };
  };
