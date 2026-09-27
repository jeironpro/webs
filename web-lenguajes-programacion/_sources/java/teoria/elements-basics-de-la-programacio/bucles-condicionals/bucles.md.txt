# Bucles

**Bucles**
Els bucles en Java permeten repetir una sèrie d'intruccions múltiples vegades, en funció d'una condició o d'un nombre de repeticions. Són essencials per automatitzar tasques repetitives. Els principals bucles en Java són while, for, do-while,i també es poden imbricar (nuiar) bucles per a crear repeticions dins d'altres repeticions.

- **1.** Bucles en general
  Hi ha diversos tipus de bucles en Java, però tots funcionen amb el mateix principi bàsic: mentre una condició es compleixi, el codi dins del bucle es repetirà. Quan la condició ja no és certa, el bucle es trenca i el programa continua amb la següent instrucció.

**Els principals bucles en Java són**
- While: repeteix mentre la condició és true.
- for: repeteix un nombre de vegades predefinit.
- do-while: repeteix almenys una vegade, perquè la condició es comprova després de l'execució.

- **2.** Bucle while
  El bucle while executa les instrucciones mentre la condició sigui true. Si la condició inicial és false, el bucle no s'executa cap vegada.

**Sintaxi**

```java
while (condició) {
```

// Codi a executar mentre la condició sigui certa

```java
}
```

**Exemple**

```java
int i = 0;
while (i < 5) {
    System.out.println("Valor de i: " + i);
    i++;
}
```

**En aquest exemple**
- El bucle s'executa mentre i és menor que 5.
- A cada iteració, i augmenta en 1. El bucle s'atura quan i arriba a 5.

- **3.** Bucle for
  El bucle for s'utilitza quan sabem d'entrada quantes vegades volem que el bucle s'executi. És útil per iterar un nombre fix de vegades.

**Sintaxi**

```java
for (inicialització; condició; increment o decrement) {
```

// Codi a executar

```java
}
```

**Exemple**

```java
for (int i = 0; i < 5; i++) {
    System.out.println("Valor de i: " + i);
}
```

**En aquest exemple**
- int i = 0: inicialitza la variable i.
- i < 5: és la condició que manté el bucle.
- i++: augmenta el valor de i a cada iteració.

Aquest bucle mostrarà els valors de i des de 0 fins a 4.

- **4.** Bucle do-while
  El bucle do-while és similar al while, però es garenteix que s'executarà almenys una vegada, perquè la condició es comprova al final del bucle.

**Sintaxi**

```java
do {
```

// Codi a executar

```java
} while (condicio);
```

**Exemple**

```java
int i = 0;
do {
    System.out.println("Valor de i: " + i);
    i++;
} while (i < 5);
```

**En aquest exemple**
- Es mostrarà el valor de i des de 0 fins a 4, igual que en el cas del while.
- Si i comencés amb un valor més gran que 5, el bucle s'executaria una vegada abans de comprovar la condició.

- **5.** Bucle while niuat
  Es pot col·locar un bucle while dins d'un altre bucle while per crear repeticions dins de repeticions. Això és útil per treballar amb estructures de dades bidimensionals, com ara matrius.

**Exemple**

```java
int i = 0;
while (i < 3) {
    int j = 0;
    while (j < 2) {
        System.out.println("i: " + i + ", j: " + j);
```

j++:

```java
    }
    i++;
}
```

**En aquest exemple**
- El bucle extern (i) controla el nombre de files, mentre que el bucle intern (j) controla el nombre columnes.
- S'imprimeix el valor de i i j en cada combinació posible.

- **6.** Bucle for niuat
  Un for niuat és un bucle for dins d'un altre bucle for. Com en el cas del while niuat, permet crear repeticions múltiples.

**Exemple**

```java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 2; j++) {
        System.out.println("i: " + i + ", j: " + j);
    }
}
```

**En aquest exemple**
- El bucle extern (i) s'executa 3 vegades, i el bucle intern (j) s'executa 2 vegades per a cada valor de i.
- Aixì, es produeixen totes les combinacions de i i j en aquest rang.

**Nota**
El bucles són una eina poderosa, però també cal anar amb compte amb les condicions perquè els bucles infinits poden bloquejar el programa.
