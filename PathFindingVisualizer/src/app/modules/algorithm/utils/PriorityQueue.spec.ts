import { PriorityQueue } from './PriorityQueue';

describe('PriorityQueue', () => {
  let priorityQueue: PriorityQueue<TestObject>;

  beforeEach(() => {
    priorityQueue = new PriorityQueue<TestObject>((t1, t2) => t1.priority - t2.priority);
  });

  it('should order correctly when inserted reverse', () => {
    for (let i = 10; i >= 0; i--) {
      priorityQueue.pushElement(new TestObject(i));
    }
    const result = popAllItemsIntoArray(priorityQueue);
    assertThatArrayInCorrectOrder(result);
  });

  it('should order correctly when inserted randomly', () => {
    priorityQueue.pushElement(new TestObject(6));
    priorityQueue.pushElement(new TestObject(10));
    priorityQueue.pushElement(new TestObject(4));
    priorityQueue.pushElement(new TestObject(3));
    priorityQueue.pushElement(new TestObject(0));
    priorityQueue.pushElement(new TestObject(9));
    priorityQueue.pushElement(new TestObject(7));
    priorityQueue.pushElement(new TestObject(5));
    priorityQueue.pushElement(new TestObject(2));
    priorityQueue.pushElement(new TestObject(8));
    priorityQueue.pushElement(new TestObject(1));

    const result = popAllItemsIntoArray(priorityQueue);
    assertThatArrayInCorrectOrder(result);
  });
});

function popAllItemsIntoArray(priorityQueue: PriorityQueue<TestObject>) {
  const result = [];
  while (!priorityQueue.isEmpty()) {
    result.push(priorityQueue.popElement().priority);
  }
  return result;
}

function assertThatArrayInCorrectOrder(numArr: number[]) {
  for (let i = 0; i < numArr.length; i++) {
    expect(numArr[i]).toEqual(i);
  }
}

class TestObject {
  constructor(public priority: number) {}
}
