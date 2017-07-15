 
 /**
 Variable contenant le nombre de colonnes et des lignes et un pointeur sur le formulaire de saisie
 du nombre de lignes et de colonnes 
 **/
  var nbColonnes, nbLignes,myForm;
  
 $( init );
 
function init() {

	
}
 
 $(document).ready(function(){
	   	nbColonnes = $('#nbcolonnes'),
	  	nbLignes = $('#nblignes');
	   	myForm = document.getElementById('formDimensions');
 });
 
  var MatriceGauche = [];    /* Matrice de gauche */
  var MatriceDroite = [];   /* Matrice de droite */
  var EspaceTempoOccupee ;    /*Indique si l'espace tempo est pris */    
  var LogDeplacements = [];  /*Log des déplacements effectués **/
  var LIGNECOURANTE = [];    
  var NbDeplacements = 0; 	/** Compteur du nombre de déplacements **/
  var CompteurCasesPleines = []; /** Indique le nombre de cases remplies dans la matrice de droite **/

var nbLines;
var nbCols;

 var Log = [];
  
	 function draw(){
		 
		/** Effacer le contenu des matrices et de l'espace tempo **/ 
		 	$('#matriceA').html( '' );
	 		$('#matriceB').html( '' );
			$('#espaceTempo').html( '' );
			
			 
		 EspaceTempoOccupee = false; /** Espace tempo vide **/
			 
			 
		/** Recupérer le nombre de lignes et de colonnes **/
		nbLines = parseInt(nbLignes.val(), 10);
		nbCols = parseInt(nbColonnes.val(), 10);
	       
		/**Générer la matrice de gauche **/	 
			MatriceGauche = randomTable(nbLines*nbCols);
			 
		/**Dessiner la matrice de gauche , de droite vide et l'espace tempo vide  **/	 
			drawmatrix(false,nbCols,nbLines, 1);
			drawmatrix(true,nbCols,nbLines,2);
			drawmatrix(true,1,1,3);
		 
		 /**Rendre les cases de la première ligne de la matrice de droite déplacables **/
		 initFirstLineLeftMatrix();
		 
		 /**Faire  des cases de la dernière ligne  de la matrice de droite  des dépôts **/
		 initFirstSlot();
		 
		 /**Initialiser les compteurs des cases remplies par colonne de la matrice de gauche à 0**/
		 initCompteurCasesPleines();
		 
      	//GenererSolution(nbcol,nbLines);
      }
	  
	  
	  function drawmatrix(empty, col, line,  matrix)
	  {
				    
		 for(var i=0;i<line;i++)
		  {
			  
			  if(matrix===1)
			  {
				   $('<div></div>').attr({ 
							'class' : 'row ligneA',
							'id' : 'ligne_A'+i} 
 					).appendTo( '#matriceA' ) 
			  }
			  else
			  {
				  if(matrix===2)
				  {
				  	$('<div></div>').attr({ 
							'class' : 'row ligneB',
							'id' : 'ligne_B'+i} 
 					).appendTo( '#matriceB'  ) 
					  
				  }
				  else
				  {
				  	$('<div></div>').attr({ 
							'class' : 'row ligneT',
							'id' : 'ligne_T'+i} 
 					).appendTo( '#espaceTempo'  ) 
					  
				  }
				   
			  }
			
		    for(var j=0; j<col;j++)
			{
			 if(empty === false)
			 {
				 
				if(matrix ===1)
				{
					
					  $('<div>' + MatriceGauche[i*col+j] + '</div>').data( 'number', MatriceGauche[i*col+j] ).attr(
					
						{ 
							'class' : 'gauche col', /** Assigner les class  'gauche' 'col' et  'case' **/
							'id' : 'case_A'+(i*col+j), /** Assigner pour id case_A + numero de la case **/
							'data-line' : i, // Stocker le numero de la ligne
							'data-col' : j  //Stocker le numero de colonne
					   	} 
 					).appendTo( '#ligne_A'+i);
				}
				else
				{
					
					 $('<div>' + MatriceDroite[i*col+j] + '</div>').appendTo( '#ligne_B'+i );
				}
			   
			 }
			 else /** Matrice vide **/
			 {
				 if(matrix === 2)  /**Matrice de droite **/
				 {
				 	
					  $('<div> vide</div>').data( 'number', (i*col+j) ).attr(
					
						{ 
							'class' : 'col  droite',
							'id' : 'case_B'+(i*col+j),
							'data-col' : j,
							'data-line' : i, // Stocker le numero de la ligne
					   	} 
 					).appendTo( '#ligne_B'+i );
					 
				 }
				 else
				 {
				 	  $('<div> vide</div>').data( 'number', (i*col+j) ).attr(
					
						{ 
							'class' : 'col  tempo slot',
							'id' : 'tempo'+(i*col+j)
					   	} 
 					).appendTo( '#ligne_T'+i ).droppable( {
						accept: '.gauche, .droite',  /**Accepter les cases de la matrice de gauche et droite **/
						drop: handleCaseDrop, /** Procédure appelée lors du déplacement de l'élement **/
   				    } );
					 
					 
				 }
				
					
				
				
			 }

			}
		  }
         
        }
	  

	 
	  function randomTable(nbElement)
	  {
		var numeros = [];  
		var randomValues = [];
		var ind = 0;
		
		for(var i=0; i<nbElement;i++)
		{
			 numeros [i] = i+1;
		
		}
		
		while(numeros.length>1)
		{
		 ind = Math.floor(Math.random() * numeros.length) ;
		 randomValues.push(numeros[ind]);
		 numeros.splice(ind,1);
		
		}
		randomValues.push(numeros[0]);
		
		console.log(randomValues);
		
		return randomValues;
	  
	  }
	  
	  function GenererSolution(col,line)
		{
		   var i =0, j =0, k=0, colCourante = 0;
		     NbDeplacements =0;
		    var nbMaxElCol = 0;
		    var rangerTempo = [];

		   MatriceDroite = [col*line];

		   Log  = [col*line];

		    for(i=line-1;i>=0;i--)
		    {
		      for(j=0;j<=col;j++)
		      {
		        if(nbMaxElCol==line)  //A chaque fois qu'on atteint le nombre
		        //D'élement par colonne et si on n'est
		        //Pas à la première ligne de la Matrice de Gauche
		        {

		          rangerTempo.sort(function compareNombres(a, b) {
		            return b - a;
		          }); //Ranger la liste tempo dans l'ordre  croissant


		          /* Ajouter  chaque élement la liste tempo dans
		           * la prochaine colonne de la matrice de droite
		           */
		          for(k=line-1;k>=0;k--)
		          {
		            //printf("Deplacement [GAUCHE - DROITE ] de la case N° %d  dans la colonne %d\n",rangerTempo[0],colCourante);

		           Log[col*line - NbDeplacements -1] = "Deplacement [GAUCHE - DROITE ] de la case N° " + rangerTempo[0]+ "dans la colonne N° "+ colCourante

		           MatriceDroite[k*col + colCourante] = rangerTempo[0]
		            rangerTempo.splice(0,1);
		            NbDeplacements = NbDeplacements+ 1;
		          }

		          //Passer à la colonne suivante de la Matrice de Droite
		          colCourante = colCourante+1;
		          nbMaxElCol = 0;

		        }

		        if((j<col)&&(i<line))
		        {
		          //Stocker l'élement suivant de la Matrice de Gauche dans une liste rangerTempo
		          //Pour la nouvelle colonne de la Matrice de Droite
		          rangerTempo.push(MatriceGauche[i*col+ j]);
		          nbMaxElCol +=1;

		        }



		      }
		    }
				
		}

		  
	  
	  function LireDimensions()
	  {
		  var correct = true ;
			if(nbColonnes.val() === ""){ // si le champ est vide
				nbColonnes.css({ // on rend le champ rouge
					borderColor : 'red',
					color : 'red'
				});
				
				correct = false;
			} 
			
			if(nbLignes.val() === ""){ // si le champ est vide
				nbLignes.css({ // on rend le champ rouge
					borderColor : 'red',
					color : 'red'
				});
				
				correct = false;
			} 
			
			if(correct ===true)
			{
				draw();
			}
	  }
	  
	  

	  $( "#formDimensions" ).submit(function( event ) {
		  alert('test');
		  LireDimensions();
		  event.preventDefault();
	});
	  
	  /** Fonction de gestion des mouvements**/
	  
	  function handleCaseDrop( event, ui ) {
		  
			  var dest = $(this).attr( 'id' ); /** Cellule de destination **/
			  var origin = ui.draggable.attr( 'id' ); /** Cellule de départ **/
		      var numberOrigin = parseInt(ui.draggable.data('number'),10); /** Recupérer le numéro de la case d'origine **/
		      var line = parseInt($("#"+origin).attr('data-line'),10);
			  var colOrigin = parseInt($("#"+origin).attr('data-col'),10);
		 
		 
		 console.log($("#"+origin).hasClass('gauche'));
		  
		
			   
			   if($(this).hasClass('tempo')===true) /** Si la destination est l'espace tempo **/
			   {
			   	   if(EspaceTempoOccupee===false ) /** Si l'espace tempo est vide **/
			   		{
			   			
						
						deplacer('tempo0',numberOrigin,origin); // Effectuer le déplacement
						
						
						/**Indiquer que l'espace tempo est pris **/
						EspaceTempoOccupee = true;
						
					
						if($("#"+origin).hasClass('gauche')===true)  /** Si l'origine est une case de gauche **/
						{
							if(line<(nbLines-1))  // Si on n'est pas à la dernière ligne dans la matrice de gauche
							{
								makeMovable('case_A'+((line+1)*nbCols+colOrigin)); //Rendre la case en dessous déplaçable
							}
						
						}else //l'origine est  de droite
						{
							if(line>0)  // Si on n'est pas à la première ligne dans la matrice de droite
							{
								
								/** Permettre de stocker à nouveau une case dans la  case   **/
								 makeDroppable($("#"+origin).attr('id')); 
								
								/** Empêcher de déplacer une case dans  la case de dessus  **/
								$('#case_B'+((line-1)*nbCols+colOrigin)).removeClass( 'slot' );
								$('#case_B'+((line-1)*nbCols+colOrigin)).droppable( 'disable' );
								
								//Mettre à jour le # nombre cases vides dans la colonne d'origine 
								CompteurCasesPleines[colOrigin] = CompteurCasesPleines[colOrigin] -1; 
								
							}
							
						}
						
						
			   		}
				   
				   
			   }
			   else //Sinon le déplacement est dans la matrice de droite
			   {
			   	  	var colDest = parseInt( $(this).attr('data-col'),10); /** Recupérer le numéro de colonne de la case de destination **/
				   	var id = nbLines-CompteurCasesPleines[colDest]-1;  // récupérer le numero de la ligne de la dernière case remplie
					id = id*nbCols + colDest;  // Déterminer la position de la case 
				   	var numberCurrentCase = parseInt( $('#case_B'+(id+nbCols)).data('number'),10); /** Recupérer le numéro de la dernière case remplie **/
				   
				   if(CompteurCasesPleines[colDest]>0) /** Si le nombre de cases remplies est supérieur à 0 **/
				   {
					   	if (CompteurCasesPleines[colDest]<nbLines) /**Si la colonne n'est pas pleine **/
						{
						 
							if(numberOrigin>numberCurrentCase) /** Si la valeur de la case déplacée est plus grande **/
							{
								deplacer('case_B'+id,numberOrigin,origin); // Effectuer le déplacement
								CompteurCasesPleines[colDest] = CompteurCasesPleines[colDest] +1 ; // Incrémenter le nombre de cases remplies
								
								UpdateCseStateAfterMovingRight(origin,line,colDest,colOrigin);
								
									
								if (CompteurCasesPleines[colDest]<nbLines) /** Si la colonne n'est pas pleine **/
					  			{
					   	 			makeDroppable('case_B'+(id-nbCols));  /*** Faire de la case au dessus un depôt **/
					   			}
										
								/** Supprimer la case d'origine les propriétés de déplacement **/
										$('#case_B'+(id+nbCols)).removeClass( 'deplacable' );
										$('#case_B'+(id+nbCols)).draggable( 'disable' );
						
							}
							
						}
					   
				   }
				   else  // La colonne est vide
				   {
					   
				   	 	deplacer('case_B'+id,numberOrigin,origin); // Effectuer le déplacement
					    CompteurCasesPleines[colDest] = CompteurCasesPleines[colDest] +1 ; // Incrémenter le nombre de cases remplies
					   
					   if (CompteurCasesPleines[colDest]<nbLines) /**Si la colonne n'est pas pleine **/
					   {
					   	 makeDroppable('case_B'+(id-nbCols));  /***Faire de la case au dessus un depôt **/
					   }
					   
					   UpdateCseStateAfterMovingRight(origin,line,colDest,colOrigin);
						
				   }
				   
			   }
			   
	  }
	  
	  function initFirstLineLeftMatrix()
	  {
	  	var i =0;
		  
		  for(i=0;i<nbCols;i++)
		  {
		  	$('#case_A'+i).addClass('deplacable').draggable( {
				      containment: '#scene',  /**Espace de déplacement **/
				      cursor: 'move', /** Changer la forme du curseur lors du mouvement*/
				      revert: true
   				    } );
		  }
	  }
	  
	  function initFirstSlot()
	  {
	  	var i ,j=0;
		 
		  	 for(j=0;j<nbCols;j++)
		 	 {
				 
				i = (nbLines-1)*nbCols+j
			  	$('#case_B'+i).addClass('slot').droppable( {
						accept: '.gauche, .tempo',  /** selection d'élement qui peut être déplacé  dans l'élement **/
						drop: handleCaseDrop, /** Procédure appelée lors du déplacement de l'élement **/
						
   				    } );
			  
			  
		  }
		  
		 
	  }
	  
	  function initCompteurCasesPleines()
	  {
	  	var i =0;
		 CompteurCasesPleines = [nbCols];
		  
		  for(i=0;i<nbCols;i++)
		  {
		  	CompteurCasesPleines[i]= 0;
		  }
		  
		  
	  }

     function deplacer(idDest,number,origin)
	 {
	  	$('#'+idDest).html(''+number); // Récupérer le numero de la case 
						
		$('#'+idDest).data('number',number); //Mettre à jour le numéro de la case déplacé
						
		$('#'+idDest).droppable( 'disable' );  //Empêcher cette case d'être un slot
		 
		$('#'+idDest).removeClass( 'slot' );  //Empêcher cette case d'être un slot
						
		/** Rendre la case déplacable
			affecter les classes deplacable et gauche pour qu'elle puis être déplacé dans la matrice de droite
		**/
		$('#'+idDest).addClass('deplacable').draggable( {
						      containment: '#scene',  /**Espace de déplacement **/
						      cursor: 'move', /** Changer la forme du curseur lors du mouvement*/
						      revert: true
   		} );
		 
		 $('#'+idDest).draggable( 'enable' );  //Rendre la case déplacable
		 
		 /** Supprimer la case d'origine les propriétés de déplacement **/
			$("#"+origin).removeClass( 'deplacable' );
			$("#"+origin).draggable( 'disable' );
						
		 /**Rendre la case vide **/
			$("#"+origin).html('');
		 
		 $("#"+origin).css('border','');
						
		/**Incrémenter le nombre de déplacements **/
		   NbDeplacements =  NbDeplacements + 1;
		  
	 }
	 
	 function makeMovable(idcase)
	 {
	 	/** Rendre la case déplacable
			affecter les classes deplacable et gauche pour qu'elle puis être déplacé dans la matrice de droite
		**/
		 
		$('#'+idcase).addClass('deplacable').draggable( {
						      containment: '#scene',  /**Espace de déplacement **/
						      cursor: 'move', /** Changer la forme du curseur lors du mouvement*/
						      revert: true
   		} );
	 }
  
	  function makeDroppable(idcase)
	 {
	 		$('#'+idcase).addClass('slot').droppable( {
						accept: '.gauche, .tempo, .droite',  /** Accepter les cases de gauche et de l'espace tempo et de droite **/
						drop: handleCaseDrop, /** Procédure appelée lors du déplacement de l'élement **/
						
   			} );
		 
		 $('#'+idcase).html('vide');
		 $('#'+idcase).droppable('enable');
		 
	 }

	 function libererEspaceTempo(origin)
	 {
	 		 $("#"+origin).droppable( 'enable' );  //Rendre de la case de l'espace tempo un depôt 
			 $("#"+origin).addClass( 'slot' );  //Ajouter la classe slot sur cette case
			 $("#"+origin).html('vide');
			 EspaceTempoOccupee = false;
	 }
	 
	 function UpdateCseStateAfterMovingRight(origin,line,colDest,colOrigin)
	 {
	 					if($("#"+origin).hasClass('gauche')===true)  /** Si l'origine est une case de gauche **/
						{
							if(line<(nbLines-1)) 
							{
								makeMovable('case_A'+((line+1)*nbCols+colOrigin));
							}
							
						}
						else
						{
							if($("#"+origin).hasClass('tempo')===true)  /** Si l'origine est une case de tempo **/
							{
								libererEspaceTempo(origin); 
							}
							else  // Si l'origine est de droite
							{
								if(colDest!==colOrigin) // Si c'est pas sur la même colonne
								{
								   makeDroppable(origin);	//Vider la case de la colonne de départ 
								  CompteurCasesPleines[colOrigin] =  CompteurCasesPleines[colOrigin] - 1 ; // Mettre à jour le # de cases vides
								}
								
							}
							
								
						}
	 }
