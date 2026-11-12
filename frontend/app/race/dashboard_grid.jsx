
"use client";

import { useState } from "react";
import ReactGridLayout, { useContainerWidth } from "react-grid-layout";
// import PanelWrapper from "./PanelWrapper";
import PanelWrapper from "./panel_wrapper";

const initialLayout = [
  { i: "track", x: 0, y: 0, w: 7, h: 10 },
  { i: "timing", x: 7, y: 0, w: 3, h: 5 },
  { i: "comms", x: 10, y: 0, w: 2, h: 10 },
  { i: "laps", x: 7, y: 5, w: 3, h: 5 },
  { i: "undercut", x: 0, y: 10, w: 2, h: 5 },
  { i: "tyre", x: 2, y: 10, w: 4, h: 5 },
  { i: "gap", x: 6, y: 10, w: 6, h: 5 },
];

const panelNames = {
  track: "Track Map",
  timing: "Timing Tower",
  comms: "ARIS Comms",
  laps: "Lap Times",
  undercut: "Undercut Window",
  tyre: "Tyre Degradation",
  gap: "Gap Chart",
};

export default function DashboardGrid() {
  const [layout, setLayout] = useState(initialLayout);
  const { width, containerRef, mounted } = useContainerWidth();

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-black p-2">
      {mounted && (
        <ReactGridLayout
          width={width}
          layout={layout}
          onLayoutChange={setLayout}
          gridConfig={{ cols: 12, rowHeight: 40, margin: [8, 8] }}
          dragConfig={{ enabled: true, handle: ".drag-handle" }}
          resizeConfig={{ enabled: true }}
        >
          {layout.map((panel) => (
            <div key={panel.i} className="bg-[#111] border border-[#333] rounded overflow-hidden">
              <PanelWrapper title={panelNames[panel.i]}>
                <div className="p-3 text-gray-500 text-xs">
                  {panelNames[panel.i]} content goes here
                </div>
              </PanelWrapper>
            </div>
          ))}
        </ReactGridLayout>
      )}
    </div>
  );
}
