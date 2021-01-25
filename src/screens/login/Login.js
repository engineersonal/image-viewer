import React, { Component } from "react";
import Header from "../../common/header/Header";
import "./Login.css";
import Card from "@material-ui/core/Card";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Redirect } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      usernameRequired: "dispNone",
      passwordRequired: "dispNone",
      incorrectUsernamePasswordMessage: "dispNone",
      username: "",
      password: "",
      isLoggedIn: false,
    };
  }

  /**
   * Function that handles any changes in the username field and updates state accordingly
   */
  inputUsernameChangeHandler = (e) => {
    this.setState({ username: e.target.value });
  };

  /**
   * Function that handles any changes in the password field and updates state accordingly
   */
  inputPasswordChangeHandler = (e) => {
    this.setState({ password: e.target.value });
  };

  /**
   * Function that handles what happens when we click the login button
   */
  loginClickHandler = () => {
    //Setting credentials in the login handler
    let username = "Admin";
    let password = "Sonal@123";

    let accessToken =
      "IGQVJVYTk2Q1d1NG0xOU5Td3p4QUkzQ0NTQkk1bi1kcGVmOXBjbWN1SUE2b1JqQ1lLNmpEZAHdwc3RacmZAQbTc4Q2pUd05qM213NjduMWppSXYxMVRlMk04SEFIcGpkYTk3am9mei1FZA2lWYVdZAWWZARNgZDZD";
    let profile_picture =
      "https://instagram.fdel10-1.fna.fbcdn.net/v/t51.2885-19/s150x150/129774151_392973145306534_8683658149185869540_n.jpg?_nc_ht=instagram.fdel10-1.fna.fbcdn.net&_nc_ohc=71dm1WruyooAX8IAvf2&tp=1&oh=f564b7bbb293bcd45efd4202eb4444ba&oe=603672D6";
    let user_name = "sonal.sharma.2681";
    if (this.state.username === "" || this.state.password === "") {
      /* The usernameRequired and passwordRequired fields are used when we want to store the class to be assigned */
      this.state.username === ""
        ? this.setState({ usernameRequired: "dispBlock" })
        : this.setState({ usernameRequired: "dispNone" });
      this.state.password === ""
        ? this.setState({ passwordRequired: "dispBlock" })
        : this.setState({ passwordRequired: "dispNone" });
      this.setState({ incorrectUsernamePasswordMessage: "dispNone" });
    } else if (
      this.state.username === username &&
      this.state.password === password
    ) {
      // Setting token in session storage
      sessionStorage.setItem("access-token", accessToken);
      sessionStorage.setItem("profile_picture", profile_picture);
      sessionStorage.setItem("username", user_name);
      // Setting state so as to check and route to home page if login is successful.
      this.setState({
        isLoggedIn: true,
      });
    } else {
      // In case the username and password are incorrect
      this.setState({ incorrectUsernamePasswordMessage: "dispBlock" });
    }
  };

  render() {
    return (
      <div>
        {this.state.isLoggedIn === true ? (
          <Redirect to="/home" />
        ) : (
          <div>
            <Header />
            <Card className="login-card">
              <p className="login-header">LOGIN</p>
              <FormControl required>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  id="username"
                  type="text"
                  username={this.state.username}
                  onChange={this.inputUsernameChangeHandler}
                  value={this.state.username}
                />
                <FormHelperText className={this.state.usernameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type="password"
                  password={this.state.password}
                  onChange={this.inputPasswordChangeHandler}
                  value={this.state.password}
                />
                <FormHelperText className={this.state.passwordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormHelperText
                className={this.state.incorrectUsernamePasswordMessage}
              >
                <span className="red" style={{ fontSize: "14px" }}>
                  Incorrect username and/or password
                </span>
              </FormHelperText>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.loginClickHandler}
                className="login-btn"
              >
                LOGIN
              </Button>
            </Card>
          </div>
        )}
      </div>
    );
  }
}

export default Login;
