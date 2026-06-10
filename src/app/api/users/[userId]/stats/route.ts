import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        const [user, questions, answers] = await Promise.all([
            users.get<UserPrefs>(params.userId),
            databases.listRows({
                databaseId: db,
                tableId: questionCollection,
                queries: [Query.equal("authorId", params.userId), Query.limit(1)]
            }),
            databases.listRows({
                databaseId: db,
                tableId: answerCollection,
                queries: [Query.equal("authorId", params.userId), Query.limit(1)]
            }),
        ]);

        return NextResponse.json({
            reputation: user.prefs.reputation || 0,
            questions: questions.total || 0,
            answers: answers.total || 0,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
