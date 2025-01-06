const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patientDetails' });
      Appointment.belongsTo(models.Doctor, { foreignKey: 'doctor_id', as: 'doctorDetails' });
    }
  }

  Appointment.init(
    {
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      appointment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      appointment_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },

    {
      sequelize,
      modelName: 'Appointment',
      tableName: 'Appointments',
      timestamps: true,
    }
  );

  return Appointment;
};
