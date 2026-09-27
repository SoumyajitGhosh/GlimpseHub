import type { ReactNode } from "react";

interface SettingsFormGroupProps {
  children?: ReactNode;
}

const SettingsFormGroup = ({ children }: SettingsFormGroupProps) => (
  <div className="settings-form__form-group">{children}</div>
);

export default SettingsFormGroup;
