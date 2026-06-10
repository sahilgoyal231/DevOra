import { Client, Databases, Users } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_HOST_URL;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
    console.error("Missing Appwrite environment variables");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);
const users = new Users(client);

const db = "main-stackflow";
const collections = ["questions", "answers", "comments", "votes"];

async function clearCollection(collectionId) {
    console.log(`Clearing collection: ${collectionId}...`);
    try {
        let hasMore = true;
        while (hasMore) {
            const response = await databases.listDocuments(db, collectionId);
            if (response.documents.length === 0) {
                hasMore = false;
                break;
            }
            for (const doc of response.documents) {
                await databases.deleteDocument(db, collectionId, doc.$id);
            }
            console.log(`Deleted ${response.documents.length} documents from ${collectionId}`);
        }
        console.log(`Collection ${collectionId} is empty.`);
    } catch (e) {
        console.error(`Error clearing ${collectionId}:`, e.message);
    }
}

async function resetUsers() {
    console.log("Resetting user reputations...");
    try {
        const response = await users.list();
        for (const user of response.users) {
            await users.updatePrefs(user.$id, { reputation: 0 });
        }
        console.log(`Reset reputation for ${response.users.length} users.`);
    } catch (e) {
        console.error("Error resetting users:", e.message);
    }
}

async function main() {
    for (const collection of collections) {
        await clearCollection(collection);
    }
    await resetUsers();
    console.log("Database cleared successfully!");
}

main();
