const https = require('https');

async function fetchSearch(q) {
  return new Promise((resolve, reject) => {
    https.get(`https://3dassets.dev/api/v1/assets?q=${encodeURIComponent(q)}&limit=20`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const all = [];
  for (const q of ['paper stack', 'clipboard', 'document', 'resume']) {
    const res = await fetchSearch(q);
    for (const r of res) {
      if (!all.find(x => x.slug === r.slug)) all.push(r);
    }
  }
  all.filter(r => r.stats.triangles < 20000).forEach(r => {
    console.log(`- ${r.title} (${r.slug}): ${r.stats.triangles} tris, ${r.cdnUrl}`);
  });
}

run();
