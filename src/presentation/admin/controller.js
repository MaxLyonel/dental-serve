const { response } = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../database/models');
const { omit } = require("lodash");

const getAdministrator = async (adminId) => {
  const administrator = await db.administrator.findByPk(adminId, {
    include: [
      { model: db.user },
      { model: db.role },
    ],
  });

  return omit(administrator.toJSON(), ['active', 'password', 'userId', 'roleId']);
}

const getAdministrators = async (req, res = response) => {
  try {
    const administrators = await db.administrator.findAll({
      where: { active: true },
      include: [
        { model: db.user },
        { model: db.role },
      ],
    });
    return res.json({
      ok: true,
      administrators: administrators.map(admin => omit(admin.toJSON(), ['active', 'password', 'userId', 'roleId'])),
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const createAdministrator = async (req, res = response) => {

  try {
    //verificamos si existe el usuario
    let user = await db.user.findOne({ where: { identityCard: req.body.identityCard } });
    if (!user) {
      //  creacion de usuario
      user = new db.user(req.body);
      await user.save();
    }
    //verificamos si existe el administrador
    let administrator = await db.administrator.findOne({ where: { userId: user.id, active: true } });
    if (administrator) {
      return res.status(400).json({
        ok: false,
        msg: 'El Administrador ya se encuentra registrado',
      });
    }
    //  creaciön de un administrador
    administrator = new db.administrator();
    administrator.userId = user.id;
    administrator.roleId = req.body.roleId;
    //  encriptar contraseña
    const salt = bcrypt.genSaltSync();
    administrator.password = bcrypt.hashSync(`${user.identityCard}`, salt);
    await administrator.save();

    return res.json({
      ok: true,
      administrator: await getAdministrator(administrator.id),
      msg: 'administrador registrado exitosamente'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const updateAdministrator = async (req, res = response) => {
  const { administratorId } = req.params;
  try {
    //encontramos al administrador
    const administrator = await db.administrator.findByPk(administratorId);
    if (!administrator) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el administrador',
      });
    }
    //modificamos el administrador
    await db.administrator.update(
      req.body,
      {
        where: { id: administratorId },
      }
    )
    //modificamos el usuario
    await db.user.update(
      req.body,
      {
        where: { id: administrator.userId }
      }
    )

    return res.json({
      ok: true,
      administrator: await getAdministrator(administratorId),
      msg: 'administrador editado exitosamente'
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const deleteAdministrator = async (req, res = response) => {
  const { administratorId } = req.params;
  try {
    //encontramos al administrador
    const administrator = await db.administrator.findByPk(administratorId);
    if (!administrator) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el administrador',
      });
    }
    //modificamos al administrador
    await db.administrator.update(
      { active: false },
      {
        where: { id: administratorId },
      }
    )
    return res.json({
      ok: true,
      administrator: await getAdministrator(administratorId),
      msg: 'administrador eliminado'
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

module.exports = {
  getAdministrators,
  createAdministrator,
  updateAdministrator,
  deleteAdministrator,
}