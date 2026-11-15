
import foods from "./data/foods";
import API_BASE_URL from "./api";

async function seedFoods() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/foods/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foods),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const savedFoods = await response.json();

    console.log("Foods saved successfully:", savedFoods.length);
    alert(`${savedFoods.length} foods added successfully!`);
  } catch (error) {
    console.error("Food upload failed:", error);
    alert("Food upload failed. Check the browser console.");
  }
}

seedFoods();
