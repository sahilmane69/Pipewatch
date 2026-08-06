"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Pipeline {
    id: string;
    workflowId: string;
    repository: string;
    workflow: string;
    branch: string;
    status: string;
    conclusion: string | null;
    url: string;
    createdAt: string;
}

export default function Home() {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);

    useEffect(() => {
        api.get("/pipelines").then((res) => {
            setPipelines(res.data);
        });
    }, []);

    return (
        <main className="min-h-screen p-10 bg-zinc-950 text-white">
            <h1 className="text-4xl font-bold mb-8">
                 Pipewatch Dashboard
            </h1>

            <table className="w-full border border-zinc-700">
                <thead className="bg-zinc-800">
                <tr>
                    <th className="p-4 text-left">Repository</th>
                    <th className="p-4 text-left">Workflow</th>
                    <th className="p-4 text-left">Branch</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Conclusion</th>
                </tr>
                </thead>

                <tbody>
                {pipelines.map((pipeline) => (
                    <tr
                        key={pipeline.id}
                        className="border-t border-zinc-700"
                    >
                        <td className="p-4">{pipeline.repository}</td>
                        <td className="p-4">{pipeline.workflow}</td>
                        <td className="p-4">{pipeline.branch}</td>
                        <td className="p-4">{pipeline.status}</td>
                        <td className="p-4">
                            {pipeline.conclusion ?? "-"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}