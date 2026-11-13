import {MULTI_SEPARATOR,normalizeAnswer} from './questions';

export function selectedChoices(value:string){return value.split(MULTI_SEPARATOR).map(v=>v.trim()).filter(Boolean);}
export function isChoiceSelected(value:string,choice:string){return selectedChoices(value).some(v=>normalizeAnswer(v)===normalizeAnswer(choice));}
export function toggleChoice(value:string,choice:string){const selected=selectedChoices(value);const exists=isChoiceSelected(value,choice);return (exists?selected.filter(v=>normalizeAnswer(v)!==normalizeAnswer(choice)):[...selected,choice]).join(MULTI_SEPARATOR);}
