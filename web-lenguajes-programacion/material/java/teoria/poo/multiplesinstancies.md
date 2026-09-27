# Múltiples instàncies

**Multiples Instancies**
Una instància és una còpia d'una classe que es crea quan cridem el constructor de la classe. Cada vegada que creem un objecte a partir d'una classe, estem creant una instància d'aquesta classe.

**Multiple instantiation**
Multiples instàncies fa referencia a la creació de diversos objectes independents a partir de la mateixa classe, cada un amb les seves pròpies propietats i comportaments.

**Exemple**
La classe Cotxe:

```java
public class Cotxe {
    String marca;
    int velocitat;

    public Cotxe(String marca, int velocitat) {
        this.marca = marca;
        this.velocitat = velocitat;
    }

    public void accelerar(int increment) {
        velocitat += increment;
    }

    public void mostrarVelocitat() {
        System.out.println("Velocitat: " + velocitat);
    }
}
```

Ara, crearem dues instàncies d'aquesta classe en el mètode main:

```java
public class Principal {
    public static void main(String[] args) {
```

// Crear múltiples instàncies de la classe Cotxe

```java
        Cotxe cotxe1 = new Cotxe("Ford", 0);
        Cotxe cotxe2 = new Cotxe("Toyota", 10);

        cotxe1.accelerar(30);
        cotxe2.accelerar(20);

        cotxe1.mostrarVelocitat(); // Output: Velocitat: 30
        cotxe2.mostrarVelocitat(); // Output: Velocitat: 30
    }
}
```

**En aquest cas, hem creat dues instàncies del Cotxe**
- cotxe1 té una marca Ford i velocitat inicial de 0.
- cotxe2 té una marca Toyota i velocitat inicial de 10.

Amb aquestes instàncies, cada objecte té el seu propi estat (les seves pròpies propietats) i, per tant, pot tenir valors diferents per a les mateixes propietats.

**Característiques de les múltiples instàncies**
1. Independència: cada instància és independent i pot tenir valors diferents per a les seves propietats.

- **2.** Compartició de comportament: totes les instàncies d'una classe comparteixen els mateixos mètodes (comportaments), però cada instància pot tenir un estat diferent.

- **3.** Creació d'objectes: les instàncies es creen mitjançant el constructor de la classe.

**Exemple visual de múltiples instàncies**
Si penses en la classe Cotxe, cada cop que crides al constructor new Cotxe(), estàs creant una nova instància de Cotxe:
- Una instància seria un cotxe individual amb les seves pròpies propietats, com marca, velocitat, etc.

- Podries tenir molts objectes Cotxe, i cada un tindria les seves pròpies propietats (potser el cotxe1 és vermell i el cotxe2 és blau).
