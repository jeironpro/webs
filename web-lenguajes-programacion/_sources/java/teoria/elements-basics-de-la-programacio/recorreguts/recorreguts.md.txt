# Recorreguts

**Recorreguts**
Els recorreguts són una tècnica fonamental en programació que permet iterar sobre col·leccions de dades (com llistes, matrius o cadenes) o  intervals de valors. Es tracta d'un procès en què es visita cada element d'una seqüencia per aplicar-hi una operació específica, com calcular, modificar, filtrar o simplement mostrar el contingut.

- Components bàsics d'un recorregut
Un recorregut implica els següents components:
1. Punt d'inici: el primer element o valor des del qual comença el recorregut.

- **2.** Condició de continüitat: una regla que determina si el recorregut ha de continuar o finalitzar.

- **3.** Pas o increment: la manera com es mou el recorregut d'un element al següent.

- Tipus bàsic de recorreguts
- Recorreguts númerics amb bucles
Un recorregut númeric és quan es processa un interval de valors utilitzant un bucle.

**Exemple**

```java
for (int i = 1; i <= 10; i++) {
    System.out.println("Número: " + i);
}
```

- Recorreguts niuats
Els bucles niuats són bucles dins d'altres bucles. S'utilitzen per treballar amb dades en múltiples dimesions.

**Exemples**
- Taula de multiplicar

```java
for (int i = 1; i <= 10; i++) {
    for (int j = 1; j <= 10; j++) {
        System.out.println(i * j + "\t");
    }
    System.out.println();
}
```

- Un triangle de *

```java
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.println("*");
    }
    System.out.println();
}
```

- Altres tipus principal de recorreguts:
1. Recorreguts seqüencial: es visiten els elements d'una col·lecció de manera lineal, començant pel primer fins arribar a l'últim. És el recorregut més comú, utilitzat en arrays, llistes i cadenes.

**Exemple**

```java
for (int i = 0; i < array.length; i++) {
    System.out.println(array[i]);
}
```

- **2.** Recorreguts condicionals: es visiten els elements mentre es compleix una condició específica, sovint amb bucles while.

**Exemple**

```java
int i = o;
while (i < array.length && array[i] != 0) {
    System.out.println(array[i]);
}
```

- **3.** Recorreguts amb salt: es poden saltar elements basant-se en condicions, sovint utilitzant continue.

**Exemple**

```java
for (int i = 0; i < array.length; i++) {
    if (array[i] % 2 == 0) {
        continue; // Salta els números parells
    }
    System.out.println(array[i]);
}
```

- **4.** Recorreguts inversos: comencen des de l'últim element fins al primer, útil per treballar amb seqüencies en sentit contrari.

**Exemple**

```java
for (int i = array.length - 1; i >= 0; i--) {
    System.out.println(array[i]);
}
```

- **5.** Recorreguts niuats: es fan servir quan es treballa amb dades multidemensionalsm com matrius. Aquí, es combinen múltiples bucles, un dins d'un altre.

**Exemple**

```java
for (int i = 0; i < matriu.length; i++) {
    for (int j = 0; j < matri[i].length; j++) {
        System.out.println(matriu[i][j]);
    }
}
```

**Considerancions importants**
- Eficiència: els recorreguts poden tenir impacte en el rendiment, especialment amb dades grans. Cal triar l'algorisme i l'estructura adequada.

- Seguretat: evitar errors com bucles infinits o accedir a elements fora dels límits de la col·lecció.

- Modificació durant el recorregut: en estructures com llistes, modificar el contigut durant el recorregut pot generar errors. En aquest casos, s'acostuma a utilitzar iteradors especialitzats.

Un recorregut és una habilitat bàsica però crucial per a qualsevol programador, ja que és la base per treballar amb dades de manera ordenada i estructura.
