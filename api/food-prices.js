const BI='https://www.bi.go.id/hargapangan/WebSite/TabelHarga';
module.exports=async(req,res)=>{
try{
const q=req.query||{},commodity=String(q.comcat_id||'').trim();
if(!commodity)return res.status(400).json({error:'comcat_id wajib'});
const params=new URLSearchParams({price_type_id:String(q.price_type_id||'1'),comcat_id:commodity,province_id:String(q.province_id||'9999'),regency_id:'',showKota:q.showKota==='true'?'true':'false',showPasar:'false',tipe_laporan:'1',start_date:String(q.start_date||new Date(Date.now()-6*86400000).toISOString().slice(0,10)),end_date:String(q.end_date||new Date().toISOString().slice(0,10))});
const r=await fetch(BI+'/GetGridDataKomoditas?'+params.toString(),{headers:{accept:'application/json'}}),text=await r.text();
res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=900');
res.setHeader('Content-Type','application/json; charset=utf-8');
if(!r.ok)return res.status(r.status).send(text);
return res.status(200).send(text);
}catch(err){return res.status(500).json({error:err?.message||'PIHPS proxy error'});}
};
