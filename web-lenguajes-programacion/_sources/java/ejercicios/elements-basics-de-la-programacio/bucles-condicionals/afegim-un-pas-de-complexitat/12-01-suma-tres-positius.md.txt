# Ejercicios — 12.01 — Suma tres positius

**Enunciat**

Amplia la versió del programa SumaPositius de manera que ara siguin tres en comptes de dos, els valors demanats.

Com a plantilla, et repeteixo el codi que ja tens. Només et cal reemplaçar les █████ per quelcom adequat.

```java
public class SumaPositius {
    public static void main(String[] args) {
```

**// creem la variable on guardarem el resultat de sumar**

```java
        int suma = 0;   // inicialment no hem sumat res i per tant és 0
```

// demanem valors

**// declarem la variable que contindrà els valors llegits**

```java
        int valor;
```

**// processem el primer valor**

```java
        System.out.println("Introdueix el primer valor");
        valor = Integer.parseInt(Entrada.readLine());
        if (valor >= 0) {
            suma = suma + valor;
        }
```

**// processem el segon valor**

```java
        System.out.println("Introdueix el segon valor");
        valor = Integer.parseInt(Entrada.readLine());
        if (valor >= 0) {
            suma = suma + valor;
        }
```

█████ aquí el teu codi

**// mostrem el resultat**

```java
        System.out.println("La suma és " + suma);
    }
}
```

Pots comprovar que estigui bé, tot executant el programa i veient que efectivament demana tres valors i suma només els enters.

```java
public class SumaPositius {
    public static void main(String[] args) {
        int suma = 0;

        int valor;

        System.out.println("Introdueix el primer valor");
        valor = Integer.parseInt(Entrada.readLine());

        if (valor >= 0) {
            suma = suma + valor;
        }

        System.out.println("Introdueix el segon valor");
        valor = Integer.parseInt(Entrada.readLine());

        if (valor >= 0) {
            suma = suma + valor;
        }

        System.out.println("Introdueix el tercer valor");
        valor = Integer.parseInt(Entrada.readLine());
        
        if (valor >= 0) {
            suma = suma + valor;
        }

        System.out.println("La suma és " + suma);
    }
}
```
