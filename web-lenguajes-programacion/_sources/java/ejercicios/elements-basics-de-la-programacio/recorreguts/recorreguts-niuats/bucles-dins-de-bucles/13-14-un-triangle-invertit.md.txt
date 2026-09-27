# Ejercicios — 13.14 — Un triangle invertit

**Enunciat**

Desenvolupa un programa anomenat TriangleInvertit, que demani un nombre positiu més gran que 0. El programa escriurà una línia per nombre entre el nombre introduït i el 1 (és a dir, decreixentment). A cada línia escriurà tots els nombres des de l’1 fins el nombre corresponent a la línia.

En cas que l'entrada sigui un valor no vàlid, el programa mostrarà el missatge Valor inadequat.

Una simulació:

**Nombre?**
5
1, 2, 3, 4, 5
1, 2, 3, 4
1, 2, 3
1, 2
1

Fixa't que aquest problema és molt similar al del triangle de nombres. En aquest cas, a banda de que els nombres es mostren de manera diferent, apareixen separats per comes.

```java
public class TriangleInvertit {
    public static void main(String[] args) {
        System.out.println("Nombre?");
        int valor = Integer.parseInt(Entrada.readLine());

        if (valor > 0) {
            for (int i = valor; i >= 1; i--) {
                for (int j = 1; j <= i; j++) {
                    if (j < i) {
                        System.out.print(j + ", ");
                    } else {
                        System.out.print(j);
                    }
                }
                System.out.println();
            }
        } else {
            System.out.println("Valor inadequat");
        }
    } 
}
```
