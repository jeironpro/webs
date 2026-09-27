# Registres

**Registres**
Els registres (records) són una funcionalitat introduïda en Java 14 (preview) i oficialment en Java 16, que permeten definir classe inmutables de manera concisa i clara.

Són ideals per representar dades simples o estructures de dades com ara "registres d'una base de dades", "punts en un pla", etc.

Un registre és un conjunt d'informació agrupada, per exemple:
Joan,24,Barcelona
Anna,30,Girona

Cada línia és un registre, i cada valor dins de la línia és un camp.

**Formes més habituals d'emmagatzemar registres**
Format de fitxer    Separació      Exemple
CSV                 Comes (,)      Maria,22,Tarragona
TSV                 Tabuladors     Joan\t25\tBarcelona
Text pla            Format propi   `Nom: Lara
Binari              No llegible    Format personalitzat en bytes

**Lectura de fitxer amb registres**
Quan llegim registres d'un fitxer, acostumem a:
1. Llegir el fitxer línia per línia.
2. Dividir cada línia en camps (amb .split()).
3. Crear un objecte per representar el registre (ex: Persona, Alumne).

**Exemple conceptual**
Imagina aquest fitxer alumnes.txt:
Laura,23,Girona
Pau,19,Tarragona

**Com processar-ho**

```java
BufferedReader lector = new BufferedReader(new FileReader("alumnes.txt"));
String linia;
while ((linia = lector.readLine()) != null) {
    String[] camps = linia.split(",");
    String nom = camps[0];
    int edat = Integer.parseInt(camps[1]);
    String ciutat = camps[2];
```

// Crear objecte Alumne, guardar-lo, mostrar-lo, etc.

```java
}
lector.close();
```

**Escriptura de registres a fitxer**
Es tracta de crear una línia de text per cada registre, separant els camps:

```java
PrintWriter pw = new PrintWriter("alumnes.txt");
pw.println("Laura,23,Girona");
pw.println("Pau,19,Tarragona");
pw.close();
```

**Cal tenir en compte**
- Codificació: usar UTF-8 si hi ha caràcter especials.
- Separadors: vigilar que no hi hagi comes dins dels camps.
- Conversió de tipus: Integer.parseInt(), Double.parseDouble(), etc.
- Gestiò d'errors: fitxers buits, camps mal formats, linies incompletes.
