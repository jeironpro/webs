# Variables i tipus de dades

**Variables i tipus de dades**
En Java, les variables són elements que emmagatzemen dades de diferents tipus. Per a cada variable, cal definir el tipus de dada, que especifica el format i l'espai que ocuparà en memòria.

- **1.** Declaració de variables
  Per declarar una variable en Java, primer cal indicar el tipus de dada, seguit del nom de la variable. Podem inicialitzar-la (assignar-li un valor) al mateix moment.

**Exemple**

```java
int edat = 25;
double altura = 1.75;
```

- **2.** Tipus de dades primitius
  Els tipus de dades primitius en Java són tipus bàsics que emmagatzemen valors senzills i estan optimitzats per a la rapidesa.

Hi ha vuit tipus primitius:

- Números enters
1. byte: enter petit (de -128 a 127). Ocupa 1 byte.
2. short: enter de mida mitjana (de -32,768 a 32,767). Ocupa 2 bytes.
3. int: enter més habitual (de -2,147,483,648 a 2,147,647). Ocupa 4 bytes.
4. long: enter molt gran (de -9,233,372,036,854,775,808 a 9,233,372,036,854,775,807). Ocupa 8 bytes.

**Exemple**

```java
byte petit = 100;
int numero = 10000;
long gran = 10000000L; // Amb 'L' per indicar que és 'long'
```

- Números decimales
1. float: decimal de precisió simple. Ocupa 4 bytes. Indiquem el valor amb f al final.
2. double: decimal de precisió doble. Ocupa 8 bytes i és el més habitual per als decimals.

**Exemples**

```java
float pes = 65.5f;
double preu = 19.99;
```

- Carácter i booleá
1. char: representa un carácter Unicode (lletra, número, símbol). Ocupa 2 bytes.
2. boolean: representa un valor de veritat (true o false). Ocupa 1 bit.

**Exemple**

```java
char lletra = 'A';
boolean = esActiu = true;
```

- **3.** Tipus de dades no primitius
  Els tipus de dades no primitius són més complexos i inclouen referències a objectes.

**Alguns dels més comuns són**
- Cadena de text (String)
String és una seqüencia de carácters i no és un tipus primitius, sino una classe en Java. Però s'utilitza molt sovint i es comporta de manera similar a un tipus bàsics.

**Exemple**

```java
String nom = "Anna";
```

- **4.** Conversió de tipus de dades
  És possible convertir entre tipus de dades. Aquesta conversió pot ser:
- Implícita: Java converteix automàticament un tipus més petit a un tipus més gran.
- Explícita (o cast): l'escriptor ha d'indicar la conversió entre tipus incompatibles o de major precisió o menor precisió.

**Exemples**

```java
int enter = 10;
double decimal = enter; // Conversió implícita de `int` a `double`
```

int numeroEnter = (int)

```java
numeroDecimal; // Conversió explicita, de `double` a `int` (es perd la part decimal)
```

- **5.** Valor per defecte
  En java, quan es declara una variable sense inicialitzar-la, els tipus primitius tenen un valor per defecte (per exemple, 0 per int, false per boolean, i null per String).

Exemple resum de declaracions de variables

```java
public class ExempleVariables {
    public static void main(String[] args) {
        int edat = 21;
        double altura = 1.82;
        boolean esEstudiant = true;
        char sexe = 'M';
        String nom = "Jeiron";

        System.out.println("Nom: " + nom);
        System.out.println("Edat: " + edat);
        System.out.println("Altura: " + altura);
        System.out.println("Estudiant: " + esEstudiant);
        System.out.println("Sexe: " + sexe);
    }
}
```

**Sortida**
Nom: Jeiron
Edat: 21
Altura: 1.82
Estudiant: true
Sexe: M
