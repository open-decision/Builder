import * as React from "react";
import {
  buttonStyles,
  Dialog,
  Link,
  Text,
  Form,
  Stack,
  DialogTriggerProps,
  StyleObject,
} from "@open-decision/design-system";
import { readableDate } from "../../../features/Dashboard/utils";
import { ErrorBoundary } from "@sentry/nextjs";
import { useMutation } from "react-query";
import { useTreeContext } from "../state/treeStore/TreeContext";
import { useTreeQuery } from "../../Data/useTreeQuery";

function createFile(data: object) {
  return new Blob([JSON.stringify(data)], { type: "application/json" });
}

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
  treeId: string;
};

export function ExportDialog({
  children,
  open,
  setOpen,
  focusOnClose,
  className,
  css,
  treeId,
}: Props) {
  const { getTree } = useTreeContext();
  const { data } = useTreeQuery(treeId);

  const [fileName, setFileName] = React.useState("");
  const {
    mutate,
    data: file,
    isLoading,
    reset,
  } = useMutation(() => {
    return new Promise<Blob>((resolve) => {
      const tree = getTree();

      return setTimeout(
        () => resolve(createFile({ name: data?.name, ...tree })),
        2000
      );
    });
  });

  const formState = Form.useFormState({
    defaultValues: {
      name: data?.name ? `${data?.name}_${readableDate(new Date())}` : "",
    },
  });

  formState.useSubmit(() => {
    setFileName(formState.values.name);
    mutate();
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content
        className={className}
        css={css}
        onCloseAutoFocus={focusOnClose}
      >
        <Dialog.Header>Projekt exportieren</Dialog.Header>
        <ErrorBoundary fallback={ExportErrorFallback}>
          {!file ? (
            <>
              <Dialog.Description asChild>
                <Text css={{ marginTop: "$2" }}>
                  Nehmen Sie Anpassungen am Export vor.
                </Text>
              </Dialog.Description>
              <Form.Root state={formState} css={{ marginTop: "$4" }}>
                <Form.Field Label="Dateiname">
                  <Form.Input name={formState.names.name} />
                </Form.Field>
                <Form.Submit
                  isLoading={isLoading}
                  css={{ marginTop: "$2", marginLeft: "auto" }}
                >
                  Weiter
                </Form.Submit>
              </Form.Root>
            </>
          ) : (
            <Stack>
              <Dialog.Description asChild>
                <Text css={{ marginTop: "$2" }}>
                  Speichern Sie ihren exportierten Baum.
                </Text>
              </Dialog.Description>
              <Link
                className={buttonStyles({
                  css: { marginTop: "$4", alignSelf: "flex-end" },
                })}
                download={`${fileName}.json`}
                href={URL.createObjectURL(file)}
                onClick={() => {
                  reset();
                  setOpen?.(false);
                }}
              >
                Speichern
              </Link>
            </Stack>
          )}
        </ErrorBoundary>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function ExportErrorFallback() {
  return <Text>Beim Export ihres Baumes ist ein Fehler aufgetreten.</Text>;
}
