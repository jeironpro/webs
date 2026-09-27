# Ejercicios — 11.09 —  Els dies de la setmana (revisitat novament)

**Enunciat**

Ara que ja coneixes l'estructura condicional switch de l'exercici anterior, pot ser un bon moment per descobrir una altra versió del switch que ens ofereix Java.

Es coneix com switch expression i ens permet fer servir switch de la manera que faríem anar l'operador ternari.

Per exemple, considera aquest traductor de notes numèriques a lletres:

```java
jshell> int nota = 3;
```

nota ==> 3

```java
jshell> switch (nota) {
```

...>     case 1,2,3,4 -> 'D';
...>     case 5,6 -> 'C';
...>     case 7,8 -> 'B';
...>     case 9,10 -> 'A';

```java
   ...>     default -> 'X';
   ...> };
```

9 ==> 'D'

El switch expression és una estructura relativament nova en Java.

Un cop ho hagis consultat, considera un altre cop l'exercici dels dies de la setmana. Crea una nova versió, en aquesta ocasió fent servir switch en el format expressió.

Sabràs que ho has fet bé si el teu programa només té una instrucció d'escriptura.

Manté el nom del programa de l'exercici anterior.

```java
public class DiaSetmanaSwitch {
    public static void main(String[] args) {
        int dia = Integer.parseInt(args[0]);

        switch (dia) {
            case 1 -> System.out.println("Dilluns");
            case 2 -> System.out.println("Dimarts");
            case 3 -> System.out.println("Dimecres");
            case 4 -> System.out.println("Dijous");
            case 5 -> System.out.println("Divendres");
            case 6 -> System.out.println("Dissabte");
            case 7 -> System.out.println("Diumenge");
            default -> System.out.println("Error");
        }
    }
}
```
