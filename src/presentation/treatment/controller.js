const { response } = require('express');
const db = require('../../database/models');
const { omit } = require("lodash");

const getTreatment = async (treatmentId) => {
  const treatment = await db.treatment.findByPk(treatmentId, {
    include: [
      {
        model: db.administrator,
        include: [
          {
            model: db.user
          }
        ]
      },
      { model: db.stageType },
      {
        model: db.medicalHistory,
        include: [
          {
            model: db.patient,
            include: [
              {
                model: db.user
              }
            ]
          }
        ]
      }
    ]
  });
  return treatment;
  // const rolesWithPermissions = role.rolePermissions.map(rolePermission =>
  //   omit(rolePermission.toJSON(), ['roleId', 'permissionId'])
  // );
  // return ({ ...role.toJSON(), rolePermissions: rolesWithPermissions });
}

const getTreatments = async (req, res = response) => {
  try {
    const treatments = await db.treatment.findAll({
      include: [
        {
          model: db.administrator,
          include: [
            {
              model: db.user
            }
          ]
        },
        { model: db.stageType },
        {
          model: db.medicalHistory,
          include: [
            {
              model: db.patient,
              include: [
                {
                  model: db.user
                }
              ]
            }
          ]
        }
      ]
    });
    // const rolesWithPermissions = treatments.map(role => ({
    //   ...role.toJSON(),
    //   rolePermissions: role.rolePermissions.map(rolePermission =>
    //     omit(rolePermission.toJSON(), ['roleId', 'permissionId'])
    //   ),
    // }));
    return res.json({
      ok: true,
      treatments: treatments,
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
    //encontramos el historial medico por el id del paciente
    const { patientId } = req.body;
    const medicalHistory = await db.medicalHistory.findOne({ where: { patientId: patientId } })
    console.log(medicalHistory)
    //creamos el tratamiento
    const treatment = new db.treatment(req.body);
    treatment.administratorId = administratorId;
    treatment.medicalHistoryId = medicalHistory.id;
    console.log(treatment)
    await treatment.save();
    return res.json({
      ok: true,
      role: await getTreatment(treatment.id),
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
  const { roleId } = req.params;
  try {
    //encontramos al rol
    const role = await db.role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el rol',
      });
    }
    //modificamos el rol
    await db.role.update(
      req.body,
      { where: { id: roleId } }
    )
    //encontramos todas las asignaciones existentes para el rol
    const existingRolePermissions = await db.rolePermission.findAll({
      where: { roleId: roleId },
    });
    //identificamos los permisos que deben eliminarse
    const permissionsToDelete = existingRolePermissions.filter(
      (rolePermission) => !req.body.permissionIds.includes(rolePermission.permissionId)
    );
    //eliminamos las asignaciones de permisos que deben eliminarse
    await Promise.all(permissionsToDelete.map(async (rolePermission) => {
      await rolePermission.destroy();
    })
    );
    //modificamos la asignación si corresponde
    await Promise.all(req.body.permissionIds.map(async item => {
      //encontramos al permiso asignado
      let rolePermission = await db.rolePermission.findOne({ where: { roleId: roleId, permissionId: item } })
      if (!rolePermission) {
        //si no se encuentra; lo registramos
        rolePermission = new db.rolePermission({
          roleId: roleId,
          permissionId: item
        });
        await rolePermission.save();
      }
    }));
    return res.json({
      ok: true,
      role: await getRole(roleId),
      msg: 'rol editado exitosamente'
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
  const { roleId } = req.params;
  try {
    //encontramos al rol
    const role = await db.role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el rol',
      });
    }
    //modificamos al rol
    await db.role.update(
      { state: false },
      { where: { id: roleId } }
    );
    return res.json({
      ok: true,
      role: await getRole(roleId),
      msg: 'rol eliminado'
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
  getTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
}