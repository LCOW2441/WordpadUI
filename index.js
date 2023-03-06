require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Ninja = require('./models/ninja');
const Notes = require('./notes');

const JWT_SECRET = 'Sktchie';




mongoose.set('strictQuery', false);
const Note = require("./notes");
const app = express();

app.use(session({
    secret: 'Sktchie',
    resave: false,
    saveUninitialized: true
  }));

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NodeJS API Project',
            version: '1.0.0'
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
    apis: ['./index.js', './routes/api.js', './routes/routes.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())


mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`).then(function () {

    /**
 * @swagger
 *  components:
 *      schemas:
 *          Login:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
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

    app.get("/", function (req, res) {
        res.send("Home");
    });


    /**
 *  @swagger
 * /login:
 *  post:
 *      summary: This API for logging in
 *      description: This API for logging in
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                       $ref: '#components/schemas/Login'
 *      responses:
 *            200:
 *                description: Login Successful
 *                
 */
    app.post("/login", async function (req, res) {
        const {email, password } = req.body;
        const user = await Ninja.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Compare the password with the stored hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid email or password');
        }

        // Generate a JWT and send it as a response
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.cookie('token',token, {httpOnly: true});
        const sessionData = req.session;
        sessionData.token = token;
        sessionData.userId = user._id;
        sessionData.userName = user.name;

        console.log("Log in success");
        console.log(`User ID : ${user._id}`);

        res.json({ token });

    });

  /**
 *  @swagger
 * /logout:
 *  post:
 *      summary: This API for logging out
 *      description: This API for logging out
 *      responses:
 *            200:
 *                description: Logout Successful
 *                
 */
    app.post('/logout', (req, res) => {

        const sessionData = req.session;
        if (!sessionData.token) {
            res.send('Login First');
            
        }
        else{
             // Clear the token from the client's cookies or localStorage
        res.clearCookie('token');
        delete req.session.token;
        delete req.session.userId;
        delete req.session.userName;


        // Send a success response
        res.status(200).send('Logout successful');
        }


       
      });



    app.use('/api', require("./routes/api"));


    const noteRouter = require("./routes/routes");
    app.use("/notes", noteRouter);
});
mongoose.Promise = global.Promise



app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});


app.listen(process.env.port || 4000, function () {
    console.log('starting');
});