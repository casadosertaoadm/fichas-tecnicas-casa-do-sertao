import { useEffect, useState } from "react";
import { loadRecipes, type Recipe } from "./recipes";
export function useRecipes() {
  const [list, setList] = useState<Recipe[] | null>(null);
  useEffect(() => { const f = () => setList(loadRecipes()); f(); window.addEventListener("cds-change", f); return () => window.removeEventListener("cds-change", f); }, []);
  return list;
}
