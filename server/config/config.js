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
process.env.TOKEN_EXPIRATION = '48h';

/* Authentication SEED */
process.env.AUTH_SEED = process.env.AUTH_SEED || 'development-seed';

/* Google Client ID */
process.env.CLIENT_ID = process.env.CLIENT_ID || '291440660051-9ntct85ph59cark9legms53frmpm3bhk.apps.googleusercontent.com';

process.env.URLDB = urlDatabase;