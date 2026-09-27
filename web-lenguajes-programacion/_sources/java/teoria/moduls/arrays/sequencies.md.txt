# Sequencies

**Seqüencies de caràcters**
En Java, una seqüencia de caràcters es representa amb la interfície CharSequence, que defineix com es poden manipular i accedir als caràcters d'un text.

**Implementacions principals de CharSequence**
Les classes més comunes que implementen CharSequence són:
1. String -> cadena immutable.
2. StringBuilder -> cadena modificable, més eficient en operacions de concatenació.
3. StringBuffer -> similar a StringBuilder, però amb suport per a fils (threads).

**Exemple bàsic**

```java
public class Exemple {
    public static void main(String[] args) {
        CharSequence seq1 = "Hola";  // String
        CharSequence seq2 = new StringBuilder("Món");  // StringBuilder

        System.out.println(seq1.length());  // 4
        System.out.println(seq2.charAt(1));  // 'ó'
    }
}
```

Aventatge de CharSequence: permet treballar amb diferents tipus de cadenes de manera genèrica.

**Seqüencia de control d'execució**
En Java, la seqüencia de control d'execució defineix l'ordre en què s'executen les instruccions d'un programa.

**Tipus de control d'execució**
1. Execució seqüencial -> instruccions executables en ordre.

- **2.** Estructures de control:
- Condicionals (if, switch) -> alteren el flux segons una condició.
- Iteracions (for, while, do-while) -> repeteixen instruccions.
- Salt (break, continue, return) -> modifiquen el flux dins de bucles o mètodes.

- **3.** Crida a métodes -> canvia l'execució a un altre bloc de codi.

**Exemple bàsic**

```java
public class Exemple {
    public static void main(String[] args) {
        System.out.println("Inici");  // 1️

        int x = 10;
        if (x > 5) {  // 2️ Condició
            System.out.println("X és més gran que 5");
        }

        for (int i = 0; i < 3; i++) {  // 3️ Iteració
            System.out.println("Iteració: " + i);
        }

        System.out.println("Fi");  // 4️
    }
}
```

Ordre d'execució: Inici -> condició -> iteració (3 vegades) -> fi.

**Notes**
1. CharSequence és la interfície per representar seqüencies de caràcters en Java.

- **2.** String, StringBuilder i StringBuffer són implementacions de CharSequence.

- **3.** L'ordre d'execució d'un programa segueix un flux seqüencial, modificat per estructures de control i crides a mètodes.
