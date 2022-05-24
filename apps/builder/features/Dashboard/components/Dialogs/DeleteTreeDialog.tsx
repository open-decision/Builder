import {
  Form,
  Dialog,
  DialogTriggerProps,
  Text,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import { useDeleteTreeMutation } from "../../../../features/Data/generated/graphql";
import { queryClient } from "../../../../features/Data/queryClient";
import * as React from "react";

const Bold = styled("span", { color: "$gray12" });

type Props = {
  tree: { name: string; uuid: string };
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
  onDelete?: () => void;
};

export function DeleteTreeDialog({
  tree,
  open,
  setOpen,
  focusOnClose,
  children,
  className,
  css,
  onDelete,
}: Props) {
  const formState = Form.useFormState({
    defaultValues: { treeName: "" },
  });

  formState.useSubmit(() => {
    deleteTree({ uuid: tree.uuid });
  });

  formState.useValidate(() => {
    tree.name !== formState.values.treeName
      ? formState.setError(
          formState.names.treeName,
          "Der Projektname ist nicht korrekt"
        )
      : null;
  });

  const { mutate: deleteTree, isLoading } = useDeleteTreeMutation({
    onSuccess: () => {
      setOpen?.(false);
      queryClient.invalidateQueries("Trees");
      onDelete?.();
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content
        onCloseAutoFocus={focusOnClose}
        className={className}
        css={css}
      >
        <Dialog.Header css={{ marginBottom: "$2" }}>
          Projekt löschen
        </Dialog.Header>
        <Dialog.Description asChild>
          <Text css={{ marginBottom: "$4" }}>
            Bitte geben Sie den Namen des Projekts: <Bold>{tree.name}</Bold> zur
            Bestätigung der Löschung ein.
          </Text>
        </Dialog.Description>
        <Form.Root state={formState}>
          <Form.Field state={formState} label="Projektname">
            <Form.Input
              name={formState.names.treeName}
              required
              placeholder={tree.name}
            />
          </Form.Field>
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="danger">
            Löschen
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}