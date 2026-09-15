import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  path.join(root,'src','main.jsx'),
  path.join(root,'src','styles.css'),
  path.join(root,'index.html')
];

const source = files.map(file => fs.readFileSync(file,'utf8')).join('\n');
const failures = [];
const warnings = [];

const forbidden = [
  ['dangerouslySetInnerHTML', /dangerouslySetInnerHTML/],
  ['eval()', /\beval\s*\(/],
  ['new Function()', /\bnew\s+Function\s*\(/],
  ['javascript: literal', /["'`]javascript:/i],
  ['file upload input', /type\s*=\s*["']file["']/i]
];

for (const [label, rx] of forbidden) {
  if (rx.test(source)) failures.push(label);
}

if (!/Content-Security-Policy/.test(fs.readFileSync(path.join(root,'index.html'),'utf8'))) {
  failures.push('Content Security Policy missing');
}

const main = fs.readFileSync(path.join(root,'src','main.jsx'),'utf8');
const noteAnchors = [...main.matchAll(/<a[^>]+href=(?:"https:\/\/notes\.asifnawazminhas\.com[^"]*"|\{[^}]*notes[^}]*\})[^>]*>/gi)];
for (const match of noteAnchors) {
  if (!/target="_blank"/.test(match[0]) || !/rel="noopener noreferrer"/.test(match[0])) {
    failures.push(`Notes link missing safe new-tab attributes: ${match[0].slice(0,120)}`);
  }
}

if (!/AppErrorBoundary/.test(main)) failures.push('React Error Boundary missing');
if (!/migrateStorage\(\)/.test(main)) failures.push('Storage migration invocation missing');

if (failures.length) {
  console.error('Source audit failed:');
  failures.forEach(x => console.error(` - ${x}`));
  process.exit(1);
}

console.log('Source audit passed.');
warnings.forEach(x => console.warn(`WARN: ${x}`));
