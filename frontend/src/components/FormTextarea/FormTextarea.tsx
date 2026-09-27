import type { ReactNode, TextareaHTMLAttributes } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  children?: ReactNode;
  fieldProps?: Partial<TextareaHTMLAttributes<HTMLTextAreaElement>>;
}

const FormTextarea = ({
  children,
  fieldProps,
  ...additionalProps
}: FormTextareaProps) => (
  <textarea
    id={additionalProps.id || additionalProps.name}
    className="form-group__textarea"
    {...fieldProps}
    {...additionalProps}
  >
    {children}
  </textarea>
);

export default FormTextarea;
