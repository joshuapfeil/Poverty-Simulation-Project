//Libraries
const express = require('express');
const multer = require('multer');
const mysql = require('sqlite3').verbose();
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const puppies = require('./model/puppy');
const breeds = require('./model/breed');

//Setup defaults for script
const app = express();
app.use(cors());
const upload = multer()
const port = 3000 //Default port to http server

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//get all puppies
app.get('/puppies/', async (request, response) => {
    try {
        const allPuppies = await puppies.getAll();
        return response
            .status(200) //Success code when everything is okay
            .json({ 'data': allPuppies });
    } catch (error) {
        console.log(error);
        return response
            .status(500) //Error code when something goes wrong with the server
            .json({ message: 'Something went wrong with the server.' });

    }
});

//get all puppies with filters
app.get('/puppies/:breed/:color/:size/:sortMethod/:sortOrder/:limit/', upload.none(),
    async (request, response) => {

        try {
            const body = request.params;
            const allPuppies = await puppies.getAll({ body })
            return response
                .status(200)
                .json({ 'data': allPuppies });
        } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server.' });

        }
    });

//get all breeds
app.get('/breeds/', async (request, response) => {
    try {
        const allPuppies = await breeds.getAll();
        return response
            .status(200) //Success code when everything is okay
            .json({ 'data': allPuppies });
    } catch (error) {
        console.log(error);
        return response
            .status(500) //Error code when something goes wrong with the server
            .json({ message: 'Something went wrong with the server.' });

    }
});

//get specific puppy
app.get('/targetRecord/:id/', upload.none(), async (request, response) => {
    try {
        const puppy = await puppies.get(request.params.id);
        return response
            .status(200) //Success code when everything is okay
            .json({ 'data': puppy });
    } catch (error) {
        console.log(error);
        return response
            .status(500) //Error code when something goes wrong with the server
            .json({ message: 'Something went wrong with the server.' });

    }
});

//delete specific puppy
app.delete('/delete/:id', upload.none(), async (request, response) => {
    try {
        await puppies.deleteById(request.params.id);

    } catch (error) {
        console.log(error);
        return response
            .status(500) //Error code when something goes wrong with the server
            .json({ message: 'Something went wrong with the server.' });

    }

    try {
        const allPuppies = await puppies.getAll();
        return response
            .status(200) //Success code when everything is okay
            .json({ 'data': allPuppies });
    } catch (error) {
        console.log(error);
        return response
            .status(500) //Error code when something goes wrong with the server
            .json({ message: 'Something went wrong with the server.' });

    }
});

//edit specific puppy
app.put('/edit/:id', upload.none(),
    check('breed').isLength({ min: 1, max: 20 }).isString(),
    check('size').isInt({ min: 0, max: 100 }),
    check('color').isLength({ min: 1, max: 20 }).isString(),
    check('cuteness').isInt({ min: 0, max: 200 }),
    async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .json({ message: "Request fields or files are invalid", errors: errors.array() });

        }

        try {
            const body = request.body;
            await puppies.edit({ body });
        } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server.' });

        }

        try {
            const allPuppies = await puppies.getAll();
            return response
                .status(200) //Success code when everything is okay
                .json({ 'data': allPuppies });
        } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server.' });

        }
    });

//add new puppy
app.post('/puppies/', upload.none(),
    check('breed').isLength({ min: 1, max: 20 }).isString(),
    check('size').isInt({ min: 0, max: 100 }),
    check('color').isLength({ min: 1, max: 20 }).isString(),
    check('cuteness').isInt({ min: 0, max: 130 }),
    async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .json({ message: "Request fields or files are invalid", errors: errors.array() });

        }

        //Get all breeds
        let allBreeds = [];
        try {
            allBreeds = await breeds.getAll();
        } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server.' });
        }

        // INSERT statement variables
        try {
            let body = request.body;
            await puppies.insert({ body, allBreeds });
        } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server.' });
        }

        //return all puppies
        try {
            let allPuppies = await puppies.getAll();
            return response
                .status(200)
                .json({ 'data': allPuppies });
        } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server.' });
        }
    });

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
})