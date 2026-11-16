import { describe, expect, test } from "vitest";
import { formatSql, splitStatements, tokenizeSql } from "../../web-sql/js/modules/sql.js";
import { parseSchema } from "../../web-sql/js/modules/schema.js";

describe("tokenizeSql", () => {
    test("separa palabras, identificadores, números y operadores", () => {
        const tokens = tokenizeSql('select "total", precio >= 10.5 from ventas;');
        expect(tokens.map((token) => token.type)).toEqual([
            "word",
            "identifier",
            "punct",
            "word",
            "operator",
            "number",
            "word",
            "word",
            "punct",
        ]);
        expect(tokens[1].value).toBe('"total"');
        expect(tokens[4].value).toBe(">=");
    });

    test("conserva cadenas y comentarios completos", () => {
        const tokens = tokenizeSql("select 'hola; mundo' -- nota\nfrom dual");
        const string = tokens.find((token) => token.type === "string");
        const comment = tokens.find((token) => token.type === "comment");
        expect(string.value).toBe("'hola; mundo'");
        expect(comment.value).toBe("-- nota");
    });

    test("separa sentencias solo fuera de paréntesis", () => {
        const tokens = tokenizeSql("select count(*) from (select 1; select 2); select 3;");
        expect(splitStatements(tokens)).toHaveLength(2);
    });
});

describe("formatSql", () => {
    test("formatea SELECT, WHERE y ORDER BY", () => {
        const result = formatSql(
            "select u.id, u.nombre as nombre from usuarios u where u.activo = 1 and u.rol = 'admin' order by u.nombre asc;"
        );
        expect(result.output).toBe(
            [
                "SELECT",
                "  u.id,",
                "  u.nombre AS nombre",
                "FROM usuarios u",
                "WHERE u.activo = 1",
                "  AND u.rol = 'admin'",
                "ORDER BY u.nombre ASC;",
            ].join("\n")
        );
        expect(result.statements).toBe(1);
    });

    test("formatea CREATE TABLE con restricciones y tipos", () => {
        const result = formatSql(
            "create table if not exists pedidos (id integer primary key, usuario_id integer not null, total numeric(10,2) default 0, foreign key (usuario_id) references usuarios(id));"
        );
        expect(result.output).toBe(
            [
                "CREATE TABLE IF NOT EXISTS pedidos (",
                "  id INTEGER PRIMARY KEY,",
                "  usuario_id INTEGER NOT NULL,",
                "  total NUMERIC(10, 2) DEFAULT 0,",
                "  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)",
                ");",
            ].join("\n")
        );
    });

    test("formatea INSERT con columnas y VALUES", () => {
        const result = formatSql(
            "insert into usuarios (nombre, email) values ('Ana', 'ana@example.com');"
        );
        expect(result.output).toBe(
            ["INSERT INTO usuarios (nombre, email)", "VALUES ('Ana', 'ana@example.com');"].join(
                "\n"
            )
        );
    });

    test("formatea UPDATE con asignaciones y WHERE", () => {
        const result = formatSql(
            "update usuarios set nombre = 'Ana', email = 'ana@example.com' where id = 1;"
        );
        expect(result.output).toBe(
            [
                "UPDATE usuarios",
                "SET",
                "  nombre = 'Ana',",
                "  email = 'ana@example.com'",
                "WHERE id = 1;",
            ].join("\n")
        );
    });

    test("formatea JOIN y su condición ON", () => {
        const result = formatSql(
            "select p.id, u.nombre from pedidos p left join usuarios u on p.usuario_id = u.id;"
        );
        expect(result.output).toBe(
            [
                "SELECT",
                "  p.id,",
                "  u.nombre",
                "FROM pedidos p",
                "LEFT JOIN usuarios u",
                "  ON p.usuario_id = u.id;",
            ].join("\n")
        );
    });

    test("mantiene DISTINCT, funciones y GROUP BY", () => {
        const result = formatSql(
            "select distinct u.pais, count(*) as total from usuarios u group by u.pais having count(*) > 1;"
        );
        expect(result.output).toBe(
            [
                "SELECT DISTINCT",
                "  u.pais,",
                "  COUNT(*) AS total",
                "FROM usuarios u",
                "GROUP BY u.pais",
                "HAVING COUNT(*) > 1;",
            ].join("\n")
        );
    });

    test("separa varias sentencias con una línea en blanco", () => {
        expect(formatSql("select 1; select 2").output).toBe("SELECT\n  1;\n\nSELECT\n  2;");
    });

    test("respeta mayúsculas de identificadores entre comillas", () => {
        expect(formatSql('select "Nombre" as "Etiqueta" from "Usuarios";').output).toBe(
            'SELECT\n  "Nombre" AS "Etiqueta"\nFROM "Usuarios";'
        );
    });

    test("conserva comentarios iniciales y devuelve vacío sin SQL", () => {
        expect(formatSql("-- nota\nselect 1;").output).toBe("-- nota\nSELECT\n  1;");
        expect(formatSql("  \n ").output).toBe("");
        expect(formatSql("  \n ").statements).toBe(0);
    });
});

describe("parseSchema", () => {
    test("lee una clave foránea inline", () => {
        const schema = parseSchema(
            [
                "CREATE TABLE usuarios (id INTEGER PRIMARY KEY, email TEXT UNIQUE);",
                "CREATE TABLE pedidos (id INTEGER PRIMARY KEY, usuario_id INTEGER REFERENCES usuarios(id), total NUMERIC(10,2));",
            ].join("\n")
        );

        expect(schema.tables).toHaveLength(2);
        expect(schema.tables[0].columns[0]).toMatchObject({ name: "id", primaryKey: true });
        expect(schema.tables[0].columns[1]).toMatchObject({ name: "email", unique: true });
        expect(schema.tables[1].columns[2].type).toBe("NUMERIC(10, 2)");
        expect(schema.relations).toEqual([
            {
                fromTable: "pedidos",
                fromColumn: "usuario_id",
                toTable: "usuarios",
                toColumn: "id",
            },
        ]);
    });

    test("lee restricciones de tabla y clave primaria compuesta", () => {
        const schema = parseSchema(
            [
                "CREATE TABLE pedido_items (",
                "  pedido_id INT,",
                "  producto_id INT,",
                "  cantidad INT,",
                "  PRIMARY KEY (pedido_id, producto_id),",
                "  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),",
                "  FOREIGN KEY (producto_id) REFERENCES productos(id)",
                ");",
            ].join("\n")
        );

        const table = schema.tables[0];
        expect(table.columns.map((column) => column.primaryKey)).toEqual([true, true, false]);
        expect(table.columns.map((column) => column.foreignKey)).toEqual([true, true, false]);
        expect(schema.relations).toHaveLength(2);
        expect(schema.relations[0].toTable).toBe("pedidos");
    });

    test("normaliza identificadores entre comillas y esquemas", () => {
        const schema = parseSchema(
            'CREATE TABLE public."Usuarios" ("id" INTEGER PRIMARY KEY, "email" VARCHAR(120) NOT NULL);'
        );
        expect(schema.tables[0].name).toBe("public.Usuarios");
        expect(schema.tables[0].columns[0].name).toBe("id");
        expect(schema.tables[0].columns[1]).toMatchObject({
            name: "email",
            type: "VARCHAR(120)",
            notNull: true,
        });
    });

    test("ignora consultas y tablas sin columnas", () => {
        const schema = parseSchema(
            "SELECT * FROM usuarios; CREATE TABLE vacia (); CREATE TABLE real (id INT);"
        );
        expect(schema.tables.map((table) => table.name)).toEqual(["real"]);
        expect(schema.relations).toEqual([]);
    });

    test("no duplica relaciones y resuelve el nombre canónico", () => {
        const schema = parseSchema(
            [
                "CREATE TABLE usuarios (id INT PRIMARY KEY);",
                "CREATE TABLE pedidos (id INT, usuario_id INT, FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id));",
            ].join("\n")
        );
        expect(schema.relations).toHaveLength(1);
        expect(schema.relations[0].toTable).toBe("usuarios");
    });

    test("devuelve un esquema vacío sin CREATE TABLE", () => {
        expect(parseSchema("select now();")).toEqual({ tables: [], relations: [] });
    });
});
