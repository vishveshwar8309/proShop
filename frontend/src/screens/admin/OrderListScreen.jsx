import { Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useGetOrdersQuery } from "../../slices/orderApiSlice";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h2>orders</h2>
      <Table striped hover responsive className="table-sm">
        <thead>
          <tr style={{ borderBottom: "solid 1px grey" }}>
            <th>Id</th>
            <th>User Name</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: "solid 1px grey" }}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/orders/${order._id}`}>
                    <Button type="button" variant="light">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default OrderListScreen;
