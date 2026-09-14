/** RFC-4180-style CSV parser suitable for exported Google, Microsoft, and Teams sheets. */
export function parseCsv(text) {
  const rows=[];let row=[];let field="";let quoted=false;
  const input=String(text??"").replace(/^\uFEFF/,"");
  for(let i=0;i<input.length;i++){
    const char=input[i];
    if(quoted){if(char==='"'&&input[i+1]==='"'){field+='"';i++}else if(char==='"'){quoted=false}else field+=char;continue}
    if(char==='"'){quoted=true;continue}
    if(char===','){row.push(field);field="";continue}
    if(char==='\n'){row.push(field);rows.push(row);row=[];field="";continue}
    if(char!=='\r')field+=char;
  }
  if(field.length||row.length){row.push(field);rows.push(row)}
  const nonempty=rows.filter(r=>r.some(value=>value.trim()!==""));if(!nonempty.length)return {headers:[],rows:[]};
  const headers=nonempty[0].map((h,index)=>h.trim()||`Column ${index+1}`);
  return {headers,rows:nonempty.slice(1).map(values=>Object.fromEntries(headers.map((header,index)=>[header,(values[index]??"").trim()]))) };
}

