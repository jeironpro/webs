# Ejercicios — 22.03 — Consulta de categories

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

        System.out.println("Creem la taula CATEGORIES");
        zoo.creaTaulaCategories();

        System.out.println();
        System.out.println("Mostrem les categories disponibles inicialment");
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        Categoria ocell = new Categoria("ocell");
        Categoria mamifer = new Categoria("mamífer");
        System.out.println();
        System.out.println("Inserim les categories: ");
        System.out.println("\t"+ ocell);
        System.out.println("\t"+ mamifer);
        zoo.afegeixCategoria(ocell);
        zoo.afegeixCategoria(mamifer);

        System.out.println();
        System.out.println("Mostrem les categories disponibles ara");
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("Consultem algunes categories");
        System.out.println("En consultar per la categoria ocell obtenim " + zoo.obteCategoriaPerNom("ocell"));
        System.out.println("En consultar per la categoria mamífer obtenim " + zoo.obteCategoriaPerNom("mamífer"));
        System.out.println("En consultar per la categoria peix obtenim " + zoo.obteCategoriaPerNom("peix"));

        System.out.print("Finalment tanquem la connexió amb la base de dades: ");
        zoo.desconnecta();
        System.out.println("desconnectat");
    }
}
```

## Zoo

**Enunciat**

En aquest exercici afegirem a Zoo la possibilitat de recuperar una categoria de la base de dades a partir del seu nom.

En concret, desenvoluparem el mètode Categoria obteCategoriaPerNom(String nom) que, donat un nom de categoria, retornarà la categoria corresponent o null si no es troba a la taula CATEGORIES.

Fixa't que pel disseny que tenim de la base de dades, podria haver més d'una entrada a CATEGORIES amb el mateix nom. En aquest cas, obteCategoriaPerNom() retornarà la categoria amb id més baix.

Podríem demanar tots els registres de categories amb aquest nom i quedar-nos només amb el primer. Estaria bé però malbarataríem recursos en obligar a transmetre dades que segur que no farem servir. Per evitar-ho, podem fer servir la clàusula LIMIT i limitar els resultats a 1.

La query per obtenir la categoria ocell podria ser SELECT id FROM CATEGORIES WHERE nom = 'ocell' ORDER BY id LIMIT 1;.

Per poder passar les proves d'aquest exercici, ens caldrà crear una nova classe anomenada ZooUtils on anirem afegint mètodes que ens facilitaran la interacció entre UsaZoo i Zoo. Per aquest exercici només haurem d'afegir el mètode mostraCategories() que rebrà una llista de categories i mostrarà els resultats per pantalla. Els detalls de la sortida es mostren més avall a la simulació d'execució.

També ens caldrà poder executar el següent UsaZoo:

```java
import java.sql.SQLException;

public class UsaZoo {

    public static void main(String[] args) throws SQLException {

        Zoo zoo = new Zoo();

        System.out.print("Primer connectem amb la base de dades: ");

        zoo.connecta();

        System.out.println("connectat");

        System.out.println("Creem la taula CATEGORIES");

        zoo.creaTaulaCategories();

        System.out.println();

        System.out.println("Mostrem les categories disponibles inicialment");

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        Categoria ocell = new Categoria("ocell");

        Categoria mamifer = new Categoria("mamífer");

        System.out.println();

        System.out.println("Inserim les categories: ");

        System.out.println("\t"+ ocell);

        System.out.println("\t"+ mamifer);

        zoo.afegeixCategoria(ocell);

        zoo.afegeixCategoria(mamifer);

        System.out.println();

        System.out.println("Mostrem les categories disponibles ara");

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("Consultem algunes categories");

        System.out.println("En consultar per la categoria ocell obtenim " + zoo.obteCategoriaPerNom("ocell"));

        System.out.println("En consultar per la categoria mamífer obtenim " + zoo.obteCategoriaPerNom("mamífer"));

        System.out.println("En consultar per la categoria peix obtenim " + zoo.obteCategoriaPerNom("peix"));

        System.out.print("Finalment tanquem la connexió amb la base de dades: ");

        zoo.desconnecta();

        System.out.println("desconnectat");

    }

}
```

En executar UsaZoo ens generarà el següent resultat:

**java UsaZoo**
Primer connectem amb la base de dades: connectat
Creem la taula CATEGORIES

**Mostrem les categories disponibles inicialment**
Cap categoria

**Inserim les categories**
Categoria(id:indefinit, ocell)
Categoria(id:indefinit, mamífer)

**Mostrem les categories disponibles ara**
Nombre de categories: 2
Categoria(id:2, mamífer)
Categoria(id:1, ocell)

**Consultem algunes categories**
En consultar per la categoria ocell obtenim Categoria(id:1, ocell)
En consultar per la categoria mamífer obtenim Categoria(id:2, mamífer)
En consultar per la categoria peix obtenim null
Finalment tanquem la connexió amb la base de dades: desconnectat

```java
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.LinkedList;

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

    public void afegeixCategoria(Categoria categoria) throws SQLException {
        String sentencia = String.format("INSERT INTO CATEGORIES (nom) VALUES ('%s')", categoria.getNom());

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
