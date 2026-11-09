import { useEffect } from "react";
import { ReimbursementTable } from "../../Components/ReimTable/ReimTableComponent";
import { useReimbursementFunctions } from "../../HelperFunctions/reimbursementFunctions";
import { useAuth } from "../../Auth/AuthContext";
import { Title } from "../UniversalComponents/UniversalComponents";

export default function MainPage() {
  const auth = useAuth();
  const {
    data,
    fetchReimbursements,
    fetchReimbursementByUserId,
    deleteReimbursement,
    updateReimbursement,
    fetchReimbursementById,
  } = useReimbursementFunctions();
  useEffect(() => {
    if (auth?.user?.role === "Admin") {
      fetchReimbursements();
    } else {
      fetchReimbursementByUserId(auth?.user?.id);
    }
  }, []);
  return (
    <div className="content">
      <Title content="Reimbursement Dashboard" />
      <div className="table-container">
        <ReimbursementTable
          rows={data}
          deleteReimbursement={deleteReimbursement}
          fetchReimbursements={fetchReimbursements}
          fetchReimbursementByUserId={fetchReimbursementByUserId}
          updateReimbursement={updateReimbursement}
          fetchReimbursementById={fetchReimbursementById}
        />
      </div>
    </div>
  );
}
