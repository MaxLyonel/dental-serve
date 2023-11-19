const { response } = require('express');
const db = require('../../database/models');

const { functionGetTreatment } = require('./../treatment/controller');
const { functionGetPatient } = require('./../patient/controller');
const generateXlsx = require('../../config/generateXlsx');

const getMonthKey = (date) => {
  const month = new Date(date).getMonth() + 1; // +1 porque los meses van de 0 a 11
  const year = new Date(date).getFullYear();
  return `${year}-${month}`;
};
const groupTreatmentsByMonth = (treatments) => {
  const result = treatments.reduce((acc, treatment) => {
    const monthKey = getMonthKey(treatment.date);

    if (!acc.months.includes(monthKey)) {
      acc.months.push(monthKey);
      acc.treatmentCounts.push(1);
    } else {
      const index = acc.months.indexOf(monthKey);
      acc.treatmentCounts[index]++;
    }

    return acc;
  }, { months: [], treatmentCounts: [] });
  return result;
};
const groupTreatmentByStageType = (treatments) => {
  const result = treatments.reduce((acc, treatment) => {
    const stageTypeName = treatment.stageType.name;

    if (!acc.labels.includes(stageTypeName)) {
      acc.labels.push(stageTypeName);
      acc.series.push(1);
    } else {
      const index = acc.labels.indexOf(stageTypeName);
      acc.series[index]++;
    }

    return acc;
  }, { series: [], labels: [] });
  return result;
}

const getInfoDashboard = async (req, res = response) => {
  try {
    const treatments = await functionGetTreatment();
    const patients = await functionGetPatient();
    const groupedTreatmentsByMonth = await groupTreatmentsByMonth(treatments);
    const groupedTreatmentsByStageType = await groupTreatmentByStageType(treatments)
    return res.json({
      ok: true,
      countTreatments: treatments.length,
      countPatients: patients.length,
      treatmentsLineTime: groupedTreatmentsByMonth,
      treatmentDonut: groupedTreatmentsByStageType
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const getReport = async (req, res = response) => {
  try {
    const { nameStageType, dateTreatment } = req.body;
    const whereDate = dateTreatment ? {
      date: {
        [db.Sequelize.Op.between]: [new Date(dateTreatment[0]), new Date(dateTreatment[1])],
      },
    } : null;
    const whereStageType = nameStageType ? { id: nameStageType } : null;
    const treatments = await functionGetTreatment(null, whereDate, whereStageType);
    return res.json({
      ok: true,
      treatments: treatments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

const getReportDocument = async (req, res = response) => {
  try {
    const { nameStageType, dateTreatment } = req.body;
    const whereDate = dateTreatment ? {
      date: {
        [db.Sequelize.Op.between]: [new Date(dateTreatment[0]), new Date(dateTreatment[1])],
      },
    } : null;
    const whereStageType = nameStageType ? { id: nameStageType } : null;
    const treatments = await functionGetTreatment(null, whereDate, whereStageType);
    const newTreatments = treatments.map(treatment => ({
      "id": treatment.id,
      "descripcion": treatment.description,
      "Paciente": `${treatment.patient.user.name} ${treatment.patient.user.lastName}`,
      "Fecha": treatment.date,
      "Monto total": treatment.totalAmount,
      "Etapa": treatment.stageType.name,
      "Estado": treatment.state
    }))
    const doc = await generateXlsx(newTreatments);


    return res.json({
      ok: true,
      document: doc
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

module.exports = {
  getInfoDashboard,
  getReport,
  getReportDocument,
}