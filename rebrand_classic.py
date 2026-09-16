import re

with open('src/components/preview/templates/ClassicTemplate.jsx', 'r') as f:
    content = f.read()

# Hardcode white-violet theme (Phase 2)
# The prompt says ClassicTemplate is closest but needs to match sambit.me (violet)
content = content.replace('accentColor = \'slate\'', 'accentColor')
content = content.replace('text-slate-950', 'text-violet-700')
content = content.replace('text-slate-900', 'text-slate-800')
content = content.replace('border-slate-400', 'border-violet-200')
content = content.replace('border-slate-300', 'border-violet-200')

with open('src/components/preview/templates/ClassicTemplate.jsx', 'w') as f:
    f.write(content)
