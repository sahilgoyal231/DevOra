import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import UserStats from "./UserStats";

const Page = async ({ params }: { params: { userId: string; userSlug: string } }) => {
    const [user, questions, answers] = await Promise.all([
        users.get<UserPrefs>(params.userId),
        databases.listRows({
            databaseId: db,
            tableId: questionCollection,
            queries: [
                Query.equal("authorId", params.userId),
                Query.limit(1), // for optimization
            ]
        }),
        databases.listRows({
            databaseId: db,
            tableId: answerCollection,
            queries: [
                Query.equal("authorId", params.userId),
                Query.limit(1), // for optimization
            ]
        }),
    ]);

    return (
        <UserStats 
            userId={params.userId}
            initialReputation={user.prefs.reputation || 0}
            initialQuestions={questions.total || 0}
            initialAnswers={answers.total || 0}
        />
    );
};

export default Page;
