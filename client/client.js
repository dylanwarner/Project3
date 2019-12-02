// function to handle logins
const handleLogin = (e) => {
    e.preventDefault();

    // animate error msg alert
    $("#errorAlert").animate({width:'hide'},350);

    // if user and password are empty, display error
    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty.");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    // if no errors send post with login form info and redirect 
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// function to handle signup 
const handleSignup = (e) => {
    e.preventDefault();

    // animate error msg alert
    $("#errorAlertSign").animate({width:'hide'},350);

    // if username, password 1, and password 2 are empty - show error msg
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleErrorSign("All fields are required.");
        return false;
    }

    // if password 1 does not match password 2 - show error
    if($("#pass").val() !== $("#pass2").val()) {
        handleErrorSign("Passwords do not match.");
        return false;
    }

    // if no errors send post with signup form info and redirect
    sendAjaxSignUp('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirectSign);
    
    return false;
};

// react class for creating login window
class LoginWindow extends React.Component {

    constructor(props) {
        super(props);

        // state
        this.state = {
            inputValue: '',
            passValue: '',
            csrf: props.csrf,
        };

        // on input change - bind values (for color underline)
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputChange2 = this.onInputChange2.bind(this);
    };

    // these two methods are used for creating the colored underline on the login and signup windows
    // on first input change set state of the first input
    // source is on the login.handlebars page
    onInputChange(e) {
        const { value } = e.target;
        this.setState({
            inputValue: value
        });
    };

    // on second input chnage set state of the second input
    onInputChange2(e) {
        const { value } = e.target;
        this.setState({
            passValue: value
        });
    };

    // render the login form
    render() {
    // set the state for the input value and pass value
    const { inputValue } = this.state;
    const { passValue } = this.state;
    // return the login form
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
        <div className="input-wrapper">
        <label className="loginLabels" htmlFor="username">Username </label>
        <input onChange={this.onInputChange} id="user" type="text" name="username" placeholder="Username" value={inputValue}/>
        <span className='input-highlight'>
        { inputValue.replace(/ /g, "\u00a0") }
        </span>
        </div>
        <div className="input-wrapper">
        <label className="loginLabels" htmlFor="pass">Password </label>
        <input onChange={this.onInputChange2} id="pass" type="text" name="pass" placeholder="Password" value={passValue}/>
        <span className='input-highlight'>
        { passValue.replace(/ /g, "\u00a0") }
        </span>
        <input type="hidden" name="_csrf" value={this.state.csrf}/>
        </div>
        <input className="formSubmit" type="submit" value="Login" />
        </form>
    );
    }
}

// class to display signup window
class SignupWindow extends React.Component {

    constructor(props) {
        super(props);

        // state variables
        this.state = {
            inputValue: '',
            passValue: '',
            passTwoValue: '',
            csrf: props.csrf,
        };

        // on input changes bind the state - for color underlines
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputChange2 = this.onInputChange2.bind(this);
        this.onInputChange3 = this.onInputChange3.bind(this);
    };

    // these two methods are for handling the input changes on the form fields to create color underlines
    // source is on the login.handlebars page
    onInputChange(e) {
        const { value } = e.target;
        this.setState({
            inputValue: value
        });
    };

    onInputChange2(e) {
        const { value } = e.target;
        this.setState({
            passValue: value
        });
    };

    onInputChange3(e) {
        const { value } = e.target;
        this.setState({
            passTwoValue: value
        });
    };

    // render the signup form
    render() {
    // set state variables
    const { inputValue } = this.state;
    const { passValue } = this.state;
    const { passTwoValue } = this.state;
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
        
        <div className="input-wrapper">
        <label htmlFor="username">Username </label>
        <input onChange={this.onInputChange} id="user" type="text" name='username' placeholder="Username" value={inputValue}/>
        <span className='input-highlight'>
        { inputValue.replace(/ /g, "\u00a0") }
        </span>
        </div>
        <div className="input-wrapper">
        <label htmlFor="pass">Password </label>
        <input onChange={this.onInputChange2} id="pass" type="text" name="pass" placeholder="Password" value={passValue}/>
        <span className='input-highlight'>
        { passValue.replace(/ /g, "\u00a0") }
        </span>
        </div>
        <div className="input-wrapper">
        <label htmlFor="pass2">Password </label>
        <input onChange={this.onInputChange3} id="pass2" type="text" name="pass2" placeholder="Confirm Password" value={passTwoValue}/>
        <span className='input-highlight'>
        { passTwoValue.replace(/ /g, "\u00a0") }
        </span>
        </div>
        <input type="hidden" name="_csrf" value={this.state.csrf} />
        <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
    );
    }
};

// method to create and render the login window passing in csrf
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

// method to create and render the signup window passing in csrf
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")     
    );
};

// function to setup views
const setup = (csrf) => {
    // grab the nav buttons and alerts
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const errorAlert = document.querySelector("#errorAlert");
    const errorAlertSign = document.querySelector("#errorAlertSign");

    // add listener to signup button - create the signup window and get rid of error alert
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        errorAlert.style.display = "none";
        return false;
    });

    // add listener to login button - create the login window and get rid of the error alert 
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        errorAlertSign.style.display = "none";
        return false;
    });

    // default window is the login
    createLoginWindow(csrf); // default view
};

// method to get token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// document ready, call get token
$(document).ready(function() {
    getToken();
});