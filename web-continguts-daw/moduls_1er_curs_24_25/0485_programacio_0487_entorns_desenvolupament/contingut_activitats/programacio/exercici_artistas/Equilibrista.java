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



public class Equilibrista extends Artista implements ActuacioFoc {
    private String objecteEquilibri;
    static int nEquilibristes;

    public Equilibrista(String nom, int edat, String nacionalitat) {
        super(nom, Equilibrista.edatOk(edat), nacionalitat); //podriem posar només edatOK
        this.objecteEquilibri = "barra"; // Valor per defecte
        nEquilibristes++;//equivalent a Equilibrasta.nEquilibristes
    }

    public Equilibrista(String nom, int edat, String nacionalitat, String objecteEquilibri) {
        super(nom, Equilibrista.edatOk(edat), nacionalitat);//podriem posar només edatOK
        this.objecteEquilibri = objecteEquilibri;
        nEquilibristes++;
    }

    static public int edatOk(int edat){ //posem una edat, retorna 18 si l'entrada no era valida //SOLUCIÓ AVANÇADA
    if(edat < 18 || edat > 60){
        return 18;
    }
    return edat;
}

    @Override
    public void setEdat(int edat) {
        if (edat >= 18 || edat <= 60) {
            super.setEdat(edat);
        } //si no es compleix decidim simplement no modificar el valor
    }

    @Override
    public String toString() {
        return String.format("%s, %s i de %d anys és equilibrista que fa equilibris amb %s",getNom(),getNacionalitat(),getEdat(),objecteEquilibri);
        //return super.toString() + " és equilibrista que fa equilibris amb " + objecteEquilibri + ".";//opció avanaçada
    }

    public void encenFoc(){
         System.out.println(getNom()+" Encen Foc");
    }
    public void apagaFoc(){
        System.out.println(getNom()+" Apaga Foc");
    }
}

