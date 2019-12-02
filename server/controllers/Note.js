// require models folder
const models = require('../models');

// set note to the model note
const Note = models.Note;

// maker page function
const makerPage = (req, res) => {
  // find by owner by account id
  Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    // if error log error
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    // return app with csrf token and docs
    return res.render('app', { csrfToken: req.csrfToken(), notes: docs });
  });
};

// make note function
const makeNote = (req, res) => {
  // if title and note are missing show error
  if (!req.body.title || !req.body.note) {
    return res.status(400).json({ error: 'Both title and note are required.' });
  }

  // create noteData object with request.body variables
  const noteData = {
    title: req.body.title,
    note: req.body.note,
    owner: req.session.account._id,
    date: req.session.createdData,
  };

  console.log(noteData);

  // create a new note using note model
  const newNote = new Note.NoteModel(noteData);

  // save it
  const notePromise = newNote.save();

  // redirect to maker page
  notePromise.then(() => res.json({ redirect: '/maker' }));

  // catch any errors
  notePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Note already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return notePromise;
};

// get notes function
const getNotes = (request, response) => {
  const req = request;
  const res = response;

  // return notes by owner using account id
  return Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    // if error show error
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.json({ notes: docs });
  });
};

// export modules
module.exports.makerPage = makerPage;
module.exports.getNotes = getNotes;
module.exports.make = makeNote;
