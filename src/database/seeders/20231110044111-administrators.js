'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //crear permisos
    await queryInterface.bulkInsert('permissions', [
      {
        name: 'crear administradores',
        module: 'administradores',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'editar administradores',
        module: 'administradores',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'eliminar administradores',
        module: 'administradores',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'crear roles ',
        module: 'roles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'editar roles',
        module: 'roles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'eliminar roles',
        module: 'roles',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    //crear rol
    await queryInterface.bulkInsert('roles', [{
      name: 'administrador',
      description: 'admin',
      state: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }])

    //crear la asociación entre rol y los permisos creados
    const permissions = await queryInterface.sequelize.query(
      `SELECT id from permissions;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const roles = await queryInterface.sequelize.query(
      `SELECT id from roles;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const permission of permissions) {
      await queryInterface.bulkInsert('rolePermissions', [{
        roleId: roles[0].id,
        permissionId: permission.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }

    //crear al usuario
    await queryInterface.bulkInsert('users', [{
      identityCard: 8312915,
      name: 'Moises',
      lastName: 'Ochoa',
      phone: 73735766,
      birthDate: new Date(),
      gender: 'Masculino',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    //crear al administrador
    const users = await queryInterface.sequelize.query(
      `SELECT * from users;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    await queryInterface.bulkInsert('administrators', [{
      userId: users[0].id,
      roleId: roles[0].id,
      password: bcrypt.hashSync(`${users[0].identityCard}`, bcrypt.genSaltSync()),
      active: true,
      superAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
