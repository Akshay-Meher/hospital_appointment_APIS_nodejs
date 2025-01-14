'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DoctorDocument.belongsTo(models.Doctor, { foreignKey: "doctor_id" });
    }
  }
  DoctorDocument.init({
    doctor_id: DataTypes.INTEGER,
    aadhaar_card: DataTypes.STRING,
    certificate: DataTypes.STRING,
    isAadhaarVerified: DataTypes.BOOLEAN,
    isCertificateVerified: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'DoctorDocument',
  });
  return DoctorDocument;
};