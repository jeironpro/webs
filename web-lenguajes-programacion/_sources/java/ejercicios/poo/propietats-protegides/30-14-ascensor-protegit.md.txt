# Ejercicios — 30.14 — Ascensor protegit

## Ascensor

**Enunciat**

En aquesta ocasió protegirem les propietats de l'ascensor de manera que:

el pis sempre sigui un valor entre -1 i 10

el moviment sempre sigui un dels següents valors: aturat, pujant, baixant

Inicialment, l'ascensor començarà a la planta -1 i aturat.

Completa la següent plantilla de UsaAscensor de manera que obtingui el pis i moviment final en aquest ordre, dels arguments de la línia de comandes:

```java
 public class UsaAscensor {
```

/* XXX

```java
    /* public static void main(String[] args) {

        // XXX

        System.out.println("Pis inicial: " + ascensor.XXX);

        System.out.println("Moviment inicial: " + ascensor.XXX);

        // XXX

        System.out.println("Pis final: " + ascensor.XXX);

        System.out.println("Moviment final: " + ascensor.XXX);

    }

}

El programa, en ser executat amb els valors 5 i pujant, mostrarà la següent sortida:

Pis inicial: -1
Moviment inicial: aturat
Pis final: 5
Moviment final: pujant

Atenció: Si no s'indica algun dels valors o bé algun d'aquest no és del tipus esperat, es considerarà que s'han introduït els valors d'inici. Si en sobren, s'ignoraran.
*/

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
}
```

## UsaAscensor

```java
public class UsaAscensor {
    /* XXX */
    public static void main(String[] args) {
        Ascensor ascensor = new Ascensor();

        System.out.println("Pis inicial: " + ascensor.getPis());
        System.out.println("Moviment inicial: " + ascensor.getMoviment());
        if (args.length >= 1) {
            ascensor.setPis(Integer.parseInt(args[0]));

            if (args.length > 1) {
                ascensor.setMoviment(args[1]);
            }
        }
        System.out.println("Pis final: " + ascensor.getPis());
        System.out.println("Moviment final: " + ascensor.getMoviment());
    }
}
```
