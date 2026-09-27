# Ejercicios — 30.15 —  Com esta Renat

## GatRenat

**Enunciat**

Afegeix al repertori de mètodes del Renat els següents:

boolean esViu() // cert si encara li queda alguna vida

boolean esDret(), boolean esAssegut(), boolean esEstirat()

Completa la plantilla següent:

```java
public class UsaGatRenat {

    public static void main(String[] args) {

        GatRenat renat = new GatRenat();

        System.out.println("Inicialment renat.esViu(): " + renat.XXX);

        System.out.println("Inicialment renat.esDret(): " + renat.XXX);

        System.out.println("Inicialment renat.esAssegut(): " + renat.XXX);

        System.out.println("Inicialment renat.esEstirat(): " + renat.XXX);

        System.out.println("Introdueix quantes vides:");

        renat.XXX(Integer.parseInt(Entrada.readLine()));

        System.out.println("Introdueix nova posició:");

        renat.XXX(Entrada.readLine());

        System.out.println("Finalment renat.esViu(): " + renat.XXX);

        System.out.println("Finalment renat.esDret(): " + renat.XXX);

        System.out.println("Finalment renat.esAssegut(): " + renat.XXX);

        System.out.println("Finalment renat.esEstirat(): " + renat.XXX);

    }

}
```

La sortida haurà correspondre a aquesta simulació:

**Inicialment renat.esViu(): true**
Inicialment renat.esDret(): false
Inicialment renat.esAssegut(): false
Inicialment renat.esEstirat(): true
Introdueix quantes vides:
0
Introdueix nova posició:
dret
Finalment renat.esViu(): false
Finalment renat.esDret(): true
Finalment renat.esAssegut(): false
Finalment renat.esEstirat(): false

D'acord, no és massa creïble que el Renat pugui estar a l'hora dret i mort. Ho deixarem així de moment en favor de la simplicitat. Se t'acut, però, com podríem arreglar aquesta situació?

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
}
```

## UsaGatRenat

```java
public class UsaGatRenat {
    public static void main(String[] args) {
        GatRenat renat = new GatRenat();
        System.out.println("Inicialment renat.esViu(): " + renat.esViu());
        System.out.println("Inicialment renat.esDret(): " + renat.esDret());
        System.out.println("Inicialment renat.esAssegut(): " + renat.esAssegut());
        System.out.println("Inicialment renat.esEstirat(): " + renat.esEstirat());
        System.out.println("Introdueix quantes vides:");
        renat.setVides(Integer.parseInt(Entrada.readLine()));
        System.out.println("Introdueix nova posició:");
        renat.setPosicio(Entrada.readLine());
        System.out.println("Finalment renat.esViu(): " + renat.esViu());
        System.out.println("Finalment renat.esDret(): " + renat.esDret());
        System.out.println("Finalment renat.esAssegut(): " + renat.esAssegut());
        System.out.println("Finalment renat.esEstirat(): " + renat.esEstirat());
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3015comestarenat.png
:alt: Diagrama UML
```
