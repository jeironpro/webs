# Ejercicios — 11.04 — operador ternari

**Enunciat**

A banda de l'estructura condicional if… else…, Java ens ofereix un operador que ens permet definir el valor d'una expressió a partir d'una condició.

Si l'estructura condicional presenta el següent aspecte:

```java
int resultat;
if (condicio) {
    resultat = 1;
} else {
    resultat = 2;
}
```

Podem traduir el codi anterior en una sola línia:

```java
int resultat = condicio ? 1 : 2;
```

Torna a desenvolupar l'exercici anterior amb l'operador ternari. És a dir, no facis servir servir l'estructura if. El programa ha de mostrar exactament el mateix comportament pels usuaris.

Pista: Considera deixar en una variable de tipus String, si és parell o senar. El teu codi hauria de tenir un únic System.out.println()

```java
public class ParellSenar {
    public static void main(String[] args) {
        int numero = Integer.parseInt(args[0]);

        String resultat = (numero % 2 == 0) ? "El número " + numero + " és parell" : "El número " + numero + " és senar";

        System.out.println(resultat);       
    }
}
```
