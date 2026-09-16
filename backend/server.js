import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

const assets = [
 {id:'AST-1001',name:'HVAC Chiller A',site:'Kolkata Medical Centre',type:'HVAC',health:91,risk:'Low',temperature:6.2,vibration:1.8,load:62,lastService:'2026-08-20'},
 {id:'AST-1002',name:'Air Handler B',site:'Kolkata Medical Centre',type:'Air Handler',health:68,risk:'Medium',temperature:11.4,vibration:4.7,load:79,lastService:'2026-07-14'},
 {id:'AST-1003',name:'Cooling Tower 1',site:'Riverside Facility',type:'Cooling',health:42,risk:'High',temperature:18.9,vibration:8.6,load:94,lastService:'2026-05-29'},
 {id:'AST-1004',name:'Backup Generator',site:'Riverside Facility',type:'Power',health:76,risk:'Medium',temperature:74.1,vibration:3.1,load:71,lastService:'2026-08-02'},
 {id:'AST-1005',name:'Water Pump 7',site:'North Operations',type:'Pump',health:97,risk:'Low',temperature:31.5,vibration:1.2,load:48,lastService:'2026-09-01'}
];

app.get('/api/health',(req,res)=>res.json({status:'ok',service:'Xempla AssetOps API',time:new Date().toISOString()}));
app.get('/api/assets',(req,res)=>res.json(assets));
app.get('/api/assets/:id',(req,res)=>{const a=assets.find(x=>x.id===req.params.id); if(!a)return res.status(404).json({error:'Asset not found'}); res.json(a);});
app.get('/api/analytics',(req,res)=>res.json({total:assets.length,critical:assets.filter(a=>a.risk==='High').length,medium:assets.filter(a=>a.risk==='Medium').length,avgHealth:Math.round(assets.reduce((s,a)=>s+a.health,0)/assets.length),uptime:97.4}));
app.post('/api/work-orders',(req,res)=>res.status(201).json({id:`WO-${Date.now()}`,status:'Open',createdAt:new Date().toISOString(),...req.body}));

const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`AssetOps API running on ${port}`));

// MongoDB is optional for the demo; set MONGODB_URI to enable connection.
if(process.env.MONGODB_URI){mongoose.connect(process.env.MONGODB_URI).then(()=>console.log('MongoDB connected')).catch(e=>console.error('MongoDB:',e.message));}
