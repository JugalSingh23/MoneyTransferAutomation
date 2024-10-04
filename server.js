import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import urls from './routes/urls.js'; //route import
import session from 'express-session';

const app = express();

app.use(session ({
    secret :"jugal",
    saveUninitialized:true,
    resave : true,
    cookie: { secure: false }
    
}))


const port = process.env.PORT || 8000

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

//body parser middleware (we need this to make a post request supposedely)
app.use(express.json())
app.use(express.urlencoded({ extended : false }))

// setting up "Public" as static folder
app.use('/static', express.static(path.join(__dirname, 'public')))




//use /images in the url to acess images
app.use('/images', express.static(path.join(__dirname, 'public/images')));



//To let node know, all views are in views folder
app.set('views', __dirname + '/views');

//settings view engine
app.set('view engine', 'ejs');

// routes
app.use('/',urls)

app.listen(port, () => console.log(`Server is Running on port ${port}`));