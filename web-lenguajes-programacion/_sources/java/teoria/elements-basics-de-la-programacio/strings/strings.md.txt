# Strings

**Strings**
Les cadenes de caràcteres es gestionen amb la classe String, que és una de les classes més importants i utilitzades del llenguatge. Les cadenes són objectes immutables, la qual cosa significa que, una vegada creades, no poden ser modificades. Quan parlem de "tipus de tipus" relacionats amb les cadenes, ens referim principalment a com es poden gestionar, comparar i manipular aquests objectes.

- **1.** Característiques principal de String
- Immutabilitat: quan es modifica una cadena, en realitat es crea un nou objecte String. L'objecte original es manté sense canvis.

- Objecte especial: encara que és una classe, es pot tractar com un tipus primitiu en molts casos gràcies al suport del compilador (per exemple, literals com "Hola").

- Literals emmagatzemats al pool de cadenes: els literals de cadena es guarden en una àrea especial de memòria per optimizar l'ús i evitar duplicats.

- **2.** Declaració de cadenes
  Hi ha diverses maneres de declarar i inicialitzar una cadena:
-Amb literals:

```java
String cadena = "Hola, món!";
```

-Amb el constructor String:

```java
String Cadena = new String("Hola, món!");
```

- **3.** Comparació de cadenes
  Com que les cadenes són objectes, comparar-les directament amb l'operador == compara les referències (no el contingut). Per comparar el contingut de les cadenes, s'han d'utilitzar mètodes específics.
- Comparació amb == (compara les referències):

```java
String a = "Hola";
String b = "Hola";
System.out.println(a == b); // True (mateix literal al pool)
```

- Comparació amb equals (compara el contingut):

```java
String a = "hola";
String b = new String("hola");
System.out.println(a.equals(b)); // True (mateix contingut).
```

- Comparació amb compareTo (ordre lexicogràfic):

```java
String a = "Hola";
```

String b = "Adeu"

```java
System.out.println(a.compareTo(b)); // Retorna un nombre positiu, zero o negatiu
```

- **4.** Mètodes comuns de String
  Mètode                                Descripció                                                        exemple
length()                              Retorna la longitud de la cadena.                                 "Hola".length() // 4
charAt(int index)                     Retorna el caràcter en la posició especificada.                   "Hola".charAt(1) // 'o'
substring(int start, int end)         Retorna una subcadena entre les posició start i end.              "Hola".substring(0, 2) // "Ho"
equals(string another)                Compara si dues cadenes són iguals (respecta maj i min).          "hola".equals("Hola") // false
equalsIgnoreCase(String another)      Compara dues cadenes sense tenir en compte maj i min.             "hola".equalsIgnoreCase("Hola") // true
toLowerCase()                         Converteix tota la cadena a minúscules.                           "Hola".toLowerCase() // "hola"
toUpperCase()                         Converteix tota la cadena a majúscules.                           "Hola".toUpperCase() //
"HOLA"
trim()                                Elimina els espais en blanc del inici i del final de la cadena.   "  Hola ".trim() // "Hola"
replace(char oldChar, char newChar)   Substitueix totes les ocurrències d'un caràcter per un altre.     "Hola".replace('o', 'u') // "Hula"
split(String regex)                   Divideix la cadena en un array, utilitzant el patró especificat.  "Hola món".split(" ") // ["Hola", "món"]
contains(CharSequence seq)            Comprova si la cadena conté una altra seqüencia de caràcters.     "Hola món".contais("món") // true
indexOf(String str)                   Retorna la primera posició on es troba la subcadena str.          "Hola món".indexOf("món") // 5

- **5.** Conversions i manipulacions
- Convertir altres tipus a String: es pot fer servir el mètode estàtic String.valueOf() o concatenar amb "".

**Exemples**

```java
int num = 42;
String cadena = String.valueOf(num); // "42"
String cadena2 = num + ""; // "42"
```

- Convertir una cadena a altres tipus: es poden utilitzar mètodes de classes com Integer, Double, etc.

**Exemple**

```java
String cadena = "123";
int valor = Integer.parseInt(cadena); // 123
```

- **6.** Immuntabilitat de les cadenes
  Com que les cadenes són immutables, qualsevol modificació (com concatenar o reemplaçar caràcters) genera un nou objecte String. Això pot tenir un impacte en la memòria si es fan moltes modificacions.

Per treballar amb cadenes modificables, es poden utilitzar les classes StringBuilder o StringBuffer.

- StringBuilder (no sincronitzat, més ràpid per a ús d'un sol fil):

```java
StringBuilder sb = new StringBuilder("Hola");
sb.append(" món");
System.out.println(sb.toString()); // "Hola món"
```

- StringBuffer (sincronitzat, adequat per a ús amb múltiples fils):

```java
StringBuffer sb = new StringBuffer("Hola");
sb.append(" món");
System.out.println(sb.toString()); // "Hola món"
```

**7.Strings al pool de cadenes**
Quan es crea una cadena literal, Java la guarda en una àrea especial de memòria anomenada pool de cadenes. Si es crea una altra cadena literal amb el mateix valor, Java reutilitza l'objecte existent per optimitzar la memòria.

**Exemple**

```java
String a = "Hola";
String b = "Hola";
System.out.println(a == b); // true (mateixa referència al pool)
```

Si ultilitzem new String(), es crea un nou objecte a la memòria, independent del pool.

**Exemple**

```java
String a = new String("Hola");
String b = new String("Hola");
System.out.println(a == b); // false (diferents objectes)
```

- **8.** Ús de String en contextos pràctics
- Composició de missatges:

```java
String nom = "Jeiron";
int edat = 21;
String missatge = "Hola, " + nom + ",  tens " + edat + " anys.";
System.out.println(missatge); // Hola Jeiron, tens 21 anys.
```

- Manipulació de dades d'entrada:

```java
String entrada = "  hola món  ";
System.out.println(entrada.trim().toUpperCase()); // "HOLA MÓN"
```

**Nota**
La classe String és molt poderosa, però quan necessitem modificar cadenes de forma eficient (concatenar o fer moltes operacions), és millor utilitzar StringBuilder o StringBuffer.

-----------------------------------------------------------------------------------------------------------------------------------
String seqüencia de lletres
Un String és essencialment una seqüencia de lletres (o caràcters) que es representen com una cadena de text. És una clsse que permet gestionar i manipular aquesta seqüencia de caràcters de manera fàcil.

- **1.** Represenció d'un String com una seqüencia de lletres
  Internament, un objecte String és una matriu (array) de caràcters.

**Per exemple**

```java
String text = "Hola";
```

**Aquest String es pot veure com una seqüencia de caràcters**
H o l a
0 1 2 3 (indexos)

- **2.** Accedir a les lletres d'un String
  Pots accedir a les lletres o caràcters d'una cadena utilitzant el mètode charAt(int index), que retorna el caràcter en una posició específica.

**Exemple**

```java
String text = "Hola món";
char lletra = text.charAt(0); // Retorna 'H'
System.out.println(lletra); // Mostra: H
```

- Tingues en compte que els índexs comencen des de 0.
- Si intentes accedir a un índex fora dels límits (per exemple, text.charAt(20)), obtindràs una excepció StringIndexOutOfBoundsException.

- **3.** Convensions a altres tipus de seqüencies
  En alguns casos, pot ser útil convertir un String a altres estructures de dades per manipular-lo més fàcilment.

**Convertir un String a un array de caràcters**
El mètode toCharArray() transforma un String en un array de caràcters (char[]).

**Exemple**

```java
String text = "Hola";
char[] lletres = text.toCharArray();
System.out.println(lletres[0]); // Mostra: H
System.out.println(lletres[3]); // Mostra: a
```

- **4.** Operacions comunes amb seqüencies de lletres
  -Comprovar si una lletra existeix en un String
Pot utilitzar el mètode indexOf per trobar la posició d'una lletra (o subcadena). Si retorna -1, vol dir que la lletra no existeix.

**Exemple**

```java
String text = "Hola món";
int posició = text.indexOf('m');
System.out.println(posicio); // Mostra: 5
```

-Comptar el nombre de lletres
Podem recórrer el String per comptar quantes vegades apaereix una lletra específica.

**Exemple**

```java
String text = "Hola món";
char lletraBuscada = 'o';
int contador = 0;

for (int i = 0; i < text.length(); i++) {
    if (text.charAt(i) == lletraBuscada) {
        contador++;
    }
}
System.out.println("La lletra 'o' apareix " + contador + " vegades."); // La lletra 'o' apareix 2 vegades.
```

-Substituir una lletra
Pot substituir una lletra concreta utilitzant el mètode replace.

**Exemple**

```java
String text = "Hola món";
String textModificat = text.replace('o', 'u');
System.out.println(textModificat); // Mostra: Hula món
```

- **6.** Diferència entre String i char
- Un String és una seqüencia de caràcters i es tracta com un objecte.
- Un char és un sol caràcter i és un tipus primitiu.

**Nota**
- Un String és una seqüencia ordenada de caràcters, representada com un objecte immutable.
- Es pot accedir a cada lletra mitjançant el mètode charAt.
- Es poden convertir les cadenes en arrays per manipular-les més facilment.
- Hi ha molts mètodes útils per analitzar, modificar i manipular aquestes seqüencies.

-----------------------------------------------------------------------------------------------------------------------------------
Recorreguts de Strings
Els recorreguts d'un String són una manera d'analitzar, modificar o utilitzar cada caràcter que el forma. En Java, un String és una seqüencia ordenada de caràcters, i per accedir a cadascun d'ells podem utilitzar diferents técniques.

- **1.** Accedir als caràcters d'un String
  Per accedir a cada caràcter d'un String, podem utilitzar el mètode charAt(int index), que retorna el caràcter en la posició especificada. Els indexs comencen des de 0 i arriben fins a la longitud del String menys 1.

**Exemple básics**

```java
String text = "Hola món";
System.out.println(text.charAt(0)); // Mostra: H
System.out.println(text.charAt(4)); // Mostra: (espai)
System.out.println(text.charAt(7)); // Mostra: n
```

- **2.** Recorreguts amb bucles
  2.1 Bucle for per index
Aquest és el mètode més habitual per recórrer un String perquè accedim directament a cada índex.

**Exemple**

```java
String text = "Hola món";
for (int i = 0; i < text.length(); i++) {
    System.out.println("Caràcter a l'index " + i + ": " + text.charAt(i));
}
```

**Sortida**
Caràcter a l'index 0: H
Caràcter a l'index 1: o
Caràcter a l'index 2: l
Caràcter a l'index 3: a
Caràcter a l'index 4:
Caràcter a l'index 5: m
Caràcter a l'index 6: ó
Caràcter a l'index 7: n

**2.2 Bucle for-each amb toCharArray()**
El mètode toCharArray() converteix el String en un array de caràcters (char[]), permetent utilitzar un bucle for-each.

**Exemple**

```java
String text = "Hola món";
for (char lletra : text.toCharArray()) {
    System.out.println(lletra);
}
```

**Sortida**
H
o
l
a

**m**
ó
m

**2.3 Bucle while**
Un bucle while també es pot utilitzar per recórrer un String. Cal una variable que mantingui l'index actual i augmentar-la en cada iteració.

**Exemple**

```java
String text = "Hola món";
int i = 0;

while (i < text.length()) {
    System.out.println("Caràcter a l'index " + i + ": " + text.charAt(i));
    i++;
}
```

**2.4 Bucle amb índex invers (de darrere cap a davant)**
Podem recórrer un String des de l'última lletra fins a la primera, utilitzant un bucle decreixent.

**Exemple**

```java
String text = "Hola món";
for (int i = text.length()-1; i >= 0; i--) {
    System.out.println("Caràcter a l'index " + i + ": " + text.charAt(i));
}
```

- **3.** Operacions comunes durant el recorregut
  3.1 Comptar caràcters específics
Podem comptar quantes vegades apareix un caràcter específics en un String.

**Exemple**

```java
String text = "Hola món";
char cerca = 'o';
int comptador = 0;

for (int i = 0; i < text.length(); i++) {
    if (text.charAt(i) == cerca) {
        comptador++;
    }
}

System.out.println("El caràcter '" + cerca + "' apareix " + comptador + " vegades."); // El caràcter 'o' apareix 2 vegades.
```

**3.2 Substituir caràcters**
Podem recórrer el String i construir un nou String substituint determinats caràcters.

**Exemple**

```java
String text = "Hola món";
char aSubstituir = 'o';
char substitut = 'u';
String resultat = "";

for (int i = 0; i < text.length(); i++) {
    if (text.charAt(i) == aSubstituir) {
        resultat += substitut; // Substitueix 'o' per 'u'
    } else {
        resultat += text.charAt(i); // Manté els altres caràcters
    }
}
System.out.println(resultat); // Hula mún
```

**3.3 Invertir un String**
podem recórrer el String des del final fins al principi per invertir-lo.

**Exemple**

```java
String text = "Hola món";
String invertit = "";

for (int i = text.length()-1; i >= 0; i--) {
    invertit += text.charAt(i);
}
System.out.println(invertit); // nóm aloH
```

**3.4 Eliminar espais en blanc**
Es pot recórrer el String per eliminar els espais en blanc.

**Exemple**

```java
String text = "Hola món";
String senseEspais = "";

for (int i = 0; i < text.length(); i++) {
    if (text.charAt(i) != ' ') {
        senseEspais += text.charAt(i);
    }
}
System.out.println(senseEspais); // Holamón
```

- **4.** Recorreguts avançats amb Streams
  Java permet fer recorreguts més avançants amb l'API de Streams. Això és especialment útil per escriure codi més compacte i funcional.

**Exemple: Filtrar només vocals**

```java
String text = "Hola món";
```

text.chars().filter(c -> "aeiouàèéíòóú".indexOf(c) != -1) // Comprova si és una vocal

```java
.forEach(c -> System.out.println((char) c)); // Converteix cada codi a caràcter
```

**Sortida**
oaó

**Nota**
- Els recorreguts d'un String permeten accedir a cada lletra i realitzar operacions com comptar caràcters, substituir, invertir o filtrar.
- Les opcions més comunes són els bucles (for, while, for-each) i, per a casos avançants, es poden utilitzar Streams.
