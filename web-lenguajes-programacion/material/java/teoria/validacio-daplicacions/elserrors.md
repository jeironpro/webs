# Els errors

**Els errors**
Un error és qualsevol situació que impedeix que un programa s'executi correctament. En Java, el tractament d'errors és fonamental, ja que és un llenguatge segur i orientat a objectes, amb una gestió d'errors molt estructurada mitjançant el sistema d'excepcions.

**Tipus d'errors**
1. Errors de compilació
- Detectats pel compilador abans d'executar.
- Són errors sintàctics: oblidar un punt i coma, cridar un mètode inexistent, tipus incompatibles...

**Exemple**

```java
    int x = "hola"; // Error: tipus incompatible
```

- **2.** Errors d'execució (Runtime errors)
- Succeeixen quan el programa ja està en executar.
- No es poden detectar a la compilació.
- Produeixen excepcions (Exceptions) com:
- NullPointerException
- ArrayIndexOutOfBoundsException
- ArithmeticException

**Exemple**

```java
    String nom = null;
    System.out.println(nom.length/());  // NullPointerException
```

- **3.** Errors lógics
- El codi compila i s'executa, però no fa el que hauria de fer.
- Són difícils de detectar automàticament.

**Exemple**
Un càlcul mal implementat.

**Excepcions**
Java gestiona els errors d'execució amb un sistema orientat a objectes anomenat excepcions. Quan es produeix una situació anòmenada, es "llança" (throw) una excepció, que pot ser capturada i gestionada.

**Exemple**

```java
try {
    int resultat = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("No es pot dividir per zero");
}
```

**Jerarquia d'excepcions**
Object
└── Throwable
├── Error (errors greus, no es gestionen)
└── Exception
├── Checked exceptions (han de ser capturades)
└── Unchecked exceptions (RuntimeException i subclasses)

Tipus                  Exemple                     Ha de capturar-se obligatoriament?
IOException            Error en llegir un fitxer   Si, és checked
NullPointerException   Accedir a un objecte nul    No, es unchecked
ArithmeticException    Divisió per zero            No, es unchecked

**Gestió d'errors correcta**
- Només capturar excepcions que pots gestionar.
- No capturar amb catch (Exception e) si no saps què estàs atrapant.
- Utilitzar blocs finally per tancar recursos:

```java
        try {
            FileReader f = new FileReader("dades.txt");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            f.close(); // Tancar el recurs
        }
```

**L'importancia d'entendre els errors**
- Millora el control del flux del programa.
- Permet oferir missatges clars a l'usuari.
- Evita caigudes innecessàries.
- Facilita el debugginf i la validació.

**Avançat: Personalització d'errors**
Es poden crear excepcions pròpies:

```java
class SaldoInsuficientException extends Exception {
    public SaldoInsuficientException(String missatge) {
        super(missatge);
    }
}
```
