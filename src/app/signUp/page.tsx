// app/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./style.css";
import Logo from "../images/DPME-Logo-1024x349.jpg";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBContainer,
} from "mdb-react-ui-kit";
import Link from "next/link";
import { useSnackbar } from "../context/SnackBar";
import { Box, CircularProgress, TextField } from "@mui/material";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);

    const requestBody = {
      email,
      firstName,
      lastName,
      password,
    };

    console.log("Request Body:", requestBody);
    try {
      const response = await fetch("http://192.168.8.6:8033/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "opt-key-dev-2024",
        },
        body: JSON.stringify(requestBody),
      });

      console.log();

      if (response.ok) {
        // Handle successful response

        // Show success message
        showMessage("SignUp Successful!", "success", 5000);

        //Redirect to login page
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } else if (response.status === 409) {
        // Handle 409 Conflict error (e.g., email already in use)
        showMessage(
          "Email already in use. Please use a different email.",
          "error",
          2000
        );
      } else {
        // Handle other errors
        const errorData = await response.json();
        showMessage(
          errorData.message || "Failed to sign up. Please try again.",
          "error",
          1000
        );
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      showMessage("Failed to sign up. Please try again.", "error", 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box  style={{
        backgroundColor: "#283028", // Replace with your desired color
        minHeight: "100vh",
      }}>
      <MDBContainer >
        <MDBRow fluid
        className=" align-items-center justify-content-center"
        style={{ minHeight: "90vh" }}>
          <MDBCol lg="4">
            <MDBCard alignment="center">
              <div className="text-center my-4 mx-4">
                <Image src={Logo} alt="logo"></Image>
              </div>
              <MDBCardBody>
                <MDBCardTitle className="mb-4">Sign Up</MDBCardTitle>
                <form onSubmit={handleSubmit}>
                  <TextField
                  size="small"
                  fullWidth
                    className="mb-4"
                    type="text"
                    id="form2Example1"
                    label="Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <TextField
                  size="small"
                  fullWidth
                    className="mb-4"
                    type="text"
                    id="form2Example1"
                    label="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  <TextField
                  size="small"
                  fullWidth
                    className="mb-4"
                    type="email"
                    id="form2Example1"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <TextField
                  size="small"
                  fullWidth
                    className="mb-4"
                    type="password"
                    id="form2Example2"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <MDBBtn
                    type="submit"
                    className="mb-4 no-hover-fill"
                    block
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={30} color="inherit" />
                    ) : (
                      "Sign Up"
                    )}
                  </MDBBtn>

                  <div className="text-center">
                    <p>
                      Already have an account? {""}
                      <Link href="/login" passHref>
                        {" "}
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </Box>
  );
}
