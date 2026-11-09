import { Title } from "../UniversalComponents/UniversalComponents";
export default function ErrorPage() {
  return (
    <div className="content">
      <Title content="Missing 404" />
      <p className="center-p">
        Something went wrong. Please try again later or check url. This is not
        the page you are looking for.
      </p>
      <br />
      <img src="/404.jpeg" alt="404 Not Found" className="error-image" />
    </div>
  );
}
