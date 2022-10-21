import * as React from "react";
import { styled, StyleObject } from "../stitches";
import { Box } from "../Box";
import { Input as SystemInput } from "../Form/Input";
import { Button as SystemButton } from "../Button/Button";

const StyledBox = styled(Box, {
  display: "flex",
  flexWrap: "wrap",
});

export type InputWithButtonProps = {
  Input: React.ReactElement<React.ComponentProps<typeof SystemInput>>;
  Button: React.ReactElement<React.ComponentProps<typeof SystemButton>>;
  radius?: string;
  css?: StyleObject;
};

export const InputWithButton = ({
  Input,
  Button,
  radius = "$radii$md",
  css,
  ...props
}: InputWithButtonProps) => {
  return (
    <StyledBox css={{ ...css, borderRadius: radius }}>
      {React.cloneElement(Input, {
        ...props,
        css: {
          ...Input.props?.css,
          flex: "1 1 100%",
          borderRadius: "$none",
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,

          "@largePhone": {
            flex: "1",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: radius,
            borderTopLeftRadius: radius,
          },
        },
      })}
      {React.cloneElement(Button, {
        css: {
          ...Button.props?.css,
          flex: "1 0 100%",
          borderRadius: "$none",
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          borderBottomRightRadius: radius,
          borderBottomLeftRadius: radius,
          maxWidth: "unset",
          focusType: "outer",

          "@largePhone": {
            flex: "0 0 max-content",
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
          },
        },
      })}
    </StyledBox>
  );
};
