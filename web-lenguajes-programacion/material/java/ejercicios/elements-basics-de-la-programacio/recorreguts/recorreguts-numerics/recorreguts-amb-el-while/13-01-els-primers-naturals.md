# Ejercicios — 13.01 — Els primers naturals

**Enunciat**

Desenvolupa un programa anomenat Naturals que rebi per línia de comandes un número i mostri tots els valors enters positius entre el 1 i aquest número.

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

Nota: Resol aquest exercici amb while.

Pista: Tens pràcticament resolt l'exercici als apunts!

```java
public class Naturals {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        int valor = Integer.parseInt(Entrada.readLine());
        int contador = 0;

        while (contador < valor){
            contador++;
            System.out.println(contador);
        }
    }
}
```
