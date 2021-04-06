const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const savedNotes = require('./develop/db/db.json');

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname,'./public/notes.html'));
});

app.get('*', (req, res)  => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
  return res.json(savedNotes);
});

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});






app.listen(3001, () => {
  console.log(`API server now on port 3001!`);
});