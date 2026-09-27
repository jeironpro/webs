# Propietats

**Propietats**
Les propietats (també conegudes com a atributs o camp variables) sób variables declarades dins d'una classe que representen l'estat de l'objecte.

Cada objecte té la seva pròpia còpia de les propietats, i aquestes poden tenir diferents valors per a cada instància.

**Exemple**

```java
public class Cotxe {
    String marca;
    int velocitat;
}
```

Aquí, marca i velocitat són propietats de la classe Cotxe.

**Característiques importants**
- Pertenyen a l'objecte, no al mètode
- Es poden declarar amb diferents modificadors d'acces (public, private, protected).
- Es poden inicialitzar per defecte o mitjançant un constructor.
- Es poden accedir i modificar mitjançant getters i setters (encapsulament).

**Modificadors d'accès (introducció)**
Modificador    Accés des de

```java
private        Només dins de la mateixa classe
public         Des de qualsevol lloc
protected      Des de la mateixa classe o subclasse
```

**Exmple**

```java
public class Cotxe {
    String marca;
    int any;

    public Cotxe(String m, int a) {
        marca = m;
        any = a;
    }
}
```

Cada cop que crees un nou Cotxe, les propietats marca i any es poden inicialitzar amb valors diferents.
