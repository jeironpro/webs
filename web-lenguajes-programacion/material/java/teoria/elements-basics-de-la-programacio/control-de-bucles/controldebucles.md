# Control de bucles

**Control de bucles**
El control de bucles és un conjunt de mecanismes que permeten gestionar el comportament d'un bucle durant la seva execusió. Aquest control inclou la possibilitat de modificar la seqüencia d'interacions, interrompre l'execusió abans del previst, continuar amb la següent iteració o sortir del bucle completament. És essencial per escriure codi eficient, flexible i robust, especialment quan cal adaptar el recorregut a condicions dinàmiques o quan es busca optimitzar el temps d'execusió.

- Mecanismes de control dels bucles
En programació, i particularment en Java, hi ha tres instruccions principals per controlar el flux dins dels bucles:

- **1.** break (sortir del bucle completament)
- L'instrucció break interromp l'execusió del bucle en qualsevol moment i força la sortida immediata del bucle.
- Normalment s'utilitza quan s'assoleix una condició específica i ja no és necessari continuar amb la resta d'interacions.

**break**
Elimina el bucle immediatament, sense executar les iteracions restants.

**Exemple**

```java
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break; // Surt del bucle quan i és 5
    }
    System.out.println("Número: " + i);
}
```

- **2.** continue (passar a la següent iteració)
- L'instrucció continue s'utilitza per saltar-se el codi restant en l'iteració actual i passar immediatament a la següent iteració.
- S'utilitza quan cal evitar determinades operacions en casos específics sense aturar tot el bucle.

**continue**
Salta a la següent iteració sense executar el codi restant de l'actual.

**Exemple**

```java
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue; // Salta els números parells
    }
    System.out.println("Número imparell : " + i);
}
```

- **3.** return (sortir del mètode que conté el bucle)
- L'instrucció return finalitza no només el bucle, sinó també el mètode que l'està executant.
- És útil quan el bucle es troba dins d'un mètode i es vol retornar un resultat o simplement finalitzar l'execusió del mètode en un punt específic.

**return**
Finalitza l'execució del mètode en què es troba.

**Exemple**

```java
public class Exemple {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            if (i == 5) {
                return; // Finalitza el programa quan i és 5
            }
            System.out.println("Número: " + i);
        }
    }
}
```

- Aplicacions comunes del control de bucles
1. Cerca d'un element
El control de bucles és clau en algorismes de cerca. Per exemple, si busquem un element en un array, podem utilitzar break per aturar-nos quan el trobem:

```java
int[] array = {1, 2, 3, 4, 5};
int valorBuscat = 3;

for (int num : array) {
    if (num == valorBuscat) {
        System.out.println("Trobat: " + num);
        break; // Atura la cerca
    }
}
```

- **2.** Filtrar elements
  Amb continue, podem saltar-nos els elements que no compleixen una condició específica:

```java
int[] array = {1, 2, 3, 4, 5};

for (int num : array) {
    if (num % 2 == 0) {
        continue; // Saltar els números parells
    }
    System.out.println("Número senar: " + num);
}
```

- **3.** Sortida anticipada del bucle
  Quan es detecta una situació que fa innecessària la resta d'interacions, podem utilitzar return o break:

```java
int[] array = {1, 2, 3, 4, 5};

for (int num : array) {
    if (num > 3) {
        System.out.println("Número major que 3: " + num);
        break; // No cal seguir revisant
    }
}
```

**Consideracions importants**
1. Evitar bucles infinits: quan es controla manualment l'execució dels bucles, cal assegurar-se que els mecanismes de control no provoquin que el bucle continuï sense fi.

- **2.** Legibilitat del codi: tot i que break, continue i return són potents, un ús excessiu o inadequat pot complicar la compresió del codi. Cal utilitzar-los només quan sigui necessari i justificat.

- **3.** Alternatives a break i continue: en molts casos, es poden substituir aquestes instruccions per condicions lògiques ben estructurades. Això pot fer que el codi sigui més fàcil de seguir.

**Exemple sense break**

```java
for (int i = 0; i < 10 && i != 5; i++) {
    System.out.println("Valor de i: " + i);
}
```

**Diferéncies entre break, continue i return**
- break: surt del bucle però no del mètode.
- continue: salta només l'iteració actual, no surt del bucle.
- return: surt del mètode completament.

**Usos pràctics**
1. Expressions booleanes: utilitzades en condicionals i bucles, permeten combinar condicions complexes.

- **2.** Taules de veritat: ajuda a entendre el funcionament dels operadors lògics.

- **3.** Recorreguts: bàsics i niuats, són fonamentals per treballar amb llistes, matrius i dades estructurades.

- **4.** Control de bucle: eines com break, continue i return donen flexibilitat per gestionar el flux dins dels bucles.

El control dels bucles és essencial per escriure codi adaptable i eficient. Dominar aquestes tècniques permet gestionar fluxos complexos de dades i optimitzar algorismes en situacions reals.
