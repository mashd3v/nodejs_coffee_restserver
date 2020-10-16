/* PORT */
process.env.PORT = process.env.PORT || 3000;

/* ENVIROMENT */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/* DATABASE */
let urlDatabase;
if (process.env.NODE_ENV === 'dev') {
    urlDatabase = 'mongodb://localhost:27017/coffee';
} else {
    urlDatabase = process.env.MONGO_URI;
}

process.env.URLDB = urlDatabase;