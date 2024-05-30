import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        value={keyword}
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        className="mr-sm-2 ml-sm-5"
        placeholder="Search Products..."
      ></Form.Control>
      <Button type="submt" variant="outline-light" className="px-2 mx-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
