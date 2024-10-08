"use client";
import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Offcanvas,
  Form,
  Row,
  Col,
} from "react-bootstrap";

const Category = () => {
  const [category, setCategory] = useState("");

  const [showCanvas, setShowCanvas] = useState(false);
  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShowCanvas = () => setShowCanvas(true);

  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");

  const addCategory = async () => {
    if (!category) {
      alert("Input field required!");
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      categoryName: category,
      admin: adminId,
    };

    console.log(jsonData);
    const formData = new FormData();
    formData.append("operation", "adminAddCategory");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      alert("Add Category Successful!");
      setCategory("");
    } else {
      alert("Add Category Failed");
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-dark navbar-dark shadow-sm"
        style={{ borderBottom: "2px solid #444" }}
      >
        <Container fluid className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <Navbar.Brand className="m-0">Admin Panel</Navbar.Brand>
            <Button
              onClick={handleShowCanvas}
              className="ms-2"
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: 0,
                fontSize: "1.5rem",
                color: "#fff",
              }}
              aria-label="Toggle navigation"
            >
              ☰
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Off-canvas navigation */}
      <Offcanvas
        show={showCanvas}
        onHide={handleCloseCanvas}
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            {firstname} {lastname}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link
              href={`./dashboard?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
              onClick={handleCloseCanvas}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              href={`./products?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
              onClick={handleCloseCanvas}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Products
            </Nav.Link>
            <Nav.Link
              href={`./category?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
              onClick={handleCloseCanvas}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Category
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                autoComplete="on"
                style={{
                  textTransform: "capitalize",
                  padding: "10px",
                  fontSize: "16px",
                }}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={addCategory}
              className="w-100"
              style={{ padding: "12px", fontSize: "16px" }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Category;
