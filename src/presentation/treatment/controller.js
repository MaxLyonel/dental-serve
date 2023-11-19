const { response } = require('express');
const db = require('../../database/models');
const { omit } = require("lodash");
const { functionGetPatient } = require('../patient/controller');

const formatTreatment = (treatment) => ({
  ...omit(treatment.toJSON(), ['administratorId', 'stageTypeId', 'thethTreataments', 'createdAt', 'updatedAt']),
  amountDue: treatment.totalAmount - ([...treatment.payments.map(payment => payment.amount)].reduce((amount, number) => amount + number, 0)),
  stageType: omit(treatment.stageType.toJSON(), ['state', 'createdAt', 'updatedAt']),
  patient: {
    ...omit(treatment.patient.toJSON(), ['userId', 'responsableId', 'active', 'createdAt', 'updatedAt']),
    user: omit(treatment.patient.user.toJSON(), ['createdAt', 'updatedAt'])
  },
  thethIds: treatment.thethTreataments.map(thethTreatament => omit(thethTreatament.theth.toJSON(), ['createdAt', 'updatedAt'])),
  payments: treatment.payments.map(payment => omit(payment.toJSON(), ['treatmentId', 'administratorId', 'updatedAt']))
});

const functionGetTreatment = async (treatmentId, where = null, whereStageType = null) => {
  let queryOptions = {
    include: [
      {
        model: db.stageType,
        where: whereStageType || undefined,
      },
      {
        model: db.patient,
        include: [
          {
            model: db.user,
          },
        ],
      },
      {
        model: db.thethTreatament,
        include: [
          { model: db.theth },
        ],
      },
      { model: db.payment },
    ],
  };
  if (treatmentId) {
    const treatment = await db.treatment.findByPk(treatmentId, queryOptions);
    return formatTreatment(treatment);
  } else {
    const treatments = await db.treatment.findAll({
      ...queryOptions,
      where: where || undefined, // Agregar el where solo si tiene un valor
    });
    return treatments.map(treatment => formatTreatment(treatment));
  }
};

const getTreatments = async (req, res = response) => {
  const where = { state: { [db.Sequelize.Op.ne]: 'cancelado' } };

  try {
    return res.json({
      ok: true,
      treatments: await functionGetTreatment(null, where),
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const createTreatment = async (req, res = response) => {
  try {
    //encontramos al administrador por el token
    const administratorId = req.uid;
    //creamos el tratamiento
    const treatment = new db.treatment(req.body);
    treatment.administratorId = administratorId;
    await treatment.save();
    //asignamos los dientes al tratamiento
    await Promise.all(req.body.thethIds.map(async item => {
      const thethTreatament = new db.thethTreatament({
        treatmentId: treatment.id,
        thethId: item
      });
      await thethTreatament.save();
    }));
    console.log('SE CREO TODO ')
    return res.json({
      ok: true,
      treatment: await functionGetTreatment(treatment.id),
      msg: 'tratamiento registrado exitosamente'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const updateTreatment = async (req, res = response) => {
  const { treatmentId } = req.params;
  try {
    //encontramos el tratamiento
    const treatment = await db.treatment.findByPk(treatmentId, {
      include: [
        {
          model: db.thethTreatament,
          include: [
            { model: db.theth }
          ]
        }
      ]
    });
    if (!treatment) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el tratamiento',
      });
    }
    //modificamos el tratamiento
    await db.treatment.update(
      req.body,
      {
        where: { id: treatmentId },

      }
    )
    //encontramos todas las asignaciones existentes para los dientes
    const existingThethTreataments = await db.thethTreatament.findAll({
      where: { treatmentId: treatmentId },
    });
    //identificamos los dientes que deben eliminarse
    const thethsToDelete = existingThethTreataments.filter(
      (thethTreatment) => !req.body.thethIds.includes(thethTreatment.thethId)
    );
    //eliminamos las asignaciones de dientes que deben eliminarse
    await Promise.all(thethsToDelete.map(async (thethTreatment) => {
      await thethTreatment.destroy();
    }));
    //modificamos la asignación si corresponde
    const theths = treatment.thethTreataments.map((thethTreatament) => thethTreatament.thethId);
    await Promise.all(req.body.thethIds.map(async item => {
      //encontramos al diente asignado
      if (!theths.includes(item)) {
        //si no se encuentra; lo registramos
        const thethTreatament = new db.thethTreatament({
          treatmentId: treatmentId,
          thethId: item
        });
        await thethTreatament.save();
      }
    }));
    return res.json({
      ok: true,
      patient: await functionGetPatient(treatment.patientId),
      msg: 'tratamiento editado exitosamente'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const deleteTreatment = async (req, res = response) => {
  const { treatmentId } = req.params;
  try {
    //encontramos el tratamiento
    const treatment = await db.treatment.findByPk(treatmentId);
    if (!treatment) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el tratamiento',
      });
    }
    //modificamos el tratamiento
    await db.treatment.update(
      { state: 'cancelado' },
      { where: { id: treatmentId } }
    );
    console.log(treatment)
    return res.json({
      ok: true,
      patient: await functionGetPatient(treatment.patientId),
      msg: 'tratamiento cancelado'
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
  functionGetTreatment,
  getTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
}