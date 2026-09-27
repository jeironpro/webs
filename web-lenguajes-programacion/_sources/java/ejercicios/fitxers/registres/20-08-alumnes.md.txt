# Ejercicios — 20.08 — Alumnes

## CercaAlumnes

**Enunciat**

En aquest exercici acabarem de completar algunes de les funcions associades al tipus Alumne que hem definit als continguts.

Recordem la definició:

```java
static class Alumne {
    String nom;
    String email;
    int edat;
    boolean esOient;
    int[] notes;
}
```

Per provar algunes d'elles, desenvoluparem un programa que llegirà les dades d'un fitxer en format csv, i mostrarà la informació relativa a cada alumne que correspongui al criteri de cerca que s'indiqui per l'argument esperat.

El criteri de cerca és un String que el programa rep com a primer argument de la línia de comandes, i que ha d'aparèixer com a part del nom o de la part de l'usuari al correu electrònic (abans de @) dels alumnes a mostrar. El programa no serà sensible a majúscules/minúscules ni als caràcters especials propis de la llengua catalana (en concret, les vocals accentuades i la ç)

Per exemple, considera el contingut del fitxer:

**cat alumnes.csv**
nom,email,edat,esOient,ex1,ex2,ex3,ex4,ex5,ex6
Eleftèria Ortiz Luján,elefteria.ortiz@mevaempresa.org,10,false,7,8,5,7,8,9
Daniel Carrasco Macadàmia,daniel.carrasco@mevaempresa.org,21,true,5,4,5,2,NP,NP
Gabriela Cirerer Nasal,gabriela.cirerer@mevaempresa.org,20,false,6,7,5,8,9,5

Un exemple d'execució seria:

**java CercaAlumnes elefteria**
Alumne: Eleftèria Ortiz Luján
- email: lefi.ortiz@mevaempresa.org
- edat: 10
- és oïent: No
- notes: 7,8,5,7,8,9

Consideracions addicionals i pistes

El prgtest t'indicarà els missatges esperats quan es produeixin algunes situacions especials com ara que no es trobi cap alumne amb els criteris indicats.

Podem suposar que el fitxer existeix, que conté al menys una línia amb les capçaleres, i que totes les línies contenen valors suficients i adequats per completar un alumne.

Considera la funció String.contains() per fer les comprovacions.

Potser et serveix la següent plantilla:

```java
import java.io.IOException;
import java.io.FileReader;
import java.io.BufferedReader;
public class CercaAlumnes {

    static class Alumne {
        String nom;
        String email;
        int edat;
        boolean esOient;
        int[] notes;
    }

    public static Alumne construeixAlumne(String nom, String email,
```

int edat, boolean esOient,

```java
                                          int[] notes) {
        Alumne alumne = new Alumne();
        alumne.nom = nom;
```

// XXX a completar

```java
        return alumne;
    }

    public static void mostraAlumne(Alumne alumne) {
```

// XXX cal mostrar les dades de l'alumne

```java
    }

    public static String alumneAString(Alumne alumne) {
```

**return String.format(**
"Alumne(nom: \"%s\", email: \"%s\", " +
"edat: %d, esOient: %b, notes: {%s})",
alumne.nom, alumne.email, alumne.edat, alumne.esOient,

```java
                notesACsv(alumne.notes));
    }
```

**// converteix un array de notes a CSV**
// Té en comptes els valors NP com a -1

```java
    public static String notesACsv(int[] notes) {
```

// XXX a completar

```java
    }

    public static String alumneACsv(Alumne alumne) {
```

// XXX a completar encara que no es fa servir en aquest programa

```java
    }

    public static Alumne csvAAlumne(String csv) {
```

**// XXX a completar**

```java
    }

    public static void main(String[] args) throws IOException {
```

**// assegura que hi ha el criteri de cerca**
// XXX a completar

// declaracions, inicialitzacions, apertura de fitxer, ignora línia de capçaleres, etc.
// XXX a completar

```java
        while (true) {
```

**// llegeix entrada i finalitza bucle si no en queden més**
// XXX a completar

**// converteix l'entrada a Alumne**
// XXX a completar

**// comprova si el criteri de cerca es troba dins del nom o**
// el email. Si és així, mostra'l
// XXX a completar

```java
        }
```

// consideracions finals com ara el tancament del fitxer
// XXX a completar

```java
    }
}

import java.io.IOException;
import java.io.FileReader;
import java.io.BufferedReader;

public class CercaAlumnes {

    static class Alumne {
        String nom;
        String email;
        int edat;
        boolean esOient;
        int[] notes;
    }

    public static Alumne construeixAlumne(String nom, String email,
                                          int edat, boolean esOient,
                                          int[] notes) {
        Alumne alumne = new Alumne();
        alumne.nom = nom;
        alumne.email = email;
        alumne.edat = edat;
        alumne.esOient = esOient;
        alumne.notes = notes;
        return alumne;
    }

    public static void mostraAlumne(Alumne alumne) {
        System.out.println("Alumne: " + alumne.nom);
        System.out.println("- email: " + alumne.email);
        System.out.println("- edat: " + alumne.edat);
        System.out.println("- és oient: " + alumne.esOient);
        System.out.println("- notes: "+ notesACsv(alumne.notes));
    }

    public static String alumneAString(Alumne alumne) {
        return String.format(
                "Alumne(nom: \"%s\", email: \"%s\", " +
                "edat: %d, esOient: %b, notes: {%s})",
                alumne.nom, alumne.email, alumne.edat, alumne.esOient,
                notesACsv(alumne.notes));
    }

    public static String notesACsv(int[] notes) {
        String notesString = "";

        for (int i = 0; i < notes.length; i++) {
            if (i == 0) {
                notesString += ((notes[i] != -1) ? notes[i] : "NP");
            } else {
                notesString += "," + ((notes[i] != -1) ? notes[i] : "NP");
            }
        }
        return notesString;
    }

    public static String alumneACsv(Alumne alumne) {
        return String.format(
            "%s,%s,%d,%b,%s",
            alumne.nom,
            alumne.email,
            alumne.edat,
            alumne.esOient,
            notesACsv(alumne.notes)
        );
    }

    public static Alumne csvAAlumne(String csv) {
        Alumne alumne = new Alumne();
        String[] dadesAlumne = csv.split(",");

        alumne.nom = dadesAlumne[0];
        alumne.email = dadesAlumne[1];
        alumne.edat = Integer.parseInt(dadesAlumne[2]);
        alumne.esOient = Boolean.parseBoolean(dadesAlumne[3]);

        int[] notes = new int[dadesAlumne.length-4];

        for (int i = 0; i < notes.length; i++) {
            if (dadesAlumne[i+4].equals("NP")) {
                notes[i] = -1;
            } else {
                notes[i] = Integer.parseInt(dadesAlumne[i+4]);
            }
        }
        alumne.notes = notes;
        return alumne;
    }

    public static boolean alumneTrobat(String[] nom, String email, String criteri) {
        if (UtilString.esSubstring(email, criteri)) { return true; }

        for (int i = 0; i < nom.length; i++) {
            if (UtilString.esSubstring(nom[i], criteri)) { return true; }
        }

        return false;
    }

    public static void main(String[] args) throws IOException {
        if (args.length > 0) {
            String ruta = "alumnes.csv";
            BufferedReader lector = new BufferedReader(new FileReader(ruta));

            String linia = lector.readLine();
            int comptador = 0;
    
            while (true) {
                linia = lector.readLine();

                if (linia == null) { break; }

                Alumne alumne = csvAAlumne(linia);

                String[] nomAlumne = alumne.nom.split(" ");
                String[] emailAlumne = alumne.email.split("@");

                args[0] = UtilString.filtraVocalsCatala(args[0].strip());

                emailAlumne[0] = UtilString.filtraVocalsCatala(emailAlumne[0].strip());

                if (alumneTrobat(nomAlumne, emailAlumne[0], args[0])) {
                    mostraAlumne(alumne);
                    comptador++;
                }
            }
            if (comptador == 0) {
                System.out.println("No s'ha trobat cap alumne");
            }
            lector.close();
        } else {
            System.out.println("Ús: CercaAlumnes «criteri de cerca»");
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
