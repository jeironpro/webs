# Ejercicios — 30.23 — Posicio protegida en neixer

**Enunciat**

Pren com a referència la següent versió del Gat Renat i l'exercici anterior:

```java
public class GatRenat {

    private int vides = 7;

    public GatRenat(int vides) {

        setVides(vides);

    }

    public int getVides() { return vides; }

    public void setVides(int novesVides) {

        if (novesVides >= 0)  {

            vides = novesVides;

        }

    }

    @Override

    public String toString() { return String.format("Vides: %d", vides); }

    public static void main(String[] args) {

        System.out.println(new GatRenat(7));

    }

}
```

Implementa una nova versió que ofereixi la inicialització del gat Renat amb la posició indicada. En cas que la posició que rebi el constructor no sigui vàlida, el gat Renat resultant estarà en la seva posició favorita, estirat.

Afegeix el següent main() per comprovar que funciona correctament

```java
    public static void main(String[] args) {

        System.out.println(new GatRenat(7, "dret"));

    }

public class GatRenat {
    private int vides = 7;
    private String posicio = "estirat";

    public GatRenat(int novesVides, String novaPosicio) {
        setVides(novesVides);
        setPosicio(novaPosicio);
    }

    public int getVides() { return vides; }

    public void setVides(int novesVides) {
        if (novesVides >= 0) {
            vides = novesVides;
        }
    }
    
    public String getPosicio() { return posicio; }

    public void setPosicio(String novaPosicio) {
        String[] posicions = new String[] { "dret", "assegut", "estirat" };

        for (int i = 0; i < posicions.length; i++) {
            if (posicions[i].equals(novaPosicio)) {
                posicio = novaPosicio;
            }
        }
    }

    @Override
    public String toString() {
        return String.format("Vides: %d. Posició: %s", vides, posicio);
    }

    public static void main(String[] args) {
        System.out.println(new GatRenat(7, "estirat"));
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3023posicioprotegidaenneixer.png
:alt: Diagrama UML
```
