
-- ------------------------------------------------------
--  Constraints de clau primària
-- ------------------------------------------------------

ALTER TABLE companyia ADD CONSTRAINT PK_companyia PRIMARY KEY (nom);
  
ALTER TABLE hostessa ADD CONSTRAINT PK_hostessa PRIMARY KEY (num_empleat);
 
ALTER TABLE avio ADD CONSTRAINT PK_avioSERIALNUMBER PRIMARY KEY (num_serie);
 
ALTER TABLE aeroport ADD CONSTRAINT PK_aeroport PRIMARY KEY (codi);

ALTER TABLE mostrador ADD CONSTRAINT PK_numero PRIMARY KEY (numero, codi_aeroport);
 
ALTER TABLE personal ADD CONSTRAINT PK_personal PRIMARY KEY (num_empleat);
 
ALTER TABLE vol ADD CONSTRAINT PK_vol PRIMARY KEY (codi);

ALTER TABLE passatger ADD CONSTRAINT PK_passatger PRIMARY KEY (passaport);

ALTER TABLE pilot ADD CONSTRAINT PK_pilot PRIMARY KEY (num_empleat);

ALTER TABLE volar add constraint pk_volar primary key (passatger, vol);
-- ------------------------------------------------------
--  Constraints de clau forana
-- ------------------------------------------------------

ALTER TABLE companyia ADD CONSTRAINT FK_companyia_companyia FOREIGN KEY (filial_de)
  REFERENCES companyia (nom) on update cascade;

ALTER TABLE hostessa ADD CONSTRAINT FK_hostessa_empleat FOREIGN KEY (num_empleat)
  REFERENCES personal (num_empleat) on delete cascade on update cascade;

ALTER TABLE pilot ADD CONSTRAINT FK_pilot_empleat FOREIGN KEY (num_empleat)
  REFERENCES personal (num_empleat) on delete cascade on update cascade;

ALTER TABLE avio ADD CONSTRAINT FK_avio_companyia FOREIGN KEY (companyia)
  REFERENCES companyia (nom) on update cascade;

ALTER TABLE Mostrador ADD CONSTRAINT FK_Mostrador_aeroport FOREIGN KEY (codi_aeroport)
  REFERENCES aeroport (codi) on delete cascade on update cascade;

ALTER TABLE vol ADD CONSTRAINT FK_vol_hostessa FOREIGN KEY (hostessa)
  REFERENCES hostessa (num_empleat) on update cascade;

ALTER TABLE vol ADD CONSTRAINT FK_vol_pilot FOREIGN KEY (pilot)
  REFERENCES pilot (num_empleat) on update cascade;
  
ALTER TABLE vol ADD CONSTRAINT FK_vol_origen FOREIGN KEY (aeroport_origen)
  REFERENCES aeroport (codi) on update cascade;
  
ALTER TABLE vol ADD CONSTRAINT FK_vol_desti FOREIGN KEY (aeroport_desti)
  REFERENCES aeroport (codi) on update cascade;
  
ALTER TABLE vol ADD CONSTRAINT FK_vol_avio FOREIGN KEY (avio)
  REFERENCES avio (num_serie) on update cascade;

ALTER TABLE volar ADD CONSTRAINT FK_volar_passatger FOREIGN KEY (passatger)
  REFERENCES passatger(passaport)  on update cascade;
  
ALTER TABLE volar ADD CONSTRAINT FK_volar_vol FOREIGN KEY (vol)
  REFERENCES vol(codi)  on update cascade;

-- ------------------------------------------------------
--  Constraints de check
-- ------------------------------------------------------
	  
ALTER TABLE volar add constraint ch_seient check (seient>=1 and seient <=200);

ALTER TABLE avio ADD CONSTRAINT CH_tipus Check (tipus='COM-PAS' or tipus='JET' or tipus='CARGO');

ALTER TABLE vol ADD CONSTRAINT CH_descripcio Check (descripcio='ON-TIME' or descripcio='DELAYED' or descripcio='UNKNOWN');

ALTER TABLE vol ADD CONSTRAINT CH_durada_vol_check CHECK (durada >= 10 AND durada <= 1200);

ALTER TABLE pilot ADD CONSTRAINT CH_hores_vol_check CHECK (hores_vol >= 400);

ALTER TABLE personal ADD CONSTRAINT CH_sou_check CHECK (sou >= 20000);



-- ------------------------------------------------------
--  Constraints de UNIQUE
-- ------------------------------------------------------

ALTER TABLE aeroport ADD CONSTRAINT UQ_IATA UNIQUE (IATA);

ALTER TABLE personal ADD CONSTRAINT UQ_Personal_passport UNIQUE (passaport);

ALTER TABLE volar ADD CONSTRAINT UQ_volar_seient UNIQUE (vol, seient);