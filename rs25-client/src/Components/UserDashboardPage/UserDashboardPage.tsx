import UserTable from "../UserTable/UserTable";
import { useApplicationUserFunctions } from "../../HelperFunctions/applicationUserFunctions";
import { useAuth } from "../../Auth/AuthContext";
import { useEffect } from "react";

export default function UserDashboardPage() {
  const auth = useAuth();
  const { fetchAppUsers, deleteAppUser, data } = useApplicationUserFunctions();

  useEffect(() => {
    if (auth?.user?.role === "Admin") {
      fetchAppUsers();
    }
  }, [auth?.user?.role]);
  return (
    <div>
      <UserTable rows={data.filter((user) => user.role !== "Admin")} onDelete={deleteAppUser} />
    </div>
  );
}
