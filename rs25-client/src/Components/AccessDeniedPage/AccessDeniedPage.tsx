import { Title } from "../UniversalComponents/UniversalComponents";

export default function AccessDeniedPage() {
  return (
    <div className="content">
      <Title content="Access Denied" />
      <p className="center-p">
        You do not have permission to access this page.
      </p>
      <br />
    </div>
  );
}
