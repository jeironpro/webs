# Ejercicios — 14.03 — Informe dun caracter

**Enunciat**

Per a analitzar diferents aspectes d'un caràcter, Java ens ofereix una sèrie d'utilitats a partir de Character.

Per exemple, Character.getName() ens indica el nom del caràcter per la codificació Unicode:

```java
jshell> Character.getName('a');
```

1 ==> "LATIN SMALL LETTER A"

D'entre les moltes opcions que ens ofereix Character, en considerarem les següents:

- utilitat
1. getName()
2. isDigit()
3. isJavaIdentifierStart()
4. isJavaIdentifierPart()
5. isLetter()
6. isLowerCase()
7. isUpperCase()
8. isWhitespace()
9. toLowerCase()
10. toUpperCase()

- descripció
1. nom del caràcter
2. boolean que indica si és o no un dígit
3. boolean que indica si pot ser o no l'inici d'un identificador vàlid per Java
4. boolean que indica si pot ser o no part d'un identificador vàlid de Java (sense considerar el caràcter inicial)
5. boolean que indica si correspon o no a una lletra
6. boolean que indica si està o no en minúscules
7. boolean que indica si està o no en majúscules
8. boolean que indica si correspon o no amb un espai blanc
9. retorna la versió del caràcter com a minúscules
10. retorna la versió del caràcter com a majúscules

**Què hem de fer?**
Desenvolupa un programa que demani un text i un número per entrada estàndard. A partir del caracter de la posició indicada pel segon valor, el programa composarà un petit informe amb el resultat de les funcions anteriors.

Una simulació d'execució seria:

**Text?**
Hola!
Posició?
0
Character.getName('H'): LATIN CAPITAL LETTER H
Character.isDigit('H'): false
Character.isJavaIdentifierStart('H'): true
Character.isJavaIdentifierPart('H'): true
Character.isLetter('H'): true
Character.isLowerCase('H'): false
Character.isUpperCase('H'): true
Character.isWhitespace('H'): false
Character.toLowerCase('H'): h
Character.toUpperCase('H'): H

Pot suposar que a posició sempre s'introduirà un enter.

En cas que no hi hagi cap caràcter al text introduït, el programa finalitzarà amb el missatge "Error".

En cas que la posició introduida no sigui vàlida, el programa finalitzarà amb el missatge "Fora de rang".

Nota: La gràcia és que vegis com es comporta cada utilitat quan li dónes diferents valors i no tant que passis les proves.

```java
public class InformeCaracter {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        if (!text.isEmpty()) {
            System.out.println("Posició?");
            int posicio = Integer.parseInt(Entrada.readLine());

            if (posicio >= 0 && posicio <= text.length()) {
                System.out.println("Character.getName(" + "'" + text.charAt(posicio) + "'): " + Character.getName(text.charAt(posicio)));
                System.out.println("Character.isDigit(" + "'" + text.charAt(posicio) + "'): " + Character.isDigit(text.charAt(posicio)));
                System.out.println("Character.isJavaIdentifierStart(" + "'" + text.charAt(posicio) + "'): " + Character.isJavaIdentifierStart(text.charAt(posicio)));
                System.out.println("Character.isJavaIdentifierPart(" + "'" + text.charAt(posicio) + "'): " + Character.isJavaIdentifierPart(text.charAt(posicio)));
                System.out.println("Character.isLetter(" + "'" + text.charAt(posicio) + "'): " + Character.isLetter(text.charAt(posicio)));
                System.out.println("Character.isLowerCase(" + "'" + text.charAt(posicio) + "'): " + Character.isLowerCase(text.charAt(posicio)));
                System.out.println("Character.isUpperCase(" + "'" + text.charAt(posicio) + "'): " + Character.isUpperCase(text.charAt(posicio)));
                System.out.println("Character.isWhitespace(" + "'" + text.charAt(posicio) + "'): " + Character.isWhitespace(text.charAt(posicio)));
                System.out.println("Character.toLowerCase(" + "'" + text.charAt(posicio) + "'): " + Character.toLowerCase(text.charAt(posicio)));
                System.out.println("Character.toUpperCase(" + "'" + text.charAt(posicio) + "'): " + Character.toUpperCase(text.charAt(posicio)));
            } else {
                System.out.println("La posició està fora de rang");
            }
        } else {
            System.out.println("Text buit");
        }

    }
}
```
