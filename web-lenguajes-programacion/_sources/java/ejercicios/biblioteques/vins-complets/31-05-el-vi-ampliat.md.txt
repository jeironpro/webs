# Ejercicios — 31.05 — El Vi ampliat

## Botiga

**Enunciat**

Un cop ja tenim la classe Vi és un bon moment per implementar la classe Botiga.

Diagrama de classes de la botiga de vins

La classe Botiga ens permetrà gestionar la col·lecció de vins de la botiga de la Sra. Estrella.

Donat que necessitarem emmagatzemar vàries instàncies de Vi, en aquesta primera versió farem servir un array de Vi.

Suposarem que la botiga tindrà un nombre màxim de vins. Aquest màxim pot ser indicat amb el constructor específic, o bé pren el valor per defecte indicat per la constant DEFAULT_MAX_VINS, que val 10, en cas que no sigui indicat o que el valor indicat sigui menor que 1.

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
    private static int indexVi;

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

    public Vi elimina(String ref) {
        ref = Vi.normalitzaString(ref).toLowerCase();
        for (int i = 0; i < vins.length; i++) {
            if (vins[i] != null) {
                String refVi = vins[i].getRef().toLowerCase();
                if (refVi.equals(ref)) {
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

    public Vi cerca(String ref) {
        ref = Vi.normalitzaNom(ref).toLowerCase();

        for (int i = 0; i < vins.length; i++) {
            if (vins[i] != null) {
                String refVi = vins[i].getRef().toLowerCase();
                if (refVi.equals(ref)) {
                    return vins[i];
                }
            }
        }
        return null;
    }
    
    public Vi cerca(Vi plantilla) {
    	String ref = plantilla.getRef();
    	String nom = plantilla.getNom();
    	int preu = plantilla.getPreu();
    	int estoc = plantilla.getEstoc();
    	String lloc = plantilla.getLloc();
    	String origen = plantilla.getOrigen();
    	String tipus = plantilla.getTipus();
    	String collita = plantilla.getCollita();
    	
		for (Vi vi: vins) {
		    if (vi == null) continue;
		    if (ref == null || !ref.isEmpty() && !ref.equalsIgnoreCase(vi.getRef())) continue;
		    if (nom == null || !nom.isEmpty() && !nom.equalsIgnoreCase(vi.getNom())) continue;
		    if (preu >= 0 && preu <= vi.getPreu()) continue;
		    if (estoc >= 0 && estoc >= vi.getEstoc()) continue;
			if (lloc == null || !lloc.isEmpty() && !lloc.equalsIgnoreCase(vi.getLloc())) continue;
		    if (origen == null || !origen.isEmpty() && !origen.equalsIgnoreCase(vi.getOrigen())) continue;
		    if (tipus == null || !tipus.isEmpty() && !tipus.equalsIgnoreCase(vi.getTipus())) continue;
		    if (collita == null || !collita.isEmpty() && !collita.equalsIgnoreCase(vi.getCollita())) continue;
		    return vi;
		}
		return null;
	}

    public void iniciaRecorregut() {
        indexVi = 0;
    }

    public Vi getSeguent() {
        while (indexVi < vins.length) {
            if (vins[indexVi] == null) {
                indexVi++;
                continue;
            }
            Vi vi = vins[indexVi];
            indexVi++;
            return vi;
        }
        return null;
    }
}
```

## Entorn

**Enunciat**

En aquesta iteració del nostre projecte, afegirem la capacitat de guardar i recuperar les dades dels vins en un fitxer, de manera que puguin ser accedides en diferents execucions de l'aplicació.

Diagrama de classes de la botiga de vins

Entorn en arrencar mirarà de llegir les dades del fitxer botiga.csv. En cas de no existir, la botiga restarà buida. Tant si existeix el fitxer com si no, Entorn informarà després del missatge de benvinguda, quants vins ha carregat del fitxer. "Referències llegides: 432".

En sortir, el programa guardarà les dades al fitxer. Per simplicitat, guardarà les dades sempre, encara que no hi hagi hagut canvis. Abans del missatge de comiat, indicarà el nombre de vins guardats al fitxer. "Referències guardades: 432".

Dotarem a la classe Vi d'un parell de mètodes nous que ens simplificaran la tasca de convertir de línies de csv a vi i viceversa.

deArrayString(): aquest mètode estàtic rep un array de Strings que ha de contenir els valors dels diferents atributs d'un vi en forma de String i ens retorna un vi inicialitzat amb aquests valors. Si algun dels valors rebuts no fos adequat per l'atribut corresponent de vi, retornarà null.

aArrayString(): aquest mètode retorna un array de Strings amb els valors del vi.

L'ordre dels atributs a l'array de Strings pot ser el que vulguem, sempre i quant sigui el mateix per deArrayString() i aArrayString(). Per exemple, podria ser nom, preu, estoc.

Per carregar els vins del fitxer no ens cal cap modificació de Botiga doncs podem anar llegint línia a línia, convertint-lo a Vi amb l'ajut de Vi.deArrayString() i, si hem tingut èxit, afegir el nou vi de la manera habitual a la botiga.

Per guardar els vins que ja hi són a la botiga, però, sí ens cal quelcom que encara no tenim: la possibilitat de recòrrer tots els vins que disposa la botiga. Per a aconseguir aquesta funcionalitat, afegirem dos nous mètodes a Botiga:

iniciaRecorregut(): comença el recorregut dels vins de la botiga.

getSeguent(): retorna el següent vi del recorregut. Si no hi ha més vins, retornarà null.

Així, per mostrar tots els vins disponibles a la botiga, podrem fer quelcom similar a:

```java
botiga.iniciaRecorregut();

while (true) {

    Vi vi = botiga.getSeguent();

    if (vi == null) break;

    System.out.println(vi);

}
```

Considerarem que el fitxer CSV no conté capçaleres i que les files hauran de correspondre als valors separats per punt i coma (;) i no per una simple coma, ja que sospitem que algun vi podria tenir un nom tan sofisticat que requerís aquest símbol.

Un exemple de contingut esperable al fitxer botiga.csv podria ser:

**Roura blanc;1234;24**
El Quintà;1485;12
Almodi Petit Blanc;570;32

En cas que trobem una línia del fitxer que no contingui totes les dades requerides, o bé que el valor d'algun dels camps no sigui convertible al tipus que esperem, simplement la ignorarem. D'aquestes comprovacions se n'encarrega el mètode Vi.deArrayString().
Què haig de fer?

Implementa els canvis necessaris perquè l'aplicació pugui mantenir la informació de vins d'una execució a la següent.

Els canvis a realitzar són:

afegir els nous mètodes a Botiga.

afegir els nous mètodes a Vi.

afegir la funcionalitat a l'entorn de carregar en arrencar i guardar en sortir.

Pistes

Llegeix això només si trobes problemes per realitzar alguna de les parts d'aquesta ampliació.
Ajuntar i separar línies de CSV

Un dels problemes que has de resoldre per realitzar aquesta ampliació és la manipulació de línies de CSV.

Per convertir les línies de CSV a un array de Strings ja saps que disposes del mètode String.split() però, com fas l'operació inversa? Per descomptat, la pots programar amb un bucle. A aquestes alçades segur que no et resulta difícil composar un String amb els elements d'un array separats per ;. Hi ha però una opció més immediata: String.join().

Considera aquest fragment de codi que converteix una entrada amb elements separats per , als mateixos elements però separats per ;:

```java
String comes = "una,dues,tres";

String[] paraules = comes.split(",");           // {"una", "dues", "tres"}

String puntIComes = String.join(";", paraules); // una;dues;tres
```

Recorregut de la botiga

Per poder guardar els vins de la botiga, ens cal poder accedir a aquests de manera seqüencial. El problema és que fins ara Botiga només ens permet consultar els vins a partir del mètode cerca(), que no és adequat pel nostre objectiu actual.

El que ens cal és poder recorrer els vins des del primer al darrer, com si fos un array de vins. Com que no volem lliurar l'array de vins amb el que emmagatzema Botiga els vins, el que farem serà implementar un mecanisme de recorregut casolà.

La idea bàsica és que et cal una nova variable que et permeti saber quin serà el següent vi a retornar. Aquesta variable haurà de posar-se a 0 quan es demana iniciar el recorregut i anar-se incrementant a mida que ens van demanant retornar el següent. En el moment que arriba al límit de l'array de vins, no ha de continuar.

Un problema és que no totes les posicions de l'array de vins estan sempre ocupades. Amb la implementació actual, quan eliminem un vi, marquem la seva posició amb null. Això obligarà el teu getSeguent() a saltar espais buits.

```java
import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.BufferedWriter;
import java.io.IOException;

public class Entorn {
    private final Botiga botiga = new Botiga();
    private static final String ruta = "botiga.csv";
    private static int quantsVins = 0;
    
    public static void main(String[] args) throws IOException {
        Entorn entorn = new Entorn();
        mostraBenvinguda();
        entorn.carregaVins();        
        
        while (true) {
            mostraPrompt();
            String comanda = Entrada.readLine();
            
            if (comanda.isEmpty()) { continue; }
            if (comanda.equals("surt")) { break; }
            
            switch (comanda) {
                case "ajuda": mostraAjuda();
                    break;
                case "afegeix": mostraComandaNoDisponible();
                    break;
                case "cerca": entorn.processaCerca();
                    break;
                case "modifica": mostraComandaNoDisponible();
                    break;
                case "elimina": mostraComandaNoDisponible();
                    break;
                default: mostraErrorComandaDesconeguda();
            };
        }
        mostraComiat();
    }
    
    public static void mostraBenvinguda() {
        System.out.println("Celler La Bona Estrella. Escriviu ajuda per veure opcions.");
    }
    
    public static void mostraPrompt() {
        System.out.print("botiga> ");
    }
    
    public static void mostraAjuda() {
        System.out.println("Comandes disponibles:");
        System.out.println("ajuda");
        System.out.println("cerca");
        System.out.println("surt");
    }
    
    public static void mostraErrorComandaDesconeguda() {
        System.out.println("ERROR: comanda no reconeguda. Escriviu help per ajuda");
    }
    
    public static void mostraComandaNoDisponible() {
    	System.out.println("Comanda temporalment no disponible");
    }
    
    public static void mostraComiat() {
        System.out.println("adéu");
    }
    
    public static String llegirValorPropietat(String propietat) {
    	System.out.print(propietat);
    	String valor = Entrada.readLine();
    	return valor;
    } 

    public void processaCerca() {
        System.out.print("ref> ");
        String ref = Entrada.readLine();

        if (ref.equals("!")) {
            return;
        }
        
        if (!ref.isBlank()) {
        	Vi cercaRef = botiga.cerca(ref);
        	
        	if (cercaRef != null) {
		        System.out.printf("Trobat:%s%n", cercaRef);
		        return;
		    } else {
		        System.out.println("No trobat");
		        return;
		    }
        } else {
            processaCercaPlantilla();
        }
    }
    
    public void processaCercaPlantilla() {
    	String ref = "";
    	String nom = "";
        String preu = "";
        String estoc = "";
        String lloc = "";
        String origen = "";
        String tipus = "";
        String collita = "";
        int preuEnter = -1;
        int estocEnter = -1;

        while (true) {
            nom = llegirValorPropietat("nom> ");

            if (nom.equals("!")) {
            	nom = "";
                break;
            }
            
            preu = llegirValorPropietat("preu max.> ");

            if (preu.equals("!")) {
                break;
            }
            
            if (!preu.isEmpty() && !UtilString.esEnter(preu)) {
            	System.out.println("ERROR: el valor ha de ser un enter positiu");
            	return;
            } else if (!preu.isEmpty() && UtilString.esEnter(preu)) {
                preuEnter = UtilString.aEnter(preu);                   
            }
    
            estoc = llegirValorPropietat("estoc min.> ");

            if (estoc.equals("!")) {
                break;
            }
            
            if (!estoc.isEmpty() && !UtilString.esEnter(estoc)) {
            	System.out.println("ERROR: el valor ha de ser un enter positiu");
            	return;
            } else if (!estoc.isEmpty() && UtilString.esEnter(estoc)) {
                estocEnter = UtilString.aEnter(estoc);                   
            }

            lloc = llegirValorPropietat("lloc> ");

            if (lloc.equals("!")) {
            	lloc = "";
                break;
            }
    
            origen = llegirValorPropietat("D.O.> ");

            if (origen.equals("!")) {
            	origen = "";
                break;
            }
    
            tipus = llegirValorPropietat("tipus> ");

            if (tipus.equals("!")) {
            	tipus = "";
                break;
            }
    
            collita = llegirValorPropietat("collita> ");

            if (collita.equals("!")) {
            	collita = "";
                break;
            }
            break;
        }
        Vi cercaPlantilla = botiga.cerca(new Vi(ref, nom, preuEnter, estocEnter, lloc, origen, tipus, collita));
        
	    if (cercaPlantilla != null) {
	        System.out.printf("Trobat:%s%n", cercaPlantilla);
	        return;
	    } else {
	        System.out.println("No trobat");
	    }
    }
    
    public void carregaVins() throws IOException {
        File fitxer = new File(ruta);
        if (fitxer.exists()) {
            BufferedReader lector = new BufferedReader(new FileReader(ruta));
            
            while (true) {
                String dadesVi = lector.readLine();
                if (dadesVi == null) { break; }
                
                String[] arrayVi = dadesVi.split(";");
                Vi vi = Vi.deArrayString(arrayVi);
                if (vi != null) {
                    botiga.afegeix(vi);
                    quantsVins++;  
                }
            }
            lector.close();
        } 
        System.out.printf("Referències llegides: %s%n", quantsVins);
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

Després de la reunió, hem trobat què necessitem gestionar les següents característiques dels vins:

ref: la referència del vi dins la botiga

Segons ens explica la Sra. Estrella, la referència és única per cada vi. Ella té una codificació particular que forma amb part del nom del vi, l'anyada (o collita) i un valor seqüencial. Per exemple "ROURABLA20200232". De moment ens ha dit que no ens hem de preocupar gaire de com està format. La impressió és que donar-los nom és una tasca que li agrada força i no ens la voldrà fer automatitzar de moment.

nom: el nom del vi (com fins ara)

preu: el preu del vi (com fins ara)

estoc: la quantitat disponible del vi (com fins ara)

lloc: la localització del vi dins el celler (nou)

La manera de codificar la localització de les ampolles és, a l'igual que passava amb la referència, un misteri. Ens trobem codis tan curiosos com ara "P02E03N55D". No ens sorprèn que la nostra clienta comenci a tenir dificultats per recordar on deixa les ampolles! El seu magatzem és un intricat laberint ple de passadissos, estants i nivells. La Sra. Estrella els assigna un lloc a les ampolles a mida que li arriben, normalment allà on hi trobava espai, i la seva antiga memòria prodigiosa li permetia recordar on es trobaven. Ara el Tomet serà l'encarregat de registrar a l'aplicació que estem fent el lloc on deixa els diferents vins, de manera que una consulta ràpida a l'aplicació permetrà la Sra. Estrella localitzar cada ampolla.

origen: la denominació d'origen del vi, també D. O.. (nou)

tipus: el tipus de vi (nou)

collita: l'any de collita del vi (nou)

Tot i sent un any, la codificarem com un String ja que no sembla que hàgim d'aprofitar les propietats d'un enter i preveiem que ens resultarà més fàcil de programar d'aquesta manera.

N'hi moltes més característiques, algunes tan importants com el celler o la varietat, però la nostra clienta ha prioritzat temps a completesa. «Si ho continueu fent tan bé», ens diu amb la seva rialleta astuta, la Sra. Estrella, «ja me les afegireu més endavant».

Hem recopilat alguns exemples de vins per tenir dades reals per les proves:

ref

nom

preu

estoc

lloc

origen

tipus

collita

LLUMALBA20200001

Llum d'Alba Blanc

1750

12

P02E03N55D

Priorat

blanc

2020

CARPATHI20180021

Carpathia Negre

3450

6

P23E01N43D

Montsant

negre

2018

MATISNEG20190011

Matís Negre

1325

12

P20E01N12E

Pla del Bages

negre

2019

SAOROSAT20180001

Saó Rosat

1040

24

P02E45N55D

Costers del Segre

negre

2018

ROURABLA20200232

Roura blanc

1012

42

P21E45N55E

Alella

blanc

2020

ROURABLA20200201

Roura blanc

906

3

P21E45N55E

Alella

blanc

2018

CERCIUMX20170002

Cercium

565

30

P23E01N55D

Empordà

negre

2017

MASIASER20200001

Masia Serra

1350

12

P02E02N55E

Empordà

negre

2020

El diagrama UML inclourà els següents elements:

```{image} /_static/uml/uml-3105elviampliat.png
:alt: Diagrama UML
```

Diagrama de la classe Vi

Recorda que a UML, que quelcom no hi sigui representat, no vol dir que no s'hagi d'implementar! Per exemple, Vi continuarà tenint la propietat nom.

```java
public Vi(String ref, String nom,
```

int preu, int estoc,
String lloc, String origen,
String tipus, String collita) { }

Avís

Ara que el nombre d'atributs s'ha incrementat tant, apareix un perill a l'hora d'ordenar-los. Per evitar-te problemes amb les proves, et recomano que segueixis l'ordre indicat a la signatura del constructor anterior.

Així, només tindrem les propietats preu i estoc com a valors enters. Com fins ara, codificarem els valors no vàlids (els negatius) com -1.

La resta seran codificats amb String i, per ser considerats vàlids, no poden ser mai inicialitzats com null, ni buits, ni estar formats només per espais.
Els constructors de Vi

A la versió anterior disposàvem de dos constructors. Un d'ells ens permetia no haver d'especificar l'estoc. Malgrat aquella semblava una bona decisió, ara que tenim tantes propietats a inicialitzar, la complexitat d'oferir constructors parcials es fa massa complexa. Així que deixarem un únic constructor amb tots els atributs.
Normalització dels valors de tipus String

El mètode Vi.normalitzaNom() ara no ens acaba de anar bé tal i com el teníem. En concret, ja no només normalitzarà noms sinó també d'altres Strings. Per aquesta raó ens caldrà fer els següents canvis:

En comptes de normalitzaNom(), anomenarem el mètode com normalitzaString().

Donat que una instància de Vi es pot fer servir com a plantilla, ara els atributs de tipus Strings han de poder acceptar el valor null o la cadena buida que simbolitzarà qualsevol valor. El nou mètode normalitzaString() acceptarà així el valor null i també la cadena buida o només formada per espais en blanc. Tots tres casos es retornaran com a null.

El missatge de valor per defecte (NOM NO VÀLID!) deixa de tenir sentit. Amb aquesta versió, els noms no vàlids també es codificaran amb null.

Hem discutit força respecte si fer servir null o la cadena buida per marcar si un atribut era o no vàlid. Al final ens hem decantat per null perquè no crea instàncies innecessàries.

La funció esValid() haurà de tenir en compte tots aquests canvis.
Persistència i toString()

Ens tocarà també modificar els mètodes de Vi, deArrayString() i aArrayString() de manera que es considerin totes les noves característiques d'un vi.

En el cas de deArrayString(), quan l'entrada no disposi exactament del nombre d'elements necessaris per crear un vi, o bé algun d'aquests elements no sigui vàlid per l'atribut que li correspon, retornarà null.

Tot i que podríem escollir qualsevol ordre per les propietats, les guardarem de la següent manera per poder passar les proves que hem preparat: referència, nom, preu, estoc, lloc, denominació d'origen, tipus, i any de collita.

També ens caldrà modificar toString() si volem continuar utilitzant-lo per mostrar totes les propietats del vi.
La classe Botiga

La classe Botiga també es veurà transformada:

l'antic mètode cerca(String) que abans cercava per nom del vi, ara cercarà per referència. El mateix passa amb el mètode elimina(String) que mirarà d'eliminar el vi amb la referència indicada.

apareix un nou mètode cerca(Vi) que rep una instància de Vi, pel que probablement esValid() retornarà false. Aquesta instància ens servirà de plantilla per poder trobar el vi que ens interessa. En cas que no trobi cap vi que coincideixi amb la plantilla, retornarà null. Altrament retornarà el primer que trobi que coincideixi.

Per permetre molta flexibilitat a l'hora de cercar un vi, se'ns ha ocorregut que la millor manera és passar-li al cercador una plantilla de vi amb les especificacions d'allò que cerquem. I què millor plantilla que un altre vi?

La idea bàsica és que construirem una instància de Vi que tindrà especificats els valors de les característiques del vi que cerquem, mentre que si una característica no ens importa, la deixarem amb un valor no vàlid.

Per exemple, si volem cercar per nom com fins ara, només haurem de definir el nom a la plantilla i la resta de característiques les posarem amb un valor que indiqui d'alguna manera que no està especificat.

En concret:

els valors de tipus string que no ens interessi especificar els marcarem amb null.

el preu de la plantilla serà considerat com a preu màxim. Si el deixem com a -1 es considerarà qualsevol preu, fins i tot 0. Altrament, es considerarà només els vins que tinguin un preu menor o igual a l'indicat.

l'estoc de la plantilla es considerarà com a estoc mínim. Si el deixem com a -1 es considerarà qualsevol estoc, fins i tot 0. Altrament, només es considerarà vins que tinguin com a mínim l'estoc indicat.

en cas que un valor de tipus String no sigui buit a la plantilla, haurà de coincidir amb el valor del vi a seleccionar. No distingirà majúscules i minúscules. La comparació es realitzarà amb Strings normalitzats.

En cas que hi hagi més d'un vi que correspongui a la cerca, el cercador retornarà el primer que trobi.

Sabem que cercar alguns valors pot arribar a ser molt incòmode i que la normalització del text no és suficient. De moment, però, mantindrem aquesta simplificació i més endavant, si cal, mirarem d'arreglar-ho.
Entorn: afegir, modificar, eliminar

Tot i que li ha agradat molt a la Sra. Estrella, les opcions d'afegir, modificar i eliminar des de l'entorn, considera que no són tan importants com la de cerca. Se n'ha adonat que si edita el fitxer botiga.csv pot fer les modificacions que li vinguin de gust i, fins i tot, vincular-ho amb el seu full de càlcul. S'estima més que dediquem ara el temps a la cerca, i que ja més endavant en parlarem si li calen aquestes opcions.

Així que, de moment, farem que en seleccionar les opcions d'afegir, modificar i eliminar de Entorn, aquest ens respongui amb el missatge Comanda temporalment no disponible.

Una altra cosa que ens suposa aquest canvi és que ja no caldrà que Entorn guardi les dades dins de botiga.csv en finalitzar, ja que aquestes no seran modificades des del programa.

Nota: malgrat no l'estem fent servir per la versió de l'entorn actual, el mètode Botiga.elimina(String) sí que el mantenim ja que la modificació és molt petita.
Entorn: cercar

En el cas de l'opció de cerca des de Entorn, l'aproximació que prenem és la següent:

En rebre la comanda "cerca" l'entorn començarà demanant la referència del vi a cercar.

Si la usuària introdueix un valor, farà servir el mètode Botiga.cerca(String) i mostrarà el resultat.

En cas que la usuària no especifiqui cap valor per la referència, es procedirà a demanar valors per cada propietat. En cas que s'introdueixi una línia buida, es suposarà que no es vol especificar la propietat. En cas que s'introdueixi com a valor l'exclamació, s'entendrà que ja no es vol especificar cap altra propietat. Així, la resta de propietats quedaran inicialitzades als valors no especificats explicats abans.

Ara només es podrà cancel·lar la cerca si s'introdueix una exclamació a la referència. Per la resta de propietats, l'exclamació només indicarà que ja no es volen especificar més valors per la cerca.

Amb les dades introduïdes es construeix una instància de Vi que serà utilitzada com a plantilla per la cerca.

En cas que no s'especifiqui cap valor a la plantilla, és clar, s'obtindrà el primer vi que es trobi.

Per exemple, si es vol trobar el vi amb una certa referència, s'introduirà així:

**botiga> cerca**
ref> rourabla20200232
Trobat:
Ref: ROURABLA20200232
Nom: Roura blanc
Preu: 1012
Estoc: 42
Lloc: P21E45N55E
D.O.: Alella
Tipus: blanc
Collita: 2020

botiga>

En canvi, si volem indicar només el nom i l'origen, farem

**botiga> cerca**
ref>
nom> roura blanc
preu max.>
estoc min.>
lloc>
D.O.> alella
tipus> !
Trobat:
Ref: ROURABLA20200232
Nom: Roura blanc
Preu: 1012
Estoc: 42
Lloc: P21E45N55E
D.O.: Alella
Tipus: blanc
Collita: 2020

botiga>

**No està malament, oi? Doncs a treballar!**
Pistes

Els canvis requerits per aquest exercici no són complicats de codificar. La dificultat rau en la quantitat de petits canvis. Això farà que intentar realitzar-ho seguint els missatges d'error generats per prgtest pot arribar a resultar dur. Per aquesta raó, abans de començar a implementar els canvis, fes una llista de tots els punts que han de canviar.

La llista podria començar amb:

afegir a Vi els nous atributs

modificar constructor de Vi (deixar només un)

modificar el mètode Vi.esValid() perquè funcioni amb els nous atributs

…

A mida que vagis finalitzant un apartat, el pots anar tatxant de la llista. Assegura't que et permets gaudir de la sensació d'anar eliminant elements!

Una empenteta si estàs tenint problemes amb com cercar els vins:

```java
          public Vi cerca(Vi plantilla) {

              for (Vi vi: vins) {

                  if (vi == null) continue;

                  if (! plantilla.getRef().isEmpty() && ! plantilla.getRef().equalsIgnoreCase(vi.getRef())) continue;

                  if (! plantilla.getNom().isEmpty() && ! plantilla.getNom().equalsIgnoreCase(vi.getNom())) continue;

                  if (plantilla.getPreu() >= 0 && plantilla.getPreu() <= vi.getPreu()) continue;
```

// No, no t'he donat tot el codi ;)

```java
                  return vi;

              }

              return null;

          }

public class Vi {
	private final String ref; 
    private final String nom;
    private int preu;
    private int estoc = 0;
    private String lloc;
    private String origen;
    private String tipus;
    private String collita;

    public Vi(String ref, String nom, int preu, int estoc, String lloc, String origen, String tipus, String collita) {
    	this.ref = normalitzaString(ref);
        this.nom = normalitzaString(nom);
        if (preu < 0) {
            this.preu = -1;
        } else {
            this.setPreu(preu);
        }
        this.lloc = normalitzaString(lloc);
        this.origen = normalitzaString(origen);
        this.tipus = normalitzaString(tipus);
        this.collita = normalitzaString(collita);
    }

	public String getRef() { return ref; }
	
    public String getNom() { return nom; }

    public int getPreu() { return this.preu; }

    public void setPreu(int preu) { 
        if (preu >= 0) { this.preu = preu; }
    }

    public int getEstoc() { return this.estoc; }

    public void setEstoc(int estoc) { 
        if (estoc >= 0) { this.estoc = estoc; }
    } 
    
    public String getLloc() { return lloc; }
	
    public String getOrigen() { return origen; }
    
    public String getTipus() { return tipus; }
	
    public String getCollita() { return collita; }

    public boolean esValid() {
    	if (ref == null) { return false; }
        if (nom == null) { return false; }
        if (preu() < 0) { return false; }
        if (estoc() < 0) { return false; }
        if (lloc == null) { return false; }
        if (origen == null) { return false; }
        if (tipus == null) { return false; }
        if (collita == null) { return false; }
        return true;
    }

    public String[] aArrayString() {
        String[] viArray = new String[8];
        
        viArray[0] = ref;
        viArray[1] = nom;
        viArray[2] = "" + preu;
        viArray[3] = "" + estoc;
        viArray[4] = lloc;
        viArray[5] = origen;
        viArray[6] = tipus;
		viArray[7] = collita;
        return viArray;
    }

    @Override
    public String toString() {
        return String.format("%n    Ref: %s%n    Nom: %s%n    Preu: %d%n    Estoc: %d%n    Lloc: %s%n    D.O: %s%n    Tipus: %s%n    Collita: %s%n", ref, nom, preu, estoc, lloc, origen, tipus, collita);
    }

    public static String normalitzaString(String cadena) {
        if (cadena == null || cadena.isBlank()) {
            return null;
        }

        cadena = nom.strip();
        String cadenaNormalitzat = "";
        boolean espai = false;

        for (int i = 0; i < cadena.length(); i++) {
            char c = cadena.charAt(i);

            if (!Character.isWhitespace(c)) {
                cadenaNormalitzat += c;
                espai = false;
            } else {
                if (!espai) {
                    cadenaNormalitzat += " ";
                }
                espai = true;
            }
        }
        return cadenaNormalitzat;
    }

    public static Vi deArrayString(String[] atributsVi) {
        if (atributsVi.length != 8) {
            return null;
        }
        if (!UtilString.esEnter(atributsVi[2]) || !UtilString.esEnter(atributsVi[3])) {
            return null;
        }
        String ref = atribtusVi[0];
        String nom = atributsVi[1];
        int preu = UtilString.aEnter(atributsVi[2]);
        int estoc = UtilString.aEnter(atributsVi[3]);
        String lloc = atribtusVi[4];
        String origen = atributsVi[5];
        String tipus = atribtusVi[6];
        String collita = atributsVi[7];
        
        Vi vi = new Vi(ref, nom, preu, estoc, lloc, origen, tipus, collita);
        
        if (!vi.esValid()) { return null; }
        return vi;
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3105elviampliat.png
:alt: Diagrama UML
```
