import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || '';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri || uri.startsWith('postgresql://')) {
  console.warn(
    '[MongoDB Atlas] Notice: MONGODB_URI is not set or still pointing to PostgreSQL. Please set your MongoDB Atlas connection string in .env'
  );
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(dbName: string = 'daymes_db'): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export default clientPromise;
