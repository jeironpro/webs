# Ejercicios — 17.04 — Matricules italianes modulades

**Enunciat**

En aquesta ocasió rescatarem l'exercici de les matrícules italanes i en farem una nova versió que farà servir la funció esLletraValidaPerMatriculaItaliana() que rep un caràcter i retorna un booleà a cert quan el caràcter pot ser una lletra vàlida per una matrícula italiana.

Així, caldrà reprogramar el main() del programa de manera que, allà on feies les comparacions per decidir si un caràcter era o no una lletra vàlida, ara faràs una crida a la nova funció.

Nota: Aquell exercici va aparèixer en un context en que no s'havien presentat els recorreguts de Strings. Ara que ja en saps, potser voldràs simplificar encara més el teu programa.

```java
public class MatriculaValida {
    public static void main(String[] args) {
        System.out.println("Introduïu una matrícula");
        String matricula = Entrada.readLine();

        boolean verificarLletra = true;
        boolean verificarNombre = false;
        
        if (matricula.length() == 7) {
            for (int i = 0; i < matricula.length(); i++) {
                if (i >= 2 && i <= 4) {
                    continue;
                }
                char c = matricula.charAt(i);
                verificarLletra = esLletraValidaPerMatriculaItaliana(c);
                
                if (!verificarLletra) {
                    break;
                }
            }
            if (Character.isDigit(matricula.charAt(2)) && Character.isDigit(matricula.charAt(3)) && Character.isDigit(matricula.charAt(4))) {
                verificarNombre = true;
            }
        }
        if (verificarLletra && verificarNombre) {
            System.out.println("És una matrícula italiana vàlida");
        }
        if (matricula.length() > 7 || !verificarLletra || !verificarNombre) {
            System.out.println("No és una matrícula italiana vàlida");
        }
        
    }
    
    public static boolean esLletraValidaPerMatriculaItaliana(char c) {
        String lletresEspecials = "IOQU";
        for (int i = 0; i < lletresEspecials.length(); i++) {
            char ch = lletresEspecials.charAt(i);
            if (!(c >= 'A' && c <= 'Z') || c == ch) {
                return false;
            }
        } 
        return true;
    }
}
```
