# Escriptura

**Escriptura**
Treballar amb fitxers en Java permet llegir, escriure, crear i modificar arxius del sistema (com .txt, .csv, etc.). Java proporciona classes dins del paquet java.io i java.nio per fer aquestes operacions.

**Conceptes Bàsics**
- Fitxer (File): representa una ruta a un arxiu o directori.

- Stream (flux): canal per llegir o escriure dades.

- Buffer: memòria intermèdia per optimitzar l'accés a fitxers.

- Caràcters vs Bytes:
- FileReader i FileWriter: treballen amb caràcters (text).

- FileInputStream i FileOutputStream: treballan amb bytes (dades binàies).

La escriptura de fitxer és el procés d'obrir un fitxer i escriure-hi dades. Es poden crear fitxer nous o sobreescriure'n o afegir contingut a fitxers existents.

**Eines més habituals**
Mètode                Tipus de dades          Notes
FileWriter            Text                    Escriu caràcters
BufferedWriter        Text (eficient)         Escriu amb buffer (més ràpid)
PrintWriter           Text                    Molt flexible (com System.out)
Files.write()         Java 7+                 Simple i modern
FileOutputStream      Bytes                   Per dades binàries

**FileWrite -> el mètode més simple**

```java
FileWriter fw = new FileWriter("fitxer.txt");
fw.write("Hola món!\n");
fw,write("Segona línia");
fw.close();
```

- Sobreescriu el contingut del fitxer per defecte.
- Per afegir contingut sense esborrar l'anterior:

```java
    new FileWriter("fitxer.txt", true);
```

**BufferedWriter -> escriptura amb memòria intermèdia**

```java
BufferedWriter bw = new BufferedWriter(new FileWriter("fitxer.txt"));
bw.write("Línia amb buffer");
bw.newLine(); // fa un salt de línia
bw.write("Una altra línia");
bw.close();
```

- Molt més eficient per a fitxer grans o moltes línies.

**PrintWriter -> com System.out**

```java
PrintWriter pw = new PrintWriter("fitxer.txt");
pw.println("Línia 1");
pw.printf("Valor: %.2f%n", 3.1416);
pw.close();
```

- Escriure formats.
- Tractar text com si fos una impressora (amb .print, .println, .printf).

**Files.write() -> forma moderna amb NIO**

```java
Path ruta = Paths.get("fitxer.txt");
List<String> dades = Array.asList("Línia 1", "Línia 2");
Files.write(ruta, dades, StandardCharsets.UTF_8);
```

**Per afegir**

```java
Files.write(ruta, dades, StandardOpenOption.APPEND);
```
