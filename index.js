const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
require('dotenv').config();


const contents = fs.readFileSync('file.txt', 'utf-8');

const words = contents.split(/\r?\n/);

let rand = 0;

cron.schedule('59 23 * * *', function () {
    rand = Math.floor(Math.random() * 5757)
})

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/guess', (req, res) => {
    const guess = req.body.guess;
   
    if (!guess) {
        return res.json({error: 'guess not provided'});
    }
    if (guess.length !== 5) {
        return res.json({error: 'guess must be five-letter word'});
    }

    if (words.indexOf(guess) === -1) {
        return res.json({error: 'Invalid word'});
    }

    let result = '';
    for (let i = 0; i < 5; i++) {
        const char = guess.charAt(i);
        if (char === words[rand].charAt(i)) {
            result += 'O';
        } else if (words[rand].indexOf(char) >= 0) {
            result += 'X';
        } else {
            result += '-';
        }
    }

    res.json({ guess, result });
});

app.get('/word', (req, res) => {

    res.json({ word: words[rand] })
})

const { PORT } = process.env;

app.listen(PORT || 3000, () => {
    console.log('Server started on ' + PORT);
});
