# Ejercicios — 16.11 — Un triangle de lletres invertit

**Enunciat**

Desenvolupa una nova versió de l'exercici que dibuixava un triangle de lletres invertit.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul anomenat dibuixaTriangle() que serà qui realitzi realment la feina de mostrar el triangle. De fet, aquest es recolzarà en un altre anomenat dibuixaLinia() que serà qui realment faci la feina de dibuixar cada línia del triangle.

La signatura dels nous mòduls serà:

```java
public static void dibuixaTriangleInvertit(String text)
public static void dibuixaLiniaInvertida(String text, int linia)

public class TriangleLletresInvertit {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        dibuixaTriangleInvertit(text);
    }

    public static void dibuixaTriangleInvertit(String text) {
        for (int i = text.length()-1; i >= 0; i--) {
            dibuixaLiniaInvertida(text, i);
            System.out.println();
        }
    }

    public static void dibuixaLiniaInvertida(String text, int linia) {
        for (int i = linia; i >= 0; i--) {
            char c = text.charAt(i);
            if (i >= 1) {
                System.out.print(c + ", ");
            } else {
                System.out.print(c);
            }
        }
    }
}
```
