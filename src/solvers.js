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
  if (!shorthand) return [];
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

var countMemo = { 0:1 , 1:1 , 2:0 , 3:0 }; // Number of possible solutions per `n`
var sampleMemo = { 0:[] , 1:[0] , 2:null , 3:null }; // One discovered solution per `n`
var trickyQueenSolutionCount = function(n) { // `howMany` solutions for an n-by-n board with n queens
  n = isNaN(n) ? 8 : Math.floor(Math.max(0,n));
  if (countMemo.hasOwnProperty(n)) return countMemo[n];
  var howMany;
  var halfC = 0;                  // Increments on every solution where the first queen is in the left half (excluding middle for odd `n`)
  var midC = 0;                   // Inrements on every solution where the first queen is in the middle row (stays 0 for even 'n')
  var mx = n-1;                   // Maximum valid index of any full row or column.
  var halfN = Math.ceil(n/2);     // The "bigger integer half" of `n`
  var isOdd = halfN+halfN === n;  // True means we need to add in "middle-row" solutions (solutions where the first queen is in middle row)
  var queenA = []   // 1D array: queenA[(row of queen, aka queen ID number)] has (column index of that queen)
  var _c = [];      // "threat column array"            -- indexed on [ col ]
  var _p = [];      // "threat positive diagonal array" -- indexed on [ col + row ]
  var _n = [];      // "threat negative diagonal array" -- indexed on [ mx + col - row ]
  ////////////// BEGIN TRICKY CODE:
  // This section is tuned for execution speed and departs from some JS style conventions.
  var solveUpper = function(height) { // Explores all configurations arising from lower-board configuration, pushing solutions to ssA
    var r, c;                                 // "row of queen" "column of queen" - inner calls need separate indexes
    r = height; while (r--){                  // For each row of this upper part of the board, "bottom"-to-top
      c = halfN;  while (c--){                // For each square of this row, right-to-left
        if (_c[c] || _p[c+r] || _n[mx+c-r])   // If (r,c) is a threatened square..
          continue;                           //    ..skip this square
        queenA[r] = c;                        // Place a new queen on this unthreatened square
        if (!r) {                             // If we're in the top row, this unthreatened square reveals a solution
          if (isOdd && c===halfN) midN++;
          else halfN++;
          if (!sampleMemo.hasOwnProperty(n))
            sampleMemo[n] = Array.concat(queenA);
          continue;                           // Simulate placing and then removing this new top-row queen
        }
        _c[c] = _p[c+r] = _n[mx+c-r] = true;  // Update the threats to accommodate the new queen
        if (r) solveUpper(r);                 // Explore the upper board. There are threats but no queens up there.
        m = z = p = c;                        // "Remove" the uppermost queen
        _c[c] = _p[c+r] = _n[mx+c-r] = false; // Unthreaten all her axiseseses
      }   
      return;                                 // Return from solveUpper() recursion
    }                                         // Now, we've eplored all pathways arising from the lower-board configuration.
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
  return (countMemo[n] = halfC * 2 + midC);
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueenSolutionCount = function(n) {
  trickyQueenSolutionCount(n); // Load the memo item by running the entire count traversal.
  solution = matrixFromShortHand(n, sampleMemo[n]);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = trickyQueenSolutionCount(n);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
