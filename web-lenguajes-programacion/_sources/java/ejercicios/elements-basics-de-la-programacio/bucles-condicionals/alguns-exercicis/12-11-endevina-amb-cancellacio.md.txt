# Ejercicios — 12.11 — Endevina amb cancellacio

**Enunciat**

Tornem a l'exercici que implementava el joc d'endevinar

En aquesta ocasió desenvoluparem una nova versió que millorarà l'exercici. Mantindrem el nom del programa, però.

La versió anterior obligava els usuaris a encertar per poder finalitzar.

Aquesta nova versió ofereix la possibilitat de sortir del joc en rebre una cadena buida (recordes isEmpty()?).

Quan els usuaris entrin la cadena buida, el programa respondrà amb el missatge "Cancel·lat!" i finalitzarà.

Fixa't que el programa haurà d'oferir tota la funcionalitat de la versió anterior.

Un exemple d'execució, suposant novament que ens entren 42 per línia de comandes, seria:

Ves introduint enters entre 1 i 100 fins que encertis el que jo he pensat
Introdueix un valor
5
És més gran que 5
Introdueix un valor
50
És més petit que 50
Introdueix un valor

Cancel·lat!

Atenció: ara ja no tot el que rebrem per entrada estàndard seran enters, ja que hem de poder tractar la cadena buida. El que sí podem assumir és que, a banda de la cadena buida per entrada estàndard, la resta d'entrades seran valors enters.

```java
public class EndevinaNombre {
    public static void main(String[] args) {
        int numeroPensat = Integer.parseInt(args[0]);
        System.out.println("Ves introduint enters entre 1 i 100 fins que encertis el que jo he pensat");
        boolean continuar = true;

        while (continuar) {
            System.out.println("Introdueix un valor");
            String cadena = Entrada.readLine();

            if (cadena.isBlank()) {
                System.out.println("Cancel·lat!");
                continuar = false;
            } else {
                int valor = Integer.parseInt(cadena);

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
}
```
