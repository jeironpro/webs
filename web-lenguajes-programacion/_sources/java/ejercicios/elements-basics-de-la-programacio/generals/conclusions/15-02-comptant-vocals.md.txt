# Ejercicios — 15.02 — Comptant vocals

**Enunciat**

Desenvolupa un programa anomenat ComptaVocals que demani un text i compti quantes vocals conté.

En aquesta ocasió, el programa comptarà com a vocals, a banda de les habituals a, e, i, o i u., també les seves variants al català: à, é, è, í, ï, ó, ò, ú i ü

Considera la següent simulació:

**Text?**
En Pinxo li va dir a en Panxo "vols que et punxi amb un punxó?"
20

```java
public class ComptaVocals {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        String vocals = "aàeéèiíïoóòuúü";
        int contador = 0;

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);

            for (int j = 0; j < vocals.length(); j++) {
                char v = vocals.charAt(j);

                if (Character.toLowerCase(c) == v) {
                    contador++;
                }
            }
        }
        System.out.println(contador);
    }
}
```
