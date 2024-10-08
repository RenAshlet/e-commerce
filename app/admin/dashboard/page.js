"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";

const Dashboard = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShowCanvas = () => setShowCanvas(true);

  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const adminId = searchParams.get("adminId");

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
              className="ms-4"
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
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Dashboard;
