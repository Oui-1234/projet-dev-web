export const validationErrorNames = [
    "SequelizeValidationError",
    "SequelizeUniqueConstraintError",
    "SequelizeForeignKeyConstraintError"];

export default function formatErrors(error) {
    const errors = {};
    if (error.name === "SequelizeForeignKeyConstraintError") {
        const match = error.parent.detail.match(/Key \((.+)\)=/);
        const field = match ? match[1] : "id";
        errors[field] = [`${field} does not exist`];
        return errors;
    }
    for (const item of error.errors) {
        const key = item.path;
        if (!errors[key]) errors[key] = [];
        errors[key].push(item.message);
    }
    return errors;
}