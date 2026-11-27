const B=import.meta.env.BASE_URL as string
/** Turns a stored path like 'img/a.jpg' into one that works under any site base path. */
export const asset=<T extends string|null|undefined>(u:T):T=>{
 if(!u)return u
 if(/^(https?:|data:|blob:|\/\/)/.test(u))return u
 return (B.replace(/\/$/,'')+'/'+u.replace(/^\.?\//,'')) as T
}
