# Ejercicios — 17.11 — Es enter (flexible)

## EsEnter

**Enunciat**

En aquest exercici farem la versió flexible de l'exercici anterior, tal i com la vam programar a l'exercici aquest exercici.

Haurem d'ampliar UtilString perquè, a banda de esEnter(String) ofereixi els següents nous mòduls:

```java
public static boolean esEnter(String text, boolean estricte)

public static int aEnter(String text)

public static int aEnter(String text, boolean estricte)
```

El booleà estricte permetrà parametritzar el comportament d'aquestes dues funcions:

si estricte és cert

esEnter(String, boolean) es comporta com esEnter(String)

aEnter(String, boolean) es comporta igual que Integer.parseInt() de manera que si el text no es pot convertir a enter, simplement petarà el programa com ho faria Integer.parseInt()

Així, quan se li demani convertir un text que no sigui convertible a enter, aEnter() donarà un error similar a Integer.parseInt(). No pateixis, el prgtest t'indicarà si no ho has fet bé.

si estricte és fals:

esEnter(String, boolean) acceptarà com a enters les cadenes acceptades com a enters flexibles.

aEnter(String, boolean) permetrà convertir a enter, sense donar error, els texts que la nova versió de esEnter() dóna per vàlid.

Nota

Et sorprèn que puguis tenir a l'hora esEnter(String) i esEnter(String, boolean) amb el mateix nom? És una particularitat interessant de llenguatges com Java, anomenada sobrecàrrega o overloading, que veurem amb més detall en el futur.
Què es demana?

Afegeix les dues noves funcions a UtilString.java de manera que prgtest pugui avaluar-les.

El lliurament inclourà la mateixa versió de EsEnter.java que tenia l'exercici anterior.

Finalment, desenvolupa una nova versió del programa EsEnter que es comporti similar a l'exercici anterior. Aquest cop, però, esperarà per línia de comandes (args[0]) la modalitat (els valors "estricte" o "flexible") i actuarà en conseqüència. En cas que la modalitat no sigui un d'aquests valors, finalitzarà l'execució amb un error. Ah! Si no et passen cap modalitat, el teu programa pot donar l'error habitual.

Notes:

EsEnter no prova aEnter(). Si et cal fer-ho, crea't un altre programa que ho faci.

esEnter() encara acceptarà com a enters vàlids cadenes que no es poden emmagatzemar en un int. De fet, ni tant sols en un long. Se t'acut alguna manera de fer que quan esEnter() retorni true realment tinguis la confiança de que Integer.parseInt() funcionarà? Si se t'acut, la pots implementar amb tranquil·litat, ja les proves no miren aquesta casuística. Això sí, si ho fas, indica-ho amb un comentari al teu codi i presumeix amb el teu docent ;)

```java
public class EsEnter {
    public static void main(String[] args) {
        if (args.length == 0) { 
            System.out.println("No s'ha especificat cap modalitat");
            return; 
        }
        boolean modalitat = false;

        if (!args[0].equals("estricte") && !args[0].equals("flexible")) {
            System.out.println("Modalidat no reconeguda");
            return;
        }

        if (args[0].equals("estricte")) {
            modalitat = true;
        }

        if (args[0].equals("flexible")) {
            modalitat = false;
        }

        System.out.println("Introdueix texts (enter sol per finalitzar)");

        while (true) {
            String text = Entrada.readLine();

            if (text.isBlank()) break;

            if (UtilString.esEnter(text, modalitat)) {
                System.out.println("És enter");
            } else {
                System.out.println("No és enter");
            }
        }
        System.out.println("Adéu");
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
}
```
