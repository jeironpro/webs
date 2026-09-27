# Ejercicios — 16.08 — Seccio dun String

**Enunciat**

Desenvolupa una nova versió de l'exercici que mostrava la secció d'un String.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul anomenat mostraInterval() que serà qui realitzi realment la feina de mostrar l'interval.

La signatura del nou mòdul serà:

```java
public static void mostraInterval(String text, int inici, int fi)

public class MostraInterval {
    public static void main(String[] args) {
        System.out.println("text?");
        String text = Entrada.readLine();

        System.out.println("inici?");
        int inici = Integer.parseInt(Entrada.readLine());

        System.out.println("final?");
        int fi = Integer.parseInt(Entrada.readLine());
        mostraInterval(text, inici, fi);
    }

    public static void mostraInterval(String text, int inici, int fi) {
        if (inici >= text.length()) {
            inici = text.length()-1;
        }

        if (inici < 0) {
            inici = 0;
        }

        if (fi >= text.length()) {
            fi = text.length()-1;
        }

        if (fi < 0) {
            fi = 0;
        }

        if (inici < fi) {
            for (int i = inici; i <= fi; i++) {
                char c = text.charAt(i);
                System.out.println(c);
            }
        } else {
            for (int i = inici; i >= fi; i--) {
                char c = text.charAt(i);
                System.out.println(c);
            }
        }
    }
}
```
