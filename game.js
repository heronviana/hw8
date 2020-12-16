/*game.js
Heron Melo
heron_melo@student.uml.edu
Student of GUI Programming I 91.61 - UML
File Created on: 12/10/2020
In this assignment we are developing an scrabble game. /*

/*global variables which used in program*/
const NUMBER_PICES=100;
const MAX_PIECES=7;
const KOEF_WORD2=2;
const KOEF_WORD3=3;
const KOEF_LETTER2=-2;
const KOEF_LETTER3=-3;
const EMPTY=-1;
//ScrabbleTiles from Scrabble_Pieces_AssociativeArray_Jesse.js
var boardItemCosts=[];
var usedLetters=[]; /*0, if items was not taken still, 1 otherwise*/
var lettersOnBoard=[];
var usedInRound=[];
var totalScore=0;
var words=[];
var nWords=0;
var boardLength;
var counterLetters;


/*function which make base works: set value for board, set unused flag for pieces, mark all cells on the board as empty*/
function initGame(){
  if(Math.random()<0.5) //use random map:
    boardItemCosts=[0,0,KOEF_WORD2,0,0,0,KOEF_LETTER2,0,KOEF_LETTER2,0,0,0,KOEF_WORD2,0,0];
  else
	boardItemCosts=[KOEF_WORD3,0,0,KOEF_LETTER2,0,0,0,KOEF_WORD3,0,0,0,KOEF_LETTER2,0,0,KOEF_WORD3];  
  boardLength=boardItemCosts.length;
  for(i=0;i<NUMBER_PICES;i++)
	  usedLetters[i]=0;
  for(i=0;i<boardLength;i++)
      lettersOnBoard[i]=EMPTY;
  counterLetters=1;
}

//select random free item:
function selectLetter(usedLetters) {
	var i=Math.floor(Math.random()*NUMBER_PICES);
	while(usedLetters[i]!=0) //generate untile pieces not used
	{		
	    i=Math.floor(Math.random()*NUMBER_PICES);
	}
   return i;
}

/*generate set of letters for hand*/
function selectHand(amount)
{
  //generate set of numbers (different):
  var i=0;
  var selected;
  //generate items 
  var hand=[];
  for(i=0;i<amount;i++)
  {
	  selected=selectLetter(usedLetters);	  
	  usedLetters[selected]=1;
	  s=0;
	  j=0;
	  while(s+ScrabbleTiles[String.fromCharCode(65+j)]["original-distribution"]<selected)
	  {
		  s+=ScrabbleTiles[String.fromCharCode(65+j)]["original-distribution"]; //accomulate relative position letter in alphabet
		  j++;
	  }
	  hand[i]=String.fromCharCode(65+j);
  }
  return hand;
}


/*calculate score*/
function findScore(){			
	var wordsScore;	
	var isNew=1;
	var isWord2=1;
	var isWord3=1;	
	var score=0;
	for(i=0;i<boardLength;i++)
		if(lettersOnBoard[i]!=EMPTY)
		{
			if(isNew==1) //first letter after empty
			{				
				isNew=2; //status -middle word
				wordsScore=0;			
			}
			wordsScore+=ScrabbleTiles[lettersOnBoard[i]]["value"];
			if(boardItemCosts[i]==KOEF_LETTER2)
			   wordsScore[nWords-1]+=ScrabbleTiles[lettersOnBoard[i]]["value"];
		    else
              if(boardItemCosts[i]==KOEF_LETTER2)
			     wordsScore[nWords-1]+=ScrabbleTiles[lettersOnBoard[i]]["value"]*2;				
			if(boardItemCosts[i]==KOEF_WORD2)
			   isWord2=2;
		    if(boardItemCosts[i]==KOEF_WORD3)
			   isWord3=3;
		}
		else
		{
		 if(isNew==2) //if empty is end of word =>multiply score of word, if needed:
		   {
			 score+=wordsScore*isWord2*isWord3;			   
			 //reset all flags
			 isNew=1;			 
			 isWord2=1;
			 isWord3=1;			
		   }
		  
		}
	//last word was possible not counted
	if(isNew==2) 
	   score+=wordsScore*isWord2*isWord3;		   
	return score;
}

//remove letter with selected number from used list
function remove(arr, item) {
    for (var i = arr.length; i--;) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}

function addLetters()
{
	totalScore+=findScore();
	//clear board:
	var countRemoved=$('.beCleared').length;
	$('.beCleared').remove();
	//add letters:
	var addSet=selectHand(countRemoved);
	drawLetters(addSet);
	//clear style:
	$('.cell').removeClass("hover");
	$('.cell').addClass("normal");
	$('.cell').removeClass("active");
}


/*interface function*/
//generate string with items of the board - sequence of the image with empty or doubles for letters or words:
function GenerateBoardView()
{
	var board="";
	for(i=0;i<boardLength;i++)
	{
		if(boardItemCosts[i]==KOEF_WORD2)
		   board+='<img class="cell" src="board/word2.png" id="cell'+(i+1)+'">';	
	    else
		  if(boardItemCosts[i]==KOEF_WORD3)
		     board+='<img class="cell" src="board/word3.png" id="cell'+(i+1)+'">';		
		  else
		    if(boardItemCosts[i]==KOEF_LETTER2)
		       board+='<img class="cell" src="board/letter2.png" id="cell'+(i+1)+'">';		
		    else
		       if(boardItemCosts[i]==KOEF_LETTER3)
		         board+='<img class="cell" src="board/letter3.png" id="cell'+(i+1)+'">';		
               else			 
		         board+='<img class="cell" src="board/empty.png" id="cell'+(i+1)+'">';						   
	}
	return board;	
}

//add images of the letters to the holder
function drawLetters(hand)
{
	var str="";
	var parent=$('#letters');
	for(i=0;i<hand.length;i++) {
		str=str+' <img src="tiles/Scrabble_Tile_'+hand[i]+'.jpg" class="pieces" alt="'+hand[i]+'" id="letter'+counterLetters+'">';
		counterLetters++;
	}
	parent.html(str+parent.html());
}



$(function() {
	         /*read information about letters*/
	        initGame();
		    var hand=selectHand(MAX_PIECES); //generate hand
			$('#draw_board').html(GenerateBoardView()); //generate string and out it to the place
			//draw hand's letters
			drawLetters(hand);
			//add class draggable
			$('.pieces').draggable();
			
			//reaction on buttons
			$('#CheckWord').click(function(){findScore();});
			$('#GoNext').click(function(){addLetters();$('.pieces').draggable();});
			
			//reaction on the board
			$('.cell').droppable({
				drop: function(event, ui) {

					//set index of letter into corresponding item of the board:
					i=$(this).attr('id').substr(4);					
					ui.draggable.addClass("beCleared");
					lettersOnBoard[i-1]=ui.draggable.attr('alt');					
					var score=findScore();
					$('#GameScore').html(score+totalScore);
					//works with class
					$(this).addClass("active");
					$(this).removeClass("hover");
					$(this).removeClass("normal");			
				},				
				out: function(event, ui) {			
					i=$(this).attr('id').substr(4);
					//indexLetter=ui.draggable.attr('id').substr('id').substr(6);
					lettersOnBoard[i-1]=-1;
					var score=findScore();
					$('#GameScore').html(score+totalScore);
					ui.draggable.removeClass("beCleared");
					//works with class
					$(this).removeClass("hover");
					$(this).removeClass("active");
					$(this).addClass("normal");	
				},
				over: function(event, ui) {			
					$(this).removeClass("active");				
				    $(this).removeClass("normal");						
					$(this).addClass("hover");		
					
				}
				
			});
			
			
		});
