const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup')

const userCollection = db.collection('users');
const sessionCollection = db.collection('sessions');
const goalCollection = db.collection('goals');
const scheduleCollection = db.collection('schedule');


//test connection
(async function testConnection() {
    try {
        await db.command({ ping: 1});
        console.log('Connected to MongoDB succesully');
    }
    catch (ex) {
        console.log(`Failed to connect to MongoDB: ${ex.message}`);
        process.exit(1);
    }
})();


//user functions
async function getUser(username) {
    return userCollection.findOne({ username });
}

async function createUser(username, passwordHash) {
    const user = { username, passwordHash };
    await userCollection.insertOne(user);
    return user;
}



//session functions
