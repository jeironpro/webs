# Ejercicios — 30.03 — L ascensor esta al primer pis

**Enunciat**

En aquest exercici implementarem un ascensor.

De moment del nostre ascensor només ens interessarà saber en quin pis es troba.

Codificarem els pisos amb un enter i inicialment l'ascensor es trobarà a la planta -1 que correspondria al soterrani de l'edifici.

Implementa aquesta classe seguint l'exemple del gat Renat vist als apunts.

Inclou un main() que declari una instància d'ascensor i mostri el pis en que es troba

El programa, en ser executat, mostrarà la següent sortida:

L'ascensor està a la planta -1

```java
public class Ascensor {
    int pis = -1;

    public static void main(String[] args) {
        Ascensor ascensor = new Ascensor();

        System.out.printf("L'ascensor està a la planta %d%n", ascensor.pis);
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3003lascensorestaalprimerpis.png
:alt: Diagrama UML
```
