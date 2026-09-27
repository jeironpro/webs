# Ejercicios — 14.06 — Inicia i acaba en vocal

**Enunciat**

Desenvolupa un nou "Lloro". En aquest cas li anomenaràs LloroVocalIniFi i només repetirà les paraules que iniciïn i finalitzin amb la mateixa vocal, independentment de si apareixen en majúscules o minúscules.

El lloro finalitzarà quan rebi una cadena en blanc.

Considera com a vocals només els valors a, e, i, o i u.

Una simulació d'execució:

**Paraula?**
Amiga
Repeteixo: Amiga
Paraula?
Enemiga
Paraula?
tret
Paraula?

Adéu

```java
public class LloroVocalIniFi {
    public static void main(String[] args) {
        boolean continuar = true;
        String vocals = "aeiou";

        while (continuar) {
            System.out.println("Paraula?");
            String paraula = Entrada.readLine();

            if (paraula.isBlank()) {
                continuar = false;
            } else {
                for (int i = 0; i < vocals.length(); i++) {
                    if (paraula.charAt(0) == vocals.charAt(i)) {
                        if (paraula.charAt(paraula.length()-1) == vocals.charAt(i)) {
                            System.out.println("Repeteixo: " + paraula);
                        }
                    }
                }
            }
        }
        System.out.println("Adéu");
    }
}
```
