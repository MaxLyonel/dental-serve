'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //crear permisos
    await queryInterface.bulkInsert('permissions', [
      //administradores
      {
        name: 'ver administradores',
        module: 'administradores',
        createdAt: new Date(),
        updatedAt: new Date()
      },
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
      //roles
      {
        name: 'ver roles',
        module: 'roles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'crear roles',
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
      },
      //permisos
      {
        name: 'ver permisos',
        module: 'permisos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //pacientes
      {
        name: 'ver pacientes',
        module: 'pacientes',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'crear pacientes',
        module: 'pacientes',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'editar pacientes',
        module: 'pacientes',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'eliminar pacientes',
        module: 'pacientes',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //calendario
      {
        name: 'ver calendario',
        module: 'calendario',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'efectuar pago',
        module: 'calendario',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'eliminar pago',
        module: 'calendario',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //tratamiento
      {
        name: 'crear tratamiento',
        module: 'tratamiento',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'editar tratamiento',
        module: 'tratamiento',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'eliminar tratamiento',
        module: 'tratamiento',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //reporte
      {
        name: 'ver reportes',
        module: 'reporte',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);

    //crear rol
    await queryInterface.bulkInsert('roles', [{
      name: 'administrador',
      description: 'admin',
      state: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

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

    //creamos los dientes
    await queryInterface.bulkInsert('theths', [
      {
        name: 'Incisivo Central Superior Izquierdo',
        description: 'Diente incisivo ubicado en la parte frontal superior izquierda.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Incisivo Central Superior Derecho',
        description: 'Diente incisivo ubicado en la parte frontal superior derecha.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Incisivo Lateral Superior Izquierdo',
        description: 'Diente incisivo ubicado al lado del incisivo central superior izquierdo.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Incisivo Lateral Superior Derecho',
        description: 'Diente incisivo ubicado al lado del incisivo central superior derecho.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Canino Superior Izquierdo',
        description: 'Diente cónico ubicado en la parte superior izquierda.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Canino Superior Derecho',
        description: 'Diente cónico ubicado en la parte superior derecha.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Primer Premolar Superior Izquierdo',
        description: 'Diente premolar ubicado en la parte superior izquierda, el primero después del canino.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Primer Premolar Superior Derecho',
        description: 'Diente premolar ubicado en la parte superior derecha, el primero después del canino.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Segundo Premolar Superior Izquierdo',
        description: 'Diente premolar ubicado en la parte superior izquierda, el segundo después del primer premolar.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Segundo Premolar Superior Derecho',
        description: 'Diente premolar ubicado en la parte superior derecha, el segundo después del primer premolar.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Primer Molar Superior Izquierdo',
        description: 'Diente molar ubicado en la parte superior izquierda, el primero en la fila de molares.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Primer Molar Superior Derecho',
        description: 'Diente molar ubicado en la parte superior derecha, el primero en la fila de molares.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Segundo Molar Superior Izquierdo',
        description: 'Diente molar ubicado en la parte superior izquierda, el segundo en la fila de molares.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Segundo Molar Superior Derecho',
        description: 'Diente molar ubicado en la parte superior derecha, el segundo en la fila de molares.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tercer Molar Superior Izquierdo (Muela del Juicio)',
        description: 'Último molar ubicado en la parte superior izquierda.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tercer Molar Superior Derecho (Muela del Juicio)',
        description: 'Último molar ubicado en la parte superior derecha.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Incisivo Central Inferior Izquierdo',
        description: 'Diente incisivo ubicado en la parte frontal inferior izquierda.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Incisivo Central Inferior Derecho',
        description: 'Diente incisivo ubicado en la parte frontal inferior derecha.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Incisivo Lateral Inferior Izquierdo',
        description: 'Diente incisivo ubicado al lado del incisivo central inferior izquierdo.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Incisivo Lateral Inferior Derecho',
        description: 'Diente incisivo ubicado al lado del incisivo central inferior derecho.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Canino Inferior Izquierdo',
        description: 'Diente cónico ubicado en la parte inferior izquierda.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Canino Inferior Derecho',
        description: 'Diente cónico ubicado en la parte inferior derecha.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Primer Premolar Inferior Izquierdo',
        description: 'Diente premolar ubicado en la parte inferior izquierda, el primero después del canino.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Primer Premolar Inferior Derecho',
        description: 'Diente premolar ubicado en la parte inferior derecha, el primero después del canino.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Segundo Premolar Inferior Izquierdo',
        description: 'Diente premolar ubicado en la parte inferior izquierda, el segundo después del primer premolar.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Segundo Premolar Inferior Derecho',
        description: 'Diente premolar ubicado en la parte inferior derecha, el segundo después del primer premolar.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Primer Molar Inferior Izquierdo',
        description: 'Diente molar ubicado en la parte inferior izquierda, el primero en la fila de molares.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Primer Molar Inferior Derecho',
        description: 'Diente molar ubicado en la parte inferior derecha, el primero en la fila de molares.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Segundo Molar Inferior Izquierdo',
        description: 'Diente molar ubicado en la parte inferior izquierda, el segundo en la fila de molares.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Segundo Molar Inferior Derecho',
        description: 'Diente molar ubicado en la parte inferior derecha, el segundo en la fila de molares.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tercer Molar Inferior Izquierdo (Muela del Juicio)',
        description: 'Último molar ubicado en la parte inferior izquierda.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tercer Molar Inferior Derecho (Muela del Juicio)',
        description: 'Último molar ubicado en la parte inferior derecha.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
    await queryInterface.bulkInsert('stageTypes', [
      {
        name: 'Rutina',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Diagnostico',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tratamiento',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Seguimiento',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Emergencia',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
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
