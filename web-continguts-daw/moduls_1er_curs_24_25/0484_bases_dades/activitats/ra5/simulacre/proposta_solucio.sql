create or replace procedure nouAlumne (
						p_nom estudiant.nom%type,
						p_anyo estudiant.anyo%type,
						p_idcasa estudiant.casa_id%type
					)
IS
	aux integer;
	aux2 integer;
BEGIN
	select max(id) 
	into aux
	from estudiant;   -- Obtenemos el maximo id de la tabla estudiante
	
	aux:=aux+1;		-- El nuevo estudiante será uno más que el máximo

	select count(*) 
	into aux2
	from casa where id=p_idcasa;  -- Miramos si hay alguna casa con el id introducido

	if aux2 = 1 then
		if p_nom is not null then     -- Verificamos que el nom es obligatori
			if p_anyo >= 1 and p_anyo<=7 and p_anyo is not null then  -- Verificamos que el anyo es obligatori y que esté entre 1 y 7
				insert into estudiant values (aux, p_nom, p_anyo, p_idcasa);
				dbms_output.put_line('Tot correcte');
			ELSE
				dbms_output.put_line('Error: anyo');
			end if;
		ELSE
			dbms_output.put_line('Error: nom obligatori');
		end if;
	else 
		dbms_output.put_line('Error: La casa no existeix');
	end if ;
end;
/

CREATE OR REPLACE PROCEDURE aprova (
                            p_id estudiant.id%TYPE
                            )
IS
    curs_actual INTEGER;
BEGIN
   -- Faig el select into sense cap defensa doncs controlaré l'error per excepcions
    SELECT anyo INTO curs_actual 
    FROM estudiant
    WHERE id=p_id;
    
    IF curs_actual<7 THEN
        UPDATE estudiant SET anyo=anyo+1 WHERE id=p_id;
        DBMS_OUTPUT.put_line('Actualització realitzada');
    ELSE
        DBMS_OUTPUT.put_line('Error: L''estudiant ja estava a l''últim curs');
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.put_line('Error: No existeix cap estudiant amb aquest codi');
 
END;
/
 
-- Amb les dades que tenim tots els profes fan només una classes
-- Si vols que surtin més dades per veure si el cursor funciona 
-- podem fer algun insert més a la taula de clase.
-- Per exemple, podem fer que el profe 2 doni també BBDD i prog:
-- insert into clase values (11, 'BBDD', 2);
-- insert into clase values (12, 'Prog', 2);
CREATE OR REPLACE PROCEDURE consProfe (
                                p_id INTEGER
                            )
IS
    nom_profe profe.nom%TYPE;
    id_Casa casa.id%TYPE;
    nom_casa casa.nom%TYPE;
    CURSOR c_clase IS 
            SELECT * FROM classes   WHERE profe_id=p_id;
BEGIN
    SELECT nom, casa_id INTO nom_profe, id_Casa
    FROM profe WHERE id=p_id;
    DBMS_OUTPUT.put_line('******************************');
    DBMS_OUTPUT.put_line('****** DADES PROFESSOR/A *****');
    DBMS_OUTPUT.put_line('******************************');
    DBMS_OUTPUT.put_line('Nom Professor/a: ' || nom_profe);
    IF casa_id IS NOT NULL THEN   -- Si el profe està assignat a alguna casa la consultem
        SELECT nom INTO nom_casa
        FROM casa WHERE id = casa_id;
    ELSE                            -- Si no està assignat a cap casa mostrem aquest fet
        nom_casa= 'No assignat';
    END IF;
    DBMS_OUTPUT.put_line('Nom Casa: ' || nom_casa);
    DBMS_OUTPUT.put_line('Classes que imparteix: ');
    DBMS_OUTPUT.put_line('CODI    NOM');
    FOR x IN c_clase LOOP
        DBMS_OUTPUT.put_line(x.id || '      ' || x.nom);
    END LOOP;
    
EXCEPTION   
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.put_line('Error: No existeix cap profe amb aquest codi');
END;
/