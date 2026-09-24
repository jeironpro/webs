/* *****************************************************
  INSTITUT TIC de Barcelona
    CFGS DAM i DAW
    Mòdul: 0484 Bases de dades. 
    AUTORS: Jordi Quesada
    DATA: 
****************************************************** */

-- Problema 1

select nom, icao 
from companyia 
where pais='Spain'
order by icao;

-- Problema 2
select num_serie, fabricant, any_fabricacio as any, companyia 
from avio 
where any_fabricacio>=2020 and fabricant not like 'Boeing%' 
order by any_fabricacio, fabricant, num_serie;

-- Problema 3
select concat('L''aeroport ', nom, ' està a ', ciutat,' i va ser construït l''any ', any_construccio) as aeroport 
from aeroport 
where pais='Spain'
order by nom;

-- Problema 4
select nom, pais, char_length(nom) as longitud 
from aeroport 
where char_length(nom) between 7 and 9 and nom like '%e%e%e%'
order by char_length(nom) desc, pais;

-- Problema 5
select num_serie 
from avio
where (fabricant like 'concorde' or companyia = 'Alitalia') and any_fabricacio=2008 
order by num_serie;

-- Problema 6
select concat(cognom, ', ', nom) as nom_complet
from passatger
where (nom like '%k%k%' or cognom like '%k%k%') and adreca like '%BARCELONA%' 
order by cognom;

-- Problema 7
select distinct fabricant 
from avio 
where any_fabricacio=2000
order by fabricant;

-- Problema 8
select cognom, nom, date_format(data_naix, '%d/%m%/%Y (%W)') as naixement 
from passatger 
where year(data_naix)=2003 and month(data_naix)=10 and nom not like '%a%'
order by data_naix desc, cognom;

-- Problema 9
select nom, cognom, telefon, data_naix
from passatger 
where TIMESTAMPDIFF(YEAR, data_naix, NOW()) BETWEEN 54 AND 55
and telefon%2=1 and adreca is null
order by data_naix, nom;


-- També podria ser:
-- WHERE TIMESTAMPDIFF(YEAR, data_naix, NOW()) BETWEEN 54 AND 55
-- WHERE data_naix >= DATE_SUB(NOW(), INTERVAL 54 YEAR)  AND data_naix < DATE_SUB(NOW(), INTERVAL 56 YEAR)

-- Explicació: Suposant que avui és 20/2/2025 cal incloure
-- a) persones amb 54 anys: Les nascudes entre 21/2/1970 i 20/2/1971
-- b) persones amb 55 anys: Les nascudes entre 21/2/1969 i 20/2/1970
-- Però no s'ha d'incloure el 20/2/1969 doncs ja tindria 56 anys

-- Per tant, la opció WHERE data_naix BETWEEN DATE_SUB(NOW(), INTERVAL 55 YEAR) AND DATE_SUB(NOW(), INTERVAL 54 YEAR) no és correcta doncs inclou la data 20/2/1969
-- La opció  WHERE data_naix >= DATE_SUB(NOW(), INTERVAL 54 YEAR)  AND data_naix < DATE_SUB(NOW(), INTERVAL 56 YEAR)   és correcta perquè fa servir < i no <=