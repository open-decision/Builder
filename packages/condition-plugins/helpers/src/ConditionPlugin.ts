import { Condition, Plugin, TTreeClient } from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) => Condition.Type.extend({ data: Type, type: z.literal(typeName) });

export class ConditionPlugin<
  TType extends z.ZodType,
  TTypeName extends string
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  declare treeClient: TTreeClient;
  declare typeName: TTypeName;
  pluginType = "condition" as const;

  constructor(treeClient: TTreeClient, Type: TType, typeName: TTypeName) {
    super(treeClient, mergeTypes(Type, typeName));

    this.typeName = typeName;
  }

  create(inputId: string, data: z.infer<TType>) {
    const newCondition = this.treeClient.conditions.create({
      inputId,
      data,
      type: this.typeName,
    });

    const parsedCondition = this.Type.safeParse(newCondition);

    if (!parsedCondition.success) {
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The condition could not be created. Please check that the data is correct.",
      });
    }

    return parsedCondition.data;
  }
}
