# Ejercicios — 43.02 — La coordenada Y de Punt

## Punt

```java
public class Punt {
    private int x;
    private int y;

    public int getX() {
        return 0;
    }

    public int getY() {
        return 0;
    }
}
```

## TestPunt

**Enunciat**

De la mateixa manera que hem fet amb X, afegeix getY() a Punt.

Inicialment desenvolupa un nou test a TestPunt. Potser el podràs anomenar constructorDefecteYZero().

Un cop comprovat que no compila, amplia Punt amb el mètode getY() que retorna 0.

Aconsegueix que el teu codi passi totes teves les proves, incloent constructorDefecteYZero().

Per passar les proves del prgtest caldrà a més que executi correctament el següent codi:

```java
 public class UsaPunt {

     public static void main(String[] args){

         Punt punt = new Punt();

         System.out.printf("punt.getX() -> %d%n", punt.getX());

         System.out.printf("punt.getY() -> %d%n", punt.getY());

     }

 }
```

El resultat ha de ser:

**java UsaPunt**
punt.getX() -> 0
punt.getY() -> 0

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TestPunt {
    @Test
    void constructor() {
        new Punt();
    }
    
    @Test
    void constructorDefecteXZero() {
        Punt p = new Punt();

        assertEquals(0, p.getX());
    }

    @Test
    void constructorDefecteYZero() {
        Punt p = new Punt();

        assertEquals(0, p.getX());
    }
}
```

## UsaPunt

```java
public class UsaPunt {
    public static void main(String[] args){
        Punt punt = new Punt();
        System.out.printf("punt.getX() -> %d%n", punt.getX());
        System.out.printf("punt.getY() -> %d%n", punt.getY());
    }
}
```
