# Ejercicios — 15.04 — Inicials en majuscules

## Majusculitza

**Enunciat**

Desenvolupa un programa anomenat Majusculitza que demani un text i mostri el mateix text amb les inicials de cada paraula en majúscules i la resta en minúscules.

Una paraula és cada segment del text que només conté lletres que davant i darrere tenen quelcom que no sigui una lletra, o bé són la primera o darrera paraula del text.

Considera la simulació:

**Text?**
Je suis un homme de CRO-MAGNON
Je Suis Un Homme De Cro-Magnon

Nota

Aquesta és una versió naif del problema d'identificar paraules i posar la inicial en majúscules. Pensa, per exemple en el cas del text "He fet l'exercici". Aquí voldríem que l' no aparegués en majúscules ja que és un apòstrof i no l'inici d'una paraula. És a dir, voldríem que el resultat fos "He Fet l'Exercici".

T'atreveixes a fer una versió no naif d'aquest exercici?

Si t'animes, anomena el programa d'una manera diferent, com ara MajusculitzaAmpliat i pressumeix amb els teus docents.

Una pista? Considera disposar d'un "diccionari" de cadenes que no s'han de posar en majúscules. Un cop tinguis el mecanisme, tant sols caldrà anar completant aquesta llista per fer cada cop més complet el teu programa.

```java
public class Majusculitza {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

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

## MajusculitzaAmpliat

**Enunciat**

Desenvolupa un programa anomenat Majusculitza que demani un text i mostri el mateix text amb les inicials de cada paraula en majúscules i la resta en minúscules.

Una paraula és cada segment del text que només conté lletres que davant i darrere tenen quelcom que no sigui una lletra, o bé són la primera o darrera paraula del text.

Considera la simulació:

**Text?**
Je suis un homme de CRO-MAGNON
Je Suis Un Homme De Cro-Magnon

Nota

Aquesta és una versió naif del problema d'identificar paraules i posar la inicial en majúscules. Pensa, per exemple en el cas del text "He fet l'exercici". Aquí voldríem que l' no aparegués en majúscules ja que és un apòstrof i no l'inici d'una paraula. És a dir, voldríem que el resultat fos "He Fet l'Exercici".

T'atreveixes a fer una versió no naif d'aquest exercici?

Si t'animes, anomena el programa d'una manera diferent, com ara MajusculitzaAmpliat i pressumeix amb els teus docents.

Una pista? Considera disposar d'un "diccionari" de cadenes que no s'han de posar en majúscules. Un cop tinguis el mecanisme, tant sols caldrà anar completant aquesta llista per fer cada cop més complet el teu programa.

```java
public class MajusculitzaAmpliat {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        System.out.print(Character.toUpperCase(text.charAt(0)));
        String apostrof = "'";
        char charApostrof = apostrof.charAt(0);

        for (int i= 1; i < text.length(); i++) {
            char c = text.charAt(i);
            if ((!Character.isLetter(text.charAt(i-1)) && text.charAt(i+1) != charApostrof || text.charAt(i-1) == charApostrof)) {
                System.out.print(Character.toUpperCase(c));
            } else {
                System.out.print(Character.toLowerCase(c));
            }
        }
    }
}
```
