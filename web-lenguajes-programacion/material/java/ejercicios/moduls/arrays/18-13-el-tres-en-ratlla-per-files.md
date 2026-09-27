# Ejercicios — 18.13 — El tres en ratlla per files

**Enunciat**

Desenvolupa un programa que representi la següent situació d'una partida de tres en ratlla:
_images/tictactoebasicpartida.svg

La representació del joc es realitzarà tenint present que:

el taulell estarà implementat amb tres arrays de caràcters que representaran cadascuna de les files

cada posició es codificarà amb un de tres possibles caràcters (X, O o ·) El punt indicarà que la posició encara no està marcada.

Completa la plantilla següent tot reemplaçant // pel teu codi:

//

```java
public class TresEnRatlla {

    public static void main(String[] args){
```

// declaració de les files

```java
        char[] fila0 = new char[3];
```

char[] fila1 //;

//;

// inicialització de la fila 0

```java
        fila0[0] = 'O';

        fila0[1] = '·';

        fila0[2] = 'X';
```

// inicialització de la fila 1

//

// inicialització de la fila 2

//

// mostra el taulell

```java
        mostraFila(fila0);
```

//

```java
    }
```

// mostra el contingut de la fila per sortida estàndard

```java
    public static void mostraFila(char[] fila) {

        for (//) {

            System.out.print(fila[col]);

        }

        System.out.println();

    }

}
```

La sortida esperada és la següent:

**O·X**
XXO
O··

```java
public class TresEnRatlla {
    public static void main(String[] args){
        char[] fila0 = new char[3];
        char[] fila1 = new char[3];
        char[] fila2 = new char[3];

        fila0[0] = 'O';
        fila0[1] = '·';
        fila0[2] = 'X';

        fila1[0] = 'X';
        fila1[1] = 'X';
        fila1[2] = 'O';

        fila2[0] = 'O';
        fila2[1] = '·';
        fila2[2] = '·';

        mostraFila(fila0);
        mostraFila(fila1);
        mostraFila(fila2);
    }

    public static void mostraFila(char[] fila) {
        for (int col = 0; col < fila.length; col++) {
            System.out.print(fila[col]);
        }
        System.out.println();
    }
}
```
