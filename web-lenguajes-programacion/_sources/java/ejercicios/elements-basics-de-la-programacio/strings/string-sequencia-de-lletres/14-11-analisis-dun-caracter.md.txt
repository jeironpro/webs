# Ejercicios — 14.11 — Analisis dun caracter

**Enunciat**

Desenvolupa un programa anomenat AnalitzaCaracter que demani un text i una posició.

Si el text és buit, indicarà "Text buit" i finalitzarà sense demanar res més.

Si la posició està dins del rang de caracters del text introduït, considerarà el caracter corresponent a la posició. Per exemple, si la paraula és "hola" i la posició és 2, el caràcter corresponent serà 'l'.

**h o l a**
^
0 1 2

Si la posició supera el nombre de caràcters del text, continuarà comptant a partir del primer. Per exemple, si la paraula és "hola" i la posició és 6, el caràcter corresponent serà 'l'.

**h o l a**
^
0 1 2 3         // continua comptant per l'inici
4 5 6

Si la posició és negativa, començarà a comptar a partir de l'últim caràcter del text introduït. Per exemple, -2 correspondrà a l'últim caràcter.

**h o l a**
^
-1         // comença pel final
-2           // compta decrementant

Un cop identificat el caràcter escollit, el programa indicarà:

el caràcter que correspon a la posició demanada

la categoria del caràcter:

lletra majúscula

lletra minúscula

dígit

altre: quan no sigui cap dels anteriors

Ja hem vist les utilitats de caràcters a un exercici anterior. Aquí en farem servir només algunes.

**Text?**
Tinc 3 gats!
Posició?
3
'c' és una lletra minúscula

```java
public class AnalitzaCaracter {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        if (!text.isEmpty()) {
            System.out.println("Posició?");
            int posicio = Integer.parseInt(Entrada.readLine());
            
            posicio = posicio % text.length(); 

            if (posicio < 0) {
                posicio = posicio + text.length();
            }
            
            System.out.print("'" + text.charAt(posicio) + "'");
            if (Character.isLetter(text.charAt(posicio))) {
                if (Character.isUpperCase(text.charAt(posicio))) {
                    System.out.println(" és una lletra majúscula");
                } else {
                    System.out.println(" és una lletra minúscula");
                }
            } else if (Character.isDigit(text.charAt(posicio))) {
                System.out.println(" és un dígit");
            } else {
                System.out.println(" és una altra cosa");
            }
        } else {
            System.out.println("Text buit");
        }
    }
}
```
