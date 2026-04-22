"use client";

import { Loader2 } from "lucide-react";

type StrReplaceArgs = {
  command?: string;
  path?: string;
};

export function getToolLabel(toolName: string, args: unknown): string {
  if (toolName === "str_replace_editor") {
    const { command, path } = (args ?? {}) as StrReplaceArgs;
    const filename = path ? path.split(/[\\/]/).pop() || "file" : "file";

    switch (command) {
      case "create":     return `Creating ${filename}`;
      case "str_replace":
      case "insert":     return `Editing ${filename}`;
      case "view":       return `Reading ${filename}`;
      case "undo_edit":  return `Undoing changes to ${filename}`;
      default:           return `Processing ${filename}`;
    }
  }
  return toolName;
}

interface ToolCallBadgeProps {
  toolName: string;
  args: unknown;
  state: "call" | "partial-call" | "result";
  result?: unknown;
}

export function ToolCallBadge({ toolName, args, state, result }: ToolCallBadgeProps) {
  const isDone = state === "result" && !!result;
  const label = getToolLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <div
          className="w-2 h-2 rounded-full bg-emerald-500"
          data-testid="tool-complete"
          aria-hidden="true"
        />
      ) : (
        <Loader2
          className="w-3 h-3 animate-spin text-blue-600"
          data-testid="tool-loading"
          aria-label="Loading"
        />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
