import { css, StyleObject } from "../stitches";

export const visuallyHidden = css({
  border: "0",
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
});

export const focusStyle = (value: StyleObject) => ({
  "&:focus-visible, &[data-focus='true']": value,
});

export const hoverStyle = (value: StyleObject) => ({
  "&:hover": value,
});

export const intentStyle = (value: StyleObject) => ({
  "&:focus-visible, &[data-focus='true'], &:hover": value,
});

export const activeStyle = (value: StyleObject) => ({
  "&:active, &[data-active='true'], &[data-state=on]": value,
});

export const disabledStyle = (value: StyleObject) => ({
  "&:disabled, &[data-disabled='true']": value,
});
