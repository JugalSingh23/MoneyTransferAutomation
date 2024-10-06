// import pool from "../database.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { autotransact } from '../controllers/Selenium Prabhu Automation/script.js';
import { promises as fs } from 'fs';
import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import { makepayment } from '../models/paymentmodel.js'




export const MakePaymentAdmin = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../views', 'makepayment.html'));
    }

    catch (error) {

    }
}





let clientInitialized = false;
let client;

const initClient = async () => {
    if (!clientInitialized) {
        client = new Client({
            puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
            authStrategy: new LocalAuth(),
        });

        client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.generate(qr, { small: true });
        });

        client.on('error', (error) => {
            console.error('Client error:', error);
        });

        client.on('ready', () => {
            console.log('Client is ready!');
            clientInitialized = true; // Mark client as initialized
        });

        await client.initialize();
        console.log('Client initialized');
    }
};

await initClient(); // Ensure the client is initialized
export const MakePaymentAPI = async (req, res) => {
    try {
        if (!clientInitialized) {
            return res.status(400).json({ message: 'Whatsapp Client is not ready wait a few seconds...' });
        }

        console.log(`hiii`, req.body)
        const receivername = req.body.receivername.split("- ")
        const sendername = req.body.sendername.split("- ")
        sendername[1] = sendername[1].slice(0, 30);
        const refcode = await autotransact(receivername[1],req.body.receiverbankname,req.body.receiveracno,req.body.amount,sendername[1]);
        const currentDate = new Date(Date.now());


        const receiptstring = "        *TRANSACTION RECEIPT*" + "\n\n" +
     "```Reference Code : " + refcode + "```" + "\n\n" +
    "```Date Time : " + currentDate.toString() + "```" + "\n\n" +
    "```Sender Name : " + sendername[1] + "```" + "\n\n" +
    "```Sender Mobile No. : " + req.body.sendernumber + "```" + "\n\n" +
    "```Receiver Account No.: " + req.body.receiveracno + "```" + "\n\n" +
    "```Receiver Name : " + receivername[1] + "```" + "\n\n" +
    "```Receiver Bank Name : " + req.body.receiverbankname + "```" + "\n\n" +
    "```Amount (NPR): " + req.body.amount + "```" + "\n\n" +
    "```Status : TRANSACTION COMPLETED```" + "\n\n" +
    "```IPS Status : TRANSACTION COMPLETED```";
        // const string = "Transaction Receipt"+"\n\n"+"Reference Code : "+refcode+"\n\n"+"Date Time : "+currentDate.toString()+"\n\n"+"From : "+sendername[1]+"\n\n"+"To Account : "+req.body.receiveracno+"\n\n"+"To Account Holder name : "+receivername[1]+"\n\n"+"Bank Name : "+req.body.receiverbankname+"\n\n"+"Amount : "+req.body.amount+"\n\n"+"Status : TRANSACTION COMPLETED"+"\n\n"+"IPS Status : TRANSACTION COMPLETED"
        
        

        
        
         

        
        
        

        const receiptfilepath = path.join(__dirname, 'recentreceipt.txt');
        await fs.writeFile(receiptfilepath, receiptstring, 'utf8');

        

      

        

        const number = `91${req.body.sendernumber}@c.us`;
        const message = await fs.readFile(receiptfilepath, 'utf-8');

        client.sendMessage(number, message)
            .then(response => {
                console.log('Message sent:', response);
                return res.status(200).json({ message: 'Transaction Completed & Receipt Sent' });
            })
            .catch(err => {
                console.error('Error when sending message:', err);
                return res.status(400).json({ message: 'Error while sending message' });
            });
       


    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Error During payment' })


    }
}