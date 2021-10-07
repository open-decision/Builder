/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, VariantProps } from "../../stitches";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";
import { useInput } from "../useForm";
import { Box } from "../../Box";

const StyledBox = styled(
  Box,
  {
    ...baseInputStyles,
    borderRadius: "$md",
    display: "flex",
    alignItems: "center",
    focusStyle: "inner",
    overflow: "hidden",
    padding: "1px",
    $$paddingInline: "$space$2",
    $$paddingBlock: "$space$3",
    paddingInline: "$$paddingInline",
  },
  baseTextInputStyle
);

const StyledInput = styled("input", {
  borderRadius: "$md",
  paddingBlock: "$$paddingBlock",
  border: "none",
  width: "100%",
  textStyle: "medium-text",
  minWidth: 0,
  transform: "translateX($$XTranslation)",
  outline: "none",
  backgroundColor: "transparent",
});

export type InputProps = Omit<
  React.ComponentProps<typeof StyledInput>,
  "value" | "size"
> & {
  name: string;
  value?: string;
  regex?: string;
  Buttons?: JSX.Element | JSX.Element[];
  Icon?: JSX.Element;
} & VariantProps<typeof StyledBox>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      minLength,
      maxLength,
      regex,
      required,
      onChange,
      onBlur,
      value,
      Buttons,
      disabled,
      css,
      size,
      Icon,
      ...props
    },
    forwardedRef
  ) => {
    const {
      value: formValue,
      blur,
      setBlur,
      setValue,
      setErrors,
      submitting,
    } = useInput(name, "string");

    const defaultValidationmessages = {
      required: "The field is required and can't be empty",
      minLength: `Please enter at least ${minLength} chars.`,
      regex: `The input doesn't fulfill the requirements.`,
      maxLength: `You've reached the maximum allowed characters (${maxLength}).`,
    };

    const validate = (inputValue: string) => {
      const errors: string[] = [];

      if (required && inputValue.length === 0) {
        errors.push(defaultValidationmessages.required);
      }

      if (minLength && inputValue.length < minLength) {
        errors.push(defaultValidationmessages.minLength);
      }

      if (regex && !new RegExp(regex).test(inputValue)) {
        errors.push(defaultValidationmessages.regex);
      }

      if (maxLength && inputValue.length === maxLength) {
        errors.push(defaultValidationmessages.maxLength);
      }

      return errors;
    };

    React.useEffect(() => {
      if (blur || submitting) {
        setErrors(validate(value ?? ""));
      }
    }, [value, blur, submitting]);

    return (
      <StyledBox
        css={{ color: disabled ? "$gray8" : "$gray11", ...css }}
        data-disabled={disabled}
        size={size}
      >
        {Icon}
        <StyledInput
          name={name}
          ref={forwardedRef}
          value={value ?? formValue}
          onChange={(event) => {
            onChange ? onChange?.(event) : setValue(event.target.value ?? "");
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setBlur(true);
          }}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          pattern={regex}
          required={required}
          {...props}
        />
        {Buttons}
      </StyledBox>
    );
  }
);
