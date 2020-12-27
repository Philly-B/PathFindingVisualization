export class PriorityQueue<T> {
  private comparator: Comparator<T>;
  private elements: T[];

  constructor(comparator: Comparator<T>) {
    this.comparator = comparator;
    this.elements = [];
  }

  pushElement(element: T): void {
    this.elements.push(element);
    this.moveElementUp(this.elements.length - 1);
  }

  popElement(): T {
    const first = this.elements[0];
    const last = this.elements.pop();
    if (this.elements.length > 0) {
      this.elements[0] = last;
      this.moveElementDown(0);
    }
    return first;
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  print(): void {
    console.log(this.elements);
  }

  private moveElementDown(index: number): void {
    const lastIndex = this.elements.length - 1;
    let currentIndex = index;
    let minIndex = -1;
    while (minIndex !== currentIndex) {
      // tslint:disable-next-line: no-bitwise
      const leftChildIndex = (currentIndex << 1) + 1;
      const rightChildIndex = leftChildIndex + 1;
      minIndex = currentIndex;
      if (leftChildIndex <= lastIndex && this.comparator(this.elements[leftChildIndex], this.elements[minIndex]) < 0) {
        minIndex = currentIndex;
      }
      if (
        rightChildIndex <= lastIndex &&
        this.comparator(this.elements[rightChildIndex], this.elements[minIndex]) < 0
      ) {
        minIndex = rightChildIndex;
      }
      if (minIndex !== currentIndex) {
        this.swap(minIndex, currentIndex);
        currentIndex = minIndex;
      }
    }
  }

  private moveElementUp(index: number): void {
    let currentIndex = index;
    while (currentIndex > 0) {
      // tslint:disable-next-line: no-bitwise
      const parentIndex = (currentIndex - 1) >>> 1;
      if (this.comparator(this.elements[currentIndex], this.elements[parentIndex]) < 0) {
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  private swap(firstIndex: number, secondIndex: number): void {
    const tmp: T = this.elements[firstIndex];
    this.elements[firstIndex] = this.elements[secondIndex];
    this.elements[secondIndex] = tmp;
  }
}

// java approach:
// < -1 -> a is first
// 0 -> both equal
// > 1 -> b is first
export type Comparator<T> = (a1: T, a2: T) => number;
