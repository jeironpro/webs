# Ejercicios — 35.16 — Especificacions independents

## Botiga

**Enunciat**

A Ca l'Estrella els està anant molt bé la nostra aplicació. S'ha reduït força el problema de trobar les ampolles de vi. Com passa amb tot, però, sempre hi ha maneres de millorar-ho i, en aquest cas, la nostra aplicació presenta una limitació molt trista: només permet obtenir un vi per cada cerca, malgrat que, de vegades hi poden haver més d'un vi que compleixi els requeriments dels clients de la Sra. Estrella.

Això ho hem de solucionar. La proposta és que cerca() ara ens retorni una llista de vins.

Aquest serà el nostre nou objectiu: afegir cerques amb múltiples resultats.

A banda, en veure la potència de les llistes, ens toca fer un plantejament amb la manera de guardar els vins de la classe Botiga.

Fins ara hem estat guardat els vins a un array amb una capacitat màxima i un control complex per culpa de que la funcionalitat d'eliminació de vins ens deixava posicions nuŀles. I pensar que, a sobre, momentàniament hem deixat de d'oferir l'opció d'eliminació…

En aquesta nova versió, reemplaçarem l'array de vins a Botiga per una llista. Això també elimina la necessitat del constructor específic Botiga(int), els mètodes iniciaRecorregut() i getSeguent(). Tampoc no llençarem l'excepció BotigaException quan la botiga està plena. Clar, ara ja no tindrem un màxim!.

Aquestes accions de simplificació/neteja solen passar desapercebudes als nostres usuaris però a nosaltres ens faciliten molt la feina futura. Les hem de fer amb compte de no introduir errors, però… qui té por quan disposem de jocs de prova?

D'altra banda, ara que podem tornar més d'un vi, voldrem afegir una mica més de flexibilitat a la cerca, de manera que no calgui especificar completament valors del nom, la denominació d'origen ni el tipus de vi. Per aconseguir-ho, desenvoluparem un nou mètode boolean esPlantillaDeText(String plantilla, String text) que donada una plantilla i un text, ens retorna cert si el text es descriu per la plantilla.

Considerarem que un text es descripu per una plantilla quan, la seva versió normalitzada coincideix amb la plantilla o, com a mínim, comença per aquesta.

Així, en cas que la plantilla sigui null, buida o amb només espais, acceptarà qualsevol valor de text. Altrament acceptarà només els texts que comencin per la plantilla (ambdós normalitzats)

Hem decidit afegir aquest mètode a UtilString.

D'aquesta manera, el mètode cercar(Vi), gràcies a UtilString.esPlantillaDeText(), permetrà cercar parcialment els diferents atributs de tipus string. Per exemple, el vi amb el nom Roura blanc podrà ser trobat amb les plantilles Roura, rou o fins i tot r.

Aprofitant que toquem UtilString, hi mourem també el mètode String normalitzaString(), que actualment tenim a Vi.

El nostre model quedarà de la següent manera:

```{image} /_static/uml/uml-35-16-especificacions-independents-10.png
:alt: Diagrama UML
```

Cerques amb resultats múltiples

Un parell de consideracions addicionals:

Quan cerquem un vi a partir d'una plantilla, a partir d'ara cerca(Vi) ja no ens tornarà mai null encara que no es trobi cap vi. retornarà una List<Vi> amb zero o més vins.

Tenint en comptes que cerca() molt probablement anirà afegint vins al final de la llista i que aquesta serà usada per un recorregut seqüencial, quina creus que seria la implementació més adequada de List?

```java
import java.util.List;
import java.util.LinkedList;

public class Botiga {
	private List<Vi> vins;
	
	public Botiga() {
        this.vins = new LinkedList<Vi>();
    }
    
    public List<Vi> getVins() {
    	return this.vins;
    } 
    
    public Vi afegeix(Vi vi) {
    	if (vi == null) {
    		throw new IllegalArgumentException("El vi no pot ser null");
    	} else if (!Vi.esValid(vi.getRef(), vi.getPreu(), vi.getEstoc(), vi.getLloc(), vi.getEspec())) {
    		throw new IllegalArgumentException("El vi ha de ser vàlid");
    	} else if (cerca(vi.getRef()) != null) {
            throw new IllegalArgumentException("Referència de vi repetida");
        }
        this.vins.add(vi);
        return vi; 
    }
    
    public Vi elimina(String ref) {
    	ref = UtilString.normalitzaString(ref);
    	if (ref == null) {
    		throw new IllegalArgumentException("La referència no pot ser null");
    	}
	    boolean viEqual = false;
	    for (int i = 0; i < vins.size(); i++) {
	        if (vins.get(i) != null) {
	            String refExistent = vins.get(i).getRef();
	            if (ref.equalsIgnoreCase(refExistent)) { 
	            	viEqual = true;
	                if (vins.get(i).getEstoc() > 0) { 
	                    throw new IllegalArgumentException("El vi a eliminar no pot tenir estoc"); 
	                }
	                Vi eliminat = vins.get(i);
	                vins.remove(i);
	                return eliminat;
	            }
	        }
	    }
	    if (!viEqual) {
	    	throw new IllegalArgumentException("La instància a eliminar ha d'estar present");
	    }
    	return null;
    }
    
    public Vi cerca(String ref) {
		ref = UtilString.normalitzaString(ref);
    	if (ref == null) {
    		throw new IllegalArgumentException("La referència no pot ser null");  
    	}
	    for (Vi vi: vins) {
	    	if (vi == null) {
	    		continue;
	    	}
	        String refVi = vi.getRef();
	        if (ref.equalsIgnoreCase(refVi)) { 
	            return vi; 
	        }
	    }    	
    	return null;
    }

    public List<Vi> cerca(Especificacio espec) {
    	return cerca(espec, -1, -1);
    }
    
    public List<Vi> cerca(Especificacio espec, int preuMax, int estocMin) {
    	if (espec == null) {
    		throw new IllegalArgumentException("espec no pot ser null");
    	}
    	List<Vi> vinsCercat = new LinkedList<Vi>();
        
    	for (Vi vi : this.vins) {
    		boolean cercat = true;
			if (!espec.esPlantillaDe(vi)) {
				cercat = false;
			}
			if (preuMax >= 0 && vi.getPreu() > preuMax) {
				cercat = false;
			}
			if (estocMin >= 0 && vi.getEstoc() < estocMin) {
				cercat = false;
			}

			if (cercat) {
				vinsCercat.add(vi);
			}
    	}
    	return vinsCercat;
    }
}
```

## BotigaException

```java
@SuppressWarnings("serial")
public class BotigaException extends Exception {
	public BotigaException() {
		super();
	}
	
	public BotigaException(String missatge) {
		super(missatge);
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
import java.io.IOException;
import java.util.List;
import java.util.LinkedList;

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
        
    	try {
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
        } catch (Exception e) {
    		System.out.println(e);
    	}
    }
    
    public void processaCercaPlantilla() {
    	String nom = "";
        String preu = "";
        String estoc = "";
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
        Especificacio espec = new Especificacio(nom, origen, tipus, collita);
        try {
		    List<Vi> cercatEspec = botiga.cerca(espec, preuEnter, estocEnter);
		    
		    if (cercatEspec.size() == 0) {
			    System.out.println("No trobat");
				return;		    	
		    }
		    System.out.printf("Trobat:%n");
		    for (Vi vi: cercatEspec) {
		    	System.out.println(vi);
	    	}
    	} catch (Exception e) {
    		System.out.println(e);
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

## Especificacio

```java
public class Especificacio {
	private final String nom;
	private String origen;
	private String tipus;
	private String collita;
	 
	public Especificacio(String nom, String origen, String tipus, String collita) {
		this.nom = UtilString.normalitzaString(nom);
		this.origen = UtilString.normalitzaString(origen);
		this.tipus = UtilString.normalitzaString(tipus);
		this.collita = UtilString.normalitzaString(collita);
	}
	
	public String getNom() {
		return this.nom;
	}
	
	public String getOrigen() {
		return this.origen;
	}
	
	public String getTipus() {
		return this.tipus;
	}
	
	public String getCollita() {
		return this.collita;
	}
	
	public boolean esComplet() {
		if (this.getNom() != null && 
			this.getOrigen() != null && 
			this.getTipus() != null && 
			this.getCollita() != null) {
			return true;
		}
		return false;
	}
	
	public boolean esPlantillaDe(Vi vi) {
		Especificacio espec = vi.getEspec();
		String nom = espec.getNom();
		String origen = espec.getOrigen();
		String tipus = espec.getTipus();
		String collita = espec.getCollita();
		
		boolean esPlantilla = true;
		if (!UtilString.esPlantillaDeText(this.getNom(), nom)) {
			esPlantilla = false;
		}
		if (!UtilString.esPlantillaDeText(this.getOrigen(), origen)) {
	 		esPlantilla = false;
 		}
		if (!UtilString.esPlantillaDeText(this.getTipus(), tipus)) {
			esPlantilla = false;
		}
		if (!UtilString.esPlantillaDeText(this.getCollita(), collita)) {
			esPlantilla = false;
		}
		return esPlantilla;
	}
	
	public String[] aArrayString() {
        String nom = this.getNom();
        String origen = this.getOrigen();
        String tipus = this.getTipus();
        String collita = this.getCollita();
        
        String[] viArray = new String[] {
            nom, origen, tipus, collita
        };
        return viArray;
    }
    
    public static Especificacio deArrayString(String[] atributsVi) {
        if (atributsVi.length != 4) {
            return null;
        }
        String nom = atributsVi[0];
        String origen = atributsVi[1];
        String tipus = atributsVi[2];
        String collita = atributsVi[3];
        return new Especificacio(nom, origen, tipus, collita);
    }
	
	public String toString() {
		return String.format("    Nom: %s%n    D.O.: %s%n    Tipus: %s%n    Collita: %s%n", nom, origen, tipus, collita);
	}
}
```

## UtilString

* Aquest programa és la meva biblioteca de String: Conte les següents
utilitats:

* Una funció per verificar si un caràcter es vocal i retorna un valor boolean
(esVocal).

* Una funció que filtra un text i retorna un String amb només les lletres del
text (nomesLletres).

* Una funció que separa un text de només lletres i retorna un String amb les
lletres separat per comes (lletresSeparades).

* Una funció que rep un text, un valor inicial i un valor final i retorna un
interval del text en el rang d'inici i final ambdós inclosos
(intervalString).

* Una funció que rep un text i un enter retorna 0 sí és negtiu
i si és major o igual a la longitud del text retorna la longitud del
text -1, altrament retorna el valor de l'enter. (posicioText)

* Una funció que rep un text i retorna si és un valor enter o no, el valor pot
ser negatiu o positiu, o pot tenir espai en blanc en els laterals
(esEnter estricte).

* Una funció que rep un text i un boolean i retorna si és un valor enter o no,
el valor pot ser negatiu o positiu, o pot tenir espai en blanc en qualsevol
joc, o punt o guió baix entre dos nombres (esEnter flexible).

* Una funció que rep un text i el converteix a enter des del mètode
Integer.parseInt (aEnter estricte).

* Una funció que rep un text i el converteix a enter des del mètode
Integer.parseInt, el valor pot ser negatiu o positiu, o pot tenir espai en
blanc en qualsevol joc, punt o guió baix entre dos nombres (aEnter flexible).

* Una funció que rep un text i una quantitat i retorna un String format per la
repetició circular de carácters fins a la quantitat (cadenaContinua).

* Una funció que rep un text i filtra les vocals catalanes, les canvia per les
vocals normals i retorna un nou text. (filtraVocalCatala v1)

* Una funció que rep un text i filtra les vocals catalanes, les canvia per les
vocals normals i retorna un nou text. (filtraVocalCatalaAvanzat v2)

* Una funció que rep un text i un subtext i retornar si és substring o no, com
l'utilitat de String contains (esSubstring estricte).

* Una funció que rep un text i un subtext (el text i subtext pot ser en
majúscules, minúscules, contenir vocals catalanes i la ç) i un boolean per
inidicar si es estricte o flexible i retornar si és substring o no, com la
utilitat de String contains (esSubstring flexible).

* Una funció que rep un text i un prefix i retornar si és el començament del
text de manera seqüencial o no, com l'utilitat de String startsWith
(esPrefix estricte).

* Una funció que rep un text i un prefix (el text i prefix pot ser en
majúscules, minúscules, contenir vocals catalanes i la ç) i un boolean i
retornar si és el prefix és el començament del text de manera seqüencial o
no, com la utilitat de String startsWith (esPrefix flexible).

* Una funció que rep un text i un sufix i retornar si és la terminació del text
de manera seqüencial o no, com l'utilitat de String endsWith
(esSufix estricte).

* Una funció que rep un text i un sufix (el text i sufix pot ser en majúscules,
minúscules, contenir vocals catalanes i la ç) i un boolean i retornar si és
el sufix és la terminació del text de manera seqüencial o no, com la
utilitat de String endsWith (esSufix flexible).

* Una funció que rep un text i un subtext i retorna quantes vegades es troba el
subtext en el text, com la utilitat de String count de altres llenguatges de
programació (quants estricte).

* Una funció que rep un text i un subtext (el text i subtext pot ser en
majúscules, minúscules, contenir vocals catalanes i la ç) i un boolean i
retorna quantes vegades es troba el subtext en el text, com la utilitat de
String count de altres llenguatges de programació (quants flexible).

* Una funció que rep una paraula i retornar si és creixent de manera estricta o
no (esCreixent(String)).

* Una funció que rep una paraula i retornar si és decreixent de manera
estricta o no (esDecreixent(String)).

* Una funció que rep una paraula i retornar si és creixidecri de manera
estricta o no (esCreixiDecri(String)).

* Una funció que rep una paraula i retornar si és decricreixi de manera
estricta o no (esDecriCreixi(String)).

* Una funció que rep una paraula i retornar si és creixent de manera flexible o
no (esCreixent(String, boolean)).

* Una funció que rep una paraula i retornar si és decreixent de manera flexible
o no (esDecreixent(String, boolean)).

* Una funció que rep una paraula i retornar si és creixidecri de manera
flexible o no (esCreixiDecri(String, boolean)).

* Una funció que rep una paraula i retornar si és decricreixi de manera
flexible (esDecriCreixi(String, boolean)).

* Una funció que rep un text i filtra tots els seus caràcters a l'alfabet
catalá (filtraAlfabetCatala)

* Una funcion que rep un text i retorna quants caràcters diferents té.
(quantsCaractersDiferents)

* Una funció que verifica si un text acaba en un espai o lletra, en cas que no
retorna el text amb l'espai o la lletra agregat segons correspon
(espaiLletraFinal).

* Una funció que rep un text i compta quantes paraules hi ha en el text i
retorna aquesta quantitat. Aquesta funció fa servir la funció
espaiLletraFinal per agregar l'espai al text i comptar de manera funcional
les paraules (quantsParaules).

* Una funció que rep un text i compta quants espais en blanc té i retorna
aquesta quantitat. Aquesta funció fa servir la funció espaiLletraFinal per
agregar la lletra al text i comptar de manera funcional els espais
(quantsEspais).

* Una funció que rep un array d'enters i un char separador i retorna un String
con els valors de l'array separat pel separador, en cas que no s'introdueix
cap separador, el separador serà la coma (entreComes).

* Una funció que rep un text i elimina els espais en blancs del text i retorna
un nou text. (filtraEspais)

* Una funció que rep un valor de tipus text i si la funció esEnter retorna
true, això és que es pot converteix a enter i ho retorna com enter fent
servir Integer.parseInt. (valorEnter)

* Una funció que rep un text i retorna un array de String sense separador
(espai en blanc), com la utilitat de String split (separa(String)).

* Una funció que rep un text i un boolean, si el boolean és false retorna el
resultat de la funció separa(String), en cas que el boolean sigui true
retorna un array de String amb  els espais inclòs, com la utilitat de String
split (separa(String, boolean)).

* Una funció que rep un separador de tipus text, si el text no està buit agafar
el primer caràcter i ho retorna com el separador, en cas que el text està
buit retornar la coma com separador. (separadorArray)

* Una funció que rep un array de Strings i un String com separador i retorna un
String amb el array separat pel separador, com la utilitat de String join
(junta(String[], String)).

* Una funció que rep un array de Strings, un String com separador i un String
com darrer separador i retorna un String amb el array separat pels
separadors en l'ordre indicat, com la utilitat de String join
(junta(String[], String, String)).

* Una funció que rep un String de notes amb les notes separat per comes i
espais (ex: (9, 8, ) o (10, 9, 8, )) i li aplica una nova estructura de
separació (9 i 8) o (10, 9 i 8). (separadorNotes)

* Una funció que rep un valor de tipus text i verifica si la longitud del valor
és igual a 2 i si són dos nombres entre 0 i 2, per ser vàlid per l'índex
d'un array bidimensional de dimensió 3x3. (verificaCoordenada)

* Una funció que rep un text i el normalitza eliminant els espais dels laterals
i entre mig de cada paraula. (normalitzaString)

* Una funció que rep una plantilla i un text i verifica si la plantilla és un
valor null, buit o està format per espai en blanc, retorna true, altrament
normalitza la plantilla i el text i verifica si són iguals o el text és el
començament de la plantilla i retorna true, del contrari retorna false.

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

        inici = posicioText(text, inici);
        fi = posicioText(text, fi);

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
    
    public static int posicioText(String text, int pos) {
        if (pos < 0) {
            return 0;
        }

        if (pos >= text.length()) {
            return text.length()-1;
        }
        return pos;
    }

    public static boolean esEnter(String text) {
    	if (text.isEmpty()) return false;
        text = text.strip();
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (!Character.isDigit(c)) {
                return false;
            }
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
		
        if (text.isBlank()) {
            return false;
        }
        
        text = text.strip();
        if (text.charAt(0) == '.' || text.charAt(0) == '_') return false;
        if (text.charAt(0) == '.' || text.charAt(text.length()-1) == '_') return false;
        
        for (int i = 0; i < text.length(); i++) {
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
    public static String filtraVocalsCatalaV1(String text) {
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
    }
    
    // Versió 2
    public static String filtraVocalsCatalaV2(String text) {
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
        text = filtraVocalsCatalaV2(text);
        subtext = filtraVocalsCatalaV2(subtext);

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
        text = filtraVocalsCatalaV2(text);
        prefix = filtraVocalsCatalaV2(prefix);

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
        text = filtraVocalsCatalaV2(text);
        sufix = filtraVocalsCatalaV2(sufix);

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
        text = filtraVocalsCatalaV2(text);
        subtext = filtraVocalsCatalaV2(subtext);

        return quants(text, subtext);
    }

    public static boolean esCreixent(String paraula) {
        paraula = filtraAlfabetCatala(filtraVocalsCatalaV2(paraula));
        
        if (paraula.length() < 3 || quantsCaractersDiferents(paraula) < 3) { return false; }
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
        paraula = filtraAlfabetCatala(filtraVocalsCatalaV2(paraula));
        
        if (paraula.length() < 3 || quantsCaractersDiferents(paraula) < 3) { return false; }
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
        paraula = filtraAlfabetCatala(filtraVocalsCatalaV2(paraula));

        boolean paraulaCreixent = false;
        boolean paraulaCreixiDecri = false;
        int creixi = 0;
        
        if (paraula.length() < 3 || quantsCaractersDiferents(paraula) < 3) { return false; }
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
        paraula = filtraAlfabetCatala(filtraVocalsCatalaV2(paraula));

        boolean paraulaDecreixent= false;
        boolean paraulaDecriCreixi = false;
        int decri = 0;
        
        if (paraula.length() < 3 || quantsCaractersDiferents(paraula) < 3) { return false; }
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
        
        paraula = filtraAlfabetCatala(filtraVocalsCatalaV2(paraula));
        
        if (paraula.length() < 3 || quantsCaractersDiferents(paraula) < 3) { return false; }
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
        
        paraula = filtraAlfabetCatala(filtraVocalsCatalaV2(paraula));
        
        if (paraula.length() < 3 || quantsCaractersDiferents(paraula) < 3) { return false; }
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

        paraula = filtraAlfabetCatala(filtraVocalsCatalaV2(paraula));
        
        boolean paraulaCreixent = false;
        boolean paraulaCreixiDecri = false;
        int creixi = 0;
        
        if (paraula.length() < 3 || quantsCaractersDiferents(paraula) < 3) { return false; }
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

        paraula = filtraAlfabetCatala(filtraVocalsCatalaV2(paraula));
        
        boolean paraulaDecreixent= false;
        boolean paraulaDecriCreixi = false;
        int decri = 0;
        
        if (paraula.length() < 3 || quantsCaractersDiferents(paraula) < 3) { return false; }
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
    
    public static int quantsCaractersDiferents(String text) {
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
    
    public static String entreComes(int[] numeros, char separador) {
        String arraySeparat = "";

        for (int i = 0; i < numeros.length; i++) {
            arraySeparat += numeros[i];
            if (i != numeros.length-1) {
                arraySeparat += separador + " ";            
            }
        }
        return arraySeparat;
    }
    
    public static String filtraEspais(String text) {
        String nouText = "";
        
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (!Character.isWhitespace(c)) {
                nouText += c;
            }
        }
        return nouText;
    }
    
    public static int valorEnter(String valor) {
        while (!UtilString.esEnter(valor)) {
            System.out.println("Per favor, un valor enter");
            valor = Entrada.readLine();
        }
        return Integer.parseInt(valor);
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
    
    public static char separadorArray(String separador) {
        if (separador.isBlank()) {
            return ',';
        } else {
            return separador.charAt(0);
        }
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
    
    public static String separadorNotes(String notes) {
        String notesSeparat = "";
        int longitudNotes = notes.length()-2;

        for (int i = 0; i < longitudNotes; i++) {
            char c = notes.charAt(i);
            if ((i == longitudNotes-3 || i == longitudNotes-4) && c == ',') {
                notesSeparat += " i";
            } else {
                notesSeparat += c;
            }
        }
        return notesSeparat;
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
    
    public static String normalitzaString(String cadena) {
        if (cadena == null || cadena.isBlank()) {
            return null;
        }

        String normalitzat = "";
        boolean espai = false;
        cadena = cadena.strip();
        
        for (int i = 0; i < cadena.length(); i++) {
            char c = cadena.charAt(i);
            
            if (!Character.isWhitespace(c)) {
                normalitzat += c;
                espai = false;
            } else {
                if (!espai) {
                    normalitzat += " ";
                }
                espai = true;            
            }
        }
        return normalitzat;
    }
    
    public static boolean esPlantillaDeText(String plantilla, String text) {
    	if (plantilla == null || plantilla.isBlank()) {
    		return true;
    	}
    	
    	plantilla = normalitzaString(plantilla);
    	text = normalitzaString(text);
    	
    	if (plantilla.equalsIgnoreCase(text)) {
    		return true;
    	}
    	
    	if (esPrefix(text.toLowerCase(), plantilla.toLowerCase())) {
    		return true;
    	}
    	return false;
    }
}
```

## Vi

**Enunciat**

Hem fet una visita a la Sra. Estrella per veure com li anava la nova actualització, i com no? també gaudir de la seva hospitalitat amb un vinet. Tot i que es mostra contenta, ens comenta que potser li aniria bé disposar de més característiques per la cerca. Per exemple, la graduació del vi, el celler, la temperatura recomanada, i un inacabable etcètera.

Ens diu que no té presa, però. Simplement que anem pensant-hi. I això fem.

Què ens costaria afegir una nova propietat de vi al disseny actual? Ens preguntem.

La resposta és: molt!

El cert és que hauríem de modificar pràcticament totes les classes de l'aplicació:

Vi i Especificacio han de disposar de la nova propietat

Botiga: ha de considerar la nova propietat per la cerca.

Entorn: ha de considerar la nova propietat per demanar les dades.

Ops! Molta feina!

Ara que tenim temps, és un bon moment per plantejar canvis en l'estructura de l'aplicació de manera que ens facilitin les ampliacions que la nostra clienta ens demanarà en breu.

**Anem a pams**
Vi i Especificacio

Entre aquestes dues classes no tenim ara per ara una relació directa. Malgrat això, ambdues classes dupliquen una bona part de les propietats d'un vi!

Ja que tenim Especificacio que conté el nom, l'origen, el tipus i la collita, no podríem fer que Vi contingués una especificació en comptes dels atributs per separat?

```{image} /_static/uml/uml-3516especificacionsindependents.png
:alt: Diagrama UML
```

És clar que Especificacio està pensat per ser usat com a plantilla i que si l'afegim tal qual a un Vi, podem trobar-nos amb valors no definits.

Per resoldre aquest problema, farem que:

Especificacio disposi d'un mètode que ens digui si és complet o bé alguna de les seves propietats està indefinida.

Així Especificacio.esComplet() ens retornarà true quan cap dels valors (recordem que estan normalitzats) sigui null.

Vi.esValid() requerirà que l'especificació sigui completa per retornar true.

Vi.toString()

Fins ara hem estat mostrant els vins fent servir Vi.toString(). Ha estat una manera molt convenient. El problema és que amb el nou disseny, antigues propietats de Vi ara es trobaran a Especificacio i l'ordre sí que resulta important.

Hem enviat un missatge a la nostra clienta amb el següent contingut

Estimada Estrella

Fins ara l'aplicació mostra els vins d'aquesta manera:

**Ref: MATISNEG20190011**
Nom: Matís Negre
Preu: 1325
Estoc: 12
Lloc: P20E01N12E
D.O.: Pla de Bages
Tipus: negre
Collita: 2019

Teniu cap inconvenient que sigui d'aquesta altra?

**Ref: MATISNEG20190011**
Nom: Matís Negre
D.O.: Pla de Bages
Tipus: negre
Collita: 2019
Preu: 1325
Estoc: 12
Lloc: P20E01N12E

En un moment, rebem una elaborada resposta pròpia d'algú a qui li sobra el temps:

bé

Així, ja podem modificar Vi.toString() i afegir un Especificacio.toString() de manera que Vi no tingui perquè saber res de quines propietats tenim a Especificacio!

```{image} /_static/uml/uml-3516especificacionsindependents.png
:alt: Diagrama UML
```

Serialització de Vi

El darrer punt en que encara Vi ha de conèixer les propietats de que es composa l'espeficiació és en els mètodes de serialització: aArrayString() i deArrayString().

Mourem part d'aquests dos mètodes a Especificacio.

A l'igual que passava amb toString() que el nom formi part de l'especificació i estigui entre mig de les propietats de Vi, ens complica una mica. Aquí hem optat per no modificar l'ordre de les columnes al fitxer botiga.csv. Així, Vi haurà de ser conscient que les especificacions inclouen el nom del vi.

```{image} /_static/uml/uml-3516especificacionsindependents.png
:alt: Diagrama UML
```

Cerca a Botiga

La implementació anterior de Botiga requeria comparar cada propietat de Vi amb el requerit per la plantilla rebuda.

Això fa que si volem afegir o modificar alguna de les propietats, ens caldrà modificar també Botiga.

Per evitar-ho, mourem la responsabilitat de saber si les especificacions dun vi es corresponen o no a una especificació, a la classe Especificacio.

Així, Especificacio disposarà d'un nou mètode anomenat esPlantillaDe() que rebrà un Vi i retornarà true en cas que la plantilla sigui vàlida pel vi, o si vols, que els valors que especifica la plantilla són satisfets pel vi.
Entorn

La classe Entorn continua sent dependent de les propietats de Vi. Malauradament, de moment, no sabem com independitzar-la. Potser en un futur.
El diagrama final

El nou disseny tindrà el següent aspecte:

```{image} /_static/uml/uml-3516especificacionsindependents.png
:alt: Diagrama UML
```

Diagrama de classes de la botiga de vins amb especificacions independents

```java
public class Vi {
    private final String ref;
    private int preu;
    private int estoc = 0;
    private String lloc;
    private Especificacio espec;
    
    public Vi(String ref, int preu, int estoc, String lloc, Especificacio espec) {
    	if (!Vi.esValid(ref, preu, estoc, lloc, espec)) {
        	throw new IllegalArgumentException("El vi ha de ser vàlid");
        }
        this.ref = UtilString.normalitzaString(ref);
        if (preu < 0) {
            this.preu = -1;
        } else {
            this.preu = preu;
        }
        
        if (estoc < 0) {
            this.estoc = -1;
        } else {
            this.estoc = estoc;
        }
        this.lloc = UtilString.normalitzaString(lloc);
        if (espec.esComplet()) {
		    this.espec = espec;        
        }
    }

    public String getRef() {
        return this.ref;
    }
    
    public int getPreu() { 
        return this.preu; 
    }
    
    public void setPreu(int preu) { 
    	if (preu < 0) {
    		throw new IllegalArgumentException("El preu ha de ser vàlid");
    	}
        this.preu = preu; 
    }
    
    public int getEstoc() { 
        return this.estoc; 
    }
    
    public void setEstoc(int estoc) { 
    	if (estoc < 0) {
    		throw new IllegalArgumentException("L'estoc ha de ser vàlid");
    	}
        this.estoc = estoc; 
    }

    public String getLloc() {
        return this.lloc;
    }

    public void setLloc(String lloc) {
    	if (lloc == null || lloc.isBlank()) {
    		throw new IllegalArgumentException("El lloc ha de ser vàlid");
    	}
	    this.lloc = UtilString.normalitzaString(lloc);
    }
    
    public Especificacio getEspec() {
    	return this.espec;
    }
    
    public String[] aArrayString() {
        String ref = this.getRef();
        String nom = this.getEspec().getNom();
        int preu = this.getPreu();
        int estoc = this.getEstoc();
        String lloc = this.getLloc();
        String origen = this.getEspec().getOrigen();
        String tipus = this.getEspec().getTipus();
        String collita = this.getEspec().getCollita();
        
        String[] viArray = new String[] {
            ref, nom, "" + preu, "" + estoc, lloc, origen, tipus, collita
        };
        return viArray;
    }
    
    public static Vi deArrayString(String[] atributsVi) {
        if (atributsVi.length != 8) {
            return null;
        }
        if (!UtilString.esEnter(atributsVi[2])) {
            return null;
        }
        if (!UtilString.esEnter(atributsVi[3])) {
            return null;
        }
        
        String ref = atributsVi[0];
        String nom = atributsVi[1];
        int preu = UtilString.aEnter(atributsVi[2]);
        int estoc = UtilString.aEnter(atributsVi[3]);
        String lloc = atributsVi[4];
        String origen = atributsVi[5];
        String tipus = atributsVi[6];
        String collita = atributsVi[7];
        Especificacio atributsEspec = new Especificacio(nom, origen, tipus, collita);
        
        if (!esValid(ref, preu, estoc, lloc, atributsEspec)) { 
            return null; 
        }
        return new Vi(ref, preu, estoc, lloc, atributsEspec);
    }
    
    public static boolean esValid(String ref, int preu, int estoc, String lloc, Especificacio espec) {
    	String nom = espec.getNom();
    	String origen = espec.getOrigen();
    	String tipus = espec.getTipus();
    	String collita = espec.getCollita();
    	
        String[] atributs = new String[] {
            ref, nom, lloc, origen, tipus, collita
        };

        for (String atribut: atributs) {
            if (atribut == null || atribut.isBlank()) {
                return false;
            }
        }

        if (preu < 0) { 
            return false; 
        }
        
        if (estoc < 0) { 
            return false; 
        }
        return true;
    }
    
    @Override
    public String toString() {
        return String.format("%n    Ref: %s%n%s    Preu: %d%n    Estoc: %d%n    Lloc: %s%n", ref, espec, preu, estoc, lloc);
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3516especificacionsindependents.png
:alt: Diagrama UML
```
