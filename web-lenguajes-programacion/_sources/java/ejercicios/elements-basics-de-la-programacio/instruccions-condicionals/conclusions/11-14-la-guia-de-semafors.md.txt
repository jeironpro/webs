# Ejercicios — 11.14 — La guia de semafors

**Enunciat**

Desenvolupem un ajudant per decidir que fer davant un semàfor ('vermell', verd o groc). El programa demanarà de quin color està el semàfor i segons la resposta recomanarà respectivament 'espera', passa, o corre! (sí, no és un assistent massa responsable).

En cas que el color introduït no sigui cap d'aquests, el programa respondrà amb el missatge "ves a l'oculista".

Exemple d'interacció:

**java Semafor**
Color?
groc
corre!

Aquest programa té la particularitat que el tipus de dades que guardem serà un String (cadena de text). Com veurem més endavant, en Java no podem comparar dos Strings directament amb l'operador ==. En canvi, ho farem amb una funció anomenada equals() que ens dirà si són o no iguals.

Per exemple, considera aquest fragment de codi que podria aparèixer a la solució de l'exercici:

```java
String color = Entrada.readLine();
if (color.equals("groc")) {
    System.out.println("corre!");
}
```

**Avís**
Fer color == "groc" seria incorrecte!

```java
public class Semafor {
    public static void main(String[] args) {
        System.out.println("Color?");
        String color = Entrada.readLine();

        /* if (color.equals("vermell")) {
            System.out.println("espera");
        } else if (color.equals("verd")) {
            System.out.println("passa");
        } else if (color.equals("groc")) {
            System.out.println("corre!");
        } else {
            System.out.println("ves a l'oculista");
        } */

        switch (color) {
            case "vermell" -> System.out.println("espera");
            case "verd" -> System.out.println("passa");
            case "groc" -> System.out.println("corre!");
            default -> System.out.println("ves a l'oculista");
        }
    }
}
```
