# Ejercicios — 15.09 — Un triangle de lletres

**Enunciat**

Desenvolupa un programa anomenat TriangleLletres, que demani un text i dibuixi un triangle amb les lletres del text.

Considera la següent simulació:

**Text?**
Nemesio
N
N, e
N, e, m
N, e, m, e
N, e, m, e, s
N, e, m, e, s, i
N, e, m, e, s, i, o

En cas que la cadena d'entrada estigui buida, no mostrarà res.

```java
public class TriangleLletres {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        for (int i = 0; i < text.length(); i++) {
            for (int j = 0; j <= i; j++) {
                char c = text.charAt(j);
                if (i > 0 && j < i) {
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
