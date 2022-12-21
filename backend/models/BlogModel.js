import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Blog = db.define('tbl_blog', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
}, {
    freezeTableName: true
});

export default Blog;

(async () => {
    await db.sync();
})();