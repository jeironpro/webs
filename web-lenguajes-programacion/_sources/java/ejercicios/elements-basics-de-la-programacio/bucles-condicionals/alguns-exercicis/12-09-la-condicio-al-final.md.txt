# Ejercicios — 12.09 — La condicio al final

**Enunciat**

Java ofereix una versió del bucle while diferent de la que hem vist. És coneix com a do-while i funciona pràcticament igual a la que hem vist, excepte que la condició s'avalua després d'executar el bucle.

Trobaràs més informació per exemple a la documentació oficial del llenguatge: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html

Tot que es pugui fer amb while es pot fer amb do-while (i viceversa) Tant és així, que alguns llenguatges ni tant sols incorporen el do-while mentre que d'altres ofereixen més alternatives (com ara repeteix fins que) Sovint es queda en una qüestió de preferències, però està bé que ho coneguis.

Et proposo que realitzis el següent exercici amb do-while

Desenvolupa un programa anomenat SequenciaCreixent, que vagi demanant nombres enters creixents i s'aturi en el moment que s'introdueixi un que no és més gran que l'anterior. Finalment, el programa indicarà la longitud de la seqüència introduïda, és a dir, quants valors s'han introduït de manera creixent.

Un exemple d'execució seria:

**Introdueix un valor**
2
Introdueix un valor
4
Introdueix un valor
8
Introdueix un valor
16
Introdueix un valor
32
Introdueix un valor
32
Longitud de la següència creixent: 5

```java
public class SequenciaCreixent {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        int valorCreixent = Integer.parseInt(Entrada.readLine());

        int valor = 0;
        int contador = 0;

        do { 
            if (valorCreixent > valor) {
                contador++;
            }

            valor = valorCreixent;

            System.out.println("Introdueix un valor");
            valorCreixent = Integer.parseInt(Entrada.readLine());
        } while (valorCreixent > valor);

        System.out.println("Longitud de la següència creixent: " + contador);
    }
}
```
