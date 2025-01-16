'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ForgotPasswordToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ForgotPasswordToken.belongsTo(models.Admin, { foreignKey: 'userId' });
      ForgotPasswordToken.belongsTo(models.Doctor, { foreignKey: 'userId' });
      ForgotPasswordToken.belongsTo(models.Patient, { foreignKey: 'userId' });
    }
  }
  ForgotPasswordToken.init({
    userId: DataTypes.INTEGER,
    role: DataTypes.STRING,
    token: DataTypes.TEXT,
    tokenExipiration: DataTypes.DATE,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ForgotPasswordToken',
  });
  return ForgotPasswordToken;
};