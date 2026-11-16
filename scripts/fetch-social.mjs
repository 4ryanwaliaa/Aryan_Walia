/* Pulls my public GitHub profile and latest YouTube uploads into components/social.json.
   Runs before every build (see "prebuild" in package.json), next to fetch-pins.mjs.
   Each source is fetched on its own: if one cannot be reached, its previous data is kept
   and the build carries on. Nothing here needs a key. */
import { readFile, writeFile } from 'node:fs/promises';

const HANDLE = '4ryanwalia';
const YT_CHANNEL = 'UC8rKbce-od5_5dnTTc2ugCg';
const OUT = new URL('../components/social.json', import.meta.url);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/* House rule: no em or en dashes in anything the site shows. */
const undash = (s) => s.replace(/\s*[–—]\s*/g, ', ').replace(/\s+/g, ' ').trim();

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

async function github() {
  const headers = { 'User-Agent': UA, Accept: 'application/vnd.github+json' };
  const [userRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${HANDLE}`, { headers }),
    fetch(`https://api.github.com/users/${HANDLE}/repos?sort=pushed&per_page=30`, { headers }),
  ]);
  if (!userRes.ok || !repoRes.ok) throw new Error(`github returned ${userRes.status}/${repoRes.status}`);
  const user = await userRes.json();
  const repos = (await repoRes.json())
    .filter((r) => !r.fork && r.name.toLowerCase() !== HANDLE.toLowerCase())
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      desc: undash(r.description || ''),
      lang: r.language || '',
      stars: r.stargazers_count,
      url: r.html_url,
      pushed: r.pushed_at ? r.pushed_at.slice(0, 10) : null,
    }));
  return {
    login: user.login,
    avatar: user.avatar_url,
    url: user.html_url,
    publicRepos: user.public_repos,
    since: user.created_at ? user.created_at.slice(0, 4) : null,
    repos,
  };
}

async function youtube() {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`youtube returned ${res.status}`);
  const xml = await res.text();
  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, e]) => {
      const id = e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const raw = decode(e.match(/<title>(.*?)<\/title>/)?.[1] || '');
      /* titles carry hashtags for Shorts; the page shows the words only */
      const title = undash(raw.replace(/#\S+/g, ''));
      const published = e.match(/<published>(.*?)<\/published>/)?.[1]?.slice(0, 10) || null;
      const short = /#/.test(raw);
      return id && title ? { id, title, published, short } : null;
    })
    .filter(Boolean);
  if (!videos.length) throw new Error('feed had no videos');
  return { channel: `https://www.youtube.com/@${HANDLE}`, videos: videos.slice(0, 12) };
}

async function main() {
  let prev = {};
  try {
    prev = JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    /* first run */
  }
  const out = { ...prev, handle: HANDLE, fetched: new Date().toISOString().slice(0, 10) };
  for (const [key, fn] of [
    ['github', github],
    ['youtube', youtube],
  ]) {
    try {
      out[key] = await fn();
      console.log(`social: ${key} ok`);
    } catch (err) {
      console.warn(`social: ${key} kept previous data (${err.message})`);
    }
  }
  await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`);
}

main();
