export function getTableData(results) {
  let array = [];
  results.map((results) => {
    array.push(results.attributes);
  });
  return array
}
