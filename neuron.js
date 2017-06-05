function Neuron(type, out) {
  this.type = type; //0 = input, 1 = hidden, 2 = output
  this.output = out;

  this.axons = [];
}

Neuron.prototype.fire = function() {
  if (this.type != 2) {
    for (var i = 0; i < this.axons.length; i++) {
      this.axons[i].fire();
    }
  } else {
    generation.addOrganismDir(this.output);
  }
}

Neuron.prototype.fireOpposite = function() {
  if (this.type != 2) {
    for (var i = 0; i < this.axons.length; i++) {
      this.axons[i].fireOpposite();
    }
  } else {
    generation.addOrganismDir(this.oppositeOut(this.output));
  }
}

Neuron.prototype.copy = function() {
  var out = new Neuron(this.type, this.output);
  for (var i = 0; i < this.axons.length; i++) {
    out.axons[i] = this.axons[i].copy();
  }
  return out;
}

Neuron.prototype.oppositeOut = function(c) {
  if (c == 'l') {
    return 'r';
  } else if (c == 'r') {
    return 'l';
  } else if (c == 'u') {
    return 'd';
  } else if (c == 'd') {
    return 'u';
  }
}
