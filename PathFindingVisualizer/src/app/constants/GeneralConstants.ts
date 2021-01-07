export const MOUSE_DRAG_WALL_TIMEOUT_MS = 350;
export const INITIAL_ALGORITHM_SPEED = 100;

export const INITIAL_NUMBER_OF_HEX_PER_ROW = 30;
export const CANVAS_SIZE_PX = 650;

export const NOTIFICATION_SETTINGS = {
  positionClass: 'toast-bottom-right',
};

export const mapGridSizeToHexagonSize = (gridSize: number): number => {
  // greets to javascript
  switch (+gridSize) {
    case 5:
      return 50;
    case 10:
      return 30;
    case 15:
      return 22;
    case 20:
      return 17;
    case 25:
      return 14;
    case 30:
      return 12;
    case 35:
      return 10;
    case 40:
      return 9;
    default:
      return 12;
  }
};
