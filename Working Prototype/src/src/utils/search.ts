import { laptops, lessons } from "../data/demoData";
export function searchEverything(query:string){
 const q=query.trim().toLowerCase();
 if(!q)return [];
 return [
  ...laptops.filter(x=>`${x.brand} ${x.model} ${x.family}`.toLowerCase().includes(q)).map(x=>({type:"LAPTOP",label:`${x.brand} ${x.model}`,meta:x.family})),
  ...lessons.filter(x=>`${x.title} ${x.group} ${x.what}`.toLowerCase().includes(q)).map(x=>({type:"LEARN",label:x.title,meta:x.group}))
 ].slice(0,12);
}
