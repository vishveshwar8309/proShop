import { useState } from "react";
import { Col, Row, Button, Form, FormGroup, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import {
  useUpdateProfileMutation,
  useGetMyOrdersQuery,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const {
    data: orders,
    isLoading: ordersLoader,
    error,
  } = useGetMyOrdersQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ name, email }).unwrap();
      dispatch(setCredentials(res));
      toast.success("update successful");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>

        <Form onSubmit={handleSubmit}>
          <FormGroup controlId="name" className="my-3">
            <Form.Label>Name: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup controlId="email" className="my-3">
            <Form.Label>Email: </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup>
            <Button type="submit" variant="primary" className="my-1">
              Update Profile
            </Button>
          </FormGroup>

          {isLoading && <Loader />}
        </Form>
      </Col>

      <Col md={9}>
        <h3>My Orders</h3>

        <Row>
          {ordersLoader ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error?.data?.message || error}</Message>
          ) : (
            <table striped hover responsive className="table-sm">
              <thead>
                <tr style={{ borderBottom: "solid 1px black" }}>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total Price</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} style={{ borderBottom: "solid 1px grey" }}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes />
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
                        <Button className="btn-sm" variant="light">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
