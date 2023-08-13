require('dotenv').config(); // enable using variables located in .env file

// import external packages
require('express-async-errors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express');
const multer = require('multer');
const app = express();

app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser())

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tempUploades'); // This set to the destination folder for storing the uploaded image temporarily
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for the uploaded image
        const uniqueFilename = Date.now() + '-' + file.originalname;
        cb(null, uniqueFilename);
    },
});
// File filter function to accept only image files
const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        // Accept image files
        cb(null, true);
    } else {
        // Reject non-image files
        cb(new Error('Only image files are allowed!'), false);
    }
  };
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5 MB
    },
});
app.use(upload.array('images', 4))



// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// auth middleware
const authenticateUser = require('./middleware/authentication')

// database connection file
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const blogsRouter = require('./routes/blogs')
const productsRouter = require('./routes/products')
const productCartRouter = require('./routes/productCart')
const companiesRouter = require('./routes/companies')
const commentsRouter = require('./routes/comments')
const eventsRouter = require('./routes/events')
const messagesRouter = require('./routes/messages')
const sponsoresRouter = require('./routes/sponsores')
const statisticsRouter = require('./routes/statistics')
const wishlistRouter = require('./routes/wishlist')


// error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// invoke security packages
app.set('trust proxy', 1) // if the app is behind a reverse proxy like heroku
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'too many requests, wait 15 minutes and try again'
}))
app.use(helmet())
app.use(cors())
app.use(xss())



// routes
app.use('/api/v1/auth', authRouter)  // includes 'login', 'logout' and 'register' in the router
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/blogs', blogsRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/companies', companiesRouter)
app.use('/api/v1/comments', commentsRouter)
app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/messages', messagesRouter)
app.use('/api/v1/sponsors', sponsoresRouter)
app.use('/api/v1/statistics', statisticsRouter)
app.use('/api/v1/cart', productCartRouter)
app.use('/api/v1/wishlist', wishlistRouter)



// use basic middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// spin up the server
const port = process.env.PORT || 3000;
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
}

start();