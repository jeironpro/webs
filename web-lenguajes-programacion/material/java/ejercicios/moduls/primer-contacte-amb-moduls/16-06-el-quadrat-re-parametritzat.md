# Ejercicios — 16.06 — El quadrat re parametritzat

**Enunciat**

Farem ara una nova versió del quadrat parametritzat. En aquesta ocasió, el programa serà capaç de mostrar un caràcter diferent de X a partir del que main() rebi a args[1]

Per simplificar, pressuposarem també que sempre ens donen aquest segon argument i que ens quedarem amb el primer caràcter.

Una execució d'aquest programa seria:

**java Quadrat 5 Y**
Y Y Y Y Y
Y Y Y Y Y
Y Y Y Y Y
Y Y Y Y Y
Y Y Y Y Y

En cas que el valor del primer argument sigui menor de 1, el programa no mostrarà res.

La nova signatura dels mòduls ara presenta els dos paràmetres:

```java
public static void dibuixaQuadrat(int costat, char caracter)
public static void dibuixaLinia(int costat, char caracter)

public class Quadrat {
    public static void main(String[] args) {
        int valor = Integer.parseInt(args[0]);
        char caracter = args[1].charAt(0);
        dibuixaQuadrat(valor, caracter);
    }

    public static void dibuixaQuadrat(int valor, char caracter) {
        for (int linia = 1; linia <= valor; linia++) {
            dibuixaLinia(valor, caracter);
            System.out.println();
        }
    }

    public static void dibuixaLinia(int valor, char caracter) {
        for (int columna = 1; columna <= valor; columna++) {
            System.out.print(" " + caracter);
        }
    }
}
```
