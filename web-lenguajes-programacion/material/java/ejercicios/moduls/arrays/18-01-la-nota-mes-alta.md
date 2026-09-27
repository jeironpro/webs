# Ejercicios — 18.01 — La nota mes alta

**Enunciat**

Desenvolupa un programa que vagi demanant les notes obtingudes pels estudiants de programació en el darrer examen (com a mínim dues) i indiqui quina ha estat la nota més alta.

Les notes estaran representades en base 10 i, per tant, els valors vàlids són els números enters del 1 fins el 10.

El programa deixarà de recollir notes quan rebi un valor negatiu.

Finalment, el programa mostrarà quina ha estat la nota més alta.

Considera les següents simulacions:

**Introdueix les notes (-1 per finalitzar)**
5
1
3
9
7
9
1
8
-1
La nota més alta és 9

**Introdueix les notes (-1 per finalitzar)**
8
9
-1
La nota més alta és 9

**Introdueix les notes (-1 per finalitzar)**
8
-1
Com a mínim calen dues notes

Per simplicitat, podem suposar que només ens introduiran notes vàlides o -1.

Nota

Per passar totes les proves, realitza aquest exercici fent servir exclusivament les eines que hem treballat durant aquest curs.

```java
public class NotaMesAlta {
    public static void main(String[] args) {
        System.out.println("Introdueix les notes (-1 per finalitzar)");

        int notaMesAlta = 0;
        int comptador = 0;

        while (true) {
            int nota = Integer.parseInt(Entrada.readLine());

            if (nota == -1) { break; }

            if (nota > 0 && nota <= 10) {
                if (nota > notaMesAlta) {
                    notaMesAlta = nota;
                }
                comptador++;
            }
        }
        if (comptador < 2) {
            System.out.println("Com a mínim calen dues notes");
        } else {
            System.out.printf("La nota més alta és %d%n", notaMesAlta);
        }
    }
}
```
