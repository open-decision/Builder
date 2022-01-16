import { OnlyString } from "@stitches/react/types/css";
import * as React from "react";
import { styled } from "../stitches";
import { center } from "../shared/variants";

const StyledSwitch = styled("div", center, {
  $$threshold: "50vw",
  display: "flex",
  flexWrap: "wrap",

  "& > *": {
    flexGrow: 1,
    flexBasis: "calc(( $$threshold - 100%) * 999)",
  },
});

export type SwitchProps = React.ComponentProps<typeof StyledSwitch> & {
  threshold?: number | OnlyString;
};

export const Switch = ({ css, ...props }: SwitchProps) => {
  return (
    <StyledSwitch css={{ $$threshold: props.threshold, ...css }} {...props} />
  );
};
