import { Container, Row, Col } from "react-bootstrap";

function Footers() {
    const currentYear = new Date().getFullYear();
    return (
        <footer>
            <Container>
                <Row className="text-center py-3">
                    <Col>proShop &copy; {currentYear}</Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footers;
