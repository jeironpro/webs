# SGBDJDBC

**El SGBD i el JDBC**
Un Sistema de Gestió de Bases de Dades (SGBD) és un programari que permet:
- Crear, consultar i modificar bases de dades
- Gestionar dades de forma estructurada (normalment amb SQL)
- Controlar l'access concurrent, la seguretat i la persistència

**Exemples**
- MySQL
- PostgreSQL
- SQLite (lleuger i sense servidor)
- Oracle
- SQL Server

JDBC (Java Database Connectivity) és l'API oficial de Java per connectar-se a base de dades relacionals.

**Permet a Java**
- Establir una connexió amb el SGBD
- Executar consultes SQL (SELECT, INSERT, UPDATE...)
- Rebre i processar resultats
- Gestionar transaccions

**Components de JDBC**
Component                       Funció principal
DriverManager                   Carrega i gestiona els controladors JDBC
Connection                      Representa la connexió amb la BD
Statement / PreparedStatement   Executa consultes SQL
ResultSet                       Conté els resultats de les consultes SELECT

**Exemple**
Dependència (amb Maven):
<dependency>
<groupId>org.xerial</groupId>
<artifactId>sqlite-jdbc</artifactId>
<version>3.42.0.0</version>
</dependency>

```java
import java.sql.*;

public class ExempleJDBC {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:exemple.db";

        try (Connection conn = DriverManage.getConnection(url)) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM usuaris");

            while (rs.next()) {
                System.out.println("Nom " + rs.getString("nom"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

**PreparedStatement per seguretat**
Millor usar PreparedStatement per evitar injeccions SQL:

```java
String sql = "SELECT * FROM usuaris WHERE email = ?";
PreparedStatement ps = conn.preparedStatment(sql);
ps.setString(1, "algun@domini.com");
ResultSet rs = ps.executeQuery();
```

**Exceptions i SQLException**
La majoria d'operacions JDBC poden llançar SQLException, que cal capturar o declarar amb throws.

**Avantatges del JDBC**
- Estàndard oficial en Java
- Control total de les consultes SQL
- Compatible amb qualsevol SGBD que tingui driver JDBC

**Inconvenients**
- Requereix molt codi repetitiu (boilerplate)
- La conversió entre objectes Java i resultats SQL és manual

Per això es pot complementar amb biblioteques ORM com Hibernate o JPA per automatitzar aquest mapeig.

**El SGBD s'encarrega de gestionar les dades**
El JDBC és el pont entre Java i el SGBD
Amb JDBC podem fer CRUD (Create, Read, Update, Delete)
És essencial per fer persistents els objectes Java en una BD
