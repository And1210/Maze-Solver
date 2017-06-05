function Maze(size) {
  this.size = size;
  this.w = width / size;
  this.finish = createVector(0, 0);

  this.grid = init2D(this.size, this.size); //0 = empty space, 1 = wall, 2 = start, 3 = finish
  for (var row = 0; row < this.size; row++) {
    for (var col = 0; col < this.size; col++) {
      this.grid[row][col] = 0;
    }
  }

  //Initializing outside walls
  for (var i = 0; i < this.size; i++) {
    this.grid[0][i] = 1;
    this.grid[i][0] = 1;
    this.grid[this.size-1][i] = 1;
    this.grid[i][this.size-1] = 1;
  }
  //Making random walls
  for (var row = 1; row < this.size - 1; row++) {
    for (var col = 1; col < this.size - 1; col++) {
      if (random() < 0.25 && (row + col > 6) && (row + col < this.size * 2 - 6))
        this.grid[row][col] = 1;
    }
  }
  //Making start and finish
  this.grid[1][1] = 2;
  this.grid[this.size-2][this.size-2] = 3;
  this.finish = createVector(this.size-2, this.size-2);
}

Maze.prototype.render = function() {
  noStroke();
  for (var row = 0; row < this.size; row++) {
    for (var col = 0; col < this.size; col++) {
      fill(this.getColour(this.grid[row][col]));
      rect(row * this.w, col * this.w, this.w, this.w);
    }
  }
}

Maze.prototype.getColour = function(id) {
  if (id == 0)
    return color(210);
  else if (id == 1)
    return color(42);
  else if (id == 2)
    return color(255, 0, 100);
  else {
    return color(100, 255, 0);
  }
}
