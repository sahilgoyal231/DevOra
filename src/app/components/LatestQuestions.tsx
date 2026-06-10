import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async () => {
    const questions = await databases.listRows({
        databaseId: db,
        tableId: questionCollection,
        queries: [
            Query.limit(5),
            Query.orderDesc("$createdAt"),
        ]
    });
    console.log("Fetched Questions:", questions);

    questions.rows = await Promise.all(
        questions.rows.map(async ques => {
            const [author, answers, upvotes, downvotes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listRows({
                    databaseId: db,
                    tableId: answerCollection,
                    queries: [
                        Query.equal("questionId", ques.$id),
                        Query.limit(1), // for optimization
                    ]
                }),
                databases.listRows({
                    databaseId: db,
                    tableId: voteCollection,
                    queries: [
                        Query.equal("type", "question"),
                        Query.equal("typeId", ques.$id),
                        Query.equal("voteStatus", "upvoted"),
                        Query.limit(1), // for optimization
                    ]
                }),
                databases.listRows({
                    databaseId: db,
                    tableId: voteCollection,
                    queries: [
                        Query.equal("type", "question"),
                        Query.equal("typeId", ques.$id),
                        Query.equal("voteStatus", "downvoted"),
                        Query.limit(1), // for optimization
                    ]
                }),
            ]);

            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: upvotes.total - downvotes.total,
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                },
            };
        })
    );

    console.log("Latest question")
    console.log(questions)
    return (
        <div className="space-y-6">
            {questions.rows.map(question => (
                <QuestionCard key={question.$id} ques={JSON.parse(JSON.stringify(question))} />
            ))}
        </div>
    );
};

export default LatestQuestions;
