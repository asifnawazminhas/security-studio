import {commands} from '../src/data/commands.js';

const failures = [];
const noteUrls = new Set();

for (const c of commands) {
  if (!c.notes) {
    failures.push(`${c.id}: missing Notes URL`);
    continue;
  }
  try {
    const u = new URL(c.notes);
    if (u.protocol !== 'https:') failures.push(`${c.id}: Notes URL must use HTTPS`);
    if (u.hostname !== 'notes.asifnawazminhas.com') failures.push(`${c.id}: unexpected Notes hostname ${u.hostname}`);
    noteUrls.add(u.href);
  } catch {
    failures.push(`${c.id}: invalid Notes URL`);
  }
}

console.log(`Notes URLs checked: ${noteUrls.size}`);
if (failures.length) {
  failures.forEach(x => console.error(`ERROR: ${x}`));
  process.exit(1);
}
console.log('Static link audit passed.');
console.log('Note: live HTTP availability is intentionally not required for deterministic CI.');
