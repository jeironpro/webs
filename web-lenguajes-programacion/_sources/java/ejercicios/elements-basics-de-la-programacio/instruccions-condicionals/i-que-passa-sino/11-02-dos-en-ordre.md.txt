# Ejercicios — 11.02 — Dos en ordre

**Enunciat**

Desenvolupa un programa que demani dos números i escrigui els dos números ordenats creixentment (de menor a major). Per exemple, si els números són 3 i 2, el resultat serà 2 3

Indica amb un comentari, que passa si els dos números són iguals.

Exemples d'interacció:

**java DosEnOrdre**
Primer?
3
Segon?
2
2 i 3

**java DosEnOrdre**
Primer?
2
Segon?
3
2 i 3

**java DosEnOrdre**
Primer?
3
Segon?
3
3 i 3

Fixa't que quan els dos nombres són iguals, apareixen repetits.

Aquí tens una plantilla pel teu codi. Pots copiar-la i enganxar-la en el fitxer corresponent. Únicament et caldrà reemplaçar els comentaris █████ pel codi corresponent.

* Programa que ordena dos nombres

```java
public class DosEnOrdre {
    public static void main(String[] args) {
        System.out.println("Primer?");
        int primer = Integer.parseInt(Entrada.readLine());
```

█████ demana el segon nombre i el guarda a una variable adequada

**█████ compara el primer i el segon, i amb una instrucció**
condicional amb if i else mostra el missatge
corresponent.
Pista: un dels missatges podria ser escrit amb:

```java
                 System.out.println(primer + " i " + segon);
    }
}

public class DosEnOrdre {
    public static void main(String[] args) {
        System.out.println("Primer?");
        int primer = Integer.parseInt(Entrada.readLine());

        System.out.println("Segon?");
        int segon = Integer.parseInt(Entrada.readLine());

        if (primer < segon) {
            System.out.println(primer + " i " + segon);
        } else {
            System.out.println(segon + " i " + primer);
        }
    }
}
```
