# Les classes de proves

**Classes de proves**
En desenvolupament de programari, classifiquem les proves en funció de què volem comprovar i quin abast tenen dins del sistema. Aquesta classificació ens ajuda a estructurar millor la validació i a saber quan i on aplicar cada tipus de prova.

**Proves unitàries (unit tests)**
- Què proven? Una única unitat de codi: una funcióm mètode o classe individual.
- Objectiu: Assegurar que aquesta unitat es comporta correctament en diferents situacions.
- Eina principal en Java: JUnit
- Exemple: comprovar que um mètode suma(int a, int b) retorna el valor correcte.
- Característiques: ràpides, molt locals, ideals per a test automatitzat continu.

**Proves d'integració (integration tests)**
- Què proven? La interacció entre diferents components o mòduls del sistema.
- Objectiu: Comprovar que múltiples unitats treballen correctament juntes.
- Exemple: comprovar que una classe que escriu en base de dades realment desa correctament la informació.
- Característiques: poden ser més lentes, sovint impliquen recursos externs (fitxers, bases de dades...).

**Proves funcionals (functional tests)**
- Què proven? Que una funcionalitat completa del sistema (vista com una caixa negra) funciona correctament.
- Exemple: simular un usuari que registra un compte i comprovar que es crea al sistema.
- Característiques: acostumen a treballar a través de l'API o la interfície.

**Proves de regressió (regression tests)**
- Què proven? Que les funcionalitats que abans funcionaven encara funcionen després d'un canvi.
- Objectiu: Evitar que noves funcionalitats trenquin les existents.
- Com es fan? Són una combinació de proves automatitzades ja existents que es tornen a executar continuament (normalment amb CI/CD).

**Proves de rendiment (performance tests)**
- Què proven? Com es comporta l'aplicació sota càrrega.
- Exemple: comprovar que un servidor pot gestionar 10.000 peticions per minut.
- Subtipus: proves d'estrès, proves de càrrega, proves d'escalabilitat.

**Proves de seguretat**
- Què proven? que no es poden accedir o modificar dades sense permís.
- Exemple: intentar accedir a dades d'un altre usuari o manipular paràmetres per obtenir privilegis.

**Proves d'acceptació (acceptance tests)**
- Què proven? Que el producte compleix els requisits del client o usuari final.
- Característiques: solen ser manuals o semi-automàtiques, i molt orientades a escenaris reals d'ús.

**Visualment**
Tipus de prova   Què comprova                     A qui afecta
Unitària         Mètodes o classes individuals    Desenvolupador
Integració       Comunicació entre components     Equip tècnic
Funcional        Funcionalitats completes         Usuari final
Regressió        Que no es trenqui res existent   Tot l'equip
Rendiment        Com respon el sistema            Arquitectes
Seguretat        Accès i dades vulnerables        Auditoria
Acceptació       Compliment de requisits          Client
