import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <p>unauthorised</p>;
};

export default AdminRoute;
