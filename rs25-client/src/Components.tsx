import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "./AuthContext";

export function Button({
  onClick,
  content,
  className = "normal-button",
}: {
  onClick: () => void;
  content: string;
  className?: string;
}) {
  return (
    <button className={className} onClick={onClick} type="button">
      {content}
    </button>
  );
}
export function SpookyButton({
  onClick,
  content,
  className = "spooky-button",
}: {
  onClick: () => void;
  content: string;
  className?: string;
}) {
  return (
    <button className={className} onClick={onClick} type="button">
      {content}
    </button>
  );
}
export function RedirectButton({
  to,
  content,
}: {
  to: string;
  content: string;
}) {
  return (
    <Link to={to} className="normal-button">
      {content}
    </Link>
  );
}

export function SubmitButton({
  onClick,
  content,
}: {
  onClick?: () => void;
  content: string;
}) {
  return (
    <div className="submit-button-container">
      <button type="submit" onClick={onClick} className="submit-button">
        {content}
      </button>
    </div>
  );
}

export function InputField({
  id,
  placeholder,
  type,
  label,
  onChange,
  value,
  name,
  defaultValue,
  readonly = false,
}: {
  id: string;
  placeholder?: string;
  type: string;
  label?: string;
  onChange?: (e: any) => void;
  value?: string;
  name?: string;
  defaultValue?: string;
  readonly?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={readonly ? "inactive-input" : "normal-input"}
        onChange={onChange}
        value={value}
        name={name}
        defaultValue={defaultValue}
        inert={readonly}
        readOnly={readonly}
      />
    </div>
  );
}
export function InputFieldNumber({
  id,
  placeholder,
  type,
  label,
  step,
  min,
  onChange,
  value,
  readonly = false,
}: {
  id: string;
  placeholder: string;
  type: string;
  label: string;
  step: string;
  min: string;
  onChange?: (e: any) => void;
  value?: string;
  readonly?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        step={step}
        min={min}
        className={`normal-input ${readonly ? "no-spinner-input" : ""}`}
        inert={readonly}
        onChange={onChange}
        value={value}
        readOnly={readonly}
      />
    </div>
  );
}
export function InputFieldTextArea({
  id,
  placeholder,
  label,
  onChange,
  value,
}: {
  id: string;
  placeholder: string;
  label: string;
  onChange?: (e: any) => void;
  value?: string;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        placeholder={placeholder}
        className="text-area-input"
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

export function InputSelect({
  id,
  options,
  label,
  onChange,
  value,
}: {
  id: string;
  options: string[];
  label: string;
  onChange?: (e: any) => void;
  value?: string;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="normal-input"
        onChange={onChange}
        value={value}
      >
        <option disabled value="">
          -- Select an option --
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FileInput({
  id,
  label,
  onChange,
  ref,
}: {
  id: string;
  label: string;
  onChange?: (e: any) => void;
  ref?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className="file-input-container">
        <input
          type="file"
          id={id}
          accept=".jpg,.jpeg,.png,.pdf"
          className="file-input"
          onChange={onChange}
          ref={ref}
        />
      </div>
    </div>
  );
}

export function InputRadio({
  id,
  name,
  label,
  value,
  checked,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  checked?: boolean;
  onChange?: (e: any) => void;
}) {
  return (
    <div>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        defaultChecked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export function AdminOnlyWrapper({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  if (auth?.user?.role !== "Admin") {
    return null;
  }
  return <>{children}</>;
}
export function Title({ content }: { content: string }) {
  return (
    <div className="content-title-container">
      <h1 className="content-title">{content}</h1>
    </div>
  );
}
