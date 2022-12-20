import * as React from "react";
import { Button, Form, Icon } from "@open-decision/design-system";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { MultiSelectInputPlugin } from "../multiSelectPlugin";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  InputComponentProps,
  InputConfig,
  TAnswer,
  DragHandle,
  InputPrimaryActionSlotProps,
  AddOptionButton,
} from "../../../helpers";

const MultiSelect = new MultiSelectInputPlugin();

export function MultiSelectInputConfigurator({ inputId }: InputComponentProps) {
  const treeClient = useTreeClient();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const input = useTree((treeClient) =>
    treeClient.pluginEntity.get.single<typeof MultiSelect.Type>(
      "inputs",
      inputId
    )
  );

  const methods = Form.useForm<{ label: string } & Record<string, string>>({
    defaultValues: {
      label: input?.label ?? "",
      ...Object.fromEntries(
        input.data.answers.map((answer) => [answer.id, answer.value])
      ),
    },
  });

  if (!input) return null;

  return (
    <Form.Root methods={methods} className="gap-0">
      <Reorder.Group
        className="list-none p-0 grid gap-2"
        ref={ref}
        axis="y"
        values={input.data.answers ?? []}
        onReorder={(newOrder) => {
          return MultiSelect.reorderAnswers(input.id, newOrder)(treeClient);
        }}
      >
        {input.data.answers.map((answer) => {
          return (
            <Answer
              groupRef={ref}
              answer={answer}
              inputId={input.id}
              key={answer.id}
              name={answer.id}
            />
          );
        })}
      </Reorder.Group>
      <InputConfig className="mt-2" inputId={input.id} />
    </Form.Root>
  );
}

type AnswerProps = {
  answer: TAnswer;
  inputId: string;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
  name: string;
};

const Answer = ({ answer, inputId, groupRef, name }: AnswerProps) => {
  const treeClient = useTreeClient();

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      MultiSelect.updateAnswer(
        inputId,
        answer.id,
        event.target.value
      )(treeClient),
    [answer.id, inputId, treeClient]
  );

  const onClick = React.useCallback(
    () => MultiSelect.deleteAnswer(inputId, answer.id)(treeClient),
    [answer.id, inputId, treeClient]
  );

  const controls = useDragControls();
  const { register } = Form.useFormContext();

  return (
    <AnimatePresence initial={false}>
      <Reorder.Item
        key={answer.id}
        value={answer}
        dragListener={false}
        dragControls={controls}
        dragConstraints={groupRef}
      >
        <div className="grid gap-2 grid-cols-[1fr_max-content_max-content] items-center">
          <Form.Input
            key={answer.id}
            placeholder="Antwort"
            {...register(name, { onChange })}
          />
          <Button
            variant="neutral"
            type="button"
            square
            onPointerDown={(event) => controls.start(event)}
          >
            <Icon label="Verschiebe den Input">
              <DragHandle />
            </Icon>
          </Button>
          <Button variant="neutral" type="button" square onClick={onClick}>
            <Icon label="Entferne den Input">
              <TrashIcon />
            </Icon>
          </Button>
        </div>
      </Reorder.Item>
    </AnimatePresence>
  );
};

export function MultiSelectInputPrimaryActionSlot({
  inputId,
}: InputPrimaryActionSlotProps) {
  const treeClient = useTreeClient();

  return (
    <AddOptionButton
      onClick={() => {
        const newAnswer = MultiSelect.createAnswer({ value: "" });
        MultiSelect.addAnswer(inputId, newAnswer)(treeClient);
      }}
    />
  );
}
