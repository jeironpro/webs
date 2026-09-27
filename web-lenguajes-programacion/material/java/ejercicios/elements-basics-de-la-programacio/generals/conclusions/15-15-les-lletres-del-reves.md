# Ejercicios — 15.15 — Les lletres del reves

**Enunciat**

Aquest exercici és una versió més avançada d'un anterior (text del revés)

Llegeix amb atenció per descobrir els canvis.

Desenvolupa un programa anomenat TextReves, que demani un text i el torni a mostrar però invertint l'ordre de les lletres i dígits. La resta de caràcters es mantindran en l'ordre original.

Considera la següent simulació

**Text?**
git branch -m <old-name> <new-name>
ema nwenem -a <ndl-omhc> <nar-btig>

Pista: Només si no saps per on atacar el problema.

Et proposo dues maneres per orientar el problema:

Crea un String amb només les lletres i dígits. Dóna-li la volta i ves mostrant cada caràcter de la cadena original, tot agafant un caràcter de la versió reversa quan trobes a l'original una lletra o dígit.

Recorre l'entrada pels dos extrems de manera que la variable de recorregut "principal" vagi escrivint els caràcters no lletres ni dígits. Quan es trobi una lletra o dígit, recorrerà l'entrada des de la darrera posició no utilitzada fins la primera lletra o dígit que trobi. Pots assumir que per cada lletra o dígit sempre hi haurà una altra a "l'altra banda" doncs com a mínim sempre tindrà ella mateixa.

```java
public class TextReves {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        String lletresDigits = "";

        for (int i = text.length()-1; i >= 0; i--) {
            char c = text.charAt(i);
            if (Character.isLetter(c) || Character.isDigit(c)) {
                lletresDigits += c; 
            }
        }

        int j = 0;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (Character.isLetter(c) || Character.isDigit(c)) {
                System.out.print(lletresDigits.charAt(j));
                j++;
            } else {
                System.out.print(c);
            }
        }
    }
}
```
