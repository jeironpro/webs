# Ejercicios — 15.08 — Codifica basic

**Enunciat**

Com ja vam veure a Tipus de tipus, cada lletra que trobem a un String té un codi, un nombre positiu.

Podem accedir a aquest número a partir d'una lletra i també podem, a partir del número, obtenir la lletra que té associada. Recorda la següent interacció:

**jshell> char c = 'a'**
c ==> 'a'

jshell> (int) c

2 ==> 97

jshell> (char) ('a' + 1)

9 ==> 'b'

En aquesta ocasió, desenvoluparem un programa anomeant CodificaBasic, que demanarà un text i el mostrarà codificat segons les següents instruccions:

Només codificarem les lletres entre la a i la z minúscules de l'alfabet llatí. La resta d'elements que apareguin al text, es mantindran iguals.

Cada lletra serà reemplaçada per la següent en l'ordre alfabètic, excepte la z, que serà substituïda per la a.

Considera la següent simulació:

**Text?**
Cada lletra que trobem a un string té un codi, un nombre positiu.
Cbeb mmfusb rvf uspcfn b vo tusjoh ué vo dpej, vo opncsf qptjujv.

Repte: Si aquest exercici no et resulta difícil, aconsegueix fer-lo amb només un if (l'operador ternari també compta com a if aquí, eh?)

```java
public class CodificaBasic {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);

            if (c >= 'a' && c <= 'z') {
                if (c == 'z') {
                    System.out.print('a');
                } else {
                    System.out.print((char)(c+1));
                }
            } else {
                System.out.print(c);
            }
        }
    }
}
```
