# Taules

**Taules**
En Java, un array és una estructura que emmagatzema múltiples valors del mateix tipus en una seqüencia ordenada.

**Arrays d'una dimensió**
Un array d'una dimensió és una llista lineal d'elements del mateix tipus.

**Declaració i inicalització**

```java
int[] numeros = {10, 20, 30, 40}; // Declaració i inicialització

int[] edats = new int[3]; // Array buit amb 3 posicions
```

**Accés als elements**

```java
System.out.println(numeros[0]); // 10
edats[0] = 25;
System.out.println(edats[0]); // 25
```

**Recórrer un array**

```java
for (int i = 0; i < numeros.length; i++) {
    System.out.println(numeros[i]);
}
```

**Arrays de dues dimensions (matrius)**
Un array de dues dimensions és una taula on cada posició conté un altre array.

**Declaracio i inicialització**

```java
int[][] matriu = {
    {1, 2, 3},
    {4, 5, 6}
};
```

Aquesta matriu té 2 files i 3 columnes.

**Accés als elements**

```java
System.out.println(matriu[0][1]); // 2 (primera fila, segona columna)
```

**Recórrer una matriu**

```java
for (int i = 0; i < matriu.length; i++) { // Recorre les files
    for (int j = 0; j < matriu[i].length; j++) { // Recorre les columnes
        System.out.println(matriu[i][j] + " ");
    }
    System.out.println();
}
```

**Notes**
1. Un array d'una dimensió és una llista d'elements del mateix tipus.

- **2.** Un array de dues dimensions és una matriu amb files i columnes.

- **3.** S'accedeix als elements amb nomArray[index] o nomMatriu[fila][columna].
