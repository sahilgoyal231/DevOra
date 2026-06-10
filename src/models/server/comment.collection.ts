import { Permission } from "node-appwrite";
import { commentCollection, db } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
    // Creating Collection
    await databases.createTable({
        databaseId: db,
        tableId: commentCollection,
        name: commentCollection,
        permissions: [
            Permission.create("users"),
            Permission.read("any"),
            Permission.read("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]
    });
    console.log("Comment Collection Created");

    // Creating Attributes
    await Promise.all([
        databases.createVarcharColumn({ databaseId: db, tableId: commentCollection, key: "content", size: 10000, required: true }),
        databases.createEnumColumn({ databaseId: db, tableId: commentCollection, key: "type", elements: ["answer", "question"], required: true }),
        databases.createVarcharColumn({ databaseId: db, tableId: commentCollection, key: "typeId", size: 50, required: true }),
        databases.createVarcharColumn({ databaseId: db, tableId: commentCollection, key: "authorId", size: 50, required: true }),
    ]);
    console.log("Comment Attributes Created");
}
