'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.INTEGER,
    creator: DataTypes.INTEGER,
    assignedTo: DataTypes.INTEGER
  });

  Task.associate = (models) => {
    models.Task.belongsToMany(models.Tag, {through: 'TaskTag'});
    models.Tag.belongsToMany(models.Task, {through: 'TaskTag'});

  };

  return Task;
};