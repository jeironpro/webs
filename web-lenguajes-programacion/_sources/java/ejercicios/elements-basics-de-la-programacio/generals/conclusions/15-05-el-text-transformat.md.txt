# Ejercicios — 15.05 — El text transformat

**Enunciat**

Desenvolupa un programa anomenat TransformaText, que demani un text i mostri una versió transformada segons les següents regles:

Les vocals (les catalanes) apareixeran en minúscules

Les lletres no vocals apareixeran en majúscules

Els nombres (atenció, no els dígits!) apareixeran entre parèntesis ()

La resta de caràcters, excepte els blancs, desapareixen a la versió transformada

Recorda que les vocals catalanes són, a banda de les cinc habituals, à, è, é, í, ï, ò, ó, ú i ü

Considera la següent simulació

**Text?**
Avui faig 19 anys!
aVui FaiG (19) aNYS

```java
public class TransformaText {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        text = text + ".";
        String vocals = "aàeéèiíïoóòuúü";
        String nouText = "";
        String nombre = "";

        for (int i = 0; i < text.length(); i++) {
            boolean esVocal = false;
            char c = Character.toLowerCase(text.charAt(i));

            for (int j = 0; j < vocals.length(); j++) {
                char v = vocals.charAt(j);
                if (c == v) {
                    esVocal = true;
                } 
            }

            if (Character.isDigit(c)) {
                nombre += c;
            } else if (!nombre.isEmpty()) {
                nouText += "(" + nombre + ")";
                nombre = "";
            }

            if (esVocal) {
                nouText += Character.toLowerCase(c);
            } else if (Character.isLetter(c)) {
                nouText += Character.toUpperCase(c);
            } else if (Character.isWhitespace(c)) {
                nouText += c;
            }
        }
        System.out.println(nouText);
    }
}
```
