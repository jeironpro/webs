# Ejercicios — 17.15 — Quants cops

## Main

**Enunciat**

Els Strings de Java en la versió que fem servir en aquest curs, no ofereixen la utilitat count() que en altres llenguatges permet saber quants cops apareix un substring en un string.

Em decidit que això no pot ser, així que farem nosaltres una implementació d'aquesta funció.

La versió que implementarem tindrà dues modalitats que permetran decidir si cal realitzar comparacions estrictes o no en el sentit de l'exercici anterior.

Les signatures a implementar són:

// retorna el nombre d'aparicions del subtext dins del text, considerant si
// ha de ser o no estricte

```java
public static int quants(String text, String subtext, boolean estricte)
```

// equival a quants(text, subtext, true)

```java
public static int quants(String text, String subtext)
```

Pots provar el seu funcionament amb el següent codi d'exemple:

// Aquest programa comprova el funcionament de la funció UtilSTring.quants()

```java
 public class Main {

     public static void main(String[] args) {

         System.out.println("Text principal?");

         String principal = Entrada.readLine();

         System.out.println("Subtext?");

         String subtext = Entrada.readLine();

         System.out.println("Estricte?");

         boolean estricte = UtilitatsConfirmacio.respostaABoolean(Entrada.readLine());

         System.out.printf("quants(\"%s\", \"%s\") -> %b%n",
```

principal, subtext, estricte,

```java
                           UtilString.quants(principal, subtext, estricte));

     }

 }
```

Unes simulacions d'execució de Main:

**Text principal?**
Skibiditoiletskibidiskibidi
Subtext?
SKIBÍDI
Estricte?
No
quants("Skibiditoiletskibidiskibidi", "SKIBÍDI", false) -> 3

**Text principal?**
Skibiditoiletskibidiskibidi
Subtext?
skibidi
Estricte?
sí
quants("Skibiditoiletskibidiskibidi", "skibidi", true) -> 2

**Text principal?**
Skibídïtoiletskibidískibidi
Subtext?
bïdí
Estricte?
no
quants("Skibídïtoiletskibidískibidi", "bïdí", false) -> 3

Nota: Fixa't en les dièresis i accents.

**Text principal?**
Skibiditoiletskibidiskibidi
Subtext?

**Estricte?**
No
quants("Skibiditoiletskibidiskibidi", "", false) -> 0

Text principal?

**Subtext?**
toilet
Estricte?
No
quants("", "toilet", false) -> 0

Per simplicitat, si la subcadena és buida, retornarà 0 en comptes d'infinit. Confio en que apreciaràs aquesta simplificació ;)

Resol aquest exercici només fent servir mòduls pròpis teus i les funcions bàsiques String.charAt() i String.length().

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Text principal?");
        String principal = Entrada.readLine();
        
        System.out.println("Subtext?");
        String subtext = Entrada.readLine();
        
        System.out.println("Estricte?");
        boolean estricte = UtilitatsConfirmacio.respostaABoolean(Entrada.readLine());
        
        System.out.printf("quants(\"%s\", \"%s\", %b) -> %d%n",
                principal, subtext, estricte,
                UtilString.quants(principal, subtext, estricte));
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
