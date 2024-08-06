const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb+srv://senkar:ATWQMPwAOtBUXdFI@cluster0.vj0xx.mongodb.net/practice', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    name: String,
});

const pokemonSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    ability: String,
    position: {
        x: Number,
        y: Number,
    },
    speed: Number,
    direction: String,
});

const User = mongoose.model('User', userSchema);
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

app.use(cors());
app.use(bodyParser.json());

// User Endpoints
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
   
// Pokemon Endpoints
app.get('/api/pokemons', async (req, res) => {
    try {
        const pokemons = await Pokemon.find().populate('owner');
        res.json(pokemons);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/users/:userId/pokemons', async (req, res) => {
    try {
        const pokemons = await Pokemon.find({ owner: req.params.userId }).populate('owner');
        res.json(pokemons);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/pokemons', async (req, res) => {
    try {
        const pokemon = new Pokemon(req.body);
        await pokemon.save();
        res.json(pokemon);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/pokemons/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(pokemon);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/api/pokemons/:id', async (req, res) => {
    try {
        await Pokemon.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/api/pokemons', async (req, res) => {
    try {
        await Pokemon.deleteMany({});
        res.sendStatus(204); // No Content
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
