"use client";

import { client, databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

interface VoteRow extends Models.Document {
    type: "question" | "answer";
    typeId: string;
    votedById: string;
    voteStatus: "upvoted" | "downvoted";
}

const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: Models.RowList<any>;
    downvotes: Models.RowList<any>;
    className?: string;
}) => {
    const { user } = useAuthStore();
    const router = useRouter();

    const [voteState, setVoteState] = React.useState<{
        document: VoteRow | null | undefined;
        result: number;
    }>({
        document: undefined, // undefined means not fetched yet
        result: upvotes.total - downvotes.total,
    });

    React.useEffect(() => {
        (async () => {
            if (user) {
                try {
                    const response = await databases.listRows({
                        databaseId: db,
                        tableId: voteCollection,
                        queries: [
                            Query.equal("type", type),
                            Query.equal("typeId", id),
                            Query.equal("votedById", user.$id),
                        ]
                    });
                    setVoteState(prev => ({
                        ...prev,
                        document: (response.rows[0] as unknown as VoteRow) || null
                    }));
                } catch (e) {
                    setVoteState(prev => ({ ...prev, document: null }));
                }
            }
        })();
    }, [user, id, type]);

    React.useEffect(() => {
        setVoteState(prev => ({
            ...prev,
            result: upvotes.total - downvotes.total,
        }));
    }, [upvotes.total, downvotes.total]);

    React.useEffect(() => {
        const unsubscribe = client.subscribe(
            `databases.${db}.collections.${voteCollection}.documents`,
            (response) => {
                const payload = response.payload as VoteRow;

                if (payload.type === type && payload.typeId === id) {
                    router.refresh();
                }
            }
        );

        return () => unsubscribe();
    }, [router, id, type]);

    const toggleUpvote = async () => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) return router.push("/login");
        if (voteState.document === undefined) return;

        // Save original state for revert
        const originalState = voteState;

        // Optimistic update
        setVoteState((prev) => ({
            document: prev.document?.voteStatus === "upvoted" ? null : { ...prev.document, voteStatus: "upvoted" } as VoteRow,
            result: prev.result + (prev.document?.voteStatus === "upvoted" ? -1 : prev.document?.voteStatus === "downvoted" ? 2 : 1)
        }));

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: currentUser.$id,
                    voteStatus: "upvoted",
                    type,
                    typeId: id,
                }),
            });

            if (!response.ok) throw await response.json();
            
            // Trigger server components to re-fetch data so global counts update
            router.refresh();
        } catch (error: any) {
            setVoteState(originalState);
        }
    };

    const toggleDownvote = async () => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) return router.push("/login");
        if (voteState.document === undefined) return;

        // Save original state for revert
        const originalState = voteState;

        // Optimistic update
        setVoteState((prev) => ({
            document: prev.document?.voteStatus === "downvoted" ? null : { ...prev.document, voteStatus: "downvoted" } as VoteRow,
            result: prev.result + (prev.document?.voteStatus === "downvoted" ? 1 : prev.document?.voteStatus === "upvoted" ? -2 : -1)
        }));

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: currentUser.$id,
                    voteStatus: "downvoted",
                    type,
                    typeId: id,
                }),
            });

            if (!response.ok) throw await response.json();

            // Trigger server components to re-fetch data so global counts update
            router.refresh();
        } catch (error: any) {
            setVoteState(originalState);
        }
    };

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    voteState.document?.voteStatus === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleUpvote}
            >
                <IconCaretUpFilled />
            </button>
            <span>{voteState.result}</span>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    voteState.document?.voteStatus === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleDownvote}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;
