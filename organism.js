function Organism(row, col, m, id) {
  this.id = id;
  this.m = m;
  this.visited = init2D(this.m.size, this.m.size);
  for (var r = 0; r < this.visited.length; r++) {
    for (var c = 0; c < this.visited[r].length; c++) {
      this.visited[r][c] = 0;
    }
  }

  this.sight = createVector(5, 5);
  this.inputs = init2D(this.sight.x, this.sight.y);

  this.start = createVector(row, col);
  this.pos = createVector(row, col);
  this.prevPos = createVector(0, 0);
  this.step = createVector(0, 0);
  this.furthest = this.start.copy();

  this.dna;
  this.fitness = 0;
  this.life = this.m.size * this.m.w * 2;
}

Organism.prototype.update = function() {
  var n = p5.Vector.add(this.pos, this.step);
  this.prevPos = this.pos.copy();
  if (this.m.grid[n.x][n.y] != 1) {
    this.visited[this.pos.x][this.pos.y]++;
    this.pos.add(this.step);
  }

  this.life--;
}

Organism.prototype.render = function() {
  noStroke();
  fill(50, 50, 255);
  rect(this.pos.x * this.m.w, this.pos.y * this.m.w, this.m.w, this.m.w);
}

Organism.prototype.setDir = function(c) { //u = up, d = down, l = left, r = right
  if (c == 'u')
    this.step = createVector(0, -1);
  else if (c == 'd')
    this.step = createVector(0, 1);
  else if (c == 'l')
    this.step = createVector(-1, 0);
  else if (c == 'r')
    this.step = createVector(1, 0);
}

Organism.prototype.calculateFitness = function() {
  this.fitness = 1000 * (1 / (abs(this.pos.x - this.m.finish.x) + abs(this.pos
    .y - this.m.finish.y)));
  this.furthest = this.pos.copy();
}

Organism.prototype.reset = function() {
  this.pos = this.start.copy();
  this.life = this.m.size * this.m.w * 2;
  this.step = createVector(0, 0);
  for (var r = 0; r < this.visited.length; r++) {
    for (var c = 0; c < this.visited[r].length; c++) {
      this.visited[r][c] = 0;
    }
  }
}
