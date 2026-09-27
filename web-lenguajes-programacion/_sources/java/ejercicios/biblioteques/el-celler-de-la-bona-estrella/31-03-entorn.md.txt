# Ejercicios — 31.03 — entorn

## Botiga

**Enunciat**

Un cop ja tenim la classe Vi és un bon moment per implementar la classe Botiga.

```{image} /_static/uml/uml-31-03-entorn-0.png
:alt: Diagrama UML
```

Diagrama de classes de la botiga de vins

La classe Botiga ens permetrà gestionar la col·lecció de vins de la botiga de la Sra. Estrella.

Donat que necessitarem emmagatzemar vàries instàncies de Vi, en aquesta primera versió farem servir un array de Vi.

Suposarem que la botiga tindrà un nombre màxim de vins. Aquest màxim pot ser indicat amb el constructor específic, o bé pren el valor per defecte indicat per la constant DEFAULT_MAX_VINS, que val 10, en cas que no sigui indicat o que el valor indicat sigui menor que 1.
_images/botigaarray_01.svg

El diagrama anterior representa l'array vins amb un màxim de 8 vins, que de moment només en disposa de dos.

El mètode afegeix() ens permetrà afegir un nou vi a la col·lecció. Per fer-ho, comprovarà que el vi sigui vàlid i no hi hagi cap altre vi amb el mateix nom a la col·lecció. Si troba un altre vi amb el mateix nom, no fa res i retorna null. Un cop comprovar que no hi ha cap altre vi amb el mateix nom, cercarà una entrada de l'array que apunti a null, la ocuparà amb el nou vi i retornarà el vi introduït com a senyal que tot ha anat bé.

En cas que no trobi cap espai buit, retornarà null per indicar que no ha anat bé.

La funcionalitat més important de la botiga és la possibilitat de cercar un vi. De moment només permetrà cercar pel nom. cerca() rebrà un String que cercarà pels vins de la botiga fins a trobar un que tingui aquest valor com a nom. En cas de trobar-lo, el retornarà. Altrament retornarà null. Caldrà normalitzar el nom del vi per cercar-lo.

El mètode elimina() ens permet eliminar un vi de la botiga. El mètode rep el nom d'un vi i intenta trobar una instància de Vi amb aquest nom, dins la coŀlecció. Si no la troba, retorna null per indicar que no ha tingut èxit. En cas de trobar la instància, comprovarà si encara té estoc. Si és així, també retornarà null i no l'eliminarà. Finalment, si la instància no té estoc, marcarà la seva posició a l'array com a null i la retornarà.

Per descomptat, tant cerca() com elimina() normalitzaran el nom a cercar. Altrament, és fàcil que no el trobin!
Què haig de fer?

Implementa la classe Botiga amb la descripció anterior.

Per provar la teva classe, considera UsaBotiga.java:

```java
public class UsaBotiga {
```

```java
    public static void main(String[] args) {

        System.out.println("Creem uns quants vins");

        Vi[] vins = {
```

new Vi("Roura Blanc", 1234, 42),

new Vi("Cercium", 535, 30),

new Vi("Llum d'Alba Blanc", 1750, 12)

```java
        };

        for (int i=0; i<vins.length; i++) {

            System.out.println("Creat" + vins[i]);

        }

        Botiga botiga = new Botiga(vins.length - 1);    // no hi cabran tots els vins

        System.out.println("Afegim els vins creats a la botiga");

        for (int i=0; i<vins.length; i++) {

            Vi resposta = botiga.afegeix(vins[i]);

            System.out.println("En afegir" + vins[i] + "la botiga ens respon " + resposta);

        }

        System.out.printf("%nCerquem uns vins%n");

        String nomVi = vins[1].getNom();

        Vi resposta = botiga.cerca(nomVi);

        System.out.println("En cercar " + nomVi + " botiga ens respon " + resposta);

        nomVi = vins[vins.length - 1].getNom();

        resposta = botiga.cerca(nomVi);

        System.out.println("En cercar " + nomVi + " botiga ens respon " + resposta);

    }

}
```

En breu, UsaBotiga crea uns quants vins, crea una botiga que no té espai per tants vins i li intenta afegir tots els vins creats. Finalment cerca un dels vins que ha d'estar afegit correctament i un altre que no hi cabia.

L'execució haurà de generar la següent sortida:

**Creem uns quants vins**
Creat
Vi: Roura Blanc
Preu: 1234
Estoc: 42

**Creat**
Vi: Cercium
Preu: 535
Estoc: 30

**Creat**
Vi: Llum d'Alba Blanc
Preu: 1750
Estoc: 12

**Afegim els vins creats a la botiga**
En afegir
Vi: Roura Blanc
Preu: 1234
Estoc: 42
la botiga ens respon
Vi: Roura Blanc
Preu: 1234
Estoc: 42

**En afegir**
Vi: Cercium
Preu: 535
Estoc: 30
la botiga ens respon
Vi: Cercium
Preu: 535
Estoc: 30

**En afegir**
Vi: Llum d'Alba Blanc
Preu: 1750
Estoc: 12
la botiga ens respon null

**Cerquem uns vins**
En cercar Cercium botiga ens respon
Vi: Cercium
Preu: 535
Estoc: 30

En cercar Llum d'Alba Blanc botiga ens respon null

```java
public class Botiga {
    private static int DEFAULT_MAX_VINS = 10;
    private Vi[] vins;

    public Botiga() {
        this.vins = new Vi[DEFAULT_MAX_VINS];
    }

    public Botiga(int maxVins) {
        if (maxVins > 0) {
            this.vins = new Vi[maxVins];
        } else {
            this.vins = new Vi[DEFAULT_MAX_VINS];
        }
    }

    public Vi afegeix(Vi vi) {
        if (vi.esValid()) {
            if (cerca(vi.getNom()) == null) {
                for (int i = 0; i < vins.length; i++) {
                    if (vins[i] == null) {
                        vins[i] = vi;
                        return vi;
                    }
                }
            } else {
                return null;
            }
        }
        return null;
    }

    public Vi elimina(String nom) {
        nom = Vi.normalitzaNom(nom).toLowerCase();
        for (int i = 0; i < vins.length; i++) {
            if (vins[i] != null) {
                String nomVi = vins[i].getNom().toLowerCase();
                if (nomVi.equals(nom)) {
                    if (vins[i].getEstoc() <= 0) {
                        Vi viTmp = vins[i];
                        vins[i] = null;
                        return viTmp;
                    }
                }
            }
        }
        return null;
    }

    public Vi cerca(String nom) {
        nom = Vi.normalitzaNom(nom).toLowerCase();

        for (int i = 0; i < vins.length; i++) {
            if (vins[i] != null) {
                String nomVi = vins[i].getNom().toLowerCase();
                if (nomVi.equals(nom)) {
                    return vins[i];
                }
            }
        }
        return null;
    }
}
```

## Entorn

**Enunciat**

Ara que ja tenim les classes principals de la nostra aplicació, passem a codificar el programa per que la Sra. Estrella pugui interaccionar amb la botiga.

Ens hem decidit per una opció molt senzilla, usable des de consola. La Sra. Estrella, quan era jove havia fet servir una de les primeres versions de l'editor ed. Sí, la nostra clienta té un passat. Per ella, les coses amb moltes coloraines i animacions que es fan ara, li semblen poc serioses, així que pensem que una aplicació en consola li estarà bé.

Així, implementarem la classe Entorn que disposa d'un main() que, en ser executat, ofereix un prompt on poder anar escrivint les comandes.

```{image} /_static/uml/uml-31-03-entorn-1.png
:alt: Diagrama UML
```

Diagrama de classes de la botiga de vins

El prompt serà botiga> i les comandes que acceptarà són:

"surt": finalitza l'execució del programa.

El programa s'acomiada dient "adéu".

"ajuda": ofereix un text d'ajuda amb la informació de les comandes disponibles

No ens complicarem gaire la vida. En aquesta versió, en demanar ajuda rebem el següent:

**botiga> ajuda**
Comandes disponibles:
ajuda
cerca
afegeix
modifica
elimina
surt
botiga>

"afegeix": permet afegir un nou vi a la botiga. En executar-ho, el programa demanarà interactivament pels diferents valors que composen un vi: nom, preu i estoc.

La interacció tindrà el següent aspecte:

**botiga> afegeix**
nom (enter cancel·la)> Roura blanc
preu (en cèntims)> 1223
estoc (enter sense estoc)>
Introduït:
Vi: Roura blanc
Preu: 1223
Estoc: 0

botiga>

Fixa't que les dades del vi apareixen tabulades per facilitar la lectura, i acaben amb un salt de línia extra. Curiosament s'assembla molt a la sortida de Vi.toString(). Bé, de fet són iguales!

En cas que no ens introdueixin nom, suposarem que no vol continuar afegint el vi, i tornarem al prompt.

El preu és llegit i mostrat en cèntims, tal i com es guarda a Vi. No és la manera més còmoda ni la més llegible, i en un futur haurem de fer alguna cosa per millorar-ho. De moment, ens està bé així.

Si pel preu o per l'estoc ens introdueixen una cadena buida, considerarem que volen indicar 0.

Si no és una cadena buida, el valor ha de correspondre a un enter positiu. Si no és el cas, mostrarem el missatge "ERROR: cal un enter positiu" i donarem per cancel·lada l'operació.

En cas que finalment no s'hagi pogut introduir el vi (el mètode Botiga.afegeix() ens retorna null, es mostrarà el missatge "ERROR: no s'ha pogut afegir". Recordem que això pot passar perquè ens hem quedat sense espai o bé perquè ja existia un vi amb aquest nom. De moment la Sra. Estrella haurà d'acceptar aquesta pobre informació.

"cerca": permet cercar un vi a la botiga. En executar-ho, el programa demanarà interactivament el nom.

La interacció tindrà el següent aspecte:

**botiga> cerca**
nom (enter cancel·la)> Roura blanc
Trobat:
Vi: Roura blanc
Preu: 1223
Estoc: 0

botiga>

En cas que no s'introdueixi nom, es considerarà que no vol continuar amb la cerca i es tornarà al prompt.

Si no es troba cap vi amb aquest nom, es mostrarà el missatge: "No trobat"

Finalment, si es troba un vi, es mostren els seus detalls exactament igual que en el cas de l'opció "afegeix".

"modifica": permet modificar les dades d'un vi. En executar-ho, el programa demanarà interactivament el nom del vi a modificar, i a continuació la resta de dades del vi, tot oferint la possibilitat d'acceptar el valor antic.

La interacció tindrà el següent aspecte:

**botiga> modifica**
nom (enter cancel·la)> Roura blanc
preu (enter 1223)> 1300
estoc (enter 0)> 24
Modificat:
Vi: Roura blanc
Preu: 1300
Estoc: 24

botiga>

Si no es troba cap vi amb aquest nom, es mostrarà el missatge: "No trobat"

Si pel preu o per l'estoc ens introdueixen una cadena buida, considerarem que volen indicar mantenir el valor antic.

Si no és una cadena buida, el valor ha de correspondre a un enter positiu. Si no és el cas, mostrarem el missatge "ERROR: el valor ha de ser un enter positiu" i donarem per cancel·lada l'operació sense fer cap modificació.

"elimina": permet eliminar un vi de la botiga. Funciona molt similar a "modifica". En aquest cas, però, mostrarà els atributs del vi a eliminar i demanarà confirmació:

La interacció tindrà el següent aspecte:

**botiga> elimina**
nom (enter cancel·la)> Roura blanc
A eliminar:
Vi: Roura blanc
Preu: 1300
Estoc: 24

**Segur?> Sí**
Error: no s'ha pogut eliminar
botiga>

En cas que finalment no s'hagi pogut eliminar el vi (el mètode Botiga.elimina() ens retorna null, es mostrarà el missatge "ERROR: no s'ha pogut eliminar". Recordem que això pot passar perquè estem intentant eliminar un vi que encara té estoc. De moment la Sra. Estrella haurà d'acceptar aquesta pobre informació.

Si, per contra, s'ha pogut eliminar el vi, el missatge serà "Eliminat".

Si ens diuen que no a la petició de confirmació, mostrarem el missatge "No eliminat".

Nota: cal vèncer la temptació de controlar aquí si es pot o no eliminar un vi que té estoc. Això és quelcom que ha de decidir Botiga. Malauradament, amb el disseny actual haurem de dir que no s'ha pogut eliminar sense especificar perquè. Ja ho arreglarem.

En cas que la comanda introduïda no sigui una de les esperades, mostrarà el missatge "ERROR: comanda no reconeguda. Escriviu help per ajuda".

En iniciar l'execució, el programa mostra un missatge de benvinguda: "Celler La Bona Estrella. Escriviu ajuda per veure opcions." i tot seguit mostra el prompt.
Què haig de fer?

Implementa la classe Entorn.

Una simulació d'execució del programa seria:

Celler La Bona Estrella. Escriviu ajuda per veure opcions.
botiga> afegeix
nom (enter cancel·la)> Roura blanc
preu (en cèntims)> 2134
estoc (enter sense estoc)>
Introduït:
Vi: Roura blanc
Preu: 2134
Estoc: 0

**botiga> afegeix**
nom (enter cancel·la)> El Quinta 2018
preu (en cèntims)> 1485
estoc (enter sense estoc)> 24
Introduït:
Vi: El Quinta 2018
Preu: 1485
Estoc: 24

**botiga> cerca**
nom (enter cancel·la)> Roura blanc
Trobat:
Vi: Roura blanc
Preu: 2134
Estoc: 0

**botiga> surt**
adéu

Pistes

És molt probable que et sigui útil recuperar algunes utilitats que tens escrites en exercicis anteriors, com ara UtilitatsConfirmacio i UtilString. Si no els tens, no pateixis. L'únic problema és que et tocarà codificar més funcionalitats.

Avís

Llegeix la següent pista només si trobes problemes per pensar com començar a implementar aquest exercici.

Una possible implementació (parcial és clar) seria la següent:

```java
public class Entorn {
```

```java
    private final Botiga botiga = new Botiga();

    public static void main(String[] args) {

        Entorn entorn = new Entorn();

        mostraBenvinguda();

        while (true) {

            mostraPrompt();

            String comanda = Entrada.readLine().strip();

            if (comanda.isEmpty()) continue;

            if (comanda.equals("surt")) break;

            switch (comanda) {

                case "ajuda": mostraAjuda();

                             break;

                case "afegeix": entorn.processaAfegeix();

                           break;

                case "cerca": entorn.processaCerca();

                             break;

                case "modifica": entorn.processaModifica();

                            break;

                case "elimina": entorn.processaElimina();

                           break;

                default: mostraErrorComandaDesconeguda();

            }

        }

        mostraComiat();

    }
}
```

En aquesta implementació he optat per fer dinàmics els mètodes d'Entorn que han de tractar la botiga, i estàtics els altres, com ara els que mostren missatges. Podries decidir fer-ho tot estàtic i, amb el que sabem de moment del futur de l'aplicació que estem desenvolupant, probablement és una decisió acceptable.

```java
public class Entorn {
    private final Botiga botiga = new Botiga();
    
    public static void main(String[] args) {
        Entorn entorn = new Entorn();
        mostraBenvinguda();

        while (true) {
            mostraPrompt();
            String comanda = Entrada.readLine();
            if (comanda.isEmpty()) continue;
            if (comanda.equals("surt")) break;

            switch (comanda) {
                case "ajuda": mostraAjuda();
                    break;
                case "afegeix": entorn.processaAfegeix();
                    break;
                case "cerca": entorn.processaCerca();
                    break;
                case "modifica": entorn.processaModifica();
                    break;
                case "elimina": entorn.processaElimina();
                    break;
                default: mostraErrorComandaDesconeguda();
            }
        }
        mostraComiat();
    }

    public static void mostraBenvinguda() {
        System.out.println("Celler La Bona Estrella. Escriviu ajuda per veure opcions.");
    }
    
    public static void mostraPrompt() {
        System.out.print("botiga> ");
    }

    public static void mostraErrorComandaDesconeguda() {
        System.out.println("ERROR: comanda no reconeguda. Escriviu help per ajuda");
    }

    public static void mostraComiat() {
        System.out.println("adéu");
    }

    public static void mostraAjuda() {
        System.out.println("Comandes disponibles:");
        System.out.println("ajuda");
        System.out.println("cerca");
        System.out.println("afegeix");
        System.out.println("modifica");
        System.out.println("elimina");
        System.out.println("surt");
    }

    public static int validaPreuEstoc(String valor) {
        int valorEnter = 0;
        if (!valor.isBlank()) {
            if (UtilString.esEnter(valor)) {
                valorEnter = UtilString.aEnter(valor);
                if (valorEnter < 0) {
                    return -1;
                }
            }
        }
        return valorEnter;
    }

    public void processaAfegeix() {
        System.out.print("nom (enter cancel·la)> ");
        String nom = Entrada.readLine();

        if (nom.isBlank()) { return; }

        System.out.print("preu (en cèntims)> ");
        String preu = Entrada.readLine();

        int preuEnter = validaPreuEstoc(preu);
        if (preuEnter == -1) {
            System.out.println("ERROR: cal un enter positiu");
            return;
        }

        System.out.print("estoc (enter sense estoc)> ");
        String estoc = Entrada.readLine();

        int estocEnter = validaPreuEstoc(estoc);
        if (estocEnter == -1) {
            System.out.println("ERROR: cal un enter positiu");
            return;
        }

        Vi vi = new Vi(nom, preuEnter, estocEnter);
        Vi afegit = botiga.afegeix(vi);

        if (afegit == null) {
            System.out.println("ERROR: no s'ha pogut afegir");
            return;
        }

        System.out.printf("Introduït:%s%n", afegit);
    }

    public void processaCerca() {
        System.out.print("nom (enter cancel·la)> ");
        String nom = Entrada.readLine();

        if (!nom.isBlank()) {
            Vi cercat = botiga.cerca(nom);
            if (cercat != null) {
                System.out.printf("Trobat:%s%n", cercat);
            } else {
                System.out.println("No trobat");
            }
        }
    }

    public void processaModifica() {
        System.out.print("nom (enter cancel·la)> ");
        String nom = Entrada.readLine();
        if (nom.isBlank()) { return; }
        
        Vi vi = botiga.cerca(nom);
        if (vi == null) {
            System.out.println("No trobat");
            return;
        }
        
        System.out.printf("preu (enter %d)> ", vi.getPreu());
        String preu = Entrada.readLine();

        int preuEnter = validaPreuEstoc(preu);
        if (preuEnter == -1) {
            System.out.println("ERROR: cal un enter positiu");
            return;
        }
        vi.setPreu(preuEnter);

        System.out.printf("estoc (enter %d)> ", vi.getEstoc()); 
        String estoc = Entrada.readLine();

        int estocEnter = validaPreuEstoc(estoc);
        if (estocEnter == -1) {
            System.out.println("ERROR: cal un enter positiu");
            return;
        }
        vi.setEstoc(estocEnter);
        
        System.out.printf("Modificat:%s%n", vi);
    }

    public void processaElimina() {
        System.out.print("nom (enter cancel·la)> ");
        String nom = Entrada.readLine();

        if (nom.isBlank()) { return; }

        Vi cercat = botiga.cerca(nom);
        if (cercat == null) {
            System.out.println("No trobat");
            return;
        }

        System.out.printf("A eliminar:%s%n", cercat);
        System.out.print("Segur?> ");
        boolean confirmacio = UtilitatsConfirmacio.respostaABoolean(Entrada.readLine());

        if (confirmacio) {
            Vi eliminar = botiga.elimina(nom);
            if (eliminar == null) {
                System.out.println("ERROR: no s'ha pogut eliminar");
                return;
            }
            System.out.println("Eliminat");
        } else {
            System.out.println("No eliminat");
            return;
        }
    }
}
```

## UtilString

*Aquest programa és la meva biblioteca de String: Conte les següents utilitats:
* Una funció per verificar si un caràcter es vocal i retorna un valor boolean (esVocal).

* Una funció que filtra un text i retorna un String amb només les lletres del text (nomesLletres).

* Una funció que separa un text de només lletres i retorna un String amb les lletres separat per comes (lletresSeparades).

* Una funció que rep un text, un valor inicial i un valor final i retorna un interval del text en el rang d'inici i final ambdós inclosos (intervalString).

* Una funció que rep un text i retorna si és un valor enter o no, el valor pot ser negatiu o positiu, o pot tenir espai en blanc en els laterals (esEnter estricte).

* Una funció que rep un text i el converteix a enter des del mètode Integer.parseInt, el valor pot ser negatiu o positiu, o pot tenir espai en blanc en qualsevol joc, punt o guió baix entre dos nombres (aEnter flexible).

* Una funció que rep un text i una quantitat i retorna un String format per la repetició circular de carácters fins a la quantitat (cadenaContinua).

* Una funció que rep un text i un subtext i retornar si és substring o no, com l'utilitat de String contains (esSubstring estricte).

* Una funció que rep un text i un subtext (el text i subtext pot ser en majúscules, minúscules, contenir vocals catalanes i la ç) i un boolean per inidicar si es estricte o flexible i retornar si és substring o no, com la utilitat de String contains (esSubstring flexible).

* Una funció que rep un text i un prefix i retornar si és el començament del text de manera seqüencial o no, com l'utilitat de String startsWith (esPrefix estricte).

* Una funció que rep un text i un prefix (el text i prefix pot ser en majúscules, minúscules, contenir vocals catalanes i la ç) i un boolean i retornar si és el prefix és el començament del text de manera seqüencial o no, com la utilitat de String startsWith (esPrefix flexible).

* Una funció que rep un text i un sufix i retornar si és la terminació del text de manera seqüencial o no, com l'utilitat de String endsWith (esSufix estricte).

* Una funció que rep un text i un sufix (el text i sufix pot ser en majúscules, minúscules, contenir vocals catalanes i la ç) i un boolean i retornar si és el sufix és la terminació del text de manera seqüencial o no, com la utilitat de String endsWith (esSufix flexible).

* Una funció que rep un text i un subtext i retorna quantes vegades es troba el subtex en el text, com la utilitat de String count de altres llenguatges de programació (quants estricte).

* Una funció que rep un text i un subtext (el text i subtext pot ser en majúscules, minúscules, contenir vocals catalanes i la ç) i un boolean i retorna quantes vegades es troba el subtext en el text, com la utilitat de String count de altres llenguatges de programació (quants flexible).

* Una funció que rep una paraula i retornar si és creixent de manera estricta o no (esCreixent(String)).

* Una funció que rep una paraula i retornar si és decreixent de manera estricta o no (esDecreixent(String)).

* Una funció que rep una paraula i retornar si és creixidecri de manera estricta o no (esCreixiDecri(String)).

* Una funció que rep una paraula i retornar si és decricreixi de manera estricta o no (esDecriCreixi(String)).

* Una funció que rep una paraula i retornar si és creixent de manera flexible o no (esCreixent(String, boolean)).

* Una funció que rep una paraula i retornar si és decreixent de manera flexible o no (esDecreixent(String, boolean)).

* Una funció que rep una paraula i retornar si és creixidecri de manera flexible o no (esCreixiDecri(String, boolean)).

* Una funció que rep una paraula i retornar si és decricreixi de manera flexible (esDecriCreixi(String, boolean)).

* Una funció que rep un text i retorna un array de String sense separador (espai en blanc), com la utilitat de String split (separa(String)).

* Una funció que rep un text i un boolean, si el boolean és false retorna el resultat de la funció separa(String), en cas que el boolean sigui true retorna un array de String amb  els espais inclòs, com la utilitat de String split (separa(String, boolean)).

* Una funció que rep un array de Strings i un String com separador i retorna un String amb el array separat pel separador, com la utilitat de String join (junta(String[], String)).

* Una funció que rep un array de Strings, un String com separador i un String com darrer separador i retorna un String amb el array separat pels separadors en l'ordre indicat, com la utilitat de String join (junta(String[], String, String)).

```java
 public class UtilString {
    public static boolean esVocal(char caracter) {
        String vocals = "aàeèéiíïoóòuúü";
        
        for (int i = 0; i < vocals.length(); i++) {
            char v = vocals.charAt(i);
            if (Character.toLowerCase(caracter) == v) {
                return true;                   
            }
        }     
        return false;
    }
    
    public static String nomesLletres(String text) {
        String nouText = "";
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (Character.isLetter(c)) {
                nouText += c;
            }
        }
        return nouText;
    }
    
    public static String lletresSeparades(String text) {
        String nouText = "";
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (i < text.length()-1) {
                nouText += c + ", ";
            } else {
                nouText += c;
            }
        }
        return nouText;
    }

    public static String intervalString(String text, int inici, int fi) {
        String intervalCadena = "";

        inici = posicioIniciText(text, inici);
        fi = posicioFinalText(text, fi);

        if (inici < fi) {
            for (int i = inici; i <= fi; i++) {
                char c = text.charAt(i);
                intervalCadena += c;
            }
        } else {
            for (int i = inici; i >= fi; i--) {
                char c = text.charAt(i);
                intervalCadena += c;
            }
        }
        return intervalCadena;
    }

    public static int posicioIniciText(String text, int posIni) {
        if (posIni < 0) {
            return 0;
        }

        if (posIni >= text.length()) {
            return text.length()-1;
        }
        return posIni;
    }

    public static int posicioFinalText(String text, int posFi) {
        if (posFi < 0) {
            return 0;
        }

        if (posFi >= text.length()) {
            return text.length()-1;
        }
        return posFi;
    }

    public static boolean esEnter(String text) {
        text = text.strip();
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (text.charAt(0) != '-' || text.charAt(0) != '+') {
                if (i > 0) {
                    if (!Character.isDigit(c)) {
                        return false;
                    }
                }
            } 
        }
        return true;
    }

    public static boolean esEnter(String text, boolean estricte) {
        if (estricte) {
            return esEnter(text);
        }

        text = text.strip();
        for (int i = 0; i < text.length(); i++) {
            if (text.charAt(0) == '.' || text.charAt(0) == '_') return false;
            if (text.charAt(text.length()-1) == '.' || text.charAt(text.length()-1) == '_') return false;
            if (i > 0 && i < text.length()-1) {
                if (text.charAt(i) == '.' || text.charAt(i) == '_') {
                    if (!Character.isDigit(text.charAt(i-1)) || !Character.isDigit(text.charAt(i+1))) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public static int aEnter(String text) {
        return Integer.parseInt(text);
    }

    public static int aEnter(String text, boolean estricte) {
        if (estricte) {
            return aEnter(text);
        }
        if (esEnter(text, estricte)) {
            String nouText = "";

            for (int i = 0; i < text.length(); i++) {
                char c = text.charAt(i);

                if (Character.isDigit(c) || c == '-' || c == '+') {
                    nouText += c;
                }
            }
            return Integer.parseInt(nouText);
        }
        return Integer.parseInt(text);
    }

    public static String cadenaContinua(String text, int nombre) {
        String textContinuo = "";
        for (int i = 0; i < nombre; i++) {
            char c = text.charAt(i % text.length());
            textContinuo += c;
        }
        return textContinuo;
    }

    // Versió 1
    /*public static String filtraVocalsCatala(String text) {
        String nouText = "";
        for (int i = 0; i < text.length(); i++) {
            char caracter = text.charAt(i);
            char vocalCatala = switch (caracter) {
                case 'à' -> 'a';
                case 'è', 'é' -> 'e';
                case 'í', 'ï' -> 'i';
                case 'ò', 'ó' -> 'o';
                case 'ù', 'ú', 'ü' -> 'u';
                case 'ç' -> 'c';
                case 'À' -> 'A';
                case 'È', 'É' -> 'E';
                case 'Í', 'Ï' -> 'I';
                case 'Ò', 'Ó' -> 'O';
                case 'Ù', 'Ú', 'Ü' -> 'U';
                case 'Ç' -> 'C';
                default -> caracter;
            };
            nouText += vocalCatala;
        }
        return nouText;
    }*/
    
    // Versió 2
    public static String filtraVocalsCatala(String text) {
        String nouText = "";
        String vocalsCatala = "àèéíïòóùúüç";
        String vocals = "aeeiioouuuc";
        
        for (int i = 0; i < text.length(); i++) {
            boolean reemplazo = false;
            char c = text.charAt(i);

            for (int j = 0; j < vocalsCatala.length(); j++) {
                char v = vocals.charAt(j);
                char vc = vocalsCatala.charAt(j);
                
                if (c == vc) {
                    nouText += v;
                    reemplazo = true;
                }
            }
            if (!reemplazo) {
                nouText += c;
            }
        }
        return nouText;
    }

    public static boolean esSubstring(String text, String subtext) {
        if (text.length() == 0 || subtext.length() > text.length()) {
            return false;
        }

        if (text.length() > 0 && subtext.length() == 0) {
            return true;
        }

        for (int i = 0; i < text.length(); i++) {
            int igualtat = 0;
            for (int j = 0; j < subtext.length(); j++) {
                if (i + igualtat < text.length()) {
                    if (text.charAt(i + igualtat) == subtext.charAt(j)) {
                        igualtat++;
                    }
                } else {
                    break;
                }
                if (igualtat == subtext.length()) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean esSubstring(String text, String subtext, boolean estricte) {
        if (estricte) {
            return esSubstring(text, subtext);   
        }

        if (text.length() == 0 || subtext.length() > text.length()) {
            return false;
        }

        if (text.length() > 0 && subtext.length() == 0) {
            return true;
        }

        text = text.toLowerCase();
        subtext = subtext.toLowerCase();
        text = filtraVocalsCatala(text);
        subtext = filtraVocalsCatala(subtext);

        return esSubstring(text, subtext);
    }

    public static boolean esPrefix(String text, String prefix) {
        if (text.length() == 0 || prefix.length() > text.length()) {
            return false;
        }

        if (text.length() > 0 && prefix.length() == 0) {
            return true;
        }

        int igualtat = 0;
        for (int i = 0; i < prefix.length(); i++) {
            if (prefix.charAt(i) == text.charAt(i)) {
                igualtat++;
            }

            if (igualtat == prefix.length()) {
                return true;
            }
        }
        return false;
    }

    public static boolean esPrefix(String text, String prefix, boolean estricte) {
        if (estricte) {
            return esPrefix(text, prefix);
        }

        if (text.length() == 0 || prefix.length() > text.length()) {
            return false;
        }

        if (text.length() > 0 && prefix.length() == 0) {
            return true;
        }

        text = text.toLowerCase();
        prefix = prefix.toLowerCase();
        text = filtraVocalsCatala(text);
        prefix = filtraVocalsCatala(prefix);

        return esPrefix(text, prefix);
    }

    public static boolean esSufix(String text, String sufix) {
        if (text.length() == 0 || sufix.length() > text.length()) {
            return false;
        }

        if (text.length() > 0 && sufix.length() == 0) {
            return true;
        }

        int igualtat = 0;
        int j = text.length()-1;
        for (int i = sufix.length()-1; i >= 0; i--) {
            if (sufix.charAt(i) == text.charAt(j)) {
                igualtat++;
            }
            j--;
            if (igualtat == sufix.length()) {
                return true;
            }
        }
        return false;
    }

    public static boolean esSufix(String text, String sufix, boolean estricte) {
        if (estricte) {
            return esSufix(text, sufix);
        }

        if (text.length() == 0 || sufix.length() > text.length()) {
            return false;
        }

        if (text.length() > 0 && sufix.length() == 0) {
            return true;
        }

        text = text.toLowerCase();
        sufix = sufix.toLowerCase();
        text = filtraVocalsCatala(text);
        sufix = filtraVocalsCatala(sufix);

        return esSufix(text, sufix);
    }

    public static int quants(String text, String subtext) {
        if (text.length() == 0 || subtext.length() == 0) {
            return 0;
        }

        int quantsCops = 0;

        for (int i = 0; i < text.length(); i++) {
            int igualtat = 0;
            for (int j = 0; j < subtext.length(); j++) {
                if (i + igualtat < text.length()) {
                    if (text.charAt(i + igualtat) == subtext.charAt(j)) {
                        igualtat++;
                    }
                } else {
                    break;
                }
                if (igualtat == subtext.length()) {
                    quantsCops++;
                }
            }
        }
        return quantsCops;
    }

    public static int quants(String text, String subtext, boolean estricte) {
        if (estricte) {
            return quants(text, subtext);
        }

        if (text.length() == 0 || subtext.length() > text.length()) {
            return 0;
        }

        if (text.length() > 0 && subtext.length() == 0) {
            return 0;
        }

        text = text.toLowerCase();
        subtext = subtext.toLowerCase();
        text = filtraVocalsCatala(text);
        subtext = filtraVocalsCatala(subtext);

        return quants(text, subtext);
    }

    public static boolean esCreixent(String paraula) {
        paraula = filtraAlfabetCatala(filtraVocalsCatala(paraula));
        
        if (paraula.length() < 3 || quantsCaracterDiferent(paraula) < 3) { return false; }
        for (int i = 0; i < paraula.length(); i++) {
            char ca = paraula.charAt(i);
            
            if (i < paraula.length()-1) {
                char cs = paraula.charAt(i+1);
                
                if (Character.isWhitespace(ca) || Character.isWhitespace(cs)) {
                    continue;
                }  
                
                if ((int)(ca) > (int)(cs)) {
                    return false;   
                }
            }
        }
        return true;
    }

    public static boolean esDecreixent(String paraula) {
        paraula = filtraAlfabetCatala(filtraVocalsCatala(paraula));
        
        if (paraula.length() < 3 || quantsCaracterDiferent(paraula) < 3) { return false; }
        for (int i = 0; i < paraula.length(); i++) {
            char ca = paraula.charAt(i);
            
            if (i < paraula.length()-1) {  
                char cs = paraula.charAt(i+1);
                
                if (Character.isWhitespace(ca) || Character.isWhitespace(cs)) {
                    continue;
                }  
                
                if ((int)(ca) < (int)(cs)) {
                    return false;  
                }
            }
        }
        return true;
    }
    
    public static boolean esCreixiDecri(String paraula) {
        paraula = filtraAlfabetCatala(filtraVocalsCatala(paraula));

        boolean paraulaCreixent = false;
        boolean paraulaCreixiDecri = false;
        int creixi = 0;
        
        if (paraula.length() < 3 || quantsCaracterDiferent(paraula) < 3) { return false; }
        for (int i = 0; i < paraula.length(); i++) {
            char ca = paraula.charAt(i);
            
            if (i < paraula.length()-1) {     
                char cs = paraula.charAt(i+1);
                
                if (Character.isWhitespace(ca) || Character.isWhitespace(cs)) {
                    continue;
                }  
                
                if (!paraulaCreixiDecri && (int)(ca) < (int)(cs)) {
                    paraulaCreixent = true;
                    creixi++;
                } else if (creixi > 0 && (int)(ca) > (int)(cs)) {
                    paraulaCreixent = false;
                    paraulaCreixiDecri = true;
                } else {
                    return false;
                }
            }
        }
        return paraulaCreixiDecri;
    }

    
    public static boolean esDecriCreixi(String paraula) {
        paraula = filtraAlfabetCatala(filtraVocalsCatala(paraula));

        boolean paraulaDecreixent= false;
        boolean paraulaDecriCreixi = false;
        int decri = 0;
        
        if (paraula.length() < 3 || quantsCaracterDiferent(paraula) < 3) { return false; }
        for (int i = 0; i < paraula.length(); i++) {
            char ca = paraula.charAt(i);
            
            if (i < paraula.length()-1) {   
                char cs = paraula.charAt(i+1);    
                
                if (Character.isWhitespace(ca) || Character.isWhitespace(cs)) {
                    continue;
                }  
                
                if (!paraulaDecriCreixi && (int)(ca) > (int)(cs)) {
                    paraulaDecreixent = true;
                    decri++;
                } else if (decri > 0 && (int)(ca) < (int)(cs)) {
                    paraulaDecreixent = false;
                    paraulaDecriCreixi = true;
                } else {
                    return false;
                }
            }
        }
        return paraulaDecriCreixi;
    }
       
    public static boolean esCreixent(String paraula, boolean estricta) {
        if (estricta) {
            return esCreixent(paraula);
        }
        
        paraula = filtraAlfabetCatala(filtraVocalsCatala(paraula));
        
        if (paraula.length() < 3 || quantsCaracterDiferent(paraula) < 3) { return false; }
        for (int i = 0; i < paraula.length(); i++) {
            char ca = paraula.charAt(i);
            
            if (i < paraula.length()-1) {
                char cs = paraula.charAt(i+1);
                
                if (Character.isWhitespace(ca) || Character.isWhitespace(cs)) {
                    continue;
                }  
                
                if ((int)(ca) >= (int)(cs)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    public static boolean esDecreixent(String paraula, boolean estricta) {
        if (estricta) {
            return esDecreixent(paraula);
        } 
        
        paraula = filtraAlfabetCatala(filtraVocalsCatala(paraula));
        
        if (paraula.length() < 3 || quantsCaracterDiferent(paraula) < 3) { return false; }
        for (int i = 0; i < paraula.length(); i++) {
            char ca = paraula.charAt(i);
            
            if (i < paraula.length()-1) {  
                char cs = paraula.charAt(i+1);
                
                if (Character.isWhitespace(ca) || Character.isWhitespace(cs)) {
                    continue;
                }  
                
                if ((int)(ca) <= (int)(cs)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    public static boolean esCreixiDecri(String paraula, boolean estricta) {
        if (estricta) {
            return esCreixiDecri(paraula);
        }

        paraula = filtraAlfabetCatala(filtraVocalsCatala(paraula));
        
        boolean paraulaCreixent = false;
        boolean paraulaCreixiDecri = false;
        int creixi = 0;
        
        if (paraula.length() < 3 || quantsCaracterDiferent(paraula) < 3) { return false; }
        for (int i = 0; i < paraula.length(); i++) {
            char ca = paraula.charAt(i);
            
            if (i < paraula.length()-1) {     
                char cs = paraula.charAt(i+1);
                
                if (Character.isWhitespace(ca) || Character.isWhitespace(cs)) {
                    continue;
                }  
                
                if (!paraulaCreixiDecri && (int)(ca) <= (int)(cs)) {
                    paraulaCreixent = true;
                    creixi++;
                } else if (creixi > 0 && (int)(ca) >= (int)(cs)) {
                    paraulaCreixent = false;
                    paraulaCreixiDecri = true;
                } else {
                    return false;
                }
            }
        }       
        return paraulaCreixiDecri;
    }
    
    public static boolean esDecriCreixi(String paraula, boolean estricta) {
        if (estricta) {
            return esDecriCreixi(paraula);        
        }

        paraula = filtraAlfabetCatala(filtraVocalsCatala(paraula));
        
        boolean paraulaDecreixent= false;
        boolean paraulaDecriCreixi = false;
        int decri = 0;
        
        if (paraula.length() < 3 || quantsCaracterDiferent(paraula) < 3) { return false; }
        for (int i = 0; i < paraula.length(); i++) {
            char ca = paraula.charAt(i);
            
            if (i < paraula.length()-1) {
                char cs = paraula.charAt(i+1);  
                
                if (Character.isWhitespace(ca) || Character.isWhitespace(cs)) {
                    continue;
                }   
                
                if (!paraulaDecriCreixi && (int)(ca) >= (int)(cs)) {
                    paraulaDecreixent = true;
                    decri++;
                } else if (decri > 0 && (int)(ca) <= (int)(cs)) {
                    paraulaDecreixent = false;
                    paraulaDecriCreixi = true;
                } else {
                    return false;
                }
            }
        }
        return paraulaDecriCreixi;
    }
    
    public static String filtraAlfabetCatala(String text) {
        String nouText = "";
        for (int i = 0; i < text.length(); i++) {
            char c = Character.toLowerCase(text.charAt(i));
            if (c >= 'a' && c <= 'z') {
                nouText += c;
            } else if (c == 'ç') {
                nouText += 'c';
            }
        }
        return nouText;
    }
    
    public static int quantsCaracterDiferent(String text) {
        int quants = 1;
        
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            
            if (i < text.length()-1) {
                char cs = text.charAt(i+1);
                if (c != cs) {
                    quants++;
                }
            }
        }
        return quants;   
    }

    public static String espaiLletraFinal(String text) {
        String nouText = "";
        
        if (!text.isEmpty()) {
            char ultimCaracter = text.charAt(text.length()-1); 
            
            if (Character.isWhitespace(ultimCaracter)) {
                nouText = text + "a";
            } else if (!Character.isWhitespace(ultimCaracter)) {
                nouText = text + " ";
            } else {
                nouText = text;
            }        
        }
        return nouText;
    }
    
    public static int quantsParaules(String text) {
        String nouText = UtilString.espaiLletraFinal(text);
        String paraula = "";
        int quants = 0;
        
        for (int i = 0; i < nouText.length(); i++) {
            char c = nouText.charAt(i);
            if (!Character.isWhitespace(c)) {
                paraula += c;
            } else if (!paraula.isEmpty()) {
                quants++;
                paraula = "";
            }
        }
        return quants;
    }
    
    public static int quantsEspais(String text) {
        String nouText = UtilString.espaiLletraFinal(text);
        String blancs = "";
        int quants = 0;
    
        for (int i = 0; i < nouText.length(); i++) {
            char c = nouText.charAt(i);
            if (Character.isWhitespace(c)) {
                blancs += c;
            } else if (!blancs.isEmpty()) {
                quants++;
                blancs = "";
            }
        }
        return quants;
    }
    
    public static String[] separa(String text) {
        String[] paraules = new String[quantsParaules(text)];
        String paraula = "";
        int index = 0;
        text = espaiLletraFinal(text);
    
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
    
            if (!Character.isWhitespace(c)) {
                paraula += c;
            } else if (!paraula.isEmpty()) {
                paraules[index] = paraula;
                index++;
                paraula = "";
            }
        }
        return paraules;
    }
    
    public static String[] separa(String text, boolean inclouBlancs) {
        if (!inclouBlancs) {
            return separa(text);
        }
    
        String[] paraulesBlancs = new String[quantsParaules(text) + quantsEspais(text)];
        String paraula = "";
        String blanc = "";
        int index = 0;
        text = espaiLletraFinal(text);
    
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
    
            if (!Character.isWhitespace(c)) {
                paraula += c;
            } else if (!paraula.isEmpty()) {
                paraulesBlancs[index] = paraula;
                index++;
                paraula = "";
            }
    
            if (Character.isWhitespace(c)) {
                blanc += c;
            } else if (!blanc.isEmpty()) {
                paraulesBlancs[index] = blanc;
                index++;
                blanc = "";
            }
        }
        return paraulesBlancs;
    }

    public static String junta(String[] cadenes, String separador) {
        String cadenesSeparat = "";
    
        for (int i = 0; i < cadenes.length; i++) {
            if (i < cadenes.length-1) {
                cadenesSeparat += cadenes[i] + separador;
            } else {
                cadenesSeparat += cadenes[i];
            }
        }
        return cadenesSeparat;
    }
    
    public static String junta(String[] cadenes, String separador, String darrerSeparador) {
        String cadenesSeparat = "";
    
        for (int i = 0; i < cadenes.length; i++) {
            if (i < cadenes.length-2) {
                cadenesSeparat += cadenes[i] + separador;
            } else if (i == cadenes.length-2) {
                cadenesSeparat += cadenes[i] + darrerSeparador;
            } else {
                cadenesSeparat += cadenes[i];
            }
        }
        return cadenesSeparat;
    }
}
```

## UtilitatsConfirmacio

* Donada una resposta textual, aquesta funció tradueix la resposta a
* un booleà.
* Considera true quan la resposta és, independentment de majúscules i
* sense considerar espais a l'inici ni al final,
* "sí", "s", "yes" o "y", i algunes variants amb errors ortogràfics.
* Altrament considera false.

```java
 public class UtilitatsConfirmacio {
    public static boolean respostaABoolean(String resposta) {
        String nuevaResposta = "";
        for (int i = 0; i < resposta.length(); i++) {
            char c = resposta.charAt(i);
            if (Character.isLetter(c)) {
                nuevaResposta += c;
            }
        }
        if (nuevaResposta.isBlank()) {     
            return false;
        }
        
        nuevaResposta = nuevaResposta.toLowerCase();
        if (nuevaResposta.equals("s") || nuevaResposta.equals("y")) {
            return true;
        }
        if (nuevaResposta.equals("sí") || nuevaResposta.equals("yes")) {
            return true;
        }
        if (nuevaResposta.equals("si") || nuevaResposta.equals("vale") || nuevaResposta.equals("yeah")) {
            return true;
        }
        return false;
    }
}
```

## Vi

**Enunciat**

Una botiga de vi sense vi no és res. Així que començarem implementant aquesta classe tant important.

Diagrama de classes de la botiga de vins

De moment no hem fet un anàlisi gaire exhaustiu de les propietats que ens interessarà tenir en compte sobre els vins. Ens estimem més oferir-li a la Sra. Estrella una primera versió en funcionament.

nom: el nom oficial del producte. Ex. Roura blanc

Es codifica amb un String i no pot ser buit ni contenir només espais.

Es guarda sense espais a l'inici, ni al final, ni més d'un espai seguit entre mig. És a dir, si rebem "   Roura    blanc   ", el guardarem com a "Roura blanc". Tot el que no sigui espais, quedarà guardat tal i com es rebi. És a dir, no canviarem majúscules/minúscules. A aquesta modificació del nom li direm normalització i el mètode estàtic normalitzaNom() se n'encarregarà de realitzar-la.

En cas que normalitzaNom() rebi un nom no vàlid, retornarà el valor "NOM NO VÀLID!", el que farà que la instància sigui considerada com no vàlida pel mètode esValid().

Tota instància de Vi ha de tenir un nom i, per tant, ha d'aparèixer especificat als constructor.

Com que no ha de ser modificat mai, pot ser declarat final.

preu: l'import a la venda (en cèntims d'euro i sense iva)

Es codifica amb un enter, de manera que 12,5€ es guardaran com 1250. El preu mai no hauria de ser negatiu.

El valor inicial pot ser modificat amb el mètode setPreu(). En cas que se li indiqui un valor negatiu, setPreu() mantindrà el preu antic.

Tota instància de Vi ha de tenir un preu i, per tant, ha d'aparèixer especificat als constructor.

En cas que un constructor rebi un preu negatiu, deixarà com a valor -1, el que farà que la instància sigui considerada com no vàlida pel mètode esValid().

estoc: indica el nombre d'ampolles que es tenen d'aquest vi a la botiga.

El nombre d'ampolles no pot ser mai negatiu. Si s'intenta afegir un valor no vàlid, quedarà amb el valor anterior.

En crear-se un Vi, l'estoc serà 0 a menys que s'especifiqui al constructor específic corresponent.

En cas que el constructor rebi un estoc negatiu, deixarà com a valor -1, el que farà que la instància sigui considerada com no vàlida pel mètode esValid().

A banda, Vi sobreescriurà (override) el mètode toString() de manera que es mostrin les dades del vi d'una manera còmoda. Considera la classe MostraVi.

```java
public class MostraVi {

    public static void main(String[] args){

        System.out.println(new Vi("Roura Blanc", 1234, 42));

    }

}
```

En executar-la, tindrem:

- java·MostraVi¶
¶
- ···Vi:·Roura·Blanc¶
- ···Preu:·1234¶
- ···Estoc:·42¶

Nota: a la sortida anterior he remarcat els salts de línia ¶ i els espais ·.
Què haig de fer?

Implementa la classe Vi segons la descripció anterior.

Per provar la teva classe, considera UsaVi.java:

```java
public class UsaVi {

    public static void main(String[] args) {

        System.out.println("Vi sense estoc" + new Vi("Roura blanc", 1234));

        Vi vi = new Vi("Roura blanc", 1234, 24);

        System.out.println("Vi amb estoc" + vi);

        vi.setPreu(vi.getPreu() + 120);  // incrementa preu del vi

        vi.setEstoc(vi.getEstoc() - 10); // decrementa el nombre d'ampolles

        System.out.println("Vi modificat" + vi);

    }

}
```

L'execució haurà de generar la següent sortida:

**Vi sense estoc**
Vi: Roura blanc
Preu: 1234
Estoc: 0

**Vi amb estoc**
Vi: Roura blanc
Preu: 1234
Estoc: 24

**Vi modificat**
Vi: Roura blanc
Preu: 1354
Estoc: 14

```java
public class Vi {
    private final String nom;
    private int preu;
    private int estoc = 0;

    public Vi(String nom, int preu) {
        this.nom = normalitzaNom(nom);
        if (preu < 0) {
            this.preu = -1;
        } else {
            this.setPreu(preu);
        }
    }

    public Vi(String nom, int preu, int estoc) {
        this.nom = normalitzaNom(nom);
        if (preu < 0) {
            this.preu = -1;
        } else {
            this.setPreu(preu);
        }
        if (estoc < 0) {
            this.estoc = -1;
        } else {
            this.setEstoc(estoc);
        }
    }

    public String getNom() { return this.nom; }

    public int getPreu() { return this.preu; }

    public void setPreu(int preu) { 
        if (preu >= 0) { this.preu = preu; }
    }

    public int getEstoc() { return this.estoc; }

    public void setEstoc(int estoc) { 
        if (estoc >= 0) { this.estoc = estoc; }
    } 

    public boolean esValid() {
        if (this.getNom().equals("NOM NO VÀLID!")) { return false; }
        if (this.getPreu() < 0) { return false; }
        if (this.getEstoc() < 0) { return false; }
        return true;
    }

    @Override
    public String toString() {
        return String.format("%n    Vi: %s%n    Preu: %d%n    Estoc: %d%n", this.getNom(), this.getPreu(), this.getEstoc());
    }

    public static String normalitzaNom(String nom) {
        if (nom.isBlank()) {
            return "NOM NO VÀLID!";
        }

        nom = nom.strip();
        String nomNormalitzat = "";
        boolean espai = false;

        for (int i = 0; i < nom.length(); i++) {
            char c = nom.charAt(i);

            if (!Character.isWhitespace(c)) {
                nomNormalitzat += c;
                espai = false;
            } else {
                if (!espai) {
                    nomNormalitzat += " ";
                }
                espai = true;
            }
        }
        return nomNormalitzat;
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3103entorn.png
:alt: Diagrama UML
```
