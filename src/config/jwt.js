const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    return new Promise((resolve, reject) => {

        const payload = { uid, name };

        jwt.sign(payload, process.env.SECRET_JWT_SEED_ADMIN, {
            expiresIn: '2h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            }

            resolve(token);

        })


    })
}

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }


    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        const { uid } = jwt.verify(
            bearerToken,
            process.env.SECRET_JWT_SEED_ADMIN
        );

        req.uid = uid;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}


module.exports = {
    generarJWT,
    validarJWT
}


