# Ejercicios — 13.13 — Un triangle de nombres

**Enunciat**

Desenvolupa un programa anomenat TriangleNombres, que demani un enter entre el 1 i el 9. El programa escriurà una línia per nombre entre el 1 i el nombre introduït (es a dir, creixentment). A cada línia escriurà tots els nombres des del nombre corresponent a la línia fins al 1.

En cas que l'entrada sigui un valor no vàlid, el programa mostrarà el missatge Valor inadequat.

Una simulació:

**Nombre?**
5
1
21
321
4321
54321

Pista: si has fet els experiments de l'exercici del quadrat de nombres, aquesta pista no et cal. En cas contrari, a banda de recomanar-te molt que els facis, considera:

El recorregut extern de quina línia a quina línia ha de dibuixar

El recorregut intern de quin valor a quin valor dibuixa per la primera línia

I per la segona?

I per la línia número 4?

Potser veuràs que sempre comença pel número de línia i acaba per 1. Mmmm

```java
public class TriangleNombres {
    public static void main(String[] args) {
        System.out.println("Nombre?");
        int valor = Integer.parseInt(Entrada.readLine());
    
        if (valor > 0 && valor <= 9) {
            for (int i = 1; i <= valor; i++) {
                for (int j = i; j >= 1; j--) {
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
