/*! Copyright ©2013-2016 Memba® Sarl. All rights reserved. - Version 0.2.17 dated 6/3/2016 */
/*! Copyright ©2013-2016 Memba® Sarl. All rights reserved. - Version 0.2.17 dated 6/3/2016 */
webpackJsonp([2],{329:function(e,t,o){var i,r,s;!function(n,a){"use strict";r=[o(330),o(331),o(332)],i=n,s="function"==typeof i?i.apply(t,r):i,!(void 0!==s&&(e.exports=s))}(function(){"use strict";return function(){var e=window.app=window.app||{};e.cultures=e.cultures||{},e.cultures.fr={versions:{draft:{name:"Brouillon"},published:{name:"Version {0}"}},activities:{viewTitle:"Activités"},categories:{viewTitle:"Explorer"},drawer:{categories:"Explorer",favourites:"Favoris",activities:"Activités",settings:"Réglages"},favourites:{viewTitle:"Favoris"},player:{explanations:"Explications",instructions:"Instructions",viewTitle:"Page {0} de {1}"},settings:{viewTitle:"Réglages",user:"Utilisateur",version:"Version",language:"Langue",theme:"Thème"},summaries:{viewTitle:"Recherche"},viewModel:{languages:[{value:"en",text:"English"},{value:"fr",text:"French"}],themes:[{value:"fiori",text:"Fiori"},{value:"flat",text:"Flat"},{value:"material",text:"Material"},{value:"",text:"Native"},{value:"nova",text:"Nova"},{value:"office365",text:"Office 365"}]}},window.kendo.culture("fr-FR")}(),window.app},o(271))},330:function(e,t,o){var i,r,s;!function(n){r=[o(276)],i=n,s="function"==typeof i?i.apply(t,r):i,!(void 0!==s&&(e.exports=s))}(function(){!function(e,t){kendo.cultures["fr-FR"]={name:"fr-FR",numberFormat:{pattern:["-n"],decimals:2,",":" ",".":",",groupSize:[3],percent:{pattern:["-n %","n %"],decimals:2,",":" ",".":",",groupSize:[3],symbol:"%"},currency:{name:"Euro",abbr:"EUR",pattern:["-n $","n $"],decimals:2,",":" ",".":",",groupSize:[3],symbol:"€"}},calendars:{standard:{days:{names:["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],namesAbbr:["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],namesShort:["di","lu","ma","me","je","ve","sa"]},months:{names:["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],namesAbbr:["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."]},AM:[""],PM:[""],patterns:{d:"dd/MM/yyyy",D:"dddd d MMMM yyyy",F:"dddd d MMMM yyyy HH:mm:ss",g:"dd/MM/yyyy HH:mm",G:"dd/MM/yyyy HH:mm:ss",m:"d MMMM",M:"d MMMM",s:"yyyy'-'MM'-'dd'T'HH':'mm':'ss",t:"HH:mm",T:"HH:mm:ss",u:"yyyy'-'MM'-'dd HH':'mm':'ss'Z'",y:"MMMM yyyy",Y:"MMMM yyyy"},"/":"/",":":":",firstDay:1}}}}(this)})},331:function(e,t,o){var i,r,s;!function(n){r=[o(276)],i=n,s="function"==typeof i?i.apply(t,r):i,!(void 0!==s&&(e.exports=s))}(function(){!function(e,t){kendo.ui.FilterCell&&(kendo.ui.FilterCell.prototype.options.operators=e.extend(!0,kendo.ui.FilterCell.prototype.options.operators,{date:{eq:"Est égal à",gte:"Est postérieur ou égal à",gt:"Est postérieur",lte:"Est antérieur ou égal à",lt:"Est antérieur",neq:"N’est pas égal à",isnull:"Est nulle",isnotnull:"N’est pas nulle"},number:{eq:"Est égal à",gte:"Est supérieur ou égal à",gt:"Est supérieur à",lte:"Est inférieur ou égal à",lt:"Est inférieur à",neq:"N’est pas égal à",isnull:"Est nulle",isnotnull:"N’est pas nulle"},string:{endswith:"Se termine par",eq:"Est égal à",neq:"N’est pas égal à",startswith:"Commence par",contains:"Contient",doesnotcontain:"Ne contient pas",isnull:"Est nulle",isnotnull:"N’est pas nulle",isempty:"Est vide",isnotempty:"N’est pas vide"},enums:{eq:"Est égal à",neq:"N’est pas égal à",isnull:"Est nulle",isnotnull:"N’est pas nulle"}})),kendo.ui.FilterMenu&&(kendo.ui.FilterMenu.prototype.options.operators=e.extend(!0,kendo.ui.FilterMenu.prototype.options.operators,{date:{eq:"Est égal à",gte:"Est postérieur ou égal à",gt:"Est postérieur",lte:"Est antérieur ou égal à",lt:"Est antérieur",neq:"N’est pas égal à",isnull:"Est nulle",isnotnull:"N’est pas nulle"},number:{eq:"Est égal à",gte:"Est supérieur ou égal à",gt:"Est supérieur à",lte:"Est inférieur ou égal à",lt:"Est inférieur à",neq:"N’est pas égal à",isnull:"Est nulle",isnotnull:"N’est pas nulle"},string:{endswith:"Se termine par",eq:"Est égal à",neq:"N’est pas égal à",startswith:"Commence par",contains:"Contient",doesnotcontain:"Ne contient pas",isnull:"Est nulle",isnotnull:"N’est pas nulle",isempty:"Est vide",isnotempty:"N’est pas vide"},enums:{eq:"Est égal à",neq:"N’est pas égal à",isnull:"Est nulle",isnotnull:"N’est pas nulle"}})),kendo.ui.ColumnMenu&&(kendo.ui.ColumnMenu.prototype.options.messages=e.extend(!0,kendo.ui.ColumnMenu.prototype.options.messages,{columns:"Colonnes",sortAscending:"Tri croissant",sortDescending:"Tri décroissant",settings:"Paramètres de colonne",done:"Fini",lock:"Bloquer",unlock:"Ouvrir"})),kendo.ui.RecurrenceEditor&&(kendo.ui.RecurrenceEditor.prototype.options.messages=e.extend(!0,kendo.ui.RecurrenceEditor.prototype.options.messages,{daily:{interval:"jour(s)",repeatEvery:"Répéter chaque:"},end:{after:" Après",occurrence:"occurrence(s)",label:"Finir:",never:"Jamais",on:"Sur",mobileLabel:"Ends"},frequencies:{daily:"Une fois par jour",monthly:"Une fois par mois",never:"Jamais",weekly:"Une fois par semaine",yearly:"Une fois par an"},monthly:{day:"Jour",interval:"mois",repeatEvery:"Répéter chaque:",repeatOn:"Répéter l'opération sur:"},offsetPositions:{first:"premier",fourth:"quatrième",last:"dernier",second:"second",third:"troisième"},weekly:{repeatEvery:"Répéter chaque:",repeatOn:"Répéter l'opération sur:",interval:"semaine(s)"},yearly:{of:"de",repeatEvery:"Répéter chaque:",repeatOn:"Répéter l'opération sur:",interval:"année(ans)"},weekdays:{day:"jour",weekday:"jour de la semaine",weekend:"jour de week-end"}})),kendo.ui.Grid&&(kendo.ui.Grid.prototype.options.messages=e.extend(!0,kendo.ui.Grid.prototype.options.messages,{commands:{create:"Insérer",destroy:"Effacer",canceledit:"Annuler",update:"Mettre à jour",edit:"Éditer",excel:"Export to Excel",pdf:"Export to PDF",select:"Sélectionner",cancel:"Annuler les modifications",save:"Enregistrer les modifications"},editable:{confirmation:"Êtes-vous sûr de vouloir supprimer cet enregistrement?",cancelDelete:"Annuler",confirmDelete:"Effacer"},noRecords:"Aucun enregistrement disponible."})),kendo.ui.Pager&&(kendo.ui.Pager.prototype.options.messages=e.extend(!0,kendo.ui.Pager.prototype.options.messages,{allPages:"Tous",page:"Page",display:"Afficher les items {0} - {1} de {2}",of:"de {0}",empty:"Aucun enregistrement à afficher.",refresh:"Actualiser",first:"Aller à la première page",itemsPerPage:"articles par page",last:"Aller à la dernière page",next:"Aller à la page suivante",previous:"Aller à la page précédente",morePages:"Plusieurs pages"})),kendo.ui.FilterCell&&(kendo.ui.FilterCell.prototype.options.messages=e.extend(!0,kendo.ui.FilterCell.prototype.options.messages,{filter:"Filtrer",clear:"Effacer filtre",isFalse:"est fausse",isTrue:"est vrai",operator:"Opérateur"})),kendo.ui.FilterMenu&&(kendo.ui.FilterMenu.prototype.options.messages=e.extend(!0,kendo.ui.FilterMenu.prototype.options.messages,{filter:"Filtrer",and:"Et",clear:"Effacer filtre",info:"Afficher les lignes avec la valeur qui",selectValue:"-Sélectionner-",isFalse:"est fausse",isTrue:"est vrai",or:"Ou",cancel:"Annuler",operator:"Opérateur",value:"Valeur"})),kendo.ui.FilterMultiCheck&&(kendo.ui.FilterMultiCheck.prototype.options.messages=e.extend(!0,kendo.ui.FilterMultiCheck.prototype.options.messages,{checkAll:"Choisir toutes",clear:"Effacer filtre",filter:"Filtrer",search:"Recherche"})),kendo.ui.Groupable&&(kendo.ui.Groupable.prototype.options.messages=e.extend(!0,kendo.ui.Groupable.prototype.options.messages,{empty:"Faites glisser un en-tête de colonne et déposer ici pour grouper par cette colonne."})),kendo.ui.Editor&&(kendo.ui.Editor.prototype.options.messages=e.extend(!0,kendo.ui.Editor.prototype.options.messages,{bold:"Gras",createLink:"Insérer un lien hypertexte",fontName:"Police",fontNameInherit:"(police héritée)",fontSize:"Taille de police",fontSizeInherit:"(taille héritée)",formatBlock:"Style du paragraphe",indent:"Augmenter le retrait",insertHtml:"Insérer HTML",insertImage:"Insérer image",insertOrderedList:"Liste numérotée",insertUnorderedList:"Liste à puces",italic:"Italique",justifyCenter:"Centrer",justifyFull:"Justifier",justifyLeft:"Aligner le texte à gauche",justifyRight:"Aligner le texte à droite",outdent:"Diminuer le retrait",strikethrough:"Barré",styles:"Styles",subscript:"Subscript",superscript:"Superscript",underline:"Souligné",unlink:"Supprimer le lien hypertexte",deleteFile:'Êtes-vous sûr de vouloir supprimer "{0}"?',directoryNotFound:"Un répertoire avec ce nom n'a pas été trouvé.",emptyFolder:"Vider le dossier",invalidFileType:'Le fichier sélectionné "{0}" n\'est pas valide. Les types de fichiers supportés sont {1}.',orderBy:"Organiser par:",orderByName:"Nom",orderBySize:"Taille",overwriteFile:'Un fichier avec le nom "{0}" existe déjà dans le répertoire courant. Voulez-vous le remplacer?',uploadFile:"Télécharger",backColor:"Couleur de fond",foreColor:"Couleur",dialogButtonSeparator:"Ou",dialogCancel:"Fermer",dialogInsert:"Insérer",imageAltText:"Le texte de remplacement",imageWebAddress:"Adresse Web",imageWidth:"Largeur (px)",imageHeight:"Hauteur (px)",linkOpenInNewWindow:"Ouvrir dans une nouvelle fenêtre",linkText:"Text",linkToolTip:"Info-bulle",linkWebAddress:"Adresse Web",search:"Search",createTable:"Insérer un tableau",addColumnLeft:"Add column on the left",addColumnRight:"Add column on the right",addRowAbove:"Add row above",addRowBelow:"Add row below",deleteColumn:"Supprimer la colonne",deleteRow:"Supprimer ligne",dropFilesHere:"drop files here to upload",formatting:"Format",viewHtml:"View HTML",dialogUpdate:"Update",insertFile:"Insert file"}));var o={uploadFile:"Charger",orderBy:"Trier par",orderByName:"Nom",orderBySize:"Taille",directoryNotFound:"Aucun répértoire de ce nom.",emptyFolder:"Répertoire vide",deleteFile:'Etes-vous sûr de vouloir supprimer "{0}"?',invalidFileType:'Le fichier sélectionné "{0}" n\'est pas valide. Les type fichiers supportés sont {1}.',overwriteFile:'Un fichier du nom "{0}" existe déjà dans ce répertoire. Voulez-vous le remplacer?',dropFilesHere:"glissez les fichiers ici pour les charger",search:"Recherche"};kendo.ui.FileBrowser&&(kendo.ui.FileBrowser.prototype.options.messages=e.extend(!0,kendo.ui.FileBrowser.prototype.options.messages,o)),kendo.ui.ImageBrowser&&(kendo.ui.ImageBrowser.prototype.options.messages=e.extend(!0,kendo.ui.ImageBrowser.prototype.options.messages,o)),kendo.ui.Upload&&(kendo.ui.Upload.prototype.options.localization=e.extend(!0,kendo.ui.Upload.prototype.options.localization,{cancel:"Annuler",dropFilesHere:"déposer les fichiers à télécharger ici",remove:"Retirer",retry:"Réessayer",select:"Sélectionner...",statusFailed:"échoué",statusUploaded:"téléchargé",statusUploading:"téléchargement",uploadSelectedFiles:"Télécharger des fichiers",headerStatusUploaded:"Done",headerStatusUploading:"Uploading..."})),kendo.ui.Scheduler&&(kendo.ui.Scheduler.prototype.options.messages=e.extend(!0,kendo.ui.Scheduler.prototype.options.messages,{allDay:"toute la journée",cancel:"Annuler",editable:{confirmation:"Etes-vous sûr de vouloir supprimer cet élément?"},date:"Date",destroy:"Effacer",editor:{allDayEvent:"Toute la journée",description:"Description",editorTitle:"Evènement",end:"Fin",endTimezone:"End timezone",repeat:"Répéter",separateTimezones:"Use separate start and end time zones",start:"Début",startTimezone:"Start timezone",timezone:" ",timezoneEditorButton:"Fuseau horaire",timezoneEditorTitle:"Fuseaux horaires",title:"Titre",noTimezone:"Pas de fuseau horaire"},event:"Evènement",recurrenceMessages:{deleteRecurring:"Voulez-vous supprimer seulement cet évènement ou toute la série?",deleteWindowOccurrence:"Suppression de l'élément courant",deleteWindowSeries:"Suppression de toute la série",deleteWindowTitle:"Suppression d'un élément récurrent",editRecurring:"Voulez-vous modifier seulement cet évènement ou toute la série?",editWindowOccurrence:"Modifier l'occurrence courante",editWindowSeries:"Modifier la série",editWindowTitle:"Modification de l'élément courant"},save:"Sauvegarder",time:"Time",today:"Aujourd'hui",views:{agenda:"Agenda",day:"Jour",month:"Mois",week:"Semaine",workWeek:"Semaine de travail",timeline:"Chronologie"},deleteWindowTitle:"Suppression de l'élément",showFullDay:"Montrer toute la journée",showWorkDay:"Montrer les heures ouvrables"})),kendo.ui.Validator&&(kendo.ui.Validator.prototype.options.messages=e.extend(!0,kendo.ui.Validator.prototype.options.messages,{required:"{0} est requis",pattern:"{0} n'est pas valide",min:"{0} doit être plus grand ou égal à {1}",max:"{0} doit être plus petit ou égal à {1}",step:"{0} n'est pas valide",email:"{0} n'est pas un courriel valide",url:"{0} n'est pas une adresse web valide",date:"{0} n'est pas une date valide",dateCompare:"La date de fin doit être postérieure à la date de début"}))}(window.kendo.jQuery)})},332:function(e,t,o){var i,r,s;!function(o,n){"use strict";r=[],i=o,s="function"==typeof i?i.apply(t,r):i,!(void 0!==s&&(e.exports=s))}(function(){"use strict";var e,t=window.kendo,o=t.ui;return function(i,r){if(o.AssetManager&&(e=o.AssetManager.prototype.options,e.messages=i.extend(!0,e.messages,{toolbar:{upload:"Mettre en ligne","delete":"Supprimer",filter:"Collection: ",search:"Recherche"},tabs:{"default":"Projet"}})),o.Explorer&&(e=o.Explorer.prototype.options,e.messages=i.extend(!0,e.messages,{empty:"Rien à afficher"})),o.MediaPlayer&&(e=o.MediaPlayer.prototype.options,e.messages=i.extend(!0,e.messages,{play:"Jouer/Pauser",mute:"Avec/Sans son",full:"Plein écran",notSupported:"Fichier non supporté"})),o.MultiInput&&(e=o.MultiInput.prototype.options,e.messages=i.extend(!0,e.messages,{"delete":"Effacer"})),o.Navigation&&(e=o.Navigation.prototype.options,e.messages=i.extend(!0,e.messages,{empty:"Rien à afficher"})),o.PlayBar&&(e=o.PlayBar.prototype.options,e.messages=i.extend(!0,e.messages,{empty:"Rien à afficher",page:"Page",of:"de {0}",first:"Aller à la première page",previous:"Aller à la dernière page",next:"Aller à la prochaine page",last:"Aller à la page précédente",refresh:"Rafraichîr",morePages:"Plus de pages"})),o.PropertyGrid&&(e=o.PropertyGrid.prototype.options,e.messages=i.extend(!0,e.messages,{property:"Propriété",value:"Valeur"})),o.Quiz&&(e=o.Quiz.prototype.options,e.messages=i.extend(!0,e.messages,{optionLabel:"Sélectionner..."})),o.Stage&&(e=o.Stage.prototype.options,e.messages=i.extend(!0,e.messages,{contextMenu:{"delete":"Supprimer",duplicate:"Dupliquer"},noPage:"Veuillez ajouter ou sélectionner une page"})),o.StyleEditor&&(e=o.StyleEditor.prototype.options,e.messages=i.extend(!0,e.messages,{columns:{name:"Nom",value:"Valeur"},toolbar:{create:"Nouveau",destroy:"Effacer"},validation:{name:"Nom de style manquant",value:"Valeur manquante"}})),window.kidoju){var s,n,a=window.kidoju,l=a.data,u=a.tools,p=a.Tool;l&&l.Page&&(l.Page.prototype.messages={emptyPage:"La page {0} ne doit pas être vide.",minConnectors:"Au moins {0} Connecteurs sont nécessaires pour faire une question en page {1}.",missingDraggable:"Des Étiquettes et Images déplaçables sont requis pour la/les Zone(s) de Dépôt en page {0}.",missingDropZone:"Une Zone de Dépôt est requise pour les Étiquettes et Images déplaçables en page {0}.",missingLabel:"Une Étiquettes est recommandée en page {0}.",missingMultimedia:"Un élément multimédia (Image, Audio, Vidéo) est recommandé en page {0}.",missingQuestion:"Une question est recommandé en page {0}.",missingInstructions:"Des instructions sont recommandées en page {0}.",missingExplanations:"Les explications manquent en page {0}."}),l&&l.Stream&&(l.Stream.prototype.messages={duplicateNames:"Supprimez les composants utilisant le même nom `{0}` en pages {1}",minPages:"Il faut au moins {0} pages pour pouvoir publier.",minQuestions:"Il faut au moins {0} questions pour pouvoir publier.",typeVariety:"On recommande l'usage d'au moins {0} types de questions (Choix Multiple, Boîte de Texte, Connecteurs ou autre).",qtyVariety:"On recommande plus de variété quand {0:p0} des questions sont du type {1}."}),p&&p.constructor&&"Function"===p.constructor.name&&(p.prototype.i18n=i.extend(!0,p.prototype.i18n,{tool:{top:{title:"Pos. Haut"},left:{title:"Pos. Gauche"},height:{title:"Hauteur"},width:{title:"Largeur"},rotate:{title:"Rotation"}},dialogs:{ok:{text:"OK"},cancel:{text:"Annuler"}},messages:{missingDropValue:"Une {0} en page {1} nécessite une valeur de dépôt dans la logique de test.",missingDescription:"Un(e) {0} nommé(e) `{1}` en page {2} nécessite une question dans la logique de test.",missingSolution:"Un(e) {0} nommé(e) `{1}` en page {2} nécessite une solution dans la logique de test.",missingValidation:"Un(e) {0} nommé(e) `{1}` en page {2} nécessite une formule de validation dans la logique de test.",invalidFailure:"Un(e) {0} nommé(e) `{1}` en page {2} a un score d'échec supérieur au score d'omission ou zéro dans la logique de test.",invalidSuccess:"Un(e) {0} nommé(e) `{1}` en page {2} a un score de succès inférieur au score d'omission ou zéro dans la logique de test."}})),u instanceof t.Observable&&(u.audio instanceof p&&(u.checkbox.constructor.prototype.description="Lecteur Audio",s=u.audio.constructor.prototype.attributes,s.autoplay.title="Auto.",s.mp3.title="Fichier MP3",s.ogg.title="Fichier OGG"),u.chargrid instanceof p&&(u.chargrid.constructor.prototype.description="Character Grid",s=u.chargrid.constructor.prototype.attributes,s.blank.title="Vide",s.columns.title="Colonnes",s.layout.title="Mise en Page",s.rows.title="Lignes",s.whitelist.title="Caractères",n=u.chargrid.constructor.prototype.attributes,n.name.title="Nom",n.description.title="Question",n.solution.title="Solution",n.validation.title="Validation",n.success.title="Succès",n.failure.title="Échec",n.omit.title="Omission"),u.checkbox instanceof p&&(u.checkbox.constructor.prototype.description="Boîte à Cocher",s=u.checkbox.constructor.prototype.attributes,s.data.title="Valeurs",s.data.defaultValue="Option 1\nOption 2",s.groupStyle.title="Style Groupe",s.itemStyle.title="Style Element",s.selectedStyle.title="Style Sélection",n=u.checkbox.constructor.prototype.properties,n.name.title="Nom",n.description.title="Question",n.solution.title="Solution",n.validation.title="Validation",n.success.title="Succès",n.failure.title="Échec",n.omit.title="Omission"),u.connector instanceof p&&(u.connector.constructor.prototype.description="Connecteur",s=u.connector.constructor.prototype.attributes,s.color.title="Couleur",n=u.connector.constructor.prototype.properties,n.name.title="Nom",n.description.title="Question",n.solution.title="Solution",n.validation.title="Validation",n.success.title="Succès",n.failure.title="Échec",n.omit.title="Omission"),u.dropzone instanceof p&&(u.dropzone.constructor.prototype.description="Zone de Dépot",s=u.dropzone.constructor.prototype.attributes,s.style.title="Style",s.text.title="Texte",s.text.defaultValue="Veuillez déposer ici.",n=u.dropzone.constructor.prototype.properties,n.name.title="Nom",n.description.title="Question",n.solution.title="Solution",n.validation.title="Validation",n.success.title="Succès",n.failure.title="Échec",n.omit.title="Omission"),u.image instanceof p&&(u.image.constructor.prototype.description="Image",s=u.image.constructor.prototype.attributes,s.alt.title="Texte",s.alt.defaultValue="Image",s.src.title="Source",s.style.title="Style",n=u.image.constructor.prototype.properties,n.draggable.title="Déplaçable",n.dropValue.title="Valeur"),u.label instanceof p&&(u.label.constructor.prototype.description="Étiquette",s=u.label.constructor.prototype.attributes,s.style.title="Style",s.text.title="Texte",s.text.defaultValue="Label",n=u.label.constructor.prototype.properties,n.draggable.title="Déplaçable",n.dropValue.title="Valeur"),u.mathexpression instanceof p&&(u.mathexpression.constructor.prototype.description="Expression Mathématique",s=u.mathexpression.constructor.prototype.attributes,s.formula.title="Formule",s.style.title="Style"),u.quiz instanceof p&&(u.quiz.constructor.prototype.description="Question à Choix Multiple",s=u.quiz.constructor.prototype.attributes,s.data.title="Valeurs",s.data.defaultValue="Vrai\nFaux",s.groupStyle.title="Style Groupe",s.itemStyle.title="Style Element",s.mode.title="Mode",s.selectedStyle.title="Style Sélection",n=u.quiz.constructor.prototype.properties,n.name.title="Nom",n.description.title="Question",n.solution.title="Solution",n.validation.title="Validation",n.success.title="Succès",n.failure.title="Échec",n.omit.title="Omission"),u.textbox instanceof p&&(u.textbox.constructor.prototype.description="Boîte de Texte",s=u.textbox.constructor.prototype.attributes,s.style.title="Style",n=u.textbox.constructor.prototype.properties,n.name.title="Nom",n.description.title="Question",n.solution.title="Solution",n.validation.title="Validation",n.success.title="Succès",n.failure.title="Échec",n.omit.title="Omission"),u.video instanceof p&&(u.video.constructor.prototype.description="Lecteur Vidéo",s=u.video.constructor.prototype.attributes,s.autoplay.title="Auto.",s.toolbarHeight.title="Haut. Commandes",s.mp4.title="Fichier MP4",s.ogv.title="Fichier OGV",s.wbem.title="Fichier WBEM"))}}(window.kendo.jQuery),window.kendo},o(271))}});
//# sourceMappingURL=app.culture.fr.chunk.js.map?v=0.2.17