const db_queries_entries = {
  getAllEntries: `SELECT * FROM entries`,

  getEntriesByEmail: `
    SELECT e.title, e.content, e.date, e.category,
           a.name, a.surname, a.email AS email_author, a.image
    FROM entries AS e
    INNER JOIN authors AS a
    ON e.id_author = a.id_author
    WHERE a.email = $1
    ORDER BY e.title`,

    // El AS email_author cambia el nombre de la columna email en la respuesta.
    // El README pide que se llame así, y también pide que no salga id_entry

  createEntry: `
    INSERT INTO entries (title, content, id_author, category)
    VALUES ($1, $2, (SELECT id_author FROM authors WHERE email = $3), $4)`,

  updateEntry: `
    UPDATE entries
    SET content = $2,
        id_author = (SELECT id_author FROM authors WHERE email = $3),
        category = $4
    WHERE title = $1`,
    // En updateEntry el título solo sirve para buscar (WHERE title = $1) y no se modifica.

  deleteEntry: `DELETE FROM entries WHERE title = $1`,

  deleteAllEntries: `DELETE FROM entries`,

  createTableEntries: `
    CREATE TABLE entries (
      id_entry serial NOT NULL PRIMARY KEY,
      title varchar(100) NOT NULL UNIQUE,
      content text NOT NULL,
      date date DEFAULT CURRENT_DATE,
      id_author int NOT NULL,
      category varchar(15),
      FOREIGN KEY (id_author) REFERENCES authors(id_author)
    )`,

// createTableEntries lleva el UNIQUE en el título, que es la tarea 1 del README,
// y dropTableEntries tiene IF EXISTS para que no falle si la tabla ya no está
// dropTableEntries: `DROP TABLE IF EXISTS entries`
};

module.exports = db_queries_entries;

// Los $1, $2, $3… son huecos. Al ejecutar la query,
// el modelo pasará los valores por separado, en ese orden.
// En createEntry: $1 = título, $2 = contenido, $3 = email del autor, $4 = categoría.