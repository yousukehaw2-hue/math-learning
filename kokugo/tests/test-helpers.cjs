const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');

function arrayConstant(name){
  const marker='const '+name+'=[';
  const start=html.indexOf(marker);
  if(start<0)throw new Error(name+' not found');
  const end=html.indexOf('];',start);
  if(end<0)throw new Error(name+' closing bracket not found');
  return vm.runInNewContext('('+html.slice(start+('const '+name+'=').length,end+1)+')');
}

function jsonConstant(name){
  const match=html.match(new RegExp('const '+name+'=(\\{[^;]+\\});'));
  if(!match)throw new Error(name+' not found');
  return JSON.parse(match[1]);
}

module.exports={html,questions:arrayConstant('questions'),jsonConstant};
