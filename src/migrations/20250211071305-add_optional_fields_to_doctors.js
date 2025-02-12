'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const tableInfo = await queryInterface.describeTable('Doctors');

    // Add 'profile_image' column if it doesn't exist
    if (!tableInfo.hasOwnProperty('profile_image')) {
      await queryInterface.addColumn('Doctors', 'profile_image', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // Add 'degree' column if it doesn't exist
    if (!tableInfo.hasOwnProperty('degree')) {
      await queryInterface.addColumn('Doctors', 'degree', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // Add 'about' column if it doesn't exist
    if (!tableInfo.hasOwnProperty('about')) {
      await queryInterface.addColumn('Doctors', 'about', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // Add 'fees' column if it doesn't exist
    if (!tableInfo.hasOwnProperty('fees')) {
      await queryInterface.addColumn('Doctors', 'fees', {
        type: Sequelize.FLOAT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    const tableInfo = await queryInterface.describeTable('Doctors');

    // Remove 'profile_image' column if it exists
    if (tableInfo.hasOwnProperty('profile_image')) {
      await queryInterface.removeColumn('Doctors', 'profile_image');
    }

    // Remove 'degree' column if it exists
    if (tableInfo.hasOwnProperty('degree')) {
      await queryInterface.removeColumn('Doctors', 'degree');
    }

    // Remove 'about' column if it exists
    if (tableInfo.hasOwnProperty('about')) {
      await queryInterface.removeColumn('Doctors', 'about');
    }

    // Remove 'fees' column if it exists
    if (tableInfo.hasOwnProperty('fees')) {
      await queryInterface.removeColumn('Doctors', 'fees');
    }
  }
};
