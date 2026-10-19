const { readFileSync } = require("node:fs");
const path = require("node:path");
const initSqlJs = require("sql.js");

const sqliteUuidDefault = `(
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' ||
  lower(substr(hex(randomblob(2)), 2, 3)) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) ||
  lower(substr(hex(randomblob(2)), 2, 3)) || '-' ||
  lower(hex(randomblob(6)))
)`;

const databasePromise = initSqlJs({
  locateFile: (file) => require.resolve(`sql.js/dist/${file}`),
}).then((SQL) => {
  const database = new SQL.Database();
  database.run("PRAGMA foreign_keys = ON");

  const schemaPath = path.join(__dirname, "../../init.sql");
  const schema = readFileSync(schemaPath, "utf8").replace(
    /^CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\s*/m,
    ""
  )
    .replace(/^(DROP TABLE IF EXISTS [^;]+)\s+CASCADE;/gim, "$1;")
    .replace(/REFERENCES public\.user_posts/gi, "REFERENCES user_posts")
    .replace(/DEFAULT uuid_generate_v1\(\)/gi, `DEFAULT ${sqliteUuidDefault}`)
    .replace(/DEFAULT now\(\)/gi, "DEFAULT CURRENT_TIMESTAMP");
  database.run(schema);
  return database;
});

async function query(sql, params = []) {
  const database = await databasePromise;
  const statement = database.prepare(sql);
  try {
    if (params.length > 0) {
      statement.bind(
        Object.fromEntries(
          params.map((value, index) => [
            `$${index + 1}`,
            value === undefined ? null : value,
          ])
        )
      );
    }

    const rows = [];
    while (statement.step()) rows.push(statement.getAsObject());

    const hasResultColumns = statement.getColumnNames().length > 0;
    return {
      rows,
      rowCount: hasResultColumns ? rows.length : database.getRowsModified(),
    };
  } finally {
    statement.free();
  }
}

async function end() {
  const database = await databasePromise;
  database.close();
}

module.exports = { query, end };