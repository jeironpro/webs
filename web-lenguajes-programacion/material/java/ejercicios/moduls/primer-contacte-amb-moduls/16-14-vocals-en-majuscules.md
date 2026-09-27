# Ejercicios — 16.14 — Vocals en majuscules

**Enunciat**

Desenvolupa una nova versió de l'exercici que filtrava les lletres d'un text.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul que serà qui realitzi realment la feina.

La signatura del nou mòdul serà:

```java
public static void majusculitzaVocals(String text)

public class VocalsMajuscules {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        majusculitzaVocals(text);
    }

    public static void majusculitzaVocals(String text) {
        String vocals = "aeiou";
        for (int i = 0; i < text.length(); i++) {
            boolean esVocal = false;
            char c = text.charAt(i);
            for (int j = 0; j < vocals.length(); j++) {
                char v = vocals.charAt(j);
                if (Character.toLowerCase(c) == v) {
                    esVocal = true;
                }
            }
            if (esVocal) {
                System.out.print(Character.toUpperCase(c));
            } else {
                System.out.print(Character.toLowerCase(c));
            }
        }
    }
}
```
