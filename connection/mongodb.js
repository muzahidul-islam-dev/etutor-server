import {MongoClient, ServerApiVersion} from 'mongodb'
import { config } from '../config/config.js';
const uri = config.DB_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const db = client.db('etutor')

export default db;