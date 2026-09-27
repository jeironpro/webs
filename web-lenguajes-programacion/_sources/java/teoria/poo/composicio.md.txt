# Composicio

**Composició**
La composició és un principi fonamental de la POO que consisteix en construir objectes complexos utilitzant altres objectes com a parts.

En lloc de crear grans jerarquies d'herència, la composició permet que una classe tingui instàncies d'altres classes com a atributs. Això permet reutilitzar funcionalitats i mantenir el codi modular i clar.

Es pot resumir com: "Un objecte té un altre objecte".

**Exemple**

```java
public class Motor {
    private int cavalls;

    public Motor(int cavalls) {
        this.cavalls = cavalls;
    }

    public int obtenirCavalls() {
        return cavalls;
    }
}
public class Cotxe {
    private String marca;
    private Motor motor;  // Composició: Cotxe té un Motor

    public Cotxe(String marca, Motor motor) {
        this.marca = marca;
        this.motor = motor;
    }

    public void mostrarInformacio() {
        System.out.println("Cotxe: " + marca + ", cavalls: " + motor.obtenirCavalls());
    }
}
public class Principal {
    public static void main(String[] args) {
        Motor m = new Motor(150);
        Cotxe c = new Cotxe("BMW", m);
        c.mostrarInformacio();  // Cotxe: BMW, cavalls: 150
    }
}
```

**Beneficis de la composició**
Característica            Composició                Herència
Relació                   "Té un"                   "És un"
Flexibilitat               Alta                     Més rígida
Reutilització de codi      Sí                       Sí
Dependència                Baixa (menys coupling)   Alta (fortament acoblada)
Exemple                    Cotxe té un Motor        Cotxe és un Vehicle
