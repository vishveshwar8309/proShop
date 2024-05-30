import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/orderApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { userInfo } = useSelector((state) => state.auth);

  const [deliverOrder, { isLoading: deliverLoading }] =
    useDeliverOrderMutation();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const {
    data: paypal,
    isLoading: loadingpaypal,
    error: errorpaypal,
  } = useGetPayPalClientIdQuery();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!errorpaypal && !loadingpaypal && paypal.clientId) {
      const loadPayPalScript = () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingpaypal, errorpaypal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment Successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } }).unwrap();
  //   refetch();
  //   toast.success("Payment Successful");
  // }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverHandler = async (e) => {
    e.preventDefault();
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Delivered successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <>
      {/* <h1>order {order._id}</h1> */}
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              <p>
                {order.isDelivered ? (
                  <Message variant="success">
                    Delivered on {order.deliveredAt}
                  </Message>
                ) : (
                  <Message variant="danger">Not delivered</Message>
                )}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment</h3>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              <p>
                {order.isPaid ? (
                  <Message variant="success">
                    paid on {order.paidAt.substring(0, 10)}
                  </Message>
                ) : (
                  <Message variant="danger">Not paid</Message>
                )}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Order Items</h3>
              {order.orderItems.map((item, index) => (
                <Row key={index}>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col>
                    <Link
                      to={`/products/${item.product}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={4}>
                    {item.qty} X ${item.price} = ${item.qty * item.price}
                  </Col>
                </Row>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>items price</Col>
                  <Col>{order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>shipping price</Col>
                  <Col>{order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax </Col>
                  <Col>{order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>Total price</Col>
                  <Col>{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {deliverLoading && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
