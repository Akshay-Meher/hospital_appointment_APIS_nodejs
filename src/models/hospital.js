'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hospital.belongsToMany(models.Doctor, { through: 'DoctorHospitals', foreignKey: 'hospital_id' });
      Hospital.hasMany(models.Admit, { foreignKey: 'hospital_id' });
    }
  }
  Hospital.init({
    hostpital_name: DataTypes.STRING,
    address: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    specializations: DataTypes.JSON,
    capacity: DataTypes.INTEGER,
    available_beds: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Hospital',
  });
  return Hospital;
};