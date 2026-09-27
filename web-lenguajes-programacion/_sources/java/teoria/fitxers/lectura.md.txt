# Lectura

**Lectura**
Treballar amb fitxers en Java permet llegir, escriure, crear i modificar arxius del sistema (com .txt, .csv, etc.). Java proporciona classes dins del paquet java.io i java.nio per fer aquestes operacions.

**Conceptes Bàsics**
- Fitxer (File): representa una ruta a un arxiu o directori.

- Stream (flux): canal per llegir o escriure dades.

- Buffer: memòria intermèdia per optimitzar l'accés a fitxers.

- Caràcters vs Bytes:
- FileReader i FileWriter: treballen amb caràcters (text).

- FileInputStream i FileOutputStream: treballan amb bytes (dades binàies).

Llegir un fitxer en JAva vol dir obrir-lo, llegir el seu contingut, i processar la informació, línia a línia o caràcter a caràcter.

**Mètodes de lectura més comuns**
Mètode              Tipus de dades  Ideal per a
BufferedReader      Text            Llegir línia per línia
Scanner             Text            Llegir línia per línia o paraula per paraula
Files.readAllLines  Text            Llegir tot el fitxer com a llista de línies
FileInputStream     Bytes           Fitxers binaris

BufferedReader -> Línia per línia (mètode tradicional i eficient)
Aquest mètode utilitza buffers per fer la lectura més eficient

```java
BufferedReader lector = new BufferedReader(new FileReader("fitxer.txt"));
String linia;
while ((linia = lector.readLine()) != null) {
    System.out.println(linia);
}
lector.close();
```

- Llegeix línia per línia.
- Cal tancar el fitxer amb .close().
- Gestiona excepcions (IOException).

**Scanner -> Alternativa més senzilla per textos simples**

```java
Scanner sc = new Scanner(new File("fitxer.txt"));
while (sc.hasNextLine()) {
    String linia = sc.nextLine();
    System.out.println(linia);
}
sc.close();
```

- Més senzill d'utilitzar.
- Permet llegir per línies, paraules o tokens.
- Ideal per a arxius petits o processaments bàsics.

Files.readAllLines() -> Java 7+, lectura ràpida de tot el fitxer

```java
List<String> linies = Files.readAllLines(Paths.get("fitxer.txt"));
for (String linia; linies) {
    System.out.println(linia);
}
```

- El fitxer és petit o mitjà.
- Volem llegir-lo tot de cop.
