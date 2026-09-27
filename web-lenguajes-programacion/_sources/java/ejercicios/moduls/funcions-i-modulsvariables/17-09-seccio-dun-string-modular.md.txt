# Ejercicios — 17.09 — Seccio dun String (modular)

## MostraInterval

**Enunciat**

Recuperem novament l'exercici que mostrava la secció d'un String i fem-ne la versió modular

El programa MostraInterval farà pràcticament el mateix que la versió original. Considera els canvis a partir d'aquesta nova interacció:

**Text?**
Java rocks
inici?
5
final?
7
roc

**Text?**
Java rocks
inici?
7
final?
5
cor

**Text?**
Java rocks
inici?
5
final?
1000
rocks

És a dir, ara els caràcters resultants apareixen a la mateixa línia.

L'operació de trobar els caràcters dins l'interval la realitzarà una funció anomenada intervalString() amb els paràmetres: la cadena de text corresponent, el valor inicial i el valor final. La funció retornarà la secció corresponent del text.

intervalString() estarà definida dins de UtilString.java i serà una funció pura.

```java
public class MostraInterval {
    public static void main(String[] args) {
        System.out.println("text?");
        String text = Entrada.readLine();

        System.out.println("inici?");
        int inici = Integer.parseInt(Entrada.readLine());

        System.out.println("final?");
        int fi = Integer.parseInt(Entrada.readLine());
        
        System.out.println(UtilString.intervalString(text, inici, fi));
    }
}
```

## UtilString

*Aquest programa és la meva biblioteca de String: Conte les següents utilitats:
* Una funció per verificar si un caràcter es vocal i retorna un valor boolean (esVocal).

* Una funció que filtra un text i retorna un String amb només les lletres del text (nomesLletres).

* Una funció que separa un text de només lletres i retorna un String amb les lletres separat per comes (lletresSeparades).

* Una funció que rep un text, un valor inicial i un valor final i retorna un interval del text en el rang d'inici i final ambdós inclosos (intervalString).

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
}
```
