# Ejercicios — 10.09 — Calculadora basica

**Enunciat**

Desenvolupa una calculadora bàsica

El programa demanarà dos nombres enters i mostrarà el resultat de sumar-los, restar el segon al primer, multiplicar-los i dividir el primer pel segon

No ens preocuparem si els usuaris ens introdueixen valors que no siguin adequats, com per exemple lletres o una divisió per zero.

Aquí tens una plantilla pel teu codi. Pots copiar-la i enganxar-la al teu editor pel fitxer CalculadoraBasica.java. Únicament hauràs de reemplaçar els comentaris █████ pel codi corresponent.

* Aquest programa implementa una calculadora bàsica

* Demana dos nombres per entrada estàndard i mostra el
* resultat de sumar-los, restar-li el segon al primer, multiplicar-los,
* dividir el primer entre el segon.

* El programa no controla valors no adequats d'entrada

```java
public class CalculadoraBasica {
    public static void main(String[] args) {
```

**// obté operands d'entrada**

```java
        System.out.println("Primer operand:");
        int primerOperand = Integer.parseInt(Entrada.readLine());
        System.out.println("Segon operand:");
        int segonOperand = Integer.parseInt(Entrada.readLine());
```

**// operacions**

```text
        int suma = primerOperand + segonOperand;
        int resta = primerOperand █████ segonOperand;
        int multiplicacio = █████;
        █████;
```

**// mostra resultats**

```text
        System.out.println(primerOperand + " + " + segonOperand + " = " + suma);
        System.out.println(primerOperand + █████ + segonOperand + " = " + resta);
        System.out.println(primerOperand + █████ + segonOperand + " = " + █████);
        System.out.println(█████);
    }
}
```

Quan l'executis hauràs d'introduir dos nombres i et mostrarà el resultat per cada operació. Una simulació de l'execució és:

**java CalculadoraBasica**
Primer operand:
3
Segon operand:
5
3 + 5 = 8
3 - 5 = -2
3 * 5 = 15
3 / 5 = 0

```java
public class CalculadoraBasica {
    public static void main(String[] args) {
        System.out.println("Primer operand:");
        int primerOperand = Integer.parseInt(Entrada.readLine());
        System.out.println("Segon operand:");
        int segonOperand = Integer.parseInt(Entrada.readLine());

        System.out.println(primerOperand + " + " + segonOperand + " = " + (primerOperand + segonOperand));
        System.out.println(primerOperand + " - " + segonOperand + " = " + (primerOperand - segonOperand));
        System.out.println(primerOperand + " * " + segonOperand + " = " + (primerOperand * segonOperand));
        System.out.println(primerOperand + " / " + segonOperand + " = " + (primerOperand / segonOperand));
    }
}
```
