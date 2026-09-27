# Ejercicios — 22.06 — Insercio  danimals

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
            throw new IllegalArgumentException("L'identificador no pot ser negatiu");
        }
        this.id = id;
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
        System.out.println("Creem les taules");
        zoo.creaTaulaAnimals();
        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();
        System.out.println("Introduïm categories amb una de repetida");
        Categoria peix = new Categoria("peix");
        zoo.afegeixCategoria(new Categoria("ocell"));
        zoo.afegeixCategoria(peix);
        zoo.afegeixCategoria(new Categoria("ocell"));
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("Afegim guppy amb " + peix);
        zoo.afegeixAnimal(new Animal("guppy", peix));
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("Afegim pardal dins d'una categoria coneguda");
        zoo.afegeixAnimal(new Animal("pardal", new Categoria("ocell")));
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("Afegim un animal d'una nova categoria");
        zoo.afegeixAnimal(new Animal("gat", new Categoria("mamífer")));
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

En aquest exercici ampliarem el nostre Zoo amb la possibilitat d'afegir nous animals.

Inserir un animal a la base de dades és una mica més laboriós que inserir una categoria. El problema és que per a poder inserir l'animal, ens caldrà disposar de l'identificador de la categoria i aquest només el tindrem si la categoria havia estat ja inserida.

Desenvoluparem el mètode afegeixAnimal() que rebrà una instància de Animal i l'afegirà a la base de dades si encara no hi era.

El mètode modificarà l'identificador de l'animal si finalment l'introdueix, i podrà generar l'excepció SQLException.

Considerarem que l'animal ja hi és a la base de dades si la instància disposa ja d'un id definit. Recorda el mètode idIndefinit(). Així, si afegeixAnimal() rep un animal amb identificador definit, no farà res.

Caldrà també que afegeixAnimal() consideri la categoria de l'animal a inserir.

Si la categoria de l'animal té l'identificador indefinit, poden passar dues coses:

la categoria és nova

És el cas en que no es troba a CATEGORIES cap entrada amb el nom de la categoria (recorda obteCategoriaPerNom())

En aquest cas caldrà primer inserir la nova categoria. A continuació obtindrem el id que li ha assignat el SGBD a la categoria, i finalment afegirem l'animal amb aquest id de categoria.

Cas categoria ja existent.

Si la base de dades ja conté una entrada amb la categoria de l'animal, obtindrem el seu identificador.

Un cop disposem de l'identificador de la categoria de l'animal, ja podem fer la inserció. Aquesta és molt similar a la que tenim a afegeixCategoria()

En aquesta primera versió de afegeixAnimal() la instància de Animal no veurà actualitzat el seu id.

El nou main() de UsaZoo per aquest exercici serà:

```java
public class UsaZoo {

    public static void main(String[] args) throws SQLException {

        Zoo zoo = new Zoo();

        System.out.print("Primer connectem amb la base de dades: ");

        zoo.connecta();

        System.out.println("connectat");

        System.out.println();

        System.out.println("Creem les taules");

        zoo.creaTaulaAnimals();

        System.out.println("Taules resultants: " + zoo.getNomTaules());

        System.out.println();

        System.out.println("Introduïm categories amb una de repetida");

        Categoria peix = new Categoria("peix");

        zoo.afegeixCategoria(new Categoria("ocell"));

        zoo.afegeixCategoria(peix);

        zoo.afegeixCategoria(new Categoria("ocell"));

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("Afegim guppy amb " + peix);

        zoo.afegeixAnimal(new Animal("guppy", peix));

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("Afegim pardal dins d'una categoria coneguda");

        zoo.afegeixAnimal(new Animal("pardal", new Categoria("ocell")));

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("Afegim un animal d'una nova categoria");

        zoo.afegeixAnimal(new Animal("gat", new Categoria("mamífer")));

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

**Creem les taules**
Taules resultants: ANIMALS, CATEGORIES

**Introduïm categories amb una de repetida**
Nombre de categories: 3
Categoria(id:1, ocell)
Categoria(id:3, ocell)
Categoria(id:2, peix)

**Afegim guppy amb Categoria(id:2, peix)**
Nombre de categories: 3
Categoria(id:1, ocell)
Categoria(id:3, ocell)
Categoria(id:2, peix)

**Afegim pardal dins d'una categoria coneguda**
Nombre de categories: 3
Categoria(id:1, ocell)
Categoria(id:3, ocell)
Categoria(id:2, peix)

**Afegim un animal d'una nova categoria**
Nombre de categories: 4
Categoria(id:4, mamífer)
Categoria(id:1, ocell)
Categoria(id:3, ocell)
Categoria(id:2, peix)

Finalment tanquem la connexió amb la base de dades: desconnectat

Pots comprovar que realment s'hagin afegit els animals que toquen fent:

**sqlite3 animals.bd 'select * from animals'**
1|guppy|2
2|pardal|1
3|gat|4

Pistes

El mètode afegeixAnimal() podria composar la sentència SQL de la següent manera:

String sql = String.format(

"INSERT INTO ANIMALS (nom, categoria) VALUES ('%s', '%d')",

animal.getNom(),

```java
        animal.getCategoria().getId());

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

    public void afegeixAnimal(Animal animal) throws SQLException {
        if (!animal.idIndefinit()) {
            return;
        }

        Categoria categoriaAnimal = animal.getCategoria();
        String nomCategoria = categoriaAnimal.getNom();

        if (categoriaAnimal.idIndefinit()) {
            Categoria cat = obteCategoriaPerNom(nomCategoria);

            if (cat == null) {
                afegeixCategoria(categoriaAnimal);
            } else {
                categoriaAnimal.setId(cat.getId());
            }
        }

        String sentencia = String.format("INSERT INTO ANIMALS (nom, categoria) VALUES ('%s', '%d')", animal.getNom(), animal.getCategoria().getId());

        Statement st = null;
        try {
            st = conn.createStatement();
            st.executeUpdate(sentencia);
            ResultSet rs = st.getGeneratedKeys();
            if (rs.next()) {
                int id = rs.getInt(1);
                animal.setId(id);
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
