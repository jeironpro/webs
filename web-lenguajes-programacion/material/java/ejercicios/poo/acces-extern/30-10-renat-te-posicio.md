# Ejercicios — 30.10 — Renat te posicio

## GatRenat

**Enunciat**

Fins ara disposem de la classe GatRenat amb la següent definició:

```java
public class GatRenat {

    int vides = 7;         // vides disponibles del gat Renat

}
```

En aquesta ocasió afegirem al nostre gat Renat la possibilitat d'indicar en quina posició es troba. En concret, podrà estar dret, assegut o estirat.

Modifica la definició de la seva classe perquè pugui guardar aquesta informació, fent que inicialment el gat estigui estirat.

La informació de l'estat la guardarem en una propietat amb el nom posicio que serà de tipus String.

Considera la següent plantilla:

/* XXX

```java
/*  public class UsaGatRenat {

    /* public static void main(String[] args) {

        /* XXX */

        /* System.out.println("Vides inicials: " + renat.vides);

        System.out.println("Posició inicial: " + renat.XXX);

        /* XXX */

        /* System.out.println("Posició final: " + renat.XXX);

    }

}

El programa, en ser executat, mostrarà la següent sortida:

Vides inicials: 7
Posició inicial: estirat
Posició final: assegut
*/

public class GatRenat {
    int vides = 7;
    String posicio = "estirat";
}
```

## UsaGatRenat

```java
public class UsaGatRenat {
    public static void main(String[] args) {
        GatRenat renat = new GatRenat();

        System.out.printf("Vides inicial: %d%n", renat.vides);
        System.out.printf("Posició inicial: %s%n", renat.posicio);
        renat.posicio = "assegut";
        System.out.printf("Posició final: %s%n", renat.posicio);
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3010renatteposicio.png
:alt: Diagrama UML
```
