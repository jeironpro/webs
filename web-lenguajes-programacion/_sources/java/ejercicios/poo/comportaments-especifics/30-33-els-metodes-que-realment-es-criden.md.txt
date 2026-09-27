# Ejercicios — 30.33 — Els metodes que realment es criden

## DemoCrides

```java
class DemoCrides extends Feli {
    public static void main(String[] args) {
        Feli feli = new Feli();
        Gat gat = new Gat();
        GatRenat renat = new GatRenat();
        
        feli.netejaUrpes();
        gat.netejaUrpes();
        renat.netejaUrpes();
        gat.miola();
        renat.miola();

        Menjar menja = new Menjar("bacallà");
        renat.menja(menja);
    }
}
```

## Feli

**Enunciat**

En aquest exercici analitzaràs quins són els mètodes que es criden realment quan hi ha pel mig l'herència.

Per fer-ho, considera la definició de les següents classes:

```java
class Feli {

    public Feli() {

        System.out.println("Neix Felí");

    }

    public void netejaUrpes() {

        System.out.println("Felí neteja urpes des de " + this.getClass());

    }

    public void menja(Menjar menjar) {

        System.out.println("Felí menja " + menjar + " des de " + this.getClass());

    }

}

class Gat extends Feli {

    public Gat() {

        System.out.println("Neix Gat");

    }

    public void miola() {

        System.out.println("Gat miola des de " + this.getClass());

    }

    @Override

    public void menja(Menjar menjar) {

        System.out.println("Gat menja " + menjar + " des de " + this.getClass());

        super.menja(menjar);

    }

}

class GatRenat extends Gat {

    public GatRenat() {

        System.out.println("Neix Renat");

    }

    @Override

    public void miola() {

        System.out.println("Renat miola des de " + this.getClass());

    }

    @Override

    public void menja(Menjar menjar) {

        System.out.println("Renat menja " + menjar + " des de " + this.getClass());

        netejaUrpes();

        super.menja(menjar);

    }

}

class Menjar {

    private static final String MENJAR_PER_DEFECTE = "sardines";

    private final String nom;

    public Menjar(String nom) {

        if (nom != null && !nom.isEmpty()) {

            this.nom = nom;

        } else {

            this.nom = MENJAR_PER_DEFECTE;

        }

        System.out.println("Neix Menjar(\"" + this.nom + "\")");

    }

    public String toString() { return nom; }

}
```

Important

Aquest exercici el pots fer a base de prova-i-error i pots amagar-t'ho com un secret que ningú no ha de saber mai. Amb tot, et recomano que, si li vols treure el màxim a aquest exercici, abans d'executar una sola vegada la prova, intentis codificar totes les instruccions deduint la sortida. Quan comencis a executar la prova, si no has encertat a la primera, intenta descobrir perquè i refer el teu codi de manera que abans de provar-ho de nou pensis que està corregit.
Què haig de fer?

Crea una classe anomenada DemoCrides que, disposi d'un main() que en ser executat generi exactament el següent per sortida estàndard:

**Neix Felí**
Neix Felí
Neix Gat
Neix Felí
Neix Gat
Neix Renat
Felí neteja urpes des de class Feli
Felí neteja urpes des de class Gat
Felí neteja urpes des de class GatRenat
Gat miola des de class Gat
Renat miola des de class GatRenat
Neix Menjar("bacallà")
Renat menja bacallà des de class GatRenat
Felí neteja urpes des de class GatRenat
Gat menja bacallà des de class GatRenat
Felí menja bacallà des de class GatRenat

```java
class Feli {
    public Feli() {
        System.out.println("Neix Felí");
    }

    public void netejaUrpes() {
        System.out.println("Felí neteja urpes des de " + this.getClass());
    }

    public void menja(Menjar menjar) {
        System.out.println("Felí menja " + menjar + " des de " + this.getClass());
    }
}

class Gat extends Feli {
    public Gat() {
        System.out.println("Neix Gat");
    }

    public void miola() {
        System.out.println("Gat miola des de " + this.getClass());
    }

    @Override
    public void menja(Menjar menjar) {
        System.out.println("Gat menja " + menjar + " des de " + this.getClass());
        super.menja(menjar);
    }
}

class GatRenat extends Gat {
    public GatRenat() {
        System.out.println("Neix Renat");
    }

    @Override
    public void miola() {
        System.out.println("Renat miola des de " + this.getClass());
    }

    @Override
    public void menja(Menjar menjar) {
        System.out.println("Renat menja " + menjar + " des de " + this.getClass());
        netejaUrpes();
        super.menja(menjar);
    }
}

class Menjar {
    private static final String MENJAR_PER_DEFECTE = "sardines";
    private final String nom;
    public Menjar(String nom) {
        if (nom != null && !nom.isEmpty()) {
            this.nom = nom;
        } else {
            this.nom = MENJAR_PER_DEFECTE;
        }
        System.out.println("Neix Menjar(\"" + this.nom + "\")");
    }

    public String toString() { return nom; }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3033elsmetodesquerealmentescriden.png
:alt: Diagrama UML
```
