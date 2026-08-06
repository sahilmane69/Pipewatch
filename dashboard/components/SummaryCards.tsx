"use client";

import React from "react";
import { CheckCircle2, XCircle, Loader2, Layers } from "lucide-react";
import { PipelineStats, PipelineStatus } from "@/lib/types";

interface SummaryCardsProps {
  stats: PipelineStats;
  selectedStatus: PipelineStatus | "All";
  onSelectStatus: (status: PipelineStatus | "All") => void;
}

export function SummaryCards({
  stats,
  selectedStatus,
  onSelectStatus,
}: SummaryCardsProps) {
  const cards = [
    {
      id: "All" as const,
      label: "Total Runs",
      count: stats.total,
      subtext: `${stats.successRate}% pass rate`,
      icon: Layers,
      color: "text-zinc-300",
      iconBg: "bg-zinc-800/60 text-zinc-300 border-zinc-700/50",
      activeBorder: "ring-2 ring-indigo-500/80 border-indigo-500/50 bg-indigo-500/[0.03]",
    },
    {
      id: "Success" as const,
      label: "Successful",
      count: stats.success,
      subtext: `${stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}% of total`,
      icon: CheckCircle2,
      color: "text-emerald-400",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      activeBorder: "ring-2 ring-emerald-500/80 border-emerald-500/50 bg-emerald-500/[0.03]",
    },
    {
      id: "Failed" as const,
      label: "Failed",
      count: stats.failed,
      subtext: stats.failed > 0 ? "Requires attention" : "No failures",
      icon: XCircle,
      color: "text-rose-400",
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      activeBorder: "ring-2 ring-rose-500/80 border-rose-500/50 bg-rose-500/[0.03]",
    },
    {
      id: "Running" as const,
      label: "In Progress",
      count: stats.running,
      subtext: stats.queued > 0 ? `${stats.queued} queued` : "Active pipelines",
      icon: Loader2,
      color: "text-amber-400",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      activeBorder: "ring-2 ring-amber-500/80 border-amber-500/50 bg-amber-500/[0.03]",
      animateIcon: stats.running > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.id;

        return (
          <button
            key={card.label}
            onClick={() => onSelectStatus(isSelected ? "All" : card.id)}
            className={`text-left p-5 rounded-xl border bg-zinc-900/40 backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 group ${
              isSelected ? card.activeBorder : "border-zinc-800/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {card.label}
              </span>
              <div
                className={`p-2 rounded-lg border text-xs ${card.iconBg}`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    card.animateIcon ? "animate-spin" : ""
                  }`}
                />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className={`text-2xl font-bold tracking-tight ${card.color}`}>
                {card.count}
              </span>
              <span className="text-[11px] font-normal text-zinc-500">
                {card.subtext}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
