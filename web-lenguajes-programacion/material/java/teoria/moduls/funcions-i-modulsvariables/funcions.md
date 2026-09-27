# Funcions

**Funcions**
Les funcions (o mètodes en Java) són blocs de codi que encapsulen una seqüencia d'instruccions dissenyades per realitzar una tasca específica dins d'un programa. Les funcions permeten reutilitzar codi, dividir un programa en parts més petites i comprensibles, i facilitar la seva mantenibilitat i extensibilitat.

Cada funció té un nom únic que s'utilitza per cridar-la, un conjunt de paràmetres opcionals que li proporcionen dades d'entrada, i un tipus de retorn que indica el valor resultant (si n'hi ha). Les funcions poden ser invocades repetidament des de qualsevol part del programa, sempre que siguin accessibles, i poden operar amb dades passades com arguments o utilitzar variables de la seva pròpia classe.

En Java, les funcions es classifiquen segons diversos criteris:
- Segons la visibilitat: pot ser pública, privada o protegida.
- Segons la seva associació amb la classe o objecte: poden ser estàtiques (associades a la classe) o no estàtiques (requereixen una instància de l'objecte).
- Segons el retorn: poden retornar un valor específic o no retornar-ne cap (tipus void).

Les funcions són la base de la programación estructurada u juguen un paper fonamental en la división de la lógica del programa en unitats lògiques independents i reutilitzables.

**Sintaxi básica d'un mètode**
Un mètode en Java té la següent estructura:

```java
    modificador_de_visibilitat tipus_de_retorn nomDelMetode(paràmetres) {
```

// Codi que s'executarà

```java
        return valor; // Opcional si el tipis de retorn és "void"
    }
```

**Exemple**

```java
    public int sumar(int a, int b) {
        return a + b;
    }
```

**Parts d'un mètode**
1. Modificador de visibilitat: defineix qui pot accedir al mètode. Els més comuns són:
- public: accessible des de qualsevol lloc.
- private: accessible només dins de la mateixa classe.
- protected: accesible dins del mateix paquet i subclasses.

- **2.** Tipus de retorn: el tipus de dada que el mètode retorna (per exemple, int, String, etc). Si no retorna res, es defineix com void.

- **3.** Nom del mètode: ha de ser descriptiu i seguir les convencions de Java (notació camelCase).

- **4.** Paràmetres: són les dades que el mètode necessita per funcionar. Es declaren dins del parèntesis.

- **5.** Cos del mètode: és el bloc de codi que conté les instruccions que s'executaran.

**Exemple pràctic**

```java
public class Calculadora {
```

// Mètode per sumar dos nombres

```java
    publuc int sumar(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        Calculadora calc = new Calculadora();
        int resultat = calc.sumar(5, 3);
        System.out.println("La suma és: " + resultat) // Output: La suma eś: 8
    }
}
```

**Tipus de métodes**
1. Mètodes sense paràmetres ni retorn:

```java
    public void mostrarMissatge() {
        System.out.println("Hola, món!";)
    }
```

- **2.** Mètodes amb paràmetres:

```java
    public void imprimirNom(String nom) {
        System.out.println("El teu nom és: " + nom);
    }
```

- **3.** Mètodes amb retorn:

```java
    public int multiplicar(int x, int y) {
        return x * y;
    }
```

- **4.** Mètodes estàtics: no necessiten una instància de la classe per ser cridats. Es declaren amb la paraula clau static:

```java
    public static void saludar() {
        System.out.println("Hola des d'un mètode estàtic!");
    }
```

**Sobrecàrrega de mètodes**
En Java, podem tenir diversos mètodes amb el mateix nom però amb diferents tipus o nombres de paràmetres. Aixo es coneix com sobrecàrrega.

```java
public class Exemple {
    public int sumar(int a, int b) {
        return a + b;
    }

    public double sumar(double a, double b) {
        return a + b;
    }
}
```

**Bonnes pràctiques amb mètodes**
1. Escriu noms clars i descriptius per als métodes.
2. Divideix les funcionalitats complexes en mètodes més petits i reutilitzables.
3. Evita fer mètodes massa llargs. Si un mètode fa massa coses, considera dividir-lo en altres mètodes més senzills.
