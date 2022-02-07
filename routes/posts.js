const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//Use a queue for each player's cards
function Queue() {
    this.elements = [];
};

Queue.prototype.enqueue = function(e) {
    this.elements.push(e);
};

Queue.prototype.dequeue = function() {
    return this.elements.shift();
};

Queue.prototype.isEmpty = function() {
    return this.elements.length == 0;
};

Queue.prototype.length = function() {
    return this.elements.length;
}

Queue.prototype.dequeueWithCheck = function() {
    if (this.isEmpty) {
        return -1
    }
    else {
        return this.dequeue()
    }
}

//permutes elements in the deck
function shuffleDeck(deck) {
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

//creates each player's deck
function initialize_decks() {
    var deck = []
    for (var i=0; i<52; i++) {
        deck.push(i);
    }
    shuffleDeck(deck);
    var aliceDeck = deck.slice(0, 26)
    var bobDeck = deck.slice(26, 52);
    var Alice = new Queue();
    var Bob = new Queue();
    //turn deck into queues
    for (i=0; i<26; i++) {
        Alice.enqueue(aliceDeck[i]);
        Bob.enqueue(bobDeck[i]);
    }
    return {Alice, Bob};
}

//Simulate a game of war. If a player runs out of cards
//they lose immediately
function play() {
    let {Alice, Bob} = initialize_decks();
    console.log(Alice, Bob);
    //Both players still have cards
    while(!Alice.isEmpty() && !Bob.isEmpty()) {
        console.log(Alice.length(), Bob.length());
        var aliceCard = Alice.dequeue();
        var aliceCardVal = Math.floor( aliceCard/ 4);
        var bobCard = Bob.dequeue();
        var bobCardVal = Math.floor(bobCard / 4);
        var cards = [aliceCard, bobCard];
        //Alice's card is higher, add cards to her deck
        if (aliceCardVal > bobCardVal) {
            shuffleDeck(cards);
            Alice.enqueue(cards[0]);
            Alice.enqueue(cards[1]);
        }
        //Bob's card is higher, add cards to his deck
        else if (bobCardVal > aliceCardVal) {
            shuffleDeck(cards);
            Bob.enqueue(cards[0]);
            Bob.enqueue(cards[1]);
        }
        //Cards are same rank, go to war
        else {
            console.log("war");
            while (true) {
                //add face down cards
                if (!Alice.isEmpty()) {
                    cards.push(Alice.dequeue());
                }
                else {
                    return "Bob";
                }
                if (!Bob.isEmpty()) {
                    cards.push(Bob.dequeue());
                }
                else {
                    return "Alice";
                }
                //Alice's new face up card
                if (!Alice.isEmpty()) {
                    var aliceCard = Alice.dequeue();
                    cards.push(aliceCard);
                    var aliceCardVal = Math.floor( aliceCard/ 4);
                }
                else {
                    return "Bob";
                }
                //Bob's new face up card
                if (!Bob.isEmpty()) {
                    var bobCard = Bob.dequeue();
                    cards.push(bobCard);
                    var bobCardVal = Math.floor(bobCard / 4);
                }
                else {
                    return "Alice";
                }
                //compare new cards
                if (aliceCardVal > bobCardVal) {
                    shuffleDeck(cards);
                    for (var i=0; i<cards.length; i++) {
                        Alice.enqueue(cards[i]);
                    }
                    break;
                }
                else if (bobCardVal > aliceCardVal) {
                    shuffleDeck(cards);
                    for (var i=0; i<cards.length; i++) {
                        Bob.enqueue(cards[i]);
                    }
                    break;
                }
            }
        }

    }
    //return the winner
    if (Alice.isEmpty()) return "Bob";
    else return "Alice";
}

//Get back total wins for each player
router.get('/', async (req, res) => {
    try {
        const AliceWins = await Post.count({winningUser: 'Alice'});
        const BobWins = await Post.count({winningUser: 'Bob'});
        res.json({"Alice wins": AliceWins, "Bob wins": BobWins});
    } catch (err) {
        res.json(err);
    }
});

//Start a game and update database with player's win
router.post('/', async (req,res) => {
    var winner = play();
    const post = new Post({
        winningUser: winner
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch(err) {
        res.json(err);
    }
});

module.exports = router;

