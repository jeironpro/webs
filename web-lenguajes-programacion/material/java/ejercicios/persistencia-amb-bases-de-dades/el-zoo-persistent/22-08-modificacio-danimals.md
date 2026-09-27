# Ejercicios — 22.08 — Modificacio danimals

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

    @Override
    public String toString() {
        return String.format("Animal(id:%s, %s, %s)", (id < 0 ? "indefinit": id), nom, categoria);
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
import java.util.Arrays;
import java.util.List;
import java.util.LinkedList;

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
        System.out.println("Introduïm una categoria");
        Categoria mamifer = new Categoria("mamífer");
        zoo.afegeixCategoria(mamifer);
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        // creem una llista d'animals amb algun malament classificat
        Animal balena = new Animal("balena", new Categoria("peix"));
        Animal tarantula = new Animal("taràntula", new Categoria("insecte"));
        List<Animal> animals = Arrays.asList(
            new Animal("pardal", new Categoria("ocell")),
            new Animal("gat", mamifer),
            new Animal("guppy", new Categoria("peix")),
            balena,
            tarantula
        );

        System.out.println();
        System.out.println("Afegim uns quants animals");
        for (Animal animal: animals) {
            zoo.afegeixAnimal(animal);
        }

        System.out.println("A la base de dades, els animals són:");
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        System.out.println("A la base de dades, les categories són:");
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("Corregim la categoria de la balena a una ja existent");
        zoo.canviaCategoria(balena, mamifer);
        System.out.println("A la base de dades, els animals són:");
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        System.out.println("A la base de dades, les categories són:");
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("Modifiquem la categoria de la taràntula a una que no existeix");
        zoo.canviaCategoria(tarantula, new Categoria("aràcnid"));
        System.out.println("A la base de dades, els animals són:");
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        System.out.println("A la base de dades, les categories són:");
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("Intentem modificar la categoria d'un animal que no existeix");
        zoo.canviaCategoria(new Animal("cavall de mar", mamifer), new Categoria("peix"));
        System.out.println("A la base de dades, els animals són:");
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        System.out.println("A la base de dades, les categories són:");
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

Els animals a la vida real no solen canviar gaire de nom o de categoria, però les persones que introduïm les dades de vegades ens equivoquem.

Per aquesta raó, la classe Zoo oferirà la possibilitat de canviar la categoria d'un animal amb el mètode canviaCategoria()

El mètode canviaCategoria() rep un animal i una categoria, i en finalitzar, a la base de dades hi ha un registre corresponent a aquest animal amb la nova categoria.

El mètode pot generar SQLException.

Cal tenir present els següents casos:

cas l'animal no estigui a la base de dades

En aquest cas, canviaCategoria() funcionarà com afegeixAnimal() tot reemplaçant abans la categoria original de l'animal per la nova.

cas que l'animal estigui a la base de dades.

Si la nova categoria no es troba a la base de dades, caldrà afegir-la primer com ja hem fet a afegeixAnimal().

Finalment, un cop tenim resolt el tema de la categoria, ja podem executar la sentència UPDATE corresponent.

El codi de prova a UsaZoo és:

```java
import java.sql.SQLException;

import java.util.Arrays;

import java.util.List;

import java.util.LinkedList;

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

        System.out.println("Introduïm una categoria");

        Categoria mamifer = new Categoria("mamífer");

        zoo.afegeixCategoria(mamifer);

        ZooUtils.mostraCategories(zoo.recuperaCategories());
```

//

// creem una llista d'animals amb algun malament classificat

```java
        Animal balena = new Animal("balena", new Categoria("peix"));

        Animal tarantula = new Animal("taràntula", new Categoria("insecte"));
```

List<Animal> animals = Arrays.asList(

new Animal("pardal", new Categoria("ocell")),

new Animal("gat", mamifer),

new Animal("guppy", new Categoria("peix")),

balena,

tarantula

```java
            );

        System.out.println();

        System.out.println("Afegim uns quants animals");

        for (Animal animal: animals) {

            zoo.afegeixAnimal(animal);

        }

        System.out.println("A la base de dades, els animals són:");

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        System.out.println("A la base de dades, les categories són:");

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("Corregim la categoria de la balena a una ja existent");

        zoo.canviaCategoria(balena, mamifer);

        System.out.println("A la base de dades, els animals són:");

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        System.out.println("A la base de dades, les categories són:");

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("Modifiquem la categoria de la taràntula a una que no existeix");

        zoo.canviaCategoria(tarantula, new Categoria("aràcnid"));

        System.out.println("A la base de dades, els animals són:");

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        System.out.println("A la base de dades, les categories són:");

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("Intentem modificar la categoria d'un animal que no existeix");

        zoo.canviaCategoria(new Animal("cavall de mar", mamifer), new Categoria("peix"));

        System.out.println("A la base de dades, els animals són:");

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        System.out.println("A la base de dades, les categories són:");

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

**Introduïm una categoria**
Nombre de categories: 1
Categoria(id:1, mamífer)

**Afegim uns quants animals**
A la base de dades, els animals són:
Nombre d'animals: 5
Animal(id:4, balena, Categoria(id:3, peix))
Animal(id:2, gat, Categoria(id:1, mamífer))
Animal(id:3, guppy, Categoria(id:3, peix))
Animal(id:1, pardal, Categoria(id:2, ocell))
Animal(id:5, taràntula, Categoria(id:4, insecte))
A la base de dades, les categories són:
Nombre de categories: 4
Categoria(id:4, insecte)
Categoria(id:1, mamífer)
Categoria(id:2, ocell)
Categoria(id:3, peix)

**Corregim la categoria de la balena a una ja existent**
A la base de dades, els animals són:
Nombre d'animals: 5
Animal(id:4, balena, Categoria(id:1, mamífer))
Animal(id:2, gat, Categoria(id:1, mamífer))
Animal(id:3, guppy, Categoria(id:3, peix))
Animal(id:1, pardal, Categoria(id:2, ocell))
Animal(id:5, taràntula, Categoria(id:4, insecte))
A la base de dades, les categories són:
Nombre de categories: 4
Categoria(id:4, insecte)
Categoria(id:1, mamífer)
Categoria(id:2, ocell)
Categoria(id:3, peix)

Modifiquem la categoria de la taràntula a una que no existeix
A la base de dades, els animals són:
Nombre d'animals: 5
Animal(id:4, balena, Categoria(id:1, mamífer))
Animal(id:2, gat, Categoria(id:1, mamífer))
Animal(id:3, guppy, Categoria(id:3, peix))
Animal(id:1, pardal, Categoria(id:2, ocell))
Animal(id:5, taràntula, Categoria(id:5, aràcnid))
A la base de dades, les categories són:
Nombre de categories: 5
Categoria(id:5, aràcnid)
Categoria(id:4, insecte)
Categoria(id:1, mamífer)
Categoria(id:2, ocell)
Categoria(id:3, peix)

**Intentem modificar la categoria d'un animal que no existeix**
A la base de dades, els animals són:
Nombre d'animals: 6
Animal(id:4, balena, Categoria(id:1, mamífer))
Animal(id:6, cavall de mar, Categoria(id:3, peix))
Animal(id:2, gat, Categoria(id:1, mamífer))
Animal(id:3, guppy, Categoria(id:3, peix))
Animal(id:1, pardal, Categoria(id:2, ocell))
Animal(id:5, taràntula, Categoria(id:5, aràcnid))
A la base de dades, les categories són:
Nombre de categories: 5
Categoria(id:5, aràcnid)
Categoria(id:4, insecte)
Categoria(id:1, mamífer)
Categoria(id:2, ocell)
Categoria(id:3, peix)

Finalment tanquem la connexió amb la base de dades: desconnectat

Pista

Tens problemes per a composar la sentència SQL?

Aquí la tens:

**String sql = String.format("UPDATE ANIMALS " +**
"SET categoria = %d " +
"WHERE id = %d",
idNovaCategoria,
idAnimal

```java
                           );

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

    public Animal obteAnimalPerNom(String nom) throws SQLException {
        String sentencia = String.format("SELECT a.id as id_animal, c.id as id_categoria, c.nom as nom_categoria FROM ANIMALS a JOIN CATEGORIES c ON a.categoria = c.id WHERE a.nom = '%s' ORDER BY a.nom LIMIT 1", nom);

        Statement st = null;
        try {
            st = conn.createStatement();
            ResultSet rs = st.executeQuery(sentencia);
            if (rs.next()) {
                int idCategoria = rs.getInt("id_categoria");
                String nomCategoria = rs.getString("nom_categoria");
                Categoria categoria = new Categoria(idCategoria, nomCategoria);
                int idAnimal = rs.getInt("id_animal");
                Animal animal = new Animal(idAnimal, nom, categoria);
                return animal;
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

    public List<Animal> recuperaAnimals() throws SQLException {
        String sentencia = "SELECT a.id as id_animal, a.nom as nom_animal, c.id as id_categoria, c.nom as nom_categoria FROM ANIMALS a JOIN CATEGORIES c ON a.categoria = c.id ORDER BY a.nom";

        Statement st = null;
        try {
            st = conn.createStatement();
            ResultSet rs = st.executeQuery(sentencia);

            List<Animal> animals = new LinkedList<>();
            while (rs.next()) {
                int idCategoria = rs.getInt("id_categoria");
                String nomCategoria = rs.getString("nom_categoria");
                Categoria categoria = new Categoria(idCategoria, nomCategoria);
                int idAnimal = rs.getInt("id_animal");
                String nomAnimal = rs.getString("nom_animal");
                Animal animal = new Animal(idAnimal, nomAnimal, categoria);
                animals.add(animal);
            }
            rs.close();
            return animals;
        } finally {
            if (st != null) {
                st.close();
            }
        }
    }

    public void canviaCategoria(Animal animal, Categoria categoria) throws SQLException {
        Animal ani = obteAnimalPerNom(animal.getNom());
		Categoria cat = obteCategoriaPerNom(categoria.getNom());
		int idNovaCategoria = 0;
		int idAnimal = 0;
		
		if (ani != null && cat != null) {
			idNovaCategoria = categoria.getId();
			idAnimal = animal.getId();		
		} else {		
			if (ani == null) {
				Animal animalNovaCategoria = new Animal(animal.getNom(), categoria);
				afegeixAnimal(animalNovaCategoria);
			} else {
				if (cat == null) {
					afegeixCategoria(categoria);
				}
			} 
			cat = obteCategoriaPerNom(categoria.getNom());
			idNovaCategoria = cat.getId();

			ani = obteAnimalPerNom(animal.getNom());
			idAnimal = ani.getId();
		}

        String sentencia = String.format("UPDATE ANIMALS SET categoria = %d WHERE id = %d", idNovaCategoria, idAnimal);

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

    public static void mostraAnimals(List<Animal> animals) {
        int longitud = animals.size();
        System.out.printf("%s%n", (longitud > 0 ? "Nombre de animals: " + longitud: "Cap animal"));
        for (Animal animal: animals) {
            System.out.println("\t" + animal);
        }
    }
}
```
