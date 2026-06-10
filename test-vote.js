const { Client, Users, Databases } = require("node-appwrite");

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69f423940015d35d07aa")
    .setKey("standard_180f9b897c88c981401f7bd282bcc8757f75817a89fb6dbd32d3703938c83594ba2913f0acc56b6e851f3901d34b81f536455623c5b41b4ac17c355950ee9a5bd73d86e7b648730486b06f4775dfc8966999582e5eb7ee12fcd69550ebe9e12417f5cf9dce5649ae54b376673b65c94eb01733d491bd1fea56389c8c7f71db7d");

const users = new Users(client);
const databases = new Databases(client);

async function test() {
    try {
        const usersList = await users.list();
        const user = usersList.users[0];
        console.log("User:", user.$id);
        
        const db = "main-stackflow";
        const votes = await databases.listDocuments(db, "votes");
        console.log("Votes:", votes.documents);
        
        const questions = await databases.listDocuments(db, "questions");
        const question = questions.documents[0];
        console.log("Question:", question.$id);

        const res = await fetch("http://localhost:3000/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votedById: user.$id,
                voteStatus: "upvoted",
                type: "question",
                typeId: question.$id
            })
        });
        const data = await res.json();
        console.log("API Result:", res.status, data);

        // Click again to trigger delete
        const res2 = await fetch("http://localhost:3000/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votedById: user.$id,
                voteStatus: "upvoted",
                type: "question",
                typeId: question.$id
            })
        });
        const data2 = await res2.json();
        console.log("API Result 2:", res2.status, data2);

    } catch(e) {
        console.error(e);
    }
}
test();
