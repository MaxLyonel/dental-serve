const { response } = require('express');
const db = require('../../database/models');
const { omit } = require("lodash");

const getRole = async (roleId) => {
  console.log(roleId)
  const role = await db.role.findByPk(roleId, {
    include: [
      {
        model: db.rolePermission,
        include: [
          {
            model: db.permission,
          }
        ]
      }
    ],
  });
  const rolesWithPermissions = role.rolePermissions.map(rolePermission =>
    omit(rolePermission.toJSON(), ['roleId', 'permissionId'])
  );
  return ({ ...role.toJSON(), rolePermissions: rolesWithPermissions });
}

const getRoles = async (req, res = response) => {
  try {
    const roles = await db.role.findAll({
      include: [
        {
          model: db.rolePermission,
          include: [
            {
              model: db.permission
            }
          ]
        }
      ]
    });
    const rolesWithPermissions = roles.map(role => ({
      ...role.toJSON(),
      rolePermissions: role.rolePermissions.map(rolePermission =>
        omit(rolePermission.toJSON(), ['roleId', 'permissionId'])
      ),
    }));
    return res.json({
      ok: true,
      roles: rolesWithPermissions,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const createRole = async (req, res = response) => {
  try {
    //creamos el rol
    const role = new db.role(req.body);
    await role.save();
    //asignamos los permisos al rol
    await Promise.all(req.body.permissionIds.map(async item => {
      const rolePermission = new db.rolePermission({
        roleId: role.id,
        permissionId: item
      });
      await rolePermission.save();
    }));
    return res.json({
      ok: true,
      role: await getRole(role.id),
      msg: 'rol registrado exitosamente'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const updateRole = async (req, res = response) => {
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

const deleteRole = async (req, res = response) => {
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
  getRoles,
  createRole,
  updateRole,
  deleteRole,
}