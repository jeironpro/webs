# Ejercicios — 17.13 — Substrings

## Main

**Enunciat**

La funció String.contains() permet saber si un text està inclòs dins d'un altre. És una funció molt còmoda però té algunes limitacions que intentarem resoldre en aquest exercici.

Les limitacions que adreçarem aquí són:

La nostra versió haurà de ser capaç d'indicar que un text està dins d'un altre (és substring) independentment de majúscules i minúscules.

Encara més, la versió que implementarem serà capaç d'acceptar substrings encara que els caràcters no siguin exactament iguals, tot ignorant les variants del català. En concret, les vocals accentuades i la lletra ç. Si vols, pots afegir l'ela geminada (l·l), per afegir-li més dificultat.

Implementarem dues modalitats de la mateixa funció, una d'estricta i una altra de laxa. La primera es comportarà com la funció copiada, mentre que la segona ignorarà majúscules/minúscules i les variants catalanes dels caràcters. Ho faran, seguint les següents signatures:

// retorna cert quan subtext està inclòs extrictament dins de text

```java
public static boolean esSubstring(String text, String subtext, boolean estricte)
```

// equival a esSubstring(text, subtext, true)

```java
public static boolean esSubstring(String text, String subtext)
```

El prgtest les provarà amb el següent codi d'exemple:

// Aquest programa comprova el funcionament de la funció UtilSTring.esSubstring()

```java
 public class Main {

     public static void main(String[] args) {

         System.out.println("Text principal?");

         String principal = Entrada.readLine();

         System.out.println("Subtext?");

         String subtext = Entrada.readLine();

         System.out.println("Estricte?");

         boolean estricte = UtilitatsConfirmacio.respostaABoolean(Entrada.readLine());

         System.out.printf("esSubstring(\"%s\", \"%s\", %b) -> %b%n",
```

principal, subtext, estricte,

```java
                           UtilString.esSubstring(principal, subtext, estricte));

     }

 }
```

Unes simulacions d'execució de Main:

**Text principal?**
Skibiditoiletskibidiskibidi
Subtext?
toilet
Estricte?
No
esSubstring("Skibiditoiletskibidiskibidi", "toilet", false) -> true

**Text principal?**
Skibiditoiletskibidiskibidi
Subtext?
TOILET
Estricte?
No
esSubstring("Skibiditoiletskibidiskibidi", "TOILET", false) -> true

**Text principal?**
Skibiditoiletskibidiskibidi
Subtext?
toïlet
Estricte?
No
esSubstring("Skibiditoiletskibidiskibidi", "toïlet", false) -> true

Nota: Fixa't en la ï de

**Text principal?**
Skibiditoiletskibidiskibidi
Subtext?
TOILET
Estricte?
sí
esSubstring("Skibiditoiletskibidiskibidi", "TOILET", true) -> false

**Text principal?**
Skibiditoiletskibidiskibidi
Subtext?

**Estricte?**
No
esSubstring("Skibiditoiletskibidiskibidi", "", false) -> true

Text principal?

**Subtext?**
toilet
Estricte?
No
esSubstring("", "toilet", false) -> false

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
        
        System.out.printf("esSubstring(\"%s\", \"%s\", %b) -> %b%n",
                          principal, subtext, estricte,
                          UtilString.esSubstring(principal, subtext, estricte));
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
