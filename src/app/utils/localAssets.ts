import type { ContentItem } from '../types';

const LOCAL_ASSET_FILES = [
  '[DB]Cowboy Bebop_-_01_(Dual Audio_10bit_BD1080p_x265).mp4',
  '01 - The Skeleton Dance (1929).mp4',
  '02 - El Terrible Toreador (1929).mp4',
  '03 - Springtime (1929).mp4',
  '04 - Hell\'s Bells (1929).mp4',
  '05 - The Merry Dwarfs (1929).mp4',
  '06 - Summer (1930).mp4',
  '07 - Autumn (1930).mp4',
  '08 - Cannibal Capers (1930).mp4',
  '09 - Night (1930).mp4',
  '10 - Frolicking Fish (1930).mp4',
  '11 - Arctic Antics (1930).mp4',
  '12 - Midnight In A Toyshop (1930).mp4',
  '13 - Monkey Melodies (1930).mp4',
  '14 - Winter (1930).mp4',
  '15 - Playful Pan (1930).mp4',
  '16 - Mother Goose Melodies (1931).mp4',
  '17 - Birds Of A Feather (1931).mp4',
  '18 - The China Plate (1931).mp4',
  '19 - The Busy Beavers (1931).mp4',
  '20 - The Cat\'s Out (1931).mp4',
  '21 - Egyptian Melodies (1931).mp4',
  '22 - The Clock Store (1931).mp4',
  '23 - The Spider And The Fly (1931).mp4',
  '24 - The Fox Hunt (1931).mp4',
  '25 - The Ugly Duckling (1931).mp4',
  '26 - The Bird Store (1932).mp4',
  '27 - The Bears And The Bees (1932).mp4',
  '28 - Just Dogs (1932).mp4',
  '29 - Flowers And Trees (1932).mp4',
  '30 - King Neptune (1932).mp4',
  '31 - Bugs In Love (1932).mp4',
  '32 - Babes In The Woods (1932).mp4',
  '33 - Santa\'s Workshop (1932).mp4',
  '34 - Birds In The Spring (1933).mp4',
  '35 - Father Noah\'s Ark (1933).mp4',
  '36 - Three Little Pigs (1933).mp4',
  '37 - Old King Cole (1933).mp4',
  '38 - Lullaby Land (1933).mp4',
  '39 - The Pied Piper (1933).mp4',
  '40 - The Night Before Christmas (1933).mp4',
  '41 - The China Shop (1934).mp4',
  '42 - The Grasshopper And The Ants (1934).mp4',
  '43 - Funny Little Bunnies (1934).mp4',
  '44 - The Big Bad Wolf (1934).mp4',
  '45 - The Wise Little Hen (1934).mp4',
  '46 - The Flying Mouse (1934).mp4',
  '47 - Peculiar Penguins (1934).mp4',
  '48 - The Goddess Of Spring (1934).mp4',
  '49 - The Tortoise And The Hare (1935).mp4',
  '50 - The Golden Touch (1935).mp4',
  '51- The Robber Kitten (1935).mp4',
  '52 - Water Babies (1935).mp4',
  '53 - The Cookie Carnival (1935).mp4',
  '54 - Who Killed Cock Robin (1935).mp4',
  '55 - Music Land (1935).mp4',
  '56 - Three Orphan Kittens (1935).mp4',
  '57 - Cock O\' The Walk (1935).mp4',
  '58 - Broken Toys (1935).mp4',
  '59 - Elmer Elephant (1936).mp4',
  '60 - Three Little Wolves (1936).mp4',
  '61 - Toby Tortoise Returns (1936).mp4',
  '62 - Three Blind Mousketeers (1936).mp4',
  '63 - The Country Cousin (1936).mp4',
  '64 - Mother Pluto (1936).mp4',
  '65 - More Kittens (1936).mp4',
  '66 - Woodland Café (1937).mp4',
  '67 - Little Hiawatha (1937).mp4',
  '68 - The Old Mill (1937).mp4',
  '69 - The Moth And The Flame (1938).mp4',
  '70 - Wynken, Blynken And Nod (1938).mp4',
  '71 - Farmyard Symphony (1938).mp4',
  '72 - Merbabies (1938).mp4',
  '73 - Mother Goose Goes Hollywood (1938).mp4',
  '74 - The Practical Pig (1939).mp4',
  '75 - The Ugly Duckling (1939).mp4',
] as const;

const configuredMediaBaseUrl = (import.meta.env.VITE_LOCAL_MEDIA_BASE_URL ?? '').trim().replace(/\/+$/, '');
const localMediaBaseUrl = configuredMediaBaseUrl || (import.meta.env.DEV ? '/src/Assets' : '');

function hashString(value: string): number {
  return value.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
}

function decodeFileName(fileName: string): string {
  return fileName.replace(/\.mp4$/i, '');
}

function normalizeTitle(fileName: string): string {
  return fileName
    .replace(/^\[\w+\]/, '')
    .replace(/^\d+\s*-\s*/, '')
    .replace(/\(\d{4}\)/, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractYear(fileName: string): number {
  const yearMatch = fileName.match(/\((\d{4})\)/);
  return yearMatch ? Number(yearMatch[1]) : 1930;
}

function getGenre(title: string): ContentItem['genre'] {
  const normalizedTitle = title.toLowerCase();

  if (/cowboy bebop/.test(normalizedTitle)) return 'Action';
  if (/(neptune|egyptian|goddess|halloween|skeleton|mother goose|wynken|merbabies)/.test(normalizedTitle)) return 'Fantasy';
  if (/(night|hell|midnight|spider|moth|old mill|broken|ugly duckling|wolf|wolves)/.test(normalizedTitle)) return 'Thriller';
  if (/(spring|summer|autumn|winter|flowers|trees|arctic|water babies|farmyard|woodland|birds|duckling)/.test(normalizedTitle)) return 'Animation';
  if (/(love|lullaby|orphan|babies|mother|country cousin|little hen|practical pig|elephant)/.test(normalizedTitle)) return 'Drama';
  if (/(clock|toyshop|china|golden|music land|flying|future|bebop)/.test(normalizedTitle)) return 'Sci-Fi';
  if (/(funny|playful|merry|bunnies|cookies|pigs|cock o' the walk|just dogs|robber kitten)/.test(normalizedTitle)) return 'Comedy';

  const fallbackGenres: ContentItem['genre'][] = ['Action', 'Drama', 'Sci-Fi', 'Animation', 'Thriller', 'Comedy'];
  return fallbackGenres[hashString(title) % fallbackGenres.length];
}

function getBadge(index: number): ContentItem['badge'] | undefined {
  if (index < 6) return 'New';
  if (index < 12) return 'Top 10';
  return undefined;
}

function createThumbnail(title: string, year: number, accentHue: number): string {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${accentHue} 65% 56%)" />
          <stop offset="55%" stop-color="hsl(${(accentHue + 32) % 360} 60% 28%)" />
          <stop offset="100%" stop-color="#101522" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#bg)" />
      <circle cx="680" cy="110" r="92" fill="rgba(255,255,255,0.10)" />
      <circle cx="126" cy="368" r="118" fill="rgba(255,255,255,0.08)" />
      <rect x="46" y="42" width="164" height="34" rx="17" fill="rgba(255,255,255,0.16)" />
      <text x="66" y="64" fill="#ffffff" font-family="Georgia, serif" font-size="18" letter-spacing="2">LOCAL ASSET</text>
      <text x="54" y="290" fill="#ffffff" font-family="Georgia, serif" font-size="48" font-weight="700">${safeTitle}</text>
      <text x="54" y="334" fill="rgba(255,255,255,0.82)" font-family="Arial, sans-serif" font-size="24">${year} • Playable from your library</text>
      <g transform="translate(640 300)">
        <circle r="54" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.75)" stroke-width="2" />
        <polygon points="-10,-18 24,0 -10,18" fill="#ffffff" />
      </g>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildVideoUrl(fileName: string): string | undefined {
  if (!localMediaBaseUrl) return undefined;
  return `${localMediaBaseUrl}/${encodeURIComponent(fileName)}`;
}

export const LOCAL_ASSET_CONTENT: ContentItem[] = LOCAL_ASSET_FILES.map((assetFile, index): ContentItem | null => {
  const fileName = decodeFileName(assetFile);
  const title = normalizeTitle(fileName);
  const year = extractYear(fileName);
  const accentHue = Math.abs(hashString(fileName)) % 360;
  const videoSrc = buildVideoUrl(assetFile);

  if (!videoSrc) return null;

  return {
    id: `asset-${index + 1}`,
    title,
    type: 'movie',
    genre: getGenre(title),
    year,
    rating: 7.5 + ((index % 15) / 10),
    thumbnail: createThumbnail(title, year, accentHue),
    description: `Imported from your local assets: ${fileName}.`,
    director: 'Local Library',
    maturityRating: 'NR',
    reason: 'From your local assets',
    badge: getBadge(index),
    videoSrc,
  };
}).filter((item): item is ContentItem => item !== null);

export const localAssetVideoMap = Object.fromEntries(
  LOCAL_ASSET_CONTENT.map(item => [item.id, item.videoSrc as string]),
);
