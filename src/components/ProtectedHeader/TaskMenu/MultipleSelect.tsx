import { MenuItem, Checkbox, ListItemText } from "@mui/material";
import { useState } from "react";

import "./style.css";

function MultipleSelect() {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  function handleClick(clickedName: string) {
    if (selectedNames.includes(clickedName)) {
      setSelectedNames(selectedNames.filter((name) => name !== clickedName));
    } else {
      setSelectedNames([...selectedNames, clickedName]);
    }
  }

  const names = [
    "Anh Tu Mai",
    "Le Hai Minh",
    "Nuutti Numinen",
    "Marja Shara",
    "Lauri Salmio",
    "Holger and Olger",
    "Random",
  ];
  return (
    <select multiple value={selectedNames}>
      {names.map((name, i) => (
        <option value={name} key={i} onClick={() => handleClick(name)}>
          {name}
        </option>
      ))}
    </select>
  );
}

export default MultipleSelect;
