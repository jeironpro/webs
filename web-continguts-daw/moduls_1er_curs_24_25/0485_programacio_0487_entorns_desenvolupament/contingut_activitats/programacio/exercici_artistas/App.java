public class App {
    public static void main(String[] args) throws Exception {
        System.out.println("EXERCICI 1");
        /* Exercici 1 */
         /*   Malabarista malab = new Malabarista("Piero", 25, "italià");
            malab.setEdat(34);
            System.out.println(malab);
            malab.actuar();

            System.out.println(Malabarista.getCountMalab());

            Malabarista matLau = new Malabarista("Laura", 22, "italià", "aigua");
            matLau.setEdat(34);
            System.out.println(matLau);
            matLau.actuar();

            System.out.println(Malabarista.getCountMalab());*/
        /* 
         * EXERCICI 2
         * CRIDA HERÈNCIA extends
         * CRIDA HERÈNCIA MÚLTIPLE implements
         * POLIMORFISME: Declarem objectes amb "pèrdua d'identitat"
         */
        System.out.println("EXERCICI 2");
        Artista malabarista = new Malabarista2("Clara", 28, "Italiana", "aigua");
        Artista equilibrista1 = new Equilibrista("Pau", 32, "Català", "bola gegant");
        Artista equilibrista2 = new Equilibrista("Anna", 25, "Francesa"); // Amb objecte per defecte
        
        System.out.println("=== FUNCIÓ DEL CIRC ===");
        malabarista.actuar();
        System.out.println(malabarista);
       // System.out.println(malabarista.terra); //dona error pq Artista no té medi

        equilibrista1.actuar();
        System.out.println(equilibrista1);

        equilibrista2.actuar();
        System.out.println(equilibrista2);

        // Recuperem la identitat amb CASTING
         System.out.println("\n=== CASTING/PERDUA D'IDENTITAT ===");
        Artista artista = new Malabarista2("Xin", 28, "Japonesa", "aire");;
        /*
         * EXEMPLE CAST EXPLÍCIT
         */ 
        if (artista instanceof Malabarista2) {
            Malabarista2 malabaristaDetallat = ((Malabarista2)artista); // Casting explícit i veiem que podem guardar l'artita dins d'un objecte Malabarista
            //malabaristaDetallat te la mateix informació que artista

            System.out.println("Detalls del malabarista: " + artista);
            System.out.println("Detalls del malabarista: " + malabaristaDetallat);

            //Exemple CAST Explícit
            ((Malabarista2)artista).actuar(); //  (ara veiem els mètodes de Malabarista2)
            ((Malabarista2)artista).getMedi();
 
            System.out.println( ((Malabarista2)artista).getMedi()); //aquí ja podem accedir a medi
        }
        /*
         * EXEMPLE CLASSE ABSTRACTA
         */

        //Podem instanciar Artista perquè no és classe abstracta
        Artista desconegut = new Artista(); //tenim un constructor per defecte
        System.out.println(desconegut);
        desconegut.actuar();

        //Fem-los sortir a pista al final de l'actuació a tots!! Aquest cop els declarem amb el tipus que els pertoca
        Malabarista2 malabarista2 = new Malabarista2("Clara", 28, "Italiana", "aigua");
        Equilibrista equilibrista3 = new Equilibrista("Pau", 32, "Català", "bola gegant");
        Equilibrista equilibrista4 = new Equilibrista("Anna", 25, "Francesa"); // Amb objecte per defecte
        
        /*interficie equilibrista amb Actuacio amb foc */
        System.out.println("***********INTERFICIES***********");
        equilibrista3.encenFoc();
        equilibrista3.apagaFoc();
        System.out.println(equilibrista3);
        /*interficie malabarista amb Actuacio amb foc i Preparació*/
        malabarista2.estiraments();
        malabarista2.encenFoc();
        malabarista2.apagaFoc();

        
        /*
         * CLASSE STATIC
         */
        System.out.println("Hi ha "+ Equilibrista.nEquilibristes + " equilibristes pendents de sortir a escena\n");
        System.out.println("Hi ha "+ Malabarista2.nMalabaristes + " malabaristes pendents de sortir a escena\n");

        /*
         * ARRAY DE ARTISTES, MALABARISTES I EQUILIBRISTES
         */
        Artista[] artistes = {malabarista,equilibrista1,equilibrista2,malabarista2,equilibrista3,equilibrista4};
        //Equilibrista[] artistes = {malabarista,equilibrista1,equilibrista2}; ens donaria error, pq?

        for (Artista membre : artistes) {
            membre.actuar();
        }


    }
}



