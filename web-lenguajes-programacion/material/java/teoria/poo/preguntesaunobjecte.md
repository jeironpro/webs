# Preguntes a un objecte

**Preguntes a un objecte**
Fer preguntes a un objecte vol dir obtenir informació del seu estat intern o característiques, sense modificar-lo. En Java, això es fa habitualment mitjançant mètodes d'accés, també coneguts com a getters o consultors.

Aquest concepte és part del principi de encapsulament, on es manté l'estat d'un objecte amagat i es proporciona accés mitjançant mètodes.

**Exemple**

```java
public class Cotxe {
    private String marca;
    private int velocitat;

    public Cotxe(String marca, int velocitat) {
        this.marca = marca;
        this.velocitat = velocitat;
    }
```

**// Mètodes per fer preguntes a l'objecte**

```java
    public String obtenirMarca() {
        return marca;
    }

    public int obtenirVelocitat() {
        return velocitat;
    }

    public boolean esRapid() {
        return velocitat > 120;
    }
}
```

**I en una altra classe**

```java
public class Principal {
    public static void main(String[] args) {
        Cotxe c = new Cotxe("BMW", 150);
```

**// Preguntes a l'objecte**

```java
        System.out.println("Marca: " + c.obtenirMarca());  // BMW
        System.out.println("Velocitat: " + c.obtenirVelocitat());  // 150
        System.out.println("És ràpid? " + c.esRapid());  // true
    }
}
```

**Bones pràctiques**
- Les preguntes no han de modificar l'estat de l'objecte.

- Sempre que es necessiti accedir a una propietat privada o protegida, s'hauria de fer amb mètodes consultors.

- Els mètdes consultors solen començar amb verbs como get, is, has, obtenir, etc.

**Per què és important**
1. Encapsulament: permet accedir a les dades de manera controlada.

- **2.** Claredat semàntica: diferencia clarament entre mètodes que consulten i mètodes que modifiquen.

- **3.** Separació d'interessos: manté el codi net i més fàcil de mantenir.
