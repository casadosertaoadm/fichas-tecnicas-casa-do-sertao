import { describe, it, expect } from "vitest";
import { filterRecipes, type Recipe } from "@/lib/recipes";
const r = (name: string, category: Recipe["category"], ing: string): Recipe => ({ id: name, name, category, yieldQty: "1", yieldUnit: "Kg", ingredients: [{ id: "1", name: ing, qty: "1", unit: "g" }], equipment: "", preparation: "", updatedAt: 0 });
const list = [r("Bolo de Macaxeira", "Bolos Ligados", "Coco ralado"), r("Rocambole", "Rocamboles", "Ovos")];
describe("busca de fichas", () => {
  it("busca por ingrediente", () => expect(filterRecipes(list, "coco", "Todas").map((x) => x.id)).toEqual(["Bolo de Macaxeira"]));
  it("filtra por categoria", () => expect(filterRecipes(list, "", "Rocamboles").map((x) => x.id)).toEqual(["Rocambole"]));
});
