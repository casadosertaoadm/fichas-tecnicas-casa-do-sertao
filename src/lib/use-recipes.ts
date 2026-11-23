import { useEffect, useState } from "react";
import { loadRecipes, type Recipe } from "./recipes";
export function useRecipes() {
  const [list, setList] = useState<Recipe[] | null>(null);
  useEffect(() => {
    let alive = true;
    const f = () => { loadRecipes().then((l) => { if (alive) setList(l); }).catch((e) => { console.error(e); if (alive) setList([]); }); };
    f(); window.addEventListener("cds-change", f);
    return () => { alive = false; window.removeEventListener("cds-change", f); };
  }, []);
  return list;
}
