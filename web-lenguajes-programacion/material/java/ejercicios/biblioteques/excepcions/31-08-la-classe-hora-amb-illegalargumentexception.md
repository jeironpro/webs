# Ejercicios — 31.08 — La classe Hora amb IllegalArgumentException

**Enunciat**

Torna a considerar la classe Hora.

La versió anterior estava fent servir un tipus d'excepció molt genèric. De fet el més genèric: Exception!

En aquest exercici faràs servir una excepció més concreta: IllegalArgumentException.

Els missatges seran els mateixos que els corresponents a l'exercici anterior:

"hores fora de rang: «hores»"

"minuts fora de rang: «minuts»"

"segons fora de rang: «segons»"

El següent codi ha de poder funcionar:

```java
public class UsaHora {

    public static void main(String[] args) {

        System.out.println("Intentarem crear una hora amb valors no vàlids");

        try {

            Hora hora = new Hora(-1, 1, 1);

        } catch (IllegalArgumentException e) {

            System.out.println("Argument il·legal!");

        }

    }

}
```

L'execució generarà:

**Intentarem crear una hora amb valors no vàlids**
Argument il·legal!
