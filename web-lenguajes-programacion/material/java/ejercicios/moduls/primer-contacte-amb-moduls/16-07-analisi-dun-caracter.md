# Ejercicios — 16.07 — Analisi dun caracter

**Enunciat**

Desenvolupa una nova versió de l'exercici que analitzava un caràcter.

La nova versió tindrà el mateix comportament que l'original però el codi serà diferent:

el mòdul main() se n'encarregarà d'obtenir les dades d'entrada, comprovarà que siguin vàlides, mostrarà els errors corresponents, i n'extraurà el caràcter que finalment s'haurà d'analitzar.

Aquest caràcter a analitzar se li passarà al mòdul analitzaCaracter() que serà qui se n'encarregui de realitzar l'anàlisi.

La signatura del nou mòdul serà:

```java
public static void analitzaCaracter(char caracter)

public class AnalitzaCaracter {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        if (!text.isEmpty()) {
            System.out.println("Posició?");
            int posicio = Integer.parseInt(Entrada.readLine());
            
            caracterEnPosicio(text, posicio);
        } else {
            System.out.println("Text buit");
        }
    }

    public static void caracterEnPosicio(String text, int posicio) {
        posicio = posicio % text.length();

        if (posicio < 0) {
            posicio = posicio + text.length();
        }
        char caracter = text.charAt(posicio);
        analitzaCaracter(caracter);
    }

    public static void analitzaCaracter(char caracter) {
        if (Character.isUpperCase(caracter)) {
            System.out.println("'" + caracter + "'" + " és una lletra mayúscula");
        } else if (Character.isLowerCase(caracter)) {
            System.out.println("'" + caracter + "'" + " és una lletra minúscula");
        } else if (Character.isDigit(caracter)) {
            System.out.println("'" + caracter + "'" + " és un dígit");
        } else { 
            System.out.println("'" + caracter + "'" + " és una altra cosa");
        }
    } 
}
```
