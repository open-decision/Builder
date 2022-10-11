import { useTreeContext } from "@open-decision/tree-sync";
import { createTreeClient } from "@open-decision/tree-client";
import { createQuestionNodePlugin } from "@open-decision/node-plugins-question";
import { SelectInputPlugin } from "@open-decision/input-plugins-select";
import { createCompareConditionPlugin } from "@open-decision/condition-plugins-compare";
import { FreeTextInputPlugin } from "@open-decision/input-plugins-free-text";
import { createDirectConditionPlugin } from "@open-decision/condition-plugins-direct";
import { createTreeClient as createBaseTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { Resolver } from "@open-decision/interpreter";
import { ODProgrammerError } from "@open-decision/type-classes";

export const useTreeClient = () => {
  const {
    tree: { tree },
  } = useTreeContext();

  const baseTreeClient = createBaseTreeClient(tree);

  const QuestionNode = createQuestionNodePlugin(baseTreeClient);
  const NodeType = QuestionNode.plugin.Type;

  const SingleSelectInput = new SelectInputPlugin(baseTreeClient);
  const FreeTextInput = new FreeTextInputPlugin(baseTreeClient);
  const InputType = z.discriminatedUnion("type", [
    SingleSelectInput.Type,
    FreeTextInput.Type,
  ]);

  const CompareCondition = createCompareConditionPlugin(baseTreeClient);
  const DirectCondition = createDirectConditionPlugin(baseTreeClient);
  const ConditionType = z.discriminatedUnion("type", [
    CompareCondition.plugin.Type,
    DirectCondition.plugin.Type,
  ]);

  const treeClient = createTreeClient(
    {
      nodes: [{ question: QuestionNode.plugin }, NodeType],
      inputs: [{ select: SingleSelectInput, text: FreeTextInput }, InputType],
      conditions: [
        { compare: CompareCondition.plugin, direct: DirectCondition.plugin },
        ConditionType,
      ],
    },
    tree
  );

  const resolvers = (condition: z.infer<typeof ConditionType>) => {
    switch (condition.type) {
      case "direct":
        return DirectCondition.resolver(condition);
      case "compare":
        return CompareCondition.resolver(condition);
      default:
        throw new ODProgrammerError({
          code: "UNKNOWN_CONDITION_TYPE_IN_RESOLVER",
          message:
            "The provided condition does not have a type that is known to the resolver.",
        });
    }
  };

  const resolver: Resolver = (context, event) => (callback) => {
    const validConditions = z
      .record(treeClient.conditions.Type)
      .safeParse(event.conditions);

    if (!validConditions.success)
      throw new ODProgrammerError({
        code: "INVALID_CONDITIONS",
        message:
          "The conditions provided to the interpreter are not valid for the configured plugins.",
      });

    for (const conditionId in validConditions.data) {
      const condition = validConditions.data[conditionId];

      const conditionResolver = resolvers(condition);

      const result = conditionResolver(context, event);

      // If the result is false the condtion was not true and we
      // can continue with the next condition.
      if (result.state === "failure") continue;

      // If the result is an error we fail the interpretation, because
      // we can not resolve the tree correctly.
      // See the error message for what went wrong.
      if (result.state === "error")
        return callback({
          type: "INVALID_INTERPRETATION",
          error: result.error,
        });

      callback({ type: "VALID_INTERPRETATION", target: result.target });
    }
  };

  return {
    treeClient,
    nodePlugins: { QuestionNode },
    interpreterResolver: resolver,
  };
};
