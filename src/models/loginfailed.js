'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoginFailed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LoginFailed.belongsTo(models.Doctor, { foreignKey: 'userId' });
      LoginFailed.belongsTo(models.Patient, { foreignKey: 'userId' });
    }
  }
  LoginFailed.init({
    userId: DataTypes.INTEGER,
    role: DataTypes.STRING,
    loginFailedCount: DataTypes.INTEGER,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'LoginFailed',
  });
  return LoginFailed;
};