const { response } = require('express');
const db = require('../../database/models');
const { omit } = require("lodash");

const getStageTypes = async (req, res = response) => {
  try {
    const stageTypes = await db.stageType.findAll();
    return res.json({
      ok: true,
      stageTypes: stageTypes.map(stageType => omit(stageType.toJSON(), ['createdAt', 'updatedAt'])),
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
  getStageTypes,
}