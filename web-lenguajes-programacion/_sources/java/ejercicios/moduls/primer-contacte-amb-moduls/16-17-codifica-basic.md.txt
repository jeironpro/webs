# Ejercicios — 16.17 — Codifica basic

**Enunciat**

Desenvolupa una nova versió de l'exercici que codificava un text.

La nova versió inclou una modificació respecte la versió inicial. En aquesta ocasió permetrà decidir quants caràcters s'incrementen

Considera les següents simulacions:

**Text?**
abcz
Quants?
1
bcda

**Text?**
abcz
Quants?
2
cdeb

**Text?**
abcz
Quants?
-2
No s'accepten números negatius

El mòdul main() se n'encarregarà només d'obtenir les dades d'entrada, i cridarà un nou mòdul que serà qui realitzi realment la feina.

La signatura del nou mòdul serà:

```java
public static void codifica(String text, int quants)

public class CodificaBasic {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        System.out.println("Quants?");
        int quantitat = Integer.parseInt(Entrada.readLine());
        codifica(text, quantitat);
    }

    public static void codifica(String text, int quants) {
        if (quants > 0) {
            int contador = 0;
            for (int i = 0; i < text.length(); i++) {
                char c = text.charAt(i);

                if (c >= 'a' && c <= 'z') {
                    if (quants > 26) {
                        quants = quants % 26;
                    }

                    if ((c + quants) <= 122) {
                        if (c == 'z') {
                            c = 96;
                        } 
                        System.out.print((char)(c+quants)); 
                    } else if ((c + quants) >= 123 && quants <= 26) {
                        contador = (c + quants) - 122;
                        c = 96;
                        System.out.print((char)(c+contador)); 
                    }
                    contador++;                   
                } else {
                    System.out.print(c);
                }
            }   
        } else if (quants == 0) {
            System.out.println(text);
        } else {
            System.out.println("No s'accepten números negatius");
        }
    }
}
```
