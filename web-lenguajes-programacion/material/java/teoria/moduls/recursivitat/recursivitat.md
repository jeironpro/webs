# Recursivitat

**Rercursivitat**
La recursivitat és un tècnica de programació on una funció es crida a si mateixa per resoldre un problema dividint-lo en subproblemes més petits.

Una funcío recursiva és una funció que, dins del seu cos, es torna a cridar a si mateixa amb nous valors d'entrada.

Perquè funcioni correctament, ha de complir dues condicions:
1. Cas base (o cas de parada): és la condició que fa que la recursió s'aturi.
2. Crida recursiva: la funció es torna a cridar amb un problema més petit.

**Exemple 1**

```java
public class Exemple {
    public static int factorial(int n) {
        if (n == 0) {
            return 1; // Cas base
        } else {
            return n * factorial(n-1); // Crida recursiva
        }
    }

    public static void main(String[] args) {
        System.out.println(factorial(5)); // 120
    }
}
```

**Avantatges i inconvenients de la recursivitat**
Avantatges
- El codi pot ser més senzill i elegant per a problemes naturals com arbres, seqüències, etc.

- Ideal per a problemes definits recursivament (com el factorial, la sèrie de Fibonacci, recurreguts d'arbres...).

**Inconvenients**
- Pot consumir molta memòria si hi ha moltes crides recursives (stack overflow).

- En alguns casos és menys eficient que una solució iterativa.

**Diferència entre recursivitat i iteració**
Recursivitat                     Iteració
Crida a la mateixa funció        Ús de bucles (for, while)
Més elegant per alguns casos     Solució més eficient generalment
Pot ser més lenta                Normalment més ràpdia

**Exemple 2**

```java
public class Exemple {
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n; // Cas base
        } else {
            return fibonacci(n-1) + fibonacci(n-2); // Crides recursives
        }
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(6));  // 8
    }
}
```

**Recursivitat i la pila (Stack)**
Quan una funció es crida a si mateixa de manerea recursiva, Java utilitza una estructura de dades anomenada pila (Stack) per gestionar les crides. Aquesta pila és la pula de crides (call stack).

El call stack és una estructura LIFO (Last In, First Out) on es guarden les crides actives de funcions o mètodes.

**Cada vegade que una funció es crida**
- Es crea un marc de pila (stack frame) amb les seves dades (paràmetres, variables locals, retorns...).

- Aquest marc es posa al damunt de la pila.

**Quan la funció acaba**
- Es treu el seu marc de la pila.

- L'execució torna a la funció que la va cridar.

Quan una funció es crida a si mateixa, cada crida recursiva posa un nou marc de pila a sobre del precedent.

**Exemple factorial de 3**
factorial(3)
-> 3 * factorial(2)
-> 2 * factorial(1)
-> 1 * factorial(0)
-> 1 (cas base)

**Representació del stack (de baix a dalt)**
factorial(0) -> retorna 1
factorial(1) -> 1 * 1 = 1
factorial(2) -> 2 * 1 = 2
factorial(3) -> 3 * 2 = 6

Cada nivel espera el resultat de la següent crida per completar la seva pròpia operació. Quan s'arriba al cas base, s'inverteix el procés i els marcs es van traient de la pila un per un.

**StackOverFlowError**
Si no hi ha cas base o si les crides recursives són massa profundes, la pila es desborda i Java llança un error:
Exception in thread "main" java.lang.StackOverFlowError
Això passa perquè cada crida ocupa espai en la pila, i la pila té capacitat limitada.

**Comparació Recursió vs Iteració en Stack**
Recursivitat                       Iteració
Utilitza el call stack             No utilitza call stack
Pot causar StackOverFlow           No causa StackOverFlow
Elegant i clara (per ex. arbres)   Eficaç en consum de memòria

**Crida recursiva**
factorial(3)
→ factorial(2)
→ factorial(1)
→ factorial(0)
→ retorna 1
← torna 1 * 1
← torna 2 * 1
← torna 3 * 2
→ resultat final: 6

**Variants de la recursivitat**
1. Recursivitat directa
Quan una funció es crida a si mateixa dins del seu propi cos.

```java
public int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);  // crida directa
}
```

- **2.** Recursivitat indirecta
  Quan una funció crida una altra funció, i aquesta última torna a cridar la primera.

```java
public void funcioA(int n) {
    if (n > 0) funcioB(n - 1);
}

public void funcioB(int n) {
    if (n > 0) funcioA(n - 1);
}
```

- **3.** Recursivitat de cua (tail recursion)
  És una recursivitat on la última operació que fa la funció és la crida recursiva.
→ Aquesta forma és optimitzable per alguns compiladors (no per la JVM actualment), i pot ser més eficient en altres llenguatges.

```java
public int suma(int n, int acumulat) {
    if (n == 0) return acumulat;
    return suma(n - 1, acumulat + n);  // última operació: crida
}
```

- **4.** Recursivitat múltiple
  Quan la funció es crida a si mateixa més d’una vegada en cada pas.

```java
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);  // dues crides recursives
}
```

**Ordres**
1. Preordre (prefix)
Visita: node actual → subarbre esquerre → subarbre dret

Ordre: A B D E C F

```java
void preordre(Node node) {
    if (node != null) {
        visitar(node);               // primer el node
        preordre(node.esquerra);     // després l’esquerra
        preordre(node.dreta);        // i finalment la dreta
    }
}
```

- **2.** Inordre (infix)
  Visita: subarbre esquerre → node actual → subarbre dret
(Aquest és el recorregut natural per obtenir els valors ordenats si l’arbre és un BST)

Ordre: D B E A C F

```java
void inordre(Node node) {
    if (node != null) {
        inordre(node.esquerra);     // primer l’esquerra
        visitar(node);              // després el node
        inordre(node.dreta);        // i després la dreta
    }
}
```

- **3.** Postordre (postfix)
  Visita: subarbre esquerre → subarbre dret → node actual

Ordre: D E B F C A

```java
void postordre(Node node) {
    if (node != null) {
        postordre(node.esquerra);   // primer l’esquerra
        postordre(node.dreta);      // després la dreta
        visitar(node);              // i finalment el node
    }
}
```
