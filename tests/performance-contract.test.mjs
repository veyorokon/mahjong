import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const sprite = await readFile(new URL('faces.png', root));

function check(name, fn) {
  fn();
  console.log(`ok - ${name}`);
}

check('the page has no render-blocking third-party dependencies', () => {
  assert.doesNotMatch(html, /(?:href|src)=["']https?:\/\//);
  assert.doesNotMatch(html, /url\(["']https?:\/\//);
  assert.match(html, /<link rel="preload" as="image" href="faces\.png" fetchpriority="high">/);
});

check('all tile faces share one compact 2x raster sprite', () => {
  assert.equal(sprite.toString('ascii', 1, 4), 'PNG');
  assert.equal(sprite.readUInt32BE(16), 840);
  assert.equal(sprite.readUInt32BE(20), 960);
  assert.ok(sprite.byteLength < 80 * 1024, `faces.png is ${sprite.byteLength} bytes`);
  assert.match(html, /background: url\("faces\.png"\) no-repeat/);
  assert.match(html, /background-size: 700% 600%/);
  assert.match(html, /const FACE_ORDER = \[/);
  assert.doesNotMatch(html, /<svg|createElementNS|\.innerHTML = FACE/);
});

check('fresh-deal motion is one board animation, never 144 tile animations', () => {
  assert.match(html, /#board\.deal-a/);
  assert.match(html, /#board\.deal-b/);
  assert.doesNotMatch(html, /\.tile\.deal/);
  assert.doesNotMatch(html, /animation-delay: var\(--d/);
  assert.doesNotMatch(html, /filter: drop-shadow/);
});

check('blocked tiles use a darker body without muting their face artwork', () => {
  assert.match(html, /linear-gradient\(160deg, #aaa99d, #96978b 52%, #85877c\)/);
  assert.doesNotMatch(html, /\.tile\.blocked \.face/);
  assert.doesNotMatch(html, /\.tile\.blocked[^}]*filter:/s);
});
