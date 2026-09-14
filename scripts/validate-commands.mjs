import { commands } from '../src/data/commands.js';

const required = [
  'id','title','platform','tool','category','command','description','risk',
  'changesSystem','tags','attack','parameters','explanation','telemetry','notes'
];

const errors = [];
const warnings = [];
const ids = new Set();

for (const [index, c] of commands.entries()) {
  for (const key of required) {
    if (!(key in c)) errors.push(`#${index + 1} missing required field: ${key}`);
  }

  if (!c.id || typeof c.id !== 'string') errors.push(`#${index + 1} has invalid id`);
  if (ids.has(c.id)) errors.push(`duplicate command id: ${c.id}`);
  ids.add(c.id);

  for (const key of ['title','platform','tool','category','command','description','risk','notes']) {
    if (typeof c[key] !== 'string' || !c[key].trim()) {
      errors.push(`${c.id || `#${index + 1}`} has empty ${key}`);
    }
  }

  for (const key of ['tags','attack','parameters','explanation','telemetry']) {
    if (!Array.isArray(c[key])) errors.push(`${c.id} ${key} must be an array`);
  }

  if (c.notes && !/^https:\/\//.test(c.notes)) {
    warnings.push(`${c.id} notes link is not HTTPS: ${c.notes}`);
  }

  const placeholders = [...String(c.command).matchAll(/<([A-Z0-9_]+)>/g)].map(m => m[1]);
  const params = new Set((c.parameters || []).map(p => p.name));

  for (const p of placeholders) {
    if (!params.has(p)) {
      warnings.push(`${c.id} contains placeholder <${p}> without a matching parameter definition`);
    }
  }
}

console.log('Security Studio catalogue validation');
console.log(`Commands: ${commands.length}`);
console.log(`Unique IDs: ${ids.size}`);
console.log(`Warnings: ${warnings.length}`);

for (const w of warnings) console.warn(`WARN: ${w}`);

if (errors.length) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  console.error(`Validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log('Validation passed.');
