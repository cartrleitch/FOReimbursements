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

  const userRole = auth?.user?.role;
  const userId = auth?.user?.id;

  useEffect(() => {
    if (userRole === "Admin") {
      fetchReimbursements();
    } else {
      fetchReimbursementByUserId(userId);
    }
  }, [userRole, userId, fetchReimbursements, fetchReimbursementByUserId]);

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
