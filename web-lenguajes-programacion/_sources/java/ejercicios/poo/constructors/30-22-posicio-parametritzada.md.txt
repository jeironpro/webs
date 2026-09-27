# Ejercicios — 30.22 — Posicio parametritzada

**Enunciat**

Ara ja sabem afegir paràmetres als constructors. Per exemple:

```java
public class GatRenat {

    private int vides;

    public GatRenat(int novesVides) {

        vides = novesVides;

    }

    public int getVides() { return vides; }

    @Override

    public String toString() {

        return String.format("Vides: %d", vides);

    }

    public static void main(String[] args) {

        GatRenat renat = new GatRenat(7);

        System.out.println(renat);

    }

}
```

Fes una nova versió de GatRenat de manera que funcioni el següent main():

```java
public static void main(String[] args) {
    System.out.println(new GatRenat(7, "estirat"));
}
```

Fixa't que, com que no en fem res de la instància, a banda de mostrar-la, no cal ni que la assignem a una variable!

El resultat de l'execució serà:

Vides: 7. Posició: estirat

```java
public class GatRenat {
    private int vides;
    private String posicio;

    public GatRenat(int novesVides, String novaPosicio) {
        vides = novesVides;
        posicio = novaPosicio;
    }

    public int getVides() { return vides; }
    
    public String getPosicio() { return posicio; }

    @Override
    public String toString() {
        return String.format("Vides: %d. Posició: %s", vides, posicio);
    }

    public static void main(String[] args) {
        System.out.println(new GatRenat(7, "estirat"));
    }
}
```
