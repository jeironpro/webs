# Ejercicios — 18.07 — Enters entre comes (v3)

**Enunciat**

Una nova versió del programa enters entre comes.

En aquesta ocasió, el programa tindrà les següents modificacions:

Inicialment demanarà als usuaris quants valors vol introduir.

A continuació, llegirà els valors indicats.

Finalment, mostrarà els valors llegits separats per comes.

Podem seguir suposant que els valors d'entrada seran enters. A més, podem suposar que ens donaran tants enters com ens indiquin.

Fes servir els missatges del prgtest per acabar de concretar els detalls.

```java
public class EntersEntreComes {
    public static void main(String[] args) {
        System.out.println("Quants?");
        int valors = Integer.parseInt(Entrada.readLine());

        if (valors > 0) {
            int[] numeros = new int[valors];
        
            int numValor = 0;

            while (numValor < valors) { 
                System.out.printf("Valor %d?%n", numValor+1);
                numeros[numValor] = Integer.parseInt(Entrada.readLine());
                numValor++;
            }
            
            System.out.print(numeros[0]);
            for (int i = 1; i < numeros.length; i++) {
                System.out.print(", " + numeros[i]);
            }
            System.out.println();
        } else {
            System.out.println("Res a fer");
        }
    }
}
```
