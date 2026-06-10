export type ApparelSizePriceBreakdown = {
  label: string;
  representativeSize: string;
  quantity: number;
  priceEach?: number | string;
  total?: number;
};

const standardSizes = new Set(["XS", "S", "M", "L", "XL"]);

function sizeGroupLabel(size: string) {
  return standardSizes.has(size.toUpperCase()) ? "S-XL" : size;
}

export function groupSizeQuantities(sizes: Record<string, string | number>) {
  const groups = new Map<string, ApparelSizePriceBreakdown>();

  Object.entries(sizes).forEach(([size, quantity]) => {
    const numericQuantity = Math.max(0, Math.floor(Number(quantity || 0)));

    if (!numericQuantity) {
      return;
    }

    const label = sizeGroupLabel(size);
    const existing = groups.get(label);

    if (existing) {
      existing.quantity += numericQuantity;
      return;
    }

    groups.set(label, {
      label,
      representativeSize: size,
      quantity: numericQuantity,
    });
  });

  return [...groups.values()];
}

export function extractApiSizePriceBreakdown(
  estimate: { summary?: { sizePriceBreakdown?: unknown } } | null | undefined,
) {
  const breakdown = estimate?.summary?.sizePriceBreakdown;

  if (!Array.isArray(breakdown)) {
    return [];
  }

  return breakdown.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const entry = item as Record<string, unknown>;
    const label =
      typeof entry.label === "string"
        ? entry.label
        : typeof entry.size === "string"
          ? entry.size
          : "";
    const quantity = Number(entry.quantity ?? entry.qty ?? 0);
    const priceEach = entry.priceEach;

    if (!label || !Number.isFinite(quantity) || quantity <= 0) {
      return [];
    }

    const numericPrice =
      typeof priceEach === "number"
        ? priceEach
        : typeof priceEach === "string"
          ? Number(priceEach.replace(/[^0-9.-]/g, ""))
          : Number.NaN;

    return [
      {
        label,
        representativeSize: label,
        quantity,
        priceEach:
          typeof priceEach === "number" || typeof priceEach === "string"
            ? priceEach
            : undefined,
        total: Number.isFinite(numericPrice) ? numericPrice * quantity : undefined,
      },
    ];
  });
}

export async function loadGroupedSizePriceBreakdown<Estimate>({
  sizes,
  totalQuantity,
  buildPayload,
  requestEstimate,
  readEach,
}: {
  sizes: Record<string, number>;
  totalQuantity: number;
  buildPayload: (sizes: Record<string, number>) => unknown;
  requestEstimate: (payload: unknown) => Promise<Estimate>;
  readEach: (estimate: Estimate) => number | string | undefined;
}) {
  const groups = groupSizeQuantities(sizes);

  return Promise.all(
    groups.map(async (group) => {
      const estimate = await requestEstimate(
        buildPayload({ [group.representativeSize]: totalQuantity }),
      );
      const priceEach = readEach(estimate);
      const numericPrice =
        typeof priceEach === "number"
          ? priceEach
          : typeof priceEach === "string"
            ? Number(priceEach.replace(/[^0-9.-]/g, ""))
            : Number.NaN;

      return {
        ...group,
        priceEach,
        total: Number.isFinite(numericPrice)
          ? numericPrice * group.quantity
          : undefined,
      };
    }),
  );
}
