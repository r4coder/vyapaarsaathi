import {z} from 'zod';
export const credentials=z.object({email:z.email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(12).max(128)}).strict();
export const profile=z.object({name:z.string().trim().min(1).max(120),category:z.enum(['grocery','restaurant','fashion','electronics','pharmacy','general_retail','other']),location:z.string().trim().min(1).max(250),language:z.enum(['en','te','hi','ta','kn']),timezone:z.string().refine(v=>{try{new Intl.DateTimeFormat('en',{timeZone:v});return true;}catch{return false;}},'Choose a valid timezone'),goals:z.string().trim().max(2000)}).strict();
export type ProfileInput=z.infer<typeof profile>;
export type Business=ProfileInput & {id:string;version:number};
export type Identity={id:string;email:string;businesses:Business[]};