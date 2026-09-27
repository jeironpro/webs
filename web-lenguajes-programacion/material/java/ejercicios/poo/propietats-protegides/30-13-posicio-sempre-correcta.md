# Ejercicios — 30.13 — Posicio sempre correcta

## GatRenat

**Enunciat**

En aquest exercici, torna a afegir la propietat posicio que vas incorporar a l'exercici Renat té posició. En aquesta ocasió, fes la propietat privada i implementa els accessors de manera que garanteixis que la posició del Renat sigui sempre correcta, a l'hora que pugui ser canviada.

Recorda que les posicions vàlides del gat Renat són exactament: "dret", "assegut" i "estirat".

En cas que el setter de posicio rebi un valor no vàlid, mantindrà el valor de la propietat sense modificar. És a dir, es comportarà igual que setVides().

Completa la següent plantilla:

```java
 public class UsaGatRenat {

     public static void main(String[] args) {

         GatRenat renat = new GatRenat();

         System.out.println("Les vides inicials són: " + renat.XXX);

         System.out.println("La posició inicial és: " + renat.XXX);

         System.out.println("Introdueix nova posició:");

         renat.setPosicio(Entrada.readLine());

         System.out.println("La posició final és: " + renat.XXX);

     }

 }
```

El programa, en ser executat, mostrarà la següent sortida:

**Les vides inicials són: 7**
La posició inicial és: estirat
Introdueix nova posició:
assegut
La posició final és: assegut

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
}
```

## UsaGatRenat

```java
public class UsaGatRenat {
    public static void main(String[] args) {
        GatRenat renat = new GatRenat();

        System.out.println("Les vides inicials són: " + renat.getVides());
        System.out.println("La posició inicial és: " + renat.getPosicio());
        System.out.println("Introdueix nova posició:");
        renat.setPosicio(Entrada.readLine());
        System.out.println("La posició final és: " + renat.getPosicio());
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3013posiciosemprecorrecta.png
:alt: Diagrama UML
```
