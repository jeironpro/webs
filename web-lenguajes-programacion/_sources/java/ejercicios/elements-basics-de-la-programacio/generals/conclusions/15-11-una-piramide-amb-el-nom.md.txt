# Ejercicios — 15.11 — Una piramide amb el nom

**Enunciat**

Desenvolupa un programa anomenat PiramideLletres, que demani un text i dibuixi una piràmide com la que es mostra al següent exemple d'execució:

**Text?**
Eva
....E-E....
..E.v-v.E..
E.v.a-a.v.E

```java
public class PiramideLletres {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        
        for(int i = 0; i < text.length(); i++) {
            for (int j = i; j < text.length()-1; j++) {
                System.out.print(".");
                System.out.print(".");
            }
            for (int k = 0; k <= i; k++) {
                System.out.print(text.charAt(k));
                if (k < i) {
                    System.out.print(".");
                }
                if (k == i) {
                    System.out.print("-");
                }
            }
            for (int k = i; k >= 0; k--) {
                System.out.print(text.charAt(k));
                if (k > 0) {
                    System.out.print(".");
                }
            }
            for (int j = i; j < text.length()-1; j++) {
                System.out.print(".");
                System.out.print(".");
            }
            System.out.println();
        }      
    }
}
```
