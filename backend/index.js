require("dotenv").config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const socketio = require('socket.io');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(helmet());
app.use(cors());
app.use(express.json());


(async function () {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        console.log("Connected to DataBase");
    }
    catch (err) {
        throw new Error(err);
    }
})();