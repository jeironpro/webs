# Ejercicios — 19.05 — Subcadenes post ordre

**Enunciat**

En aquesta ocasió, desenvoluparàs un programa que obtindrà un text per entrada estàndard i mostrarà per sortida estàndard totes les subcadenes possibles, tenint en comptes només les lletres.

Per mostrar l'ordre requerit per aquest exercici, caldrà que implementis el següent algorisme recursiu:

Si la cadena d'entrada té una longitud menor o igual a 1, es mostra la cadena sencera i s'acaba

Si la cadena té una longitud més gran que 1, llavors:

Primer es mostren les subcadenes corresponents a la primera meitat de la cadena

A continuació es mostren les subcadenes corresponents a la resta de la cadena

Finalment es mostra la cadena

Caldrà que la teva solució no faci servir cap estructura de bucle iteratiu (for while)

Considera la següent simulació:

**java Subcadenes**
Text?
Java Rocks Mazo!
1: J
1: a
1: v
2: av
3: Jav
1: a
1: R
1: o
2: Ro
3: aRo
6: JavaRo
1: c
1: k
1: s
2: ks
3: cks
1: M
1: a
2: Ma
1: z
1: o
2: zo
4: Mazo
7: cksMazo
13: JavaRocksMazo

Nota

A aquest ordre se li diu post-ordre. Hi pots trobar més informació, per exemple aquí

```java
public class Subcadenes {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        if (text.length() <= 1) {
            System.out.println(text);
        } else {
            text = netejaEspais(text);
            postOrdre(text, 0, text.length());
        }
    }

    public static void postOrdre(String text, int ini, int fi) {
        if (text.isEmpty() || fi - ini <= 0) return; 
        
        String midText = text.substring(ini, fi);

        int meitat = (ini + fi) / 2;

        if (meitat < fi) postOrdre(text, ini, meitat);

        if (meitat > ini) postOrdre(text, meitat, fi);

        System.out.printf("%4d: %s%n", midText.length(), midText);
    }

    public static String netejaEspais(String text) {
        if (text.isEmpty()) return text;

        String nouText = "";

        char primer = text.charAt(0);
        if (Character.isLetter(primer)) {
            nouText += primer;
        }

        nouText += netejaEspais(text.substring(1));
        return nouText;
    }
}
```
