"use client";

import React, { useEffect, useState } from "react";
import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import NumberTicker from "@/components/magicui/number-ticker";
import { client } from "@/models/client/config";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";

interface UserStatsProps {
    userId: string;
    initialReputation: number;
    initialQuestions: number;
    initialAnswers: number;
}

export default function UserStats({
    userId,
    initialReputation,
    initialQuestions,
    initialAnswers,
}: UserStatsProps) {
    const [stats, setStats] = useState({
        reputation: initialReputation,
        questions: initialQuestions,
        answers: initialAnswers,
    });

    useEffect(() => {
        // Function to fetch the latest stats from our API route
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/users/${userId}/stats`);
                if (!res.ok) return;
                const data = await res.json();
                setStats({
                    reputation: data.reputation,
                    questions: data.questions,
                    answers: data.answers,
                });
            } catch (error) {
                console.error("Failed to update stats", error);
            }
        };

        // Subscribe to Appwrite Realtime for changes that affect the user's stats
        const unsubscribe = client.subscribe(
            [
                `databases.${db}.collections.${questionCollection}.documents`,
                `databases.${db}.collections.${answerCollection}.documents`,
                `databases.${db}.collections.${voteCollection}.documents`,
            ],
            (response) => {
                // If any document is created, updated, or deleted in these collections, 
                // there's a chance this user's stats changed. Refetch to be safe.
                fetchStats();
            }
        );

        return () => {
            unsubscribe();
        };
    }, [userId]);

    return (
        <MagicContainer className={"flex h-auto w-full flex-col gap-4 lg:flex-row"}>
            <MagicCard className="flex w-full cursor-pointer flex-col items-start justify-start overflow-hidden p-6 shadow-2xl min-h-[200px]">
                <div className="z-10 flex flex-col items-start justify-start space-y-4">
                    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">Reputation</h2>
                    <p className="whitespace-nowrap text-4xl font-bold text-gray-800 dark:text-gray-200">
                        <NumberTicker value={stats.reputation} />
                    </p>
                </div>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
            
            <MagicCard className="flex w-full cursor-pointer flex-col items-start justify-start overflow-hidden p-6 shadow-2xl min-h-[200px]">
                <div className="z-10 flex flex-col items-start justify-start space-y-4">
                    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">Questions asked</h2>
                    <p className="whitespace-nowrap text-4xl font-bold text-gray-800 dark:text-gray-200">
                        <NumberTicker value={stats.questions} />
                    </p>
                </div>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
            
            <MagicCard className="flex w-full cursor-pointer flex-col items-start justify-start overflow-hidden p-6 shadow-2xl min-h-[200px]">
                <div className="z-10 flex flex-col items-start justify-start space-y-4">
                    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">Answers given</h2>
                    <p className="whitespace-nowrap text-4xl font-bold text-gray-800 dark:text-gray-200">
                        <NumberTicker value={stats.answers} />
                    </p>
                </div>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
        </MagicContainer>
    );
}
