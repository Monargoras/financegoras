import { createPool } from 'mysql2' // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from 'kysely'
import { Database } from './databaseSchema'

const dialect = new MysqlDialect({
  pool: createPool({
    uri: process.env.DB_URL,
    connectionLimit: 10,
    // transform BIT(1) to boolean when reading from the database
    typeCast: (field, next) => {
      if (field.type === 'BIT' && field.length === 1) {
        return field.buffer()![0] === 1
      }
      return next()
    },
  }),
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
})
