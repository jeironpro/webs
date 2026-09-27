# Return

**Return**
El return en Java s'utilitza dins d'una funció per indicar quin valor ha de retornar aquesta funció quan s'executa. Això permet que la funció proporcioni un resultat al codi que la va cridar.

**Ús de return en funcions que retornen un valor**
Quan una funció té un tipus de retorn diferent de void,ha d'incloure obligatòriament una instrucció return que retorni un valor del mateix tipus declarat.

**Exemple bàsic**

```java
public class Exemple {
    public static int sumar(int a, int b) {
        return a + b; // Retorna la suma de a i b
    }

    public static void main(String[] args) {
        int resultat = sumar(5, 3);
        System.out.println(resultat); // sortida 8
    }
}
```

En aquest cas, la funció sumar(int a, int b) retorna un valor de tipus int, que després es guarda a la variable resultat.

**return en funcions void (procediment)**
Quan una funció té el tipis de retorn void, significa que no retorna cap valor. No és necessari utilitzar return, però es pot fer servir per aturar l'execució de la funció abans d'arribar al final.

**Exemple**

```java
Public class Exemple {
    public static void mostrarMissatge() {
        System.out.println("Hola, món!");
        return; // Opcional en funcions void
    }

    public static void main(String[] args) {
        mostrarMissatge();
    }
}
```

El return; és opcional aquí perquè la funció és void.

**Return dins de condicions**
return es pot utilitzar dins de condicions per sortir anticipadament d'una funció.

**Exemple**

```java
public class Exemple {
    public static int dividir(int a, int b) {
        if (b == 0) {
            System.out.println("No es pot dividir per zero.");
            return 0; // Retorna 0 si b és 0
        }
        return a / b;
    }

    public static void main(String[] args) {
        System.out.println(dividir(10, 2)); // Sortida 5
        System.out.println(dividir(10, 0)); // Sortida: No es pot dividir per zero. 0
    }
}
```

Si b == 0, la funció acaba immediatament amb return 0; evitant que es continuï executant.

**retornar objectes**
Les funcions també poden retornar objectes, no només tipus primitius.

**Exemple**

```java
class Persona {
    String nom;

    public Persona(String nom) {
        this.nom = nom;
    }

    public String obtenirNom() {
        return nom;
    }
}

public class Exemple {
    public static void main(String[] args) {
        Persona persona = new Persona("Anna");
        System.out.println(persona.obtenirNom()); // Sortida Anna
    }
}
```

Aquí, obtenirNom() retorna una cadena (String), i la podem utilitzar després.

**Return amb Array o List**
També es poden retornar arrays o col·leccions.

**Retornar un array**

```java
public class Exemple {
    public static int[] obtenirNumeros() {
        return new int[]{1,2,3,4,5};
    }

    public static void main(String[] args) {
        int[] nums = obtenirNumeros();
        System.out.println(nums[0]); // Sortida 1
    }
}
```

**Retornar una List de Java**

```java
import java.util.List;
import java.util.ArrayList;

public class Exemple {
    public static List<String> obtenirNoms() {
        List<String> noms = new ArrayList<>();
        noms.add("Anna");
        noms.add("Joan");
        return noms;
    }

    public static void main(String[] args) {
        List<String> noms = obtenirNoms();
        System.out.println(noms.get(0)); // Sortida: Anna
    }
}
```

En aquests casos, el return permet retornar més d'un valor encapsulat dins d'un array o una col·lecció.

**Return en funcions recursives**
En una funció recursiva, return s'utilitza per retornar el resultat de crides recursives.

**Exemple: Factorial**

```java
public class Exemple {
    public static int factorial(int n) {
        if (n == 0) {
            return 1;
        }
        return n * factorial(n-1); // Crida recursiva
    }

    public static void main(String[] args) {
        System.out.println(factorial(5)); // Sortida: 120
    }
}
```

La funció factorial(n) retorna n * factorial(n-1), repetint el procés fins arribar a n == 0.

**Vigilar**
1- return retorna un valor d'una funció si el tipus de retorn no és void-

2- En funcions void, return; és opcional i només s'utilitza per sortir abans d'acabar.abstract

3- Es pot utilitzar return per sortir anticipadament d'una funció dins d'una condició.

4- També podem retornar objectes, arrays i col·leccions.

5- En funcions recursives, return s'utilitza per passar el resultat cap enrere en la crida recursiva.
