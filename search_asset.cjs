const https = require('https');
const fs = require('fs');

const queries = ['resume', 'document', 'paper stack', 'clipboard', 'notebook', 'notepad', 'sheet of paper'];

async function fetchSearch(q) {
  return new Promise((resolve, reject) => {
    https.get(`https://3dassets.dev/api/v1/assets?q=${encodeURIComponent(q)}&limit=10`, (res) => {
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

async function findAsset() {
  for (const q of queries) {
    const results = await fetchSearch(q);
    const valid = results.filter(r => 
      !r.slug.includes('briefcase') && 
      !r.slug.includes('bag') && 
      !r.slug.includes('suitcase') &&
      r.stats?.triangles < 20000
    );
    if (valid.length > 0) {
      console.log('FOUND:', JSON.stringify(valid[0], null, 2));
      return valid[0];
    }
  }
  console.log('NO ASSETS FOUND');
  return null;
}

findAsset();
