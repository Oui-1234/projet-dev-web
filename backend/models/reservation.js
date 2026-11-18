import { Model, DataTypes } from 'sequelize';
import connection from './db.js';
import User from './user.js';
import Equipment from './equipment.js';

class Reservation extends Model { }

Reservation.init({
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,

        }
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
        }
    },
    status: {
        type: DataTypes.ENUM("pending", "approved", "rejected", "cancelled", "returned"),
        allowNull: false,
        defaultValue: "pending",
        validate: {
            isIn: [["pending", "approved", "rejected", "cancelled", "returned"]]
        }
    },
    comment: DataTypes.TEXT
}, {
    sequelize: connection,
    validate: {
        datesInOrder() {
            if (this.endDate < this.startDate) {
                throw new Error("End date must be after start date");
            }
        }
    }
});

const userKey = { name: "userId", allowNull: false };
User.hasMany(Reservation, { foreignKey: userKey });
Reservation.belongsTo(User, { foreignKey: userKey });

const equipmentKey = { name: "equipmentId", allowNull: false };
Equipment.hasMany(Reservation, { foreignKey: equipmentKey });
Reservation.belongsTo(Equipment, { foreignKey: equipmentKey });

export default Reservation;