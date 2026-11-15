import { Model, DataTypes } from "sequelize";
import connection from "./db.js";
import Category from "./category.js";

class Equipment extends Model { }

Equipment.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM("available", "maintenance", "retired"),
        allowNull: false,
        defaultValue: "available",
        validate: {
            isIn: [["available", "maintenance", "retired"]]
        }
    }
}, {
    sequelize: connection
});

Category.hasMany(Equipment, { foreignKey: "categoryId" });
Equipment.belongsTo(Category, { foreignKey: "categoryId" });

export default Equipment;
