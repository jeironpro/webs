# Ejercicios — 12.04 — Quants parells

**Enunciat**

Desenvolupa un programa que vagi demanant enters positius i que, en el moment que rebi un de negatiu, mostri el nombre de valors parells introduïts i finalitzi l'execució.

El programa es dirà QuantsParells.

Un exemple d'execució seria:

**Introdueix un valor**
2
Introdueix un valor
5
Introdueix un valor
4
Introdueix un valor
-1
Nombre de parells introduïts: 2

Pista: Et proposo que abans de seguir llegint aquesta pista, intentis pensar la solució pel teu compte. Només continua llegint si et quedes sense idees.

Declara la variable corresponent al comptador. No oblidis inicialitzar-la adequadament! Dins del bloc del bucle només has de sumar-li un al comptador quan el valor introduït sigui parell (recorda el mòdul)

```java
public class QuantsParells {
    public static void main(String[] args) {
        int valor = 0;
        int contadorParell = 0;

        while (valor >= 0) {
            System.out.println("Introdueix un valor");
            valor = Integer.parseInt(Entrada.readLine());

            if (valor >= 0) {
                if (valor % 2 == 0) {
                    contadorParell += 1;
                }
            }
        }
        System.out.println("Nombre de parell introduïts: " + contadorParell);
    }
}
```
