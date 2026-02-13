window.addEventListener("DOMContentLoaded", () => {

const canvas = document.querySelector("canvas") || createCanvas()
const ctx = canvas.getContext("2d")

function createCanvas(){
    const c=document.createElement("canvas")
    document.body.appendChild(c)
    return c
}

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let centerX=canvas.width/2
let centerY=canvas.height/2

// ================= CAMARA =================
let cameraZ=700
const focal=800
const near=5
let pitch=-0.45
let orbitAngle=0
let angle=0
const galaxyTilt=-0.7

// ================= ARRAYS =================
let particles=[]
let spiralImages=[]
let hearts=[]
let words3D=[]
let spaceStars=[]
let stars=[]
let nebulae=[]
let whiteSpiralDust=[]

// ================= PALABRAS =================
const wordList=[
"𝔱𝔢 𝔞𝔪𝔬❤️","𝔪𝔦 𝔞𝔫𝔫𝔦𝔢😍","𝔪𝔦 𝔟𝔢𝔟𝔢","𝔪𝔦 𝔪𝔲𝔫𝔡𝔬🌎💞","𝔥𝔢𝔯𝔪𝔬𝔰𝔞","𝔪𝔦 𝔠𝔬𝔯𝔞𝔷𝔬𝔫💓",
"𝔭𝔯𝔢𝔰𝔦𝔬𝔰𝔞","𝔩𝔬 𝔢𝔯𝔢𝔰 𝔱𝔬𝔡𝔬","E𝔢𝔯𝔢𝔰 𝔪𝔦 𝔰𝔲𝔢ñ𝔬","𝔪𝔦 𝔥𝔬𝔤𝔞𝔯","𝔪𝔦 𝔢𝔰𝔭𝔬𝔰𝔞💍","𝖙𝖚 𝖞 𝖞𝖔♾️"
]

// ================= IMAGENES =================
const imgList=[
    loadImg("img/corazon.png"),
    loadImg("img/imagen1.png"),
    loadImg("img/imagen2.png")
]

function loadImg(src){
    const i=new Image()
    i.src=src
    return i
}

// ================= GALAXIA ROSADA =================
for(let i=0;i<2500;i++){
    let radius=Math.random()*500
    let arm=Math.floor(Math.random()*3)
    let theta=radius*0.02+arm*(Math.PI*2/3)+(Math.random()-0.5)*0.5
    let thickness=50*Math.exp(-radius/250)
    let depth=(Math.random()-0.5)*thickness

    particles.push({
        radius,theta,depth,
        size:Math.random()*2,
        glow:Math.random()
    })
}

// ================= POLVO BLANCO ESPIRAL =================
for(let i=0;i<550;i++){
    let radius=Math.random()*500
    let arm=Math.floor(Math.random()*3)
    let theta=radius*0.02+arm*(Math.PI*2/3)+(Math.random()-0.5)*0.6
    let thickness=70*Math.exp(-radius/250)
    let depth=(Math.random()-0.5)*thickness

    whiteSpiralDust.push({
        radius,theta,depth,
        size:Math.random()*1.3
    })
}

// ================= IMAGENES =================
const ARMS=3
const imagesPerArm=6
for(let arm=0;arm<ARMS;arm++){
for(let i=0;i<imagesPerArm;i++){
    let t=i/imagesPerArm
    let radius=180+t*320
    let theta=radius*0.02+arm*(Math.PI*2/ARMS)
    let thickness=40*Math.exp(-radius/250)
    let depth=(Math.random()-0.5)*thickness

    spiralImages.push({
        radius,theta,depth,
        img:imgList[Math.floor(Math.random()*imgList.length)],
        size:40+Math.random()*40
    })
}}

// ================= PALABRAS MEJORADAS =================
const wordCopies = 3 // cuantas veces se repite cada palabra
const minDistanceFromImages = 50
const minDistanceBetweenWords = 30

function isFarEnough(x, y, list, minDist) {
    for (let obj of list) {
        let ox = Math.cos(obj.theta) * obj.radius
        let oy = Math.sin(obj.theta) * obj.radius * 0.6
        let dx = x - ox
        let dy = y - oy
        if (Math.sqrt(dx*dx + dy*dy) < minDist) return false
    }
    return true
}

for (let copy = 0; copy < wordCopies; copy++) {
    wordList.forEach(text => {

        let placed = false
        let attempts = 0

        while (!placed && attempts < 200) {
            attempts++

            let radius = 100 + Math.random() * 300
            let theta = radius * 0.02 + Math.random() * Math.PI * 2
            let thickness = 50 * Math.exp(-radius / 250)
            let depth = (Math.random() - 0.5) * thickness
            let offset = (Math.random() - 0.5) * 120

            let x = Math.cos(theta) * radius
            let y = Math.sin(theta) * radius * 0.6

            if (
                isFarEnough(x, y, spiralImages, minDistanceFromImages) &&
                isFarEnough(x, y, words3D, minDistanceBetweenWords)
            ) {
                words3D.push({
                    text,
                    radius,
                    theta,
                    depth,
                    offset
                })
                placed = true
            }
        }
    })
}

// ================= CORAZONES =================
for(let i=0;i<10;i++){
    hearts.push({
        angle:Math.random()*Math.PI*2,
        dist:160+Math.random()*220,
        speed:0.002+Math.random()*0.003
    })
}

// ================= ESTRELLAS PARPADEANTES =================
for(let i=0;i<500;i++){
    stars.push({
        x:(Math.random()-0.5)*4000,
        y:(Math.random()-0.5)*4000,
        z:(Math.random()-0.5)*4000,
        size:Math.random()*1.8,
        phase:Math.random()*Math.PI*2,
        speed:0.02+Math.random()*0.03
    })
}

// ================= NEBULOSAS =================
for(let i=0;i<2;i++){
    nebulae.push({
        x:(Math.random()-0.5)*1200,
        y:(Math.random()-0.5)*800,
        z:(Math.random()-0.5)*600,
        size:100+Math.random()*100,
        hue:Math.random()>0.5?320:290
    })
}

// ================= ESTRELLAS FONDO =================
for(let i=0;i<500;i++){
    spaceStars.push({
        x:(Math.random()-0.5)*4000,
        y:(Math.random()-0.5)*4000,
        z:(Math.random()-0.5)*4000,
        size:Math.random()*1.5
    })
}

// ================= CONTROLES =================
canvas.addEventListener("wheel",e=>{
    cameraZ+=e.deltaY*0.6
    cameraZ=Math.max(80,Math.min(4000,cameraZ))
})

let dragging=false,lastX=0,lastY=0
canvas.addEventListener("mousedown",e=>{
    dragging=true
    lastX=e.clientX
    lastY=e.clientY
})
window.addEventListener("mouseup",()=>dragging=false)
window.addEventListener("mousemove",e=>{
    if(!dragging)return
    orbitAngle+=(e.clientX-lastX)*0.004
    pitch+=(e.clientY-lastY)*0.004
    lastX=e.clientX
    lastY=e.clientY
})

// ================= PROYECCION =================
function project(x,y,z){

    let cosT=Math.cos(galaxyTilt)
    let sinT=Math.sin(galaxyTilt)
    let yT=cosT*y-sinT*z
    let zT=sinT*y+cosT*z

    let cosY=Math.cos(orbitAngle)
    let sinY=Math.sin(orbitAngle)
    let dx=cosY*x-sinY*zT
    let dz=sinY*x+cosY*zT

    let cosX=Math.cos(pitch)
    let sinX=Math.sin(pitch)
    let dy=cosX*yT-sinX*dz
    dz=sinX*yT+cosX*dz

    let zCam=dz+cameraZ
    if(zCam<near)return null

    let scale=focal/zCam

    return{
        x:centerX+dx*scale,
        y:centerY+dy*scale,
        scale,
        depth:zCam
    }
}

// ================= RENDER =================
function draw(){

ctx.fillStyle="black"
ctx.fillRect(0,0,canvas.width,canvas.height)
angle+=0.002

let renderList=[]

// ===== AGUJERO NEGRO =====
let core=project(0,0,0)
if(core){
renderList.push({
depth:core.depth,
draw:()=>{
let r=150*core.scale
let g=ctx.createRadialGradient(core.x,core.y,0,core.x,core.y,r)
g.addColorStop(0,"black")
g.addColorStop(0.25,"#ff0080")
g.addColorStop(0.55,"rgba(255,0,149,0.27)")
g.addColorStop(1,"transparent")
ctx.fillStyle=g
ctx.beginPath()
ctx.arc(core.x,core.y,r,0,Math.PI*2)
ctx.fill()
}})
}

// ===== NEBULOSAS =====
nebulae.forEach(n=>{
let pos=project(n.x,n.y,n.z)
if(!pos)return
renderList.push({
depth:pos.depth,
draw:()=>{
let r=n.size*pos.scale
let g=ctx.createRadialGradient(pos.x,pos.y,0,pos.x,pos.y,r)
g.addColorStop(0,`hsla(${n.hue},100%,70%,0.25)`)
g.addColorStop(0.4,`hsla(${n.hue},100%,60%,0.12)`)
g.addColorStop(1,"transparent")
ctx.fillStyle=g
ctx.beginPath()
ctx.arc(pos.x,pos.y,r,0,Math.PI*2)
ctx.fill()
}})
})

// ===== ESTRELLAS PARPADEANTES =====
stars.forEach(s=>{
s.phase+=s.speed
let glow=(Math.sin(s.phase)+1)/2
let pos=project(s.x,s.y,s.z)
if(!pos)return
renderList.push({
depth:pos.depth,
draw:()=>{
ctx.fillStyle=`rgba(255,255,255,${0.4+glow*0.6})`
ctx.beginPath()
ctx.arc(pos.x,pos.y,s.size*pos.scale*(0.7+glow),0,Math.PI*2)
ctx.fill()
}})
})

// ===== ESTRELLAS FONDO =====
spaceStars.forEach(s=>{
let pos=project(s.x,s.y,s.z)
if(!pos)return
renderList.push({
depth:pos.depth,
draw:()=>{
ctx.fillStyle="white"
ctx.beginPath()
ctx.arc(pos.x,pos.y,s.size*pos.scale,0,Math.PI*2)
ctx.fill()
}})
})

// ===== ESPIRAL ROSADO =====
particles.forEach(p=>{
let x=Math.cos(p.theta+angle)*p.radius
let y=Math.sin(p.theta+angle)*p.radius*0.6
let pos=project(x,y,p.depth)
if(!pos)return
renderList.push({
depth:pos.depth,
draw:()=>{
ctx.fillStyle=`rgba(255,80,180,${0.5+p.glow})`
ctx.beginPath()
ctx.arc(pos.x,pos.y,p.size*pos.scale,0,Math.PI*2)
ctx.fill()
}})
})

// ===== POLVO BLANCO ESPIRAL =====
whiteSpiralDust.forEach(p=>{
let x=Math.cos(p.theta+angle)*p.radius
let y=Math.sin(p.theta+angle)*p.radius*0.6
let pos=project(x,y,p.depth)
if(!pos)return
renderList.push({
depth:pos.depth,
draw:()=>{
ctx.fillStyle="rgba(255,255,255,0.9)"
ctx.beginPath()
ctx.arc(pos.x,pos.y,p.size*pos.scale,0,Math.PI*2)
ctx.fill()
}})
})

// ===== IMAGENES =====
spiralImages.forEach(o=>{
let x=Math.cos(o.theta+angle)*o.radius
let y=Math.sin(o.theta+angle)*o.radius*0.6
let pos=project(x,y,o.depth)
if(!pos)return
let s=o.size*pos.scale
renderList.push({
depth:pos.depth,
draw:()=>ctx.drawImage(o.img,pos.x-s/2,pos.y-s/2,s,s)
})
})

// ===== PALABRAS =====
words3D.forEach(w=>{
let baseX=Math.cos(w.theta+angle)*w.radius
let baseY=Math.sin(w.theta+angle)*w.radius*0.6
let sideX=Math.cos(w.theta+angle+Math.PI/2)*w.offset
let sideY=Math.sin(w.theta+angle+Math.PI/2)*w.offset
let pos=project(baseX+sideX,baseY+sideY,w.depth)
if(!pos)return
renderList.push({
depth:pos.depth,
draw:()=>{
ctx.fillStyle="white"
ctx.font=`${12*pos.scale}px Arial`
ctx.textAlign="center"
ctx.textBaseline="middle"
ctx.fillText(w.text,pos.x,pos.y)
}})
})

// ===== CORAZONES =====
hearts.forEach(h=>{
h.angle+=h.speed
let pos=project(Math.cos(h.angle)*h.dist,Math.sin(h.angle)*h.dist*0.6,0)
if(!pos)return
renderList.push({
depth:pos.depth,
draw:()=>{
ctx.font=`${16*pos.scale}px serif`
ctx.fillText("💗",pos.x,pos.y)
}})
})

renderList.sort((a,b)=>b.depth-a.depth)
renderList.forEach(o=>o.draw())

requestAnimationFrame(draw)
}

draw()

})
// ===== MUSICA (PRIMER CLICK) =====
const musica = document.getElementById("musica");

document.addEventListener("click", ()=>{
  musica.volume = 1;
  musica.play().catch(()=>{});
}, { once:true });
