const { Client, Databases, Users } = require("node-appwrite");
const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69f423940015d35d07aa")
    .setKey("standard_180f9b897c88c981401f7bd282bcc8757f75817a89fb6dbd32d3703938c83594ba2913f0acc56b6e851f3901d34b81f536455623c5b41b4ac17c355950ee9a5bd73d86e7b648730486b06f4775dfc8966999582e5eb7ee12fcd69550ebe9e12417f5cf9dce5649ae54b376673b65c94eb01733d491bd1fea56389c8c7f71db7d");

const databases = new Databases(client);
const users = new Users(client);

async function clearCollection(collectionId) {
    let hasMore = true;
    let totalDeleted = 0;
    while(hasMore) {
        const result = await databases.listDocuments("main-stackflow", collectionId);
        if(result.documents.length === 0) {
            hasMore = false;
            break;
        }
        for(const doc of result.documents) {
            await databases.deleteDocument("main-stackflow", collectionId, doc.$id);
            totalDeleted++;
        }
    }
    console.log(`Deleted ${totalDeleted} documents from ${collectionId}`);
}

async function resetReputation() {
    const ulist = await users.list();
    for (const u of ulist.users) {
        await users.updatePrefs(u.$id, { reputation: 0 });
    }
    console.log(`Reset reputation for ${ulist.users.length} users`);
}

async function run() {
    try {
        await clearCollection("questions");
        await clearCollection("answers");
        await clearCollection("comments");
        await clearCollection("votes");
        await resetReputation();
        console.log("Database cleared successfully!");
    } catch(e) {
        console.log("Error:", e);
    }
}

run();
