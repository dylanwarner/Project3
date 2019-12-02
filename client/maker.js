// function to handle a note
const handleNote = (e) => {
    e.preventDefault();

    // animate error alert msg
    $("#errorAlert").animate({width:'hide'},350);

    // if note title and note values are empty, show error
    if($("#noteTitle").val() == '' || $("#note").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    // if no errors, send post and redirect
    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function() {
        loadNotesFromServer();
    });

    return false;
};

// render the add note form to the page
const NoteForm = (props) => {
    return (
        <div id="noteFormWrap">
        <form id="noteForm"
            onSubmit={handleNote}
            name="noteForm"
            action="/maker"
            method="POST"
            className="noteForm"
        >
        <label htmlFor="title">Title: </label>
        <input id="noteTitle" type="text" name="title" placeholder="Title"/>
        <label htmlFor="note">Note: </label>
        <input id="note" type="text" name="note" placeholder="Note"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeNoteSubmit" type="submit" value="Add note" />
        </form>
        </div>
    );
};

// render the profile window to the page
const ProfileWindow = (props) => {
    return (
        <div id="profileWindow">
            <h3>Profile</h3>
            <a id="changePassButton" class="nav-link nav-link-ltr" href="/maker">Change Password</a>
        </div>
    );
}

// function to create the add note window passing in csrf
const createAddNoteWindow = (csrf) => {
    ReactDOM.render(
        <NoteForm csrf={csrf} />,
        document.querySelector("#notes")
    );
};

// function to render the profile window passing in csrf
const createProfileWindow = (csrf) => {
    ReactDOM.render(
        <ProfileWindow csrf={csrf} />,
        document.querySelector("#notes")
    );
}

// function to create the empty notelist if no notes have been create, display the msg
const NoteList = function(props) {
    if(props.notes.length === 0) {
        return (
            <div className="noteList">
                <h3 className="emptyNote">No notes yet.</h3>
            </div>
        );
    }

    // if there are notes, loop through and create each note 
    const noteNodes = props.notes.map(function(note) {
        return (
            <div key={note._id} className="note">
                <h3 className="noteTitle"> {note.title} </h3>
                <p className="noteNote"> {note.note} </p>
                <p className="noteDate"> {note.createdData} </p>
            </div>
        );
    });

    // return each note 
    return (
        <div className="noteList">
            {noteNodes}
        </div>
    );
};

// method to load the notes from the server
const loadNotesFromServer = () => {
    sendAjax('GET', '/getNotes', null, (data) => {
        ReactDOM.render(
            <NoteList notes={data.notes} />, document.querySelector("#notes")
        );
    });
};

// setup function to setup windows and handle navigation
const setup = function(csrf) {

    // grab the buttons for add note and profile windows
    const addNoteButton = document.querySelector('#addNoteButton');
    const profileButton = document.querySelector('#profileButton');
    
    // add listener to the add note onclick to create the add note window
    addNoteButton.addEventListener("click", (e) => {
        e.preventDefault();
        createAddNoteWindow(csrf);
        return false;
    });

    // add listener to the profile window to create the profile window
    profileButton.addEventListener("click", (e) => {
        e.preventDefault();
        createProfileWindow(csrf);
        return false;
    });
    //ReactDOM.render(
        //<NoteForm csrf={csrf} />, document.querySelector("#makeNote")
    //);

    // render the list of notes empty at first
    ReactDOM.render(
        <NoteList notes={[]} />, document.querySelector("#notes")
    );

    // load the notes from the server
    loadNotesFromServer();
};


// function to get csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// document ready, get token
$(document).ready(function() {
    getToken();
});