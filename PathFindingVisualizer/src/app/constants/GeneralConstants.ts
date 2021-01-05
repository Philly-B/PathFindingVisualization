export const MOUSE_DRAG_WALL_TIMEOUT_MS = 250;
export const INITIAL_ALGORITHM_SPEED = 100;

export const INITIAL_NUMBER_OF_HEX_PER_ROW = 30;
export const CANVAS_SIZE_PX = 650;

export const NOTIFICATION_SETTINGS = {
  positionClass: 'toast-bottom-right',
};

export const mapGridSizeToHexagonSize = (gridSize: number): number => {
  if (gridSize <= 5) {
    return 12;
  } else if (gridSize <= 15) {
    return 12;
  } else if (gridSize <= 25) {
    return 12;
  } else if (gridSize <= 35) {
    return 12;
  } else if (gridSize <= 45) {
    return 12;
  }
  return 12;
}
