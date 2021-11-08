function parseDateString(dateString: string) {
  const dateObject = new Date(dateString);
  const month = dateObject.getMonth();
  const day = dateObject.getDay();
  const year = dateObject.getFullYear();
  return `${day}/${month}/${year}`;
}

function getAbbreviation(name: string) {
  return name
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

const commonUtils = {
  parseDateString,
  getAbbreviation,
};

export default commonUtils;
