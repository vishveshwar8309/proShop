// import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
// import axios from "axios";

function Home() {
  const { keyword, pageNumber } = useParams();
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //     const fetchProducts = async () => {
  //         const { data } = await axios.get("/api/products");
  //         setProducts(data);
  //     };
  //     fetchProducts();
  // }, []);
  const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword && <ProductCarousel />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <h3>Latest products</h3>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
}

export default Home;
