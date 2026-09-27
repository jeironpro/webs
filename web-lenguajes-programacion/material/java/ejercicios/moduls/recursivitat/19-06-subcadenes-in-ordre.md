# Ejercicios — 19.06 — Subcadenes in ordre

**Enunciat**

En aquesta ocasió, desenvoluparàs un programa que obtindrà un text per entrada estàndard i mostrarà per sortida estàndard totes les subcadenes possibles, tenint en comptes només les lletres.

Per mostrar l'ordre requerit per aquest exercici, caldrà que implementis el següent algorisme recursiu:

Si la cadena d'entrada té una longitud menor o igual a 1, es mostra la cadena sencera i s'acaba

Si la cadena té una longitud més gran que 1, llavors:

Primer es mostren les subcadenes corresponents a la primera meitat de la cadena

A continuació es mostra la cadena

Finalment es mostren les subcadenes corresponents a la resta de la cadena

Caldrà que la teva solució no faci servir cap estructura de bucle iteratiu (for while)

Considera la següent simulació:

**java Subcadenes**
Text?
Java Rocks!
1: J
2: Ja
1: a
4: Java
1: v
2: va
1: a
9: JavaRocks
1: R
2: Ro
1: o
5: Rocks
1: c
3: cks
1: k
2: ks
1: s

Nota

A aquest ordre se li diu in-ordre. Hi pots trobar més informació, per exemple aquí

```java
public class Subcadenes {
   public static void main(String[] args) {
      System.out.println("Text?");
      String text = Entrada.readLine();

      if (text.length() <= 1) {
          System.out.println(text);
      } else {
          text = netejaEspais(text);
         inOrdre(text, 0, text.length());
      }
   }

   public static void inOrdre(String text, int ini, int fi) {
      if (text.isEmpty() || fi - ini <= 0) return;
      
      String midText = text.substring(ini, fi);

      int meitat = (ini + fi) / 2;

      if (meitat < fi) inOrdre(text, ini, meitat);

      System.out.printf("%4d: %s%n", midText.length(), midText);
      
      if (meitat > ini) inOrdre(text, meitat, fi);
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
