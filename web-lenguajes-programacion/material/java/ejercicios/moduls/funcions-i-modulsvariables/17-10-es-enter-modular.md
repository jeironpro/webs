# Ejercicios — 17.10 — Es enter (modular)

## EsEnter

**Enunciat**

Recuperem l'exercici que mostrava si una cadena contenia o no un valor enter i fem-ne la versió modular.

El programa EsEnter farà pràcticament el mateix que la versió original, amb les següents diferències:

La comprovació de si una cadena correspon o no a un enter, la realitzarà una funció anomenada esEnter(), que rebrà el text corresponent i retornarà un booleà amb el resultat.

esEnter() estarà definida dins de UtilString.java i serà una funció pura.

El programa EsEnter indicarà que són enters vàlids aquelles cadenes que la funció esEnter() indiqui que ho són, i també, altres cadenes que esEnter() hagués considerat com a vàlides si ignorés espais en blanc a inici i final de la cadena.

Considera les següents crides a esEnter():

**>>> esEnter("123")**
true
>>> esEnter("+123")
true
>>> esEnter("-123")
true
>>> esEnter("  123")    // atenció als espais en blanc
false

Considera també el següent exemple d'execució del programa EsEnter:

**Introdueix texts (enter sol per finalitzar)**
123
És enter
+123
És enter
-123
És enter
123
És enter
undostres
No és enter

Adéu

Pista: Fixa't que EsEnter fa alguna cosa per a aconseguir que la cadena "    123" correspongui a un enter malgrat la funció esEnter(" 123") retorna fals. En aquesta ocasió, pots fer servir utilitats de String per a aconseguir aquest efecte.

```java
public class EsEnter {
    public static void main(String[] args) {
        System.out.println("Introdueix texts (enter sol per finalitzar)");

        while (true) {
            String text = Entrada.readLine();

            if (text.isBlank()) break;

            if (UtilString.esEnter(text)) {
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
}
```
