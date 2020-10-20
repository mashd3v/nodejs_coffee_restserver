const jwt = require('jsonwebtoken');

/* Verify Token */
let verifyToken = (req, res, next) => {

    let token = req.get('authorization');

    jwt.verify(token, process.env.AUTH_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid.'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

};

/* Verify Admin role */
let verifyAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'This user is not an Administrator.'
            }
        });
    }

}

/* Verify Image Token */
let verifyImageToken = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.AUTH_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid.'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

}


module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyImageToken,
}