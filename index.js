/*
    Express server entrypoint. Exposes API endpoints for `families` and
    `people`, serves legacy `public/` static files during development, and
    when available serves the built React client from `client/dist` in
    production. Start this with `node index.js` (or use `npm start`).
*/

//Libraries
const express = require('express');
const multer = require('multer');
const mysql = require('sqlite3').verbose();
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const families = require('./model/family');
const people = require('./model/person');

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer()
const port = process.env.PORT || 3000; //Default port to http server

const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// If a built React app exists at client/dist, serve it in production.
const clientDist = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));

    app.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        // Let API routes continue to their handlers
        if (req.path.startsWith('/families') || req.path.startsWith('/people') || req.path.startsWith('/api')) return next();
        res.sendFile(path.join(clientDist, 'index.html'));
    });
}

// --- Families API ---
// get all families
app.get('/families/', async (request, response) => {
    try {
        const all = await families.getAll();
        return response.status(200).json({ data: all });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
});

// get single family
app.get('/families/:id', async (request, response) => {
    try {
        const rec = await families.get(request.params.id);
        return response.status(200).json({ data: rec });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
});

// create a family
app.post('/families/', async (request, response) => {
    try {
        const body = request.body;
        await families.insert({ body });
        const all = await families.getAll();
        return response.status(201).json({ data: all });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Failed to create family' });
    }
});

// update a family
app.put('/families/:id', async (request, response) => {
    try {
        const body = request.body;
        body.id = request.params.id;
        await families.edit({ body });
        const all = await families.getAll();
        return response.status(200).json({ data: all });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Failed to update family' });
    }
});

// delete a family
app.delete('/families/:id', async (request, response) => {
    try {
        await families.deleteById(request.params.id);
        const all = await families.getAll();
        return response.status(200).json({ data: all });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Failed to delete family' });
    }
});

// search family by name (for login)
app.get('/families/search/:name', async (request, response) => {
    try {
        const results = await families.getByName(request.params.name);
        return response.status(200).json({ data: results });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Failed to search family' });
    }
});


// --- People API ---
// get all people (optionally filtered by family_id)
app.get('/people', async (request, response) => {
    try {
        const filter = {};
        if (request.query.family_id) filter.family_id = request.query.family_id;
        const all = await people.getAll(filter);
        return response.status(200).json({ data: all });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
});

// get single person
app.get('/people/:id', async (request, response) => {
    try {
        const rec = await people.get(request.params.id);
        return response.status(200).json({ data: rec });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
});

// create a person
app.post('/people', async (request, response) => {
    try {
        const body = request.body;
        await people.insert({ body });
        const all = await people.getAll({ family_id: body.family_id });
        return response.status(201).json({ data: all });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Failed to create person' });
    }
});

// update a person
app.put('/people/:id', async (request, response) => {
    try {
        const body = request.body;
        body.id = request.params.id;
        await people.edit({ body });
        const all = await people.getAll({ family_id: body.family_id });
        return response.status(200).json({ data: all });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Failed to update person' });
    }
});

// delete a person
app.delete('/people/:id', async (request, response) => {
    try {
        await people.deleteById(request.params.id);
        return response.status(200).json({ data: [] });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Failed to delete person' });
    }
});


app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
})