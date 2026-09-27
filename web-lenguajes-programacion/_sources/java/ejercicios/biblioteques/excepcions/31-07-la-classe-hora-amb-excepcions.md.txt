# Ejercicios — 31.07 — La classe Hora amb excepcions

**Enunciat**

Toca fer una nova versió de la classe Hora. En aquesta ocasió farem ús del mecanisme d'excepcions.

Afegeix el control d'errors amb excepcions allà on els usuaris de la classe puguin passar-li valors no vàlids. Els setters ara retornaran void.

En cas d'error, els mètodes retornaran excepcions amb els missatges:

"hores fora de rang: «hores»"

"minuts fora de rang: «minuts»"

"segons fora de rang: «segons»"

El següent programa haurà de funcionar. Et caldrà implementar el mètode canviaHora() que bàsicament intentarà assignar les hores, minuts i segons rebuts a la instància de ''Hora``:

```java
public class UsaHora {

    private static void canviaHora(Hora hora, int hores, int minuts, int segons) {
```

// XXX TODO: encara no implementat

```java
    }

    public static void main(String[] args) {

        Hora hora = new Hora();

        System.out.println("Inicialment " + hora);

        System.out.println("Si intentem assignar a hores un -1");

        canviaHora(hora, -1, hora.getMinuts(), hora.getSegons());

        System.out.println("El valor resultant és " + hora);

        System.out.println();

        System.out.println("Si intentem assignar a minuts un -1");

        canviaHora(hora, hora.getHores(), -1, hora.getSegons());

        System.out.println("El valor resultant és " + hora);

        System.out.println();

        System.out.println("Si intentem assignar a segons un -1");

        canviaHora(hora, hora.getHores(), hora.getMinuts(), -1);

        System.out.println("El valor resultant és " + hora);

        System.out.println();

    }

}
```

El resultat d'executar el programa anterior serà:

**Inicialment 0:00:00**
Si intentem assignar a hores un -1
java.lang.Exception: hores fora de rang: -1
El valor resultant és 0:00:00

**Si intentem assignar a minuts un -1**
java.lang.Exception: minuts fora de rang: -1
El valor resultant és 0:00:00

**Si intentem assignar a segons un -1**
java.lang.Exception: segons fora de rang: -1
El valor resultant és 0:00:00

## Diagrama UML

```{image} /_static/uml/uml-3107laclassehoraambexcepcions.png
:alt: Diagrama UML
```
