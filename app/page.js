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
  const [getUsersCartId, setGetUsersCartId] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);

  const [showUsersCartModal, setShowUsersCartModal] = useState(false);
  const handleCloseUsersCartModal = () => setShowUsersCartModal(false);
  const handleShowUsersCartModal = () => setShowUsersCartModal(true);

  const [showUserOrderModal, setShowUserOrderModal] = useState(false);
  const handleCloseUserOrderModal = () => setShowUserOrderModal(false);
  const handleShowUserOrderModal = () => setShowUserOrderModal(true);

  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductPrice, setSelectedProductPrice] = useState("");
  const [selectedProductDescription, setSelectedProductDescription] =
    useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setproductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleProductSelect = (productId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

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

  const retriveUsersCartId = async (userId) => {
    const url = "http://localhost/nextjs/api/e-commerce/users.php";

    const jsonData = {
      userId: userId,
    };

    const formData = new FormData();
    formData.append("operation", "fetchCart");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    console.log("User's cart", response.data);
    setGetUsersCartId(response.data);
  };

  useEffect(() => {
    retrieveProducts();
    retrieveCategory();
    // retriveCart();
  }, []);

  const handleShowModal = (productId) => {
    retrieveProductsbyId(productId);
    handleShow(true);
  };

  const handleShowOrderModal = (productId) => {
    retrieveProductsbyId(productId);
    handleShowUserOrderModal(true);
  };

  const handleShowCartModal = () => {
    if (!userId) {
      handleShowLoginModal();
      return;
    }

    retriveUsersCartId(userId);
    handleShowUsersCartModal(true);
  };

  //for filter products and categories
  const filteredAndSearchedProducts = getProducts
    .filter((product) =>
      selectedCategory ? product.category_name === selectedCategory : true
    )
    .filter((product) =>
      product.product_name.toLowerCase().includes(searchProduct.toLowerCase())
    );

    // for add to cart
  const addToCart = async () => {
    if (!userId) {
      handleShowLoginModal();
      return;
    }
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

  const placeOrder = async (products) => {
    if (!userId) {
      handleShowLoginModal();
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/users.php";

    let orderDetails;
    if (Array.isArray(products)) {
      orderDetails = products.map((productId) => {
        const selectedProduct = getUsersCartId.find(
          (product) => product.product_id === productId
        );
        return {
          productId: productId,
          quantity: selectedProduct.quantity,
        };
      });
    } else {
      orderDetails = [
        {
          productId: products,
          quantity: 1,
        },
      ];
    }

    const jsonData = {
      userId: userId,
      products: orderDetails,
    };

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "orders");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data === 1) {
      alert("Order Successful!");
      setSelectedProducts("");
    } else {
      alert("Order Failed");
    }
  };

  // const userOrder = async () => {
  //   if (!userId) {
  //     handleShowLoginModal();
  //     return;
  //   }

  //   const url = "http://localhost/nextjs/api/e-commerce/users.php";

  //   const jsonData = {
  //     userId: userId,
  //     productId: productId,
  //     quantity: quantity,
  //   };

  //   console.log(jsonData);

  //   const formData = new FormData();
  //   formData.append("operation", "orders");
  //   formData.append("json", JSON.stringify(jsonData));

  //   const response = await axios({
  //     url: url,
  //     method: "POST",
  //     data: formData,
  //   });

  //   if (response.data === 1) {
  //     alert("Order Successful!");
  //   } else {
  //     alert("Order Failed");
  //   }
  // };

  // const checkOutCart = async () => {
  //   if (!userId) {
  //     handleShowLoginModal();
  //     return;
  //   }

  //   const url = "http://localhost/nextjs/api/e-commerce/users.php";

  //   const orderDetails = selectedProducts.map((productId) => {
  //     const selectedProduct = getUsersCartId.find(
  //       (product) => product.product_id === productId
  //     );
  //     return {
  //       productId: productId,
  //       quantity: selectedProduct.quantity,
  //     };
  //   });

  //   const jsonData = {
  //     userId: userId,
  //     products: orderDetails,
  //   };

  //   console.log(jsonData);

  //   const formData = new FormData();
  //   formData.append("operation", "checkOut");
  //   formData.append("json", JSON.stringify(jsonData));

  //   const response = await axios({
  //     url: url,
  //     method: "POST",
  //     data: formData,
  //   });

  //   if (response.data === 1) {
  //     alert("Order Successful!");
  //     setSelectedProducts("");
  //   } else {
  //     alert("Order Failed");
  //   }
  // };

  // const handleOrderClick = () => {
  //   if (!userId) {
  //     handleShowLoginModal();
  //     return;
  //   }

  //   if (window.confirm("Are you sure to order this product?")) {
  //     userOrder();
  //     setShowUserOrderModal(false);
  //   }
  // };

  const handleAddToCartClick = () => {
    if (!userId) {
      handleShowLoginModal();
      return;
    }

    if (
      window.confirm("Are you sure you want to add this product to your cart?")
    ) {
      addToCart();
      setShow(false);

      const isAddedSuccessfully = true;

      if (isAddedSuccessfully) {
        setCartCount((prevCount) => prevCount + 1);
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
            <Icons.Cart
              color="white"
              size="1.5rem"
              className="ms-1"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleShowCartModal(userId);
              }}
            />
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
                      <Col className="d-flex justify-content-between">
                        <Button
                          variant="success"
                          className="d-flex align-items-center"
                          onClick={() => handleShowModal(product.product_id)}
                        >
                          <Icons.Cart className="me-2" /> Cart
                        </Button>
                        <Button
                          variant="warning"
                          className="d-flex align-items-center"
                          onClick={() => {
                            handleShowOrderModal(product.product_id);
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

      {/* for login modal */}
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

      {/* for add to cart modal */}
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
            Total: ₱
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

      {/* for order modal */}
      <Modal
        show={showUserOrderModal}
        onHide={handleCloseUserOrderModal}
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
            Total: ₱
            {(selectedProductPrice * quantity).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Card.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserOrderModal}>
            Close
          </Button>

          <Button
            variant="success"
            onClick={() => {
              placeOrder(productId);
              handleCloseUserOrderModal();
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <Icons.Cart className="me-2" /> Order placed
          </Button>
        </Modal.Footer>
      </Modal>

      {/* for displaying cart modal */}
      <Modal
        show={showUsersCartModal}
        onHide={handleCloseUsersCartModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {getUsersCartId.map((product, index) => (
                <tr key={`${product.product_id}-${index}`}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={() => handleProductSelect(product.product_id)}
                    />
                  </td>
                  <td>{product.product_name}</td>
                  <td>{product.formatted_price}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUsersCartModal}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              placeOrder(selectedProducts);
              handleCloseUsersCartModal();
            }}
            disabled={selectedProducts.length === 0}
          >
            Order placed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Main;
