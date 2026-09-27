# Tipus de operadors i expressions

**Tipus de operadors i expressions**
Java ofereix diferents tipus d'operadors per treballar amb variables i valors. Els principals tipus son:

- **1.** Operadors aritmètics
  2. Operadors d'assignació
3. Operadors de comparació
4. Operadors lògics
5. Operadors unaris
6. Operadors de bits

- **1.** Operadors aritmètics
  Els operadors aritmètics s'utilitzen per realitzar càlculs matemàtics bàsics.
- +: Suma
- -: Resta
- *: Multiplicació
- /: Divisió
- %: Mòdul (residu d'una divisió)

**Exemple**

```java
int a = 10;
int b = 3;

int suma = a + b; // 13
int resta = a - b; // 7
int multiplicacio = a * b; // 30
int divisio = a / b; // 3
int modul = a % b; // 1
```

- **2.** Operadors d'assignació
  Els operadors d'assignació s'utilitzenn per assignar valors a les variables. L'operador = és  el més bàsic, però també hi ha combinacions amb operadors aritmètics per simplificar el codi.
- =: assigna un valor a la variable
- +=: suma i assigna (x += 3 és equivalent a x = x + 3)
- -=: resta i assigna (x -= 3 és equivalent a x = x - 3)
- *=: multiplica i assigna (x *= 3 és equivalent a x = x * 3)
- /=: divideix i assigna (x /= 3 és equivalent a x = x / 3)
- %=: assigna el mòdul (x %= 3 és equivalent a x = x % 3)

**Exemple**

```java
int x = 5;
x += 3; // x és ara 8
x *= 2; // x és ara 16
```

- **3.** Operadors de comparació
  Els operadors de comparació s'utilitzen per comparar valors. Retornen un valor booleà (true o false).
- ==: igualtat
- !=: diferent
- >: major que
- <: menor que
- >=: major o igual que
- <=: menor o igual que

**Exemple**

```java
int a = 10;
int b = 20;

boolean esIgual = (a == b); // false
boolean esMajor = (a > b); // false
booelan esMenorOigual = (a <= b); // true
```

- **4.** Operadors lògics
  Els operadors lògics s'utilitzen per combinar expressions booleanes i generar resultats complexos.

**Expressions booleanes amb operador logics**
Una expressió booleana és qualsevol expressió que es pot avaluar com a true o false. Aquestes expressions es fan servir per a la presa de decisions (condicionals) i per controlar els bucles.

- &&: AND lògics (retorna true si totes les condicions són ture).
- ||: OR lògics (retorna true si almenys una condició és true).
- !: NOT lògic (inverteix el valor booleà).
- XOR (no està directament disponible, però es pot simular): XOR retorna true només si una de les condicions és certa, però no ambdues.

**Els operador lògics tenen una jerarquia**
1. ! (NOT): més alta prioritat.
2. && (AND): prioritat media.
3. || (OR): menor prioritat.
4. Pots utilitzar parèntesis oer clarificar o alterar la prioritat.

**Exemple**

```java
boolean condicio1 = true;
boolean condicio2 = false;

boolean resultatAND = condicio1 && condicio2; // false
boolean resultatOR = condicio1 || condicio2; // true
boolean resultatNOT = !condicio1; // false
boolean xor = (condicio1 || condicio2) && !(condicio1 && condicio2);
```

**Taules de veritat**
Les taules de veritat són eines fonamentals per entendre el comportament dels operadors lògics

El funcionament de les taules de veritat segons l'operador lògic es basa en com es combinen els valors true i false en diferents situacions. Cada operador té un comportament específic que determina el resultat final de l'expressió.

- **1.** Operador AND (&&): retorna true només quan totes les condicions són certes. Si qualsevol condició és false, el resultat serà false.

**Taula per AND (&&)**
condició A | condició B | A && B
true       | true       | true
true       | false      | false
false      | true       | false
false      | false      | false

**Funcionament**
- Quan A i B són true, significa que totes dues condicions es compleixen, per tant, el resultat és true.
- Si A o B (o ambdues) són false, significa que almenys una condició no es compleix, per tant, el resultat és false.

- **2.** Operador OR (||): retorna true si almenys una de les condicions és certa. Només retorna false si totes les condicions són falses.

**Taula per OR (||)**
condició A | condició B | A || B
true       | true       | true
true       | false      | true
false      | true       | true
false      | false      | false

**Funcionament**
- Si A o B (o ambdues) són true, almenys una condició es compleix, i el resultat és true.
- Només si totes dues condicions són false, el resultat serà false.

- **3.** Operador NOT (!): inverteix el valor de la condició. Si la condició és true, el resultat serà false i si la condició és false, el resultat serà true.

**Taula per NOT (!)**
condició A | !A
true       | false
false      | true

**Funcionament**
- És útil per negar condicions, canviant la seva interpretació lògica.

- **4.** Combinació d'operadors
  Les expressions lògiques poden incloure múltiples operadors. Per entendre el resultat, cal considerar la prioritat dels operadors i utilitzar parèntesis quan calgui.

**Exemple de combinació**

```java
boolean a = true;
boolean b = false;
boolean c = true;

boolean resultat = a || b && !c;
```

- Segons prioritat:
1. !c -> false
2. b && false -> false
3. a || false -> true

```java
Resultat = true;
```

- **5.** Operadors unaris
  Operadors unaris actuen sobre una sola variable.
- +: indica un valor positiu (normalment no s'utilitza).
- -: inverteix el singe.
- ++: increment en 1.
- --: decrement en 1.
- !: inverteix el valor booleà (esmentat anteriorment com a operador lògic).

**exemple**

```java
int x = 5;
x++; // x és ara 6
x--; // x és ara 5

int y = -x; // y és -5.
```

- **6.** Operadors de bits
  Els operadors de bits s'utilitzen per manipular el bits del números. Són menys comuns però útils en aplicacions de baix nivell.
- &: AND de bits.
- |: OR de bits.
- ^: XOR de bits.
- ~: complement (NOT de bits).
- <<: desplaçament a l'esquerra.
- >>: desplaçament a la dreta.

**Exemple**

```java
int a = 5; // 0101 en binari
int b = 3; // 0011 en binari

int resultatAND = a & b; // 1 (0001 en binari).
int resultatOR = a | b; // 7 (0111 en binari).
int desplacament = a << 1; // 10 (1010 en binari).
```

**Expressions en Java**
Les expressions són combinacions de variables, operadors i valors que Java avalua per obtenir un resultat. Quan combinem operadors i valors, creem una expressió.

**Exemple d'expressió**

```java
int resultat = (5 + 3) * 2; // resultat és 16
```

**Prioritat dels operadors**
Java segueix un ordre de precedència en l'avaluacio dels operadors, semblat a les regles de les operacions matemàtiques:
1. Parèntesis()
2. Operador unaris (++, --, +, -, !, ~)
3. Multipliacació, divisió i mòdul (*, /, %)
4. Suma i resta (+, -)
5. Desplaçament de bit (<<, >>, >>>)
6. Operadors de comparació (<, <=, >, >=)
7. Operadors d'igualtat (==, !=)
8. Operador lògics (&. ^, |, &&, ||)
9. Operadors d'assignació (=, +=, -=, *=, /=, %=)

Aquesta precedència defineix l'ordre d'execució de les expressions, i podem utilitzar parèntesis per forçar un ordre específic.

**Exemple complet amb expressions**

```java
public class ExempleOperadors {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;
        int c = 2;

        int resultat = a + b * c; // 20 (Multiplicació primer)
        int resultat2 = (a + b) * c; // 30 (Parèntesis primer)
        boolean esMajor = a > b && b < c; // false (AND lògic)

        System.out.println("Resultat: " + resultat);
        System.out.println("Resultat 2: " + resultat2);
        System.out.println("És major?: " + esMajor);
    }
}
```

En aquest codi, veiem com es combinen diferents tipus d'operadors en expressions.
