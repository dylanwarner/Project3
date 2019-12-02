// require mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// require underscore
const _ = require('underscore');

// create empty nodeModel object
let NoteModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

// create a schema for each note
const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  note: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

// take noteschmea to an api
NoteSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  note: doc.note,
});

// find by owner method by id
NoteSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  // select title note and date 
  return NoteModel.find(search).select('title note createdData').exec(callback);
};

NoteModel = mongoose.model('Note', NoteSchema);

// exports
module.exports.NoteModel = NoteModel;
module.exports.NoteSchema = NoteSchema;
