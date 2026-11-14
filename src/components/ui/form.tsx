"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

const FormFieldContext = React.createContext<{
  name: FieldPath<FieldValues>;
} | null>(null);

const FormItemContext = React.createContext<{ id: string } | null>(null);

function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: ControllerProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller<TFieldValues, TName, TTransformedValues> {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext || !itemContext) {
    throw new Error("Form field components must be used inside FormField and FormItem.");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    ...fieldState,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-description`,
    formMessageId: `${itemContext.id}-form-message`,
  };
}

function FormItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={className} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  const { error, formItemId } = useFormField();

  return (
    <label
      className={className}
      htmlFor={formItemId}
      data-invalid={Boolean(error)}
      {...props}
    />
  );
}

function FormControl({ children }: { children: React.ReactElement }) {
  const { error, formItemId, formMessageId } = useFormField();
  const describedBy = error ? formMessageId : undefined;

  return React.cloneElement(children, {
    id: formItemId,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
  } as Record<string, unknown>);
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={className}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;

  if (!body) return null;

  return (
    <p
      id={formMessageId}
      className={className}
      role={error ? "alert" : undefined}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  FormProvider as Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
};
