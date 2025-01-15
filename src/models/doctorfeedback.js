'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorFeedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DoctorFeedback.belongsTo(models.Patient, { foreignKey: 'patient_id' });
      DoctorFeedback.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });
    }
  }
  DoctorFeedback.init({
    patient_id: DataTypes.INTEGER,
    doctor_id: DataTypes.INTEGER,
    feedback_text: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'DoctorFeedback',
  });
  return DoctorFeedback;
};