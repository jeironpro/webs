# Parametres

**Els paràmetres**
Els paràmetres són dades que es passen a una funció o mètode perquè aquest pugui treballar amb elles. Són una forma de transmetre informació al mètode en el moment de la seva invocació.

**Tipus de paràmetres**
En Java, els paràmetres es poden classificar en dos tipus principals:

- **1.** Paràmetres formals: són les variables definides en la signatura d'un mètode. Representen els valors que el mètode espera rebre.

```java
public void imprimirMissatge(String missatge) {
    System.out.println(missatge);
}
```

En aquest cas, missatge és una paràmetre formal.

- **2.** Paràmetres actuals (arguments): són els valors que es passen al mètode quan aquest és cridat.

```java
imprimirMissatge("Hola, món!");
```

Aquí, "Hola, món!" és el paràmetre actual (argument) que es passa al mètode.

**Passar paràmetres en Java**
Java utilitza el pas per valor per passar arguments als mètodes. Això significa que es passa una còpia del valor, no l'objecte o la variable original.

- **1.** Tipus primitius
  Quan passem valors primitius (com int, double, etc.), es passsa una còpia del valor, i els canvis fets dins del mètode no afecten l'original.

```java
public void incrementar(int valor) {
    valor++;
    System.out.println("Dins del mètode: " + valor);
}

int x = 5;
incementar(x);
System.out.println("Fora del mètode: " + x); // x segueix sent 5
```

- **2.** Objectes
  Quan passem objectes, també es passa una còpia, però és una còpia de la referència a l'objecte. Això vol dir que els canvis a les propietats de l'objecte afecten l'original.

```java
public void afegirElement(List<String> llista) {
    llista.add("Hola");
}

List<String> mevaLista = new ArrayList<>();
afegirElement(mevaLlista);
System.out.println(mevaLlista); // [Hola]
```

**Paràmetres amb un nombre variable d'arguments**
En Java, podem definir un mètode que accepti un nombre variable d'arguments utilitzant ... . Això es coneix com varargs.

```java
public void sumarNumeros(int... numeros) {
    int suma = 0;
    for (int num : numeros) {
        suma += num;
    }
    System.out.println("Suma: " + suma);
}

sumarNumeros(1, 2, 3, 4); // Suma: 10
sumarNumeros(5, 10); // Suma: 15
```

**Bonnes pràctiques amb paràmetres**
1. Utilitza noms clars: els noms dels paràmetres han de descriure el seu propòsit.

```java
public void calcularArea(double amplada, double altura) {
```

// ...

```java
}
```

- **2.** Mantingues un nombre limitat de paràmetres: si un mètode necessita molts paràmetres, considera agrupar-los en una classe o estructura.

- **3.** Evitar canviar els paràmetres dins del mètode: això pot causar confusió per als desenvolupadors que utilitzen el mètode.
