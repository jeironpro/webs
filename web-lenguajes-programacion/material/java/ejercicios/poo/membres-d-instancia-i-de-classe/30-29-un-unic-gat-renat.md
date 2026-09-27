# Ejercicios — 30.29 — Un unic gat Renat

## GatRenat

**Enunciat**

En aquest exercici implementaràs una versió de la classe GatRenat de manera que només hi pugui haver una única instància.

Recupera alguna versió antiga de GatRenat, per exemple molts constructors i segueix les passes que t'enumero a continuació:

defineix una propietat privada anomenada instancia de tipus GatRenat. Sí, no t'espantis que no estem marlonbrando. instancia és també estàtica.

fes privat tots els constructors de la classe. No pateixis, al final de l'exercici sí es podrà crear instàncies.

Nota: Com que són privats, potser voldràs quedar-te només amb un com indica el diagrama UML.

defineix com a públic i estàtic, diferents mètodes anomenats getInstancia(), un per cada versió del constructor, amb els paràmetres del constructor que reemplaça. Tots aquests mètodes retornaran un GatRenat.

per cada mètode getInstancia() comprova si la propietat instancia és null. Si ho és, crida el constructor corresponent i assigna el resultat a instancia. Finalment retorna el valor de instancia amb els valors indicats en els paràmetres (si n'hi ha).

Totes les crides a tots quatre mètodes retornaran sempre la mateixa instància.

Ja estem

Ara et toca provar que ho has fet bé i quines repercussions tenen els canvis que acabes de realitzar

Considera la següent plantilla de UsaGatRenat que hauràs de completar.

```java
 public class UsaGatRenat {

     public static void main(String[] args) {

         GatRenat renat = GatRenat.getInstancia();

         System.out.println("Inicialment Renat està " + renat.getPosicio());

         for (String posicio: args) {

             canviaPosicio(posicio);

             System.out.println("Ara està " + renat.getPosicio());

         }

     }

     private static void canviaPosicio(String novaPosicio) {
```

// Tradueix novaPosicio: 1 -> estirat, 2 -> assegut, 3 -> dret,

// altrament es queda com estava

// XXX

```java
         GatRenat.getInstancia(novaPosicio);

     }

 }
```

Fixat especialment en les línies 3 i 14. En ambdues accedim a la única instància de GatRenat. Tant main() com canviaPosicio() no comuniquen aquesta instància entre si ja que, ni la instància de GatRenat està declarada com a global de UsaGatRenat, ni canviaPosicio() la rep com a paràmetre ni la retorna! Amb tot, els canvis que es realitzen en un mòdul són visibles a l'altre. Sembla màgia, oi?

Per completar la plantilla, et caldrà traduir el valor de novaPosicio de manera que:

1 passi a ser estirat

2 passi a ser assegut

3 passi a ser dret

estirat, assegut, dret demanin el canvi de posició corresponent.

qualsevol altre valor no es canvia

Una simulació d'execució seria:

**java UsaGatRenat 3 2 1 dret**
Inicialment Renat està estirat
Ara està dret
Ara està assegut
Ara està estirat
Ara està dret

Una mica de culturilla POO

El que t'estic demanant en aquest exercici és que implementis el patró singleton. Com diu la Viquipèdia, aquest patró és fa servir per restringir la instanciació d'una classe a un únic objecte.

```java
public class GatRenat {
    private int vides = 7;
    private String posicio = "estirat";
    private static GatRenat instancia;

    private GatRenat() {
        this.setVides(7);
        this.setPosicio("estirat");
    }

    public static GatRenat getInstancia() {
        if (instancia == null) {
            instancia = new GatRenat();
        }
        return instancia;
    }

    public static GatRenat getInstancia(int vides) {
        if (instancia == null) {
            instancia = new GatRenat();
        }
        instancia.vides = vides;
        return instancia;
    }

    public static GatRenat getInstancia(String posicio) {
        if (instancia == null) {
            instancia = new GatRenat();
        }
        instancia.posicio = posicio;
        return instancia;
    }

    public static GatRenat getInstancia(int vides, String posicio) {
        if (instancia == null) {
            instancia = new GatRenat();
        }
        instancia.vides = vides;
        instancia.posicio = posicio;
        return instancia;
    }

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

    @Override
    public String toString() {
        return String.format("Vides: %d. Posició: %s", this.vides, this.posicio);
    }
}
```

## UsaGatRenat

```java
public class UsaGatRenat {
    public static void main(String[] args) {
        GatRenat renat = GatRenat.getInstancia();
        System.out.println("Inicialment Renat està " + renat.getPosicio());
        for (String posicio: args) {
            canviaPosicio(posicio);
            System.out.println("Ara està " + renat.getPosicio());
        }
    }

    private static void canviaPosicio(String novaPosicio) {
        novaPosicio = switch(novaPosicio) {
            case "1" -> "estirat";
            case "2" -> "assegut";
            case "3" -> "dret";
            case "estirat" -> "estirat";
            case "assegut" -> "assegut";
            case "dret" -> "dret";
            default -> GatRenat.getInstancia().getPosicio();
        };
        GatRenat.getInstancia(novaPosicio);
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3029ununicgatrenat.png
:alt: Diagrama UML
```
