const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const { Client, Databases, Storage } = require("node-appwrite");

const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_HOST_URL)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

const db = new Databases(client);
const storage = new Storage(client);

async function run() {
    try {
        const questions = await db.listDocuments(
            env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            env.NEXT_PUBLIC_APPWRITE_QUESTION_COLLECTION_ID
        );
        const q = questions.documents[0]; // Get the latest
        console.log("Q Title:", q.title);
        console.log("Q AttachmentId:", q.attachmentId);
        
        if (q.attachmentId) {
            const bucketId = env.NEXT_PUBLIC_APPWRITE_QUESTION_ATTACHMENT_BUCKET_ID;
            console.log("Bucket:", bucketId);
            
            try {
                const urlObj = storage.getFilePreview({ bucketId, fileId: q.attachmentId });
                console.log("Object Syntax URL:", urlObj.toString());
            } catch (e) {
                console.log("Object Syntax Failed:", e.message);
            }
        }
    } catch (e) {
        console.error(e);
    }
}
run();
