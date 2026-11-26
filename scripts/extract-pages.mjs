import fs from 'fs';
import path from 'path';

const BASE_DIR = 'C:/Users/nimet/.gemini/antigravity/brain/b748ce15-c4ae-4455-af0b-0e56b6981985';

const PAGE_FILES = [
  { slug: 'home', route: '/', file: '.system_generated/steps/73/output.txt' },
  { slug: 'business-overview', route: '/business-overview', file: '.system_generated/steps/74/output.txt' },
  { slug: 'business-history-copy', route: '/business-history-copy', file: '.system_generated/steps/75/output.txt' },
  { slug: 'cgh', route: '/cgh', file: '.tempmediaStorage/snapshot_full_1795625740957.txt' },
  { slug: 'conley-cultural-collection', route: '/conley-cultural-collection', file: '.tempmediaStorage/snapshot_full_1795625676260.txt' },
  { slug: 'books', route: '/books', file: '.system_generated/steps/72/output.txt' },
  { slug: 'foreword', route: '/foreword', file: '.system_generated/steps/89/output.txt' },
  { slug: '1800-1820', route: '/1800-1820', file: '.system_generated/steps/90/output.txt' },
  { slug: '1820-1840', route: '/1820-1840', file: '.system_generated/steps/91/output.txt' },
  { slug: '1840-1860', route: '/1840-1860', file: '.system_generated/steps/92/output.txt' },
  { slug: '1860-1870', route: '/1860-1870', file: '.system_generated/steps/93/output.txt' },
  { slug: '1880-1890', route: '/1880-1890', file: '.system_generated/steps/94/output.txt' },
  { slug: 'conley-name', route: '/conley-name', file: '.system_generated/steps/95/output.txt' },
  { slug: 'triumph-from-tragedy', route: '/triumph-from-tragedy', file: '.system_generated/steps/96/output.txt' },
  { slug: 'secretary', route: '/secretary', file: '.tempmediaStorage/snapshot_full_1795625788977.txt' },
  { slug: 'benjamin-conley', route: '/benjamin-conley', file: '.system_generated/steps/110/output.txt' },
  { slug: 'benjamin-conley-ii', route: '/benjamin-conley-ii', file: '.system_generated/steps/111/output.txt' },
  { slug: 'binfordconley', route: '/binfordconley', file: '.system_generated/steps/112/output.txt' },
  { slug: 'booker-conley-feature', route: '/booker-conley-feature', file: '.system_generated/steps/113/output.txt' },
  { slug: 'catharine-conley-feature', route: '/catharine-conley-feature', file: '.system_generated/steps/114/output.txt' },
  { slug: 'charles-h-conley', route: '/charles-h-conley', file: '.system_generated/steps/115/output.txt' },
  { slug: 'charles-swinger-conley-feature', route: '/charles-swinger-conley-feature', file: '.system_generated/steps/116/output.txt' },
  { slug: 'coleman-conley', route: '/coleman-conley', file: '.system_generated/steps/117/output.txt' },
  { slug: 'dalton-conley', route: '/dalton-conley', file: '.tempmediaStorage/snapshot_full_1795625844309.txt' },
  { slug: 'earl-thomas-conley', route: '/earl-thomas-conley', file: '.system_generated/steps/131/output.txt' },
  { slug: 'edward-i-conley', route: '/edward-i-conley', file: '.system_generated/steps/132/output.txt' },
  { slug: 'hc-conley-feature', route: '/hc-conley-feature', file: '.system_generated/steps/133/output.txt' },
  { slug: 'james-conley', route: '/james-conley', file: '.system_generated/steps/134/output.txt' },
  { slug: 'james-wilson', route: '/james-wilson', file: '.system_generated/steps/135/output.txt' },
  { slug: 'larry-elder', route: '/larry-elder', file: '.system_generated/steps/136/output.txt' },
  { slug: 'michele-davis-macfarlane', route: '/michele-davis-macfarlane', file: '.system_generated/steps/137/output.txt' },
  { slug: 'mike-conley-sr', route: '/mike-conley-sr', file: '.system_generated/steps/138/output.txt' },
  { slug: 'mike-coney-jr', route: '/mike-coney-jr', file: '.tempmediaStorage/snapshot_full_1795625900382.txt' },
  { slug: 'naomi-dickerson', route: '/naomi-dickerson', file: '.system_generated/steps/154/output.txt' },
  { slug: 'paschal-coney-jr', route: '/paschal-coney-jr', file: '.system_generated/steps/155/output.txt' },
  { slug: 'vernon-baker', route: '/vernon-baker', file: '.system_generated/steps/156/output.txt' },
  { slug: 'rita-mack-feature', route: '/rita-mack-feature', file: '.system_generated/steps/157/output.txt' },
  { slug: 'roxanne-davis-greene-feature', route: '/roxanne-davis-greene-feature', file: '.system_generated/steps/158/output.txt' },
  { slug: 'sallie-conley', route: '/sallie-conley', file: '.system_generated/steps/159/output.txt' },
  { slug: 'sadie-knutson', route: '/sadie-knutson', file: '.system_generated/steps/160/output.txt' },
  { slug: 'sydney-alexandra-conley', route: '/sydney-alexandra-conley', file: '.system_generated/steps/161/output.txt' },
  { slug: 'willie-walter-pruitt-feature', route: '/willie-walter-pruitt-feature', file: '.system_generated/steps/162/output.txt' },
  { slug: 'valerie-conley-wood', route: '/valerie-conley-wood', file: '.system_generated/steps/163/output.txt' },
  { slug: 'contact-form', route: '/contact-form', file: '.tempmediaStorage/snapshot_full_1795625962960.txt' },
  { slug: 'conley-connections', route: '/conley-connections', file: '.system_generated/steps/204/output.txt' },
  { slug: 'arts-humanities', route: '/arts-humanities', file: '.system_generated/steps/210/output.txt' },
];

function extractJsonFromSnapshot(rawText, filePath) {
  const startMatch = rawText.match(/uid=\d+_1\s+"(\{[\s\S]*)/);
  if (!startMatch) {
    throw new Error(`Could not find JSON start in ${filePath}`);
  }
  let body = startMatch[1];
  // Find the last `}"` before `uid=\d+_\d+ form` or `</current_snapshot>`
  const endMatch = body.match(/(\n\})"[\r\n]+\s*(?:uid=\d+_\d+\s+form|<\/current_snapshot>|$)/);
  if (!endMatch) {
    const lastIdx = body.lastIndexOf('\n}"');
    if (lastIdx === -1) {
      throw new Error(`Could not find JSON end in ${filePath}`);
    }
    body = body.slice(0, lastIdx + 2);
  } else {
    const idx = body.lastIndexOf(endMatch[0]);
    body = body.slice(0, idx + 2);
  }
  // Stitch together 64KB chunked text nodes from Chrome accessibility tree: `" \n uid=XX_YY "`
  body = body.replace(/"\r?\n\s*uid=\d+_\d+\s+"/g, '');
  return JSON.parse(body);
}

const pagesData = {};

for (const entry of PAGE_FILES) {
  const fullPath = path.join(BASE_DIR, entry.file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const parsed = extractJsonFromSnapshot(raw, fullPath);
  pagesData[entry.slug] = {
    slug: entry.slug,
    route: entry.route,
    title: parsed.collection?.title || entry.slug,
    navigationTitle: parsed.collection?.navigationTitle || parsed.collection?.title || entry.slug,
    description: parsed.collection?.description || '',
    typeName: parsed.collection?.typeName || 'page',
    mainImage: parsed.collection?.mainImage?.assetUrl || null,
    mainContent: parsed.mainContent || '',
    items: (parsed.items || []).map((item) => ({
      id: item.id,
      title: item.title || '',
      body: item.body || '',
      assetUrl: item.assetUrl || '',
      originalSize: item.originalSize || '',
      filename: item.filename || '',
    })),
  };
  console.log(`Extracted ${entry.slug}: title="${pagesData[entry.slug].title}", contentLen=${pagesData[entry.slug].mainContent.length}, items=${pagesData[entry.slug].items.length}`);
}

const outDir = path.join(process.cwd(), 'src', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'pages.json'), JSON.stringify(pagesData, null, 2), 'utf8');
console.log(`Successfully wrote ${Object.keys(pagesData).length} pages to src/data/pages.json`);
