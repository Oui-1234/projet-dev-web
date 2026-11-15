import { Model, DataTypes } from "sequelize";
import connection from "./db.js";
import Equipment from "./equipment.js";
import User from "./user.js";

class UsageLog extends Model { }

UsageLog.init({
    type: {
        type: DataTypes.ENUM("checkout", "return", "maintenance", "repair"),
        allowNull: false,
        validate: {
            isIn: [["checkout", "return", "maintenance", "repair"]]
        }
    },
    notes: DataTypes.TEXT,
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize: connection
});

const equipmentKey = { name: "equipmentId", allowNull: false };
Equipment.hasMany(UsageLog, { foreignKey: equipmentKey });
UsageLog.belongsTo(Equipment, { foreignKey: equipmentKey });

User.hasMany(UsageLog, { foreignKey: "userId" });
UsageLog.belongsTo(User, { foreignKey: "userId" });

export default UsageLog;
