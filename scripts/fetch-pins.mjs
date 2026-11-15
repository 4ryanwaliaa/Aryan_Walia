/* Pulls the latest public pins from Pinterest's RSS feed into components/pins.json.
   Runs before every build (see "prebuild" in package.json), so each deploy refreshes the board.
   If Pinterest cannot be reached the existing file is kept and the build carries on. */
import { readFile, writeFile } from 'node:fs/promises';

const USER = '4ryanwalia';
const FEED = `https://www.pinterest.com/${USER}/feed.rss`;
const OUT = new URL('../components/pins.json', import.meta.url);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const MAX = 24;

/* Reads width and height out of a JPEG's frame header, so the grid can reserve space. */
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) return { h: (buf[i + 5] << 8) | buf[i + 6], w: (buf[i + 7] << 8) | buf[i + 8] };
    i += 2 + ((buf[i + 2] << 8) | buf[i + 3]);
  }
  return null;
}

async function main() {
  const res = await fetch(FEED, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`feed returned ${res.status}`);
  const xml = await res.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, MAX);
  const pins = [];
  for (const [, item] of items) {
    const url = item.match(/<link>(.*?)<\/link>/)?.[1];
    const thumb = item.match(/https:\/\/i\.pinimg\.com\/[^&"<\s]+/)?.[0];
    const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
    if (!url || !thumb) continue;
    let size = null;
    try {
      const img = await fetch(thumb, { headers: { 'User-Agent': UA } });
      if (img.ok) size = jpegSize(new Uint8Array(await img.arrayBuffer()));
    } catch {
      /* size stays unknown; the grid copes */
    }
    pins.push({
      url,
      img: thumb.replace(/\/\d+x\//, '/474x/'),
      w: size?.w ?? null,
      h: size?.h ?? null,
      date: date ? new Date(date).toISOString().slice(0, 10) : null,
    });
  }
  if (!pins.length) throw new Error('feed had no pins');

  const data = { user: USER, profile: `https://www.pinterest.com/${USER}/`, fetched: new Date().toISOString().slice(0, 10), pins };
  await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`pins: wrote ${pins.length} from ${FEED}`);
}

main().catch(async (error) => {
  try {
    const existing = JSON.parse(await readFile(OUT, 'utf8'));
    console.warn(`pins: ${error.message}; keeping the ${existing.pins.length} already saved`);
  } catch {
    await writeFile(OUT, `${JSON.stringify({ user: USER, profile: `https://www.pinterest.com/${USER}/`, fetched: null, pins: [] }, null, 2)}\n`);
    console.warn(`pins: ${error.message}; wrote an empty board`);
  }
});
