import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'

import { AddSenderAdmin, AddSenderAPI, GetSendersAPI} from '../controllers/sendercontroller.js';
import { AddReceiverAdmin, AddReceiverAPI, GetReceiversAPI} from '../controllers/receivercontroller.js'
import {MakePaymentAdmin, MakePaymentAPI } from '../controllers/paymentcontroller.js'
import {prabhureceipt } from '../controllers/receiptcontroller.js'



const router = express.Router();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const imagePath = path.join(__dirname,'../public/images');
        return cb(null,imagePath)
    },
    filename: function(req,file,cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    },  
});

const upload = multer({ storage });

 //admin authe
 export const isAuthenticated = (req, res, next) => {
  
    if (req.session.user) { 
        return next(); 
    }
    // If not authenticated, redirect to login page
    return res.redirect('/admin/login');
};



//admin pages
router.get('/admin/addsender',AddSenderAdmin)
router.get('/admin/addreceiver',AddReceiverAdmin)
router.get('/admin/makepayment',MakePaymentAdmin)
// router.get('/prabhureceipttemp',prabhureceipt)

//APIs
router.post('/addsenderapi',AddSenderAPI)
router.get('/getsenders',GetSendersAPI)

router.post('/addreceiverapi',AddReceiverAPI)
router.get('/getreceivers',GetReceiversAPI)

router.post('/makepaymentapi',MakePaymentAPI)


export default router;