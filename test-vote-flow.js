const { Client, Databases, Users } = require("node-appwrite");
const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69f423940015d35d07aa")
    .setKey("standard_180f9b897c88c981401f7bd282bcc8757f75817a89fb6dbd32d3703938c83594ba2913f0acc56b6e851f3901d34b81f536455623c5b41b4ac17c355950ee9a5bd73d86e7b648730486b06f4775dfc8966999582e5eb7ee12fcd69550ebe9e12417f5cf9dce5649ae54b376673b65c94eb01733d491bd1fea56389c8c7f71db7d");

const databases = new Databases(client);
const users = new Users(client);

async function test() {
    try {
        const ulist = await users.list();
        const user = ulist.users[0];
        if (!user) return console.log("No users");
        
        // Find a question by querying tablesDB
        // Actually, just create one!
        const qDoc = await databases.createDocument("main-DevOra", "questions", "unique()", {
            title: "Test Question",
            content: "Test Content",
            authorId: user.$id,
            tags: ["test"]
        });
        
        console.log("Created question:", qDoc.$id);
        
        const response = await fetch("http://localhost:3000/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votedById: user.$id,
                voteStatus: "upvoted",
                type: "question",
                typeId: qDoc.$id
            })
        });
        console.log("Upvote Response:", response.status, await response.json());
        
        const response2 = await fetch("http://localhost:3000/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votedById: user.$id,
                voteStatus: "upvoted",
                type: "question",
                typeId: qDoc.$id
            })
        });
        console.log("Revoke Response:", response2.status, await response2.json());
        
        // Clean up
        await databases.deleteDocument("main-DevOra", "questions", qDoc.$id);
    } catch(e) {
        console.log("ERROR CODE:", e.code, "MESSAGE:", e.message);
    }
}
test();
