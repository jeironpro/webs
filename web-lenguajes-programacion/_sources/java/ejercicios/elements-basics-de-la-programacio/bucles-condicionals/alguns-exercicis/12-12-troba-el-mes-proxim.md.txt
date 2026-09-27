# Ejercicios — 12.12 — Troba el mes proxim

**Enunciat**

Aquest repte consisteix en desenvolupar un programa anomenat TrobaMesProxim, que començarà demanant un valor (l'àncora) i després un seguit de nombres. Finalment el programa indicarà quin dels nombres introduïts és més pròxim a l'àncora.

Tant l'ancora com la resta de valors vàlids seran enters positius. En cas que s'especifiqui una àncora no positiva, es finalitzarà l'execució.

Per la resta de valors, després de l'àncora, el programa implementarà el patró del lloro, que s'aturarà amb el primer enter negatiu.

Finalment, mostrarà el valor enter positiu introduït, més proper a l'àncora.

En cas que hi hagi dos o més valors introduïts que estiguin a la mateixa distància, el programa es quedarà amb el més petit.

En cas que no s'hagi introduït cap valor positiu, s'indicarà.

Exemples d'execució:

**Introdueix l'àncora**
20
Introdueix un valor
12
Introdueix un valor
10
Introdueix un valor
24
Introdueix un valor
-1
El valor introduït més pròxim a 20 és 24

**Introdueix l'àncora**
11
Introdueix un valor
12
Introdueix un valor
10
Introdueix un valor
24
Introdueix un valor
-1
El valor introduït més pròxim a 11 és 10

Nota: fixa't que a l'exemple, els valors 10 i 12 són iguals de pròxims a 11. Així, TrobaMesProxim retorna el menor, en aquest cas, 10.

**Introdueix l'àncora**
-12
Àncora no vàlida

**Introdueix l'àncora**
10
Introdueix un valor
-1
No s'ha introduït cap valor positiu

```java
public class TrobaMesProxim {
    public static void main(String[] args) {
        System.out.println("Introdueix l'àncora");
        int ancora = Integer.parseInt(Entrada.readLine());

        if (ancora < 0) {
            System.out.println("Àncora no vàlida");
        } else {
            System.out.println("Introdueix un valor");
            int valor = Integer.parseInt(Entrada.readLine());

            if (valor < 0) {
                System.out.println("No s'ha introduït cap valor positiu");
            } else {
                int valorMesProxim = valor;
                int distancia = Math.abs(ancora - valor);

                while (valor > 0) {
                    int distanciaNova = distancia;
                    distancia = Math.abs(ancora - valor);

                    if (distancia == distanciaNova && valor < valorMesProxim) {
                        valorMesProxim = valor;
                    }

                    if (distancia < distanciaNova) {
                        valorMesProxim = valor;
                    }
                    
                    System.out.println("Introdueix un valor");
                    valor = Integer.parseInt(Entrada.readLine());
                }
                System.out.println("El valor introduït més pròxim a " + ancora +  " és " + valorMesProxim);
            }
        }
    }
}
```
