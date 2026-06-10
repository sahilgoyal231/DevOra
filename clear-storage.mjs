import { Client, Storage } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_HOST_URL;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const storage = new Storage(client);
const bucketId = "question-attachment";

async function main() {
    console.log(`Clearing storage bucket: ${bucketId}...`);
    try {
        let hasMore = true;
        while (hasMore) {
            const response = await storage.listFiles(bucketId);
            if (response.files.length === 0) {
                hasMore = false;
                break;
            }
            for (const file of response.files) {
                await storage.deleteFile(bucketId, file.$id);
            }
            console.log(`Deleted ${response.files.length} files from ${bucketId}`);
        }
        console.log("Storage cleared successfully!");
    } catch (e) {
        console.error("Error clearing storage:", e.message);
    }
}

main();
