import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { quesId: string; quesName: string } }) => {
    let question;
    try {
        question = await databases.getRow({ databaseId: db, tableId: questionCollection, rowId: params.quesId });
    } catch (error: any) {
        return notFound();
    }

    return <EditQues question={JSON.parse(JSON.stringify(question))} />;
};

export default Page;
