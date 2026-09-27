# Ejercicios — 16.04 — El lloro quadrat

**Enunciat**

Desenvolupa el programa LloroQuadrat que implementi una versió del lloro que, com és tradicional, vagi demanant texts i els repeteixi fins que arribi un text en blanc o buit.

En aquesta versió, no obstant, si el text que rep és "dibuixa quadrat" o "dibuixa rectangle", en comptes de repetir el text, dibuixarà el quadrat o el rectangle corresponent.

En finalitzar, s'acomiadarà amb el tradicional "Adéu"

Un exemple d'interacció:

**El lloro espera paraula**
hola
El lloro repeteix: hola
El lloro espera paraula:
dibuixa quadrat
X X X X X
X X X X X
X X X X X
X X X X X
X X X X X
El lloro espera paraula:
què xulo!
El lloro repeteix: què xulo!
El lloro espera paraula:
dibuixa rectangle
X X X X X X X X X X
X X X X X X X X X X
X X X X X X X X X X
X X X X X X X X X X
X X X X X X X X X X
El lloro espera paraula:
m'encanta
El lloro repeteix: m'encanta
El lloro espera paraula:

Adéu

Per descomptat, pots fer servir mòduls per resoldre'l. És el que espero! Però també et recomano que intentis fer una versió no modular per comparar

```java
public class LloroQuadrat {
    public static void main(String[] args) {
        while(true) {
            System.out.println("El lloro espera paraula:");
            String paraula = Entrada.readLine();

            if (paraula.isEmpty()) {
                break;
            } else if (paraula.equals("dibuixa quadrat")) {
                dibuixaQuadrat();
            } else if (paraula.equals("dibuixa rectangle")) {
                dibuixaRectangle();
            } else {
                System.out.println("El lloro repeteix: " + paraula);
            }
        }
        System.out.println("Adéu");
    }

    public static void dibuixaRectangle() {
        for (int linia = 1; linia <= 5; linia++) {
            dibuixaLinia();
            dibuixaLinia();
            System.out.println();
        }
    }

    public static void dibuixaQuadrat() {
        for (int linia = 1; linia <= 5; linia++) {
            dibuixaLinia();
            System.out.println();
        }
    }

    public static void dibuixaLinia() {
        for (int columna = 1; columna <= 5; columna++) {
            System.out.print(" X");
        }
    }
}
```
