const express = require('express');
const router = express.Router();
const session = require('express-session');


const Note = require('../notes');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Notes:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  title:
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
 *  post:
 *      summary: This API for viewing notes
 *      description: This API for viewing notes
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




router.post("/list", async function (req, res) {
    const sessionData = req.session;
        if (!sessionData.token) {
            
            return res.status(401).send("Please Log In First")
            

        }
        else{
        console.log(sessionData.userId)
        Note.find({ author: sessionData.userId })
            .then(document => {
                return res.send(document)
            })
            .catch(err => { return res.send(err) })
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

    const sessionData = req.session;
    if (!sessionData.userId) {
        return res.redirect('/login');
    }
    else {

        const newNote = new Note({
            id: req.body.id,
            username: sessionData.userName,
            title: req.body.title,
            content: req.body.content,
            author: sessionData.userId
        });
        await newNote.save()
            .then(note => {
                return res.json({ message: "Note Created" })
            })
            .catch(err => {
                return res.json({ message: err.message })
            });
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
    const sessionData = req.session;
    if (sessionData.userId) {

        console.log(req.body)
        Note.findOne({ $and: [{ id: req.body.id }, { author: sessionData.userId }] })
            .then(async note => {
                console.log(note)
                note.title = req.body.title || note.title
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
    const sessionData = req.session;
    if (sessionData.userId) {
         Note.findOne({ $and: [{ id: req.body.id }, { author: sessionData.userId }] })
            .then(async note => {
                console.log(note)
                note.deleteOne({ $and: [{ id: req.body.id }, { author: sessionData.userId }] });
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