
"use client";

import { Maximize2, X } from "lucide-react";

export default function PanelWrapper({ title, children, onRemove }) {
  return (
    <div className="h-full w-full bg-[#111] border border-[#2a2a2a] rounded flex flex-col overflow-hidden">

      {/* PANEL HEADER */}
      <div className="drag-handle h-8 shrink-0 bg-[#151515] border-b border-[#2a2a2a] px-2 flex items-center justify-between cursor-move">

        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          {title}
        </span>

        <div className="flex items-center gap-2 text-gray-500">
          <Maximize2 size={12} />

          <button onClick={onRemove} title="Remove panel">
            <X size={13} className="hover:text-red-500" />
          </button>
        </div>

      </div>

      {/* PANEL CONTENT */}
      <div className="flex-1 min-h-0 overflow-auto">
        {children}
      </div>

    </div>
  );
}
