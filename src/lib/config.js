/**
 * Data source configuration.
 *
 * Set DATA_SOURCE to:
 *   'local'  — load cards from src/data/cards.json
 *   'remote' — fetch cards from REMOTE_URL
 */

export const DATA_SOURCE = 'local';

/**
 * Remote endpoint used when DATA_SOURCE === 'remote'.
 * Replace with the actual URL when ready.
 */
export const REMOTE_URL = 'https://example.com/api/cards.json';

/**
 * Site metadata used in layouts and SEO.
 */
export const SITE = {
  title: 'Pokémon Card Collection',
  description:
    'A curated visual archive of specific Pokémon cards — promos, tournament exclusives, and collector highlights.',
  url: 'https://psy.yurigo.dev',
};
