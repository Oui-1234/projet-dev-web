import connection from "./models/db.js";
import User from "./models/user.js";
import Category from "./models/category.js";
import Equipment from "./models/equipment.js";
import "./models/usageLog.js";
import "./models/reservation.js";

await connection.sync();

const users = [
    { email: "alice@test.com", password: "Secret123!", firstname: "Alice", role: "admin" },
    { email: "bob@test.com", password: "Secret123!", firstname: "Bob", role: "user" },
    { email: "carol@test.com", password: "Secret123!", firstname: "Carol", role: "user" }
];
for (const user of users) {
    await User.findOrCreate({ where: { email: user.email }, defaults: user });
}

const categories = [
    { name: "Audio", description: "Micros, enceintes, tables de mixage" },
    { name: "Vidéo", description: "Caméras, trépieds, projecteurs" },
    { name: "Informatique", description: "Ordinateurs portables, tablettes" }
];
const categoryIds = {};
for (const category of categories) {
    const [row] = await Category.findOrCreate({ where: { name: category.name }, defaults: category });
    categoryIds[category.name] = row.id;
}

const equipments = [
    { name: "Micro Shure SM58", category: "Audio" },
    { name: "Enceinte JBL EON", category: "Audio" },
    { name: "Caméra Sony FX30", category: "Vidéo" },
    { name: "Trépied Manfrotto", category: "Vidéo" },
    { name: "Vidéoprojecteur Epson", category: "Vidéo" },
    { name: "MacBook Pro 14", category: "Informatique" },
    { name: "iPad Air", category: "Informatique", status: "maintenance" }
];
for (const { category, ...equipment } of equipments) {
    await Equipment.findOrCreate({
        where: { name: equipment.name },
        defaults: { ...equipment, categoryId: categoryIds[category] }
    });
}

console.log("Seed terminé");
await connection.close();
