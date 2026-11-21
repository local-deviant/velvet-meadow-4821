import{readFileSync as R,writeFileSync as Y,mkdirSync as K,readdirSync as D}from'fs'
let I=process.env.MAKEFUN_INPUT_DIR||'/input',U=process.env.MAKEFUN_OUTPUT_DIR||'/output';for(let id of D(I).sort()){
let L=R(I+'/'+id+'/level.txt','utf8').split('\n');if(L[L.length-1]=='')L.pop();
let w=Math.max(...L.map(r=>r.length)),W=w+2,N=W*(L.length+2),G='#'.repeat(W);
for(let r of L)G+='#'+r.padEnd(w,'#')+'#';G+='#'.repeat(W);
let a=new Uint8Array(N),B=[],O=[],P=0;
for(let i=0;i<N;i++){let c=G[i];if(c!='#')a[i]=1;if(c=='$'||c=='*')B.push(i);if(c=='.'||c=='*')O.push(i);if(c=='@')P=i}
let E=new Uint8Array(N);
for(let i=0;i<N;i++){if(a[i]&&G[i]!='.'&&G[i]!='*'&&(!a[i-W]||!a[i+W])&&(!a[i-1]||!a[i+1]))E[i]=1}
let h=Math.floor(P/W),H=new Uint8Array(N);
for(let c=0;c<W;c++)H[h*W+c]=1;
let F=new Uint8Array(N);
for(let i=0;i<N;i++)F[i]=a[i]&&!H[i]?1:0;
let S=new Uint8Array(N),M=[];
for(let b of B){if(S[b])continue;let t=[b];S[b]=1;let c=[];
while(t.length){let x=t.pop();c.push(x);for(let n of[x-W,x+W,x-1,x+1])if(F[n]&&!S[n]){S[n]=1;t.push(n)}}
let m=new Uint8Array(N);for(let x of c)m[x]=1;
let b2=B.filter(x=>m[x]),g=O.filter(x=>m[x]),d=-1,e=-1;
for(let x of c)for(let n of[x-W,x+W])if(H[n]&&a[n]){d=x;e=n;break}
M.push([c,m,b2,g,d,e])}
M.sort((x,y)=>x[4]-y[4]);
let V=new Int32Array(N),T=0,A=new Int32Array(N),o=[-W,W,-1,1],k=[];
function f(s,b,m){let q=++T,r=++T;k.length=0;k.push(s);V[s]=r;let l=s;
for(let i=0;i<b.length;i++)V[b[i]]=q;
while(k.length){let x=k.pop();for(let d=0;d<4;d++){let n=x+o[d];if(m[n]&&V[n]!=r&&V[n]!=q){V[n]=r;if(n<l)l=n;k.push(n)}}}
return l}
function u(s,t,m,b){if(s==t)return'';let q=++T,r=++T,j=[s];V[s]=r;A[s]=-1;
for(let i=0;i<b.length;i++)V[b[i]]=q;
let z=0;
for(let i=0;i<j.length;i++){let x=j[i];if(x==t){z=1;break}for(let d=0;d<4;d++){let n=x+o[d];if(m[n]&&V[n]!=r&&V[n]!=q){V[n]=r;A[n]=x;j.push(n)}}}
if(!z)return null;let c=t,v='';
while(c!=s){let p=A[c];v='UDLR'[o.indexOf(c-p)]+v;c=p}
return v}
let p=a=>(a[0]||0)+(a[1]||0)*1024+(a[2]||0)*1048576+(a[3]||0)*1073741824;
let C=B.slice(),Q=P,s='',z=1;
for(let ri=0;ri<M.length&&z;ri++){let R=M[ri],la=ri==M.length-1;
let m=new Uint8Array(N);for(let x of R[0])m[x]=1;m[R[5]]=1;
let w=u(Q,R[5],a,C);if(w==null){z=0;break}s+=w;Q=R[5];
let b=R[2],B2=[b.slice()],Q2=[R[5]],H2=[0],V2=new Set,V3=new Set;
let r0=f(R[5],b,m);V2.add(p(b)+r0*2**40);V3.add(p(b)+R[5]*2**40);
let q=[[0]],gl=-1;
outer:for(let n=0;q[n];n++)for(let t of q[n]){let bl=B2[t];f(Q2[t],bl,m);
let rt=T,bt=T-1,cd=[];
for(let i=0;i<bl.length;i++)for(let d=0;d<4;d++){let x=bl[i],st=x-o[d],tg=x+o[d];
if(V[st]!=rt||!R[1][tg]||V[tg]==bt||E[tg])continue;
let nb=bl.slice();nb[i]=tg;
for(let j=1;j<nb.length;j++){let v=nb[j],y=j-1;while(y>=0&&nb[y]>v){nb[y+1]=nb[y];y--}nb[y+1]=v}
let pk=p(nb);if(V3.has(pk+x*2**40))continue;V3.add(pk+x*2**40);cd.push([pk,nb,x,d])}
for(let c2 of cd){let pk=c2[0],nb=c2[1],x=c2[2],d=c2[3];
let rg=f(x,nb,m),kk=pk+rg*2**40;if(V2.has(kk))continue;V2.add(kk);
let i2=B2.length;B2.push(nb);Q2.push(x);H2.push((t<<2)|d);(q[n+1]||(q[n+1]=[])).push(i2);
if(nb.length==R[3].length&&nb.every((v,i)=>v==R[3][i])&&(la||V[R[5]]==T)){gl=i2;break outer}}}
if(gl<0){z=0;break}
let ps=[],i2=gl;while(i2){ps.push([H2[i2]>>2,i2,H2[i2]&3]);i2=H2[i2]>>2}ps.reverse();
let cp=R[5];
for(let pr of ps){let st=Q2[pr[1]]-o[pr[2]],w2=u(cp,st,m,B2[pr[0]]);if(w2==null){z=0;break}s+=w2+'UDLR'[pr[2]];cp=Q2[pr[1]]}
if(!z)break;Q=Q2[gl];C=C.filter(x=>!R[1][x]);C.push(...R[3])}
K(U+'/'+id,{recursive:true});Y(U+'/'+id+'/solution.txt',z?s:'')}
