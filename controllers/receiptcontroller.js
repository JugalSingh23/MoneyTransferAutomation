// import pool from "../database.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);






export const prabhureceipt = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../views', 'prabhutemp.html'));
    }

    catch (error) {

    }
}

