import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Button,
  ListGroup,
  Card,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import Meta from "../components/Meta";

function ProductScreen() {
  const { id: productId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: isAdding }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    setComment("");
    setRating(0);
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go back
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={4}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={5}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6>Price: {product.price}</h6>
                </ListGroup.Item>
                <ListGroup.Item>{product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>$ {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      variant="dark"
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="reviews">
            <h3>Reviews</h3>
            <Col md={6}>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating rating={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h4>Write a customer Review</h4>
                  {isAdding && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment: </Form.Label>
                        <Form.Control
                          as="textarea"
                          required
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button type="submit" variant="light" disabled={isAdding}>
                        submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login"> login</Link> to add a Review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ProductScreen;
