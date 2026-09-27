# Ejercicios — 19.02 — Extreu nombres (recursiu)

**Enunciat**

Desenvolupa un programa que demani un text i mostri només els valors numèrics que conté.

Per fer aquest programa, completa la següent plantilla on no pots afegir cap iterador for/while

//

```java
public class ExtreuNombres {

    public static void main(String[] args){

        System.out.println("Text?");

        String text = Entrada.readLine();

        String nombres = extreuNombres(text);

        System.out.println(nombres);

    }
```

// extreu els nombres i els retorna concatenats

```java
    public static String extreuNombres(String text) {
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

public class ExtreuNombres {
    public static void main(String[] args){
        System.out.println("Text?");
        String text = Entrada.readLine();

        String nombres = extreuNombres(text);
        System.out.println(nombres);
    }

    public static String extreuNombres(String text) {
        if (text.isEmpty()) return "";

        String nombres = "";
        char primer = text.charAt(0);

        if (Character.isDigit(primer)) {
            nombres += primer;
        }

        String restaText = extreuNombres(text.substring(1));
        nombres += restaText;

        return nombres;
    }
}
```
