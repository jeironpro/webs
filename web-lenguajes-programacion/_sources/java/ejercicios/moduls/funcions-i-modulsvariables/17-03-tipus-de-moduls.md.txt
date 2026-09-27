# Ejercicios — 17.03 — Tipus de moduls

Enunciat

Ja va sent hora de que et presenti davant d'un codi real en Java.

Ho faré a partir d'un dels molts programes que composen el codi d'una popular aplicació d'ajuda a la traducció automàtica (CAT: Computer Aided Translation) anomenada OmegaT. Si tens interès, hi pots trobar el codi a Github

Per a aquest exercici, només caldrà que analitzis el següent codi.

En descarregar i obrir aquest fitxer al teu editor, hi trobaràs molt de codi del que encara no tindràs ni idea, però també una gran quantitat que sí que sabràs interpretar. Si t'angoixa veure tantes coses desconegudes pensa el poc temps que portes fent aquest curs i quant en sabies abans de començar.

L'objectiu de l'exercici no és entendre el codi. Només cal identificar els mòduls que hi trobis. Hi apareixeran tant en forma de crides com de definicions.

Amb tot el que trobis en faràs un informe en forma de taula amb les següents columnes:

    nr. de línia en que apareix la crida o l'inici de la signatura

    signatura: nom del mòdul, tipus dels paràmetres/arguments (o el valor trobat si no el saps deduir) i tipus de valor de retorn (si té sentit)

    classificació en procediment, funció pura o funció impura, i sobretot, perquè has decidit aquesta classificació

Per descomptat, hi haurà coses que no tindràs ni idea si és o no un mòdul. Et poso un exemple. Fixa't en el @SuppressWarnings("serial") de la línia 55. En aquest cas no és mòdul sinó una anotació, quelcom que no hem vist del llenguatge però que "canta" una mica donat que apareix fora d'un mòdul i té aquesta estranya @ al davant. Amb tot, presenta la forma d'una crida amb un argument de tipus String. Una altra cosa sorprenent pot ser que no a tot arreu apareix public static i que, fins i tot, algunes coses que semblen definicions de mòduls (com ara public MachineTranslateTextArea() a la línia 64) ni tant sols tenen void com a tipus de retorn.

Decideix si casos com aquests els vols ignorar o bé afegir a l'informe classificant-los com a ni idea, desconegut o exòtic. En cas que et decantis per afegir-ho i tinguis curiositat, avisa'm i ho comentem.

Et poso unes primeres entrades per que et serveixin d'ajuda

línia

signatura

classificació

58

String OStrings.getString(String)

Funció perquè la crida assigna el valor de retorn a una variable Apostaria que és pura perquè rep un String

65

super(boolean)

Procediment doncs la crida no recull el valor de retorn.

Nota: en realitat no és ben bé un procediment però és una bona aproximació.

67

setEditable(boolean)

Procediment doncs la crida no recull el valor de retorn.

68

AlwaysVisibleCaret.apply(NiIdea)

Procediment doncs la crida no recull el valor de retorn.

El tipus de l'argument… ni idea. Nota: ni idea és raonable aquí.

###############################

## Autoria

Jeiron Junior Espinal Cruz

## Introducció

En aquest exercici vaig a analitzar el codi de un programa real fet en Java.

===== =========================================================================== ================================================================================================================================================================================================================================================================================
línia signatura                                                                   classificació
===== =========================================================================== ================================================================================================================================================================================================================================================================================
56    MachineTranslateTextArea()                                                  És una classe que s'inicialitza en la línia 56, és anomenada novament en la línia 64 i en la línia 124 s'utilitza com a argument d'una funció (super) acompanyada de .this(no li ho que).
58    String OStrings.getString(String)                                           Funció perquè la crida assigna el valor de retorn a una variable Apostaria que és pura perquè rep un String.
62    String displayed                                                            Sembla ser una funció pura perquè comença per String però abans d'això té una paraula estranya private i no té cap paràmetre.
65    super(boolean)                                                              Procediment doncs la crida no recull el valor de retorn. Nota: en realitat no és ben bé un procediment però és una bona aproximació.
67    setEditable(boolean)                                                        Procediment doncs la crida no recull el valor de retorn.
68    AlwaysVisibleCaret.apply(NiIdea)                                            Procediment doncs la crida no recull el valor de retorn. El tipus de l'argument… ni idea. Nota: ni idea és raonable aquí.
69    this.setText(EXPLANATION)                                                   És una funció que inicia amb this. (paraula estranya) i té com a argument una altra funció que retorna un valor de tipus String pel que la fa pura.
72    String OStrings.getString(String)                                           És una funció pura que rep i retorna un valor de tipus String.
86    String getDisplayedTranslation()                                            Funció pura que retorna un valor de tipus string.
91    onProjectClose()                                                            Procediment que no retorna cap valor perque abans de la signatura té void.
97    startSearchThread(final SourceTextEntry newEntry)                           Procediment que no retorna cap valor perque abans de la signatura té void, però aquest procediment té com paràmetre la parula estranya per a mi (final).
108   setFoundResult(final SourceTextEntry se, final MachineTranslationInfo data) Procediment que no retorna cap valor perque abans de la signatura té void, però aquest procediment té com paràmetre la parula estranya per a mi (final).
119   FindThread                                                                  És una classe que torna a ser anomenada d'aquesta manera FindThread(final IMachineTranslation translator, final SourceTextEntry newEntry) en la línia 123, la qual cosa ho fa estrany per a mi, perquè ara aquesta classe rep té paràmetres amb paraula com a final que ni idea.
===== =========================================================================== ================================================================================================================================================================================================================================================================================

## Aprenentatge

He aprés a identificar els móduls de un programa real, a saber quan són un procediment o una funció pura o impura.
