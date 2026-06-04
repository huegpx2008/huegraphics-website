"use client";

import { useMemo, useState } from "react";

type InkColor = {
  code: string;
  name: string;
  hex: string;
  group: string;
};

const inkColors: InkColor[] = [
  { code: "GEN 11900", name: "Black", hex: "#050505", group: "Neutrals" },
  { code: "GEN 19120", name: "Black Dream", hex: "#101010", group: "Neutrals" },
  { code: "GEN 11330", name: "Russell Gray", hex: "#777b80", group: "Neutrals" },
  { code: "GEN 11460", name: "Dark Gray", hex: "#3f4448", group: "Neutrals" },
  { code: "GEN 12400", name: "Sand", hex: "#c7b894", group: "Neutrals" },
  { code: "GEN 11260", name: "Rebel Flesh", hex: "#d6a889", group: "Neutrals" },
  { code: "GEN 12010", name: "Dark Brown", hex: "#4a2416", group: "Browns" },
  { code: "GEN 12380", name: "Spice Brown", hex: "#8a4d26", group: "Browns" },
  { code: "GEN 13020", name: "Bright Orange", hex: "#f26522", group: "Orange" },
  { code: "GEN 13040", name: "Dolphin Orange", hex: "#e65a1f", group: "Orange" },
  { code: "GEN 14000", name: "Scarlet", hex: "#d71920", group: "Reds" },
  { code: "GEN 14007", name: "Rubine Red", hex: "#c71555", group: "Reds" },
  { code: "GEN 14008", name: "Rhodamine Red", hex: "#e33072", group: "Reds" },
  { code: "GEN 14070", name: "Brock Red", hex: "#b5121b", group: "Reds" },
  { code: "GEN 14110", name: "Red #10", hex: "#c72026", group: "Reds" },
  { code: "GEN 14200", name: "Dallas Scarlet", hex: "#bd1f2d", group: "Reds" },
  { code: "GEN 14300", name: "National Red", hex: "#af1726", group: "Reds" },
  { code: "GEN 14540", name: "Maroon", hex: "#6e1428", group: "Reds" },
  { code: "GEN 14580", name: "Russell Cardinal", hex: "#8c1d2c", group: "Reds" },
  { code: "GEN 14760", name: "Brandywine", hex: "#6f1d3a", group: "Reds" },
  { code: "GEN 14860", name: "Burgundy", hex: "#58182d", group: "Reds" },
  { code: "GEN 11210", name: "Relay Pink", hex: "#f08ab4", group: "Pinks" },
  { code: "GEN 15020", name: "Purple", hex: "#4b2383", group: "Purples" },
  { code: "GEN 15025", name: "Hornets Purple", hex: "#3b256f", group: "Purples" },
  { code: "GEN 15040", name: "Russell Purple", hex: "#43236c", group: "Purples" },
  { code: "GEN 15060", name: "Violet Duck", hex: "#6a4aa6", group: "Purples" },
  { code: "GEN 16000", name: "Navy", hex: "#071d3c", group: "Blues" },
  { code: "GEN 16050", name: "Light Navy", hex: "#183a66", group: "Blues" },
  { code: "GEN 16065", name: "Contact Blue", hex: "#005ca8", group: "Blues" },
  { code: "GEN 16070", name: "Columbia Blue", hex: "#79b8df", group: "Blues" },
  { code: "GEN 16080", name: "Carolina Blue", hex: "#77bde7", group: "Blues" },
  { code: "GEN 16210", name: "Light Royal", hex: "#005eb8", group: "Blues" },
  { code: "GEN 16425", name: "Reflex Blue", hex: "#001f7a", group: "Blues" },
  { code: "GEN 16610", name: "Bears Navy", hex: "#071b33", group: "Blues" },
  { code: "GEN 17000", name: "Kelly Green", hex: "#00833e", group: "Greens" },
  { code: "GEN 17020", name: "Dark Green", hex: "#06492d", group: "Greens" },
  { code: "GEN 17030", name: "Team Aqua", hex: "#00a6b2", group: "Greens" },
  { code: "GEN 17035", name: "Hornets Teal", hex: "#007a7a", group: "Greens" },
  { code: "GEN 17050", name: "Dallas Green", hex: "#006b3f", group: "Greens" },
  { code: "GEN 17530", name: "Turquoise", hex: "#00a7c7", group: "Greens" },
  { code: "GEN 17590", name: "Black Light Green", hex: "#7fd13b", group: "Greens" },
  { code: "GEN 18050", name: "Old Gold", hex: "#b88922", group: "Yellows" },
  { code: "GEN 18100", name: "Lemon Yellow", hex: "#f6e500", group: "Yellows" },
  { code: "GEN 18250", name: "Yellow", hex: "#f4c400", group: "Yellows" },
  { code: "GEN 18922", name: "Vegas Gold", hex: "#b7a46a", group: "Yellows" },
  { code: "GEN 19000", name: "Fluorescent Yellow", hex: "#dfff00", group: "Fluorescents" },
  { code: "GEN 19010", name: "Fluorescent Blue", hex: "#00a6ff", group: "Fluorescents" },
  { code: "GEN 19020", name: "Fluorescent Green", hex: "#39ff14", group: "Fluorescents" },
  { code: "GEN 19030", name: "Fluorescent Orange", hex: "#ff6b00", group: "Fluorescents" },
  { code: "GEN 19040", name: "Fluorescent Pink", hex: "#ff4fa3", group: "Fluorescents" },
  { code: "GEN 19060", name: "Fluorescent Red", hex: "#ff2338", group: "Fluorescents" },
  { code: "GEN 19067", name: "Fluorescent Purple", hex: "#9b4dff", group: "Fluorescents" },
  { code: "GEN 19070", name: "Fluorescent Magenta", hex: "#ff00a8", group: "Fluorescents" },
];

const groups = ["All", ...Array.from(new Set(inkColors.map((color) => color.group)))];

export function InkColorExplorer() {
  const [activeGroup, setActiveGroup] = useState("All");
  const [selectedColor, setSelectedColor] = useState<InkColor>(inkColors[10]);

  const filteredColors = useMemo(() => {
    if (activeGroup === "All") return inkColors;
    return inkColors.filter((color) => color.group === activeGroup);
  }, [activeGroup]);

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm bg-[#c9d7e6] shadow-[0_24px_70px_rgba(7,17,31,0.12)] ring-1 ring-black/10 lg:grid-cols-[0.42fr_1fr]">
        <div className="bg-white p-6 sm:p-8">
          <p className="eyebrow">Ink color explorer</p>
          <h2 className="mt-4 font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.95] text-[#07111f] sm:text-5xl">
            Preview common print colors.
          </h2>
          <div className="mt-7 h-1 w-16 rounded-full bg-accent" />
          <div className="mt-7 overflow-hidden rounded-sm border border-black/10 bg-[#101b2c] shadow-[0_18px_48px_rgba(7,17,31,0.12)]">
            <div
              className="h-40 border-b border-white/12"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                Selected ink
              </p>
              <p className="mt-2 text-2xl font-black uppercase leading-tight text-white">
                {selectedColor.name}
              </p>
              <p className="mt-1 text-sm font-bold text-[#b9c7d6]">
                {selectedColor.code}
              </p>
            </div>
          </div>
          <p className="mt-5 text-xs leading-6 text-[#536273]">
            On-screen swatches are approximate. Final color can shift based on
            garment color, fabric, underbase, curing, lighting, and monitor
            settings.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={[
                  "rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wide transition",
                  activeGroup === group
                    ? "border-accent bg-accent text-white"
                    : "border-black/10 bg-[#f4f8fc] text-[#314154] hover:border-accent/60 hover:text-[#07111f]",
                ].join(" ")}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredColors.map((color) => (
              <button
                key={`${color.code}-${color.name}`}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={[
                  "group grid grid-cols-[3.75rem_1fr] overflow-hidden rounded-md border bg-[#f4f8fc] text-left transition hover:border-accent/70 hover:bg-accent/10",
                  selectedColor.code === color.code &&
                  selectedColor.name === color.name
                    ? "border-accent"
                    : "border-black/10",
                ].join(" ")}
              >
                <span
                  className="min-h-16 border-r border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="p-3">
                  <span className="block text-sm font-black uppercase leading-tight text-[#07111f]">
                    {color.name}
                  </span>
                  <span className="mt-1 block text-xs font-bold text-[#536273]">
                    {color.code}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
