# Ejercicios — 11.15 — El nombre de fills

**Enunciat**

Desevolupa un progama que demani quants fills tenen els usuaris i respongui segons el nombre de fills sigui:

menys de 0: No pots tenir menys de 0 fills!

0: Tot el que t'has estalviat en bolquers!

1: Compte de no mimar-lo massa!

entre 1 i 5 (no inclosos): No t'avorreixes a casa, eh?

més de 4: Tu sí fas país!

Exemple d'interacció:

**java Fills**
Quants fills tens?
1
Compte de no mimar-lo massa!

```java
public class Fills {
    public static void main(String[] args) {
        System.out.println("Quants fills tens");
        int fills = Integer.parseInt(Entrada.readLine());

        if (fills < 0) {
            System.out.println("No pots tenir menys de 0 fills!");
        } else if (fills == 0) {
            System.out.println("Tot el que t'has estalviat en bolquers!");
        } else if (fills == 1) {
            System.out.println("Compte de no mimar-lo massa!");
        } else if (fills > 1 && fills < 5) {
            System.out.println("No t'avorreixes a casa, eh?");
        } else {
            System.out.println("Tu sí fas país!");
        }
    }
}
```
