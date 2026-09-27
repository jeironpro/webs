# Ejercicios — 15.03 — Estadistiques dun text

**Enunciat**

Desenvolupa un programa anomenat InformeText que demani un text i mostri un petit informe resum d'estadístiques del text.

L'informe indicarà quants caràcters, lletres i vocals catalanes (majúscules i minúscules), dígits i altres caràcters conté. A banda, indicarà, per cada categoria, el percentatge respecte el total dels caràcters.

Recorda que les vocals catalanes són, a banda de les cinc habituals, à, è, é, í, ï, ò, ó, ú i ü

Considera les següents simulacions:

**Text?**
Amiga, que són 4 pipes. Ni 1 més, ni 1 menys!
Informe
=======
lletres en majúscules: 2 (4,44%)
lletres en minúscules: 26 (57,78%)
total lletres: 28 (62,22%)
vocals en majúscules: 1 (2,22%)
vocals en minúscules: 11 (24,44%)
total vocals: 12 (26,67%)
digits: 3 (6,67%)
altres caràcters: 14 (31,11%)
total caràcters: 45

Pista: Intenta fer el programa sense llegir aquesta pista. Només fes-la servir si no te'n surts.

Per escriure els estadístics del nombre de lletres en minúscules, podries fer servir la següent instrucció:

```java
System.out.printf("lletres en majúscules: %d (%.2f%%)%n",
```

lletresMajuscules,

```java
                  100.0 * lletresMajuscules / totalCaracters);
```

Fixa't que fa servir System.out.printf(). El pots considerar com una comoditat que ens permet utilitzar la utilitat String.format() directament per escriure-la per sortida estàndard.

També observaràs que apareix %.2f. És la manera que té String.format() d'indicar el nombre de decimals que vol mostrar.

Una altra peculiaritat és el %%. Amb aquesta combinació String.format() ens permet representar el caràcter % que altrament seria considerat un paràmetre a substituir!

Recorda que amb %n estem fent un salt de línia totes les plataformes.

Finalment, fixa't que multipliquem primer per 100.0. Això permetrà que la divisió no es consideri entera.

```java
public class InformeText {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        String vocals = "aàeéèiíïoóòuúü";
        int comptadorMajuscula = 0;
        int comptadorMinuscula = 0;
        int comptadorVocalMajuscula = 0;
        int comptadorVocalMinuscula = 0;
        int comptadorDigit = 0;
        int comptadorAltresCaracter = 0;

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            for (int j = 0; j < vocals.length(); j++) {
                char v = vocals.charAt(j);
                if (c == Character.toUpperCase(v)) {
                    comptadorVocalMajuscula++;
                }
                if (c == v) {
                    comptadorVocalMinuscula++;
                }
            }
            if (Character.isUpperCase(c)) {
                comptadorMajuscula++;
            } else if (Character.isLowerCase(c)) {
                comptadorMinuscula++;
            } else if (Character.isDigit(c)) {
                comptadorDigit++;
            } else {
                comptadorAltresCaracter++;
            }
        }
        System.out.println("Informe");
        System.out.println("=======");
        System.out.printf("lletres en majúscules: %d (%.2f%%)%n", comptadorMajuscula, 100.0 * comptadorMajuscula / text.length());
        System.out.printf("lletres en minúscules: %d (%.2f%%)%n", comptadorMinuscula, 100.0 * comptadorMinuscula / text.length());
        System.out.printf("total lletres: %d (%.2f%%)%n", (comptadorMajuscula + comptadorMinuscula), 100.0 * (comptadorMajuscula + comptadorMinuscula) / text.length());
        System.out.printf("vocals en majúscules: %d (%.2f%%)%n", comptadorVocalMajuscula, 100.0 * comptadorVocalMajuscula / text.length());
        System.out.printf("vocals en minúscules: %d (%.2f%%)%n", comptadorVocalMinuscula, 100.0 * comptadorVocalMinuscula / text.length());
        System.out.printf("total vocals: %d (%.2f%%)%n", (comptadorVocalMajuscula + comptadorVocalMinuscula), 100.0 * (comptadorVocalMajuscula + comptadorVocalMinuscula) / text.length());
        System.out.printf("digits: %d (%.2f%%)%n", comptadorDigit, 100.0 * comptadorDigit / text.length());
        System.out.printf("altres caràcters: %d (%.2f%%)%n", comptadorAltresCaracter, 100.0 * comptadorAltresCaracter / text.length());
        System.out.printf("total caràcters: %d%n", text.length());
    }
}
```
