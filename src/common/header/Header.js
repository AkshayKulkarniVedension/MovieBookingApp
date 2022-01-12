import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

import { CardContent } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Modal } from "@material-ui/core";
import { Tabs } from "@material-ui/core";
import { Tab } from "@material-ui/core";
import { Typography } from "@material-ui/core";

import { InputLabel } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import { Input } from "@material-ui/core";

import { withStyles } from "@material-ui/core";

import "./Header.css";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

class Header extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      value: 0,
      userNameRequired: "dispNone",
      userName: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      firstNameRequred: "dispNone",
      firstName: "",
      lastNameRequired: "dispNone",
      lastName: "",
      emailRequred: "dispNone",
      email: "",
      registerPasswordRequired: "dispNone",
      registerPassword: "",
      contactRequired: "dispNone",
      contact: "",
      registrationSuccess: false,
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
    };
  }

  openModalHandler = () => {
    this.setState({
      modalIsOpen: true,
      value: 0,
      userNameRequired: "dispNone",
      userName: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      firstNameRequred: "dispNone",
      firstName: "",
      lastNameRequired: "dispNone",
      lastName: "",
      emailRequred: "dispNone",
      email: "",
      registerPasswordRequired: "dispNone",
      registerPassword: "",
      contactRequired: "dispNone",
      contact: "",
    });
  };

  closeModalHandler = () => {
    this.setState({ modalIsOpen: false });
  };

  tabChangeHandler = (event, value) => {
    this.setState({ value });
  };

  loginClickHandler = () => {
    this.state.userName === ""
      ? this.setState({ userNameRequired: "dispBlock" })
      : this.setState({ userNameRequired: "dispNone" });
    this.state.loginPassword === ""
      ? this.setState({ loginPasswordRequired: "dispBlock" })
      : this.setState({ loginPasswordRequired: "dispNone" });

    let dataLogin = null;
    let that = this;
    let xhrLogin = new XMLHttpRequest();
    xhrLogin.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        sessionStorage.setItem("uuid", JSON.parse(this.responseText), "id");
        if (xhrLogin.getResponseHeader("access-token") == null) {
          sessionStorage.setItem(
            "access-token",
            JSON.parse(this.responseText)["access-token"]
          );
        }
        that.setState({ loggedIn: true });
        this.closeModalHandler();
      }
    });

    xhrLogin.open("post", this.props.baseUrl + "auth/login");

    xhrLogin.setRequestHeader(
      "Authorization",
      "Basic" +
        window.btoa(this.state.userName + ":" + this.state.loginPassword)
    );
    xhrLogin.setRequestHeader("Content-Type", "application/json");
    xhrLogin.setRequestHeader("cache-Control", "no-cache");
    xhrLogin.send(dataLogin);
  };

  inputUsernameChangeHandler = (event) => {
    this.setState({ userName: event.target.value });
  };
  inputLoginPasswordChangeHandler = (event) => {
    this.setState({ loginPassword: event.target.value });
  };

  registerClickHandler = () => {
    this.state.firstName === ""
      ? this.setState({ firstNameRequred: "dispBlock" })
      : this.setState({ firstNameRequred: "dispNone" });

    this.state.lastName === ""
      ? this.setState({ lastNameRequired: "dispBlock" })
      : this.setState({ lastNameRequired: "dispNone" });

    this.state.email === ""
      ? this.setState({ emailRequred: "dispBlock" })
      : this.setState({ emailRequred: "dispNone" });

    this.state.registerPassword === ""
      ? this.setState({ registerPasswordRequired: "dispBlock" })
      : this.setState({ registerPasswordRequired: "dispNone" });

    this.state.contact === ""
      ? this.setState({ contactRequired: "dispBlock" })
      : this.setState({ contactRequired: "dispNone" });

    let dataSignup = JSON.stringify({
      email_address: this.state.email,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      mobile_number: this.state.contact,
      password: this.state.registerPassword,
    });

    let xhrSignup = new XMLHttpRequest();
    xhrSignup.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        this.setState({ registrationSuccess: true });
      }
    });
    xhrSignup.open("POST", this.props.baseUrl + "auth/signup");
    xhrSignup.setRequestHeader("Content-Type", "application/json");
    xhrSignup.setRequestHeader("Cache-Control", "no-cache");
    xhrSignup.send(dataSignup);
  };
  inputFirstNameChangeHandler = (event) => {
    this.setState({ firstName: event.target.value });
  };
  inputLastNameChangeHandler = (event) => {
    this.setState({ lastName: event.target.value });
  };
  inputEmailChangeHandler = (event) => {
    this.setState({ email: event.target.value });
  };
  inputRegisterPasswardChangeHandler = (event) => {
    this.setState({ registerPassword: event.target.value });
  };
  inputContactChangeHandler = (event) => {
    this.setState({ contact: event.target.value });
  };

  logoutHandler = (event) => {
    let dataSignout = JSON.stringify({
      uuid: sessionStorage.getItem("uuid"),
    });

    let xhrSignout = new XMLHttpRequest();
    xhrSignout.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (
          JSON.parse(this.responseText).message == "Logged Out successfully."
        ) {
          sessionStorage.removeItem("uuid");
          sessionStorage.removeItem("access-token");

          this.setState({ loggedIn: false });
        }
      }
    });
  };

  render() {
    return (
      <div>
        <header className="app-header">
          <img
            src="../../assets/logo.svg"
            className="app-logo"
            alt="Movies App Logo"
          />
          {!this.state.loggedIn ? (
            <div className="login-button">
              <Button
                variant="contained"
                color="default"
                onClick={this.openModalHandler}
              >
                Login
              </Button>
            </div>
          ) : (
            <div className="login-button">
              <Button
                variant="contained"
                color="default"
                onClick={this.logoutHandler}
              >
                Logout
              </Button>
            </div>
          )}
          {this.props.showBookShowButton === "true" && !this.state.loggedIn ? (
            <div className="bookshow-button">
              <Button
                variant="contained"
                color="primary"
                onClick={this.openModalHandler}
              >
                Book Show
              </Button>
            </div>
          ) : (
            ""
          )}
          {this.props.showBookShowButton === "true" && this.state.loggedIn ? (
            <div className="bookshow-button">
              <Link to={"/bookshow/" + this.props.id}>
                <Button variant="contained" color="primary">
                  Book Show
                </Button>
              </Link>
            </div>
          ) : (
            ""
          )}
        </header>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          contentLabel="Login"
          onRequestClose={this.closeModalHandler}
          style={customStyles}
        >
          <div>
            <Tabs
              className="tabs"
              value={this.state.value}
              onChange={this.tabChangeHandler}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
            {this.state.value === 0 && (
              <TabContainer>
                <FormControl required>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <input
                    id="username"
                    type="text"
                    username={this.state.userName}
                    onChange={this.inputUsernameChangeHandler}
                  />
                  <FormHelperText className={this.state.userNameRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br /> <br />
                <FormControl required>
                  <InputLabel htmlFor="loginPassword">Password</InputLabel>
                  <Input
                    id="loginPassword"
                    type="password"
                    loginpassword={this.state.loginPassword}
                    onChange={this.inputLoginPasswordChangeHandler}
                  />
                  <FormHelperText className={this.state.loginPasswordRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br /> <br />
                {this.state.loggedIn === true && (
                  <FormControl>
                    <span className="successText">Login Successful!</span>
                  </FormControl>
                )}
                <br /> <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.loginClickHandler}
                >
                  LOGIN
                </Button>
              </TabContainer>
            )}

            {this.state.value === 1 && (
              <TabContainer>
                <FormControl required>
                  <InputLabel htmlFor="firstname">First Name</InputLabel>
                  <Input
                    id="firstname"
                    type="text"
                    firstName={this.state.firstName}
                    onChange={this.inputFirstNameChangeHandler}
                  />
                  <FormHelperText className={this.state.firstNameRequred}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br /> <br />
                <FormControl required>
                  <InputLabel htmlFor="lastname">Last Name</InputLabel>
                  <Input
                    id="lastname"
                    type="text"
                    lastName={this.state.lastName}
                    onChange={this.inputLastNameChangeHandler}
                  />
                  <FormHelperText className={this.state.lastNameRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl required>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    id="email"
                    type="text"
                    email={this.state.email}
                    onChange={this.inputEmailChangeHandler}
                  />
                  <FormHelperText className={this.state.emailRequred}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl required>
                  <InputLabel htmlFor="registerPassword">Password</InputLabel>
                  <Input
                    id="registerPassword"
                    type="password"
                    registerPassword={this.state.registerPassword}
                    onChange={this.inputRegisterPasswardChangeHandler}
                  />
                  <FormHelperText
                    className={this.state.registerPasswordRequired}
                  >
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl required>
                  <InputLabel htmlFor="contact">Contact No.</InputLabel>
                  <Input
                    id="contact"
                    type="text"
                    contact={this.state.contact}
                    onChange={this.inputContactChangeHandler}
                  />
                  <FormHelperText className={this.state.contactRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                {this.state.registrationSuccess === true && (
                  <FormControl>
                    <span className="successText">
                      Register Successful. Please Login !
                    </span>
                  </FormControl>
                )}
                <br /> <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.registerClickHandler}
                >
                  {" "}
                  REGISTER{" "}
                </Button>
              </TabContainer>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}
export default withStyles(customStyles)(Header);
