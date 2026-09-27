# Ejercicios — 14.19 — Conte el darrer caracter

**Enunciat**

Desenvolupa un programa anomenat ConteDarrer, que vagi demanant texts fins que un no contingui el darrer caràcter del text anterior. El primer text és acceptat sempre a menys que estigui buit.

Considera els següents exemples d'execució:

**Introdueix texts (enter sol per finalitzar)**
Donam una A
bé
Donam una B
bé
Trobam una C
bé
Pintam una D
Adéu

Introdueix texts (enter sol per finalitzar)

Adéu

Fixa't que la primera s'accepta sense problemes i marca que la següent ha de contenir una A. La segona conté (més d')una a i finalitza amb B. La tercera té una b i demana una C. La quarta no té C i, per tant, finalitza amb "Adéu".

Important

Si trobes el caràcter anterior a la línia, no cal que segueixis cercant més aparicions.

```java
public class ConteDarrer {
    public static void main(String [] args) {
        System.out.println("Introdueix texts (enter sol per finalitzar)");
        String text = Entrada.readLine();

        if (!text.isEmpty()) {
            System.out.println("bé");
        }

        while (!text.isEmpty()) {
            char ultimCaracter = Character.toLowerCase(text.charAt(text.length()-1));
            text = Entrada.readLine();
            boolean conte = false;

            for (int i = 0; i < text.length(); i++) {
                if (Character.toLowerCase(text.charAt(i)) == ultimCaracter) {
                    conte = true;
                    System.out.println("bé");
                    break;
                }
            }
            if (!conte) {
                break;
            }
        }
        System.out.println("Adéu");
    }
}
```
