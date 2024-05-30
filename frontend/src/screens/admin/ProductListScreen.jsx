import { Button, Table, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productApiSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import { useParams } from "react-router-dom";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [createProduct, { isLoading: createloader }] =
    useCreateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    try {
      if (window.confirm("Are you sure? You want to delete the product")) {
        const res = await deleteProduct(id);
        refetch();
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const createHandler = async () => {
    if (window.confirm("Are you sure! you want to create new product")) {
      try {
        await createProduct();
        refetch();
        toast.success("product Created");
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h2>Products</h2>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createHandler}>
            <FaEdit />
            Create Product
          </Button>
        </Col>
      </Row>
      {createloader && <Loader />}
      {isDeleting && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <td>Id</td>
                <td>Name</td>
                <td>Price</td>
                <td>Category</td>
                <td>Brand</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      type="button"
                      className="btn-sm"
                      variant="danger"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
