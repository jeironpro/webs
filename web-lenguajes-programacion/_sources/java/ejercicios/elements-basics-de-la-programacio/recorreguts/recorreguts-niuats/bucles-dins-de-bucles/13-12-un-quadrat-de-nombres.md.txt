# Ejercicios — 13.12 — Un quadrat de nombres

**Enunciat**

Escriu un programa anomenat QuadratNombres, que demani un enter entre 1 i 9, i "dibuixi" un quadrat amb els nombres del 1 fins el valor de l'entrada.

En cas que l'entrada sigui un valor no vàlid, el programa mostrarà el missatge Valor inadequat.

Per exemple, considera la següent simulació:

**Valor final?**
5
1 2 3 4 5
1 2 3 4 5
1 2 3 4 5
1 2 3 4 5
1 2 3 4 5

Tot i que només se't demana que facis aquest quadrat, i tenint en compte que el codi del programa pràcticament el tens als apunts, et proposo que experimentis una mica amb les possibilitats dels dos bucles.

Algunes propostes d'experiments (fes-les en fitxers diferents del del programa que se't demana!):

Què passa si li treus el salt de línia del bucle extern?

I si li poses salt de línia al print() del recorregut intern?

Què passaria si en comptes de mostrar el valor de columna mostres el de linia?

Què passa si en comptes de mostrar el valor de columna mostres el de linia + columna

I si mostres el de linia * valorFinal + columna ?

I si fas el recorregut de linia o el de columna decreixents?

I si fas que el recorregut de columna comenci en comptes de per 1 per linia?

I si fas que el recorregut de columna finalitzi, en comptes de pel valor final, pel valor de linia?

Què passa si en comptes de mostrar el valor de columna mostres una X si el valor de columna és parell i un · si és senar?

Bé, potser se t'acudeixen fer més experiments. Si vols, pots comentar els resultats amb els teus companys.

```java
public class QuadratNombres {
    public static void main(String[] args) {
        System.out.println("Valor final?");
        int valorFinal = Integer.parseInt(Entrada.readLine());
        
        if (valorFinal > 0 && valorFinal <= 9) {
            for (int i = 1; i <= valorFinal; i++) {
                for (int j = 1; j <= valorFinal; j++) {
                    System.out.print(j);
                }
                System.out.println();
            }
        } else {
            System.out.println("Valor inadequat");
        }
    }
}
```
