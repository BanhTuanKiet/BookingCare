import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./styles.css";

const Signin = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg form-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center mb-4">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <Form>
            {isSignUp && (
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" />
            </Form.Group>
            <Button variant="primary" className="w-100" type="submit">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </Form>
          <motion.p
            className="toggle-text mt-3 text-center"
            onClick={toggleForm}
            whileHover={{ scale: 1.1 }}
            style={{ cursor: "pointer" }}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </motion.p>
        </motion.div>
      </Card>
    </Container>
  );
};

export default Signin;