# Ejercicios — 14.15 — Seccio dun String

**Enunciat**

Considerem novament Exercici 13_10. Enters dins d'un interval

En aquella ocasió el programa demanava els valors límit entre dos enters. Amb unes petites modificacions podríem crear un nou programa que ens permetés veure una secció d'un String

Doncs això és el que ens demana aquest exercici. En concret, l'enunciat és el següent: desenvolupa un programa anomenat MostraInterval que demani un text i dos valors enters, i que mostri tots els caràcters que hi ha entre el primer i el segon, en l'ordre marcat per l'entrada.

En cas que els valors enters quedin fora de les posicions del text introduït, el programa mostrarà tot el que es pugui sense queixar-se.

Considera les següents simulacions:

**text?**
Java rocks
inici?
5
final?
7
r
o
c

**text?**
Java rocks
inici?
7
final?
5
c
o
r

**text?**
Java rocks
inici?
5
final?
1000
r
o
c
k
s

```java
public class MostraInterval {
    public static void main(String[] args) {
        System.out.println("text?");
        String text = Entrada.readLine();
        
        System.out.println("inici?");
        int inici = Integer.parseInt(Entrada.readLine());

        System.out.println("final?");
        int finall = Integer.parseInt(Entrada.readLine());

        if (inici >= text.length()) {
            inici = text.length()-1;
        }
        if (inici < 0) {
            inici = 0;
        }
        if (finall >= text.length()) {
            finall = text.length()-1;
        }
        if (finall < 0) {
            finall = 0;
        }
        if (inici < finall) {
            for (int i = inici; i <= finall; i++) {
                System.out.println(text.charAt(i));
            }
        } else { 
            for (int i = inici; i >= finall; i--) {
                System.out.println(text.charAt(i));
            }
        }
    }
}
```
