# Ejercicios — 14.12 — Lletres entre parentesis

**Enunciat**

Desenvolupa un programa anomenat Parentitza que demani un text i mostri cada lletra entre parèntesis

Considera la següent simulació:

**Text?**
I have an apple.
(I) (h)(a)(v)(e) (a)(n) (a)(p)(p)(l)(e).

```java
public class Parentitza {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (Character.isLetter(c)) {
                System.out.print("(" + c + ")");
            } else {
                System.out.print(c);
            }
        }
    }
}
```
