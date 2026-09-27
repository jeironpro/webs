# Ejercicios — 18.04 — La nota mes alta (impossible?)

**Enunciat**

Desenvolupa una nova versió del programa anterior. Aquest cop, es tracta de fer que les notes descartades quedin ordenades de major a menor i sense repetits.

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
La nota més alta és 9. La resta de notes és: 8, 7, 5, 3 i 1

**Introdueix les notes (-1 per finalitzar)**
9
9
-1
La nota més alta és 9. No queden altres notes

Nota

Resol aquest repte amb les mateixes restriccions que a l'exercici anterior.

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
                notesIntroduides += nota + ",";
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
                String notesFormatat = eliminaRepetit(notesNetejat);
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
                        notesSenseMesAlta += notaEnter + ",";
                    }
                }
                nota = "";
            }
        }

        return notesSenseMesAlta;
    }

    public static String eliminaRepetit(String notes) {
        String notaPerEnter = "";
        String notaSeparar = "";

        for (int i = 0; i < notes.length(); i++) {
            char c = notes.charAt(i);

            if (Character.isDigit(c)) {
                notaPerEnter += c;
            } else if (!notaPerEnter.isEmpty()) {
                int notaEnter = Integer.parseInt(notaPerEnter);
                if (!esSubstring(notaSeparar, "" + notaEnter)) {
                    notaSeparar += notaEnter + ",";
                }
                notaPerEnter = "";
            }
        }
        return ordenarMayorAMenor(notaSeparar);
    }

    public static String ordenarMayorAMenor(String notes) {
        String notesOrdenat = "";
        
        while (!notes.isEmpty()) {
            String notaMajor = "";
            String notaTemp = "";
            int notaComparar = 0;
            int nota = 0;
            int posNota = 0;
            
            for (int i = 0; i < notes.length(); i++) {
                char c = notes.charAt(i);
                
                if (c != ',') {
                    notaTemp += c;
                } else if (!notaTemp.isEmpty()) {
                    nota = Integer.parseInt(notaTemp);
                    if (nota > notaComparar) {
                        notaComparar = nota;
                        notaMajor = notaTemp;
                        posNota = i-1;
                    }
                    notaTemp = "";
                }
            }
            
            notesOrdenat += notaMajor + ", ";

            int posNotaMajor = notaMajor.length()+1;

            if (notes.startsWith(notaMajor)) {
                notes = notes.substring(posNotaMajor);
            } else if (notes.endsWith(notaMajor)) {
                notes = notes.substring(0, posNotaMajor);
            } else {
                if (posNota > 0) {
                    notes = notes.substring(0, posNota) + notes.substring(posNota + posNotaMajor);
                }
            }
        }
        return formateaNotes(notesOrdenat);
    }

    public static boolean esSubstring(String text, String subtext) {
        if (text.length() == 0 || subtext.length() > text.length()) {
            return false;
        }

        if (text.length() > 0 && subtext.length() == 0) {
            return true;
        }

        for (int i = 0; i < text.length(); i++) {
            int igualtat = 0;
            for (int j = 0; j < subtext.length(); j++) {
                if (i + igualtat < text.length()) {
                    if (text.charAt(i + igualtat) == subtext.charAt(j)) {
                        igualtat++;
                    }
                } else {
                    break;
                }
                if (igualtat == subtext.length()) {
                    return true;
                }
            }
        }
        return false;
    }
}
```
