# Ejercicios — 15.07 — Texts capicua

**Enunciat**

Desenvolupa un programa anomenat Capicua, que demani un text i indiqui si el text és o no capicua.

Es considera que un text és capicua si llegint els seus caràcters d'esquerra a dreta són iguals que llegint-los de dreta a esquerra.

Considera la següent simulació

**Text?**
Anna
És capicua

**Text?**
Aquesta és una frase palindròfoba
No és capicua

```java
public class Capicua {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        String nouText = "";
        String textReves = "";

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (Character.isLetter(c)) {
                nouText += c;
            }
        }

        for (int i = nouText.length()-1; i >= 0; i--) {
            char c = nouText.charAt(i);
            textReves += c;
        }

        if (nouText.equals(textReves)) {
            System.out.println("És capicua");
        } else {
            System.out.println("No és capicua");
        }
    }
}
```
