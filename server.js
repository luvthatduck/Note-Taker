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

let notes = require('./db/db.json');

function createNewNote(body, savedNotesArray) {
  const note = body;
  savedNotesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify( savedNotesArray, null, 2)
  );

  return note;
}

// validate the data of notes

function validateNotes(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false;
  }
  return true;
}

// get routes 

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.get('/api/notes', (req, res) => {
  return res.json(notes);
});

app.get('./db/db', (req, res) => {
  let results = notes;
  console.log(req.query)
  res.json(results);
})


//must be at the bottom or it will override all get routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


//post routes

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateNotes(req.body)) {
    res.status(400).send('Your note is not properly formatted.');
  } else {
    const newNote = createNewNote(req.body, notes);
    res.json(notes);
  }
});


// DELETE the note when the button is clicked
app.delete('/api/notes/:id', (req, res) => {
 
  notes = notes.filter((note) => {
      if (note.id !== req.params.id) {
          
          return true;
      }
      
      return false;
  })

  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notes, null, 2)
  )
  res.json(notes);
})


app.listen(PORT, () => {
  console.log(`API server now on port 3001!`);
});