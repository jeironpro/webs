# Ejercicios — 14.08 — Extrems permutats

**Enunciat**

Desenvolupa un nou "Lloro" amb el nom ExtremsPermutats que finalitzi amb cadena buida.

Aquest cop, repetirà les paraules que tinguin permutades les lletres dels extrems.

Per exemple, "lacrimal" comença amb les lletres 'l' i 'a', i també acaba amb aquestes lletres, encara que en ordre diferent. També passa amb "tomato" doncs les primeres dues lletres 't' i 'o' apareixen al final, aquest cop en el mateix ordre que a l'inici.

**Ves introduïnt texts (finalitza amb INTRO sol)**
lacrimal
Repeteix: lacrimal
tomato
Repeteix: tomato
advocat
(rar)

Adéu

```java
public class ExtremsPermutats {
    public static void main(String[] args) {
        System.out.println("Ves introduïnt texts (finalitza amb INTRO sol)");
        boolean continuar = true;

        while (continuar) {
            String text = Entrada.readLine();

            if (!text.isEmpty()) {
                char primerCaracter = text.charAt(0);
                char segonCaracter = text.charAt(1);
                char penultimCaracter = text.charAt(text.length()-2);
                char ultimCaracter = text.charAt(text.length()-1);

                if ((primerCaracter == ultimCaracter && segonCaracter == penultimCaracter) || (segonCaracter == ultimCaracter && primerCaracter == penultimCaracter)) {
                    System.out.println("Repeteix: " + text);
                }       
            } else {
                continuar = false;
            }
        }
        System.out.println("Adéu");
    }
}
```
