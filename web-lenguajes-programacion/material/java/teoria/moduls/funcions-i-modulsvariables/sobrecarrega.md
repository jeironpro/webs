# Sobrecarrega

**Sobrecàrrega**
La sobrecàrrega de funcions (o mètodes sobrecarregats) és una característica de Java que permet definir múltiples mètodes amb el mateix nom dins d'una classe, però amb diferents paràmetres (en nombre, tipus o ordre).

**Regles de la sobrecàrrega**
Un mètode es pot sobrecarregar si:
1- Té el mateix nom que un altre mètode.
2- Té diferents paràmetres (en quantitat, tipus o ordre).
3- Pot tenir un tipus de retorn diferent, però això sol no és suficient per sobrecarregar un mètode.

Nota important: no pots sobrecarregar un mètode només canviant el tipus de retorn (cal modificar els paràmetres).

**Exemple bàsic de sobrecàrrega**

```java
public class Calculadora {
```

// Mètode sumar amb 2 enters

```java
    public static int sumar(int a, int b) {
        return a + b;
    }
```

**// Sobrecàrrega: mètode sumar amb 3 enters**

```java
    public static int sumar(int a, int b, int c) {
        return a + b + c;
    }
```

**// Sobrecàrrega: mètode sumar amb decimals**

```java
    public static double sumar(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(sumar(5, 3)); // Sortida: 8
        System.out.println(sumar(5, 3, 2)); // Sortida: 10
        System.out.println(sumar(5.5, 3.2)); // Sortida: 8.7
    }
}
```

En aquest exemple, el compilador triarà automàticament quin mètode cridar en funció dels arguments passats.

**Sobrecàrrega canviant l'ordre dels paràmetres**
També es pot sobrecarregar un mètode canviant l'ordre dels paràmetres, fins i tot si tenen el mateix tipus.

```java
public class Exemple {
    public static void mostrar(String text, int num) {
        System.out.println("Text: " + text + ", Número: " + num);
    }
```

**// Sobrecàrrega canviant l'ordre dels paràmetres**

```java
    public static void mostrar(int num, String text) {
        System.out.println("Número: " + num + ", Text: " + text);
    }
}
```

El compilador distingeix quin mètode cridar segons l'ordre dels paràmetres.

**Sobrecàrrega i tipus de retorn (No és suficient)**
Encara que pots canviar el tipus de retorn en una sobrecàrrega, això no és suficient per distingir dos mètodes.

**Aquest codi dona error**

```java
public class exemple {
```

// Primer mètode

```java
    public static int calcular(int x) {
        return x * 2;
    }
```

**// Error! No es pot diferencias nómes pel tipus de retorn**

```java
    public static double calcular(int x) {
        return x * 2.5;
    }

    public static void main(String[] args) {
        System.out.println(calcular(5));
    }
}
```

Error: calcular(int) ja està definit en la classe Exemple.
El compilador no pot distingir els mètodes només pel tipus de retorn.

**Solució correcta: canviar els paràmetres**

```java
public class Exemple {
    public static int calcular(int x) {
        return x * 2;
    }

    public static double calcular(double x) {
        return x * 2.5;
    }

    public static void main(String[] args) {
        System.out.println(calcular(5));    // Crida calcular(int) -> Sortida: 10
        System.out.println(calcular(5.0));  // Crida calcular(double) -> Sortida: 12.5
    }
}
```

Ara funciona perquè els tipus de paràmetres són diferents (int i double).

**Sobrecàrrega en constructors**
Els constructors també es poden sobrecarregar per permetre crear objectes de diferents formes.

**Exemple**

```java
class Persona {
    String nom;
    int edat;
```

**// Constructor 1: Només nom**

```java
    public Persona(String nom) {
        this.nom = nom;
        this.edat = 0;  // Per defecte
    }
```

**// Constructor 2: Nom i edat**

```java
    public Persona(String nom, int edat) {
        this.nom = nom;
        this.edat = edat;
    }

    public void mostrar() {
        System.out.println("Nom: " + nom + ", Edat: " + edat);
    }
}

public class Exemple {
    public static void main(String[] args) {
        Persona p1 = new Persona("Anna");
        Persona p2 = new Persona("Joan", 25);

        p1.mostrar();  // Sortida: Nom: Anna, Edat: 0
        p2.mostrar();  // Sortida: Nom: Joan, Edat: 25
    }
}
```

Aquí, la classe Persona té dos constructor sobrecarregats, permetent crear objectes de maneres diferents.

Diferència entre sobrecàrrega (Overloading) i sobreescriptura (overriding)

Caracterìstica        |Sobrecàrrega (overloading)   |Sobreescriptura (Overriding)
On es fa?             |Dins de la mateixa classe    |En una subclasse
Nom del mètode        |El mateix                    |Els mateix
Tipus de paràmetres   |Diferents                    |Els mateixos
Tipus de retorn       |Pot ser diferent             |Ha de ser igual o compatible

```java
@override             |No necessari                 |Necessari
```

**Exemple de overriding**

```java
class Animal {
    public void ferSo() {
        System.out.println("L'animal fa un so.");
    }
}

class Gos extends Animal {
    @Override
    public void ferSo() {
        System.out.println("El gos borda.");
    }
}

public class Exemple {
    public static void main(String[] args) {
        Animal a = new Gos();
        a.ferSo();  // Sortida: El gos borda.
    }
}
```

**Notes**
- La sobrecàrrega de mètodes permet tenir múltiples versions d’un mètode amb el mateix nom però diferents paràmetres.
- No es pot sobrecarregar un mètode només canviant el tipus de retorn.
- També es pot aplicar als constructors per permetre diverses formes de creació d’objectes.
- És diferent de la sobreescriptura (@Override), que s’utilitza en herència.
