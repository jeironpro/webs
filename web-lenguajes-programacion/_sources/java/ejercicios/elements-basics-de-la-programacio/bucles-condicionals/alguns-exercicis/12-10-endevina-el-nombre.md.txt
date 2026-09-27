# Ejercicios — 12.10 — Endevina el nombre

**Enunciat**

En aquesta ocasió desenvoluparem un programa anomenat EndevinaNombre, que es pensarà un nombre enter entre el 1 i el 100, i reptarà els usuaris a que l'endevini.

Per facilitar les proves, el nombre pensat serà obtingut del primer element de la línia de comandes.

El programa demanarà que li diguin un nombre, el compararà amb el pensat i indicarà si ha encertat, s'ha passat o no ha arribat, o si està fora de rang.

El programa finalitzarà quan els usuaris encertin el nombre pensat.

Considera la següent execució del programa, al que se li ha passat el 42 per línia de comandes:

Ves introduint enters entre 1 i 100 fins que encertis el que jo he pensat
Introdueix un valor
5
És més gran que 5
Introdueix un valor
50
És més petit que 50
Introdueix un valor
0
Com a mínim 1
Introdueix un valor
101
Com a màxim 100
Introdueix un valor
42
Has encertat!

Nota: podem suposar que sempre ens introduiran el número pensat per línia de comandes, i que tots els valors que ens introduiran seran enters.

```java
public class EndevinaNombre {
    public static void main(String[] args) {
        int numeroPensat = Integer.parseInt(args[0]);
        System.out.println("Ves introduint enters entre 1 i 100 fins que encertis el que jo he pensat");
        boolean continuar = true;

        while (continuar) {
            System.out.println("Introdueix un valor");
            int valor = Integer.parseInt(Entrada.readLine());

            if (valor == numeroPensat) {
                System.out.println("Has encertat!");
                continuar = false;
            } else if (valor <= 0) {
                System.out.println("Com a mínim 1");
            } else if (valor > 100) {
                System.out.println("Com a màxim 100");
            } else if (valor < numeroPensat) {
                System.out.println("És més gran que " + valor);
            } else {
                System.out.println("És més petit que " + valor);
            }
        }
    }
}
```
