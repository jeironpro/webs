# Ejercicios — 30.25 — Molts constructors

**Enunciat**

Posem en pràctica la possibilitat d'afegir més d'un constructor al nostre amic Renat. En concret, ens interessarà permetre crear instàncies de les següents maneres:

```java
public static void main(String[] args) {

    GatRenat[] renats = {
```

new GatRenat(),         // tot per defecte

new GatRenat(8),        // 8 vides i posició per defecte

new GatRenat("dret"),   // posició dret i vides per defecte

new GatRenat(8, "dret") // 8 vides i posició dret

```java
    };

    for (GatRenat renat: renats) {

        System.out.println(renat);

    }

}
```

Executant el codi resultant ens trobarem:

**Vides: 7. Posició: estirat**
Vides: 8. Posició: estirat
Vides: 7. Posició: dret
Vides: 8. Posició: dret

Vols fer-ho molt modulat? Implementa-ho de manera que tots els constructors excepte un facin ús de this(), i que el que no fa ús de this(), fa us dels setters.

```java
public class GatRenat {
    private int vides = 7;
    private String posicio = "estirat";

    public GatRenat() {
        this(7, "estirat");
    }

    public GatRenat(int vides) {
        this(vides, "estirat");

    }

    public GatRenat(String posicio) {
        this(7, posicio);
    }

    public GatRenat(int vides, String posicio) {
        this.setVides(vides);
        this.setPosicio(posicio);
    }

    public int getVides() { return this.vides; }

    public void setVides(int vides) {
        if (vides >= 0) {
            this.vides = vides;
        }
    }
    
    public String getPosicio() { return this.posicio; }

    public void setPosicio(String posicio) {
        String[] posicions = new String[] { "dret", "assegut", "estirat" };

        for (int i = 0; i < posicions.length; i++) {
            if (posicions[i].equals(posicio)) {
                this.posicio = posicio;
            }
        }
    }

    @Override
    public String toString() {
        return String.format("Vides: %d. Posició: %s", this.vides, this.posicio);
    }

    public static void main(String[] args) {
        GatRenat[] renats = {
            new GatRenat(),
            new GatRenat(8),
            new GatRenat("dret"),
            new GatRenat(8, "dret")
        };
    
        for (GatRenat renat: renats) {
            System.out.println(renat);
        }
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3025moltsconstructors.png
:alt: Diagrama UML
```
