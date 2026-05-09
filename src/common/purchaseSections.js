export const PURCHASE_SECTIONS = [
  { category: 'vegetables', title: 'Овощи' },
  { category: 'duzina', title: 'Дюжина' },
  { category: 'mangal', title: 'Мангал' },
  { category: 'house', title: 'Хоз товары' },
];

const splitNameComment = (value) => {
  const match = value.match(/^(.*)\s+\((.*)\)$/);

  if (!match) {
    return {
      name: value.trim(),
      comment: '',
    };
  }

  return {
    name: match[1].trim(),
    comment: match[2].trim(),
  };
};

export const formatItemLine = (item) => {
  const name = `${item.name}${item.comment ? ` (${item.comment})` : ''}`;
  return item.counted ? `${name} - ${item.count}${item.type}` : name;
};

export const formatSectionText = (items) => items.map(formatItemLine).join('\n');

export const parseSectionText = (text, category) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const countedMatch = line.match(/^(.*?)\s*-\s*(\d+(?:[.,]\d+)?)\s*(.*)$/);

      if (countedMatch) {
        const { name, comment } = splitNameComment(countedMatch[1]);
        const rawCount = countedMatch[2].replace(',', '.');

        return {
          name,
          comment,
          commented: Boolean(comment),
          counted: true,
          count: Number(rawCount),
          type: countedMatch[3].trim(),
          category,
        };
      }

      const { name, comment } = splitNameComment(line);

      return {
        name,
        comment,
        commented: Boolean(comment),
        counted: false,
        count: 1,
        type: '',
        category,
      };
    });
