# Ejercicios — 15.06 — El text del reves

**Enunciat**

Desenvolupa un programa anomenat TextReves, que demani un text i el torni a mostrar però invertint l'ordre dels caràcters que el composen. Els caracters resultants apareixeran separats per comes.

Considera la següent simulació

**Text?**
Es gibt keinen Weg zurück
k, c, ü, r, u, z,  , g, e, W,  , n, e, n, i, e, k,  , t, b, i, g,  , s, E

```java
public class TextReves {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        for (int i = text.length()-1; i >= 0; i--) {
            char c = text.charAt(i);
            if (i != 0) {
                System.out.print(c + ", ");
            } else {
                System.out.print(c + "\n");
            }
        }
    }
}
```
