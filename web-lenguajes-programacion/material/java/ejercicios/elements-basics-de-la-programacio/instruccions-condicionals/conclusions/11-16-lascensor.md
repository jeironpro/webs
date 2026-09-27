# Ejercicios — 11.16 — Lascensor

**Enunciat**

Considerem un ascensor d'un edifici amb planta baixa i dos pisos (primer pis i segon pis) que tingui els següents botons: ‘pujar un', ‘pujar dos', ‘baixar un' i ‘baixar dos'. L'ascensor es comporta, a partir dels botons esmentats, segons el següent diagrama de transició d'estats:
_images/esquemaascensor.png

Es demana desenvolupar un programa que simuli el funcionament d'aquest ascensor.

El programa demanarà el pis en que es troba i el botó que es prem, i mostrarà el nou pis.

Cal comprovar que els botons i les plantes siguin correctes. En cas que no ho siguin, el programa mostrarà un missatge d'error en comptes del nou pis.

El programa s'anomenarà Ascensor.

Alguns exemples d'interacció:

**pis?**
planta baixa
botó?
pujar un
primer pis

**pis?**
golfes
botó?
baixar un
error

**pis?**
segon pis
botó?
pujar un
error

```java
public class Ascensor {
    public static void main(String[] args) {
        System.out.println("pis?");
        String pis = Entrada.readLine();
        System.out.println("botó?");
        String boto = Entrada.readLine();

        /* if (boto.equals("baixar dos")) {
            if (pis.equals("segon pis")) {
                System.out.println("planta baixa");
            } else {
                System.out.println("error");
            }
        } else if (boto.equals("baixar un")) {
            if (pis.equals("segon pis")) {
                System.out.println("primer pis");
            } else if (pis.equals("primer pis")) {
                System.out.println("planta baixa");
            } else {
                System.out.println("error");
            }
        } else if (boto.equals("pujar un")) {
            if (pis.equals("primer pis")) {
                System.out.println("segon pis");
            } else if (pis.equals("planta baixa")) {
                System.out.println("primer pis");
            } else {
                System.out.println("error");
            }
        } else if (boto.equals("pujar dos")) {
            if (pis.equals("planta baixa")) {
                System.out.println("segon pis");
            } else {
                System.out.println("error");
            }
        } else {
            System.out.println("error");
        } */

        switch (boto) {
            case "baixar dos" -> {
                switch (pis) {
                    case "segon pis" -> System.out.println("planta baixa");
                    default -> System.out.println("error");
                }
            }
            case "baixar un" -> {
                switch (pis) {
                    case "segon pis" -> System.out.println("primer pis");
                    case "primer pis" -> System.out.println("planta baixa");
                    default -> System.out.println("error");
                }
            }
            case "pujar un" -> {
                switch (pis) {
                    case "primer pis" -> System.out.println("segon pis");
                    case "planta baixa" -> System.out.println("primer pis");
                    default -> System.out.println("error");
                }
            }
            case "pujar dos" -> {
                switch (pis) {
                    case "planta baixa" -> System.out.println("segon pis");
                    default -> System.out.println("error");
                }
            }
            default -> System.out.println("error");
        }
    }
}
```
