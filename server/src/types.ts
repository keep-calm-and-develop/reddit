import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from 'express';
import { Redis } from "ioredis";

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    // @ts-ignore
    req: Request & {session: Express.Session }; 
    res: Response;
    redis: Redis;
}