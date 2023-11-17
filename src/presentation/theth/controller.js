const { response } = require('express');
const db = require('../../database/models');
const { omit } = require("lodash");

const getTheths = async (req, res = response) => {
  try {
    const theths = await db.theth.findAll();
    return res.json({
      ok: true,
      theths: theths.map(theth => omit(theth.toJSON(), ['createdAt', 'updatedAt'])),
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
  getTheths,
}