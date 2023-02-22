const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Note = require("./notes");
const app = express();

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi =require ('swagger-ui-express')

const options = {
    definition: {
        openapi : '3.0.0',
        info: {
            title : 'NodeJS API Project',
            version : '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:4000/'
            }
        ]
    },
    apis: ['./index.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json())


mongoose.connect("mongodb://127.0.0.1:27017/userdetails").then(function(){

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
 * /:
 *  get:
 *      summary: This API for Home page
 *      description: This API for Home page
 *      responses:
 *            200:
 *                description: To test GET method
 */

app.get("/",function(req,res){
    res.send("Home");
});



app.use('/api', require("./routes/api"));

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





const noteRouter = require("./routes/routes");
app.use("/notes", noteRouter);
});
mongoose.Promise = global.Promise

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

app.use(function(err,req,res,next){
    res.status(422).send({error: err.message});
});


app.listen(process.env.port || 4000, function () {
    console.log('starting');
});