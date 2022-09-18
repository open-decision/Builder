import { StyleObject, Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { Answers } from "./Answers";
import { TSelectInput } from "../selectPlugin";

type PreviewAnswerFormProps = {
  input: TSelectInput;
  css?: StyleObject;
};

export function AnswersForm({ input, css }: PreviewAnswerFormProps) {
  const { send, getAnswer, getCurrentNode } = useInterpreter();

  const formState = Form.useFormState({
    defaultValues: { [input.id]: getAnswer(input.id) ?? "" },
  });

  formState.useSubmit(() => {
    for (const inputId in formState.values) {
      const answer = formState.values[inputId];

      send({
        type: "ADD_USER_ANSWER",
        inputId,
        answer,
      });
    }

    const currentNode = getCurrentNode();

    send({
      type: "EVALUATE_NODE_CONDITIONS",
      conditionIds: currentNode?.data.conditions ?? [],
      nodeId: currentNode?.id,
    });
  });

  const options = Object.keys(formState.values);

  return (
    <Form.Root state={formState} css={css} resetOnSubmit={false}>
      {options.map((inputId) => (
        <Answers
          name={input.id}
          input={input}
          key={inputId}
          activeValue={formState.values[inputId]}
        />
      ))}
      <Form.Submit
        css={{
          alignSelf: "end",
          marginTop: "$2",
          fontWeight: "$large-text",
        }}
      >
        Weiter
      </Form.Submit>
    </Form.Root>
  );
}
