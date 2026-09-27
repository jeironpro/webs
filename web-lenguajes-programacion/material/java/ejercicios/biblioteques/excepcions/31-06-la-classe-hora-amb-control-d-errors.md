# Ejercicios — 31.06 — La classe Hora amb control  d errors

**Enunciat**

Torna a considerar l'exercici hores.

En aquest cas, els setters de la classe Hora tindran control d'error. Aquests mètodes retornaran true quan l'assignació hagi estat possible i false altrament.

El constructor per defecte inincialitzarà la instància a les 0:00:00.

Nota: Si no havies realitzat l'exercici original, per aquest exercici només cal que implementis la classe Hora amb els següents membres:

Per passar les proves, la teva classe haurà de funcionar amb el següent codi:

```java
public class UsaHora {

    public static void main(String[] args) {

        Hora hora = new Hora();

        System.out.println("Inicialment " + hora);

        System.out.println("hores.setHores(-1) -> " + hora.setHores(-1));

        System.out.println("hores.setHores(12) -> " + hora.setHores(12));

        System.out.println("hores.setHores(24) -> " + hora.setHores(24));

        System.out.println("Ara " + hora);

        System.out.println();

        System.out.println("hores.setMinuts(-1) -> " + hora.setMinuts(-1));

        System.out.println("hores.setMinuts(21) -> " + hora.setMinuts(21));

        System.out.println("hores.setMinuts(62) -> " + hora.setMinuts(62));

        System.out.println("Ara " + hora);

        System.out.println();

        System.out.println("hores.setSegons(100) -> " + hora.setSegons(100));

        System.out.println("hores.setSegons(59) -> " + hora.setSegons(59));

        System.out.println("hores.setSegons(-2) -> " + hora.setSegons(-2));

        System.out.println("finalment " + hora);

    }

}
```

El programa anterior haurà de generar la següent sortida:

**Inicialment 0:00:00**
hores.setHores(-1) -> false
hores.setHores(12) -> true
hores.setHores(24) -> false
Ara 12:00:00

**hores.setMinuts(-1) -> false**
hores.setMinuts(21) -> true
hores.setMinuts(62) -> false
Ara 12:21:00

**hores.setSegons(100) -> false**
hores.setSegons(59) -> true
hores.setSegons(-2) -> false
finalment 12:21:59

## Diagrama UML

```{image} /_static/uml/uml-3106laclassehoraambcontrolderrors.png
:alt: Diagrama UML
```
