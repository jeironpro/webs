# Ejercicios — 17.02 — Compta vocals

```java
/* Enunciat

Considera la següent versió simplificada del programa ComptaAiEs en la que comptem les ocurrències de 'a' i 'e' però no les comparem:

// programa que mostra quantes 'a's i 'e's té el text llegit per stdin //

public class ComptaAiEs {

    public static void main(String[] args) {

        System.out.println("Introdueix un text");

        String entrada = Entrada.readLine();

        int numAs = quantesOcurrencies(entrada, 'a');

        int numEs = quantesOcurrencies(entrada, 'e');

        mostraOcurrencies('a', numAs);

        mostraOcurrencies('e', numEs);

    }

    public static void mostraOcurrencies(char lletra, int quantes) {

        System.out.println("Nombre de '" + lletra + "'s: " + quantes);

    }

    public static int quantesOcurrencies(String text, char lletra) {

        int comptador = 0;

        for (int i=0; i < text.length(); i++) {

            if (text.charAt(i) == lletra) {

                comptador += 1;

            }

        }

        return comptador;

    }

}

Basant-te en aquest codi, desenvolupa un nou programa anomenat ComptaVocals que mostri les ocurrències de totes les vocals catalanes.

Una simulació d'execució seria:

Introdueix un text
una prova més avuí
Nombre de 'a's: 3
Nombre de 'à's: 0
Nombre de 'e's: 0
Nombre de 'è's: 0
Nombre de 'é's: 1
Nombre de 'i's: 0
Nombre de 'í's: 1
Nombre de 'ï's: 0
Nombre de 'o's: 1
Nombre de 'ó's: 0
Nombre de 'ò's: 0
Nombre de 'u's: 2
Nombre de 'ú's: 0
Nombre de 'ü's: 0

De regal, la plantilla, en la que només has de reemplaçar les XXX pel teu codi:

// XXX //
public class ComptaVocals {
    public static void main(String[] args) {
        // XXX //
    }
    public static void mostraOcurrencies(char lletra, int quantes) {
        System.out.println("Nombre de '" + lletra + "'s: " + quantes);
    }
    public static int quantesOcurrencies(String text, char lletra) {
        int comptador = 0;
        for (int i=0; i < text.length(); i++) {
            if (text.charAt(i) == lletra) {
                comptador += 1;
            }
        }
        return comptador;
    }
}

Nota: A veure si pots fer que a la part que afegeixis al codi no hi hagi més de deu ;.
*/

public class ComptaVocals {
    public static void main(String[] args) {
        System.out.println("Introdueix un text");
        String text = Entrada.readLine();

        String vocals = "aàeèéiíïoóòuúü";

        for (int i = 0; i < vocals.length(); i++) {
            char v = vocals.charAt(i);
            int quantes = quantesOcurrencies(text, v);
            mostraOcurrencies(v, quantes);
        }
    }
    
    public static void mostraOcurrencies(char lletra, int quantes) {
        System.out.println("Nombre de '" + lletra + "'s: " + quantes);
    }

    public static int quantesOcurrencies(String text, char vocal) {
        int comptador = 0;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == vocal) {
                comptador++;
            }
        }
        return comptador;
    }
}
```
