'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admit.belongsTo(models.Patient, { foreignKey: 'patient_id' });
      Admit.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });
      Admit.belongsTo(models.Hospital, { foreignKey: 'hospital_id' });

    }
  }
  Admit.init({
    patient_id: DataTypes.INTEGER,
    doctor_id: DataTypes.INTEGER,
    hospital_id: DataTypes.INTEGER,
    admit_date: DataTypes.DATE,
    discharge_date: DataTypes.DATE,
    status: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Admit',
  });
  return Admit;
};