export default class {
  constructor(x, y, width, height, color, isWall) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isWall = isWall;
    this.color = isWall ? '#000' : color;
    this.wasVisited = false;
  }

  GetCoordsAndDim() {
    return [this.x, this.y, this.width, this.height];
  }
}
