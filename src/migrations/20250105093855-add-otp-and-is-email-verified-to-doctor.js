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

    await queryInterface.addColumn('Doctors', 'otp', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Doctors', 'otp_expiration', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Doctors', 'is_email_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('Doctors', 'otp');
    await queryInterface.removeColumn('Doctors', 'otp_expiration');
    await queryInterface.removeColumn('Doctors', 'is_email_verified');
  }
};
