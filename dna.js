function DNA() {
  this.sight = createVector(5, 5);
  this.inputNeurons = init2D(this.sight.x, this.sight.y);
  this.neurons = [];
  this.outputNeurons = new Array(4);

  //Initializing inputNeurons
  for (var row = 0; row < this.sight.x; row++) {
    for (var col = 0; col < this.sight.y; col++) {
      this.inputNeurons[row][col] = new Neuron(0);
    }
  }

  //Initializing outputNeurons
  this.outputNeurons[0] = new Neuron(2, 'u');
  this.outputNeurons[1] = new Neuron(2, 'd');
  this.outputNeurons[2] = new Neuron(2, 'l');
  this.outputNeurons[3] = new Neuron(2, 'r');
}

DNA.prototype.copy = function() {
  var out = new DNA();
  out.sight = this.sight.copy();
  for (var i = 0; i < this.neurons.length; i++) {
    out.neurons[i] = this.neurons[i].copy();
  }
  for (var i = 0; i < this.outputNeurons.length; i++) {
    out.outputNeurons[i] = this.outputNeurons[i].copy();
  }
  for (var row = 0; row < this.sight.x; row++) {
    for (var col = 0; col < this.sight.y; col++) {
      out.inputNeurons[row][col] = this.inputNeurons[row][col].copy();
    }
  }
  return out;
}

DNA.prototype.cross = function(dna) {
  var out = this.copy();
  for (var i = 0; i < min(out.neurons.length, dna.neurons.length); i++) {
    if (out.neurons[i] == undefined && dna.neurons[i] != undefined) {
      out.neurons.push(t2);
    } else if (out.neurons[i] != undefined && dna.neurons[i] != undefined) {
      var t = dna.neurons[i].copy();
      //Chance of crossover
      if (random() < 0.5) {
        out.neurons[i] = t;
        for (var row = 0; row < this.sight.x; row++) {
          for (var col = 0; col < this.sight.y; col++) {
            out.inputNeurons[row][col] = dna.inputNeurons[row][col].copy();
            // for (var n = 0; n < out.inputNeurons[row][col].axons.length; n++) {
            //   if (out.inputNeurons[row][col].axons[n].type != -2 && out.inputNeurons[
            //       row][col].axons[n] != undefined)
            //     out.inputNeurons[row][col].axons[n] = out.neurons[n].copy();
            // }
          }
        }
      }
    }
  }
  // if (random() < 0.5) {
  //   out = dna.copy();
  // }
  return out;
}

DNA.prototype.mutate = function() {
  //Mutating neurons
  if (this.neurons.length > 0) {
    for (var i = 0; i < this.neurons.length; i++) {
      //Chance of adding another neuron
      if (random() < 0.01 && this.neurons.length < 10) {
        this.neurons.push(new Neuron(1));
      }
      //Chance of mutation
      if (random() < 0.1) {
        var r = random();
        if (r < 0.95) {
          var index = floor(random(this.outputNeurons.length));
          // console.log(this.outputNeurons[index]);
          var j = -1;
          for (var k = 0; k < this.neurons[i].axons.length; k++) {
            if (this.neurons[i].axons[k].type == 2) {
              j = k;
              break;
            }
          }
          if (j == -1)
            this.neurons[i].axons.push(this.outputNeurons[index]);
          else
            this.neurons[i].axons[j] = this.outputNeurons[index];
        } else {
          var index = floor(random(this.neurons.length));
          if (index != i)
            this.neurons[i].axons.push(this.neurons[index]);
        }
      }
    }
  } else {
    //Adding a new neuron if none are currently available
    if (random() < 0.2 && this.neurons.length < 10) {
      this.neurons.push(new Neuron(1));
    }
  }

  //Mutating inputs
  for (var row = 0; row < this.sight.x; row++) {
    for (var col = 0; col < this.sight.y; col++) {
      //Chance of mutation
      if (random() < 0.2) {
        var r = random();
        //Chance of direct link to output
        if (r < 0.5) {
          var index = floor(random(this.outputNeurons.length));
          // console.log(this.outputNeurons[index]);
          var j = -1;
          for (var i = 0; i < this.inputNeurons[row][col].axons.length; i++) {
            if (this.inputNeurons[row][col].axons[i].type == 2) {
              j = i;
              break;
            }
          }
          if (j == -1)
            this.inputNeurons[row][col].axons.push(this.outputNeurons[index]);
          else
            this.inputNeurons[row][col].axons[j] = this.outputNeurons[index];
        } else {
          if (this.neurons.length != 0) {
            var index = floor(random(this.neurons.length));
            var j = -1;
            for (var i = 0; i < this.inputNeurons[row][col].axons.length; i++) {
              if (this.inputNeurons[row][col].axons[i].type == 1) {
                j = i;
                break;
              }
            }
            if (j == -1)
              this.inputNeurons[row][col].axons.push(this.neurons[index]);
            else
              this.inputNeurons[row][col].axons[j] = this.neurons[index];
          }
        }
      }
    }
  }
}
