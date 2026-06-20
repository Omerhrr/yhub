/**
 * Server-side Paystack payment verification.
 *
 * If PAYSTACK_SECRET_KEY is set, hits the Paystack API to confirm:
 *   - transaction status === "success"
 *   - amount paid >= expected (in kobo)
 *
 * If the key is not configured (dev / test), logs a warning and passes
 * through so local development still works without real credentials.
 */
export async function verifyPaystackPayment(
  reference: string,
  expectedNaira: number,
): Promise<boolean> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    console.warn(
      `[paystack] PAYSTACK_SECRET_KEY not set — skipping verification for ref ${reference}`,
    );
    return true; // Allow in dev/test; block in production by setting the key
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        // Abort after 8 seconds to avoid hanging the request
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (!res.ok) {
      console.error(`[paystack] verify HTTP ${res.status} for ref ${reference}`);
      return false;
    }

    const json = await res.json();
    const tx   = json?.data;

    if (!tx || tx.status !== "success") {
      console.warn(`[paystack] ref ${reference} status: ${tx?.status}`);
      return false;
    }

    // tx.amount is in kobo; expectedNaira × 100 = expected kobo
    const expectedKobo = expectedNaira * 100;
    if (tx.amount < expectedKobo) {
      console.warn(
        `[paystack] ref ${reference} paid ${tx.amount} kobo but expected ${expectedKobo}`,
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error(`[paystack] verify error for ref ${reference}:`, err);
    return false;
  }
}
