const { Client, Storage } = require("appwrite");
const storage = new Storage(new Client());
console.log("Positional:", storage.getFilePreview('bucketId', 'fileId'));
console.log("Object:", storage.getFilePreview({ bucketId: 'bucketId', fileId: 'fileId' }));
