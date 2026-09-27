# Ejercicios — 14.07 — Acaba amb lletra no vocal

**Enunciat**

Desenvolupa una nova versió del programa del Lloro, anomenada Lloro que, en aquest cas només repeteixi les paraules que finalitzin amb una lletra no vocal. Com la versió original, s'aturarà quan rebi una cadena en blanc o buida.

Atenció: el programa ha de considerar vocals tant les majúscules com les minúscules.

Una simulació d'execució:

**Paraula?**
amic
Repeteixo: amic

**Paraula?**
Mazinguer-Z
Repeteixo: Mazinguer-Z

**Paraula?**
color
Repeteixo: color

**Paraula?**
color!

**Paraula?**
amiga

**Paraula?**
Afrodita-A

Paraula?

Adéu

Pista: Considera les utilitats de Character.

```java
public class Lloro {
    public static void main(String[] args) {
        boolean continuar = true;
        String vocals = "aeiou";

        while (continuar) {
            boolean esVocal = false;
            System.out.println("Paraula?");
            String paraula = Entrada.readLine();

            if (paraula.isEmpty()) {
                continuar = false;
            } else {
                for (int i = 0; i < vocals.length(); i++) {
                    if (Character.toLowerCase(paraula.charAt(paraula.length()-1)) == vocals.charAt(i)) {
                        esVocal = true;
                    }
                }
    
                if (!esVocal) {
                    System.out.println("Repeteixo: " + paraula);
                }
            } 
        }
        System.out.println("Adéu");
    }
}
```
