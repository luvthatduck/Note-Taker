const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const { savedNotes } = require('./db/db.json');

function createNewNote(body,savedNotesArray) {
  const notes = body;
  savedNotesArray.push(notes);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ savedNotes: savedNotesArray }, null, 2)
  );

  return notes;
}

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname,'./public/assets/notes.html'));
});

app.get('*', (req, res)  => {
  res.sendFile(path.join(__dirname, './public/assets/index.html'));
});

app.get('/api/notes', (req, res) => {
  return res.json(savedNotes);
});

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = savedNotes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  // if (!validateAnimal(req.body)) {
  //   res.status(400).send('Your Note is not properly formatted.');
  // } else {
    const newNote = createNewNote(req.body, savedNotes);
    res.json(newNote);
  // }
});


app.listen(3001, () => {
  console.log(`API server now on port 3001!`);
});