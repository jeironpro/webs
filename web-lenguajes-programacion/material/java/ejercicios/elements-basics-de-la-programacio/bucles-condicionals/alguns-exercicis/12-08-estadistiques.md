# Ejercicios — 12.08 — Estadistiques

**Enunciat**

Desenvolupa un programa anomenat Estadistiques, que vagi demanant enters positius i que, en el moment que rebi un de negatiu. Un cop finalitzada la càrrega de dades, el programa mostrarà els següents estadístics respecte el que ha rebut:

El valor màxim introduït

Calcula aquest valor com a l'exercici Exercici 12_06. Troba el màxim

El valor mínim introduït

Serà força similar al càlcul de l'estadístic anterior.

La mitjana dels valors introduïts

Calcula aquest valor com a l'exercici Exercici 12_07. La nota mitjana

Un exemple d'execució seria:

**Introdueix un valor**
5
Introdueix un valor
90
Introdueix un valor
73
Introdueix un valor
-1
El mínim és: 5
La mitjana és: 56.0
El màxim és: 90

En cas que no s'hagi introduït cap valor positiu, la resposta final serà "Cap valor vàlid introduït".

```java
public class Estadistiques {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        int valor = Integer.parseInt(Entrada.readLine());

        int minim = valor;
        float sumadorValores = 0;
        int maxim = valor;
        int contadorValores = 0;

        while (valor >= 0) {
            sumadorValores = sumadorValores + valor;
            contadorValores = contadorValores + 1;
            
            if (valor >= maxim) {
                maxim = valor;
            } else if (valor < minim && minim <= maxim) {
                minim = valor;
            }
            
            System.out.println("Introdueix un valor");
            valor = Integer.parseInt(Entrada.readLine());
        }
        System.out.println("El mínim és: " + minim);
        System.out.println("La mitjana és: " + (sumadorValores / contadorValores));
        System.out.println("El màxim és: " + maxim);
    }
}
```
