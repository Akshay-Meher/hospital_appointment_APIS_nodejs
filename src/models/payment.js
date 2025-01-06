// models/payment.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Appointment, { foreignKey: 'appointment_id' });
    }
  }

  Payment.init(
    {
      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Appointment ID is required' },
          isInt: { msg: 'Appointment ID must be an integer' },
        },
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: 'Amount is required' },
          isDecimal: { msg: 'Amount must be a valid decimal number' },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Payment status is required' },
          isIn: {
            args: [['Pending', 'Completed', 'Failed']],
            msg: 'Payment status must be one of Pending, Completed, or Failed',
          },
        },
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Transaction ID is required' },
          notEmpty: { msg: 'Transaction ID cannot be empty' },
        },
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'Payments',
      timestamps: true,
    }
  );

  return Payment;
};
