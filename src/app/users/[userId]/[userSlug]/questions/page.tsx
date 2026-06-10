import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: { userId: string; userSlug: string };
    searchParams: { page?: string };
}) => {
    searchParams.page ||= "1";

    const queries = [
        Query.equal("authorId", params.userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+searchParams.page - 1) * 25),
        Query.limit(25),
    ];

    const questions = await databases.listRows({ databaseId: db, tableId: questionCollection, queries });

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

    return (
        <div className="px-4">
            <div className="mb-4">
                <p>{questions.total} questions</p>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {questions.rows.map(ques => (
                    <QuestionCard key={ques.$id} ques={JSON.parse(JSON.stringify(ques))} />
                ))}
            </div>
            <Pagination total={questions.total} limit={25} />
        </div>
    );
};

export default Page;
