# Ejercicios — 14.13 — Nomes lletres

**Enunciat**

Desenvolupa un programa anomenat NomesLletres que demani un text i mostri només les lletres que conté. Cada lletra apareixerà separada per una coma en l'ordre en que apareixia al text original. La resta de caràcters no es mostraran.

Considera la següent simulació:

**Text?**
Els 4 genets de l'Apocalipsi!
E, l, s, g, e, n, e, t, s, d, e, l, A, p, o, c, a, l, i, p, s, i

```java
public class NomesLletres {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        boolean primeraLletra = true;

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            
            if (Character.isLetter(c)) {
                if (primeraLletra) {
                    System.out.print(c);
                    primeraLletra = false;
                } else {
                    System.out.print(", " + c);
                }
            }
        }
    }
}
```
