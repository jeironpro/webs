# Validació d'aplicacions

**Validacions d'aplicacions**
Quan desenvolupem aplicacions, un dels objectius més importants és assegurar que el comportament del codi sigui correcte, previsible i fiable. Aquest procés s'anomena validació del programari i inclou molt més que validar inputs.

Per validar una aplicació haurien de tenir en compta un conjunt de tècniques, estratègies i eines que verifiquen que una aplicació fa el que ha de fer, tant en el moment acual com a mesura que evoluciona (nous requeriments, canvis, manteniment...).

**Objectius principals de la validació**
- Comprovar funcionalitats: assegurar que les funcions/respostes del sistema són les esperades,
- Detectar errors: trobar fallades abans que arribin a produir problemes en producció.
- Facilitat el manteniment: un codi validable és més facil de modificar sense trencar res.
- Asegurar la confiança: tant de l'equip de desenvolupament com de l'usuari final.

**Bones pràctiques per a la validació**
Per tal que el nostre codi sigui fàcilment validable i testable, cal seguir certes estratègies:

- **1.** Modularitat
- Separar el codi en móduls petits, enfocats en una sola responsabilitat.
- Exemple: una funció que només calcula, no que també imprimeix.

- **2.** Interficies clares
- Definir bé com es comuniquen les parts del programa.
- Permet substituir o provar parts de forma independent.

- **3.** Evitar efectes col·laterals
- Una funció hauria de donar el mateix resultat si rep els mateixos paràmetres (funció pura).
- Això facilia la prova unitària i la predicció del comportament.

- **4.** Separació entre lògica i entrada/sortida
- Exemple: primer calcular, desprès mostrar el resultat. Això permet provar la lògica sense necessitat de simular I/O.

**Proves i validació automàtica**
Una aplicació validable pot ser sotmesa a proves automàtiques. Les més comunes són:

**Tipus de prova   Descripció breu**
Unitària         Prova una funció/classe individualment
Integració       Comprova que diferents parts funcionen conjuntament
De sistema       Valida l'aplicació sencera
D'acceptació     Comprova que compleix els requeriment de l'usuari

**Enfocament en les proves unitàries (Junit)**
JUnit és un framework molt utilitzat a Java per escriure i executar proves unitàries.

Permet verificar que cada component (classe o métode) funciona correctament de forma aïllada.

**Exemple**

```java
@Test
void testSuma() {
    assertEquals(5, Calculadora.suma(2, 3));
}
```

**Validació ≠ Verificació**
Tot i que sovint es confonen, són dos conceptes complementaris:
Concepte      Significat
Verificació   "Estem construint el producte bé?" (respecta l'especificació).
Validació     "Estem construint el producte correcte?" (compleix les necessitats).

La validació d'aplicacions va molts més enllà de comprovar valors d'entrada: és un procés integral de qualitat en el desenvolupament del programari. Implica:
- escriure codi modular i testable,
- separar responsabilitats,
- tenir estratègies de prova adequades (com les unitàries),
- i usar eines com JUnit per automatitzar i garantir la fiabilitat del sistema.
