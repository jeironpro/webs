# Ejercicios — 12.06 — Troba el maxim

**Enunciat**

Desenvolupa un programa anomenat TrobaMaxim, que vagi demanant enters positius i que, en el moment que rebi un de negatiu, mostri el valor màxim positiu introduït i finalitzi l'execució.

Un exemple d'execució seria:

**Introdueix un valor**
12
Introdueix un valor
10
Introdueix un valor
24
Introdueix un valor
-1
El màxim és 24

En cas que no s'hagi introduït cap valor positiu, la resposta final serà 0.

Pista: Et proposo que abans de seguir llegint aquesta pista, intentis pensar la solució pel teu compte. Només continua llegint si et quedes sense idees.

T'has fixa't? Aquest problema requereix anar realitzant una certa acció sobre una sèrie d'entrades (en aquest cas, guardar el valor màxim) fins que rep una entrada que marca el final (en aquest cas, un valor negatiu). Això no li havíem dit el patró del lloro?

```java
public class TrobaMaxim {
    public static void main(String[] args) {
        int valor = 0, valorMaxim = 0;

        while (valor >= 0) {
            if (valor >= valorMaxim) {
                valorMaxim = valor;
            }
            System.out.println("Introdueix un valor");
            valor = Integer.parseInt(Entrada.readLine());
        }
        System.out.println("El màxim és " + valorMaxim);
    }
}
```
