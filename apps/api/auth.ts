import {randomBytes,createHash,scrypt,timingSafeEqual} from 'node:crypto';import type {Request,Response} from 'express';import {pool} from './db.js';
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
const derive=(p:string,s:string)=>new Promise<Buffer>((resolve,reject)=>scrypt(p,s,64,{N:32768,r:8,p:3,maxmem:64*1024*1024},(e,k)=>e?reject(e):resolve(k)));
export async function hashPassword(p:string){const salt=randomBytes(16).toString('hex');return 'scrypt$'+salt+'$'+(await derive(p,salt)).toString('hex');}
export async function passwordMatches(p:string,h:string){const [,s,k]=h.split('$');if(!s||!k)return false;const a=await derive(p,s),b=Buffer.from(k,'hex');return a.length===b.length&&timingSafeEqual(a,b);}
export function cookies(req:Request):Record<string,string>{return Object.fromEntries((req.headers.cookie??'').split(';').map(s=>s.trim().split('=')).filter(p=>p.length===2));}
const opts={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/'};
export async function session(res:Response,userId:string,old?:string){const token=randomBytes(32).toString('hex');await pool.query("INSERT INTO sessions VALUES($1,$2,now()+interval '12 hours')",[digest(token),userId]);if(old)await pool.query('DELETE FROM sessions WHERE token_hash=$1',[digest(old)]);res.cookie('vs_session',token,{...opts,maxAge:43200000});}
export function clearSession(res:Response){res.clearCookie('vs_session',opts);}
export function csrf(req:Request,res:Response){let t=cookies(req).vs_csrf;if(!t||!/^[a-f0-9]{64}$/.test(t)){t=randomBytes(32).toString('hex');res.cookie('vs_csrf',t,{...opts,maxAge:43200000});}return t;}