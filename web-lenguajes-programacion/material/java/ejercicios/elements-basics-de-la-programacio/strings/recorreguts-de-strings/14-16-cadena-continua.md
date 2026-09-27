# Ejercicios — 14.16 — Cadena continua

**Enunciat**

Desenvolupa un programa anomenat CadenaContinua, que demani un text i un nombre enter, i mostri tants caràcters del text com indiqui el nombre enters, començant pel primer. En cas que en faltin, el programa tornarà a mostrar el text a partir del primer caràcter fins que hagi aconseguit tots els caràcters demanats.

En cas que se li demani menys d'un caràcter, simplement no mostrarà res. En cas que el text introduït sigui buit, mostrarà el missatge "error" finalitzarà l'execució sense demanar la longitud de la cadena a generar.

Considera la següent simulació:

**Text?**
kuruma
Nombre?
10
kurumakuru

Pista Potser voldràs considerar l'operador mòdul % per fer aquest exercici en comptes d'haver d'usar una condició.

```java
public class CadenaContinua {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        if (!text.isEmpty()) {
            System.out.println("Nombre?");
            int nombre = Integer.parseInt(Entrada.readLine());

            if (nombre >= 0) {
                for (int i = 0; i < nombre; i++) {
                    System.out.print(text.charAt(i % text.length()));
                }
            }
        } else {
            System.out.println("error");
        }
    }
}
```
