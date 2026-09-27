# Ejercicios — 11.11 — Tres en ordre

**Enunciat**

Desenvolupa un programa que demani tres números i escrigui els tres números ordenats creixentment (de menor a major).

Exemple d'interacció:

**java TresEnOrdre**
Primer?
3
Segon?
4
Tercer?
2
2, 3 i 4

```java
public class TresEnOrdre {
    public static void main(String[] args) {
        System.out.println("Primer?");
        int primer = Integer.parseInt(Entrada.readLine());

        System.out.println("Segon?");
        int segon = Integer.parseInt(Entrada.readLine());

        System.out.println("Tercer?");
        int tercer = Integer.parseInt(Entrada.readLine());

        /*if (primer <= segon && segon <= tercer) {
            System.out.println(primer + ", " + segon + " i " + tercer);
        } else if (primer <= tercer && tercer <= segon) {
            System.out.println(primer + ", " + tercer + " i " + segon);
        } else if (segon <= primer && primer <= tercer) {
            System.out.println(segon + ", " + primer + " i " + tercer);
        } else if (segon <= tercer && tercer <= primer) {
            System.out.println(segon + ", " + tercer + " i " + primer);
        } else if (tercer <= primer && primer <= segon) {
            System.out.println(tercer + ", " + primer + " i " + segon);
        } else {
            System.out.println(tercer + ", " + segon + " i " + primer);
        }*/

        if (primer <= segon) {
            if (primer <= tercer) {
                System.out.println(primer + ", " + segon + " i " + tercer);
            } else {
                System.out.println(tercer + ", " + primer + " i " + segon);
            }
        } else if (segon <= tercer) {
            System.out.println(segon + ", " + tercer + " i " + primer);
        } else {
            System.out.println(tercer + ", " + segon + " i " + primer);
        }
    }
}
```
