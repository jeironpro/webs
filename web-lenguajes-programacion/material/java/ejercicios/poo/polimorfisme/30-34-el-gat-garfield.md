# Ejercicios — 30.34 — El gat Garfield

## Garfield

```java
class Garfield extends Gat {
    public Garfield() {
        super("Garfield", 9, "estirat");
    }

    @Override
    public String aixecat() {
        if (esDret()) { return "passo de fer res"; }

        if (esAssegut()) {
            setPosicio("dret");
            return "ja m'aixeco";
        }
        return "Bai Maitea, bai";
    }

    @Override
    public String seu() {
        if (esAssegut()) { return "passo de fer res"; }
        setPosicio("assegut");
        return "ja m'assec";
    }

    @Override
    public String estirat() {
        if (esEstirat()) { return "passo de fer res"; }

        if (esAssegut()) {
            setPosicio("estirat");
            return "ja m'estiro";
        }
        return "Bai Maitea, bai";
    }
}
```

## Gat

**Enunciat**

En aquest exercici implementarem un nou gat, l'amic Garfield.

Per poder-ho encabir en el nostre ecosistema de gats, ens tocarà fer alguns canvis.

Un dels primers canvis és els gats hauran de disposar d'un nom. El nom es guardarà en la propietat nom i definirem Gat de manera que no pugui instanciar-se sense nom.

Donat que el nom, un cop nascut el gat, no canviarà:

caldrà què sigui un requeriment de tots els constructors

no s'oferirà cap setter

la propietat que contindrà el nom podria ser declarada com a final

El nom d'un gat cal que sigui no null, ni buit ni blanc. En cas que el nom que se li assigna al gat no sigui vàlid, el gat passarà a dir-se "anònim".

Els gats podran especificar en el seu naixement, a banda del requerit nom, les vides o/i la posició inicial.

Per altra banda, tenim que el GatRenat continuarà sent un Gat. En aquest cas, però, ja sabem el nom de tots els gats Renat, oi? Per tant, els seus constructors no demanaran nom.

En Garfield és, per descomptat, un Gat i en totes les seves instàncies es diu "Garfield". Es tracta d'un gat també molt especial. En Garfield, a diferència del Renat, i de fet, de la majoria dels gats, neix sempre amb 9 vides i mai no pot tenir més de 9 vides ni el seu nombre de vides no ser vàlid per qualsevol altre gat. Tampoc no pot néixer d'una altra manera que no sigui estirat. Per altra banda, les ordres d'ensinistrament no són tan flexibles com les de la resta dels gats. Així, només pot aixecar-se o estirar-se si estava assegut, mentre que pot seure sempre i quant no estigués ja assegut. El mètode heretat setPosicio() però, podrà canviar la posició sense restriccions.

Com que ens hem adonat que els serveis que antigament oferien el Gat Renat (aixecar-se, seure, etc), ara són requerits pel Garfield com, de fet, per tots els gats, mourem la responsabilitat d'aquest comportament a la superclasse comuna, Gat.

Per provar aquest codi, farem servir la classe UsaGats amb el següent main():

```java
public static void main(String[] args) {

    Gat[] gats = new Gat[] {
```

new Gat("Misifú"),

new GatRenat(),

new Garfield()

```java
    };

    for (Gat gat: gats) {

        System.out.println("Entrenant el gat " + gat.getNom());

        System.out.println(gat.getNom() + " diu: "+ gat.seu());

        System.out.println(gat.getNom() + " diu: "+ gat.aixecat());

        System.out.println(gat.getNom() + " diu: "+ gat.aixecat());

        System.out.println(gat.getNom() + " diu: "+ gat.estirat());

        System.out.println();

    }

}
```

La sortida esperada és:

**Entrenant el gat Misifú**
Misifú diu: ja m'assec
Misifú diu: ja m'aixeco
Misifú diu: passo de fer res
Misifú diu: ja m'estiro

**Entrenant el gat Renat**
Renat diu: ja m'assec
Renat diu: ja m'aixeco
Renat diu: passo de fer res
Renat diu: ja m'estiro

**Entrenant el gat Garfield**
Garfield diu: ja m'assec
Garfield diu: ja m'aixeco
Garfield diu: passo de fer res
Garfield diu: Bai Maitea, bai

Important

Per passar totes les proves, caldrà que totes les classes siguin marcades com public.

```java
class Gat {
    private int vides;
    private String posicio;
    private final String NOM;

    public Gat(String nom) {
        if (nom != null && !nom.isBlank()) {
            this.NOM = nom;
        } else {
            this.NOM = "anònim";
        }
        this.setVides(7);
        this.setPosicio("estirat");
    }

    public Gat(String nom, int vides) {
        if (nom != null && !nom.isBlank()) {
            this.NOM = nom;
        } else {
            this.NOM = "anònim";
        }
        this.setVides(vides);
        this.setPosicio("estirat");
    }

    public Gat(String nom, String posicio) {
        if (nom != null && !nom.isBlank()) {
            this.NOM = nom;
        } else {
            this.NOM = "anònim";
        }
        this.setVides(7);
        this.setPosicio(posicio);
    }

    public Gat(String nom, int vides, String posicio) {
        if (nom != null && !nom.isBlank()) {
            this.NOM = nom;
        } else {
            this.NOM = "anònim";
        }
        this.setVides(vides);
        this.setPosicio(posicio);
    }

    public String getNom() { return this.NOM; }

    public int getVides() { return this.vides; }

    public void setVides(int vides) {
        if (vides >= 0 && vides <= 9) {
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

## GatRenat

```java
class GatRenat extends Gat {
    public GatRenat() {
        super("Renat", 7, "estirat");
    }

    public GatRenat(int vides) {
        super("Renat", vides, "estirat");
    }

    public GatRenat(String posicio) {
        super("Renat", 7, posicio);
    }

    public GatRenat(int vides, String posicio) {
        super("Renat", vides, posicio);
    }
}
```

## UsaGats

```java
public class UsaGats {
    public static void main(String[] args) {
        Gat[] gats = new Gat[] {
            new Gat("Misifú"),
            new GatRenat(),
            new Garfield()
        };

        for (Gat gat: gats) {
            System.out.println("Entrenant el gat " + gat.getNom());
            System.out.println(gat.getNom() + " diu: "+ gat.seu());
            System.out.println(gat.getNom() + " diu: "+ gat.aixecat());
            System.out.println(gat.getNom() + " diu: "+ gat.aixecat());
            System.out.println(gat.getNom() + " diu: "+ gat.estirat());
            System.out.println();
        }
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3034elgatgarfield.png
:alt: Diagrama UML
```
