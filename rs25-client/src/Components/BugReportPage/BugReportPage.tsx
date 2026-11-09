import {
  Title,
  InputSelect,
  InputFieldTextArea,
  SubmitButton,
} from "../UniversalComponents/UniversalComponents";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import { useEmailFunctions } from "../../HelperFunctions/emailFunctions";

const bugReportEmail = process.env.REACT_APP_BUG_REPORT_EMAIL || "";
export default function BugReportPage() {
  const auth = useAuth();
  const { sendEmail } = useEmailFunctions();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const bugType = (document.getElementById("bugtype") as HTMLSelectElement)
      .value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;

    const username = auth?.user?.username;
    var bodyContent = "";
    if (username) {
      bodyContent =
        "Submitted by: " + username + "\nInformation provided:\n" + description;
    }

    if (!bodyContent || bodyContent === "") {
      toast.error("Please fill in the description field.");
      return;
    }

    const data = {
      to: bugReportEmail,
      subject: `Bug Report - ${bugType}`,
      content: bodyContent,
    };
    sendEmail(data);
    (document.getElementById("bugtype")! as HTMLSelectElement).value = "Bug";
    (document.getElementById("description")! as HTMLTextAreaElement).value = "";
    toast.success("Bug report submitted successfully!");
  };

  return (
    <div className="content">
      <Title content="Bug Report" />
      <p className="center-p">
        If you find any bugs or have any feature suggestions, please submit them
        here.
      </p>
      <br />
      <form className="normal-form" onSubmit={handleSubmit}>
        <InputSelect
          id="bugtype"
          options={["Bug", "Feature Request", "Other"]}
          label="Report Type"
        />
        <InputFieldTextArea
          id="description"
          placeholder="Describe the issue or suggestion"
          label="Description"
        />
        <SubmitButton content="Submit Report" />
      </form>
    </div>
  );
}
