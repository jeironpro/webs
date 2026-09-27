# Ejercicios — 30.07 — Molts ascensors

**Enunciat**

Desenvolupa una nova versió de Ascensor

En aquesta ocasió disposarà d'una funció anomenada creaAscensorsEnEscala() que rebrà un nombre d'ascensors i retornarà un array amb el nombre d'ascensors especificat de manera que cada ascensor estarà en el pis indicat per la seva posició a l'array.

El main() decidirà a partir del valor que rebi en el primer argument de línia de comandes, quants ascensors crea, cridarà a creaAscensorsEnEscala() i mostrarà els pisos de tots els ascensors creats.

Completa aquesta plantilla:

/* XXX

```java
/* public class Ascensor {

    /* XXX */

    /* public static Ascensor[] creaAscensorsEnEscala(int quants) {

        /* XXX */

    /* }

    public static void main(String[] args){

        /* XXX */

        /* Ascensor[] ascensors = creaAscensorsEnEscala(quants);

        for (int i = 0; i < ascensors.length; i++) {

            System.out.printf("Ascensor %d al pis %d%n", i, ascensors[i].pis);

        }

    }

}

Quan el programa rebi el valor 3, la sortida serà:

Ascensor 0 al pis 0
Ascensor 1 al pis 1
Ascensor 2 al pis 2

El prgtest indicarà el missatge esperat en cas que el programa no rebi un enter com a únic argument per línia de comandes.
*/

public class Ascensor {
    int pis;

    public static Ascensor[] creaAscensorEnEscala(int quants) {
        Ascensor[] ascensors = new Ascensor[quants];
        for (int i = 0; i < ascensors.length; i++) {
            ascensors[i] = new Ascensor();
            ascensors[i].pis = i;
        }
        return ascensors;
    }

    public static void main(String[] args) {
        int quants = Integer.parseInt(args[0]);

        Ascensor[] ascensors = creaAscensorEnEscala(quants);

        for (int i = 0; i < ascensors.length; i++) {
            System.out.printf("Ascensor %d al pis %d%n", i, ascensors[i].pis);
        }
    }
}
```
