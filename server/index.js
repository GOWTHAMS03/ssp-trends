require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const keys = require('./config/keys');
const routes = require('./routes');
const socket = require('./socket');
const setupDB = require('./utils/db');


const { port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());


// app.use(cors({
//   allowedHeaders: "*", allowedMethods: "*", origin: "*"
//   }));


const corsOptions = {
  origin: 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization,X-Requested-With,content-type,x-app-id, x-auth-token, id-mercury', // Adjust these headers according to your needs
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};



app.options('/api/payment/newPayment', cors(corsOptions), (req, res) => {
  res.sendStatus(200);
});


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization,X-Requested-With,content-type,x-app-id, x-auth-token, id-mercury");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});



app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);

app.use(express.static(path.resolve(__dirname, '../dist')));

setupDB();
require('./config/passport')(app);
app.use(routes);

console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  });
}






const server = app.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});

socket(server);