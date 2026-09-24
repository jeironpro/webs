/*Exerici 2: partint de l'exercici 1 afegeix una classe Equilibrista:
 * 
 * Atributs:
 *  String nom
 *  String nacionalitat
 *  int edat //ha de tenir més de 18 i menys de 60 anys
 *  String objecteEquilibri (barra, pilota gegant, escala,etc.)
 * 
 * Metodes
 *  Com a mínim aquests constructors:
 *  Equilibrista(String nom, int edat, String nacionalitat)
 *  Equilibrista(String nom, int edat, String nacionalitat, String medi)
 *  get/set d'Edat (només aquests per simplificar el problema)
 *  String toString() : mostra els valors de d'Equilibrista de l'estil:
 *      "Ivanov, búlgar i de 21 anys és un equilibirsta que fa equilibris amb barra"
 *  void actuar() que mostra per pantalla: "(nom) surt a l'escenari!" 
 *
 * 
 * Els alumnes haurien de veure que es repeteixen elements i que es podria fer una classe més genèrica i que malabarista i equilibrista heredessin d'aquesta. 
 * De moment deixarem el tema de les classes abstractes per al pròxim exercici.
 * Segurament alguns també necessitaran de crear getter/setters per a escriure els toString de les classes heredades (en aquesta codi és presenta una solució ingeniosa per no haver d'utlitzar getters/setters extres).
 * 
 * S'han afegit mètodes i atributs estàtics a mode d'exemple.
 *      nMalabaristes/nEquilibristes variable de classe que guarda el nombre d'instàncies creades
 *      edatOk mètode de classe (de malabarista o equilibrista segons el cas) que comprova si una edat és vàlida per inicilitzar un constructor vàlid, sino retorna 18 anys (edat vàlida per als dos).
 *
 * NOTA: Recordeu que el codi que es presenta a continuació és una proposta de resposta.
 */

public class Artista {
    private String nom = "John Doe"; //podeu buscar Joe Doe per saber la història d'aquest nom
    private String nacionalitat = "ciutadà del món";
    private int edat = 18;

    public Artista(){ //no es demana però és interessant
        /*
        * Podem declarar aquest tipus de constructor buit i tindrà els valors per defecte.
        * Pensa/prova quins serien els valors per defecte sinò haguessim assignat valors als atributs
        */
    }

    public Artista(String nom, int edat, String nacionalitat) {
        this.nom = nom;
        this.edat = edat;
        this.nacionalitat = nacionalitat;
    }

    public int getEdat() {return edat;}

   public void setEdat(int edat){ this.edat = edat;} //mètode genèric, gestionarem els rangs vàlids a cada subclasse

    //potser necessitaran de getter de la resta d'atributs per toString
    public String getNom() {
        return nom;
    }

    public String getNacionalitat() {
        return nacionalitat;
    }

    @Override
    public String toString() {
        //return nom+", "+ nacionalitat+ " i de " + edat + " anys";
        return String.format("%s, %s i de %d anys",nom, nacionalitat,edat);
    }

    public void actuar() {System.out.println(nom + " surt a l'escenari! ACTUAR");}
}
