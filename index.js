require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const requestIp = require('request-ip');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Ninja = require('./models/ninja');
const Notes = require('./notes');

const JWT_SECRET = 'Sktchie';




mongoose.set('strictQuery', false);
const Note = require("./notes");
const app = express();
app.use(cors())



// app.use((req, res, next)=>{  
//     // res.header("Access-Control-Allow-Origin", "*");  
//     res.header(  
//         "Access-Control-Allow-Headers",  
//         "Origin, X-Requested-With, Content-Type, Accept");  
//     res.header("Access-Control-Allow-Methods",  
//     "GET, POST, PATCH, DELETE, OPTIONS");  
//     next();  
// });  



app.use(session({
    secret: 'Sktchie',
    resave: false,
    saveUninitialized: true,
    // store: sessionStore,
    cookie: {
        sameSite: true,
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: 'none'
    },
}));

// app.set('trust proxy', 1)

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
                url: 'http://34.232.69.171:4000/'
            },
            {
                url: 'http://54.152.21.145:8080/'
            }
        ]
    },
    apis: ['./index.js', './routes/api.js', './routes/routes.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())



mongoose.connect('mongodb+srv://user:123@cluster1.bfexxkz.mongodb.net/?retryWrites=true&w=majority')
const db = mongoose.connection
db.on("error", (err) => console.error(err))
db.once("open", () => console.log("Connected to database !"))

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
// app.enable('trust proxy');

// app.use(requestIp.mw());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    keyGenerator: (req, res) => {
        return req.headers['x-auth-token'];
    },
});

const limiterFunction= () => {
    const reqToken = req.headers.token
    if (reqToken) {
        const tokenData = jwt.verify(reqToken, "Sktchie")
        limiter()
    }
}

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
app.use(limiterFunction);


app.get("/", function (req, res) {
    console.log("blahhhhhh");
    res.send("Home");
});

/**
    *  @swagger
    * /anonuser:
    *  get:
    *      summary: This API for Home page and creation of anonymous user
    *      description: This API for Home page and creation of anonymous user
    *      responses:
    *            200:
    *                description: To test GET method
    */

app.get("/anonuser", function (req, res) {

    const ninja = new Ninja({
        name: "anonymous",
        email: "abc" + Math.random() + "@abc.com"
    })
    ninja.save().then(function (ninja) {
        const token = jwt.sign({ userId: ninja._id }, JWT_SECRET);
        ninja.token = token;
        ninja.save();
        res.send({ message: "Anonymous User Created", token: token })

    }).catch(err => {
        return res.send({ err: err, msg: err.message })
    });


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

app.use(cookieParser());

app.post("/login", async function (req, res) {
    const { email, password } = req.body;
    const user = await Ninja.findOne({ email });
    if (!user) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Compare the password with the stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Generate a JWT and send it as a response
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.cookie('token', token, { httpOnly: true });

    user.token = token;
    user.save();

    res.json({ token: token, message: "Login success" });

});

/**
 *  @swagger
 * /logout:
 *  get:
 *      summary: This API for logout
 *      description: This API for logout
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            description: Token required
 *            schema:
 *              type: string
 *      responses:
 *            200:
 *                description: User Deleted
 */
app.get('/logout', (req, res) => {

    const reqToken = req.headers.token;

    console.log(reqToken)
    if (!reqToken) {
        res.send({ message: 'Login First' });
    }
    else {
        const tokenData = jwt.verify(reqToken, "Sktchie")

        Ninja.findById(tokenData.userId)
            .then(user => {
                user.token = ""
                user.save()

                res.status(200).send({ message: 'Logout successful' });
            })
            .catch(err => { return res.send(err) })
        // Send a success response
    }



});





app.use('/api', require("./routes/api"));


const noteRouter = require("./routes/routes");
app.use("/notes", noteRouter);




// app.get("/", (req, res) => {
//     res.send({ msg: "hello" });
// })

app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});




const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

// app.listen(process.env.port || 4000, function () {
//     console.log('starting');
// });

module.exports = app