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

export function SubmitButton({ onClick, content }: { onClick: () => void, content: string }) {
    return (
        <div className="submit-button-container">
            <button onClick={onClick} className="submit-button">
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

export function InputSelect({ id, options, label }: { id: string, options: string[], label: string }) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <select id={id} className="normal-input">
                {options.map(option => (
                    <option value={option}>
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