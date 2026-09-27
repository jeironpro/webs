# Ejercicios — 16.15 — Inicials en majuscules

**Enunciat**

Desenvolupa una nova versió de l'exercici que posava en majúscules les inicials d'un text.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul que serà qui realitzi realment la feina.

La signatura del nou mòdul serà:

```java
public static void majusculitzaInicials(String text)

public class Majusculitza {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        majusculitzaInicials(text);
    }

    public static void majusculitzaInicials(String text) {
        if (!text.isEmpty()) {
            System.out.print(Character.toUpperCase(text.charAt(0)));
        
            for (int i= 1; i < text.length(); i++) {
                char c = text.charAt(i);
                if (!Character.isLetter(text.charAt(i-1))) {
                    System.out.print(Character.toUpperCase(c));
                } else {
                    System.out.print(Character.toLowerCase(c));
                }
            }
        }
    }
}
```
