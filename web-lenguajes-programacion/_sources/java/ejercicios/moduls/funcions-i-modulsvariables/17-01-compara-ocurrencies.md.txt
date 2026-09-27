# Ejercicios — 17.01 — Compara ocurrencies

**Enunciat**

Recorda el següent programa que hem vist als apunts:

// programa que mostra quantes 'a's i 'e's té el text llegit per stdin //

```java
public class ComptaAiEs {

    public static void main(String[] args) {

        System.out.println("Introdueix un text");

        String entrada = Entrada.readLine();

        comptaLletra(entrada, 'a');

        comptaLletra(entrada, 'e');

        comparaAiEs(entrada);

    }

    public static void comptaLletra(String text, char lletra) {

        int comptador = 0;

        for (int i=0; i < text.length(); i++) {

            if (text.charAt(i) == lletra) {

                comptador += 1;

            }

        }

        System.out.println("Nombre de '" + lletra + "'s: " + comptador);

    }

    public static void comparaAiEs(String text) {

        int comptadorA = 0;

        int comptadorE = 0;

        for (int i=0; i < text.length(); i++) {

            if (text.charAt(i) == 'a') {

                comptadorA += 1;

            } else if (text.charAt(i) == 'e') {

                comptadorE += 1;

            }

        }

        if (comptadorA > comptadorE) {

            System.out.println("Hi ha més 'a's que 'e's");

        } else if (comptadorA < comptadorE) {

            System.out.println("Hi ha menys 'a's que 'e's");

        } else {

            System.out.println("Hi ha tantes 'a's com 'e's");

        }

    }

}
```

El mòdul comparaAiEs() només funciona comparar les ocurrències de les lletres 'a' i 'e'. Seria molt més interessant disposar d'un que ens permetés comparar les ocurrències de dos caràcters qualsevol. Aquest és l'objectiu de l'exercici.

Modifica el programa anterior de manera que el mòdul comparaAiEs() sigui reemplaçat per comparaOcurrencies() amb la signatura comparaOcurrencies(String text, char lletra1, char lletra2)

El programa resultant ha de tenir la mateixa sortida que el programa original, però en aquesta ocasió no farà servir comparaAiEs() sinó comparaOcurrencies().

Un exemple de sortida seria:

**Introdueix un text**
programem en java
Nombre de 'a's: 3
Nombre de 'e's: 2
Hi ha més 'a's que 'e's

Pista: Fixa't que un cop disposem de comparaOcurrencies(), el codi de comparaAiEs() es podria reescriure com:

```java
public static void comparaAiEs(String text) {
    comparaOcurrencies(text, 'a', 'e');
}
```

Per poder passar les proves d'aquest exercici, però, comparaAiEs() no haurà de ser-hi al codi del programa.

```java
public class ComptaAiEs {
    public static void main(String[] args) {
        System.out.println("Introdueix un text");
        String text = Entrada.readLine();
        comptaLletra(text, 'a');
        comptaLletra(text, 'e');
        comparaOcurrencies(text, 'a', 'e');
    }

    public static void comptaLletra(String text, char lletra) {
        int comptador = 0;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == lletra) {
                comptador++;
            }
        }
        System.out.println("Nombre de '" + lletra + "'s: " + comptador);
    }

    public static void comparaOcurrencies(String text, char lletra1, char lletra2) {
        int comptadorLletra1 = 0;
        int comptadorLletra2 = 0;

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == 'a') {
                comptadorLletra1++;
            } else if (c == 'e') {
                comptadorLletra2++;
            }
        }
        if (comptadorLletra1 > comptadorLletra2) {
            System.out.println("Hi ha més '" + lletra1 + "'s que '" + lletra2 + "'s");
        } else if (comptadorLletra1 < comptadorLletra2) {
            System.out.println("Hi ha més '" + lletra2 + "'s que '" + lletra1 + "'s");
        } else {
            System.out.println("Hi ha tantes '" + lletra1 + "'s como '" + lletra2 + "'s");
        }
    }

}
```
