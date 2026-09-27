# Ejercicios — 13.10 — Enters dins dun interval

**Enunciat**

Desenvolupa el programa MostraInterval que demana dos valors enters per entrada estàndard i mostra tots els enters que hi ha entre el primer i el segon, en l'ordre marcat per l'entrada.

Considera les següents simulacions:

**inici?**
5
final?
7
5
6
7

**inici?**
7
final?
5
7
6
5

Fixa't que aquest exercici és molt similar a un exercici anterior, pero no és igual. Aquest és capaç de mostrar l'interval creixent o decreixent segons l'ordre relatiu dels valors proporcionats a l'entrada.

```java
public class MostraInterval {
    public static void main(String[] args) {
        System.out.println("inici?");
        int inici = Integer.parseInt(Entrada.readLine());

        System.out.println("final?");
        int finall = Integer.parseInt(Entrada.readLine());

        if (inici < finall) {
            for (int i = inici; i <= finall; i++) {
                System.out.println(i);
            }
        } else {
            for (int j = inici; j >= finall; j--) {
                System.out.println(j);
            }
        }
    }
}
```
