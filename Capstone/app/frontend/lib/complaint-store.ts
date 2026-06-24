// ────────────────────────────────────────────────────────────
// Complaint Store — In-Memory Duplicate Detection
// ────────────────────────────────────────────────────────────
// Maintains a rolling buffer of recent complaints with their
// embeddings. When a new complaint is classified, its embedding
// is compared against this store. If similarity > 0.85 to an
// existing complaint, it's flagged as a potential duplicate.
//
// The store is cleared on server restart (in-memory only).
// Stores the last 20 complaints to prevent memory bloat.
// ────────────────────────────────────────────────────────────

const MAX_STORED_COMPLAINTS = 20;
const DUPLICATE_THRESHOLD = 0.85;

interface StoredComplaint {
  text: string;
  embedding: number[];
  category: string;
  timestamp: number;
  location?: string;
}

const complaintStore: StoredComplaint[] = [];

// ── Cosine Similarity ────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// ── Public API ────────────────────────────────────────────

export interface DuplicateResult {
  isDuplicate: boolean;
  similarCount: number;
  similarComplaints: Array<{ text: string; category: string; similarity: number }>;
  message: string;
}

/**
 * Check if a new complaint is a duplicate of recently stored ones.
 * Returns the count of similar complaints and a warning message.
 */
export function checkDuplicate(
  text: string,
  embedding: number[],
  location?: string
): DuplicateResult {
  if (complaintStore.length === 0) {
    return {
      isDuplicate: false,
      similarCount: 0,
      similarComplaints: [],
      message: "",
    };
  }

  const similar = complaintStore
    .map((stored) => ({
      text: stored.text,
      category: stored.category,
      similarity: cosineSimilarity(embedding, stored.embedding),
    }))
    .filter((s) => s.similarity > DUPLICATE_THRESHOLD)
    .sort((a, b) => b.similarity - a.similarity);

  const count = similar.length;

  if (count === 0) {
    return { isDuplicate: false, similarCount: 0, similarComplaints: [], message: "" };
  }

  const message =
    count === 1
      ? `Mayroon nang 1 kahalintulad na ulat mula sa inyong lugar. Pakisuri kung ito ay bagong insidente.`
      : `Mayroon nang ${count} kahalintulad na ulat mula sa inyong lugar. Pakisuri kung ito ay bagong insidente.`;

  return {
    isDuplicate: true,
    similarCount: count,
    similarComplaints: similar.slice(0, 3), // Return top 3
    message,
  };
}

/**
 * Store a new complaint in the rolling buffer.
 */
export function storeComplaint(
  text: string,
  embedding: number[],
  category: string,
  location?: string
): void {
  complaintStore.push({
    text: text.slice(0, 200), // Store truncated text for privacy
    embedding,
    category,
    timestamp: Date.now(),
    location,
  });

  // Keep only the last N complaints
  if (complaintStore.length > MAX_STORED_COMPLAINTS) {
    complaintStore.shift();
  }
}

/**
 * Get the current store size (for debugging/health check).
 */
export function getStoreSize(): number {
  return complaintStore.length;
}

/**
 * Clear the store (for testing).
 */
export function clearStore(): void {
  complaintStore.length = 0;
}
