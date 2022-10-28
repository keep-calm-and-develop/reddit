import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from 'cors';

import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    let RedisStore = connectRedis(session);
    let redis = new Redis();
    
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ client: redis, disableTouch: true }),
            secret: 'jguwosoafsafkasfkqweqw',
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 yrs,
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__, // cookie works only in https
            },
            saveUninitialized: false,
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }), 
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(4000, () => {
        console.log('Server started on localhost:4000');
    });
};

 main().catch(console.error);