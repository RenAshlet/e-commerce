"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "react-bootstrap-icons";
import { useSearchParams } from "next/navigation";
import {
  Navbar,
  Container,
  Button,
  Form,
  Card,
  Row,
  Col,
  Modal,
  Badge,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

const Main = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);

  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const userId = searchParams.get("userId");

  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [getCategory, setCategory] = useState([]);
  const [getProducts, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);

  const [showUsersCartModal, setShowUsersCartModal] = useState(false);
  const handleCloseUsersCartModal = () => setShowUsersCartModal(false);
  const handleShowUsersCartModal = () => setShowUsersCartModal(true);

  const [showDirectOrderModal, setShowDirectOrderModal] = useState(false);
  const handleCloseDirectOrderModal = () => setShowDirectOrderModal(false);
  const handleShowDirectOrderModal = () => setShowDirectOrderModal(true);

  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductPrice, setSelectedProductPrice] = useState("");
  const [selectedProductDescription, setSelectedProductDescription] =
    useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setproductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [cartItems, setCartItems] = useState([]);

  const userLogin = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/users.php";

    const jsonData = {
      username: username,
      password: password,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "userLogin",
      },
    });

    if (response.data.length > 0) {
      let params = new URLSearchParams();
      params.append("userId", response.data[0].user_id);
      params.append("firstname", response.data[0].firstname);
      params.append("lastname", response.data[0].lastname);
      alert("Login Success");
      setUsername("");
      setPassword("");
      router.push(`/?${params}`);
    } else {
      alert("Login failed");
    }
  };

  const retrieveProducts = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/users.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "fetchProducts",
      },
    });
    setProducts(response.data);
  };

  const retrieveProductsbyId = async (productId) => {
    const url = "http://localhost/nextjs/api/e-commerce/users.php";

    const jsonData = {
      productId: productId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "fetchProductsbyId",
      },
    });
    setSelectedProduct(response.data);
    console.log("Product Selected: ", response.data);

    const product = response.data[0];
    setSelectedProductName(product.product_name);
    setSelectedProductPrice(product.product_price);
    setSelectedProductDescription(product.product_description);
    //setCategoryUpdate(product.category_name);
    setCategoryId(product.category_id);
    setproductId(product.product_id);
  };

  const retrieveCategory = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/users.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "fetchCategory",
      },
    });
    setCategory(response.data);
  };

  useEffect(() => {
    retrieveProducts();
    retrieveCategory();
  }, []);

  const handleShowModal = (productId) => {
    retrieveProductsbyId(productId);
    handleShow(true);
  };

  const handleShowCartModal = () => {
    handleShowUsersCartModal(true);
  };

  const handleDirectOrder = (productId) => {
    retrieveProductsbyId(productId);
    handleShowDirectOrderModal(true);
  };

  const filteredAndSearchedProducts = getProducts
    .filter((product) =>
      selectedCategory ? product.category_name === selectedCategory : true
    )
    .filter((product) =>
      product.product_name.toLowerCase().includes(searchProduct.toLowerCase())
    );

  const addToCart = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/users.php";

    const jsonData = {
      userId: userId,
      productId: productId,
      quantity: quantity,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "addToCart",
      },
    });

    if (response.data == 1) {
      alert("Add to cart successful!");
      setQuantity(1);
    } else {
      alert("Add to cart failed!");
    }
  };

  const handleAddToCartClick = () => {
    if (!userId) {
      handleShowLoginModal();
      return;
    }
    if (window.confirm("Add this item to your cart?")) {
      const newItem = {
        productId,
        productName: selectedProductName,
        price: selectedProductPrice,
        quantity,
        selected: false,
      };

      setCartItems((prevItems) => [...prevItems, newItem]);
      setQuantity(1);
      setShow(false);

      const isAddedSuccessfully = true;

      if (isAddedSuccessfully) {
        setCartCount((prevCount) => prevCount + 1);
      }

      if (userId) {
        addToCart();
      }
    }
  };

  const handleCheckboxChange = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].selected = !newCartItems[index].selected;
    setCartItems(newCartItems);
    const selectedItems = newCartItems.filter((item) => item.selected);
    console.log(selectedItems.map((item) => JSON.stringify(item)));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + (item.selected ? item.price * item.quantity : 0),
      0
    );
  };

  const placeOrder = async (selectedItems = []) => {
    if (!userId) {
      handleShowLoginModal();
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/users.php";

    let jsonData;

    if (selectedItems.length === 0) {
      const confirmOrder = window.confirm(
        "Are you sure you want to order this product?"
      );
      if (!confirmOrder) {
        return;
      }
      jsonData = {
        orders: [
          {
            userId: userId,
            productId: productId,
            quantity: quantity,
          },
        ],
      };
    } else {
      const confirmCheckout = window.confirm(
        "Are you sure you want to checkout these items?"
      );
      if (!confirmCheckout) {
        return;
      }
      jsonData = {
        orders: selectedItems.map((item) => ({
          userId: userId,
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
    }

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "orders");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      if (selectedItems.length === 0) {
        alert("Order Successfully!");
        retrieveProducts();
      } else {
        alert("Checkout Successfully!");
        setCartItems(cartItems.filter((item) => !item.selected));
        setCartCount(0);
      }
    } else {
      if (selectedItems.length === 0) {
        alert("Order Failed!");
      } else {
        alert("Checkout Failed!");
      }
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-dark navbar-dark shadow-sm"
        style={{ borderBottom: "2px solid #444" }}
      >
        <Container
          fluid
          className="d-flex flex-wrap justify-content-between align-items-center"
          style={{ minHeight: "56px" }}
        >
          <Navbar.Brand className="m-0 mb-2 mb-lg-0 me-3">
            E-Commerce
          </Navbar.Brand>

          <Navbar.Brand className="m-0 mb-2 mb-lg-0 me-3">
            {firstname} {lastname}
          </Navbar.Brand>

          <div
            className="d-flex align-items-center mb-2 mb-lg-0"
            style={{ flexGrow: 1, maxWidth: "350px", position: "relative" }}
          >
            <Form.Control
              type="search"
              placeholder="Search Products"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              style={{
                paddingRight: "2rem",
                width: "100%",
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

          <div
            style={{
              display: "inline-block",
              position: "relative",
              marginRight: "20px",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="cart-tooltip">Cart</Tooltip>}
            >
              <Icons.Cart
                color="white"
                size="1.5rem"
                className="ms-1"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleShowCartModal();
                }}
              />
            </OverlayTrigger>
            {cartCount > 0 && (
              <Badge
                bg="danger"
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                }}
              >
                {cartCount}
              </Badge>
            )}
          </div>

          <Icons.Person
            color="white"
            size="1.5rem"
            className="ms-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleShowLoginModal();
            }}
          />
        </Container>
      </Navbar>

      <Container className="my-2 mt-4">
        <Row className="justify-content-center">
          {getCategory.map((category, index) => (
            <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-2">
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

      {/* Display products by filter and search */}
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
                    <Row>
                      <Col md={6} className="d-flex justify-content-between">
                        <Button
                          variant="success"
                          className="d-flex align-items-center me-md-2"
                          onClick={() => handleShowModal(product.product_id)}
                        >
                          <Icons.Cart className="me-2" /> Cart
                        </Button>
                        <Button
                          variant="warning"
                          className="d-flex align-items-center"
                          onClick={() => {
                            handleDirectOrder(product.product_id);
                          }}
                        >
                          <Icons.Basket className="me-2" /> Order
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      <Modal show={showLoginModal} onHide={handleCloseLoginModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Login to E-Commerce
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="p-3">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    autoComplete="on"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="on"
                  />
                </Form.Group>

                <Form.Text className="text-center">
                  No account?
                  <Link href="/user/register" className="text-primary ms-1">
                    Register here
                  </Link>
                </Form.Text>
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLoginModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              userLogin();
              handleCloseLoginModal();
            }}
          >
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Product Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Card>
            <Card.Img
              variant="top"
              src="/images/no-image-available.jpg"
              style={{ height: "200px", objectFit: "contain" }}
            />
            <Card.Body>
              <Card.Title>{selectedProductName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                ₱
                {Number(selectedProductPrice).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Card.Subtitle>

              <Card.Text>{selectedProductDescription}</Card.Text>
            </Card.Body>
          </Card>
          <Form.Group className="mt-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>
          <Card.Text
            className="mt-2"
            style={{
              textAlign: "right",
              fontWeight: "bold",
              fontSize: "1.15rem",
            }}
          >
            Total Price: ₱
            {(selectedProductPrice * quantity).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Card.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button
            variant="danger"
            onClick={handleAddToCartClick}
            className="d-flex align-items-center justify-content-center"
          >
            <Icons.Cart className="me-2" /> Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* displaying add to cart product */}
      <Modal
        show={showUsersCartModal}
        onHide={handleCloseUsersCartModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>{item.productName}</td>
                    <td>
                      ₱
                      {item.price.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      ₱
                      {(item.price * item.quantity).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          {cartItems.length > 0 && (
            <p>
              Total price: ₱
              {calculateTotalPrice().toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="secondary" onClick={handleCloseUsersCartModal}>
              Close
            </Button>
            {cartItems.length > 0 &&
              cartItems.some((item) => item.selected) && (
                <Button
                  variant="primary"
                  onClick={() => {
                    const selectedItems = cartItems.filter(
                      (item) => item.selected
                    );
                    placeOrder(selectedItems);
                    handleCloseUsersCartModal();
                  }}
                >
                  Checkout
                </Button>
              )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* for direct order modal */}
      <Modal
        show={showDirectOrderModal}
        onHide={handleCloseDirectOrderModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Card>
            <Card.Img
              variant="top"
              src="/images/no-image-available.jpg"
              style={{ height: "200px", objectFit: "contain" }}
            />
            <Card.Body>
              <Card.Title>{selectedProductName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                ₱
                {Number(selectedProductPrice).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Card.Subtitle>

              <Card.Text>{selectedProductDescription}</Card.Text>
            </Card.Body>
          </Card>
          <Form.Group className="mt-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>
          <Card.Text
            className="mt-2"
            style={{
              textAlign: "right",
              fontWeight: "bold",
              fontSize: "1.15rem",
            }}
          >
            Total Price: ₱
            {(selectedProductPrice * quantity).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Card.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDirectOrderModal}>
            Close
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              placeOrder();
              handleCloseDirectOrderModal();
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <Icons.Basket2 className="me-2" /> Order Placed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Main;
