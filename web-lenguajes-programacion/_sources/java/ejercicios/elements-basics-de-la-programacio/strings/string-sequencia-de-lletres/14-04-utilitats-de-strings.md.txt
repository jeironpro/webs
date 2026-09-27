# Ejercicios — 14.04 — Utilitats de Strings

**Enunciat**

En aquest exercici et toca revisar la documentació oficial.

Completa el següent programa, de manera que demani un text i mostri els aspectes demanats als comentaris.

Nota: assegura't que el programa funciona per qualsevol text que rebi.

* Programa que demostra diferents manipulacions amb Strings

```java
public class ManipulaString {
    public static void main(String[] args){
        System.out.println("Paraula?");
        String paraula = Entrada.readLine();
```

**// Mostra la longitud de la paraula (quantes lletres conté)**

```java
        System.out.println("La longitud és: " + paraula.length());
```

**// Mostra la segona lletra de la paraula**
// XXX TODO: afegeix aquí les línies que facin falta

**// Mostra la darrera lletra de la paraula**
// XXX TODO: afegeix aquí les línies que facin falta

**// Mostra la penúltima lletra de la paraula**
// XXX TODO: afegeix aquí les línies que facin falta

**// Mostra la paraula amb totes les lletres en majúscules**
// XXX TODO: afegeix aquí les línies que facin falta

// Una composició formada per la primera lletra de la paraula en
// majúscules, seguida de les següents tres lletres en minúscules. Per
// exemple, si la paraula és «nEkAnE», resultatà en «Neka».
// XXX TODO: afegeix aquí les línies que facin falta

// Mostra una composició formada per la darrera lletra de la paraula,
// seguida de les tres primeres. (ex. si la paraula és «Nekane»
// mostrarà «eNek»)
// XXX TODO: afegeix aquí les línies que facin falta

// Com en el cas anterior però ara corregint les majúscules i
// minúscules de manera que la primera sigui majúscules i la resta en
// minúscules.  (ex. si la paraula és «Nekane» mostrarà «Enek»)
// XXX TODO: afegeix aquí les línies que facin falta

```java
    }
}
```

Un exemple d'execució

**Paraula?**
Nekane
La longitud és 6
La segona lletra és 'e'
La darrera lletra és 'e'
La penúltima lletra és 'n'
La paraula en majúscules és "NEKANE"
La composició de quatre primeres és "Neka"
La composició de quatre és "eNek"
La composició de quatre corregint majúscules és "Enek"

```java
public class ManipulaString {
    public static void main(String[] args){
        System.out.println("Paraula?");
        String paraula = Entrada.readLine();

        System.out.println("La longitud és " + paraula.length());
        System.out.println("La segona lletra de la paraula és " + "'" + paraula.charAt(1) + "'");
        System.out.println("La darrera lletra de la paraula és " + "'" + paraula.charAt(paraula.length()-1) + "'");
        System.out.println("La penúltima lletra de la paraula és " + "'" + paraula.charAt(paraula.length()-2) + "'");
        System.out.println("La paraula en majúscules es " + "\"" + paraula.toUpperCase() + "\"");
        System.out.println("La composició de quatres primeres és " + "\"" + Character.toUpperCase(paraula.charAt(0)) + Character.toLowerCase(paraula.charAt(1)) + Character.toLowerCase(paraula.charAt(2)) + Character.toLowerCase(paraula.charAt(3)) + "\"");
        System.out.println("La composició de quatres és " + "\"" + paraula.charAt(paraula.length()-1) + paraula.charAt(0) + paraula.charAt(1) + paraula.charAt(2) + "\"");
        System.out.println("La composició de quatres corregint majúscules és " + "\"" + Character.toUpperCase(paraula.charAt(paraula.length()-1)) + Character.toLowerCase(paraula.charAt(0)) + Character.toLowerCase(paraula.charAt(1)) + Character.toLowerCase(paraula.charAt(2)) + "\"");
    }
}
```
