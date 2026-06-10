import { Permission } from "node-appwrite"

import {db, questionCollection} from "../name"
import {databases} from "./config"


export default async function createQuestionCollection(){
  // create collection
  await databases.createTable({
    databaseId: db,
    tableId: questionCollection,
    name: questionCollection,
    permissions: [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]
  })
  console.log("Question collection is created")

  //creating attributes and Indexes

  await Promise.all([
    databases.createVarcharColumn({ databaseId: db, tableId: questionCollection, key: "title", size: 100, required: true }),
    databases.createVarcharColumn({ databaseId: db, tableId: questionCollection, key: "content", size: 10000, required: true }),
    databases.createVarcharColumn({ databaseId: db, tableId: questionCollection, key: "authorId", size: 50, required: true }),
    databases.createVarcharColumn({ databaseId: db, tableId: questionCollection, key: "tags", size: 50, required: true, array: true }),
    databases.createVarcharColumn({ databaseId: db, tableId: questionCollection, key: "attachmentId", size: 50, required: false }),
  ]);
  console.log("Question Attributes created")

  // create Indexes

  /*
  await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      "title",
      IndexType.Fulltext,
      ["title"],
      ['asc']
    ),
    databases.createIndex(
      db,
      questionCollection,
      "content",
      IndexType.Fulltext,
      ["content"],
      ['asc']
    )
  ])
    */
}