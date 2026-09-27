# Ejercicios — 30.05 — L ascensor puja un pis

**Enunciat**

Afegeix el següent procediment al codi de l'ascensor definit a l'exercici anterior:

```java
public static void puja(Ascensor ascensor)
```

Aquest procediment incrementarà en un el pis en que es troba l'ascensor que rep.

Et passo la plantilla amb el main() perquè el prgtest et deixi passar.

```java
public class Ascensor {
```

**// XXX**

```java
    public static void puja(Ascensor ascensor) {
```

// XXX

```java
    }
    public static void main(String[] args){
```

// XXX

```java
        System.out.println("L'ascensor inicialment està a la planta " + ascensor.pis);
        puja(ascensor);
        System.out.println("L'ascensor finalment està a la planta " + ascensor.pis);
    }
}
```

El programa, en ser executat, mostrarà la següent sortida:

**L'ascensor inicialment està a la planta -1**
L'ascensor finalment està a la planta 0

```java
public class Ascensor {
    int pis = -1;
    public static void puja(Ascensor ascensor) {
        ascensor.pis = ascensor.pis + 1;
    }
    public static void main(String[] args){
        Ascensor ascensor = new Ascensor();
        System.out.println("L'ascensor inicialment està a la planta " + ascensor.pis);
        puja(ascensor);
        System.out.println("L'ascensor finalment està a la planta " + ascensor.pis);
    }
}
```
