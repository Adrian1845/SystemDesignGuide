import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const ids = ['cache-aside-read', 'cache-freshness', 'seat-reservation-boundary'];
const revision = '2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c';
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const catalog = path.join(root, 'locale.es.json');

for (const id of ids) {
  const dir = path.join(root, id);
  const locales = {};
  for (const locale of ['en', 'es']) {
    const spec = path.join(dir, `spec.${locale}.json`);
    const artifact = path.join(dir, 'generated', `${id}.${locale}.html`);
    const finalRel = `final-${locale}-v2/${id}.${locale}.finalize.json`;
    const visualRel = `visual-${locale}-v2/${id}.${locale}.visual-check.json`;
    const final = read(path.join(dir, 'generated', finalRel));
    const visual = read(path.join(dir, 'generated', visualRel));
    const sourceSha256 = hash(spec);
    const artifactSha256 = hash(artifact);
    const validation = final.stages?.validate?.receipt?.validation;
    if (final.status !== 'pass' || Object.values(final.gates ?? {}).some((status) => status !== 'pass')) {
      throw new Error(`${id}/${locale}: final gates did not all pass`);
    }
    if (validation?.checksPassed !== 9 || validation?.checkCount !== 9 || validation.errors !== 0 || validation.warnings !== 0) {
      throw new Error(`${id}/${locale}: validation evidence is incomplete`);
    }
    if (final.specification.sha256 !== sourceSha256 || final.artifact.sha256 !== artifactSha256) {
      throw new Error(`${id}/${locale}: source or artifact hash differs from finalize receipt`);
    }
    if (visual.status !== 'pass' || visual.artifact?.sha256 !== artifactSha256) {
      throw new Error(`${id}/${locale}: visual-check does not match delivered artifact`);
    }
    if (locale === 'es' && JSON.stringify(read(spec).meta.translations) !== JSON.stringify(read(catalog))) {
      throw new Error(`${id}/${locale}: Spanish viewer catalog differs from pinned copy`);
    }
    locales[locale] = {
      source: `../spec.${locale}.json`,
      sourceSha256,
      sourceBytes: fs.statSync(spec).size,
      artifact: `${id}.${locale}.html`,
      artifactSha256,
      artifactBytes: fs.statSync(artifact).size,
      finalizeReceipt: finalRel,
      browserReceipt: `final-${locale}-v2/${id}.${locale}.browser-check.json`,
      visualReceipt: visualRel,
      ...(locale === 'es' ? {
        translationCatalog: '../../locale.es.json',
        translationCatalogSha256: hash(catalog)
      } : {})
    };
  }
  const receipt = {
    tool: 'archify',
    version: '3.0.1',
    checkout: revision,
    repository: 'https://github.com/tt-a1i/archify',
    diagramType: 'workflow',
    qualityProfile: 'showcase',
    validation: { checksPassed: 9, checkCount: 9, compositionStatus: 'pass', errors: 0, warnings: 0 },
    browserEvidence: { status: 'pass', source: 'finalize browser-check receipts' },
    visualEvidence: { status: 'pass', source: 'visual-check receipts', visualReview: 'separate' },
    visualReview: {
      status: 'pass-at-1440-light',
      captureViewports: ['1440x900'],
      themes: ['light'],
      observations: 'Inspected both localized captures: labels, nodes, relationships, legends, and outcome branches are readable without clipping. Other generated viewports and dark captures have automated visual-check evidence only.'
    },
    locales
  };
  fs.writeFileSync(path.join(dir, 'generated', 'archify-receipts.json'), JSON.stringify(receipt, null, 2) + '\n');
}
