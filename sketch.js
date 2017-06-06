var maze;
var generation;
var running = true;
var fastForward;

function setup() {
  createCanvas(600, 600);

  fastForward = createCheckbox('Fast Forward', false);

  maze = new Maze(60);
  generation = new Generation(maze);
}

function draw() {
  background(42);

  maze.render();

  generation.render();
  if (running)
    generation.update();
}

function init2D(row, col) {
  var out = new Array(row);
  for (var i = 0; i < row; i++) {
    out[i] = new Array(col);
  }
  return out;
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
    console.log(maze.grid[floor(mouseX / maze.w)][floor(mouseY / maze.w)]);
}
