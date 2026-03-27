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

async function createSession(token, username) {
    await sessionCollection.insertOne({ token, username });
}

async function getSession(token) {
    const session = await sessionCollection.findOne({ token });
    return session ? session.username : null;
}

async function deleteSession(token) {
    await sessionCollection.deleteOne({ token });
}


//Goal Functions

async function getGoals() {
    return goalCollection.find().sort({ _id: -1 }).toArray();
}

async function addGoal(goal) {
    await goalCollection.insertOne(goal);
}

async function deleteGoal(id) {
    const { ObjectId } = require('mongodb');
    await goalCollection.deleteOne({ id: id });
}

async function getGoalById(id) {
    return goalCollection.findOne({ id });
}


//Schedule functions

