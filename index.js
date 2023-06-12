const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8000;
const sassMiddleware = require('node-sass-middleware');
const db = require("./config/mongoose");
const path = require('path');
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport");
const MongoStore = require("connect-mongo");

// Using SASS to convert SCSS into CSS
app.use(sassMiddleware({
  src: path.join(__dirname, '/assets/scss'),
  dest: path.join(__dirname, '/assets/css'),
  debug: true,
  outputStyle: 'extended',
  prefix: '/css'
}));

app.use(express.static(path.join(__dirname, 'assets')));

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cookie parser middleware
app.use(cookieParser());

// Session middleware
app.use(
  session({
    name: "placement-cell",
    secret: "asewe",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://shaikhasad765:Asad12345@cluster0.jaoadsc.mongodb.net/Ecommerce?retryWrites=true&w=majority",
      autoRemove: "disabled",
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

// Using express routers
app.use(require("./routes"));

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.log("Error in starting the server", err);
    return;
  }
  console.log("Server is running successfully on port 8000");
});
