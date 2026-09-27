# Ejercicios — 14.05 — Inicia amb vocal minuscula

**Enunciat**

Desenvolupa una nova versió del programa del Lloro que, en aquest cas només repeteixi les paraules que comencen per una vocal en minúscules i s'aturi quan rebi una cadena en blanc.

Considerarem com a vocals només els valors a, e, i, o i u.

Anomena el programa IniciaVocal.

Una simulació d'execució:

El lloro pregunta paraula que comenci amb vocal en minúscules
amic
El lloro diu: amic
El lloro pregunta paraula que comenci amb vocal en minúscules
Amic
El lloro pregunta paraula que comenci amb vocal en minúscules
Lelo
El lloro pregunta paraula que comenci amb vocal en minúscules

Adéu

```java
public class IniciaVocal {
    public static void main(String[] args) {
        boolean continuar = true;
        String vocals = "aeiou";

        while (continuar) {
            System.out.println("El lloro pregunta paraula que comenci amb vocal en minúscules");
            String paraula = Entrada.readLine();

            if (paraula.isBlank()) {
                continuar = false;
            } else {
                for (int i = 0; i < vocals.length(); i++) {
                    if (paraula.charAt(0) == vocals.charAt(i)) {
                        System.out.println("El lloro diu: " + paraula);
                    }
                }
            }
        }
        System.out.println("Adéu");
    }
}
```
