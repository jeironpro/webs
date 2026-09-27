# Ejercicios — 22.09 — Eliminacio de categories i animals

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

        System.out.println("Intentem eliminar una categoria i un animal inexistents");
        zoo.eliminaCategoria(new Categoria("mamífer"));
        zoo.eliminaAnimal(new Animal("gat", new Categoria("mamífer")));
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        Animal pardal = new Animal("pardal", new Categoria("ocell"));
        System.out.println();
        System.out.println("Introduïm " + pardal);
        zoo.afegeixAnimal(pardal);
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("Eliminem l'animal");
        zoo.eliminaAnimal(pardal);
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        // creem una llista d'animals
        Categoria ocell = new Categoria("ocell");
        Animal gat = new Animal("gat", new Categoria("mamífer"));
        List<Animal> animals = Arrays.asList(
            new Animal("pardal", ocell),
            new Animal("àliga", ocell),
            new Animal("gallina",  ocell),
            gat,
            new Animal("trencalós",  ocell)
        );

        System.out.println();
        System.out.println("Afegim uns quants animals");
        for (Animal animal: animals) {
            zoo.afegeixAnimal(animal);
        }
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        ocell = zoo.obteCategoriaPerNom("ocell");
        System.out.println();
        System.out.println("Eliminem " + ocell);
        zoo.eliminaCategoria(ocell);
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();
        System.out.println("No deixem ni el gat!");
        zoo.eliminaAnimal(gat);
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
        ZooUtils.mostraCategories(zoo.recuperaCategories());

        Categoria mamifer = zoo.obteCategoriaPerNom("mamífer");
        System.out.println();
        System.out.println("Eliminem " + mamifer);
        zoo.eliminaCategoria(mamifer);
        ZooUtils.mostraAnimals(zoo.recuperaAnimals());
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

En aquest exercici implementarem els mètodes de Zoo:

```java
    void eliminaAnimal(Animal animal)

    void eliminaCategoria(Categoria categoria)
```

eliminaAnimal() eliminarà el registre corresponent d'animal només considerant l'identificador. Si l'animal té l'identificador indefinit, o bé no hi ha cap registre amb aquest id, no farà res.

eliminaCategoria() realitzarà l'eliminació en cascada tot eliminant abans els animals que puguin tenir aquesta categoria assignada. Si no hi ha cap categoria amb l'identificador de la rebuda, o bé aquesta el té indefinit, no farà res.

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

        System.out.println("Intentem eliminar una categoria i un animal inexistents");

        zoo.eliminaCategoria(new Categoria("mamífer"));

        zoo.eliminaAnimal(new Animal("gat", new Categoria("mamífer")));

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        Animal pardal = new Animal("pardal", new Categoria("ocell"));

        System.out.println();

        System.out.println("Introduïm " + pardal);

        zoo.afegeixAnimal(pardal);

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("Eliminem l'animal");

        zoo.eliminaAnimal(pardal);

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        ZooUtils.mostraCategories(zoo.recuperaCategories());
```

// creem una llista d'animals

```java
        Categoria ocell = new Categoria("ocell");

        Animal gat = new Animal("gat", new Categoria("mamífer"));
```

List<Animal> animals = Arrays.asList(

new Animal("pardal", ocell),

new Animal("àliga", ocell),

new Animal("gallina",  ocell),

gat,

new Animal("trencalós",  ocell)

```java
            );

        System.out.println();

        System.out.println("Afegim uns quants animals");

        for (Animal animal: animals) {

            zoo.afegeixAnimal(animal);

        }

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        ocell = zoo.obteCategoriaPerNom("ocell");

        System.out.println();

        System.out.println("Eliminem " + ocell);

        zoo.eliminaCategoria(ocell);

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.println("No deixem ni el gat!");

        zoo.eliminaAnimal(gat);

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        Categoria mamifer = zoo.obteCategoriaPerNom("mamífer");

        System.out.println();

        System.out.println("Eliminem " + mamifer);

        zoo.eliminaCategoria(mamifer);

        ZooUtils.mostraAnimals(zoo.recuperaAnimals());

        ZooUtils.mostraCategories(zoo.recuperaCategories());

        System.out.println();

        System.out.print("Finalment tanquem la connexió amb la base de dades: ");

        zoo.desconnecta();

        System.out.println("desconnectat");

    }

}
```

Amb la sortida esperada:

**java UsaZoo**
Primer connectem amb la base de dades: connectat

**Creem les taules**
Taules resultants: ANIMALS, CATEGORIES
Intentem eliminar una categoria i un animal inexistents
Cap animal
Cap categoria

Introduïm Animal(id:indefinit, pardal, Categoria(id:indefinit, ocell))
Nombre d'animals: 1
Animal(id:1, pardal, Categoria(id:1, ocell))
Nombre de categories: 1
Categoria(id:1, ocell)

**Eliminem l'animal**
Cap animal
Nombre de categories: 1
Categoria(id:1, ocell)

**Afegim uns quants animals**
Nombre d'animals: 5
Animal(id:4, gallina, Categoria(id:1, ocell))
Animal(id:5, gat, Categoria(id:2, mamífer))
Animal(id:2, pardal, Categoria(id:1, ocell))
Animal(id:6, trencalós, Categoria(id:1, ocell))
Animal(id:3, àliga, Categoria(id:1, ocell))
Nombre de categories: 2
Categoria(id:2, mamífer)
Categoria(id:1, ocell)

**Eliminem Categoria(id:1, ocell)**
Nombre d'animals: 1
Animal(id:5, gat, Categoria(id:2, mamífer))
Nombre de categories: 1
Categoria(id:2, mamífer)

**No deixem ni el gat!**
Cap animal
Nombre de categories: 1
Categoria(id:2, mamífer)

**Eliminem Categoria(id:2, mamífer)**
Cap animal
Cap categoria

Finalment tanquem la connexió amb la base de dades: desconnectat

☼ Ampliació

Aquests nous mètodes descobreixen un error que tenim a altres mètodes (ex. afegeixAnimal() que pressuposen que si la instància respon false a la crida del mètode idIndefinit() llavors segur que està a la base de dades.

Això ja veiem que no sempre serà cert. Sense anar més lluny, si eliminem un animal amb eliminaAnimal(), la instància conserva el seu id original.

Podries pensar que és fàcil de resoldre fent que eliminaAnimal() marqui la instància com a indefinida, per exemple afegint un nou mètode a Animal (ex. unsetId())

Si bé podem solucionar una mica el problema, no el resolem de ple. Com ens ho fem per modificar totes les instàncies d'animal que pugui tenir el nostre programa si els seus registres són eliminats de la base de dades en eliminar la seva categoria? Encara més, el valor del id el podem assignar de manera arbitrària en crear l'animal doncs no comprova que aquest correspongui realment a una entrada de ANIMALS. I no s'acaba aquí! Hi ha casos patològics com ara que un animal hagi estat guardat i després se li canviï la categoria per una que no estigui a la base de dades! Se t'acudeixen més vulnerabilitats?

En resum, que ens tocarà afegir la comprovació a tots els mètodes implicats, de que l'identificador de cada entitat realment correspongui amb una entrada de la taula corresponent. Fes tots els que se t'acudeixin i et vinguin de gust.

Aquesta és la proposta d'ampliació. Si vols fer-la, et proposo que afegeixis un UsaZooAmpliat per provar que funciona cada cas que hagis implementat. Demana ajut si et costa pensar en les proves.

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

    public void eliminaAnimal(Animal animal) throws SQLException {
        String nom = animal.getNom();
        Animal ani = obteAnimalPerNom(nom);
        
        if (ani == null) {
            return;
        }
        if (animal.idIndefinit()) {
            return;
        }

        String sentencia = String.format("DELETE FROM ANIMALS WHERE id = %d", animal.getId());

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

    public void eliminaCategoria(Categoria categoria) throws SQLException {
        String nom = categoria.getNom();
        Categoria cat = obteCategoriaPerNom(nom);
        
        if (cat == null) {
            return;
        }
        if (categoria.idIndefinit()) {
            return;
        }

        String sentencia = String.format("DELETE FROM CATEGORIES WHERE id = %d", categoria.getId());

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
