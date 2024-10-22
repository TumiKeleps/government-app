/* eslint-disable @typescript-eslint/no-unused-vars */
// app/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import "./style.css";
import Logo from "../images/DPME-Logo-1024x349.jpg";
import { Box, CircularProgress } from "@mui/material"; // Import the spinner
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
  MDBContainer,
} from "mdb-react-ui-kit";
import Link from "next/link";
import { useSnackbar } from "../context/SnackBar";

export default function Login() {
  const { showMessage } = useSnackbar();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const router = useRouter();



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts
  
    try {
      await login(username, password);
      showMessage("Login successful!", "success", 5000);
      router.push("/dashboard");
    } catch (error) {
      showMessage(
        "Failed to login. Please check your credentials.",
        "error",
        2000
      );
    }finally{
        setLoading(false)
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
            <MDBCard className="shadow-5-strong" alignment="center">
              <div className="text-center my-4 mx-4">
                <Image src={Logo} alt="logo"></Image>
              </div>
              <MDBCardBody>
                <MDBCardTitle>Sign In</MDBCardTitle>
                <form onSubmit={handleSubmit}>
                  <MDBInput
                    className="mb-4"
                    type="email"
                    id="form2Example1"
                    label="Email address"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <MDBInput
                    className="mb-4"
                    type="password"
                    id="form2Example2"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                    required
                  />

                  <MDBRow className="mb-4">
                    <MDBCol className="d-flex justify-content-center">
                      <MDBCheckbox
                        id="form2Example3"
                        label="Remember me"
                        defaultChecked
                      />
                    </MDBCol>
                  </MDBRow>

                   {/* Show button or spinner depending on loading state */}
                   <MDBBtn type="submit" className="mb-4 no-hover-fill" block disabled={loading}>
                    {loading ? (
                      <CircularProgress size={30} color="inherit" />
                    ) : (
                      "Sign in"
                    )}
                  </MDBBtn>

                  <div className="text-center">
                    <p>
                      Not a member? {""}
                      <Link href="/signUp" passHref>
                        {" "}
                        Sign Up
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
