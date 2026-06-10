import type { ApparelSizePriceBreakdown } from "@/lib/apparel-size-breakdown";

type ApparelSizePriceBreakdownListProps = {
  breakdown: ApparelSizePriceBreakdown[];
  currency?: string;
};

function formatPrice(value: number | string | undefined, currency = "USD") {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  }

  return value || "Review";
}

export function ApparelSizePriceBreakdownList({
  breakdown,
  currency = "USD",
}: ApparelSizePriceBreakdownListProps) {
  if (!breakdown.length) {
    return null;
  }

  return (
    <div className="rounded-md bg-white p-4 text-sm font-bold leading-6 text-[#314154] ring-1 ring-black/8">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#678197]">
        Size price breakdown
      </p>
      <div className="mt-3 grid gap-2">
        {breakdown.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[1fr_auto] gap-3 rounded-md bg-[#f4f8fc] px-3 py-2"
          >
            <span>
              {item.label}: {item.quantity}
            </span>
            <span className="text-right">
              {formatPrice(item.priceEach, currency)} each
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
