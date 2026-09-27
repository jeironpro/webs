# Ejercicios — 11.01 — La preso

**Enunciat**

Desenvolupa un programa que demani el nom i l'edat per entrada estàndard i, si és major d'edat li digui “Vos ja podeu anar a la presó!”. Finalment, sigui quina sigui l'edat de l'usuari el programa s'acomiadarà dient “Aneu amb compte «nom de l'usuari»!”.

Exemples d'interacció:

**java Preso**
Com us dieu?
Manel
Quants anys teniu?
17
Aneu amb compte Manel

**java Preso**
Com us dieu?
Anna
Quants anys teniu?
19
Vos ja podeu anar a la presó!
Aneu amb compte Anna

Aquí tens una plantilla pel teu codi. Pots copiar-la i enganxar-la en el fitxer corresponent. Únicament et caldrà reemplaçar els comentaris █████ pel codi corresponent.

* Programa que recorda que els majors d'edat són responsables davant la
* llei

```text
public class Preso {
    public static void main(String[] args) {
        System.out.println("Com us dieu?");
        String nom = Entrada.readLine();
        System.out.println("Quants anys teniu?");
        int edat = Integer.parseInt(Entrada.readLine());
        if (█████condició) {
```

**█████instruccions quan la condició és certa**

```java
        }
```

█████instruccions independentment de la condició

```java
    }
}

public class Preso {
    public static void main(String[] args) {
        System.out.println("Com us dieu?");
        String nom = Entrada.readLine();

        System.out.println("Quants anys teniu?");
        int edat = Integer.parseInt(Entrada.readLine());
        
        if (edat >= 18) {
            System.out.println("Vos ja podeu anar a la presó!");
        }
        System.out.println("Aneu amb compte " + nom);
    }
}
```
