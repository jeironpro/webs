# Ejercicios — 17.05 — Utilitats de confirmacio

## Semafor

**Enunciat**

Desenvolupa una versió de l'exercici del Semàfor de manera que abans de donar el consell, se n'asseguri que els usuaris són majors d'edat.

La nova versió fara servir la funció UtilitatsConfirmacio.respostaABoolean().

Considera les següents simulacions:

**Ets major d'edat?**
Sí
Color?
groc
corre!

**Ets major d'edat?**
Encara no
No pots fer servir aquest programa sense supervisió

Si vols comprovar la potència de disposar d'aquesta funció, considera utilitzar-la també els programes Autodestruccio i AutodestruccioTotal.

Nota

Per passar les proves, caldrà que facis una petita modificació a respostaABoolean() de manera que ignori els caràcters blancs, tant davant com darrera del text a analitzar.

```java
public class Semafor {
    public static void main(String[] args) {
        System.out.println("Ets major d'edat?");
        if (UtilitatsConfirmacio.respostaABoolean(Entrada.readLine())) {
            System.out.println("Color?");
            String color = Entrada.readLine();
            
            String indicacio = switch (color) {
                case "verd" -> "passa";
                case "vermell" -> "espera";
                case "groc" -> "corre!";
                default -> "ves a l'oculista";
            };
            System.out.println(indicacio);
        } else {
            System.out.println("No pots fer servir aquest programa sense supervisió");
        }
    }
}
```

## UtilitatsConfirmacio

* Donada una resposta textual, aquesta funció tradueix la resposta a
* un booleà.
* Considera true quan la resposta és, independentment de majúscules i
* sense considerar espais a l'inici ni al final,
* "sí", "s", "yes" o "y", i algunes variants amb errors ortogràfics.
* Altrament considera false.

```java
 public class UtilitatsConfirmacio {
    public static boolean respostaABoolean(String resposta) {
        String nuevaResposta = "";
        for (int i = 0; i < resposta.length(); i++) {
            char c = resposta.charAt(i);
            if (Character.isLetter(c)) {
                nuevaResposta += c;
            }
        }
        if (nuevaResposta.isBlank()) {     
            return false;
        }
        
        nuevaResposta = nuevaResposta.toLowerCase();
        if (nuevaResposta.equals("s") || nuevaResposta.equals("y")) {
            return true;
        }
        if (nuevaResposta.equals("sí") || nuevaResposta.equals("yes")) {
            return true;
        }
        if (nuevaResposta.equals("si") || nuevaResposta.equals("vale") || nuevaResposta.equals("yeah")) {
            return true;
        }
        return false;
    }
}
```
