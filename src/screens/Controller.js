import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import Profile from "./profile/Profile";

//Creating controller class for easy routing the pages
class Controller extends Component {
  constructor() {
    super();
    //setting the baseUrl of the api
    this.baseUrl = "https://graph.instagram.com/";
  }

  render() {
    return (
      <Router>
        <div className="main-container">
          <Route
            exact
            path="/"
            render={(props) => <Login {...props} baseUrl={this.baseUrl} />}
          />
          {/* Route to login Page */}
          <Route
            exact
            path="/home"
            render={(props) => <Home {...props} baseUrl={this.baseUrl} />}
          />
          {/* Route to home Page */}
          <Route
            exact
            path="/profile"
            render={(props) => <Profile {...props} baseUrl={this.baseUrl} />}
          />
          {/* Route to profile Page */}
        </div>
      </Router>
    );
  }
}

export default Controller;
