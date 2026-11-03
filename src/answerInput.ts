/** Toggle the leading sign without changing the numeric digits. */
export function toggleAnswerSign(value:string):string{const v=value.trim();if(v.startsWith('-')||v.startsWith('−')||v.startsWith('－'))return v.slice(1);if(v.startsWith('+')||v.startsWith('＋'))return '-'+v.slice(1);return '-'+v;}
