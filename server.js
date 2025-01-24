const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Testovacia cesta
app.get('/', (req, res) => {
    res.send('Server funguje!');
});

// Dočasné úložisko používateľov
const users = [];

// Registrácia používateľa
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Používateľ už existuje!' });
    }

    const newUser = { username, password, playedSongs: [] };
    users.push(newUser);

    res.status(201).json({ message: 'Registrácia úspešná!' });
});

// Prihlásenie používateľa
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        user => user.username === username && user.password === password
    );

    if (!user) {
        return res.status(401).json({ message: 'Nesprávne meno alebo heslo!' });
    }

    res.status(200).json({ message: 'Prihlásenie úspešné!' });
});

// Endpoint na uloženie skladby
app.post('/add-song', (req, res) => {
    const { username, songId, songTitle } = req.body;

    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ message: 'Používateľ nenájdený!' });
    }

    user.playedSongs.push({ id: songId, title: songTitle });

    res.status(200).json({
        message: 'Skladba bola uložená!',
        playedSongs: user.playedSongs
    });
});

// Endpoint na načítanie zoznamu skladieb používateľa
app.get('/songs/:username', (req, res) => {
    const { username } = req.params;

    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ message: 'Používateľ nenájdený!' });
    }

    res.status(200).json({
        playedSongs: user.playedSongs
    });
});

// Spustenie servera na porte 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server beží na http://localhost:${PORT}`);
});
