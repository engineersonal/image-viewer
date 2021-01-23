import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./login/Login";

//Creating controller class for easy routing the pages
class Controller extends Component {
  constructor() {
    super();
    //setting the baseUrl of the api
    this.baseUrl = "https://api.instagram.com/v1/users/self/";
  }

  render() {
    return (
      <Router>
        <div className="main-container">
          <Route
            exact
            path="/"
            render={(props) => <Login {...props} baseUrl={this.baseUrl} />}
          />{" "}
          {/* Route to login Page */}
        </div>
      </Router>
    );
  }
}

export default Controller;