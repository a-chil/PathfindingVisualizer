function Cell(i, j) {
  //Location in terms of column and row
  this.i = i;
  this.j = j;

  this.f = 0; //f is the sum
  this.g = 0; //g is the movement cost
  this.h = 0; //heuristic - educated guess of movement cost to final destination

  this.neighbors = []; //neighbors of each cell
  this.prev = undefined;

  this.wall = false;

  this.display = (color) => {
    stroke(102, 204, 255);
    strokeWeight(0.5);
    //strokeWeight(1);
    if (color) {
      fill(color);
    } else if (this.wall) {
      fill(55);
    } else {
      fill(255);
    }
    //ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2); //Display cells
    rect(this.i * w, this.j * h, w - 1, h - 1); //Display cells
  };

  //Adding neighboring Cells based on position
  this.addNeighbors = (grid) => {
    var i = this.i;
    var j = this.j;
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }

    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    //Diagonal neighbors -- Disabled for aesthetic reasons
    //Top Left
    // if (i > 0 && j > 0) {
    //   this.neighbors.push(grid[i - 1][j - 1]);
    // }
    // //Top Right
    // if (i < cols - 1 && j > 0) {
    //   this.neighbors.push(grid[i + 1][j - 1]);
    // }
    // //Bottom Left
    // if (i > 0 && j < rows - 1) {
    //   this.neighbors.push(grid[i - 1][j + 1]);
    // }
    // //Bottom right
    // if (i < cols - 1 && j < rows - 1) {
    //   this.neighbors.push(grid[i + 1][j + 1]);
    // }
  };
}
