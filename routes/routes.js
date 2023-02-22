const express = require ('express');
const router = express.Router();

const Note = require('../notes');





router.post ("/list", async function(req,res){
    var notes = await Note.find();
    res.json(notes);
});

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




router.delete ("/delete", async function(req,res){
    await Note.deleteOne({ id: req.body.id });

    const resp= {message : "Note Deleted"};
    res.json(resp);

});

module.exports = router;