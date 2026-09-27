# Ejercicios — 19.03 — Suma digits (recursiu)

**Enunciat**

Desenvolupa un programa que demani un text i mostri la suma dels dígits que conté.

Per fer aquest programa, completa la següent plantilla on no pots afegir cap iterador for/while

//

```java
public class SumaDigits {

    public static void main(String[] args){

        System.out.println("Text?");

        String text = Entrada.readLine();

        int nombres = sumaDigits(text);

        System.out.println(nombres);

    }
```

// XXX

```java
    public static int sumaDigits(String text) {
```

// cas base

// XXX

// tracta pas actual

// XXX

// tracta pas recursiu

// XXX

// composa resultat

// XXX

```java
    }

}

public class SumaDigits {
    public static void main(String[] args){
        System.out.println("Text?");
        String text = Entrada.readLine();

        int sumarDigits = sumaDigits(text);
        System.out.println(sumarDigits);
    }

    public static int suma = 0;

    public static int sumaDigits(String text) {
        if (text.isEmpty()) return 0;

        char primer = text.charAt(0);

        if (Character.isDigit(primer)) {
            suma += Integer.parseInt("" + primer);
        }

        int restaText = sumaDigits(text.substring(1));
        return suma;
    }
}
```
