# Ejercicios — 30.11 — L ascensor te moviment

## Ascensor

**Enunciat**

Implementa els canvis necessaris per la classe Ascensor segons el següent diagrama UML:

Com veus, l'ascensor disposarà de moviment. Inicialment l'ascensor estarà aturat. Altres moviments seran pujant i baixant.

El programa, en ser executat, mostrarà la següent sortida:

**Pis inicial: -1**
Moviment inicial: aturat
Moviment final: pujant

Nota: assegura't que indiques les propietats com a públiques.

```java
public class Ascensor {
    public int pis = -1;
    public String moviment = "aturat";
}
```

## UsaAscensor

```java
public class UsaAscensor {
    public static void main(String[] args) {
        Ascensor ascensor = new Ascensor();

        System.out.printf("Pis inicial: %d%n", ascensor.pis);
        System.out.printf("Moviment inicial: %s%n", ascensor.moviment);
        ascensor.moviment = "pujant";
        System.out.printf("Moviment final: %s%n", ascensor.moviment);
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3011lascensortemoviment.png
:alt: Diagrama UML
```
