# Ejercicios — 16.13 — Nomes lletres

**Enunciat**

Desenvolupa una nova versió de l'exercici que filtrava les lletres d'un text.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul que serà qui realitzi realment la feina.

La signatura del nou mòdul serà:

```java
public static void filtraLletres(String text)

public class NomesLletres {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        filtraLletres(text);
    }

    public static void filtraLletres(String text) {
        boolean primeraLletra = true;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);

            if (Character.isLetter(c)) {
                if (primeraLletra) {
                    System.out.print(c);
                    primeraLletra = false;
                } else {
                    System.out.print(", " + c);
                }
            }
        }
    }
}
```
