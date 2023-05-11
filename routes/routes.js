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
        return res.send({ message: "Please Log In First" })
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
            return res.send({ message: "Login First" })
        }
    }
});

/**
 * @swagger
 * /notes/{id}/note-link:
 *   get:
 *     summary: Get sharing link for note
 *     description: Generate a sharing link for a note with the given ID, and specify whether it should allow editing or only viewing.
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the note to generate a sharing link for
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: true
 *         description: The type of sharing link to generate. "edit" for an editable link, "view" for a view-only link.
 *         schema:
 *           type: string
 *           enum: [edit, view]
 *     responses:
 *       200:
 *         description: The generated sharing link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   type: string
 *                   description: The URL of the generated sharing link
 */

router.get('/:id/note-link', async function (req, res) {

    const type = req.query.type
    let token;
    if (type === 'edit') {
        token = jwt.sign({ type:"edit"}, "Sktchie");
    } else {
        token = jwt.sign({ type:"view"}, "Sktchie");
    }

    const link = `https://wordpad.app/notes/${id}/${token}`;
    return res.status(200).json({ link });
})


/**
 * @swagger
 * /notes/{id}/{token}:
 *   get:
 *     summary: Get a note and its editability based on the provided token
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for view/edit access to the note
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The access token of the logged-in user
 *     responses:
 *       200:
 *         description: The note and its editability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   type: object
 *                   description: The note details
 *                 editable:
 *                   type: boolean
 *                   description: Whether the note can be edited or not
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id/:token', async function (req, res) {

    const { _id } = req.params

    const headerToken = req.headers.token
    console.log(headerToken)
    const tokenData = jwt.verify(headerToken, "Sktchie")

    if (!tokenData) {
        return res.json({ error: "Invalid Token" })
    }

    const user = await Ninja.findById(tokenData.userId);
    const note = await Note.findById(_id);

    let editable = true

    if (note.author !== tokenData.userId) {
        const reqToken = req.params.token
        const reqTokenData = jwt.verify(reqToken, 'Sktchie')

        if (reqTokenData.type=='view'){
            editable = false
        }

        console.log(reqTokenData)
    }


        response= {
            note: note,
            editable: editable
        }


    return res.send(response)

})
/**
 *  @swagger
 * /notes/note/{id}:
 *  get:
 *      summary: This API to view specific note
 *      description: This API to view specific note
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
router.get("/note/:id", (req, res) => {
    const reqToken = req.headers.token
    console.log(reqToken)
    if (!reqToken) {
        return res.send({ message: "Please Log In First" })
    }
    else {
        const tokenData = jwt.verify(reqToken, "Sktchie")
        console.log(tokenData)

        const id = req.params.id
        Note.findOne({ id: id })
            .then(note => {
                console.log(note)
                return res.send({ note: note })
            })
            .catch(err => { return res.send(err.message) })
    }
})


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
                    // title: req.body.title,
                    author: tokenData.userId,
                    // editable: req.body.editable
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
        Note.findOne({ id: req.body.id })
            .then(async note => {
                console.log(note)
                note.content = req.body.content || note.content
                // note.title = req.body.title || note.title
                // note.editable = req.body.editable || note.editable
                await note.save();
                const resp = { message: "Note Updated" };
                res.json(resp);
            })
            .catch(err => { res.send({ message: "Note doesn't exist" }) })
    }
    else {
        res.status(401).send({ message: "Login First" });
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
            .catch(err => { res.send({ message: "Note doesn't exist" }) })
    }
    else {
        res.status(401).send({ message: "Login First" });
    }
});

module.exports = router;