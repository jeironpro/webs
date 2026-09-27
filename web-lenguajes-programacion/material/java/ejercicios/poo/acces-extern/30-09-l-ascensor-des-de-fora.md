# Ejercicios — 30.09 — L Ascensor des de fora

## Ascensor

**Enunciat**

Desenvolupa un programa a partir de la següent descripció en UML:

El programa, en ser executat, mostrarà la següent sortida:

L'ascensor creat des de fora està al pis -1

Nota: per passar les proves d'aquest exercici, caldrà que Ascensor no tingui main().

```java
public class Ascensor {
    int pis = -1;
}
```

## UsaAscensor

```java
public class UsaAscensor {
    public static void main(String[] args) {
        Ascensor ascensor = new Ascensor();
        System.out.printf("L'ascensor creat des de fora està al pis %d%n", ascensor.pis);
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3009lascensordesdefora.png
:alt: Diagrama UML
```
