// import pool from "../database.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { InsertReceiver, GetReceivers } from '../models/receivermodel.js'




export const AddReceiverAdmin = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../views', 'addreceiver.html'));
    }

    catch (error) {

    }
}

export const AddReceiverAPI = async (req, res) => {
    try {
        

        const result = await InsertReceiver(req.body.receivername, req.body.receiverbankname, req.body.receiveracno)

        console.log(result,'this is result')
        return res.status(200).send(result)
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Error while adding sender',  error: error.message, sqlMessage: error.sqlMessage })
            
       
    }
}

export const GetReceiversAPI = async (req, res) => {
    try {
      

        const [result] = await GetReceivers()

        console.log(result,'this is result')
        return res.status(200).send(result)
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Error while adding sender',  error: error.message, sqlMessage: error.sqlMessage })
            
       
    }
}