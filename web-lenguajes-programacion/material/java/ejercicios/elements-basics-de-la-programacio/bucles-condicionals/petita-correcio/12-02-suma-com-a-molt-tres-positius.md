# Ejercicios — 12.02 — Suma com a molt tres positius

**Enunciat**

Amplia la versió del programa SumaPositius de manera que, en comptes de demanar tres valors sempre, ara només demani fins el primer cop que s'introdueixi un valor negatiu. Encara cal sumar només els positius, és clar.

La versió ampliada es dirà igual que l'original.

Pots comprovar que estigui bé, tot executant el programa ampliat, introduint-li l'entrada següent:

**Introdueix el primer valor**
3
Introdueix el segon valor
-1
La suma és 3

```java
public class SumaPositius {
    public static void main(String[] args) {
        int suma = 0;

        System.out.println("Introdueix el primer valor");
        int valor = Integer.parseInt(Entrada.readLine());

        if (valor >= 0) {
            suma = suma + valor;

            System.out.println("Introdueix el segon valor");
            valor = Integer.parseInt(Entrada.readLine());
        
            if (valor >= 0) {
                suma = suma + valor;

                System.out.println("Introdueix el tercer valor");
                valor = Integer.parseInt(Entrada.readLine());
        
                if (valor >= 0) {
                    suma = suma + valor;
                }
            }
        }
        System.out.println("La suma és " + suma);
    }
}
```
