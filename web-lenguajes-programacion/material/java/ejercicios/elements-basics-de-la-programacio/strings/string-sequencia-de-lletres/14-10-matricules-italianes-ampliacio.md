# Ejercicios — 14.10 — Matrícules italianes (ampliacio)

**Enunciat**

L'exercici de les matrícules italianes és molt poc informatiu. Quan una matrícula no és vàlida, no et diu perquè.

En aquesta ocasió, farem una versió millorada del programa, de manera que permeti saber què ha fallat.

Considera les següents simulacions:

**java MatriculaValida**
Introduïu una matrícula
DD029YJ
És una matrícula italiana vàlida

**java MatriculaValida**
Introduïu una matrícula
Hola
No és una matrícula italiana vàlida: massa curta

**java MatriculaValida**
Introduïu una matrícula
DD029iunmuntdecaractersaddicionals
No és una matrícula italiana vàlida: massa llarga

**java MatriculaValida**
Introduïu una matrícula
0291BQj
No és una matrícula italiana vàlida
0: Ha de ser una lletra
2: Ha de ser una lletra
9: Correcte
1: Correcte
B: Ha de ser un dígit
Q: No és una lletra vàlida
j: Ha de ser majúscula

Nota: Quan hi ha més d'un error sobre la mateixa posició de la matrícula, el missatge tindrà la següent precedència:

la longitud del text inserit

que sigui una lletra quan s'espera un dígit o un dígit quan s'espera una lletra

que la lletra sigui minúscules

que la lletra no sigui vàlida

```java
public class MatriculaValida {
    public static void main(String[] args) {
        System.out.println("Introduïu una matrícula");
        String matricula = Entrada.readLine();
        String noAccept = "ÇÀÑßIOQU";

        if (matricula.length() > 7) {
            System.out.println("No és una matrícula italiana vàlida: massa llarga");
        } else if (matricula.length() < 7) {
            System.out.println("No és una matrícula italiana vàlida: massa curta");
        } else {
            boolean primerCaracterConteEspecial = false;
            boolean segonCaracterConteEspecial = false;
            boolean siseCaracterConteEspecial = false;
            boolean seseCaracterConteEspecial = false;
            
            char primerCaracter = matricula.charAt(0);
            char segonCaracter = matricula.charAt(1);
            char tercerCaracter = matricula.charAt(2);
            char quartCaracter = matricula.charAt(3);
            char cinqueCaracter = matricula.charAt(4);
            char siseCaracter = matricula.charAt(5);
            char seseCaracter = matricula.charAt(6);

            for (int i = 0; i < noAccept.length(); i++) {
                if (Character.toUpperCase(primerCaracter) == noAccept.charAt(i)) {
                    primerCaracterConteEspecial = true;
                }
                if (Character.toUpperCase(segonCaracter) == noAccept.charAt(i)) {
                    segonCaracterConteEspecial = true;
                }
                if (Character.toUpperCase(siseCaracter) == noAccept.charAt(i)) {
                    siseCaracterConteEspecial = true;
                }
                if (Character.toUpperCase(seseCaracter) == noAccept.charAt(i)) {
                    seseCaracterConteEspecial = true;
                }
            }
            boolean primerCaracterCorrecte = Character.isUpperCase(primerCaracter) && !primerCaracterConteEspecial;
            boolean segonCaracterCorrecte = Character.isUpperCase(segonCaracter) && !segonCaracterConteEspecial;
            boolean tercerCaracterCorrecte = Character.isDigit(tercerCaracter);
            boolean quartCaracterCorrecte = Character.isDigit(quartCaracter);
            boolean cinqueCaracterCorrecte = Character.isDigit(cinqueCaracter);
            boolean siseCaracterCorrecte = Character.isUpperCase(siseCaracter) && !siseCaracterConteEspecial;
            boolean seseCaracterCorrecte = Character.isUpperCase(seseCaracter) && !seseCaracterConteEspecial;

            if (primerCaracterCorrecte && segonCaracterCorrecte && tercerCaracterCorrecte && quartCaracterCorrecte && cinqueCaracterCorrecte && siseCaracterCorrecte && seseCaracterCorrecte) {
                System.out.println("És una matrícula italiana vàlida");
            } else {
                System.out.println("No és una matrícula italiana vàlida");

                if (primerCaracterCorrecte) {
                    System.out.println(primerCaracter + ": Correcte");
                } else if (primerCaracterConteEspecial) {
                    System.out.println(primerCaracter + ": No és una lletra vàlida");
                } else if (Character.isDigit(primerCaracter)) {
                    System.out.println(primerCaracter + ": Ha de ser una lletra");
                } else {
                    System.out.println(primerCaracter + ": Ha de ser majúscula");
                }
                if (segonCaracterCorrecte) {
                    System.out.println(matricula.charAt(1) + ": Correcte");
                } else if (segonCaracterConteEspecial) {
                    System.out.println(segonCaracter + ": No és una lletra vàlida");
                } else if (Character.isDigit(segonCaracter)) {
                    System.out.println(segonCaracter + ": Ha de ser una lletra");
                } else {
                    System.out.println(segonCaracter + ": Ha de ser majúscula");
                }
                if (tercerCaracterCorrecte) {
                    System.out.println(tercerCaracter + ": Correcte");
                } else {
                    System.out.println(tercerCaracter + ": Ha de ser un dígit");
                }
                if (quartCaracterCorrecte) {
                    System.out.println(quartCaracter + ": Correcte");
                } else {
                    System.out.println(quartCaracter + ": Ha de ser un dígit");
                }
                if (cinqueCaracterCorrecte) {
                    System.out.println(cinqueCaracter + ": Correcte");
                } else {
                    System.out.println(cinqueCaracter + ": Ha de ser un dígit");
                }
                if (siseCaracterCorrecte) {
                    System.out.println(matricula.charAt(5) + ": Correcte");
                } else if (siseCaracterConteEspecial) {
                    System.out.println(siseCaracter + ": No és una lletra vàlida");
                } else if (Character.isDigit(siseCaracter)) {
                    System.out.println(siseCaracter + ": Ha de ser una lletra");
                } else {
                    System.out.println(siseCaracter + ": Ha de ser majúscula");
                }
                if (seseCaracterCorrecte) {
                    System.out.println(matricula.charAt(6) + ": Correcte");
                } else if (segonCaracterConteEspecial) {
                    System.out.println(seseCaracter + ": No és una lletra vàlida");
                } else if (Character.isDigit(seseCaracter)) {
                    System.out.println(seseCaracter + ": Ha de ser una lletra");
                } else {
                    System.out.println(seseCaracter + ": Ha de ser majúscula");
                }
            }
        }
    }
}
```
