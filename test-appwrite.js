const { Client, Storage } = require("appwrite");
const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('YOUR_PROJECT_ID');
const storage = new Storage(client);
console.log("Positional:", storage.getFilePreview('bucketId', 'fileId'));
console.log("Object:", storage.getFilePreview({ bucketId: 'bucketId', fileId: 'fileId' }));
