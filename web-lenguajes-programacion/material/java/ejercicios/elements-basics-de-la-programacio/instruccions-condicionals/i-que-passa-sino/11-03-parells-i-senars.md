# Ejercicios — 11.03 — Parells i senars

**Enunciat**

Desenvolupa un programa que donat un número enter retorni si és parell o senar.

Una simulació d'execució pot ser:

**java ParellSenar 5**
El número 5 és senar

**java ParellSenar 8**
El número 8 és parell

Considera, si et cal, fer servir la següent plantilla

* Programa que indica si el número proporcionat com a primer argument
* és parell o senar.
* Si no s'especifica cap número, el resultat és indeterminat.

```java
public class ParellSenar {
    public static void main(String[] args) {
        int numero = Integer.parseInt(args[0]);
```

**█████ Aquí el codi amb l'estructura condicional**

```java
    }
}
```

**Nota**
Recorda que podem saber si un nombre és parell o senar segons el residu de la divisió entera (mòdul) com vam veure a Expressions numèriques

```java
public class ParellSenar {
    public static void main(String[] args) {
        int numero = Integer.parseInt(args[0]);
        
        if (numero % 2 == 0) {
            System.out.println("El número " + numero + " és parell");
        } else {
            System.out.println("El número " + numero + " és senar");
        }
    }
}
```
