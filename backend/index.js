require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const compression = require('compression');
const { server, app } = require('./socket/index');

const apiRouter = require('./routes');

const PORT = process.env.PORT || 9000;

if (process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(cors());
app.set('trust proxy', 1);
app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(compression());
}

(async function () {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        console.log('Connected to database');
    } catch (err) {
        throw new Error(err);
    }
})();

app.use((err, req, res, next) => {
    console.log(err.message);
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    if (err.name === 'MulterError') {
        if (err.message === 'File too large') {
            return res
                .status(400)
                .send({ error: 'Your file exceeds the limit of 10MB.' });
        }
    }
    res.status(err.statusCode || 500).send({
        error:
            err.statusCode >= 500 && !err.message
                ? 'An unexpected error ocurred, please try again later.'
                : err.message,
    });
});

server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
})

// const expressServer = app.listen(PORT, () => {
//     console.log(`Backend listening on port ${PORT}`);
// });

// const io = socketio(expressServer);
// app.set('socketio', io);
// console.log('Socket.io listening for connections');

// // Authenticate before establishing a socket connection
// io.use((socket, next) => {
//     const token = socket.handshake.query.token;
//     if (token) {
//         try {
//             const user = jwt.decode(token, process.env.JWT_SECRET);
//             if (!user) {
//                 return next(new Error('Not authorized.'));
//             }
//             socket.user = user;
//             return next();
//         } catch (err) {
//             next(err);
//         }
//     } else {
//         return next(new Error('Not authorized.'));
//     }
// }).on('connection', (socket) => {
//     socket.join(socket.user.id);
//     console.log('socket connected:', socket.id);
// });