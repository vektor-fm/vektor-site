import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir=path.resolve('pace'),manifest=JSON.parse(fs.readFileSync(path.join(dir,'release-files.json'),'utf8')),live=process.argv.includes('--live')?process.argv[process.argv.indexOf('--live')+1]:null;
if(process.argv.includes('--live')&&!live)throw Error('Provide the actual live PACE base URL');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
for(let i=0;i<manifest.files.length;i+=4){await Promise.all(manifest.files.slice(i,i+4).map(async file=>{assert.equal(sha(fs.readFileSync(path.join(dir,file.path))),file.sha256,'Local bytes '+file.path);if(live){const response=await fetch(new URL(file.path,live),{signal:AbortSignal.timeout(20000)});assert(response.ok,'Live HTTP '+response.status+' '+file.path);assert.equal(sha(Buffer.from(await response.arrayBuffer())),file.sha256,'Live bytes '+file.path);}}));}
const data=JSON.parse(fs.readFileSync(path.join(dir,'data.json'),'utf8'));for(const record of data.records)assert.equal(sha(fs.readFileSync(path.join(dir,record.download))),record.sha256);
console.log(JSON.stringify({checkedAt:new Date().toISOString(),passed:true,files:manifest.files.length,live:live||false,records:data.records.length,originalRecordHashes:true},null,2));
