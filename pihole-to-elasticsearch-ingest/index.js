import knex from 'knex'
import { Client } from '@elastic/elasticsearch'

const ELASTIC_URL = 'http://localhost:9200'
const DATABASE_PATH = './replace_with_pihole.db'

async function ingest() {
  const elasticsearchClient = new Client({
    node: ELASTIC_URL,
  })

  const { body: health } = await elasticsearchClient.cluster.health()

  if (health.status !== 'green') {
    throw new Error('Cluster health is not green')
  }

  const sqlClient = knex({
    client: 'sqlite',
    connection: {
      filename: DATABASE_PATH,
    },
    useNullAsDefault: true,
  })

  const tables = await sqlClient('sqlite_master').where('type', 'table')
  console.log(
    'Tables: ',
    tables.map((x) => x.name)
  )

  const queryCount = await sqlClient('queries').count()
  console.log('Query Count: ', queryCount)

  const countersCount = await sqlClient('counters').count()
  console.log('Counters Count: ', countersCount)

  const ftlCount = await sqlClient('counters').count()
  console.log('FTL Count: ', ftlCount)

  const networkAddressesCount = await sqlClient('network_addresses').count()
  console.log('Network Addresses Count: ', networkAddressesCount)

  // Clean up the connection
  elasticsearchClient.close()
}

ingest()
  .then(() => console.log('Ingest complete'))
  .catch((error) => console.error('Did not complete the Ingest: \n', error))
