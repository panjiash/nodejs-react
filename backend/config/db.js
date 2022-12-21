import { createConnection } from 'mysql2';

const db = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "auth_db"
});
// db.connect();
export default db;