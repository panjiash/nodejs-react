import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('tbl_user', {
    name: {
        type: DataTypes.STRING(50)
    },
    email: {
        type: DataTypes.STRING(50)
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    nomorHp: {
        type: DataTypes.BIGINT(10)
    },
    role: {
        type: DataTypes.INTEGER(2)
    },
    status: {
        type: DataTypes.INTEGER(1)
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Users;