# Ejercicios — 14.17 — Enters estrictes

**Enunciat**

Desenvolupa un programa, anomenat Enters que vagi demanant texts fins rebre la cadena buida.

Per cada text no buit que rebi, indicarà si correspon o no a un nombre enter escrit amb dígits.

Aquest exercici considerarà estrictament els nombres enters formats per dígits, amb la única excepció que el primer caràcter pot ser + o -.

Considera la següent simulació:

**Introdueix texts (enter sol per finalitzar)**
123
És enter
-4
És enter
+5
És enter
321
No és enter
cinc
No és enter

Adéu

Nota

Amb aquesta interpretació estricta dels enters, si el programa diu que un valor és enter, podem estar segurs que Integer.parseInt() podrà convertir-lo amb seguretat.

```java
public class Enters {
    public static void main(String[] args) {
    System.out.println("Introdueix texts (enter sol per finalitzar)");

        while (true) {
            boolean esEnter = false;
            String text = Entrada.readLine();

            if (text.isEmpty()) {
                break;
            }

            if (!text.isEmpty()) {
                for (int i = 0; i < text.length(); i++) {
                    if (Character.isDigit(text.charAt(i))) {
                        esEnter = true;
                    }
                }

                if (text.charAt(0) == '-' || text.charAt(0) == '+' && Character.isDigit(text.charAt(1))) {
                    esEnter = true;
                }

                if (esEnter) {
                    System.out.println("És enter");
                } else {
                    System.out.println("No és enter");
                }
            }
        }
        System.out.println("Adéu");
    }
}
```
