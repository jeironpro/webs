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

class Malabarista2 extends Artista implements ActuacioFoc, Preparacio{
    private String medi = "terra";
    public static int nMalabaristes;

    public Malabarista2(String nom, int edat, String nacionalitat) {
      super(nom, edatOk(edat), nacionalitat);  
      nMalabaristes++;//equivalent a Malabarita.nMalabaristes
    }

    public Malabarista2(String nom, int edat, String nacionalitat, String medi) {
        super(nom, edatOk(edat), nacionalitat);
        this.medi=medi;
        nMalabaristes++;
    }

    @Override
    public String toString() {

        return String.format("%s, %s i de %d anys és malabarista que actua sobre %s",getNom(),getNacionalitat(),getEdat(),medi);
        //return super.toString() + " és malabarista que actua sobre " + medi + "."; //opció avançada
    }
    public String getMedi(){return this.medi;}

    static public int edatOk(int edat){ //posem una edat, retorna 18 si l'entrada no era valida //SOLUCIÓ AVANÇADA
        if(edat < 18 || edat > 45){
            return 18;
        }
        return edat;
    }
   
    @Override
    public void setEdat(int edat) {
        if (edat >= 18 || edat <= 45) {
            super.setEdat(edat);
        } //si no es compleix decidim simplement no modificar el valor
    }

    public void actuar() {System.out.println(getNom()+" surt a l'escenari! MALABARISTA");}
/*  Herència Múltiple: Mètodes IMPLEMENTS */

/*
 * HEREDA DE ActuacioFoc()
 */
   @Override
   public void encenFoc(){
        System.out.println(getNom()+ " Encen Foc dels malabars");
   }
   @Override
   public void apagaFoc(){
       System.out.println(getNom()+ " Apaga Foc");
   }
 /*
 * HEREDA DE Preparacio()
 */
    @Override
    public void estiraments(){
        System.out.println("Estiraments del "+getNom());
    }
}