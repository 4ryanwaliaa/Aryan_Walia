/* Pulls the pins I made myself (not ones I saved from other people) into components/pins.json.
   Runs before every build (see "prebuild" in package.json), so each deploy refreshes the sheet.

   The RSS feed lists every recent pin, saved or made, so each new pin's public page is read once
   to see who created it. The verdict is stored by pin id, so later builds only look up pins they
   have not seen before. Pins already in the file stay in it, which keeps older ones around after
   the feed (about 25 items long) has moved past them. If Pinterest cannot be reached, the existing
   file is kept and the build carries on. */
import { readFile, writeFile } from 'node:fs/promises';

const USER = '4ryanwalia';
const FEED = `https://www.pinterest.com/${USER}/feed.rss`;
const PROFILE = `https://www.pinterest.com/${USER}/`;
const CREATED = `https://www.pinterest.com/${USER}/_created/`;
const OUT = new URL('../components/pins.json', import.meta.url);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const KEEP = 36;

/* the site never prints a long dash */
const undash = (s) => (s || '').replace(/\s*[–—]\s*/g, ', ').replace(/\s+/g, ' ').trim();

async function get(url, as = 'text') {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US' }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`${url} returned ${res.status}`);
      return as === 'bytes' ? new Uint8Array(await res.arrayBuffer()) : await res.text();
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return null;
}

/* Reads width and height out of a JPEG's frame header, so the page can reserve space. */
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

/* Reads one pin's public page. Returns { mine, title, alt } or null when the page does not say.
   The page also carries related pins, so the creator is read from the block that follows this
   pin's own id, not from the first match in the page. */
async function inspect(id) {
  const html = await get(`https://www.pinterest.com/pin/${id}/`);
  const anchor = `"entityId":"${id}"`;
  let creator = null;
  for (let at = html.indexOf(anchor); at >= 0 && !creator; at = html.indexOf(anchor, at + 1)) {
    const near = html.slice(at, at + 12000);
    const block = near.indexOf('"nativeCreator":{');
    if (block >= 0) creator = near.slice(block, block + 1500).match(/"username":"([^"]+)"/)?.[1] ?? null;
  }
  if (!creator) return null;

  let title = '';
  let alt = '';
  const ld = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/)?.[1];
  if (ld) {
    try {
      const data = JSON.parse(ld);
      if (!data.url || data.url.includes(id) || data.sharedContent?.url?.includes(id)) {
        title = data.headline || '';
        alt = data.articleBody || '';
      }
    } catch {
      /* no title, then */
    }
  }
  return { mine: creator.toLowerCase() === USER, title, alt };
}

/* Pinterest pads titles with search phrases after a bar, starts descriptions with the upload
   date, and fills empty ones with a slogan. Keep the words that were mine and the plain
   description of the picture. Safe to run on a pin more than once. */
function tidy(pin) {
  const title = undash(String(pin.title || '').split(' | ')[0]);
  let alt = String(pin.alt || '')
    .replace(/^\s*\d{1,2}-[A-Za-z]{3}-\d{4}\s*[–—,-]\s*/, '')
    .replace(/^\s*[A-Z][a-z]{2} \d{1,2}, \d{4}\s*[–—,-]\s*/, '');
  if (/^Discover \(and save!\)/i.test(alt)) alt = '';
  /* the full-size upload, for the large view on big screens */
  const full = pin.big ? pin.big.replace(/\/736x\//, '/originals/') : pin.full;
  return { ...pin, full, title, alt: undash(alt) };
}

async function main() {
  let existing = { pins: [], seen: {} };
  try {
    existing = { pins: [], seen: {}, ...JSON.parse(await readFile(OUT, 'utf8')) };
  } catch {
    /* first run */
  }
  /* files written before this script checked creators hold saves too; only trust checked pins */
  const seen = { ...existing.seen };
  const kept = existing.pins.filter((p) => seen[p.id] === 'mine');

  const xml = await get(FEED);
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  const fresh = [];
  for (const [, item] of items) {
    const url = item.match(/<link>(.*?)<\/link>/)?.[1];
    const id = url?.match(/\/pin\/(\d+)/)?.[1];
    const thumb = item.match(/https:\/\/i\.pinimg\.com\/[^&"<\s]+/)?.[0];
    const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
    if (!id || !thumb) continue;
    if (seen[id] === 'saved') continue;
    if (seen[id] === 'mine' && kept.some((p) => p.id === id)) continue;

    let info = null;
    try {
      info = await inspect(id);
    } catch (error) {
      console.warn(`pins: could not read pin ${id} (${error.message}); skipping it this time`);
    }
    if (!info) continue; /* unknown: leave it out and ask again next build */
    seen[id] = info.mine ? 'mine' : 'saved';
    if (!info.mine) continue;

    let size = null;
    try {
      size = jpegSize(await get(thumb, 'bytes'));
    } catch {
      /* size stays unknown; the page copes */
    }
    fresh.push({
      id,
      url,
      img: thumb.replace(/\/\d+x\//, '/474x/'),
      big: thumb.replace(/\/\d+x\//, '/736x/'),
      w: size?.w ?? null,
      h: size?.h ?? null,
      date: date ? new Date(date).toISOString().slice(0, 10) : null,
      title: info.title,
      alt: info.alt,
    });
  }

  const byId = new Map([...kept, ...fresh].map((p) => [p.id, p]));
  const pins = [...byId.values()].map(tidy).sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id.localeCompare(a.id)).slice(0, KEEP);
  if (!pins.length) throw new Error('found no pins I made');

  const saved = Object.values(seen).filter((v) => v === 'saved').length;
  const data = { user: USER, profile: PROFILE, created: CREATED, fetched: new Date().toISOString().slice(0, 10), pins, seen };
  await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`pins: ${pins.length} made by ${USER} (${fresh.length} new); ${saved} saved pins left out`);
}

main().catch(async (error) => {
  try {
    const existing = JSON.parse(await readFile(OUT, 'utf8'));
    console.warn(`pins: ${error.message}; keeping the ${existing.pins.length} already saved`);
  } catch {
    await writeFile(OUT, `${JSON.stringify({ user: USER, profile: PROFILE, created: CREATED, fetched: null, pins: [], seen: {} }, null, 2)}\n`);
    console.warn(`pins: ${error.message}; wrote an empty sheet`);
  }
});
