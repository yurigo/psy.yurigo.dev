import { DATA_SOURCE, REMOTE_URL } from './config.js';

/**
 * Normalize a raw card object into the canonical shape used by components.
 * Adds sensible defaults so consumers never need to guard for missing fields.
 *
 * @param {Object} raw
 * @returns {import('./types.js').Card}
 */
function normalizeCard(raw) {
  return {
    id: raw.id ?? '',
    name: raw.name ?? 'Unknown Card',
    set: raw.set ?? null,
    number: raw.number ?? null,
    notes: raw.notes ?? null,
    image: raw.image ?? null,
    description: raw.description ?? null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    isJumbo: raw.isJumbo ?? false,
    variant: raw.variant ?? null,
    language: raw.language ?? null,
    // Future-proof fields — kept as null when absent so consumers can opt-in
    rarity: raw.rarity ?? null,
    year: raw.year ?? null,
    externalLinks: raw.externalLinks ?? [],
  };
}

/**
 * Load cards from the local JSON file.
 * Import is static so it works at build-time with Astro.
 *
 * @returns {Promise<import('./types.js').Card[]>}
 */
async function loadLocal() {
  const { default: rawCards } = await import('../data/cards.json', {
    with: { type: 'json' },
  });
  return rawCards.map(normalizeCard);
}

/**
 * Fetch cards from a remote URL.
 *
 * @returns {Promise<import('./types.js').Card[]>}
 */
async function loadRemote() {
  const response = await fetch(REMOTE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch cards from ${REMOTE_URL}: ${response.status} ${response.statusText}`);
  }
  const rawCards = await response.json();
  if (!Array.isArray(rawCards)) {
    throw new Error('Remote data must be a JSON array of card objects.');
  }
  return rawCards.map(normalizeCard);
}

/**
 * Main entry-point for data access.
 * Returns a normalized array of cards regardless of the configured source.
 * On error it logs a warning and returns an empty array so the UI degrades
 * gracefully instead of crashing at build time.
 *
 * @returns {Promise<import('./types.js').Card[]>}
 */
export async function getCards() {
  try {
    if (DATA_SOURCE === 'remote') {
      return await loadRemote();
    }
    return await loadLocal();
  } catch (error) {
    console.warn('[cards] Could not load card data:', error.message);
    return [];
  }
}

/**
 * Return a single card by its id, or null if not found.
 *
 * @param {string} id
 * @returns {Promise<import('./types.js').Card | null>}
 */
export async function getCardById(id) {
  const cards = await getCards();
  return cards.find((card) => card.id === id) ?? null;
}

/**
 * Return the unique set names present in the collection, sorted alphabetically.
 *
 * @returns {Promise<string[]>}
 */
export async function getSets() {
  const cards = await getCards();
  const sets = new Set(cards.map((card) => card.set).filter(Boolean));
  return [...sets].sort();
}
