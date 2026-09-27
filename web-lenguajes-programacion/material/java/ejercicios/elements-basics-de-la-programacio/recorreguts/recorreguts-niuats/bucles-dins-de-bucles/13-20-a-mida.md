# Ejercicios — 13.20 — A Mida

**Enunciat**

En aquesta ocasió desenvoluparàs un programa anomenat RectanglesAMida que anirà demanant nombres enters fins rebre'n un de negatiu o bé una cadena buida o només formada per espais en blanc.

Per cada nombre que rebi, dibuixarà un rectangle d'asteriscs ('*') amb el nombre de columnes indicat pel número introduït, i el nombre de files indicat pel número anterior. En el cas del primer número, el nombre de files serà 1.

El rectangle estarà encapçalat pel número de columna, començant per la 0. En cas que tingui més de 10 files, després de la 9 passarà un altre cop a la 1. D'igual manera, per cada fila també indicarà el número corresponent.

Finalment mostrarà un resum amb el nombre de rectangles i punts dibuixats, o bé el missatge "Cap rectangle dibuixat".

Considera el següent exemple d'execució:

**1 x ?**
3
012
0 ***
3 x ?
6
012345
0 ******
1 ******
2 ******
6 x ?
2
01
0 **
1 **
2 **
3 **
4 **
5 **
2 x ?
12
012345678901
0 ************
1 ************
12 x ?
4
0123
0 ****
1 ****
2 ****
3 ****
4 ****
5 ****
6 ****
7 ****
8 ****
9 ****
0 ****
1 ****
4 x ?
-1
Rectangles: 5
Punts: 105

```java
public class RectanglesAMida {
    public static void main(String[] args) {
        int fila = 1;
        System.out.println(fila + " * ?");
        String text = Entrada.readLine();

        int nombre = Integer.parseInt(text);
        String columnes = "";
        String asteriscs = "";
        int contadorRectangles = 0;
        int contadorPunts = 0;
        int nombrePunts = 0;

        while (!text.isBlank() && nombre > 0) {
            for (int i = 0; i < nombre; i++) {
                    columnes += (i % 10);
                    asteriscs += '*'; 
            }
            System.out.println("  " + columnes);
            columnes = "";
            for (int i = 0; i < fila; i++) {
                contadorPunts = fila * nombre;
                System.out.print(i % 10);
                System.out.println(" " + asteriscs);
            }
            asteriscs = "";
            fila = nombre;
            System.out.println(fila + " * ?");
            text = Entrada.readLine();
            nombre = Integer.parseInt(text);
            contadorRectangles = contadorRectangles + 1;
            nombrePunts += contadorPunts;
        }
        if (contadorRectangles <= 0){
            System.out.println("Cap rectangle dibuixat");
        } else {
            System.out.println("Rectangles: " + contadorRectangles);
            System.out.println("Punts: " + nombrePunts);
        }
    }
}
```
