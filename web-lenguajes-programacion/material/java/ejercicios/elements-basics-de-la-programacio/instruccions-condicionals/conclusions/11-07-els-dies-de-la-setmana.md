# Ejercicios — 11.07 — Els dies de la setmana

**Enunciat**

Desenvolupa un programa que reculli el primer argument de línia de comandes, i respongui segons la taula:

**entrada**
sortida

**1**
Dilluns

**2**
Dimarts

**3**
Dimecres

**4**
Dijous

**5**
Divendres

**6**
Dissabte

**7**
Diumenge

**altre**
Error

**Considera les següents simulacions d'execució**
java DiaSetmana 1
Dilluns

**java DiaSetmana 5**
Divendres

**java DiaSetmana 0**
Error

**java DiaSetmana 8**
Error

Pots suposar que sempre rebrà un valor enter.

```java
public class DiaSetmana {
    public static void main(String[] args) {
        int dia = Integer.parseInt(args[0]);

        if (dia == 1) {
            System.out.println("Dilluns");
        } else if (dia == 2) {
            System.out.println("Dimarts");
        } else if (dia == 3) {
            System.out.println("Dimecres");
        } else if (dia == 4) {
            System.out.println("Dijous");
        } else if (dia == 5) {
            System.out.println("Divendres");
        } else if (dia == 6) {
            System.out.println("Dissabte");
        } else if (dia == 7) {
            System.out.println("Diumenge");
        } else {
            System.out.println("Error");
        }
    }
}
```
