export default (sequelize, DataTypes) => {
  const testModel = sequelize.default('testModel', {
    id: DataTypes.INTEGER,
    name: DataType.TEXT,
  });
  return testModel;
};
