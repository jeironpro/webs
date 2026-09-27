# Ejercicios — 16.10 — Un triangle de lletres

**Enunciat**

Desenvolupa una nova versió de l'exercici que dibuixava un triangle de lletres.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul anomenat dibuixaTriangle() que serà qui realitzi realment la feina de mostrar el triangle. De fet, aquest es recolzarà en un altre anomenat dibuixaLinia() que serà qui realment faci la feina de dibuixar cada línia del triangle.

La signatura dels nous mòduls serà:

```java
public static void dibuixaTriangle(String text)
public static void dibuixaLinia(String text, int linia)

public class TriangleLletres {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        dibuixaTriangle(text);
    }

    public static void dibuixaTriangle(String text) {
        for (int i = 0; i < text.length(); i++) {
            dibuixaLinia(text, i);
            System.out.println();
        }
    }

    public static void dibuixaLinia(String text, int linia) {
        for (int i = 0; i <= linia; i++) {
            char c = text.charAt(i);
            if (linia >= 1 && i < linia) {
                System.out.print(c + ", ");
            } else {
                System.out.print(c);
            }
        }
    }
}
```
