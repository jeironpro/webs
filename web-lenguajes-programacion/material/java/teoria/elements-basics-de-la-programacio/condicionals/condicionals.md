# Condicionals

**Condicionals**
Els condicionals en Java permeten que el programa prengui decisions en funció de certes condicions. Això ens permet controlar el flux d'execució segons els valor de les variables o els resultats de les expressions.

**Tipus de condicionals en Java**
1. if
2. if-ele
3. if-else if-else
4. switch

- **1.** Estructura if
  L'estructura if executa un bloc de codi només si una condició és true. Si la condició és false, el codi dins del blocs no s'executa.

**Sintaxis**

```java
if (condicio) {
```

// Codi a executar si la condició és certa

```java
}
```

**Exemple**

```java
int edat = 21;

if (edat >= 18) {
    System.out.println("Ets major d'edat.");
}
```

En aquest exemple, només es mostrarà "Ets major d'edat." si edat és 18 o superior.

- **2.** Estructura if-else
  L'estructura if-else permet afegir una alternativa si la condició no es compleix. Si la condició és true, s'executa el primer bloc de codi. Si és false, s'executa el bloc else.

**Sintaxi**

```java
if (condicio) {
```

// Codi a executar si la condició és certa

```java
} else {
```

// Codi a executar si la condició és certa

```java
}
```

**Exemple**

```java
int edat = 16;

if (edat >= 18) {
    System.out.println("Ets major d'edat.");
} else {
    System.out.println("Ets menor d'edat.");
}
```

En aquest exemple, si edat és inferior a 18, es mostrarà "Ets menor d'edat."

- **3.** Estructura if-else if-else
  L'estructura if-else if-else permet avaluar múltiples condicions en seqüencia. Quan es troba una condició true, el bloc associat s'executa, i la resta de condicions s'ignoren. Si cap condició és true, s'executa el bloc else.

**Sintaxis**

```java
if (condicio1) {
```

// Codi a executar si condicio1 és certa

```java
} else if (condicio2) {
```

// Codi a executar si cap de les condicions anteriors és certa

```java
} else {
```

// Codi a executar si cap de les condicions anteriors és certa

```java
}
```

**Exemple**

```java
int nota = 85;

if (nota >= 90) {
    System.out.println("Excel·lent");
} else if (nota >= 75) {
    System.out.println("Aprovat");
} else {
    System.out.println("Suspés");
}
```

En aquest exemple, si nota és 85, es mostrarà "Aprovat"

- **4.** Estructura switch
  L'estructura switch s'utilitza quan tenim múltiples valors possibles per a una variable i volem executar diferents blocs de codi segons cada valor. És especialment útil per simplificar el codi quan hi ha moltes opcions.

**Sintaxis**

```java
switch (variable) {
```

case valor1:
// Codi a executar si la variable és igual a valor1

```java
        break;
```

case valor2:
// Codi a executar si la variable és igual a valor2

```java
        break;
```

default:
// Codi a executar si cap cas és satisfet

```java
        break;
}
```

**Exemple**

```java
int dia = 3;

switch (dia) {
```

**case 1**

```java
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
```

default:

```java
        System.out.println("Cap de setmana");
        break;
}
```

En aquest exemple, si dia és 3, es mostrarà "Dimecres". Si el valor de dia no coincideix amb cap dels casos, s'executarà el bloc default.

**Notes sobre els condicionals**
- Ús del break en switch: la paraula clau break evita que el codi continuï executant els següents casos. Si no es posa, s'executaran tots els casos següents fins a trobar un break o el final del switch.
- Condicions complexen: es poden utilitzar operadors lògics (&&, ||, !) dins d'un if per combinar condicions.

**Exemple amb condicions complexos**

```java
int edat = 21;
boolean tePermis = true;

if (edat >= 18 && tePermis) {
    System.out.println("Pots accedir.");
} else if (edat >= 18 && !tePermis) {
    System.out.println("No tens permís per accedir.");
} else {
    System.out.println("Ets menor d'edat i no pots accedir.");
}
```

En aquest exemple, es combinen condicions amb && i ! per determinar si una persona pot accedir segons la seva edat i permís.

L'operador ternari és una forma simplificada i abreujada d'escriure un if-else en una sola línia. En lloc d'escriure diverses línies de codi per a una condició simple, podem utilitzar l'operador ternari per decidir quin valor assignar o quina acció prendre en funció d'una condició.

**Sintaxi de l'operador ternari**
La sintaxi general de l'operador ternari és:

```java
variable = (condicio) ? valorSiCert : valorSiFals;
```

- (condició): és la condició que volem avaluar. Ha de ser una expressió booleana (true o false).
- valorSiCert: és el valor que s'assignarà o l'expressió que s'executarà si la condició és true.
- valorSiFals: és el valor que s'assignarà a l'expressió que s'executarà si la condició és falsa.

**Exemple bàsic de l'operador ternari**
Suposem que volem comprovar si una persona és major d'edat. Podem utilitzar l'operador ternari per assignar un missatge segons el valor de la variable edat.

```java
int edat = 18;
String missatge = (edat >= 18) ? "Ets major d'edat" : "Ets menor d'edat";
System.out.println(missatge);
```

**En aquest exemple**
- Si edat és 18 o superior, missatge serà "Ets major d'edat".
- Si edat és inferior a 18, missatge serà "Ets menor d'edat".

**Exemple amb càlculs**
L'operador ternari també es pot utilitzar per assignar valors numèrics en funció d'una condició.

**Exemple**

```java
int a = 10;
int b = 5;

int max = (a > b) ? a : b;
System.out.println("El màxim és: " + max);
```

**En aquest cas**
- Si a és més gran que b, max tindrà el valor de a.
- Si a no és més gran que b, max tindrà el valor de b.

**Exemple de múltiples operadors ternaris**
És possible combinar diversos operadors ternaris, però s'ha de fer amb cura perquè pot compilar la llegibilitat del codi.

**Exemple**

```java
int nota = 85;
String qualificacio = (nota >= 90) ? "Excel·lent" : (nota >= 75) ? "Notable" : (nota >= 50) ? "Aprovat" : "Suspés";

System.out.println("Qualificació: " + qualificacio);
```

**En aquest exemple**
- Si nota és 90 o més, qualificació serà "Excel·lent".
- Si nota és 75 i 89, qualificació serà "Notable".
- Si nota està entre 50 i 74, qualificació serà "Aprovat".
- Si nota és inferior a 50, qualificació serà "Suspés".

**Avantatges i inconvenients de l'operador ternari**
Avantatges:
- Simplifica el codi en casos on una simple assignació o decisió if-else seria llarga.
- Redueix el nombre de línies de codi, fent-lo més compacte.

**Inconvenients**
- Pot reduir la llegibilitat si s'abusa o si es combinen molts operadors ternaris en un sola expressió.
- No és adequat per a condicions complexes que requereixen múltiples línies o blocs de codi.

**Bona practica**
L'operador ternari és útil per assignar un valor senzill o prendre una decisió bàsica en una sola línia. Tot i això, quan les condicions es fan massa llargues o complexos, és millor utilitzar estructures if-else tradicionals per mantenir la claredat del codi.

**Exemple recomanable (senzill i clar)**

```java
String missatge = (edat >= 18) ? "Adult" : "Menor";
```

**Exemple no recomanable (compila la lectura)**

```java
String qualificacio = (nota >= 90) ? "Excel·lent" : (nota >= 75) ? "Notable" : (nota >= 50) ? "Aprovat" : "Suspés";
```
