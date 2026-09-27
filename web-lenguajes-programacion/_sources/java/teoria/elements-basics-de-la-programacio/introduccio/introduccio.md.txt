# Introducció

**Introducció Java**
Java és un llenguatge de programació d'alt nivell i orientat a objectes, desenvolupat per Sun Microsystems (ara propietat d'Oracle). Va ser creat el 1995 amb l'objectiu de ser un llenguatge robust, segur, independent de la plataforma i fàcil d'aprendre. Java ha esdevingut una de les tecnologies més utilitzades a nivell mundial en el desenvolupament de programari per a aplicacions d'escriptori, web, mòbils i sistemes integrats. És conegut per ser un llenguatge portàtil i independent de la plataforma gràcies al concepte de "Escriu un cop, executa en qualsevol lloc" (Write Once, Run Anywhere o WORA). Això es deu a l'us de la Java Virtual Machine (JVM), que permet executar el codi Java en diferents sistemes operatius sense necessitat de modificar-lo.

**Característiques principals de Java**
1. Orientació a objectes: Java és un llenguatge completament orientat a objectes, cosa que facilita l'organització del codi en classes i objectes.

- **2.** Portabilitat: Com que el codi Java es compila en bytecode (un tipus de codi intermedi), pot ser executat en qualsevol sistema que tingui una JVM.

- **3.** Seguretat: Java inclou mencanismes per gestionar permisos i restringir accions potencialment perilloses, com accedir al sistema de fitxers o a la xarxa.

- **4.** Gestió automàtica de memòria: Java té un recollidor d'escombraries (garbage collector) que allibera memòria automàticament quan no es necessita.

- **5.** Multifil (Multithreading): Java permet l'execució de múltiples fils de manera concurrent, la qual cosa millora el rendiment en aplicacions complexes.

- **6.** Biblioteca estàndard rica: Java inclou una extensa biblioteca de classes (API de Java) que ofereix eines per a tasques comunes, com gestió d'arxius, connexió de xarxes, i interfícies gràfiques.

**Instal·lació de Java**
Per programar en Java, Cal tenir instal·lats el JDK (Java Development Kit) i un entorn de desenvolupament.

**Els passos són**
1. Descarregar i instal·lar el JDK: es pot trobar al lloc oficial d'oracle (o altres versions com OpenJDK).

2.Configuració de l'entorn: cal configurar la variable d'entorn JAVA_HOME per permetre que altres programes reconeguin el JDK.

- **3.** IDE opcional: podem escriure codi en editors de text, però és recomanable utilitzar un IDE (entorn de desenvolupament integrat) com IntelliJIDEA, Eclipse o NetBeans.

**La primera aplicació: "Hola, Món!"**
El primer programa que s'acostuma a escriure en qualsevol llenguatge és el famós "Hola, món!". En Java, aquest programa demostra la sintaxi bàsica i com funciona l'estructura d'un programa.

```java
public class HolaMon {
    public static void main(String[] args) {
        System.out.println("Hola, món!");
    }
}
```

**Que fa aquest codi**
- public class HolaMon: defineix una classe anomenada HolaMon. En Java, tot el codi ha d'estar dins d'una classe.

- public static void main(String[] args): aquest és el punt d'entrada d'un programa Java. Tots els programes Java comencen a executar-se des d'aquest mètode main.

- System.out.println("Hola, món!");: aquesta línia imprimeix el text "Hola, món!" a la consola.

**Estructura bàsica d'un programa en Java**
Un programa Java está format per una o més classes i un mètode principal (main).

**Estructura bàsica**

```java
public class NomClasse {
```

// Atributs (variables d'instancia)

// Constructor

**// Mètodes**

```java
    public static void main(String[] args) {
```

// Codi principal d'execució

```java
    }
}
```

**Components d'un programa Java**
- classe: és l'estructura principal en Java. Cada fitxer .java representa una classe pública.
- Atributs i mètodes: les classes poden contenir atributs (variables) i mètodes (funcions).
- Mètode main: és el punt d'entrada de l'aplicació i conté el codi que s'executa quan es llança el programa.

**Compilació i execució d'un programa Java**
Per executar un programa Java, primer cal compilar-lo i després executar el fitxer resultant. Això es pot fer des de la línia de comandes:

- **1.** Compilació: es compila el codi font (.java) amb javac:
  javac HolaMon.java
Això crea un fitxer .class amb el bytecode.

- **2.** Execució: després, s'executa el bytecode amb java:
  java HolaMon

**Concepte de JVM, JRE i JDK**
- JVM (Java Virutal Machine): és la màquina virtual que executa el bytecode. Cada sistema operatiu té la seva pròpia JVM.

- JRE (Java Runtime Environment): inclou la JVM i les biblioteques necessàries per executar aplicacions Java, però no per desenvolupar-les.

- JDK (Java Development Kit): conté el JRE i eines de desenvolupament com el compilador javac. És necessari per escriure i compilar codi Java.
