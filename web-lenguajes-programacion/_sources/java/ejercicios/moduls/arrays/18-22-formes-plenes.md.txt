# Ejercicios — 18.22 — Formes plenes

## Formes

**Enunciat**

Aquest exercici és una ampliació de l'exercici anterior. En aquesta ocasió hi afegirem formes plenes.

Què són les formes plenes? Algunes de les formes anteriors dividien la taula en dos o més subtaules. Aquesta activitat farà que es puguin especificar aquestes subtaules i inicialitzar-les com a plenes.

Les noves especificacions són:

*\: primera diagonal amb primer triangle ple

\*: primera diagonal amb segon triangle ple

```java
    /*: segona diagonal amb segon triangle ple

    *|: vertical al mig amb primer costat ple

    |*: vertical al mig amb segon costat ple

    *-: horitzontal al mig amb primer costat ple

    -*: horitzontal al mig amb segon costat ple

    *+: quarts amb quadrant nord-oest ple

    **+: quarts amb quadrant sud-oest ple

    +*: quarts amb quadrant nord-est ple

    +**: quarts amb quadrant sud-est ple

    *+**: quarts amb quadrant nord-oest i sud-est plens

    **+*: quarts amb quadrant sud-oest i nord-est plens

    *x: creu amb quadrant nord ple

    **x: creu amb quadrant oest ple

    x*: creu amb quadrant est ple

    x**: creu amb quadrant est ple

    *x*: creu amb quadrants nord i sud plens

    **x**: creu amb quadrants oest i est plens

Mòduls

Es requereixen els següents nous mòduls:

    UtilTaula.inicialitzaPrimeraDiagonalPrimerPle(boolean[][]): per *\

    UtilTaula.inicialitzaPrimeraDiagonalSegonPle(boolean[][]): per \*

    UtilTaula.inicialitzaSegonaDiagonalPrimerPle(boolean[][]): per *&/

    UtilTaula.inicialitzaSegonaDiagonalSegonPle(boolean[][]): per /*

        Aquests quatre mòduls construeixen les diagonals amb un dels costats plens.

        Els següents exemples haurien d'ajudar-te a entendre a què em refereixo:

    6x6*\              6x6\*               6x6*&/                 6x6/*
    X·····             XXXXXX              XXXXXX              ·····X
    XX····             ·XXXXX              XXXXX·              ····XX
    XXX···             ··XXXX              XXXX··              ···XXX
    XXXX··             ···XXX              XXX···              ··XXXX
    XXXXX·             ····XX              XX····              ·XXXXX
    XXXXXX             ·····X              X·····              XXXXXX

    UtilTaula.inicialitzaVerticalMigPrimerPle(boolean[][]): per *|

    UtilTaula.inicialitzaVerticalMigSegonPle(boolean[][]): per |*

    UtilTaula.inicialitzaHoritzontalMigPrimerPle(boolean[][]): per *-

    UtilTaula.inicialitzaHoritzontalMigSegonPle(boolean[][]): per -*

        Aquests quatre mòduls construeixen els horitzontals i verticals amb un dels costats plens.

        Els següents exemples haurien d'ajudar-te a entendre a què em refereixo:

    5x5*|                   5x5|*               5x5*-               5x5-*
    XXX··                   ··XXX               XXXXX               ·····
    XXX··                   ··XXX               XXXXX               ·····
    XXX··                   ··XXX               XXXXX               XXXXX
    XXX··                   ··XXX               ·····               XXXXX
    XXX··                   ··XXX               ·····               XXXXX

    UtilTaula.inicialitzaQuartsNOPle(boolean[][]): per *+

    UtilTaula.inicialitzaQuartsSOPle(boolean[][]): per **+

    UtilTaula.inicialitzaQuartsNEPle(boolean[][]): per +*

    UtilTaula.inicialitzaQuartsSEPle(boolean[][]): per +**

    UtilTaula.inicialitzaQuartsNOSEPlens(boolean[][]): per *+**

    UtilTaula.inicialitzaQuartsSONEPlens(boolean[][]): per **+*

        Els sis mòduls anteriors permeten definir quins quadrans volem plens.

        Considera els següents exemples:

    7x7*+         7x7**+        7x7+*         7x7+**        7x7*+**       7x7**+*
    XXXX···       ···X···       ···XXXX       ···X···       XXXX···       ···XXXX
    XXXX···       ···X···       ···XXXX       ···X···       XXXX···       ···XXXX
    XXXX···       ···X···       ···XXXX       ···X···       XXXX···       ···XXXX
    XXXXXXX       XXXXXXX       XXXXXXX       XXXXXXX       XXXXXXX       XXXXXXX
    ···X···       XXXX···       ···X···       ···XXXX       ···XXXX       XXXX···
    ···X···       XXXX···       ···X···       ···XXXX       ···XXXX       XXXX···
    ···X···       XXXX···       ···X···       ···XXXX       ···XXXX       XXXX···

    UtilTaula.inicialitzaCreuNPle(boolean[][] taula): per *x

    UtilTaula.inicialitzaCreuOPle(boolean[][] taula): per **x

    UtilTaula.inicialitzaCreuSPle(boolean[][] taula): per x*

    UtilTaula.inicialitzaCreuEPle(boolean[][] taula): per x**

    UtilTaula.inicialitzaCreuNSPlens(boolean[][] taula): per *x*

    UtilTaula.inicialitzaCreuOEPlens(boolean[][] taula): per **x**

        Els sis mòduls anteriors permeten definir quines seccions de la creu volem plenes.

        Considera els següents exemples:

    7x7*x         7x7**x        7x7x*         7x7x**        7x7*x*        7x7**x**
    XXXXXXX       X·····X       X·····X       X·····X       XXXXXXX       X·····X
    ·XXXXX·       XX···X·       ·X···X·       ·X···XX       ·XXXXX·       XX···XX
    ··XXX··       XXX·X··       ··X·X··       ··X·XXX       ··XXX··       XXX·XXX
    ···X···       XXXX···       ···X···       ···XXXX       ···X···       XXXXXXX
    ··X·X··       XXX·X··       ··XXX··       ··X·XXX       ··XXX··       XXX·XXX
    ·X···X·       XX···X·       ·XXXXX·       ·X···XX       ·XXXXX·       XX···XX
    X·····X       X·····X       XXXXXXX       X·····X       XXXXXXX       X·····X
*/

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
            case "*\\": UtilTaula.inicialitzaPrimeraDiagonalPrimerPle(taula);
                break;
            case "\\*": UtilTaula.inicialitzaPrimeraDiagonalSegonPle(taula);
                break;
            case "*/": UtilTaula.inicialitzaSegonaDiagonalPrimerPle(taula);
                break;
            case "/*": UtilTaula.inicialitzaSegonaDiagonalSegonPle(taula);
                break;
            case "*|": UtilTaula.inicialitzaVerticalMigPrimerPle(taula);
                break;
            case "|*": UtilTaula.inicialitzaVerticalMigSegonPle(taula);
                break;
            case "*-": UtilTaula.inicialitzaHoritzontalMigPrimerPle(taula);
                break;
            case "-*": UtilTaula.inicialitzaHoritzontalMigSegonPle(taula);
                break;
            case "*+": UtilTaula.inicialitzaQuartsNOPle(taula);
                break;
            case "**+": UtilTaula.inicialitzaQuartsSOPle(taula);
                break;
            case "+*": UtilTaula.inicialitzaQuartsNEPle(taula);
                break;
            case "+**": UtilTaula.inicialitzaQuartsSEPle(taula);
                break;
            case "*+**": UtilTaula.inicialitzaQuartsNOSEPlens(taula);
                break;
            case "**+*": UtilTaula.inicialitzaQuartsSONEPlens(taula);
                break;
            case "*x": UtilTaula.inicialitzaCreuNPle(taula);
                break;
            case "**x": UtilTaula.inicialitzaCreuOPle(taula);
                break;
            case "x*": UtilTaula.inicialitzaCreuSPle(taula);
                break;
            case "x**": UtilTaula.inicialitzaCreuEPle(taula);
                break;
            case "*x*": UtilTaula.inicialitzaCreuNSPlens(taula);
                break;
            case "**x**": UtilTaula.inicialitzaCreuOEPlens(taula);
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

* Un procediment que inicialitza la primera diagonal amb el primer triangle ple.
* (inicialitzaPrimeraDiagonalPrimerPle)

* Un procediment que inicialitza la primera diagonal amb el segon triangle ple.
* (inicialitzaPrimeraDiagonalSegonPle)

* Un procediment que inicialitza la segona diagonal amb el primer triangle ple.
* (inicialitzaSegonaDiagonalPrimerPle)

* Un procediment que inicialitza la segona diagonal amb el segon triangle ple.
* (inicialitzaSegonaDiagonalSegonPle)

* Un procediment que inicialitza la vertical del mig amb el primer costat ple.
* (inicialitzaVerticalMigPrimerPle)

* Un procediment que inicialitza la vertical del mig amb el segon costat ple.
* (inicialitzaVerticalMigSegonPle)

* Un procediment que inicialitza la horizontal del mig amb el primer costat ple.
* (inicialitzaHoritzontalMigPrimerPle)

* Un procediment que inicialitza la horizontal del mig amb el segon costat ple.
* (inicialitzaHoritzontalMigSegonPle)

* Un procediment que inicialitza els quarts amb el quadrant nord-oest ple.
* (inicialitzaQuartsNOPle)

* Un procediment que inicialitza els quarts amb el quadrant sud-oest ple.
* (inicialitzaQuartsSOPle)

* Un procediment que inicialitza els quarts amb el quadrant nord-est ple.
* (inicialitzaQuartsNEPle)

* Un procediment que inicialitza els quarts amb el quadrant sud-est ple.
* (inicialitzaQuartsSEPle)

* Un procediment que inicialitza els quarts amb els quadrants nord-oest i
* sud-est plens  (inicialitzaQuartsNOSEPlens)

* Un procediment que inicialitza els quarts amb els quadrants sud-oest i
* nord-est plens. (inicialitzaQuartsSONEPlens)

* Un procediment que inicialitza la creu amb el quadrant nord ple.
* (inicialitzaCreuNPle)

* Un procediment que inicialitza la creu amb el quadrant oest ple.
* (inicialitzaCreuOPle)

* Un procediment que inicialitza la creu amb el quadrant sud ple.
* (inicialitzaCreuSPle)

* Un procediment que inicialitza la creu amb el quadrant est ple.
* (inicialitzaCreuEPle)

* Un procediment que inicialitza la creu amb els quadrants nord i sud plnes.
* (inicialitzaCreuNSPlens)

* Un procediment que inicialitza la creu amb els quadrants oest i est plens.
* (inicialitzaCreuOEPlens)

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
    
    public static void inicialitzaPrimeraDiagonalPrimerPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col <= fila) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaPrimeraDiagonalSegonPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col >= fila) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaSegonaDiagonalPrimerPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col < N_COLS-fila) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaSegonaDiagonalSegonPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col < N_COLS-fila-1) {
                    taula[fila][col] = false;
                } else {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaVerticalMigPrimerPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col <= M_COLS) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaVerticalMigSegonPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col >= M_COLS) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaHoritzontalMigPrimerPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila <= M_FILES) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaHoritzontalMigSegonPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila >= M_FILES) {
                    taula[fila][col] = true;
                } else {
                    taula[fila][col] = false;
                }
            }
        }
    }
    
    public static void inicialitzaQuartsNOPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        // XXX
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila < M_FILES && col < M_COLS) {
                    taula[fila][col] = true;
                } else if (fila == M_FILES) {
                    taula[fila][col] = true;
                } else if (col == M_COLS) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaQuartsSOPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        // XXX
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila > M_FILES && col < M_COLS) {
                    taula[fila][col] = true;
                } else if (fila == M_FILES) {
                    taula[fila][col] = true;
                } else if (col == M_COLS) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaQuartsNEPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        // XXX
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila < M_FILES && col > M_COLS) {
                    taula[fila][col] = true;
                } else if (fila == M_FILES) {
                    taula[fila][col] = true;
                } else if (col == M_COLS) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaQuartsSEPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        // XXX
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila > M_FILES && col > M_COLS) {
                    taula[fila][col] = true;
                } else if (fila == M_FILES) {
                    taula[fila][col] = true;
                } else if (col == M_COLS) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaQuartsNOSEPlens(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        // XXX
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila <= M_FILES && col <= M_COLS) {
                    taula[fila][col] = true;
                } else if (fila >= M_FILES && col >= M_COLS) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaQuartsSONEPlens(boolean[][] taula) {  
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        // XXX
        final float M_FILES = Math.round(N_FILES/2.00)-1;
        final float M_COLS = Math.round(N_COLS/2.00)-1;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila >= M_FILES && col <= M_COLS) {
                    taula[fila][col] = true;
                } else if (fila <= M_FILES && col >= M_COLS) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaCreuNPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila == col) {
                    taula[fila][col] = true;
                } else if (fila <= col && col <= N_COLS-fila-1) {
                    taula[fila][col] = true;
                } else if (col == N_COLS-fila-1) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaCreuOPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        final int M_FILES = N_FILES/2;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col+1 == N_COLS-fila) {
                    taula[fila][col] = true;
                } else if (fila <= M_FILES && col > fila) {
                    taula[fila][col] = false;
                } else if (fila >= M_FILES && col > fila) {
                    taula[fila][col] = false;
                } else if (fila < col && col+1 < N_COLS-fila) {
                    taula[fila][col] = false;
                } else if (fila >= col+1 && col+fila >= N_COLS) {
                    taula[fila][col] = false;
                } else {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaCreuSPle(boolean[][] taula) {
        int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        if (N_FILES > N_COLS) {
            N_FILES = N_COLS;
        }
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila == col) {
                    taula[fila][col] = true;
                } else if (fila >= col && col >= N_COLS-fila-1) {
                    taula[fila][col] = true;
                } else if (col == N_COLS-fila-1) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaCreuEPle(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        final int M_FILES = N_FILES/2;
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (col+1 == N_COLS-fila) {
                    taula[fila][col] = true;
                }else if (fila <= M_FILES && col < fila) {
                    taula[fila][col] = false;
                } else if (fila > M_FILES && col < fila) {
                    taula[fila][col] = false;
                } else if (fila < col && col+1 < N_COLS-fila) {
                    taula[fila][col] = false;
                } else if (fila >= col+1 && col+fila >= N_COLS) {
                    taula[fila][col] = false;
                } else {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaCreuNSPlens(boolean[][] taula) {
        int N_FILES = taula.length;
        final int N_COLS = taula[0].length;
        
        if (N_FILES > N_COLS) {
            N_FILES = N_COLS;
        }
        
        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila == col) {
                    taula[fila][col] = true;
                } else if (fila <= col && col <= N_COLS-fila-1) {
                    taula[fila][col] = true;
                } else if (fila >= col && col >= N_COLS-fila-1) {
                    taula[fila][col] = true;
                } else if (col == N_COLS-fila-1) {
                    taula[fila][col] = true;
                }
            }
        }
    }
    
    public static void inicialitzaCreuOEPlens(boolean[][] taula) {
        final int N_FILES = taula.length;
        final int N_COLS = taula[0].length;

        for (int fila = 0; fila < N_FILES; fila++) {
            for (int col = 0; col < N_COLS; col++) {
                if (fila < col && col+1 < N_COLS-fila) {
                    taula[fila][col] = false;
                } else if (fila >= col+1 && col+fila >= N_COLS) {
                    taula[fila][col] = false;
                } else {
                    taula[fila][col] = true;
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
