# Constantes

**Constantes**
En Java, una constant és una variable el valor de la qual no pot canviar un cop assignat. Això es fa mithament la paraula clau final.

**Declaració de constants**
Per definir una constant, s'ha de:
1- Usar final perquè la variable sigui immutable.
2- Inicialitzar-la immediatament (no es pot deixar sense valor).
3- Seguir convencions de noms: s'escriu en majúscules i amb guions baixos (_).

```java
final int EDAT_MAXIMA = 100; // Correcte
```

Si intentem modificar EDAT_MAXIMA més tard, el compilador donarà error.

**Exemple bàsic**

```java
public class Exemple {
    public static void main(String[] args) {
        final double PI = 3.1416;  // Constant
        System.out.println("El valor de PI és: " + PI);

        // PI = 3.15;  // ERROR: No es pot modificar una constant
    }
}
```

Error si intentem modificar PI, després de la seva assignació.

**Constant en un Classe (static final)**
Si volem constants compartides per tota una classe, s'usen static final.

```java
publuc class Configuracio {
    public static final String NOM_EMPRESA = "techcorp";
    public stati final int MAX_USUSARI = 500;
}
```

Ara podem accedir-hi sense crear un nou objecte.

```java
public class Exemple {
    public static void main(String[] args) {
        System.out.println(Configuracio.NOM_EMPRESA);  // Sortida: TechCorp
    }
}
```

- Per què static?
Si final fa que la variable sigui immutable, static permet compartir-la entre totes les instàncies de la classe.
Això evita haver de crear un objecte per accedir-hi.

**Constants en una interfície**
Les constantes en interfícies són automàticamente pulic static final, aixì que no cal escriure-ho explícitament.

```java
interface Constants {
    int VELOCITAT_MAXIMA = 120; // Automàticament: public static final
}
```

**Qualsevol classe que implementi Constants pot accedir-hi**

```java
public class Cotxe implements Constants {
    public void mostrarVelocitat() {
        System.out.println("Límit: " + VELOCITAT_MAXIMA + " km/h");
    }
}
```

**Notes**
1- Una constant es declara amb final i no pot canviar després de ser incialitzada.
2- Les constatns d'una classe solen ser static final per a ser compartides.
3- En una interfície, totes les variables són public static final per defecte.
