# Mutabilitat

**Mutabilitat**
En Java, la mutabilitat i immutabilitat es comporten de manera diferent segons si estem parlant d'array (objectes) o tipus primituis.

**Els arrays són mutables**
Un array en Java és un objecte mutable, perquè es pot modificar el seu contingut després de ser creat.

**Exemple de mutabilitat d'un array**

```java
public class Exemple {
    public static void main(String[] args) {
        int[] nombres = {1, 2, 3};
        nombres[0] = 10; // Modificació d'un element
        System.out.println(nombres[0]); // 10 (canviat)
    }
}
```

Encara que la referència nombres sempre apunta al mateix array, el seu contingut es pot modificar.

**Però la referència pot ser immutable amb final**
Si declarem l'array amb final, no podem canviar la seva referència, però sí el seu contingut.

```java
public class Exemple {
    public static void main(String[] args) {
        final int[] numeros = {1, 2, 3};
        numeros[0] = 10;  // Permès: es modifica el contingut
        // numeros = new int[]{4, 5, 6};  // Error: no es pot canviar la referència
    }
}
```

Amb final, el contingut de l'array segueix sent mutable, però no es pot reasignar la referència.

**Els tipus primitius són immutables**
Els tipus primitius (int, double, char, etc.) són immutables perquè el seu valor no es pot modificar un cop assignat.

**Exemple d'immutabilitat d'un tipus primitiu**

```java
public class Exemple {
    public static void main(String[] args) {
        int x = 5;
        x = 10;  // Això no modifica el valor "5", sinó que crea una nova assignació
        System.out.println(x);  // 10
    }
}
```

Quan es fa x = 10;, no s'està modificant 5, sinó que x ara apunta a un nou valor.

**Per què són immutables?**
- Els tipus primitius no són objectes, es guarden directament a la memòria i no tenen referències.
- Quan s'assigna un nou valor, simplement se sobreescriu la posició de memòria.

**Notes**
1. Els arrays són mutables: el seu contingut es pot modificar, però la seva referència es pot fer immutable amb final.

- **2.** Els tipus primitius són immutables: cada vegada que es canvia el valor, es crea una nova assignació en memòria.
