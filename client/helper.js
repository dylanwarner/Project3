// function to handle error and display error msg
const handleError = (message) => {
    $(".alertMsg").text(message);
    $("#errorAlert").animate({width:'toggle'},350);
};

// function to handle error msg on signup window
const handleErrorSign = (message) => {
    $(".alertMsgSign").text(message);
    $("#errorAlertSign").animate({width:'toggle'},350);
};

// redirect function to reload window and animate alert
const redirect = (response) => {
    $(".alertMsg").animate({width:'toggle'},350);
    window.location = response.redirect;
};

// redirect function to signup page to load another window
const redirectSign = (response) => {
    $(".alertMsgSign").animate({width:'toggle'},350);
    window.location = response.redirect;
};

// function to send ajax for login window, and to handle any errors
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

// function to send ajax for signup window, and to handle any errors
const sendAjaxSignUp = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleErrorSign(messageObj.error);
        }
    });
};