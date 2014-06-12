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
  var ret = [];
  var row;
  for (var i = 0; i < n; i++) {
    row = [];
    for (var j = 0 ; j < n; j++) {
      row[j] = 0;
    }
    ret.push(row);
  }
  for (var i = 0; i<shorthand.length; i++) {
    ret[i][shorthand[i]] = 1;
  }
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

var trickyMemo = { 0:[[]] , 1:[[1]] , 2:[] , 3:[] };
var trickyQueenSolutions = function(n) {
  n = isNaN(n) ? 8 : Math.floor(Math.max(0,n));
  if (trickyMemo[n]) return trickyMemo[n];
  var shorthandSolutionA = [];  // Whenever a solution is discovered, it is pushed to this array
  var ssA = shorthandSolutionA; // short variable name alias
  var mx = n-1;                 // Maximum valid index of any full row or column.
  // var halfN = Math.ceil(n/2);   // Minimum number of columns which cover at least half of the board
  var queenA = []     // 1D array: queenA[(row of queen, aka queen ID number)] has (column placement of that queen || null)
  var threatM = []    // "threat matrix" 2D board of squares: number of queens which can attack the square from below
  var rowA;           // "row array" the row which is having its threat values mutated.
  // Initialize the threat matrix to entirely safe
  for (var row = 0 ; row < n ; row++) {
    threatM[row] = [];
    for (var col = 0 ; col < n ; col++) {
      threatM[row][col] = 0;
    }
  }

  ////////////// BEGIN TRICKY CODE:
  // This section is tuned for execution speed and departs from JS style conventions.
  var solveUpper = function(height) { // Explores all configurations arising from lower-board configuration, pushing solutions to ssA
    var r, c, t, m, z, p;             // "row of queen" "column of queen" "threat matrix row index" "'minusing' index" "zeroing ix" "'plusing' index"
    r = height; while (r--){          // For each row of the upper board, "bottom"-to-top
      c = n;  while (c--){            // For each square of this row, right-to-left
        if (threatM[r][c]) continue;  // Don't bother with the square if it's already threatened.
        queenA[r] = c;                //---- Place a new queen on this unthreatened square
        if (!r) {                     // If we're in the top row, this unthreatened square reveals a solution
          ssA.push(queenA.concat());  // Record the discovered solution
          continue;                   // No need to threaten above the top. Skip to any other unthreatend square on the row.
        }                             //---- Mark all of this new queen's upward threats
        m = z = p = c;                // Begin three radial threat indexes at our new queen's own column
        t = r;  while(t--){           // For each row above our new queen, indexing upward from the row above
          rowA = threatM[t]           // Aquire the next row for threat increases
          if (m) rowA[--m]++;         // Increment threat level for this column's square at the new queen's leftward ascending diagonal axis
          rowA[z]++;                  // Increment threat level for this column's square at upward vertical axis
          if (p<mx) rowA[++p]++;      // Increment threat level for this column's square at rightward ascending diagonal axis
        } 
        if (r) solveUpper(r);         // Explore all possibility pathways for upper board. There are no queens up there, but there are threatened squares
        m = z = p = c;                //---- "Remove" the uppermost queen, and unmark her upward threats
        t = r;  while(t--){           // For each upper row
          rowA = threatM[t];          // Acquire the next row for threat reductions
          if (m) rowA[--m]--;         // Decrement along rising leftward diagonal
          rowA[z]--;                  // Decrement along rising vertical axis
          if (p<mx) rowA[++p]--;      // Decrement along rising rightward diagonal
        }                             // Now, `queenA` still has a queen index queen recorded, but it'll be ignored as stack garbage.
      }   
      return;                         // Return from solveUpper() recursion
    }                                 // Now, we've eplored all pathways arising from our current lower-board configuration.
  };  
  ////////////// END TRICKY CODE.

  // shorthandSolutionA has been loaded with one element per solution.
  // Each solution is an array of width `n` in this form:
  // solution[row] has `column`
  // For example, a 4x4 board will return a solution array something like:
  // [ [1,3,0,2] , [2,0,3,1] ]   - meaning two solutions have been identified:
  //     (0,1) (1,3) (2,0) (3,2) co-ordinates
  //     (0,2) (1,0) (2,3) (3,1) co-ordinates
  solveUpper(n);
  trickyMemo[n] = shorthandSolutionA;
  return shorthandSolutionA;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
debugger;
  var solutionA = trickyQueenSolutions(n);
  solution = matrixFromShortHand(n, matrixFromShorthand(solutionA.length > 0 ? solutionA[0] : []));

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = trickyQueenSolutions(n).length;

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
