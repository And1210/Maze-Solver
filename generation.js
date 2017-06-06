function Generation(maze) {
  this.generationsCompleted = 0;
  this.delayTime = 1;
  this.updateTimer = this.delayTime;
  this.timeoutMax = 5;
  this.timeoutFrames = 0;
  this.spawnTime = 0;

  this.maze = maze;
  this.population = 20;
  this.organisms = new Array(this.population);
  for (var i = 0; i < this.population; i++) {
    this.organisms[i] = new Organism(1, 1, this.maze, i);
  }
  this.current = 0;
  this.stepQueue = [];
  this.stepIndex = 0;

  this.baseDNA = new DNA();
  this.organisms[this.current].dna = this.baseDNA.copy();
}

Generation.prototype.render = function() {
  var furthest = this.organisms[0].furthest;
  noStroke();
  fill(255, 215, 0);
  rect(furthest.x * this.maze.w, furthest.y * this.maze.w, this.maze.w, this.maze
    .w);
  this.organisms[this.current].render();
}

Generation.prototype.update = function() {
  this.organisms[this.current].render();
  if (millis() >= this.updateTimer) {
    this.updateTimer = millis() + this.delayTime;

    if (this.stepQueue.length == 0) {
      //Firing all inputs
      this.setupInputs(this.organisms[this.current].inputs);
      this.fireInputs(this.organisms[this.current].inputs);

      //Physical movement of the this.organisms[this.current]
      this.organisms[this.current].update();

      //Timeout
      if (p5.Vector.sub(this.organisms[this.current].pos, this.organisms[this
            .current]
          .prevPos).magSq() <= 0.0001) {
        this.timeoutFrames++;
      } else {
        this.timeoutFrames = 0;
      }
      var timeout = false;
      for (var row = 0; row < this.organisms[this.current].visited.length; row++) {
        for (var col = 0; col < this.organisms[this.current].visited[row].length; col++) {
          if (this.organisms[this.current].visited[row][col] >= this.timeoutMax) {
            timeout = true;
            break;
          }
        }
        if (timeout)
          break;
      }

      //If it times out or dies
      if (this.timeoutFrames >= this.timeoutMax || this.organisms[this.current]
        .life <= 0 || timeout) {
        this.timeoutFrames = 0;
        this.nextOrganism();
        console.log(this.current);
      }
    } else if (this.stepIndex < this.stepQueue.length) {
      if (fastForward.checked()) {
        while (this.stepIndex < this.stepQueue.length) {
          var c = this.stepQueue[this.stepIndex++];
          this.organisms[this.current].setDir(c);
          this.organisms[this.current].update();
        }
      } else {
        var c = this.stepQueue[this.stepIndex++];
        this.organisms[this.current].setDir(c);
        this.organisms[this.current].update();
      }
    } else {
      this.stepQueue = [];
      this.stepIndex = 0;
    }
  }
}

Generation.prototype.addOrganismDir = function(c) {
  this.stepQueue.push(c);
}

Generation.prototype.setupInputs = function(inputs) {
  for (var row = -floor(this.baseDNA.sight.x / 2); row < ceil(this.baseDNA.sight
      .x / 2); row++) {
    for (var col = -floor(this.baseDNA.sight.y / 2); col < ceil(this.baseDNA.sight
        .y / 2); col++) {
      var x = row + this.organisms[this.current].pos.x;
      var y = col + this.organisms[this.current].pos.y;
      if (x >= 0 && x < this.maze.size && y >= 0 && y < this.maze.size) {
        var n = this.maze.grid[x][y];
        if (n == undefined)
          inputs[row + floor(this.baseDNA.sight.x / 2)][col + floor(this.baseDNA
            .sight.y / 2)] = 1;
        else if (n == 2 || n == 3)
          inputs[row + floor(this.baseDNA.sight.x / 2)][col + floor(this.baseDNA
            .sight.y / 2)] = 0;
        else
          inputs[row + floor(this.baseDNA.sight.x / 2)][col + floor(this.baseDNA
            .sight.y / 2)] = n;
      } else {
        inputs[row + floor(this.baseDNA.sight.x / 2)][col + floor(this.baseDNA
          .sight.y / 2)] = 1;
      }
    }
  }
}

Generation.prototype.fireInputs = function(inputs) {
  for (var row = 0; row < this.organisms[this.current].dna.inputNeurons.length; row++) {
    for (var col = 0; col < this.organisms[this.current].dna.inputNeurons[row]
      .length; col++) {
      if (inputs[row][col] == 1) {
        this.organisms[this.current].dna.inputNeurons[row][col].fire();
      } else if (inputs[row][col] == 0) {
        // this.baseDNA.inputNeurons[row][col].fireOpposite();
      }
    }
  }
}

Generation.prototype.nextOrganism = function() {
  this.current++;

  if (this.current >= this.population) {
    this.generationsCompleted++;
    console.log("Generations Completed: " + this.generationsCompleted);
    for (var i = 0; i < this.organisms.length; i++) {
      this.organisms[i].calculateFitness();
    }
    this.crossOver();
    for (var i = 0; i < this.organisms.length; i++) {
      this.organisms[i].reset();
    }
    this.current = 0;
  } else {
    this.baseDNA.mutate();
    this.organisms[this.current].dna = this.baseDNA.copy();
    this.spawnTime = millis();
  }
}

Generation.prototype.crossOver = function() {
  this.organisms.sort(function(a, b) {
    return b.fitness - a.fitness;
  });
  //console.log(this.organisms);

  // this.baseDNA = this.organisms[0].dna.copy();
  // var s = ceil(this.organisms.length / 2);
  // for (var i = s; i < this.organisms.length; i++) {
  //   this.organisms[i].dna = this.organisms[0]
  //     .dna.cross(this.organisms[i - s].dna);
  // }
  // this.organisms[0].dna = this.baseDNA.copy();

  // running = false;
}
