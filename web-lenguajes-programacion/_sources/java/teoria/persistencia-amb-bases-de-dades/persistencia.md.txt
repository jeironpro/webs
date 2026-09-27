# Persistencia

**Persistència amb bases de dades**
La persistència és la capacitat de desar dades perquè no es perdin quan l'aplicació es tanca.

Això es fa tipicament en fitxers o en bases de dades (BD).

**En Java, podem accedir a bases de dades usant**
- JDBC (Java Database Connectivity)
- Biblioteques ORM com Hibenate, JPA, etc. (Nivel avançat)

JDBC (Java Database Connectivity) és una API que permet a Java:
- Connectar-se a una base de dades
- Executar consultes (SQL)
- Llegir i escriure dades

**Elements clau de JDBC**
1. Driver JDBC: el connector específic per a cada sistema de base de dades (MySQL, SQLite, PostgreSQL, etc.)
2. Connexió (Connection)
3. Sentències (Statement o PreparedStatement)
4. Resultats (ResultSet)

**Exemple bàsic amb SQLite**

```java
import java.sql.*;

public class ConnexioBD {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:meva_base_dades.db";

        try (Connection conn = DriverManager.getConnection(url)) {
            if (conn != null) {
                System.out.println("Connexió establerta amb èxit!");
            }
        } catch (SQLException e) {
            System.out.println("Error de connexió: " + e.getMessage());
        }
    }
}
```

**Crear una taula i inserir dades**

```java
String sql = "CREATE TABLE IF NOT EXISTS usuaris (id INTEGER PRIMARY KEY, nom TEXT)";

try (Statement stmt = conn.createStatement()) {
    stmt.execute(sql);
}

sql = "INSERT INTO usuaris(NOM) VALUES(?)";

try (PreparedStatement pstmt = conn.PreparedStatement(sql)) {
    pstmt.setString(1, "Anna");
    pstmt.executeUpdate();
}
```

**Consultar dades**

```java
String sql = "SELECT * FROM usuaris";

try (Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery(sql)) {

    while (rs.next()) {
        System.out.println(rs.getInt("id") + ": " + rs.getString("nom"));
    }
}
```

**Pas a pas**
1. Carregar el driver (ja inclòs en SQLite)
2. Obrir connexió amb la BD (Connection)
3. Crear i executar consultes SQL
4. Llegir resultats (ResultSet)
5. Tancar connexió (automàtic amb try-with)
