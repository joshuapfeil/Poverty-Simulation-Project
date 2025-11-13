//Libraries
const express = require('express');
const multer = require('multer');
const mysql = require('sqlite3').verbose();
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const families = require('./model/family');

//Setup defaults for script
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer()
const port = 3000 //Default port to http server

const fs = require('fs');
const path = require('path');

// Serve legacy `public/` for any remaining static assets (backups/placeholder pages).
app.use(express.static(path.join(__dirname, 'public')));

// If a built React app exists at client/dist, serve it in production.
const clientDist = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));

    // For any non-API GET route, send the client index.html so React Router can handle routing.
    // Use a simple middleware instead of an express route pattern to avoid path-to-regexp issues.
    app.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        // Let API routes continue to their handlers
        if (req.path.startsWith('/families') || req.path.startsWith('/api')) return next();
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


app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
})