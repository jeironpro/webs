# Ejercicios — 18.02 — La nota mes alta (no tan facil)

**Enunciat**

Desenvolupa una nova versió del programa anterior. Aquest cop, el programa, a banda de mostrar la nota màxima, indicarà també les notes introduïdes.

Considera la simulació següent:

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
La nota més alta és 9 de les introduïdes: 5, 1, 3, 9, 7, 9, 1 i 8

**Introdueix les notes (-1 per finalitzar)**
8
9
-1
La nota més alta és 9 de les introduïdes: 8 i 9

Aquesta versió es comportarà com l'anterior quan el programa rep menys de dues notes.

Truc

Fixa't que en aquest cas ens caldrà guardar d'alguna manera les notes que anem rebent per poder-les mostrar al final.

Nota

Per passar totes les proves, realitza aquest exercici fent servir exclusivament les eines que hem treballat durant aquest curs.

```java
public class NotaMesAlta {
    public static void main(String[] args) {
        System.out.println("Introdueix les notes (-1 per finalitzar)");

        int notaMesAlta = 0;
        int comptador = 0;
        String notesIntroduides = "";

        while (true) {
            int nota = Integer.parseInt(Entrada.readLine());

            if (nota == -1) { break; }

            if (nota > 0 && nota <= 10) {
                if (nota > notaMesAlta) {
                    notaMesAlta = nota;
                }
                notesIntroduides += nota + ", ";
                comptador++;
            }
        }
        if (comptador < 2) {
            System.out.println("Com a mínim calen dues notes");
        } else {
            System.out.printf("La nota més alta és %d de les introduïdes %s%n", notaMesAlta, formateaNotes(notesIntroduides));
        }
    }

    public static String formateaNotes(String notes) {
        String notesFormatat = "";
        int longitudNotes = notes.length()-5;
        
        for (int i = 0; i < longitudNotes; i++) {
            notesFormatat += notes.charAt(i);    
        }
        notesFormatat += " i ";
        
        for (int i = longitudNotes; i < notes.length(); i++) {
            if (Character.isDigit(notes.charAt(i))) {
                notesFormatat += notes.charAt(i);
            }
        }
        return notesFormatat;
    }
}
```
