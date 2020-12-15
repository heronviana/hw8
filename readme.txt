In the my program I have used letters in array form (from file Scrabble_Pieces_AssociativeArray_Jesse.js)
My program was divided in parts which specified in corresponding to web-specification (css, js, html).
As features I have used 2 different lines of scrabble board. One of board selected in random order.

Main javascript is game.js. This file divided into small functions such:
- init game (set all pieces as not selected, clear board, clear score etc.);
- generate hand (select pieces into hand);
- calculation score of the board;
- add pieces to the hand;
- draw board;
- draw pieces
and etc.

Also game.js contains part which call when document is load. This part call sequence of functions which generate board, cards, and add function for drag&drop.
All base elements of the program works (shuffle letter, calculate score, add new letters, take into account special cells of the board).
