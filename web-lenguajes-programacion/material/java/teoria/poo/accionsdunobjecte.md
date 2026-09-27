# Accions d'un objecte

**Accions d'un objecte**
Les accions d'un objecte són les operacions o comportaments que aquest objecte pot realitzar. Aquestes accions s'implementen com a mètodes que poden modificar l'estat intern de l'objecte o interactuar amb altres objectes.

Mentre que les preguntes a un objecte no alteren el seu estat, les accions sí que poden fer-ho.

**Exemple**

```java
public class Cotxe {
    private int velocitat;

    public Cotxe() {
        this.velocitat = 0;
    }
```

**// Acció: augmentar la velocitat**

```java
    public void accelerar(int increment) {
        velocitat += increment;
    }
```

**// Acció: frenar**

```java
    public void frenar(int decrement) {
        velocitat -= decrement;
        if (velocitat < 0) velocitat = 0;
    }
```

**// Consulta: obtenir la velocitat actual**

```java
    public int obtenirVelocitat() {
        return velocitat;
    }
}
public class Principal {
    public static void main(String[] args) {
        Cotxe cotxe = new Cotxe();

        cotxe.accelerar(50);  // Acció: canvia l'estat
        System.out.println("Velocitat: " + cotxe.obtenirVelocitat());  // 50

        cotxe.frenar(20);  // Acció: canvia l'estat
        System.out.println("Velocitat: " + cotxe.obtenirVelocitat());  // 30
    }
}
```

**Característiques de les accions**
- Estan definides com a mètodes públics (generalment).

- Sovint tenen efectes col·laterals: canvien l'estat intern de l'objecte o realitzen operacions externes (com mostrar per pantalla, escriure a fitxer, etc.).

- Reforcen el comportament que es vol modelar dins de l'objecte.

**Diferència entre accions i preguntes**
Tipus de mètode   Efecte sibre l'estat   Exemple
Pregunta          No el modifica         getNom()
Acció             Pot modificar-lo       frenar()
