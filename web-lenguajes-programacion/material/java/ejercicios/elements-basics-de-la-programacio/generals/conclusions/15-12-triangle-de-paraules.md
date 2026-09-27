# Ejercicios — 15.12 — Triangle de paraules

**Enunciat**

En aquesta ocasió desenvoluparem un programa anomenat TriangleParaules, que ens permetrà construir un triangle, no de caràcters sinó de paraules!

Considerarem que les paraules són cadenes de caràcters separades per espais en blanc.

Per exemple, considera la següent execució:

**Text?**
Du hast mich
Du
Du hast
Du hast mich

```java
public class TriangleParaules {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        text = text + " ";

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);

            if (Character.isWhitespace(c)) {
                for (int j = 0; j < i; j++) {
                    char ch = text.charAt(j);
                    System.out.print(ch);
                }
                System.out.println();
            }
        }
    }
}
```
