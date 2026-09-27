# Ejercicios — 30.30 — Els ulls del gat Renat

## GatRenat

**Enunciat**

En aquest exercici implementarem la classe UllDeGat.

Un UllDeGat pot estar obert o tancat i ofereix els mètodes:

obret()

tancat()

boolean esObert()

A banda, ofereix dos constructors, el de per defecte que l'inicialitzarà tancat, i un d'específic que permet indicar si l'ull comença obert (true) o no.

Amplia la classe GatRenat de manera que ara tingui dos ulls.

Nota

Fes servir de base una versió de GatRenat que no sigui la d'aquest exercici

Els ulls estaran oberts o tancats depenent de la posició del gat. Si el gat està dret, tots dos ulls estaran oberts. Si està assegut, l'ull dret estarà obert i l'esquerre estarà tancat. Quan està estirat, tots dos ulls estaran tancats.

La nova versió de GatRenat oferirà els següents nous mètodes:

UllDeGat getUllDret(): retorna una còpia de l'ull dret

UllDeGat getUllEsquerre(): retorna una còpia de l'ull esquerre

Inclou aquest main() a GatRenat per provar el seu funcionament:

```java
public static void main(String[] args) {

    GatRenat renat = new GatRenat();

    UllDeGat ullDret = renat.getUllDret();

    UllDeGat ullEsquerre = renat.getUllEsquerre();

    System.out.printf("Quan està %s: %b + %b%n",
```

renat.getPosicio(),

renat.getUllDret().esObert(),

```java
            renat.getUllEsquerre().esObert());

    renat.seu();

    System.out.printf("Quan està %s: %b + %b%n",
```

renat.getPosicio(),

renat.getUllDret().esObert(),

```java
            renat.getUllEsquerre().esObert());

    renat.aixecat();

    System.out.printf("Quan està %s: %b + %b%n",
```

renat.getPosicio(),

renat.getUllDret().esObert(),

```java
            renat.getUllEsquerre().esObert());

}
```

La sortida serà:

**Quan està estirat: false + false**
Quan està assegut: true + false
Quan està dret: true + true

```java
public class GatRenat {
    private int vides;
    private String posicio;
    private UllDeGat ullDret = new UllDeGat();
    private UllDeGat ullEsquerre = new UllDeGat();

    public GatRenat() {
        this.setVides(7);
        this.setPosicio("estirat");
    }

    public GatRenat(String posicio) {
        this.setPosicio(posicio);
    }

    public UllDeGat getUllDret() {
        return new UllDeGat(this.ullDret.esObert());
    }

    public UllDeGat getUllEsquerre() {
        return new UllDeGat(this.ullEsquerre.esObert());
    }

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

        if (this.esDret()) {
            this.ullDret.obret();
            this.ullEsquerre.obret();
        }

        if (this.esAssegut()) {
            this.ullDret.obret();
            this.ullEsquerre.tancat();
        }

        if (this.esEstirat()) {
            this.ullDret.tancat();
            this.ullEsquerre.tancat();
        }
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

    public static void main(String[] args) {
        GatRenat renat = new GatRenat();
        UllDeGat ullDret = renat.getUllDret();
        UllDeGat ullEsquerre = renat.getUllEsquerre();
    
        System.out.printf("Quan està %s: %b + %b%n",
                renat.getPosicio(),
                renat.getUllDret().esObert(),
                renat.getUllEsquerre().esObert());
    
        renat.seu();
    
        System.out.printf("Quan està %s: %b + %b%n",
                renat.getPosicio(),
                renat.getUllDret().esObert(),
                renat.getUllEsquerre().esObert());

        renat.aixecat();

        System.out.printf("Quan està %s: %b + %b%n",
                renat.getPosicio(),
                renat.getUllDret().esObert(),
                renat.getUllEsquerre().esObert());
    }
}
```

## UllDeGat

```java
public class UllDeGat {
    private boolean ullObert;

    public UllDeGat() {
        this.ullObert = false;
    }

    public UllDeGat(boolean obert) {
        this.ullObert = obert;
    }

    public void obret() {
        this.ullObert = true;
    }

    public void tancat() {
        this.ullObert = false;
    }

    public boolean esObert() {
        return ullObert;
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3030elsullsdelgatrenat.png
:alt: Diagrama UML
```
