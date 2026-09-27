# Ejercicios — 22.04 — Recuperar lidentificador

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
        System.out.println("Un cop inserides les categories queden: ");
        System.out.println("\t"+ ocell);
        System.out.println("\t"+ mamifer);

        System.out.println();
        System.out.println("Mostrem les categories disponibles finalment");
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.print("Finalment tanquem la connexió amb la base de dades: ");
        zoo.desconnecta();
        System.out.println("desconnectat");
    }
}
```

## Zoo

**Enunciat**

Si recordes el mètode afegeixCategoria() que es proposa als apunts, teníem:

```java
public void afegeixCategoria(Categoria categoria) throws SQLException {
```

String sql = String.format(

"INSERT INTO CATEGORIES (nom) VALUES ('%s')",

```java
            categoria.getNom());

    Statement st = null;

    try {

        st = conn.createStatement();

        st.executeUpdate(sql);

    } finally {

        if (st != null) {

            st.close();

        }

    }

}
```

Aquest mètode està prou bé però presenta un problema: a partir del moment que introduïm una categoria a la base de dades, el seu identificador ja pot ser conegut.

Malauradament, tal i com tenim codificat afegeixCategoria(), la instància de Categoria que hem afegit continua tenint el mateix id desconegut. Com ho podríem resoldre?

A l'exercici anterior hem creat el mètode obteCategoriaPerNom() que ens permet recuperar una categoria un cop introduïda a la base de dades. Podem simplement modificar el id de la categoria per aquest i ja està.

La definició de la classe Categoria no disposa de setter així que li haurem d'afegir. Assegura't que controles el cas que el valor rebut no sigui adequat de manera que sigui coherent amb el constructor.

El següent UsaZoo et permetrà comprovar si has fet el que s'esperava.

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

        System.out.println("Un cop inserides les categories queden: ");

        System.out.println("\t"+ ocell);

        System.out.println("\t"+ mamifer);

        System.out.println();

        System.out.println("Mostrem les categories disponibles finalment");

        ZooUtils.mostraCategories(zoo.recuperaCategories());

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
Creem la taula CATEGORIES

**Mostrem les categories disponibles inicialment**
Cap categoria

**Inserim les categories**
Categoria(id:indefinit, ocell)
Categoria(id:indefinit, mamífer)

**Un cop inserides les categories queden**
Categoria(id:1, ocell)
Categoria(id:2, mamífer)

**Mostrem les categories disponibles finalment**
Nombre de categories: 2
Categoria(id:2, mamífer)
Categoria(id:1, ocell)
Finalment tanquem la connexió amb la base de dades: desconnectat

Fixa't que la secció que mostra les categories un cop inserides, ara sí mostra els identificadors.
Ampliació

Potser t'ha semblat una mica pobre la manera en que hem hagut de recuperar l'identificador? Et proposo una manera alternativa i, probablement més adequada: fent servir el mètode getGeneratedKeys() de Statement.

El fragment de codi que caldrà afegir a afegeixCategoria() és, un cop executada la comanda d'inserció:

```java
ResultSet rs = st.getGeneratedKeys();

rs.next();

int id = rs.getInt(1);
```

En breu, aquest codi obté un ResultSet amb els identificadors que ha generat el SGBD en la seva darrera inserció i extrau el primer d'ells. Com que la nostra comanda d'inserció només insereix una categoria cada cop, només haurà d'haver-hi un d'identificador.

Si et ve de gust, pots fer servir aquesta opció en comptes de la versió cutre de cridar obteCategoriaPerNom(). Les proves de l'exercici no es queixaran.

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
