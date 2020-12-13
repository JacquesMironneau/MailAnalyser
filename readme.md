# Projet GL02 A20 
**Nom d'équipe**: Team4Software  
**Auteurs**: Manon Caroy, Augustin Borne, Jacques Mironneau  
**Licences**: 

## I) Aide et installation

Récupérez le projet, lancez depuis un terminal la commande :  
```npm install```  
  (installe toutes les dépendances nécessaires)

Pour vérifier que le projet est correctement installé, une page d’aide sur le logiciel devrait apparaître avec la commande :  
    ```node cli.js help```  
 La commande expliquera succinctement les commandes possibles suivantes :

Les commandes existantes sont affichées dans le node cli.js help : 
```node cli.js help <nom-commande>```

Pour chaque commande : un \<file\> représente une liste de fichier et/ou dossier séparés par une virgule (sans espace), exemples possibles :
- test1.txt,test2.txt,dossier1,dossier2
- test1.txt
- dossier1
- dossier1,dossier2
- test1.txt,test2.txt

Une date est représentée sous la forme mm/dd/yyyy soit 02/03/2020 pour le 3 février 2020.  
Chaque commande possède un alias: count-mail est équivalent à cm par exemple.

### Afficher les contacts sous format VCard : 
```node cli.js get-contacts <files> [OPTIONS...]```  
Alias: ```node cli.js gc <files> [OPTIONS...]```  
 
Arguments :   
**<  files>** : List of data file (emails)  

Options :  
- **-c, --collaborators [emaillist]** : emails des collaborateurs séparés par une virgule  
- **-o, --out < outputfile>** : export des contacts dans un fichier texte au lieu du terminal.  
Exemple :  
```node cli.js gc <files> -c toto@utt.fr```  
```node cli.js gc <files> --collaborators toto@utt.fr```  
```node cli.js gc <files> -c toto@utt.fr, tata@utt.fr```  
```node cli.js gc <files> -c toto@utt.fr -o rendu.txt```  
```node cli.js gc <files> --out rendu.txt``` 


### Récupérer le nombre de mails écrits sur une période : 
```node cli.js count-mail <files> <beginning-date> <ending-date>```    
Alias: ```node cli.js cm <files> <beginning-date> <ending-date>```    

Arguments :   
- **< files>** : Liste des fichiers (emails)  
- **< beginning-date>** : date au format mm/dd/yyyy  
- **< ending-date>** : date au format mm/dd/yyyy

Options :  
- **--mail-senders** : permet de spécifier la liste des emails des auteurs des mails comptés

Exemple:  
```node cli.js count-mail <files> <beginning-date> <ending-date> --mail-senders augustin@utt.fr,manon@utt.fr,jacques@utt.fr```

### Récupérer les jours où un mail a été écrit entre 22h et 8h ou le week-end
```node cli.js buzzy-days <files> <beginning-date> <ending-date>```  
Alias: ```node cli.js bd <files> <beginning-date> <ending-date>```

Arguments :   
- **< files>** : Liste des fichiers (emails)
- **< beginning-date>** : date au format mm/dd/yyyy
- **< ending-date>** : date au format mm/dd/yyyy  

Options : 
- **--mail-senders** : permet de spécifier l’email d’un auteur  
Exemple:  
```node cli.js buzzy-days <files> <beginning-date> <ending-date> --mail-sender manoncaroy@utt.fr```

### Récupérer le top 10 des interlocuteurs les plus fréquents pour un collaborateur
```node cli.js top10-collaborator <files> <mail> [OPTIONS...]```  
Alias: ```node cli.js tc <files> <mail> [OPTIONS...]```  

Arguments :  
**< files>** : Liste des fichiers (emails)  
**< mail>** : mail d'un collaborateur  

Options :  
**-f,--format < format>** : Préciser l’extension du fichier exporté "svg"ou "png", Par défaut si on ne spécifie pas l’option: "png"  
Exemples:  
```node cli.js tc <files> toto@utt.fr```  
```node clis.js top10-collaborator <files> toto@utt.fr```  
```node clis.js tc <files> -f svg```  
```node clis.js tc <files> --format svg```  
```node clis.js tc <files> --format png```  

### Récupérer le top 10 des termes les plus utilisés dans le sujet pour une boîte mail donnée
```node cli.js top10-words  <files> <mail> [OPTIONS...]```  
Alias: ```node cli.js tw  <files> <mail> [OPTIONS...]```


Arguments :  
**< files>** : Liste des fichiers (emails)  
**< mail>** : mail d'un collaborateur  

Options :  
**-f,--format < format>** : Préciser l’extension du fichier exporté "svg"ou "png", Par défaut si on ne spécifie pas l’option: "png"  

Exemples:  
```node cli.js tw <files> toto@utt.fr```  
```node clis.js top10-words  <files> toto@utt.fr```  
```node clis.js tw <files> -f svg```  
```node clis.js tw <files> --format svg```  
```node clis.js tw <files> --format png```  

### Créer une visualisation en nuage de points des interactions entre les collaborateurs d’une boîte mail donnée
```node cli.js exchange-between-collaborators <files> <email> [OPTIONS...]```  
Alias: ```node cli.js ebc <files> <email> [OPTIONS...]```  

Arguments :  
- **< files>** : Liste de fichiers de données (emails file)  
- **< mail>** : Email du collaborateur  

Options :  
- **-f,--format < format>** :  Préciser l’extension du fichier exporté "svg"ou "png", Par défaut si on ne spécifie pas l’option: "png".  
    Exemple :
        ```node cli.js exchange-between-collaborators dossier  manoncaroy@utt.fr -f svg```


### Récupérer une liste de mails selon le collaborateur donné
```node cli.js search-mail  <files> <mail>```  
Alias: ```node cli.js se <files> <mail>```  

Arguments :  
**< files>** : Liste des fichiers (emails)  
**< mail>** : mail d'un collaborateur  
Options :  
- **-o, --out < outputfile>** : export des contacts dans un fichier texte au lieu du terminal.  
Exemple:  
```node cli.js search-mail <files> toto@utt.fr```    
```node cli.js se <files> toto@utt.fr```  
```node cli.js se <files> toto@utt.fr -o resul.txt ```  

## Dépendances
Les dépendances du projet sont :  
- "@caporal/core": "2.0.2"  
- "canvas": "2.6.1"  
- "vega": "5.17.0"  
- "vega-lite": "4.17.0"  

## Test et jeux de données fournis

Pour les jeux de données, nous avons les fichiers :  
-- donnesSujetB/j-arnold/sent_mail/3_  
-- donneesSujetB/j-arnold/sent_mail/9_  
-- donneesSujetB/j-arnold/sent_mail/1159_  
-- donneesSujetB/j-arnold/avaya  
-- test (fichier créé vide)  
-- test2 (fichier créé avec le champ From vide)  

## Ecarts éventuels au cahier des charges

- **SPEC1.1 :** En plus de ce qui a été décrit dans le cahier des charges, on peut exporter les contacts affichés dans un fichier.  
- **SPEC1.6 :**  
  - entrée = email du collaborateur  
  - schéma = collaborateurs (contact1) en abscisse et collaborateurs (contact2) en ordonnée  
- **SPEC1.7 :** comparaison de la partie “from:” → on ne peut filtrer qu’avec le mail, on peut exporter les mails dans un fichier.  
- **SPEC1.8 :**
  - considérée automatique pour chaque autre spec et non comme une demande de l’utilisateur  
  - nous n’affichons pas les mails extraits car ils ont la même forme que le fichier de départ et que cela deviendrait illisible pour énormément de données. Cependant, lorsque nous devons afficher des mails dans d’autres specs, nous affichons les informations From: To: Subject: and Content: (=message)  
  - d’après l’ABNF, nous avons considéré uniquement le dernier mail écrit ou répondu (c’est-à-dire le premier mail de chaque fichier) en considérant que les autres mails font partie du message. En effet, le dernier mail est celui qui nous intéresse car, par exemple, un mail peut avoir été transféré au collaborateur sans pour autant que celui-ci communique directement avec l’auteur du mail transféré.  
  - nous avons remarqué que certains mails avaient un format particulier en ajoutant les lignes Cc: ou Bcc:. Ces lignes n’étant pas considérées dans l’ABNF, nous ne les avons pas pris en compte. De plus, certains mails prenaient plusieurs lignes pour les destinataires, nous les avons donc regrouper en une seule ligne pour pouvoir extraire les données correctement.  
- **SPEC2.1 :**  Les graphiques sont par défaut au format PNG mais on peut le générer en SVG à l’aide d’une option (-f svg)  
- **Spécifications algébriques** :  
pas de type de données correspondants à StringList[], il peut être simplifié par un tableau de Str
