"use strict";

// function to handle a note
var handleNote = function handleNote(e) {
  e.preventDefault(); // animate error alert msg

  $("#errorAlert").animate({
    width: 'hide'
  }, 350); // if note title and note values are empty, show error

  if ($("#noteTitle").val() == '' || $("#note").val() == '') {
    handleError("All fields are required.");
    return false;
  } // if no errors, send post and redirect


  sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function () {
    loadNotesFromServer();
  });
  return false;
}; // render the add note form to the page


var NoteForm = function NoteForm(props) {
  return React.createElement("div", {
    id: "noteFormWrap"
  }, React.createElement("form", {
    id: "noteForm",
    onSubmit: handleNote,
    name: "noteForm",
    action: "/maker",
    method: "POST",
    className: "noteForm"
  }, React.createElement("label", {
    htmlFor: "title"
  }, "Title: "), React.createElement("input", {
    id: "noteTitle",
    type: "text",
    name: "title",
    placeholder: "Title"
  }), React.createElement("label", {
    htmlFor: "note"
  }, "Note: "), React.createElement("input", {
    id: "note",
    type: "text",
    name: "note",
    placeholder: "Note"
  }), React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), React.createElement("input", {
    className: "makeNoteSubmit",
    type: "submit",
    value: "Add note"
  })));
}; // render the profile window to the page


var ProfileWindow = function ProfileWindow(props) {
  console.log(props);
  return React.createElement("div", {
    id: "profileWindow"
  }, React.createElement("h3", null, "Profile"), React.createElement("a", {
    id: "changePassButton",
    "class": "nav-link nav-link-ltr",
    href: "/maker"
  }, "Change Password"));
}; // search bar component to render


var SearchWindow = function SearchWindow(props) {
  return React.createElement("div", {
    id: "searchWindow"
  }, React.createElement("input", {
    id: "searchBar",
    type: "text",
    name: "searchBar",
    placeholder: "Type to search..."
  }), React.createElement("input", {
    className: "searchSubmit",
    type: "submit",
    value: "Search"
  }));
}; // bookmarks window to hold bookmarked notes


var Bookmarks = function Bookmarks(props) {
  return React.createElement("div", null, React.createElement("h3", {
    className: "noteTitle"
  }, "Bookmarks:"), React.createElement("h3", {
    className: "noteTitle"
  }, "View your bookmarked notes."));
}; // function to create the add note window passing in csrf


var createAddNoteWindow = function createAddNoteWindow(csrf) {
  ReactDOM.render(React.createElement(NoteForm, {
    csrf: csrf
  }), document.querySelector("#notes"));
}; // function to render the profile window passing in csrf


var createProfileWindow = function createProfileWindow(csrf) {
  ReactDOM.render(React.createElement(ProfileWindow, {
    csrf: csrf
  }), document.querySelector("#notes"));
}; // function to render search window passing in csrf


var createSearchWindow = function createSearchWindow(csrf) {
  ReactDOM.render(React.createElement(SearchWindow, {
    csrf: csrf
  }), document.querySelector("#notes"));
};

var createBookmarkWindow = function createBookmarkWindow(csrf) {
  ReactDOM.render(React.createElement(Bookmarks, {
    csrf: csrf
  }), document.querySelector("#notes"));
}; // function to create the empty notelist if no notes have been create, display the msg


var NoteList = function NoteList(props) {
  if (props.notes.length === 0) {
    return React.createElement("div", {
      className: "noteList"
    }, React.createElement("h3", {
      className: "emptyNote"
    }, "No notes yet."));
  } // if there are notes, loop through and create each note 


  var noteNodes = props.notes.map(function (note) {
    return React.createElement("div", {
      key: note._id,
      className: "note"
    }, React.createElement("span", {
      className: "trash"
    }, "x"), React.createElement("h3", {
      className: "noteTitle"
    }, " ", note.title, " "), React.createElement("p", {
      className: "noteNote"
    }, " ", note.note, " "), React.createElement("p", {
      className: "noteDate"
    }, " ", note.createdData, " "));
  }); // return each note 

  return React.createElement("div", {
    className: "noteList"
  }, noteNodes);
}; // method to load the notes from the server


var loadNotesFromServer = function loadNotesFromServer() {
  sendAjax('GET', '/getNotes', null, function (data) {
    ReactDOM.render(React.createElement(NoteList, {
      notes: data.notes
    }), document.querySelector("#notes"));
  });
}; // setup function to setup windows and handle navigation


var setup = function setup(csrf) {
  // grab the buttons for add note and profile windows
  var addNoteButton = document.querySelector('#addNoteButton');
  var profileButton = document.querySelector('#profileButton');
  var searchButton = document.querySelector('#searchButton');
  var bookmarkButton = document.querySelector('#bookmarkButton'); // add listener to the add note onclick to create the add note window

  addNoteButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAddNoteWindow(csrf);
    return false;
  }); // add listener to the profile window to create the profile window

  profileButton.addEventListener("click", function (e) {
    e.preventDefault();
    createProfileWindow(csrf);
    return false;
  }); // add listener to the search window to create the search window

  searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSearchWindow(csrf);
    return false;
  }); // add listener to the bookmark window to create the bookmark window

  bookmarkButton.addEventListener("click", function (e) {
    e.preventDefault();
    createBookmarkWindow(csrf);
    return false;
  }); // render the list of notes empty at first

  ReactDOM.render(React.createElement(NoteList, {
    notes: []
  }), document.querySelector("#notes")); // load the notes from the server

  loadNotesFromServer();
}; // function to get csrf token


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; // document ready, get token


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