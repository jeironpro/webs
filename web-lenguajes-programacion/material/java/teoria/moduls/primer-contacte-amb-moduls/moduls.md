# Moduls

**Introducció als mòduls**
Els mòduls es van introduir a Java 9 com a part del Project Jigsaw. Serveixen per organitzar el codi de manera més estructurada, millorar la encapsulació i gestionar les dependències de forma més eficient en aplicacions grans.

Abans de Java 9, les aplicacions es dividien en paquets, però no hi havia un mecanisme per limitar quins paquets eren visibles fora del projecte. Amb els mòduls, podem definir explícitament quines parts del nostre codi són accessibles des de l'exterior.

**Característiques clau dels mòduls**
1. Encapsulació explícita: només exposem els paquets que volem que altres mòduls utilitzin.

- **2.** Gestió de dependències: es defineixen quins mòduls necessita la nostra aplicació.

- **3.** Millora del rendiment: permet carregar només els mòduls necessaris en temps d'execució.

- **4.** Seguretat: redueix l'accés no autoritzat al codi intern d'un modul.

**Estructura d'un mòdul**
Un mòdul té:
- Un directori base: conté tot el codi i recursos del mòdul.
- Un fitxer module-info.java: és el descriptori del mòdul. Defineix quins paquets exporta i quins mòduls necessita.

**Exemple**

```java
module nomDelModul {
    requires modul.necessari; // Dependència d'altres mòduls
    exports paquet.exemple; // Paquets exposats
}
```

**Exemple pràctic**
Imagina que tens un projecte amb un mòdul anomenat calculadora que inclou funcionalitats matemàtiques.

- **1.** Estructura del mòdul:
  calculadora/
|--- src/
|    |--- module-info.java
|    |___ com/exemple/calculadora/
|         |--- Calculadora.java

- **2.** Fitxer module-info-java

```java
module calculadora {
    exports com.exemple.calculadora; // Exposem el paquet
}
```

- **3.** Una classe dins del mòdul:

```java
package com.exemple.calculadora;

public class Calculadora {
    public int suma(int a, int b) {
```

**return a + b**

```java
    }
}
```
