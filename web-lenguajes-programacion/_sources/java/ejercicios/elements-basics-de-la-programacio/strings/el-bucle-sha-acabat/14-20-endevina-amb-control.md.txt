# Ejercicios — 14.20 — Endevina amb control

**Enunciat**

Recordes Exercici 12_10. Endevina el nombre ?

En aquesta ocasió farem una nova versió que faci ús dels nous mecanismes de control de bucles.

El programa realitzarà la mateixa funcionalitat que l'exercici original, més:

Permetrà cancel·lar la partida en introduir una entrada buida (tal i com demanava Exercici 12_11. Endevina amb cancel·lació

Comprovarà que l'entrada siguin realment valors enters.

Serà una comprovació més senzilla que la que demanava l'exercici Exercici 14_17. Enters estrictes en el sentit que no cal ignorar espais, ni considerar separadors. Només cal tenir en compte dígits i, opcionalment, que comencin amb un + o un -. Ah! i només cal comprovar els valors de l'entrada estàndard. El de línia de comandes es pot suposar sempre enter.

Una simulació podria ser:

**java Endevina**
Nombre?
cinc
Només nombres
Nombre?
50
Massa gran
Nombre?
0
Fora de rang
Nombre?
101
Fora de rang
Nombre?

Cancel·lat!

Nota

Aquest exercici és una bona oportunitat per practicar els elements de control de bucles que hem estudiat a aquesta secció. Amb tot, si ho prefereixes, pots resoldre'l sense usar-los.

```java
public class EndevinaNombre {
    public static void main(String[] args) {
        int numeroPensat = Integer.parseInt(args[0]);

        while (true) {
            System.out.println("Nombre?");
            String cadena = Entrada.readLine();
            boolean esEnter = false;

            if (cadena.isBlank()) {
                System.out.println("Cancel·lat!");
                break;
            } else {
                for (int i = 0; i < cadena.length(); i++) {
                    if (Character.isDigit(cadena.charAt(i))) {
                        esEnter = true;
                    }
                }
                if (cadena.charAt(0) == '-' || cadena.charAt(0) == '+' && Character.isDigit(cadena.charAt(1))) {
                    esEnter = true;
                }

                if (!esEnter) {
                    System.out.println("Només nombres");
                } else {
                    int valor = Integer.parseInt(cadena);

                    if (valor == numeroPensat) {
                        System.out.println("Has encertat!");
                        break;
                    } else if (valor < 1 || valor > 100) {
                        System.out.println("Fora de rang");
                    } else if (valor < numeroPensat) {
                        System.out.println("És més gran que " + valor);
                    } else {
                        System.out.println("És més petit que " + valor);
                    }
                }
            }
        }
    }
}
```
