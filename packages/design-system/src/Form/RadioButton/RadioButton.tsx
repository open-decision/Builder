import * as React from "react";
import { rowClasses, stackClasses } from "../../Layout";
import { ClassNameValue, twMerge } from "../../utils";
import {
  baseInputClasses,
  BaseInputVariants,
  inputWrapperClasses,
} from "../shared/shared";

// ------------------------------------------------------------------
// Group

const groupClasses = stackClasses({}, ["gap-2"]);

export type GroupProps = React.HTMLAttributes<HTMLDivElement>;

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={className ? twMerge(groupClasses, className) : groupClasses}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// ------------------------------------------------------------------
// Item

const radioItemClasses = (
  { variant }: BaseInputVariants,
  classNames?: ClassNameValue
) =>
  rowClasses({ center: true }, [
    baseInputClasses({ variant }),
    inputWrapperClasses,
    `rounded-full appearance-none after:block after:w-[10px] after:h-[10px] after:rounded-full after:m-[6px] checked:after:bg-colorScheme10 checked:bg-white`,
    classNames,
  ]);

export type ItemProps = React.InputHTMLAttributes<HTMLInputElement> &
  BaseInputVariants;

export const Item = React.forwardRef<HTMLInputElement, ItemProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={radioItemClasses({ variant }, [className])}
        ref={ref}
        {...props}
      />
    );
  }
);
