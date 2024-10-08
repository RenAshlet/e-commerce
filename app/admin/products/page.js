"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Offcanvas,
  Form,
  Card,
  Row,
  Col,
  Modal,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";

const Products = () => {
  //---------for displaying the offcanvas---------//
  const [showCanvas, setShowCanvas] = useState(false);
  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShowCanvas = () => setShowCanvas(true);

  //---------------for displaying add product modal----------------//
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);
  const handleShowAddProductModal = () => setShowAddProductModal(true);

  //---------------for displaying update product modal----------------//
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = () => setShowUpdateModal(true);

  //---------------for displaying view product modal----------------//
  const [showProductsModal, setShowProductsModal] = useState(false);
  const handleCloseProductsModal = () => setShowProductsModal(false);
  const handleShowProductsModal = () => setShowProductsModal(true);

  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const adminId = searchParams.get("adminId");

  const [getProducts, setGetProducts] = useState([]); //retrieve all products
  const [getProductById, setProductById] = useState([]); //retrieve products by its id
  const [getCategory, setGetCategory] = useState([]); //retrieve all categories

  //--------------for adding new products states--------------//
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");

  const [searchProduct, setSearchProduct] = useState(""); //for searching products
  const [selectedCategory, setSelectedCategory] = useState(""); //dropdown category selection

  //--------------for updating products states--------------//
  const [productNameUpdate, setProductNameUpdate] = useState("");
  const [productPriceUpdate, setProductPriceUpdate] = useState("");
  const [productDescriptionUpdate, setProductDescriptionUpdate] = useState("");
  const [categoryUpdate, setCategoryUpdate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");

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

  //update products
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

  //show update modal
  const showUpdateModalForm = (productId) => {
    retrieveProductsById(productId);
    handleShowUpdateModal(true);
  };

  //retrieve products from API
  const retrieveProducts = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "adminDisplayProduct",
      },
    });

    setGetProducts(response.data);
  };

  //retrieve products from API by product id
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

  //retrieve categories from API
  const retrieveCategory = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "adminDisplayCategory",
      },
    });
    setGetCategory(response.data);
  };

  useEffect(() => {
    retrieveProducts();
    retrieveCategory();
  }, []);

  const handleSelectionCategory = (event) => {
    setCategory(event.target.value);
  };

  //combine filter buttons and search
  const filteredAndSearchedProducts = getProducts
    .filter((product) =>
      selectedCategory ? product.category_name === selectedCategory : true
    )
    .filter((product) =>
      product.product_name.toLowerCase().includes(searchProduct.toLowerCase())
    );

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

            <div
              className="ms-3"
              style={{ position: "relative", width: "250px" }}
            >
              <Form.Control
                type="search"
                placeholder="Search Products"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                style={{
                  paddingRight: "2rem",
                }}
              />
              <Icons.Search
                color="gray"
                size="1.2rem"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            </div>
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

      {/* for adding new product button */}
      <Button
        variant="dark"
        className="mt-3 ms-3 d-flex align-items-center gap-2"
        onClick={handleShowAddProductModal}
      >
        Add Products
      </Button>

      {/* filter buttons category */}
      <Container className="my-2 mt-4">
        <Row className="justify-content-center">
          {getCategory.map((category) => (
            <Col
              key={category.category_id}
              xs={6}
              sm={4}
              md={3}
              lg={2}
              className="mb-2"
            >
              <Button
                variant={
                  selectedCategory === category.category_name
                    ? "dark"
                    : "outline-dark"
                }
                className="w-100"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.category_name
                      ? ""
                      : category.category_name
                  )
                }
                size="md"
              >
                {category.category_name}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>

      {/* display products by filter and search  */}
      <Container
        className="my-2"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <Row className="justify-content-center">
          {filteredAndSearchedProducts.length === 0 ? (
            <Col xs={12} className="text-center">
              <h5>No products found</h5>
            </Col>
          ) : (
            filteredAndSearchedProducts.map((product, index) => (
              <Col key={index} xs={6} sm={6} md={4} lg={3} className="mb-4">
                <Card className="shadow-sm" style={{ borderRadius: "8px" }}>
                  <Card.Img
                    variant="top"
                    src="/images/no-image-available.jpg"
                  />
                  <Card.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <div>
                      <Card.Title
                        style={{
                          textTransform: "capitalize",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                        }}
                      >
                        {product.product_name}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "0.95rem" }}>
                        ₱
                        {Number(product.product_price).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Card.Text>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-view`}>View</Tooltip>}
                    >
                      <Icons.Eye
                        color="red"
                        size={"1.50rem"}
                        onClick={() => {
                          handleShowProductsModal();
                          retrieveProductsById(product.product_id);
                        }}
                        style={{ marginRight: "0.85rem", cursor: "pointer" }}
                      />
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-edit`}>Edit</Tooltip>}
                    >
                      <Icons.PencilSquare
                        color="blue"
                        size={"1.5rem"}
                        onClick={() => showUpdateModalForm(product.product_id)}
                        style={{ marginRight: "0.85rem", cursor: "pointer" }}
                      />
                    </OverlayTrigger>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* add modal */}
      <Modal
        show={showAddProductModal}
        onHide={handleCloseAddProductModal}
        centered
      >
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

      {/* view modal */}
      <Modal
        show={showProductsModal}
        onHide={handleCloseProductsModal}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>View Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Img
              variant="top"
              src="/images/no-image-available.jpg"
              style={{ height: "200px", objectFit: "contain" }}
            />
            <Card.Body>
              <Card.Title>{productNameUpdate}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                ₱
                {parseFloat(productPriceUpdate).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Card.Subtitle>

              <Card.Text>{productDescriptionUpdate}</Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProductsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal} centered>
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
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCloseUpdateModal(false);
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
