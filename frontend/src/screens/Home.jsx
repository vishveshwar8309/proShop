// import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
// import axios from "axios";

function Home() {
    // const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         const { data } = await axios.get("/api/products");
    //         setProducts(data);
    //     };
    //     fetchProducts();
    // }, []);
    const { data: products, isLoading, isError } = useGetProductsQuery();

    return (
        <>
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
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </>
    );
}

export default Home;
