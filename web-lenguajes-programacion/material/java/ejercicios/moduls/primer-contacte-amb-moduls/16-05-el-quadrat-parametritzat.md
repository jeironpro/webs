# Ejercicios — 16.05 — El quadrat parametritzat

**Enunciat**

Desenvolupa un programa anomenat Quadrat que esperi un valor enter positiu en args[0] i mostri un quadrat de " X" amb el costat indicat pel valor rebut.

La sortida d'aquest programa quan l'entrada és 5 serà:

**X X X X X**
X X X X X
X X X X X
X X X X X
X X X X X

En cas que el valor rebut sigui menor que 1, no mostrarà res.

```java
public class Quadrat {
    public static void main(String[] args) {
        int valor = Integer.parseInt(args[0]);
        dibuixaQuadrat(valor);
    }

    public static void dibuixaQuadrat(int valor) {
        for (int linia = 1; linia <= valor; linia++) {
            dibuixaLinia(valor);
            System.out.println();
        }
    }

    public static void dibuixaLinia(int valor) {
        for (int columna = 1; columna <= valor; columna++) {
            System.out.print(" X");
        }
    }
}
```
