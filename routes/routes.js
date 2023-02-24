const express = require ('express');
const router = express.Router();

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
 *                  userid:
 *                      type: string
 *                  title:
 *                      type: string
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
 *            200:
 *                description: To view notes
 *                content: 
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Notes'
 */




router.post ("/list", async function(req,res){
    var notes = await Note.find();
    res.json(notes);
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
 *            200:
 *                description: Note Created
 *                
 */

router.post ("/add", async function(req,res){
    
    // await Note.deleteOne({ id: req.body.id });

    const newNote = new Note({
        id: req.body.id,
        userid: req.body.userid,
        title: req.body.title
    });
    await newNote.save()
    .then(note =>{
        return res.json({message : "Note Created"})
    })
    .catch(err => {
        return res.json({message : err.message})
    }); 

   
    
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
 *            200:
 *                description: Note Updated
 *                content: 
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Notes'
 *                
 */


router.put ("/update", function(req,res){
    console.log(req.body)
    Note.findOne({id:req.body.id})
    .then(async note=> {
        console.log(note)
    note.title = req.body.title || note.title
    await note.save();
    })
    .catch(err=>{res.send("error")})

   
    const resp= {message : "Note Updated"};
    res.json(resp);
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
 *            200:
 *                description: Note Deleted
 */

router.delete ("/delete", async function(req,res){
    await Note.deleteOne({ id: req.body.id });

    const resp= {message : "Note Deleted"};
    res.json(resp);

});

module.exports = router;