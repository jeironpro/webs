# Ejercicios — 11.06 — El classificador dautocaravanes

**Enunciat**

El mercat de les autocaravanes, aquests habitables amb rodes, està cada cop més actiu.

El nostre client, una ben posicionat concessionari d'autocaravanes, ha contractat al nostre equip el desenvolupament d'una aplicació per gestionar la seva activitat.

A tu t'han assignat el desenvolupament d'un programa que classifiqui les autocaravanes segons preu, en les categories: econòmica, general i de luxe.

Les autocaravanes per sota dels 50.000€ es consideren econòmiques, mentre que les generals superarien aquest preu fins un màxim de 175.000€. A partir d'aquí, l'autocaravana es considerarà de luxe. Les de luxe tenen un preu potser una mica elevat, sí, però… has pensat tot el que fardaràs amb una d'elles?

El programa que has desenvolupar, recollirà el preu a partir de la línia de comandes i es limitarà a retornar la categoria a partir del preu, per sortida estàndard.

Considera les següents simulacions d'execució:

**java ClassificaCaravana 35000**
Econòmica

**java ClassificaCaravana 75000**
General

**java ClassificaCaravana 325500**
Luxe

Pots suposar que sempre rebrà un valor enter.

```java
public class ClassificaCaravana {
    public static void main(String[] args) {
        int preu = Integer.parseInt(args[0]);

        if (preu < 50000) {
            System.out.println("Econòmica");
        } else if (preu > 50000 && preu <= 175000) {
            System.out.println("General");
        } else {
            System.out.println("Luxe");
        }
    }
}
```
