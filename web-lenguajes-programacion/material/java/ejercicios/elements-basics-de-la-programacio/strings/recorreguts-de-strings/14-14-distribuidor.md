# Ejercicios — 14.14 — Distribuidor

**Enunciat**

Desenvolupa un programa anomenat Distribuidor, que implementi un lloro am finalització una cadena buida.

El lloro anirà distribuint els diferents caracters que vagi rebent en quatre cadenes: una de consonants, una altra per les vocals, una de números i una d'altres símbols. Els guardarà en l'ordre en que els rep però sense repetits.

Finalment, mostrarà els resultats.

Tingues en compte:

Com a vocals, considerarem les vocals catalanes: à, a, è, e, é, i, ï, ò, o, ó, u, ú i ü.

Dels símbols no considerarem l'espai.

Les lletres es mostraran en majúscules.

En cas que no s'hagi trobat cap caracter per alguna de les categories, no es mostarà res sobre aquesta.

Un exemple d'execució:

**Introduïu texts (INTRO per finalitzar)**
Bon dia!
El meu aniversari és el 22 de febrer de 1971.

**Vocals: IOUÏEA**
Consonants: NTRDXSPRFLZBMV
Nombres: 2197
Símbols: ()!.

```java
public class Distribuidor {
    public static void main(String[] args) {
        System.out.println("Introduïu texts (INTRO per finalitzar)");
        String text = "true";
        String vocalsAccept = "àaèeéiïòoóuúü";
        String vocals = "";
        String consonants = "";
        String nombres = "";
        String simbols = "";

        while (!text.isEmpty()) {
            text = Entrada.readLine();
            for (int i = 0; i < text.length(); i++) {
                boolean esVocal = false;
                char c = text.charAt(i);
                for (int j = 0; j < vocalsAccept.length(); j++) {
                    if (Character.toLowerCase(c) == vocalsAccept.charAt(j)) {
                        esVocal = true;
                    }
                }
                if (esVocal) {
                    if (!vocals.contains(String.valueOf(Character.toUpperCase(c)))) {
                        vocals += Character.toUpperCase(c);
                    }
                } else if (Character.isLetter(c)) {
                    if (!consonants.contains(String.valueOf(Character.toUpperCase(c)))) {
                        consonants += Character.toUpperCase(c);
                    }
                } else if (Character.isDigit(c)) {
                    if (!nombres.contains(String.valueOf(Character.toUpperCase(c)))) {
                        nombres += c;
                    }
                } else {
                    if (!Character.isWhitespace(c)) {
                        if (!simbols.contains(String.valueOf(Character.toUpperCase(c)))) {
                            simbols += c;
                        }
                    }
                }
            }
        }
        if (vocals.length() > 0) {
            System.out.println("Vocals: " + vocals);
        }
        if (consonants.length() > 0) {
            System.out.println("Consonants: " + consonants);
        }
        if (nombres.length() > 0) {
            System.out.println("Nombres: " + nombres);
        }
        if (simbols.length() > 0) {
            System.out.println("Símbols: " + simbols);
        }
    }
}
```
