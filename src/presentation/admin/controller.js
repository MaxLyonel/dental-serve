const { response } = require('express');
const bcrypt = require('bcryptjs');
// const { UserSchema, WarehouseSchema } = require('./../../models');
const db = require('../../database/models');
// const { transformUserWarehouses } = require('./../../helpers');

const getAdministrators = async (req, res = response) => {
  try {
    const users = await db.user.findAll();

    res.json({
      ok: true,
      users: users
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const createAdministrator = async (req, res = response) => {
  try {
    const person = new db.person(req.body);
    await person.save();
    return res.json({
      ok: true,
      person,
      msg: 'administrador registrado exitosamente'
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

module.exports = {
  getAdministrators,
  createAdministrator,
}