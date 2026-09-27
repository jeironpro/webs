# Ejercicios — 16.16 — El text del reves

**Enunciat**

Desenvolupa una nova versió de l'exercici que posava un text del revés.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul que serà qui realitzi realment la feina.

La signatura del nou mòdul serà:

```java
public static void mostraReves(String text)

public class TextReves {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        mostraReves(text);
    }

    public static void mostraReves(String text) {
        for (int i = text.length()-1; i >= 0; i--) {
            char c = text.charAt(i);
            if (i > 0) {
                System.out.print(c + ", ");
            } else {
                System.out.print(c);
            }
        }
    }
}
```
