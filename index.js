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
            },
            {
                url: 'http://18.234.225.252:4000/'
            }
        ]
    },
    apis: ['./index.js','./routes/api.js','./routes/routes.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json())


mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`).then(function(){









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







const noteRouter = require("./routes/routes");
app.use("/notes", noteRouter);
});
mongoose.Promise = global.Promise



app.use(function(err,req,res,next){
    res.status(422).send({error: err.message});
});


app.listen(process.env.port || 4000, function () {
    console.log('starting');
});