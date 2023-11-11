const { response } = require('express');
const db = require('../../database/models');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('./../../config');
const { omit } = require("lodash");

const authAdministrator = async (req, res = response) => {
  const { identityCard, password } = req.body;
  try {
    //buscamos al usuario
    const user = await db.user.findOne({ where: { identityCard: identityCard } })
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: 'Lo lamento, no pudimos encontrarte'
      })
    }
    //verificamos que es administrador
    const administrator = await db.administrator.findOne({
      where: { userId: user.id },
      include: [
        { model: db.user },
        {
          model: db.role,
          include: [
            {
              model: db.rolePermission,
              include: [
                {
                  model: db.permission,
                }
              ]
            }
          ]
        },
      ],
    });
    if (!administrator) {
      return res.status(404).json({
        ok: false,
        msg: 'Lo lamento, no pudimos encontrarte'
      })
    }
    //verificamos si tiene permitido el acceso
    if (!administrator.active) {
      return res.status(404).json({
        ok: false,
        msg: 'No tienes permitido el acceso'
      })
    }
    //verificamos si la contraseña es correcta
    const validPassword = bcrypt.compareSync(password, administrator.password);
    if (!validPassword) {
      return res.status(400).json({
        errors: [{ msg: "Contraseña incorrecta" }]
      });
    }
    //generamos un token
    const token = await generateJWT(administrator.id, user.name);
    const administratorWhitUserAndRole = (
      {
        ...omit(administrator.toJSON(), ['userId', 'roleId', 'password', 'active', 'createdAt', 'updatedAt']),
        user: omit(user.toJSON(), ['roleId', 'createdAt', 'updatedAt']),
        role: ({
          ...omit(administrator.role.toJSON(), ['description', 'state', 'createdAt', 'updatedAt', 'rolePermissions']),
          permissions: administrator.role.rolePermissions.map(rolePermission =>
            omit(rolePermission.permission.toJSON(), ['createdAt', 'updatedAt'])
          )
        })
      });
    return res.json({
      ok: true,
      token: token,
      administrator: administratorWhitUserAndRole,
      msg: 'Autenticación correcta'
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

module.exports = {
  authAdministrator,
}