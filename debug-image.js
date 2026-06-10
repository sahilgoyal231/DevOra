require("dotenv").config({ path: ".env.local" });
const { Client, Databases, Storage } = require("node-appwrite");

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const storage = new Storage(client);

async function run() {
    try {
        const questions = await db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_QUESTION_COLLECTION_ID,
            []
        );
        const q = questions.documents[0]; // Get the latest
        console.log("Q Title:", q.title);
        console.log("Q AttachmentId:", q.attachmentId);
        
        if (q.attachmentId) {
            const bucketId = process.env.NEXT_PUBLIC_APPWRITE_QUESTION_ATTACHMENT_BUCKET_ID;
            
            // Try object syntax
            try {
                const urlObj = storage.getFilePreview({ bucketId, fileId: q.attachmentId });
                console.log("Object Syntax URL:", urlObj.toString());
            } catch (e) {
                console.log("Object Syntax Failed", e.message);
            }
            
            // Try positional syntax
            try {
                const urlPos = storage.getFilePreview(bucketId, q.attachmentId);
                console.log("Positional Syntax URL:", urlPos.toString());
            } catch (e) {
                console.log("Positional Syntax Failed", e.message);
            }
        }
    } catch (e) {
        console.error(e);
    }
}
run();
