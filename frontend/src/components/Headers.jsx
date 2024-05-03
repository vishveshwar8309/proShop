import { Navbar, Nav, Container } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";

const Headers = () => {
    return (
        <header>
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img src={logo} alt="proShop" />
                            proShop
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls=" basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <FaShoppingCart />
                                    cart
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/user">
                                <Nav.Link>
                                    <FaUser />
                                    signin
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Headers;