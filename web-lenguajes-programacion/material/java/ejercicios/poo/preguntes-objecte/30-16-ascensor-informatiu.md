# Ejercicios — 30.16 — Ascensor informatiu

## Ascensor

**Enunciat**

Afegeix al repertori de mètodes de Ascensor els següents:

esAbaix() i esAdalt() retornen cert quan l'ascensor es troba al primer i al darrer pis respectivament.

esEnMoviment() retorna cert quan està pujant o baixant.

comEsta() retorna un String amb el moviment i el pis. Per exemple, si està pujant en el pis 1, el missatge serà pujant al pis 1.

Completa la plantilla següent:

```java
public class UsaAscensor {
```

// XXX considera si et cal algun mòdul d'ajut

```java
    public static void main(String[] args) {

        Ascensor ascensor = new Ascensor();

        System.out.println("Pis inicial: " + ascensor.XXX);

        System.out.println("Moviment inicial: " + ascensor.XXX);

        System.out.println("Introdueix nou pis:");
```

// XXX llegir el nou pis de stdin i assignar-lo a l'ascensor

```java
        System.out.println("Introdueix nou moviment:");
```

// XXX llegir el nou moviment de stdin i assignar-lo a l'ascensor

```java
        System.out.println("Pis final: " + ascensor.XXX);

        System.out.println("Moviment final: " + ascensor.XXX);

        System.out.println("Estat de l'ascensor: " + ascensor.XXX);

    }

}
```

Considera la següent simulació de la sortida de UsaAscensor un cop completat:

**Pis inicial: -1**
Moviment inicial: aturat
Introdueix nou pis:
5
Introdueix nou moviment:
pujant
Pis final: 5
Moviment final: pujant
Estat de l'ascensor: pujant al pis 5

```java
public class Ascensor {
    private int pis = -1;
    private String moviment = "aturat";

    public int getPis() {
        return pis;
    }

    public void setPis(int nouPis) {
        if (nouPis >= -1 && nouPis <= 10) {
            pis = nouPis;
        }
    }

    public String getMoviment() {
        return moviment;
    }

    public void setMoviment(String nouMoviment) {
        String[] moviments = new String[] { "aturat", "pujant", "baixant" };

        for (int i = 0; i < moviments.length; i++) {
            if (moviments[i].equals(nouMoviment)) {
                moviment = nouMoviment;
            }
        }
    }

    public boolean esAbaix() {
        if (pis == -1) { return true; }
        return false;
    }

    public boolean esAdalt() {
        if (pis == 10) { return true; }
        return false;
    }

    public boolean esAturat() {
        if (moviment.equals("aturat")) { return true; }
        return false;
    }

    public boolean esEnMoviment() {
        if (esPujant() || esBaixant()) { return true; }
        return false;
    }

    public boolean esPujant() {
        if (moviment.equals("pujant")) { return true; }
        return false;
    }

    public boolean esBaixant() {
        if (moviment.equals("baixant")) { return true; }
        return false;
    }

    public String comEsta() {
        return String.format("%s al pis %d%n", moviment, pis);
    }
}
```

## UsaAscensor

```java
public class UsaAscensor {
    public static void main(String[] args) {
        Ascensor ascensor = new Ascensor();

        System.out.println("Pis inicial: " + ascensor.getPis());
        System.out.println("Moviment inicial: " + ascensor.getMoviment());
        System.out.println("Introdueix nou pis:");

        ascensor.setPis(Integer.parseInt(Entrada.readLine()));

        System.out.println("Introdueix nou moviment:");

        ascensor.setMoviment(Entrada.readLine());

        System.out.println("Pis final: " + ascensor.getPis());
        System.out.println("Moviment final: " + ascensor.getMoviment());
        System.out.println("Estat de l'ascensor: " + ascensor.comEsta());
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3016ascensorinformatiu.png
:alt: Diagrama UML
```
