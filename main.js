"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Collapse,
  Form,
  Table,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import * as Icons from 'react-bootstrap-icons';
import AdminNavbar from "@/components/admin/navbar";

const Products = () => {
  //---------------------for adding new product-------------------//
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");

  //---------------get data from API----------------------------//
  const [getCategory, setGetCategory] = useState([]);
  const [getProduct, setGetProduct] = useState([]);
  const [getProductById, setProductById] = useState([]);

  //-------------------search params from login-----------//
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");

  //-------------------for update modal------------------------//
  const [showUpdate, setShowUpdate] = useState(false);
  const handleCloseModal = () => setShowUpdate(false);
  const handleShowModal = () => setShowUpdate(true);

  //-------------------for adding new product modal--------------//
  const [showAddProduct, setShowAddProduct] = useState(false);
  const handleCloseAddProductModal = () => setShowAddProduct(false);
  const handleShowAddProductModal = () => setShowAddProduct(true);

  //-----------------for update modal form field display-------------------//
  const [productNameUpdate, setProductNameUpdate] = useState("");
  const [productPriceUpdate, setProductPriceUpdate] = useState("");
  const [productDescriptionUpdate, setProductDescriptionUpdate] = useState("");
  const [categoryUpdate, setCategoryUpdate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");

  const retrieveProducts = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";
    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "adminDisplayProduct",
      },
    });
    setGetProduct(response.data);
    console.log("All Products: ", response.data);
  };

  const retrieveProductsById = async (productId) => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      productId: productId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "adminDisplayProductById",
      },
    });
    setProductById(response.data);
    console.log("Selected Product:", response.data);

    const product = response.data[0];
    setProductNameUpdate(product.product_name);
    setProductPriceUpdate(product.product_price);
    setProductDescriptionUpdate(product.product_description);
    setCategoryUpdate(product.category_name);
    setCategoryId(product.category_id);
    setProductId(product.product_id);
  };

  const showUpdateModalForm = (productId) => {
    retrieveProductsById(productId);
    handleShowModal(true);
  };

  const retrieveCategory = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "adminDisplayCategory",
      },
    });
    setGetCategory(response.data);
    console.log("Categories: ", response.data);
  };

  useEffect(() => {
    retrieveCategory();
    retrieveProducts();
  }, []);

  const handleSelectionCategory = (event) => {
    setCategory(event.target.value);
  };

  const addProduct = async () => {
    if (!productName || !productPrice || !productDescription || !category) {
      alert("Input field required!");
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      productName: productName,
      productPrice: productPrice,
      productDescription: productDescription,
      category: category,
      admin: adminId,
    };

    console.log(jsonData);

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "adminAddProduct",
      },
    });

    if (response.data == 1) {
      alert("Product added successfully!");
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setCategory("");
      retrieveProducts();
    } else {
      alert("Failed to add product!");
    }
  };

  const updateProducts = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      productId: productId,
      productName: productNameUpdate,
      productPrice: productPriceUpdate,
      productDescription: productDescriptionUpdate,
      category: categoryId,
      admin: adminId,
    };

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "adminUpdateProduct");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      alert("Product Updated Successfully");
      retrieveProducts();
    } else {
      alert("Product Update Failed");
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container>
        <Row>
          <Col>
            <Button
              variant="primary"
              className="mt-3 d-flex align-items-center gap-2"
              onClick={handleShowAddProductModal}
              style={{
                cursor: "pointer",
                padding: "0.5rem 1.5rem",
                borderRadius: "0.375rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
            >
              <Plus size={"2rem"} />
              Add Products
            </Button>
          </Col>
        </Row>

        {/* Product Table */}
        <Row className="mt-5">
          <Col>
            <Table striped bordered hover responsive className="table-lg">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Product Name</th>
                  <th>Product Price</th>
                  <th>Product Description</th>
                  <th>Category</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getProduct.map((product, index) => (
                  <tr key={index}>
                    <td>{product.product_name}</td>
                    <td>{product.product_price}</td>
                    <td>{product.product_description}</td>
                    <td>{product.category_name}</td>
                    <td style={{ textAlign: "center" }}>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-${index}`}>Edit</Tooltip>
                        }
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            showUpdateModalForm(product.product_id)
                          }
                        >
                          <Pen />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      {/* add product modal */}
      <Modal show={showAddProduct} onHide={handleCloseAddProductModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mt-3">
            <Row>
              <Col>
                <Form.Group controlId="productName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    autoComplete="on"
                    style={{ textTransform: "capitalize" }}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="productPrice">
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="Enter product price"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="productDescription">
                  <Form.Label className="mt-2">Product Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Enter product description"
                    className="mb-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={handleSelectionCategory}
              >
                <option value="">--Select Category--</option>
                {getCategory.map((category, index) => (
                  <option key={index} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddProductModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addProduct();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update product modal */}
      <Modal show={showUpdate} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="table-borderless">
            <tbody>
              <tr>
                <th style={{ width: "30%" }}>Product Name</th>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={productNameUpdate}
                    onChange={(e) => setProductNameUpdate(e.target.value)}
                    className="mb-3"
                  />
                </td>
              </tr>
              <tr>
                <th>Product Price</th>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="Enter product price"
                    value={productPriceUpdate}
                    onChange={(e) => setProductPriceUpdate(e.target.value)}
                    className="mb-3"
                  />
                </td>
              </tr>
              <tr>
                <th>Product Description</th>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter product description"
                    value={productDescriptionUpdate}
                    onChange={(e) =>
                      setProductDescriptionUpdate(e.target.value)
                    }
                    className="mb-3"
                  />
                </td>
              </tr>
              <tr>
                <th>Category</th>
                <td>
                  <Form.Select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mb-3"
                  >
                    <option>Select a category</option>
                    {getCategory.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </Form.Select>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCloseModal(false);
              updateProducts();
            }}
          >
            Update Products
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Products;
