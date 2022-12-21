import * as React from "react";
import {
  ClassNameArrayProp,
  Form as SystemForm,
  ScrollArea,
  Stack,
  twMerge,
} from "@open-decision/design-system";
import { Navigation } from "./Navigation";
import { useInterpreterTree } from "@open-decision/interpreter-react";

type RendererContentAreaProps = {
  children: React.ReactNode;
  className?: string;
};

export function ContentArea({ children, className }: RendererContentAreaProps) {
  return (
    <ScrollArea.Root
      className={twMerge("flex flex-col overflow-hidden", className)}
    >
      <ScrollArea.Viewport className="min-h-0">
        {children}
        <ScrollArea.Scrollbar />
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
}

type RendererContainerProps = {
  children: React.ReactNode;
  withNavigation?: boolean;
  nodeId: string;
  className?: string;
  classNames?: ClassNameArrayProp;
  successButtonLabel?: React.ReactNode;
};

export function Container({
  children,
  withNavigation = true,
  className,
  nodeId,
  successButtonLabel,
  classNames,
}: RendererContainerProps) {
  const node = useInterpreterTree((treeClient) =>
    treeClient.nodes.get.single(nodeId)
  );

  if (node instanceof Error) throw node;

  return (
    <Stack
      classNames={[`rounded-md overflow-hidden w-full`, classNames, className]}
    >
      <Stack className="flex-1 overflow-hidden mb-4 px-1 pb-1 gap-4">
        {children}
      </Stack>
      {withNavigation && !node.final ? (
        <Navigation
          className="self-center mb-[var(--padding)]"
          successButtonLabel={successButtonLabel}
        />
      ) : null}
    </Stack>
  );
}

export const SubmitButton = () => {
  return (
    <SystemForm.SubmitButton className="self-end mt-2 font-large-text">
      Weiter
    </SystemForm.SubmitButton>
  );
};

type RendererFormProps<TFieldValues extends SystemForm.FieldValues> = {
  children?: React.ReactNode;
} & SystemForm.RootProps<TFieldValues>;

export function Form<TFieldValues extends SystemForm.FieldValues>({
  children,
  ...props
}: RendererFormProps<TFieldValues>) {
  return (
    <SystemForm.Root className="gap-8" id="form" {...props}>
      {children}
    </SystemForm.Root>
  );
}
