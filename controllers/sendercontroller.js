// import pool from "../database.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { InsertSender, GetSenders } from '../models/sendermodel.js'




export const AddSenderAdmin = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../views', 'addsender.html'));
    }

    catch (error) {

    }
}

export const AddSenderAPI = async (req, res) => {
    try {
        

        const result = await InsertSender(req.body.sendername, req.body.sendernumber, req.body.senderalternatenumber)

        console.log(result,'this is result')
        return res.status(200).send(result)
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Error while adding sender',  error: error.message, sqlMessage: error.sqlMessage })
            
       
    }
}


export const GetSendersAPI = async (req, res) => {
    try {
        

        const [result] = await GetSenders()

        console.log(result,'this is result')
        return res.status(200).send(result)
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Error while adding sender',  error: error.message, sqlMessage: error.sqlMessage })
            
       
    }
}