module.exports=async(req,res)=>{
try{
const adm4=String(req.query?.adm4||'').trim();
if(!/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(adm4))return res.status(400).json({error:'adm4 tidak valid'});
const r=await fetch('https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4='+encodeURIComponent(adm4),{headers:{accept:'application/json'}});
const text=await r.text();
res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=1800');
res.setHeader('Content-Type','application/json; charset=utf-8');
if(!r.ok)return res.status(r.status).send(text);
return res.status(200).send(text);
}catch(err){return res.status(500).json({error:err?.message||'BMKG proxy error'});}
};
