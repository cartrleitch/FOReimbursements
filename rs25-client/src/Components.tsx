import { Link } from 'react-router-dom';

export function Button({ onClick, content }: { onClick: () => void, content: string }) {
  return (
    <button
      className="normal-button"
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export function RedirectButton({ to, content }: { to: string, content: string }) {
    return (
        <Link
            to={to}
            className="normal-button"
        >
            {content}
        </Link>
    );
}

export function SubmitButton({ onClick, content }: { onClick?: () => void, content: string }) {
    return (
        <div className="submit-button-container">
            <button type="submit" onClick={onClick} className="submit-button">
                {content}
            </button>
        </div>
    );
}

export function InputField({ id, placeholder, type, label }: { id: string, placeholder: string, type: string, label: string }) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input type={type} id={id} placeholder={placeholder} className="normal-input" />
        </div>
    );
}
export function InputFieldNumber({ id, placeholder, type, label, step, min }: { id: string, placeholder: string, type: string, label: string, step: string, min: string }) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input type={type} id={id} placeholder={placeholder} step={step} min={min} className="normal-input" />
        </div>
    );
}
export function InputFieldTextArea({ id, placeholder, label }: { id: string, placeholder: string, label: string }) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <textarea id={id} placeholder={placeholder} className="normal-input" />
        </div>
    );
}

export function InputSelect({ id, options, label }: { id: string, options: string[], label: string }) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <select id={id} className="normal-input">
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function FileInput({ id, label }: { id: string, label: string }) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <div className="file-input-container">
                <input type="file" id={id} multiple accept=".jpg,.jpeg,.png,.pdf" className="file-input" />
            </div>
        </div>
    );
}

export function Title({ content }: { content: string }) {
    return (
        <div className="content-title-container">
            <h1 className="content-title">{content}</h1>
        </div>
    );
}