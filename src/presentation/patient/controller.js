const { response } = require('express');
const db = require('../../database/models');
const { omit } = require("lodash");

const getPatient = async (patientId) => {
  const patient = await db.patient.findByPk(patientId, {
    include: [
      { model: db.user },
      {
        model: db.treatment,
        include: [
          { model: db.stageType },
          {
            model: db.thethTreatament,
            include: [
              { model: db.theth }
            ]
          }
        ]
      }
    ],
  });

  return ({
    ...omit(patient.toJSON(), ['active', 'userId', 'responsableId', 'createdAt', 'updatedAt']),
    user: omit(patient.user.toJSON(), ['createdAt', 'updatedAt']),
    treatments: patient.treatments.map(treatment => ({
      ...omit(treatment.toJSON(), ['administratorId', 'stageTypeId', 'createdAt', 'updatedAt', 'thethTreataments']),
      stageType: omit(treatment.stageType.toJSON(), ['state', 'createdAt', 'updatedAt']),
      theths: treatment.thethTreataments.map(thethTreatament => omit(thethTreatament.theth.toJSON(), ['createdAt', 'updatedAt']))
    }))
  });
}

const getPatients = async (req, res = response) => {
  try {
    const patients = await db.patient.findAll({
      where: { active: true },
      include: [
        { model: db.user },
        {
          model: db.treatment,
          include: [
            { model: db.stageType },
            {
              model: db.thethTreatament,
              include: [
                { model: db.theth }
              ]
            }
          ]
        }
      ],
    });
    const formatPatients = await Promise.all([...patients.map(async patient => ({
      ...omit(patient.toJSON(), ['active', 'userId', 'responsableId', 'createdAt', 'updatedAt']),
      user: omit(patient.user.toJSON(), ['createdAt', 'updatedAt']),
      treatments: patient.treatments.map(treatment => ({
        ...omit(treatment.toJSON(), ['administratorId', 'patientId', 'stageTypeId', 'thethTreataments', 'createdAt', 'updatedAt']),
        stageType: omit(treatment.stageType.toJSON(), ['state', 'createdAt', 'updatedAt']),
        theths: treatment.thethTreataments.map(thethTreatament => omit(thethTreatament.theth.toJSON(), ['createdAt', 'updatedAt']))
      }))
    })
    )]);

    return res.json({
      ok: true,
      patients: formatPatients
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
  //encontramos al administrador por el token
  const administratorId = req.uid;
  console.log(administratorId)
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
    patient.responsableId = administratorId;
    patient.allergies = req.body.allergies;
    patient.bloodType = req.body.bloodType;
    await patient.save();

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