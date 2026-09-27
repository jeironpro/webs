# Ejercicios — 14.02 — Informe dun String

**Enunciat**

Per manipular un tipus de dades tan especial com és String, Java ens ofereix una sèrie d'utilitats.

Per exemple, cadena.length() ens indica el nombre de caràcters que té la cadena. És a dir, la seva longitud.

D'entre les moltes opcions que ens ofereix Java, en considerarem les següents:

- utilitat
1. length()
2. startsWith(String unAltre)
3. endsWith(String unAltre)
4. equals(String unAltre)
5. equalsIgnoreCase(String unAltre)
6. isBlank()
7. isEmpty()
8. charAt(int posicio)
9. concat(String unAltre)
10. repeat(int cops)
11. toUpperCase()
12. toLowerCase()

- descripció
1. Longitud de la cadena
2. Boolean que indica si la cadena comença per l'altre
3. Boolean que indica si la cadena finalitza amb l'altre
4. Boolean que indica si la cadena és igual a l'altre
5. Boolean que indica si la cadena és igual a l'altre ignorant majúscules
6. Boolean que indica si la cadena només conté caràcters blancs o bé està buida
7. Boolean que indica si la cadena està buida
8. Caràcter a la posició indicada
9. Cadena resultant de concatenar la cadena amb l'altre
10. Cadena repetida el nombre de cops indicat
11. Cadena amb tot en majúscules
12. Cadena amb tot en minúscules

**Què hem de fer?**
Desenvolupa un programa anomenat InformeString que demani dos texts i un enter positiu i composi un petit informe amb el resultat de les funcions anteriors.

Considera la següent simulació:

**Text principal?**
They're eating the dogs!
Text secundari?
They
Número positiu?
3
"They're eating the dogs!".length(): 24
"They're eating the dogs!".startsWith("They"): true
"They're eating the dogs!".endsWith("They"): false
"They're eating the dogs!".equals("They"): false
"They're eating the dogs!".equalsIgnoreCase("They"): false
"They're eating the dogs!".isBlank(): false
"They're eating the dogs!".isEmpty(): false
"They're eating the dogs!".charAt(3): y
"They're eating the dogs!".concat("They"): They're eating the dogs!They
"They're eating the dogs!".repeat(3): They're eating the dogs!They're eating the dogs!They're eating the dogs!
"They're eating the dogs!".toUpperCase(): THEY'RE EATING THE DOGS!
"They're eating the dogs!".toLowerCase(): they're eating the dogs!

La gràcia és que vegis com es comporta cada utilitat quan li dónes diferents valors i no tant que passis les proves.

Et proposo que juguis una mica amb el teu programa, de manera que aconsegueixis que cada utilitat que retorna un valor booleà, respongui true.

Nota: No et preocupis per fer comprovacions de límits.

```java
public class InformeString {
    public static void main(String[] args) {
        System.out.println("Text pricincipal?");
        String textPrincipal = Entrada.readLine();

        if (!textPrincipal.isEmpty()) {
            System.out.println("Text secundari?");
            String textSecundari = Entrada.readLine();

            System.out.println("Posició?");
            int posicio = Integer.parseInt(Entrada.readLine());

            System.out.println("\"" + textPrincipal +  "\"" + ".length(): " + textPrincipal.length());
            System.out.println("\"" + textPrincipal +  "\"" + ".isBlank(): " + textPrincipal.isBlank());
            System.out.println("\"" + textPrincipal +  "\"" + ".isEmpty(): " + textPrincipal.isEmpty());
            System.out.println("\"" + textPrincipal +  "\"" + ".toUpperCase(): " + textPrincipal.toUpperCase());
            System.out.println("\"" + textPrincipal +  "\"" + ".toLowerCase(): " + textPrincipal.toLowerCase());

            if (!textSecundari.isEmpty()) {
                System.out.println("\"" + textPrincipal +  "\"" + ".startsWith(" + "\"" + textSecundari + "\"" + "): " + textPrincipal.startsWith(textSecundari));
                System.out.println("\"" + textPrincipal +  "\"" + ".endsWith(" + "\"" + textSecundari + "\"" + "): " + textPrincipal.endsWith(textSecundari));
                System.out.println("\"" + textPrincipal +  "\"" + ".equals(" + "\"" + textSecundari + "\"" + "): " + textPrincipal.equals(textSecundari));
                System.out.println("\"" + textPrincipal +  "\"" + ".equalsIgnoreCase(" + "\"" + textSecundari + "\"" + "): " + textPrincipal.equalsIgnoreCase(textSecundari));
                System.out.println("\"" + textPrincipal +  "\"" + ".concat(" + "\"" + textSecundari + "\"" + "): " + textPrincipal.concat(textSecundari));
            }

            if (posicio > 0) {
                System.out.println("\"" + textPrincipal +  "\"" + ".repeat(" + posicio + "): " + textPrincipal.repeat(posicio));
            } else if (posicio < textPrincipal.length()) {
                System.out.println("\"" + textPrincipal +  "\"" + ".charAt(" + posicio + "): " + textPrincipal.charAt(posicio));
            }
        } else {
            System.out.println("Text principal buit");
        }
    }
}
```
