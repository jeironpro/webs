# Ejercicios — 18.05 — Enters entre comes (v1)

**Enunciat**

Desenvolupa un programa que mostri tres enters separats per comes tenint en comptes que els tres valors es troben emmagatzemats en un array d'enters.

Et passo una plantilla on hauràs de reemplaçar els valors que apareixen // pel contingut corresponent:

//

```java
public class EntersEntreComes {

    public static void main(String[] args) {

        int[] numeros;

        numeros = new int[3];

        numeros[//] = 1;

        numeros[//] = 2;

        numeros[//] = 3;

        System.out.print(numeros[//]);

        for (int i = 1; i < numeros//; i++) {

            System.out.print(", " + numeros[//]);

        }

        System.out.println();

    }

}
```

La sortida d'aquest programa hauria de ser la següent:

1, 2, 3

```java
public class EntersEntreComes {
    public static void main(String[] args) {
        int[] numeros = new int[3];

        numeros[0] = 1;
        numeros[1] = 2;
        numeros[2] = 3;

        System.out.print(numeros[0]);
        for (int i = 1; i < numeros.length; i++) {
            System.out.print(", " + numeros[i]);
        }
        System.out.println();
    }
}
```
