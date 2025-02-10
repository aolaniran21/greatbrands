module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    availableTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  });

  Event.associate = (models) => {
    Event.hasMany(models.Booking, {
      foreignKey: "eventId",
      onDelete: "CASCADE",
    });
    Event.hasMany(models.WaitingList, {
      foreignKey: "eventId",
      onDelete: "CASCADE",
    });
  };

  return Event;
};
