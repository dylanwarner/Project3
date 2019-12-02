"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// function to handle logins
var handleLogin = function handleLogin(e) {
  e.preventDefault(); // animate error msg alert

  $("#errorAlert").animate({
    width: 'hide'
  }, 350); // if user and password are empty, display error

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty.");
    return false;
  }

  console.log($("input[name=_csrf]").val()); // if no errors send post with login form info and redirect 

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; // function to handle signup 


var handleSignup = function handleSignup(e) {
  e.preventDefault(); // animate error msg alert

  $("#errorAlertSign").animate({
    width: 'hide'
  }, 350); // if username, password 1, and password 2 are empty - show error msg

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleErrorSign("All fields are required.");
    return false;
  } // if password 1 does not match password 2 - show error


  if ($("#pass").val() !== $("#pass2").val()) {
    handleErrorSign("Passwords do not match.");
    return false;
  } // if no errors send post with signup form info and redirect


  sendAjaxSignUp('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirectSign);
  return false;
}; // react class for creating login window


var LoginWindow =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LoginWindow, _React$Component);

  function LoginWindow(props) {
    var _this;

    _classCallCheck(this, LoginWindow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoginWindow).call(this, props)); // state

    _this.state = {
      inputValue: '',
      passValue: '',
      csrf: props.csrf
    }; // on input change - bind values (for color underline)

    _this.onInputChange = _this.onInputChange.bind(_assertThisInitialized(_this));
    _this.onInputChange2 = _this.onInputChange2.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(LoginWindow, [{
    key: "onInputChange",
    // these two methods are used for creating the colored underline on the login and signup windows
    // on first input change set state of the first input
    // source is on the login.handlebars page
    value: function onInputChange(e) {
      var value = e.target.value;
      this.setState({
        inputValue: value
      });
    }
  }, {
    key: "onInputChange2",
    // on second input chnage set state of the second input
    value: function onInputChange2(e) {
      var value = e.target.value;
      this.setState({
        passValue: value
      });
    }
  }, {
    key: "render",
    // render the login form
    value: function render() {
      // set the state for the input value and pass value
      var inputValue = this.state.inputValue;
      var passValue = this.state.passValue; // return the login form

      return React.createElement("form", {
        id: "loginForm",
        name: "loginForm",
        onSubmit: handleLogin,
        action: "/login",
        method: "POST",
        className: "mainForm"
      }, React.createElement("div", {
        className: "input-wrapper"
      }, React.createElement("label", {
        className: "loginLabels",
        htmlFor: "username"
      }, "Username "), React.createElement("input", {
        onChange: this.onInputChange,
        id: "user",
        type: "text",
        name: "username",
        placeholder: "Username",
        value: inputValue
      }), React.createElement("span", {
        className: "input-highlight"
      }, inputValue.replace(/ /g, "\xA0"))), React.createElement("div", {
        className: "input-wrapper"
      }, React.createElement("label", {
        className: "loginLabels",
        htmlFor: "pass"
      }, "Password "), React.createElement("input", {
        onChange: this.onInputChange2,
        id: "pass",
        type: "text",
        name: "pass",
        placeholder: "Password",
        value: passValue
      }), React.createElement("span", {
        className: "input-highlight"
      }, passValue.replace(/ /g, "\xA0")), React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: this.state.csrf
      })), React.createElement("input", {
        className: "formSubmit",
        type: "submit",
        value: "Login"
      }));
    }
  }]);

  return LoginWindow;
}(React.Component); // class to display signup window


var SignupWindow =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(SignupWindow, _React$Component2);

  function SignupWindow(props) {
    var _this2;

    _classCallCheck(this, SignupWindow);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(SignupWindow).call(this, props)); // state variables

    _this2.state = {
      inputValue: '',
      passValue: '',
      passTwoValue: '',
      csrf: props.csrf
    }; // on input changes bind the state - for color underlines

    _this2.onInputChange = _this2.onInputChange.bind(_assertThisInitialized(_this2));
    _this2.onInputChange2 = _this2.onInputChange2.bind(_assertThisInitialized(_this2));
    _this2.onInputChange3 = _this2.onInputChange3.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(SignupWindow, [{
    key: "onInputChange",
    // these two methods are for handling the input changes on the form fields to create color underlines
    // source is on the login.handlebars page
    value: function onInputChange(e) {
      var value = e.target.value;
      this.setState({
        inputValue: value
      });
    }
  }, {
    key: "onInputChange2",
    value: function onInputChange2(e) {
      var value = e.target.value;
      this.setState({
        passValue: value
      });
    }
  }, {
    key: "onInputChange3",
    value: function onInputChange3(e) {
      var value = e.target.value;
      this.setState({
        passTwoValue: value
      });
    }
  }, {
    key: "render",
    // render the signup form
    value: function render() {
      // set state variables
      var inputValue = this.state.inputValue;
      var passValue = this.state.passValue;
      var passTwoValue = this.state.passTwoValue;
      return React.createElement("form", {
        id: "signupForm",
        name: "signupForm",
        onSubmit: handleSignup,
        action: "/signup",
        method: "POST",
        className: "mainForm"
      }, React.createElement("div", {
        className: "input-wrapper"
      }, React.createElement("label", {
        htmlFor: "username"
      }, "Username "), React.createElement("input", {
        onChange: this.onInputChange,
        id: "user",
        type: "text",
        name: "username",
        placeholder: "Username",
        value: inputValue
      }), React.createElement("span", {
        className: "input-highlight"
      }, inputValue.replace(/ /g, "\xA0"))), React.createElement("div", {
        className: "input-wrapper"
      }, React.createElement("label", {
        htmlFor: "pass"
      }, "Password "), React.createElement("input", {
        onChange: this.onInputChange2,
        id: "pass",
        type: "text",
        name: "pass",
        placeholder: "Password",
        value: passValue
      }), React.createElement("span", {
        className: "input-highlight"
      }, passValue.replace(/ /g, "\xA0"))), React.createElement("div", {
        className: "input-wrapper"
      }, React.createElement("label", {
        htmlFor: "pass2"
      }, "Password "), React.createElement("input", {
        onChange: this.onInputChange3,
        id: "pass2",
        type: "text",
        name: "pass2",
        placeholder: "Confirm Password",
        value: passTwoValue
      }), React.createElement("span", {
        className: "input-highlight"
      }, passTwoValue.replace(/ /g, "\xA0"))), React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: this.state.csrf
      }), React.createElement("input", {
        className: "formSubmit",
        type: "submit",
        value: "Sign Up"
      }));
    }
  }]);

  return SignupWindow;
}(React.Component);

; // method to create and render the login window passing in csrf

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
}; // method to create and render the signup window passing in csrf


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; // function to setup views


var setup = function setup(csrf) {
  // grab the nav buttons and alerts
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  var errorAlert = document.querySelector("#errorAlert");
  var errorAlertSign = document.querySelector("#errorAlertSign"); // add listener to signup button - create the signup window and get rid of error alert

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    errorAlert.style.display = "none";
    return false;
  }); // add listener to login button - create the login window and get rid of the error alert 

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    errorAlertSign.style.display = "none";
    return false;
  }); // default window is the login

  createLoginWindow(csrf); // default view
}; // method to get token


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; // document ready, call get token


$(document).ready(function () {
  getToken();
}); // function to handle error and display error msg

var handleError = function handleError(message) {
  $(".alertMsg").text(message);
  $("#errorAlert").animate({
    width: 'toggle'
  }, 350);
}; // function to handle error msg on signup window


var handleErrorSign = function handleErrorSign(message) {
  $(".alertMsgSign").text(message);
  $("#errorAlertSign").animate({
    width: 'toggle'
  }, 350);
}; // redirect function to reload window and animate alert


var redirect = function redirect(response) {
  $(".alertMsg").animate({
    width: 'toggle'
  }, 350);
  window.location = response.redirect;
}; // redirect function to signup page to load another window


var redirectSign = function redirectSign(response) {
  $(".alertMsgSign").animate({
    width: 'toggle'
  }, 350);
  window.location = response.redirect;
}; // function to send ajax for login window, and to handle any errors


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
}; // function to send ajax for signup window, and to handle any errors


var sendAjaxSignUp = function sendAjaxSignUp(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);
      handleErrorSign(messageObj.error);
    }
  });
};