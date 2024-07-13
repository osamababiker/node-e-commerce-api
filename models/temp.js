import { MongoClient, ObjectId } from 'mongodb';
import assert from 'assert';

const agg = [
  {
    $match: {
      product: new ObjectId('615c873ad584c748cc86e5bb'),
    },
  },
  {
    $group: { 
      _id: null,
      averageRating: {
        $avg: '$rating',
      },
      numberOfReviews: {
        $sum: 1,
      },
    },
  },
];

const url = process.env.MONGO_URL; // Your MongoDB connection string
const dbName = ''; // Your database name
const collectionName = ''; // Your collection name

(async () => {
  let client;

  try {
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.aggregate(agg).toArray();
    console.log('Aggregation result:', result);
  } catch (err) {
    console.error(err.stack);
  } finally {
    if (client) {
      await client.close();
    }
  }
})();
