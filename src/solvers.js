/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

matrixFromShortHand = function(n, shorthand) {
  if (!shorthand) return shorthand = [];
  // if (!shorthand) return [];
  var ret = [];
  var i, j;
  var row = [];
  for (j = 0 ; j < n; j++)
    row[j] = 0;
  for (i = 0; i < n; i++)
    ret.push(row.concat());
  for (i = 0; i<shorthand.length; i++)
    ret[i][shorthand[i]] = 1;
  return ret;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {
  shorthand = [];
  for (var i = 0; i < n; i++) { shorthand[i] = i; } // Describe a diagonal row of chess pieces
  return(matrixFromShortHand(n, shorthand));
};

// Fast factorial function for positive integers.
var fact = function(n) {
  if (isNaN(n) || n < 0) return undefined;
  var r = 1;
  while (n > 1) { r *= n--; }
  return r;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = fact;
// window.countNRooksSolutions = function(n) {
//   var solutionCount = fact(n);
//   console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
//   return solutionCount;
// };

// Given a number `n` return the count of possible configurations of queens on an n-by-n
// chessboard such that no queen threatens another queen.
// Returns the absolute number of distinct board configurations.
// Rotations and reflections count as distinct configurations.
var recursiveBacktracikngBitwiseReflectingNQueensCount = function(n) {
  n = isNaN(n) ? 8 : Math.floor(Math.max(0,n));
  var solutionCount = 0;
  var fullRowMask = (1<<n) - 1;
  var newcomer;
  // recurse takes three bitfields which represent the threat pattern to the row under consideration
  // in which a high bit indicates the square at that position is threatened from below in each of
  // the three axies: / | \
  var recurse = function(fromBelowLeft, fromBelow, fromBelowRight) {
    var safePattern = ~(fromBelowRight | fromBelow | fromBelowLeft) & fullRowMask;
    while (safePattern) {                       // While there's at least one safe square on this row
      newcomer = -safePattern & safePattern;    // Try this rightmost safe square
      safePattern = safePattern ^ newcomer;     // Mark the newcomer's bit as no longer safe
      recurse( (fromBelowLeft|newcomer)>>1  , fromBelow|newcomer , (fromBelowRight|newcomer)<<1 );
    }                                           // Now there are no more safe squares.
    (fromBelow === fullRowMask) && solutionCount++; // Count solution if every e has been placed.
  };

  // If n is tiny, just do it straight: 0:1 1:1 2:0 3:0 4:2 5:10
  if (n < 6) { recurse(0, 0, 0);  return solutionCount; }
  var bottomQueen = 1 << (n>>1);      // n5:00100 n6:001000 n7:0001000 n8:00010000
  if (n & 1) {                        // If n is odd
    var secondQueen = bottomQueen>>1; // place the second-from-bottom queen one column to the right of bottom queen
    while (secondQueen >>= 1) {       // ..and then walk it to the right until exhausted.
      recurse( bottomQueen>>2|(secondQueen>>1) , bottomQueen|secondQueen , (bottomQueen<<2)|(secondQueen<<1) );
    } // Now solutionCount has the number of solutions with the bottom queen in the middle column..
  }   // ..of its row, and the second-from-bottom queen anywhere in the right half of its row.
  while(bottomQueen >>= 1) {          // Walk the bottom queen to the right until exhausted
      recurse( bottomQueen>>1 , bottomQueen , bottomQueen<<1 );
  }   // Now solutionCount has half the number of possible n-queens solutions.
  return solutionCount*2;
};

// var sampleMemo = { 0:[] , 1:[0] , 2:null , 3:null }; // One discovered solution per `n`
// // return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
// window.findNQueensSolution = function(n) {
//   recursiveThreatArrayQueenSolutionCount(n); // Load the memo item by running the entire count traversal.
//   solution = matrixFromShortHand(n, sampleMemo[n]);
//
//
//   console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
//   return solution;
// };

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other

window.countNQueensSolutions = recursiveBacktracikngBitwiseReflectingNQueensCount;
