const express = require('express');
// const { type } = require('os');
const router = express.Router();
const Ninja = require('../models/ninja');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Users:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *                  
 *                 
 */



/**
 *  @swagger
 * /api/ninjas:
 *  get:
 *      summary: This API for getting user details
 *      description: This API for getting user details
 *      responses:
 *            200:
 *                description: To get user details
 *                content: 
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Users'
 */


router.get('/ninjas', async function (req, res, next) {
    var user = await Ninja.find();
    res.json(user);
});

/**
 *  @swagger
 * /api/ninjas:
 *  post:
 *      summary: This API for inserting user details
 *      description: This API for inserting user details
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                       $ref: '#components/schemas/Users'
 *      responses:
 *            200:
 *                description: User Created
 *                
 */
const bcrypt = require("bcrypt")
router.post('/ninjas', async function (req, res, next) {

    const { email } = req.body;


    const existingUser = await Ninja.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
    }
    else{   
        const ninja = new Ninja({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10)
        })
        ninja.save().then(function (ninja) {
            res.send("User created");
        }).catch(next);
    }
        
});

/**
 *  @swagger
 * /api/ninjas/{id}:
 *  put:
 *      summary: This API for editing user details
 *      description: This API for editing user details
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: ID required
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true 
 *          content: 
 *              application/json:
 *                  schema:
 *                       $ref: '#components/schemas/Users'
 *      responses:
 *            200:
 *                description: User Edited
 *                content: 
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Users'
 *                
 */

router.put('/ninjas/:id', function (req, res, next) {

    Ninja.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function (ninja) {
        Ninja.findOne({ _id: req.params.id }).then(function (ninja) {
            res.send(ninja);
        });

    });
});

/**
 *  @swagger
 * /api/ninjas/{id}:
 *  delete:
 *      summary: This API for deleting user details
 *      description: This API for deleting user details
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: ID required
 *            schema:
 *              type: string
 *      responses:
 *            200:
 *                description: User Deleted
 */


router.delete('/ninjas/:id', function (req, res, next) {
    Ninja.findByIdAndRemove({ _id: req.params.id }).then(function (ninja) {
        res.send(ninja);
    });

    // res.send({type: 'DELETE'});
});

module.exports = router;