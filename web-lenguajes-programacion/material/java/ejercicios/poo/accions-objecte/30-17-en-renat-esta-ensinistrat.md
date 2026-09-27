# Ejercicios — 30.17 — En Renat esta ensinistrat

## GatRenat

**Enunciat**

Torna a considerar els nous mètodes del gat Renat:

Afegeix tres nous mètodes: String aixecat(), String seu(), i String estirat() de manera que quan vulguem, per exemple, que en Renat s'aixequi simplement li diguem renat.aixecat();.

En cas que el Renat ja estigués en l'estat que se li demana, no fa cap canvi d'estat.

Aquestes funcions retornaran un missatge indicant el que ha fet el Renat. Així, els missatges que ens retornarà seran: "ja m'estiro", "ja m'assec", "ja m'aixeco", i "passo de fer res".

Atenció: els nous mètodes no han d'escriure res per sortida estàndard!

Fes servir el main() a UsaGatRenat per demostrar el funcionament d'aquests nous mètodes.

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
public class GatRenat {
    private int vides = 7;
    private String posicio = "estirat";

    public int getVides() {
        return vides;
    }

    public void setVides(int novesVides) {
        if (novesVides >= 0) {
            vides = novesVides;
        }
    }

    public String getPosicio() {
        return posicio;
    }

    public void setPosicio(String novaPosicio) {
        String[] posicions = new String[] { "dret", "assegut", "estirat" };

        for (int i = 0; i < posicions.length; i++) {
            if (posicions[i].equals(novaPosicio)) {
                posicio = novaPosicio;
            }
        }
    }

    public boolean esViu() {
        if (vides > 0) { return true; }
        return false;
    }

    public boolean esDret() {
        if (posicio.equals("dret")) { return true; }
        return false;
    }

    public boolean esAssegut() {
        if (posicio.equals("assegut")) { return true; }
        return false;
    }

    public boolean esEstirat() {
        if (posicio.equals("estirat")) { return true; }
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

```{image} /_static/uml/uml-3017enrenatestaensinistrat.png
:alt: Diagrama UML
```
