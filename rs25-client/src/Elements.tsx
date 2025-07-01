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