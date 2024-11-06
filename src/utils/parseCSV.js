const parseCSV = data => {
  const lines = data.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((acc, header, idx) => {
      acc[header] = values[idx] ? values[idx].trim() : null;
      return acc;
    }, {});
  });
};

export default parseCSV;
