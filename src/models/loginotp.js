'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoginOtp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LoginOtp.belongsTo(models.Patient, { foreignKey: 'userId' });
      LoginOtp.belongsTo(models.Doctor, { foreignKey: 'userId' });
    }
  }
  LoginOtp.init({
    userId: DataTypes.INTEGER,
    role: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    otpExpiration: DataTypes.DATE,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'LoginOtp',
  });
  return LoginOtp;
};