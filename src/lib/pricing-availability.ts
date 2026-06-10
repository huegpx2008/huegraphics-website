export function isInvalidPricingInputMessage(message: string) {
  return /invalid|not available|unavailable/i.test(message);
}

export async function findUnavailableSelectedSizes({
  sizes,
  probeQuantity,
  requestEstimate,
}: {
  sizes: Record<string, number>;
  probeQuantity: number;
  requestEstimate: (sizes: Record<string, number>) => Promise<unknown>;
}) {
  const unavailable: string[] = [];

  for (const [size, quantity] of Object.entries(sizes)) {
    if (Number(quantity) <= 0) {
      continue;
    }

    try {
      await requestEstimate({ [size]: probeQuantity });
    } catch (error) {
      if (
        error instanceof Error &&
        isInvalidPricingInputMessage(error.message)
      ) {
        unavailable.push(size);
      }
    }
  }

  return unavailable;
}

export function removeUnavailableSizes<T extends string | number>(
  sizes: Record<string, T>,
  unavailableSizes: string[],
) {
  return Object.fromEntries(
    Object.entries(sizes).filter(([size]) => !unavailableSizes.includes(size)),
  ) as Record<string, T>;
}
