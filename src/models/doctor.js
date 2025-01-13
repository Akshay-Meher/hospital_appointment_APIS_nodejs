// models/doctor.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Doctor extends Model {
    static associate(models) {
      // Define associations here if needed later
      Doctor.hasMany(models.Appointment, { foreignKey: 'doctor_id', as: 'appointments' });
      Doctor.belongsToMany(models.Hospital, { through: 'DoctorHospital', foreignKey: 'doctor_id' });
      Doctor.hasOne(models.OtpToken, { foreignKey: 'userId' });
      Doctor.hasOne(models.LoginFailed, { foreignKey: 'userId' });
      Doctor.hasOne(models.LoginOtp, { foreignKey: 'userId' });

    }
  }

  Doctor.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      license_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      years_of_experience: {
        type: DataTypes.INTEGER,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // otp: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // otp_expiration: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
      // is_email_verified: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: false,
      // },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }

    },
    {
      sequelize,
      modelName: 'Doctor',
      tableName: 'Doctors',
      timestamps: true,
    }
  );

  return Doctor;
};
