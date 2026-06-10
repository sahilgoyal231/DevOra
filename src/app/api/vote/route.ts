import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query, Permission, Role } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const { votedById, voteStatus, type, typeId } = await request.json();

        const response = await databases.listRows({
            databaseId: db,
            tableId: voteCollection,
            queries: [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById),
            ]
        });

        let reputationChange = 0;

        if (response.rows.length > 0) {
            await Promise.all(
                response.rows.map(async (row) => {
                    try {
                        await databases.deleteRow({ databaseId: db, tableId: voteCollection, rowId: row.$id });
                        reputationChange += row.voteStatus === "upvoted" ? -1 : 1;
                    } catch (error: any) {
                        console.error("DELETE ROW ERROR:", error, "Code:", error?.code, "Status:", error?.status);
                        if (error?.code !== 404 && error?.status !== 404) throw error;
                    }
                })
            );
        }

        // that means prev vote does not exists or voteStatus changed
        let doc = null;
        if (response.rows[0]?.voteStatus !== voteStatus) {
            doc = await databases.createRow({
                databaseId: db,
                tableId: voteCollection,
                rowId: ID.unique(),
                data: {
                    type,
                    typeId,
                    voteStatus,
                    votedById,
                },
                permissions: [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(votedById)),
                    Permission.delete(Role.user(votedById)),
                ]
            });

            reputationChange += voteStatus === "upvoted" ? 1 : -1;
        }

        // Increase/Decrease the reputation of the question/answer author accordingly
        if (reputationChange !== 0) {
            const questionOrAnswer = await databases.getRow({
                databaseId: db,
                tableId: type === "question" ? questionCollection : answerCollection,
                rowId: typeId
            });

            const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorId);

            await users.updatePrefs({
                userId: questionOrAnswer.authorId,
                prefs: {
                    reputation: Number(authorPrefs.reputation) + reputationChange,
                }
            });
        }

        const [upvotes, downvotes] = await Promise.all([
            databases.listRows({
                databaseId: db,
                tableId: voteCollection,
                queries: [
                    Query.equal("type", type),
                    Query.equal("typeId", typeId),
                    Query.equal("voteStatus", "upvoted"),
                    Query.limit(1), // for optimization as we only need total
                ]
            }),
            databases.listRows({
                databaseId: db,
                tableId: voteCollection,
                queries: [
                    Query.equal("type", type),
                    Query.equal("typeId", typeId),
                    Query.equal("voteStatus", "downvoted"),
                    Query.limit(1), // for optimization as we only need total
                ]
            }),
        ]);

        return NextResponse.json(
            {
                data: {
                    document: doc,
                    voteResult: upvotes.total - downvotes.total 
                },
                message: doc ? "Vote Status Updated" : "Vote Withdrawn",
            },
            {
                status: doc ? 201 : 200,
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Error voting" },
            { status: error?.status || error?.code || 500 }
        );
    }
}
