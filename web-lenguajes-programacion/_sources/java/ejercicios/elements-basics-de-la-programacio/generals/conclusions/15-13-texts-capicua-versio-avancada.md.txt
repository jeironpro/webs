# Ejercicios — 15.13 — Texts capicua (versio avancada)

**Enunciat**

Aquest exercici correspon a una versió més avançada de la versió bàsica de text capicua

Llegeix amb atenció l'enunciat per veure els canvis.

Desenvolupa un programa anomenat Capicua, que demani un text i indiqui si el text és o no capicua.

Es considera que un text és capicua si llegint les seves lletres d'esquerra a dreta són iguals que llegint-les de dreta a esquerra, tot ignorant signes ortogràfics, incloent formes especials del català com ara accents i dièresis.

Nota: Opcionalment pots tenir en comptes l'el·la geminada, però el prgtest no en farà cap prova.

Considera les següents simulacions:

**Text?**
Açí rema l'americà.
"Açí rema l'americà." és capicua

**Text?**
Aquesta és una frase palindròfoba
"Aquesta és una frase palindròfoba" no és capicua

Però no et quedis sense provar frases palíndromes reals! Aquí en pots trobar unes quantes.

```java
public class Capicua {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        String textTransformat = "";
        String textReves = "";

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (Character.isLetter(c)) {
                char cc = switch(c) {
                    case 'ç' -> 'c';
                    case 'à' -> 'a';
                    case 'è','é' -> 'e';
                    case 'í','ï' -> 'i';
                    case 'ò','ó' -> 'o';
                    case 'ú','ü' -> 'u';
                    default -> c;
                }; 
                textTransformat += Character.toLowerCase(cc);
            }
        }
        for (int i = textTransformat.length()-1; i >= 0; i--) {
            char c = textTransformat.charAt(i);
            
            if (Character.isLetter(c)) {
                textReves += c;
            }
        }

        if (textTransformat.equals(textReves)) {
            System.out.println("És capicua");
        } else {
            System.out.println("No és capicua");
        }
    }
}
```
