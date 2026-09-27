# Gestio

**Gestió**
Java ofereix dues grans maneres per gestionar fitxers.

**Mètode     Biblioteca**
java.io    Tradicional        Mètodes antics, encara útils
java.nio   Modern (Java 7+)   Més potent, concís i segur

**Creació de fitxers**

```java
File fitxer = new File("exemple.txt");
if (fitxer.createNewFile()) {
    System.out.println("Fitxer creat");
} else {
    System.out.println("El fitxer ja existeix");
}
```

**Amb Files (NIO)**

```java
Path ruta = Paths.get("exemple.txt");
Files.createFile(ruta);
```

**Escriure i llegir**
Escriptura

```java
Files.write(Paths.get("exemple.txt"), List.of("Hola", "Món"));
```

**Lectura**

```java
List<String> linies = Files.readAllLines(Paths.get("exemple.txt"));
```

**Moure o copiar fitxers**

```java
Files.move(Paths.get("exemple.txt"), Paths.get("nou_nom.txt"));
Files.copy(Paths.get("fitxer.txt"), Paths.get("copia.txt"), StandardCopyOption.REPLACE_EXISTING);
```

**Esborrar Fitxers**

```java
Files.delete(Paths.get("fitxer.txt"));
```

**També es pot comprovar si existeix abans**

```java
if (Files.exists(Paths.get("fitxer.txt"))) {
    Files.delete(Paths.get("fitxer.txt"));
}
```

**Inspecció de fitxers**

```java
Path ruta = Paths.get("exemple.txt");

boolean existeix = Files.exists(ruta);
boolean esFitxer = Files.isRegularFile(ruta);
long mida = Files.size(ruta);
FileTime modificacio = Files.getLastModifiedTime(ruta);
```

**Directori i contingut**
Per veure el contingut d'un directori:
Files.list(Paths.get("carpeta"))

```java
     .forEach(System.out::println);
```

**També pots fer**

```java
Files.createDirectory(Paths.get("nova_carpeta"));
Files.delete(Paths.get("carpeta_buida")); // només si està buida
```

**La classe File**
La classe java.io.File representa una abstracció d'un fitxer o directori del sistema de fitxers. No representa el contingut, sinó la ruta i la referència.

**Creació d'un objecte File**

```java
File f = new File("documents/notes.txt");
```

Aquest objecte no crea el fitxer fisicament; només és una representació.

**Funcions habituals de File**
exists()                  Verifica si el fitxer o directori existeix
createNewFile()           Crea un fitxer nou (si no existeix)
delete()                  Esborra el fitxer o directori
mkdir()                   Crea un directori
mkdirs()                  Crea un directori i els directoris pares
isFile()                  Verifica si és un fitxer
isDirectory()             Verifica si és un directori
length()                  Retorna la mida del fitxer (en bytes)
getName()                 Nom del fitxer o directori
getAbsolutePath()         Ruta absoluta
renameTo(File dest)       Canvia el nom o mou el fitxer
list() / listFiles()      Llista el contingut d'un directori

**Exemple**

```java
File fitxer = new File("notes.txt");

if (fitxer.exists()) {
    System.out.println("Nom: " + fitxer.getName());
    System.out.println("Ruta absoluta: " + fitxer.getAbsolutePath());
    System.out.println("És fitxer? " + fitxer.isFile());
    System.out.println("Mida: " + fitxer.length() + " bytes");
} else {
    System.out.println("El fitxer no existeix");
}
```

**IOException**
IOException és una excepció comprovada que es llença quan hi ha problemes relacionats amb entrada/sortida (fitxer, fluxos, xarxa).

**Per exemple**
- No es pot obrir un fitxer perquè no existeix.
- No hi ha permisos per llegir-lo o escriure'l.
- Hi ha un error durant la lectura o escriptura.

**Com gestionar-la**
Has de capturar-la amb try-catch o declarar-la amb throws.

**Opció 1: try-catch**

```java
try {
    File fitxer = new File("dades.txt");
    fitxer.createNewFile();
} catch (IOException e) {
    System.out.println("Hi ha hagut un error: " + e.getMessage());
}
```

**Opció 2: throws**

```java
public void crearFitxer() throws IOException {
    File f = new File("registre.txt");
    f.createNewFile();
}
```

**IOException**
- es la superclasse de moltes altres excepcions d'entrada/sortida com:
- FileNotFoundException
- EOFException
- SocketException
- Pot afectar qualsevol operació d'entrada o soritda, no només fitxers.
- Sempre cal tenir cura d'ella per evitar que el programa es bloquegi.

**Throws**
throws és una paraula clau que s'utilitza per declarar que un mètode pot llençar una excepció. D'aquesta manera, la responsabilitat de gestionar-la es trasllada a qui crida el mètode.

Quan escrius un mètode que pot provocar una excepció comprovada (com IOException), Java et força a:
- Capturar-la amb try-catch
- Declarar-la amb throws

**Sintaxis bàsica**

```java
public tipusDeRetorn nomDelMetode() throws Excepcio {
```

// codi que pot llençar una excepció

```java
}
```

**Exemple**

```java
import java.io.File;
import java.io.IOException;

public class Exemple {
    public static void creaFitxer() throws IOException {
        File fitxer = new File("prova.txt");
        fitxer.createNewFile(); // Pot llençar IOException
    }

    public static void main(String[] args) {
        try {
            creaFitxer();
            System.out.println("Fitxer creat correctament.");
        } catch (IOException e) {
            System.out.println("Error creant el fitxer: " + e.getMessage());
        }
    }
}
```

**En aquest cas**
- El mètode creaFitxer() declara que pot llençar IOException.
- El main() és responsable de capturar-la.

**Es poden declarar múltiples excepcions**

```java
public void carregarDades() throws IOException, ClassNotFoundException {
```

// codi que pot llençar ambdues excepcions

```java
}
```

**L'importància del throws**
- És obligatori per a excepcions comprovades (checked exceptions).
- Et permet mantenir el codi net quan vols que la gestió d'errors es tracti a un altre lloc.
