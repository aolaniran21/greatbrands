module.exports = (sequelize, DataTypes) => {
  const WaitingList = sequelize.define("WaitingList", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  WaitingList.associate = (models) => {
    WaitingList.belongsTo(models.Event, { foreignKey: "eventId" });
  };

  return WaitingList;
};
