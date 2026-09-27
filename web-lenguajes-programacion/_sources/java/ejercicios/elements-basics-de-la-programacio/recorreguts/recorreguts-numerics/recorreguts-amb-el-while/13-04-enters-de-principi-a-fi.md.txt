# Ejercicios — 13.04 — Enters de principi a fi

**Enunciat**

Desenvolupa el programa NaturalsEntre que demani tres nombres enters no negatius, i escrigui els valors entre el primer i el segon saltant d'un al següent amb el tercer.

Podem suposar que el programa sempre rebrà números enters per l'entrada estàndard.

El programa comprovarà que els tres valors siguin no negatius, que el primer sigui menor o igual que el segon, i que el tercer sigui més gran que zero. Ah! Farà les comprovacions de manera que si per exemple el primer valor ja era negatiu, no preguntarà més.

Per qualsevol error, indicarà "Valor no vàlid" i finalitzarà.

Una simulació de l'execució seria:

**Valor inicial?**
9
Valor final?
16
Salt?
3
9
12
15

Pista: El programa té dues parts. La primera és l'obtenció i validació de les dades. Si tot ha anat bé, passarà a la segona part, en la que mostrarà els valors corresponents i per la que faràs bé en considerar les preguntes típiques dels problemes anteriors:

Quin és el valor inicial?

Quin és el valor final?

Quina és la condició adequada per mantenir-se dins del while?

Com es calcula el següent valor?

```java
public class NaturalsEntre {
    public static void main(String[] args) {
        System.out.println("Primer?");
        int primer = Integer.parseInt(Entrada.readLine());

        if (primer >= 0) {
            System.out.println("Segon?");
            int segon = Integer.parseInt(Entrada.readLine());

            if (segon >= 0) {
                System.out.println("Salt?");
                int salt = Integer.parseInt(Entrada.readLine());

                if (salt > 0) {
                    if (primer > segon) {
                        int tmp = primer;
                        primer = segon;
                        segon = tmp;
                    }
                    while (primer < segon) {
                        primer += salt;
                        System.out.println(primer);
                    }
                } else {
                    System.out.println("Valor no vàlid");
                }
            } else {
                System.out.println("Valor no vàlid");
            }
        } else {
            System.out.println("Valor no vàlid");
        }
    }
}
```
