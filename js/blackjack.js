const skaiciai =   ["2D" , "2H" , "2C" , "2S" , 
"3D" , "3H" , "3C" , "3S" , 
"4D" , "4H" , "4C" , "4S" , 
"5D" , "5H" , "5C" , "5S" ,
"6D" , "6H" , "6C" , "6S" ,
"7D" , "7H" , "7C" , "7S" ,
"8D" , "8H" , "8C" , "8S" ,
"9D" , "9H" , "9C" , "9S" ],

      galvos   =   ["0D" , "0H" , "0C" , "0S" , 
"JD" , "JH" , "JC" , "JS" , 
"QD" , "QH" , "QC" , "QS" , 
"KD" , "KH" , "KC" , "KS" ],

      tuzai    =   ["1D" , "1H" , "1C" , "1S" ];

let shoe;


class Deck {

    constructor(numOfDecks) {
    this.numOfDecks = numOfDecks; // Setting up how many decks should be in the shoe.
    }

    generateDeck(){
        return skaiciai.concat(galvos).concat(tuzai);
    }

    generateShoe(){
        shoe = [];
       
        for(let i = 0; i < this.numOfDecks ; i++){
            let newDeck = this.generateDeck();
            this.shuffletimes(newDeck,5);
            shoe = shoe.concat(newDeck);
            this.shuffletimes(shoe,5);
        }
        
        return shoe;  
    }

    shuffle(array) {
            let currentIndex = array.length, temporaryValue, randomIndex;
          
            while (0 !== currentIndex) {
          
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;

              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }
             
            return array;
    }


    shuffletimes(arr,times){

            for(let i = 0 ; i < times ; i++)
            {
                this.shuffle(arr);
            } 
    }


    clearCards() {
            shoe = []; 
    }


    takeCard(){
            return shoe.pop();
    }

}


class Player {
    constructor(isDealer , position , cardvalueposition) {
        this.currentHand = [];
        this.isDealer = isDealer;
        this.cardposition = position;
        this.cardValuePosition = cardvalueposition;
    }

    cardsPosition() {
        return this.cardposition ;
    }

    cardsValuePosition() {
        return this.cardValuePosition ;
    }

    AddaCard(card) {
        this.currentHand[this.currentHand.length] = card;
    }

    WholeHand(){
        return this.currentHand;
    }
}

let player        = new Player(false , "playercards" , "playerCardsValue"),
    dealer        = new Player(true , "dealercards" , "dealerCardsValue"),
    deckgenerator = new Deck(5);

const init = () => {
   
    document.getElementById("hitbutton").addEventListener("click", () => {
        hit(player ,false);
    }, false);

    document.getElementById("newgamebutton").addEventListener("click", () => {
        newgame();
    }, false);

    document.getElementById("standbutton").addEventListener("click", () => {
        stand();
    }, false);

   player.AddaCard(deckgenerator.takeCard());
   player.AddaCard(deckgenerator.takeCard());

   dealer.AddaCard(deckgenerator.takeCard());
   dealer.AddaCard(deckgenerator.takeCard());

  redraw(player);

  let img          = document.createElement("img"),
      cardposition = dealer.cardsPosition();

  img.src          = "img/Different-BikeBack.png";
  img.width        = 90;
  img.height       = 140;
  img.id           = "cardImage";
  img.style.filter = "alpha(opacity = 0)";
  
  document.getElementById(cardposition).appendChild(img);
  imageShow(dealer.WholeHand()[1] , dealer.cardsPosition());
   
  document.getElementById(dealer.cardsValuePosition()).innerText = dealer.cardsValuePosition().substring(0,1).toUpperCase() + dealer.cardsValuePosition().substring(1,6) + "'s hand value: XX + " + checkCardValue(dealer.WholeHand()[1]);

  GameLogic(false);
}


const newgame = () => {
    location.reload();
}

const winner = (status) => { // 0 - tie ; 1 - player wins ; 2 - dealer wins
    if(status == 1) {
        document.getElementById("winnerstatus").innerText = "PLAYER WINS!";
    } else if (status == 2) {
        document.getElementById("winnerstatus").innerText = "DEALER WINS!";
    } else {
        document.getElementById("winnerstatus").innerText = "ITS A TIE!";
    }   
}


const hit = (player, isEnding) =>{
    player.AddaCard(deckgenerator.takeCard());
    redraw(player);
    fadein(player);
    GameLogic(isEnding); 
}

const stand = () => {
    disableButtons();
    GameLogic(true);
}


const GameLogic = (endGame) => {     

    if(!endGame) {
    //Chack for a blackjack    
    if(cehckHandValue(player.WholeHand()) == 21 && cehckHandValue(dealer.WholeHand()) == 21) {
            winner(0);
            redraw(dealer);
            disableButtons();
    } else if (cehckHandValue(player.WholeHand()) == 21) {
            winner(1);
            redraw(dealer);
            disableButtons();
    } else if (cehckHandValue(dealer.WholeHand()) == 21) {
        winner(2);
        redraw(dealer);
        disableButtons();
    }

    //Check for over 21 after hit
    if(cehckHandValue(player.WholeHand()) > 21) {
        winner(2);
        redraw(dealer);
        disableButtons();
    } else if (cehckHandValue(dealer.WholeHand()) > 21) {
        winner(1);
        redraw(dealer);
        disableButtons();
    } 

}
    //Ending the game after a stand
    if(endGame){

      redraw(dealer);

      if(cehckHandValue(dealer.WholeHand()) < 17) {
        while(cehckHandValue(dealer.WholeHand()) < 17) {
                hit(dealer,false);  
            }
      }  
        
      if( Math.abs(21 - cehckHandValue(dealer.WholeHand())) == Math.abs(21 - cehckHandValue(player.WholeHand())) && !(cehckHandValue(dealer.WholeHand()) >= 21) )  {
                 winner(0);   
             }  else if ( Math.abs(21 - cehckHandValue(dealer.WholeHand())) > Math.abs(21 - cehckHandValue(player.WholeHand())) && !(cehckHandValue(dealer.WholeHand()) >= 21)) {
                winner(1);     
             } else if ( Math.abs(21 - cehckHandValue(dealer.WholeHand())) < Math.abs(21 - cehckHandValue(player.WholeHand())) && !(cehckHandValue(dealer.WholeHand()) >= 21)) {
                winner(2);     
             }
    }

}



const disableButtons = () => {
    document.getElementById("hitbutton").disabled = true;
    document.getElementById("hitbutton").style = "background: grey"
    document.getElementById("standbutton").disabled = true;
    document.getElementById("standbutton").style = "background: grey"
}

const redraw = (player) => {
    document.getElementById(player.cardsPosition()).innerHTML = '';
    displayHand(player.WholeHand() , player.cardsPosition());
    document.getElementById(player.cardsValuePosition()).innerText = player.cardsValuePosition().substring(0,1).toUpperCase() + player.cardsValuePosition().substring(1,6) + "'s hand value: " + cehckHandValue(player.WholeHand()); 
}


const fadein = (player) => {
    element = document.getElementById(player.cardsPosition());
    let op  = 0.1; 
    element.style.display = 'block';
    let timer = setInterval( () => {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter  = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

const displayHand = (hand , position) =>{
    for(let i = 0 ; i < hand.length ; i++){
     imageShow(hand[i] , position );
    } 
}

const imageShow = (card, position) => {
    let img = document.createElement("img"),
        cardposition = position;

    img.src          = checkSrc(card);
    img.width        = 90;
    img.height       = 140;
    img.id           = "cardImage";
    img.style.filter = "alpha(opacity = 0)";

    document.getElementById(cardposition).appendChild(img);
}

const checkSrc = (card) => {
    let value; 
    switch (card.charAt(1)){
    
    case "D":
            value = checkCard(card,"diamonds");
            break;
    case "C":
            value = checkCard(card,"clubs");
            break;
    case "S":
            value = checkCard(card,"spades");
            break;
    case "H":
            value = checkCard(card,"hearts");
            break;
       } 
    return value; 
    }


const checkCard = (card,type) => {
    let value; 
    switch (card.charAt(0)){

    case "1":
            value = "img/ace_of_" + type + ".png";
            break;
    case "2":
            value = "img/2_of_" + type + ".png";
            break;
    case "3":
            value = "img/3_of_" + type + ".png";
            break;
    case "4":
            value = "img/4_of_" + type + ".png";
            break;
    case "5":
            value = "img/5_of_" + type + ".png";
            break;
    case "6":
            value = "img/6_of_" + type + ".png";
            break;
    case "7":
            value = "img/7_of_" + type + ".png";
            break;
    case "8":
            value = "img/8_of_" + type + ".png";
            break;
    case "9":
            value = "img/9_of_" + type + ".png";
            break;
    case "0":
            value = "img/10_of_" + type + ".png";
            break;
    case "J":
            value = "img/jack_of_" + type + ".png";
            break;
    case "Q":
            value = "img/queen_of_" + type + ".png";
            break;
    case "K":
            value = "img/king_of_" + type + ".png";
            break;
        }
    return value;
    }


const checkCardValue = (card) =>{

    let value = 0 ; 
    switch (card.charAt(0)){
    
    case "K":
            value = 10;
            break;
    case "Q":
            value = 10;
            break;
    case "J":
            value = 10;
            break;
    case "0":
            value = 10;
            break;
    case "1":
            value = 11;
            break;
    case "2":
            value = 2;
            break;
    case "3":
            value = 3;
            break;
    case "4":
            value = 4;
            break;
    case "5":
            value = 5;
            break;
    case "6":
            value = 6;
            break;
    case "7":
            value = 7;
            break;
    case "8":
            value = 8;
            break;
    case "9":
            value = 9;
            break;
    
    
    }
    
    return value;
    
    }


const cehckHandValue = (hand) => {

    let value = 0;
    for (let i = 0; i < hand.length ; i++)
            {
    currentCardValue = checkCardValue(hand[i]) ;
    
            if (currentCardValue == 11 && value > 10) 
            {
                currentCardValue = 1;
            }
    
            value += currentCardValue ;
        }
    return value ;
    }
                