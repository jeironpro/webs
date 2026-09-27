# Ejercicios — 16.12 — Lletres entre parentesis

**Enunciat**

Desenvolupa una nova versió de l'exercici que posava parèntesis a les lletres.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul que serà qui realitzi realment la feina.

La signatura del nou mòdul serà:

```java
public static void parentitza(String text)

public class Parentitza {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        parentitza(text);
    }

    public static void parentitza(String text) {
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
