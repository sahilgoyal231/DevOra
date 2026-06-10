const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
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

async function run() {
    try {
        const questions = await db.listDocuments(
            env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            env.NEXT_PUBLIC_APPWRITE_QUESTION_COLLECTION_ID
        );
        const q = questions.documents[0];
        console.log("Q Title:", q.title);
        console.log("Q AttachmentId:", q.attachmentId);
    } catch (e) {
        console.error(e);
    }
}
run();
