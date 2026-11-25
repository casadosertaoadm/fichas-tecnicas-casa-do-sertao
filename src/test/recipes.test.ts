import { describe, it, expect } from "vitest";
import { CATEGORIES, filterRecipes, type Recipe } from "@/lib/recipes";
describe("categorias", () => {
  it("inclui Brownies e Dindins", () => {
    expect(CATEGORIES).toContain("Brownies");
    expect(CATEGORIES).toContain("Dindins");
  });
  it("filtra por Brownies", () => expect(filterRecipes([r("Brownie de Chocolate", "Brownies", "Chocolate")], "", "Brownies").map((x) => x.id)).toEqual(["Brownie de Chocolate"]));
});
const r = (name: string, category: Recipe["category"], ing: string): Recipe => ({ id: name, name, category, yieldQty: "1", yieldUnit: "Kg", ingredients: [{ id: "1", name: ing, qty: "1", unit: "g" }], equipment: "", preparation: "", updatedAt: 0 });
const list = [r("Bolo de Macaxeira", "Bolos Ligados", "Coco ralado"), r("Rocambole", "Rocamboles", "Ovos")];
describe("busca de fichas", () => {
  it("busca por ingrediente", () => expect(filterRecipes(list, "coco", "Todas").map((x) => x.id)).toEqual(["Bolo de Macaxeira"]));
  it("filtra por categoria", () => expect(filterRecipes(list, "", "Rocamboles").map((x) => x.id)).toEqual(["Rocambole"]));
});
import { formatYield, yieldTotal } from "@/lib/recipes";
describe("rendimento", () => {
  it("simples", () => expect(formatYield({ yieldQty: "12", yieldUnit: "Kg" })).toBe("12 Kg"));
  it("composto", () => expect(formatYield({ yieldQty: "12", yieldUnit: "", yieldMode: "composto", yieldItemUnit: "unidades", yieldEach: "1", yieldEachUnit: "kg" })).toBe("12 unidades de 1 kg"));
  it("total em kg", () => expect(yieldTotal({ yieldQty: "30", yieldMode: "composto", yieldEach: "90", yieldEachUnit: "g" })).toBe("2,7 kg"));
  it("sem total para ml", () => expect(yieldTotal({ yieldQty: "3", yieldMode: "composto", yieldEach: "500", yieldEachUnit: "ml" })).toBeNull());
});
