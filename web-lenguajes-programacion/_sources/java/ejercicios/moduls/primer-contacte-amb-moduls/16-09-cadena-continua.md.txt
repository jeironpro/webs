# Ejercicios — 16.09 — Cadena continua

**Enunciat**

Desenvolupa una nova versió de l'exercici que mostrava una cadena contínua.

La nova versió tindrà la mateixa sortida que l'original però el codi del programa serà més modular. En concret, el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, i cridarà un nou mòdul anomenat mostraCadenaContinua() que serà qui realitzi realment la feina de mostrar el resultat.

La signatura del nou mòdul serà:

```java
public static void mostraCadenaContinua(String text, int longitud)

public class CadenaContinua {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        if (!text.isEmpty()) {
            System.out.println("Nombre?");
            int nombre = Integer.parseInt(Entrada.readLine());
            
            if (nombre >= 0) {
                mostraCadenaContinua(text, nombre);
            }
        } else {
            System.out.println("error");
        }
    }

    public static void mostraCadenaContinua(String text, int longitud) {
        for (int i = 0; i < longitud; i++) {
            System.out.print(text.charAt(i % text.length()));
        }
    }
}
```
