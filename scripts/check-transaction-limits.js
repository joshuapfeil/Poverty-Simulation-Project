// Simple script to verify transaction amount bounds for the running server.
// Usage: node scripts/check-transaction-limits.js

const base = 'http://localhost:3000';

async function okFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  return res;
}

async function run() {
  console.log('Checking /families to get baseline...');
  const familiesRes = await okFetch(`${base}/families/`);
  const families = await familiesRes.json();
  const family = (families.data && families.data[0]) || null;
  if (!family) {
    console.error('No family records found for testing');
    process.exit(2);
  }

  const id = family.id;
  const originalBank = Number(family.bank_total || 0);
  console.log(`Using family id=${id}, original bank_total=${originalBank}`);

  const tests = [
    { name: 'deposit > 1000 rejected', endpoint: '/api/transactions/deposit', body: { family_id: id, amount: 1001 }, expectOk: false },
    { name: 'deposit negative rejected', endpoint: '/api/transactions/deposit', body: { family_id: id, amount: -5 }, expectOk: false },
    { name: 'deposit 1000 accepted', endpoint: '/api/transactions/deposit', body: { family_id: id, amount: 1000 }, expectOk: true },
    { name: 'withdraw > 1000 rejected', endpoint: '/api/transactions/withdraw', body: { family_id: id, amount: 1001 }, expectOk: false },
    { name: 'withdraw negative rejected', endpoint: '/api/transactions/withdraw', body: { family_id: id, amount: -10 }, expectOk: false },
  ];

  for (const t of tests) {
    process.stdout.write(`- ${t.name}... `);
    const res = await okFetch(`${base}${t.endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t.body) });
    const ok = res.ok;
    if (ok !== t.expectOk) {
      console.error(`FAILED (status ${res.status})`);
      const txt = await res.text().catch(() => null);
      console.error('Response body:', txt);
      process.exit(3);
    }
    console.log('OK');
  }

  // Restore bank_total if we changed it
  const after = await okFetch(`${base}/families/${id}`);
  if (after.ok) {
    const j = await after.json();
    const currentBank = Number((j.data && j.data[0] && j.data[0].bank_total) || 0);
    if (currentBank !== originalBank) {
      console.log(`Restoring original bank_total (${currentBank} -> ${originalBank})`);
      await okFetch(`${base}/families/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bank_total: originalBank }) });
    }
  }

  console.log('All checks passed');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
