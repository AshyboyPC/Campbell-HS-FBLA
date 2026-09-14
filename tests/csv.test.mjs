import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv } from "../lib/points/csv.js";

test("parses quoted commas and escaped quotes",()=>{
 const result=parseCsv('Name,Email,Note\n"Smith, Jane",jane@example.com,"Said ""yes"""\n');
 assert.deepEqual(result.rows,[{Name:"Smith, Jane",Email:"jane@example.com",Note:'Said "yes"'}]);
});

test("removes blank exported rows",()=>assert.equal(parseCsv("A,B\n1,2\n,\n").rows.length,1));

