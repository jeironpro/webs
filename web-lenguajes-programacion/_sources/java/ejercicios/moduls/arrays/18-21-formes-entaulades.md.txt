# Ejercicios — 18.21 — Formes entaulades

## Formes

**Enunciat**

Desenvolupa un programa que, a partir de l'especificació d'una taula, la dibuixi.

Una especificació d'una taula consisteix en un string amb els seguents elements:

Una especificació de dimensió com la que ja hem vist a exercicis com aquest

Com a recordatori, l'especificació de dimensió està formada per dos números del 1 al 99, separades amb un caràcter 'x'.

Opcionalment, una especificació de forma.

L'especificació de forma consisteix en un text amb un dels següents valors:

\: primera diagonal

|: vertical al mig

-: horitzontal al mig

+: quarts

/: segona diagonal

x: creu

=: pas de vianants

||: zebra

++: taulell d'escacs

Les especificacions de les taules es rebran com a arguments de la línia de comandes.

Per exemple, si volem especificar una taula de 5x6 amb la primera diagonal, indicarem:

**java Formes '5x6\'**
5x6\
X.....
.X....
..X...
...X..
....X.

Nota: Per assegurar que bash no interpreti els caràcters especials de la línia de comandes, pot ser necessari envoltar cada especificació entre cometes simples.

En cas que l'especificació de la taula no sigui correcta, el programa mostrarà un error.

Si l'especificació de la taula no inclou l'especificació de forma o bé aquesta no es troba entre les conegudes, el programa no ho considerarà un error. En canvi, mostrarà una taula "buida".

La següent simulació exemplifica aquests casos:

**java Formes '5x6\' '0x6\' 4x3 '2x3?'**
5x6\
X.....
- X....
- ·X...
- ··X..
- ···X.

**0x6\**
Especificació errònia

**4x3**
- ··
- ··
- ··
- ··

**2x3?**
- ··
- ··

Mòduls

Es requereixen els següents mòduls:

UtilTaula.taulaToString(boolean[][] taula, char caracterTrue, char caracterFalse)

Aquesta funció pura retornarà un string amb una representació dels valors de la taula que rep amb els caràcters rebuts.

Per exemple, considera el següent fragment de codi:

```java
boolean[][] taula = {

                        {true, false, false},

                        {false, true, true}

                    };

String resultat = UtilTaula.taulaToString(taula, 'X', '·');

System.out.println(resultat);
```

Per sortida estàndard mostrarà:

**X··**
- XX

UtilTaula.inicialitzaPrimeraDiagonal(boolean[][])

Procediment que rep una taula de booleans i la inicialitza amb la primera diagonal a true i la resta a false.

És a dir, aquest procediment és l'encarregat d'inicialitzar la taula per l'especificació \.

Considera el següent fragment de codi:

```java
boolean[][] taula = UtilTaula.inicialitzaPrimeraDiagonal(new boolean[5][6]);

String resultat = UtilTaula.taulaToString(taula, 'X', '·');

System.out.println(resultat);
```

Per sortida estàndard mostrarà:

**5x6\**
X·····
- X····
- ·X···
- ··X··
- ···X·

Aquesta forma sempre començarà emplenant per la primera fila i primera columna. Així, per algunes dimensions, no semblarà gaire una diagonal. Per exemple:

**5x8\**
X···
- X··
- ·X·
- ··X
- ···
- ···
- ···
- ···

UtilTaula.inicialitzaVerticalMig(boolean[][])

Com en el cas de la primera diagonal, però ara dividint la taula en dues seccions, amb una línia vertical. Aquest procediment és l'encarregat de dibuixar l'especificació |.

Tingues present que si les columnes són parelles, la vertical estarà a la columna menor de les dues del mig.

**4x4|                    4x5|**
- X··                    ··X··
- X··                    ··X··
- X··                    ··X··
- X··                    ··X··

UtilTaula.inicialitzaHoritzontalMig(boolean[][])

Molt similar a la | però ara amb una línia horitzontal per processar l'especificació -. En aquest cas, caldrà que tinguis present si el nombre de files és parell o senar.

**7x5-               2x4-                4x5-**
- ····              XXXX                ·····
- ····              ····                XXXXX
- ····                                  ·····
XXXXX                                  ·····
- ····
- ····
- ····

UtilTaula.inicialitzaQuarts(boolean[][]): per +

Amb aquesta forma caldrà que tinguis present les mateixes consideracions que amb les formes | i - respecte dimensions parelles i senars.

**5x5+                    3x2+                4x6+**
- ·X··                   X·                  ··X···
- ·X··                   XX                  XXXXXX
XXXXX                   X·                  ··X···
- ·X··                                       ··X···
- ·X··

UtilTaula.inicialitzaSegonaDiagonal(boolean[][]): per l'especificació de la forma /.

Aquesta forma és molt similar a la \.

Aquesta forma sempre començarà emplenant per la primera fila i darrera columna.

**7x7/                         7x5/                4x7/**
- ·····X                      ····X               ······X
- ····X·                      ···X·               ·····X·
- ···X··                      ··X··               ····X··
- ··X···                      ·X···               ···X···
- ·X····                      X····
- X·····                      ·····
X······                      ·····

UtilTaula.inicialitzaCreu(boolean[][] taula): per x

Amb aquesta forma caldrà que tinguis present les mateixes consideracions que amb les formes \ i / respecte dimensions parelles i senars. Això implicarà que per algunes dimensions, no semblarà pas una X sinó, com al següent exemple, més aviat una V, mentre que per d'altres quedaran línies en blanc al final.

**7x7x                     3x5x                7x5x**
X·····X                  X···X               X···X
- X···X·                  .X.X.               ·X·X·
- ·X·X··                  ..X..               ··X··
- ··X···                                      ·X·X·
- ·X·X··                                      X···X
- X···X·                                      ·····
X·····X                                      ·····

UtilTaula.inicialitzaPasVianants(boolean[][]): per =

El pas de vianants fa una sèrie de línies horitzontals intercalades, començant per una línia buida.

**7x4=                    4x4=**
- ···                    ····
XXXX                    XXXX
- ···                    ····
XXXX                    XXXX
- ···
XXXX
- ···

UtilTaula.inicialitzaZebra(boolean[][]): per ||

Molt semblant al pas de vianants, aquest mòdul inicialitza la taula amb una sèrie de línies verticals intercalades, començant amb una buida.

**4x7||                   4x6||**
- X·X·X·                 ·X·X·X
- X·X·X·                 ·X·X·X
- X·X·X·                 ·X·X·X
- X·X·X·                 ·X·X·X

UtilTaula.inicialitzaEscacs(boolean[][]): per ++

En aquesta ocasió, la forma representarà un patró intercalat similar al que apareix a un taulell d'escacs. La primera casella (primera fila i primera columna) començarà sempre en blanc.

**8x8++                   5x8++               4x7++**
- X·X·X·X                ·X·X·X·X            ·X·X·X·
X·X·X·X·                X·X·X·X·            X·X·X·X
- X·X·X·X                ·X·X·X·X            ·X·X·X·
X·X·X·X·                X·X·X·X·            X·X·X·X
- X·X·X·X                ·X·X·X·X
X·X·X·X·
- X·X·X·X
X·X·X·X·

```java
public class Formes {
    public static void main(String[] args){
        for (int i = 0; i < args.length; i++) {
            System.out.println(args[i]);
            int files = obteFiles(args[i]);
            int columnes = obteColumnes(args[i]);
            String forma = obteForma(args[i]);
            
            if (files < 1 || columnes < 1) {
                System.out.println("Especificació no vàlida");
            } else {
                boolean[][] taula = new boolean[files][columnes];
                mostraForma(taula, forma);
            }
        }
    }

    public static int obteFiles(String especificacio) {
        String files = "";   
        for (int i = 0; i < especificacio.length(); i++) {
            char c = especificacio.charAt(i);
            if (Character.isDigit(c)) {          
                files += c;
            } else {
                break;
            }
        }
        if (!files.isEmpty()) {
            int fila = Integer.parseInt(files);
            if (fila >= 1 && fila <= 99) {
                return fila;            
            }
        }
        return -1;
    }

    public static int obteColumnes(String especificacio) {
        String columnes = "";
        for (int i = 0; i < especificacio.length(); i++) {
            char c = especificacio.charAt(i);
            if (c == 'x') {
                for (int j = i+1; j < especificacio.length(); j++) {
                    char ch = especificacio.charAt(j);
                    if (Character.isDigit(ch)) {
                        columnes += ch;
                    }
                }
            }
            if (columnes.length() > 2) {
                columnes = columnes.substring(0, 2);
                break;
            }
        }
        if (!columnes.isEmpty()) {
            int col = Integer.parseInt(columnes);
            if (col >= 1 && col <= 99) {
                return col;           
            }
        }
        return -1;        
    }
    
    public static String obteForma(String especificacio) {
        String formaTmp = "";
        String forma = "";
        
        for (int i = especificacio.length()-1; i >= 0; i--) {
            char c = especificacio.charAt(i);
            if (!Character.isDigit(c)) {
                formaTmp += c;
            } else {
                break;
            }
        }
        
        for (int i = formaTmp.length()-1; i >= 0; i--) {
            char c = formaTmp.charAt(i);
            if (!Character.isDigit(c)) {
                forma += c;
            }
        }
        return forma;
    }
    
    public static void mostraForma(boolean[][] taula, String forma) {
        switch (forma) {
            case "\\": UtilTaula.inicialitzaPrimeraDiagonal(taula);
                break;
            case "|": UtilTaula.inicialitzaVerticalMig(taula);
                break;
            case "-": UtilTaula.inicialitzaHoritzontalMig(taula);
                break;
            case "+": UtilTaula.inicialitzaQuarts(taula);
                break;
            case "/": UtilTaula.inicialitzaSegonaDiagonal(taula);
                break;
            case "x": UtilTaula.inicialitzaCreu(taula);
                break; 
            case "=": UtilTaula.inicialitzaPasVianants(taula);
                break;
            case "||": UtilTaula.inicialitzaZebra(taula);
                break;
            case "++": UtilTaula.inicialitzaEscacs(taula);
                break;
            default: UtilTaula.inicialitzaFalse(taula);
        }
        String resultat = UtilTaula.taulaToString(taula, 'X', '·');
        System.out.println(resultat);
    }
}
```

## UtilTaula

* Aquest programa és la meva biblioteca d'utilitats de taules, compta amb les
* següents funcions:

* Una funció que rep un array de char bidimensional, un char d'origen i un altre
* per substitueix, retornar un nou array bidimensional amb el char de
* substitució en les posicions on es trobava el char d'origen. (substitueix)

* Una procediment que inicialitza un array bidimensional amb l' 1 com valor en
* cada posicio. (inicialitzaTaula)

* Una funció que inicialitza cada posoció de un array bidimensional amb els
* valors de manera seqüencial des de l'1 fins a la quantitat d'array demanat.
* (inicialitzaSequencial)

* Un procediment que inicialitza la primera diagonal \ de un array bidimensional
* en true i la resta a false. (inicialitzaPrimeraDiagonal)

* Un procediment que inicialitza la vertical del mig | (si les columnes són
* parell s'inicialitzarà la vertical del mig que està a la columna menor de les
* dues del mig) de una array bidimensional en true i la resta a false.
* (inicialitzaVerticalMig)

* Un procediment que inicialitza la horizontal del mig - (si les files són
* parell s'inicialitzarà la horizontal del mig que està a la columna menor de
* les dues del mig) de una array bidimensional en true i la resta a false.
* (inicialitzaHoritzontalMig)

* Un procediment que inicialitza la vertical i la horizontal del mig + (si les
* files i columnes són parell s'inicialitzarà la vertical i la horizontal del
* mig que està a la columna menor de les dues del mig) de una array
* bidimensional en true i la resta a false. (inicialitzaQuarts)

* Un procediment que inicialitza la segona diagonal / de un array bidimensional
* en true i la resta a false. (inicialitzaSegonaDiagonal)

* Un procediment que inicialitza la primera i segona diagonal x de un array
* bidimensional en true i la resta a false. (inicialitzaCreu)

* Un procediment que inicialitza les files senar = de un array bidimensional en
* true i la resta a false. (inicialitzaPasVianants)

* Un procediment que inicialitza les columnes senar || de un array bidimensional
* en true i la resta a false. (inicialitzaZebra)

* Un procediment que inicialitza les files i columnes senar ++ de un array
* bidimensional en true i la resta a false. (inicialitzaEscacs)

* Un procediment que inicialitza les files i columnes a false de un array
* bidimensional. (inicialitzaFalse)

* Una funció que rep un array de int bidimensional i compon un String amb els
* valors de l'array separant les files amb espais en blanc des de 7 fins a 0
* depenent del nombre de dígits en cada posició de l'array i retornar el String
* resultant. (taulaToString)

* Una funció que rep un array de int bidimensional, un char que representa el
* ompliment i un altre que representa el buidatge de les posició de l'array i
* compon un String amb el char de ompliment en una posiició indicat i la resta
* amb el char de buidatge i retornar el String resultant. (taulaToString)

```java
 public class UtilTaula {
    public static char[][] substitueix(char[][] origen, char inici, char fi) {
        final int N_FILES = origen.length;
        final int N_COLS = origen[0].length;
        char[][] resultat = new char[N_FILES][N_COLS];
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (origen[fila][col] == inici) {
                    resultat[fila][col] = fi;
                } else {
                    resultat[fila][col] = origen[fila][col];
                }
            }
        }
        return resultat;
    }

    public static void inicialitzaTaula(int[][] taula, int valor) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                taula[fila][col] = valor;
            }
        }
    }
    
    public static void inicialitzaSequencial(int[][] taula, int valorInicial) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                taula[fila][col] = valorInicial++;
            }
        }
    }
    
    public static void inicialitzaPrimeraDiagonal(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
         
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila == col) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaVerticalMig(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col == M_COLS) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaHoritzontalMig(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        // XXX
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila == M_FILES) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaQuarts(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        // XXX
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila == M_FILES) {
                    taula[fila][col] = true;
                } else if (col == M_COLS) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaSegonaDiagonal(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col+1 == N_COLS-fila) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaCreu(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col == fila) {
                    taula[fila][col] = true;
                } else if (col+1 == N_COLS-fila) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaPasVianants(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila % 2 != 0) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false; 
                }
            }
        }
    }
    
    public static void inicialitzaZebra(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col % 2 != 0) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false; 
                }
            }
        }
    }
    
    public static void inicialitzaEscacs(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila % 2 == 0 && col % 2 != 0) {
                    taula[fila][col] = true;      
                } else if (fila % 2 != 0 && col % 2 == 0) {
                    taula[fila][col] = true; 
                } else {
                    taula[fila][col] = false; 
                }
            }
        }
    }
    
    public static void inicialitzaFalse(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                taula[fila][col] = false;
            }
        }
    }

    public static String taulaToString(int[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        String resultat = "";

        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                resultat += String.format("%8d", taula[fila][col]);
            }
            resultat += String.format("%n");
        }
        return resultat;
    }
    
    public static String taulaToString(boolean[][] taula, char caracterTrue, char caracterFalse) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        String resultat = "";

        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (taula[fila][col] == true) {
                    resultat += String.format("%c", caracterTrue);  
                } else {
                    resultat += String.format("%c", caracterFalse); 
                }
            }
            resultat += String.format("%n");
        }
        return resultat;
    }
}
```
