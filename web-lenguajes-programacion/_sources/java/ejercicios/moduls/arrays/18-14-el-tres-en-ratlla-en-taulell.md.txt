# Ejercicios — 18.14 — El tres en ratlla en taulell

**Enunciat**

Tornem a considerar l'exercici del tres en ratlla

En aquesta ocasió representarem tot el taulell, no amb variables separades fila0, fila1 i fila2, sinó amb una taula de caràcters.

**La situació inicial a representar serà**
_images/tictactoebasicXwins.svg

A banda, el programa demanarà quin és el següent moviment de les ㄨ i el coŀlocarà al taulell.

// XXX comentari adequat

```java
public class TresEnRatlla {

    public static void main(String[] args){
```

// declaració del taulell

```java
        char[][] taulell = new char[3][3];
```

// inicialització de la fila 0

```java
        taulell[0][0] = //;
```

// inicialització de la resta de files

//

// mostra la posició inicial del taulell

```java
        System.out.println("La posició inicial del taulell:");
```

mostraFila(taulell[//]);     // mostra la línia 0

mostraFila(taulell[//]);     // mostra la línia 1

mostraFila(taulell[//]);     // mostra la línia 2

// demana coordenades del moviment del jugador X

```java
        System.out.println("Fila del següent moviment?");

        int fila = Integer.parseInt(Entrada.readLine());

        System.out.println("Columna del següent moviment?");

        int columna = Integer.parseInt(Entrada.readLine());
```

// marquem el nou moviment

//

TODO: cal comprovar que les coordenades siguin vàlides i

que la casella estigui buida.

Si tot és correcte, caldrà completar:

```java
            taulell[ XXX ][ XXX ] = 'X';
```

// tornem a mostrar el taulell

```java
        System.out.println("La posició final del taulell:");
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

Una simulació d'execució en la que guanya ㄨ seria:

**La posició inicial del taulell**
- OO
- X·
- ·X
Fila del següent moviment?
0
Columna del següent moviment?
0
La posició final del taulell:
XOO
- X·
- ·X

Nota: prgtest t'indicarà la resta de missatges.

```java
public class TresEnRatlla {
    public static void main(String[] args){
        char[][] taulell = new char[3][3];

        taulell[0][0] = '·';
        taulell[0][1] = 'O';
        taulell[0][2] = 'O';

        taulell[1][0] = '·';
        taulell[1][1] = 'X';
        taulell[1][2] = '·';

        taulell[2][0] = '·';
        taulell[2][1] = '·';
        taulell[2][2] = 'X';

        System.out.println("La posició inicial del taulell:");
        mostraFila(taulell[0]);
        mostraFila(taulell[1]);
        mostraFila(taulell[2]);

        System.out.println("Fila del següent moviment?");
        int fila = Integer.parseInt(Entrada.readLine());

        System.out.println("Columna del següent moviment?");
        int columna = Integer.parseInt(Entrada.readLine());

        if ((fila >= 0 && fila <= 2) && (columna >= 0 && columna <= 2)) {
            if (taulell[fila][columna] == '·') {
                taulell[fila][columna] = 'X';
            } else {
                System.out.println("Posició ocupada");
            }
        } else {
            System.out.println("Coordenades incorrectes");
        }

        System.out.println("La posició final del taulell:");
        mostraFila(taulell[0]);
        mostraFila(taulell[1]); 
        mostraFila(taulell[2]);
    }

    public static void mostraFila(char[] fila) {
        for (int col = 0; col < fila.length; col++) {
            System.out.print(fila[col]);
        }
        System.out.println();
    }
}
```
