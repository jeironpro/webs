# Propietats públiques

**Propietats Publiques**
Les propietats públiques en Java són les variables d'instància d'una classe que tenen el modificador d'accés public, la qual cosa significa que poden ser accedides directament des de qualsevol classe o mètode fora de la classe que les conté.

**Visibilitat**
- Les propietats públiques són accessibles des de qualsevol altre codi, sense restriccions.

- Això permet que qualsevol altre objecte o classe interactuï directament amb aquestes propietats, sense necessitat d'utilitzar mètodes especials com getters i setters.

**Exemple**

```java
public class Cotxe {
    public String marca;  // Propietat pública
    public int velocitat;  // Propietat pública

    public Cotxe(String marca, int velocitat) {
        this.marca = marca;
        this.velocitat = velocitat;
    }
}

public class Principal {
    public static void main(String[] args) {
        Cotxe cotxe1 = new Cotxe("Toyota", 100);
```

**// Accés directe a la propietat pública**

```java
        System.out.println("Marca del cotxe: " + cotxe1.marca);  // Toyota
        System.out.println("Velocitat del cotxe: " + cotxe1.velocitat);  // 100
```

**// Modificació directa de les propietats públiques**

```java
        cotxe1.marca = "Honda";
        cotxe1.velocitat = 120;

        System.out.println("Marca del cotxe després de modificar: " + cotxe1.marca);  // Honda
        System.out.println("Velocitat del cotxe després de modificar: " + cotxe1.velocitat);  // 120
    }
}
```

En aquest cas, les propietats marca i velocitat són publiques:
- Es piden accedir i modificar directament des de qualsevol classe, incloent la classe Principal.

- No és necessari utilitzar mètodes com getters o setters per modificar els valors de les propietats.

**Característiques de les propietats públiques**
1. Accés directe: les propietats públiques poden ser accedides i modificades sense cap control, cosa que fa que siguin simples d'utilitzar en situacions on no es necessiti una gestió especial de l'estat.

- **2.** Riscos d'encapsulament: exposar les propietats de manera pública pot violar l'encapsulament, ja que qualsevol part del codi pot modificar el valor d'aquestes propietats, inclús quan no es vol.

- **3.** Ús limitat: es recomena utilitzar propietats públiques amb precaució. Sovint és millor utilitzar modificadors d'accés més restringits (com private) i proporcionar mètodes d'accés controlat (com getters i setters) per protegir l'estat intern de l'objecte.

**Millor pràctica**
És habitual utilitzar propietats públiques només en casos on no és necessari amagar l'estat de l'objecte, o en classes molt simples. En la majoria de les situacions, és millor mantenir les propietat privades i exposar-les a través de mètodes controlats.
