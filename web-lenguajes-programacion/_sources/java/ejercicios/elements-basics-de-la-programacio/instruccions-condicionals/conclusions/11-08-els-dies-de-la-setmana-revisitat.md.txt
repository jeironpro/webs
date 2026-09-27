# Ejercicios — 11 08. Els dies de la setmana (revisitat)

**Enunciat**

A banda de l'estructura condicional if…else, Java ens ofereix una altra anomenada switch.

Aquesta estructura permet expressar d'una manera més compacta instruccions condicionals amb múltiples condicions sobre la mateixa expressió. En altres paraules, switch no ens ofereix més funcionalitats de les que teníem amb if…else però el codi pot resultar més llegible. Per aquesta raó, el trobarem sovint, no només en codis Java sinó d'altres llenguatges (no en tots)

Pots trobar una descripció detallada del seu funcionament a la documentació oficial de Java: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html

Un cop ho hagis consultat, considera un altre cop l'exercici dels dies de la setmana. Crea una nova versió, en aquesta ocasió fent servir switch.

El nou nom del programa serà DiaSetmanaSwitch.

Si t'agrada com queda, pots fer servir aquesta nova estructura condicional en tots aquells exercicis que consideris convenient.

```java
public class DiaSetmanaSwitch {
    public static void main(String[] args) {
        int dia = Integer.parseInt(args[0]);

        switch (dia) {
            case 1:
                System.out.println("Dilluns");
                break;
            case 2:
                System.out.println("Dimarts");
                break;
            case 3:
                System.out.println("Dimecres");
                break;
            case 4:
                System.out.println("Dijous");
                break;
            case 5:
                System.out.println("Divendres");
                break;
            case 6:
                System.out.println("Dissabte");
                break;
            case 7:
                System.out.println("Diumenge");
                break;
            default:
                System.out.println("Error");
                break;
        }
    }
}
```
