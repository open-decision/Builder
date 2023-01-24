import * as React from "react";
import { Icon, Button, Row, Form, Tooltip } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

type Props = {
  className?: string;
  successButtonLabel?: React.ReactNode;
  onGoBack?: () => void;
  canGoBack?: true;
  isStartNode: boolean;
};

export function Navigation({
  className,
  successButtonLabel,
  isStartNode,
}: Props) {
  const { isInteractive } = useInterpreter();
  const [open, setOpen] = React.useState(false);

  return (
    <Tooltip.Root open={!isInteractive && open} onOpenChange={setOpen}>
      <Tooltip.Trigger asChild>
        <Row classNames={["p-2 max-w-max gap-2 rounded-md", className]}>
          <BackButton className={isStartNode ? "opacity-0" : "opacity-100"} />
          <Form.SubmitButton
            form="form"
            className={isInteractive ? "" : "pointer-events-none"}
          >
            {successButtonLabel ? successButtonLabel : "Zum nächsten Schritt"}
            <Icon label="Vorwärts">
              <ArrowRightIcon />
            </Icon>
          </Form.SubmitButton>
        </Row>
      </Tooltip.Trigger>
      <Tooltip.Content>
        Die Vorschau ist nicht interaktiv. Um mit dem Baum zu interagieren nutze
        bitte die Prototypansicht.
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

type BackButtonProps = { className?: string };

export function BackButton({ className }: BackButtonProps) {
  const { send, canGoBack, isInteractive } = useInterpreter();

  return (
    <Button
      variant="neutral"
      onClick={() => {
        return send("GO_BACK");
      }}
      disabled={!canGoBack || !isInteractive}
      classNames={[isInteractive ? "" : "pointer-events-none", className]}
    >
      <Icon label="Zurück">
        <ArrowLeftIcon />
      </Icon>
      Zurück
    </Button>
  );
}
