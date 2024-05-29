import { Button, Table } from "react-bootstrap";
import { FaTimes, FaTrash, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure? You want to delete this user")) {
      try {
        const res = await deleteUser(id).unwrap();
        refetch();
        console.log(res);
        toast.success(res.message);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    } else {
      toast.error("delete action cancelled");
    }
  };

  return (
    <>
      <h2>Users</h2>
      <Table striped hover responsive className="table-sm">
        <thead>
          <tr style={{ borderBottom: "solid 1px grey" }}>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isDeleting && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            users.map((user) => (
              <tr key={user._id} style={{ borderBottom: "solid 1px grey" }}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck color="green" />
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default UserListScreen;
