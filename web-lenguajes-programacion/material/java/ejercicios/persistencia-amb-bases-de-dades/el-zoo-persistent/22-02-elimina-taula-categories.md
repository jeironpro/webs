# Ejercicios — 22.02 — Elimina taula CATEGORIES

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
        if (id < 0) {
            throw new IllegalArgumentException("L'identificador ha de ser positiu");
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

        System.out.println("Eliminem la taula CATEGORIES per si existia");
        zoo.eliminaTaulaCategories();

        System.out.println("Creem la taula CATEGORIES (primer cop)");
        zoo.creaTaulaCategories();

        System.out.println("Eliminem la taula CATEGORIES");
        zoo.eliminaTaulaCategories();

        System.out.println("Creem la taula CATEGORIES (segon cop)");
        zoo.creaTaulaCategories();

        System.out.println("Creem la taula CATEGORIES (tercer cop)");
        zoo.creaTaulaCategories();

        System.out.print("Finalment tanquem la connexió amb la base de dades: ");
        zoo.desconnecta();
        System.out.println("desconnectat");
    }
}
```

## Zoo

**Enunciat**

Implementa el mètode Zoo.eliminaTaulaCategories() de manera que elimini la taula CATEGORIES si existeix, i no faci res en cas contrari.

Modifica el mètode Zoo.creaTaulaCategories() de manera que abans de crear la taula, la elimini si ja existia.

El resultat haurà de permetre que funcioni el següent codi:

```java
import java.sql.SQLException;

public class UsaZoo {

    public static void main(String[] args) throws SQLException {

        Zoo zoo = new Zoo();

        System.out.print("Primer connectem amb la base de dades: ");

        zoo.connecta();

        System.out.println("connectat");

        System.out.println("Eliminem la taula CATEGORIES per si existia");

        zoo.eliminaTaulaCategories();

        System.out.println("Creem la taula CATEGORIES (primer cop)");

        zoo.creaTaulaCategories();

        System.out.println("Eliminem la taula CATEGORIES");

        zoo.eliminaTaulaCategories();

        System.out.println("Creem la taula CATEGORIES (segon cop)");

        zoo.creaTaulaCategories();

        System.out.println("Creem la taula CATEGORIES (tercer cop)");

        zoo.creaTaulaCategories();

        System.out.print("Finalment tanquem la connexió amb la base de dades: ");

        zoo.desconnecta();

        System.out.println("desconnectat");

    }

}
```

Que haurà de generar la següent sortida:

**java UsaZoo**
Primer connectem amb la base de dades: connectat
Eliminem la taula CATEGORIES per si existia
Creem la taula CATEGORIES (primer cop)
Eliminem la taula CATEGORIES
Creem la taula CATEGORIES (segon cop)
Creem la taula CATEGORIES (tercer cop)
Finalment tanquem la connexió amb la base de dades: desconnectat

```java
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.SQLException;

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

    public void eliminaTaulaCategories() throws SQLException {
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
}
```
