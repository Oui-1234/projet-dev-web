import { Model, DataTypes } from "sequelize";
import connection from "./db.js";

class Category extends Model { }


Category.init({
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    description: DataTypes.TEXT
}, {
    sequelize: connection
});



export default Category;

