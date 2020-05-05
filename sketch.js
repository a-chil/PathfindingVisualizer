//Setting up the columns and rows for the 2D array which will be the grid
var cols = 50;
var rows = 21;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var startNode;
var endNode;

var path = [];

var w, h;

//Extra vars
var started = false;

var startBtn;
var resetBtn;

function setup() {
  var c = createCanvas(1400, 600);
  c.parent("#sketch-container");
  console.log("A*");

  //width and height of each cell determined by canvas width and height
  w = width / cols;
  h = height / rows;

  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows); //Creating the 2D array
  }

  //Creating the grid of Cells
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }

  //Finding and adding neighbors
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].display();
    }
  }

  startNode = grid[9][10];
  startNode.wall = false; //So that start and end nodes are not walls
  endNode = grid[39][10];
  endNode.wall = false; //So that start and end nodes are not walls

  openSet.push(startNode); //Pushing start node onto the open set

  startNode.display(color(102, 0, 204));
  endNode.display(color(153, 51, 102));

  //Start Node
  stroke(0);
  strokeWeight(2);
  fill(0, 0, 0, 50);
  //triangle(252, 286, 280, 143, 252, 314);
  strokeWeight(1);

  noLoop();

  init();
}

function draw() {
  if (started) {
    //While open set is not empty
    if (openSet.length > 0) {
      var best = 0; //Assuming the best index is the first element of the open set
      //Checking for lowest 'f' in the open list
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[best].f) {
          best = i;
        }
      }

      var current = openSet[best]; //Current will be the cells with the lowest f

      //Check if current cell is the destination node, ending the search
      if (current === endNode) {
        started = false;
        noLoop();
        console.log("Finished");
      }

      removeItem(openSet, current); //Remove current from open set
      closedSet.push(current); //Add current to closed set

      //Finding and evaluating neighboring cells
      var neighbors = current.neighbors;
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        //Check if neighbor is in closed set or not
        //If in closed set, then that cell has already been assesed
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          var tg = current.g + 1; //temporary g cost
          var newPath = false; //Assuming better path has not been found
          //Comparing g values at neighbor to see which path is cheaper
          if (openSet.includes(neighbor)) {
            if (tg < neighbor.g) {
              neighbor.g = tg;
              newPath = true;
            }
          } else {
            neighbor.g = tg;
            newPath = true;
            openSet.push(neighbor); //Adding neighbor into open set
          }

          if (newPath) {
            neighbor.h = heu(neighbor, endNode); //Heuristic calculation for Cell
            neighbor.f = neighbor.g + neighbor.h;

            neighbor.prev = current; //Assigning where neighbor came from to find path
          }
        }
      }
    } else {
      started = false;
      console.log("No Solution");
      noLoop();
      return;
    }
  }

  background(255);

  //Looping through grid and displaying the cells
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].display();
    }
  }

  if (openSet.length != 1) {
    //Path calculation
    path = [];
    var temp = current;
    //Backtracking from end to find path
    path.push(temp);
    while (temp.prev) {
      path.push(temp.prev);
      temp = temp.prev;
    }
  }

  //Color notation for items in open set
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].display(color(0, 255, 204));
  }

  //Color notation for items in closed set
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].display(color(0, 153, 153));
  }

  //Display path
  noFill();
  stroke(255, 255, 102);
  strokeWeight(w / 3);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    //noStroke();
    //path[i].display(color(255, 255, 102));
  }
  endShape();
  strokeWeight(1);

  //Start Node
  stroke(0);
  strokeWeight(2);
  fill(0, 0, 0, 50);
  triangle(257, 290, 275, 299, 257, 310);
  //End Node
  ellipse(1105.1, 299, 20);
  ellipse(1105.1, 299, 10);
  strokeWeight(1);
}

//Remove item from array
var removeItem = (array, item) => {
  //Loop from backwards so that when splice takes place no item is skipped when items shift
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] == item) {
      array.splice(i, 1);
    }
  }
};

//heuristic calculation
var heu = (pointA, pointB) => {
  //var distance = dist(pointA.i, pointA.j, pointB.i, pointB.j); //---> Euclidean
  var distance = abs(pointA.i - pointB.i) + abs(pointA.j - pointB.j); //---> Manhattan method
  return distance;
};

//Added user functionality to the algorithm
function init() {
  startBtn = createButton("Visualize!");
  startBtn.class("btn");
  startBtn.class("btn-success");
  startBtn.parent("navbar");
  startBtn.mousePressed(startAlgo);

  resetBtn = createButton("Reset Grid");
  resetBtn.class("btn");
  resetBtn.class("btn-dark");
  resetBtn.parent("navbar");
  resetBtn.mousePressed(reset);

  randomBtn = createButton("Random Walls - 30%");
  randomBtn.class("btn");
  randomBtn.class("btn-dark");
  randomBtn.parent("navbar");
  randomBtn.mousePressed(randomWall);
}

//Start the pathfinding process
function startAlgo() {
  if (started) {
    return;
  }
  started = true;
  loop();
}

//Reset grid
function reset() {
  openSet = [startNode];
  closedSet = [];
  path = [];
  started = false;

  //Wall reset
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].wall = false;
    }
  }

  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].display(color(255));
    }
  }

  startNode.display(color(0, 255, 204));

  //Start Node
  stroke(0);
  strokeWeight(2);
  fill(0, 0, 0, 50);
  triangle(257, 290, 275, 299, 257, 310);
  //End Node
  ellipse(1105.1, 299, 20);
  ellipse(1105.1, 299, 10);
  strokeWeight(1);
}

//Mouse pressed to create walls at mouse location
function mousePressed() {
  xCord = ceil(floor(mouseX) / 28);
  yCord = ceil(floor(mouseY) / 28);

  //Bounds of Canvas check
  if (
    xCord <= 0 ||
    xCord > grid.length ||
    yCord <= 0 ||
    yCord > grid[0].length
  ) {
    return;
  }
  if (!started) {
    if (
      grid[xCord - 1][yCord - 1] == startNode ||
      grid[xCord - 1][yCord - 1] == endNode
    ) {
      return;
    }

    grid[xCord - 1][yCord - 1].wall = true;
    grid[xCord - 1][yCord - 1].display(55);
  }
}

//Mouse dragged to create walls at mouse location
function mouseDragged() {
  xCord = ceil(floor(mouseX) / 28);
  yCord = ceil(floor(mouseY) / 28);

  //Bounds of Canvas check
  if (
    xCord <= 0 ||
    xCord > grid.length ||
    yCord <= 0 ||
    yCord > grid[0].length
  ) {
    return;
  }
  if (!started) {
    if (
      grid[xCord - 1][yCord - 1] == startNode ||
      grid[xCord - 1][yCord - 1] == endNode
    ) {
      return;
    }

    grid[xCord - 1][yCord - 1].wall = true;
    grid[xCord - 1][yCord - 1].display(50);
  }
}

//Function to place random walls at 30% rate
function randomWall() {
  reset();
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (!(grid[i][j] == startNode || grid[i][j] == endNode)) {
        if (random(100) < 30) {
          grid[i][j].wall = true;
          grid[i][j].display(55);
        }
      }
    }
  }
}
