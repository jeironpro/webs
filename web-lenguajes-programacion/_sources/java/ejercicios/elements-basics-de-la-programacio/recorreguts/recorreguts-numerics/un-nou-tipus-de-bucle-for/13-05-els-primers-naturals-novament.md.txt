# Ejercicios — 13.05 — Els primers naturals novament

**Enunciat**

Crea una nova versió d'aquest exercici; aquest cop amb el bucle for.
Desenvolupa un programa anomenat Naturals que rebi per línia de comandes un número i mostri tots els valors enters positius entre el 1 iaquest número.

En cas que li passem un número per sota de 1, el programa mostrarà el missatge: "Cap valor creixent entre 1 i «número introduït»"

Per exemple, si li passem el valor 10 com a primer argument de la línia de comandes, el programa ens mostrarà:

**1**
2
3
4
5
6
7
8
9
10

Manté el nom del programa.

Pista: Si no el tens encara, fes primer l'exercici original amb while, copia el codi a la carpeta d'aquest exercici i transforma el while en for. El tens directament als apunts!

```java
public class Naturals {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        int valor = Integer.parseInt(Entrada.readLine());

        for (int i = 1; i <= valor; i++) {
            System.out.println(i);
        }
    }
}
```
