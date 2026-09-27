# Ejercicios — 18.06 — Enters entre comes (v2)

**Enunciat**

Una nova versió del programa enters entre comes>

En aquesta ocasió, el programa tindrà les següents modificacions:

Els valors de l'array en comptes de ser assignats des del programa, els especificaran els usuaris del programa.

De moment suposarem que els valors d'entrada són sempre enters vàlids.

En comptes de 3 valors a l'array, n'hi haurà 5

Una simulació d'execució seria:

**Valor 1?**
1
Valor 2?
2
Valor 3?
3
Valor 4?
4
Valor 5?
5
1, 2, 3, 4, 5

Pots assumir que els valors que rebrà el programa seran sempre cinc enters.

```java
public class EntersEntreComes {
    public static void main(String[] args) {
        int[] numeros = new int[5];

        int numValor = 0;

        while (numValor < 5) { 
            System.out.printf("Valor %d?%n", numValor+1);
            numeros[numValor] = Integer.parseInt(Entrada.readLine());
            numValor++;
        }

        System.out.print(numeros[0]);
        for (int i = 1; i < numeros.length; i++) {
            System.out.print(", " + numeros[i]);
        }
        System.out.println();
    }
}
```
