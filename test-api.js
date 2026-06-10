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
        
        console.log("Using user:", user.$id);
        
        // 1. Check Initial Reputation
        let prefs = await users.getPrefs(user.$id);
        console.log("Initial Reputation:", prefs.reputation || 0);
        
        // 2. Create Question
        const qDoc = await databases.createDocument("main-DevOra", "questions", "unique()", {
            title: "Automated API Test Question",
            content: "This is automated.",
            authorId: user.$id,
            tags: ["test"]
        });
        console.log("Created Question:", qDoc.$id);
        
        // 3. Upvote
        console.log("\n--- Upvoting ---");
        let response = await fetch("http://localhost:3000/api/vote", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votedById: user.$id, voteStatus: "upvoted", type: "question", typeId: qDoc.$id })
        });
        let resJson = await response.json();
        console.log("Status:", response.status);
        console.log("Global Score returned by API:", resJson.data.voteResult);
        prefs = await users.getPrefs(user.$id);
        console.log("Author Reputation:", prefs.reputation);
        
        // 4. Revoke Upvote
        console.log("\n--- Revoking Upvote ---");
        response = await fetch("http://localhost:3000/api/vote", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votedById: user.$id, voteStatus: "upvoted", type: "question", typeId: qDoc.$id })
        });
        resJson = await response.json();
        console.log("Status:", response.status);
        console.log("Global Score returned by API:", resJson.data.voteResult);
        prefs = await users.getPrefs(user.$id);
        console.log("Author Reputation:", prefs.reputation);
        
        // 5. Downvote
        console.log("\n--- Downvoting ---");
        response = await fetch("http://localhost:3000/api/vote", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votedById: user.$id, voteStatus: "downvoted", type: "question", typeId: qDoc.$id })
        });
        resJson = await response.json();
        console.log("Status:", response.status);
        console.log("Global Score returned by API:", resJson.data.voteResult);
        prefs = await users.getPrefs(user.$id);
        console.log("Author Reputation:", prefs.reputation);
        
        // 6. Switch to Upvote
        console.log("\n--- Switching Downvote to Upvote ---");
        response = await fetch("http://localhost:3000/api/vote", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votedById: user.$id, voteStatus: "upvoted", type: "question", typeId: qDoc.$id })
        });
        resJson = await response.json();
        console.log("Status:", response.status);
        console.log("Global Score returned by API:", resJson.data.voteResult);
        prefs = await users.getPrefs(user.$id);
        console.log("Author Reputation:", prefs.reputation);

    } catch(e) {
        console.log("TEST FAILED:", e);
    }
}

test();
