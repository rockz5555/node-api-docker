import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import os from 'os';
import { createClient } from 'redis';

import {
    APP_PORT,
    MONGO_IP,
    MONGO_PASSWORD,
    MONGO_PORT,
    MONGO_USERNAME,
    REDIS_PORT,
    REDIS_URL,
    SESSION_SECRET,
} from './configs/config.js';
import { protectRoutes } from './middlewares/protectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const port = APP_PORT;
const environment = process.env.NODE_ENV || 'Undefined';
const RedisStore = connectRedis(session);
const redisClient = createClient({
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT,
    },
    legacyMode: true,
});

mongoose
    .connect(
        `mongodb://${ MONGO_USERNAME }:${ MONGO_PASSWORD }@${ MONGO_IP }:${ MONGO_PORT }/?authSource=admin`
    )
    .then(() => console.log('MongoDB connected successfully'))
    .catch((e) => console.log('MongoDB connect error:', e));

redisClient
    .connect()
    .then(() => console.log('Redis connected successfully'))
    .catch(console.log);

app.enable('trust proxy');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 3,
            sameSite: 'lax',
        },
    })
);
app.get('/', (_req, res) =>
    res.send({
        message: `Hi, from ${ os.hostname } (${ os.platform }) 🔥`,
        version: '1.0.0',
        environment: `${ environment }`,
        data: [
            {
                name: 'Nijoo',
                message: 'Howdy!!',
            },
        ],
    })
);
app.use('/api/v1/auth', authRoutes);
app.all('/*', protectRoutes);
app.use('/api/v1/post', postRoutes);

app.listen(port, () =>
    console.log(`App listening on port: ${ port }\nEnvironment: ${ environment }`)
);
