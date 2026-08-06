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
      color: "text-zinc-100",
      activeBorder: "border-zinc-500 bg-zinc-900/90",
    },
    {
      id: "Success" as const,
      label: "Successful",
      count: stats.success,
      subtext: `${stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}% of total`,
      icon: CheckCircle2,
      color: "text-emerald-400",
      activeBorder: "border-emerald-500/60 bg-emerald-500/[0.04]",
    },
    {
      id: "Failed" as const,
      label: "Failed",
      count: stats.failed,
      subtext: stats.failed > 0 ? "Requires attention" : "0 issues",
      icon: XCircle,
      color: "text-rose-400",
      activeBorder: "border-rose-500/60 bg-rose-500/[0.04]",
    },
    {
      id: "Running" as const,
      label: "In Progress",
      count: stats.running,
      subtext: stats.queued > 0 ? `${stats.queued} queued` : "0 active",
      icon: Loader2,
      color: "text-amber-400",
      activeBorder: "border-amber-500/60 bg-amber-500/[0.04]",
      animateIcon: stats.running > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.id;

        return (
          <button
            key={card.label}
            onClick={() => onSelectStatus(isSelected ? "All" : card.id)}
            className={`text-left px-3.5 py-3 rounded-lg border bg-zinc-900/50 transition-all group ${
              isSelected
                ? card.activeBorder
                : "border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {card.label}
              </span>
              <Icon
                className={`h-3.5 w-3.5 text-zinc-500 ${
                  card.animateIcon ? "animate-spin text-amber-400" : ""
                }`}
              />
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className={`text-lg font-bold tracking-tight ${card.color}`}>
                {card.count}
              </span>
              <span className="text-[10px] text-zinc-500">
                {card.subtext}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
