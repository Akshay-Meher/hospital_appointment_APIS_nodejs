'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OtpToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OtpToken.belongsTo(models.Patient, { foreignKey: 'userId' });
      OtpToken.belongsTo(models.Doctor, { foreignKey: 'userId' });
    }
  }
  OtpToken.init({
    userId: DataTypes.INTEGER,
    role: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    token: DataTypes.STRING,
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    otpExpiration: DataTypes.DATE,
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'OtpToken',
  });
  return OtpToken;
};