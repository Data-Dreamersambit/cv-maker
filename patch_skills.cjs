const fs = require('fs');
let content = fs.readFileSync('src/components/form/SkillsSection.jsx', 'utf8');

const oldPill = `<span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-200 text-xs font-medium group transition hover:bg-violet-500/25"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-violet-400 hover:text-slate-900 rounded-full p-0.5 group-hover:opacity-100 transition"
                title={\`Remove \${skill}\`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>`;

const newPill = `<span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-100 border border-violet-300 text-violet-800 text-xs font-medium group transition hover:bg-violet-200"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-violet-500 hover:text-violet-900 rounded-full p-0.5 group-hover:opacity-100 transition"
                title={\`Remove \${skill}\`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>`;

if (content.includes(oldPill)) {
  content = content.replace(oldPill, newPill);
  fs.writeFileSync('src/components/form/SkillsSection.jsx', content, 'utf8');
} else {
  console.log("Could not find exact pill block, using regex");
  const regex = /<span\s+key=\{index\}\s+className="inline-flex items-center gap-1\.5 px-3 py-1\.5 rounded-lg bg-violet-500\/15[^>]*>[\s\S]*?<\/span>/;
  content = content.replace(regex, newPill);
  fs.writeFileSync('src/components/form/SkillsSection.jsx', content, 'utf8');
}
