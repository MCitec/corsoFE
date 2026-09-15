function formatCurrency(amount) {
  return `€ ${Number(amount).toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  })}`;
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("it-IT");
}

function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] ??= [];
    groups[group].push(item);
    return groups;
  }, {});
}

function sortBy(array, key, direction = "asc") {
  const multiplier = direction.toLowerCase() === "desc" ? -1 : 1;

  return [...array].sort((firstItem, secondItem) => {
    const firstValue = firstItem[key];
    const secondValue = secondItem[key];

    if (firstValue < secondValue) return -1 * multiplier;
    if (firstValue > secondValue) return 1 * multiplier;
    return 0;
  });
}
