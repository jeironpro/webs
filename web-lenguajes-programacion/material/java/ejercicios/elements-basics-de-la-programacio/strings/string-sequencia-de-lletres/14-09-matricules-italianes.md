# Ejercicios — 14.09 — Matricules italianes

**Enunciat**

Les matrícules dels vehicles a Europa han anat canviant al llarg de la història. Cada cop hi ha més vehicles i la gent es mou més entre paisos, s'ha fet necessària una certa estandardització.

Prenem pel cas les matrícules italianes que, des del 1994 tenen el següent aspecte:
_images/una_matricula_italiana.png

Exemple de matrícula italiana

Ja et podràs imaginar que calen molts programes per poder realitzar la gestió informatitzada de les matrícules, oi?

Una d'aquestes necessitats és saber si una matrícula és vàlida o no. Aquest és l'objectiu d'aquest exercici!
Què hem de fer?

Desenvolupa un programa que demani a l'usuari una matrícula i li digui si el que li ha introduït correspon a una matrícula italiana vàlida en el format vigent.

Per simplicitat, no considerarem ni el codi del país, ni altres marques com ara l'any de matriculació o el codi de província.

Una matrícula vàlida està formada per:

dues lletres inicials

tres dígits

dues lletres finals

Les lletres poden ser qualsevol lletra majúscula sense caràcters especials com Ç, À, Ñ o ß, i exceptuant les lletres que porten a confusió I, O, Q i U.

Considera les següents simulacions:

**java MatriculaValida**
Introduïu una matrícula
DD029YJ
És una matrícula italiana vàlida

**java MatriculaValida**
Introduïu una matrícula
0291BYJ
No és una matrícula italiana vàlida

Pista: Aquest exercici et pot obligar a fer moltes condicions i el teu codi, molt probablement semblarà molt repetitiu. Per no complicar-te massa la vida, et proposo que intentis jugar amb la indentació, de manera que puguis copiar i enganxar còmodament el codi duplicat.

No pateixis per la duplicació. Aviat veurem maneres d'evitar-la en aquest tipus de problemes.

Ah! I si et preocupa com mirar si un caràcter correspon o no amb una de les lletres de l'alfabet, torna a fer una ullada al tema Tipus de tipus on tens una bona pista de com gestionar-ho.

```java
public class MatriculaValida {
    public static void main(String[] args) {
        System.out.println("Introduïu una matrícula");
        String matricula = Entrada.readLine();

        String noAccept = "ÇÀÑßIOQU";
        boolean esValida = false;

        for (int i = 0; i < matricula.length(); i++) {
            for (int j = 0; j < noAccept.length(); j++) {
                if (matricula.charAt(i) != noAccept.charAt(j)) {
                    if (Character.isUpperCase(matricula.charAt(0)) && Character.isUpperCase(matricula.charAt(1))) {
                        if (Character.isDigit(matricula.charAt(2)) && Character.isDigit(matricula.charAt(3)) && Character.isDigit(matricula.charAt(4))) {
                            if (Character.isUpperCase(matricula.charAt(5)) && Character.isUpperCase(matricula.charAt(6))) {
                                esValida = true;
                            }
                        }
                    }
                }
            }
        }
        if (esValida) {
            System.out.println("És una matrícula italiana vàlida");
        } else {
            System.out.println("No és una matrícula italiana vàlida");
        }
    }
}
```
