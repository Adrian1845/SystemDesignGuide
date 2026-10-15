import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Run once when changing the authored cache diagrams, then validate and finalize
// both locales with the pinned Archify revision recorded in diagram.json.
const root = path.dirname(fileURLToPath(import.meta.url));
const spanishCatalog = JSON.parse(fs.readFileSync(path.join(root, 'locale.es.json'), 'utf8'));
const renderer = {
  name: 'archify', version: '3.0.1',
  revision: '2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c',
  qualityProfile: 'showcase', sourceSpecs: { en: 'spec.en.json', es: 'spec.es.json' }
};

const definitions = [
  {
    id: 'cache-aside-read',
    title: { en: 'Cache-aside: hit and miss', es: 'Cache-aside: acierto y fallo' },
    alt: {
      en: 'The application looks up a key in the cache. A valid hit returns immediately; a miss reads the source database, stores a copy with a TTL, and returns the value.',
      es: 'La aplicación busca una clave en la caché. Si encuentra una copia válida responde; si no, consulta la base de datos, guarda una copia con TTL y devuelve el dato.'
    },
    fallback: {
      en: 'With cache-aside, the application checks the cache first. A valid hit avoids a database read. On a miss, it reads the database, stores the result with an expiration policy, and replies. The database remains the source of truth; a cache hit can still be stale if invalidation is delayed.',
      es: 'Con cache-aside, la aplicación consulta primero la caché. Un acierto válido evita leer la base de datos. Ante un fallo, consulta la base de datos, guarda el resultado con una política de caducidad y responde. La base de datos sigue siendo la fuente de verdad; un acierto puede estar desactualizado si se retrasa la invalidación.'
    },
    lanes: [
      ['application', 'Application', 'Aplicación'],
      ['cache', 'Cache', 'Caché'],
      ['source', 'Source database', 'Base de datos origen']
    ],
    phases: [
      ['read', 'Read', 'Leer', 0, 1],
      ['branch', 'Hit or miss', 'Acierto o fallo', 2, 3],
      ['answer', 'Reply', 'Responder', 4, 5]
    ],
    nodes: [
      ['request', 'application', 0, 'frontend', 'Read request', 'Petición de lectura', 'key K', 'clave K'],
      ['lookup', 'cache', 1, 'database', 'Look up K', 'Buscar K', 'cached copy', 'copia en caché'],
      ['hit', 'cache', 3, 'database', 'Valid hit', 'Acierto válido', 'reuse cached value', 'usar la copia'],
      ['source', 'source', 3, 'database', 'Read source', 'Leer origen', 'on a miss', 'ante un fallo'],
      ['store', 'cache', 4, 'backend', 'Store with TTL', 'Guardar con TTL', 'bounded lifetime', 'vigencia limitada'],
      ['response', 'application', 5, 'frontend', 'Return value', 'Devolver dato', 'hit or fetched', 'copia u origen']
    ],
    edges: [
      ['request', 'lookup', 'check key', 'consultar clave', 'main'],
      ['lookup', 'hit', 'found', 'encontrada', 'branch'],
      ['hit', 'response', 'cached value', 'copia', 'branch'],
      ['lookup', 'source', 'missing or expired', 'ausente o caducada', 'main'],
      ['source', 'store', 'source value', 'valor original', 'main'],
      ['store', 'response', 'fresh value', 'dato actual', 'main']
    ],
    mainPath: ['request', 'lookup', 'source', 'store', 'response'],
    cards: [
      ['Database is authoritative', 'La base de datos es la autoridad',
        'A cache hit avoids an origin read but is only as fresh as its invalidation policy.',
        'Un acierto evita leer el origen, pero su frescura depende de la política de invalidación.'],
      ['TTL is a limit, not a promise', 'El TTL es un límite, no una promesa',
        'TTL bounds how long a copy may remain; it does not guarantee immediate consistency.',
        'El TTL limita la vigencia de una copia; no garantiza consistencia inmediata.']
    ]
  },
  {
    id: 'cache-freshness',
    title: { en: 'Two ways a cached copy becomes invalid', es: 'Dos formas de invalidar una copia en caché' },
    alt: {
      en: 'A write updates the source and invalidates the cached key. Separately, a cached key can expire at its TTL. In either case, a later read misses and reloads from the source.',
      es: 'Una escritura actualiza el origen e invalida la clave en caché. Por separado, la clave puede caducar al vencer el TTL. En ambos casos, una lectura posterior falla y recarga el dato del origen.'
    },
    fallback: {
      en: 'Two common freshness mechanisms are explicit invalidation after a source write and expiration at a TTL. Both make a subsequent cache lookup miss and fetch the source value again. Invalidation can be delayed or fail, and concurrent reads can race with writes, so strict consistency needs additional coordination.',
      es: 'Dos mecanismos habituales de frescura son la invalidación explícita tras escribir en el origen y la caducidad por TTL. Ambos hacen que una consulta posterior falle en caché y vuelva a obtener el dato del origen. La invalidación puede retrasarse o fallar, y las lecturas concurrentes pueden competir con las escrituras; la consistencia estricta requiere coordinación adicional.'
    },
    lanes: [
      ['write', 'Source write', 'Escritura en origen'],
      ['expiry', 'TTL expiry', 'Caducidad por TTL'],
      ['reload', 'Next read', 'Siguiente lectura']
    ],
    phases: [
      ['change', 'Change', 'Cambio', 0, 1],
      ['invalidate', 'Invalidate', 'Invalidar', 2, 3],
      ['refresh', 'Refresh on read', 'Recargar al leer', 4, 5]
    ],
    nodes: [
      ['edit', 'write', 0, 'frontend', 'Edit value', 'Editar dato', 'new version', 'nueva versión'],
      ['persist', 'write', 1, 'database', 'Commit to source', 'Persistir en origen', 'authoritative copy', 'copia autoritativa'],
      ['invalidate', 'write', 3, 'backend', 'Invalidate key', 'Invalidar clave', 'after the write', 'tras la escritura'],
      ['cached', 'expiry', 0, 'database', 'Cached copy', 'Copia en caché', 'has a TTL', 'tiene un TTL'],
      ['expires', 'expiry', 3, 'backend', 'TTL expires', 'Vence el TTL', 'entry no longer valid', 'entrada ya no válida'],
      ['miss', 'reload', 4, 'database', 'Cache miss', 'Fallo de caché', 'key absent or expired', 'clave ausente o caducada'],
      ['reload', 'reload', 5, 'database', 'Reload source', 'Recargar origen', 'store a fresh copy', 'guardar copia actualizada']
    ],
    edges: [
      ['edit', 'persist', 'write', 'escribir', 'main'],
      ['persist', 'invalidate', 'committed', 'persistido', 'main'],
      ['invalidate', 'miss', 'key removed', 'clave eliminada', 'main'],
      ['cached', 'expires', 'time passes', 'pasa el tiempo', 'branch'],
      ['expires', 'miss', 'entry expired', 'entrada caducada', 'branch'],
      ['miss', 'reload', 'cache-aside read', 'lectura cache-aside', 'main']
    ],
    mainPath: ['edit', 'persist', 'invalidate', 'miss', 'reload'],
    semanticRoots: ['edit', 'cached'],
    cards: [
      ['Explicit invalidation', 'Invalidación explícita',
        'After a committed source change, remove or update the matching cache key.',
        'Tras confirmar un cambio en el origen, elimina o actualiza la clave correspondiente.'],
      ['TTL and races', 'TTL y carreras',
        'Expiration limits staleness; delayed invalidation and concurrent reads still need a policy.',
        'La caducidad limita los datos viejos; las invalidaciones tardías y lecturas concurrentes requieren una política.']
    ]
  },
  {
    id: 'seat-reservation-boundary',
    title: { en: 'A cache lock is not the booking authority', es: 'Un bloqueo en caché no confirma una reserva' },
    alt: {
      en: 'A request tries an atomic, expiring cache hold. If it wins, the booking database still enforces unique seat ownership in a transaction; conflicts and failed transactions reject or release the hold.',
      es: 'Una petición intenta un bloqueo atómico y temporal en caché. Si lo consigue, la base de datos de reservas aún debe garantizar la asignación única del asiento en una transacción; los conflictos y fallos rechazan o liberan el bloqueo.'
    },
    fallback: {
      en: 'A short-lived atomic cache hold can reduce contention and give a user time to complete checkout. It is not a confirmed reservation. The booking database must enforce the seat uniqueness rule within a transaction. A hold conflict rejects the request; a database conflict or failure releases the hold. If the cache is lost or delayed, the database constraint still prevents two confirmed bookings for the same seat.',
      es: 'Un bloqueo atómico y temporal en caché puede reducir la contención y dar tiempo para terminar la compra. No es una reserva confirmada. La base de datos debe imponer la unicidad del asiento en una transacción. Un conflicto de bloqueo rechaza la petición; un conflicto o fallo de base de datos libera el bloqueo. Si falla la caché, la restricción de base de datos sigue impidiendo dos reservas confirmadas del mismo asiento.'
    },
    lanes: [
      ['application', 'Customer request', 'Petición del cliente'],
      ['cache', 'Temporary cache hold', 'Bloqueo temporal en caché'],
      ['database', 'Booking database', 'Base de datos de reservas']
    ],
    phases: [
      ['claim', 'Attempt hold', 'Intentar bloqueo', 0, 1],
      ['commit', 'Authoritative commit', 'Confirmación autoritativa', 2, 3],
      ['result', 'Outcome', 'Resultado', 4, 5]
    ],
    nodes: [
      ['request', 'application', 0, 'frontend', 'Select seat', 'Elegir asiento', 'one request', 'una petición'],
      ['hold', 'cache', 1, 'security', 'Atomic hold with TTL', 'Bloqueo atómico con TTL', 'temporary claim', 'retención temporal'],
      ['conflict', 'cache', 3, 'security', 'Hold conflict', 'Conflicto de bloqueo', 'another request holds it', 'otra petición lo retiene'],
      ['book', 'database', 2, 'database', 'Try booking transaction', 'Intentar transacción', 'unique seat constraint', 'asiento único'],
      ['committed', 'database', 4, 'database', 'Commit succeeds', 'Confirmación persistida', 'seat assigned once', 'asiento asignado una vez'],
      ['release', 'cache', 4, 'backend', 'Release hold', 'Liberar bloqueo', 'on failed commit', 'si falla la transacción'],
      ['reject', 'application', 4, 'frontend', 'Reject or retry', 'Rechazar o reintentar', 'no booking confirmed', 'sin reserva confirmada'],
      ['confirm', 'application', 5, 'frontend', 'Confirm booking', 'Confirmar reserva', 'only after commit', 'solo tras persistir']
    ],
    edges: [
      ['request', 'hold', 'attempt claim', 'intentar retener', 'main'],
      ['hold', 'book', 'hold acquired', 'bloqueo adquirido', 'main'],
      ['hold', 'conflict', 'already held', 'ya retenido', 'branch'],
      ['conflict', 'reject', 'no hold', 'sin bloqueo', 'branch'],
      ['book', 'committed', 'unique insert succeeds', 'alta única correcta', 'main'],
      ['committed', 'confirm', 'transaction committed', 'transacción confirmada', 'main'],
      ['book', 'release', 'conflict or failure', 'conflicto o fallo', 'branch'],
      ['release', 'reject', 'retry later', 'reintentar luego', 'branch']
    ],
    mainPath: ['request', 'hold', 'book', 'committed', 'confirm'],
    semanticTerminals: ['confirm', 'reject'],
    cards: [
      ['Cache coordinates briefly', 'La caché coordina temporalmente',
        'An atomic hold with a TTL reduces clashes but can expire or disappear.',
        'Un bloqueo atómico con TTL reduce choques, pero puede caducar o perderse.'],
      ['Database decides', 'La base de datos decide',
        'A transaction and uniqueness rule prevent two confirmed bookings for one seat.',
        'Una transacción y la regla de unicidad impiden confirmar dos reservas del mismo asiento.']
    ]
  }
];

function localize(def, locale) {
  const diagramPath = `diagrams/caches/${def.id}/generated/${def.id}.${locale}.html`;
  const nodes = def.nodes.map(([id, lane, col, type, en, es, subEn, subEs]) => ({
    id, lane, col, type, label: locale === 'es' ? es : en,
    sublabel: locale === 'es' ? subEs : subEn,
    width: 164
  }));
  const edges = def.edges.map(([from, to, en, es, role]) => ({
    id: `${from}-${to}`, from, to, label: locale === 'es' ? es : en,
    role, ...(role === 'branch' ? { variant: 'dashed' } : {})
  }));
  const spec = {
    schema_version: 2, diagram_type: 'workflow',
    meta: {
      title: def.title[locale], locale, output: diagramPath,
      quality_profile: 'showcase',
      legend: {
        mode: 'auto',
        entries: {
          frontend: { label: locale === 'es' ? 'Aplicación' : 'Application' },
          backend: { label: locale === 'es' ? 'Acción sobre caché' : 'Cache action' },
          database: { label: locale === 'es' ? 'Dato almacenado' : 'Stored data' },
          security: { label: locale === 'es' ? 'Bloqueo temporal' : 'Temporary hold' }
        }
      },
      ...(locale === 'es' ? { translations: spanishCatalog } : {})
    },
    lanes: def.lanes.map(([id, en, es]) => ({ id, label: locale === 'es' ? es : en })),
    phases: def.phases.map(([id, en, es, fromCol, toCol]) => ({
      id, label: locale === 'es' ? es : en, fromCol, toCol
    })),
    mainPath: def.mainPath,
    semanticChecks: {
      allowedRoots: def.semanticRoots ?? [def.nodes[0][0]],
      allowedTerminals: def.semanticTerminals ?? [def.nodes[def.nodes.length - 1][0]]
    },
    nodes, edges,
    cards: def.cards.map(([enTitle, esTitle, enItem, esItem], i) => ({
      dot: i === 0 ? 'cyan' : 'amber',
      title: locale === 'es' ? esTitle : enTitle,
      items: [locale === 'es' ? esItem : enItem]
    }))
  };
  return { spec, nodes };
}

for (const def of definitions) {
  const dir = path.join(root, def.id);
  fs.mkdirSync(dir, { recursive: true });
  const localized = {};
  for (const locale of ['en', 'es']) {
    const { spec, nodes } = localize(def, locale);
    fs.writeFileSync(path.join(dir, `spec.${locale}.json`), JSON.stringify(spec, null, 2) + '\n');
    localized[locale] = {
      title: def.title[locale], altText: def.alt[locale], fallback: def.fallback[locale],
      nodes: nodes.map(({ id, label }) => ({ id, label }))
    };
  }
  const record = {
    id: def.id, kind: 'workflow',
    artifact: `generated/${def.id}.en.html`,
    artifacts: { en: `generated/${def.id}.en.html`, es: `generated/${def.id}.es.html` },
    renderer, locales: localized,
    edges: def.edges.map(([from, to]) => ({ from, to }))
  };
  fs.writeFileSync(path.join(dir, 'diagram.json'), JSON.stringify(record, null, 2) + '\n');
}
