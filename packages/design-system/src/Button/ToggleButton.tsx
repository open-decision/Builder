import * as React from "react";
import * as Toggle from "@radix-ui/react-toggle";
import { Button, ButtonProps } from "..";

export type ToggleButtonProps = Toggle.ToggleProps & ButtonProps;

export const ToggleButton = ({
  children,
  pressed,
  defaultPressed,
  onPressedChange,
  ...props
}: ToggleButtonProps) => {
  return (
    <Toggle.Root
      asChild
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
    >
      <Button variant="neutral" size="small" {...props}>
        {children}
      </Button>
    </Toggle.Root>
  );
};
