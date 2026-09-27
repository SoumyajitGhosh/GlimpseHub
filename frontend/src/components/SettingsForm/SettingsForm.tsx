import type { FormEventHandler, ReactNode } from "react";

interface SettingsFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children?: ReactNode;
}

const SettingsForm = ({ onSubmit, children }: SettingsFormProps) => (
  <form className="settings-form" onSubmit={onSubmit}>
    {children}
  </form>
);

export default SettingsForm;
