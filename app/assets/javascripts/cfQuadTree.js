class CfPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class CfRectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h
  }

  contains(point) {
    return (point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h);
  }
}

class CfQuadTree {
  constructor(boundary, n, r) {
    this.boundary = boundary;
    this.level = n;
    this.resolution = r;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let newLevel = this.level + 1;

    let ne = new CfRectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new CfQuadTree(ne, newLevel, this.resolution);
    let nw = new CfRectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new CfQuadTree(nw, newLevel, this.resolution);
    let se = new CfRectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new CfQuadTree(se, newLevel, this.resolution);
    let sw = new CfRectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new CfQuadTree(sw, newLevel, this.resolution);
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }
    if (this.level == this.resolution) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(point)) {
        return true;
      } else if (this.northwest.insert(point)) {
        return true;
      } else if (this.southeast.insert(point)) {
        return true;
      } else if (this.southwest.insert(point)) {
        return true;
      }
    }
  }

  getResBreakdown(valList) {
    if (this.level == this.resolution && this.points.length > 0) {
      valList.push({x: this.boundary.x, y: this.boundary.y, val: this.points.length})
    } else if (this.divided) {
      this.northeast.getResBreakdown(valList);
      this.northwest.getResBreakdown(valList);
      this.southeast.getResBreakdown(valList);
      this.southwest.getResBreakdown(valList);
    }
  }
}
