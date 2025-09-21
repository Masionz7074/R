document.addEventListener("DOMContentLoaded", () => {
  const addItemBtn = document.getElementById("addItemBtn");
  const itemInputsDiv = document.getElementById("itemInputs");
  const generateBtn = document.getElementById("generateBtn");
  const outputCodeArea = document.getElementById("outputCode");
  const previewArea = document.getElementById("previewArea");

  function createItemRow(index) {
    const row = document.createElement("div");
    row.className = "item-row";
    row.dataset.index = index;

    const nameInput = document.createElement("input");
    nameInput.placeholder = "Item Name";
    nameInput.className = "item-name";

    const priceInput = document.createElement("input");
    priceInput.placeholder = "Price (number)";
    priceInput.className = "item-price";

    const categoryInput = document.createElement("input");
    categoryInput.placeholder = "Category e.g. blocks/weapons/swords";
    categoryInput.className = "item-category";

    const iconInput = document.createElement("input");
    iconInput.placeholder = "Icon path (optional)";
    iconInput.className = "item-icon";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      row.remove();
      updatePreview();
    });

    row.append(nameInput, priceInput, categoryInput, iconInput, removeBtn);
    return row;
  }

  function updatePreview() {
    previewArea.innerHTML = "";
    const items = gatherItems();
    const categories = {};
    items.forEach(item => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });
    for (const [cat, its] of Object.entries(categories)) {
      const catDiv = document.createElement("div");
      catDiv.className = "preview-category";
      catDiv.textContent = cat;
      previewArea.appendChild(catDiv);
      its.forEach(it => {
        const itDiv = document.createElement("div");
        itDiv.className = "preview-item";
        itDiv.textContent = `${it.name} — ${it.price}`;
        previewArea.appendChild(itDiv);
      });
    }
  }

  function gatherItems() {
    const rows = itemInputsDiv.querySelectorAll(".item-row");
    const items = [];
    rows.forEach(row => {
      const name = row.querySelector(".item-name").value.trim();
      const price = row.querySelector(".item-price").value.trim();
      const category = row.querySelector(".item-category").value.trim();
      const icon = row.querySelector(".item-icon").value.trim();
      if (name && price && category) {
        items.push({ name, price: Number(price), category, icon });
      }
    });
    return items;
  }

  addItemBtn.addEventListener("click", () => {
    const idx = itemInputsDiv.children.length;
    const row = createItemRow(idx);
    itemInputsDiv.appendChild(row);
  });

  generateBtn.addEventListener("click", () => {
    const title = document.getElementById("menuTitle").value.trim() || "Shop";
    const subtitle = document.getElementById("menuSubtitle").value.trim() || "";
    const scoreboardObj = document.getElementById("scoreboardObj").value.trim() || "coins";
    const items = gatherItems();

    let code = `import { world } from "@minecraft/server";\nimport { ActionFormData } from "@minecraft/server-ui";\n\n`;
    code += `const scoreboardobjective = "${scoreboardObj}";\n`;
    code += `const categoryIcons = {};\n`;
    code += `const ShopItems = [\n`;
    items.forEach(it => {
      const iconPart = it.icon ? `, icon: \"${it.icon}\"` : "";
      code += `  { name: \"${it.name}\", price: ${it.price}, category: \"${it.category}\"${iconPart} },\n`;
    });
    code += `];\n`;
    code += `// ... rest of shop generator code ...`;

    outputCodeArea.value = code;
  });

  addItemBtn.click();
});