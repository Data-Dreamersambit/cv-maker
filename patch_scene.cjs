const fs = require('fs');
let content = fs.readFileSync('src/components/CvHeroScene.jsx', 'utf8');

// The new asset is quite flat on the Y axis, so we want to stand it up (rotate X ~70-80 deg) 
// and angle it slightly (rotate Y ~-20 deg) so it looks like a dynamic floating CV.
content = content.replace(
  /rotation=\{\[THREE\.MathUtils\.degToRad\(20\), THREE\.MathUtils\.degToRad\(-20\), 0\]\}/,
  'rotation={[THREE.MathUtils.degToRad(70), THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(10)]}'
);

// Tweak scale slightly up since it's 25cm, scale 5 makes it 1.25 units across
content = content.replace(/scale=\{4\}/, 'scale={5.5}');
content = content.replace(/position=\{\[0, -0\.3, 0\]\}/, 'position={[0, 0, 0]}');

fs.writeFileSync('src/components/CvHeroScene.jsx', content, 'utf8');
