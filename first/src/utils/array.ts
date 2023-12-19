export const quickSort = <T>(arr: T[], property: string): T[] => {
  if (arr.length < 2) {
    return arr;
  }

  const min = 1;
  const max = arr.length - 1;
  const rand = Math.floor(min + Math.random() * (max + 1 - min));
  const pivot = arr[rand];
  const left = [];
  const right = [];

  arr.splice(arr.indexOf(pivot), 1);
  arr = [pivot].concat(arr);

  for (let i = 1; i < arr.length; i++) {
    if (pivot[`${property}`] > arr[i][`${property}`]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return quickSort(left, property).concat(pivot, quickSort(right, property));
};

export function move<T>(array: T[], index: number, offset: number): T[] {
  const output = [...array];
  const element = output.splice(index, 1)[0];
  let updatedIndex = index + offset;
  if (updatedIndex < 0) updatedIndex++;
  else if (updatedIndex >= array.length) updatedIndex -= array.length;
  output.splice(updatedIndex, 0, element);
  return output;
}

export function sliceArrayIntoChunks<T>(array: T[], chunkSize: number): T[][] {
  const resultedArray: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    resultedArray.push(chunk);
  }

  return resultedArray;
}

export const unique = <T>(value: T, index: number, self): boolean => {
  return self.indexOf(value) === index;
};

export function groupBy<T>(array: T[], property: keyof T) {
  const groupedSet: Record<string, T[]> = {};

  return array.reduce((acc, entity) => {
    const key = entity[property].toString();

    if (!groupedSet[key]) {
      groupedSet[key] = [];
    }

    groupedSet[key].push(entity);
    return groupedSet;
  }, groupedSet);
}

export function mapToString(array: string[]) {
  return array.map((el) => `'${el}'`).join(', ');
}
