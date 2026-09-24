/*
 * Exercici 1:
 * 
 * Crea una classe per a Malabarista amb les següents característiques:
 * 
 * Atributs:
 *  String nom
 *  String nacionalitat
 *  int edat //ha de tenir més de 18 i menys de 45 anys
 *  String medi //pot tenir com a valors terra, aeri,etc. per defecte serà terra.
 * 
 * Mètodes:
 *  Com a mínim aquests constructors:
 *  Malabarista(String nom, int edat, String nacionalitat)
 *  public Malabarista(String nom, int edat, String nacionalitat, String medi)
 *  get/set d'Edat (només aquests per simplificar el problema)
 *  String toString() : mostra els valors de Malabarista de l'estil:
 *      "El malabarista Piero, italià i de 27 anys, actua sobre terra."
 *  void actuar() que mostra per pantalla: "(nom) surt a l'escenari!" 
 * 
 * Proposa un main de prova per comprovar que el teu codi funciona
 * 
 * NOTA: el codi que es mostra a continuació és una proposta de resposta. S'han declarat algunes classes sense el public
 * (no es poden cridar/utilitzar des d'altres classes) per poder posar tot el codi correpsonent a l'exercici en un sol fitxer.
 */

public class Malabarista {
    private String nom; 
    private String nacionalitat;
    private int edat;
    private String medi="terra"; //indiquem que serà el valor per defecte
    private static int countMalab = 0;

    public Malabarista(String nom, int edat, String nacionalitat) {
        //this.edat=edat;
        setEdat(edat);
        this.nom=nom;
        this.nacionalitat=nacionalitat;
        countMalab++;

        /*També podríem fer ús del set i decidir que passa quan la condició no es compleix 
        (tenir per defecte 18, etc.)
          En aquest cas simplement no modificarem el valor 
          (si es crida en el constructor tindrà el valor per defecte 0)
          this.edat=edat; es podria substituir per -> setEdat(edat)
         */
    }

    public Malabarista(String nom, int edat, String nacionalitat, String medi) {
       this(nom,edat,nacionalitat);//es fa ús del constructor anterior//
        
       this.medi=medi;
      //countMalab++;
    }

    public void setEdat(int edat){
        if((edat>=18)&&(edat<=45)){
            this.edat=edat;
        }else{
            System.out.println("Es volia assignar una edat no vàlida!! Edat es queda amb el valor per defecte" 
            + this.edat);
        }
    }
    public static int getCountMalab(){return countMalab;}
    public String getMedi(){return this.medi;}
    public int getEdat(){return this.edat;}

    @Override
    public String toString(){
        //dues opcions possibles: concatenant cadenes d'String amb valors o amb String.format
        
        //return "El malabarista " + nom + "," + nacionalitat + " i de " + edat + " anys, actua sobre " + medi + "."; //OPCIÓ 1
        return String.format("El malabarista %s, %s i de %d anys, actua sobre %s.", nom,nacionalitat,edat,medi); //OPCIÓ 2
    }

    public void actuar() {
        System.out.println(this.nom + " surt a l'escenari!");
    }
}