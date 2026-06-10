const { Client, Storage } = require("appwrite");
const storage = new Storage(new Client());
const res1 = storage.getFilePreview('b', 'f');
const res2 = storage.getFilePreview({ bucketId: 'b', fileId: 'f' });
console.log("res1:", typeof res1, res1.constructor && res1.constructor.name);
console.log("res2:", typeof res2, res2.constructor && res2.constructor.name);
