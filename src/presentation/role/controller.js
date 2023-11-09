const { response } = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../database/models');

const getRoles = async (req, res = response) => {
  try {
    const roles = await db.role.findAll();

    res.json({
      ok: true,
      roles: roles
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const createRole = async (req, res = response) => {
  try {
    const role = new db.role(req.body);
    await role.save();
    return res.json({
      ok: true,
      role,
      msg: 'rol registrado exitosamente'
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
  getRoles,
  createRole,
}