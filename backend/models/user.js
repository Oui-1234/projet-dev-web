import { Model, DataTypes } from "sequelize";
import connection from "./db.js";
import bcrypt from "bcryptjs";

class User extends Model {
    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }
}

User.init({
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        }
    },
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user"
    }
}, {
    sequelize: connection,
});

async function hashPassword(user) {
    user.password = await bcrypt.hash(user.password, 10);
}

User.addHook('beforeCreate', hashPassword);

User.addHook("beforeUpdate", (user, { fields }) => {
    if (fields.includes('password')) {
        return hashPassword(user);
    }
});

export default User;