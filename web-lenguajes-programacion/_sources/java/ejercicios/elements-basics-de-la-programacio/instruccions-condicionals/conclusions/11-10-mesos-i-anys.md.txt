# Ejercicios — 11.10 — Mesos i anys

**Enunciat**

Desenvolupa un programa que demani un mes i un any, i escrigui el mes anterior i el mes següent.

Exemple d'interacció:

**java MesosAnys**
Mes?
10
Any?
2022
Mes anterior 9/2022 i mes següent 11/2022

Pots suposar que l'entrada sempre serà un més i un any correcte

```java
public class MesosAnys {
    public static void main(String[] args) {
        System.out.println("Mes?");
        int mes = Integer.parseInt(Entrada.readLine());

        System.out.println("Any?");
        int any = Integer.parseInt(Entrada.readLine());

        switch (mes) {
            case 1 -> System.out.println("Mes anterior 12" + "/" + (any-1) + " i " + " mes següent " + (mes+1) + "/" + any);
            case 12 -> System.out.println("Mes anterior " + (mes-1)  + "/" + any + " i " + " mes següent " + "1/" + (any+1));
            default -> System.out.println("Mes anterior " + (mes-1)  + "/" + any + " i " + " mes següent " + (mes+1) + "/" + any);
        }
    }
}
```
