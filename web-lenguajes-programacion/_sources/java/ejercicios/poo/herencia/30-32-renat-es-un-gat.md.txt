# Ejercicios — 30.32 — Renat es un Gat

## Gat

**Enunciat**

Implementa una nova versió del gat Renat, que disposarà de funcionalitats com les implementades a exercicis previs com ara el del Renat ensinistrat.

En aquesta ocasió, però, faràs que GatRenat sigui una subclasse de Gat.

A l'hora de codificar les dues classes, tingues present que:

Gat només definirà els accessors de vides i posició.

GatRenat ja no definirà els accessors de vides ni de posició. Tampoc no definirà cap atribut. Per tant, aquells mètodes que requereixin accés a les propietats hauran de utilitzar els accessors heredats de Gat.

Fes servir el main() a UsaGatRenat per comprovar que aquesta redistribució de membres funciona com abans:

```java
public static void main(String[] args) {

    GatRenat renat = new GatRenat();

    System.out.println("El Renat diu: "+ renat.aixecat());

    System.out.println("El Renat diu: "+ renat.seu());

    System.out.println("El Renat diu: "+ renat.estirat());

    System.out.println("El Renat diu: "+ renat.estirat());

}
```

La sortida haurà de ser:

**El Renat diu: ja m'aixeco**
El Renat diu: ja m'assec
El Renat diu: ja m'estiro
El Renat diu: passo de fer res

```java
public class Gat {
    private int vides = 7;
    private String posicio = "estirat";

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
}
```

## GatRenat

```java
public class GatRenat extends Gat {
    public boolean esViu() {
        if (getVides() > 0) { return true; }
        return false;
    }

    public boolean esDret() {
        if (getPosicio().equals("dret")) { return true; }
        return false;
    }

    public boolean esAssegut() {
        if (getPosicio().equals("assegut")) { return true; }
        return false;
    }

    public boolean esEstirat() {
        if (getPosicio().equals("estirat")) { return true; }
        return false;
    }

    public String aixecat() {
        if (esDret()) { return "passo de fer res"; }
        setPosicio("dret");
        return "ja m'aixeco";
    }

    public String seu() {
        if (esAssegut()) { return "passo de fer res"; }
        setPosicio("assegut");
        return "ja m'assec";
    }

    public String estirat() {
        if (esEstirat()) { return "passo de fer res"; }
        setPosicio("estirat");
        return "ja m'estiro";
    }
}
```

## UsaGatRenat

```java
public class UsaGatRenat {
    public static void main(String[] args) {
        GatRenat renat = new GatRenat();
        System.out.println("El Renat diu: "+ renat.aixecat());
        System.out.println("El Renat diu: "+ renat.seu());
        System.out.println("El Renat diu: "+ renat.estirat());
        System.out.println("El Renat diu: "+ renat.estirat());
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3032renatesungat.png
:alt: Diagrama UML
```
