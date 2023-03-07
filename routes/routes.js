const express = require('express');
const router = express.Router();
const session = require('express-session');
const jwt = require("jsonwebtoken")


const Note = require('../notes');
const Ninja = require("../models/ninja")

/**
 * @swagger
 *  components:
 *      schemas:
 *          Notes:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  content:
 *                      type: string
 * 
 *                  
 *                  
 *                 
 */




/**
 *  @swagger
 * /notes/list:
 *  get:
 *      summary: This API for viewing notes
 *      description: This API for viewing notes
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            description: ID required
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: To view notes
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Notes'
 *          401:
 *              description: Please Log In First
 *              
 */
router.get("/list", async function (req, res) {
    const reqToken = req.headers.token
    console.log(reqToken)
    if (!reqToken) {
        return res.send("Please Log In First")
    }
    else {
        const tokenData = jwt.verify(reqToken, "Sktchie")
        console.log(tokenData)

        let user = await Ninja.findOne({ $and: [{ token: reqToken }, { _id: tokenData.userId }] });
        if (user) {
            Note.find({ author: user._id })
                .then(notes => {
                    return res.send(notes)
                })
                .catch(err => { return res.send(err) })
        }
        else {
            return res.send("Login First")
        }
    }
});


/**
 *  @swagger
 * /notes/add:
 *  post:
 *      summary: This API for creating new note
 *      description: This API for creating new note
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                       $ref: '#components/schemas/Notes'
 *      responses:
 *          200:
 *              description: Note Created
 *                
 */

router.post("/add", async function (req, res) {

    const reqToken = req.headers.token
    if (!reqToken) {
        return res.send({ message: "Login First" });
    }
    else {
        const tokenData = jwt.verify(reqToken, "Sktchie")

        Ninja.findById(tokenData.userId)
            .then(async user => {
                console.log(user)
                const newNote = new Note({
                    id: req.body.id,
                    username: user.name,
                    content: req.body.content,
                    author: tokenData.userId
                });
                await newNote.save()
                    .then(note => {
                        return res.json({ message: "Note Created", note: note })
                    })
                    .catch(err => {
                        return res.json({ message: err.message })
                    });
            })
            .catch(err => { return res.send(err) })
    }
});

/**
 *  @swagger
 * /notes/update:
 *  put:
 *      summary: This API for updating note
 *      description: This API for updating note
 *     
 *      requestBody:
 *          required: true 
 *          content: 
 *              application/json:
 *                  schema:
 *                       $ref: '#components/schemas/Notes'
 *      responses:
 *          200:
 *              description: Note Updated
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Notes'
 *          401:
 *              description: Please Log In First
 *                
 */


router.put("/update", function (req, res) {
    const reqToken = req.headers.token
    if (reqToken) {
        const tokenData = jwt.verify(reqToken, "Sktchie")
        console.log(tokenData)
        console.log(req.body)
        Note.findOne({ $and: [{ id: req.body.id }, { author: tokenData.userId }] })
            .then(async note => {
                console.log(note)
                note.content = req.body.content || note.content
                await note.save();
                const resp = { message: "Note Updated" };
                res.json(resp);
            })
            .catch(err => { res.send("Note doesn't exist") })
    }
    else {
        res.status(401).send("Login First");
    }

});


/**
 *  @swagger
 * /notes/delete:
 *  delete:
 *      summary: This API for deleting notes
 *      description: This API for deleting notes
 *      requestBody:
 *          required: true 
 *          content: 
 *              application/json:
 *                  schema:
 *                       $ref: '#components/schemas/Notes'
 *      responses:
 *          200:
 *              description: Note Deleted
 *          401:
 *              description: Please Log In First
 */

router.delete("/delete", async function (req, res) {
    const reqToken = req.headers.token
    if (reqToken) {
        const tokenData = jwt.verify(reqToken, "Sktchie")

        Note.findOne({ $and: [{ id: req.body.id }, { author: tokenData.userId }] })
            .then(async note => {
                console.log(note)
                note.deleteOne({ $and: [{ id: req.body.id }, { author: tokenData.userId }] });
                const resp = { message: "Note Updated" };
                res.json(resp);
            })
            .catch(err => { res.send("Note doesn't exist") })
    }
    else {
        res.status(401).send("Login First");
    }
});

module.exports = router;