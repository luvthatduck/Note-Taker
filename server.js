const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

const { savedNotes } = require('./db/db.json');

function createNewNote(body, savedNotesArray) {
  const notes = body;
  savedNotesArray.push(notes);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ savedNotes: savedNotesArray }, null, 2)
  );

  return notes;
}

// validate the data of notes

function validateNotes(notes) {
  if (!notes.title || typeof notes.title !== 'string') {
    return false;
  }
  if (!notes.text || typeof notes.text !== 'string') {
    return false;
  }
  return true;
}

// get routes 

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/assets/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/assets/index.html'));
});

app.get('./db/db.json', (req, res) => {
  const results = savedNotes;
  console.log(req.query)
  res.json(results);
})

// must be at the bottom or it will override all get routes
app.get('/api/notes', (req, res) => {
  return res.json(savedNotes);
});

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = savedNotes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateNotes(req.body)) {
    res.status(400).send('Your note is not properly formatted.');
  } else {
    const newNote = createNewNote(req.body, savedNotes);
    res.json(savedNotes);
  }
});

app.delete('api/notes/:id', (req, res) => {
  savedNotes = savedNotes((note) => {
    if (note.id !== req.params.id) {
      return true
    }
    return false
  })

  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(notes,null,2)
  )
  res.json(notes);
})


app.listen(PORT, () => {
  console.log(`API server now on port 3001!`);
});