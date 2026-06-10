import { databases } from "./src/models/server/config";
import { db, questionCollection, questionAttachmentBucket } from "./src/models/name";
import { storage } from "./src/models/client/config";
import { Query } from "node-appwrite";

async function main() {
    try {
        const questions = await databases.listRows({
            databaseId: db,
            tableId: questionCollection,
            queries: [Query.orderDesc("$createdAt"), Query.limit(1)]
        });
        const q = questions.rows[0];
        console.log("Latest question ID:", q.$id);
        console.log("Attachment ID:", q.attachmentId);
        
        if (q.attachmentId) {
            const previewUrl = storage.getFilePreview(questionAttachmentBucket, q.attachmentId).toString();
            console.log("Preview URL:", previewUrl);
        } else {
            console.log("No attachment found for the latest question.");
        }
    } catch (err) {
        console.error(err);
    }
}
main();
