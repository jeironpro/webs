# Ejercicios — 15.10 — Un triangle de lletres invertit

**Enunciat**

Desenvolupa un programa anomenat TriangleLletresInvertit, que demani un text i dibuixi un triangle amb les lletres del text en ordre invers al text introduït.

Considera la següent simulació:

**Text?**
Romualda
a, d, l, a, u, m, o, R
d, l, a, u, m, o, R
l, a, u, m, o, R
a, u, m, o, R
u, m, o, R
m, o, R
o, R
R

```java
public class TriangleLletresInvertit {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        for (int i = text.length()-1; i >= 0; i--) {
            for (int j = i; j >= 0; j--) {
                char c = text.charAt(j);
                if (i != 0 && j != 0) {
                    System.out.print(c + ", ");
                } else {
                    System.out.print(c);
                }
            }
            System.out.println();
        }
    }
}
```
