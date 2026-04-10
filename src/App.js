/* eslint-disable */
import { useState, useEffect, useRef, useMemo } from "react";

const APP_NAME = "One More Rep_SOL";
const HASHTAG = "#onemorerepsol";
const VERSE = "100% is not enough. The next step is 101%.";
const EPLEY = [100,95,91,88,85,83,80,78,76,74,72,70];

const EXERCISES = {
  등:["랫풀다운 (케이블)","시티드 로우 (케이블)","바벨 로우","덤벨 로우","풀업","케이블 풀오버","티바 로우","데드리프트","하이 로우","팬들레이 로우","케이블 풀다운","스트레이트 암 풀다운","체스트 서포티드 로우","머신 로우"],
  가슴:["벤치프레스 (바벨)","인클라인 벤치프레스","덤벨 플라이","케이블 크로스오버","딥스","머신 체스트프레스","펙덱 플라이","머신 인클라인 체스트","머신 플랫 체스트","덤벨 풀오버","체스트 플라이","인클라인 덤벨 프레스"],
  어깨:["오버헤드프레스 (바벨)","덤벨 숄더프레스","사이드 레터럴 레이즈","프런트 레이즈","리어 델트 플라이","페이스풀 (케이블)","업라이트 로우","머신 숄더프레스","OHP","벤트오버 레터럴 레이즈","케이블 사이드 레이즈","리어 델트 머신"],
  하체:["스쿼트 (바벨)","레그프레스","레그 익스텐션","레그 컬","루마니안 데드리프트","힙 쓰러스트","런지","스미스 스쿼트","워킹 런지","스쿼트 (top)","스쿼트 (back-off)","데드리프트 (top)","데드리프트 (pause)","Grip Hold","불가리안 스플릿 스쿼트","스티프 레그 데드리프트","카프 레이즈","핵 스쿼트"],
  팔:["바벨 컬","해머 컬","케이블 컬","트라이셉스 푸시다운","스컬크러셔","오버헤드 트라이셉스","EZ바 컬","케이블 푸시다운","인클라인 덤벨 컬","컨센트레이션 컬","프리처 컬","리버스 컬","트라이셉스 킥백"],
  복근:["크런치","레그레이즈","케이블 크런치","플랭크","AB롤아웃","행잉 레그레이즈","사이드 플랭크","바이시클 크런치","V업","토 터치"],
  전신:["데드리프트","풀업","푸시업","딥스","바벨 로우","벤치프레스 (바벨)","오버헤드프레스 (바벨)","머신 인클라인 체스트","머신 플랫 체스트","머신 숄더프레스","랫풀다운 (케이블)","시티드 로우 (케이블)"],
};
const MUSCLE_TABS = Object.keys(EXERCISES);

const DEFAULT_PROGRAMS = {
  "Park_Da_Sol":{desc:"중급자 이상 주 5일 분할. 메인 리프트 top set + back-off set 구조.",days:[
    {name:"Day 1 — 가슴/등/어깨/팔",exercises:[{name:"덤벨 풀오버",sets:3,rir:0,targetReps:12,weight:""},{name:"벤치프레스 (top)",sets:1,rir:2,targetReps:3,weight:"1RM 85%"},{name:"벤치프레스 (back-off)",sets:1,rir:1,targetReps:10,weight:"1RM 70%"},{name:"팬들레이 로우",sets:3,rir:1,targetReps:8,weight:"1RM 75%"},{name:"머신 숄더프레스",sets:4,rir:0,targetReps:12,weight:""},{name:"체스트 플라이",sets:4,rir:0,targetReps:12,weight:""},{name:"사이드 레터럴 레이즈",sets:3,rir:0,targetReps:15,weight:""},{name:"EZ바 컬",sets:3,rir:0,targetReps:12,weight:""},{name:"케이블 푸시다운",sets:3,rir:0,targetReps:12,weight:""}]},
    {name:"Day 2 — 하체",exercises:[{name:"스쿼트 (top)",sets:1,rir:2,targetReps:3,weight:"1RM 85%"},{name:"스쿼트 (back-off)",sets:1,rir:1,targetReps:6,weight:"1RM 70%"},{name:"레그프레스",sets:6,rir:1,targetReps:10,weight:""},{name:"힙 쓰러스트",sets:4,rir:1,targetReps:10,weight:""},{name:"레그 익스텐션",sets:4,rir:0,targetReps:12,weight:""},{name:"레그 컬",sets:4,rir:0,targetReps:12,weight:""},{name:"Grip Hold",sets:2,rir:0,targetReps:30,weight:""}]},
    {name:"Day 3 — 전신",exercises:[{name:"풀업",sets:3,rir:1,targetReps:8,weight:""},{name:"OHP",sets:3,rir:1,targetReps:6,weight:"1RM 70%"},{name:"랫풀다운 (케이블)",sets:3,rir:1,targetReps:10,weight:""},{name:"하이 로우",sets:3,rir:1,targetReps:10,weight:""},{name:"머신 인클라인 체스트",sets:3,rir:1,targetReps:10,weight:""},{name:"사이드 레터럴 레이즈",sets:4,rir:0,targetReps:15,weight:""},{name:"푸시업",sets:1,rir:0,targetReps:20,weight:""},{name:"케이블 컬",sets:4,rir:0,targetReps:12,weight:""},{name:"케이블 푸시다운",sets:3,rir:0,targetReps:12,weight:""},{name:"벤트오버 레터럴 레이즈",sets:3,rir:0,targetReps:15,weight:""}]},
    {name:"Day 4 — 하체 데드",exercises:[{name:"데드리프트 (top)",sets:1,rir:2,targetReps:3,weight:"1RM 85%"},{name:"데드리프트 (pause)",sets:1,rir:1,targetReps:6,weight:"1RM 70%"},{name:"레그프레스",sets:4,rir:1,targetReps:10,weight:""},{name:"워킹 런지",sets:2,rir:0,targetReps:12,weight:""},{name:"레그 익스텐션",sets:4,rir:0,targetReps:12,weight:""},{name:"레그 컬",sets:4,rir:2,targetReps:12,weight:""}]},
    {name:"Day 5 — 머신 데이",exercises:[{name:"머신 인클라인 체스트",sets:3,rir:1,targetReps:12,weight:""},{name:"머신 플랫 체스트",sets:3,rir:1,targetReps:12,weight:""},{name:"머신 숄더프레스",sets:3,rir:1,targetReps:12,weight:""},{name:"랫풀다운 (케이블)",sets:3,rir:1,targetReps:10,weight:""},{name:"시티드 로우 (케이블)",sets:3,rir:1,targetReps:10,weight:""}]},
  ]},
  "Mad Cow (5x5)":{desc:"주 3일 A/B 교대. 5세트×5렙, 5렙 가능 무게(약 1RM 85%). 매 세션 2.5kg 증량.\n⚠️ 연속 3세트 실패 시 90% 리셋",days:[
    {name:"A일 — 스쿼트/벤치/로우",exercises:[{name:"스쿼트 (바벨)",sets:5,rir:1,targetReps:5,weight:"1RM 85%"},{name:"벤치프레스 (바벨)",sets:5,rir:1,targetReps:5,weight:"1RM 85%"},{name:"바벨 로우",sets:5,rir:1,targetReps:5,weight:"1RM 85%"}]},
    {name:"B일 — 스쿼트/OHP/데드",exercises:[{name:"스쿼트 (바벨)",sets:5,rir:1,targetReps:5,weight:"1RM 85%"},{name:"OHP",sets:5,rir:1,targetReps:5,weight:"1RM 85%"},{name:"데드리프트",sets:1,rir:1,targetReps:5,weight:"1RM 85%"}]},
  ]},
  "GZCLP":{desc:"T1(2x3+): 1RM 93% / T2(3x10): 1RM 75% / T3(3x15+): 1RM 65%\n⚠️ T1 실패→5회 전환→재실패 시 85% 리셋",days:[
    {name:"Day 1 — 스쿼트/OHP",exercises:[{name:"스쿼트 (바벨)",sets:2,rir:1,targetReps:3,weight:"1RM 93%"},{name:"OHP",sets:3,rir:1,targetReps:10,weight:"1RM 75%"},{name:"랫풀다운 (케이블)",sets:3,rir:1,targetReps:15,weight:"1RM 65%"}]},
    {name:"Day 2 — 벤치/데드",exercises:[{name:"벤치프레스 (바벨)",sets:2,rir:1,targetReps:3,weight:"1RM 93%"},{name:"데드리프트",sets:3,rir:1,targetReps:10,weight:"1RM 75%"},{name:"덤벨 로우",sets:3,rir:1,targetReps:15,weight:"1RM 65%"}]},
    {name:"Day 3 — 스쿼트/OHP(T2)",exercises:[{name:"스쿼트 (바벨)",sets:3,rir:1,targetReps:10,weight:"1RM 75%"},{name:"OHP",sets:2,rir:1,targetReps:3,weight:"1RM 93%"},{name:"레그 컬",sets:3,rir:1,targetReps:15,weight:"1RM 65%"}]},
    {name:"Day 4 — 데드/벤치(T2)",exercises:[{name:"데드리프트",sets:2,rir:1,targetReps:3,weight:"1RM 93%"},{name:"벤치프레스 (바벨)",sets:3,rir:1,targetReps:10,weight:"1RM 75%"},{name:"케이블 크로스오버",sets:3,rir:1,targetReps:15,weight:"1RM 65%"}]},
  ]},
  "PPL":{desc:"주 6일. Push→Pull→Legs 2회 반복. 마지막 세트 RIR 0",days:[
    {name:"Push — 가슴/어깨/삼두",exercises:[{name:"벤치프레스 (바벨)",sets:4,rir:1,targetReps:8,weight:""},{name:"인클라인 벤치프레스",sets:3,rir:1,targetReps:10,weight:""},{name:"OHP",sets:3,rir:1,targetReps:8,weight:""},{name:"사이드 레터럴 레이즈",sets:4,rir:0,targetReps:15,weight:""},{name:"케이블 푸시다운",sets:3,rir:0,targetReps:12,weight:""},{name:"오버헤드 트라이셉스",sets:3,rir:0,targetReps:12,weight:""}]},
    {name:"Pull — 등/이두",exercises:[{name:"데드리프트",sets:3,rir:1,targetReps:5,weight:""},{name:"바벨 로우",sets:4,rir:1,targetReps:8,weight:""},{name:"랫풀다운 (케이블)",sets:3,rir:1,targetReps:10,weight:""},{name:"시티드 로우 (케이블)",sets:3,rir:1,targetReps:10,weight:""},{name:"바벨 컬",sets:3,rir:0,targetReps:12,weight:""},{name:"해머 컬",sets:3,rir:0,targetReps:12,weight:""}]},
    {name:"Legs — 하체",exercises:[{name:"스쿼트 (바벨)",sets:4,rir:1,targetReps:8,weight:""},{name:"루마니안 데드리프트",sets:3,rir:1,targetReps:10,weight:""},{name:"레그프레스",sets:3,rir:1,targetReps:12,weight:""},{name:"레그 익스텐션",sets:4,rir:0,targetReps:15,weight:""},{name:"레그 컬",sets:4,rir:0,targetReps:15,weight:""},{name:"힙 쓰러스트",sets:3,rir:0,targetReps:12,weight:""}]},
  ]},
};

const DEFAULT_HERO_WODS = [
  {name:"Murph",desc:"For Time (20lb vest)\n1mi Run→100 Pull-ups→200 Push-ups→300 Air Squats→1mi Run",mode:"For Time",totalMin:60,calFactor:600,rx:{note:"20lb 조끼"},scale:{note:"조끼 없이/풀업→링 로우"},movements:[{name:"달리기(mile)",reps:1,weight:""},{name:"풀업",reps:100,weight:""},{name:"푸시업",reps:200,weight:""},{name:"에어 스쿼트",reps:300,weight:""},{name:"달리기(mile)",reps:1,weight:""}]},
  {name:"Cindy",desc:"AMRAP 20\n5 Pull-ups/10 Push-ups/15 Air Squats",mode:"AMRAP",totalMin:20,calFactor:250,rx:{note:"Kipping"},scale:{note:"밴드 풀업/무릎 푸시업"},movements:[{name:"풀업",reps:5,weight:""},{name:"푸시업",reps:10,weight:""},{name:"에어 스쿼트",reps:15,weight:""}]},
  {name:"Fran",desc:"For Time: 21-15-9 Thrusters/Pull-ups",mode:"For Time",totalMin:15,calFactor:150,rx:{m:"43kg",f:"29kg"},scale:{m:"30kg",f:"20kg"},movements:[{name:"쓰러스터",reps:21,weight:"43/29kg"},{name:"풀업",reps:21,weight:""},{name:"쓰러스터",reps:15,weight:"43/29kg"},{name:"풀업",reps:15,weight:""},{name:"쓰러스터",reps:9,weight:"43/29kg"},{name:"풀업",reps:9,weight:""}]},
  {name:"Helen",desc:"For Time: 3 Rounds\n400m/21 KB Swings/12 Pull-ups",mode:"3 Rounds For Time",totalMin:20,calFactor:200,rx:{m:"24kg",f:"16kg"},scale:{m:"16kg",f:"12kg"},movements:[{name:"달리기(400m)",reps:1,weight:""},{name:"케틀벨 스윙",reps:21,weight:"24/16kg"},{name:"풀업",reps:12,weight:""}]},
  {name:"Grace",desc:"For Time: 30 Clean & Jerks",mode:"For Time",totalMin:10,calFactor:120,rx:{m:"61kg",f:"43kg"},scale:{m:"43kg",f:"30kg"},movements:[{name:"클린앤저크",reps:30,weight:"61/43kg"}]},
  {name:"Annie",desc:"For Time: 50-40-30-20-10\nDouble Unders/Sit-ups",mode:"For Time",totalMin:15,calFactor:130,rx:{note:"더블 언더"},scale:{note:"싱글 언더×3"},movements:[{name:"더블 언더",reps:50,weight:""},{name:"싯업",reps:50,weight:""}]},
  {name:"Diane",desc:"For Time: 21-15-9 Deadlift/HSPU",mode:"For Time",totalMin:15,calFactor:160,rx:{m:"102kg",f:"70kg"},scale:{m:"70kg",f:"50kg"},movements:[{name:"데드리프트",reps:21,weight:"102/70kg"},{name:"핸드스탠드 푸시업",reps:21,weight:""},{name:"데드리프트",reps:15,weight:"102/70kg"},{name:"핸드스탠드 푸시업",reps:15,weight:""},{name:"데드리프트",reps:9,weight:"102/70kg"},{name:"핸드스탠드 푸시업",reps:9,weight:""}]},
  {name:"Chelsea",desc:"EMOM 30\n5 Pull-ups/10 Push-ups/15 Air Squats",mode:"EMOM",rounds:30,roundSec:60,calFactor:300,rx:{note:"모든 라운드"},scale:{note:"렙 수 줄이기"},movements:[{name:"풀업",reps:5,weight:""},{name:"푸시업",reps:10,weight:""},{name:"에어 스쿼트",reps:15,weight:""}]},
];

const CF_SCORE_FORMATS = {
  "AMRAP":{scoreType:"rounds+reps",hint:"완료 라운드+잔여 렙 (예: 15+8)",placeholder:"15+8"},
  "For Time":{scoreType:"time",hint:"완료 시간 mm:ss (예: 12:34)",placeholder:"12:34"},
  "EMOM":{scoreType:"rounds",hint:"완료 라운드 수 (예: 28/30)",placeholder:"28/30"},
  "Tabata":{scoreType:"reps",hint:"최저 렙 수 (예: 8)",placeholder:"8"},
  "Max Load":{scoreType:"weight",hint:"최고 무게 kg (예: 120)",placeholder:"120"},
  "Max Reps":{scoreType:"reps",hint:"최고 렙 수 (예: 50)",placeholder:"50"},
  "3 Rounds For Time":{scoreType:"time",hint:"완료 시간 mm:ss",placeholder:"18:45"},
  "5 Rounds For Time":{scoreType:"time",hint:"완료 시간 mm:ss",placeholder:"25:10"},
  "Death By":{scoreType:"rounds",hint:"완료 마지막 라운드 (예: R12+3)",placeholder:"R12+3"},
  "Custom":{scoreType:"custom",hint:"자유 기록",placeholder:"기록 입력"},
};

const CF_EXERCISES=["버피","더블 언더","케틀벨 스윙","월볼","토투바","핸드스탠드 푸시업","로잉(m)","클린앤저크","스내치","쓰러스터","데드리프트","파워 클린","런지","풀업","푸시업","싯업","에어 스쿼트","프런트 스쿼트","박스 점프","달리기(400m)","달리기(mile)","로프 클라임","머슬업","피스톨 스쿼트","GHD 싯업"];

const fmtT = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const nowStr = () => { const d=new Date(); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`; };
const mkKey = (y,m,d) => `${y}.${String(m+1).padStart(2,"0")}.${String(d).padStart(2,"0")}`;
const dataSize = obj => (new Blob([JSON.stringify(obj)]).size/1024/1024).toFixed(2);
const ls = (k,def) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):def; } catch { return def; } };
const lsSave = (k,v) => {
  try {
    localStorage.setItem(k,JSON.stringify(v));
  } catch(e) {
    // 용량 초과 시 profile의 photo 제거 후 재시도
    try {
      if(k==="profile" && v?.photo) {
        localStorage.setItem(k,JSON.stringify({...v,photo:null}));
      }
    } catch {}
  }
};

const C={bg:"#0f1117",card:"#1a1d26",card2:"#22263a",border:"#2a2e45",accent:"#3a7bd5",accentL:"#5b9af8",green:"#22c55e",red:"#ef4444",amber:"#f59e0b",gold:"#fbbf24",text:"#e8eaf0",muted:"#8892a4",mutedL:"#aab4c4"};
const PBtn=({children,onClick,style={}})=><button onClick={onClick} style={{background:C.accent,color:"#fff",border:"none",borderRadius:9,padding:"12px 16px",cursor:"pointer",fontWeight:600,fontSize:14,width:"100%",...style}}>{children}</button>;
const GCard=({children,style={}})=><div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,...style}}>{children}</div>;
const Lbl=({children,style={}})=><div style={{fontSize:11,color:C.muted,marginBottom:5,...style}}>{children}</div>;
const Inp=({style={},...p})=><input {...p} style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:7,padding:"8px 10px",fontSize:13,color:C.text,width:"100%",...style}}/>;
const Sel=({children,style={},...p})=><select {...p} style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:7,padding:"7px 8px",fontSize:12,color:C.text,...style}}>{children}</select>;
const Chip=({children,active,onClick,style={}})=><button onClick={onClick} style={{padding:"5px 12px",border:`0.5px solid ${active?C.accentL:C.border}`,borderRadius:16,fontSize:12,cursor:"pointer",background:active?"#1e3a6e":"transparent",color:active?C.accentL:C.muted,whiteSpace:"nowrap",...style}}>{children}</button>;
const NumInp=({value,onChange,placeholder="",disabled=false,style={}})=><input type="text" inputMode="decimal" placeholder={placeholder} value={value} disabled={disabled} onChange={e=>onChange(e.target.value.replace(/[^0-9.]/g,""))} style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:7,padding:"6px 4px",fontSize:13,color:C.text,width:"100%",textAlign:"center",...style}}/>;

// 확인 모달
function ConfirmModal({message, onConfirm, onCancel}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400}} onClick={onCancel}>
      <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:16,padding:24,width:300,maxWidth:"90vw"}} onClick={e=>e.stopPropagation()}>
        <p style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:20,textAlign:"center",lineHeight:1.6}}>{message}</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:"10px",border:`0.5px solid ${C.border}`,borderRadius:8,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>취소</button>
          <button onClick={onConfirm} style={{flex:1,padding:"10px",border:"none",borderRadius:8,background:C.accent,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600}}>확인</button>
        </div>
      </div>
    </div>
  );
}

function Spark({data,color=C.accentL,labels}) {
  if(!data||data.length<2) return <span style={{fontSize:11,color:C.muted}}>기록 2회 이상 필요</span>;
  const W=300,H=48,mn=Math.min(...data),mx=Math.max(...data),range=mx-mn||1;
  const pts=data.map((v,i)=>`${i*(W/(data.length-1))},${H-(v-mn)/range*(H-6)+3}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H+20}`} style={{display:"block",overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2}/>
      {data.map((v,i)=>(
        <g key={i}>
          <circle cx={i*(W/(data.length-1))} cy={H-(v-mn)/range*(H-6)+3} r={3} fill={color}/>
          {labels&&<text x={Math.max(12,Math.min(W-12,i*(W/(data.length-1))))} y={H+16} textAnchor="middle" fontSize={8} fill={C.muted}>{labels[i]}</text>}
        </g>
      ))}
    </svg>
  );
}

function ExMapChart({exMap}) {
  const [chartType,setChartType]=useState("vol");
  const [selEx,setSelEx]=useState(Object.keys(exMap)[0]||"");
  const names=Object.keys(exMap);
  const pts=exMap[selEx]||[];
  const data=pts.map(p=>chartType==="vol"?p.vol:p.maxW);
  const last=data[data.length-1]||0;
  const prev=data[data.length-2]||0;
  const trend=data.length>1?(last>=prev?C.green:C.red):C.muted;
  const trendIcon=data.length>1?(last>=prev?"▲":"▼"):"";
  return (
    <div>
      {/* 볼륨/맥스무게 탭 */}
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {[["vol","📦 메인 볼륨"],["maxW","🏆 맥스 무게"]].map(([t,l])=>(
          <button key={t} onClick={()=>setChartType(t)} style={{flex:1,padding:"7px",border:`0.5px solid ${chartType===t?C.accentL:C.border}`,borderRadius:8,background:chartType===t?"#1e3a6e":"transparent",color:chartType===t?C.accentL:C.muted,cursor:"pointer",fontSize:12,fontWeight:chartType===t?700:400}}>{l}</button>
        ))}
      </div>
      {/* 종목 선택 가로 스크롤 */}
      <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:8,marginBottom:10}}>
        {names.map(n=>(
          <button key={n} onClick={()=>setSelEx(n)} style={{flexShrink:0,padding:"4px 10px",border:`0.5px solid ${selEx===n?C.accentL:C.border}`,borderRadius:12,background:selEx===n?"#1e3a6e":"transparent",color:selEx===n?C.accentL:C.muted,cursor:"pointer",fontSize:11,whiteSpace:"nowrap"}}>{n}</button>
        ))}
      </div>
      {/* 차트 */}
      {pts.length>=2 ? (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:13,fontWeight:600,color:C.text}}>{selEx}</span>
            <span style={{fontSize:12,fontWeight:700,color:trend}}>{trendIcon} {last}{chartType==="vol"?"kg":"kg"}</span>
          </div>
          <Spark data={data} labels={pts.map(p=>p.date)} color={chartType==="vol"?C.accentL:C.amber}/>
          <p style={{fontSize:10,color:C.muted,marginTop:6}}>{chartType==="vol"?"메인 세트 총 볼륨 (무게×렙 합산)":"메인 세트 중 최고 무게"} · {pts.length}회 기록</p>
        </div>
      ) : (
        <p style={{fontSize:12,color:C.muted,textAlign:"center",padding:"16px 0"}}>{selEx} — 기록 2회 이상 필요</p>
      )}
    </div>
  );
}

function Countdown({onDone}) {
  const [n,setN]=useState(10);
  const lastTapRef=useRef(0);
  useEffect(()=>{
    if(n===0){onDone();return;}
    const t=setTimeout(()=>setN(p=>p-1),1000);
    return()=>clearTimeout(t);
  },[n,onDone]);
  const handleTap=()=>{
    const now=Date.now();
    if(now-lastTapRef.current<400){onDone();return;}
    lastTapRef.current=now;
  };
  return (
    <div onClick={handleTap} style={{position:"fixed",inset:0,background:"rgba(10,12,18,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:500,cursor:"pointer"}}>
      <div style={{fontSize:120,fontWeight:900,color:n>3?C.accentL:C.red,lineHeight:1,fontVariantNumeric:"tabular-nums",transition:"color .3s"}}>{n===0?"START!":n}</div>
      <div style={{fontSize:16,color:C.muted,marginTop:20,fontStyle:"italic",textAlign:"center",padding:"0 24px"}}>{VERSE}</div>
      <div style={{fontSize:12,color:C.muted,marginTop:16,opacity:0.6}}>더블 클릭으로 건너뛰기</div>
    </div>
  );
}

function IntensityPicker({onDone}) {
  const [val,setVal]=useState(null);
  const emoji=["😴","😌","🙂","😊","💪","😤","🔥","💥","😵","🤯"];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,12,18,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:500,padding:24}}>
      <p style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:6}}>오늘 운동 강도는?</p>
      <p style={{fontSize:13,color:C.muted,marginBottom:24}}>1 = 가벼운 워밍업 · 10 = 죽을 것 같음</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:28,width:"100%",maxWidth:320}}>
        {[1,2,3,4,5,6,7,8,9,10].map(i=>(
          <button key={i} onClick={()=>setVal(i)} style={{padding:"14px 0",borderRadius:10,border:`2px solid ${val===i?C.accentL:C.border}`,background:val===i?"#1e3a6e":C.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{fontSize:22}}>{emoji[i-1]}</span>
            <span style={{fontSize:14,fontWeight:700,color:val===i?C.accentL:C.text}}>{i}</span>
          </button>
        ))}
      </div>
      <div style={{width:"100%",maxWidth:320}}>
        <PBtn onClick={()=>{if(val)onDone(val);}} style={{opacity:val?1:0.4}}>확인 →</PBtn>
      </div>
    </div>
  );
}

function CalendarView({workoutLog,cfLog,onSelectDay}) {
  const now=new Date();
  const [ym,setYm]=useState({y:now.getFullYear(),m:now.getMonth()});
  const fDay=new Date(ym.y,ym.m,1).getDay();
  const dim=new Date(ym.y,ym.m+1,0).getDate();
  const cells=Array(fDay).fill(null).concat(Array.from({length:dim},(_,i)=>i+1));
  while(cells.length%7!==0) cells.push(null);
  const mn=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const mStr=`${ym.y}.${String(ym.m+1).padStart(2,"0")}`;
  const mW=Object.keys(workoutLog).filter(k=>k.startsWith(mStr)&&workoutLog[k]?.length>0).length;
  const mC=Object.keys(cfLog).filter(k=>k.startsWith(mStr)&&cfLog[k]?.length>0).length;
  const yW=Object.keys(workoutLog).filter(k=>k.startsWith(`${ym.y}`)&&workoutLog[k]?.length>0).length;
  const yC=Object.keys(cfLog).filter(k=>k.startsWith(`${ym.y}`)&&cfLog[k]?.length>0).length;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>setYm(p=>p.m===0?{y:p.y-1,m:11}:{...p,m:p.m-1})} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted}}>‹</button>
        <span style={{fontWeight:600,fontSize:15,color:C.text}}>{ym.y}년 {mn[ym.m]}</span>
        <button onClick={()=>setYm(p=>p.m===11?{y:p.y+1,m:0}:{...p,m:p.m+1})} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:10}}>
        {[["이달 운동",mW,C.green],["이달 CF",mC,C.accentL],[`${ym.y} 운동`,yW,C.green],[`${ym.y} CF`,yC,C.accentL]].map(([l,v,col])=>(
          <div key={l} style={{background:col+"18",borderRadius:8,padding:"6px 4px",textAlign:"center"}}>
            <div style={{fontSize:9,color:col,marginBottom:1}}>{l}</div>
            <div style={{fontSize:18,fontWeight:700,color:col}}>{v}일</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:8,fontSize:10,color:C.muted}}>
        {[["#22c55e","운동"],["#5b9af8","CrossFit"],["#fbbf24","둘 다"]].map(([bg,lb])=>(
          <span key={lb} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:bg,borderRadius:2,display:"inline-block"}}/>{lb}</span>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:3}}>
        {["일","월","화","수","목","금","토"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:C.muted,padding:"3px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((d,i)=>{
          const key=d?mkKey(ym.y,ym.m,d):null;
          const hasW=!!(key&&workoutLog[key]?.length>0);
          const hasC=!!(key&&cfLog[key]?.length>0);
          const both=hasW&&hasC;
          const isToday=!!(d&&now.getFullYear()===ym.y&&now.getMonth()===ym.m&&now.getDate()===d);
          const bg=isToday?"#3a7bd5":both?C.gold:hasW?C.green:hasC?C.accentL:"transparent";
          const col=isToday?"#fff":(both||hasW||hasC)?"#000":d?C.text:"transparent";
          return <div key={i} onClick={()=>{if(d&&key)onSelectDay(key);}} style={{textAlign:"center",padding:"5px 2px",borderRadius:7,fontSize:13,cursor:d?"pointer":"default",background:bg,color:col,fontWeight:(isToday||hasW||hasC)?700:400,minHeight:30,display:"flex",alignItems:"center",justifyContent:"center"}}>{d||""}</div>;
        })}
      </div>
    </div>
  );
}

function ProfileModal({profile,setProfile,history,setHistory,workoutLog,cfLog,onClose}) {
  const [ptab,setPtab]=useState("기본");
  const [form,setForm]=useState({...profile});
  const [dirty,setDirty]=useState(false);
  const fileRef=useRef();
  const save=()=>{
    const np={...form};
    lsSave("profile",np);
    // 저장 확인 - 실제로 저장됐는지 검증
    const check=ls("profile",null);
    if(check) {
      setProfile(np);
      const nh=[...history,{date:nowStr(),weight:parseFloat(form.weight)||0,squat:parseFloat(form.squat)||0,bench:parseFloat(form.bench)||0,dead:parseFloat(form.dead)||0}];
      lsSave("history",nh); setHistory(nh); setDirty(false); onClose();
    } else {
      alert("저장에 실패했습니다. 저장공간을 확인해주세요.");
    }
  };
  const handleClose=()=>{
    if(dirty){ if(window.confirm("변경사항을 저장하시겠습니까?")) save(); else onClose(); }
    else onClose();
  };
  const update=(k,v)=>{ setForm(p=>({...p,[k]:v})); setDirty(true); };
  const handlePhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setForm(p=>({...p,photo:ev.target.result}));setDirty(true);};r.readAsDataURL(f);};
  const total=(parseFloat(form.squat)||0)+(parseFloat(form.bench)||0)+(parseFloat(form.dead)||0);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={handleClose}>
      <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:16,padding:20,width:360,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:16,fontWeight:600,color:C.text}}>개인 설정</span>
          <button onClick={handleClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted}}>✕</button>
        </div>
        <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Workout: {dataSize(workoutLog)} MB · CrossFit: {dataSize(cfLog)} MB</div>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {["기본","히스토리"].map(t=><button key={t} onClick={()=>setPtab(t)} style={{flex:1,padding:7,border:`0.5px solid ${C.border}`,borderRadius:8,background:ptab===t?C.accent:"transparent",color:ptab===t?"#fff":C.muted,cursor:"pointer",fontSize:13}}>{t}</button>)}
        </div>
        {ptab==="기본" && (
          <>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div onClick={()=>fileRef.current.click()} style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 8px",cursor:"pointer",overflow:"hidden",background:C.card2,display:"flex",alignItems:"center",justifyContent:"center",border:`2px dashed ${C.border}`}}>
                {form.photo?<img alt="profile" src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:28}}>👤</span>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
              <button onClick={()=>fileRef.current.click()} style={{fontSize:12,color:C.accentL,background:"none",border:"none",cursor:"pointer"}}>사진 변경</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[["nick","닉네임","text"],["weight","체중 (kg)","number"]].map(([k,l,t])=>(
                <div key={k}><Lbl>{l}</Lbl><Inp type={t} value={form[k]||""} onChange={e=>update(k,e.target.value)} style={{textAlign:"center"}}/></div>
              ))}
            </div>
            <Lbl>3대 운동 1RM (kg)</Lbl>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[["squat","스쿼트"],["bench","벤치"],["dead","데드"]].map(([k,l])=>(
                <div key={k}><Lbl>{l}</Lbl><NumInp value={form[k]||""} onChange={v=>update(k,v)} style={{padding:8,width:"100%"}}/></div>
              ))}
            </div>
            <Lbl>기본 세트 구성</Lbl>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[["warmupSets","웜업"],["mainSets","메인"],["cooldownSets","쿨다운"]].map(([k,l])=>(
                <div key={k}><Lbl>{l}</Lbl><Inp type="number" min={0} max={8} value={form[k]??0} onChange={e=>update(k,parseInt(e.target.value)||0)} style={{textAlign:"center",padding:6}}/></div>
              ))}
            </div>
            <Lbl>목표 (하단 배너)</Lbl>
            <Inp value={form.goal||""} onChange={e=>update("goal",e.target.value)} placeholder="예: 데드리프트 200kg" style={{marginBottom:12}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:C.card2,borderRadius:8,marginBottom:14}}>
              <div>
                <div style={{fontSize:13,color:C.text,fontWeight:500}}>화면 자동 잠금 방지</div>
                <div style={{fontSize:11,color:C.muted}}>ON 시 운동 중 화면 유지 (iOS 16.4+ PWA)</div>
              </div>
              <button onClick={()=>update("keepAwake",!form.keepAwake)} style={{width:48,height:26,borderRadius:13,background:form.keepAwake?C.accent:C.border,border:"none",cursor:"pointer",position:"relative",transition:"background .2s"}}>
                <span style={{position:"absolute",top:3,left:form.keepAwake?26:4,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
              </button>
            </div>
            <div style={{background:"#1e3a6e",borderRadius:10,padding:12,textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:11,color:C.accentL,marginBottom:4}}>3대 합계 (설정값)</div>
              <div style={{fontSize:26,fontWeight:700,color:"#fff"}}>{total} kg</div>
            </div>
            <PBtn onClick={save} style={{background:dirty?C.green:C.accent}}>{dirty?"💾 저장 (변경사항 있음)":"저장"}</PBtn>
          </>
        )}
        {ptab==="히스토리" && (
          history.length===0
            ? <p style={{color:C.muted,textAlign:"center",padding:"30px 0",fontSize:13}}>기록 없음</p>
            : <>
              {[["체중","weight",C.accentL],["스쿼트","squat",C.red],["벤치","bench",C.green],["데드","dead",C.amber]].map(([label,key,color])=>(
                <div key={key} style={{marginBottom:14}}>
                  <p style={{fontSize:13,fontWeight:500,marginBottom:6,color:C.text}}>{label}</p>
                  <Spark data={history.map(h=>h[key])} color={color} labels={history.map(h=>h.date?.slice(5))}/>
                </div>
              ))}
              <Lbl>기록 이력 (탭→삭제)</Lbl>
              {history.map((h,i)=>(
                <div key={i} onClick={()=>{const nh=history.filter((_,j)=>j!==i);lsSave("history",nh);setHistory(nh);}}
                  style={{fontSize:12,padding:"6px 8px",marginBottom:4,borderRadius:6,border:`0.5px solid ${C.border}`,display:"flex",justifyContent:"space-between",color:C.text,cursor:"pointer",background:C.card2}}>
                  <span style={{color:C.muted}}>{h.date}</span>
                  <span>{h.weight}kg | S{h.squat}/B{h.bench}/D{h.dead} <span style={{color:C.red}}>✕</span></span>
                </div>
              ))}
            </>
        )}
      </div>
    </div>
  );
}

function OneRMScreen({profile}) {
  return (
    <div>
      <p style={{fontSize:15,fontWeight:600,marginBottom:4,color:C.text}}>1RM 추정 무게표</p>
      <p style={{fontSize:11,color:C.muted,marginBottom:14}}>Epley 공식 기반.</p>
      {[["스쿼트",profile.squat,C.red],["벤치프레스",profile.bench,C.accentL],["데드리프트",profile.dead,C.amber]].map(([lift,rm,color])=>(
        <GCard key={lift}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontWeight:600,fontSize:14,color:C.text}}>{lift}</span>
            {rm?<span style={{fontSize:13,color,background:color+"22",padding:"3px 10px",borderRadius:12}}>1RM {rm}kg</span>:<span style={{fontSize:12,color:C.muted}}>미설정</span>}
          </div>
          {!rm?<p style={{fontSize:12,color:C.muted,textAlign:"center",padding:"10px 0"}}>개인 설정에서 1RM 입력</p>:(
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:C.card2}}>{["렙","% 1RM","추정 무게","세트 볼륨"].map(h=><th key={h} style={{padding:"5px 6px",textAlign:h==="렙"?"left":"right",borderBottom:`1px solid ${C.border}`,fontWeight:500,color:C.mutedL}}>{h}</th>)}</tr></thead>
              <tbody>{EPLEY.map((pct,i)=>{const w=Math.round(rm*pct/100*4)/4;return(
                <tr key={i} style={{background:i%2?C.card2:"transparent"}}>
                  <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`,color:C.text}}>{i+1}회</td>
                  <td style={{padding:"4px 6px",textAlign:"right",borderBottom:`1px solid ${C.border}`,color,fontWeight:500}}>{pct}%</td>
                  <td style={{padding:"4px 6px",textAlign:"right",borderBottom:`1px solid ${C.border}`,color:C.text,fontWeight:500}}>{w}kg</td>
                  <td style={{padding:"4px 6px",textAlign:"right",borderBottom:`1px solid ${C.border}`,color:C.muted}}>{Math.round(w*(i+1))}kg</td>
                </tr>
              );})}</tbody>
            </table>
          )}
        </GCard>
      ))}
    </div>
  );
}

// 프로그램 편집 모달
function ProgramEditModal({programs, heroWods, onSavePrograms, onSaveHeroWods, onClose}) {
  const [editTab, setEditTab] = useState("workout");
  const [editPrograms, setEditPrograms] = useState(JSON.parse(JSON.stringify(programs)));
  const [editHeroWods, setEditHeroWods] = useState(JSON.parse(JSON.stringify(heroWods)));
  const [selProg, setSelProg] = useState(Object.keys(programs)[0]);
  const [selDay, setSelDay] = useState(0);
  const [selHero, setSelHero] = useState(0);
  const [confirm, setConfirm] = useState(false);

  const handleSave = () => setConfirm(true);
  const doSave = () => {
    onSavePrograms(editPrograms);
    onSaveHeroWods(editHeroWods);
    setConfirm(false);
    onClose();
  };

  const updateExercise = (progName, dayIdx, exIdx, field, value) => {
    setEditPrograms(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[progName].days[dayIdx].exercises[exIdx][field] = value;
      return next;
    });
  };

  const updateHeroMovement = (heroIdx, movIdx, field, value) => {
    setEditHeroWods(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[heroIdx].movements[movIdx][field] = field === "reps" ? parseInt(value)||0 : value;
      return next;
    });
  };

  const updateHeroField = (heroIdx, field, value) => {
    setEditHeroWods(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[heroIdx][field] = value;
      return next;
    });
  };

  const prog = editPrograms[selProg];
  const hero = editHeroWods[selHero];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:300,overflowY:"auto",paddingTop:20}}>
      <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:16,padding:20,width:400,maxWidth:"95vw",marginBottom:20}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:16,fontWeight:600,color:C.text}}>프로그램 편집</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted}}>✕</button>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {[["workout","운동 프로그램"],["cf","Hero WODs"]].map(([t,l])=>(
            <button key={t} onClick={()=>setEditTab(t)} style={{flex:1,padding:8,border:`0.5px solid ${C.border}`,borderRadius:8,background:editTab===t?C.accent:"transparent",color:editTab===t?"#fff":C.muted,cursor:"pointer",fontSize:12,fontWeight:editTab===t?600:400}}>{l}</button>
          ))}
        </div>

        {editTab==="workout" && prog && (
          <>
            <Lbl>프로그램 선택</Lbl>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {Object.keys(editPrograms).map(pn=>(
                <Chip key={pn} active={selProg===pn} onClick={()=>{setSelProg(pn);setSelDay(0);}}>{pn}</Chip>
              ))}
            </div>
            <Lbl>Day 선택</Lbl>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {prog.days.map((d,i)=>(
                <Chip key={i} active={selDay===i} onClick={()=>setSelDay(i)}>{d.name.split("—")[0].trim()}</Chip>
              ))}
            </div>
            <div style={{fontSize:13,fontWeight:600,color:C.accentL,marginBottom:8}}>{prog.days[selDay]?.name}</div>
            {prog.days[selDay]?.exercises.map((ex,ei)=>(
              <div key={ei} style={{background:C.card2,borderRadius:8,padding:10,marginBottom:8,border:`0.5px solid ${C.border}`}}>
                <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:6}}>{ex.name}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:11,color:C.muted}}>세트</span>
                    <Inp type="number" min={1} max={20} value={ex.sets} onChange={e=>updateExercise(selProg,selDay,ei,"sets",parseInt(e.target.value)||1)} style={{width:46,textAlign:"center",padding:5}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:11,color:C.muted}}>목표렙</span>
                    <Inp type="number" min={1} max={50} value={ex.targetReps||""} onChange={e=>updateExercise(selProg,selDay,ei,"targetReps",parseInt(e.target.value)||"")} placeholder="-" style={{width:46,textAlign:"center",padding:5}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:11,color:C.muted}}>RIR</span>
                    <Sel value={ex.rir??2} onChange={e=>updateExercise(selProg,selDay,ei,"rir",parseInt(e.target.value))} style={{padding:5}}>
                      {[0,1,2,3,4,5].map(r=><option key={r} value={r}>{r}</option>)}
                    </Sel>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:11,color:C.muted}}>무게노트</span>
                    <Inp value={ex.weight||""} onChange={e=>updateExercise(selProg,selDay,ei,"weight",e.target.value)} placeholder="예: 1RM 85%" style={{width:90,padding:5}}/>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {editTab==="cf" && hero && (
          <>
            <Lbl>Hero WOD 선택</Lbl>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {editHeroWods.map((h,i)=>(
                <Chip key={i} active={selHero===i} onClick={()=>setSelHero(i)}>{h.name}</Chip>
              ))}
            </div>
            <div style={{marginBottom:10}}>
              <Lbl>설명</Lbl>
              <textarea value={hero.desc} onChange={e=>updateHeroField(selHero,"desc",e.target.value)}
                style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:7,padding:"8px 10px",fontSize:12,color:C.text,width:"100%",minHeight:60,resize:"vertical"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div><Lbl>포맷</Lbl>
                <Sel value={hero.mode} onChange={e=>updateHeroField(selHero,"mode",e.target.value)} style={{width:"100%"}}>
                  {Object.keys(CF_SCORE_FORMATS).map(f=><option key={f} value={f}>{f}</option>)}
                </Sel>
              </div>
              <div><Lbl>시간(분)</Lbl><Inp type="number" value={hero.totalMin||10} onChange={e=>updateHeroField(selHero,"totalMin",parseInt(e.target.value)||10)} style={{textAlign:"center"}}/></div>
            </div>
            <Lbl>무브먼트</Lbl>
            {hero.movements.map((m,mi)=>(
              <div key={mi} style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
                <Sel value={m.name} onChange={e=>updateHeroMovement(selHero,mi,"name",e.target.value)} style={{flex:2}}>
                  {CF_EXERCISES.map(ex=><option key={ex} value={ex}>{ex}</option>)}
                </Sel>
                <NumInp value={m.reps} onChange={v=>updateHeroMovement(selHero,mi,"reps",v)} placeholder="회" style={{width:46}}/>
                <Inp value={m.weight||""} onChange={e=>updateHeroMovement(selHero,mi,"weight",e.target.value)} placeholder="무게" style={{width:60,padding:"6px 4px"}}/>
              </div>
            ))}
          </>
        )}

        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button onClick={onClose} style={{flex:1,padding:10,border:`0.5px solid ${C.border}`,borderRadius:8,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>취소</button>
          <button onClick={handleSave} style={{flex:2,padding:10,background:C.accent,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>저장</button>
        </div>
      </div>
      {confirm && <ConfirmModal message="변경 사항을 저장하시겠습니까?" onConfirm={doSave} onCancel={()=>setConfirm(false)}/>}
    </div>
  );
}

function WorkoutScreen({profile,workoutLog,setWorkoutLog,cfLog,savedRoutines,setSavedRoutines,programs,heroWods,
  liveState,setLiveState,moveToTrash}) {
  const [phase,setPhase]=useState(liveState?.phase||"calendar");
  const [selDay,setSelDay]=useState(null);
  const [planTab,setPlanTab]=useState("programs");
  const [selProgram,setSelProgram]=useState(null);
  const [loadedProgramRef,setLoadedProgramRef]=useState(null); // {progName, dayIdx} 추적용
  const [selMuscle,setSelMuscle]=useState("등");
  const [selExs,setSelExs]=useState(liveState?.selExs||[]);
  const [customExs,setCustomExs]=useState(()=>ls("customExs",{}));
  const [customInput,setCustomInput]=useState("");
  const [editEx,setEditEx]=useState(null);
  const [editName,setEditName]=useState("");
  const [routineName,setRoutineName]=useState(liveState?.routineName||"");
  const [workoutData,setWorkoutData]=useState(liveState?.workoutData||[]);
  const [curExIdx,setCurExIdx]=useState(liveState?.curExIdx||0);
  const [startTime,setStartTime]=useState(liveState?.startTime||null);
  const [totalSec,setTotalSec]=useState(liveState?.totalSec||0);
  const [isPaused,setIsPaused]=useState(liveState?.isPaused||false);
  const [pausedAt,setPausedAt]=useState(liveState?.pausedAt||null);
  const [pausedTotal,setPausedTotal]=useState(liveState?.pausedTotal||0);
  const [summary,setSummary]=useState(liveState?.summary||null);
  const [showSave,setShowSave]=useState(false);
  const [newName,setNewName]=useState("");
  const [activeDate,setActiveDate]=useState(liveState?.activeDate||nowStr());
  const [showCountdown,setShowCountdown]=useState(false);
  const [showIntensity,setShowIntensity]=useState(false);
  const [pendingFinish,setPendingFinish]=useState(null);
  const [editingLogDay,setEditingLogDay]=useState(null);
  const [editingLogIdx,setEditingLogIdx]=useState(null);
  const [confirmEdit,setConfirmEdit]=useState(false);
  const [editWorkoutData,setEditWorkoutData]=useState(null);
  const [curEditEx,setCurEditEx]=useState(0);
  const timerRef=useRef(null);
  const wakeLockRef=useRef(null);
  const dragIdx=useRef(null);
  const dragOverIdx=useRef(null);
  const longPressTimer=useRef(null);
  const [draggingIdx,setDraggingIdx]=useState(null);
  const [dragOverVisual,setDragOverVisual]=useState(null);

  // 운동 진행 상태를 App으로 저장 (탭 이동해도 유지)
  useEffect(()=>{
    if(phase==="live"){
      setLiveState({phase,selExs,routineName,workoutData,curExIdx,startTime,totalSec,isPaused,pausedAt,pausedTotal,activeDate,summary});
    } else if(phase==="summary"){
      setLiveState(prev=>prev?{...prev,phase,summary}:null);
    } else if(phase==="calendar"||phase==="plan"){
      setLiveState(null);
    }
  // eslint-disable-next-line
  },[phase,workoutData,curExIdx,isPaused,totalSec]);

  // Wake Lock: keepAwake ON이면 운동 화면에서 화면 잠금 방지
  useEffect(()=>{
    const acquireWakeLock = async () => {
      if(profile.keepAwake && phase==="live"){
        try {
          if("wakeLock" in navigator){
            wakeLockRef.current = await navigator.wakeLock.request("screen");
          } else {
            // Wake Lock 미지원 환경 - 노화면 방지 대체: 영상 재생 트릭
            const video = document.createElement("video");
            video.setAttribute("loop","");
            video.setAttribute("playsinline","");
            video.setAttribute("muted","");
            video.setAttribute("src","data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0");
            video.style.display="none";
            document.body.appendChild(video);
            video.play().catch(()=>{});
            wakeLockRef.current = {release:()=>{video.pause();video.remove();}};
          }
        } catch(e){}
      }
    };
    acquireWakeLock();
    const handleVisibility = async () => {
      if(document.visibilityState==="visible" && profile.keepAwake && phase==="live"){
        if(wakeLockRef.current?.released !== false){
          try {
            if("wakeLock" in navigator){
              wakeLockRef.current = await navigator.wakeLock.request("screen");
            }
          } catch(e){}
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if(wakeLockRef.current){ wakeLockRef.current.release().catch(()=>{}); wakeLockRef.current=null; }
    };
  },[phase, profile.keepAwake]);

  useEffect(()=>{
    if(phase==="live"&&startTime&&!isPaused){
      timerRef.current=setInterval(()=>setTotalSec(Math.floor((Date.now()-startTime-pausedTotal)/1000)),1000);
    }
    return()=>clearInterval(timerRef.current);
  },[phase,startTime,isPaused,pausedTotal]);

  const saveCustomExs=updated=>{setCustomExs(updated);lsSave("customExs",updated);};
  const addCustomEx=()=>{
    if(!customInput.trim())return;
    const name=customInput.trim();
    const updated={...customExs,[selMuscle]:[...(customExs[selMuscle]||[]),name]};
    saveCustomExs(updated);
    setSelExs(p=>[...p,{name,sets:parseInt(profile.mainSets)||3,rir:2,targetReps:""}]);
    setCustomInput("");
  };
  const deleteCustomEx=(muscle,name)=>{
    saveCustomExs({...customExs,[muscle]:(customExs[muscle]||[]).filter(e=>e!==name)});
    setSelExs(p=>p.filter(e=>e.name!==name));
    setEditEx(null);
  };
  const renameCustomEx=(muscle,old,nv)=>{
    saveCustomExs({...customExs,[muscle]:(customExs[muscle]||[]).map(e=>e===old?nv:e)});
    setSelExs(p=>p.map(e=>e.name===old?{...e,name:nv}:e));
    setEditEx(null);
  };
  const toggleEx=name=>setSelExs(p=>p.find(e=>e.name===name)?p.filter(e=>e.name!==name):[...p,{name,sets:parseInt(profile.mainSets)||3,rir:2,targetReps:""}]);
  const updateSelEx=(i,f,v)=>setSelExs(p=>{const a=[...p];a[i]={...a[i],[f]:v};return a;});
  const [confirmReset,setConfirmReset]=useState(false);
  const loadRoutine=r=>{setSelExs(r.exercises.map(e=>({...e})));setRoutineName(r.name);setLoadedProgramRef(null);};
  // 같은 이름 존재하면 덮어쓰기 (savedRoutines + programs 둘 다)
  const saveRoutine=()=>{
    const name=(newName||routineName).trim();
    if(!name)return;
    // 1) savedRoutines 업데이트
    const exists=savedRoutines.findIndex(r=>r.name===name);
    let nr;
    if(exists>=0){nr=[...savedRoutines];nr[exists]={name,exercises:selExs};}
    else{nr=[...savedRoutines,{name,exercises:selExs}];}
    setSavedRoutines(nr);lsSave("savedRoutines",nr);
    // 2) programs에서 같은 이름의 day도 업데이트
    if(loadedProgramRef){
      const {progName,dayIdx}=loadedProgramRef;
      const updatedPrograms=JSON.parse(JSON.stringify(programs));
      updatedPrograms[progName].days[dayIdx].exercises=selExs.map(ex=>({
        name:ex.name,sets:ex.sets,rir:ex.rir??2,targetReps:ex.targetReps||"",weight:ex.weightNote||""
      }));
      setPrograms(updatedPrograms);lsSave("customPrograms",updatedPrograms);
    }
    setShowSave(false);setNewName("");setRoutineName(name);
  };
  // 루틴 초기화
  const resetRoutines=()=>{setSavedRoutines([]);lsSave("savedRoutines",[]);setConfirmReset(false);};
  const loadProgram=(progName,dayIdx)=>{
    const day=programs[progName]?.days[dayIdx]; if(!day)return;
    setRoutineName(day.name);
    setSelExs(day.exercises.map(ex=>({name:ex.name,sets:ex.sets,rir:ex.rir??2,targetReps:ex.targetReps||"",weightNote:ex.weight||""})));
    setLoadedProgramRef({progName,dayIdx});
    setPlanTab("custom");
  };
  const handleDragStart=i=>{dragIdx.current=i;};
  const handleDragOver=(e,i)=>{e.preventDefault();dragOverIdx.current=i;};
  const handleDrop=()=>{
    if(dragIdx.current===null||dragOverIdx.current===null)return;
    setSelExs(p=>{const a=[...p];const d=a.splice(dragIdx.current,1)[0];a.splice(dragOverIdx.current,0,d);return a;});
    dragIdx.current=null;dragOverIdx.current=null;
    setDraggingIdx(null);setDragOverVisual(null);
  };
  const moveUp=i=>{if(i===0)return;setSelExs(p=>{const a=[...p];[a[i-1],a[i]]=[a[i],a[i-1]];return a;});};
  const moveDown=i=>{setSelExs(p=>{if(i>=p.length-1)return p;const a=[...p];[a[i],a[i+1]]=[a[i+1],a[i]];return a;});};

  // 롱프레스 드래그 핸들러
  const draggingIdxRef=useRef(null);
  const dragListRef=useRef(null);
  const isDraggingRef=useRef(false);

  useEffect(()=>{
    const handler=(e)=>{
      if(!isDraggingRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      const touch=e.touches[0];
      const els=document.elementsFromPoint(touch.clientX,touch.clientY);
      for(const found of els){
        const card=found.closest("[data-exidx]");
        if(card){
          const idx=parseInt(card.dataset.exidx);
          if(!isNaN(idx)){
            dragOverIdx.current=idx;
            setDragOverVisual(idx);
            break;
          }
        }
      }
    };
    document.addEventListener("touchmove",handler,{passive:false});
    return()=>document.removeEventListener("touchmove",handler);
  },[]);

  const onCardTouchStart=(i,e)=>{
    if(e.target.tagName==="INPUT"||e.target.tagName==="SELECT"||e.target.tagName==="BUTTON") return;
    longPressTimer.current=setTimeout(()=>{
      dragIdx.current=i;
      dragOverIdx.current=i;
      isDraggingRef.current=true;
      setDraggingIdx(i);
      if(navigator.vibrate) navigator.vibrate(50);
    },600);
  };
  const onCardTouchMove=(e)=>{
    if(!isDraggingRef.current) clearTimeout(longPressTimer.current);
  };
  const onCardTouchEnd=()=>{
    clearTimeout(longPressTimer.current);
    isDraggingRef.current=false;
    if(draggingIdx!==null) handleDrop();
  };

  // 종목별 최고 무게 조회
  const getBestWeight=(name)=>{
    let best=0;
    Object.values(workoutLog).forEach(logs=>logs.forEach(log=>(log.exercises||[]).forEach(ex=>{
      if(ex.name===name) ex.sets.filter(s=>s.isMain&&s.weight).forEach(s=>{const w=parseFloat(s.weight);if(w>best)best=w;});
    })));
    return best||"";
  };

  const handleCountdownDone=()=>{
    setShowCountdown(false);
    const rn=routineName||"오늘의 운동"; setRoutineName(rn);
    const wm=parseInt(profile.warmupSets)||0,mm=parseInt(profile.mainSets)||3,cm=parseInt(profile.cooldownSets)||0;

    // 같은 루틴 이름의 가장 최근 기록 찾기
    const prevRecord=Object.entries(workoutLog)
      .sort(([a],[b])=>b.localeCompare(a))
      .flatMap(([,logs])=>logs)
      .find(log=>log.routineName===rn)||null;

    setWorkoutData(selExs.map(ex=>{
      const best=getBestWeight(ex.name);
      // 이전 기록에서 같은 종목 찾기
      const prevEx=prevRecord?.exercises?.find(e=>e.name===ex.name)||null;
      const sets=[
        ...Array.from({length:wm},()=>({weight:"",reps:"",isMain:false,isWarmup:true,isCooldown:false,done:false,memo:""})),
        ...Array.from({length:ex.sets||mm},(_,si)=>({
          weight:"",
          reps:String(ex.targetReps||""),
          isMain:true,isWarmup:false,isCooldown:false,done:false,
          // 메모: RIR만 표시 (최고 무게 제거)
          memo:ex.rir!=null&&ex.rir!==""?`RIR ${ex.rir}`:"",
          // 이전 기록 세트 참조용
          prevWeight:prevEx?.sets?.filter(s=>s.isMain)?.[si]?.weight||"",
          prevReps:prevEx?.sets?.filter(s=>s.isMain)?.[si]?.reps||"",
        })),
        ...Array.from({length:cm},()=>({weight:"",reps:"",isMain:false,isWarmup:false,isCooldown:true,done:false,memo:""})),
      ];
      return {name:ex.name,targetSets:ex.sets||mm,targetRir:ex.rir??2,targetReps:ex.targetReps||"",weightNote:ex.weightNote||"",sets,bestWeight:best,prevRecord:prevEx};
    }));
    setCurExIdx(0);setStartTime(Date.now());setTotalSec(0);setIsPaused(false);setPausedAt(null);setPausedTotal(0);
    setPhase("live");
  };

  const startWorkout=dateForRecord=>{
    if(!selExs.length){alert("운동을 1개 이상 선택해주세요");return;}
    setActiveDate(dateForRecord||nowStr());
    setShowCountdown(true);
  };

  const togglePause=()=>{
    if(!isPaused){clearInterval(timerRef.current);setPausedAt(Date.now());setIsPaused(true);}
    else{const extra=Date.now()-pausedAt;setPausedTotal(p=>p+extra);setPausedAt(null);setIsPaused(false);}
  };

  const updSet=(si,f,v)=>setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets[si]={...a[curExIdx].sets[si],[f]:v};return a;});
  const toggleMain=si=>setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets[si]={...a[curExIdx].sets[si],isMain:!a[curExIdx].sets[si].isMain};return a;});
  const toggleDone=si=>setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets[si]={...a[curExIdx].sets[si],done:!a[curExIdx].sets[si].done};return a;});
  const addSet=type=>setWorkoutData(p=>{
    const a=p.map(e=>({...e,sets:[...e.sets]}));
    const ex=a[curExIdx];
    const ns={weight:"",reps:type==="main"?String(ex.targetReps||""):"",isMain:type==="main",isWarmup:type==="warmup",isCooldown:type==="cooldown",done:false,memo:type==="main"&&ex.targetRir!=null?`RIR ${ex.targetRir}`:""};
    if(type==="warmup"){const fi=a[curExIdx].sets.findIndex(s=>s.isMain);fi>=0?a[curExIdx].sets.splice(fi,0,ns):a[curExIdx].sets.unshift(ns);}
    else a[curExIdx].sets.push(ns);
    return a;
  });
  const removeSet=si=>setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets.splice(si,1);return a;});
  const getRmPct=(name,weight)=>{const w=parseFloat(weight);if(!w)return null;const rm=name.includes("스쿼트")?profile.squat:name.includes("벤치")?profile.bench:name.includes("데드")?profile.dead:0;return rm?Math.round(w/rm*100):null;};

  const [confirmFinish,setConfirmFinish]=useState(false);
  const [confirmBackToEdit,setConfirmBackToEdit]=useState(false);
  const [showAddExModal,setShowAddExModal]=useState(false);
  const [addExMuscle,setAddExMuscle]=useState(MUSCLE_TABS[0]);

  const requestFinish=()=>{
    clearInterval(timerRef.current);
    if(wakeLockRef.current){wakeLockRef.current.release().catch(()=>{});wakeLockRef.current=null;}
    const tt=Math.floor((Date.now()-startTime-pausedTotal)/1000);
    let mainVol=0,totalVol=0,sets=0;
    workoutData.forEach(ex=>ex.sets.forEach(s=>{if(s.weight&&s.reps){const v=parseFloat(s.weight)*parseInt(s.reps);totalVol+=v;if(s.isMain){mainVol+=v;sets++;}}}));
    const cal=Math.round(mainVol*0.035+(tt/60)*(profile.weight||70)*0.075);
    setPendingFinish({tt,mainVol:Math.round(mainVol),totalVol:Math.round(totalVol),sets,cal,routineName,date:activeDate,exercises:workoutData.map(ex=>({name:ex.name,targetReps:ex.targetReps,sets:ex.sets}))});
    setConfirmFinish(true);
  };

  const finishWithIntensity=intensity=>{
    if(!pendingFinish)return;
    const result={...pendingFinish,intensity};
    setSummary(result);
    setWorkoutLog(p=>{const n={...p,[activeDate]:[...(p[activeDate]||[]),result]};lsSave("workoutLog",n);return n;});
    setShowIntensity(false);setPendingFinish(null);setPhase("summary");
  };

  // 과거 기록 수정 시작
  const startEditLog=(day,logIdx)=>{
    const log=workoutLog[day][logIdx];
    setEditingLogDay(day);
    setEditingLogIdx(logIdx);
    setEditWorkoutData(log.exercises.map(ex=>({...ex,sets:ex.sets.map(s=>({...s}))})));
    setCurEditEx(0);
    setPhase("editlog");
  };

  // 과거 기록 수정 저장
  const saveEditLog=()=>{
    const updated={...workoutLog};
    const log={...updated[editingLogDay][editingLogIdx]};
    log.exercises=editWorkoutData;
    // 볼륨 재계산
    let mainVol=0,totalVol=0;
    editWorkoutData.forEach(ex=>ex.sets.forEach(s=>{if(s.weight&&s.reps){const v=parseFloat(s.weight)*parseInt(s.reps);totalVol+=v;if(s.isMain)mainVol+=v;}}));
    log.mainVol=Math.round(mainVol);log.totalVol=Math.round(totalVol);
    updated[editingLogDay]=[...updated[editingLogDay]];
    updated[editingLogDay][editingLogIdx]=log;
    lsSave("workoutLog",updated);
    setWorkoutLog(updated);
    setConfirmEdit(false);
    setPhase("dayview");
  };

  const exMap=useMemo(()=>{
    const m={};
    Object.entries(workoutLog).sort(([a],[b])=>a.localeCompare(b)).forEach(([date,logs])=>{
      logs.forEach(log=>(log.exercises||[]).forEach(ex=>{
        const mainSets=ex.sets.filter(s=>s.isMain&&s.weight&&s.reps);
        const vol=mainSets.reduce((a,s)=>a+parseFloat(s.weight)*parseInt(s.reps),0);
        const maxW=mainSets.reduce((a,s)=>Math.max(a,parseFloat(s.weight)||0),0);
        if(vol>0||maxW>0){
          if(!m[ex.name])m[ex.name]=[];
          m[ex.name].push({date:date.slice(5),vol:Math.round(vol),maxW});
        }
      }));
    });
    return m;
  },[workoutLog]);

  if(showCountdown) return <Countdown onDone={handleCountdownDone}/>;
  if(showIntensity) return <IntensityPicker onDone={finishWithIntensity}/>;

  // 과거 기록 편집 화면
  if(phase==="editlog" && editWorkoutData) {
    const updEditSet=(exI,si,f,v)=>setEditWorkoutData(p=>{const a=p.map(e=>({...e,sets:e.sets.map(s=>({...s}))}));a[exI].sets[si]={...a[exI].sets[si],[f]:v};return a;});
    return (
      <div>
        <button onClick={()=>setPhase("dayview")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← 날짜로</button>
        <p style={{fontSize:15,fontWeight:600,marginBottom:10,color:C.text}}>기록 수정 — {editingLogDay}</p>
        <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto",paddingBottom:2}}>
          {editWorkoutData.map((e,i)=><Chip key={i} active={i===curEditEx} onClick={()=>setCurEditEx(i)} style={{flexShrink:0}}>{e.name.split(" ")[0]}</Chip>)}
        </div>
        {editWorkoutData[curEditEx] && (
          <GCard>
            <p style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:8}}>{editWorkoutData[curEditEx].name}</p>
            <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 1fr 22px",gap:3,marginBottom:4}}>
              {["#","무게","렙","메모",""].map((h,i)=><div key={i} style={{fontSize:9,color:C.muted,textAlign:"center"}}>{h}</div>)}
            </div>
            {editWorkoutData[curEditEx].sets.map((s,si)=>(
              <div key={si} style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 1fr 22px",gap:3,alignItems:"center",padding:"4px 0",borderBottom:`0.5px solid ${C.border}`,background:s.isMain?"#1e2a1a":s.isCooldown?"#2a1e00":"transparent",borderRadius:4}}>
                <div style={{fontSize:11,color:s.isMain?C.green:s.isCooldown?C.amber:C.muted,textAlign:"center",fontWeight:s.isMain?600:400}}>{s.isWarmup?"W":s.isCooldown?"C":si+1}</div>
                <NumInp value={s.weight} onChange={v=>updEditSet(curEditEx,si,"weight",v)} placeholder="kg"/>
                <NumInp value={s.reps} onChange={v=>updEditSet(curEditEx,si,"reps",v)} placeholder="rep"/>
                <input value={s.memo||""} onChange={e=>updEditSet(curEditEx,si,"memo",e.target.value)} placeholder="메모" style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:5,padding:"5px 3px",fontSize:10,color:C.text,width:"100%",textAlign:"center"}}/>
                <button onClick={()=>setEditWorkoutData(p=>{const a=p.map(e=>({...e,sets:e.sets.map(s=>({...s}))}));a[curEditEx].sets.splice(si,1);return a;})} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13,padding:0}}>×</button>
              </div>
            ))}
          </GCard>
        )}
        <button onClick={()=>setConfirmEdit(true)} style={{width:"100%",padding:12,background:C.accent,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600}}>수정 완료</button>
        {confirmEdit && <ConfirmModal message="기록을 변경하시겠습니까?" onConfirm={saveEditLog} onCancel={()=>setConfirmEdit(false)}/>}
      </div>
    );
  }

  if(phase==="calendar") return (
    <div>
      <GCard><CalendarView workoutLog={workoutLog} cfLog={cfLog} onSelectDay={d=>{setSelDay(d);setPhase("dayview");}}/></GCard>
      <PBtn onClick={()=>{setSelExs([]);setRoutineName("");setSelDay(null);setPlanTab("programs");setPhase("plan");}}>+ 오늘 운동 시작</PBtn>
      {Object.keys(exMap).length>0 && (
        <GCard style={{marginTop:10}}>
          <p style={{fontSize:13,fontWeight:600,marginBottom:4,color:C.text}}>종목별 운동 추이</p>
          <ExMapChart exMap={exMap}/>
        </GCard>
      )}
    </div>
  );

  if(phase==="dayview") {
    const logs=workoutLog[selDay]||[];
    return (
      <div>
        <button onClick={()=>setPhase("calendar")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← 달력</button>
        <p style={{fontSize:15,fontWeight:600,marginBottom:10,color:C.text}}>{selDay} 운동</p>
        {logs.length===0
          ? <GCard><p style={{color:C.muted,textAlign:"center",padding:"20px 0",fontSize:13}}>운동 기록 없음</p></GCard>
          : logs.map((log,li)=>(
            <GCard key={li}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontWeight:600,fontSize:14,color:C.text}}>{log.routineName}</span>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>startEditLog(selDay,li)} style={{background:"none",border:`0.5px solid ${C.accentL}`,borderRadius:6,color:C.accentL,cursor:"pointer",fontSize:12,padding:"3px 8px"}}>수정</button>
                  <button onClick={()=>{moveToTrash("workout",selDay,li,log);const n={...workoutLog};n[selDay]=n[selDay].filter((_,i)=>i!==li);if(!n[selDay].length)delete n[selDay];lsSave("workoutLog",n);setWorkoutLog(n);}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13}}>삭제</button>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:10}}>
                {[["시간",fmtT(log.tt)],["메인볼륨",(log.mainVol||log.vol)+"kg"],["전체볼륨",(log.totalVol||log.vol)+"kg"],["강도",log.intensity?`${log.intensity}/10`:"-"]].map(([l,v])=>(
                  <div key={l} style={{background:C.card2,borderRadius:8,padding:"7px 4px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:C.muted,marginBottom:2}}>{l}</div>
                    <div style={{fontSize:12,fontWeight:600,color:C.text}}>{v}</div>
                  </div>
                ))}
              </div>
              {(log.exercises||[]).map((ex,ei)=>(
                <div key={ei} style={{marginBottom:6}}>
                  <p style={{fontSize:13,fontWeight:500,marginBottom:2,color:C.text}}>{ex.name}{ex.targetReps?` (목표: ${ex.targetReps}rep)`:""}</p>
                  {ex.sets.filter(s=>s.weight||s.reps).map((s,si)=>{
                    const achieved=s.isMain&&ex.targetReps&&s.reps?(parseInt(s.reps)>=parseInt(ex.targetReps)?"✅":"❌"):"";
                    return <p key={si} style={{fontSize:12,color:C.muted,paddingLeft:8}}>{s.isMain?"메인":s.isWarmup?"웜업":"쿨다운"}: {s.weight||"-"}kg × {s.reps||"-"}rep {achieved}{s.memo?` (${s.memo})`:""}</p>;
                  })}
                </div>
              ))}
            </GCard>
          ))
        }
        <PBtn onClick={()=>{setSelExs([]);setRoutineName("");setPlanTab("programs");setPhase("plan");}}>+ 이 날짜에 운동 추가</PBtn>
      </div>
    );
  }

  if(phase==="plan") return (
    <div>
      <button onClick={()=>setPhase(selDay?"dayview":"calendar")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← {selDay?"날짜로":"달력"}</button>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["programs","📋 Programs"],["custom","✏️ 커스텀"]].map(([t,l])=>(
          <button key={t} onClick={()=>setPlanTab(t)} style={{flex:1,padding:"10px",border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,cursor:"pointer",background:planTab===t?C.accent:"transparent",color:planTab===t?"#fff":C.muted,fontWeight:planTab===t?600:400}}>{l}</button>
        ))}
      </div>
      {planTab==="programs" && (
        <div>
          {Object.entries(programs).map(([progName,prog])=>(
            <GCard key={progName} style={{padding:0,overflow:"hidden"}}>
              <div onClick={()=>setSelProgram(selProgram===progName?null:progName)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 14px",cursor:"pointer",background:selProgram===progName?"#1e3a6e":C.card}}>
                <span style={{fontSize:14,fontWeight:600,color:selProgram===progName?C.accentL:C.text}}>{progName}</span>
                <span style={{fontSize:14,color:C.muted}}>{selProgram===progName?"▲":"▼"}</span>
              </div>
              {selProgram===progName && (
                <div style={{padding:"12px 14px 14px",background:C.card2,borderTop:`0.5px solid ${C.border}`}}>
                  <pre style={{fontSize:11,color:C.muted,whiteSpace:"pre-wrap",marginBottom:12,fontFamily:"inherit",lineHeight:1.7}}>{prog.desc}</pre>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                    {prog.days.map((day,di)=>(
                      <button key={di} onClick={()=>loadProgram(progName,di)} style={{padding:"7px 14px",border:`0.5px solid ${C.accentL}`,borderRadius:16,fontSize:12,cursor:"pointer",background:"#1e3a6e",color:C.accentL,fontWeight:500}}>
                        {day.name.split("—")[0].trim()}
                      </button>
                    ))}
                  </div>
                  {/* 로드된 프로그램이 이 progName이면 인라인 편집 UI 표시 */}
                  {loadedProgramRef?.progName===progName && selExs.length>0 && (
                    <div style={{background:"#0f1117",borderRadius:8,padding:10,border:`0.5px solid ${C.green}44`}}>
                      <p style={{fontSize:11,color:C.green,marginBottom:8,fontWeight:600}}>✏️ {programs[progName].days[loadedProgramRef.dayIdx].name} 편집 중</p>
                      {selExs.map((ex,i)=>(
                        <div key={i} style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                          <span style={{fontSize:12,color:C.text,flex:1,minWidth:100}}>{ex.name}</span>
                          <div style={{display:"flex",alignItems:"center",gap:3}}>
                            <span style={{fontSize:10,color:C.muted}}>세트</span>
                            <Inp type="number" min={1} max={20} value={ex.sets} onChange={e=>updateSelEx(i,"sets",parseInt(e.target.value)||1)} style={{width:40,textAlign:"center",padding:4}}/>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:3}}>
                            <span style={{fontSize:10,color:C.muted}}>렙</span>
                            <Inp type="number" min={1} max={50} value={ex.targetReps||""} onChange={e=>updateSelEx(i,"targetReps",e.target.value)} placeholder="-" style={{width:40,textAlign:"center",padding:4}}/>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:3}}>
                            <span style={{fontSize:10,color:C.muted}}>RIR</span>
                            <Sel value={ex.rir??2} onChange={e=>updateSelEx(i,"rir",parseInt(e.target.value))} style={{padding:4,fontSize:11}}>
                              {[0,1,2,3,4,5].map(r=><option key={r} value={r}>{r}</option>)}
                            </Sel>
                          </div>
                        </div>
                      ))}
                      <div style={{display:"flex",gap:6,marginTop:8}}>
                        <button onClick={()=>{
                          const {progName:pn,dayIdx}=loadedProgramRef;
                          const up=JSON.parse(JSON.stringify(programs));
                          up[pn].days[dayIdx].exercises=selExs.map(ex=>({name:ex.name,sets:ex.sets,rir:ex.rir??2,targetReps:ex.targetReps||"",weight:ex.weightNote||""}));
                          setPrograms(up);lsSave("customPrograms",up);
                          alert(`"${up[pn].days[dayIdx].name}" 저장 완료`);
                        }} style={{flex:2,padding:"8px",background:C.accent,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>💾 프로그램에 저장</button>
                        <button onClick={()=>startWorkout(selDay||nowStr())} style={{flex:1,padding:"8px",background:C.green,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>시작 →</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GCard>
          ))}
          {selExs.length>0 && !loadedProgramRef && <div style={{padding:"10px 12px",background:"#1e3a1e",borderRadius:8,border:`0.5px solid ${C.green}`,marginBottom:10}}><p style={{fontSize:12,color:C.green,fontWeight:600}}>✓ {selExs.length}개 선택됨</p></div>}
          {selExs.length>0 && !loadedProgramRef && <PBtn onClick={()=>startWorkout(selDay||nowStr())}>바로 시작 →</PBtn>}
        </div>
      )}
      {planTab==="custom" && (
        <div>
          {savedRoutines.length>0 && (
            <GCard>
              <Lbl>저장된 루틴</Lbl>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {savedRoutines.map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                    <Chip active={routineName===r.name} onClick={()=>loadRoutine(r)}>{r.name}</Chip>
                    <button onClick={()=>{const nr=savedRoutines.filter((_,j)=>j!==i);setSavedRoutines(nr);lsSave("savedRoutines",nr);}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13}}>×</button>
                  </div>
                ))}
              </div>
            </GCard>
          )}
          <GCard><Lbl>루틴 이름</Lbl><Inp value={routineName} onChange={e=>setRoutineName(e.target.value)} placeholder="예: 월요일 등/어깨"/></GCard>
          <GCard>
            <Lbl>부위 선택</Lbl>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{MUSCLE_TABS.map(m=><Chip key={m} active={selMuscle===m} onClick={()=>setSelMuscle(m)}>{m}</Chip>)}</div>
            {(EXERCISES[selMuscle]||[]).map(ex=>(
              <div key={ex} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <input type="checkbox" checked={!!selExs.find(e=>e.name===ex)} onChange={()=>toggleEx(ex)} style={{width:16,height:16,accentColor:C.accent}}/>
                <span style={{fontSize:14,color:C.text,flex:1}}>{ex}</span>
                {getBestWeight(ex)>0 && <span style={{fontSize:11,color:C.amber}}>최고 {getBestWeight(ex)}kg</span>}
              </div>
            ))}
            {(customExs[selMuscle]||[]).map(ex=>(
              <div key={ex} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <input type="checkbox" checked={!!selExs.find(e=>e.name===ex)} onChange={()=>toggleEx(ex)} style={{width:16,height:16,accentColor:C.accent}}/>
                <span style={{fontSize:14,color:C.amber,flex:1}}>{ex}</span>
                <button onClick={()=>{setEditEx({muscle:selMuscle,name:ex});setEditName(ex);}} style={{fontSize:11,padding:"3px 8px",border:`0.5px solid ${C.border}`,borderRadius:6,background:"transparent",color:C.muted,cursor:"pointer"}}>편집</button>
                <button onClick={()=>deleteCustomEx(selMuscle,ex)} style={{fontSize:12,padding:"3px 10px",border:`0.5px solid ${C.red}`,borderRadius:6,background:"transparent",color:C.red,cursor:"pointer",fontWeight:600}}>삭제</button>
              </div>
            ))}
            <div style={{display:"flex",gap:6,marginTop:10}}>
              <Inp value={customInput} onChange={e=>setCustomInput(e.target.value)} placeholder="직접 입력" style={{flex:1}} onKeyDown={e=>{if(e.key==="Enter")addCustomEx();}}/>
              <button onClick={addCustomEx} style={{padding:"8px 14px",border:`0.5px solid ${C.accentL}`,borderRadius:7,background:"#1e3a6e",color:C.accentL,cursor:"pointer",fontSize:13,fontWeight:600}}>추가</button>
            </div>
          </GCard>
          {selExs.length>0 && (
            <GCard>
              <Lbl>선택된 운동 — 카드를 1초 꾹 누르면 드래그로 순서 변경</Lbl>
              <div ref={dragListRef}>
              {selExs.map((ex,i)=>(
                <div key={i} data-exidx={i}
                  onTouchStart={e=>onCardTouchStart(i,e)}
                  onTouchMove={onCardTouchMove}
                  onTouchEnd={onCardTouchEnd}
                  onDragOver={e=>handleDragOver(e,i)} onDrop={handleDrop}
                  style={{
                    background:draggingIdx===i?"#1e3a6e":dragOverVisual===i&&draggingIdx!==null?"#1e3a1e":C.card2,
                    borderRadius:8,padding:10,marginBottom:6,
                    border:`0.5px solid ${draggingIdx===i?C.accentL:dragOverVisual===i&&draggingIdx!==null?C.green:C.border}`,
                    opacity:draggingIdx===i?0.7:1,
                    transition:"background .15s, border .15s",
                    userSelect:"none", WebkitUserSelect:"none", WebkitTouchCallout:"none",
                  }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:16,color:draggingIdx===i?C.accentL:C.muted,pointerEvents:"none"}}>☰</span>
                      <span style={{fontSize:13,fontWeight:500,color:C.text,pointerEvents:"none"}}>{ex.name}</span>
                      {getBestWeight(ex.name)>0 && <span style={{fontSize:11,color:C.amber,pointerEvents:"none"}}>최고 {getBestWeight(ex.name)}kg</span>}
                    </div>
                    <button onClick={()=>setSelExs(p=>p.filter((_,j)=>j!==i))} style={{fontSize:12,padding:"3px 10px",border:`0.5px solid ${C.red}`,borderRadius:6,background:"transparent",color:C.red,cursor:"pointer",fontWeight:600}}>삭제</button>
                  </div>
                  {ex.weightNote && <p style={{fontSize:11,color:C.amber,marginBottom:6,pointerEvents:"none"}}>📌 {ex.weightNote}</p>}
                  <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:C.muted}}>메인</span><Inp type="number" min={1} max={10} value={ex.sets} onChange={e=>updateSelEx(i,"sets",parseInt(e.target.value)||1)} style={{width:44,textAlign:"center",padding:5}}/></div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:C.muted}}>목표렙</span><Inp type="number" min={1} max={50} value={ex.targetReps||""} onChange={e=>updateSelEx(i,"targetReps",e.target.value)} placeholder="-" style={{width:44,textAlign:"center",padding:5}}/></div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:C.muted}}>RIR</span><Sel value={ex.rir??2} onChange={e=>updateSelEx(i,"rir",parseInt(e.target.value))} style={{padding:5}}>{[0,1,2,3,4,5].map(r=><option key={r} value={r}>{r}</option>)}</Sel></div>
                  </div>
                </div>
              ))}
              </div>
            </GCard>
          )}
          {selExs.length>0 && (
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {(routineName && (savedRoutines.find(r=>r.name===routineName) || loadedProgramRef)) && (
                <button onClick={()=>{
                  const name=routineName;
                  // savedRoutines 업데이트
                  const exists=savedRoutines.findIndex(r=>r.name===name);
                  let nr;
                  if(exists>=0){nr=[...savedRoutines];nr[exists]={name,exercises:selExs};}
                  else{nr=[...savedRoutines,{name,exercises:selExs}];}
                  setSavedRoutines(nr);lsSave("savedRoutines",nr);
                  // programs 업데이트
                  if(loadedProgramRef){
                    const {progName,dayIdx}=loadedProgramRef;
                    const up=JSON.parse(JSON.stringify(programs));
                    up[progName].days[dayIdx].exercises=selExs.map(ex=>({name:ex.name,sets:ex.sets,rir:ex.rir??2,targetReps:ex.targetReps||"",weight:ex.weightNote||""}));
                    setPrograms(up);lsSave("customPrograms",up);
                  }
                  alert(`"${name}" 루틴이 저장되었습니다.`);
                }} style={{flex:2,padding:10,border:`0.5px solid ${C.green}`,borderRadius:8,background:"transparent",color:C.green,cursor:"pointer",fontSize:13,fontWeight:600}}>💾 현재 루틴 저장</button>
              )}
              <button onClick={()=>setShowSave(true)} style={{flex:1,padding:10,border:`0.5px solid ${C.border}`,borderRadius:8,background:"transparent",color:C.accentL,cursor:"pointer",fontSize:13}}>+ 새 이름 저장</button>
            </div>
          )}
          {savedRoutines.length>0 && (
            <button onClick={()=>setConfirmReset(true)} style={{width:"100%",padding:8,border:`0.5px solid ${C.red}44`,borderRadius:8,background:"transparent",color:C.red,cursor:"pointer",fontSize:11,marginBottom:8,opacity:0.7}}>루틴 전체 초기화</button>
          )}
          {confirmReset && <ConfirmModal message="저장된 루틴을 전부 초기화하시겠습니까?⚠️ 되돌릴 수 없습니다." onConfirm={resetRoutines} onCancel={()=>setConfirmReset(false)}/>}
          {showSave && (
            <GCard>
              <Lbl>새 루틴 이름으로 저장</Lbl>
              <div style={{display:"flex",gap:6}}>
                <Inp value={newName||routineName} onChange={e=>setNewName(e.target.value)} placeholder="루틴 이름" style={{flex:1}}/>
                <button onClick={saveRoutine} style={{padding:"8px 12px",background:C.accent,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:13}}>저장</button>
                <button onClick={()=>setShowSave(false)} style={{padding:"8px 10px",background:"transparent",border:`0.5px solid ${C.border}`,borderRadius:7,cursor:"pointer",color:C.muted,fontSize:13}}>취소</button>
              </div>
            </GCard>
          )}
          <PBtn onClick={()=>startWorkout(selDay||nowStr())}>운동 시작 →</PBtn>
        </div>
      )}
      {editEx && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}} onClick={()=>setEditEx(null)}>
          <div style={{background:C.card,borderRadius:12,padding:20,width:300,border:`0.5px solid ${C.border}`}} onClick={e=>e.stopPropagation()}>
            <p style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:12}}>운동명 편집</p>
            <Inp value={editName} onChange={e=>setEditName(e.target.value)} style={{marginBottom:12}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{if(!editName.trim())return;renameCustomEx(editEx.muscle,editEx.name,editName.trim());}} style={{flex:1,padding:"9px",background:C.accent,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600}}>저장</button>
              <button onClick={()=>deleteCustomEx(editEx.muscle,editEx.name)} style={{flex:1,padding:"9px",background:"transparent",border:`0.5px solid ${C.red}`,borderRadius:7,cursor:"pointer",fontSize:13,color:C.red}}>삭제</button>
              <button onClick={()=>setEditEx(null)} style={{padding:"9px 12px",background:"transparent",border:`0.5px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontSize:13,color:C.muted}}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if(phase==="live") {
    const ex=workoutData[curExIdx];
    if(!ex) return null;
    const mainSets=ex.sets.filter(s=>s.isMain);
    const mainVol=mainSets.filter(s=>s.weight&&s.reps).reduce((a,s)=>a+parseFloat(s.weight)*parseInt(s.reps),0);
    const rmLift=ex.name.includes("스쿼트")?profile.squat:ex.name.includes("벤치")?profile.bench:ex.name.includes("데드")?profile.dead:0;
    const sugW=(rmLift&&ex.targetRir!=null)?Math.round(rmLift*(EPLEY[Math.min(ex.targetRir,11)]||70)/100*4)/4:null;
    const rmPct=getRmPct(ex.name,ex.sets.find(s=>s.isMain&&s.weight)?.weight);
    return (
      <div>
        <div style={{position:"sticky",top:0,zIndex:20,borderRadius:10,padding:"10px 14px",marginBottom:10,background:isPaused?"#1a1a2e":"#0d1a0d",border:`2px solid ${isPaused?C.amber:C.green}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:1}}>총 운동 시간</div>
              <div style={{fontSize:34,fontWeight:700,fontVariantNumeric:"tabular-nums",color:isPaused?C.amber:"#fff",lineHeight:1}}>{fmtT(totalSec)}</div>
            </div>
            <button onClick={togglePause} style={{padding:"10px 18px",border:`0.5px solid ${isPaused?C.amber:C.border}`,borderRadius:8,background:isPaused?"#2a1e00":"transparent",color:isPaused?C.amber:C.muted,cursor:"pointer",fontSize:14,fontWeight:600}}>
              {isPaused?"▶ 재개":"⏸ 일시정지"}
            </button>
          </div>
          {isPaused && <div style={{textAlign:"center",marginTop:4,fontSize:12,color:C.amber}}>⏸ 일시정지 중</div>}
        </div>
        <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto",paddingBottom:2}}>
          {workoutData.map((e,i)=><Chip key={i} active={i===curExIdx} onClick={()=>setCurExIdx(i)} style={{flexShrink:0}}>{e.name.split(" ")[0]}</Chip>)}
          <button onClick={()=>setShowAddExModal(true)} style={{flexShrink:0,width:32,height:32,borderRadius:"50%",border:`1.5px solid ${C.accentL}`,background:"transparent",color:C.accentL,cursor:"pointer",fontSize:18,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>+</button>
        </div>
        <GCard>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:14,fontWeight:600,color:C.text}}>{ex.name}</span>
            <div style={{display:"flex",gap:5}}>
              {mainVol>0&&rmLift>0 && <span style={{fontSize:10,color:C.accentL,background:"#1e3a6e",padding:"2px 7px",borderRadius:10}}>볼륨 {Math.round(mainVol/rmLift*100)}%</span>}
              {rmPct && <span style={{fontSize:10,background:"#1e3a6e",color:C.accentL,padding:"2px 7px",borderRadius:10}}>1RM {rmPct}%</span>}
            </div>
          </div>
          {ex.bestWeight>0 && <p style={{fontSize:11,color:C.muted,marginBottom:4}}>과거 최고: <strong style={{color:C.amber}}>{ex.bestWeight}kg</strong></p>}
          {/* 이전 루틴 기록 레퍼런스 */}
          {ex.prevRecord && (
            <div style={{background:"#1a1e2e",borderRadius:7,padding:"6px 10px",marginBottom:8,border:`0.5px solid ${C.accentL}44`}}>
              <p style={{fontSize:10,color:C.accentL,marginBottom:4}}>📋 이전 기록</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {ex.prevRecord.sets.filter(s=>s.isMain&&(s.weight||s.reps)).map((s,si)=>(
                  <span key={si} style={{fontSize:11,color:C.mutedL,background:C.card2,padding:"2px 7px",borderRadius:6}}>
                    {s.weight||"-"}kg × {s.reps||"-"}
                  </span>
                ))}
              </div>
            </div>
          )}
          {ex.weightNote && <p style={{fontSize:11,color:C.amber,marginBottom:4}}>📌 {ex.weightNote}</p>}
          {ex.targetReps && <p style={{fontSize:11,color:C.accentL,marginBottom:4}}>🎯 목표 렙: <strong>{ex.targetReps}rep</strong></p>}
          {sugW && <p style={{fontSize:11,color:C.amber,marginBottom:8,background:"#2a1e00",padding:"4px 8px",borderRadius:6}}>💡 RIR {ex.targetRir} 목표 → 제안 무게: {sugW}kg</p>}
          <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 1fr 30px 30px 22px",gap:3,marginBottom:4}}>
            {["#","무게","렙","메모","M","✓",""].map((h,i)=><div key={i} style={{fontSize:9,color:C.muted,textAlign:"center"}}>{h}</div>)}
          </div>
          {ex.sets.map((s,si)=>(
            <div key={si} style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 1fr 30px 30px 22px",gap:3,alignItems:"center",padding:"4px 0",borderBottom:`0.5px solid ${C.border}`,background:s.isMain?"#1e2a1a":s.isCooldown?"#2a1e00":"transparent",borderRadius:4}}>
              <div style={{fontSize:11,color:s.isMain?C.green:s.isCooldown?C.amber:C.muted,textAlign:"center",fontWeight:s.isMain?600:400}}>{s.isWarmup?"W":s.isCooldown?"C":si+1}</div>
              <NumInp value={s.weight} onChange={v=>updSet(si,"weight",v)} placeholder="kg" style={{border:`0.5px solid ${s.isMain?C.green:s.isCooldown?C.amber:C.border}`}}/>
              <NumInp value={s.reps} onChange={v=>updSet(si,"reps",v)} placeholder="rep" style={{border:`0.5px solid ${s.isMain?C.green:s.isCooldown?C.amber:C.border}`}}/>
              <input value={s.memo||""} onChange={e=>updSet(si,"memo",e.target.value)} placeholder="메모" style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:5,padding:"5px 3px",fontSize:10,color:C.text,width:"100%",textAlign:"center"}}/>
              <button onClick={()=>toggleMain(si)} style={{width:27,height:25,borderRadius:5,border:`1.5px solid ${s.isMain?C.green:C.border}`,background:s.isMain?"#1e3a1e":"transparent",cursor:"pointer",fontSize:9,color:s.isMain?C.green:C.muted,fontWeight:600}}>M</button>
              <button onClick={()=>toggleDone(si)} style={{width:27,height:25,borderRadius:"50%",border:`1.5px solid ${s.done?C.green:C.border}`,background:s.done?"#1e3a1e":"transparent",cursor:"pointer",fontSize:11,color:s.done?C.green:C.muted}}>{s.done?"✓":"○"}</button>
              <button onClick={()=>removeSet(si)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13,padding:0}}>×</button>
            </div>
          ))}
          <Lbl style={{marginTop:6,fontSize:10}}>M=메인 W=웜업 C=쿨다운 · 메인만 볼륨 집계</Lbl>
          <div style={{display:"flex",gap:5,marginTop:6}}>
            <button onClick={()=>addSet("warmup")} style={{flex:1,fontSize:11,padding:"5px 4px",border:`0.5px solid ${C.accentL}`,borderRadius:7,background:"transparent",cursor:"pointer",color:C.accentL}}>+ 웜업</button>
            <button onClick={()=>addSet("main")} style={{flex:1,fontSize:11,padding:"5px 4px",border:`0.5px solid ${C.green}`,borderRadius:7,background:"transparent",cursor:"pointer",color:C.green}}>+ 메인</button>
            <button onClick={()=>addSet("cooldown")} style={{flex:1,fontSize:11,padding:"5px 4px",border:`0.5px solid ${C.amber}`,borderRadius:7,background:"transparent",cursor:"pointer",color:C.amber}}>+ 쿨다운</button>
          </div>
        </GCard>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setConfirmBackToEdit(true)} style={{flex:1,padding:11,border:`0.5px solid ${C.red}`,borderRadius:8,background:"transparent",color:C.red,cursor:"pointer",fontSize:13,fontWeight:500}}>← 수정</button>
          <button onClick={requestFinish} style={{flex:2,padding:11,background:C.accent,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:14}}>운동 종료 →</button>
        </div>
        {confirmFinish && <ConfirmModal
          message={`운동을 종료하시겠습니까?\n⏱ ${fmtT(pendingFinish?.tt||0)}`}
          onConfirm={()=>{setConfirmFinish(false);setShowIntensity(true);}}
          onCancel={()=>{
            setConfirmFinish(false);
            setPendingFinish(null);
            // 타이머 재개: 멈춘 시간만큼 pausedTotal에 추가
            const pausedMs=Date.now()-(startTime+(pendingFinish?.tt||0)*1000+pausedTotal);
            setPausedTotal(p=>p+pausedMs);
            setIsPaused(false);
          }}
        />}
        {confirmBackToEdit && <ConfirmModal
          message={"수정 화면으로 돌아가시겠습니까?\n\n⚠️ 현재 운동 데이터가 모두 사라집니다."}
          onConfirm={()=>{setConfirmBackToEdit(false);clearInterval(timerRef.current);setPhase("plan");}}
          onCancel={()=>setConfirmBackToEdit(false)}
        />}
        {showAddExModal && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400}} onClick={()=>setShowAddExModal(false)}>
            <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:16,padding:20,width:340,maxWidth:"92vw",maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
              <p style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:12,textAlign:"center"}}>운동 항목 추가</p>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                {MUSCLE_TABS.map(m=><Chip key={m} active={addExMuscle===m} onClick={()=>setAddExMuscle(m)}>{m}</Chip>)}
              </div>
              <div style={{maxHeight:"45vh",overflowY:"auto"}}>
                {(EXERCISES[addExMuscle]||[]).map(ex=>{
                  const already=workoutData.some(e=>e.name===ex);
                  return (
                    <div key={ex} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 4px",borderBottom:`0.5px solid ${C.border}`,opacity:already?0.4:1}}>
                      <span style={{fontSize:13,color:C.text}}>{ex}</span>
                      {already?<span style={{fontSize:10,color:C.muted}}>추가됨</span>:
                      <button onClick={()=>{
                        const mm=parseInt(profile.mainSets)||3;
                        const best=getBestWeight(ex);
                        const newEx={name:ex,targetSets:mm,targetRir:2,targetReps:"",weightNote:"",sets:Array.from({length:mm},()=>({weight:"",reps:"",isMain:true,isWarmup:false,isCooldown:false,done:false,memo:`RIR 2`})),bestWeight:best,prevRecord:null};
                        setWorkoutData(p=>[...p,newEx]);
                        setCurExIdx(workoutData.length);
                        setShowAddExModal(false);
                      }} style={{fontSize:11,padding:"4px 12px",border:`0.5px solid ${C.green}`,borderRadius:6,background:"transparent",color:C.green,cursor:"pointer",fontWeight:600}}>+ 추가</button>}
                    </div>
                  );
                })}
                {(customExs[addExMuscle]||[]).map(ex=>{
                  const already=workoutData.some(e=>e.name===ex);
                  return (
                    <div key={ex} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 4px",borderBottom:`0.5px solid ${C.border}`,opacity:already?0.4:1}}>
                      <span style={{fontSize:13,color:C.text}}>{ex} <span style={{fontSize:9,color:C.amber}}>커스텀</span></span>
                      {already?<span style={{fontSize:10,color:C.muted}}>추가됨</span>:
                      <button onClick={()=>{
                        const mm=parseInt(profile.mainSets)||3;
                        const best=getBestWeight(ex);
                        const newEx={name:ex,targetSets:mm,targetRir:2,targetReps:"",weightNote:"",sets:Array.from({length:mm},()=>({weight:"",reps:"",isMain:true,isWarmup:false,isCooldown:false,done:false,memo:`RIR 2`})),bestWeight:best,prevRecord:null};
                        setWorkoutData(p=>[...p,newEx]);
                        setCurExIdx(workoutData.length);
                        setShowAddExModal(false);
                      }} style={{fontSize:11,padding:"4px 12px",border:`0.5px solid ${C.green}`,borderRadius:6,background:"transparent",color:C.green,cursor:"pointer",fontWeight:600}}>+ 추가</button>}
                    </div>
                  );
                })}
              </div>
              <button onClick={()=>setShowAddExModal(false)} style={{width:"100%",marginTop:12,padding:10,border:`0.5px solid ${C.border}`,borderRadius:8,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>닫기</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if(phase==="summary"&&summary) {
    const intensityEmoji=["","😴","😌","🙂","😊","💪","😤","🔥","💥","😵","🤯"];
    const pr3=(profile.squat||0)+(profile.bench||0)+(profile.dead||0);
    let txt=`🏋️ ${summary.routineName}\n📅 ${summary.date}${profile.nick?" @"+profile.nick:""}\n`;
    if(summary.intensity) txt+=`💥 운동 강도: ${summary.intensity}/10 ${intensityEmoji[summary.intensity]}\n`;
    txt+="\n";
    (summary.exercises||[]).forEach(ex=>{
      txt+=`▪ ${ex.name}${ex.targetReps?` (목표: ${ex.targetReps}rep)`:""}\n`;
      ex.sets.filter(s=>s.weight||s.reps).forEach(s=>{
        const type=s.isMain?"메인":s.isWarmup?"웜업":"쿨다운";
        const achieved=s.isMain&&ex.targetReps&&s.reps?(parseInt(s.reps)>=parseInt(ex.targetReps)?"✅":"❌"):"";
        const memo=s.memo?` (${s.memo})`:"";
        txt+=`  ${type}: ${s.weight||"-"}kg × ${s.reps||"-"}rep ${achieved}${memo}\n`;
      });
      txt+="\n";
    });
    txt+=`⏱ ${fmtT(summary.tt)}\n`;
    txt+=`📦 메인: ${summary.mainVol||summary.vol}kg | 전체: ${summary.totalVol||summary.vol}kg\n`;
    txt+=`🔥 ${summary.cal} kcal\n`;
    if(pr3) txt+=`💪 3대: ${pr3}kg\n`;
    txt+=`\n${HASHTAG} #운동기록`;
    return (
      <div>
        <p style={{fontSize:16,fontWeight:700,marginBottom:12,color:C.text}}>완료! 🎉</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {[["총 시간",fmtT(summary.tt)],["메인 세트",summary.sets+"세트"],["메인 볼륨",(summary.mainVol||summary.vol)+"kg"],["전체 볼륨",(summary.totalVol||summary.vol)+"kg"],["칼로리",summary.cal+"kcal"],["운동 강도",summary.intensity?`${summary.intensity}/10 ${intensityEmoji[summary.intensity]}`:"-"]].map(([l,v])=>(
            <div key={l} style={{background:C.card2,borderRadius:8,padding:12,textAlign:"center"}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:4}}>{l}</div>
              <div style={{fontSize:15,fontWeight:700,color:C.text}}>{v}</div>
            </div>
          ))}
        </div>
        <GCard>
          <Lbl>운동일지 요약</Lbl>
          <pre style={{fontFamily:"monospace",fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-all",background:C.card2,borderRadius:8,padding:12,maxHeight:180,overflowY:"auto",color:C.text}}>{txt}</pre>
          <button onClick={()=>navigator.clipboard.writeText(txt).then(()=>alert("복사 완료 ✓"))} style={{marginTop:8,padding:"6px 14px",border:`0.5px solid ${C.border}`,borderRadius:7,background:"transparent",color:C.accentL,cursor:"pointer",fontSize:12}}>텍스트 복사</button>
        </GCard>
        <PBtn onClick={()=>setPhase("calendar")}>달력으로 →</PBtn>
      </div>
    );
  }
  return null;
}

function CrossfitScreen({cfLog,setCfLog,workoutLog,profile,heroWods,moveToTrash}) {
  const [phase,setPhase]=useState("calendar");
  const [selDay,setSelDay]=useState(null);
  const [selWod,setSelWod]=useState(null);
  const [cfTab,setCfTab]=useState("hero");
  const [selHero,setSelHero]=useState(null);
  const [scaleMode,setScaleMode]=useState("rx");
  const [gender,setGender]=useState("m");
  const [wodName,setWodName]=useState("");
  const [wodFormat,setWodFormat]=useState("AMRAP");
  const [totalMin,setTotalMin]=useState(10);
  const [rounds,setRounds]=useState(5);
  const [roundSec,setRoundSec]=useState(60);
  const [workSec,setWorkSec]=useState(20);
  const [restSec,setRestSec]=useState(10);
  const [movements,setMovements]=useState([{name:"버피",reps:10,weight:""}]);
  const [elapsed,setElapsed]=useState(0);
  const [curRound,setCurRound]=useState(1);
  const [tabataPhase,setTabataPhase]=useState("work");
  const [tabataSec,setTabataSec]=useState(0);
  const [scoreInput,setScoreInput]=useState("");
  const [memoInput,setMemoInput]=useState("");
  const [activeDate,setActiveDate]=useState(nowStr());
  const startRef=useRef(null);
  const intRef=useRef(null);
  const wakeLockRef=useRef(null);

  useEffect(()=>{
    const acquireWakeLock = async () => {
      if(profile.keepAwake && phase==="active"){
        try {
          if("wakeLock" in navigator){
            wakeLockRef.current = await navigator.wakeLock.request("screen");
          }
        } catch(e){}
      }
    };
    acquireWakeLock();
    return () => {
      if(wakeLockRef.current){ wakeLockRef.current.release().catch(()=>{}); wakeLockRef.current=null; }
    };
  },[phase, profile.keepAwake]);

  const fmt=CF_SCORE_FORMATS[wodFormat]||CF_SCORE_FORMATS["AMRAP"];
  const isTimed=["For Time","3 Rounds For Time","5 Rounds For Time"].includes(wodFormat);
  const totalSecs=isTimed?totalMin*60:wodFormat==="EMOM"?rounds*roundSec:wodFormat==="Tabata"?rounds*(workSec+restSec):totalMin*60;

  const getHeroWeight=h=>{const data=scaleMode==="rx"?h.rx:h.scale;if(!data)return null;return data[gender]||data.note||"";};
  const loadHero=h=>{
    setSelHero(h);setWodName(h.name);setMovements(h.movements.map(m=>({...m})));
    const mk=Object.keys(CF_SCORE_FORMATS).includes(h.mode)?h.mode:"For Time";
    setWodFormat(mk);
    if(h.totalMin)setTotalMin(h.totalMin);
    if(h.rounds)setRounds(h.rounds);
    if(h.roundSec)setRoundSec(h.roundSec);
  };
  const startTimer=dateForRecord=>{
    setActiveDate(dateForRecord||nowStr());startRef.current=Date.now();setElapsed(0);setCurRound(1);setTabataPhase("work");setTabataSec(0);setScoreInput("");setMemoInput("");setPhase("active");
    intRef.current=setInterval(()=>{
      const e=Math.floor((Date.now()-startRef.current)/1000);setElapsed(e);
      if(wodFormat==="Tabata"){const cl=workSec+restSec,cy=Math.floor(e/cl),ic=e%cl;setCurRound(cy+1);setTabataPhase(ic<workSec?"work":"rest");setTabataSec(ic<workSec?workSec-ic:cl-ic);if(cy>=rounds){clearInterval(intRef.current);setPhase("score");}}
      else if(wodFormat==="EMOM"){const r=Math.floor(e/roundSec)+1;setCurRound(r);if(r>rounds){clearInterval(intRef.current);setPhase("score");}}
      else if(isTimed||wodFormat==="AMRAP"){if(e>=totalSecs){clearInterval(intRef.current);setPhase("score");}}
    },1000);
  };
  const saveScore=()=>{
    const tt=Math.floor((Date.now()-startRef.current)/1000);
    if(wakeLockRef.current){wakeLockRef.current.release().catch(()=>{});wakeLockRef.current=null;}
    const hero=heroWods.find(h=>h.name===wodName);
    const cal=hero?hero.calFactor:Math.round(tt/60*(profile.weight||70)*0.1);
    const rec={date:activeDate,name:wodName||wodFormat,format:wodFormat,scoreType:fmt.scoreType,score:scoreInput,memo:memoInput,tt,cal,scaleMode,movements:[...movements]};
    setCfLog(p=>{const dl=[...(p[activeDate]||[])];const idx=dl.findIndex(l=>l.name===rec.name);if(idx>=0)dl[idx]=rec;else dl.push(rec);const n={...p,[activeDate]:dl};lsSave("cfLog",n);return n;});
    setPhase("done");
  };
  const getLatest=name=>{
    const all=[];
    Object.entries(cfLog).forEach(([date,logs])=>(logs||[]).forEach(l=>{if(l.name===name)all.push({...l,date});}));
    return all.sort((a,b)=>b.date.localeCompare(a.date))[0]||null;
  };
  const wodHistory=useMemo(()=>{
    const map={};
    Object.entries(cfLog).sort(([a],[b])=>a.localeCompare(b)).forEach(([date,logs])=>{
      (logs||[]).forEach(l=>{if(!map[l.name])map[l.name]=[];map[l.name].push({...l,date});});
    });
    return map;
  },[cfLog]);

  const remaining=Math.max(0,totalSecs-elapsed);
  const pct=Math.min(1,elapsed/totalSecs);
  const r2=78,cx=100,cy=100,circ=2*Math.PI*r2;
  const tColor=wodFormat==="Tabata"?(tabataPhase==="work"?C.red:C.green):C.accentL;
  const hlIdx=wodFormat==="EMOM"?(curRound-1)%movements.length:-1;

  if(phase==="wodhistory"&&selWod) {
    const recs=wodHistory[selWod]||[];
    const isTS=recs[0]?.scoreType==="time";
    const chartData=recs.map(r=>{if(isTS){const p=(r.score||"").split(":");return p.length===2?parseInt(p[0])*60+parseInt(p[1]):(r.tt||0);}const n=parseFloat(r.score);return isNaN(n)?0:n;});
    return (
      <div>
        <button onClick={()=>setPhase("calendar")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← 달력</button>
        <p style={{fontSize:15,fontWeight:700,marginBottom:4,color:C.text}}>{selWod}</p>
        <p style={{fontSize:11,color:C.muted,marginBottom:12}}>{isTS?"낮을수록 좋습니다":"높을수록 좋습니다"}</p>
        {chartData.filter(v=>v>0).length>=2 && <GCard><Lbl>{isTS?"기록 추이 (초)":"점수 추이"}</Lbl><Spark data={chartData} labels={recs.map(r=>r.date.slice(5))} color={isTS?C.green:C.accentL}/></GCard>}
        {recs.map((r,i)=>(
          <GCard key={i}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>{r.date}</span>
              <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:r.scaleMode==="rx"?"#1e3a6e":"#2a1e00",color:r.scaleMode==="rx"?C.accentL:C.amber}}>{r.scaleMode==="rx"?"RX":"Scale"}</span>
            </div>
            <div style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
              <span style={{fontSize:16,fontWeight:700,color:C.green,background:"#1e3a2a",padding:"3px 12px",borderRadius:8}}>{r.score||"-"}</span>
              <span style={{fontSize:12,color:C.muted}}>{r.format}</span>
            </div>
            <div style={{display:"flex",gap:10,fontSize:12,color:C.muted,marginBottom:r.memo?6:0}}>
              <span>⏱ {fmtT(r.tt)}</span><span style={{color:C.green}}>🔥 {r.cal}kcal</span>
            </div>
            {r.memo && <div style={{fontSize:12,color:C.mutedL,background:C.card2,borderRadius:6,padding:"6px 8px"}}>📝 {r.memo}</div>}
          </GCard>
        ))}
      </div>
    );
  }

  if(phase==="calendar") return (
    <div>
      <GCard><CalendarView workoutLog={workoutLog} cfLog={cfLog} onSelectDay={d=>{setSelDay(d);setPhase("dayview");}}/></GCard>
      {Object.keys(wodHistory).length>0 && (
        <GCard>
          <p style={{fontSize:13,fontWeight:600,marginBottom:4,color:C.text}}>WOD별 기록</p>
          <p style={{fontSize:11,color:C.muted,marginBottom:10}}>탭하면 추이 차트와 상세 기록을 볼 수 있습니다.</p>
          {Object.entries(wodHistory).map(([name,recs])=>{
            const latest=recs[recs.length-1];
            return (
              <div key={name} onClick={()=>{setSelWod(name);setPhase("wodhistory");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:C.card2,borderRadius:8,marginBottom:6,cursor:"pointer",border:`0.5px solid ${C.border}`}}>
                <div>
                  <p style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:2}}>{name}</p>
                  <p style={{fontSize:11,color:C.muted}}>{recs.length}회 · 최근: <span style={{color:C.green,fontWeight:600}}>{latest.score||"-"}</span> ({latest.date})</p>
                </div>
                <span style={{color:C.accentL,fontSize:18}}>›</span>
              </div>
            );
          })}
        </GCard>
      )}
      <PBtn onClick={()=>setPhase("setup")}>+ WOD 시작</PBtn>
    </div>
  );

  if(phase==="dayview") {
    const logs=cfLog[selDay]||[];
    return (
      <div>
        <button onClick={()=>setPhase("calendar")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← 달력</button>
        <p style={{fontSize:15,fontWeight:600,marginBottom:10,color:C.text}}>{selDay} CrossFit</p>
        {logs.length===0
          ? <GCard><p style={{color:C.muted,textAlign:"center",padding:"20px 0",fontSize:13}}>기록 없음</p></GCard>
          : logs.map((l,li)=>(
            <GCard key={li}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontWeight:600,fontSize:14,color:C.text}}>{l.name}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:l.scaleMode==="rx"?"#1e3a6e":"#2a1e00",color:l.scaleMode==="rx"?C.accentL:C.amber}}>{l.scaleMode==="rx"?"RX":"Scale"}</span>
                  <button onClick={()=>{moveToTrash("cf",selDay,li,l);const n={...cfLog};n[selDay]=n[selDay].filter((_,i)=>i!==li);if(!n[selDay].length)delete n[selDay];lsSave("cfLog",n);setCfLog(n);}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13}}>삭제</button>
                </div>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
                <span style={{fontSize:16,fontWeight:700,color:C.green,background:"#1e3a2a",padding:"3px 12px",borderRadius:8}}>{l.score||"-"}</span>
                <span style={{fontSize:12,color:C.muted}}>{l.format}</span>
              </div>
              <div style={{display:"flex",gap:10,fontSize:12,color:C.muted}}>
                <span>⏱ {fmtT(l.tt)}</span><span style={{color:C.green}}>🔥 {l.cal}kcal</span>
              </div>
              {l.memo && <div style={{fontSize:12,color:C.mutedL,background:C.card2,borderRadius:6,padding:"6px 8px",marginTop:6}}>📝 {l.memo}</div>}
            </GCard>
          ))
        }
        <PBtn onClick={()=>setPhase("setup")}>+ 이 날짜에 WOD 추가</PBtn>
      </div>
    );
  }

  if(phase==="setup") {
    const latestHeroRec = selHero ? getLatest(selHero.name) : null;
    const latestCustomRec = wodName ? getLatest(wodName) : null;
    return (
      <div>
        <button onClick={()=>setPhase(selDay?"dayview":"calendar")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← {selDay?"날짜로":"달력"}</button>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[["hero","Hero WODs"],["custom","커스텀"]].map(([t,l])=>(
            <button key={t} onClick={()=>setCfTab(t)} style={{flex:1,padding:"9px",border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,cursor:"pointer",background:cfTab===t?C.accent:"transparent",color:cfTab===t?"#fff":C.muted,fontWeight:cfTab===t?600:400}}>{l}</button>
          ))}
        </div>
        {cfTab==="hero" && (
          <>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:6}}><Chip active={scaleMode==="rx"} onClick={()=>setScaleMode("rx")}>RX</Chip><Chip active={scaleMode==="scale"} onClick={()=>setScaleMode("scale")}>Scale</Chip></div>
              <div style={{display:"flex",gap:6}}><Chip active={gender==="m"} onClick={()=>setGender("m")}>남성</Chip><Chip active={gender==="f"} onClick={()=>setGender("f")}>여성</Chip></div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{heroWods.map(h=><Chip key={h.name} active={selHero?.name===h.name} onClick={()=>loadHero(h)}>{h.name}</Chip>)}</div>
            {selHero && (
              <GCard style={{background:"#1e2a3a"}}>
                {latestHeroRec && (
                  <div style={{background:"#1e3a1e",borderRadius:8,padding:"8px 10px",marginBottom:10,border:`0.5px solid ${C.green}`}}>
                    <p style={{fontSize:11,color:C.green,marginBottom:4}}>🏆 최근 기록 ({latestHeroRec.date})</p>
                    <p style={{fontSize:16,fontWeight:700,color:C.green}}>{latestHeroRec.score||"-"} <span style={{fontSize:11,color:C.muted}}>{latestHeroRec.scaleMode==="rx"?"RX":"Scale"}</span></p>
                    {latestHeroRec.memo && <p style={{fontSize:11,color:C.muted,marginTop:2}}>📝 {latestHeroRec.memo}</p>}
                  </div>
                )}
                <p style={{fontSize:14,fontWeight:700,color:C.accentL,marginBottom:4}}>{selHero.name}</p>
                <pre style={{fontSize:12,color:C.mutedL,whiteSpace:"pre-wrap",marginBottom:8,fontFamily:"inherit"}}>{selHero.desc}</pre>
                <p style={{fontSize:12,color:C.text}}>무게: <strong style={{color:scaleMode==="rx"?C.accentL:C.amber}}>{getHeroWeight(selHero)||"체중 무관"}</strong></p>
                {(selHero.scale?.note||selHero.scale?.[gender]) && <p style={{fontSize:11,color:scaleMode==="scale"?C.amber:C.muted,marginTop:4}}>Scale: {selHero.scale?.note||selHero.scale?.[gender]}</p>}
                <p style={{fontSize:12,color:C.muted,marginTop:4}}>예상 칼로리: <strong style={{color:C.green}}>{selHero.calFactor} kcal</strong></p>
                <PBtn onClick={()=>setCfTab("custom")} style={{marginTop:10}}>이 WOD로 진행 →</PBtn>
              </GCard>
            )}
          </>
        )}
        {cfTab==="custom" && (
          <>
            <GCard>
              <Lbl>WOD 이름</Lbl>
              <Inp value={wodName} onChange={e=>setWodName(e.target.value)} placeholder="예: Monday WOD" style={{marginBottom:10}}/>
              <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:6}}><Chip active={scaleMode==="rx"} onClick={()=>setScaleMode("rx")}>RX</Chip><Chip active={scaleMode==="scale"} onClick={()=>setScaleMode("scale")}>Scale</Chip></div>
                <div style={{display:"flex",gap:6}}><Chip active={gender==="m"} onClick={()=>setGender("m")}>남</Chip><Chip active={gender==="f"} onClick={()=>setGender("f")}>여</Chip></div>
              </div>
            </GCard>
            {latestCustomRec && (
              <GCard style={{background:"#1e2a1e",border:`0.5px solid ${C.green}`}}>
                <p style={{fontSize:11,color:C.green,marginBottom:4}}>🏆 "{wodName}" 최근 기록 ({latestCustomRec.date})</p>
                <p style={{fontSize:16,fontWeight:700,color:C.green}}>{latestCustomRec.score||"-"}</p>
                {latestCustomRec.memo && <p style={{fontSize:11,color:C.muted,marginTop:2}}>📝 {latestCustomRec.memo}</p>}
              </GCard>
            )}
            <GCard>
              <Lbl>CrossFit Games 포맷</Lbl>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{Object.keys(CF_SCORE_FORMATS).map(f=><Chip key={f} active={wodFormat===f} onClick={()=>setWodFormat(f)} style={{marginBottom:4}}>{f}</Chip>)}</div>
              <div style={{background:C.card2,borderRadius:8,padding:"6px 10px",marginBottom:10}}><p style={{fontSize:11,color:C.accentL}}>{fmt.hint}</p></div>
              {(wodFormat==="AMRAP"||isTimed) && <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:13,color:C.text}}>시간(분)</span><Inp type="number" min={1} max={120} value={totalMin} onChange={e=>setTotalMin(parseInt(e.target.value)||1)} style={{width:70,textAlign:"center"}}/></div>}
              {wodFormat==="EMOM" && <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,color:C.text}}>라운드</span><Inp type="number" min={1} value={rounds} onChange={e=>setRounds(parseInt(e.target.value)||1)} style={{width:52,textAlign:"center"}}/></div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,color:C.text}}>분당(초)</span><Inp type="number" min={30} max={120} value={roundSec} onChange={e=>setRoundSec(parseInt(e.target.value)||60)} style={{width:52,textAlign:"center"}}/></div></div>}
              {wodFormat==="Tabata" && <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{[["라운드",rounds,setRounds],["운동(초)",workSec,setWorkSec],["휴식(초)",restSec,setRestSec]].map(([l,v,s])=><div key={l} style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:C.text}}>{l}</span><Inp type="number" min={1} value={v} onChange={e=>s(parseInt(e.target.value)||1)} style={{width:50,textAlign:"center"}}/></div>)}</div>}
            </GCard>
            <GCard>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <Lbl style={{margin:0}}>운동 구성</Lbl>
                <button onClick={()=>setMovements(p=>[...p,{name:"버피",reps:10,weight:""}])} style={{fontSize:12,color:C.accentL,background:"none",border:"none",cursor:"pointer"}}>+ 추가</button>
              </div>
              {movements.map((m,i)=>(
                <div key={i} style={{display:"flex",gap:5,marginBottom:6,alignItems:"center"}}>
                  <Sel value={m.name} onChange={e=>setMovements(p=>{const a=[...p];a[i]={...a[i],name:e.target.value};return a;})} style={{flex:2}}>{CF_EXERCISES.map(e=><option key={e} value={e}>{e}</option>)}</Sel>
                  <NumInp value={m.reps} onChange={v=>setMovements(p=>{const a=[...p];a[i]={...a[i],reps:v};return a;})} placeholder="회" style={{width:46,padding:"6px 4px"}}/>
                  <Inp type="text" placeholder="무게" value={m.weight} onChange={e=>setMovements(p=>{const a=[...p];a[i]={...a[i],weight:e.target.value};return a;})} style={{width:46,padding:"6px 4px"}}/>
                  <button onClick={()=>setMovements(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:16}}>×</button>
                </div>
              ))}
            </GCard>
            <PBtn onClick={()=>startTimer(selDay||nowStr())}>타이머 시작 →</PBtn>
          </>
        )}
      </div>
    );
  }

  if(phase==="active") return (
    <div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          <circle cx={cx} cy={cy} r={r2} fill="none" stroke={C.border} strokeWidth={10}/>
          <circle cx={cx} cy={cy} r={r2} fill="none" stroke={tColor} strokeWidth={10} strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round" style={{transform:"rotate(-90deg)",transformOrigin:"100px 100px",transition:"stroke-dashoffset .5s"}}/>
          <text x={cx} y={cy-14} textAnchor="middle" fontSize={12} fill={C.muted}>{wodName||wodFormat}</text>
          <text x={cx} y={cy+14} textAnchor="middle" fontSize={32} fontWeight={700} fill={tColor}>{fmtT(wodFormat==="Tabata"?tabataSec:isTimed?elapsed:remaining)}</text>
          {(wodFormat==="EMOM"||wodFormat==="Tabata") && <text x={cx} y={cy+34} textAnchor="middle" fontSize={13} fill={C.muted}>R {curRound}</text>}
          {wodFormat==="Tabata" && <text x={cx} y={cy+52} textAnchor="middle" fontSize={12} fill={tColor}>{tabataPhase==="work"?"운동":"휴식"}</text>}
          {wodFormat==="AMRAP" && <text x={cx} y={cy+34} textAnchor="middle" fontSize={11} fill={C.muted}>남은 시간</text>}
        </svg>
      </div>
      <GCard>
        {movements.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",borderRadius:8,marginBottom:4,background:i===hlIdx?"#1e3a6e":C.card2,border:`${i===hlIdx?"1.5px":"0.5px"} solid ${i===hlIdx?C.accentL:C.border}`,transition:"all .3s"}}>
            <span style={{fontSize:14,fontWeight:i===hlIdx?700:400,color:i===hlIdx?C.accentL:C.text}}>{m.name}</span>
            <span style={{fontSize:13,color:i===hlIdx?C.accentL:C.muted}}>{m.reps}회{m.weight?` / ${m.weight}`:""}</span>
          </div>
        ))}
      </GCard>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <button onClick={()=>{clearInterval(intRef.current);setPhase("setup");}} style={{padding:11,border:`0.5px solid ${C.red}`,borderRadius:8,background:"transparent",color:C.red,cursor:"pointer",fontSize:13,fontWeight:500}}>중지</button>
        <button onClick={()=>{clearInterval(intRef.current);setPhase("score");}} style={{padding:11,background:C.green,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>완료 → 기록</button>
      </div>
    </div>
  );

  if(phase==="score") return (
    <div>
      <GCard style={{background:"#1e2a1e",border:`1.5px solid ${C.green}`}}>
        <p style={{fontSize:15,fontWeight:700,color:C.green,marginBottom:4}}>🏁 WOD 완료!</p>
        <p style={{fontSize:13,color:C.text,marginBottom:2}}>{wodName||wodFormat}</p>
        <p style={{fontSize:12,color:C.muted}}>경과 시간: {fmtT(elapsed)}</p>
      </GCard>
      <GCard>
        <Lbl>점수 입력 — {wodFormat}</Lbl>
        <div style={{background:C.card2,borderRadius:8,padding:"6px 10px",marginBottom:10}}><p style={{fontSize:11,color:C.accentL}}>{fmt.hint}</p></div>
        <Inp value={scoreInput} onChange={e=>setScoreInput(e.target.value)} placeholder={fmt.placeholder} style={{fontSize:18,fontWeight:700,textAlign:"center",marginBottom:10,color:C.green}}/>
        <Lbl>메모 (선택)</Lbl>
        <Inp value={memoInput} onChange={e=>setMemoInput(e.target.value)} placeholder="느낀 점, 컨디션, 스케일 내용 등"/>
      </GCard>
      <PBtn onClick={saveScore}>기록 저장 ✓</PBtn>
    </div>
  );

  if(phase==="done") {
    const lastRec = cfLog[activeDate]?.find(l=>l.name===(wodName||wodFormat))||null;
    const pr3=(profile.squat||0)+(profile.bench||0)+(profile.dead||0);
    const instaText = lastRec ? [
      `🏋️ ${lastRec.name}`,`📅 ${lastRec.date}${profile.nick?" @"+profile.nick:""}`,``,
      `📋 포맷: ${lastRec.format}`,`🏆 스코어: ${lastRec.score||"-"} ${lastRec.scaleMode==="rx"?"(RX)":"(Scale)"}`,``,
      ...(lastRec.movements||[]).map(m=>`  ▪ ${m.name} ${m.reps}회${m.weight?` / ${m.weight}`:""}`),``,
      `⏱ 운동 시간: ${fmtT(lastRec.tt)}`,`🔥 예상 칼로리: ${lastRec.cal} kcal`,
      pr3?`💪 3대 합계: ${pr3}kg`:"",``,
      `${HASHTAG} #크로스핏 #CrossFit #WOD #${lastRec.name.replace(/\s/g,"")}`
    ].filter(l=>l!==null).join("\n") : "";
    return (
      <div>
        <div style={{textAlign:"center",padding:"20px 0 12px"}}>
          <div style={{fontSize:40,marginBottom:8}}>🎉</div>
          <p style={{fontSize:18,fontWeight:700,color:C.green,marginBottom:4}}>기록 저장 완료!</p>
          {lastRec && <p style={{fontSize:14,color:C.accentL,fontWeight:600}}>{lastRec.name} — {lastRec.score||"-"}</p>}
        </div>
        {lastRec && (
          <GCard>
            <Lbl>운동일지 요약</Lbl>
            <pre style={{fontFamily:"monospace",fontSize:11,lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-all",background:C.card2,borderRadius:8,padding:12,maxHeight:200,overflowY:"auto",color:C.text}}>{instaText}</pre>
            <button onClick={()=>navigator.clipboard.writeText(instaText).then(()=>alert("복사 완료 ✓"))} style={{marginTop:8,padding:"6px 14px",border:`0.5px solid ${C.border}`,borderRadius:7,background:"transparent",color:C.accentL,cursor:"pointer",fontSize:12}}>텍스트 복사</button>
          </GCard>
        )}
        <PBtn onClick={()=>setPhase("calendar")}>달력으로 →</PBtn>
      </div>
    );
  }
  return null;
}

function TrashModal({trash,onRestore,onDelete,onClose}) {
  const now=Date.now();
  const remainHours=item=>Math.max(0,Math.ceil((3*24*60*60*1000-(now-item.deletedAt))/3600000));
  const typeLabel=t=>t==="workout"?"🏋️ 운동":"🏅 CF";
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:200,overflowY:"auto",paddingTop:20}} onClick={onClose}>
      <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:16,padding:20,width:380,maxWidth:"95vw",marginBottom:20}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:16,fontWeight:600,color:C.text}}>🗑 휴지통</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted}}>✕</button>
        </div>
        <p style={{fontSize:11,color:C.muted,marginBottom:14}}>삭제 후 3일간 보관 · 복원 가능</p>
        {trash.length===0
          ? <p style={{textAlign:"center",color:C.muted,padding:"30px 0",fontSize:13}}>휴지통이 비어있습니다</p>
          : [...trash].reverse().map(item=>(
            <div key={item.id} style={{background:C.card2,borderRadius:10,padding:12,marginBottom:8,border:`0.5px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div>
                  <span style={{fontSize:12,color:C.muted}}>{typeLabel(item.type)} · {item.day}</span>
                  <p style={{fontSize:14,fontWeight:600,color:C.text,marginTop:2}}>{item.data.routineName||item.data.name||"-"}</p>
                </div>
                <span style={{fontSize:10,color:remainHours(item)<24?C.red:C.amber,background:remainHours(item)<24?"#2a1010":"#2a1e00",padding:"2px 8px",borderRadius:8,whiteSpace:"nowrap"}}>{remainHours(item)}시간 후 만료</span>
              </div>
              {item.type==="workout" && (
                <p style={{fontSize:11,color:C.muted,marginBottom:8}}>
                  {(item.data.exercises||[]).map(e=>e.name).join(" · ")}
                </p>
              )}
              {item.type==="cf" && (
                <p style={{fontSize:11,color:C.muted,marginBottom:8}}>
                  {item.data.format} · {item.data.score||"-"}
                </p>
              )}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>onRestore(item.id,item.type)} style={{flex:2,padding:"7px",border:`0.5px solid ${C.green}`,borderRadius:7,background:"transparent",color:C.green,cursor:"pointer",fontSize:12,fontWeight:600}}>복원</button>
                <button onClick={()=>onDelete(item.id)} style={{flex:1,padding:"7px",border:`0.5px solid ${C.red}`,borderRadius:7,background:"transparent",color:C.red,cursor:"pointer",fontSize:12}}>영구삭제</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function GoalBanner({goal}) {
  const [vis,setVis]=useState(true);
  useEffect(()=>{const t=setInterval(()=>setVis(p=>!p),1400);return()=>clearInterval(t);},[]);
  if(!goal) return null;
  return (
    <div style={{position:"fixed",bottom:72,left:0,right:0,zIndex:40,textAlign:"center",pointerEvents:"none"}}>
      <span style={{fontSize:12,color:C.gold,fontWeight:600,opacity:vis?1:0.3,transition:"opacity 1.2s",background:"rgba(15,17,23,0.88)",padding:"4px 14px",borderRadius:12,border:`0.5px solid ${C.gold}55`}}>🎯 {goal}</span>
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("workout");
  const [profile,setProfile]=useState(()=>ls("profile",{squat:0,bench:0,dead:0,weight:70,nick:"",photo:null,goal:"",warmupSets:0,mainSets:3,cooldownSets:0,keepAwake:false}));
  const [history,setHistory]=useState(()=>ls("history",[]));
  const [workoutLog,setWorkoutLog]=useState(()=>ls("workoutLog",{}));
  const [cfLog,setCfLog]=useState(()=>ls("cfLog",{}));
  const [savedRoutines,setSavedRoutines]=useState(()=>ls("savedRoutines",[]));
  const [showProfile,setShowProfile]=useState(false);
  const [showProgramEdit,setShowProgramEdit]=useState(false);
  const [programs,setPrograms]=useState(()=>ls("customPrograms",DEFAULT_PROGRAMS));
  const [heroWods,setHeroWods]=useState(()=>ls("customHeroWods",DEFAULT_HERO_WODS));
  const [liveState,setLiveState]=useState(null);
  const [showTrash,setShowTrash]=useState(false);

  // 휴지통: {id, type:"workout"|"cf", day, logIdx, data, deletedAt}
  const [trash,setTrash]=useState(()=>{
    const raw=ls("trash",[]);
    const now=Date.now();
    const valid=raw.filter(item=>now-item.deletedAt < 3*24*60*60*1000);
    if(valid.length!==raw.length) lsSave("trash",valid);
    return valid;
  });

  const moveToTrash=(type,day,logIdx,data)=>{
    const item={id:Date.now(),type,day,logIdx,data,deletedAt:Date.now()};
    const nt=[...trash,item];
    setTrash(nt);lsSave("trash",nt);
  };

  const restoreFromTrash=(id,type)=>{
    const item=trash.find(t=>t.id===id);
    if(!item)return;
    if(type==="workout"){
      setWorkoutLog(p=>{const n={...p,[item.day]:[...(p[item.day]||[]),item.data]};lsSave("workoutLog",n);return n;});
    } else {
      setCfLog(p=>{const n={...p,[item.day]:[...(p[item.day]||[]),item.data]};lsSave("cfLog",n);return n;});
    }
    const nt=trash.filter(t=>t.id!==id);
    setTrash(nt);lsSave("trash",nt);
  };

  const deleteFromTrash=(id)=>{
    const nt=trash.filter(t=>t.id!==id);
    setTrash(nt);lsSave("trash",nt);
  };

  // profile은 명시적 save 시에만 저장 (useEffect 자동저장 제거 - 초기값 덮어쓰기 버그 방지)
  // lsSave("profile") 은 ProfileModal의 save() 함수에서만 호출됨

  const handleSavePrograms=(updated)=>{setPrograms(updated);lsSave("customPrograms",updated);};
  const handleSaveHeroWods=(updated)=>{setHeroWods(updated);lsSave("customHeroWods",updated);};

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"12px 12px 80px",fontFamily:"system-ui,sans-serif",background:C.bg,minHeight:"100vh",position:"relative"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,backgroundImage:`url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80')`,backgroundSize:"cover",backgroundPosition:"center",opacity:0.07,pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,zIndex:0,background:`linear-gradient(180deg,${C.bg} 0%,rgba(15,17,23,0.96) 100%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:C.accentL,letterSpacing:-0.5}}>{APP_NAME}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:1,fontStyle:"italic"}}>{VERSE}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setShowTrash(true)} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,color:trash.length>0?C.red:C.muted,fontWeight:600,position:"relative"}}>
              🗑{trash.length>0 && <span style={{position:"absolute",top:-4,right:-4,background:C.red,borderRadius:"50%",width:14,height:14,fontSize:9,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{trash.length}</span>}
            </button>
            <button onClick={()=>setShowProgramEdit(true)} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,color:C.accentL,fontWeight:600}}>편집</button>
            <button onClick={()=>setShowProfile(true)} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:"50%",width:38,height:38,cursor:"pointer",overflow:"hidden",padding:0,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {profile.photo?<img alt="profile" src={profile.photo} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:18}}>👤</span>}
            </button>
          </div>
        </div>
        {/* 운동 진행 중 배너 - 다른 탭에서도 표시 */}
        {liveState?.phase==="live" && tab!=="workout" && (
          <div onClick={()=>setTab("workout")} style={{background:"#0d1a0d",border:`2px solid ${C.green}`,borderRadius:10,padding:"10px 14px",marginBottom:12,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:C.green,fontWeight:600}}>🏋️ 운동 진행 중</span>
            <span style={{fontSize:12,color:C.accentL}}>돌아가기 →</span>
          </div>
        )}
        {/* WorkoutScreen은 언마운트하지 않고 숨김 처리 */}
        <div style={{display:tab==="workout"?"block":"none"}}>
          <WorkoutScreen profile={profile} workoutLog={workoutLog} setWorkoutLog={setWorkoutLog} cfLog={cfLog} savedRoutines={savedRoutines} setSavedRoutines={setSavedRoutines} programs={programs} heroWods={heroWods} liveState={liveState} setLiveState={setLiveState} moveToTrash={moveToTrash}/>
        </div>
        <div style={{display:tab==="1rm"?"block":"none"}}>
          <OneRMScreen profile={profile}/>
        </div>
        <div style={{display:tab==="crossfit"?"block":"none"}}>
          <CrossfitScreen cfLog={cfLog} setCfLog={setCfLog} workoutLog={workoutLog} profile={profile} heroWods={heroWods} moveToTrash={moveToTrash}/>
        </div>
      </div>
      <GoalBanner goal={profile.goal}/>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.card,borderTop:`0.5px solid ${C.border}`,display:"flex",zIndex:50}}>
        {[["workout","🏋️","Workout"],["1rm","📊","1RM"],["crossfit","🏅","CrossFit"]].map(([t,icon,label])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"10px 4px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:20}}>{icon}</span>
            <span style={{fontSize:11,color:tab===t?C.accentL:C.muted,fontWeight:tab===t?700:400}}>{label}</span>
          </button>
        ))}
      </div>
      {showProfile && <ProfileModal profile={profile} setProfile={setProfile} history={history} setHistory={setHistory} workoutLog={workoutLog} cfLog={cfLog} onClose={()=>setShowProfile(false)}/>}
      {showProgramEdit && <ProgramEditModal programs={programs} heroWods={heroWods} onSavePrograms={handleSavePrograms} onSaveHeroWods={handleSaveHeroWods} onClose={()=>setShowProgramEdit(false)}/>}
      {showTrash && <TrashModal trash={trash} onRestore={restoreFromTrash} onDelete={deleteFromTrash} onClose={()=>setShowTrash(false)}/>}
    </div>
  );
}
