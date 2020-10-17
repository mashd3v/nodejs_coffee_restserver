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

/* Token Expiration */
/* 60s, 60min, 24hr, 30d */
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

/* Authentication SEED */
process.env.AUTH_SEED = process.env.AUTH_SEED || 'development-seed';


process.env.URLDB = urlDatabase;