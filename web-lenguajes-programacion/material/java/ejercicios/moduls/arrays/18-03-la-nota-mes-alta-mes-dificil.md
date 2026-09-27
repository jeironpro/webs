# Ejercicios — 18.03 — La nota mes alta (mes dificil)

**Enunciat**

Desenvolupa una nova versió del programa anterior. Aquest cop, el programa canviarà novament el missatge de sortida, tot indicant només les notes introduïdes que no corresponen a la més alta.

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
La nota més alta és 9. La resta de notes és: 5, 1, 3, 7, 1 i 8

**Introdueix les notes (-1 per finalitzar)**
8
10
-1
La nota més alta és 10. La resta de notes és: 8

**Introdueix les notes (-1 per finalitzar)**
9
9
-1
La nota més alta és 9. No queda cap altra nota.

Nota

Per passar totes les proves, realitza aquest exercici fent servir exclusivament les eines que hem treballat durant aquest curs, incloent qualsevol funcionalitat dels Strings.

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
            String notesNetejat = extreuMesAlta(notesIntroduides, notaMesAlta);
            if (notesNetejat.isEmpty()) {
                System.out.printf("La nota més alta és %d. No queda cap altra nota.%n", notaMesAlta);
                return;
            }

            if (notesNetejat.length() >= 3) {
                String notesFormatat = formateaNotes(notesNetejat);
                System.out.printf("La nota més alta és %d. La resta de notes és %s%n", notaMesAlta, notesFormatat);
                return;
            }
        }
    }

    public static String formateaNotes(String notes) {
        String notesFormatat = "";
        if (notes.length() > 5) {
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
        } else {
            for (int i = 0; i < notes.length(); i++) {
                char c = notes.charAt(i);

                if (Character.isDigit(c)) {
                    notesFormatat += c;
                }
            }
        }
        return notesFormatat;
    }

    public static String extreuMesAlta(String notes, int notaMesAlta) {
        String notesSenseMesAlta = "";
        String nota = "";
        
        for (int i = 0; i < notes.length(); i++) {
            char c = notes.charAt(i);
            
            if (Character.isDigit(c)) {
                nota += c;
            } else {
                if (!nota.isEmpty()) {
                    int notaEnter = Integer.parseInt(nota);

                    if (notaEnter != notaMesAlta) {
                        notesSenseMesAlta += notaEnter + ", ";
                    }
                }
                nota = "";
            }
        }

        return notesSenseMesAlta;
    }
}
```
