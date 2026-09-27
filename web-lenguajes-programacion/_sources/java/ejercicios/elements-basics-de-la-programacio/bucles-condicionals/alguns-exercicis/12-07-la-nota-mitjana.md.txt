# Ejercicios — 12.07 — La nota mitjana

**Enunciat**

Recordes l'exercici de sumar notes? Doncs en aquesta ocasió en faràs un que, en comptes de dir-te la suma de notes, t'informarà de la nota mitjana corresponent a les notes introduïdes.

Anomena el teu programa Mitjana.

Un parell de simulacions:

**Introdueix un valor**
-5
Cap nota vàlida introduïda

**Introdueix un valor**
5
Introdueix un valor
90
Introdueix un valor
73
Introdueix un valor
123
La mitjana de les notes vàlides és 56.0

Pots suposar que totes les entrades seran enters vàlids.

**Pistes**
Novament aquest problema requereix l'ús del patró del lloro

Pensa quina és l'acció a realitzar per cada entrada i quin és el valor que marca el final de la iteració.

La mitjana d'uns valors numèrics es calcula a partir de sumar tots els valors i dividir el resultat pel nombre de valors. En l'exemple, la mitjana dels tres valors vàlids correspon a (5 + 90 + 73) / 3

Tot i que les entrades són sempre valors enters, el valor de la mitjana tindrà decimals. Fixa't en el 56.0. Et caldrà indicar-ho d'alguna manera al teu programa.

```java
public class Mitjana {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        float nota = Float.parseFloat(Entrada.readLine());

        float quantitatNotes = 0;
        float notes = 0;

        if (nota < 0) {
            System.out.println("Cap nota vàlida introduïda");
        } else {
            while (nota >= 0 && nota <= 100) {
                notes = notes + nota;
                quantitatNotes = quantitatNotes + 1;

                System.out.println("Introdueix un valor");
                nota = Float.parseFloat(Entrada.readLine());
            }
            System.out.println("La mitjana de les notes vàlides és " + (notes / quantitatNotes));
        }
    }
}
```
