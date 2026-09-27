# Ejercicios — 12.03 — Suma notes

**Enunciat**

En aquesta ocasió, desenvolupa un programa que demani les notes que han obtingut els alumnes de la teva classe

El programa anirà demanant notes mentre les que rebi siguin valors entre el 0 i el 100 (ambdós inclosos). Un cop rebi un valor fora del rang, deixarà de demanar més i mostrarà el valor resultant.

Anomena el programa SumaNotes.

Una simulació de l'execució podria ser:

**Introdueix una nota**
5
Introdueix una nota
90
Introdueix una nota
73
Introdueix una nota
123
La suma de les notes vàlides és 168

Pista: considera el programa SumaPositius que hem vist als apunts i planteja't quina podria ser la nova condició del bucle.

```java
public class SumaNotes {
    public static void main(String[] args) {
        int nota = 0;
        int sumador = 0;

        while (nota >= 0 && nota <= 100) {
            System.out.println("Introdueix una nota");
            nota = Integer.parseInt(Entrada.readLine());

            if (nota >= 0 && nota <= 100) {
                sumador = sumador + nota;
            }
        }
        System.out.println("La suma de les notes vàlides és " + sumador);
    }
}
```
