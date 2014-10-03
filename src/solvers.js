// Given an array of integers, build a board matrix of pieces matching those positions.
// shorthand: [piece_in_column_0_is_in_this_row, piece_in_col_1_is_in_this_row, ...]
matrixFromShortHand = function(n, shorthand) {
  if (!shorthand) return shorthand = [];
  // if (!shorthand) return [];
  var ret = [];
  var i, j;
  var row = [];
  for (j = 0 ; j < n; j++) { row[j] = 0; }
  for (i = 0 ; i < n; i++) { ret.push(row.concat()); }
  for (i = 0 ; i < shorthand.length; i++) { ret[i][shorthand[i]] = 1; }
  return ret;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks
//   placed such that no rook threatens another rook.
window.findNRooksSolution = function(n) {
  shorthand = [];
  for (var i = 0; i < n; i++) { shorthand[i] = i; } // Describe a diagonal row of chess pieces
  return(matrixFromShortHand(n, shorthand));
};

// Fast factorial function for positive integers.
var intFact = function(n) {
  if (isNaN(n) || n < 0) return undefined;
  n = Math.floor(n);
  var ret = 1;
  while (n) { ret *= n--; }
  return ret;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = intFact;
// window.countNRooksSolutions = function(n) {
//   var solutionCount = fact(n);
//   console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
//   return solutionCount;
// };

// BELOW ARE DIFFERENT FLAVORS OF N-QUEENS WORKHORSE ALGORITHMS.
//
// Given a number `n` and three bitwise threat patterns, return the count of possible
// configurations of queens on an n-by-n chessboard such that no queen threatens another queen.
// Each function returns the absolute number of distinct solutions for the specified initial state.
// Rotations and reflections count as distinct solutions.
// When n < 5, the behavior is only guaranteed to be correct when all threat patterns are zero.
//
// The threat patters define the placement of the first few queens. The board is conceptualized as
// a series of rows, with queens placed at the bottom row first, then the next-from-bottom row
// until a solution is found. For example, calling one of these parameters (4,0,0,0) means
// "Please count all possible solutions for 4 queens on a 4x4 chessboard in which the queen on
// the first row may appear in any column."


var recursiveBacktrackingBitwiseReflectingNQueensCount = function(n, fromBelowLeft, fromBelow, fromBelowRight) {
  var solutionCount = 0;
  var fullRowMask = (1<<n) - 1;
  var newcomer;
  // recurse takes three bitfields which represent the threat pattern to the row under consideration
  // in which a high bit indicates the square at that position is threatened from below in each of
  // the three axies: / | \
  var recurse = function(fromBelowLeft, fromBelow, fromBelowRight) {
    var safePattern = ~(fromBelowLeft | fromBelow | fromBelowRight) & fullRowMask;
    while (safePattern) {                       // While there's at least one safe square on this row
      newcomer = -safePattern & safePattern;    // Try this rightmost safe square
      safePattern = safePattern ^ newcomer;     // Mark the newcomer square as no longer safe
      recurse( (fromBelowLeft|newcomer)>>1  , fromBelow|newcomer , (fromBelowRight|newcomer)<<1 );
    }                                           // Now there are no more safe squares.
    (fromBelow === fullRowMask) && solutionCount++; // Count solution if every col has a queen.
  };
  recurse(fromBelowLeft, fromBelow, fromBelowRight);
  return solutionCount;
};

// This version is much less efficient in JavaScript. It is a prototype for assembly language
// where the threat patterns can be CPU registers and the undoStack can be the main SP stack.
// The stack is only pushed in a case where there's more than one safe square to to explore.
var iterativeBacktrackingBitwiseReflectingNQueensCount = function(n, fromBelowLeft, fromBelow, fromBelowRight) {
  var solutionCount = 0;
  var fullRowMask = (1<<n) - 1;
  var newcomer;
  // iterate takes three bitfields which represent the threat pattern to the row under consideration
  // in which a high bit indicates the square at that position is threatened from below in each of
  // the three axies: / | \
  var iterate = function(fromBelowLeft, fromBelow, fromBelowRight) {
    var undoStack = [];
    safePattern = ~(fromBelowLeft | fromBelow | fromBelowRight) & fullRowMask;
    for (;;) {
      // while there's at least one safe square on this row -- also set newcomer (a single 1 at queen) and safepattern (1's are safe).
      while (newcomer = -safePattern & safePattern) {
        if (safePattern = safePattern^newcomer) { // If there's more than one safe square on this row
          undoStack.push(fromBelowLeft, fromBelow, fromBelowRight, safePattern); // bookmark our current state
        }
        fromBelowLeft = (fromBelowLeft|newcomer)>>1;
        fromBelow     =      fromBelow|newcomer;
        fromBelowRight=(fromBelowRight|newcomer)<<1;
        safePattern = ~(fromBelowLeft | fromBelow | fromBelowRight) & fullRowMask;
      }
      fromBelow === fullRowMask && solutionCount++; // Count solution if every col has a queen.
      if (undoStack.length) {
        safePattern    = undoStack.pop(); // Threatened and already-tried squares are 0.
        fromBelowRight = undoStack.pop();
        fromBelow      = undoStack.pop();
        fromBelowLeft  = undoStack.pop();
        continue;
      }
      break;
    }
  };
  iterate(fromBelowLeft, fromBelow, fromBelowRight);
  return solutionCount;
};

var queenWorkhorse = iterativeBacktrackingBitwiseReflectingNQueensCount;

window.countNQueensSolutions = function(n) {
  n = isNaN(n) ? 8 : Math.floor(Math.max(0,n));
  if (n < 6) { return queenWorkhorse(n, 0, 0, 0); } // If n is tiny, just do it straight: 0:1 1:1 2:0 3:0 4:2 5:10
  var bottomQueen = 1 << (n>>1);      // n5:00100 n6:001000 n7:0001000 n8:00010000
  var solutionCount = 0;
  if (n & 1) {                        // If n is odd
    var secondQueen = bottomQueen>>1; // place the second-from-bottom queen one column to the right of bottom queen
    while (secondQueen >>= 1) {       // ..and then walk it to the right until exhausted.
      solutionCount += queenWorkhorse(n,
          bottomQueen>>2|(secondQueen>>1),
          bottomQueen|secondQueen,
          (bottomQueen<<2)|(secondQueen<<1));
    } // Now solutionCount has the number of solutions with the bottom queen in the middle column..
  }   // ..of its row, and the second-from-bottom queen anywhere in the right half of its row.
  while(bottomQueen >>= 1) {          // Walk the bottom queen to the right until exhausted
      solutionCount += queenWorkhorse( n , bottomQueen>>1 , bottomQueen , bottomQueen<<1 );
  }   // Now solutionCount has half the number of possible n-queens solutions.
  return solutionCount*2;
};
