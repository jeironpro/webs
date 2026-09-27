# POO i model relacional

POO i el model relacional

**Diferencia enttre Objectes i Taules**
POO                        Model Relacional (BD)
Classes                    Taules
Objectes (instàncies)      Files
Propietats / atributs      Columnes
Referències a objectes     Claus foranes (FOREIGN KEY)
Col·leccions (List, etc)   Relacions 1:N, N:M

**Modeltatge orientat a objectes**
La POO ens permet modelar entitats del món real amb classes que tenen:
- Propietats (atributs): representen l'estat
- Mètodes: representen el comportament

**Exemple**

```java
public class Usuari {
    private int id;
    private String nom;
    private String email;

    public Usuari(int id, String nom, String email) {
        this.id = id;
        this.nom = nom;
        this.email = email;
    }
```

**// Getters i setters**

```java
}
```

**Model Relacional (Taules)**
A nivell de base de dades, això es representa amb una taula:
CREATE TABLE usuaris (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nom TEXT,
email TEXT
)
Cada fila és un objecte, i cada columna és una propietat

**El problema del "Mappatge"**
La gran dificultat és com sincronitzar el món dels objectes amb el món de les taules. Això és el que es coneix com:

**ORM (Object-Relacional Mapping)**
Hi ha dues maneres d'aconseguir-ho:

**Mapeig manual (amb JDBC)**
Tu fas tot el codi per llegir/escriure dades:

```java
String sql = "SELECT * FROM usuaris";
PreparedStatement stmt = conn.PreparedStatement(sql);
ResultSet rs = stmt.executeQuery();

while (rs.next()) {
```

**Usuari u = new Usuari(**
rs.getInt("id"),
rs.getString("nom"),
rs.getString("email")

```java
    );
}
```

**Mapeig automàtic (amb ORM)**
Amb biblioteques com JPA/Hibernate, pots "anotar" les classes per dir que representen taules:

```java
@Entity
@Table(name = "usuaris")
public class Usuari {
    @Id
    @GeneratedValue
    private int id;

    private String nom;
    private String email;
}
```

**Relacions entre objectes i taules**
- One to Many(1:N)
- Un usuari pot tenir moltes Comandes

**Exemple**
Java

```java
public class Usuari {
    private List<Comanda> = comandes;
}
```

**SQL**
CREATE TABLE comandes (
id INTEGER PRIMARY KEY,
usuari_id INTEGE,
FOREIGN KEY (usuari_id) REFERENCES usuaris(id)
)

**Patrons de disseny habituals**
Per separar responsabilitats, sovint es fa servir:
- DAO (Data Access Object): encapsula l'access a la BD
- DTO (Data Transfer Object): només conté dades
- Service Layer: conté la lògica d'aplicació

**Impedància Objecte-Relacional**
La transició entre objectes i taules no és perfecta. Alguns problemes típics:

**Problema                             Solució habitual**
Herència (classe pare/fill)          Taula per classe o columna tipus
Referènciies circulars               Evitar, o carregar am lazy loading
Col·leccions d'objectes              Taula separada amb claus foranes
Nullable en BD vs opcional en Java   Optional<T> o valors per defecte

**Avantatge de combinar POO i model relacional**
- Model lògic més clar, proper a la realitat
- Persisténcia automàtica dels objectes
- Reutilització i extensibilitat de codi
- Facilitació de proves i manteniment

**Exemple**

```java
public class Comanda {
    private int id;
    private Usuari usuari; // Relació
    private String producte;
    private int quantitat;
}
```

**CREATE TABLE comandes (**
id INTEGER PRIMARY KEY,
usuari_id INTEGER,
producte TEXT,
quantitat INTEGER,
FOREIGN KEY (usuari_id) REFERENCES usuaris(id)
)

```java
public class ComandaDAO {
    public void inserir(Comanda c) { ... }
    public List<Comanda> perUsuari(int usuariId) { ... }
}
```

**La combinació de POO + model relacional permet**
- Disenyar codi net i modular
- Connectar amb sistemes de dades persistents (BD)
- Tenir control sonre l'estat dels objects
- Aplicar patrons de disseny que milloren mantenibilitat
