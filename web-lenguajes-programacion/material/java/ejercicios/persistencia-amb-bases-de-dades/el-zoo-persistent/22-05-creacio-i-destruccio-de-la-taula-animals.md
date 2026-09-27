# Ejercicios — 22.05 — Creacio i destruccio de la taula ANIMALS

## Animal

```java
public class Animal {
    private int id = -1;
    private String nom;
    private Categoria categoria;

    public Animal(String nom, Categoria categoria) {
        if (nom == null || nom.isBlank()) {
            throw new IllegalArgumentException("El nom no pot ser null");
        }
        if (categoria == null) {
            throw new IllegalArgumentException("La categoria no pot ser null");
        }
        this.nom = nom;
        this.categoria = categoria;
    }

    public Animal(int id, String nom, Categoria categoria) {
        this(nom, categoria);
        if (id < 0) {
            throw new IllegalArgumentException("L'identificador no pot ser negatiu");
        }
        this.id = id;
    }

    public boolean idIndefinit() {
        return id < 0;
    }

    public int getId() {
        if (idIndefinit()) {
            throw new UnsupportedOperationException("L'identificador no està disponible");
        }
        return id;
    }

    public String getNom() {
        return nom;
    }

    public Categoria getCategoria() {
        return categoria;
    }
}
```

## Categoria

```java
public class Categoria {
    private int id = -1;
    private String nom;

    public Categoria(String nom) {
        if (nom == null || nom.isBlank()) {
            throw new IllegalArgumentException("El nom no pot ser null");
        }
        this.nom = nom;
    }

    public Categoria(int id, String nom) {
        this(nom);
        setId(id);
    }

    public boolean idIndefinit() { 
        return id < 0;
    }

    public int getId() {
        if (idIndefinit()) {
            throw new UnsupportedOperationException("L'identificador no està disponible");
        }
        return id;
    }

    public void setId(int id) {
        if (id < 0) {
            throw new IllegalArgumentException("L'identificador ha de ser positiu");
        }
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    @Override
    public String toString() {
        return String.format("Categoria(id:%s, %s)", (id < 0 ? "indefinit": id), nom);
    }
}
```

## UsaZoo

```java
import java.sql.SQLException;

public class UsaZoo {
    public static void main(String[] args) throws SQLException {
        Zoo zoo = new Zoo();

        System.out.print("Primer connectem amb la base de dades: ");
        zoo.connecta();
        System.out.println("connectat");

        System.out.println();
        System.out.println("Creació en l'ordre correcte");
        System.out.println("===========================");
        System.out.println("L'ordre correcte és primer eliminar ANIMALS, després CATEGORIES, a continuació crear CATEGORIES i finalment ANIMALS");
        zoo.eliminaTaulaAnimals();
        zoo.eliminaTaulaCategories();
        zoo.creaTaulaCategories();
        zoo.creaTaulaAnimals();
        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();
        System.out.println("Eliminació de ANIMALS");
        System.out.println("=====================");
        System.out.println("Eliminar la taula ANIMALS no ha d'afectar a CATEGORIES");
        zoo.eliminaTaulaAnimals();
        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();
        System.out.println("Creació de ANIMALS");
        System.out.println("==================");
        System.out.println("Quan no hi ha la taula CATEGORIES, es crearà per poder crear ANIMALS");
        zoo.eliminaTaulaCategories();
        zoo.creaTaulaAnimals();
        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();
        System.out.println("Eliminació de CATEGORIES");
        System.out.println("========================");
        System.out.println("Quan hi són les taules CATEGORIES i ANIMALS, en eliminar CATEGORIES s'eliminarà ANIMALS");
        zoo.eliminaTaulaCategories();
        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();
        System.out.print("Finalment tanquem la connexió amb la base de dades: ");
        zoo.desconnecta();
        System.out.println("desconnectat");
    }
}
```

## Zoo

**Enunciat**

En aquest exercici afegirem la classe Animal i la taula ANIMALS.

Per la classe probablement no tindràs gaire dificultat. Assegura't que, com a mínim ofereixes getters per totes les propietats d'un Animal, és a dir id, nom i categoria. Per altra banda, caldrà que ofereixis dos constructors específics:

Animal(String nom, Categoria categoria)

Animal(int id, String nom, Categoria categoria)

El funcionament dels dos serà molt similar al dels corresponents que tenim per Categoria. A banda d'assegurar que no acceptem un id negatiu ni un nom null o buit, també haurem de comprovar que no ens passen una categoria nul·la. En cas que es detecti alguna d'aquestes situacions, els constructors llençaran una IllegalArgumentException amb el missatge "El nom no pot ser null ni blanc" i "La categoria no pot ser null".

A banda, com a Categoria, el mètode getId() només estarà disponible quan l'identificador no sigui indefinit. Per poder-ho consultar, oferirem també idIndefinit().

En el cas de la classe Zoo, hi afegirem els següents mètodes:

creaTaulaAnimals()

eliminaTaulaAnimals()

Aquests mètodes són molt semblants als corresponents de la taula CATEGORIES.

Abans que comencis a fer copy&paste, deixa'm que t'avisi de quelcom que has de tenir present: per crear la taula ANIMALS cal que estigui creada abans la taula CATEGORIES. De la mateixa manera, per eliminar la taula CATEGORIES primer cal eliminar la taula ANIMALS.

Malgrat sqlite no ens donarà suport per defecte a la integritat referencial, és important que aprenguem a fer-ho bé. Per aquesta raó, els tests d'aquest exercici intentaran no deixar-te passar solucions que no respectin la integritat referencial.

Així, el mètode eliminaTaulaCategories() haurà d'eliminar primer la taula d'animals, i el mètode creaTaulaAnimals() haurà de crear primer la taula de categories.

Per executar correctament el test d'aquest exercici, et caldrà afegir a Zoo el següent mètode:

retorna el nom de les taules definides a la bd

```java
public String getNomTaules() throws SQLException {
```

String sql = "SELECT name FROM sqlite_schema " +

"WHERE name NOT LIKE 'sqlite%' " +

```java
                 "ORDER BY name";

    List<String> taules = new ArrayList<>();

    try (Statement st = conn.createStatement()) {

        ResultSet rs = st.executeQuery(sql);

        while (rs.next()) { taules.add(rs.getString("name")); }

        rs.close();

    }

    return taules.size() > 0 ? String.join(", ", taules) : "cap";

}
```

El mètode getNomTaules() retorna un String amb el nom de les taules definides a la base de dades. No cal que entenguis com ho fa. Si tens curiositat, revisa aquesta documentació de sqlite i la sentència try-with-resources.

Un cop hagis incorporat el mètode Zoo.getNomTaules(), caldrà que el següent codi funcioni:

```java
import java.sql.SQLException;

public class UsaZoo {

    public static void main(String[] args) throws SQLException {

        Zoo zoo = new Zoo();

        System.out.print("Primer connectem amb la base de dades: ");

        zoo.connecta();

        System.out.println("connectat");

        System.out.println();

        System.out.println("Creació en l'ordre correcte");

        System.out.println("===========================");

        System.out.println("L'ordre correcte és primer eliminar ANIMALS, després CATEGORIES, a continuació crear CATEGORIES i finalment ANIMALS");

        zoo.eliminaTaulaAnimals();

        zoo.eliminaTaulaCategories();

        zoo.creaTaulaCategories();

        zoo.creaTaulaAnimals();

        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();

        System.out.println("Eliminació de ANIMALS");

        System.out.println("=====================");

        System.out.println("Eliminar la taula ANIMALS no ha d'afectar a CATEGORIES");

        zoo.eliminaTaulaAnimals();

        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();

        System.out.println("Creació de ANIMALS");

        System.out.println("==================");

        System.out.println("Quan no hi ha la taula CATEGORIES, es crearà per poder crear ANIMALS");

        zoo.eliminaTaulaCategories();

        zoo.creaTaulaAnimals();

        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();

        System.out.println("Eliminació de CATEGORIES");

        System.out.println("========================");

        System.out.println("Quan hi són les taules CATEGORIES i ANIMALS, en eliminar CATEGORIES s'eliminarà ANIMALS");

        zoo.eliminaTaulaCategories();

        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();

        System.out.print("Finalment tanquem la connexió amb la base de dades: ");

        zoo.desconnecta();

        System.out.println("desconnectat");

    }

}
```

La sortida esperada és:

**java UsaZoo**
Primer connectem amb la base de dades: connectat

**Creació en l'ordre correcte**
===========================
L'ordre correcte és primer eliminar ANIMALS, després CATEGORIES, a continuació crear CATEGORIES i finalment ANIMALS
Taules resultants: ANIMALS, CATEGORIES

**Eliminació de ANIMALS**
=====================
Eliminar la taula ANIMALS no ha d'afectar a CATEGORIES
Taules resultants: CATEGORIES

**Creació de ANIMALS**
==================
Quan no hi ha la taula CATEGORIES, es crearà per poder crear ANIMALS
Taules resultants: ANIMALS, CATEGORIES

**Eliminació de CATEGORIES**
========================
Quan hi són les taules CATEGORIES i ANIMALS, en eliminar CATEGORIES s'eliminarà ANIMALS
Taules resultants: cap

Finalment tanquem la connexió amb la base de dades: desconnectat

```java
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.LinkedList;
import java.util.ArrayList;

public class Zoo {
    private static final String NOM_BASE_DE_DADES = "animals.bd";
    private static final String CADENA_DE_CONNEXIO = "jdbc:sqlite:" + NOM_BASE_DE_DADES;

    private Connection conn = null;

    public void connecta() throws SQLException {
        if (conn != null) {
            return;
        }
        conn = DriverManager.getConnection(CADENA_DE_CONNEXIO);
    }

    public void desconnecta() throws SQLException {
        if (conn == null) {
            return;
        }
        conn.close();
        conn = null;
    }

    public void creaTaulaCategories() throws SQLException {
        eliminaTaulaCategories();
        String sentencia = "CREATE TABLE CATEGORIES(" +
                           "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                           "nom VARCHAR(40))";

        Statement st = null;
        try {
            st = conn.createStatement();
            st.executeUpdate(sentencia);
        } finally {
            if (st != null) {
                st.close();
            }
        }
    }

    public void creaTaulaAnimals() throws SQLException {
        creaTaulaCategories();
        String sentencia = "CREATE TABLE ANIMALS(" +
                           "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                           "nom VARCHAR(40)," +
                           "categoria INTEGER," +
                           "FOREIGN KEY(categoria) REFERENCES CATEGORIES(id))";

        Statement st = null;
        try {
            st = conn.createStatement();
            st.executeUpdate(sentencia);
        } finally {
            if (st != null) {
                st.close();
            }
        }
    }

    public void eliminaTaulaCategories() throws SQLException {
        eliminaTaulaAnimals();
        String sentencia = "DROP TABLE IF EXISTS CATEGORIES";

        Statement st = null;
        try {
            st = conn.createStatement();
            st.executeUpdate(sentencia);
        } finally {
            if (st != null) {
                st.close();
            }
        }
    }

    public void eliminaTaulaAnimals() throws SQLException {
        String sentencia = "DROP TABLE IF EXISTS ANIMALS";

        Statement st = null;
        try {
            st = conn.createStatement();
            st.executeUpdate(sentencia);
        } finally {
            if (st != null) {
                st.close();
            }
        }
    }

    public void afegeixCategoria(Categoria categoria) throws SQLException {
        String sentencia = String.format("INSERT INTO CATEGORIES (nom) VALUES ('%s')", categoria.getNom());

        Statement st = null;
        try {
            st = conn.createStatement();
            st.executeUpdate(sentencia);
            ResultSet rs = st.getGeneratedKeys();
            if (rs.next()) {
                int id = rs.getInt(1);
                categoria.setId(id);
            }
        } finally {
            if (st != null) {
                st.close();
            }
        }
    }

    public Categoria obteCategoriaPerNom(String nom) throws SQLException {
        String sentencia = String.format("SELECT id FROM CATEGORIES WHERE nom = '%s' ORDER BY id LIMIT 1", nom);

        Statement st = null;
        try {
            st = conn.createStatement();
            ResultSet rs = st.executeQuery(sentencia);
            if (rs.next()) {
                int id = rs.getInt("id");
                return new Categoria(id, nom);
            }
            return null;
        } finally {
            if (st != null) {
                st.close();
            }
        }
    }

    public List<Categoria> recuperaCategories() throws SQLException {
        String sentencia = "SELECT * FROM CATEGORIES ORDER BY nom";

        Statement st = null;
        try {
            st = conn.createStatement();
            ResultSet rs = st.executeQuery(sentencia);

            List<Categoria> categories = new LinkedList<>();
            while (rs.next()) {
                int bdId = rs.getInt("id");
                String nom = rs.getString("nom");
                Categoria categoria = new Categoria(bdId, nom);
                categories.add(categoria);
            }
            rs.close();
            return categories;
        } finally {
            if (st != null) {
                st.close();
            }
        }
    }

    public String getNomTaules() throws SQLException {
        String sentencia = "SELECT name FROM sqlite_schema " +
                    "WHERE name NOT LIKE 'sqlite%' " +
                    "ORDER BY name";

        List<String> taules = new ArrayList<>();
        try (Statement st = conn.createStatement()) {
            ResultSet rs = st.executeQuery(sentencia);
            while (rs.next()) { taules.add(rs.getString("name")); }
            rs.close();
        }
        return taules.size() > 0 ? String.join(", ", taules) : "cap";
    }
}
```

## ZooUtils

```java
import java.util.List;

public class ZooUtils {
    public static void mostraCategories(List<Categoria> categories) {
        int longitud = categories.size();
        System.out.printf("%s%n", (longitud > 0 ? "Nombre de categories: " + longitud: "Cap categoria"));
        for (Categoria categoria: categories) {
            System.out.println("\t" + categoria);
        }
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-2205creacioidestrucciodelataulaanimals.png
:alt: Diagrama UML
```
