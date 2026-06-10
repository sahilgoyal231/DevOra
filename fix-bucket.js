const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

const { Client, Storage, Permission } = require("node-appwrite");

const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_HOST_URL)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

const storage = new Storage(client);

async function run() {
    try {
        const bucketId = "question-attachment"; // questionAttachmentBucket
        
        const bucket = await storage.getBucket(bucketId);
        console.log("Current Permissions:", bucket.$permissions);
        
        await storage.updateBucket(
            bucketId,
            bucket.name,
            [
                Permission.create("users"),
                Permission.read("any"),
                Permission.read("users"),
                Permission.update("users"),
                Permission.delete("users"),
            ],
            false, // fileSecurity
            bucket.enabled,
            bucket.maximumFileSize,
            bucket.allowedFileExtensions,
            bucket.compression,
            bucket.encryption,
            bucket.antivirus
        );
        console.log("Bucket permissions updated successfully to include read('any')!");
    } catch (e) {
        console.error("Failed to update bucket:", e);
    }
}
run();
