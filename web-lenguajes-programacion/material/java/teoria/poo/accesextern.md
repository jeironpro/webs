# Accés extern

**AccesExtern**
L'accés extern es refereix a la capacitat d'accedir a les propietats i mètodes d'un objecte des d'una altra classe o des d'un altre lloc fora de la seva classe.

En Java, aquest accés està controlat per mitjà dels modificadors d'acces. Aquests modificadors defineixen qui pot accedir a les propietats i mètodes d'una classe. Els modificadors d'accés més comuns són:
- private: només accessible des de la mateixa classe.
- public: accessible des de qualsevol lloc.
- protected: accessible des de la mateixa classe, subclasses o classes dins del mateix paquet.
- default (sense modificador): accessible només dins del mateix paquet.

**Exemple**
Classes Cotxe i ProvaAcces

```java
public class Cotxe {
    public String marca;  // Accessible des de qualsevol lloc
    private int velocitat;  // Accessible només dins de la classe Cotxe

    public Cotxe(String marca, int velocitat) {
        this.marca = marca;
        this.velocitat = velocitat;
    }
```

**// Mètode per obtenir la velocitat (accés controlat)**

```java
    public int obtenirVelocitat() {
        return velocitat;
    }
```

**// Mètode per establir la velocitat**

```java
    public void establirVelocitat(int velocitat) {
        this.velocitat = velocitat;
    }
}

public class ProvaAcces {
    public static void main(String[] args) {
        Cotxe cotxe1 = new Cotxe("Ford", 50);
```

**// Accés a la propietat pública**

```java
        System.out.println(cotxe1.marca);  // Ford
```

**// No es pot accedir directament a la propietat privada**
// System.out.println(cotxe1.velocitat);  // Error!

// Es pot accedir a la velocitat mitjançant el mètode públic

```java
        System.out.println(cotxe1.obtenirVelocitat());  // 50

        cotxe1.establirVelocitat(60);  // Modifiquem la velocitat
        System.out.println(cotxe1.obtenirVelocitat());  // 60
    }
}
```

**En aquest cas**
- marca és pública, per tant, es pot accedir directament des de qualsevol lloc (per exemple, des de la classe ProvaAcces).

- velocitat és privada, aixì que no es pot accedir directament des de fora de la classe Cotxe. Però sí que es pot accedir a ella mitjançant el mètode públic obtenirVelocitat() o modificar-la amb establirVelocitat().

**Característiques de l'accés extern**
1. Encapsulament: els modificadors d'acces controlen l'encapsulament, el qual permet amagar la implementació interna d'una classe i exposar només el necessari. Això fa que el codi sigui més segur i fàcil de mantenir.

- **2.** Accés controlat: utilitzant modificadors com private o protected, es pot protegir l'estat intern de l'objecte i evitar que altres parts del codi modifiquin el seu comportament inesperadament.

- **3.** Mètodes públics: els mètodes públics són una manera d'exposar funcionalitats controlades per permetre l'acces a les propietats internes sense exposar-les directament.
