import * as CheckboxPrimitive from "ariakit/checkbox";
import * as React from "react";
import { styled } from "../stitches";

import { baseInputBoxStyles, baseInputStyles } from "./shared/styles";
import { VisuallyHidden } from "ariakit/visually-hidden";
import { Box } from "../Box";

const StyledCheckbox = styled(Box, baseInputStyles, baseInputBoxStyles, {
  boxSizing: "border-box",
  borderRadius: "$md",
  padding: "2px",
});

export type CheckboxProps = CheckboxPrimitive.CheckboxStateProps<boolean> &
  Omit<CheckboxPrimitive.CheckboxProps, "name">;
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Box(
    {
      defaultValue,
      value,
      setValue,
      "data-test": dataTest,
      onBlur,
      onFocusVisible,
      ...props
    },
    ref
  ) {
    const checkbox = CheckboxPrimitive.useCheckboxState<boolean>({
      defaultValue,
      setValue,
      value,
    });

    const [focusVisible, setFocusVisible] = React.useState(false);

    return (
      <label data-test={dataTest}>
        <VisuallyHidden>
          <CheckboxPrimitive.Checkbox
            state={checkbox}
            onFocusVisible={(event) => {
              setFocusVisible(true);
              onFocusVisible?.(event);
            }}
            onBlur={(event) => {
              setFocusVisible(false);
              onBlur?.(event);
            }}
            ref={ref}
            {...props}
          />
        </VisuallyHidden>
        <StyledCheckbox data-checked={checkbox.value} data-focus={focusVisible}>
          <CheckboxPrimitive.CheckboxCheck checked={checkbox.value} />
        </StyledCheckbox>
      </label>
    );
  }
);
