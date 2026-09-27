# Proves JUnit

**Proves unitàries amb JUnit**
Una prova unitària és una funció que comprova de manera automàtica que una unitat de codi (generalment un métode) fa exactament el que ha de fer, per a diversos casos possibles. L'objectiu és detectar errors al més aviat pdssible, durant el desenvolupament.

JUnit és el framework de referència a Java per escriure i executar proves unitàries, És senzill, potent i molt integrable en entorns com Eclipse, IntelliJ, Maven o Gradle.

**Exemple**

```java
public class Calculadora {
    public int suma(int a, int b) {
        return a + b;
    }
}

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculadoraTest {
    @Test
    public void testSuma() {
        Calculadora calc = new Calculadora();
        int resultat = calc.suma(2, 3);
        assertEquals(5, resultat);
    }
}
```

**Explicació**
- @Test indica que el métode és una prova.
- assertEquals(expected, actual) comprova si el resultat esperat coincideix amb el resultat real.
- Si la comprovació falla, JUnit mostra un error.

**Altres assertions útils**
Métode d'assetion       Que comprova?
assertEquals(a, b)      Que a == b
assertNotEquals(a, b)   Que a != b
assertTrue(condició)    Que la condició és true
assertFalse(condició)   Que la condició és false
assertNull(obj)         Que l'objecte és null
assertNotNull(obj)      Que l'objecte no és null
assertThrows(...)       Que es llança una excepció esperada

**Com estructurar proves**
- Cada mètode de prova ha de privar un sol comportament
- Has d'incloure casos normals, limit i d'error.
- Les proves han de ser repetibles i independents entre si.

**Bones pràctiques**
- Escriu proves metre programes, no només al final.
- Dona noms descriptiu als mètodes de prova.
- Mantingues les proves curtes i llegibles.
- Utilitza mocking per simular components externs si cal.

**Inegració i execució**
- Pots executar les proves amb:
- IDE (clic dret -> "Run tests")
- Maven: mvn test
- Gradle: ./gradlew test

JUnit et permet validar mètodes de manera automatitzada i senzilla.
És essencial per detectar errors ràpidament i assegurar el correcte funcionament del codi.
La qualitat del teu projecte millora molt si l'acompanyes de proves unitàries ben fetes.
