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
    // await queryInterface.addColumn('Appointments', 'appointment_time', {
    //   type: Sequelize.TIME,
    //   allowNull: false,
    // });


    // Check if the 'appointment_time' column already exists in the 'Appointments' table
    const tableInfo = await queryInterface.describeTable('Appointments');

    if (!tableInfo.hasOwnProperty('appointment_time')) {
      // Add the column if it doesn't exist
      await queryInterface.addColumn('Appointments', 'appointment_time', {
        type: Sequelize.TIME,
        allowNull: false,
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
    // await queryInterface.removeColumn('Appointments', 'appointment_time');
    // Check if the 'appointment_time' column exists in the 'Appointments' table
    const tableInfo = await queryInterface.describeTable('Appointments');

    if (tableInfo.hasOwnProperty('appointment_time')) {
      // Remove the column if it exists
      await queryInterface.removeColumn('Appointments', 'appointment_time');
    }
  }
};
