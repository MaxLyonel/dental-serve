const { response } = require('express');
const db = require('../../database/models');
const { omit } = require("lodash");

const getPatient = async (patientId) => {
  const patient = await db.patient.findByPk(patientId, {
    include: [
      { model: db.user },
    ],
  });

  return omit(patient.toJSON(), ['active', 'userId', 'responsableId']);
}

const getPatients = async (req, res = response) => {
  try {
    const patients = await db.patient.findAll({
      where: { active: true },
      include: [
        { model: db.user },
      ],
    });
    return res.json({
      ok: true,
      patients: patients.map(admin => omit(admin.toJSON(), ['active', 'userId', 'responsableId'])),
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const createPatient = async (req, res = response) => {

  try {
    //verificamos si existe el usuario
    let user = await db.user.findOne({ where: { identityCard: req.body.identityCard } });
    if (!user) {
      //  creacion de usuario
      user = new db.user(req.body);
      await user.save();
    }
    //verificamos si existe el paciente
    let patient = await db.patient.findOne({ where: { userId: user.id, active: true } });
    if (patient) {
      return res.status(400).json({
        ok: false,
        msg: 'El paciente ya se encuentra registrado',
      });
    }
    //creamos al paciente
    patient = new db.patient();
    patient.userId = user.id;
    patient.responsableId = 1;
    patient.allergies = req.body.allergies;
    patient.bloodType = req.body.bloodType;
    await patient.save();

    //creamos su historial medico
    medicalhistory = new db.medicalHistory();
    medicalhistory.patientId = patient.id
    await medicalhistory.save();

    return res.json({
      ok: true,
      patient: await getPatient(patient.id),
      msg: 'paciente registrado exitosamente'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const updatePatient = async (req, res = response) => {
  const { patientId } = req.params;
  try {
    //encontramos al paciente
    const patient = await db.patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el paciente',
      });
    }
    //modificamos el paciente
    await db.patient.update(
      req.body,
      {
        where: { id: patientId },
      }
    )
    //modificamos el usuario
    await db.user.update(
      req.body,
      {
        where: { id: patient.userId }
      }
    )

    return res.json({
      ok: true,
      patient: await getPatient(patientId),
      msg: 'paciente editado exitosamente'
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const deletePatient = async (req, res = response) => {
  const { patientId } = req.params;
  try {
    //encontramos al paciente
    const patient = await db.patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró al paciente',
      });
    }
    //modificamos al paciente
    await db.patient.update(
      { active: false },
      {
        where: { id: patientId },
      }
    )
    return res.json({
      ok: true,
      patient: await getPatient(patientId),
      msg: 'paciente eliminado'
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
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
}