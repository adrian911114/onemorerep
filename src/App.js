import { useState, useEffect, useRef, useMemo } from "react";

const APP_NAME = "One More Rep_SOL";
const HASHTAG = "#onemorerepsol";
const VERSE = "100% is not enough. The next step is 101%.";
const EPLEY = [100,95,91,88,85,83,80,78,76,74,72,70];

const EXERCISES = {
  등:["랫풀다운 (케이블)","시티드 로우 (케이블)","바벨 로우","덤벨 로우","풀업","케이블 풀오버","티바 로우","데드리프트"],
  가슴:["벤치프레스 (바벨)","인클라인 벤치프레스","덤벨 플라이","케이블 크로스오버","딥스","머신 체스트프레스","펙덱 플라이"],
  어깨:["오버헤드프레스 (바벨)","덤벨 숄더프레스","사이드 레터럴 레이즈","프런트 레이즈","리어 델트 플라이","페이스풀 (케이블)","업라이트 로우"],
  하체:["스쿼트 (바벨)","레그프레스","레그 익스텐션","레그 컬","루마니안 데드리프트","힙 쓰러스트","런지","스미스 스쿼트"],
  팔:["바벨 컬","해머 컬","케이블 컬","트라이셉스 푸시다운","스컬크러셔","오버헤드 트라이셉스"],
  복근:["크런치","레그레이즈","케이블 크런치","플랭크","AB롤아웃"],
};
const MUSCLE_TABS = Object.keys(EXERCISES);

const CF_SCORE_FORMATS = {
  "AMRAP":             { scoreType:"rounds+reps", hint:"완료 라운드 + 잔여 렙 (예: 15+8)",  placeholder:"15+8" },
  "For Time":          { scoreType:"time",        hint:"완료 시간 mm:ss (예: 12:34)",        placeholder:"12:34" },
  "EMOM":              { scoreType:"rounds",      hint:"완료한 라운드 수 (예: 28/30)",       placeholder:"28/30" },
  "Tabata":            { scoreType:"reps",        hint:"최저 렙 수 기준 (예: 8)",            placeholder:"8" },
  "Max Load":          { scoreType:"weight",      hint:"최고 무게 kg (예: 120)",             placeholder:"120" },
  "Max Reps":          { scoreType:"reps",        hint:"최고 렙 수 (예: 50)",               placeholder:"50" },
  "3 Rounds For Time": { scoreType:"time",        hint:"완료 시간 mm:ss (예: 18:45)",        placeholder:"18:45" },
  "5 Rounds For Time": { scoreType:"time",        hint:"완료 시간 mm:ss (예: 25:10)",        placeholder:"25:10" },
  "Death By":          { scoreType:"rounds",      hint:"완료한 마지막 라운드 (예: R12+3)",   placeholder:"R12+3" },
  "Custom":            { scoreType:"custom",      hint:"자유 기록",                          placeholder:"기록 입력" },
};

const HERO_WODS = [
  {name:"Murph",desc:"For Time (20lb vest)\n1mi Run→100 Pull-ups→200 Push-ups→300 Air Squats→1mi Run",mode:"For Time",totalMin:60,calFactor:600,rx:{note:"20lb 조끼"},scale:{note:"조끼 없이 / 풀업→링 로우"},movements:[{name:"달리기(mile)",reps:1,weight:""},{name:"풀업",reps:100,weight:""},{name:"푸시업",reps:200,weight:""},{name:"에어 스쿼트",reps:300,weight:""},{name:"달리기(mile)",reps:1,weight:""}]},
  {name:"Cindy",desc:"AMRAP 20\n5 Pull-ups / 10 Push-ups / 15 Air Squats",mode:"AMRAP",totalMin:20,calFactor:250,rx:{note:"Kipping 허용"},scale:{note:"밴드 풀업 / 무릎 푸시업"},movements:[{name:"풀업",reps:5,weight:""},{name:"푸시업",reps:10,weight:""},{name:"에어 스쿼트",reps:15,weight:""}]},
  {name:"Fran",desc:"For Time: 21-15-9\nThrusters / Pull-ups",mode:"For Time",totalMin:15,calFactor:150,rx:{m:"43kg",f:"29kg"},scale:{m:"30kg",f:"20kg"},movements:[{name:"쓰러스터",reps:21,weight:"43/29kg"},{name:"풀업",reps:21,weight:""},{name:"쓰러스터",reps:15,weight:"43/29kg"},{name:"풀업",reps:15,weight:""},{name:"쓰러스터",reps:9,weight:"43/29kg"},{name:"풀업",reps:9,weight:""}]},
  {name:"Helen",desc:"For Time: 3 Rounds\n400m Run / 21 KB Swings / 12 Pull-ups",mode:"3 Rounds For Time",totalMin:20,calFactor:200,rx:{m:"24kg",f:"16kg"},scale:{m:"16kg",f:"12kg"},movements:[{name:"달리기(400m)",reps:1,weight:""},{name:"케틀벨 스윙",reps:21,weight:"24/16kg"},{name:"풀업",reps:12,weight:""}]},
  {name:"Grace",desc:"For Time: 30 Clean & Jerks",mode:"For Time",totalMin:10,calFactor:120,rx:{m:"61kg",f:"43kg"},scale:{m:"43kg",f:"30kg"},movements:[{name:"클린앤저크",reps:30,weight:"61/43kg"}]},
  {name:"Isabel",desc:"For Time: 30 Snatches",mode:"For Time",totalMin:10,calFactor:120,rx:{m:"61kg",f:"43kg"},scale:{m:"43kg",f:"30kg"},movements:[{name:"스내치",reps:30,weight:"61/43kg"}]},
  {name:"Annie",desc:"For Time: 50-40-30-20-10\nDouble Unders / Sit-ups",mode:"For Time",totalMin:15,calFactor:130,rx:{note:"더블 언더"},scale:{note:"싱글 언더 ×3"},movements:[{name:"더블 언더",reps:50,weight:""},{name:"싯업",reps:50,weight:""}]},
  {name:"Diane",desc:"For Time: 21-15-9\nDeadlift / HSPU",mode:"For Time",totalMin:15,calFactor:160,rx:{m:"102kg",f:"70kg"},scale:{m:"70kg",f:"50kg"},movements:[{name:"데드리프트",reps:21,weight:"102/70kg"},{name:"핸드스탠드 푸시업",reps:21,weight:""},{name:"데드리프트",reps:15,weight:"102/70kg"},{name:"핸드스탠드 푸시업",reps:15,weight:""},{name:"데드리프트",reps:9,weight:"102/70kg"},{name:"핸드스탠드 푸시업",reps:9,weight:""}]},
  {name:"Chelsea",desc:"EMOM 30\n5 Pull-ups / 10 Push-ups / 15 Air Squats",mode:"EMOM",rounds:30,roundSec:60,calFactor:300,rx:{note:"모든 라운드 완료"},scale:{note:"렙 수 줄이기"},movements:[{name:"풀업",reps:5,weight:""},{name:"푸시업",reps:10,weight:""},{name:"에어 스쿼트",reps:15,weight:""}]},
  {name:"Barbara",desc:"5 Rounds For Time (3min rest)\n20 Pull-ups / 30 Push-ups / 40 Sit-ups / 50 Air Squats",mode:"5 Rounds For Time",rounds:5,roundSec:180,calFactor:380,rx:{note:"스트릭 풀업"},scale:{note:"밴드 풀업"},movements:[{name:"풀업",reps:20,weight:""},{name:"푸시업",reps:30,weight:""},{name:"싯업",reps:40,weight:""},{name:"에어 스쿼트",reps:50,weight:""}]},
];

const CF_EXERCISES = ["버피","더블 언더","케틀벨 스윙","월볼","토투바","핸드스탠드 푸시업","로잉(m)","클린앤저크","스내치","쓰러스터","데드리프트","파워 클린","런지","풀업","푸시업","싯업","에어 스쿼트","프런트 스쿼트","박스 점프","달리기(400m)","달리기(mile)","로프 클라임","머슬업","피스톨 스쿼트","GHD 싯업"];

const fmtT = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const nowStr = () => { const d=new Date(); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`; };
const mkKey = (y,m,d) => `${y}.${String(m+1).padStart(2,"0")}.${String(d).padStart(2,"0")}`;
const dataSize = obj => (new Blob([JSON.stringify(obj)]).size/1024/1024).toFixed(2);

const C = {bg:"#0f1117",card:"#1a1d26",card2:"#22263a",border:"#2a2e45",accent:"#3a7bd5",accentL:"#5b9af8",green:"#22c55e",red:"#ef4444",amber:"#f59e0b",gold:"#fbbf24",text:"#e8eaf0",muted:"#8892a4",mutedL:"#aab4c4"};

// ── Primitives ────────────────────────────────────────────────────────────
const PBtn = ({children,onClick,style={}}) => (
  <button onClick={onClick} style={{background:C.accent,color:"#fff",border:"none",borderRadius:9,padding:"12px 16px",cursor:"pointer",fontWeight:600,fontSize:14,width:"100%",...style}}>{children}</button>
);
const GCard = ({children,style={}}) => (
  <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,...style}}>{children}</div>
);
const Lbl = ({children,style={}}) => <div style={{fontSize:11,color:C.muted,marginBottom:5,...style}}>{children}</div>;
const Inp = ({style={},...p}) => <input {...p} style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:7,padding:"8px 10px",fontSize:13,color:C.text,width:"100%",...style}} />;
const Sel = ({children,style={},...p}) => <select {...p} style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:7,padding:"7px 8px",fontSize:12,color:C.text,...style}}>{children}</select>;
const Chip = ({children,active,onClick,style={}}) => (
  <button onClick={onClick} style={{padding:"5px 12px",border:`0.5px solid ${active?C.accentL:C.border}`,borderRadius:16,fontSize:12,cursor:"pointer",background:active?"#1e3a6e":"transparent",color:active?C.accentL:C.muted,whiteSpace:"nowrap",...style}}>{children}</button>
);
const NumInp = ({value,onChange,placeholder="",disabled=false,style={}}) => (
  <input type="text" inputMode="decimal" placeholder={placeholder} value={value} disabled={disabled}
    onChange={e=>onChange(e.target.value.replace(/[^0-9.]/g,""))}
    style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:7,padding:"6px 4px",fontSize:13,color:C.text,width:"100%",textAlign:"center",...style}} />
);

// ── Sparkline ─────────────────────────────────────────────────────────────
function Spark({data,color=C.accentL,labels}) {
  if (!data||data.length<2) return <span style={{fontSize:11,color:C.muted}}>기록 2회 이상 필요</span>;
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

// ── Shared Calendar ───────────────────────────────────────────────────────
function CalendarView({workoutLog,cfLog,onSelectDay}) {
  const now = new Date();
  const [ym,setYm] = useState({y:now.getFullYear(),m:now.getMonth()});
  const firstDay = new Date(ym.y,ym.m,1).getDay();
  const daysInMonth = new Date(ym.y,ym.m+1,0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({length:daysInMonth},(_,i)=>i+1));
  while(cells.length%7!==0) cells.push(null);
  const ms = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const mStr = `${ym.y}.${String(ym.m+1).padStart(2,"0")}`;
  const monthW = Object.keys(workoutLog).filter(k=>k.startsWith(mStr)&&workoutLog[k]?.length>0).length;
  const monthC = Object.keys(cfLog).filter(k=>k.startsWith(mStr)&&cfLog[k]?.length>0).length;
  const yearW  = Object.keys(workoutLog).filter(k=>k.startsWith(`${ym.y}`)&&workoutLog[k]?.length>0).length;
  const yearC  = Object.keys(cfLog).filter(k=>k.startsWith(`${ym.y}`)&&cfLog[k]?.length>0).length;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>setYm(p=>p.m===0?{y:p.y-1,m:11}:{...p,m:p.m-1})} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted}}>‹</button>
        <span style={{fontWeight:600,fontSize:15,color:C.text}}>{ym.y}년 {ms[ym.m]}</span>
        <button onClick={()=>setYm(p=>p.m===11?{y:p.y+1,m:0}:{...p,m:p.m+1})} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:10}}>
        {[["이달 운동",monthW,C.green],["이달 CF",monthC,C.accentL],[`${ym.y} 운동`,yearW,C.green],[`${ym.y} CF`,yearC,C.accentL]].map(([l,v,col])=>(
          <div key={l} style={{background:col+"18",borderRadius:8,padding:"6px 4px",textAlign:"center"}}>
            <div style={{fontSize:9,color:col,marginBottom:1}}>{l}</div>
            <div style={{fontSize:18,fontWeight:700,color:col}}>{v}일</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:8,fontSize:10,color:C.muted}}>
        {[["#22c55e","운동"],["#5b9af8","CrossFit"],["#fbbf24","둘 다"]].map(([bg,label])=>(
          <span key={label} style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:10,height:10,background:bg,borderRadius:2,display:"inline-block"}}/>{label}
          </span>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:3}}>
        {["일","월","화","수","목","금","토"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:C.muted,padding:"3px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((d,i)=>{
          const key = d ? mkKey(ym.y,ym.m,d) : null;
          const hasW = !!(key&&workoutLog[key]?.length>0);
          const hasC = !!(key&&cfLog[key]?.length>0);
          const both = hasW&&hasC;
          const isToday = !!(d&&now.getFullYear()===ym.y&&now.getMonth()===ym.m&&now.getDate()===d);
          const bg = isToday?"#3a7bd5":both?C.gold:hasW?C.green:hasC?C.accentL:"transparent";
          const col = isToday?"#fff":(both||hasW||hasC)?"#000":d?C.text:"transparent";
          return (
            <div key={i} onClick={()=>{ if(d&&key) onSelectDay(key); }}
              style={{textAlign:"center",padding:"5px 2px",borderRadius:7,fontSize:13,cursor:d?"pointer":"default",background:bg,color:col,fontWeight:(isToday||hasW||hasC)?700:400,minHeight:30,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {d||""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Profile Modal ─────────────────────────────────────────────────────────
function ProfileModal({profile,setProfile,history,setHistory,workoutLog,cfLog,onClose}) {
  const [ptab,setPtab] = useState("기본");
  const [form,setForm] = useState({...profile});
  const fileRef = useRef();
  const bgRef   = useRef();

  const save = () => {
    setProfile({...form});
    setHistory(p=>[...p,{date:nowStr(),weight:parseFloat(form.weight)||0,squat:parseFloat(form.squat)||0,bench:parseFloat(form.bench)||0,dead:parseFloat(form.dead)||0}]);
    onClose();
  };
  const handlePhoto = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setForm(p=>({...p,photo:ev.target.result})); r.readAsDataURL(f); };
  const handleBg   = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setForm(p=>({...p,bgPhoto:ev.target.result})); r.readAsDataURL(f); };
  const total = (parseFloat(form.squat)||0)+(parseFloat(form.bench)||0)+(parseFloat(form.dead)||0);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onClose}>
      <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:16,padding:20,width:360,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:16,fontWeight:600,color:C.text}}>개인 설정</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted}}>✕</button>
        </div>
        <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Workout: {dataSize(workoutLog)} MB · CrossFit: {dataSize(cfLog)} MB</div>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {["기본","히스토리"].map(t=>(
            <button key={t} onClick={()=>setPtab(t)} style={{flex:1,padding:7,border:`0.5px solid ${C.border}`,borderRadius:8,background:ptab===t?C.accent:"transparent",color:ptab===t?"#fff":C.muted,cursor:"pointer",fontSize:13}}>{t}</button>
          ))}
        </div>

        {ptab==="기본" && (
          <>
            {/* Profile photo */}
            <div style={{textAlign:"center",marginBottom:14}}>
              <div onClick={()=>fileRef.current.click()} style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 8px",cursor:"pointer",overflow:"hidden",background:C.card2,display:"flex",alignItems:"center",justifyContent:"center",border:`2px dashed ${C.border}`}}>
                {form.photo ? <img alt="profile" src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:28}}>👤</span>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
              <button onClick={()=>fileRef.current.click()} style={{fontSize:12,color:C.accentL,background:"none",border:"none",cursor:"pointer"}}>프로필 사진 변경</button>
            </div>
            {/* BG photo */}
            <Lbl>앱 배경 사진 (투명도 50%)</Lbl>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14}}>
              <div onClick={()=>bgRef.current.click()} style={{width:60,height:40,borderRadius:8,overflow:"hidden",background:C.card2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`1px dashed ${C.border}`,flexShrink:0}}>
                {form.bgPhoto ? <img alt="background" src={form.bgPhoto} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:20}}>🖼️</span>}
              </div>
              <input ref={bgRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleBg}/>
              <div>
                <button onClick={()=>bgRef.current.click()} style={{fontSize:12,color:C.accentL,background:"none",border:"none",cursor:"pointer",display:"block",marginBottom:4}}>배경 사진 등록</button>
                    {form.bgPhoto && <button onClick={()=>setForm(p=>({...p,bgPhoto:null}))} style={{fontSize:11,color:C.red,background:"none",border:"none",cursor:"pointer"}}>배경 제거</button>}
              </div>
            </div>
            {/* Default set structure */}
            <Lbl style={{marginTop:4}}>기본 세트 구성 (운동 시작 시 자동 적용)</Lbl>
            <div style={{background:C.card2,borderRadius:10,padding:12,marginBottom:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                {[["warmupSets","웜업 세트","0"],["mainSets","메인 세트","3"],["cooldownSets","쿨다운 세트","0"]].map(([k,l,ph])=>(
                  <div key={k}>
                    <Lbl>{l}</Lbl>
                    <Inp type="number" min={0} max={8} value={form[k]??ph} onChange={e=>setForm(p=>({...p,[k]:parseInt(e.target.value)||0}))} style={{textAlign:"center",padding:6}}/>
                  </div>
                ))}
              </div>
              <p style={{fontSize:10,color:C.muted}}>웜업·쿨다운은 볼륨 집계에서 제외됩니다. 운동 중 M버튼으로 메인 전환 가능.</p>
            </div>
            {/* Basic info */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[["nick","닉네임","text"],["weight","체중 (kg)","number"]].map(([k,l,t])=>(
                <div key={k}><Lbl>{l}</Lbl><Inp type={t} value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{textAlign:"center"}}/></div>
              ))}
            </div>
            <Lbl>3대 운동 1RM (kg)</Lbl>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[["squat","스쿼트"],["bench","벤치"],["dead","데드"]].map(([k,l])=>(
                <div key={k}><Lbl>{l}</Lbl><NumInp value={form[k]||""} onChange={v=>setForm(p=>({...p,[k]:v}))} style={{padding:8,width:"100%"}}/></div>
              ))}
            </div>
            <Lbl>목표 (하단 배너)</Lbl>
            <Inp value={form.goal||""} onChange={e=>setForm(p=>({...p,goal:e.target.value}))} placeholder="예: 데드리프트 200kg" style={{marginBottom:12}}/>
            <div style={{background:"#1e3a6e",borderRadius:10,padding:12,textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:11,color:C.accentL,marginBottom:4}}>3대 합계 (설정값)</div>
              <div style={{fontSize:26,fontWeight:700,color:"#fff"}}>{total} kg</div>
            </div>
            <PBtn onClick={save}>저장</PBtn>
          </>
        )}

        {ptab==="히스토리" && (
          history.length===0
            ? <p style={{color:C.muted,textAlign:"center",padding:"30px 0",fontSize:13}}>기록 없음</p>
            : (
              <>
                {[["체중","weight",C.accentL],["스쿼트","squat",C.red],["벤치","bench",C.green],["데드","dead",C.amber]].map(([label,key,color])=>(
                  <div key={key} style={{marginBottom:14}}>
                    <p style={{fontSize:13,fontWeight:500,marginBottom:6,color:C.text}}>{label}</p>
                    <Spark data={history.map(h=>h[key])} color={color} labels={history.map(h=>h.date?.slice(5))}/>
                  </div>
                ))}
                <Lbl>기록 이력 (탭→삭제)</Lbl>
                {history.map((h,i)=>(
                  <div key={i} onClick={()=>{ if(window.confirm(`${h.date} 삭제?`)) setHistory(p=>p.filter((_,j)=>j!==i)); }}
                    style={{fontSize:12,padding:"6px 8px",marginBottom:4,borderRadius:6,border:`0.5px solid ${C.border}`,display:"flex",justifyContent:"space-between",color:C.text,cursor:"pointer",background:C.card2}}>
                    <span style={{color:C.muted}}>{h.date}</span>
                    <span>{h.weight}kg | S{h.squat}/B{h.bench}/D{h.dead} <span style={{color:C.red}}>✕</span></span>
                  </div>
                ))}
              </>
            )
        )}
      </div>
    </div>
  );
}

// ── 1RM Screen ────────────────────────────────────────────────────────────
function OneRMScreen({profile}) {
  return (
    <div>
      <p style={{fontSize:15,fontWeight:600,marginBottom:4,color:C.text}}>1RM 추정 무게표</p>
      <p style={{fontSize:11,color:C.muted,marginBottom:14}}>Epley 공식 기반. 메인 세트 무게가 몇 % 강도인지 확인하고 볼륨을 설계하는 데 활용하세요.</p>
      {[["스쿼트",profile.squat,C.red],["벤치프레스",profile.bench,C.accentL],["데드리프트",profile.dead,C.amber]].map(([lift,rm,color])=>(
        <GCard key={lift}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontWeight:600,fontSize:14,color:C.text}}>{lift}</span>
            {rm ? <span style={{fontSize:13,color,background:color+"22",padding:"3px 10px",borderRadius:12}}>1RM {rm}kg</span>
                : <span style={{fontSize:12,color:C.muted}}>미설정</span>}
          </div>
          {!rm
            ? <p style={{fontSize:12,color:C.muted,textAlign:"center",padding:"10px 0"}}>개인 설정에서 1RM 입력</p>
            : (
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{background:C.card2}}>
                    {["렙","% 1RM","추정 무게","세트 볼륨"].map(h=>(
                      <th key={h} style={{padding:"5px 6px",textAlign:h==="렙"?"left":"right",borderBottom:`1px solid ${C.border}`,fontWeight:500,color:C.mutedL}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EPLEY.map((pct,i)=>{
                    const w=Math.round(rm*pct/100*4)/4;
                    return (
                      <tr key={i} style={{background:i%2?C.card2:"transparent"}}>
                        <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`,color:C.text}}>{i+1}회</td>
                        <td style={{padding:"4px 6px",textAlign:"right",borderBottom:`1px solid ${C.border}`,color,fontWeight:500}}>{pct}%</td>
                        <td style={{padding:"4px 6px",textAlign:"right",borderBottom:`1px solid ${C.border}`,color:C.text,fontWeight:500}}>{w}kg</td>
                        <td style={{padding:"4px 6px",textAlign:"right",borderBottom:`1px solid ${C.border}`,color:C.muted}}>{Math.round(w*(i+1))}kg</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          }
        </GCard>
      ))}
    </div>
  );
}

// ── Workout Screen ────────────────────────────────────────────────────────
function WorkoutScreen({profile,workoutLog,setWorkoutLog,cfLog,savedRoutines,setSavedRoutines}) {
  const [phase,setPhase]   = useState("calendar");
  const [selDay,setSelDay] = useState(null);
  const [selMuscle,setSelMuscle] = useState("등");
  const [selExs,setSelExs]       = useState([]);
  const [customExs,setCustomExs] = useState({});
  const [customInput,setCustomInput] = useState("");
  const [routineName,setRoutineName] = useState("");
  const [workoutData,setWorkoutData] = useState([]);
  const [curExIdx,setCurExIdx]       = useState(0);
  const [startTime,setStartTime]     = useState(null);
  const [isResting,setIsResting]     = useState(false);
  const [restStart,setRestStart]     = useState(null);
  const [totalRestSec,setTotalRestSec] = useState(0);
  const [curRestSec,setCurRestSec]     = useState(0);
  const [totalSec,setTotalSec]         = useState(0);
  const [restLogs,setRestLogs]         = useState({});
  const [summary,setSummary]           = useState(null);
  const [showSave,setShowSave]         = useState(false);
  const [newName,setNewName]           = useState("");
  const [activeDate,setActiveDate]     = useState(nowStr());
  const timerRef = useRef(null);

  useEffect(()=>{
    if(phase==="live"&&startTime){
      timerRef.current=setInterval(()=>{
        setTotalSec(Math.floor((Date.now()-startTime)/1000));
        if(isResting&&restStart) setCurRestSec(Math.floor((Date.now()-restStart)/1000));
      },1000);
    }
    return()=>clearInterval(timerRef.current);
  },[phase,startTime,isResting,restStart]);

  const allEx = [...(EXERCISES[selMuscle]||[]),...(customExs[selMuscle]||[])];

  const toggleEx = name => setSelExs(p=>p.find(e=>e.name===name)?p.filter(e=>e.name!==name):[...p,{name,sets:3,rir:2}]);
  const updateSelEx = (i,f,v) => setSelExs(p=>{const a=[...p];a[i]={...a[i],[f]:v};return a;});
  const loadRoutine = r => { setSelExs(r.exercises.map(e=>({...e}))); setRoutineName(r.name); };
  const saveRoutine = () => { if(!newName.trim())return; setSavedRoutines(p=>[...p,{name:newName,exercises:selExs}]); setShowSave(false); setNewName(""); };

  const getBestWeight = name => {
    let best=0;
    Object.values(workoutLog).forEach(logs=>logs.forEach(log=>(log.exercises||[]).forEach(ex=>{
      if(ex.name===name) ex.sets.filter(s=>s.isMain&&s.weight).forEach(s=>{const w=parseFloat(s.weight);if(w>best)best=w;});
    })));
    return best||"";
  };

  const startWorkout = dateForRecord => {
    if(!selExs.length){ alert("운동을 1개 이상 선택해주세요"); return; }
    const rn = routineName||"오늘의 운동";
    setRoutineName(rn);
    setActiveDate(dateForRecord||nowStr());
    setWorkoutData(selExs.map(ex=>{
      const warmup = parseInt(profile.warmupSets)||0;
      const main   = ex.sets || parseInt(profile.mainSets)||3;
      const cool   = parseInt(profile.cooldownSets)||0;
      const sets = [
        ...Array.from({length:warmup},  ()=>({weight:"",reps:"",isMain:false,isWarmup:true,isCooldown:false,done:false})),
        ...Array.from({length:main},    ()=>({weight:"",reps:"",isMain:true, isWarmup:false,isCooldown:false,done:false})),
        ...Array.from({length:cool},    ()=>({weight:"",reps:"",isMain:false,isWarmup:false,isCooldown:true, done:false})),
      ];
      return {name:ex.name, targetSets:main, targetRir:ex.rir, sets, bestWeight:getBestWeight(ex.name)};
    }));
    setCurExIdx(0); setStartTime(Date.now()); setTotalRestSec(0); setCurRestSec(0); setTotalSec(0); setIsResting(false); setRestLogs({});
    setPhase("live");
  };

  const toggleRest = () => {
    if(!isResting){ setIsResting(true); setRestStart(Date.now()); setCurRestSec(0); }
    else {
      const dur=Math.floor((Date.now()-restStart)/1000);
      setTotalRestSec(p=>p+dur); setIsResting(false); setRestStart(null); setCurRestSec(0);
      setRestLogs(p=>({...p,[curExIdx]:[...(p[curExIdx]||[]),dur]}));
    }
  };

  const updSet = (si,f,v) => setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets[si]={...a[curExIdx].sets[si],[f]:v};return a;});
  const toggleMain = si => setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets[si]={...a[curExIdx].sets[si],isMain:!a[curExIdx].sets[si].isMain};return a;});
  const toggleDone = si => setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets[si]={...a[curExIdx].sets[si],done:!a[curExIdx].sets[si].done};return a;});
  const addSet    = () => setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets.push({weight:"",reps:"",isMain:false,done:false});return a;});
  const removeSet = si => setWorkoutData(p=>{const a=p.map(e=>({...e,sets:[...e.sets]}));a[curExIdx].sets.splice(si,1);return a;});

  const getRmPct = (name,weight) => {
    const w=parseFloat(weight); if(!w)return null;
    const rm = name.includes("스쿼트")?profile.squat : name.includes("벤치")?profile.bench : name.includes("데드")?profile.dead : 0;
    return rm ? Math.round(w/rm*100) : null;
  };

  const finish = () => {
    clearInterval(timerRef.current);
    const tt=Math.floor((Date.now()-startTime)/1000);
    let vol=0, sets=0;
    workoutData.forEach(ex=>ex.sets.forEach(s=>{ if(s.isMain&&s.weight&&s.reps){vol+=parseFloat(s.weight)*parseInt(s.reps);sets++;} }));
    const cal=Math.round(vol*0.035+(tt/60)*(profile.weight||70)*0.075);
    const result={tt,vol:Math.round(vol),sets,cal,totalRest:totalRestSec,routineName,date:activeDate,exercises:workoutData.map(ex=>({name:ex.name,sets:ex.sets}))};
    setSummary(result);
    setWorkoutLog(p=>({...p,[activeDate]:[...(p[activeDate]||[]),result]}));
    setPhase("summary");
  };

  const exMap = useMemo(()=>{
    const m={};
    Object.entries(workoutLog).sort(([a],[b])=>a.localeCompare(b)).forEach(([date,logs])=>{
      logs.forEach(log=>(log.exercises||[]).forEach(ex=>{
        const v=ex.sets.filter(s=>s.isMain&&s.weight&&s.reps).reduce((a,s)=>a+parseFloat(s.weight)*parseInt(s.reps),0);
        if(v>0){ if(!m[ex.name])m[ex.name]=[]; m[ex.name].push({date:date.slice(5),vol:Math.round(v)}); }
      }));
    });
    return m;
  },[workoutLog]);

  // ── Calendar ──
  if(phase==="calendar") return (
    <div>
      <GCard><CalendarView workoutLog={workoutLog} cfLog={cfLog} onSelectDay={d=>{setSelDay(d);setPhase("dayview");}}/></GCard>
      <PBtn onClick={()=>{setSelExs([]);setRoutineName("");setSelDay(null);setPhase("plan");}}>+ 오늘 운동 시작</PBtn>
      {Object.keys(exMap).length>0 && (
        <GCard style={{marginTop:10}}>
          <p style={{fontSize:13,fontWeight:600,marginBottom:4,color:C.text}}>종목별 메인 볼륨 추이</p>
          <p style={{fontSize:11,color:C.muted,marginBottom:10}}>메인 세트 기준 누적 볼륨(kg). 꾸준히 올라가면 점진적 과부하가 이뤄지고 있는 것입니다.</p>
          {Object.entries(exMap).slice(0,6).map(([name,pts])=>(
            <div key={name} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <p style={{fontSize:12,color:C.text,fontWeight:500}}>{name}</p>
                {pts.length>1 && <span style={{fontSize:11,fontWeight:600,color:pts[pts.length-1].vol>=pts[pts.length-2].vol?C.green:C.red}}>{pts[pts.length-1].vol>=pts[pts.length-2].vol?"▲":"▼"} {pts[pts.length-1].vol}kg</span>}
              </div>
              <Spark data={pts.map(p=>p.vol)} labels={pts.map(p=>p.date)} color={C.accentL}/>
            </div>
          ))}
        </GCard>
      )}
    </div>
  );

  // ── Day View ──
  if(phase==="dayview") {
    const logs = workoutLog[selDay]||[];
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
                <button onClick={()=>{ if(window.confirm("삭제?")) setWorkoutLog(p=>{const n={...p};n[selDay]=n[selDay].filter((_,i)=>i!==li);if(!n[selDay].length)delete n[selDay];return n;}); }}
                  style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13}}>삭제</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                {[["시간",fmtT(log.tt)],["볼륨",log.vol+"kg"],["칼로리",log.cal+"kcal"]].map(([l,v])=>(
                  <div key={l} style={{background:C.card2,borderRadius:8,padding:"7px 4px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:600,color:C.text}}>{v}</div>
                  </div>
                ))}
              </div>
              {(log.exercises||[]).map((ex,ei)=>(
                <div key={ei} style={{marginBottom:6}}>
                  <p style={{fontSize:13,fontWeight:500,marginBottom:2,color:C.text}}>{ex.name}</p>
                  {ex.sets.filter(s=>s.weight||s.reps).map((s,si)=>(
                    <p key={si} style={{fontSize:12,color:C.muted,paddingLeft:8}}>{s.isMain?"메인":"웜업"}: {s.weight||"-"}kg × {s.reps||"-"}rep</p>
                  ))}
                </div>
              ))}
            </GCard>
          ))
        }
        <PBtn onClick={()=>{ setSelExs([]); setRoutineName(""); setPhase("plan"); }}>+ 이 날짜에 운동 추가</PBtn>
      </div>
    );
  }

  // ── Plan ──
  if(phase==="plan") return (
    <div>
      <button onClick={()=>setPhase(selDay?"dayview":"calendar")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← {selDay?"날짜로":"달력"}</button>
      {savedRoutines.length>0 && (
        <GCard>
          <Lbl>저장된 루틴</Lbl>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {savedRoutines.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                <Chip active={routineName===r.name} onClick={()=>loadRoutine(r)}>{r.name}</Chip>
                <button onClick={()=>setSavedRoutines(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13}}>×</button>
              </div>
            ))}
          </div>
        </GCard>
      )}
      <GCard><Lbl>루틴 이름</Lbl><Inp value={routineName} onChange={e=>setRoutineName(e.target.value)} placeholder="예: 월요일 등/어깨"/></GCard>
      <GCard>
        <Lbl>부위 선택</Lbl>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{MUSCLE_TABS.map(m=><Chip key={m} active={selMuscle===m} onClick={()=>setSelMuscle(m)}>{m}</Chip>)}</div>
        {allEx.map(ex=>(
          <div key={ex} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`0.5px solid ${C.border}`}}>
            <input type="checkbox" checked={!!selExs.find(e=>e.name===ex)} onChange={()=>toggleEx(ex)} style={{width:16,height:16,accentColor:C.accent}}/>
            <span style={{fontSize:14,color:C.text}}>{ex}</span>
          </div>
        ))}
        <div style={{display:"flex",gap:6,marginTop:10}}>
          <Inp value={customInput} onChange={e=>setCustomInput(e.target.value)} placeholder="직접 입력" style={{flex:1}}/>
          <button onClick={()=>{ if(!customInput.trim())return; setCustomExs(p=>({...p,[selMuscle]:[...(p[selMuscle]||[]),customInput.trim()]})); setSelExs(p=>[...p,{name:customInput.trim(),sets:3,rir:2}]); setCustomInput(""); }}
            style={{padding:"8px 14px",border:`0.5px solid ${C.border}`,borderRadius:7,background:"transparent",color:C.text,cursor:"pointer",fontSize:13}}>추가</button>
        </div>
      </GCard>
      {selExs.length>0 && (
        <GCard>
          <Lbl>선택된 운동 — 메인 세트 수 & RIR 목표</Lbl>
          {selExs.map((ex,i)=>(
            <div key={i} style={{background:C.card2,borderRadius:8,padding:10,marginBottom:6}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:8,color:C.text}}>{ex.name}</div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:C.muted}}>메인</span><Inp type="number" min={1} max={10} value={ex.sets} onChange={e=>updateSelEx(i,"sets",parseInt(e.target.value)||1)} style={{width:48,textAlign:"center",padding:5}}/></div>
                <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:C.muted}}>RIR</span><Sel value={ex.rir} onChange={e=>updateSelEx(i,"rir",parseInt(e.target.value))} style={{padding:5}}>{[0,1,2,3,4,5].map(r=><option key={r} value={r}>{r}</option>)}</Sel></div>
              </div>
            </div>
          ))}
        </GCard>
      )}
      {selExs.length>0 && <button onClick={()=>setShowSave(true)} style={{width:"100%",padding:10,border:`0.5px solid ${C.border}`,borderRadius:8,background:"transparent",color:C.accentL,cursor:"pointer",fontSize:13,marginBottom:10}}>루틴 저장 💾</button>}
      {showSave && (
        <GCard>
          <Lbl>저장할 루틴 이름</Lbl>
          <div style={{display:"flex",gap:6}}>
            <Inp value={newName} onChange={e=>setNewName(e.target.value)} placeholder="루틴 이름" style={{flex:1}}/>
            <button onClick={saveRoutine} style={{padding:"8px 12px",background:C.accent,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:13}}>저장</button>
            <button onClick={()=>setShowSave(false)} style={{padding:"8px 10px",background:"transparent",border:`0.5px solid ${C.border}`,borderRadius:7,cursor:"pointer",color:C.muted,fontSize:13}}>취소</button>
          </div>
        </GCard>
      )}
      <PBtn onClick={()=>startWorkout(selDay||nowStr())}>운동 시작 →</PBtn>
    </div>
  );

  // ── Live ──
  if(phase==="live") {
    const ex = workoutData[curExIdx];
    if(!ex) return null;
    const mainSets = ex.sets.filter(s=>s.isMain);
    const mainVol  = mainSets.filter(s=>s.weight&&s.reps).reduce((a,s)=>a+parseFloat(s.weight)*parseInt(s.reps),0);
    const rmLift   = ex.name.includes("스쿼트")?profile.squat : ex.name.includes("벤치")?profile.bench : ex.name.includes("데드")?profile.dead : 0;
    const sugW     = (rmLift&&ex.targetRir!=null) ? Math.round(rmLift*(EPLEY[Math.min(ex.targetRir,11)]||70)/100*4)/4 : null;
    const exRestLogs = restLogs[curExIdx]||[];
    const rmPct = getRmPct(ex.name, ex.sets.find(s=>s.isMain&&s.weight)?.weight);
    return (
      <div>
        <div style={{borderRadius:12,padding:14,marginBottom:10,border:`2.5px solid ${isResting?C.green:C.red}`,background:isResting?C.card:"#1a0800",position:"relative",overflow:"hidden"}}>
          {!isResting && (
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-end",justifyContent:"space-around",pointerEvents:"none"}}>
              {Array.from({length:8}).map((_,i)=><span key={i} style={{fontSize:16,animation:`flameUp ${0.7+i*0.12}s ${i*0.14}s ease-in infinite`}}>🔥</span>)}
            </div>
          )}
          <style>{`@keyframes flameUp{0%{transform:translateY(0) scale(1);opacity:.9}50%{transform:translateY(-8px) scale(1.2);opacity:1}100%{transform:translateY(-16px) scale(.5);opacity:0}}`}</style>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,position:"relative",zIndex:2}}>
            {[["총 운동",fmtT(totalSec),isResting?C.text:"#fff"],["현재 휴식",fmtT(curRestSec),isResting?C.green:"#5b9af8"],["총 휴식",fmtT(totalRestSec),C.muted]].map(([l,v,col])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:10,color:isResting?C.muted:"#aaa",marginBottom:1}}>{l}</div>
                <div style={{fontSize:24,fontWeight:600,fontVariantNumeric:"tabular-nums",color:col,lineHeight:1}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={toggleRest} style={{width:"100%",padding:12,marginBottom:10,borderRadius:8,border:"none",fontWeight:600,fontSize:15,cursor:"pointer",background:isResting?"#2d1a1a":"#1a2d1a",color:isResting?C.red:C.green}}>
          {isResting?"✓ 휴식 종료":"휴식 시작"}
        </button>
        <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto",paddingBottom:2}}>
          {workoutData.map((e,i)=><Chip key={i} active={i===curExIdx} onClick={()=>setCurExIdx(i)} style={{flexShrink:0}}>{e.name.split(" ")[0]}</Chip>)}
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
          {sugW && <p style={{fontSize:11,color:C.amber,marginBottom:8,background:"#2a1e00",padding:"4px 8px",borderRadius:6}}>💡 RIR {ex.targetRir} 목표 → 제안 무게: {sugW}kg</p>}
          <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 30px 30px 22px",gap:4,marginBottom:4}}>
            {["#","무게","렙","M","✓",""].map((h,i)=><div key={i} style={{fontSize:10,color:C.muted,textAlign:"center"}}>{h}</div>)}
          </div>
          {ex.sets.map((s,si)=>(
            <div key={si} style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 30px 30px 22px",gap:4,alignItems:"center",padding:"4px 0",borderBottom:`0.5px solid ${C.border}`,opacity:isResting?0.4:1,background:s.isMain?"#1e2a1a":"transparent",borderRadius:4}}>
              <div style={{fontSize:11,color:s.isMain?C.green:s.isCooldown?C.amber:C.muted,textAlign:"center",fontWeight:s.isMain?600:400}}>{s.isWarmup?"W":s.isCooldown?"C":si+1}</div>
              <NumInp value={s.weight} onChange={v=>updSet(si,"weight",v)} placeholder="kg" disabled={isResting} style={{border:`0.5px solid ${s.isMain?C.green:C.border}`}}/>
              <NumInp value={s.reps}   onChange={v=>updSet(si,"reps",v)}   placeholder="rep" disabled={isResting} style={{border:`0.5px solid ${s.isMain?C.green:C.border}`}}/>
              <button onClick={()=>toggleMain(si)} style={{width:28,height:26,borderRadius:5,border:`1.5px solid ${s.isMain?C.green:C.border}`,background:s.isMain?"#1e3a1e":"transparent",cursor:"pointer",fontSize:10,color:s.isMain?C.green:C.muted,fontWeight:600}}>M</button>
              <button onClick={()=>toggleDone(si)} style={{width:28,height:26,borderRadius:"50%",border:`1.5px solid ${s.done?C.green:C.border}`,background:s.done?"#1e3a1e":"transparent",cursor:"pointer",fontSize:12,color:s.done?C.green:C.muted}}>{s.done?"✓":"○"}</button>
              <button onClick={()=>removeSet(si)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14,padding:0}}>×</button>
            </div>
          ))}
          <Lbl style={{marginTop:6,fontSize:10}}>M = 메인 세트 활성화 · 메인만 볼륨 집계</Lbl>
          <button onClick={addSet} style={{marginTop:4,fontSize:12,padding:"4px 10px",border:`0.5px solid ${C.border}`,borderRadius:7,background:"transparent",cursor:"pointer",color:C.muted}}>+ 세트 추가</button>
          {exRestLogs.length>0 && (
            <div style={{marginTop:8,padding:"6px 10px",background:C.card2,borderRadius:8}}>
              <Lbl>세트간 휴식</Lbl>
              {exRestLogs.map((r,i)=><div key={i} style={{fontSize:12,color:C.mutedL,padding:"2px 0"}}>휴식 {i+1}: {fmtT(r)}</div>)}
            </div>
          )}
        </GCard>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{ clearInterval(timerRef.current); setPhase("plan"); }} style={{flex:1,padding:11,border:`0.5px solid ${C.red}`,borderRadius:8,background:"transparent",color:C.red,cursor:"pointer",fontSize:13,fontWeight:500}}>← 수정</button>
          <button onClick={finish} style={{flex:2,padding:11,background:C.accent,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:14}}>운동 종료 →</button>
        </div>
      </div>
    );
  }

  // ── Summary ──
  if(phase==="summary"&&summary) {
    const pr3=(profile.squat||0)+(profile.bench||0)+(profile.dead||0);
    let txt=`🏋️ ${summary.routineName}\n📅 ${summary.date}${profile.nick?" @"+profile.nick:""}\n\n`;
    (summary.exercises||[]).forEach(ex=>{ txt+=`▪ ${ex.name}\n`; ex.sets.filter(s=>s.weight||s.reps).forEach(s=>{ txt+=`  ${s.isMain?"메인":"웜업"}: ${s.weight||"-"}kg × ${s.reps||"-"}rep\n`; }); txt+="\n"; });
    txt+=`⏱ ${fmtT(summary.tt)} | 휴식 ${fmtT(summary.totalRest)}\n🔥 ${summary.cal} kcal | 📦 ${summary.vol}kg\n`;
    if(pr3) txt+=`💪 3대: ${pr3}kg\n`;
    txt+=`\n${HASHTAG} #운동기록`;
    return (
      <div>
        <p style={{fontSize:16,fontWeight:700,marginBottom:12,color:C.text}}>완료! 🎉</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {[["총 시간",fmtT(summary.tt)],["메인 세트",summary.sets+"세트"],["총 볼륨",summary.vol+"kg"],["칼로리",summary.cal+"kcal"]].map(([l,v])=>(
            <div key={l} style={{background:C.card2,borderRadius:8,padding:12,textAlign:"center"}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:4}}>{l}</div>
              <div style={{fontSize:20,fontWeight:700,color:C.text}}>{v}</div>
            </div>
          ))}
        </div>
        <GCard>
          <Lbl>인스타 텍스트</Lbl>
          <pre style={{fontFamily:"monospace",fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-all",background:C.card2,borderRadius:8,padding:12,maxHeight:160,overflowY:"auto",color:C.text}}>{txt}</pre>
          <button onClick={()=>navigator.clipboard.writeText(txt).then(()=>alert("복사 완료 ✓"))} style={{marginTop:8,padding:"6px 14px",border:`0.5px solid ${C.border}`,borderRadius:7,background:"transparent",color:C.accentL,cursor:"pointer",fontSize:12}}>텍스트 복사</button>
        </GCard>
        <PBtn onClick={()=>setPhase("calendar")}>달력으로 →</PBtn>
      </div>
    );
  }

  return null;
}

// ── CrossFit Screen ───────────────────────────────────────────────────────
function CrossfitScreen({cfLog,setCfLog,workoutLog,profile}) {
  const [phase,setPhase]   = useState("calendar");
  const [selDay,setSelDay] = useState(null);
  const [selWod,setSelWod] = useState(null);
  const [cfTab,setCfTab]   = useState("hero");
  const [selHero,setSelHero] = useState(null);
  const [scaleMode,setScaleMode] = useState("rx");
  const [gender,setGender]   = useState("m");
  const [wodName,setWodName] = useState("");
  const [wodFormat,setWodFormat] = useState("AMRAP");
  const [totalMin,setTotalMin] = useState(10);
  const [rounds,setRounds]     = useState(5);
  const [roundSec,setRoundSec] = useState(60);
  const [workSec,setWorkSec]   = useState(20);
  const [restSec,setRestSec]   = useState(10);
  const [movements,setMovements] = useState([{name:"버피",reps:10,weight:""}]);
  const [elapsed,setElapsed]     = useState(0);
  const [curRound,setCurRound]   = useState(1);
  const [tabataPhase,setTabataPhase] = useState("work");
  const [tabataSec,setTabataSec]     = useState(0);
  const [scoreInput,setScoreInput]   = useState("");
  const [memoInput,setMemoInput]     = useState("");
  const [activeDate,setActiveDate]   = useState(nowStr());
  const startRef = useRef(null);
  const intRef   = useRef(null);

  const fmt = CF_SCORE_FORMATS[wodFormat]||CF_SCORE_FORMATS["AMRAP"];
  const isTimed = ["For Time","3 Rounds For Time","5 Rounds For Time"].includes(wodFormat);
  const totalSecs = isTimed ? totalMin*60 : wodFormat==="EMOM" ? rounds*roundSec : wodFormat==="Tabata" ? rounds*(workSec+restSec) : totalMin*60;

  const getHeroWeight = h => { const data=scaleMode==="rx"?h.rx:h.scale; if(!data)return null; return data[gender]||data.note||""; };

  const loadHero = h => {
    setSelHero(h); setWodName(h.name);
    setMovements(h.movements.map(m=>({...m})));
    const modeKey = Object.keys(CF_SCORE_FORMATS).includes(h.mode) ? h.mode : "For Time";
    setWodFormat(modeKey);
    if(h.totalMin) setTotalMin(h.totalMin);
    if(h.rounds)   setRounds(h.rounds);
    if(h.roundSec) setRoundSec(h.roundSec);
  };

  const startTimer = dateForRecord => {
    setActiveDate(dateForRecord||nowStr());
    startRef.current=Date.now(); setElapsed(0); setCurRound(1); setTabataPhase("work"); setTabataSec(0); setScoreInput(""); setMemoInput("");
    setPhase("active");
    intRef.current=setInterval(()=>{
      const e=Math.floor((Date.now()-startRef.current)/1000); setElapsed(e);
      if(wodFormat==="Tabata"){
        const cl=workSec+restSec, cy=Math.floor(e/cl), ic=e%cl;
        setCurRound(cy+1); setTabataPhase(ic<workSec?"work":"rest"); setTabataSec(ic<workSec?workSec-ic:cl-ic);
        if(cy>=rounds){ clearInterval(intRef.current); setPhase("score"); }
      } else if(wodFormat==="EMOM"){
        const r=Math.floor(e/roundSec)+1; setCurRound(r);
        if(r>rounds){ clearInterval(intRef.current); setPhase("score"); }
      } else if(isTimed||wodFormat==="AMRAP"){
        if(e>=totalSecs){ clearInterval(intRef.current); setPhase("score"); }
      }
    },1000);
  };

  const saveScore = () => {
    const tt=Math.floor((Date.now()-startRef.current)/1000);
    const hero=HERO_WODS.find(h=>h.name===wodName);
    const cal=hero?hero.calFactor:Math.round(tt/60*(profile.weight||70)*0.1);
    const rec={date:activeDate,name:wodName||wodFormat,format:wodFormat,scoreType:fmt.scoreType,score:scoreInput,memo:memoInput,tt,cal,scaleMode,movements:[...movements]};
    setCfLog(p=>{
      const dayLogs=[...(p[activeDate]||[])];
      const idx=dayLogs.findIndex(l=>l.name===rec.name);
      if(idx>=0) dayLogs[idx]=rec; else dayLogs.push(rec);
      return {...p,[activeDate]:dayLogs};
    });
    setPhase("done");
  };

  const getLatestSameWod = name => {
    const all=[];
    Object.entries(cfLog).forEach(([date,logs])=>(logs||[]).forEach(l=>{ if(l.name===name) all.push({...l,date}); }));
    return all.sort((a,b)=>b.date.localeCompare(a.date))[0]||null;
  };

  const wodHistory = useMemo(()=>{
    const map={};
    Object.entries(cfLog).sort(([a],[b])=>a.localeCompare(b)).forEach(([date,logs])=>{
      (logs||[]).forEach(l=>{ if(!map[l.name])map[l.name]=[]; map[l.name].push({...l,date}); });
    });
    return map;
  },[cfLog]);

  const remaining = Math.max(0,totalSecs-elapsed);
  const pct = Math.min(1,elapsed/totalSecs);
  const r2=78,cx=100,cy=100,circ=2*Math.PI*r2;
  const tColor = wodFormat==="Tabata"?(tabataPhase==="work"?C.red:C.green):C.accentL;
  const hlIdx  = wodFormat==="EMOM" ? (curRound-1)%movements.length : -1;

  // ── WOD History Detail ──
  if(phase==="wodhistory"&&selWod) {
    const recs = wodHistory[selWod]||[];
    const isTimeScore = recs[0]?.scoreType==="time";
    const chartData = recs.map(r=>{
      if(isTimeScore){ const p=(r.score||"").split(":"); return p.length===2?parseInt(p[0])*60+parseInt(p[1]):(r.tt||0); }
      const n=parseFloat(r.score); return isNaN(n)?0:n;
    });
    return (
      <div>
        <button onClick={()=>setPhase("calendar")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← 달력</button>
        <p style={{fontSize:15,fontWeight:700,marginBottom:4,color:C.text}}>{selWod}</p>
        <p style={{fontSize:11,color:C.muted,marginBottom:12}}>{isTimeScore?"낮을수록 좋습니다 (For Time)":"높을수록 좋습니다"}</p>
        {chartData.filter(v=>v>0).length>=2 && (
          <GCard><Lbl>{isTimeScore?"기록 추이 (초)":"점수 추이"}</Lbl>
            <Spark data={chartData} labels={recs.map(r=>r.date.slice(5))} color={isTimeScore?C.green:C.accentL}/>
          </GCard>
        )}
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

  // ── Calendar ──
  if(phase==="calendar") return (
    <div>
      <GCard><CalendarView workoutLog={workoutLog} cfLog={cfLog} onSelectDay={d=>{setSelDay(d);setPhase("dayview");}}/></GCard>
      {Object.keys(wodHistory).length>0 && (
        <GCard>
          <p style={{fontSize:13,fontWeight:600,marginBottom:4,color:C.text}}>WOD별 기록 히스토리</p>
          <p style={{fontSize:11,color:C.muted,marginBottom:10}}>탭하면 추이 차트와 상세 기록을 볼 수 있습니다.</p>
          {Object.entries(wodHistory).map(([name,recs])=>{
            const latest=recs[recs.length-1];
            return (
              <div key={name} onClick={()=>{setSelWod(name);setPhase("wodhistory");}}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:C.card2,borderRadius:8,marginBottom:6,cursor:"pointer",border:`0.5px solid ${C.border}`}}>
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

  // ── Day View ──
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
                  <button onClick={()=>{ if(window.confirm("삭제?")) setCfLog(p=>{const n={...p};n[selDay]=n[selDay].filter((_,i)=>i!==li);if(!n[selDay].length)delete n[selDay];return n;}); }}
                    style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13}}>삭제</button>
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
        <PBtn onClick={()=>{ setSelDay(selDay); setPhase("setup"); }}>+ 이 날짜에 WOD 추가</PBtn>
      </div>
    );
  }

  // ── Setup ──
  if(phase==="setup") return (
    <div>
      <button onClick={()=>setPhase(selDay?"dayview":"calendar")} style={{background:"none",border:"none",color:C.accentL,cursor:"pointer",fontSize:14,marginBottom:10,padding:0}}>← {selDay?"날짜로":"달력"}</button>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["hero","Hero WODs"],["custom","커스텀"]].map(([t,l])=>(
          <button key={t} onClick={()=>setCfTab(t)} style={{flex:1,padding:"8px",border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,cursor:"pointer",background:cfTab===t?C.accent:"transparent",color:cfTab===t?"#fff":C.muted}}>{l}</button>
        ))}
      </div>

      {cfTab==="hero" && (
        <>
          <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:6}}><Chip active={scaleMode==="rx"} onClick={()=>setScaleMode("rx")}>RX</Chip><Chip active={scaleMode==="scale"} onClick={()=>setScaleMode("scale")}>Scale</Chip></div>
            <div style={{display:"flex",gap:6}}><Chip active={gender==="m"} onClick={()=>setGender("m")}>남성</Chip><Chip active={gender==="f"} onClick={()=>setGender("f")}>여성</Chip></div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{HERO_WODS.map(h=><Chip key={h.name} active={selHero?.name===h.name} onClick={()=>loadHero(h)}>{h.name}</Chip>)}</div>
          {selHero && (
            <GCard style={{background:"#1e2a3a"}}>
              {(()=>{ const lat=getLatestSameWod(selHero.name); return lat && (
                <div style={{background:"#1e3a1e",borderRadius:8,padding:"8px 10px",marginBottom:10,border:`0.5px solid ${C.green}`}}>
                  <p style={{fontSize:11,color:C.green,marginBottom:4}}>🏆 최근 기록 ({lat.date})</p>
                  <p style={{fontSize:16,fontWeight:700,color:C.green}}>{lat.score||"-"} <span style={{fontSize:11,color:C.muted}}>{lat.scaleMode==="rx"?"RX":"Scale"}</span></p>
                  {lat.memo && <p style={{fontSize:11,color:C.muted,marginTop:2}}>📝 {lat.memo}</p>}
                </div>
              ); })()}
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
            <Inp value={wodName} onChange={e=>setWodName(e.target.value)} placeholder="예: Monday WOD / Murph" style={{marginBottom:10}}/>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:6}}><Chip active={scaleMode==="rx"} onClick={()=>setScaleMode("rx")}>RX</Chip><Chip active={scaleMode==="scale"} onClick={()=>setScaleMode("scale")}>Scale</Chip></div>
              <div style={{display:"flex",gap:6}}><Chip active={gender==="m"} onClick={()=>setGender("m")}>남</Chip><Chip active={gender==="f"} onClick={()=>setGender("f")}>여</Chip></div>
            </div>
          </GCard>
          {wodName && (()=>{ const lat=getLatestSameWod(wodName); return lat && (
            <GCard style={{background:"#1e2a1e",border:`0.5px solid ${C.green}`}}>
              <p style={{fontSize:11,color:C.green,marginBottom:4}}>🏆 "{wodName}" 최근 기록 ({lat.date})</p>
              <p style={{fontSize:16,fontWeight:700,color:C.green}}>{lat.score||"-"}</p>
              {lat.memo && <p style={{fontSize:11,color:C.muted,marginTop:2}}>📝 {lat.memo}</p>}
            </GCard>
          ); })()}
          <GCard>
            <Lbl>CrossFit Games 포맷</Lbl>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {Object.keys(CF_SCORE_FORMATS).map(f=><Chip key={f} active={wodFormat===f} onClick={()=>setWodFormat(f)} style={{marginBottom:4}}>{f}</Chip>)}
            </div>
            <div style={{background:C.card2,borderRadius:8,padding:"8px 10px",marginBottom:10}}>
              <p style={{fontSize:12,color:C.accentL,fontWeight:600,marginBottom:2}}>{wodFormat}</p>
              <p style={{fontSize:11,color:C.muted}}>{fmt.hint}</p>
            </div>
            {(wodFormat==="AMRAP"||isTimed) && <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:13,color:C.text}}>시간(분)</span><Inp type="number" min={1} max={120} value={totalMin} onChange={e=>setTotalMin(parseInt(e.target.value)||1)} style={{width:70,textAlign:"center"}}/></div>}
            {wodFormat==="EMOM" && <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,color:C.text}}>라운드</span><Inp type="number" min={1} value={rounds} onChange={e=>setRounds(parseInt(e.target.value)||1)} style={{width:52,textAlign:"center"}}/></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,color:C.text}}>분당(초)</span><Inp type="number" min={30} max={120} value={roundSec} onChange={e=>setRoundSec(parseInt(e.target.value)||60)} style={{width:52,textAlign:"center"}}/></div>
            </div>}
            {wodFormat==="Tabata" && <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
              {[["라운드",rounds,setRounds],["운동(초)",workSec,setWorkSec],["휴식(초)",restSec,setRestSec]].map(([l,v,s])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:C.text}}>{l}</span><Inp type="number" min={1} value={v} onChange={e=>s(parseInt(e.target.value)||1)} style={{width:50,textAlign:"center"}}/></div>
              ))}
            </div>}
          </GCard>
          <GCard>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <Lbl style={{margin:0}}>운동 구성</Lbl>
              <button onClick={()=>setMovements(p=>[...p,{name:"버피",reps:10,weight:""}])} style={{fontSize:12,color:C.accentL,background:"none",border:"none",cursor:"pointer"}}>+ 추가</button>
            </div>
            {movements.map((m,i)=>(
              <div key={i} style={{display:"flex",gap:5,marginBottom:6,alignItems:"center"}}>
                <Sel value={m.name} onChange={e=>setMovements(p=>{const a=[...p];a[i]={...a[i],name:e.target.value};return a;})} style={{flex:2}}>
                  {CF_EXERCISES.map(e=><option key={e} value={e}>{e}</option>)}
                </Sel>
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

  // ── Active Timer ──
  if(phase==="active") return (
    <div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          <circle cx={cx} cy={cy} r={r2} fill="none" stroke={C.border} strokeWidth={10}/>
          <circle cx={cx} cy={cy} r={r2} fill="none" stroke={tColor} strokeWidth={10}
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
            style={{transform:"rotate(-90deg)",transformOrigin:"100px 100px",transition:"stroke-dashoffset .5s"}}/>
          <text x={cx} y={cy-14} textAnchor="middle" fontSize={12} fill={C.muted}>{wodName||wodFormat}</text>
          <text x={cx} y={cy+14} textAnchor="middle" fontSize={32} fontWeight={700} fill={tColor}>
            {fmtT(wodFormat==="Tabata"?tabataSec : isTimed?elapsed : remaining)}
          </text>
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
        <button onClick={()=>{ clearInterval(intRef.current); setPhase("setup"); }} style={{padding:11,border:`0.5px solid ${C.red}`,borderRadius:8,background:"transparent",color:C.red,cursor:"pointer",fontSize:13,fontWeight:500}}>중지</button>
        <button onClick={()=>{ clearInterval(intRef.current); setPhase("score"); }} style={{padding:11,background:C.green,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>완료 → 기록</button>
      </div>
    </div>
  );

  // ── Score Entry ──
  if(phase==="score") return (
    <div>
      <GCard style={{background:"#1e2a1e",border:`1.5px solid ${C.green}`}}>
        <p style={{fontSize:15,fontWeight:700,color:C.green,marginBottom:4}}>🏁 WOD 완료!</p>
        <p style={{fontSize:13,color:C.text,marginBottom:2}}>{wodName||wodFormat}</p>
        <p style={{fontSize:12,color:C.muted}}>경과 시간: {fmtT(elapsed)}</p>
      </GCard>
      <GCard>
        <Lbl>점수 입력 — {wodFormat}</Lbl>
        <div style={{background:C.card2,borderRadius:8,padding:"6px 10px",marginBottom:10}}>
          <p style={{fontSize:11,color:C.accentL}}>{fmt.hint}</p>
        </div>
        <Inp value={scoreInput} onChange={e=>setScoreInput(e.target.value)} placeholder={fmt.placeholder}
          style={{fontSize:18,fontWeight:700,textAlign:"center",marginBottom:10,color:C.green}}/>
        <Lbl>메모 (선택)</Lbl>
        <Inp value={memoInput} onChange={e=>setMemoInput(e.target.value)} placeholder="느낀 점, 컨디션, 스케일 내용 등" style={{marginBottom:4}}/>
      </GCard>
      <PBtn onClick={saveScore}>기록 저장 ✓</PBtn>
    </div>
  );

  // ── Done ──
  if(phase==="done") {
    const lastRec = (()=>{
      const dayLogs = cfLog[activeDate]||[];
      return dayLogs.find(l=>l.name===(wodName||wodFormat))||null;
    })();
    const pr3=(profile.squat||0)+(profile.bench||0)+(profile.dead||0);
    const instaText = lastRec ? [
      `🏋️ ${lastRec.name}`,
      `📅 ${lastRec.date}${profile.nick?" @"+profile.nick:""}`,
      ``,
      `📋 포맷: ${lastRec.format}`,
      `🏆 스코어: ${lastRec.score||"-"} ${lastRec.scaleMode==="rx"?"(RX)":"(Scale)"}`,
      ``,
      ...(lastRec.movements||[]).map(m=>`  ▪ ${m.name} ${m.reps}회${m.weight?` / ${m.weight}`:""}`),
      ``,
      `⏱ 운동 시간: ${fmtT(lastRec.tt)}`,
      `🔥 예상 칼로리: ${lastRec.cal} kcal`,
      pr3?`💪 3대 합계: ${pr3}kg`:"",
      ``,
      `${HASHTAG} #크로스핏 #CrossFit #WOD #${lastRec.name.replace(/\s/g,"")}`,
    ].filter(l=>l!==null).join("\n") : "";

    return (
      <div>
        <div style={{textAlign:"center",padding:"20px 0 12px"}}>
          <div style={{fontSize:40,marginBottom:8}}>🎉</div>
          <p style={{fontSize:18,fontWeight:700,color:C.green,marginBottom:4}}>기록 저장 완료!</p>
          {lastRec&&<p style={{fontSize:14,color:C.accentL,fontWeight:600}}>{lastRec.name} — {lastRec.score||"-"}</p>}
        </div>
        {lastRec&&(
          <GCard>
            <Lbl>인스타 텍스트</Lbl>
            <pre style={{fontFamily:"monospace",fontSize:11,lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-all",background:C.card2,borderRadius:8,padding:12,maxHeight:200,overflowY:"auto",color:C.text}}>{instaText}</pre>
            <button onClick={()=>navigator.clipboard.writeText(instaText).then(()=>alert("복사 완료 ✓"))}
              style={{marginTop:8,padding:"6px 14px",border:`0.5px solid ${C.border}`,borderRadius:7,background:"transparent",color:C.accentL,cursor:"pointer",fontSize:12}}>텍스트 복사</button>
          </GCard>
        )}
        <PBtn onClick={()=>setPhase("calendar")}>달력으로 →</PBtn>
      </div>
    );
  }

  return null;
}

// ── Goal Banner ───────────────────────────────────────────────────────────
function GoalBanner({goal}) {
  const [vis,setVis] = useState(true);
  useEffect(()=>{ const t=setInterval(()=>setVis(p=>!p),1400); return()=>clearInterval(t); },[]);
  if(!goal) return null;
  return (
    <div style={{position:"fixed",bottom:72,left:0,right:0,zIndex:40,textAlign:"center",pointerEvents:"none"}}>
      <span style={{fontSize:12,color:C.gold,fontWeight:600,opacity:vis?1:0.3,transition:"opacity 1.2s",background:"rgba(15,17,23,0.88)",padding:"4px 14px",borderRadius:12,border:`0.5px solid ${C.gold}55`}}>🎯 {goal}</span>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]       = useState("workout");
  const [profile,setProfile] = useState(()=>{try{const s=localStorage.getItem("profile");return s?JSON.parse(s):{squat:0,bench:0,dead:0,weight:70,nick:"",photo:null,goal:"",warmupSets:0,mainSets:3,cooldownSets:0};}catch{return{squat:0,bench:0,dead:0,weight:70,nick:"",photo:null,goal:"",warmupSets:0,mainSets:3,cooldownSets:0};}});
  const [history,setHistory] = useState(()=>{try{const s=localStorage.getItem("history");return s?JSON.parse(s):[];}catch{return[];}});
  const [workoutLog,setWorkoutLog] = useState(()=>{try{const s=localStorage.getItem("workoutLog");return s?JSON.parse(s):{};}catch{return{};}});
  const [cfLog,setCfLog] = useState(()=>{try{const s=localStorage.getItem("cfLog");return s?JSON.parse(s):{};}catch{return{};}});
  const [savedRoutines,setSavedRoutines] = useState(()=>{try{const s=localStorage.getItem("savedRoutines");return s?JSON.parse(s):[];}catch{return[];}});
  const [showProfile,setShowProfile] = useState(false);

  useEffect(()=>{try{localStorage.setItem("profile",JSON.stringify(profile));}catch{}},[profile]);
  useEffect(()=>{try{localStorage.setItem("history",JSON.stringify(history));}catch{}},[history]);
  useEffect(()=>{try{localStorage.setItem("workoutLog",JSON.stringify(workoutLog));}catch{}},[workoutLog]);
  useEffect(()=>{try{localStorage.setItem("cfLog",JSON.stringify(cfLog));}catch{}},[cfLog]);
  useEffect(()=>{try{localStorage.setItem("savedRoutines",JSON.stringify(savedRoutines));}catch{}},[savedRoutines]);

  const bgUrl = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80";
  const bgOpacity = 0.07;

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"12px 12px 80px",fontFamily:"system-ui,sans-serif",background:C.bg,minHeight:"100vh",position:"relative"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,backgroundImage:`url('${bgUrl}')`,backgroundSize:"cover",backgroundPosition:"center",opacity:bgOpacity,pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,zIndex:0,background:`linear-gradient(180deg,${C.bg} 0%,rgba(15,17,23,0.96) 100%)`,pointerEvents:"none"}}/>

      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:C.accentL,letterSpacing:-0.5}}>{APP_NAME}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:1,fontStyle:"italic"}}>{VERSE}</div>
          </div>
          <button onClick={()=>setShowProfile(true)} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:"50%",width:38,height:38,cursor:"pointer",overflow:"hidden",padding:0,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {profile.photo ? <img alt="profile" src={profile.photo} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:18}}>👤</span>}
          </button>
        </div>

        {tab==="workout"   && <WorkoutScreen  profile={profile} workoutLog={workoutLog} setWorkoutLog={setWorkoutLog} cfLog={cfLog} savedRoutines={savedRoutines} setSavedRoutines={setSavedRoutines}/>}
        {tab==="1rm"       && <OneRMScreen    profile={profile}/>}
        {tab==="crossfit"  && <CrossfitScreen cfLog={cfLog} setCfLog={setCfLog} workoutLog={workoutLog} profile={profile}/>}
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

      {showProfile && (
        <ProfileModal profile={profile} setProfile={setProfile} history={history} setHistory={setHistory} workoutLog={workoutLog} cfLog={cfLog} onClose={()=>setShowProfile(false)}/>
      )}
    </div>
  );
}