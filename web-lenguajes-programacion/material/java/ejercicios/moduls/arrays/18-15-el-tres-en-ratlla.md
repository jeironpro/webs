# Ejercicios — 18.15 — El tres en ratlla

**Enunciat**

En aquest exercici implementarem el joc del tres en ratlla de manera que es pugui jugar.

El joc començarà amb el taulell en blanc i anirà demanant moviments alternativament a cada jugador.

Els jugadors són ㄨ i 〇. Sempre començarà el jugador ㄨ.

El joc finalitzarà quan passi una de les següents situacions:

Un jugador abandona entrant el valor "a" (no importen majúscules) en comptes d'una coordenada vàlida

El programa indicarà que el jugador ha abandonat.

Un jugador aconsegueix el tres en ratlla.

El programa indicarà que el jugador ha guanyat.

Totes les caselles estan ocupades.

El programa indicarà que hi ha hagut un empat.

La manera d'indicar les coordenades del moviment serà amb la fila i la columna seguides. Per exemple, la casella (0,0) s'indicarà amb "00" i la (1, 2) amb "12".

Quan es processa una coordenada, es consideraran els següents casos:

Format incorrecte: l'entrada no està formada per dos dígits entre 0 i 2.

Es mostra un missatge d'error i es torna a demanar moviment al mateix jugador.

Casella ocupada: l'entrada correspon a una casella que ja ha estat marcada

Es mostra un missatge indicant que la casella està ocupada i es torna a demanar moviment al mateix jugador.

Casella lliure: l'entrada correspon a una casella buida.

Es marca la casella i es mostra el resultat. Si el moviment no finalitza el joc, passa el torn a l'altre jugador.

Considera les següents simulacions:

**Comença el joc**
- ··
- ··
- ··
X?
11
- ··
- X·
- ··
O?
01
- O·
- X·
- ··
X?
22
- O·
- X·
- ·X
O?
02
- OO
- X·
- ·X
X?
00
XOO
- X·
- ·X
X Guanya

A banda, el teu codi haurà d'incloure com a mínim, els següents mòduls:

mostraTaulell(char[][]): permet mostrar el contingut del taulell

boolean casellaOcupada(char[][], int fila, int columna): retorna cert quan està ocupada la casella corresponent a la fila i columna

boolean jugadorGuanya(char[][], char jugador): retorna cert quan el jugador ha fet un tres en ratlla al taulell. Espera que jugador tingui com a valor 'X' o 'O'.

boolean hiHaEmpat(char[][]): retorna cert quan ja no es poden fer més moviments.

El prgtest indicarà la resta dels missatges exactes que s'esperen.

Truc

Només si no saps per on començar

Considera la següent plantilla pel programa principal.

// XXX comentari adequat

```java
public class TresEnRatlla {
```

// mòduls de suport

//

```java
    public static void main(String[] args) {
```

// declara i inicialitza el taulell

//

```java
        System.out.println("Comença el joc");
```

// indica quin és el jugador que té el torn

//

```java
        while (//) {

            mostraTaulell(taulell);
```

// obté el moviment del jugador actual

//

// comprova abandonament

//

// obté coordenades del moviment

//

// comprova si la casella està ocupada

//

// realitza el moviment

//

// comprova jugador guanya

//

// comprova empat

//

// passa torn a l'altre jugador

//

```java
        }

    }

}

public class TresEnRatlla {
    public static void main(String[] args) {
        char[][] taulell = new char[3][3];
        
        System.out.println("Comença el joc");
        
        crearTaulell(taulell);

        mostraTaulell(taulell);
        
        char jugadorActual = 'X';
        
        while (true) {
            System.out.printf("%c?%n", jugadorActual);
            String posicioJugador = Entrada.readLine();

            int fila = 0;
            int columna = 0;
            
            if (posicioJugador.equals("a")) {
                System.out.printf("%c abandona%n", jugadorActual);
                break;
            }
            
            while (true) {
                if (verificaCoordenada(posicioJugador)) {
                    fila = Integer.parseInt("" + posicioJugador.charAt(0));
                    columna = Integer.parseInt("" + posicioJugador.charAt(1)); 
                    
                    if (!casellaOcupada(taulell, fila, columna)) {
                        taulell[fila][columna] = jugadorActual;
                        mostraTaulell(taulell);
                        break;
                    } else {
                        System.out.println("Casella ocupada");
                    }
                } else {
                    System.out.println("Coordenades no vàlides");                
                }
                mostraTaulell(taulell);

                System.out.printf("%c?%n", jugadorActual);
                posicioJugador = Entrada.readLine();

                if (posicioJugador.equals("a")) {
                    System.out.printf("%c abandona%n", jugadorActual);
                    return;
                }
            }
            
            if (jugadorGuanya(taulell, jugadorActual)) {
                System.out.printf("%c guanya%n", jugadorActual);
                break;
            }
            
            if (jugadorActual == 'X') {
                jugadorActual = 'O';
            } else {
                jugadorActual = 'X';
            }
            
            if (hiHaEmpat(taulell)) {
                System.out.println("El joc ha quedat empat");
                break;
            }
        }
    }
    
    public static void crearTaulell(char[][] taulell) {
        for (int fila = 0; fila < taulell.length; fila++) {
            for (int col = 0; col < taulell.length; col++) {
                taulell[fila][col] = '·';
            }
        }
    }

    public static void mostraTaulell(char[][] taulell) {
        for (int fila = 0; fila < taulell.length; fila++) {
            for (int col = 0; col < taulell.length; col++) {
                System.out.print(taulell[fila][col]);
            }
            System.out.println();
        }
    }    
    
    public static boolean casellaOcupada(char[][] taulell, int fila, int columna) {
        return taulell[fila][columna] != '·';
    }
    
    public static boolean jugadorGuanya(char[][] taulell, char jugador) {
        if (taulell[0][0] == jugador && taulell[0][1] == jugador && taulell[0][2] == jugador) {
            return true;
        }

        if (taulell[1][0] == jugador && taulell[1][1] == jugador && taulell[1][2] == jugador) {
            return true;
        }
        
        if (taulell[2][0] == jugador && taulell[2][1] == jugador && taulell[2][2] == jugador) {
            return true;
        }
        
        if (taulell[0][0] == jugador && taulell[1][0] == jugador && taulell[2][0] == jugador) {
            return true;
        }
        
        if (taulell[0][1] == jugador && taulell[1][1] == jugador && taulell[2][1] == jugador) {
            return true;
        }
        
        if (taulell[0][2] == jugador && taulell[1][2] == jugador && taulell[2][2] == jugador) {
            return true;
        }
        
        if (taulell[0][0] == jugador && taulell[1][1] == jugador && taulell[2][2] == jugador) {
            return true;
        }
        
        if (taulell[2][0] == jugador && taulell[1][1] == jugador && taulell[0][2] == jugador) {
            return true;
        }
        
        return false;
    }
    
    public static boolean hiHaEmpat(char[][] taulell) {
        int marcat = 0;
        for (int fila = 0; fila < taulell.length; fila++) {
            for (int col = 0; col < taulell.length; col++) {
                if (taulell[fila][col] != '·') {
                    marcat++;
                }
            }
        }
        return marcat == 9;
    }
    
    public static boolean verificaCoordenada(String coordenada) {
        if (coordenada.length() == 2) {
            if (Character.isDigit(coordenada.charAt(0)) && coordenada.charAt(0) >= '0' && coordenada.charAt(0) <= '2') { 
                if (Character.isDigit(coordenada.charAt(1)) && coordenada.charAt(1) >= '0' && coordenada.charAt(1) <= '2') {
                    return true;
                }
            }
        }
        return false;
    }
}
```
