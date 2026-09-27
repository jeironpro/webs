# Ejercicios — 19.04 — Subcadenes pre ordre

**Enunciat**

En aquesta ocasió, desenvoluparàs un programa que obtindrà un text per entrada estàndard i mostrarà per sortida estàndard totes les subcadenes possibles, tenint en comptes només les lletres.

Per mostrar l'ordre requerit per aquest exercici, caldrà que implementis el següent algorisme recursiu:

Si la cadena d'entrada té una longitud menor o igual a 1, es mostra la cadena sencera i s'acaba

Si la cadena té una longitud més gran que 1, llavors:

Primer es mostra la cadena

Després es mostra les subcadenes corresponents a la primera meitat de la cadena

Finalment es mostra les subcadenes corresponents a la resta de la cadena

Caldrà que la teva solució no faci servir cap estructura de bucle iteratiu (for while)

Considera la següent simulació:

**java Subcadenes**
Text?
Recursivitat en Java!
18: RecursivitatenJava
9: Recursivi
4: Recu
2: Re
1: R
1: e
2: cu
1: c
1: u
5: rsivi
2: rs
1: r
1: s
3: ivi
1: i
2: vi
1: v
1: i
9: tatenJava
4: tate
2: ta
1: t
1: a
2: te
1: t
1: e
5: nJava
2: nJ
1: n
1: J
3: ava
1: a
2: va
1: v
1: a

Per poder fer l'alineació dels números que et permetrà passar les proves, considera el següent comanda:

```java
System.out.printf("%4d: %s%n", text.length(), text);
```

Si text és "recursivitat" escriurà per pantalla:

- ·12: recursivitat

Atenció: he fet servir el caràcter · per remarcar que hi ha espais.

Per donar-te la màxima llibertat a l'hora d'estructurar el teu programa, les proves no inclouen cap requeriment modular. Has de tenir present, però, que no podràs fer ús de mòduls previs que continguin bucles iteratius (for, while).

Només si et cal, continua llegint les pistes de com resoldre-ho:

la neteja dels caràcters que no siguin lletres, pot ser realitzada amb un mòdul nou que haurà de ser recursiu.

la divisió de subcadenes les hauràs de realitzar també en un mòdul recursiu.

Com que ambdós mòduls rebran un string, pots fer la recursivitat de manera molt similar. Dues possibilitats:

el cas base és la cadena buida (o fins una mida fixa), i el cas recursiu fa servir String.substring() per escurçar l'argument.

els mòduls inclouen un o més paràmetres addicionals que indiquen des de quina (i fins quina) posició ha de considerar el text rebut. El cas base serà quan aquestes posicions corresponguin a un segment del text buit o de la mida fixa.

Nota

A aquest ordre se li diu pre-ordre. Hi pots trobar més informació, per exemple aquí

```java
public class Subcadenes {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        if (text.length() <= 1) {
            System.out.println(text);
        } else {
            text = netejaEspais(text);
            preOrdre(text, 0, text.length());
        }
    }

    public static void preOrdre(String text, int ini, int fi) {
        if (text.isEmpty() || fi - ini <= 0) return;
        
        String midText = text.substring(ini, fi);

        System.out.printf("%4d: %s%n", midText.length(), midText);

        int meitat = (ini + fi) / 2;

        if (meitat < fi) preOrdre(text, ini, meitat);

        if (meitat > ini) preOrdre(text, meitat, fi);
    }

    public static String netejaEspais(String text) {
        if (text.isEmpty()) return text;

        String nouText = "";

        char primer = text.charAt(0);
        if (Character.isLetter(primer)) {
            nouText += primer;
        }

        nouText += netejaEspais(text.substring(1));
        return nouText;
    }
}
```
