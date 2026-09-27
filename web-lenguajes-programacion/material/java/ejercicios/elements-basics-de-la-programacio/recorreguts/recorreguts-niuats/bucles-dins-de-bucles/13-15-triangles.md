# Ejercicios — 13.15 — Triangles

**Enunciat**

Desenvolupa un programa anomenat Triangle, que demani un nombre enter positiu i dibuixi tants triangles com se li indiqui.

Si el valor d'entrada és menor que 1, el programa no mostrarà cap sortida.

Un exemple d'execució:

**quants?**
2
.........9.........
........898........
.......78987.......
......6789876......
.....567898765.....
....45678987654....
...3456789876543...
..234567898765432..
.12345678987654321.
0123456789876543210
.........9.........
........898........
.......78987.......
......6789876......
.....567898765.....
....45678987654....
...3456789876543...
..234567898765432..
.12345678987654321.
0123456789876543210

Nota: No intentaràs fer quelcom com ara System.out.println("0123456789876543210");, oi?

```java
public class Triangle {
    public static void main(String[] args) {
        System.out.println("Quants?");
        int quantitat = Integer.parseInt(Entrada.readLine());

        for (int i = 0; i < quantitat; i++) {
            for (int j = 9; j >= 0 ; j--) {
                for (int k = 0; k < j; k++) {
                    System.out.print(".");
                }
                for (int k = j; k <= 9; k++) {
                    System.out.print(k);
                }
                for (int k = 8; k >= j; k--) {
                    System.out.print(k);
                }
                for (int k = j; k > 0; k--) {
                    System.out.print(".");
                }
                System.out.println();
            }
        }
    }
}
```
