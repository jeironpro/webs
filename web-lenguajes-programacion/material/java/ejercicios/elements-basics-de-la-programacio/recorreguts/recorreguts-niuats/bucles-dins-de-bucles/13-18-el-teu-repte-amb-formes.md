# Ejercicios — 13.18 — El teu repte amb formes

**Enunciat**

T'has quedat amb les ganes de definir una forma? És la teva oportunitat d'impressionar els teus companys i, encara millor, a tu mateix/mateixa!

Et proposo que construeixis la solució en forma d'exercici, amb el seu enunciat i els jocs de prova, tal i com si fos un exercici més dels que has vist anteriorment. Si resulta interessant, podria ser que el trobis afegit a aquests apunts associat amb el teu nom!

```java
/* Aquest programa dibuixa una estrella, amb un aspecte semblant a l'estrella de
* David, s'utilitzen les bases del programa triangles, i s'ajusta fins a
* aconseguir l'objectiu. 
* No puc fer-ho com un exercici habitual perquè no es mostraria de manera
* correcta.
*/

public class Estrella {
    public static void main(String[] args) {
        for(int i = 13; i >= 0; i--) {
            System.out.print(" ");
            if (i >= 3 && i <= 13) {
                for (int j = 3; j < i; j++) {
                    if (i == 10) {
                        System.out.print("*");
                    } else if (i == 9 && j >= 4) {
                        System.out.print("*");
                    } else if (i == 8 && j >= 5) {
                        System.out.print("*");
                    } else if (i == 7 && j >= 6) {
                        System.out.print("*");
                    } else {
                        System.out.print(" ");                
                    }
                }
                for (int j = i; j <= 13; j++) {
                    System.out.print("*");
                }
                for (int j = 12; j >= i; j--) {
                    System.out.print("*");
                }
                
                for (int j = 3; j < i; j++) {
                    if (i == 10) {
                        System.out.print("*");
                    } else if (i == 9 && j <= 7) {
                        System.out.print("*");
                    } else if (i == 8 && j <= 5) {
                        System.out.print("*");
                    } else if (i == 7 && j <= 3) {
                        System.out.print("*");
                    } else {
                        System.out.print(" ");                
                    }
                }            
            } else {
                for (int j = 0; j < 21; j++) {
                    if (i == 2) {
                        if (j <= 7 || j >= 13) {
                            System.out.print(" ");
                        } else {
                            System.out.print("*"); 
                        }
                    } else if (i == 1) {
                        if (j <= 8 || j >= 12) {
                            System.out.print(" ");
                        } else {
                            System.out.print("*"); 
                        }
                    } else if (i == 0) {
                        if (j <= 9 || j >= 11) {
                            System.out.print(" ");
                        } else {
                            System.out.print("*"); 
                        }
                    }
                }
            }
            System.out.println();
        }
    }
}
```
