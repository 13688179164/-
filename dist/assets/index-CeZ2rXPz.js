(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Jo="171",gs={ROTATE:0,DOLLY:1,PAN:2},ps={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},tu=0,xl=1,eu=2,Zc=1,Jc=2,Hn=3,vi=0,sn=1,nn=2,$n=0,Kn=1,De=2,bl=3,El=4,nu=5,Di=100,iu=101,su=102,ru=103,au=104,ou=200,lu=201,cu=202,hu=203,ao=204,oo=205,uu=206,du=207,fu=208,pu=209,mu=210,gu=211,_u=212,vu=213,yu=214,lo=0,co=1,ho=2,Ms=3,uo=4,fo=5,po=6,mo=7,Qc=0,Mu=1,Su=2,fi=0,th=1,eh=2,nh=3,Qo=4,xu=5,ih=6,sh=7,rh=300,Ss=301,xs=302,jr=303,go=304,ca=306,Zr=1e3,Ii=1001,_o=1002,pn=1003,bu=1004,lr=1005,Ln=1006,va=1007,Ui=1008,Jn=1009,ah=1010,oh=1011,er=1012,tl=1013,Fi=1014,In=1015,Un=1016,el=1017,nl=1018,bs=1020,lh=35902,ch=1021,hh=1022,wn=1023,uh=1024,dh=1025,_s=1026,Es=1027,il=1028,sl=1029,fh=1030,rl=1031,al=1033,Hr=33776,Vr=33777,Wr=33778,Xr=33779,vo=35840,yo=35841,Mo=35842,So=35843,xo=36196,bo=37492,Eo=37496,To=37808,wo=37809,Ao=37810,Co=37811,Ro=37812,Po=37813,Do=37814,Lo=37815,Io=37816,Uo=37817,No=37818,Oo=37819,Fo=37820,Bo=37821,qr=36492,ko=36494,zo=36495,ph=36283,Go=36284,Ho=36285,Vo=36286,Eu=3200,Tu=3201,mh=0,wu=1,Wn="",en="srgb",Ts="srgb-linear",Jr="linear",pe="srgb",Xi=7680,Tl=519,Au=512,Cu=513,Ru=514,gh=515,Pu=516,Du=517,Lu=518,Iu=519,Wo=35044,Xn=35048,wl="300 es",Yn=2e3,Qr=2001;class Bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Al=1234567;const js=Math.PI/180,nr=180/Math.PI;function jn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ye[i&255]+Ye[i>>8&255]+Ye[i>>16&255]+Ye[i>>24&255]+"-"+Ye[t&255]+Ye[t>>8&255]+"-"+Ye[t>>16&15|64]+Ye[t>>24&255]+"-"+Ye[e&63|128]+Ye[e>>8&255]+"-"+Ye[e>>16&255]+Ye[e>>24&255]+Ye[n&255]+Ye[n>>8&255]+Ye[n>>16&255]+Ye[n>>24&255]).toLowerCase()}function $t(i,t,e){return Math.max(t,Math.min(e,i))}function ol(i,t){return(i%t+t)%t}function Uu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Nu(i,t,e){return i!==t?(e-i)/(t-i):0}function Zs(i,t,e){return(1-e)*i+e*t}function Ou(i,t,e,n){return Zs(i,t,1-Math.exp(-e*n))}function Fu(i,t=1){return t-Math.abs(ol(i,t*2)-t)}function Bu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function ku(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function zu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Gu(i,t){return i+Math.random()*(t-i)}function Hu(i){return i*(.5-Math.random())}function Vu(i){i!==void 0&&(Al=i);let t=Al+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Wu(i){return i*js}function Xu(i){return i*nr}function qu(i){return(i&i-1)===0&&i!==0}function Yu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function $u(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ku(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),h=r((t+n)/2),c=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),p=r((n-t)/2),_=a((n-t)/2);switch(s){case"XYX":i.set(o*c,l*u,l*d,o*h);break;case"YZY":i.set(l*d,o*c,l*u,o*h);break;case"ZXZ":i.set(l*u,l*d,o*c,o*h);break;case"XZX":i.set(o*c,l*_,l*p,o*h);break;case"YXY":i.set(l*p,o*c,l*_,o*h);break;case"ZYZ":i.set(l*_,l*p,o*c,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Tn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function me(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Oi={DEG2RAD:js,RAD2DEG:nr,generateUUID:jn,clamp:$t,euclideanModulo:ol,mapLinear:Uu,inverseLerp:Nu,lerp:Zs,damp:Ou,pingpong:Fu,smoothstep:Bu,smootherstep:ku,randInt:zu,randFloat:Gu,randFloatSpread:Hu,seededRandom:Vu,degToRad:Wu,radToDeg:Xu,isPowerOfTwo:qu,ceilPowerOfTwo:Yu,floorPowerOfTwo:$u,setQuaternionFromProperEuler:Ku,normalize:me,denormalize:Tn};class ut{constructor(t=0,e=0){ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,n,s,r,a,o,l,h){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,h)}set(t,e,n,s,r,a,o,l,h){const c=this.elements;return c[0]=t,c[1]=s,c[2]=o,c[3]=e,c[4]=r,c[5]=l,c[6]=n,c[7]=a,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],h=n[1],c=n[4],u=n[7],d=n[2],p=n[5],_=n[8],v=s[0],g=s[3],m=s[6],w=s[1],T=s[4],f=s[7],D=s[2],R=s[5],P=s[8];return r[0]=a*v+o*w+l*D,r[3]=a*g+o*T+l*R,r[6]=a*m+o*f+l*P,r[1]=h*v+c*w+u*D,r[4]=h*g+c*T+u*R,r[7]=h*m+c*f+u*P,r[2]=d*v+p*w+_*D,r[5]=d*g+p*T+_*R,r[8]=d*m+p*f+_*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],c=t[8];return e*a*c-e*o*h-n*r*c+n*o*l+s*r*h-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=c*a-o*h,d=o*l-c*r,p=h*r-a*l,_=e*u+n*d+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return t[0]=u*v,t[1]=(s*h-c*n)*v,t[2]=(o*n-s*a)*v,t[3]=d*v,t[4]=(c*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=p*v,t[7]=(n*l-h*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),h=Math.sin(r);return this.set(n*l,n*h,-n*(l*a+h*o)+a+t,-s*h,s*l,-s*(-h*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ya.makeScale(t,e)),this}rotate(t){return this.premultiply(ya.makeRotation(-t)),this}translate(t,e){return this.premultiply(ya.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ya=new Kt;function _h(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ta(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ju(){const i=ta("canvas");return i.style.display="block",i}const Cl={};function fs(i){i in Cl||(Cl[i]=!0,console.warn(i))}function Zu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Ju(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Qu(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Rl=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pl=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function td(){const i={enabled:!0,workingColorSpace:Ts,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===pe&&(s.r=Zn(s.r),s.g=Zn(s.g),s.b=Zn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===pe&&(s.r=vs(s.r),s.g=vs(s.g),s.b=vs(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Wn?Jr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ts]:{primaries:t,whitePoint:n,transfer:Jr,toXYZ:Rl,fromXYZ:Pl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:t,whitePoint:n,transfer:pe,toXYZ:Rl,fromXYZ:Pl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:en}}}),i}const he=td();function Zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function vs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let qi;class ed{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{qi===void 0&&(qi=ta("canvas")),qi.width=t.width,qi.height=t.height;const n=qi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=qi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ta("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Zn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Zn(e[n]/255)*255):e[n]=Zn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let nd=0;class vh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nd++}),this.uuid=jn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ma(s[a].image)):r.push(Ma(s[a]))}else r=Ma(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ma(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ed.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let id=0;class je extends Bi{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=Ii,s=Ii,r=Ln,a=Ui,o=wn,l=Jn,h=je.DEFAULT_ANISOTROPY,c=Wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:id++}),this.uuid=jn(),this.name="",this.source=new vh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Zr:t.x=t.x-Math.floor(t.x);break;case Ii:t.x=t.x<0?0:1;break;case _o:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Zr:t.y=t.y-Math.floor(t.y);break;case Ii:t.y=t.y<0?0:1;break;case _o:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=rh;je.DEFAULT_ANISOTROPY=1;class Me{constructor(t=0,e=0,n=0,s=1){Me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,h=l[0],c=l[4],u=l[8],d=l[1],p=l[5],_=l[9],v=l[2],g=l[6],m=l[10];if(Math.abs(c-d)<.01&&Math.abs(u-v)<.01&&Math.abs(_-g)<.01){if(Math.abs(c+d)<.1&&Math.abs(u+v)<.1&&Math.abs(_+g)<.1&&Math.abs(h+p+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(h+1)/2,f=(p+1)/2,D=(m+1)/2,R=(c+d)/4,P=(u+v)/4,I=(_+g)/4;return T>f&&T>D?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=R/n,r=P/n):f>D?f<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(f),n=R/s,r=I/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=P/r,s=I/r),this.set(n,s,r,e),this}let w=Math.sqrt((g-_)*(g-_)+(u-v)*(u-v)+(d-c)*(d-c));return Math.abs(w)<.001&&(w=1),this.x=(g-_)/w,this.y=(u-v)/w,this.z=(d-c)/w,this.w=Math.acos((h+p+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this.w=$t(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this.w=$t(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class sd extends Bi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new je(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new vh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mn extends sd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class yh extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=pn,this.minFilter=pn,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class rd extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=pn,this.minFilter=pn,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],h=n[s+1],c=n[s+2],u=n[s+3];const d=r[a+0],p=r[a+1],_=r[a+2],v=r[a+3];if(o===0){t[e+0]=l,t[e+1]=h,t[e+2]=c,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=_,t[e+3]=v;return}if(u!==v||l!==d||h!==p||c!==_){let g=1-o;const m=l*d+h*p+c*_+u*v,w=m>=0?1:-1,T=1-m*m;if(T>Number.EPSILON){const D=Math.sqrt(T),R=Math.atan2(D,m*w);g=Math.sin(g*R)/D,o=Math.sin(o*R)/D}const f=o*w;if(l=l*g+d*f,h=h*g+p*f,c=c*g+_*f,u=u*g+v*f,g===1-o){const D=1/Math.sqrt(l*l+h*h+c*c+u*u);l*=D,h*=D,c*=D,u*=D}}t[e]=l,t[e+1]=h,t[e+2]=c,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],h=n[s+2],c=n[s+3],u=r[a],d=r[a+1],p=r[a+2],_=r[a+3];return t[e]=o*_+c*u+l*p-h*d,t[e+1]=l*_+c*d+h*u-o*p,t[e+2]=h*_+c*p+o*d-l*u,t[e+3]=c*_-o*u-l*d-h*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,h=o(n/2),c=o(s/2),u=o(r/2),d=l(n/2),p=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=d*c*u+h*p*_,this._y=h*p*u-d*c*_,this._z=h*c*_+d*p*u,this._w=h*c*u-d*p*_;break;case"YXZ":this._x=d*c*u+h*p*_,this._y=h*p*u-d*c*_,this._z=h*c*_-d*p*u,this._w=h*c*u+d*p*_;break;case"ZXY":this._x=d*c*u-h*p*_,this._y=h*p*u+d*c*_,this._z=h*c*_+d*p*u,this._w=h*c*u-d*p*_;break;case"ZYX":this._x=d*c*u-h*p*_,this._y=h*p*u+d*c*_,this._z=h*c*_-d*p*u,this._w=h*c*u+d*p*_;break;case"YZX":this._x=d*c*u+h*p*_,this._y=h*p*u+d*c*_,this._z=h*c*_-d*p*u,this._w=h*c*u-d*p*_;break;case"XZY":this._x=d*c*u-h*p*_,this._y=h*p*u-d*c*_,this._z=h*c*_+d*p*u,this._w=h*c*u+d*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],h=e[2],c=e[6],u=e[10],d=n+o+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(c-l)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(c-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+c)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(l+c)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($t(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,h=e._z,c=e._w;return this._x=n*c+a*o+s*h-r*l,this._y=s*c+a*l+r*o-n*h,this._z=r*c+a*h+n*l-s*o,this._w=a*c-n*o-s*l-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const h=Math.sqrt(l),c=Math.atan2(h,o),u=Math.sin((1-e)*c)/h,d=Math.sin(e*c)/h;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Dl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Dl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,h=2*(a*s-o*n),c=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+l*h+a*u-o*c,this.y=n+l*c+o*h-r*u,this.z=s+l*u+r*c-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Sa.copy(this).projectOnVector(t),this.sub(Sa)}reflect(t){return this.sub(Sa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Sa=new C,Dl=new Qn;class ki{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Sn):Sn.fromBufferAttribute(r,a),Sn.applyMatrix4(t.matrixWorld),this.expandByPoint(Sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),cr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),cr.copy(n.boundingBox)),cr.applyMatrix4(t.matrixWorld),this.union(cr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Sn),Sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ls),hr.subVectors(this.max,Ls),Yi.subVectors(t.a,Ls),$i.subVectors(t.b,Ls),Ki.subVectors(t.c,Ls),ii.subVectors($i,Yi),si.subVectors(Ki,$i),xi.subVectors(Yi,Ki);let e=[0,-ii.z,ii.y,0,-si.z,si.y,0,-xi.z,xi.y,ii.z,0,-ii.x,si.z,0,-si.x,xi.z,0,-xi.x,-ii.y,ii.x,0,-si.y,si.x,0,-xi.y,xi.x,0];return!xa(e,Yi,$i,Ki,hr)||(e=[1,0,0,0,1,0,0,0,1],!xa(e,Yi,$i,Ki,hr))?!1:(ur.crossVectors(ii,si),e=[ur.x,ur.y,ur.z],xa(e,Yi,$i,Ki,hr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Fn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Fn=[new C,new C,new C,new C,new C,new C,new C,new C],Sn=new C,cr=new ki,Yi=new C,$i=new C,Ki=new C,ii=new C,si=new C,xi=new C,Ls=new C,hr=new C,ur=new C,bi=new C;function xa(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){bi.fromArray(i,r);const o=s.x*Math.abs(bi.x)+s.y*Math.abs(bi.y)+s.z*Math.abs(bi.z),l=t.dot(bi),h=e.dot(bi),c=n.dot(bi);if(Math.max(-Math.max(l,h,c),Math.min(l,h,c))>o)return!1}return!0}const ad=new ki,Is=new C,ba=new C;class zi{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ad.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Is.subVectors(t,this.center);const e=Is.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Is,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ba.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Is.copy(t.center).add(ba)),this.expandByPoint(Is.copy(t.center).sub(ba))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Bn=new C,Ea=new C,dr=new C,ri=new C,Ta=new C,fr=new C,wa=new C;class sr{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Bn.copy(this.origin).addScaledVector(this.direction,e),Bn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ea.copy(t).add(e).multiplyScalar(.5),dr.copy(e).sub(t).normalize(),ri.copy(this.origin).sub(Ea);const r=t.distanceTo(e)*.5,a=-this.direction.dot(dr),o=ri.dot(this.direction),l=-ri.dot(dr),h=ri.lengthSq(),c=Math.abs(1-a*a);let u,d,p,_;if(c>0)if(u=a*l-o,d=a*o-l,_=r*c,u>=0)if(d>=-_)if(d<=_){const v=1/c;u*=v,d*=v,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+h}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+h;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+h;else d<=-_?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+h):d<=_?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+h):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+h);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ea).addScaledVector(dr,d),p}intersectSphere(t,e){Bn.subVectors(t.center,this.origin);const n=Bn.dot(this.direction),s=Bn.dot(Bn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const h=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,d=this.origin;return h>=0?(n=(t.min.x-d.x)*h,s=(t.max.x-d.x)*h):(n=(t.max.x-d.x)*h,s=(t.min.x-d.x)*h),c>=0?(r=(t.min.y-d.y)*c,a=(t.max.y-d.y)*c):(r=(t.max.y-d.y)*c,a=(t.min.y-d.y)*c),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Bn)!==null}intersectTriangle(t,e,n,s,r){Ta.subVectors(e,t),fr.subVectors(n,t),wa.crossVectors(Ta,fr);let a=this.direction.dot(wa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ri.subVectors(this.origin,t);const l=o*this.direction.dot(fr.crossVectors(ri,fr));if(l<0)return null;const h=o*this.direction.dot(Ta.cross(ri));if(h<0||l+h>a)return null;const c=-o*ri.dot(wa);return c<0?null:this.at(c/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ce{constructor(t,e,n,s,r,a,o,l,h,c,u,d,p,_,v,g){ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,h,c,u,d,p,_,v,g)}set(t,e,n,s,r,a,o,l,h,c,u,d,p,_,v,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=h,m[6]=c,m[10]=u,m[14]=d,m[3]=p,m[7]=_,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ce().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ji.setFromMatrixColumn(t,0).length(),r=1/ji.setFromMatrixColumn(t,1).length(),a=1/ji.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),h=Math.sin(s),c=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*c,p=a*u,_=o*c,v=o*u;e[0]=l*c,e[4]=-l*u,e[8]=h,e[1]=p+_*h,e[5]=d-v*h,e[9]=-o*l,e[2]=v-d*h,e[6]=_+p*h,e[10]=a*l}else if(t.order==="YXZ"){const d=l*c,p=l*u,_=h*c,v=h*u;e[0]=d+v*o,e[4]=_*o-p,e[8]=a*h,e[1]=a*u,e[5]=a*c,e[9]=-o,e[2]=p*o-_,e[6]=v+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*c,p=l*u,_=h*c,v=h*u;e[0]=d-v*o,e[4]=-a*u,e[8]=_+p*o,e[1]=p+_*o,e[5]=a*c,e[9]=v-d*o,e[2]=-a*h,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*c,p=a*u,_=o*c,v=o*u;e[0]=l*c,e[4]=_*h-p,e[8]=d*h+v,e[1]=l*u,e[5]=v*h+d,e[9]=p*h-_,e[2]=-h,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,p=a*h,_=o*l,v=o*h;e[0]=l*c,e[4]=v-d*u,e[8]=_*u+p,e[1]=u,e[5]=a*c,e[9]=-o*c,e[2]=-h*c,e[6]=p*u+_,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*l,p=a*h,_=o*l,v=o*h;e[0]=l*c,e[4]=-u,e[8]=h*c,e[1]=d*u+v,e[5]=a*c,e[9]=p*u-_,e[2]=_*u-p,e[6]=o*c,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(od,t,ld)}lookAt(t,e,n){const s=this.elements;return cn.subVectors(t,e),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),ai.crossVectors(n,cn),ai.lengthSq()===0&&(Math.abs(n.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),ai.crossVectors(n,cn)),ai.normalize(),pr.crossVectors(cn,ai),s[0]=ai.x,s[4]=pr.x,s[8]=cn.x,s[1]=ai.y,s[5]=pr.y,s[9]=cn.y,s[2]=ai.z,s[6]=pr.z,s[10]=cn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],h=n[12],c=n[1],u=n[5],d=n[9],p=n[13],_=n[2],v=n[6],g=n[10],m=n[14],w=n[3],T=n[7],f=n[11],D=n[15],R=s[0],P=s[4],I=s[8],x=s[12],S=s[1],U=s[5],q=s[9],V=s[13],tt=s[2],rt=s[6],Z=s[10],lt=s[14],$=s[3],xt=s[7],bt=s[11],Bt=s[15];return r[0]=a*R+o*S+l*tt+h*$,r[4]=a*P+o*U+l*rt+h*xt,r[8]=a*I+o*q+l*Z+h*bt,r[12]=a*x+o*V+l*lt+h*Bt,r[1]=c*R+u*S+d*tt+p*$,r[5]=c*P+u*U+d*rt+p*xt,r[9]=c*I+u*q+d*Z+p*bt,r[13]=c*x+u*V+d*lt+p*Bt,r[2]=_*R+v*S+g*tt+m*$,r[6]=_*P+v*U+g*rt+m*xt,r[10]=_*I+v*q+g*Z+m*bt,r[14]=_*x+v*V+g*lt+m*Bt,r[3]=w*R+T*S+f*tt+D*$,r[7]=w*P+T*U+f*rt+D*xt,r[11]=w*I+T*q+f*Z+D*bt,r[15]=w*x+T*V+f*lt+D*Bt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],h=t[13],c=t[2],u=t[6],d=t[10],p=t[14],_=t[3],v=t[7],g=t[11],m=t[15];return _*(+r*l*u-s*h*u-r*o*d+n*h*d+s*o*p-n*l*p)+v*(+e*l*p-e*h*d+r*a*d-s*a*p+s*h*c-r*l*c)+g*(+e*h*u-e*o*p-r*a*u+n*a*p+r*o*c-n*h*c)+m*(-s*o*c-e*l*u+e*o*d+s*a*u-n*a*d+n*l*c)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=t[9],d=t[10],p=t[11],_=t[12],v=t[13],g=t[14],m=t[15],w=u*g*h-v*d*h+v*l*p-o*g*p-u*l*m+o*d*m,T=_*d*h-c*g*h-_*l*p+a*g*p+c*l*m-a*d*m,f=c*v*h-_*u*h+_*o*p-a*v*p-c*o*m+a*u*m,D=_*u*l-c*v*l-_*o*d+a*v*d+c*o*g-a*u*g,R=e*w+n*T+s*f+r*D;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/R;return t[0]=w*P,t[1]=(v*d*r-u*g*r-v*s*p+n*g*p+u*s*m-n*d*m)*P,t[2]=(o*g*r-v*l*r+v*s*h-n*g*h-o*s*m+n*l*m)*P,t[3]=(u*l*r-o*d*r-u*s*h+n*d*h+o*s*p-n*l*p)*P,t[4]=T*P,t[5]=(c*g*r-_*d*r+_*s*p-e*g*p-c*s*m+e*d*m)*P,t[6]=(_*l*r-a*g*r-_*s*h+e*g*h+a*s*m-e*l*m)*P,t[7]=(a*d*r-c*l*r+c*s*h-e*d*h-a*s*p+e*l*p)*P,t[8]=f*P,t[9]=(_*u*r-c*v*r-_*n*p+e*v*p+c*n*m-e*u*m)*P,t[10]=(a*v*r-_*o*r+_*n*h-e*v*h-a*n*m+e*o*m)*P,t[11]=(c*o*r-a*u*r-c*n*h+e*u*h+a*n*p-e*o*p)*P,t[12]=D*P,t[13]=(c*v*s-_*u*s+_*n*d-e*v*d-c*n*g+e*u*g)*P,t[14]=(_*o*s-a*v*s-_*n*l+e*v*l+a*n*g-e*o*g)*P,t[15]=(a*u*s-c*o*s+c*n*l-e*u*l-a*n*d+e*o*d)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,h=r*a,c=r*o;return this.set(h*a+n,h*o-s*l,h*l+s*o,0,h*o+s*l,c*o+n,c*l-s*a,0,h*l-s*o,c*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,h=r+r,c=a+a,u=o+o,d=r*h,p=r*c,_=r*u,v=a*c,g=a*u,m=o*u,w=l*h,T=l*c,f=l*u,D=n.x,R=n.y,P=n.z;return s[0]=(1-(v+m))*D,s[1]=(p+f)*D,s[2]=(_-T)*D,s[3]=0,s[4]=(p-f)*R,s[5]=(1-(d+m))*R,s[6]=(g+w)*R,s[7]=0,s[8]=(_+T)*P,s[9]=(g-w)*P,s[10]=(1-(d+v))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ji.set(s[0],s[1],s[2]).length();const a=ji.set(s[4],s[5],s[6]).length(),o=ji.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],xn.copy(this);const h=1/r,c=1/a,u=1/o;return xn.elements[0]*=h,xn.elements[1]*=h,xn.elements[2]*=h,xn.elements[4]*=c,xn.elements[5]*=c,xn.elements[6]*=c,xn.elements[8]*=u,xn.elements[9]*=u,xn.elements[10]*=u,e.setFromRotationMatrix(xn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Yn){const l=this.elements,h=2*r/(e-t),c=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let p,_;if(o===Yn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Qr)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=c,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Yn){const l=this.elements,h=1/(e-t),c=1/(n-s),u=1/(a-r),d=(e+t)*h,p=(n+s)*c;let _,v;if(o===Yn)_=(a+r)*u,v=-2*u;else if(o===Qr)_=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*h,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*c,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ji=new C,xn=new ce,od=new C(0,0,0),ld=new C(1,1,1),ai=new C,pr=new C,cn=new C,Ll=new ce,Il=new Qn;class Nn{constructor(t=0,e=0,n=0,s=Nn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],h=s[5],c=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin($t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin($t(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin($t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-$t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-c,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ll.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ll,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Il.setFromEuler(this),this.setFromQuaternion(Il,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Nn.DEFAULT_ORDER="XYZ";class ll{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let cd=0;const Ul=new C,Zi=new Qn,kn=new ce,mr=new C,Us=new C,hd=new C,ud=new Qn,Nl=new C(1,0,0),Ol=new C(0,1,0),Fl=new C(0,0,1),Bl={type:"added"},dd={type:"removed"},Ji={type:"childadded",child:null},Aa={type:"childremoved",child:null};class Ue extends Bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cd++}),this.uuid=jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ue.DEFAULT_UP.clone();const t=new C,e=new Nn,n=new Qn,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ce},normalMatrix:{value:new Kt}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=Ue.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ll,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Zi.setFromAxisAngle(t,e),this.quaternion.multiply(Zi),this}rotateOnWorldAxis(t,e){return Zi.setFromAxisAngle(t,e),this.quaternion.premultiply(Zi),this}rotateX(t){return this.rotateOnAxis(Nl,t)}rotateY(t){return this.rotateOnAxis(Ol,t)}rotateZ(t){return this.rotateOnAxis(Fl,t)}translateOnAxis(t,e){return Ul.copy(t).applyQuaternion(this.quaternion),this.position.add(Ul.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nl,t)}translateY(t){return this.translateOnAxis(Ol,t)}translateZ(t){return this.translateOnAxis(Fl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(kn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?mr.copy(t):mr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?kn.lookAt(Us,mr,this.up):kn.lookAt(mr,Us,this.up),this.quaternion.setFromRotationMatrix(kn),s&&(kn.extractRotation(s.matrixWorld),Zi.setFromRotationMatrix(kn),this.quaternion.premultiply(Zi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Bl),Ji.child=t,this.dispatchEvent(Ji),Ji.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(dd),Aa.child=t,this.dispatchEvent(Aa),Aa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),kn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),kn.multiply(t.parent.matrixWorld)),t.applyMatrix4(kn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bl),Ji.child=t,this.dispatchEvent(Ji),Ji.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,t,hd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,ud,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let h=0,c=l.length;h<c;h++){const u=l[h];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),h=a(t.textures),c=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),_=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),h.length>0&&(n.textures=h),c.length>0&&(n.images=c),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(o){const l=[];for(const h in o){const c=o[h];delete c.metadata,l.push(c)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ue.DEFAULT_UP=new C(0,1,0);Ue.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bn=new C,zn=new C,Ca=new C,Gn=new C,Qi=new C,ts=new C,kl=new C,Ra=new C,Pa=new C,Da=new C,La=new Me,Ia=new Me,Ua=new Me;class vn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),bn.subVectors(t,e),s.cross(bn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){bn.subVectors(s,e),zn.subVectors(n,e),Ca.subVectors(t,e);const a=bn.dot(bn),o=bn.dot(zn),l=bn.dot(Ca),h=zn.dot(zn),c=zn.dot(Ca),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,p=(h*l-o*c)*d,_=(a*c-o*l)*d;return r.set(1-p-_,_,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Gn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Gn.x),l.addScaledVector(a,Gn.y),l.addScaledVector(o,Gn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return La.setScalar(0),Ia.setScalar(0),Ua.setScalar(0),La.fromBufferAttribute(t,e),Ia.fromBufferAttribute(t,n),Ua.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(La,r.x),a.addScaledVector(Ia,r.y),a.addScaledVector(Ua,r.z),a}static isFrontFacing(t,e,n,s){return bn.subVectors(n,e),zn.subVectors(t,e),bn.cross(zn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return bn.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),bn.cross(zn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return vn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return vn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return vn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return vn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return vn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Qi.subVectors(s,n),ts.subVectors(r,n),Ra.subVectors(t,n);const l=Qi.dot(Ra),h=ts.dot(Ra);if(l<=0&&h<=0)return e.copy(n);Pa.subVectors(t,s);const c=Qi.dot(Pa),u=ts.dot(Pa);if(c>=0&&u<=c)return e.copy(s);const d=l*u-c*h;if(d<=0&&l>=0&&c<=0)return a=l/(l-c),e.copy(n).addScaledVector(Qi,a);Da.subVectors(t,r);const p=Qi.dot(Da),_=ts.dot(Da);if(_>=0&&p<=_)return e.copy(r);const v=p*h-l*_;if(v<=0&&h>=0&&_<=0)return o=h/(h-_),e.copy(n).addScaledVector(ts,o);const g=c*_-p*u;if(g<=0&&u-c>=0&&p-_>=0)return kl.subVectors(r,s),o=(u-c)/(u-c+(p-_)),e.copy(s).addScaledVector(kl,o);const m=1/(g+v+d);return a=v*m,o=d*m,e.copy(n).addScaledVector(Qi,a).addScaledVector(ts,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Mh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},oi={h:0,s:0,l:0},gr={h:0,s:0,l:0};function Na(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Rt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=en){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=he.workingColorSpace){if(t=ol(t,1),e=$t(e,0,1),n=$t(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Na(a,r,t+1/3),this.g=Na(a,r,t),this.b=Na(a,r,t-1/3)}return he.toWorkingColorSpace(this,s),this}setStyle(t,e=en){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=en){const n=Mh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zn(t.r),this.g=Zn(t.g),this.b=Zn(t.b),this}copyLinearToSRGB(t){return this.r=vs(t.r),this.g=vs(t.g),this.b=vs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=en){return he.fromWorkingColorSpace($e.copy(this),t),Math.round($t($e.r*255,0,255))*65536+Math.round($t($e.g*255,0,255))*256+Math.round($t($e.b*255,0,255))}getHexString(t=en){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace($e.copy(this),e);const n=$e.r,s=$e.g,r=$e.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,h;const c=(o+a)/2;if(o===a)l=0,h=0;else{const u=a-o;switch(h=c<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=h,t.l=c,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=en){he.fromWorkingColorSpace($e.copy(this),t);const e=$e.r,n=$e.g,s=$e.b;return t!==en?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(oi),this.setHSL(oi.h+t,oi.s+e,oi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(oi),t.getHSL(gr);const n=Zs(oi.h,gr.h,e),s=Zs(oi.s,gr.s,e),r=Zs(oi.l,gr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new Rt;Rt.NAMES=Mh;let fd=0;class yi extends Bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fd++}),this.uuid=jn(),this.name="",this.type="Material",this.blending=Kn,this.side=vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ao,this.blendDst=oo,this.blendEquation=Di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Rt(0,0,0),this.blendAlpha=0,this.depthFunc=Ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Tl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Kn&&(n.blending=this.blending),this.side!==vi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ao&&(n.blendSrc=this.blendSrc),this.blendDst!==oo&&(n.blendDst=this.blendDst),this.blendEquation!==Di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ms&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Tl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Wt extends yi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=Qc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Oe=new C,_r=new ut;class se{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Wo,this.updateRanges=[],this.gpuType=In,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)_r.fromBufferAttribute(this,e),_r.applyMatrix3(t),this.setXY(e,_r.x,_r.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix3(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix4(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyNormalMatrix(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.transformDirection(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Tn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=me(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Tn(e,this.array)),e}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Tn(e,this.array)),e}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Tn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Tn(e,this.array)),e}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array),s=me(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array),s=me(s,this.array),r=me(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Wo&&(t.usage=this.usage),t}}class Sh extends se{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class xh extends se{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ge extends se{constructor(t,e,n){super(new Float32Array(t),e,n)}}let pd=0;const mn=new ce,Oa=new Ue,es=new C,hn=new ki,Ns=new ki,He=new C;class Te extends Bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pd++}),this.uuid=jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_h(t)?xh:Sh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return mn.makeRotationFromQuaternion(t),this.applyMatrix4(mn),this}rotateX(t){return mn.makeRotationX(t),this.applyMatrix4(mn),this}rotateY(t){return mn.makeRotationY(t),this.applyMatrix4(mn),this}rotateZ(t){return mn.makeRotationZ(t),this.applyMatrix4(mn),this}translate(t,e,n){return mn.makeTranslation(t,e,n),this.applyMatrix4(mn),this}scale(t,e,n){return mn.makeScale(t,e,n),this.applyMatrix4(mn),this}lookAt(t){return Oa.lookAt(t),Oa.updateMatrix(),this.applyMatrix4(Oa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(es).negate(),this.translate(es.x,es.y,es.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ge(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ki);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];hn.setFromBufferAttribute(r),this.morphTargetsRelative?(He.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(He),He.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(He)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(hn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Ns.setFromBufferAttribute(o),this.morphTargetsRelative?(He.addVectors(hn.min,Ns.min),hn.expandByPoint(He),He.addVectors(hn.max,Ns.max),hn.expandByPoint(He)):(hn.expandByPoint(Ns.min),hn.expandByPoint(Ns.max))}hn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)He.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(He));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let h=0,c=o.count;h<c;h++)He.fromBufferAttribute(o,h),l&&(es.fromBufferAttribute(t,h),He.add(es)),s=Math.max(s,n.distanceToSquared(He))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new se(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let I=0;I<n.count;I++)o[I]=new C,l[I]=new C;const h=new C,c=new C,u=new C,d=new ut,p=new ut,_=new ut,v=new C,g=new C;function m(I,x,S){h.fromBufferAttribute(n,I),c.fromBufferAttribute(n,x),u.fromBufferAttribute(n,S),d.fromBufferAttribute(r,I),p.fromBufferAttribute(r,x),_.fromBufferAttribute(r,S),c.sub(h),u.sub(h),p.sub(d),_.sub(d);const U=1/(p.x*_.y-_.x*p.y);isFinite(U)&&(v.copy(c).multiplyScalar(_.y).addScaledVector(u,-p.y).multiplyScalar(U),g.copy(u).multiplyScalar(p.x).addScaledVector(c,-_.x).multiplyScalar(U),o[I].add(v),o[x].add(v),o[S].add(v),l[I].add(g),l[x].add(g),l[S].add(g))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let I=0,x=w.length;I<x;++I){const S=w[I],U=S.start,q=S.count;for(let V=U,tt=U+q;V<tt;V+=3)m(t.getX(V+0),t.getX(V+1),t.getX(V+2))}const T=new C,f=new C,D=new C,R=new C;function P(I){D.fromBufferAttribute(s,I),R.copy(D);const x=o[I];T.copy(x),T.sub(D.multiplyScalar(D.dot(x))).normalize(),f.crossVectors(R,x);const U=f.dot(l[I])<0?-1:1;a.setXYZW(I,T.x,T.y,T.z,U)}for(let I=0,x=w.length;I<x;++I){const S=w[I],U=S.start,q=S.count;for(let V=U,tt=U+q;V<tt;V+=3)P(t.getX(V+0)),P(t.getX(V+1)),P(t.getX(V+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new se(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new C,r=new C,a=new C,o=new C,l=new C,h=new C,c=new C,u=new C;if(t)for(let d=0,p=t.count;d<p;d+=3){const _=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),c.subVectors(a,r),u.subVectors(s,r),c.cross(u),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,g),o.add(c),l.add(c),h.add(c),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,h.x,h.y,h.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),c.subVectors(a,r),u.subVectors(s,r),c.cross(u),n.setXYZ(d+0,c.x,c.y,c.z),n.setXYZ(d+1,c.x,c.y,c.z),n.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)He.fromBufferAttribute(t,e),He.normalize(),t.setXYZ(e,He.x,He.y,He.z)}toNonIndexed(){function t(o,l){const h=o.array,c=o.itemSize,u=o.normalized,d=new h.constructor(l.length*c);let p=0,_=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?p=l[v]*o.data.stride+o.offset:p=l[v]*c;for(let m=0;m<c;m++)d[_++]=h[p++]}return new se(d,c,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Te,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],h=t(l,n);e.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const l=[],h=r[o];for(let c=0,u=h.length;c<u;c++){const d=h[c],p=t(d,n);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const h=n[l];t.data.attributes[l]=h.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const h=this.morphAttributes[l],c=[];for(let u=0,d=h.length;u<d;u++){const p=h[u];c.push(p.toJSON(t.data))}c.length>0&&(s[l]=c,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const c=s[h];this.setAttribute(h,c.clone(e))}const r=t.morphAttributes;for(const h in r){const c=[],u=r[h];for(let d=0,p=u.length;d<p;d++)c.push(u[d].clone(e));this.morphAttributes[h]=c}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,c=a.length;h<c;h++){const u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zl=new ce,Ei=new sr,vr=new zi,Gl=new C,yr=new C,Mr=new C,Sr=new C,Fa=new C,xr=new C,Hl=new C,br=new C;class At extends Ue{constructor(t=new Te,e=new Wt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){xr.set(0,0,0);for(let l=0,h=r.length;l<h;l++){const c=o[l],u=r[l];c!==0&&(Fa.fromBufferAttribute(u,t),a?xr.addScaledVector(Fa,c):xr.addScaledVector(Fa.sub(e),c))}e.add(xr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vr.copy(n.boundingSphere),vr.applyMatrix4(r),Ei.copy(t.ray).recast(t.near),!(vr.containsPoint(Ei.origin)===!1&&(Ei.intersectSphere(vr,Gl)===null||Ei.origin.distanceToSquared(Gl)>(t.far-t.near)**2))&&(zl.copy(r).invert(),Ei.copy(t.ray).applyMatrix4(zl),!(n.boundingBox!==null&&Ei.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ei)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,h=r.attributes.uv,c=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,v=d.length;_<v;_++){const g=d[_],m=a[g.materialIndex],w=Math.max(g.start,p.start),T=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let f=w,D=T;f<D;f+=3){const R=o.getX(f),P=o.getX(f+1),I=o.getX(f+2);s=Er(this,m,t,n,h,c,u,R,P,I),s&&(s.faceIndex=Math.floor(f/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let g=_,m=v;g<m;g+=3){const w=o.getX(g),T=o.getX(g+1),f=o.getX(g+2);s=Er(this,a,t,n,h,c,u,w,T,f),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,v=d.length;_<v;_++){const g=d[_],m=a[g.materialIndex],w=Math.max(g.start,p.start),T=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let f=w,D=T;f<D;f+=3){const R=f,P=f+1,I=f+2;s=Er(this,m,t,n,h,c,u,R,P,I),s&&(s.faceIndex=Math.floor(f/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let g=_,m=v;g<m;g+=3){const w=g,T=g+1,f=g+2;s=Er(this,a,t,n,h,c,u,w,T,f),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function md(i,t,e,n,s,r,a,o){let l;if(t.side===sn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===vi,o),l===null)return null;br.copy(o),br.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(br);return h<e.near||h>e.far?null:{distance:h,point:br.clone(),object:i}}function Er(i,t,e,n,s,r,a,o,l,h){i.getVertexPosition(o,yr),i.getVertexPosition(l,Mr),i.getVertexPosition(h,Sr);const c=md(i,t,e,n,yr,Mr,Sr,Hl);if(c){const u=new C;vn.getBarycoord(Hl,yr,Mr,Sr,u),s&&(c.uv=vn.getInterpolatedAttribute(s,o,l,h,u,new ut)),r&&(c.uv1=vn.getInterpolatedAttribute(r,o,l,h,u,new ut)),a&&(c.normal=vn.getInterpolatedAttribute(a,o,l,h,u,new C),c.normal.dot(n.direction)>0&&c.normal.multiplyScalar(-1));const d={a:o,b:l,c:h,normal:new C,materialIndex:0};vn.getNormal(yr,Mr,Sr,d.normal),c.face=d,c.barycoord=u}return c}class yn extends Te{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],h=[],c=[],u=[];let d=0,p=0;_("z","y","x",-1,-1,n,e,t,a,r,0),_("z","y","x",1,-1,n,e,-t,a,r,1),_("x","z","y",1,1,t,n,e,s,a,2),_("x","z","y",1,-1,t,n,-e,s,a,3),_("x","y","z",1,-1,t,e,n,s,r,4),_("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ge(h,3)),this.setAttribute("normal",new ge(c,3)),this.setAttribute("uv",new ge(u,2));function _(v,g,m,w,T,f,D,R,P,I,x){const S=f/P,U=D/I,q=f/2,V=D/2,tt=R/2,rt=P+1,Z=I+1;let lt=0,$=0;const xt=new C;for(let bt=0;bt<Z;bt++){const Bt=bt*U-V;for(let Qt=0;Qt<rt;Qt++){const de=Qt*S-q;xt[v]=de*w,xt[g]=Bt*T,xt[m]=tt,h.push(xt.x,xt.y,xt.z),xt[v]=0,xt[g]=0,xt[m]=R>0?1:-1,c.push(xt.x,xt.y,xt.z),u.push(Qt/P),u.push(1-bt/I),lt+=1}}for(let bt=0;bt<I;bt++)for(let Bt=0;Bt<P;Bt++){const Qt=d+Bt+rt*bt,de=d+Bt+rt*(bt+1),nt=d+(Bt+1)+rt*(bt+1),mt=d+(Bt+1)+rt*bt;l.push(Qt,de,mt),l.push(de,nt,mt),$+=6}o.addGroup(p,$,x),p+=$,d+=lt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ws(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function tn(i){const t={};for(let e=0;e<i.length;e++){const n=ws(i[e]);for(const s in n)t[s]=n[s]}return t}function gd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function bh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:he.workingColorSpace}const ir={clone:ws,merge:tn};var _d=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Re extends yi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_d,this.fragmentShader=vd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ws(t.uniforms),this.uniformsGroups=gd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Eh extends Ue{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=Yn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const li=new C,Vl=new ut,Wl=new ut;class un extends Eh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=nr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(js*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return nr*2*Math.atan(Math.tan(js*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){li.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(li.x,li.y).multiplyScalar(-t/li.z),li.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(li.x,li.y).multiplyScalar(-t/li.z)}getViewSize(t,e){return this.getViewBounds(t,Vl,Wl),e.subVectors(Wl,Vl)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(js*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/h,s*=a.width/l,n*=a.height/h}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ns=-90,is=1;class yd extends Ue{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new un(ns,is,t,e);s.layers=this.layers,this.add(s);const r=new un(ns,is,t,e);r.layers=this.layers,this.add(r);const a=new un(ns,is,t,e);a.layers=this.layers,this.add(a);const o=new un(ns,is,t,e);o.layers=this.layers,this.add(o);const l=new un(ns,is,t,e);l.layers=this.layers,this.add(l);const h=new un(ns,is,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const h of e)this.remove(h);if(t===Yn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Qr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,h,c]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,c),t.setRenderTarget(u,d,p),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class Th extends je{constructor(t,e,n,s,r,a,o,l,h,c){t=t!==void 0?t:[],e=e!==void 0?e:Ss,super(t,e,n,s,r,a,o,l,h,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Md extends Mn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Th(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ln}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new yn(5,5,5),r=new Re({name:"CubemapFromEquirect",uniforms:ws(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:$n});r.uniforms.tEquirect.value=e;const a=new At(s,r),o=e.minFilter;return e.minFilter===Ui&&(e.minFilter=Ln),new yd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class cl{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Rt(t),this.density=e}clone(){return new cl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Sd extends Ue{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nn,this.environmentIntensity=1,this.environmentRotation=new Nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class xd{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Wo,this.updateRanges=[],this.version=0,this.uuid=jn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Je=new C;class ea{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.applyMatrix4(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.applyNormalMatrix(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.transformDirection(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Tn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=me(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Tn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Tn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Tn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Tn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array),s=me(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array),s=me(s,this.array),r=me(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new se(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ea(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class hl extends yi{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Rt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ss;const Os=new C,rs=new C,as=new C,os=new ut,Fs=new ut,wh=new ce,Tr=new C,Bs=new C,wr=new C,Xl=new ut,Ba=new ut,ql=new ut;class Ah extends Ue{constructor(t=new hl){if(super(),this.isSprite=!0,this.type="Sprite",ss===void 0){ss=new Te;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new xd(e,5);ss.setIndex([0,1,2,0,2,3]),ss.setAttribute("position",new ea(n,3,0,!1)),ss.setAttribute("uv",new ea(n,2,3,!1))}this.geometry=ss,this.material=t,this.center=new ut(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),rs.setFromMatrixScale(this.matrixWorld),wh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),as.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&rs.multiplyScalar(-as.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Ar(Tr.set(-.5,-.5,0),as,a,rs,s,r),Ar(Bs.set(.5,-.5,0),as,a,rs,s,r),Ar(wr.set(.5,.5,0),as,a,rs,s,r),Xl.set(0,0),Ba.set(1,0),ql.set(1,1);let o=t.ray.intersectTriangle(Tr,Bs,wr,!1,Os);if(o===null&&(Ar(Bs.set(-.5,.5,0),as,a,rs,s,r),Ba.set(0,1),o=t.ray.intersectTriangle(Tr,wr,Bs,!1,Os),o===null))return;const l=t.ray.origin.distanceTo(Os);l<t.near||l>t.far||e.push({distance:l,point:Os.clone(),uv:vn.getInterpolation(Os,Tr,Bs,wr,Xl,Ba,ql,new ut),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ar(i,t,e,n,s,r){os.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Fs.x=r*os.x-s*os.y,Fs.y=s*os.x+r*os.y):Fs.copy(os),i.copy(t),i.x+=Fs.x,i.y+=Fs.y,i.applyMatrix4(wh)}class bd extends je{constructor(t=null,e=1,n=1,s,r,a,o,l,h=pn,c=pn,u,d){super(null,a,o,l,h,c,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yl extends se{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ls=new ce,$l=new ce,Cr=[],Kl=new ki,Ed=new ce,ks=new At,zs=new zi;class Gs extends At{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Yl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ed)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ki),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ls),Kl.copy(t.boundingBox).applyMatrix4(ls),this.boundingBox.union(Kl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new zi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ls),zs.copy(t.boundingSphere).applyMatrix4(ls),this.boundingSphere.union(zs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ks.geometry=this.geometry,ks.material=this.material,ks.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),zs.copy(this.boundingSphere),zs.applyMatrix4(n),t.ray.intersectsSphere(zs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ls),$l.multiplyMatrices(n,ls),ks.matrixWorld=$l,ks.raycast(t,Cr);for(let a=0,o=Cr.length;a<o;a++){const l=Cr[a];l.instanceId=r,l.object=this,e.push(l)}Cr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Yl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new bd(new Float32Array(s*this.count),s,this.count,il,In));const r=this.morphTexture.source.data.data;let a=0;for(let h=0;h<n.length;h++)a+=n[h];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const ka=new C,Td=new C,wd=new Kt;class ui{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ka.subVectors(n,e).cross(Td.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ka),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||wd.getNormalMatrix(t),s=this.coplanarPoint(ka).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ti=new zi,Rr=new C;class ul{constructor(t=new ui,e=new ui,n=new ui,s=new ui,r=new ui,a=new ui){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Yn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],h=s[4],c=s[5],u=s[6],d=s[7],p=s[8],_=s[9],v=s[10],g=s[11],m=s[12],w=s[13],T=s[14],f=s[15];if(n[0].setComponents(l-r,d-h,g-p,f-m).normalize(),n[1].setComponents(l+r,d+h,g+p,f+m).normalize(),n[2].setComponents(l+a,d+c,g+_,f+w).normalize(),n[3].setComponents(l-a,d-c,g-_,f-w).normalize(),n[4].setComponents(l-o,d-u,g-v,f-T).normalize(),e===Yn)n[5].setComponents(l+o,d+u,g+v,f+T).normalize();else if(e===Qr)n[5].setComponents(o,u,v,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ti.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ti.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ti)}intersectsSprite(t){return Ti.center.set(0,0,0),Ti.radius=.7071067811865476,Ti.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ti)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Rr.x=s.normal.x>0?t.max.x:t.min.x,Rr.y=s.normal.y>0?t.max.y:t.min.y,Rr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Rr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ch extends yi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const na=new C,ia=new C,jl=new ce,Hs=new sr,Pr=new zi,za=new C,Zl=new C;class Rh extends Ue{constructor(t=new Te,e=new Ch){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)na.fromBufferAttribute(e,s-1),ia.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=na.distanceTo(ia);t.setAttribute("lineDistance",new ge(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(s),Pr.radius+=r,t.ray.intersectsSphere(Pr)===!1)return;jl.copy(s).invert(),Hs.copy(t.ray).applyMatrix4(jl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,h=this.isLineSegments?2:1,c=n.index,d=n.attributes.position;if(c!==null){const p=Math.max(0,a.start),_=Math.min(c.count,a.start+a.count);for(let v=p,g=_-1;v<g;v+=h){const m=c.getX(v),w=c.getX(v+1),T=Dr(this,t,Hs,l,m,w);T&&e.push(T)}if(this.isLineLoop){const v=c.getX(_-1),g=c.getX(p),m=Dr(this,t,Hs,l,v,g);m&&e.push(m)}}else{const p=Math.max(0,a.start),_=Math.min(d.count,a.start+a.count);for(let v=p,g=_-1;v<g;v+=h){const m=Dr(this,t,Hs,l,v,v+1);m&&e.push(m)}if(this.isLineLoop){const v=Dr(this,t,Hs,l,_-1,p);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Dr(i,t,e,n,s,r){const a=i.geometry.attributes.position;if(na.fromBufferAttribute(a,s),ia.fromBufferAttribute(a,r),e.distanceSqToSegment(na,ia,za,Zl)>n)return;za.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(za);if(!(l<t.near||l>t.far))return{distance:l,point:Zl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Jl=new C,Ql=new C;class Ad extends Rh{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Jl.fromBufferAttribute(e,s),Ql.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Jl.distanceTo(Ql);t.setAttribute("lineDistance",new ge(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ph extends yi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Rt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const tc=new ce,Xo=new sr,Lr=new zi,Ir=new C;class Ni extends Ue{constructor(t=new Te,e=new Ph){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Lr.copy(n.boundingSphere),Lr.applyMatrix4(s),Lr.radius+=r,t.ray.intersectsSphere(Lr)===!1)return;tc.copy(s).invert(),Xo.copy(t.ray).applyMatrix4(tc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,h=n.index,u=n.attributes.position;if(h!==null){const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=d,v=p;_<v;_++){const g=h.getX(_);Ir.fromBufferAttribute(u,g),ec(Ir,g,l,s,t,e,this)}}else{const d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=d,v=p;_<v;_++)Ir.fromBufferAttribute(u,_),ec(Ir,_,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ec(i,t,e,n,s,r,a){const o=Xo.distanceSqToPoint(i);if(o<e){const l=new C;Xo.closestPointToPoint(i,l),l.applyMatrix4(n);const h=s.ray.origin.distanceTo(l);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class ie extends Ue{constructor(){super(),this.isGroup=!0,this.type="Group"}}class Dh extends je{constructor(t,e,n,s,r,a,o,l,h){super(t,e,n,s,r,a,o,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Lh extends je{constructor(t,e,n,s,r,a,o,l,h,c=_s){if(c!==_s&&c!==Es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&c===_s&&(n=Fi),n===void 0&&c===Es&&(n=bs),super(null,s,r,a,o,l,c,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:pn,this.minFilter=l!==void 0?l:pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class On{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,h;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const c=n[s],d=n[s+1]-c,p=(a-c)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ut:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],a=[],o=new C,l=new ce;for(let p=0;p<=t;p++){const _=p/t;s[p]=this.getTangentAt(_,new C)}r[0]=new C,a[0]=new C;let h=Number.MAX_VALUE;const c=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);c<=h&&(h=c,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),d<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos($t(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,_))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos($t(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let _=1;_<=t;_++)r[_].applyMatrix4(l.makeRotationAxis(s[_],p*_)),a[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class dl extends On{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ut){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const c=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=h-this.aY;l=d*c-p*u+this.aX,h=d*u+p*c+this.aY}return n.set(l,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Cd extends dl{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function fl(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,h){s(a,o,h*(o-r),h*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,h,c,u){let d=(a-r)/h-(o-r)/(h+c)+(o-a)/c,p=(o-a)/c-(l-a)/(c+u)+(l-o)/u;d*=c,p*=c,s(a,o,d,p)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Ur=new C,Ga=new fl,Ha=new fl,Va=new fl;class Rd extends On{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let h,c;this.closed||o>0?h=s[(o-1)%r]:(Ur.subVectors(s[0],s[1]).add(s[0]),h=Ur);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?c=s[(o+2)%r]:(Ur.subVectors(s[r-1],s[r-2]).add(s[r-1]),c=Ur),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let _=Math.pow(h.distanceToSquared(u),p),v=Math.pow(u.distanceToSquared(d),p),g=Math.pow(d.distanceToSquared(c),p);v<1e-4&&(v=1),_<1e-4&&(_=v),g<1e-4&&(g=v),Ga.initNonuniformCatmullRom(h.x,u.x,d.x,c.x,_,v,g),Ha.initNonuniformCatmullRom(h.y,u.y,d.y,c.y,_,v,g),Va.initNonuniformCatmullRom(h.z,u.z,d.z,c.z,_,v,g)}else this.curveType==="catmullrom"&&(Ga.initCatmullRom(h.x,u.x,d.x,c.x,this.tension),Ha.initCatmullRom(h.y,u.y,d.y,c.y,this.tension),Va.initCatmullRom(h.z,u.z,d.z,c.z,this.tension));return n.set(Ga.calc(l),Ha.calc(l),Va.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function nc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function Pd(i,t){const e=1-i;return e*e*t}function Dd(i,t){return 2*(1-i)*i*t}function Ld(i,t){return i*i*t}function Js(i,t,e,n){return Pd(i,t)+Dd(i,e)+Ld(i,n)}function Id(i,t){const e=1-i;return e*e*e*t}function Ud(i,t){const e=1-i;return 3*e*e*i*t}function Nd(i,t){return 3*(1-i)*i*i*t}function Od(i,t){return i*i*i*t}function Qs(i,t,e,n,s){return Id(i,t)+Ud(i,e)+Nd(i,n)+Od(i,s)}class Ih extends On{constructor(t=new ut,e=new ut,n=new ut,s=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Qs(t,s.x,r.x,a.x,o.x),Qs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Fd extends On{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Qs(t,s.x,r.x,a.x,o.x),Qs(t,s.y,r.y,a.y,o.y),Qs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Uh extends On{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bd extends On{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nh extends On{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Js(t,s.x,r.x,a.x),Js(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class kd extends On{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Js(t,s.x,r.x,a.x),Js(t,s.y,r.y,a.y),Js(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Oh extends On{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],h=s[a],c=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(nc(o,l.x,h.x,c.x,u.x),nc(o,l.y,h.y,c.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ut().fromArray(s))}return this}}var ic=Object.freeze({__proto__:null,ArcCurve:Cd,CatmullRomCurve3:Rd,CubicBezierCurve:Ih,CubicBezierCurve3:Fd,EllipseCurve:dl,LineCurve:Uh,LineCurve3:Bd,QuadraticBezierCurve:Nh,QuadraticBezierCurve3:kd,SplineCurve:Oh});class zd extends On{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ic[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),h=l===0?0:1-a/l;return o.getPointAt(h,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let h=0;h<l.length;h++){const c=l[h];n&&n.equals(c)||(e.push(c),n=c)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new ic[s.type]().fromJSON(s))}return this}}class Gd extends zd{constructor(t){super(),this.type="Path",this.currentPoint=new ut,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Uh(this.currentPoint.clone(),new ut(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Nh(this.currentPoint.clone(),new ut(t,e),new ut(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Ih(this.currentPoint.clone(),new ut(t,e),new ut(n,s),new ut(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Oh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const h=this.currentPoint.x,c=this.currentPoint.y;return this.absellipse(t+h,e+c,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const h=new dl(t,e,n,s,r,a,o,l);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const c=h.getPoint(1);return this.currentPoint.copy(c),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class pl extends Te{constructor(t=[new ut(0,-.5),new ut(.5,0),new ut(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=$t(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],h=[],c=1/e,u=new C,d=new ut,p=new C,_=new C,v=new C;let g=0,m=0;for(let w=0;w<=t.length-1;w++)switch(w){case 0:g=t[w+1].x-t[w].x,m=t[w+1].y-t[w].y,p.x=m*1,p.y=-g,p.z=m*0,v.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[w+1].x-t[w].x,m=t[w+1].y-t[w].y,p.x=m*1,p.y=-g,p.z=m*0,_.copy(p),p.x+=v.x,p.y+=v.y,p.z+=v.z,p.normalize(),l.push(p.x,p.y,p.z),v.copy(_)}for(let w=0;w<=e;w++){const T=n+w*c*s,f=Math.sin(T),D=Math.cos(T);for(let R=0;R<=t.length-1;R++){u.x=t[R].x*f,u.y=t[R].y,u.z=t[R].x*D,a.push(u.x,u.y,u.z),d.x=w/e,d.y=R/(t.length-1),o.push(d.x,d.y);const P=l[3*R+0]*f,I=l[3*R+1],x=l[3*R+0]*D;h.push(P,I,x)}}for(let w=0;w<e;w++)for(let T=0;T<t.length-1;T++){const f=T+w*t.length,D=f,R=f+t.length,P=f+t.length+1,I=f+1;r.push(D,R,I),r.push(P,I,R)}this.setIndex(r),this.setAttribute("position",new ge(a,3)),this.setAttribute("uv",new ge(o,2)),this.setAttribute("normal",new ge(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pl(t.points,t.segments,t.phiStart,t.phiLength)}}class ys extends pl{constructor(t=1,e=1,n=4,s=8){const r=new Gd;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new ys(t.radius,t.length,t.capSegments,t.radialSegments)}}class sa extends Te{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],h=new C,c=new ut;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const p=n+u/e*s;h.x=t*Math.cos(p),h.y=t*Math.sin(p),a.push(h.x,h.y,h.z),o.push(0,0,1),c.x=(a[d]/t+1)/2,c.y=(a[d+1]/t+1)/2,l.push(c.x,c.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ge(a,3)),this.setAttribute("normal",new ge(o,3)),this.setAttribute("uv",new ge(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sa(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class An extends Te{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const h=this;s=Math.floor(s),r=Math.floor(r);const c=[],u=[],d=[],p=[];let _=0;const v=[],g=n/2;let m=0;w(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(c),this.setAttribute("position",new ge(u,3)),this.setAttribute("normal",new ge(d,3)),this.setAttribute("uv",new ge(p,2));function w(){const f=new C,D=new C;let R=0;const P=(e-t)/n;for(let I=0;I<=r;I++){const x=[],S=I/r,U=S*(e-t)+t;for(let q=0;q<=s;q++){const V=q/s,tt=V*l+o,rt=Math.sin(tt),Z=Math.cos(tt);D.x=U*rt,D.y=-S*n+g,D.z=U*Z,u.push(D.x,D.y,D.z),f.set(rt,P,Z).normalize(),d.push(f.x,f.y,f.z),p.push(V,1-S),x.push(_++)}v.push(x)}for(let I=0;I<s;I++)for(let x=0;x<r;x++){const S=v[x][I],U=v[x+1][I],q=v[x+1][I+1],V=v[x][I+1];(t>0||x!==0)&&(c.push(S,U,V),R+=3),(e>0||x!==r-1)&&(c.push(U,q,V),R+=3)}h.addGroup(m,R,0),m+=R}function T(f){const D=_,R=new ut,P=new C;let I=0;const x=f===!0?t:e,S=f===!0?1:-1;for(let q=1;q<=s;q++)u.push(0,g*S,0),d.push(0,S,0),p.push(.5,.5),_++;const U=_;for(let q=0;q<=s;q++){const tt=q/s*l+o,rt=Math.cos(tt),Z=Math.sin(tt);P.x=x*Z,P.y=g*S,P.z=x*rt,u.push(P.x,P.y,P.z),d.push(0,S,0),R.x=rt*.5+.5,R.y=Z*.5*S+.5,p.push(R.x,R.y),_++}for(let q=0;q<s;q++){const V=D+q,tt=U+q;f===!0?c.push(tt,tt+1,V):c.push(tt+1,tt,V),I+=3}h.addGroup(m,I,f===!0?1:2),m+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ml extends An{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ml(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Gi extends Te{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),h=o+1,c=l+1,u=t/o,d=e/l,p=[],_=[],v=[],g=[];for(let m=0;m<c;m++){const w=m*d-a;for(let T=0;T<h;T++){const f=T*u-r;_.push(f,-w,0),v.push(0,0,1),g.push(T/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let w=0;w<o;w++){const T=w+h*m,f=w+h*(m+1),D=w+1+h*(m+1),R=w+1+h*m;p.push(T,f,R),p.push(f,D,R)}this.setIndex(p),this.setAttribute("position",new ge(_,3)),this.setAttribute("normal",new ge(v,3)),this.setAttribute("uv",new ge(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gi(t.width,t.height,t.widthSegments,t.heightSegments)}}class ra extends Te{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],h=[],c=[];let u=t;const d=(e-t)/s,p=new C,_=new ut;for(let v=0;v<=s;v++){for(let g=0;g<=n;g++){const m=r+g/n*a;p.x=u*Math.cos(m),p.y=u*Math.sin(m),l.push(p.x,p.y,p.z),h.push(0,0,1),_.x=(p.x/e+1)/2,_.y=(p.y/e+1)/2,c.push(_.x,_.y)}u+=d}for(let v=0;v<s;v++){const g=v*(n+1);for(let m=0;m<n;m++){const w=m+g,T=w,f=w+n+1,D=w+n+2,R=w+1;o.push(T,f,R),o.push(f,D,R)}}this.setIndex(o),this.setAttribute("position",new ge(l,3)),this.setAttribute("normal",new ge(h,3)),this.setAttribute("uv",new ge(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ra(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class pi extends Te{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let h=0;const c=[],u=new C,d=new C,p=[],_=[],v=[],g=[];for(let m=0;m<=n;m++){const w=[],T=m/n;let f=0;m===0&&a===0?f=.5/e:m===n&&l===Math.PI&&(f=-.5/e);for(let D=0;D<=e;D++){const R=D/e;u.x=-t*Math.cos(s+R*r)*Math.sin(a+T*o),u.y=t*Math.cos(a+T*o),u.z=t*Math.sin(s+R*r)*Math.sin(a+T*o),_.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(R+f,1-T),w.push(h++)}c.push(w)}for(let m=0;m<n;m++)for(let w=0;w<e;w++){const T=c[m][w+1],f=c[m][w],D=c[m+1][w],R=c[m+1][w+1];(m!==0||a>0)&&p.push(T,f,R),(m!==n-1||l<Math.PI)&&p.push(f,D,R)}this.setIndex(p),this.setAttribute("position",new ge(_,3)),this.setAttribute("normal",new ge(v,3)),this.setAttribute("uv",new ge(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pi(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class gl extends Te{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],h=[],c=new C,u=new C,d=new C;for(let p=0;p<=n;p++)for(let _=0;_<=s;_++){const v=_/s*r,g=p/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),o.push(u.x,u.y,u.z),c.x=t*Math.cos(v),c.y=t*Math.sin(v),d.subVectors(u,c).normalize(),l.push(d.x,d.y,d.z),h.push(_/s),h.push(p/n)}for(let p=1;p<=n;p++)for(let _=1;_<=s;_++){const v=(s+1)*p+_-1,g=(s+1)*(p-1)+_-1,m=(s+1)*(p-1)+_,w=(s+1)*p+_;a.push(v,g,w),a.push(g,m,w)}this.setIndex(a),this.setAttribute("position",new ge(o,3)),this.setAttribute("normal",new ge(l,3)),this.setAttribute("uv",new ge(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gl(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Hd extends Re{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ee extends yi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mh,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Yr extends ee{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ut(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $t(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Rt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Rt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Rt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Vd extends yi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Eu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Wd extends yi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class ha extends Ue{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Rt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Xd extends ha{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Rt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Wa=new ce,sc=new C,rc=new C;class Fh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ul,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;sc.setFromMatrixPosition(t.matrixWorld),e.position.copy(sc),rc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(rc),e.updateMatrixWorld(),Wa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Wa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const ac=new ce,Vs=new C,Xa=new C;class qd extends Fh{constructor(){super(new un(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ut(4,2),this._viewportCount=6,this._viewports=[new Me(2,1,1,1),new Me(0,1,1,1),new Me(3,1,1,1),new Me(1,1,1,1),new Me(3,0,1,1),new Me(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Vs.setFromMatrixPosition(t.matrixWorld),n.position.copy(Vs),Xa.copy(n.position),Xa.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Xa),n.updateMatrixWorld(),s.makeTranslation(-Vs.x,-Vs.y,-Vs.z),ac.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ac)}}class ci extends ha{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new qd}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class _l extends Eh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=c*this.view.offsetY,l=o-c*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Yd extends Fh{constructor(){super(new _l(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $d extends ha{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.target=new Ue,this.shadow=new Yd}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Kd extends ha{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class jd extends un{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Zd{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=oc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=oc();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function oc(){return performance.now()}const lc=new ce;class Jd{constructor(t,e,n=0,s=1/0){this.ray=new sr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ll,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return lc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(lc),this}intersectObject(t,e=!0,n=[]){return qo(t,this,n,e),n.sort(cc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)qo(t[s],this,n,e);return n.sort(cc),n}}function cc(i,t){return i.distance-t.distance}function qo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)qo(r[a],t,e,!0)}}class hc{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=$t(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos($t(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Qd extends Bi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function uc(i,t,e,n){const s=tf(n);switch(e){case ch:return i*t;case uh:return i*t;case dh:return i*t*2;case il:return i*t/s.components*s.byteLength;case sl:return i*t/s.components*s.byteLength;case fh:return i*t*2/s.components*s.byteLength;case rl:return i*t*2/s.components*s.byteLength;case hh:return i*t*3/s.components*s.byteLength;case wn:return i*t*4/s.components*s.byteLength;case al:return i*t*4/s.components*s.byteLength;case Hr:case Vr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Wr:case Xr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case yo:case So:return Math.max(i,16)*Math.max(t,8)/4;case vo:case Mo:return Math.max(i,8)*Math.max(t,8)/2;case xo:case bo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Eo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case To:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ao:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Co:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ro:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Po:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Do:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Lo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Io:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Uo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case No:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Oo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Fo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Bo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case qr:case ko:case zo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ph:case Go:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ho:case Vo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function tf(i){switch(i){case Jn:case ah:return{byteLength:1,components:1};case er:case oh:case Un:return{byteLength:2,components:1};case el:case nl:return{byteLength:2,components:4};case Fi:case tl:case In:return{byteLength:4,components:1};case lh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jo);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Bh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function ef(i){const t=new WeakMap;function e(o,l){const h=o.array,c=o.usage,u=h.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,h,c),o.onUploadCallback();let p;if(h instanceof Float32Array)p=i.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=i.SHORT;else if(h instanceof Uint32Array)p=i.UNSIGNED_INT;else if(h instanceof Int32Array)p=i.INT;else if(h instanceof Int8Array)p=i.BYTE;else if(h instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,h){const c=l.array,u=l.updateRanges;if(i.bindBuffer(h,o),u.length===0)i.bufferSubData(h,0,c);else{u.sort((p,_)=>p.start-_.start);let d=0;for(let p=1;p<u.length;p++){const _=u[d],v=u[p];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++d,u[d]=v)}u.length=d+1;for(let p=0,_=u.length;p<_;p++){const v=u[p];i.bufferSubData(h,v.start*c.BYTES_PER_ELEMENT,c,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const c=t.get(o);(!c||c.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=t.get(o);if(h===void 0)t.set(o,e(o,l));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,o,l),h.version=o.version}}return{get:s,remove:r,update:a}}var nf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,rf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,af=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,of=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,lf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,hf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,uf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,df=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ff=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,pf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,gf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,_f=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,vf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,yf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,bf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ef=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Tf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,wf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Af=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Cf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Rf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Pf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Df=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,If="gl_FragColor = linearToOutputTexel( gl_FragColor );",Uf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Of=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ff=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Bf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,kf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Wf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Xf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,qf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$f=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Kf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,jf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,tp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ep=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,np=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ip=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,sp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ap=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,op=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,up=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_p=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,yp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Sp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,xp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ep=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Tp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,wp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ap=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Pp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Dp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Lp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ip=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Up=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Np=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Op=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Fp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,kp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Gp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Hp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Vp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Wp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,qp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$p=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,jp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Zp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,t0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,e0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const n0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,i0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,o0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,c0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,h0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,u0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,d0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,f0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,p0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,m0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,g0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,_0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,S0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,b0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,E0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,A0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,C0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,D0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,L0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,I0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,U0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,N0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Jt={alphahash_fragment:nf,alphahash_pars_fragment:sf,alphamap_fragment:rf,alphamap_pars_fragment:af,alphatest_fragment:of,alphatest_pars_fragment:lf,aomap_fragment:cf,aomap_pars_fragment:hf,batching_pars_vertex:uf,batching_vertex:df,begin_vertex:ff,beginnormal_vertex:pf,bsdfs:mf,iridescence_fragment:gf,bumpmap_pars_fragment:_f,clipping_planes_fragment:vf,clipping_planes_pars_fragment:yf,clipping_planes_pars_vertex:Mf,clipping_planes_vertex:Sf,color_fragment:xf,color_pars_fragment:bf,color_pars_vertex:Ef,color_vertex:Tf,common:wf,cube_uv_reflection_fragment:Af,defaultnormal_vertex:Cf,displacementmap_pars_vertex:Rf,displacementmap_vertex:Pf,emissivemap_fragment:Df,emissivemap_pars_fragment:Lf,colorspace_fragment:If,colorspace_pars_fragment:Uf,envmap_fragment:Nf,envmap_common_pars_fragment:Of,envmap_pars_fragment:Ff,envmap_pars_vertex:Bf,envmap_physical_pars_fragment:Kf,envmap_vertex:kf,fog_vertex:zf,fog_pars_vertex:Gf,fog_fragment:Hf,fog_pars_fragment:Vf,gradientmap_pars_fragment:Wf,lightmap_pars_fragment:Xf,lights_lambert_fragment:qf,lights_lambert_pars_fragment:Yf,lights_pars_begin:$f,lights_toon_fragment:jf,lights_toon_pars_fragment:Zf,lights_phong_fragment:Jf,lights_phong_pars_fragment:Qf,lights_physical_fragment:tp,lights_physical_pars_fragment:ep,lights_fragment_begin:np,lights_fragment_maps:ip,lights_fragment_end:sp,logdepthbuf_fragment:rp,logdepthbuf_pars_fragment:ap,logdepthbuf_pars_vertex:op,logdepthbuf_vertex:lp,map_fragment:cp,map_pars_fragment:hp,map_particle_fragment:up,map_particle_pars_fragment:dp,metalnessmap_fragment:fp,metalnessmap_pars_fragment:pp,morphinstance_vertex:mp,morphcolor_vertex:gp,morphnormal_vertex:_p,morphtarget_pars_vertex:vp,morphtarget_vertex:yp,normal_fragment_begin:Mp,normal_fragment_maps:Sp,normal_pars_fragment:xp,normal_pars_vertex:bp,normal_vertex:Ep,normalmap_pars_fragment:Tp,clearcoat_normal_fragment_begin:wp,clearcoat_normal_fragment_maps:Ap,clearcoat_pars_fragment:Cp,iridescence_pars_fragment:Rp,opaque_fragment:Pp,packing:Dp,premultiplied_alpha_fragment:Lp,project_vertex:Ip,dithering_fragment:Up,dithering_pars_fragment:Np,roughnessmap_fragment:Op,roughnessmap_pars_fragment:Fp,shadowmap_pars_fragment:Bp,shadowmap_pars_vertex:kp,shadowmap_vertex:zp,shadowmask_pars_fragment:Gp,skinbase_vertex:Hp,skinning_pars_vertex:Vp,skinning_vertex:Wp,skinnormal_vertex:Xp,specularmap_fragment:qp,specularmap_pars_fragment:Yp,tonemapping_fragment:$p,tonemapping_pars_fragment:Kp,transmission_fragment:jp,transmission_pars_fragment:Zp,uv_pars_fragment:Jp,uv_pars_vertex:Qp,uv_vertex:t0,worldpos_vertex:e0,background_vert:n0,background_frag:i0,backgroundCube_vert:s0,backgroundCube_frag:r0,cube_vert:a0,cube_frag:o0,depth_vert:l0,depth_frag:c0,distanceRGBA_vert:h0,distanceRGBA_frag:u0,equirect_vert:d0,equirect_frag:f0,linedashed_vert:p0,linedashed_frag:m0,meshbasic_vert:g0,meshbasic_frag:_0,meshlambert_vert:v0,meshlambert_frag:y0,meshmatcap_vert:M0,meshmatcap_frag:S0,meshnormal_vert:x0,meshnormal_frag:b0,meshphong_vert:E0,meshphong_frag:T0,meshphysical_vert:w0,meshphysical_frag:A0,meshtoon_vert:C0,meshtoon_frag:R0,points_vert:P0,points_frag:D0,shadow_vert:L0,shadow_frag:I0,sprite_vert:U0,sprite_frag:N0},St={common:{diffuse:{value:new Rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Rt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},Cn={basic:{uniforms:tn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:tn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Rt(0)}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:tn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Rt(0)},specular:{value:new Rt(1118481)},shininess:{value:30}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:tn([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:tn([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Rt(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:tn([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:tn([St.points,St.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:tn([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:tn([St.common,St.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:tn([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:tn([St.sprite,St.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distanceRGBA:{uniforms:tn([St.common,St.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distanceRGBA_vert,fragmentShader:Jt.distanceRGBA_frag},shadow:{uniforms:tn([St.lights,St.fog,{color:{value:new Rt(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};Cn.physical={uniforms:tn([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Rt(0)},specularColor:{value:new Rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};const Nr={r:0,b:0,g:0},wi=new Nn,O0=new ce;function F0(i,t,e,n,s,r,a){const o=new Rt(0);let l=r===!0?0:1,h,c,u=null,d=0,p=null;function _(T){let f=T.isScene===!0?T.background:null;return f&&f.isTexture&&(f=(T.backgroundBlurriness>0?e:t).get(f)),f}function v(T){let f=!1;const D=_(T);D===null?m(o,l):D&&D.isColor&&(m(D,1),f=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||f)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(T,f){const D=_(f);D&&(D.isCubeTexture||D.mapping===ca)?(c===void 0&&(c=new At(new yn(1,1,1),new Re({name:"BackgroundCubeMaterial",uniforms:ws(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(R,P,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(c)),wi.copy(f.backgroundRotation),wi.x*=-1,wi.y*=-1,wi.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(wi.y*=-1,wi.z*=-1),c.material.uniforms.envMap.value=D,c.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(O0.makeRotationFromEuler(wi)),c.material.toneMapped=he.getTransfer(D.colorSpace)!==pe,(u!==D||d!==D.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=D,d=D.version,p=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null)):D&&D.isTexture&&(h===void 0&&(h=new At(new Gi(2,2),new Re({name:"BackgroundMaterial",uniforms:ws(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:vi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=D,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=he.getTransfer(D.colorSpace)!==pe,D.matrixAutoUpdate===!0&&D.updateMatrix(),h.material.uniforms.uvTransform.value.copy(D.matrix),(u!==D||d!==D.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=D,d=D.version,p=i.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null))}function m(T,f){T.getRGB(Nr,bh(i)),n.buffers.color.setClear(Nr.r,Nr.g,Nr.b,f,a)}function w(){c!==void 0&&(c.geometry.dispose(),c.material.dispose()),h!==void 0&&(h.geometry.dispose(),h.material.dispose())}return{getClearColor:function(){return o},setClearColor:function(T,f=1){o.set(T),l=f,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,m(o,l)},render:v,addToRenderList:g,dispose:w}}function B0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(S,U,q,V,tt){let rt=!1;const Z=u(V,q,U);r!==Z&&(r=Z,h(r.object)),rt=p(S,V,q,tt),rt&&_(S,V,q,tt),tt!==null&&t.update(tt,i.ELEMENT_ARRAY_BUFFER),(rt||a)&&(a=!1,f(S,U,q,V),tt!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(tt).buffer))}function l(){return i.createVertexArray()}function h(S){return i.bindVertexArray(S)}function c(S){return i.deleteVertexArray(S)}function u(S,U,q){const V=q.wireframe===!0;let tt=n[S.id];tt===void 0&&(tt={},n[S.id]=tt);let rt=tt[U.id];rt===void 0&&(rt={},tt[U.id]=rt);let Z=rt[V];return Z===void 0&&(Z=d(l()),rt[V]=Z),Z}function d(S){const U=[],q=[],V=[];for(let tt=0;tt<e;tt++)U[tt]=0,q[tt]=0,V[tt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:q,attributeDivisors:V,object:S,attributes:{},index:null}}function p(S,U,q,V){const tt=r.attributes,rt=U.attributes;let Z=0;const lt=q.getAttributes();for(const $ in lt)if(lt[$].location>=0){const bt=tt[$];let Bt=rt[$];if(Bt===void 0&&($==="instanceMatrix"&&S.instanceMatrix&&(Bt=S.instanceMatrix),$==="instanceColor"&&S.instanceColor&&(Bt=S.instanceColor)),bt===void 0||bt.attribute!==Bt||Bt&&bt.data!==Bt.data)return!0;Z++}return r.attributesNum!==Z||r.index!==V}function _(S,U,q,V){const tt={},rt=U.attributes;let Z=0;const lt=q.getAttributes();for(const $ in lt)if(lt[$].location>=0){let bt=rt[$];bt===void 0&&($==="instanceMatrix"&&S.instanceMatrix&&(bt=S.instanceMatrix),$==="instanceColor"&&S.instanceColor&&(bt=S.instanceColor));const Bt={};Bt.attribute=bt,bt&&bt.data&&(Bt.data=bt.data),tt[$]=Bt,Z++}r.attributes=tt,r.attributesNum=Z,r.index=V}function v(){const S=r.newAttributes;for(let U=0,q=S.length;U<q;U++)S[U]=0}function g(S){m(S,0)}function m(S,U){const q=r.newAttributes,V=r.enabledAttributes,tt=r.attributeDivisors;q[S]=1,V[S]===0&&(i.enableVertexAttribArray(S),V[S]=1),tt[S]!==U&&(i.vertexAttribDivisor(S,U),tt[S]=U)}function w(){const S=r.newAttributes,U=r.enabledAttributes;for(let q=0,V=U.length;q<V;q++)U[q]!==S[q]&&(i.disableVertexAttribArray(q),U[q]=0)}function T(S,U,q,V,tt,rt,Z){Z===!0?i.vertexAttribIPointer(S,U,q,tt,rt):i.vertexAttribPointer(S,U,q,V,tt,rt)}function f(S,U,q,V){v();const tt=V.attributes,rt=q.getAttributes(),Z=U.defaultAttributeValues;for(const lt in rt){const $=rt[lt];if($.location>=0){let xt=tt[lt];if(xt===void 0&&(lt==="instanceMatrix"&&S.instanceMatrix&&(xt=S.instanceMatrix),lt==="instanceColor"&&S.instanceColor&&(xt=S.instanceColor)),xt!==void 0){const bt=xt.normalized,Bt=xt.itemSize,Qt=t.get(xt);if(Qt===void 0)continue;const de=Qt.buffer,nt=Qt.type,mt=Qt.bytesPerElement,Lt=nt===i.INT||nt===i.UNSIGNED_INT||xt.gpuType===tl;if(xt.isInterleavedBufferAttribute){const yt=xt.data,Y=yt.stride,gt=xt.offset;if(yt.isInstancedInterleavedBuffer){for(let Gt=0;Gt<$.locationSize;Gt++)m($.location+Gt,yt.meshPerAttribute);S.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=yt.meshPerAttribute*yt.count)}else for(let Gt=0;Gt<$.locationSize;Gt++)g($.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,de);for(let Gt=0;Gt<$.locationSize;Gt++)T($.location+Gt,Bt/$.locationSize,nt,bt,Y*mt,(gt+Bt/$.locationSize*Gt)*mt,Lt)}else{if(xt.isInstancedBufferAttribute){for(let yt=0;yt<$.locationSize;yt++)m($.location+yt,xt.meshPerAttribute);S.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=xt.meshPerAttribute*xt.count)}else for(let yt=0;yt<$.locationSize;yt++)g($.location+yt);i.bindBuffer(i.ARRAY_BUFFER,de);for(let yt=0;yt<$.locationSize;yt++)T($.location+yt,Bt/$.locationSize,nt,bt,Bt*mt,Bt/$.locationSize*yt*mt,Lt)}}else if(Z!==void 0){const bt=Z[lt];if(bt!==void 0)switch(bt.length){case 2:i.vertexAttrib2fv($.location,bt);break;case 3:i.vertexAttrib3fv($.location,bt);break;case 4:i.vertexAttrib4fv($.location,bt);break;default:i.vertexAttrib1fv($.location,bt)}}}}w()}function D(){I();for(const S in n){const U=n[S];for(const q in U){const V=U[q];for(const tt in V)c(V[tt].object),delete V[tt];delete U[q]}delete n[S]}}function R(S){if(n[S.id]===void 0)return;const U=n[S.id];for(const q in U){const V=U[q];for(const tt in V)c(V[tt].object),delete V[tt];delete U[q]}delete n[S.id]}function P(S){for(const U in n){const q=n[U];if(q[S.id]===void 0)continue;const V=q[S.id];for(const tt in V)c(V[tt].object),delete V[tt];delete q[S.id]}}function I(){x(),a=!0,r!==s&&(r=s,h(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:x,dispose:D,releaseStatesOfGeometry:R,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:g,disableUnusedAttributes:w}}function k0(i,t,e){let n;function s(h){n=h}function r(h,c){i.drawArrays(n,h,c),e.update(c,n,1)}function a(h,c,u){u!==0&&(i.drawArraysInstanced(n,h,c,u),e.update(c,n,u))}function o(h,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,c,0,u);let p=0;for(let _=0;_<u;_++)p+=c[_];e.update(p,n,1)}function l(h,c,u,d){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<h.length;_++)a(h[_],c[_],d[_]);else{p.multiDrawArraysInstancedWEBGL(n,h,0,c,0,d,0,u);let _=0;for(let v=0;v<u;v++)_+=c[v]*d[v];e.update(_,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function z0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==wn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const I=P===Un&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==Jn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==In&&!I)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const c=l(h);c!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",c,"instead."),h=c);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),f=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=_>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:w,maxVaryings:T,maxFragmentUniforms:f,vertexTextures:D,maxSamples:R}}function G0(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new ui,o=new Kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,c(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=c(u,d,0)},this.setState=function(u,d,p){const _=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,m=i.get(u);if(!s||_===null||_.length===0||r&&!g)r?c(null):h();else{const w=r?0:n,T=w*4;let f=m.clippingState||null;l.value=f,f=c(_,d,T,p);for(let D=0;D!==T;++D)f[D]=e[D];m.clippingState=f,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=w}};function h(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function c(u,d,p,_){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=l.value,_!==!0||g===null){const m=p+v*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(g===null||g.length<m)&&(g=new Float32Array(m));for(let T=0,f=p;T!==v;++T,f+=4)a.copy(u[T]).applyMatrix4(w,o),a.normal.toArray(g,f),g[f+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function H0(i){let t=new WeakMap;function e(a,o){return o===jr?a.mapping=Ss:o===go&&(a.mapping=xs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===jr||o===go)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const h=new Md(l.height);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const ms=4,dc=[.125,.215,.35,.446,.526,.582],Li=20,qa=new _l,fc=new Rt;let Ya=null,$a=0,Ka=0,ja=!1;const Pi=(1+Math.sqrt(5))/2,cs=1/Pi,pc=[new C(-Pi,cs,0),new C(Pi,cs,0),new C(-cs,0,Pi),new C(cs,0,Pi),new C(0,Pi,-cs),new C(0,Pi,cs),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class Yo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ya=this._renderer.getRenderTarget(),$a=this._renderer.getActiveCubeFace(),Ka=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_c(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ya,$a,Ka),this._renderer.xr.enabled=ja,t.scissorTest=!1,Or(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ss||t.mapping===xs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ya=this._renderer.getRenderTarget(),$a=this._renderer.getActiveCubeFace(),Ka=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ln,minFilter:Ln,generateMipmaps:!1,type:Un,format:wn,colorSpace:Ts,depthBuffer:!1},s=mc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=mc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=V0(r)),this._blurMaterial=W0(r,t,e)}return s}_compileMaterial(t){const e=new At(this._lodPlanes[0],t);this._renderer.compile(e,qa)}_sceneToCubeUV(t,e,n,s){const o=new un(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],c=this._renderer,u=c.autoClear,d=c.toneMapping;c.getClearColor(fc),c.toneMapping=fi,c.autoClear=!1;const p=new Wt({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),_=new At(new yn,p);let v=!1;const g=t.background;g?g.isColor&&(p.color.copy(g),t.background=null,v=!0):(p.color.copy(fc),v=!0);for(let m=0;m<6;m++){const w=m%3;w===0?(o.up.set(0,l[m],0),o.lookAt(h[m],0,0)):w===1?(o.up.set(0,0,l[m]),o.lookAt(0,h[m],0)):(o.up.set(0,l[m],0),o.lookAt(0,0,h[m]));const T=this._cubeSize;Or(s,w*T,m>2?T:0,T,T),c.setRenderTarget(s),v&&c.render(_,o),c.render(t,o)}_.geometry.dispose(),_.material.dispose(),c.toneMapping=d,c.autoClear=u,t.background=g}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ss||t.mapping===xs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_c()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new At(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Or(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,qa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=pc[(s-r-1)%pc.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const c=3,u=new At(this._lodPlanes[s],h),d=h.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Li-1),v=r/_,g=isFinite(r)?1+Math.floor(c*v):Li;g>Li&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Li}`);const m=[];let w=0;for(let P=0;P<Li;++P){const I=P/v,x=Math.exp(-I*I/2);m.push(x),P===0?w+=x:P<g&&(w+=2*x)}for(let P=0;P<m.length;P++)m[P]=m[P]/w;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:T}=this;d.dTheta.value=_,d.mipInt.value=T-n;const f=this._sizeLods[s],D=3*f*(s>T-ms?s-T+ms:0),R=4*(this._cubeSize-f);Or(e,D,R,3*f,2*f),l.setRenderTarget(e),l.render(u,qa)}}function V0(i){const t=[],e=[],n=[];let s=i;const r=i-ms+1+dc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-ms?l=dc[a-i+ms-1]:a===0&&(l=0),n.push(l);const h=1/(o-2),c=-h,u=1+h,d=[c,c,u,c,u,u,c,c,u,u,c,u],p=6,_=6,v=3,g=2,m=1,w=new Float32Array(v*_*p),T=new Float32Array(g*_*p),f=new Float32Array(m*_*p);for(let R=0;R<p;R++){const P=R%3*2/3-1,I=R>2?0:-1,x=[P,I,0,P+2/3,I,0,P+2/3,I+1,0,P,I,0,P+2/3,I+1,0,P,I+1,0];w.set(x,v*_*R),T.set(d,g*_*R);const S=[R,R,R,R,R,R];f.set(S,m*_*R)}const D=new Te;D.setAttribute("position",new se(w,v)),D.setAttribute("uv",new se(T,g)),D.setAttribute("faceIndex",new se(f,m)),t.push(D),s>ms&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function mc(i,t,e){const n=new Mn(i,t,e);return n.texture.mapping=ca,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Or(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function W0(i,t,e){const n=new Float32Array(Li),s=new C(0,1,0);return new Re({name:"SphericalGaussianBlur",defines:{n:Li,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function gc(){return new Re({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function _c(){return new Re({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function vl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function X0(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,h=l===jr||l===go,c=l===Ss||l===xs;if(h||c){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Yo(i)),u=h?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return h&&p&&p.height>0||c&&p&&s(p)?(e===null&&(e=new Yo(i)),u=h?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const h=6;for(let c=0;c<h;c++)o[c]!==void 0&&l++;return l===h}function r(o){const l=o.target;l.removeEventListener("dispose",r);const h=t.get(l);h!==void 0&&(t.delete(l),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function q0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&fs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Y0(i,t,e,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const _ in d.attributes)t.remove(d.attributes[_]);d.removeEventListener("dispose",a),delete s[d.id];const p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const p in d)t.update(d[p],i.ARRAY_BUFFER)}function h(u){const d=[],p=u.index,_=u.attributes.position;let v=0;if(p!==null){const w=p.array;v=p.version;for(let T=0,f=w.length;T<f;T+=3){const D=w[T+0],R=w[T+1],P=w[T+2];d.push(D,R,R,P,P,D)}}else if(_!==void 0){const w=_.array;v=_.version;for(let T=0,f=w.length/3-1;T<f;T+=3){const D=T+0,R=T+1,P=T+2;d.push(D,R,R,P,P,D)}}else return;const g=new(_h(d)?xh:Sh)(d,1);g.version=v;const m=r.get(u);m&&t.remove(m),r.set(u,g)}function c(u){const d=r.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:c}}function $0(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*a),e.update(p,n,1)}function h(d,p,_){_!==0&&(i.drawElementsInstanced(n,p,r,d*a,_),e.update(p,n,_))}function c(d,p,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,_);let g=0;for(let m=0;m<_;m++)g+=p[m];e.update(g,n,1)}function u(d,p,_,v){if(_===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)h(d[m]/a,p[m],v[m]);else{g.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,v,0,_);let m=0;for(let w=0;w<_;w++)m+=p[w]*v[w];e.update(m,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=h,this.renderMultiDraw=c,this.renderMultiDrawInstances=u}function K0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function j0(i,t,e){const n=new WeakMap,s=new Me;function r(a,o,l){const h=a.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=c!==void 0?c.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let S=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var p=S;d!==void 0&&d.texture.dispose();const _=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let f=0;_===!0&&(f=1),v===!0&&(f=2),g===!0&&(f=3);let D=o.attributes.position.count*f,R=1;D>t.maxTextureSize&&(R=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const P=new Float32Array(D*R*4*u),I=new yh(P,D,R,u);I.type=In,I.needsUpdate=!0;const x=f*4;for(let U=0;U<u;U++){const q=m[U],V=w[U],tt=T[U],rt=D*R*4*U;for(let Z=0;Z<q.count;Z++){const lt=Z*x;_===!0&&(s.fromBufferAttribute(q,Z),P[rt+lt+0]=s.x,P[rt+lt+1]=s.y,P[rt+lt+2]=s.z,P[rt+lt+3]=0),v===!0&&(s.fromBufferAttribute(V,Z),P[rt+lt+4]=s.x,P[rt+lt+5]=s.y,P[rt+lt+6]=s.z,P[rt+lt+7]=0),g===!0&&(s.fromBufferAttribute(tt,Z),P[rt+lt+8]=s.x,P[rt+lt+9]=s.y,P[rt+lt+10]=s.z,P[rt+lt+11]=tt.itemSize===4?s.w:1)}}d={count:u,texture:I,size:new ut(D,R)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let _=0;for(let g=0;g<h.length;g++)_+=h[g];const v=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",h)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Z0(i,t,e,n){let s=new WeakMap;function r(l){const h=n.render.frame,c=l.geometry,u=t.get(l,c);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==h&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,h))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return u}function a(){s=new WeakMap}function o(l){const h=l.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}const kh=new je,vc=new Lh(1,1),zh=new yh,Gh=new rd,Hh=new Th,yc=[],Mc=[],Sc=new Float32Array(16),xc=new Float32Array(9),bc=new Float32Array(4);function Rs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=yc[s];if(r===void 0&&(r=new Float32Array(s),yc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function ze(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ua(i,t){let e=Mc[t];e===void 0&&(e=new Int32Array(t),Mc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function J0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Q0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;i.uniform2fv(this.addr,t),Ge(e,t)}}function tm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ze(e,t))return;i.uniform3fv(this.addr,t),Ge(e,t)}}function em(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;i.uniform4fv(this.addr,t),Ge(e,t)}}function nm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ge(e,t)}else{if(ze(e,n))return;bc.set(n),i.uniformMatrix2fv(this.addr,!1,bc),Ge(e,n)}}function im(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ge(e,t)}else{if(ze(e,n))return;xc.set(n),i.uniformMatrix3fv(this.addr,!1,xc),Ge(e,n)}}function sm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ge(e,t)}else{if(ze(e,n))return;Sc.set(n),i.uniformMatrix4fv(this.addr,!1,Sc),Ge(e,n)}}function rm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;i.uniform2iv(this.addr,t),Ge(e,t)}}function om(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ze(e,t))return;i.uniform3iv(this.addr,t),Ge(e,t)}}function lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;i.uniform4iv(this.addr,t),Ge(e,t)}}function cm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function hm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;i.uniform2uiv(this.addr,t),Ge(e,t)}}function um(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ze(e,t))return;i.uniform3uiv(this.addr,t),Ge(e,t)}}function dm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;i.uniform4uiv(this.addr,t),Ge(e,t)}}function fm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(vc.compareFunction=gh,r=vc):r=kh,e.setTexture2D(t||r,s)}function pm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Gh,s)}function mm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Hh,s)}function gm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||zh,s)}function _m(i){switch(i){case 5126:return J0;case 35664:return Q0;case 35665:return tm;case 35666:return em;case 35674:return nm;case 35675:return im;case 35676:return sm;case 5124:case 35670:return rm;case 35667:case 35671:return am;case 35668:case 35672:return om;case 35669:case 35673:return lm;case 5125:return cm;case 36294:return hm;case 36295:return um;case 36296:return dm;case 35678:case 36198:case 36298:case 36306:case 35682:return fm;case 35679:case 36299:case 36307:return pm;case 35680:case 36300:case 36308:case 36293:return mm;case 36289:case 36303:case 36311:case 36292:return gm}}function vm(i,t){i.uniform1fv(this.addr,t)}function ym(i,t){const e=Rs(t,this.size,2);i.uniform2fv(this.addr,e)}function Mm(i,t){const e=Rs(t,this.size,3);i.uniform3fv(this.addr,e)}function Sm(i,t){const e=Rs(t,this.size,4);i.uniform4fv(this.addr,e)}function xm(i,t){const e=Rs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function bm(i,t){const e=Rs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Em(i,t){const e=Rs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Tm(i,t){i.uniform1iv(this.addr,t)}function wm(i,t){i.uniform2iv(this.addr,t)}function Am(i,t){i.uniform3iv(this.addr,t)}function Cm(i,t){i.uniform4iv(this.addr,t)}function Rm(i,t){i.uniform1uiv(this.addr,t)}function Pm(i,t){i.uniform2uiv(this.addr,t)}function Dm(i,t){i.uniform3uiv(this.addr,t)}function Lm(i,t){i.uniform4uiv(this.addr,t)}function Im(i,t,e){const n=this.cache,s=t.length,r=ua(e,s);ze(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||kh,r[a])}function Um(i,t,e){const n=this.cache,s=t.length,r=ua(e,s);ze(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Gh,r[a])}function Nm(i,t,e){const n=this.cache,s=t.length,r=ua(e,s);ze(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Hh,r[a])}function Om(i,t,e){const n=this.cache,s=t.length,r=ua(e,s);ze(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||zh,r[a])}function Fm(i){switch(i){case 5126:return vm;case 35664:return ym;case 35665:return Mm;case 35666:return Sm;case 35674:return xm;case 35675:return bm;case 35676:return Em;case 5124:case 35670:return Tm;case 35667:case 35671:return wm;case 35668:case 35672:return Am;case 35669:case 35673:return Cm;case 5125:return Rm;case 36294:return Pm;case 36295:return Dm;case 36296:return Lm;case 35678:case 36198:case 36298:case 36306:case 35682:return Im;case 35679:case 36299:case 36307:return Um;case 35680:case 36300:case 36308:case 36293:return Nm;case 36289:case 36303:case 36311:case 36292:return Om}}class Bm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=_m(e.type)}}class km{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Fm(e.type)}}class zm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Za=/(\w+)(\])?(\[|\.)?/g;function Ec(i,t){i.seq.push(t),i.map[t.id]=t}function Gm(i,t,e){const n=i.name,s=n.length;for(Za.lastIndex=0;;){const r=Za.exec(n),a=Za.lastIndex;let o=r[1];const l=r[2]==="]",h=r[3];if(l&&(o=o|0),h===void 0||h==="["&&a+2===s){Ec(e,h===void 0?new Bm(o,i,t):new km(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new zm(o),Ec(e,u)),e=u}}}class $r{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Gm(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Tc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Hm=37297;let Vm=0;function Wm(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const wc=new Kt;function Xm(i){he._getMatrix(wc,he.workingColorSpace,i);const t=`mat3( ${wc.elements.map(e=>e.toFixed(4))} )`;switch(he.getTransfer(i)){case Jr:return[t,"LinearTransferOETF"];case pe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Ac(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Wm(i.getShaderSource(t),a)}else return s}function qm(i,t){const e=Xm(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Ym(i,t){let e;switch(t){case th:e="Linear";break;case eh:e="Reinhard";break;case nh:e="Cineon";break;case Qo:e="ACESFilmic";break;case ih:e="AgX";break;case sh:e="Neutral";break;case xu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Fr=new C;function $m(){he.getLuminanceCoefficients(Fr);const i=Fr.x.toFixed(4),t=Fr.y.toFixed(4),e=Fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Km(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ys).join(`
`)}function jm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Zm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ys(i){return i!==""}function Cc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Rc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Jm=/^[ \t]*#include +<([\w\d./]+)>/gm;function $o(i){return i.replace(Jm,tg)}const Qm=new Map;function tg(i,t){let e=Jt[t];if(e===void 0){const n=Qm.get(t);if(n!==void 0)e=Jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return $o(e)}const eg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pc(i){return i.replace(eg,ng)}function ng(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Dc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function ig(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Zc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Jc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Hn&&(t="SHADOWMAP_TYPE_VSM"),t}function sg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ss:case xs:t="ENVMAP_TYPE_CUBE";break;case ca:t="ENVMAP_TYPE_CUBE_UV";break}return t}function rg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case xs:t="ENVMAP_MODE_REFRACTION";break}return t}function ag(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Qc:t="ENVMAP_BLENDING_MULTIPLY";break;case Mu:t="ENVMAP_BLENDING_MIX";break;case Su:t="ENVMAP_BLENDING_ADD";break}return t}function og(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function lg(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=ig(e),h=sg(e),c=rg(e),u=ag(e),d=og(e),p=Km(e),_=jm(r),v=s.createProgram();let g,m,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Ys).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Ys).join(`
`),m.length>0&&(m+=`
`)):(g=[Dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ys).join(`
`),m=[Dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==fi?"#define TONE_MAPPING":"",e.toneMapping!==fi?Jt.tonemapping_pars_fragment:"",e.toneMapping!==fi?Ym("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,qm("linearToOutputTexel",e.outputColorSpace),$m(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ys).join(`
`)),a=$o(a),a=Cc(a,e),a=Rc(a,e),o=$o(o),o=Cc(o,e),o=Rc(o,e),a=Pc(a),o=Pc(o),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===wl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===wl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const T=w+g+a,f=w+m+o,D=Tc(s,s.VERTEX_SHADER,T),R=Tc(s,s.FRAGMENT_SHADER,f);s.attachShader(v,D),s.attachShader(v,R),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(U){if(i.debug.checkShaderErrors){const q=s.getProgramInfoLog(v).trim(),V=s.getShaderInfoLog(D).trim(),tt=s.getShaderInfoLog(R).trim();let rt=!0,Z=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(rt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,D,R);else{const lt=Ac(s,D,"vertex"),$=Ac(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+q+`
`+lt+`
`+$)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(V===""||tt==="")&&(Z=!1);Z&&(U.diagnostics={runnable:rt,programLog:q,vertexShader:{log:V,prefix:g},fragmentShader:{log:tt,prefix:m}})}s.deleteShader(D),s.deleteShader(R),I=new $r(s,v),x=Zm(s,v)}let I;this.getUniforms=function(){return I===void 0&&P(this),I};let x;this.getAttributes=function(){return x===void 0&&P(this),x};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(v,Hm)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Vm++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=D,this.fragmentShader=R,this}let cg=0;class hg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new ug(t),e.set(t,n)),n}}class ug{constructor(t){this.id=cg++,this.code=t,this.usedTimes=0}}function dg(i,t,e,n,s,r,a){const o=new ll,l=new hg,h=new Set,c=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return h.add(x),x===0?"uv":`uv${x}`}function g(x,S,U,q,V){const tt=q.fog,rt=V.geometry,Z=x.isMeshStandardMaterial?q.environment:null,lt=(x.isMeshStandardMaterial?e:t).get(x.envMap||Z),$=lt&&lt.mapping===ca?lt.image.height:null,xt=_[x.type];x.precision!==null&&(p=s.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const bt=rt.morphAttributes.position||rt.morphAttributes.normal||rt.morphAttributes.color,Bt=bt!==void 0?bt.length:0;let Qt=0;rt.morphAttributes.position!==void 0&&(Qt=1),rt.morphAttributes.normal!==void 0&&(Qt=2),rt.morphAttributes.color!==void 0&&(Qt=3);let de,nt,mt,Lt;if(xt){const te=Cn[xt];de=te.vertexShader,nt=te.fragmentShader}else de=x.vertexShader,nt=x.fragmentShader,l.update(x),mt=l.getVertexShaderID(x),Lt=l.getFragmentShaderID(x);const yt=i.getRenderTarget(),Y=i.state.buffers.depth.getReversed(),gt=V.isInstancedMesh===!0,Gt=V.isBatchedMesh===!0,ue=!!x.map,jt=!!x.matcap,Pe=!!lt,L=!!x.aoMap,Ve=!!x.lightMap,qt=!!x.bumpMap,ne=!!x.normalMap,kt=!!x.displacementMap,Se=!!x.emissiveMap,zt=!!x.metalnessMap,E=!!x.roughnessMap,y=x.anisotropy>0,z=x.clearcoat>0,J=x.dispersion>0,at=x.iridescence>0,et=x.sheen>0,Ft=x.transmission>0,_t=y&&!!x.anisotropyMap,dt=z&&!!x.clearcoatMap,Vt=z&&!!x.clearcoatNormalMap,ot=z&&!!x.clearcoatRoughnessMap,Mt=at&&!!x.iridescenceMap,Ct=at&&!!x.iridescenceThicknessMap,It=et&&!!x.sheenColorMap,Pt=et&&!!x.sheenRoughnessMap,le=!!x.specularMap,Yt=!!x.specularColorMap,_e=!!x.specularIntensityMap,O=Ft&&!!x.transmissionMap,pt=Ft&&!!x.thicknessMap,X=!!x.gradientMap,Q=!!x.alphaMap,ft=x.alphaTest>0,Et=!!x.alphaHash,Ot=!!x.extensions;let Zt=fi;x.toneMapped&&(yt===null||yt.isXRRenderTarget===!0)&&(Zt=i.toneMapping);const we={shaderID:xt,shaderType:x.type,shaderName:x.name,vertexShader:de,fragmentShader:nt,defines:x.defines,customVertexShaderID:mt,customFragmentShaderID:Lt,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:Gt,batchingColor:Gt&&V._colorsTexture!==null,instancing:gt,instancingColor:gt&&V.instanceColor!==null,instancingMorph:gt&&V.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:yt===null?i.outputColorSpace:yt.isXRRenderTarget===!0?yt.texture.colorSpace:Ts,alphaToCoverage:!!x.alphaToCoverage,map:ue,matcap:jt,envMap:Pe,envMapMode:Pe&&lt.mapping,envMapCubeUVHeight:$,aoMap:L,lightMap:Ve,bumpMap:qt,normalMap:ne,displacementMap:d&&kt,emissiveMap:Se,normalMapObjectSpace:ne&&x.normalMapType===wu,normalMapTangentSpace:ne&&x.normalMapType===mh,metalnessMap:zt,roughnessMap:E,anisotropy:y,anisotropyMap:_t,clearcoat:z,clearcoatMap:dt,clearcoatNormalMap:Vt,clearcoatRoughnessMap:ot,dispersion:J,iridescence:at,iridescenceMap:Mt,iridescenceThicknessMap:Ct,sheen:et,sheenColorMap:It,sheenRoughnessMap:Pt,specularMap:le,specularColorMap:Yt,specularIntensityMap:_e,transmission:Ft,transmissionMap:O,thicknessMap:pt,gradientMap:X,opaque:x.transparent===!1&&x.blending===Kn&&x.alphaToCoverage===!1,alphaMap:Q,alphaTest:ft,alphaHash:Et,combine:x.combine,mapUv:ue&&v(x.map.channel),aoMapUv:L&&v(x.aoMap.channel),lightMapUv:Ve&&v(x.lightMap.channel),bumpMapUv:qt&&v(x.bumpMap.channel),normalMapUv:ne&&v(x.normalMap.channel),displacementMapUv:kt&&v(x.displacementMap.channel),emissiveMapUv:Se&&v(x.emissiveMap.channel),metalnessMapUv:zt&&v(x.metalnessMap.channel),roughnessMapUv:E&&v(x.roughnessMap.channel),anisotropyMapUv:_t&&v(x.anisotropyMap.channel),clearcoatMapUv:dt&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:Vt&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:Ct&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:It&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&v(x.sheenRoughnessMap.channel),specularMapUv:le&&v(x.specularMap.channel),specularColorMapUv:Yt&&v(x.specularColorMap.channel),specularIntensityMapUv:_e&&v(x.specularIntensityMap.channel),transmissionMapUv:O&&v(x.transmissionMap.channel),thicknessMapUv:pt&&v(x.thicknessMap.channel),alphaMapUv:Q&&v(x.alphaMap.channel),vertexTangents:!!rt.attributes.tangent&&(ne||y),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!rt.attributes.color&&rt.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!rt.attributes.uv&&(ue||Q),fog:!!tt,useFog:x.fog===!0,fogExp2:!!tt&&tt.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Y,skinning:V.isSkinnedMesh===!0,morphTargets:rt.morphAttributes.position!==void 0,morphNormals:rt.morphAttributes.normal!==void 0,morphColors:rt.morphAttributes.color!==void 0,morphTargetsCount:Bt,morphTextureStride:Qt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&U.length>0,shadowMapType:i.shadowMap.type,toneMapping:Zt,decodeVideoTexture:ue&&x.map.isVideoTexture===!0&&he.getTransfer(x.map.colorSpace)===pe,decodeVideoTextureEmissive:Se&&x.emissiveMap.isVideoTexture===!0&&he.getTransfer(x.emissiveMap.colorSpace)===pe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===nn,flipSided:x.side===sn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Ot&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ot&&x.extensions.multiDraw===!0||Gt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return we.vertexUv1s=h.has(1),we.vertexUv2s=h.has(2),we.vertexUv3s=h.has(3),h.clear(),we}function m(x){const S=[];if(x.shaderID?S.push(x.shaderID):(S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID)),x.defines!==void 0)for(const U in x.defines)S.push(U),S.push(x.defines[U]);return x.isRawShaderMaterial===!1&&(w(S,x),T(S,x),S.push(i.outputColorSpace)),S.push(x.customProgramCacheKey),S.join()}function w(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapCubeUVHeight),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.morphAttributeCount),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function T(x,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),x.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),x.push(o.mask)}function f(x){const S=_[x.type];let U;if(S){const q=Cn[S];U=ir.clone(q.uniforms)}else U=x.uniforms;return U}function D(x,S){let U;for(let q=0,V=c.length;q<V;q++){const tt=c[q];if(tt.cacheKey===S){U=tt,++U.usedTimes;break}}return U===void 0&&(U=new lg(i,S,x,r),c.push(U)),U}function R(x){if(--x.usedTimes===0){const S=c.indexOf(x);c[S]=c[c.length-1],c.pop(),x.destroy()}}function P(x){l.remove(x)}function I(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:f,acquireProgram:D,releaseProgram:R,releaseShaderCache:P,programs:c,dispose:I}}function fg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function pg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Lc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ic(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,p,_,v,g){let m=i[t];return m===void 0?(m={id:u.id,object:u,geometry:d,material:p,groupOrder:_,renderOrder:u.renderOrder,z:v,group:g},i[t]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=p,m.groupOrder=_,m.renderOrder=u.renderOrder,m.z=v,m.group=g),t++,m}function o(u,d,p,_,v,g){const m=a(u,d,p,_,v,g);p.transmission>0?n.push(m):p.transparent===!0?s.push(m):e.push(m)}function l(u,d,p,_,v,g){const m=a(u,d,p,_,v,g);p.transmission>0?n.unshift(m):p.transparent===!0?s.unshift(m):e.unshift(m)}function h(u,d){e.length>1&&e.sort(u||pg),n.length>1&&n.sort(d||Lc),s.length>1&&s.sort(d||Lc)}function c(){for(let u=t,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:c,sort:h}}function mg(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Ic,i.set(n,[a])):s>=r.length?(a=new Ic,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function gg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Rt};break;case"SpotLight":e={position:new C,direction:new C,color:new Rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Rt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Rt,groundColor:new Rt};break;case"RectAreaLight":e={color:new Rt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function _g(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let vg=0;function yg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Mg(i){const t=new gg,e=_g(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new C);const s=new C,r=new ce,a=new ce;function o(h){let c=0,u=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let p=0,_=0,v=0,g=0,m=0,w=0,T=0,f=0,D=0,R=0,P=0;h.sort(yg);for(let x=0,S=h.length;x<S;x++){const U=h[x],q=U.color,V=U.intensity,tt=U.distance,rt=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)c+=q.r*V,u+=q.g*V,d+=q.b*V;else if(U.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(U.sh.coefficients[Z],V);P++}else if(U.isDirectionalLight){const Z=t.get(U);if(Z.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const lt=U.shadow,$=e.get(U);$.shadowIntensity=lt.intensity,$.shadowBias=lt.bias,$.shadowNormalBias=lt.normalBias,$.shadowRadius=lt.radius,$.shadowMapSize=lt.mapSize,n.directionalShadow[p]=$,n.directionalShadowMap[p]=rt,n.directionalShadowMatrix[p]=U.shadow.matrix,w++}n.directional[p]=Z,p++}else if(U.isSpotLight){const Z=t.get(U);Z.position.setFromMatrixPosition(U.matrixWorld),Z.color.copy(q).multiplyScalar(V),Z.distance=tt,Z.coneCos=Math.cos(U.angle),Z.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),Z.decay=U.decay,n.spot[v]=Z;const lt=U.shadow;if(U.map&&(n.spotLightMap[D]=U.map,D++,lt.updateMatrices(U),U.castShadow&&R++),n.spotLightMatrix[v]=lt.matrix,U.castShadow){const $=e.get(U);$.shadowIntensity=lt.intensity,$.shadowBias=lt.bias,$.shadowNormalBias=lt.normalBias,$.shadowRadius=lt.radius,$.shadowMapSize=lt.mapSize,n.spotShadow[v]=$,n.spotShadowMap[v]=rt,f++}v++}else if(U.isRectAreaLight){const Z=t.get(U);Z.color.copy(q).multiplyScalar(V),Z.halfWidth.set(U.width*.5,0,0),Z.halfHeight.set(0,U.height*.5,0),n.rectArea[g]=Z,g++}else if(U.isPointLight){const Z=t.get(U);if(Z.color.copy(U.color).multiplyScalar(U.intensity),Z.distance=U.distance,Z.decay=U.decay,U.castShadow){const lt=U.shadow,$=e.get(U);$.shadowIntensity=lt.intensity,$.shadowBias=lt.bias,$.shadowNormalBias=lt.normalBias,$.shadowRadius=lt.radius,$.shadowMapSize=lt.mapSize,$.shadowCameraNear=lt.camera.near,$.shadowCameraFar=lt.camera.far,n.pointShadow[_]=$,n.pointShadowMap[_]=rt,n.pointShadowMatrix[_]=U.shadow.matrix,T++}n.point[_]=Z,_++}else if(U.isHemisphereLight){const Z=t.get(U);Z.skyColor.copy(U.color).multiplyScalar(V),Z.groundColor.copy(U.groundColor).multiplyScalar(V),n.hemi[m]=Z,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=c,n.ambient[1]=u,n.ambient[2]=d;const I=n.hash;(I.directionalLength!==p||I.pointLength!==_||I.spotLength!==v||I.rectAreaLength!==g||I.hemiLength!==m||I.numDirectionalShadows!==w||I.numPointShadows!==T||I.numSpotShadows!==f||I.numSpotMaps!==D||I.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=v,n.rectArea.length=g,n.point.length=_,n.hemi.length=m,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=f,n.spotShadowMap.length=f,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=f+D-R,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=P,I.directionalLength=p,I.pointLength=_,I.spotLength=v,I.rectAreaLength=g,I.hemiLength=m,I.numDirectionalShadows=w,I.numPointShadows=T,I.numSpotShadows=f,I.numSpotMaps=D,I.numLightProbes=P,n.version=vg++)}function l(h,c){let u=0,d=0,p=0,_=0,v=0;const g=c.matrixWorldInverse;for(let m=0,w=h.length;m<w;m++){const T=h[m];if(T.isDirectionalLight){const f=n.directional[u];f.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),f.direction.sub(s),f.direction.transformDirection(g),u++}else if(T.isSpotLight){const f=n.spot[p];f.position.setFromMatrixPosition(T.matrixWorld),f.position.applyMatrix4(g),f.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),f.direction.sub(s),f.direction.transformDirection(g),p++}else if(T.isRectAreaLight){const f=n.rectArea[_];f.position.setFromMatrixPosition(T.matrixWorld),f.position.applyMatrix4(g),a.identity(),r.copy(T.matrixWorld),r.premultiply(g),a.extractRotation(r),f.halfWidth.set(T.width*.5,0,0),f.halfHeight.set(0,T.height*.5,0),f.halfWidth.applyMatrix4(a),f.halfHeight.applyMatrix4(a),_++}else if(T.isPointLight){const f=n.point[d];f.position.setFromMatrixPosition(T.matrixWorld),f.position.applyMatrix4(g),d++}else if(T.isHemisphereLight){const f=n.hemi[v];f.direction.setFromMatrixPosition(T.matrixWorld),f.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:n}}function Uc(i){const t=new Mg(i),e=[],n=[];function s(c){h.camera=c,e.length=0,n.length=0}function r(c){e.push(c)}function a(c){n.push(c)}function o(){t.setup(e)}function l(c){t.setupView(e,c)}const h={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Sg(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Uc(i),t.set(s,[o])):r>=a.length?(o=new Uc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const xg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Eg(i,t,e){let n=new ul;const s=new ut,r=new ut,a=new Me,o=new Vd({depthPacking:Tu}),l=new Wd,h={},c=e.maxTextureSize,u={[vi]:sn,[sn]:vi,[nn]:nn},d=new Re({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:xg,fragmentShader:bg}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const _=new Te;_.setAttribute("position",new se(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new At(_,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Zc;let m=this.type;this.render=function(R,P,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||R.length===0)return;const x=i.getRenderTarget(),S=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),q=i.state;q.setBlending($n),q.buffers.color.setClear(1,1,1,1),q.buffers.depth.setTest(!0),q.setScissorTest(!1);const V=m!==Hn&&this.type===Hn,tt=m===Hn&&this.type!==Hn;for(let rt=0,Z=R.length;rt<Z;rt++){const lt=R[rt],$=lt.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",lt,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const xt=$.getFrameExtents();if(s.multiply(xt),r.copy($.mapSize),(s.x>c||s.y>c)&&(s.x>c&&(r.x=Math.floor(c/xt.x),s.x=r.x*xt.x,$.mapSize.x=r.x),s.y>c&&(r.y=Math.floor(c/xt.y),s.y=r.y*xt.y,$.mapSize.y=r.y)),$.map===null||V===!0||tt===!0){const Bt=this.type!==Hn?{minFilter:pn,magFilter:pn}:{};$.map!==null&&$.map.dispose(),$.map=new Mn(s.x,s.y,Bt),$.map.texture.name=lt.name+".shadowMap",$.camera.updateProjectionMatrix()}i.setRenderTarget($.map),i.clear();const bt=$.getViewportCount();for(let Bt=0;Bt<bt;Bt++){const Qt=$.getViewport(Bt);a.set(r.x*Qt.x,r.y*Qt.y,r.x*Qt.z,r.y*Qt.w),q.viewport(a),$.updateMatrices(lt,Bt),n=$.getFrustum(),f(P,I,$.camera,lt,this.type)}$.isPointLightShadow!==!0&&this.type===Hn&&w($,I),$.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(x,S,U)};function w(R,P){const I=t.update(v);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,p.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Mn(s.x,s.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(P,null,I,d,v,null),p.uniforms.shadow_pass.value=R.mapPass.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(P,null,I,p,v,null)}function T(R,P,I,x){let S=null;const U=I.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(U!==void 0)S=U;else if(S=I.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const q=S.uuid,V=P.uuid;let tt=h[q];tt===void 0&&(tt={},h[q]=tt);let rt=tt[V];rt===void 0&&(rt=S.clone(),tt[V]=rt,P.addEventListener("dispose",D)),S=rt}if(S.visible=P.visible,S.wireframe=P.wireframe,x===Hn?S.side=P.shadowSide!==null?P.shadowSide:P.side:S.side=P.shadowSide!==null?P.shadowSide:u[P.side],S.alphaMap=P.alphaMap,S.alphaTest=P.alphaTest,S.map=P.map,S.clipShadows=P.clipShadows,S.clippingPlanes=P.clippingPlanes,S.clipIntersection=P.clipIntersection,S.displacementMap=P.displacementMap,S.displacementScale=P.displacementScale,S.displacementBias=P.displacementBias,S.wireframeLinewidth=P.wireframeLinewidth,S.linewidth=P.linewidth,I.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const q=i.properties.get(S);q.light=I}return S}function f(R,P,I,x,S){if(R.visible===!1)return;if(R.layers.test(P.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&S===Hn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,R.matrixWorld);const V=t.update(R),tt=R.material;if(Array.isArray(tt)){const rt=V.groups;for(let Z=0,lt=rt.length;Z<lt;Z++){const $=rt[Z],xt=tt[$.materialIndex];if(xt&&xt.visible){const bt=T(R,xt,x,S);R.onBeforeShadow(i,R,P,I,V,bt,$),i.renderBufferDirect(I,null,V,bt,R,$),R.onAfterShadow(i,R,P,I,V,bt,$)}}}else if(tt.visible){const rt=T(R,tt,x,S);R.onBeforeShadow(i,R,P,I,V,rt,null),i.renderBufferDirect(I,null,V,rt,R,null),R.onAfterShadow(i,R,P,I,V,rt,null)}}const q=R.children;for(let V=0,tt=q.length;V<tt;V++)f(q[V],P,I,x,S)}function D(R){R.target.removeEventListener("dispose",D);for(const I in h){const x=h[I],S=R.target.uuid;S in x&&(x[S].dispose(),delete x[S])}}}const Tg={[lo]:co,[ho]:po,[uo]:mo,[Ms]:fo,[co]:lo,[po]:ho,[mo]:uo,[fo]:Ms};function wg(i,t){function e(){let O=!1;const pt=new Me;let X=null;const Q=new Me(0,0,0,0);return{setMask:function(ft){X!==ft&&!O&&(i.colorMask(ft,ft,ft,ft),X=ft)},setLocked:function(ft){O=ft},setClear:function(ft,Et,Ot,Zt,we){we===!0&&(ft*=Zt,Et*=Zt,Ot*=Zt),pt.set(ft,Et,Ot,Zt),Q.equals(pt)===!1&&(i.clearColor(ft,Et,Ot,Zt),Q.copy(pt))},reset:function(){O=!1,X=null,Q.set(-1,0,0,0)}}}function n(){let O=!1,pt=!1,X=null,Q=null,ft=null;return{setReversed:function(Et){if(pt!==Et){const Ot=t.get("EXT_clip_control");pt?Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.ZERO_TO_ONE_EXT):Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.NEGATIVE_ONE_TO_ONE_EXT);const Zt=ft;ft=null,this.setClear(Zt)}pt=Et},getReversed:function(){return pt},setTest:function(Et){Et?yt(i.DEPTH_TEST):Y(i.DEPTH_TEST)},setMask:function(Et){X!==Et&&!O&&(i.depthMask(Et),X=Et)},setFunc:function(Et){if(pt&&(Et=Tg[Et]),Q!==Et){switch(Et){case lo:i.depthFunc(i.NEVER);break;case co:i.depthFunc(i.ALWAYS);break;case ho:i.depthFunc(i.LESS);break;case Ms:i.depthFunc(i.LEQUAL);break;case uo:i.depthFunc(i.EQUAL);break;case fo:i.depthFunc(i.GEQUAL);break;case po:i.depthFunc(i.GREATER);break;case mo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Q=Et}},setLocked:function(Et){O=Et},setClear:function(Et){ft!==Et&&(pt&&(Et=1-Et),i.clearDepth(Et),ft=Et)},reset:function(){O=!1,X=null,Q=null,ft=null,pt=!1}}}function s(){let O=!1,pt=null,X=null,Q=null,ft=null,Et=null,Ot=null,Zt=null,we=null;return{setTest:function(te){O||(te?yt(i.STENCIL_TEST):Y(i.STENCIL_TEST))},setMask:function(te){pt!==te&&!O&&(i.stencilMask(te),pt=te)},setFunc:function(te,Ie,We){(X!==te||Q!==Ie||ft!==We)&&(i.stencilFunc(te,Ie,We),X=te,Q=Ie,ft=We)},setOp:function(te,Ie,We){(Et!==te||Ot!==Ie||Zt!==We)&&(i.stencilOp(te,Ie,We),Et=te,Ot=Ie,Zt=We)},setLocked:function(te){O=te},setClear:function(te){we!==te&&(i.clearStencil(te),we=te)},reset:function(){O=!1,pt=null,X=null,Q=null,ft=null,Et=null,Ot=null,Zt=null,we=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,h=new WeakMap;let c={},u={},d=new WeakMap,p=[],_=null,v=!1,g=null,m=null,w=null,T=null,f=null,D=null,R=null,P=new Rt(0,0,0),I=0,x=!1,S=null,U=null,q=null,V=null,tt=null;const rt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,lt=0;const $=i.getParameter(i.VERSION);$.indexOf("WebGL")!==-1?(lt=parseFloat(/^WebGL (\d)/.exec($)[1]),Z=lt>=1):$.indexOf("OpenGL ES")!==-1&&(lt=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),Z=lt>=2);let xt=null,bt={};const Bt=i.getParameter(i.SCISSOR_BOX),Qt=i.getParameter(i.VIEWPORT),de=new Me().fromArray(Bt),nt=new Me().fromArray(Qt);function mt(O,pt,X,Q){const ft=new Uint8Array(4),Et=i.createTexture();i.bindTexture(O,Et),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ot=0;Ot<X;Ot++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,Q,0,i.RGBA,i.UNSIGNED_BYTE,ft):i.texImage2D(pt+Ot,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ft);return Et}const Lt={};Lt[i.TEXTURE_2D]=mt(i.TEXTURE_2D,i.TEXTURE_2D,1),Lt[i.TEXTURE_CUBE_MAP]=mt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Lt[i.TEXTURE_2D_ARRAY]=mt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Lt[i.TEXTURE_3D]=mt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),yt(i.DEPTH_TEST),a.setFunc(Ms),qt(!1),ne(xl),yt(i.CULL_FACE),L($n);function yt(O){c[O]!==!0&&(i.enable(O),c[O]=!0)}function Y(O){c[O]!==!1&&(i.disable(O),c[O]=!1)}function gt(O,pt){return u[O]!==pt?(i.bindFramebuffer(O,pt),u[O]=pt,O===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=pt),O===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function Gt(O,pt){let X=p,Q=!1;if(O){X=d.get(pt),X===void 0&&(X=[],d.set(pt,X));const ft=O.textures;if(X.length!==ft.length||X[0]!==i.COLOR_ATTACHMENT0){for(let Et=0,Ot=ft.length;Et<Ot;Et++)X[Et]=i.COLOR_ATTACHMENT0+Et;X.length=ft.length,Q=!0}}else X[0]!==i.BACK&&(X[0]=i.BACK,Q=!0);Q&&i.drawBuffers(X)}function ue(O){return _!==O?(i.useProgram(O),_=O,!0):!1}const jt={[Di]:i.FUNC_ADD,[iu]:i.FUNC_SUBTRACT,[su]:i.FUNC_REVERSE_SUBTRACT};jt[ru]=i.MIN,jt[au]=i.MAX;const Pe={[ou]:i.ZERO,[lu]:i.ONE,[cu]:i.SRC_COLOR,[ao]:i.SRC_ALPHA,[mu]:i.SRC_ALPHA_SATURATE,[fu]:i.DST_COLOR,[uu]:i.DST_ALPHA,[hu]:i.ONE_MINUS_SRC_COLOR,[oo]:i.ONE_MINUS_SRC_ALPHA,[pu]:i.ONE_MINUS_DST_COLOR,[du]:i.ONE_MINUS_DST_ALPHA,[gu]:i.CONSTANT_COLOR,[_u]:i.ONE_MINUS_CONSTANT_COLOR,[vu]:i.CONSTANT_ALPHA,[yu]:i.ONE_MINUS_CONSTANT_ALPHA};function L(O,pt,X,Q,ft,Et,Ot,Zt,we,te){if(O===$n){v===!0&&(Y(i.BLEND),v=!1);return}if(v===!1&&(yt(i.BLEND),v=!0),O!==nu){if(O!==g||te!==x){if((m!==Di||f!==Di)&&(i.blendEquation(i.FUNC_ADD),m=Di,f=Di),te)switch(O){case Kn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case De:i.blendFunc(i.ONE,i.ONE);break;case bl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case El:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Kn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case De:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case bl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case El:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}w=null,T=null,D=null,R=null,P.set(0,0,0),I=0,g=O,x=te}return}ft=ft||pt,Et=Et||X,Ot=Ot||Q,(pt!==m||ft!==f)&&(i.blendEquationSeparate(jt[pt],jt[ft]),m=pt,f=ft),(X!==w||Q!==T||Et!==D||Ot!==R)&&(i.blendFuncSeparate(Pe[X],Pe[Q],Pe[Et],Pe[Ot]),w=X,T=Q,D=Et,R=Ot),(Zt.equals(P)===!1||we!==I)&&(i.blendColor(Zt.r,Zt.g,Zt.b,we),P.copy(Zt),I=we),g=O,x=!1}function Ve(O,pt){O.side===nn?Y(i.CULL_FACE):yt(i.CULL_FACE);let X=O.side===sn;pt&&(X=!X),qt(X),O.blending===Kn&&O.transparent===!1?L($n):L(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);const Q=O.stencilWrite;o.setTest(Q),Q&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Se(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?yt(i.SAMPLE_ALPHA_TO_COVERAGE):Y(i.SAMPLE_ALPHA_TO_COVERAGE)}function qt(O){S!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),S=O)}function ne(O){O!==tu?(yt(i.CULL_FACE),O!==U&&(O===xl?i.cullFace(i.BACK):O===eu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Y(i.CULL_FACE),U=O}function kt(O){O!==q&&(Z&&i.lineWidth(O),q=O)}function Se(O,pt,X){O?(yt(i.POLYGON_OFFSET_FILL),(V!==pt||tt!==X)&&(i.polygonOffset(pt,X),V=pt,tt=X)):Y(i.POLYGON_OFFSET_FILL)}function zt(O){O?yt(i.SCISSOR_TEST):Y(i.SCISSOR_TEST)}function E(O){O===void 0&&(O=i.TEXTURE0+rt-1),xt!==O&&(i.activeTexture(O),xt=O)}function y(O,pt,X){X===void 0&&(xt===null?X=i.TEXTURE0+rt-1:X=xt);let Q=bt[X];Q===void 0&&(Q={type:void 0,texture:void 0},bt[X]=Q),(Q.type!==O||Q.texture!==pt)&&(xt!==X&&(i.activeTexture(X),xt=X),i.bindTexture(O,pt||Lt[O]),Q.type=O,Q.texture=pt)}function z(){const O=bt[xt];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function J(){try{i.compressedTexImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function at(){try{i.compressedTexImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function et(){try{i.texSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ft(){try{i.texSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function _t(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function dt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Vt(){try{i.texStorage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ot(){try{i.texStorage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Mt(){try{i.texImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ct(){try{i.texImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function It(O){de.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),de.copy(O))}function Pt(O){nt.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),nt.copy(O))}function le(O,pt){let X=h.get(pt);X===void 0&&(X=new WeakMap,h.set(pt,X));let Q=X.get(O);Q===void 0&&(Q=i.getUniformBlockIndex(pt,O.name),X.set(O,Q))}function Yt(O,pt){const Q=h.get(pt).get(O);l.get(pt)!==Q&&(i.uniformBlockBinding(pt,Q,O.__bindingPointIndex),l.set(pt,Q))}function _e(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},xt=null,bt={},u={},d=new WeakMap,p=[],_=null,v=!1,g=null,m=null,w=null,T=null,f=null,D=null,R=null,P=new Rt(0,0,0),I=0,x=!1,S=null,U=null,q=null,V=null,tt=null,de.set(0,0,i.canvas.width,i.canvas.height),nt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:yt,disable:Y,bindFramebuffer:gt,drawBuffers:Gt,useProgram:ue,setBlending:L,setMaterial:Ve,setFlipSided:qt,setCullFace:ne,setLineWidth:kt,setPolygonOffset:Se,setScissorTest:zt,activeTexture:E,bindTexture:y,unbindTexture:z,compressedTexImage2D:J,compressedTexImage3D:at,texImage2D:Mt,texImage3D:Ct,updateUBOMapping:le,uniformBlockBinding:Yt,texStorage2D:Vt,texStorage3D:ot,texSubImage2D:et,texSubImage3D:Ft,compressedTexSubImage2D:_t,compressedTexSubImage3D:dt,scissor:It,viewport:Pt,reset:_e}}function Ag(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ut,c=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(E,y){return p?new OffscreenCanvas(E,y):ta("canvas")}function v(E,y,z){let J=1;const at=zt(E);if((at.width>z||at.height>z)&&(J=z/Math.max(at.width,at.height)),J<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const et=Math.floor(J*at.width),Ft=Math.floor(J*at.height);u===void 0&&(u=_(et,Ft));const _t=y?_(et,Ft):u;return _t.width=et,_t.height=Ft,_t.getContext("2d").drawImage(E,0,0,et,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+at.width+"x"+at.height+") to ("+et+"x"+Ft+")."),_t}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+at.width+"x"+at.height+")."),E;return E}function g(E){return E.generateMipmaps}function m(E){i.generateMipmap(E)}function w(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(E,y,z,J,at=!1){if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let et=y;if(y===i.RED&&(z===i.FLOAT&&(et=i.R32F),z===i.HALF_FLOAT&&(et=i.R16F),z===i.UNSIGNED_BYTE&&(et=i.R8)),y===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(et=i.R8UI),z===i.UNSIGNED_SHORT&&(et=i.R16UI),z===i.UNSIGNED_INT&&(et=i.R32UI),z===i.BYTE&&(et=i.R8I),z===i.SHORT&&(et=i.R16I),z===i.INT&&(et=i.R32I)),y===i.RG&&(z===i.FLOAT&&(et=i.RG32F),z===i.HALF_FLOAT&&(et=i.RG16F),z===i.UNSIGNED_BYTE&&(et=i.RG8)),y===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(et=i.RG8UI),z===i.UNSIGNED_SHORT&&(et=i.RG16UI),z===i.UNSIGNED_INT&&(et=i.RG32UI),z===i.BYTE&&(et=i.RG8I),z===i.SHORT&&(et=i.RG16I),z===i.INT&&(et=i.RG32I)),y===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(et=i.RGB8UI),z===i.UNSIGNED_SHORT&&(et=i.RGB16UI),z===i.UNSIGNED_INT&&(et=i.RGB32UI),z===i.BYTE&&(et=i.RGB8I),z===i.SHORT&&(et=i.RGB16I),z===i.INT&&(et=i.RGB32I)),y===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(et=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(et=i.RGBA16UI),z===i.UNSIGNED_INT&&(et=i.RGBA32UI),z===i.BYTE&&(et=i.RGBA8I),z===i.SHORT&&(et=i.RGBA16I),z===i.INT&&(et=i.RGBA32I)),y===i.RGB&&z===i.UNSIGNED_INT_5_9_9_9_REV&&(et=i.RGB9_E5),y===i.RGBA){const Ft=at?Jr:he.getTransfer(J);z===i.FLOAT&&(et=i.RGBA32F),z===i.HALF_FLOAT&&(et=i.RGBA16F),z===i.UNSIGNED_BYTE&&(et=Ft===pe?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(et=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(et=i.RGB5_A1)}return(et===i.R16F||et===i.R32F||et===i.RG16F||et===i.RG32F||et===i.RGBA16F||et===i.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function f(E,y){let z;return E?y===null||y===Fi||y===bs?z=i.DEPTH24_STENCIL8:y===In?z=i.DEPTH32F_STENCIL8:y===er&&(z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Fi||y===bs?z=i.DEPTH_COMPONENT24:y===In?z=i.DEPTH_COMPONENT32F:y===er&&(z=i.DEPTH_COMPONENT16),z}function D(E,y){return g(E)===!0||E.isFramebufferTexture&&E.minFilter!==pn&&E.minFilter!==Ln?Math.log2(Math.max(y.width,y.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?y.mipmaps.length:1}function R(E){const y=E.target;y.removeEventListener("dispose",R),I(y),y.isVideoTexture&&c.delete(y)}function P(E){const y=E.target;y.removeEventListener("dispose",P),S(y)}function I(E){const y=n.get(E);if(y.__webglInit===void 0)return;const z=E.source,J=d.get(z);if(J){const at=J[y.__cacheKey];at.usedTimes--,at.usedTimes===0&&x(E),Object.keys(J).length===0&&d.delete(z)}n.remove(E)}function x(E){const y=n.get(E);i.deleteTexture(y.__webglTexture);const z=E.source,J=d.get(z);delete J[y.__cacheKey],a.memory.textures--}function S(E){const y=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(y.__webglFramebuffer[J]))for(let at=0;at<y.__webglFramebuffer[J].length;at++)i.deleteFramebuffer(y.__webglFramebuffer[J][at]);else i.deleteFramebuffer(y.__webglFramebuffer[J]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[J])}else{if(Array.isArray(y.__webglFramebuffer))for(let J=0;J<y.__webglFramebuffer.length;J++)i.deleteFramebuffer(y.__webglFramebuffer[J]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let J=0;J<y.__webglColorRenderbuffer.length;J++)y.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[J]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const z=E.textures;for(let J=0,at=z.length;J<at;J++){const et=n.get(z[J]);et.__webglTexture&&(i.deleteTexture(et.__webglTexture),a.memory.textures--),n.remove(z[J])}n.remove(E)}let U=0;function q(){U=0}function V(){const E=U;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),U+=1,E}function tt(E){const y=[];return y.push(E.wrapS),y.push(E.wrapT),y.push(E.wrapR||0),y.push(E.magFilter),y.push(E.minFilter),y.push(E.anisotropy),y.push(E.internalFormat),y.push(E.format),y.push(E.type),y.push(E.generateMipmaps),y.push(E.premultiplyAlpha),y.push(E.flipY),y.push(E.unpackAlignment),y.push(E.colorSpace),y.join()}function rt(E,y){const z=n.get(E);if(E.isVideoTexture&&kt(E),E.isRenderTargetTexture===!1&&E.version>0&&z.__version!==E.version){const J=E.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{nt(z,E,y);return}}e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+y)}function Z(E,y){const z=n.get(E);if(E.version>0&&z.__version!==E.version){nt(z,E,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+y)}function lt(E,y){const z=n.get(E);if(E.version>0&&z.__version!==E.version){nt(z,E,y);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+y)}function $(E,y){const z=n.get(E);if(E.version>0&&z.__version!==E.version){mt(z,E,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+y)}const xt={[Zr]:i.REPEAT,[Ii]:i.CLAMP_TO_EDGE,[_o]:i.MIRRORED_REPEAT},bt={[pn]:i.NEAREST,[bu]:i.NEAREST_MIPMAP_NEAREST,[lr]:i.NEAREST_MIPMAP_LINEAR,[Ln]:i.LINEAR,[va]:i.LINEAR_MIPMAP_NEAREST,[Ui]:i.LINEAR_MIPMAP_LINEAR},Bt={[Au]:i.NEVER,[Iu]:i.ALWAYS,[Cu]:i.LESS,[gh]:i.LEQUAL,[Ru]:i.EQUAL,[Lu]:i.GEQUAL,[Pu]:i.GREATER,[Du]:i.NOTEQUAL};function Qt(E,y){if(y.type===In&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Ln||y.magFilter===va||y.magFilter===lr||y.magFilter===Ui||y.minFilter===Ln||y.minFilter===va||y.minFilter===lr||y.minFilter===Ui)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,xt[y.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,xt[y.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,xt[y.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,bt[y.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,bt[y.minFilter]),y.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,Bt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===pn||y.minFilter!==lr&&y.minFilter!==Ui||y.type===In&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(E,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function de(E,y){let z=!1;E.__webglInit===void 0&&(E.__webglInit=!0,y.addEventListener("dispose",R));const J=y.source;let at=d.get(J);at===void 0&&(at={},d.set(J,at));const et=tt(y);if(et!==E.__cacheKey){at[et]===void 0&&(at[et]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),at[et].usedTimes++;const Ft=at[E.__cacheKey];Ft!==void 0&&(at[E.__cacheKey].usedTimes--,Ft.usedTimes===0&&x(y)),E.__cacheKey=et,E.__webglTexture=at[et].texture}return z}function nt(E,y,z){let J=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(J=i.TEXTURE_3D);const at=de(E,y),et=y.source;e.bindTexture(J,E.__webglTexture,i.TEXTURE0+z);const Ft=n.get(et);if(et.version!==Ft.__version||at===!0){e.activeTexture(i.TEXTURE0+z);const _t=he.getPrimaries(he.workingColorSpace),dt=y.colorSpace===Wn?null:he.getPrimaries(y.colorSpace),Vt=y.colorSpace===Wn||_t===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt);let ot=v(y.image,!1,s.maxTextureSize);ot=Se(y,ot);const Mt=r.convert(y.format,y.colorSpace),Ct=r.convert(y.type);let It=T(y.internalFormat,Mt,Ct,y.colorSpace,y.isVideoTexture);Qt(J,y);let Pt;const le=y.mipmaps,Yt=y.isVideoTexture!==!0,_e=Ft.__version===void 0||at===!0,O=et.dataReady,pt=D(y,ot);if(y.isDepthTexture)It=f(y.format===Es,y.type),_e&&(Yt?e.texStorage2D(i.TEXTURE_2D,1,It,ot.width,ot.height):e.texImage2D(i.TEXTURE_2D,0,It,ot.width,ot.height,0,Mt,Ct,null));else if(y.isDataTexture)if(le.length>0){Yt&&_e&&e.texStorage2D(i.TEXTURE_2D,pt,It,le[0].width,le[0].height);for(let X=0,Q=le.length;X<Q;X++)Pt=le[X],Yt?O&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,Pt.width,Pt.height,Mt,Ct,Pt.data):e.texImage2D(i.TEXTURE_2D,X,It,Pt.width,Pt.height,0,Mt,Ct,Pt.data);y.generateMipmaps=!1}else Yt?(_e&&e.texStorage2D(i.TEXTURE_2D,pt,It,ot.width,ot.height),O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ot.width,ot.height,Mt,Ct,ot.data)):e.texImage2D(i.TEXTURE_2D,0,It,ot.width,ot.height,0,Mt,Ct,ot.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Yt&&_e&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,It,le[0].width,le[0].height,ot.depth);for(let X=0,Q=le.length;X<Q;X++)if(Pt=le[X],y.format!==wn)if(Mt!==null)if(Yt){if(O)if(y.layerUpdates.size>0){const ft=uc(Pt.width,Pt.height,y.format,y.type);for(const Et of y.layerUpdates){const Ot=Pt.data.subarray(Et*ft/Pt.data.BYTES_PER_ELEMENT,(Et+1)*ft/Pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,Et,Pt.width,Pt.height,1,Mt,Ot)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,Pt.width,Pt.height,ot.depth,Mt,Pt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,X,It,Pt.width,Pt.height,ot.depth,0,Pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Yt?O&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,Pt.width,Pt.height,ot.depth,Mt,Ct,Pt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,X,It,Pt.width,Pt.height,ot.depth,0,Mt,Ct,Pt.data)}else{Yt&&_e&&e.texStorage2D(i.TEXTURE_2D,pt,It,le[0].width,le[0].height);for(let X=0,Q=le.length;X<Q;X++)Pt=le[X],y.format!==wn?Mt!==null?Yt?O&&e.compressedTexSubImage2D(i.TEXTURE_2D,X,0,0,Pt.width,Pt.height,Mt,Pt.data):e.compressedTexImage2D(i.TEXTURE_2D,X,It,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?O&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,Pt.width,Pt.height,Mt,Ct,Pt.data):e.texImage2D(i.TEXTURE_2D,X,It,Pt.width,Pt.height,0,Mt,Ct,Pt.data)}else if(y.isDataArrayTexture)if(Yt){if(_e&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,It,ot.width,ot.height,ot.depth),O)if(y.layerUpdates.size>0){const X=uc(ot.width,ot.height,y.format,y.type);for(const Q of y.layerUpdates){const ft=ot.data.subarray(Q*X/ot.data.BYTES_PER_ELEMENT,(Q+1)*X/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,ot.width,ot.height,1,Mt,Ct,ft)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,Mt,Ct,ot.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,It,ot.width,ot.height,ot.depth,0,Mt,Ct,ot.data);else if(y.isData3DTexture)Yt?(_e&&e.texStorage3D(i.TEXTURE_3D,pt,It,ot.width,ot.height,ot.depth),O&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,Mt,Ct,ot.data)):e.texImage3D(i.TEXTURE_3D,0,It,ot.width,ot.height,ot.depth,0,Mt,Ct,ot.data);else if(y.isFramebufferTexture){if(_e)if(Yt)e.texStorage2D(i.TEXTURE_2D,pt,It,ot.width,ot.height);else{let X=ot.width,Q=ot.height;for(let ft=0;ft<pt;ft++)e.texImage2D(i.TEXTURE_2D,ft,It,X,Q,0,Mt,Ct,null),X>>=1,Q>>=1}}else if(le.length>0){if(Yt&&_e){const X=zt(le[0]);e.texStorage2D(i.TEXTURE_2D,pt,It,X.width,X.height)}for(let X=0,Q=le.length;X<Q;X++)Pt=le[X],Yt?O&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,Mt,Ct,Pt):e.texImage2D(i.TEXTURE_2D,X,It,Mt,Ct,Pt);y.generateMipmaps=!1}else if(Yt){if(_e){const X=zt(ot);e.texStorage2D(i.TEXTURE_2D,pt,It,X.width,X.height)}O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Mt,Ct,ot)}else e.texImage2D(i.TEXTURE_2D,0,It,Mt,Ct,ot);g(y)&&m(J),Ft.__version=et.version,y.onUpdate&&y.onUpdate(y)}E.__version=y.version}function mt(E,y,z){if(y.image.length!==6)return;const J=de(E,y),at=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+z);const et=n.get(at);if(at.version!==et.__version||J===!0){e.activeTexture(i.TEXTURE0+z);const Ft=he.getPrimaries(he.workingColorSpace),_t=y.colorSpace===Wn?null:he.getPrimaries(y.colorSpace),dt=y.colorSpace===Wn||Ft===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Vt=y.isCompressedTexture||y.image[0].isCompressedTexture,ot=y.image[0]&&y.image[0].isDataTexture,Mt=[];for(let Q=0;Q<6;Q++)!Vt&&!ot?Mt[Q]=v(y.image[Q],!0,s.maxCubemapSize):Mt[Q]=ot?y.image[Q].image:y.image[Q],Mt[Q]=Se(y,Mt[Q]);const Ct=Mt[0],It=r.convert(y.format,y.colorSpace),Pt=r.convert(y.type),le=T(y.internalFormat,It,Pt,y.colorSpace),Yt=y.isVideoTexture!==!0,_e=et.__version===void 0||J===!0,O=at.dataReady;let pt=D(y,Ct);Qt(i.TEXTURE_CUBE_MAP,y);let X;if(Vt){Yt&&_e&&e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,le,Ct.width,Ct.height);for(let Q=0;Q<6;Q++){X=Mt[Q].mipmaps;for(let ft=0;ft<X.length;ft++){const Et=X[ft];y.format!==wn?It!==null?Yt?O&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ft,0,0,Et.width,Et.height,It,Et.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ft,le,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Yt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ft,0,0,Et.width,Et.height,It,Pt,Et.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ft,le,Et.width,Et.height,0,It,Pt,Et.data)}}}else{if(X=y.mipmaps,Yt&&_e){X.length>0&&pt++;const Q=zt(Mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,le,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ot){Yt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Mt[Q].width,Mt[Q].height,It,Pt,Mt[Q].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,le,Mt[Q].width,Mt[Q].height,0,It,Pt,Mt[Q].data);for(let ft=0;ft<X.length;ft++){const Ot=X[ft].image[Q].image;Yt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ft+1,0,0,Ot.width,Ot.height,It,Pt,Ot.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ft+1,le,Ot.width,Ot.height,0,It,Pt,Ot.data)}}else{Yt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,It,Pt,Mt[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,le,It,Pt,Mt[Q]);for(let ft=0;ft<X.length;ft++){const Et=X[ft];Yt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ft+1,0,0,It,Pt,Et.image[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ft+1,le,It,Pt,Et.image[Q])}}}g(y)&&m(i.TEXTURE_CUBE_MAP),et.__version=at.version,y.onUpdate&&y.onUpdate(y)}E.__version=y.version}function Lt(E,y,z,J,at,et){const Ft=r.convert(z.format,z.colorSpace),_t=r.convert(z.type),dt=T(z.internalFormat,Ft,_t,z.colorSpace),Vt=n.get(y),ot=n.get(z);if(ot.__renderTarget=y,!Vt.__hasExternalTextures){const Mt=Math.max(1,y.width>>et),Ct=Math.max(1,y.height>>et);at===i.TEXTURE_3D||at===i.TEXTURE_2D_ARRAY?e.texImage3D(at,et,dt,Mt,Ct,y.depth,0,Ft,_t,null):e.texImage2D(at,et,dt,Mt,Ct,0,Ft,_t,null)}e.bindFramebuffer(i.FRAMEBUFFER,E),ne(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,at,ot.__webglTexture,0,qt(y)):(at===i.TEXTURE_2D||at>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,at,ot.__webglTexture,et),e.bindFramebuffer(i.FRAMEBUFFER,null)}function yt(E,y,z){if(i.bindRenderbuffer(i.RENDERBUFFER,E),y.depthBuffer){const J=y.depthTexture,at=J&&J.isDepthTexture?J.type:null,et=f(y.stencilBuffer,at),Ft=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=qt(y);ne(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_t,et,y.width,y.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,_t,et,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,et,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ft,i.RENDERBUFFER,E)}else{const J=y.textures;for(let at=0;at<J.length;at++){const et=J[at],Ft=r.convert(et.format,et.colorSpace),_t=r.convert(et.type),dt=T(et.internalFormat,Ft,_t,et.colorSpace),Vt=qt(y);z&&ne(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,dt,y.width,y.height):ne(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Vt,dt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,dt,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Y(E,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,E),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=n.get(y.depthTexture);J.__renderTarget=y,(!J.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),rt(y.depthTexture,0);const at=J.__webglTexture,et=qt(y);if(y.depthTexture.format===_s)ne(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0);else if(y.depthTexture.format===Es)ne(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function gt(E){const y=n.get(E),z=E.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==E.depthTexture){const J=E.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),J){const at=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,J.removeEventListener("dispose",at)};J.addEventListener("dispose",at),y.__depthDisposeCallback=at}y.__boundDepthTexture=J}if(E.depthTexture&&!y.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Y(y.__webglFramebuffer,E)}else if(z){y.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[J]),y.__webglDepthbuffer[J]===void 0)y.__webglDepthbuffer[J]=i.createRenderbuffer(),yt(y.__webglDepthbuffer[J],E,!1);else{const at=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=y.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,et)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),yt(y.__webglDepthbuffer,E,!1);else{const J=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,at),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,at)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Gt(E,y,z){const J=n.get(E);y!==void 0&&Lt(J.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&gt(E)}function ue(E){const y=E.texture,z=n.get(E),J=n.get(y);E.addEventListener("dispose",P);const at=E.textures,et=E.isWebGLCubeRenderTarget===!0,Ft=at.length>1;if(Ft||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=y.version,a.memory.textures++),et){z.__webglFramebuffer=[];for(let _t=0;_t<6;_t++)if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[_t]=[];for(let dt=0;dt<y.mipmaps.length;dt++)z.__webglFramebuffer[_t][dt]=i.createFramebuffer()}else z.__webglFramebuffer[_t]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let _t=0;_t<y.mipmaps.length;_t++)z.__webglFramebuffer[_t]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(Ft)for(let _t=0,dt=at.length;_t<dt;_t++){const Vt=n.get(at[_t]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&ne(E)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let _t=0;_t<at.length;_t++){const dt=at[_t];z.__webglColorRenderbuffer[_t]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[_t]);const Vt=r.convert(dt.format,dt.colorSpace),ot=r.convert(dt.type),Mt=T(dt.internalFormat,Vt,ot,dt.colorSpace,E.isXRRenderTarget===!0),Ct=qt(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,Mt,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,z.__webglColorRenderbuffer[_t])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),yt(z.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(et){e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),Qt(i.TEXTURE_CUBE_MAP,y);for(let _t=0;_t<6;_t++)if(y.mipmaps&&y.mipmaps.length>0)for(let dt=0;dt<y.mipmaps.length;dt++)Lt(z.__webglFramebuffer[_t][dt],E,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,dt);else Lt(z.__webglFramebuffer[_t],E,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0);g(y)&&m(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let _t=0,dt=at.length;_t<dt;_t++){const Vt=at[_t],ot=n.get(Vt);e.bindTexture(i.TEXTURE_2D,ot.__webglTexture),Qt(i.TEXTURE_2D,Vt),Lt(z.__webglFramebuffer,E,Vt,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,0),g(Vt)&&m(i.TEXTURE_2D)}e.unbindTexture()}else{let _t=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(_t=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(_t,J.__webglTexture),Qt(_t,y),y.mipmaps&&y.mipmaps.length>0)for(let dt=0;dt<y.mipmaps.length;dt++)Lt(z.__webglFramebuffer[dt],E,y,i.COLOR_ATTACHMENT0,_t,dt);else Lt(z.__webglFramebuffer,E,y,i.COLOR_ATTACHMENT0,_t,0);g(y)&&m(_t),e.unbindTexture()}E.depthBuffer&&gt(E)}function jt(E){const y=E.textures;for(let z=0,J=y.length;z<J;z++){const at=y[z];if(g(at)){const et=w(E),Ft=n.get(at).__webglTexture;e.bindTexture(et,Ft),m(et),e.unbindTexture()}}}const Pe=[],L=[];function Ve(E){if(E.samples>0){if(ne(E)===!1){const y=E.textures,z=E.width,J=E.height;let at=i.COLOR_BUFFER_BIT;const et=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ft=n.get(E),_t=y.length>1;if(_t)for(let dt=0;dt<y.length;dt++)e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let dt=0;dt<y.length;dt++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(at|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(at|=i.STENCIL_BUFFER_BIT)),_t){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[dt]);const Vt=n.get(y[dt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Vt,0)}i.blitFramebuffer(0,0,z,J,0,0,z,J,at,i.NEAREST),l===!0&&(Pe.length=0,L.length=0,Pe.push(i.COLOR_ATTACHMENT0+dt),E.depthBuffer&&E.resolveDepthBuffer===!1&&(Pe.push(et),L.push(et),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Pe))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),_t)for(let dt=0;dt<y.length;dt++){e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[dt]);const Vt=n.get(y[dt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.TEXTURE_2D,Vt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const y=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function qt(E){return Math.min(s.maxSamples,E.samples)}function ne(E){const y=n.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function kt(E){const y=a.render.frame;c.get(E)!==y&&(c.set(E,y),E.update())}function Se(E,y){const z=E.colorSpace,J=E.format,at=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||z!==Ts&&z!==Wn&&(he.getTransfer(z)===pe?(J!==wn||at!==Jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),y}function zt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(h.width=E.naturalWidth||E.width,h.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(h.width=E.displayWidth,h.height=E.displayHeight):(h.width=E.width,h.height=E.height),h}this.allocateTextureUnit=V,this.resetTextureUnits=q,this.setTexture2D=rt,this.setTexture2DArray=Z,this.setTexture3D=lt,this.setTextureCube=$,this.rebindTextures=Gt,this.setupRenderTarget=ue,this.updateRenderTargetMipmap=jt,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=gt,this.setupFrameBufferTexture=Lt,this.useMultisampledRTT=ne}function Cg(i,t){function e(n,s=Wn){let r;const a=he.getTransfer(s);if(n===Jn)return i.UNSIGNED_BYTE;if(n===el)return i.UNSIGNED_SHORT_4_4_4_4;if(n===nl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===lh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ah)return i.BYTE;if(n===oh)return i.SHORT;if(n===er)return i.UNSIGNED_SHORT;if(n===tl)return i.INT;if(n===Fi)return i.UNSIGNED_INT;if(n===In)return i.FLOAT;if(n===Un)return i.HALF_FLOAT;if(n===ch)return i.ALPHA;if(n===hh)return i.RGB;if(n===wn)return i.RGBA;if(n===uh)return i.LUMINANCE;if(n===dh)return i.LUMINANCE_ALPHA;if(n===_s)return i.DEPTH_COMPONENT;if(n===Es)return i.DEPTH_STENCIL;if(n===il)return i.RED;if(n===sl)return i.RED_INTEGER;if(n===fh)return i.RG;if(n===rl)return i.RG_INTEGER;if(n===al)return i.RGBA_INTEGER;if(n===Hr||n===Vr||n===Wr||n===Xr)if(a===pe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Hr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Hr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Xr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===vo||n===yo||n===Mo||n===So)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===vo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===yo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Mo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===So)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===xo||n===bo||n===Eo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===xo||n===bo)return a===pe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Eo)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===To||n===wo||n===Ao||n===Co||n===Ro||n===Po||n===Do||n===Lo||n===Io||n===Uo||n===No||n===Oo||n===Fo||n===Bo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===To)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===wo)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ao)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Co)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ro)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Po)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Do)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Lo)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Io)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Uo)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===No)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Oo)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fo)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Bo)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===qr||n===ko||n===zo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===qr)return a===pe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ko)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===zo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ph||n===Go||n===Ho||n===Vo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===qr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Go)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ho)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Vo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===bs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Rg={type:"move"};class Ja{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,n),m=this._getHandJoint(h,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const c=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],d=c.position.distanceTo(u.position),p=.02,_=.005;h.inputState.pinching&&d>p+_?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&d<=p-_&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Rg)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ie;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Pg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Dg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Lg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new je,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Re({vertexShader:Pg,fragmentShader:Dg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new At(new Gi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ig extends Bi{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,h=null,c=null,u=null,d=null,p=null,_=null;const v=new Lg,g=e.getContextAttributes();let m=null,w=null;const T=[],f=[],D=new ut;let R=null;const P=new un;P.viewport=new Me;const I=new un;I.viewport=new Me;const x=[P,I],S=new jd;let U=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(nt){let mt=T[nt];return mt===void 0&&(mt=new Ja,T[nt]=mt),mt.getTargetRaySpace()},this.getControllerGrip=function(nt){let mt=T[nt];return mt===void 0&&(mt=new Ja,T[nt]=mt),mt.getGripSpace()},this.getHand=function(nt){let mt=T[nt];return mt===void 0&&(mt=new Ja,T[nt]=mt),mt.getHandSpace()};function V(nt){const mt=f.indexOf(nt.inputSource);if(mt===-1)return;const Lt=T[mt];Lt!==void 0&&(Lt.update(nt.inputSource,nt.frame,h||a),Lt.dispatchEvent({type:nt.type,data:nt.inputSource}))}function tt(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",tt),s.removeEventListener("inputsourceschange",rt);for(let nt=0;nt<T.length;nt++){const mt=f[nt];mt!==null&&(f[nt]=null,T[nt].disconnect(mt))}U=null,q=null,v.reset(),t.setRenderTarget(m),p=null,d=null,u=null,s=null,w=null,de.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(nt){r=nt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(nt){o=nt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(nt){h=nt},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(nt){if(s=nt,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",tt),s.addEventListener("inputsourceschange",rt),g.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(D),s.renderState.layers===void 0){const mt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,mt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),w=new Mn(p.framebufferWidth,p.framebufferHeight,{format:wn,type:Jn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let mt=null,Lt=null,yt=null;g.depth&&(yt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,mt=g.stencil?Es:_s,Lt=g.stencil?bs:Fi);const Y={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Y),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),w=new Mn(d.textureWidth,d.textureHeight,{format:wn,type:Jn,depthTexture:new Lh(d.textureWidth,d.textureHeight,Lt,void 0,void 0,void 0,void 0,void 0,void 0,mt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),h=null,a=await s.requestReferenceSpace(o),de.setContext(s),de.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function rt(nt){for(let mt=0;mt<nt.removed.length;mt++){const Lt=nt.removed[mt],yt=f.indexOf(Lt);yt>=0&&(f[yt]=null,T[yt].disconnect(Lt))}for(let mt=0;mt<nt.added.length;mt++){const Lt=nt.added[mt];let yt=f.indexOf(Lt);if(yt===-1){for(let gt=0;gt<T.length;gt++)if(gt>=f.length){f.push(Lt),yt=gt;break}else if(f[gt]===null){f[gt]=Lt,yt=gt;break}if(yt===-1)break}const Y=T[yt];Y&&Y.connect(Lt)}}const Z=new C,lt=new C;function $(nt,mt,Lt){Z.setFromMatrixPosition(mt.matrixWorld),lt.setFromMatrixPosition(Lt.matrixWorld);const yt=Z.distanceTo(lt),Y=mt.projectionMatrix.elements,gt=Lt.projectionMatrix.elements,Gt=Y[14]/(Y[10]-1),ue=Y[14]/(Y[10]+1),jt=(Y[9]+1)/Y[5],Pe=(Y[9]-1)/Y[5],L=(Y[8]-1)/Y[0],Ve=(gt[8]+1)/gt[0],qt=Gt*L,ne=Gt*Ve,kt=yt/(-L+Ve),Se=kt*-L;if(mt.matrixWorld.decompose(nt.position,nt.quaternion,nt.scale),nt.translateX(Se),nt.translateZ(kt),nt.matrixWorld.compose(nt.position,nt.quaternion,nt.scale),nt.matrixWorldInverse.copy(nt.matrixWorld).invert(),Y[10]===-1)nt.projectionMatrix.copy(mt.projectionMatrix),nt.projectionMatrixInverse.copy(mt.projectionMatrixInverse);else{const zt=Gt+kt,E=ue+kt,y=qt-Se,z=ne+(yt-Se),J=jt*ue/E*zt,at=Pe*ue/E*zt;nt.projectionMatrix.makePerspective(y,z,J,at,zt,E),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert()}}function xt(nt,mt){mt===null?nt.matrixWorld.copy(nt.matrix):nt.matrixWorld.multiplyMatrices(mt.matrixWorld,nt.matrix),nt.matrixWorldInverse.copy(nt.matrixWorld).invert()}this.updateCamera=function(nt){if(s===null)return;let mt=nt.near,Lt=nt.far;v.texture!==null&&(v.depthNear>0&&(mt=v.depthNear),v.depthFar>0&&(Lt=v.depthFar)),S.near=I.near=P.near=mt,S.far=I.far=P.far=Lt,(U!==S.near||q!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),U=S.near,q=S.far),P.layers.mask=nt.layers.mask|2,I.layers.mask=nt.layers.mask|4,S.layers.mask=P.layers.mask|I.layers.mask;const yt=nt.parent,Y=S.cameras;xt(S,yt);for(let gt=0;gt<Y.length;gt++)xt(Y[gt],yt);Y.length===2?$(S,P,I):S.projectionMatrix.copy(P.projectionMatrix),bt(nt,S,yt)};function bt(nt,mt,Lt){Lt===null?nt.matrix.copy(mt.matrixWorld):(nt.matrix.copy(Lt.matrixWorld),nt.matrix.invert(),nt.matrix.multiply(mt.matrixWorld)),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.updateMatrixWorld(!0),nt.projectionMatrix.copy(mt.projectionMatrix),nt.projectionMatrixInverse.copy(mt.projectionMatrixInverse),nt.isPerspectiveCamera&&(nt.fov=nr*2*Math.atan(1/nt.projectionMatrix.elements[5]),nt.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(nt){l=nt,d!==null&&(d.fixedFoveation=nt),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=nt)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let Bt=null;function Qt(nt,mt){if(c=mt.getViewerPose(h||a),_=mt,c!==null){const Lt=c.views;p!==null&&(t.setRenderTargetFramebuffer(w,p.framebuffer),t.setRenderTarget(w));let yt=!1;Lt.length!==S.cameras.length&&(S.cameras.length=0,yt=!0);for(let gt=0;gt<Lt.length;gt++){const Gt=Lt[gt];let ue=null;if(p!==null)ue=p.getViewport(Gt);else{const Pe=u.getViewSubImage(d,Gt);ue=Pe.viewport,gt===0&&(t.setRenderTargetTextures(w,Pe.colorTexture,d.ignoreDepthValues?void 0:Pe.depthStencilTexture),t.setRenderTarget(w))}let jt=x[gt];jt===void 0&&(jt=new un,jt.layers.enable(gt),jt.viewport=new Me,x[gt]=jt),jt.matrix.fromArray(Gt.transform.matrix),jt.matrix.decompose(jt.position,jt.quaternion,jt.scale),jt.projectionMatrix.fromArray(Gt.projectionMatrix),jt.projectionMatrixInverse.copy(jt.projectionMatrix).invert(),jt.viewport.set(ue.x,ue.y,ue.width,ue.height),gt===0&&(S.matrix.copy(jt.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),yt===!0&&S.cameras.push(jt)}const Y=s.enabledFeatures;if(Y&&Y.includes("depth-sensing")){const gt=u.getDepthInformation(Lt[0]);gt&&gt.isValid&&gt.texture&&v.init(t,gt,s.renderState)}}for(let Lt=0;Lt<T.length;Lt++){const yt=f[Lt],Y=T[Lt];yt!==null&&Y!==void 0&&Y.update(yt,mt,h||a)}Bt&&Bt(nt,mt),mt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:mt}),_=null}const de=new Bh;de.setAnimationLoop(Qt),this.setAnimationLoop=function(nt){Bt=nt},this.dispose=function(){}}}const Ai=new Nn,Ug=new ce;function Ng(i,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,bh(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,w,T,f){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),c(g,m)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&p(g,m,f)):m.isMeshMatcapMaterial?(r(g,m),_(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),v(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,w,T):m.isSpriteMaterial?h(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===sn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===sn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const w=t.get(m),T=w.envMap,f=w.envMapRotation;T&&(g.envMap.value=T,Ai.copy(f),Ai.x*=-1,Ai.y*=-1,Ai.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Ai.y*=-1,Ai.z*=-1),g.envMapRotation.value.setFromMatrix4(Ug.makeRotationFromEuler(Ai)),g.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,w,T){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*w,g.scale.value=T*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function p(g,m,w){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===sn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=w.texture,g.transmissionSamplerSize.value.set(w.width,w.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function _(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const w=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(w.matrixWorld),g.nearDistance.value=w.shadow.camera.near,g.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Og(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,T){const f=T.program;n.uniformBlockBinding(w,f)}function h(w,T){let f=s[w.id];f===void 0&&(_(w),f=c(w),s[w.id]=f,w.addEventListener("dispose",g));const D=T.program;n.updateUBOMapping(w,D);const R=t.render.frame;r[w.id]!==R&&(d(w),r[w.id]=R)}function c(w){const T=u();w.__bindingPointIndex=T;const f=i.createBuffer(),D=w.__size,R=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,f),i.bufferData(i.UNIFORM_BUFFER,D,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,f),f}function u(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const T=s[w.id],f=w.uniforms,D=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let R=0,P=f.length;R<P;R++){const I=Array.isArray(f[R])?f[R]:[f[R]];for(let x=0,S=I.length;x<S;x++){const U=I[x];if(p(U,R,x,D)===!0){const q=U.__offset,V=Array.isArray(U.value)?U.value:[U.value];let tt=0;for(let rt=0;rt<V.length;rt++){const Z=V[rt],lt=v(Z);typeof Z=="number"||typeof Z=="boolean"?(U.__data[0]=Z,i.bufferSubData(i.UNIFORM_BUFFER,q+tt,U.__data)):Z.isMatrix3?(U.__data[0]=Z.elements[0],U.__data[1]=Z.elements[1],U.__data[2]=Z.elements[2],U.__data[3]=0,U.__data[4]=Z.elements[3],U.__data[5]=Z.elements[4],U.__data[6]=Z.elements[5],U.__data[7]=0,U.__data[8]=Z.elements[6],U.__data[9]=Z.elements[7],U.__data[10]=Z.elements[8],U.__data[11]=0):(Z.toArray(U.__data,tt),tt+=lt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,q,U.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(w,T,f,D){const R=w.value,P=T+"_"+f;if(D[P]===void 0)return typeof R=="number"||typeof R=="boolean"?D[P]=R:D[P]=R.clone(),!0;{const I=D[P];if(typeof R=="number"||typeof R=="boolean"){if(I!==R)return D[P]=R,!0}else if(I.equals(R)===!1)return I.copy(R),!0}return!1}function _(w){const T=w.uniforms;let f=0;const D=16;for(let P=0,I=T.length;P<I;P++){const x=Array.isArray(T[P])?T[P]:[T[P]];for(let S=0,U=x.length;S<U;S++){const q=x[S],V=Array.isArray(q.value)?q.value:[q.value];for(let tt=0,rt=V.length;tt<rt;tt++){const Z=V[tt],lt=v(Z),$=f%D,xt=$%lt.boundary,bt=$+xt;f+=xt,bt!==0&&D-bt<lt.storage&&(f+=D-bt),q.__data=new Float32Array(lt.storage/Float32Array.BYTES_PER_ELEMENT),q.__offset=f,f+=lt.storage}}}const R=f%D;return R>0&&(f+=D-R),w.__size=f,w.__cache={},this}function v(w){const T={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(T.boundary=4,T.storage=4):w.isVector2?(T.boundary=8,T.storage=8):w.isVector3||w.isColor?(T.boundary=16,T.storage=12):w.isVector4?(T.boundary=16,T.storage=16):w.isMatrix3?(T.boundary=48,T.storage=48):w.isMatrix4?(T.boundary=64,T.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),T}function g(w){const T=w.target;T.removeEventListener("dispose",g);const f=a.indexOf(T.__bindingPointIndex);a.splice(f,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function m(){for(const w in s)i.deleteBuffer(s[w]);a=[],s={},r={}}return{bind:l,update:h,dispose:m}}class Fg{constructor(t={}){const{canvas:e=ju(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const _=new Uint32Array(4),v=new Int32Array(4);let g=null,m=null;const w=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=en,this.toneMapping=fi,this.toneMappingExposure=1;const f=this;let D=!1,R=0,P=0,I=null,x=-1,S=null;const U=new Me,q=new Me;let V=null;const tt=new Rt(0);let rt=0,Z=e.width,lt=e.height,$=1,xt=null,bt=null;const Bt=new Me(0,0,Z,lt),Qt=new Me(0,0,Z,lt);let de=!1;const nt=new ul;let mt=!1,Lt=!1;const yt=new ce,Y=new ce,gt=new C,Gt=new Me,ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let jt=!1;function Pe(){return I===null?$:1}let L=n;function Ve(M,F){return e.getContext(M,F)}try{const M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Jo}`),e.addEventListener("webglcontextlost",Q,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",Et,!1),L===null){const F="webgl2";if(L=Ve(F,M),L===null)throw Ve(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let qt,ne,kt,Se,zt,E,y,z,J,at,et,Ft,_t,dt,Vt,ot,Mt,Ct,It,Pt,le,Yt,_e,O;function pt(){qt=new q0(L),qt.init(),Yt=new Cg(L,qt),ne=new z0(L,qt,t,Yt),kt=new wg(L,qt),ne.reverseDepthBuffer&&d&&kt.buffers.depth.setReversed(!0),Se=new K0(L),zt=new fg,E=new Ag(L,qt,kt,zt,ne,Yt,Se),y=new H0(f),z=new X0(f),J=new ef(L),_e=new B0(L,J),at=new Y0(L,J,Se,_e),et=new Z0(L,at,J,Se),It=new j0(L,ne,E),ot=new G0(zt),Ft=new dg(f,y,z,qt,ne,_e,ot),_t=new Ng(f,zt),dt=new mg,Vt=new Sg(qt),Ct=new F0(f,y,z,kt,et,p,l),Mt=new Eg(f,et,ne),O=new Og(L,Se,ne,kt),Pt=new k0(L,qt,Se),le=new $0(L,qt,Se),Se.programs=Ft.programs,f.capabilities=ne,f.extensions=qt,f.properties=zt,f.renderLists=dt,f.shadowMap=Mt,f.state=kt,f.info=Se}pt();const X=new Ig(f,L);this.xr=X,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const M=qt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=qt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(M){M!==void 0&&($=M,this.setSize(Z,lt,!1))},this.getSize=function(M){return M.set(Z,lt)},this.setSize=function(M,F,H=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=M,lt=F,e.width=Math.floor(M*$),e.height=Math.floor(F*$),H===!0&&(e.style.width=M+"px",e.style.height=F+"px"),this.setViewport(0,0,M,F)},this.getDrawingBufferSize=function(M){return M.set(Z*$,lt*$).floor()},this.setDrawingBufferSize=function(M,F,H){Z=M,lt=F,$=H,e.width=Math.floor(M*H),e.height=Math.floor(F*H),this.setViewport(0,0,M,F)},this.getCurrentViewport=function(M){return M.copy(U)},this.getViewport=function(M){return M.copy(Bt)},this.setViewport=function(M,F,H,G){M.isVector4?Bt.set(M.x,M.y,M.z,M.w):Bt.set(M,F,H,G),kt.viewport(U.copy(Bt).multiplyScalar($).round())},this.getScissor=function(M){return M.copy(Qt)},this.setScissor=function(M,F,H,G){M.isVector4?Qt.set(M.x,M.y,M.z,M.w):Qt.set(M,F,H,G),kt.scissor(q.copy(Qt).multiplyScalar($).round())},this.getScissorTest=function(){return de},this.setScissorTest=function(M){kt.setScissorTest(de=M)},this.setOpaqueSort=function(M){xt=M},this.setTransparentSort=function(M){bt=M},this.getClearColor=function(M){return M.copy(Ct.getClearColor())},this.setClearColor=function(){Ct.setClearColor.apply(Ct,arguments)},this.getClearAlpha=function(){return Ct.getClearAlpha()},this.setClearAlpha=function(){Ct.setClearAlpha.apply(Ct,arguments)},this.clear=function(M=!0,F=!0,H=!0){let G=0;if(M){let k=!1;if(I!==null){const ct=I.texture.format;k=ct===al||ct===rl||ct===sl}if(k){const ct=I.texture.type,Tt=ct===Jn||ct===Fi||ct===er||ct===bs||ct===el||ct===nl,b=Ct.getClearColor(),N=Ct.getClearAlpha(),B=b.r,W=b.g,j=b.b;Tt?(_[0]=B,_[1]=W,_[2]=j,_[3]=N,L.clearBufferuiv(L.COLOR,0,_)):(v[0]=B,v[1]=W,v[2]=j,v[3]=N,L.clearBufferiv(L.COLOR,0,v))}else G|=L.COLOR_BUFFER_BIT}F&&(G|=L.DEPTH_BUFFER_BIT),H&&(G|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Q,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",Et,!1),Ct.dispose(),dt.dispose(),Vt.dispose(),zt.dispose(),y.dispose(),z.dispose(),et.dispose(),_e.dispose(),O.dispose(),Ft.dispose(),X.dispose(),X.removeEventListener("sessionstart",Mi),X.removeEventListener("sessionend",ti),Ze.stop()};function Q(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const M=Se.autoReset,F=Mt.enabled,H=Mt.autoUpdate,G=Mt.needsUpdate,k=Mt.type;pt(),Se.autoReset=M,Mt.enabled=F,Mt.autoUpdate=H,Mt.needsUpdate=G,Mt.type=k}function Et(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Ot(M){const F=M.target;F.removeEventListener("dispose",Ot),Zt(F)}function Zt(M){we(M),zt.remove(M)}function we(M){const F=zt.get(M).programs;F!==void 0&&(F.forEach(function(H){Ft.releaseProgram(H)}),M.isShaderMaterial&&Ft.releaseShaderCache(M))}this.renderBufferDirect=function(M,F,H,G,k,ct){F===null&&(F=ue);const Tt=k.isMesh&&k.matrixWorld.determinant()<0,b=or(M,F,H,G,k);kt.setMaterial(G,Tt);let N=H.index,B=1;if(G.wireframe===!0){if(N=at.getWireframeAttribute(H),N===void 0)return;B=2}const W=H.drawRange,j=H.attributes.position;let it=W.start*B,ht=(W.start+W.count)*B;ct!==null&&(it=Math.max(it,ct.start*B),ht=Math.min(ht,(ct.start+ct.count)*B)),N!==null?(it=Math.max(it,0),ht=Math.min(ht,N.count)):j!=null&&(it=Math.max(it,0),ht=Math.min(ht,j.count));const Ut=ht-it;if(Ut<0||Ut===1/0)return;_e.setup(k,G,b,H,N);let Ht,wt=Pt;if(N!==null&&(Ht=J.get(N),wt=le,wt.setIndex(Ht)),k.isMesh)G.wireframe===!0?(kt.setLineWidth(G.wireframeLinewidth*Pe()),wt.setMode(L.LINES)):wt.setMode(L.TRIANGLES);else if(k.isLine){let vt=G.linewidth;vt===void 0&&(vt=1),kt.setLineWidth(vt*Pe()),k.isLineSegments?wt.setMode(L.LINES):k.isLineLoop?wt.setMode(L.LINE_LOOP):wt.setMode(L.LINE_STRIP)}else k.isPoints?wt.setMode(L.POINTS):k.isSprite&&wt.setMode(L.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)wt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(qt.get("WEBGL_multi_draw"))wt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const vt=k._multiDrawStarts,Xt=k._multiDrawCounts,st=k._multiDrawCount,re=N?J.get(N).bytesPerElement:1,xe=zt.get(G).currentProgram.getUniforms();for(let Ae=0;Ae<st;Ae++)xe.setValue(L,"_gl_DrawID",Ae),wt.render(vt[Ae]/re,Xt[Ae])}else if(k.isInstancedMesh)wt.renderInstances(it,Ut,k.count);else if(H.isInstancedBufferGeometry){const vt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Xt=Math.min(H.instanceCount,vt);wt.renderInstances(it,Ut,Xt)}else wt.render(it,Ut)};function te(M,F,H){M.transparent===!0&&M.side===nn&&M.forceSinglePass===!1?(M.side=sn,M.needsUpdate=!0,Wi(M,F,H),M.side=vi,M.needsUpdate=!0,Wi(M,F,H),M.side=nn):Wi(M,F,H)}this.compile=function(M,F,H=null){H===null&&(H=M),m=Vt.get(H),m.init(F),T.push(m),H.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),M!==H&&M.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),m.setupLights();const G=new Set;return M.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ct=k.material;if(ct)if(Array.isArray(ct))for(let Tt=0;Tt<ct.length;Tt++){const b=ct[Tt];te(b,H,k),G.add(b)}else te(ct,H,k),G.add(ct)}),T.pop(),m=null,G},this.compileAsync=function(M,F,H=null){const G=this.compile(M,F,H);return new Promise(k=>{function ct(){if(G.forEach(function(Tt){zt.get(Tt).currentProgram.isReady()&&G.delete(Tt)}),G.size===0){k(M);return}setTimeout(ct,10)}qt.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let Ie=null;function We(M){Ie&&Ie(M)}function Mi(){Ze.stop()}function ti(){Ze.start()}const Ze=new Bh;Ze.setAnimationLoop(We),typeof self<"u"&&Ze.setContext(self),this.setAnimationLoop=function(M){Ie=M,X.setAnimationLoop(M),M===null?Ze.stop():Ze.start()},X.addEventListener("sessionstart",Mi),X.addEventListener("sessionend",ti),this.render=function(M,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(F),F=X.getCamera()),M.isScene===!0&&M.onBeforeRender(f,M,F,I),m=Vt.get(M,T.length),m.init(F),T.push(m),Y.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),nt.setFromProjectionMatrix(Y),Lt=this.localClippingEnabled,mt=ot.init(this.clippingPlanes,Lt),g=dt.get(M,w.length),g.init(),w.push(g),X.enabled===!0&&X.isPresenting===!0){const ct=f.xr.getDepthSensingMesh();ct!==null&&Hi(ct,F,-1/0,f.sortObjects)}Hi(M,F,0,f.sortObjects),g.finish(),f.sortObjects===!0&&g.sort(xt,bt),jt=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,jt&&Ct.addToRenderList(g,M),this.info.render.frame++,mt===!0&&ot.beginShadows();const H=m.state.shadowsArray;Mt.render(H,M,F),mt===!0&&ot.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=g.opaque,k=g.transmissive;if(m.setupLights(),F.isArrayCamera){const ct=F.cameras;if(k.length>0)for(let Tt=0,b=ct.length;Tt<b;Tt++){const N=ct[Tt];Vi(G,k,M,N)}jt&&Ct.render(M);for(let Tt=0,b=ct.length;Tt<b;Tt++){const N=ct[Tt];Ds(g,M,N,N.viewport)}}else k.length>0&&Vi(G,k,M,F),jt&&Ct.render(M),Ds(g,M,F);I!==null&&(E.updateMultisampleRenderTarget(I),E.updateRenderTargetMipmap(I)),M.isScene===!0&&M.onAfterRender(f,M,F),_e.resetDefaultState(),x=-1,S=null,T.pop(),T.length>0?(m=T[T.length-1],mt===!0&&ot.setGlobalState(f.clippingPlanes,m.state.camera)):m=null,w.pop(),w.length>0?g=w[w.length-1]:g=null};function Hi(M,F,H,G){if(M.visible===!1)return;if(M.layers.test(F.layers)){if(M.isGroup)H=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(F);else if(M.isLight)m.pushLight(M),M.castShadow&&m.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||nt.intersectsSprite(M)){G&&Gt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Y);const Tt=et.update(M),b=M.material;b.visible&&g.push(M,Tt,b,H,Gt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||nt.intersectsObject(M))){const Tt=et.update(M),b=M.material;if(G&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Gt.copy(M.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Gt.copy(Tt.boundingSphere.center)),Gt.applyMatrix4(M.matrixWorld).applyMatrix4(Y)),Array.isArray(b)){const N=Tt.groups;for(let B=0,W=N.length;B<W;B++){const j=N[B],it=b[j.materialIndex];it&&it.visible&&g.push(M,Tt,it,H,Gt.z,j)}}else b.visible&&g.push(M,Tt,b,H,Gt.z,null)}}const ct=M.children;for(let Tt=0,b=ct.length;Tt<b;Tt++)Hi(ct[Tt],F,H,G)}function Ds(M,F,H,G){const k=M.opaque,ct=M.transmissive,Tt=M.transparent;m.setupLightsView(H),mt===!0&&ot.setGlobalState(f.clippingPlanes,H),G&&kt.viewport(U.copy(G)),k.length>0&&ei(k,F,H),ct.length>0&&ei(ct,F,H),Tt.length>0&&ei(Tt,F,H),kt.buffers.depth.setTest(!0),kt.buffers.depth.setMask(!0),kt.buffers.color.setMask(!0),kt.setPolygonOffset(!1)}function Vi(M,F,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[G.id]===void 0&&(m.state.transmissionRenderTarget[G.id]=new Mn(1,1,{generateMipmaps:!0,type:qt.has("EXT_color_buffer_half_float")||qt.has("EXT_color_buffer_float")?Un:Jn,minFilter:Ui,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:he.workingColorSpace}));const ct=m.state.transmissionRenderTarget[G.id],Tt=G.viewport||U;ct.setSize(Tt.z,Tt.w);const b=f.getRenderTarget();f.setRenderTarget(ct),f.getClearColor(tt),rt=f.getClearAlpha(),rt<1&&f.setClearColor(16777215,.5),f.clear(),jt&&Ct.render(H);const N=f.toneMapping;f.toneMapping=fi;const B=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),m.setupLightsView(G),mt===!0&&ot.setGlobalState(f.clippingPlanes,G),ei(M,H,G),E.updateMultisampleRenderTarget(ct),E.updateRenderTargetMipmap(ct),qt.has("WEBGL_multisampled_render_to_texture")===!1){let W=!1;for(let j=0,it=F.length;j<it;j++){const ht=F[j],Ut=ht.object,Ht=ht.geometry,wt=ht.material,vt=ht.group;if(wt.side===nn&&Ut.layers.test(G.layers)){const Xt=wt.side;wt.side=sn,wt.needsUpdate=!0,ar(Ut,H,G,Ht,wt,vt),wt.side=Xt,wt.needsUpdate=!0,W=!0}}W===!0&&(E.updateMultisampleRenderTarget(ct),E.updateRenderTargetMipmap(ct))}f.setRenderTarget(b),f.setClearColor(tt,rt),B!==void 0&&(G.viewport=B),f.toneMapping=N}function ei(M,F,H){const G=F.isScene===!0?F.overrideMaterial:null;for(let k=0,ct=M.length;k<ct;k++){const Tt=M[k],b=Tt.object,N=Tt.geometry,B=G===null?Tt.material:G,W=Tt.group;b.layers.test(H.layers)&&ar(b,F,H,N,B,W)}}function ar(M,F,H,G,k,ct){M.onBeforeRender(f,F,H,G,k,ct),M.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),k.onBeforeRender(f,F,H,G,M,ct),k.transparent===!0&&k.side===nn&&k.forceSinglePass===!1?(k.side=sn,k.needsUpdate=!0,f.renderBufferDirect(H,F,G,k,M,ct),k.side=vi,k.needsUpdate=!0,f.renderBufferDirect(H,F,G,k,M,ct),k.side=nn):f.renderBufferDirect(H,F,G,k,M,ct),M.onAfterRender(f,F,H,G,k,ct)}function Wi(M,F,H){F.isScene!==!0&&(F=ue);const G=zt.get(M),k=m.state.lights,ct=m.state.shadowsArray,Tt=k.state.version,b=Ft.getParameters(M,k.state,ct,F,H),N=Ft.getProgramCacheKey(b);let B=G.programs;G.environment=M.isMeshStandardMaterial?F.environment:null,G.fog=F.fog,G.envMap=(M.isMeshStandardMaterial?z:y).get(M.envMap||G.environment),G.envMapRotation=G.environment!==null&&M.envMap===null?F.environmentRotation:M.envMapRotation,B===void 0&&(M.addEventListener("dispose",Ot),B=new Map,G.programs=B);let W=B.get(N);if(W!==void 0){if(G.currentProgram===W&&G.lightsStateVersion===Tt)return ni(M,b),W}else b.uniforms=Ft.getUniforms(M),M.onBeforeCompile(b,f),W=Ft.acquireProgram(b,N),B.set(N,W),G.uniforms=b.uniforms;const j=G.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(j.clippingPlanes=ot.uniform),ni(M,b),G.needsLights=pa(M),G.lightsStateVersion=Tt,G.needsLights&&(j.ambientLightColor.value=k.state.ambient,j.lightProbe.value=k.state.probe,j.directionalLights.value=k.state.directional,j.directionalLightShadows.value=k.state.directionalShadow,j.spotLights.value=k.state.spot,j.spotLightShadows.value=k.state.spotShadow,j.rectAreaLights.value=k.state.rectArea,j.ltc_1.value=k.state.rectAreaLTC1,j.ltc_2.value=k.state.rectAreaLTC2,j.pointLights.value=k.state.point,j.pointLightShadows.value=k.state.pointShadow,j.hemisphereLights.value=k.state.hemi,j.directionalShadowMap.value=k.state.directionalShadowMap,j.directionalShadowMatrix.value=k.state.directionalShadowMatrix,j.spotShadowMap.value=k.state.spotShadowMap,j.spotLightMatrix.value=k.state.spotLightMatrix,j.spotLightMap.value=k.state.spotLightMap,j.pointShadowMap.value=k.state.pointShadowMap,j.pointShadowMatrix.value=k.state.pointShadowMatrix),G.currentProgram=W,G.uniformsList=null,W}function Xe(M){if(M.uniformsList===null){const F=M.currentProgram.getUniforms();M.uniformsList=$r.seqWithValue(F.seq,M.uniforms)}return M.uniformsList}function ni(M,F){const H=zt.get(M);H.outputColorSpace=F.outputColorSpace,H.batching=F.batching,H.batchingColor=F.batchingColor,H.instancing=F.instancing,H.instancingColor=F.instancingColor,H.instancingMorph=F.instancingMorph,H.skinning=F.skinning,H.morphTargets=F.morphTargets,H.morphNormals=F.morphNormals,H.morphColors=F.morphColors,H.morphTargetsCount=F.morphTargetsCount,H.numClippingPlanes=F.numClippingPlanes,H.numIntersection=F.numClipIntersection,H.vertexAlphas=F.vertexAlphas,H.vertexTangents=F.vertexTangents,H.toneMapping=F.toneMapping}function or(M,F,H,G,k){F.isScene!==!0&&(F=ue),E.resetTextureUnits();const ct=F.fog,Tt=G.isMeshStandardMaterial?F.environment:null,b=I===null?f.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Ts,N=(G.isMeshStandardMaterial?z:y).get(G.envMap||Tt),B=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,W=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),j=!!H.morphAttributes.position,it=!!H.morphAttributes.normal,ht=!!H.morphAttributes.color;let Ut=fi;G.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Ut=f.toneMapping);const Ht=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,wt=Ht!==void 0?Ht.length:0,vt=zt.get(G),Xt=m.state.lights;if(mt===!0&&(Lt===!0||M!==S)){const Be=M===S&&G.id===x;ot.setState(G,M,Be)}let st=!1;G.version===vt.__version?(vt.needsLights&&vt.lightsStateVersion!==Xt.state.version||vt.outputColorSpace!==b||k.isBatchedMesh&&vt.batching===!1||!k.isBatchedMesh&&vt.batching===!0||k.isBatchedMesh&&vt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&vt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&vt.instancing===!1||!k.isInstancedMesh&&vt.instancing===!0||k.isSkinnedMesh&&vt.skinning===!1||!k.isSkinnedMesh&&vt.skinning===!0||k.isInstancedMesh&&vt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&vt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&vt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&vt.instancingMorph===!1&&k.morphTexture!==null||vt.envMap!==N||G.fog===!0&&vt.fog!==ct||vt.numClippingPlanes!==void 0&&(vt.numClippingPlanes!==ot.numPlanes||vt.numIntersection!==ot.numIntersection)||vt.vertexAlphas!==B||vt.vertexTangents!==W||vt.morphTargets!==j||vt.morphNormals!==it||vt.morphColors!==ht||vt.toneMapping!==Ut||vt.morphTargetsCount!==wt)&&(st=!0):(st=!0,vt.__version=G.version);let re=vt.currentProgram;st===!0&&(re=Wi(G,F,k));let xe=!1,Ae=!1,ln=!1;const ve=re.getUniforms(),Ne=vt.uniforms;if(kt.useProgram(re.program)&&(xe=!0,Ae=!0,ln=!0),G.id!==x&&(x=G.id,Ae=!0),xe||S!==M){kt.buffers.depth.getReversed()?(yt.copy(M.projectionMatrix),Ju(yt),Qu(yt),ve.setValue(L,"projectionMatrix",yt)):ve.setValue(L,"projectionMatrix",M.projectionMatrix),ve.setValue(L,"viewMatrix",M.matrixWorldInverse);const rn=ve.map.cameraPosition;rn!==void 0&&rn.setValue(L,gt.setFromMatrixPosition(M.matrixWorld)),ne.logarithmicDepthBuffer&&ve.setValue(L,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ve.setValue(L,"isOrthographic",M.isOrthographicCamera===!0),S!==M&&(S=M,Ae=!0,ln=!0)}if(k.isSkinnedMesh){ve.setOptional(L,k,"bindMatrix"),ve.setOptional(L,k,"bindMatrixInverse");const Be=k.skeleton;Be&&(Be.boneTexture===null&&Be.computeBoneTexture(),ve.setValue(L,"boneTexture",Be.boneTexture,E))}k.isBatchedMesh&&(ve.setOptional(L,k,"batchingTexture"),ve.setValue(L,"batchingTexture",k._matricesTexture,E),ve.setOptional(L,k,"batchingIdTexture"),ve.setValue(L,"batchingIdTexture",k._indirectTexture,E),ve.setOptional(L,k,"batchingColorTexture"),k._colorsTexture!==null&&ve.setValue(L,"batchingColorTexture",k._colorsTexture,E));const qe=H.morphAttributes;if((qe.position!==void 0||qe.normal!==void 0||qe.color!==void 0)&&It.update(k,H,re),(Ae||vt.receiveShadow!==k.receiveShadow)&&(vt.receiveShadow=k.receiveShadow,ve.setValue(L,"receiveShadow",k.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Ne.envMap.value=N,Ne.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&F.environment!==null&&(Ne.envMapIntensity.value=F.environmentIntensity),Ae&&(ve.setValue(L,"toneMappingExposure",f.toneMappingExposure),vt.needsLights&&fa(Ne,ln),ct&&G.fog===!0&&_t.refreshFogUniforms(Ne,ct),_t.refreshMaterialUniforms(Ne,G,$,lt,m.state.transmissionRenderTarget[M.id]),$r.upload(L,Xe(vt),Ne,E)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&($r.upload(L,Xe(vt),Ne,E),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ve.setValue(L,"center",k.center),ve.setValue(L,"modelViewMatrix",k.modelViewMatrix),ve.setValue(L,"normalMatrix",k.normalMatrix),ve.setValue(L,"modelMatrix",k.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Be=G.uniformsGroups;for(let rn=0,_a=Be.length;rn<_a;rn++){const Si=Be[rn];O.update(Si,re),O.bind(Si,re)}}return re}function fa(M,F){M.ambientLightColor.needsUpdate=F,M.lightProbe.needsUpdate=F,M.directionalLights.needsUpdate=F,M.directionalLightShadows.needsUpdate=F,M.pointLights.needsUpdate=F,M.pointLightShadows.needsUpdate=F,M.spotLights.needsUpdate=F,M.spotLightShadows.needsUpdate=F,M.rectAreaLights.needsUpdate=F,M.hemisphereLights.needsUpdate=F}function pa(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(M,F,H){zt.get(M.texture).__webglTexture=F,zt.get(M.depthTexture).__webglTexture=H;const G=zt.get(M);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=H===void 0,G.__autoAllocateDepthBuffer||qt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,F){const H=zt.get(M);H.__webglFramebuffer=F,H.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(M,F=0,H=0){I=M,R=F,P=H;let G=!0,k=null,ct=!1,Tt=!1;if(M){const N=zt.get(M);if(N.__useDefaultFramebuffer!==void 0)kt.bindFramebuffer(L.FRAMEBUFFER,null),G=!1;else if(N.__webglFramebuffer===void 0)E.setupRenderTarget(M);else if(N.__hasExternalTextures)E.rebindTextures(M,zt.get(M.texture).__webglTexture,zt.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const j=M.depthTexture;if(N.__boundDepthTexture!==j){if(j!==null&&zt.has(j)&&(M.width!==j.image.width||M.height!==j.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(M)}}const B=M.texture;(B.isData3DTexture||B.isDataArrayTexture||B.isCompressedArrayTexture)&&(Tt=!0);const W=zt.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(W[F])?k=W[F][H]:k=W[F],ct=!0):M.samples>0&&E.useMultisampledRTT(M)===!1?k=zt.get(M).__webglMultisampledFramebuffer:Array.isArray(W)?k=W[H]:k=W,U.copy(M.viewport),q.copy(M.scissor),V=M.scissorTest}else U.copy(Bt).multiplyScalar($).floor(),q.copy(Qt).multiplyScalar($).floor(),V=de;if(kt.bindFramebuffer(L.FRAMEBUFFER,k)&&G&&kt.drawBuffers(M,k),kt.viewport(U),kt.scissor(q),kt.setScissorTest(V),ct){const N=zt.get(M.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,N.__webglTexture,H)}else if(Tt){const N=zt.get(M.texture),B=F||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,N.__webglTexture,H||0,B)}x=-1},this.readRenderTargetPixels=function(M,F,H,G,k,ct,Tt){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let b=zt.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Tt!==void 0&&(b=b[Tt]),b){kt.bindFramebuffer(L.FRAMEBUFFER,b);try{const N=M.texture,B=N.format,W=N.type;if(!ne.textureFormatReadable(B)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ne.textureTypeReadable(W)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=M.width-G&&H>=0&&H<=M.height-k&&L.readPixels(F,H,G,k,Yt.convert(B),Yt.convert(W),ct)}finally{const N=I!==null?zt.get(I).__webglFramebuffer:null;kt.bindFramebuffer(L.FRAMEBUFFER,N)}}},this.readRenderTargetPixelsAsync=async function(M,F,H,G,k,ct,Tt){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let b=zt.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Tt!==void 0&&(b=b[Tt]),b){const N=M.texture,B=N.format,W=N.type;if(!ne.textureFormatReadable(B))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ne.textureTypeReadable(W))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=M.width-G&&H>=0&&H<=M.height-k){kt.bindFramebuffer(L.FRAMEBUFFER,b);const j=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,j),L.bufferData(L.PIXEL_PACK_BUFFER,ct.byteLength,L.STREAM_READ),L.readPixels(F,H,G,k,Yt.convert(B),Yt.convert(W),0);const it=I!==null?zt.get(I).__webglFramebuffer:null;kt.bindFramebuffer(L.FRAMEBUFFER,it);const ht=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Zu(L,ht,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,j),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ct),L.deleteBuffer(j),L.deleteSync(ht),ct}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,F=null,H=0){M.isTexture!==!0&&(fs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,M=arguments[1]);const G=Math.pow(2,-H),k=Math.floor(M.image.width*G),ct=Math.floor(M.image.height*G),Tt=F!==null?F.x:0,b=F!==null?F.y:0;E.setTexture2D(M,0),L.copyTexSubImage2D(L.TEXTURE_2D,H,0,0,Tt,b,k,ct),kt.unbindTexture()};const ma=L.createFramebuffer(),ga=L.createFramebuffer();this.copyTextureToTexture=function(M,F,H=null,G=null,k=0,ct=null){M.isTexture!==!0&&(fs("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,M=arguments[1],F=arguments[2],ct=arguments[3]||0,H=null),ct===null&&(k!==0?(fs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ct=k,k=0):ct=0);let Tt,b,N,B,W,j,it,ht,Ut;const Ht=M.isCompressedTexture?M.mipmaps[ct]:M.image;if(H!==null)Tt=H.max.x-H.min.x,b=H.max.y-H.min.y,N=H.isBox3?H.max.z-H.min.z:1,B=H.min.x,W=H.min.y,j=H.isBox3?H.min.z:0;else{const qe=Math.pow(2,-k);Tt=Math.floor(Ht.width*qe),b=Math.floor(Ht.height*qe),M.isDataArrayTexture?N=Ht.depth:M.isData3DTexture?N=Math.floor(Ht.depth*qe):N=1,B=0,W=0,j=0}G!==null?(it=G.x,ht=G.y,Ut=G.z):(it=0,ht=0,Ut=0);const wt=Yt.convert(F.format),vt=Yt.convert(F.type);let Xt;F.isData3DTexture?(E.setTexture3D(F,0),Xt=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(E.setTexture2DArray(F,0),Xt=L.TEXTURE_2D_ARRAY):(E.setTexture2D(F,0),Xt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);const st=L.getParameter(L.UNPACK_ROW_LENGTH),re=L.getParameter(L.UNPACK_IMAGE_HEIGHT),xe=L.getParameter(L.UNPACK_SKIP_PIXELS),Ae=L.getParameter(L.UNPACK_SKIP_ROWS),ln=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Ht.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ht.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,B),L.pixelStorei(L.UNPACK_SKIP_ROWS,W),L.pixelStorei(L.UNPACK_SKIP_IMAGES,j);const ve=M.isDataArrayTexture||M.isData3DTexture,Ne=F.isDataArrayTexture||F.isData3DTexture;if(M.isDepthTexture){const qe=zt.get(M),Be=zt.get(F),rn=zt.get(qe.__renderTarget),_a=zt.get(Be.__renderTarget);kt.bindFramebuffer(L.READ_FRAMEBUFFER,rn.__webglFramebuffer),kt.bindFramebuffer(L.DRAW_FRAMEBUFFER,_a.__webglFramebuffer);for(let Si=0;Si<N;Si++)ve&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,zt.get(M).__webglTexture,k,j+Si),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,zt.get(F).__webglTexture,ct,Ut+Si)),L.blitFramebuffer(B,W,Tt,b,it,ht,Tt,b,L.DEPTH_BUFFER_BIT,L.NEAREST);kt.bindFramebuffer(L.READ_FRAMEBUFFER,null),kt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(k!==0||M.isRenderTargetTexture||zt.has(M)){const qe=zt.get(M),Be=zt.get(F);kt.bindFramebuffer(L.READ_FRAMEBUFFER,ma),kt.bindFramebuffer(L.DRAW_FRAMEBUFFER,ga);for(let rn=0;rn<N;rn++)ve?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,qe.__webglTexture,k,j+rn):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,qe.__webglTexture,k),Ne?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Be.__webglTexture,ct,Ut+rn):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Be.__webglTexture,ct),k!==0?L.blitFramebuffer(B,W,Tt,b,it,ht,Tt,b,L.COLOR_BUFFER_BIT,L.NEAREST):Ne?L.copyTexSubImage3D(Xt,ct,it,ht,Ut+rn,B,W,Tt,b):L.copyTexSubImage2D(Xt,ct,it,ht,B,W,Tt,b);kt.bindFramebuffer(L.READ_FRAMEBUFFER,null),kt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Ne?M.isDataTexture||M.isData3DTexture?L.texSubImage3D(Xt,ct,it,ht,Ut,Tt,b,N,wt,vt,Ht.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(Xt,ct,it,ht,Ut,Tt,b,N,wt,Ht.data):L.texSubImage3D(Xt,ct,it,ht,Ut,Tt,b,N,wt,vt,Ht):M.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,ct,it,ht,Tt,b,wt,vt,Ht.data):M.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,ct,it,ht,Ht.width,Ht.height,wt,Ht.data):L.texSubImage2D(L.TEXTURE_2D,ct,it,ht,Tt,b,wt,vt,Ht);L.pixelStorei(L.UNPACK_ROW_LENGTH,st),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,re),L.pixelStorei(L.UNPACK_SKIP_PIXELS,xe),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ae),L.pixelStorei(L.UNPACK_SKIP_IMAGES,ln),ct===0&&F.generateMipmaps&&L.generateMipmap(Xt),kt.unbindTexture()},this.copyTextureToTexture3D=function(M,F,H=null,G=null,k=0){return M.isTexture!==!0&&(fs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,G=arguments[1]||null,M=arguments[2],F=arguments[3],k=arguments[4]||0),fs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,F,H,G,k)},this.initRenderTarget=function(M){zt.get(M).__webglFramebuffer===void 0&&E.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?E.setTextureCube(M,0):M.isData3DTexture?E.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?E.setTexture2DArray(M,0):E.setTexture2D(M,0),kt.unbindTexture()},this.resetState=function(){R=0,P=0,I=null,kt.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=he._getDrawingBufferColorSpace(t),e.unpackColorSpace=he._getUnpackColorSpace()}}const Nc={type:"change"},yl={type:"start"},Vh={type:"end"},Br=new sr,Oc=new ui,Bg=Math.cos(70*Oi.DEG2RAD),ke=new C,an=2*Math.PI,ye={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Qa=1e-6;class kg extends Qd{constructor(t,e=null){super(t,e),this.state=ye.NONE,this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:gs.ROTATE,MIDDLE:gs.DOLLY,RIGHT:gs.PAN},this.touches={ONE:ps.ROTATE,TWO:ps.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new Qn,this._lastTargetPosition=new C,this._quat=new Qn().setFromUnitVectors(t.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new hc,this._sphericalDelta=new hc,this._scale=1,this._panOffset=new C,this._rotateStart=new ut,this._rotateEnd=new ut,this._rotateDelta=new ut,this._panStart=new ut,this._panEnd=new ut,this._panDelta=new ut,this._dollyStart=new ut,this._dollyEnd=new ut,this._dollyDelta=new ut,this._dollyDirection=new C,this._mouse=new ut,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Gg.bind(this),this._onPointerDown=zg.bind(this),this._onPointerUp=Hg.bind(this),this._onContextMenu=Kg.bind(this),this._onMouseWheel=Xg.bind(this),this._onKeyDown=qg.bind(this),this._onTouchStart=Yg.bind(this),this._onTouchMove=$g.bind(this),this._onMouseDown=Vg.bind(this),this._onMouseMove=Wg.bind(this),this._interceptControlDown=jg.bind(this),this._interceptControlUp=Zg.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Nc),this.update(),this.state=ye.NONE}update(t=null){const e=this.object.position;ke.copy(e).sub(this.target),ke.applyQuaternion(this._quat),this._spherical.setFromVector3(ke),this.autoRotate&&this.state===ye.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=an:n>Math.PI&&(n-=an),s<-Math.PI?s+=an:s>Math.PI&&(s-=an),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(ke.setFromSpherical(this._spherical),ke.applyQuaternion(this._quatInverse),e.copy(this.target).add(ke),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=ke.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new C(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const h=new C(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(o),this.object.updateMatrixWorld(),a=ke.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Br.origin.copy(this.object.position),Br.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Br.direction))<Bg?this.object.lookAt(this.target):(Oc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Br.intersectPlane(Oc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Qa||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Qa||this._lastTargetPosition.distanceToSquared(this.target)>Qa?(this.dispatchEvent(Nc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?an/60*this.autoRotateSpeed*t:an/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ke.setFromMatrixColumn(e,0),ke.multiplyScalar(-t),this._panOffset.add(ke)}_panUp(t,e){this.screenSpacePanning===!0?ke.setFromMatrixColumn(e,1):(ke.setFromMatrixColumn(e,0),ke.crossVectors(this.object.up,ke)),ke.multiplyScalar(t),this._panOffset.add(ke)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ke.copy(s).sub(this.target);let r=ke.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(an*this._rotateDelta.x/e.clientHeight),this._rotateUp(an*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(an*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-an*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(an*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-an*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(an*this._rotateDelta.x/e.clientHeight),this._rotateUp(an*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ut,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function zg(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Gg(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Hg(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Vh),this.state=ye.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Vg(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case gs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ye.DOLLY;break;case gs.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ye.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ye.ROTATE}break;case gs.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ye.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ye.PAN}break;default:this.state=ye.NONE}this.state!==ye.NONE&&this.dispatchEvent(yl)}function Wg(i){switch(this.state){case ye.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ye.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ye.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Xg(i){this.enabled===!1||this.enableZoom===!1||this.state!==ye.NONE||(i.preventDefault(),this.dispatchEvent(yl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Vh))}function qg(i){this.enabled!==!1&&this._handleKeyDown(i)}function Yg(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ps.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ye.TOUCH_ROTATE;break;case ps.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ye.TOUCH_PAN;break;default:this.state=ye.NONE}break;case 2:switch(this.touches.TWO){case ps.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ye.TOUCH_DOLLY_PAN;break;case ps.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ye.TOUCH_DOLLY_ROTATE;break;default:this.state=ye.NONE}break;default:this.state=ye.NONE}this.state!==ye.NONE&&this.dispatchEvent(yl)}function $g(i){switch(this._trackPointer(i),this.state){case ye.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ye.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ye.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ye.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ye.NONE}}function Kg(i){this.enabled!==!1&&i.preventDefault()}function jg(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Zg(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Wh={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Ps{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Jg=new _l(-1,1,1,-1,0,1);class Qg extends Te{constructor(){super(),this.setAttribute("position",new ge([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ge([0,2,0,0,2,0],2))}}const t_=new Qg;class Ml{constructor(t){this._mesh=new At(t_,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Jg)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class e_ extends Ps{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Re?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ir.clone(t.uniforms),this.material=new Re({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Ml(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Fc extends Ps{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class n_ extends Ps{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class i_{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ut);this._width=n.width,this._height=n.height,e=new Mn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Un}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new e_(Wh),this.copyPass.material.blending=$n,this.clock=new Zd}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Fc!==void 0&&(a instanceof Fc?n=!0:a instanceof n_&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ut);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class s_ extends Ps{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Rt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const r_={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Rt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class As extends Ps{constructor(t,e,n,s){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new ut(t.x,t.y):new ut(256,256),this.clearColor=new Rt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Mn(r,a,{type:Un}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new Mn(r,a,{type:Un});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const p=new Mn(r,a,{type:Un});p.texture.name="UnrealBloomPass.v"+u,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}const o=r_;this.highPassUniforms=ir.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Re({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ut(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const c=Wh;this.copyUniforms=ir.clone(c.uniforms),this.blendMaterial=new Re({uniforms:this.copyUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader,blending:De,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Rt,this.oldClearAlpha=1,this.basic=new Wt,this.fsQuad=new Ml(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ut(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=As.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=As.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeperableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new Re({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ut(.5,.5)},direction:{value:new ut(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new Re({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}As.BlurDirectionX=new ut(1,0);As.BlurDirectionY=new ut(0,1);const a_={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class o_ extends Ps{constructor(){super();const t=a_;this.uniforms=ir.clone(t.uniforms),this.material=new Hd({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Ml(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},he.getTransfer(this._outputColorSpace)===pe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===th?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===eh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===nh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Qo?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ih?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===sh&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Ws=new C;function gn(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Ws.copy(t),Ws[n]=0,Ws.normalize();const h=.5*a/(a+o),c=1-Ws.angleTo(i)/l;return Math.sign(Ws[e])===1?c*h:o/(a+o)+h+h*(1-c)}class di extends yn{constructor(t=1,e=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(t/2,e/2,n/2,r),super(1,1,1,s,s,s),s===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const o=new C,l=new C,h=new C(t,e,n).divideScalar(2).subScalar(r),c=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,p=c.length/6,_=new C,v=.5/s;for(let g=0,m=0;g<c.length;g+=3,m+=2)switch(o.fromArray(c,g),l.copy(o),l.x-=Math.sign(l.x)*v,l.y-=Math.sign(l.y)*v,l.z-=Math.sign(l.z)*v,l.normalize(),c[g+0]=h.x*Math.sign(o.x)+l.x*r,c[g+1]=h.y*Math.sign(o.y)+l.y*r,c[g+2]=h.z*Math.sign(o.z)+l.z*r,u[g+0]=l.x,u[g+1]=l.y,u[g+2]=l.z,Math.floor(g/p)){case 0:_.set(1,0,0),d[m+0]=gn(_,l,"z","y",r,n),d[m+1]=1-gn(_,l,"y","z",r,e);break;case 1:_.set(-1,0,0),d[m+0]=1-gn(_,l,"z","y",r,n),d[m+1]=1-gn(_,l,"y","z",r,e);break;case 2:_.set(0,1,0),d[m+0]=1-gn(_,l,"x","z",r,t),d[m+1]=gn(_,l,"z","x",r,n);break;case 3:_.set(0,-1,0),d[m+0]=1-gn(_,l,"x","z",r,t),d[m+1]=1-gn(_,l,"z","x",r,n);break;case 4:_.set(0,0,1),d[m+0]=1-gn(_,l,"x","y",r,t),d[m+1]=1-gn(_,l,"y","x",r,e);break;case 5:_.set(0,0,-1),d[m+0]=gn(_,l,"x","y",r,t),d[m+1]=1-gn(_,l,"y","x",r,e);break}}}function Xh(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Te;let h=0;for(let c=0;c<i.length;++c){const u=i[c];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". The geometry must have either an index or a position attribute"),null;l.addGroup(h,p,c),h+=p}}if(e){let c=0;const u=[];for(let d=0;d<i.length;++d){const p=i[d].index;for(let _=0;_<p.count;++_)u.push(p.getX(_)+c);c+=i[d].attributes.position.count}l.setIndex(u)}for(const c in r){const u=Bc(r[c]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" attribute."),null;l.setAttribute(c,u)}for(const c in a){const u=a[c][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[c]=[];for(let d=0;d<u;++d){const p=[];for(let v=0;v<a[c].length;++v)p.push(a[c][v][d]);const _=Bc(p);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" morphAttribute."),null;l.morphAttributes[c].push(_)}}return l}function Bc(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){const c=i[h];if(t===void 0&&(t=c.array.constructor),t!==c.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=c.itemSize),e!==c.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=c.normalized),n!==c.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=c.gpuType),s!==c.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=c.count*e}const a=new t(r),o=new se(a,e,n);let l=0;for(let h=0;h<i.length;++h){const c=i[h];if(c.isInterleavedBufferAttribute){const u=l/e;for(let d=0,p=c.count;d<p;d++)for(let _=0;_<e;_++){const v=c.getComponent(d,_);o.setComponent(d+u,_,v)}}else a.set(c.array,l);l+=c.count*e}return s!==void 0&&(o.gpuType=s),o}function fn(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Le(i,t,e,n={}){const s=document.createElement("canvas");s.width=i,s.height=t;const r=s.getContext("2d");e(r,i,t);const a=new Dh(s);return a.colorSpace=n.srgb===!1?Wn:en,a.anisotropy=n.anisotropy||8,n.repeat&&(a.wrapS=a.wrapT=Zr,a.repeat.set(n.repeat[0],n.repeat[1])),n.filter&&(a.magFilter=n.filter,a.minFilter=n.filter),a.needsUpdate=!0,a}function tr(i,t,e,n,s){let r=e;for(const a of t)i.fillText(a,r,n),r+=i.measureText(a).width+s;return r}function mi(i,t,e){const n=i.createLinearGradient(0,t,0,e);return n.addColorStop(0,"#f7e7bd"),n.addColorStop(.42,"#e0c387"),n.addColorStop(.72,"#bb9558"),n.addColorStop(1,"#e8d3a2"),n}function l_(i,t,e,n,s,r){i.beginPath(),i.moveTo(t+r,e),i.arcTo(t+n,e,t+n,e+s,r),i.arcTo(t+n,e+s,t,e+s,r),i.arcTo(t,e+s,t,e,r),i.arcTo(t,e,t+n,e,r),i.closePath()}function c_(){return Le(1536,320,(i,t,e)=>{const n=i.createLinearGradient(0,0,0,e);n.addColorStop(0,"#101319"),n.addColorStop(.5,"#07090d"),n.addColorStop(1,"#0c0f14"),i.fillStyle=n,i.fillRect(0,0,t,e),i.save(),i.globalCompositeOperation="lighter";const s=i.createLinearGradient(0,0,t,e);s.addColorStop(0,"rgba(255,255,255,0)"),s.addColorStop(.42,"rgba(190,215,230,0.035)"),s.addColorStop(.55,"rgba(255,255,255,0)"),i.fillStyle=s,i.fillRect(0,0,t,e),i.restore(),i.strokeStyle="rgba(216,184,120,0.55)",i.lineWidth=2,i.strokeRect(16,16,t-32,e-32),i.strokeStyle="rgba(216,184,120,0.16)",i.lineWidth=1,i.strokeRect(27,27,t-54,e-54);const r=132,a=160,o=82;i.beginPath(),i.arc(r,a,o,0,Math.PI*2),i.strokeStyle="rgba(216,184,120,0.75)",i.lineWidth=2.5,i.stroke(),i.beginPath(),i.arc(r,a,o-9,0,Math.PI*2),i.strokeStyle="rgba(216,184,120,0.2)",i.lineWidth=1,i.stroke(),i.beginPath(),i.arc(r,a,o-20,0,Math.PI*2),i.fillStyle="rgba(216,184,120,0.07)",i.fill(),i.fillStyle=mi(i,a-40,a+40),i.font='600 54px "Iowan Old Style", "Palatino Linotype", Georgia, serif',i.textAlign="center",i.textBaseline="middle",i.fillText("GW",r,a+3),i.textAlign="left",i.fillStyle=mi(i,70,160),i.font='500 78px "Iowan Old Style", "Palatino Linotype", Georgia, serif',tr(i,"GOODWORK",258,138,5),i.fillStyle=mi(i,95,185),i.font='700 92px "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',tr(i,"古德車房",930,150,8),i.strokeStyle="rgba(216,184,120,0.35)",i.beginPath(),i.moveTo(262,196),i.lineTo(1488,196),i.stroke(),i.fillStyle="rgba(216,184,120,0.72)",i.font='400 25px "Inter", "PingFang SC", sans-serif',tr(i,"AUTO ATELIER  ·  維修  保養  鈑金  改裝",266,246,4),i.fillStyle="rgba(255,255,255,0.22)",i.font='400 19px "SF Mono", Menlo, monospace',i.textAlign="right",i.fillText("EST. 2016",1480,246)},{anisotropy:16})}function h_(){return Le(256,1024,(i,t,e)=>{i.fillStyle="#07090d",i.fillRect(0,0,t,e);const n=i.createRadialGradient(t/2,380,10,t/2,420,340);n.addColorStop(0,"rgba(216,184,120,0.13)"),n.addColorStop(1,"rgba(216,184,120,0)"),i.fillStyle=n,i.fillRect(0,0,t,e),i.strokeStyle="rgba(216,184,120,0.6)",i.lineWidth=2,i.strokeRect(14,14,t-28,e-28),i.strokeStyle="rgba(216,184,120,0.18)",i.lineWidth=1,i.strokeRect(24,24,t-48,e-48),i.textAlign="center",i.textBaseline="middle",i.fillStyle=mi(i,70,760),i.font='700 118px "Noto Serif CJK SC", "Songti SC", serif',["古","德","車","房"].forEach((r,a)=>i.fillText(r,t/2,190+a*158)),i.fillStyle="rgba(216,184,120,0.7)",i.font='400 16px "SF Mono", Menlo, monospace',i.fillText("G O O D W O R K",t/2,872),i.fillStyle="rgba(216,184,120,0.38)",i.font='400 11px "Inter", sans-serif',i.fillText("AUTO ATELIER · 2016",t/2,906),i.fillStyle="rgba(216,184,120,0.55)",i.beginPath(),i.moveTo(t/2,940),i.lineTo(t/2+5,948),i.lineTo(t/2,956),i.lineTo(t/2-5,948),i.closePath(),i.fill()},{anisotropy:16})}function u_(){return Le(512,384,(i,t,e)=>{i.fillStyle="#080a0e",i.fillRect(0,0,t,e),i.strokeStyle="rgba(216,184,120,0.6)",i.lineWidth=3,i.strokeRect(13,13,t-26,e-26),i.textAlign="center",i.textBaseline="middle",i.fillStyle=mi(i,50,160),i.font='600 30px "Iowan Old Style", Georgia, serif',i.fillText("GOODWORK",t/2,82),i.fillStyle=mi(i,130,260),i.font='700 74px "Noto Serif CJK SC", "Songti SC", serif',i.fillText("古德車房",t/2,176),i.fillStyle="rgba(216,184,120,0.55)",i.font='400 19px "Inter", sans-serif',i.fillText("維修 · 保養 · 鈑金 · 改裝",t/2,248),i.strokeStyle="rgba(216,184,120,0.25)",i.beginPath(),i.moveTo(90,286),i.lineTo(t-90,286),i.stroke(),i.fillStyle="rgba(255,255,255,0.28)",i.font='400 13px "SF Mono", Menlo, monospace',i.fillText("SINCE 2016 / NIGHT SHIFT",t/2,318),i.fillStyle="rgba(216,184,120,0.65)",i.beginPath(),i.moveTo(t/2-16,344),i.lineTo(t/2+16,344),i.lineTo(t/2,360),i.closePath(),i.fill()},{anisotropy:16})}function kc(){return Le(1024,192,(i,t,e)=>{i.fillStyle="#07090d",i.fillRect(0,0,t,e),i.strokeStyle="rgba(216,184,120,0.4)",i.lineWidth=2,i.strokeRect(10,10,t-20,e-20),i.textAlign="center",i.textBaseline="middle",i.fillStyle=mi(i,50,135),i.font='500 66px "Iowan Old Style", Georgia, serif',i.fillText("GOODWORK",t/2,84),i.fillStyle="rgba(216,184,120,0.6)",i.font='400 18px "Inter", "PingFang SC", sans-serif',i.fillText("古 德 車 房  ·  A U T O   A T E L I E R",t/2,140)},{anisotropy:8})}function kr(i,t,e=1024,n=224){return Le(e,n,(s,r,a)=>{const o=s.createLinearGradient(0,0,0,a);o.addColorStop(0,"#0d1015"),o.addColorStop(1,"#06080b"),s.fillStyle=o,s.fillRect(0,0,r,a),s.strokeStyle="rgba(216,184,120,0.55)",s.lineWidth=2,s.strokeRect(12,12,r-24,a-24),s.textAlign="center",s.textBaseline="middle",s.fillStyle=mi(s,40,a-50),s.font='700 82px "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',s.fillText(i,r/2,a/2-18),s.fillStyle="rgba(216,184,120,0.62)",s.font='400 19px "SF Mono", Menlo, monospace',tr(s,t,r/2-t.length*6.6,a-44,5)},{anisotropy:8})}function d_(){return Le(2048,512,(i,t,e)=>{const n=fn(7719);i.fillStyle="#0a0c11",i.fillRect(0,0,t,e);const s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"rgba(40,48,58,0.18)"),s.addColorStop(.5,"rgba(12,16,23,0.05)"),s.addColorStop(1,"rgba(34,40,50,0.16)"),i.fillStyle=s,i.fillRect(0,0,t,e);for(let c=0;c<26e3;c++){const u=n()*t,d=n()*e,p=.015+n()*.05;i.fillStyle=n()>.55?`rgba(190,205,220,${p})`:`rgba(0,0,0,${p})`,i.fillRect(u,d,1+n()*2,1+n()*2)}for(let c=0;c<14;c++){const u=n()*e,d=i.createLinearGradient(0,u-26,0,u+26);d.addColorStop(0,"rgba(120,150,170,0)"),d.addColorStop(.5,`rgba(120,150,170,${.018+n()*.026})`),d.addColorStop(1,"rgba(120,150,170,0)"),i.fillStyle=d,i.fillRect(0,u-26,t,52)}for(let c=0;c<9;c++){const u=n()*t,d=n()*e,p=50+n()*150,_=10+n()*26,v=i.createRadialGradient(u,d,0,u,d,p);v.addColorStop(0,"rgba(5,8,13,0.72)"),v.addColorStop(.72,"rgba(8,12,18,0.38)"),v.addColorStop(1,"rgba(8,12,18,0)"),i.save(),i.translate(u,d),i.scale(1,_/p),i.translate(-u,-d),i.fillStyle=v,i.beginPath(),i.arc(u,d,p,0,Math.PI*2),i.fill(),i.restore()}i.strokeStyle="rgba(228,233,238,0.6)",i.lineWidth=3,[Math.round(e*.26),Math.round(e*.76)].forEach(c=>{i.setLineDash([38,46]),i.beginPath(),i.moveTo(0,c),i.lineTo(t,c),i.stroke()}),i.setLineDash([]),[Math.round(e*.505),Math.round(e*.525)].forEach(c=>{i.strokeStyle="rgba(235,212,158,0.55)",i.lineWidth=2.5,i.beginPath(),i.moveTo(0,c),i.lineTo(t,c),i.stroke()}),[Math.round(e*.045),Math.round(e*.945)].forEach(c=>{i.strokeStyle="rgba(220,226,232,0.48)",i.lineWidth=4,i.beginPath(),i.moveTo(0,c),i.lineTo(t,c),i.stroke()});const r=52/90*t,a=59/90*t;i.fillStyle="rgba(228,232,236,0.62)";for(let c=r;c<a;c+=26)i.fillRect(c,e*.06,15,e*.88);i.fillStyle="rgba(10,12,17,0.22)";for(let c=0;c<90;c++)i.fillRect(r+n()*(a-r),e*.06+n()*e*.86,16,2+n()*5);const o=43/90*t,l=e*.62;i.strokeStyle="rgba(228,232,236,0.55)",i.lineWidth=5,i.beginPath(),i.ellipse(o,l,76,28,0,0,Math.PI*2),i.stroke(),i.fillStyle="rgba(228,232,236,0.55)",i.font='600 58px "Inter", sans-serif',i.textAlign="center",i.textBaseline="middle",i.save(),i.translate(o,l+3),i.scale(1,.38),i.fillText("30",0,0),i.restore();const h=(c,u,d)=>{i.save(),i.translate(c,u),d&&i.rotate(Math.PI),i.fillStyle="rgba(228,232,236,0.42)",i.beginPath(),i.moveTo(0,-42),i.lineTo(24,-6),i.lineTo(8,-6),i.lineTo(8,38),i.lineTo(-8,38),i.lineTo(-8,-6),i.lineTo(-24,-6),i.closePath(),i.fill(),i.restore()};h(63/90*t,e*.32,!1),h(19/90*t,e*.78,!0),[73/90*t,49/90*t].forEach(c=>{i.fillStyle="rgba(3,5,8,0.8)",i.beginPath(),i.ellipse(c,e*.47,26,12,0,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(160,165,170,0.12)",i.lineWidth=1.5,i.stroke()}),i.strokeStyle="rgba(0,0,0,0.3)",i.lineWidth=1;for(let c=0;c<22;c++){let u=n()*t,d=n()*e;i.beginPath(),i.moveTo(u,d);for(let p=0;p<4;p++)u+=(n()-.5)*40,d+=(n()-.5)*20,i.lineTo(u,d);i.stroke()}},{anisotropy:16})}function f_(){return Le(512,512,(i,t,e)=>{const n=fn(3381);i.fillStyle="#1a1d23",i.fillRect(0,0,t,e);for(let r=0;r<12e3;r++)i.fillStyle=`rgba(${n()>.5?"200,205,212":"0,0,0"},${.012+n()*.03})`,i.fillRect(n()*t,n()*e,1.5,1.5);i.strokeStyle="rgba(5,7,10,0.65)",i.lineWidth=3;const s=t/4;for(let r=0;r<=4;r++)i.beginPath(),i.moveTo(r*s,0),i.lineTo(r*s,e),i.stroke(),i.beginPath(),i.moveTo(0,r*s),i.lineTo(t,r*s),i.stroke();i.strokeStyle="rgba(255,255,255,0.035)",i.lineWidth=1;for(let r=0;r<=4;r++)i.beginPath(),i.moveTo(r*s+2,0),i.lineTo(r*s+2,e),i.stroke();for(let r=0;r<7;r++){const a=n()*t,o=n()*e,l=18+n()*70,h=i.createRadialGradient(a,o,0,a,o,l);h.addColorStop(0,"rgba(4,6,10,0.32)"),h.addColorStop(1,"rgba(4,6,10,0)"),i.fillStyle=h,i.beginPath(),i.arc(a,o,l,0,Math.PI*2),i.fill()}},{repeat:[16,1],anisotropy:8})}function p_(){return Le(512,512,(i,t,e)=>{const n=fn(5521);i.fillStyle="#242832",i.fillRect(0,0,t,e);for(let s=0;s<16e3;s++)i.fillStyle=n()>.5?`rgba(255,255,255,${.008+n()*.025})`:`rgba(0,0,0,${.01+n()*.035})`,i.fillRect(n()*t,n()*e,1+n()*2,1+n()*2);for(let s=0;s<7;s++){const r=n()*t,a=n()*e,o=30+n()*80,l=i.createRadialGradient(r,a,0,r,a,o);l.addColorStop(0,"rgba(8,10,14,0.2)"),l.addColorStop(1,"rgba(8,10,14,0)"),i.fillStyle=l,i.beginPath(),i.arc(r,a,o,0,Math.PI*2),i.fill()}i.strokeStyle="rgba(0,0,0,0.16)",i.lineWidth=1,i.beginPath(),i.moveTo(0,e*.52),i.lineTo(t,e*.52),i.stroke()},{repeat:[2,2],anisotropy:8})}function m_(){return Le(512,512,(i,t,e)=>{const n=fn(9102);i.fillStyle="#191b21",i.fillRect(0,0,t,e);const s=64,r=26;for(let a=0;a<e/r;a++)for(let o=-1;o<t/s;o++){const l=o*s+(a%2?s/2:0),h=a*r,c=24+n()*14;i.fillStyle=`rgb(${c+8},${c+4},${c+2})`,i.fillRect(l+1,h+1,s-2,r-2),i.fillStyle=`rgba(255,255,255,${.008+n()*.02})`,i.fillRect(l+3,h+2,s-6,1)}},{repeat:[3,3],anisotropy:8})}function g_(){return Le(256,512,(i,t,e)=>{i.fillStyle="#1a1e26",i.fillRect(0,0,t,e);for(let n=0;n<t;n+=16){const s=i.createLinearGradient(n,0,n+16,0);s.addColorStop(0,"rgba(255,255,255,0.02)"),s.addColorStop(.35,"rgba(255,255,255,0.075)"),s.addColorStop(.55,"rgba(0,0,0,0.22)"),s.addColorStop(1,"rgba(0,0,0,0.4)"),i.fillStyle=s,i.fillRect(n,0,16,e)}for(let n=0;n<3e3;n++)i.fillStyle=`rgba(255,255,255,${Math.random()*.016})`,i.fillRect(Math.random()*t,Math.random()*e,1,1)},{repeat:[5,1],anisotropy:8})}function __(){return Le(512,512,(i,t,e)=>{const n=fn(4421);i.clearRect(0,0,t,e);for(let r=0;r<900;r++){const a=n()*t,o=n()*e,l=8+n()*42,h=i.createRadialGradient(a,o,0,a,o,l);h.addColorStop(0,"rgba(232,240,248,0.95)"),h.addColorStop(.65,"rgba(224,234,245,0.55)"),h.addColorStop(1,"rgba(224,234,245,0)"),i.fillStyle=h,i.beginPath(),i.arc(a,o,l,0,Math.PI*2),i.fill()}i.globalCompositeOperation="destination-in";const s=i.createLinearGradient(0,0,t,e);s.addColorStop(0,"rgba(0,0,0,0)"),s.addColorStop(.2,"rgba(0,0,0,0.9)"),s.addColorStop(.8,"rgba(0,0,0,0.9)"),s.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=s,i.fillRect(0,0,t,e)},{anisotropy:8})}function _n(){return Le(256,256,(i,t,e)=>{const n=i.createRadialGradient(t/2,e/2,0,t/2,e/2,t/2);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.18,"rgba(255,255,255,0.6)"),n.addColorStop(.5,"rgba(255,255,255,0.15)"),n.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=n,i.fillRect(0,0,t,e)})}function v_(){return Le(128,512,(i,t,e)=>{const n=i.createLinearGradient(0,0,0,e);n.addColorStop(0,"rgba(255,255,255,0)"),n.addColorStop(.18,"rgba(255,255,255,0.55)"),n.addColorStop(.5,"rgba(255,255,255,1)"),n.addColorStop(.86,"rgba(255,255,255,0.4)"),n.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=n,i.fillRect(0,0,t,e),i.globalCompositeOperation="destination-in";const s=i.createLinearGradient(0,0,t,0);s.addColorStop(0,"rgba(0,0,0,0)"),s.addColorStop(.35,"rgba(0,0,0,0.8)"),s.addColorStop(.5,"rgba(0,0,0,1)"),s.addColorStop(.65,"rgba(0,0,0,0.8)"),s.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=s,i.fillRect(0,0,t,e)})}function zc(i="approval"){return Le(512,320,(t,e,n)=>{t.fillStyle="#071119",t.fillRect(0,0,e,n);const s=t.createLinearGradient(0,0,e,n);s.addColorStop(0,"rgba(60,210,190,0.14)"),s.addColorStop(1,"rgba(10,40,60,0)"),t.fillStyle=s,t.fillRect(0,0,e,n),t.fillStyle="rgba(216,184,120,0.85)",t.fillRect(24,26,3,28),t.fillStyle="rgba(230,238,242,0.9)",t.font='600 16px "Inter", "PingFang SC", sans-serif',t.fillText(i==="approval"?"GOODWORK / APPROVAL":"LIFT 01 / SAFE",40,46),t.fillStyle="rgba(120,220,205,0.7)",t.font='400 10px "SF Mono", Menlo, monospace',t.fillText("SCENE LINK · ONLINE",40,66),t.strokeStyle="rgba(120,220,205,0.25)",t.lineWidth=1;for(let a=1;a<5;a++)t.beginPath(),t.moveTo(24,90+a*32),t.lineTo(e-24,90+a*32),t.stroke();t.strokeStyle="rgba(120,225,205,0.85)",t.lineWidth=2,t.beginPath();const r=[30,150,82,132,134,142,186,108,238,120,290,88,342,96,394,72,446,84,488,62];for(let a=0;a<r.length;a+=2)a===0?t.moveTo(r[0],230-(r[1]-60)):t.lineTo(r[a],230-(r[a+1]-60));t.stroke(),t.lineTo(488,246),t.lineTo(30,246),t.closePath(),t.fillStyle="rgba(120,225,205,0.08)",t.fill(),t.fillStyle="rgba(216,184,120,0.9)",t.font='600 26px "Iowan Old Style", Georgia, serif',t.fillText(i==="approval"?"12,800.00":"98.2%",24,286),t.fillStyle="rgba(180,195,200,0.5)",t.font='400 9px "SF Mono", Menlo, monospace',t.fillText(i==="approval"?"CNY / PENDING REVIEW":"HYDRAULIC PRESSURE",24,302)},{anisotropy:8})}function Gc(i="dorm",t=7){const e=i==="dorm";return Le(e?512:1024,e?1024:512,(n,s,r)=>{const a=fn(t);n.clearRect(0,0,s,r);const o=i==="dorm"?4:3,l=i==="dorm"?6:1,h=s/(o+.6),c=r/(l+.55);for(let u=0;u<l;u++)for(let d=0;d<o;d++){const p=h*(d+.3),_=c*(u+.26),v=h*.72,g=i==="dorm"?c*.55:r*.7,m=a();let w;m>.42?w=a()>.35?"rgba(255,198,122,0.9)":"rgba(255,225,178,0.85)":m>.24?w="rgba(96,200,210,0.42)":w="rgba(28,38,50,0.9)";const T=n.createLinearGradient(p,_,p,_+g);T.addColorStop(0,w),T.addColorStop(1,"rgba(20,28,38,0.65)"),n.fillStyle=T,n.fillRect(p,_,v,g),n.fillStyle="rgba(5,8,12,0.45)",n.fillRect(p+v*.12,_+g*.58,v*.76,g*.06),a()>.55&&(n.fillStyle="rgba(5,8,12,0.35)",n.fillRect(p+v*.18,_+g*.2,3,g*.5)),n.strokeStyle="rgba(9,12,17,0.9)",n.lineWidth=4,n.strokeRect(p,_,v,g),n.beginPath(),n.moveTo(p+v/2,_),n.lineTo(p+v/2,_+g),n.stroke();const f=n.createLinearGradient(p,_,p+v,_+g);f.addColorStop(0,"rgba(180,220,235,0.1)"),f.addColorStop(.5,"rgba(180,220,235,0)"),n.fillStyle=f,n.fillRect(p,_,v,g)}},{anisotropy:8})}function y_(i,t,e){return Le(640,160,(n,s,r)=>{n.clearRect(0,0,s,r),n.fillStyle="rgba(6,8,12,0.82)",l_(n,2,18,s-4,r-36,4),n.fill(),n.strokeStyle="rgba(216,184,120,0.36)",n.lineWidth=1.5,n.stroke(),n.fillStyle="rgba(216,184,120,0.9)",n.fillRect(2,18,4,r-36),n.fillStyle="rgba(216,184,120,0.85)",n.font='500 20px "SF Mono", Menlo, monospace',n.textAlign="left",n.textBaseline="middle",n.fillText(i,22,52),n.strokeStyle="rgba(216,184,120,0.2)",n.beginPath(),n.moveTo(20,68),n.lineTo(s-20,68),n.stroke(),n.fillStyle="rgba(240,236,226,0.95)",n.font='600 38px "Noto Sans CJK SC", "PingFang SC", sans-serif',n.fillText(t,22,100),n.fillStyle="rgba(216,184,120,0.55)",n.font='400 17px "SF Mono", Menlo, monospace',tr(n,e,22,134,2.4)},{anisotropy:8})}function M_(){return Le(1024,512,(i,t,e)=>{const n=i.createLinearGradient(0,0,0,e);n.addColorStop(0,"#04070e"),n.addColorStop(.38,"#0b1622"),n.addColorStop(.55,"#1c2a36"),n.addColorStop(.62,"#3a3126"),n.addColorStop(.68,"#1a1a1d"),n.addColorStop(1,"#050608"),i.fillStyle=n,i.fillRect(0,0,t,e);const s=fn(2291);for(let r=0;r<90;r++){const a=s()*t,o=e*.55+s()*e*.12;i.fillStyle=`rgba(255,${170+s()*50},${90+s()*60},${.15+s()*.35})`,i.fillRect(a,o,2+s()*6,1+s()*3)}},{srgb:!0})}function Hc(i="upper"){return Le(1280,512,(t,e,n)=>{const s=fn(i==="upper"?881:429),r=t.createLinearGradient(0,0,0,n);i==="upper"?(r.addColorStop(0,"#4a3522"),r.addColorStop(.5,"#2a1e14"),r.addColorStop(1,"#140f0b")):(r.addColorStop(0,"#3a2818"),r.addColorStop(.55,"#22170f"),r.addColorStop(1,"#100b08")),t.fillStyle=r,t.fillRect(0,0,e,n);for(let o=0;o<e;o+=26)t.fillStyle=`rgba(255,210,150,${.02+s()*.02})`,t.fillRect(o,0,2,n);if([[180,90],[760,60],[1120,120]].forEach(([o,l],h)=>{const c=t.createRadialGradient(o,l,0,o,l,260);c.addColorStop(0,`rgba(255,190,115,${i==="upper"?.25:.22})`),c.addColorStop(1,"rgba(255,183,105,0)"),t.fillStyle=c,t.beginPath(),t.arc(o,l,260,0,Math.PI*2),t.fill()}),i==="upper"){t.fillStyle="#0d0a08",t.fillRect(80,90,380,330),t.strokeStyle="rgba(216,184,120,0.3)",t.lineWidth=2,t.strokeRect(80,90,380,330);for(let l=0;l<4;l++){const h=150+l*68;t.fillStyle="rgba(216,184,120,0.22)",t.fillRect(86,h,368,3);for(let c=0;c<5;c++){const u=28+s()*34,d=26+s()*24;t.fillStyle=`rgba(${100+s()*80},${80+s()*60},${46+s()*40},0.7)`,t.fillRect(100+c*70,h-d-4,u,d),t.fillStyle="rgba(255,225,170,0.16)",t.fillRect(104+c*70,h-d,u-8,2)}}t.fillStyle="rgba(10,13,18,0.9)",t.fillRect(540,96,280,178),t.strokeStyle="rgba(140,220,204,0.3)",t.strokeRect(540,96,280,178),t.fillStyle="rgba(120,220,205,0.75)",t.font='500 16px "SF Mono", Menlo, monospace',t.fillText("DISPATCH / 02",558,124);for(let l=0;l<16;l++)t.fillStyle=`rgba(${120+s()*100},${190+s()*50},${170+s()*45},${.25+s()*.5})`,t.fillRect(560+l%8*30,148+Math.floor(l/8)*30,16,8);t.strokeStyle="rgba(216,184,120,0.25)";for(let l=0;l<4;l++)t.beginPath(),t.moveTo(560+l*64,210),t.lineTo(560+l*64,250),t.stroke();t.fillStyle="#0e0b08",t.fillRect(860,300,350,26),t.fillRect(880,326,18,86),t.fillRect(1170,326,18,86);const o=t.createLinearGradient(900,0,1120,0);o.addColorStop(0,"rgba(105,220,205,0.85)"),o.addColorStop(1,"rgba(44,120,138,0.4)"),t.fillStyle=o,t.fillRect(910,218,90,62),t.fillRect(1020,238,76,50),t.fillStyle="rgba(8,11,16,0.7)";for(let l=0;l<6;l++)t.fillRect(916,228+l*8,70-l*4,2);[[380,44],[720,34],[1080,48]].forEach(([l,h])=>{t.strokeStyle="rgba(216,184,120,0.4)",t.lineWidth=2,t.beginPath(),t.moveTo(l,0),t.lineTo(l,h),t.stroke(),t.fillStyle="#17120d",t.beginPath(),t.moveTo(l-28,h+26),t.lineTo(l+28,h+26),t.lineTo(l+16,h),t.lineTo(l-16,h),t.closePath(),t.fill();const c=t.createRadialGradient(l,h+30,0,l,h+30,90);c.addColorStop(0,"rgba(255,214,155,0.5)"),c.addColorStop(1,"rgba(255,214,155,0)"),t.fillStyle=c,t.beginPath(),t.arc(l,h+30,90,0,Math.PI*2),t.fill()})}else{t.fillStyle="#0d0b09",t.fillRect(70,120,660,270),t.strokeStyle="rgba(216,184,120,0.22)",t.lineWidth=2,t.strokeRect(70,120,660,270);for(let l=0;l<20;l++){const h=96+l%10*60,c=175+Math.floor(l/10)*92;t.strokeStyle="rgba(170,180,190,0.4)",t.lineWidth=3,t.beginPath(),l%3===0?(t.moveTo(h,c),t.lineTo(h+8,c+48)):l%3===1?(t.arc(h+6,c+12,12,0,Math.PI*2),t.moveTo(h+6,c+24),t.lineTo(h+6,c+56)):t.rect(h,c,10,44),t.stroke()}t.fillStyle="#17110c",t.fillRect(70,390,680,24),t.fillStyle="rgba(255,186,110,0.25)",t.fillRect(70,408,680,3),t.fillStyle="rgba(255,214,164,0.85)",t.fillRect(90,100,600,5),t.fillStyle="rgba(11,13,17,0.92)",t.fillRect(820,150,380,290),t.fillStyle="rgba(255,190,120,0.45)",t.fillRect(848,182,324,2),t.fillStyle="rgba(120,220,205,0.6)",t.font='500 18px "SF Mono", Menlo, monospace',t.fillText("RECEPTION / 01",850,220);for(let l=0;l<9;l++)t.fillStyle=`rgba(${120+l*12},${180+l*6},${165+l*4},${.12+l*.04})`,t.fillRect(852,246+l*20,250-l*14,4);const o=t.createRadialGradient(1080,340,0,1080,340,120);o.addColorStop(0,"rgba(255,185,105,0.35)"),o.addColorStop(1,"rgba(255,185,105,0)"),t.fillStyle=o,t.beginPath(),t.arc(1080,340,120,0,Math.PI*2),t.fill()}const a=t.createLinearGradient(0,n-90,0,n);a.addColorStop(0,"rgba(255,180,100,0)"),a.addColorStop(1,"rgba(255,180,100,0.09)"),t.fillStyle=a,t.fillRect(0,n-90,e,90)},{anisotropy:8})}const S_=new yn(1,1,1),Ce=new Gi(1,1),x_=new An(1,1,1,20),b_=new pi(1,20,14);function A(i,t,e,n,s={}){const r=new At(S_,t);return r.scale.set(e[0],e[1],e[2]),r.position.set(n[0],n[1],n[2]),s.ry&&(r.rotation.y=s.ry),s.rx&&(r.rotation.x=s.rx),r.castShadow=s.cast!==!1,r.receiveShadow=s.receive!==!1,i.add(r),r}function ae(i,t,e,n,s,r={}){const a=new At(x_,t);return a.scale.set(e,n,e),a.position.set(s[0],s[1],s[2]),r.rx&&(a.rotation.x=r.rx),r.rz&&(a.rotation.z=r.rz),a.castShadow=r.cast!==!1,a.receiveShadow=r.receive!==!1,i.add(a),a}function hs(i,t,e,n,s={}){const r=new At(b_,t);return r.scale.set(e*(s.sx||1),e*(s.sy||1),e*(s.sz||1)),r.position.set(n[0],n[1],n[2]),r.castShadow=s.cast!==!1,r.receiveShadow=s.receive!==!1,i.add(r),r}function Qe(i,t,e,n,s=[-Math.PI/2,0,0]){const r=new At(Ce,t);return r.scale.set(e[0],e[1],1),r.position.set(n[0],n[1],n[2]),r.rotation.set(s[0],s[1],s[2]),r.receiveShadow=!0,i.add(r),r}function us(i,t,e,n=.5){const s=new hl({map:i,color:t,transparent:!0,opacity:n,blending:De,depthWrite:!1,toneMapped:!1,fog:!1}),r=new Ah(s);return r.scale.set(e,e,1),r}function Fe(i){i.updateWorldMatrix(!0,!0);const t=new ce().copy(i.matrixWorld).invert(),e=new Map;i.traverse(s=>{if(!s.isMesh||s.isInstancedMesh||!s.material||Array.isArray(s.material)||s.material.transparent||s.material.isShaderMaterial||s.userData.noMerge)return;const r=Object.keys(s.geometry.attributes).sort().join(",")+(s.geometry.index?"|i":"|n"),a=`${s.material.uuid}|${s.castShadow?1:0}|${s.receiveShadow?1:0}|${s.renderOrder}|${r}`;e.has(a)||e.set(a,{material:s.material,cast:s.castShadow,receive:s.receiveShadow,order:s.renderOrder,list:[]}),e.get(a).list.push(s)});const n=new ce;for(const s of e.values()){if(s.list.length<2)continue;const r=s.list.map(l=>{const h=l.geometry.clone();return h.applyMatrix4(n.copy(t).multiply(l.matrixWorld)),h}),a=Xh(r,!1);if(!a){r.forEach(l=>l.dispose());continue}const o=new At(a,s.material);o.castShadow=s.cast,o.receiveShadow=s.receive,o.renderOrder=s.order,i.add(o),s.list.forEach(l=>l.removeFromParent()),r.forEach(l=>l.dispose())}}function E_(i,t){i.updateMatrixWorld(!0);const e=new Map;i.traverse(n=>{if(!n.isMesh||n.isInstancedMesh||t.has(n)||!n.material||Array.isArray(n.material)||n.material.transparent||n.material.isShaderMaterial||n.userData.noMerge||n.userData.entryId)return;const s=Object.keys(n.geometry.attributes).sort().join(",")+(n.geometry.index?"|i":"|n"),r=`${n.material.uuid}|${n.castShadow?1:0}|${n.receiveShadow?1:0}|${n.renderOrder}|${s}`;e.has(r)||e.set(r,{material:n.material,cast:n.castShadow,receive:n.receiveShadow,order:n.renderOrder,list:[]}),e.get(r).list.push(n)});for(const n of e.values()){if(n.list.length<2)continue;const s=n.list.map(o=>{const l=o.geometry.clone();return l.applyMatrix4(o.matrixWorld),l}),r=Xh(s,!1);if(!r){s.forEach(o=>o.dispose());continue}const a=new At(r,n.material);a.castShadow=n.cast,a.receiveShadow=n.receive,a.renderOrder=n.order,i.add(a),n.list.forEach(o=>o.removeFromParent()),s.forEach(o=>o.dispose())}}const Vc={garage:{code:"GW-01",name:"GOODWORK 古德車房",en:"AUTO ATELIER · MAIN STAGE",category:"门店资产",tags:["双层玻璃幕墙","金边主招牌","报销主入口"],desc:"古德車房是整个工作台的叙事核心：一层是举升工位与接待区，二层是调度与归档办公区。点击幕墙将触发三段缓动运镜，场景虚化后直接进入报销申请。",specs:[["建筑面积","286 m²"],["建筑层数","2F / 9.4 m"],["维修工位","4 POSTS"],["启用年份","2016"]],docs:[["01","门店租赁结算单","GW-2026-10-118","待归档"],["02","举升机保养工单","GW-2026-11-082","已验真"]],amount:12800,preset:{category:"门店运营",entity:"GOODWORK 古德車房",vendor:"古德車房设备服务部",cost:"GW-STORE-01 · 门店运营",note:"门店一层举升机液压系统季度保养，含密封件更换与安全复检。"}},finance:{code:"GW-02",name:"财务室 · FINANCE",en:"REVIEW & TREASURY",category:"建筑设施",tags:["二级审批","付款排程","场景审批"],desc:"财务室承担全部场景单据的复核、预算占用与付款排程。夜间窗口保留暖光，苏禾在此完成 NPC 任务链的最终审批。",specs:[["工位数量","6 DESKS"],["在办单据","12"],["审批时效","1.8 h"],["系统","SCENE→ERP"]],docs:[["01","夜间付款排程表","FIN-2026-1122","处理中"],["02","门店费用月报","FIN-2026-11-M","已生成"]],amount:6400,preset:{category:"水电与物业",entity:"财务室",vendor:"城市物业管理处",cost:"GW-FIN-02 · 财务共享",note:"财务室夜间照明与空调延时服务费，含季度能耗分摊。"}},warehouse:{code:"GW-03",name:"仓储中心 · DEPOT",en:"PARTS & LOGISTICS",category:"建筑设施",tags:["配件入库","耗材领用","配送调度"],desc:"仓储中心负责配件、耗材的入库与领用。配送车阿凯从这里出发，把票据与配件送往门店和宿舍。",specs:[["仓储面积","168 m²"],["库位","212"],["今日出库","38 件"],["盘点状态","已同步"]],docs:[["01","配件采购入库单","DEP-2026-11-071","待校验"],["02","耗材领用明细","DEP-2026-11-064","已归档"]],amount:18600,preset:{category:"设备采购",entity:"仓储中心",vendor:"华东汽配供应链",cost:"GW-DEPOT-03 · 仓储物流",note:"制动片与滤芯季度补货，共 42 个 SKU，已验收入库。"}},dorm:{code:"GW-04",name:"员工宿舍 · DORM",en:"STAFF RESIDENCE",category:"建筑设施",tags:["员工保障","水电分摊","夜间值守"],desc:"员工宿舍为夜班技师与仓储同事提供轮班休息。宿舍水电、物业与生活物料费用按月归集，形成稳定的保障类报销。",specs:[["房间数","12 ROOMS"],["入住率","83%"],["本月水电","¥ 9,200"],["值守","24 h"]],docs:[["01","宿舍水电结算单","DOR-2026-11-014","已验真"],["02","生活物料清单","DOR-2026-11-009","待归档"]],amount:9200,preset:{category:"水电与物业",entity:"员工宿舍",vendor:"员工生活服务中心",cost:"GW-DORM-04 · 员工保障",note:"员工宿舍本月水电与物业分摊，12 间房，含夜班公共区域照明。"}},sign:{code:"GW-05",name:"金边主招牌",en:"MONUMENT SIGN",category:"标识资产",tags:["3000K 暖光","亚克力发光字","夜间识别"],desc:"主招牌以 10.4 米金边灯箱承载双品牌识别，暖白发光字在夜雾中形成门店第一视觉锚点。灯箱变压器与亚克力面板按季度计提维护。",specs:[["尺寸","10.4 × 2.15 m"],["色温","3000 K"],["光源","LED 模组 × 18"],["上次维护","2026-09-08"]],docs:[["01","招牌光衰检测报告","SGN-2026-09-02","已验真"],["02","发光字维护报价","SGN-2026-11-01","待审批"]],amount:4800,preset:{category:"门店运营",entity:"GOODWORK 古德車房",vendor:"城市光影标识工程",cost:"GW-STORE-01 · 门店运营",note:"主招牌 LED 模组更换与亚克力面板抛光，恢复夜间识别亮度。"}},lightbox:{code:"GW-06",name:"竖式灯箱",en:"VERTICAL LIGHTBOX",category:"标识资产",tags:["5.6 m 竖向","双面发光","古德車房"],desc:"竖式灯箱贴近入口右侧结构柱，以纵向排列的「古德車房」四字强化远距识别。灯箱内部走线独立，可单独计量维护费用。",specs:[["高度","5.6 m"],["面板","双面亚克力"],["功率","220 W"],["回路","SGN-B2"]],docs:[["01","灯箱电气检测单","SGN-2026-10-06","已验真"],["02","季度电费分摊","SGN-2026-11-03","处理中"]],amount:3200,preset:{category:"门店运营",entity:"GOODWORK 古德車房",vendor:"城市光影标识工程",cost:"GW-STORE-01 · 门店运营",note:"竖式灯箱季度电气检测与双面面板清洁，含镇流器巡检。"}},blade:{code:"GW-07",name:"双面侧招",en:"BLADE SIGN",category:"标识资产",tags:["侧向识别","双面灯箱","巷道导视"],desc:"双面侧招垂直于主立面伸出，服务侧向车流与巷道行人。夜间与主招牌形成层次，是门店导视系统的第三层。",specs:[["外挑","2.9 m"],["可视距离","60 m"],["光源","LED × 6"],["安装","2024-05"]],docs:[["01","侧招支架探伤报告","SGN-2026-08-04","已验真"],["02","面板更换工单","SGN-2026-10-11","已归档"]],amount:2600,preset:{category:"门店运营",entity:"GOODWORK 古德車房",vendor:"城市光影标识工程",cost:"GW-STORE-01 · 门店运营",note:"侧招支架防腐处理与双面灯箱面板更换，含高空作业费。"}},liftCar:{code:"GW-08",name:"举升机与复古轿跑",en:"LIFTED RETRO COUPE",category:"维修设备",tags:["双柱液压","在修车辆","保养科目"],desc:"一层工位的双柱液压举升机托起一台奶油色复古轿跑，这是全场景最亮的视觉焦点。液压油、密封件与安全复检费用按月归集。",specs:[["举升高度","1.30 m"],["额定载荷","3.2 t"],["车辆状态","液压复检"],["责任技师","郑野"]],docs:[["01","液压系统保养单","LFT-2026-11-021","待归档"],["02","安全复检记录","LFT-2026-10-018","已验真"]],amount:12800,preset:{category:"设备维修与保养",entity:"GOODWORK 古德車房",vendor:"古德車房设备服务部",cost:"GW-STORE-01 · 门店运营",note:"双柱举升机液压油更换、密封件保养与额定载荷安全复检。"}},ticketBox:{code:"GW-09",name:"票据箱",en:"TICKET DROP",category:"业务设施",tags:["票据归集","任务起点","扫码验真"],desc:"票据箱是 NPC 任务链的起点。工单、发票与过路费凭条在此归集，林晓取票后前往审批终端发起场景单据。",specs:[["待归集","12 张"],["今日已取","06 次"],["验真方式","OCR + 电子签"],["联动","取票任务"]],docs:[["01","今日票据清单","TCK-2026-11-22","待归集"],["02","OCR 验真日志","TCK-2026-11-22-L","实时"]],amount:0,amountNote:"待归集 12 张票据",preset:{category:"门店运营",entity:"GOODWORK 古德車房",vendor:"场景票据归集",cost:"GW-STORE-01 · 门店运营",note:"归集门店夜间工单与发票，发起批量报销。"}},terminal:{code:"GW-10",name:"审批终端",en:"APPROVAL TERMINAL",category:"业务设施",tags:["在线审批","人脸识别","状态同步"],desc:"审批终端把场景动作转成业务流：员工刷卡、人脸核验、选择单据，审批状态实时回写右上角的通道。NPC 任务的「提交」节点在这里完成。",specs:[["在线审批","08 单"],["平均响应","0.8 s"],["核验方式","工号 + 人脸"],["终端编号","TRM-02"]],docs:[["01","终端审批流水","TRM-2026-11-22","实时"],["02","设备巡检记录","TRM-2026-11-01","已验真"]],amount:0,amountNote:"在线单据 8 单",preset:{category:"设备采购",entity:"GOODWORK 古德車房",vendor:"场景智能终端",cost:"GW-STORE-01 · 门店运营",note:"审批终端年度维保与耗材更换。"}},parking:{code:"GW-11",name:"停车指引牌",en:"PARKING SIGN",category:"门店设施",tags:["停车导视","月租车位","夜间反光"],desc:"门前停车指引牌引导客户进入侧巷车位。停车位月租与导视牌维护归入门店运营费用，由系统按车位数量自动分摊。",specs:[["车位","6"],["月租","¥ 2,400"],["反光等级","IV 类"],["维护周期","季度"]],docs:[["01","车位月租结算单","PRK-2026-11-006","已验真"],["02","导视牌维护单","PRK-2026-09-012","已归档"]],amount:2400,preset:{category:"水电与物业",entity:"GOODWORK 古德車房",vendor:"城市停车管理",cost:"GW-STORE-01 · 门店运营",note:"门前 6 个客户车位月度租金，含导视牌反光维护。"}},lamp:{code:"GW-12",name:"门前路灯",en:"STREET LAMPS",category:"能源设施",tags:["钠灯暖光","夜间照明","能耗计量"],desc:"五盏暖色路灯构成门店前的安全照明带，也是湿柏油上最长的那几道金色倒影。照明电费与灯头维护按季度结算。",specs:[["灯杆","5 × 6.4 m"],["色温","2700 K"],["总功率","1.1 kW"],["本月电费","¥ 1,860"]],docs:[["01","路灯电费单","LMP-2026-11-031","已验真"],["02","灯头维护记录","LMP-2026-10-007","已归档"]],amount:1860,preset:{category:"水电与物业",entity:"GOODWORK 古德車房",vendor:"城市照明管理处",cost:"GW-STORE-01 · 门店运营",note:"门前 5 盏路灯季度电费与灯头清洁维护。"}},truck:{code:"GW-13",name:"配送车",en:"DELIVERY VAN",category:"运输资产",tags:["配件配送","里程核算","夜间班次"],desc:"配送车承担门店与仓储中心之间的夜间配件转运。里程、过路费与保养费用由车载终端自动回传，形成差旅交通类报销。",specs:[["今日里程","86 km"],["配送单","12"],["油耗","9.4 L/100km"],["司机","阿凯"]],docs:[["01","夜间配送里程单","VAN-2026-11-22","实时"],["02","车辆保养发票","VAN-2026-10-014","已验真"]],amount:5600,preset:{category:"差旅与交通",entity:"仓储中心",vendor:"城市油品服务",cost:"GW-DEPOT-03 · 仓储物流",note:"配送车夜间班次燃油、过路费与基础保养，按里程分摊。"}},trees:{code:"GW-14",name:"行道树阵",en:"STREET TREES",category:"景观资产",tags:["四季植被","绿化养护","覆雪形态"],desc:"六棵行道树随季节改变色彩，冬季树冠会覆上一层薄雪。绿化养护、修剪与补植费用按季度形成景观类报销。",specs:[["乔木","6 棵"],["树种","香樟 / 朴树"],["养护周期","季度"],["当前形态","季节同步"]],docs:[["01","绿化养护季度单","TRE-2026-Q4-01","待审批"],["02","补植验收单","TRE-2026-09-004","已验真"]],amount:3200,preset:{category:"水电与物业",entity:"GOODWORK 古德車房",vendor:"城市绿化养护中心",cost:"GW-STORE-01 · 门店运营",note:"门前 6 棵行道树季度修剪、病虫害防治与冬季防冻处理。"}},workbench:{code:"GW-15",name:"维修工作台",en:"WORKBENCH",category:"维修设备",tags:["工具墙","耗材领用","焊接工位"],desc:"工作台背靠整面工具墙，焊接火花在玻璃后明灭。砂轮片、焊丝、手套等耗材按月领用，是金额最碎但频次最高的报销科目。",specs:[["台面","2.6 m"],["工具位","48"],["焊接工位","1"],["本月耗材","¥ 4,600"]],docs:[["01","耗材领用明细","WRK-2026-11-038","待归档"],["02","工具校准记录","WRK-2026-10-022","已验真"]],amount:4600,preset:{category:"耗材与办公",entity:"GOODWORK 古德車房",vendor:"工业耗材直采",cost:"GW-STORE-01 · 门店运营",note:"维修工位本月焊接耗材、砂轮片与防护手套领用。"}},tires:{code:"GW-16",name:"轮胎架",en:"TIRE STACK",category:"库存资产",tags:["轮胎库存","以旧换新","安全检测"],desc:"轮胎架存放待装与回收轮胎，胎压与磨损数据同步到工单。轮胎采购与回收处置费用通过库存系统生成采购类报销。",specs:[["库存","18 条"],["规格","225/45 R18"],["安全库存","12 条"],["本月更换","9 条"]],docs:[["01","轮胎采购入库单","TIR-2026-11-016","待校验"],["02","旧胎回收单","TIR-2026-11-009","已归档"]],amount:7800,preset:{category:"设备采购",entity:"GOODWORK 古德車房",vendor:"轮胎供应链",cost:"GW-STORE-01 · 门店运营",note:"高性能轮胎 9 条采购补库，含旧胎环保回收处置。"}},reception:{code:"GW-17",name:"前台接待区",en:"RECEPTION",category:"门店资产",tags:["客户接待","物料补给","夜间值守"],desc:"前台接待区为客户提供等候、咖啡与工单确认。饮品、清洁与印刷物料构成门店小额高频报销，系统按周自动归集。",specs:[["接待位","2"],["本月物料","¥ 2,200"],["咖啡机","1"],["客诉率","0.4%"]],docs:[["01","接待物料清单","RCP-2026-11-021","待归档"],["02","咖啡机租赁单","RCP-2026-10-008","已验真"]],amount:2200,preset:{category:"耗材与办公",entity:"GOODWORK 古德車房",vendor:"门店物料供应",cost:"GW-STORE-01 · 门店运营",note:"接待区咖啡豆、瓶装水与工单印刷物料补充。"}}},T_={"npc-lin":{code:"NPC-01",name:"林晓 · 报销专员",en:"CLAIMS SPECIALIST",category:"NPC 员工",tags:["取票任务","提交任务","场景巡游"],desc:"林晓负责从票据箱取票、到审批终端提交单据，再把审批包送到财务室。她的任务链对应右下角的流程指示，完成每一站都会点亮节点。",specs:[["工号","GW-0142"],["角色","报销专员"],["当前任务","取票 → 提交 → 审批"],["寻路","A* 32×22"]],docs:[["01","今日取票任务","TSK-2026-11-22-01","执行中"],["02","提交回执","TSK-2026-11-22-02","待生成"]],amount:0,amountNote:"任务执行中",npc:!0},"npc-zheng":{code:"NPC-02",name:"郑野 · 机修主管",en:"WORKSHOP LEAD",category:"NPC 员工",tags:["设备巡检","举升机","库房周转"],desc:"郑野在举升机与工作台之间巡检，遇到障碍会自动重规划路径。他的巡检记录会直接关联设备维修类报销。",specs:[["工号","GW-0087"],["角色","机修主管"],["巡检点","举升机 / 工作台"],["寻路","A* 32×22"]],docs:[["01","举升机巡检单","TSK-2026-11-22-04","执行中"],["02","工具校准单","TSK-2026-11-22-05","待归档"]],amount:0,amountNote:"巡检执行中",npc:!0},"npc-su":{code:"NPC-03",name:"苏禾 · 财务复核",en:"FINANCE REVIEWER",category:"NPC 员工",tags:["二级审批","付款排程","财务室"],desc:"苏禾从财务室走到审批终端，完成场景单据的二级复核。点击她可以查看当前审批队列与付款排程状态。",specs:[["工号","GW-0219"],["角色","财务复核"],["待办","12 单"],["寻路","A* 32×22"]],docs:[["01","今日审批队列","TSK-2026-11-22-06","处理中"],["02","付款排程","TSK-2026-11-22-07","排队"]],amount:0,amountNote:"待审批 12 单",npc:!0},"npc-kai":{code:"NPC-04",name:"阿凯 · 仓储配送",en:"DEPOT COURIER",category:"NPC 员工",tags:["仓储动线","配件配送","宿舍补给"],desc:"阿凯推着配件箱往返于仓储中心与宿舍之间，是场景里移动距离最长的一名 NPC，负责把耗材和票据送达下一个节点。",specs:[["工号","GW-0164"],["角色","仓储配送"],["今日里程","86 km"],["寻路","A* 32×22"]],docs:[["01","配送任务单","TSK-2026-11-22-08","执行中"],["02","宿舍补给单","TSK-2026-11-22-09","待签收"]],amount:0,amountNote:"配送执行中",npc:!0}};function w_(i,t,e={}){const n=!!e.isMobile,s={glassMats:[],foliageMats:[],snowMats:[],groundSnowMats:[],skyUniforms:null,moonSprite:null,moonHalo:null,starsMat:null,streaks:[],cones:[],nebulaMats:[],labelEntries:[],roadMat:null,sidewalkMat:null},r=[],a=new Map,o=[],l=[];let h=!0,c=null,u=new C;const d=M_();d.mapping=jr;const p=new Yo(t),_=p.fromEquirectangular(d);i.environment=_.texture,i.environmentIntensity=.55,d.dispose(),p.dispose();const v=p_(),g=m_(),m=g_(),w=f_(),T=d_(),f={gold:new ee({color:11636047,metalness:1,roughness:.3,envMapIntensity:1.8,emissive:2233863,emissiveIntensity:.5}),goldBright:new ee({color:14268536,metalness:1,roughness:.26,envMapIntensity:1.9,emissive:2759688,emissiveIntensity:.5}),darkMetal:new ee({color:1777704,metalness:.85,roughness:.38,envMapIntensity:1.2}),black:new ee({color:461326,metalness:.5,roughness:.55}),steel:new ee({color:7041916,metalness:1,roughness:.28,envMapIntensity:1.6}),concrete:new ee({map:v,color:11976392,roughness:.9,metalness:.08}),concreteDark:new ee({map:v,color:8226191,roughness:.92,metalness:.05}),stone:new ee({map:v,color:9870500,roughness:.82,metalness:.1}),slab:new ee({color:3554373,roughness:.75,metalness:.2}),brick:new ee({map:g,color:12632771,roughness:.88,metalness:.06}),corrugated:new ee({map:m,color:11121854,roughness:.72,metalness:.35}),interiorFloor:new ee({color:5327680,roughness:.38,metalness:.35,envMapIntensity:1.1}),wood:new ee({color:6113588,roughness:.7,metalness:.1}),glass:new Yr({color:11128276,metalness:.1,roughness:.055,transparent:!0,opacity:.16,side:nn,depthWrite:!1,envMapIntensity:2.6,clearcoat:1,clearcoatRoughness:.05}),carGlass:new Yr({color:791580,metalness:.6,roughness:.06,envMapIntensity:2.2,clearcoat:1}),rubber:new ee({color:1447964,roughness:.9,metalness:.05}),chrome:new ee({color:14147045,metalness:1,roughness:.12,envMapIntensity:2.2}),warmGlow:new Wt({color:16769204,toneMapped:!1}),warmGlowSoft:new Wt({color:16757867,toneMapped:!1}),coolGlow:new Wt({color:9430744,toneMapped:!1}),redGlow:new Wt({color:16731453,toneMapped:!1}),headlight:new Wt({color:16773327,toneMapped:!1}),screen:new Wt({map:zc("approval"),toneMapped:!1}),monitor:new Wt({map:zc("lift"),toneMapped:!1}),white:new ee({color:14209734,roughness:.65,metalness:.05}),redPaint:new ee({color:9380892,metalness:.35,roughness:.42}),creamPaint:new ee({color:14997696,metalness:.55,roughness:.3,envMapIntensity:1.6}),canopyDark:new ee({color:1119515,metalness:.4,roughness:.6}),hedge:new ee({color:3032116,roughness:.95}),bark:new ee({color:3813414,roughness:.95}),planter:new ee({color:3159099,roughness:.8,metalness:.2})};s.glassMats.push(f.glass),s.roadMat=null;const D=new ee({color:15134454,roughness:.88,metalness:.02,transparent:!0,opacity:0,depthWrite:!1});s.snowMats.push({mat:D,base:.92});const R=new Xd(8956102,1185050,.9);i.add(R);const P=new Kd(2899536,.5);i.add(P);const I=new $d(12178152,2.15);I.position.set(-24,30,18),I.target.position.set(-2,0,2),I.castShadow=!0,I.shadow.mapSize.set(1024,1024),I.shadow.camera.left=-38,I.shadow.camera.right=38,I.shadow.camera.top=32,I.shadow.camera.bottom=-26,I.shadow.camera.near=1,I.shadow.camera.far=95,I.shadow.bias=-8e-4,I.shadow.normalBias=.025,i.add(I,I.target);const x=new ci(16757352,72,20,2);x.position.set(-1.5,3.4,-2.2),i.add(x);const S=new ci(16761474,38,16,2);S.position.set(-.5,7.4,-1),i.add(S);const U=new ci(16765338,52,13,2);U.position.set(3,7.6,.6),i.add(U);const q=new ci(16758644,44,13,2);q.position.set(4.6,2.6,1),i.add(q);const V=new ci(16760954,20,10,2);V.position.set(-1.5,6.6,5.4),i.add(V);const tt=new ci(16761738,46,17,2);tt.position.set(1.8,3.9,6.2),i.add(tt);const rt=new ci(16758904,34,17,2);rt.position.set(-6.5,5.5,10.6),i.add(rt);const Z=new ci(16758904,34,17,2);Z.position.set(14.2,5.5,10.6),i.add(Z),i.fog=new cl(659738,.0092);const lt={uTop:{value:new Rt(330260)},uMid:{value:new Rt(792872)},uHorizon:{value:new Rt(2568509)},uGlow:{value:new Rt(9071164)},uTime:{value:0}},$=new Re({side:sn,depthWrite:!1,fog:!1,uniforms:lt,vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      varying vec3 vDir;
      uniform vec3 uTop, uMid, uHorizon, uGlow;
      uniform float uTime;
      void main(){
        float h = clamp(vDir.y, -0.3, 1.0);
        vec3 col = mix(uHorizon, uMid, smoothstep(-0.02, 0.32, h));
        col = mix(col, uTop, smoothstep(0.28, 0.92, h));
        float band = sin(vDir.x * 3.1 + uTime * 0.02) * 0.5 + 0.5;
        float band2 = sin(vDir.x * 5.7 - vDir.z * 2.1 + uTime * 0.014) * 0.5 + 0.5;
        float aur = smoothstep(0.3, 0.52, h) * (1.0 - smoothstep(0.58, 0.9, h));
        col += vec3(0.07, 0.27, 0.3) * aur * band * 0.34;
        col += vec3(0.24, 0.12, 0.32) * aur * band2 * 0.16;
        float haze = pow(max(0.0, 1.0 - abs(h) * 6.5), 3.0);
        col += uGlow * haze * 0.22;
        gl_FragColor = vec4(col, 1.0);
      }`});s.skyUniforms=lt;const xt=new At(new pi(160,40,24),$);xt.renderOrder=-20,i.add(xt);{const b=n?380:680,N=new Te,B=new Float32Array(b*3),W=fn(1123);for(let ht=0;ht<b;ht++){const Ut=W()*Math.PI*2,Ht=Math.acos(.08+W()*.92),wt=145;B[ht*3]=Math.sin(Ht)*Math.cos(Ut)*wt,B[ht*3+1]=Math.cos(Ht)*wt+6,B[ht*3+2]=Math.sin(Ht)*Math.sin(Ut)*wt}N.setAttribute("position",new se(B,3));const j=new Ph({color:13228264,size:.7,sizeAttenuation:!0,transparent:!0,opacity:.8,map:_n(),alphaTest:.004,depthWrite:!1,blending:De,fog:!1,toneMapped:!1});s.starsMat=j;const it=new Ni(N,j);it.frustumCulled=!1,i.add(it)}{const b=_n();s.moonSprite=us(b,15134970,10,.9),s.moonSprite.position.set(27,27.5,-98),i.add(s.moonSprite),s.moonHalo=us(b,10468824,42,.2),s.moonHalo.position.copy(s.moonSprite.position),i.add(s.moonHalo)}{const b=_n(),N=(B,W,j,it)=>{const ht=new Wt({map:b,color:B,transparent:!0,opacity:it,blending:De,depthWrite:!1,fog:!1,toneMapped:!1}),Ut=new At(Ce,ht);return Ut.scale.set(W[0],W[1],1),Ut.position.set(j[0],j[1],j[2]),Ut.renderOrder=-12,i.add(Ut),s.nebulaMats.push({mat:ht,base:it,phase:Math.random()*6.28}),Ut};N(1923690,[190,70],[-40,58,-125],.28),N(4861795,[150,52],[55,42,-120],.2)}{const b=(N,B,W,j,it,ht,Ut)=>{const Ht=Le(2048,512,(Xt,st,re)=>{const xe=fn(N);Xt.clearRect(0,0,st,re);let Ae=0;for(;Ae<st;){const ln=30+xe()*110,ve=90+xe()*330,Ne=re-ve;Xt.fillStyle="rgba(9,13,20,0.94)",Xt.fillRect(Ae,Ne,ln-2,ve),Xt.fillStyle="rgba(112,146,172,0.45)",Xt.fillRect(Ae,Ne,ln-2,2),Xt.fillStyle="rgba(80,120,150,0.1)",Xt.fillRect(Ae,Ne,2,ve);for(let qe=Ne+15;qe<re-10;qe+=11)for(let Be=Ae+7;Be<Ae+ln-7;Be+=11)xe()>.74&&(Xt.fillStyle=xe()>.42?"rgba(255,196,126,0.55)":"rgba(115,208,216,0.38)",Xt.fillRect(Be,qe,2,2.5));xe()>.72&&(Xt.strokeStyle="rgba(20,28,36,0.9)",Xt.lineWidth=2,Xt.beginPath(),Xt.moveTo(Ae+ln/2,Ne),Xt.lineTo(Ae+ln/2,Ne-22),Xt.stroke(),Xt.fillStyle="rgba(255,96,78,0.45)",Xt.fillRect(Ae+ln/2-1,Ne-23,2,2)),Ae+=ln+8+xe()*20}},{anisotropy:8}),wt=new Wt({map:Ht,color:B,transparent:!0,opacity:Ut,depthWrite:!1,fog:!1,toneMapped:!1}),vt=new At(Ce,wt);vt.scale.set(W,j,1),vt.position.set(0,ht,it),vt.renderOrder=-8,i.add(vt)};b(334,12110297,170,40,-72,14,.42),b(887,8558765,220,48,-104,18,.3)}{const b=Le(2048,512,(W,j,it)=>{const ht=W.createLinearGradient(0,0,0,it);ht.addColorStop(0,"rgba(20,40,58,0)"),ht.addColorStop(.42,"rgba(32,60,80,0.16)"),ht.addColorStop(.72,"rgba(55,75,88,0.3)"),ht.addColorStop(.88,"rgba(96,84,58,0.28)"),ht.addColorStop(1,"rgba(20,28,36,0)"),W.fillStyle=ht,W.fillRect(0,0,j,it);const Ut=fn(5501);for(let Ht=0;Ht<2600;Ht++){const wt=Ut()*j,vt=it*.6+Ut()*it*.28;W.fillStyle=Ut()>.7?"rgba(255,190,120,0.35)":"rgba(120,190,200,0.18)",W.fillRect(wt,vt,1+Ut()*2,1)}},{anisotropy:4}),N=new Wt({map:b,transparent:!0,opacity:.32,blending:De,depthWrite:!1,fog:!1,toneMapped:!1}),B=new At(Ce,N);B.scale.set(230,52,1),B.position.set(0,15,-95),B.renderOrder=-9,i.add(B)}{const b=Le(2048,512,(W,j,it)=>{const ht=fn(771);W.clearRect(0,0,j,it),W.fillStyle="rgba(5,9,14,0.95)",W.beginPath(),W.moveTo(0,it);let Ut=0;for(;Ut<j;){const Ht=it*(.35+ht()*.45);W.lineTo(Ut+40,it-Ht*.55),W.lineTo(Ut+110,it-Ht),W.lineTo(Ut+180,it-Ht*.5),Ut+=190+ht()*80}W.lineTo(j,it),W.closePath(),W.fill()},{anisotropy:4}),N=new Wt({map:b,transparent:!0,opacity:.8,depthWrite:!1,fog:!1,toneMapped:!1}),B=new At(Ce,N);B.scale.set(240,60,1),B.position.set(-10,14,-140),B.renderOrder=-10,i.add(B)}const bt=new ie;i.add(bt),Qe(bt,new ee({color:395534,roughness:.9}),[260,260],[0,-.09,0]);const Bt=new Yr({map:T,color:15002609,roughness:.34,metalness:.24,clearcoat:1,clearcoatRoughness:.1,envMapIntensity:1.35,emissive:1780538,emissiveMap:T,emissiveIntensity:.5});s.roadMat=Bt;const Qt=Qe(bt,Bt,[90,18],[2,.012,19]);Qt.receiveShadow=!0;{const b=new At(Ce,new Wt({map:T,color:9086909,transparent:!0,opacity:.2,blending:De,depthWrite:!1,toneMapped:!1}));b.scale.set(90,18,1),b.rotation.x=-Math.PI/2,b.position.set(2,.026,19),i.add(b);const N=new At(Ce,new Wt({map:_n(),color:5074828,transparent:!0,opacity:.12,blending:De,depthWrite:!1,toneMapped:!1}));N.scale.set(34,20,1),N.rotation.x=-Math.PI/2,N.position.set(0,.032,17),i.add(N)}const de=new ee({map:w,color:12172997,roughness:.5,metalness:.14,envMapIntensity:.85});s.sidewalkMat=de;const nt=Qe(bt,de,[90,7.5],[2,.14,6.75]);nt.receiveShadow=!0,A(bt,f.stone,[90,.3,.34],[2,.13,10.58],{cast:!1}),A(bt,f.concreteDark,[90,.12,.2],[2,.28,10.42],{cast:!1});{const b=__(),N=new Wt({map:b,color:14674419,transparent:!0,opacity:0,depthWrite:!1});s.groundSnowMats.push({mat:N,base:.72});const B=Qe(bt,N,[90,7.4],[2,.16,6.75]);B.renderOrder=2;const W=new Wt({map:b,color:13227745,transparent:!0,opacity:0,depthWrite:!1});s.groundSnowMats.push({mat:W,base:.2});const j=Qe(bt,W,[90,17.6],[2,.03,19]);j.renderOrder=2}{const b=new ee({color:395792,roughness:.05,metalness:.95,envMapIntensity:2.2,transparent:!0,opacity:.85});[[-13,15.5,4.2,1.1],[10.2,23.2,5.4,1.4],[23,14,3.4,.9],[-3.4,24.5,2.5,.8]].forEach(([N,B,W,j])=>{const it=new At(new sa(1,32),b);it.rotation.x=-Math.PI/2,it.scale.set(W,j,1),it.position.set(N,.022,B),bt.add(it)})}const mt=v_();function Lt(b,N,B,W,j,it){const ht=new Wt({map:mt,color:j,transparent:!0,opacity:it,blending:De,depthWrite:!1,toneMapped:!1}),Ut=new At(Ce,ht);Ut.scale.set(B,W,1),Ut.rotation.x=-Math.PI/2,Ut.position.set(b,.04,N),i.add(Ut),s.streaks.push({mat:ht,base:it,phase:Math.random()*6.28})}Lt(-1.2,16.2,10.5,12.5,16761975,.42),Lt(-1.2,19.8,8.2,8,16766874,.22),Lt(5.8,13.4,2.4,6.5,16760943,.3),Lt(-18.8,13.2,6.4,8.5,6740172,.16),Lt(15.2,12.6,7,7.5,16757867,.16),Lt(27,13,5,7,16760954,.14);{const b=_n(),N=new At(Ce,new Wt({map:b,color:16760186,transparent:!0,opacity:.24,blending:De,depthWrite:!1,toneMapped:!1}));N.rotation.x=-Math.PI/2,N.scale.set(11,7,1),N.position.set(1.2,.17,6.6),i.add(N);const B=new At(Ce,new Wt({map:b,color:7657420,transparent:!0,opacity:.1,blending:De,depthWrite:!1,toneMapped:!1}));B.rotation.x=-Math.PI/2,B.scale.set(8,5,1),B.position.set(-18.5,.16,5.6),i.add(B)}{const b=_n(),N=us(b,4086896,120,.32);N.position.set(0,9,-48),i.add(N)}const yt={approval:f.screen,lift:f.monitor},Y=new ie;Y.position.set(-1,0,-1.5),i.add(Y);const gt=new ie;Y.add(gt);const Gt=15,ue=9,jt=9.4;{A(gt,f.stone,[Gt+.3,.32,ue+.4],[0,.16,0]),A(gt,f.interiorFloor,[Gt-.4,.08,ue-.3],[0,.35,0],{cast:!1}),A(gt,f.concreteDark,[Gt,jt,.36],[0,jt/2,-4.32]),A(gt,f.concreteDark,[.36,jt,ue],[-7.32,jt/2,0]),A(gt,f.concreteDark,[.36,jt,3.3],[7.32,jt/2,-2.55]),A(gt,f.slab,[Gt+.1,.34,ue],[0,4.62,0]),A(gt,f.slab,[Gt+.6,.38,ue+.6],[0,9.2,0]),A(gt,f.gold,[Gt+.7,.08,.1],[0,9.42,4.85]),A(gt,f.gold,[Gt+.7,.08,.1],[0,9.42,-4.85]),A(gt,f.gold,[.1,.08,ue+.7],[Gt/2+.34,9.42,0]),A(gt,f.gold,[.1,.08,ue+.7],[-Gt/2-.34,9.42,0]),A(gt,f.gold,[Gt+.5,.06,.12],[0,4.79,4.55]),A(gt,f.darkMetal,[Gt+.5,.1,.16],[0,4.72,4.6]),A(gt,f.stone,[Gt-.2,.55,.2],[0,.62,4.44]),[-7.32,-4.88,-2.44,0,2.44,4.88,7.32].forEach(st=>{A(gt,f.darkMetal,[.18,9.1,.2],[st,4.55,4.42]),A(gt,f.gold,[.055,9.05,.22],[st+.1,4.55,4.47])});const b=A(gt,f.glass,[Gt-.5,3.95,.03],[0,2.42,4.45],{cast:!1,receive:!1});b.userData.glass=!0;const N=A(gt,f.glass,[Gt-.5,3.85,.03],[0,7.02,4.45],{cast:!1,receive:!1});N.userData.glass=!0;const B=A(gt,f.glass,[.03,3.8,4.2],[7.33,7,2.35],{cast:!1,receive:!1});B.userData.glass=!0;const W=new Wt({color:10471636,transparent:!0,opacity:.055,blending:De,depthWrite:!1,side:nn});[-4.2,1.1,5.2].forEach((st,re)=>{const xe=new At(Ce,W);xe.scale.set(1.2+re*.4,8.4,1),xe.position.set(st,4.8,4.49),xe.rotation.z=.34,Y.add(xe)}),A(gt,f.goldBright,[.1,4.15,.14],[.95,2.4,4.51]),A(gt,f.goldBright,[.1,4.15,.14],[3.35,2.4,4.51]),A(gt,f.goldBright,[2.5,.08,.14],[2.15,4.4,4.51]),A(gt,f.darkMetal,[.05,4,.1],[2.15,2.35,4.53]),A(gt,f.gold,[.035,.7,.06],[1.45,1.9,4.56]),A(gt,f.gold,[.035,.7,.06],[2.85,1.9,4.56]),A(gt,f.canopyDark,[4.6,.16,1.5],[2.1,3.68,5]),A(gt,f.gold,[4.66,.045,1.56],[2.1,3.78,5]);for(let st=0;st<3;st++)ae(gt,f.warmGlow,.09,.03,[.9+st*1.2,3.585,5.15],{cast:!1});A(gt,f.stone,[4.8,.16,1.8],[2.1,.1,5.4],{cast:!1}),A(gt,f.darkMetal,[1.5,.85,1.2],[-4.2,9.8,.6]),A(gt,f.steel,[1.1,.12,.9],[-4.2,10.25,.6]);for(let st=0;st<5;st++)A(gt,f.black,[.9,.018,.07],[-4.2,10.2,.24+st*.16],{cast:!1});A(gt,f.darkMetal,[1.1,.7,.9],[3.8,9.73,-1.6]),ae(gt,f.steel,.22,1.1,[5.6,10,1.6]),ae(gt,f.darkMetal,.26,.08,[5.6,10.53,1.6]);const j=f.warmGlow;[-3.4,.2,3.6].forEach(st=>{[-4.4,0,4.4].forEach(re=>{A(Y,j,[3.4,.045,.1],[re,4.42,st],{cast:!1})})}),[-4.4,0,4.4].forEach(st=>{A(Y,j,[3.4,.045,.1],[st,8.95,-.6],{cast:!1})}),[-1.4,2].forEach(st=>{ae(Y,f.gold,.012,.85,[st,3.9,-2.8],{cast:!1}),ae(Y,f.darkMetal,.22,.16,[st,3.44,-2.8],{cast:!1}),ae(Y,f.warmGlow,.18,.02,[st,3.35,-2.8],{cast:!1})});const it=new Wt({map:Hc("ground"),toneMapped:!1});Qe(gt,it,[14.4,4],[0,2.28,-4.125],[0,0,0]),A(Y,f.darkMetal,[8.2,2.9,.08],[-.6,2,-4.1],{cast:!1}),A(Y,f.wood,[8.2,.08,.16],[-.6,3.45,-4.08],{cast:!1});const ht=fn(552);for(let st=0;st<22;st++){const re=-4.3+st%11*.68,xe=2.9-Math.floor(st/11)*.9;ht()>.55?ae(Y,f.steel,.022,.3+ht()*.2,[re,xe,-4.04],{cast:!1}):A(Y,f.steel,[.06,.26,.03],[re,xe,-4.04],{cast:!1})}A(Y,f.darkMetal,[3.3,2.6,.5],[4.7,1.5,-3.9],{cast:!1});for(let st=0;st<4;st++)A(Y,f.steel,[3.1,.035,.46],[4.7,.45+st*.62,-3.88],{cast:!1});for(let st=0;st<8;st++){const re=3.5+st%4*.72,xe=.68+Math.floor(st/4)*.62;A(Y,st%2?f.wood:f.black,[.5,.32,.34],[re,xe,-3.85],{cast:!1})}for(let st=0;st<10;st++){const re=A(Y,f.darkMetal,[1.05,.12,.36],[-6.55,.45+st*.43,3.2-st*.37],{cast:!1});re.receiveShadow=!0,A(Y,f.gold,[1.08,.015,.03],[-6.55,.45+st*.43+.07,3.2-st*.37-.14],{cast:!1})}const Ut=f.darkMetal;A(Y,Ut,[.06,.32,4.1],[-7.08,1.9,1.55],{rx:-.84,cast:!1}),A(Y,Ut,[.06,1.1,.06],[-6.1,5.3,3.2],{cast:!1}),A(Y,f.gold,[.04,.04,4],[-6.08,5.1,1.6],{cast:!1,rx:.05});for(let st=0;st<10;st++)A(Y,f.gold,[.035,.85,.035],[-6.4+st*1.4,5.1,3.72],{cast:!1});A(Y,f.gold,[13.2,.045,.045],[-.1,5.52,3.72],{cast:!1}),A(Y,f.glass,[13.2,.7,.02],[-.1,5.08,3.7],{cast:!1,receive:!1}).userData.glass=!1,A(Y,f.wood,[3,.1,1.2],[-2,5.45,-.9],{cast:!1}),A(Y,f.darkMetal,[.08,.7,.08],[-3.3,5.05,-.9],{cast:!1}),A(Y,f.darkMetal,[.08,.7,.08],[-.7,5.05,-.9],{cast:!1}),A(Y,f.darkMetal,[.9,.55,.06],[-2.5,5.85,-1.1],{cast:!1}),Qe(Y,yt.lift,[.8,.5],[-2.5,5.85,-1.06],[0,0,0]),A(Y,f.darkMetal,[.85,.05,.6],[.9,5.5,-1.3],{cast:!1}),A(Y,f.wood,[.7,.06,.55],[.9,5.85,-1.3],{cast:!1}),A(Y,f.darkMetal,[2.6,1.9,.55],[4.6,6.4,-3.8],{cast:!1});for(let st=0;st<3;st++)A(Y,f.steel,[2.4,.03,.5],[4.6,5.75+st*.55,-3.78],{cast:!1});for(let st=0;st<6;st++)A(Y,st%2?f.creamPaint:f.wood,[.42,.28,.36],[3.6+st%3*.7,5.9+Math.floor(st/3)*.55,-3.75],{cast:!1});ae(Y,f.planter,.2,.35,[3.2,5.6,1.4],{cast:!1}),hs(Y,f.hedge,.32,[3.2,5.95,1.4],{cast:!1});const Ht=new Wt({color:16758645,transparent:!0,opacity:.14,blending:De,depthWrite:!1,side:nn});Qe(Y,Ht,[13.8,3.6],[0,7,4.3],[0,0,0]);const wt=new Wt({map:Hc("upper"),toneMapped:!1});Qe(gt,wt,[14.4,4],[0,6.9,-4.125],[0,0,0]);const vt=_n(),Xt=new Wt({map:vt,color:16758903,transparent:!0,opacity:.16,blending:De,depthWrite:!1,toneMapped:!1});[-5,0,5].forEach(st=>{const re=new At(Ce,Xt);re.scale.set(6,5,1),re.position.set(st,2.3,-3.9),Y.add(re);const xe=new At(Ce,Xt);xe.scale.set(6,5,1),xe.position.set(st,7,-3.9),Y.add(xe)}),[-4.5,0,4.5].forEach(st=>{ae(Y,f.gold,.012,.8,[st,8.55,-1.6],{cast:!1}),ae(Y,f.darkMetal,.2,.1,[st,8.12,-1.6],{cast:!1}),ae(Y,f.warmGlow,.16,.02,[st,8.05,-1.6],{cast:!1});const re=us(_n(),16763274,1.4,.5);re.position.set(st,8.02,-1.6),Y.add(re)}),[-5.7,5.7].forEach(st=>{A(Y,f.warmGlow,[.05,2.4,.05],[st,2.2,-3.98],{cast:!1})})}Fe(gt);{[-5.6,-2.55].forEach(vt=>{A(Y,f.darkMetal,[.3,3.9,.3],[vt,1.95,-1.4]),A(Y,f.gold,[.32,.1,.32],[vt,3.86,-1.4]),A(Y,f.gold,[.05,3.8,.05],[vt+.16,1.95,-1.4])}),A(Y,f.darkMetal,[3.35,.26,.28],[-4.07,3.78,-1.4]),A(Y,f.gold,[2.9,.05,.05],[-4.07,3.92,-1.4]),A(Y,f.darkMetal,[2.9,.14,.24],[-4.07,1.26,-3.1]),A(Y,f.darkMetal,[2.9,.14,.24],[-4.07,1.26,.3]),A(Y,f.gold,[2.7,.05,.08],[-4.07,1.34,-3.1]),ae(Y,f.steel,.09,1.2,[-4.07,1.8,-1.4]);const b=new ie;b.position.set(-4.07,1.32,-1.4),Y.add(b);const N=new di(1.92,.56,3.85,4,.2),B=new At(N,f.creamPaint);B.position.y=.66,B.castShadow=!0,B.receiveShadow=!0,b.add(B);const W=new At(new di(1.86,.26,3.6,3,.12),f.creamPaint);W.position.y=.42,b.add(W);const j=new At(new di(1.58,.56,1.95,4,.16),f.creamPaint);j.position.set(0,1.03,-.12),j.castShadow=!0,b.add(j);const it=new At(new di(1.5,.36,1.82,3,.1),f.carGlass);it.position.set(0,1.06,-.12),b.add(it);const ht=new At(new di(1.44,.12,1.5,3,.06),f.creamPaint);ht.position.set(0,1.31,-.18),b.add(ht),A(b,f.creamPaint,[1.76,.1,1.2],[0,.98,1.24],{cast:!1}),A(b,f.creamPaint,[1.76,.1,.72],[0,.99,-1.42],{cast:!1}),A(b,f.chrome,[1.9,.12,.14],[0,.5,1.94],{cast:!1}),A(b,f.chrome,[1.9,.12,.14],[0,.5,-1.94],{cast:!1}),A(b,f.chrome,[.05,.05,3.4],[.97,.7,0],{cast:!1}),A(b,f.chrome,[.05,.05,3.4],[-.97,.7,0],{cast:!1}),[-.62,.62].forEach(vt=>{hs(b,f.headlight,.13,[vt,.76,1.9],{cast:!1,sy:.9}),A(b,f.redGlow,[.26,.09,.04],[vt,.74,-1.92],{cast:!1})});for(let vt=0;vt<4;vt++)A(b,f.chrome,[.72,.018,.03],[0,.62+vt*.045,1.97],{cast:!1});A(b,f.goldBright,[.42,.14,.02],[0,.3,1.98],{cast:!1});const Ut=new An(.35,.35,.22,20),Ht=new An(.2,.2,.24,18);[-.96,.96].forEach(vt=>{[1.28,-1.32].forEach(Xt=>{const st=new At(Ut,f.rubber);st.rotation.z=Math.PI/2,st.position.set(vt,.36,Xt),st.castShadow=!0,b.add(st);const re=new At(Ht,f.chrome);re.rotation.z=Math.PI/2,re.position.set(vt*1.02,.36,Xt),b.add(re)})}),A(b,f.black,[1.8,.05,3.4],[0,.39,0],{cast:!1});const wt=new At(new di(1.48,.03,1.55,3,.06),D);wt.position.set(0,1.38,-.18),b.add(wt),Fe(b)}{const b=new ie;b.position.set(2.9,0,-3.55),Y.add(b),A(b,f.wood,[2.6,.1,.85],[0,1,0]),A(b,f.darkMetal,[.08,1,.08],[-1.2,.5,-.33]),A(b,f.darkMetal,[.08,1,.08],[1.2,.5,-.33]),A(b,f.darkMetal,[.08,1,.08],[-1.2,.5,.33]),A(b,f.darkMetal,[.08,1,.08],[1.2,.5,.33]),A(b,f.steel,[.42,.3,.3],[.85,1.2,.05]),A(b,f.darkMetal,[.36,.06,.26],[.85,1.36,.05]),A(b,f.screen,[.55,.36,.04],[-.55,1.3,-.2],{rx:-.1}),A(b,f.darkMetal,[.06,.3,.06],[-.55,1.08,-.2]),A(b,f.steel,[.22,.18,.2],[.2,1.16,.12],{cast:!1}),ae(b,f.steel,.035,.3,[.2,1.32,.12],{cast:!1});for(let W=0;W<5;W++)A(b,W%2?f.gold:f.steel,[.1,.05,.08],[-.9+W*.17,1.08,.25],{cast:!1});const N=new gl(.3,.15,10,20);[-6.5,-6.3,-5.9].forEach((W,j)=>{for(let it=0;it<3;it++){const ht=new At(N,f.rubber);ht.rotation.x=Math.PI/2,ht.position.set(W,.5+it*.2,2.4+j*.05),ht.castShadow=!0,Y.add(ht)}A(Y,f.darkMetal,[.8,.06,.8],[W,.4,2.4],{cast:!1})}),A(Y,f.redPaint,[1.2,1.35,.7],[5.6,1,1.7]),A(Y,f.darkMetal,[1.24,.06,.74],[5.6,1.71,1.7]);for(let W=0;W<5;W++)A(Y,f.black,[1.14,.015,.02],[5.6,.55+W*.22,2.06],{cast:!1}),A(Y,f.gold,[.4,.025,.03],[5.6,.62+W*.22,2.07],{cast:!1});[[5.1,2.03],[6.1,2.03],[5.1,1.37],[6.1,1.37]].forEach(([W,j])=>{ae(Y,f.black,.07,.06,[W,.33,j],{rz:Math.PI/2,cast:!1})});const B=new ie;B.position.set(4.4,0,-2.3),Y.add(B),A(B,f.wood,[2.6,.1,.7],[0,1.02,0]),A(B,f.darkMetal,[2.6,.95,.12],[0,.55,-.3]),A(B,f.stone,[2.7,.06,.78],[0,1.09,.02]),A(B,f.darkMetal,[.06,.95,.6],[-1.3,.55,0]),A(B,f.darkMetal,[.06,.95,.6],[1.3,.55,0]),A(B,f.darkMetal,[.62,.46,.05],[-.7,1.5,-.16],{rx:.08}),Qe(B,yt.lift,[.54,.38],[-.7,1.5,-.12],[0,0,0]),A(B,f.darkMetal,[.62,.46,.05],[.05,1.5,-.16],{rx:.08}),Qe(B,yt.approval,[.54,.38],[.05,1.5,-.12],[0,0,0]),A(B,f.darkMetal,[.34,.44,.3],[1,1.33,0],{cast:!1}),A(B,f.warmGlow,[.3,.05,.05],[1,1.31,.16],{cast:!1}),ae(B,f.steel,.05,.14,[.84,1.22,.14],{cast:!1}),A(B,f.black,[.5,.08,.5],[0,.58,.95],{cast:!1}),A(B,f.black,[.5,.6,.08],[0,.9,1.18],{cast:!1}),ae(B,f.steel,.045,.5,[0,.3,.95],{cast:!1}),ae(Y,f.planter,.26,.45,[6.1,.55,.1],{cast:!1}),hs(Y,f.hedge,.45,[6.1,1.2,.1],{cast:!1}),hs(Y,f.hedge,.32,[5.85,1.55,.1],{cast:!1}),A(Y,f.darkMetal,[.62,.85,.45],[.6,.72,1.5]),A(Y,f.gold,[.48,.03,.03],[.6,.95,1.73],{cast:!1}),A(Y,f.redPaint,[.42,.1,.32],[.6,1.2,1.5],{cast:!1}),Fe(b),Fe(B)}const Pe=new Wt({map:c_(),toneMapped:!1}),L=new ie;L.position.set(-.35,6.58,4.62),Y.add(L),A(L,f.goldBright,[10.4,2.18,.2],[0,0,0]),A(L,f.black,[10.12,1.9,.24],[0,0,.02]);const Ve=new At(Ce,Pe);Ve.scale.set(9.98,1.82,1),Ve.position.set(0,0,.155),L.add(Ve),A(L,f.gold,[10.5,.04,.3],[0,1.11,.02],{cast:!1}),A(L,f.gold,[10.5,.04,.3],[0,-1.11,.02],{cast:!1}),A(L,D,[10.3,.045,.28],[0,1.15,.02],{cast:!1});const qt=new ie;qt.position.set(6.72,4.9,4.63),Y.add(qt),A(qt,f.goldBright,[.98,5.65,.28],[0,0,0]),A(qt,f.black,[.84,5.5,.32],[0,0,.02]);const ne=new At(Ce,new Wt({map:h_(),toneMapped:!1}));ne.scale.set(.8,5.44,1),ne.position.set(0,0,.19),qt.add(ne);const kt=us(_n(),16760178,3.2,.12);kt.position.set(0,0,.6),qt.add(kt);const Se=u_(),zt=new Wt({map:Se,toneMapped:!1}),E=f.darkMetal,y=new ie;y.position.set(-8.86,5.45,5.55),Y.add(y);const z=new At(new yn(.16,2.35,2.95),[zt,zt,E,E,E,E]);z.castShadow=!0,y.add(z),A(y,f.gold,[.19,.06,3],[0,1.2,0],{cast:!1}),A(y,f.gold,[.19,.06,3],[0,-1.2,0],{cast:!1}),A(y,f.gold,[.19,2.45,.06],[0,0,1.49],{cast:!1}),A(y,f.gold,[.19,2.45,.06],[0,0,-1.49],{cast:!1}),A(y,f.darkMetal,[.14,.14,1.4],[.25,.9,0],{cast:!1}),A(y,f.darkMetal,[.14,.14,1.4],[.25,-.9,0],{cast:!1}),A(y,f.darkMetal,[1,.12,.12],[.5,.9,-1.1],{cast:!1}),A(y,f.darkMetal,[1,.12,.12],[.5,-.9,-1.1],{cast:!1});const J=new ie;J.position.set(-1.2,10,2.4),Y.add(J),A(J,f.goldBright,[7.4,1.1,.18],[0,0,0]),A(J,f.black,[7.16,.92,.22],[0,0,.02]);const at=new At(Ce,new Wt({map:kc(),toneMapped:!1}));at.scale.set(7.02,.82,1),at.position.set(0,0,.14),J.add(at),A(J,f.gold,[7.5,.04,.26],[0,.57,.02],{cast:!1}),A(J,D,[7.3,.045,.24],[0,.61,.02],{cast:!1}),[-3.2,3.2].forEach(b=>A(J,f.darkMetal,[.12,.65,.12],[b,-.82,-.02],{cast:!1})),Fe(L),Fe(qt),Fe(y),Fe(J);const et=A(Y,D,[15.1,.035,9.1],[0,9.412,0],{cast:!1,receive:!1});et.renderOrder=1;const Ft=A(Y,D,[4.64,.04,1.54],[2.1,3.81,5],{cast:!1});Ft.renderOrder=1;const _t=new ie;_t.position.set(-18.75,0,-1.5),i.add(_t);const dt=new ie;_t.add(dt);{A(dt,f.stone,[12.6+.2,1.1,8+.2],[0,.55,0]),A(dt,f.brick,[12.6,8.2-1.1,8],[0,1.1+(8.2-1.1)/2,0]),A(dt,f.slab,[12.6+.4,.35,8+.4],[0,8.2-.25,0]),A(dt,f.gold,[12.6+.5,.06,.08],[0,8.2-.05,8/2+.15]),A(dt,f.stone,[12.6+.3,.5,.3],[0,1.15,8/2+.08]),[-12.6/2,12.6/2].forEach(wt=>{A(dt,f.gold,[.14,8.2-1.1,.14],[wt,1.1+(8.2-1.1)/2,8/2+.02])});const W=Gc("finance",41),j=new Wt({map:W,transparent:!0,toneMapped:!1}),it=Qe(dt,j,[9.6,3.3],[0,4.9,8/2+.03],[0,0,0]);it.receiveShadow=!1,[-4.8,-1.6,1.6,4.8].forEach(wt=>{A(dt,f.gold,[.07,3.5,.12],[wt,4.9,8/2+.08],{cast:!1})}),A(dt,f.gold,[9.8,.07,.12],[0,6.55,8/2+.08],{cast:!1}),A(dt,f.gold,[9.8,.07,.12],[0,3.25,8/2+.08],{cast:!1}),A(dt,f.stone,[9.8,.12,.35],[0,3.16,8/2+.14],{cast:!1}),A(dt,f.stone,[4.4,.16,1.6],[0,.16,8/2+.75],{cast:!1}),A(dt,f.darkMetal,[2.2,3.2,.12],[0,1.68,8/2+.06],{rx:0,cast:!1}),A(dt,f.glass,[1.9,2.9,.04],[0,1.6,8/2+.14],{cast:!1,receive:!1}).userData.glass=!0,A(dt,f.goldBright,[2.4,.08,.14],[0,3.28,8/2+.08],{cast:!1}),A(dt,f.goldBright,[.08,3.2,.14],[-1.14,1.68,8/2+.08],{cast:!1}),A(dt,f.goldBright,[.08,3.2,.14],[1.14,1.68,8/2+.08],{cast:!1}),A(dt,f.gold,[.04,.75,.06],[-.35,1.45,8/2+.18],{cast:!1}),A(dt,f.gold,[.04,.75,.06],[.35,1.45,8/2+.18],{cast:!1}),A(dt,f.canopyDark,[3.4,.14,1.35],[0,3.55,8/2+.62]),A(dt,f.gold,[3.46,.04,1.4],[0,3.64,8/2+.62]),A(dt,D,[3.4,.035,1.35],[0,3.67,8/2+.62],{cast:!1}),[0].forEach(()=>ae(dt,f.warmGlow,.08,.03,[0,3.47,8/2+.9],{cast:!1}));const ht=new ie;ht.position.set(0,7.2,8/2+.2),_t.add(ht),A(ht,f.goldBright,[5.6,1.18,.16],[0,0,0]),A(ht,f.black,[5.4,1,.2],[0,0,.02]);const Ut=new At(Ce,new Wt({map:kr("財務室","FINANCE · REVIEW & TREASURY",1024,224),toneMapped:!1}));Ut.scale.set(5.3,.96,1),Ut.position.set(0,0,.13),ht.add(Ut),A(_t,new Wt({color:5560524,toneMapped:!1}),[.05,5.2,.06],[-12.6/2+.1,4.6,8/2+.12],{cast:!1}),A(_t,f.darkMetal,[1.2,.7,1],[-3.2,8.2+.18,-1.2]),A(_t,f.steel,[.08,.8,.08],[3.4,8.2+.35,.6]),ae(_t,f.darkMetal,.28,.9,[4.4,8.2+.55,-2.2]);const Ht=A(_t,D,[12.8,.03,8.1],[0,8.2-.06,0],{cast:!1});Ht.renderOrder=1,Fe(ht),A(_t,f.coolGlow,[12.5,.045,.07],[0,8.2+.05,8/2+.12],{cast:!1})}Fe(dt);const Vt=new ie;Vt.position.set(15.2,0,-4),i.add(Vt);const ot=new ie;Vt.add(ot);{A(ot,f.stone,[11.4+.2,.9,11+.2],[0,.45,0]),A(ot,f.corrugated,[11.4,6.2-.9,11],[0,.9+(6.2-.9)/2,0]),A(ot,f.slab,[11.4+.3,.32,11+.3],[0,6.2-.12,0]),A(ot,f.gold,[11.4+.34,.05,.08],[0,6.2+.04,11/2+.02]);const W=Le(512,512,(wt,vt,Xt)=>{wt.fillStyle="#1b2027",wt.fillRect(0,0,vt,Xt);for(let st=0;st<Xt;st+=22)wt.fillStyle="rgba(0,0,0,0.42)",wt.fillRect(0,st,vt,4),wt.fillStyle="rgba(255,255,255,0.05)",wt.fillRect(0,st+4,vt,1);wt.fillStyle="rgba(216,184,120,0.16)",wt.font='600 26px "SF Mono", Menlo, monospace',wt.textAlign="center",wt.fillText("LOADING 01",vt/2,Xt/2)}),j=new ee({map:W,color:11186360,roughness:.55,metalness:.4});A(ot,j,[5.4,4.1,.12],[0,2.15,11/2+.04],{cast:!1}),A(ot,f.gold,[5.7,.1,.2],[0,4.26,11/2+.08],{cast:!1}),A(ot,f.gold,[.1,4.2,.2],[-2.78,2.15,11/2+.08],{cast:!1}),A(ot,f.gold,[.1,4.2,.2],[2.78,2.15,11/2+.08],{cast:!1}),A(ot,f.stone,[6.4,.5,1.4],[0,.25,11/2+.8],{cast:!1}),A(ot,f.gold,[6.5,.04,.06],[0,.51,11/2+1.48],{cast:!1});const it=new Wt({color:8706512,transparent:!0,opacity:.8,toneMapped:!1});[-3.8,-1.6,.6,2.8].forEach(wt=>{Qe(ot,it,[1.1,.55],[wt,5.3,11/2+.02],[0,0,0]),A(ot,f.gold,[1.2,.04,.08],[wt,5.6,11/2+.06],{cast:!1})});const ht=new ie;ht.position.set(0,4.85,11/2+.18),Vt.add(ht),A(ht,f.goldBright,[4.9,.94,.14],[0,0,0]),A(ht,f.black,[4.72,.78,.18],[0,0,.02]);const Ut=new At(Ce,new Wt({map:kr("倉庫","DEPOT · PARTS & LOGISTICS",1024,200),toneMapped:!1}));Ut.scale.set(4.64,.74,1),Ut.position.set(0,0,.12),ht.add(Ut),A(Vt,f.steel,[1.4,.6,.8],[-3.4,6.2+.28,-1.8]),ae(Vt,f.darkMetal,.25,1,[3.6,6.2+.5,2]),ae(Vt,f.gold,.27,.06,[3.6,6.2+1,2]);const Ht=A(Vt,D,[11.5,.03,11.1],[0,6.2+.06,0],{cast:!1});Ht.renderOrder=1,A(Vt,f.wood,[1.5,.18,1.1],[-4.1,.5,11/2+1.8],{cast:!1}),A(Vt,f.wood,[1,.8,.9],[-4.2,1,11/2+1.8]),A(Vt,f.wood,[.8,.62,.7],[-4.2,1.7,11/2+1.8]),A(Vt,f.gold,[1.02,.04,.05],[-4.2,1.42,11/2+2.26],{cast:!1}),A(Vt,f.black,[1.2,.9,.9],[-2.4,.62,11/2+2]),A(Vt,f.gold,[.7,.03,.02],[-2.4,.8,11/2+2.46],{cast:!1}),Fe(ht),A(Vt,f.warmGlow,[11.3,.045,.06],[0,6.2+.07,11/2+.1],{cast:!1})}Fe(ot);const Mt=new ie;Mt.position.set(27,0,-1.5),i.add(Mt);const Ct=new ie;Mt.add(Ct);{A(Ct,f.stone,[9.4+.2,1,8.4+.2],[0,.5,0]),A(Ct,f.brick,[9.4,10.8-1,8.4],[0,1+(10.8-1)/2,0]),A(Ct,f.slab,[9.4+.4,.35,8.4+.4],[0,10.8-.2,0]),A(Ct,f.gold,[9.4+.44,.06,.08],[0,10.8+.02,8.4/2+.1]);const W=Gc("dorm",73),j=new Wt({map:W,transparent:!0,toneMapped:!1});Qe(Ct,j,[7.8,8.8],[0,6.15,8.4/2+.03],[0,0,0]),[4.35,7.15].forEach(Ht=>{A(Ct,f.slab,[8.2,.14,.85],[0,Ht,8.4/2+.42],{cast:!1}),A(Ct,f.gold,[8.2,.03,.06],[0,Ht+.36,8.4/2+.83],{cast:!1});for(let wt=0;wt<9;wt++)A(Ct,f.gold,[.025,.34,.025],[-3.8+wt*.95,Ht+.18,8.4/2+.83],{cast:!1});for(let wt=0;wt<5;wt++)A(Ct,D,[1.4,.03,.2],[-3.2+wt*1.6,Ht+.37,8.4/2+.83],{cast:!1})}),A(Ct,f.darkMetal,[2,2.9,.12],[0,1.55,8.4/2+.04],{cast:!1}),A(Ct,f.glass,[1.7,2.6,.04],[0,1.5,8.4/2+.12],{cast:!1,receive:!1}).userData.glass=!0,A(Ct,f.goldBright,[.07,2.9,.12],[-1,1.55,8.4/2+.08],{cast:!1}),A(Ct,f.goldBright,[.07,2.9,.12],[1,1.55,8.4/2+.08],{cast:!1}),A(Ct,f.canopyDark,[3,.12,1.2],[0,3.15,8.4/2+.55]),A(Ct,f.gold,[3.05,.035,1.24],[0,3.23,8.4/2+.55]),A(Ct,D,[3,.03,1.2],[0,3.26,8.4/2+.55],{cast:!1}),A(Ct,f.stone,[3.4,.16,1.2],[0,.16,8.4/2+.6],{cast:!1});const it=new ie;it.position.set(0,3.85,8.4/2+.2),Mt.add(it),A(it,f.goldBright,[4.2,.86,.14],[0,0,0]),A(it,f.black,[4.04,.7,.18],[0,0,.02]);const ht=new At(Ce,new Wt({map:kr("宿舍","DORM · STAFF RESIDENCE",1024,200),toneMapped:!1}));ht.scale.set(3.96,.66,1),ht.position.set(0,0,.12),it.add(ht),ae(Mt,f.steel,.85,1.7,[-2.2,10.8+.75,-1]),ae(Mt,f.gold,.88,.06,[-2.2,10.8+1.6,-1]),ae(Mt,f.darkMetal,.1,.7,[-2.2,10.8+.25,-1]),A(Mt,f.darkMetal,[1.1,.7,.9],[2.2,10.8+.3,.6]),A(Mt,f.darkMetal,[.45,.7,.45],[2.2,10.8-2.4,8.4/2+.15]);const Ut=A(Mt,D,[9.5,.03,8.5],[0,10.8-.01,0],{cast:!1});Ut.renderOrder=1,Fe(it),A(Mt,f.warmGlow,[9.4,.045,.06],[0,10.8+.07,8.4/2+.1],{cast:!1})}Fe(Ct);const It=new ie;i.add(It);const Pt=[],le=[-20,-6.5,4.8,14.2,25],Yt=new ml(2.1,5.5,24,1,!0),_e=new Wt({color:16766880,toneMapped:!1});le.forEach(b=>{const N=new ie;N.position.set(b,0,9.62),It.add(N),ae(N,f.darkMetal,.09,6.4,[0,3.2,0]),ae(N,f.concreteDark,.2,.24,[0,.12,0]),A(N,f.darkMetal,[.08,.08,.95],[0,6.3,.42]),A(N,f.darkMetal,[.5,.12,.34],[0,6.24,.85]),A(N,_e,[.38,.03,.24],[0,6.17,.85],{cast:!1}),A(N,f.gold,[.52,.03,.36],[0,6.31,.85],{cast:!1});const B=us(_n(),16763271,2,.62);B.position.set(0,6.15,.85),N.add(B);const W=new Re({transparent:!0,depthWrite:!1,side:nn,blending:De,uniforms:{uColor:{value:new Rt(16759156)},uOpacity:{value:.075}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec2 vUv; uniform vec3 uColor; uniform float uOpacity; void main(){ float a = smoothstep(0.0,0.55,vUv.y) * uOpacity; gl_FragColor = vec4(uColor, a); }"}),j=new At(Yt,W);j.position.set(0,3.45,.85),j.userData.nonPickable=!0,N.add(j),s.cones.push({mat:W,base:.075});const it=new At(Ce,new Wt({map:_n(),color:16759156,transparent:!0,opacity:.28,blending:De,depthWrite:!1,toneMapped:!1}));it.rotation.x=-Math.PI/2,it.scale.set(6,6,1),it.position.set(0,.06,.85),it.userData.nonPickable=!0,N.add(it),Lt(b,16.2,3.1,10,16759156,.16),Fe(N),Pt.push(N);const ht=new At(Ce,new Wt({map:_n(),color:16759156,transparent:!0,opacity:.18,blending:De,depthWrite:!1,toneMapped:!1}));ht.rotation.x=-Math.PI/2,ht.scale.set(9,8,1),ht.position.set(b,.055,13.6),i.add(ht)});{const b=new Ch({color:658448,transparent:!0,opacity:.8}),N=(B,W)=>{const j=[];for(let it=-34;it<=38;it+=2){const ht=Math.sin((it+34)/8*Math.PI)*.22;j.push(new C(it,W-Math.abs(ht)+B,9.4))}return j};[0,.35,-.3].forEach(B=>{const W=new Te().setFromPoints(N(B,6.55));It.add(new Rh(W,b))})}const O=[-23.4,-13.2,7.3,19.2,23.6,30.4];O.forEach((b,N)=>{const B=new ie;B.position.set(b,0,7.3),It.add(B),ae(B,f.bark,.18,2.6,[0,1.3,0]),ae(B,f.bark,.1,1.2,[.35,2.2,.1],{rz:-.4,cast:!1}),ae(B,f.planter,.85,.25,[0,.13,0]),ae(B,f.hedge,.7,.18,[0,.28,0]);const W=new ee({color:new Rt(2901554),roughness:.92,metalness:.03});s.foliageMats.push({mat:W,base:new Rt(2901554).offsetHSL((N-3)*.012,.02,0)}),[[0,3.4,0,1.5],[.7,3,.3,1.05],[-.75,3.05,-.3,1],[.1,4,-.2,1.15]].forEach(([it,ht,Ut,Ht])=>{hs(B,W,Ht,[it,ht,Ut],{sy:.85});const wt=hs(B,D,Ht*.82,[it,ht+Ht*.5,Ut],{sy:.24,cast:!1});wt.renderOrder=1}),B.scale.setScalar(.82),Fe(B)}),[[-6.6,4.55],[6.15,4.35],[-15,4.2]].forEach(([b,N])=>{A(It,f.planter,[2,.55,1],[b,.3,N]),A(It,f.hedge,[1.85,.4,.85],[b,.72,N],{cast:!1}),A(It,D,[1.95,.03,.95],[b,.95,N],{cast:!1}).renderOrder=1});for(let b=0;b<8;b++){const N=-8.4+b*2.4;Math.abs(N-2.1)<1.5||(ae(It,f.darkMetal,.08,.75,[N,.5,9.85]),ae(It,f.gold,.085,.04,[N,.89,9.85],{cast:!1}))}A(It,f.darkMetal,[.55,.85,.55],[-10.8,.56,8.7]),A(It,f.gold,[.57,.04,.57],[-10.8,.99,8.7],{cast:!1}),ae(It,f.redPaint,.14,.65,[-12.4,.46,8.6]),ae(It,f.redPaint,.22,.06,[-12.4,.8,8.6]),A(It,f.redPaint,[.5,.12,.14],[-12.4,.62,8.6],{cast:!1});const pt=new ie;pt.position.set(2.3,0,6.3),i.add(pt);{A(pt,f.darkMetal,[1.05,1.55,.62],[0,.9,0]),A(pt,f.goldBright,[1.1,.08,.68],[0,1.71,0]),A(pt,f.black,[.82,.52,.05],[0,1.28,.32],{cast:!1}),A(pt,f.warmGlow,[.55,.035,.06],[0,1.12,.34],{cast:!1}),A(pt,f.gold,[.55,.22,.03],[0,1.34,.35],{cast:!1}),A(pt,f.black,[.66,.16,.03],[0,1.34,.37],{cast:!1}),ae(pt,f.gold,.12,.03,[-.3,.28,.32],{rx:Math.PI/2,cast:!1});const b=new At(Ce,new Wt({map:kr("票据箱","TICKET DROP",512,192),toneMapped:!1}));b.scale.set(.86,.32,1),b.position.set(0,1.34,.375),pt.add(b),A(pt,D,[1,.035,.6],[0,1.76,0],{cast:!1}).renderOrder=1,Fe(pt)}const X=new ie;X.position.set(5.2,0,6.4),i.add(X);{A(X,f.darkMetal,[.55,1.45,.4],[0,.73,0]),A(X,f.gold,[.6,.06,.45],[0,.05,0]);const b=new ie;b.position.set(0,1.62,0),b.rotation.x=-.12,X.add(b),A(b,f.black,[.92,.62,.08],[0,0,0]),Qe(b,yt.approval,[.82,.52],[0,0,.05],[0,0,0]),A(b,f.gold,[.96,.05,.1],[0,.35,0],{cast:!1}),ae(X,f.gold,.025,.6,[0,1.28,0],{cast:!1}),A(X,D,[.95,.03,.1],[0,1.95,0],{cast:!1}).renderOrder=1,Fe(X)}const Q=new ie;Q.position.set(-6.7,0,7.6),i.add(Q);{ae(Q,f.steel,.055,2.6,[0,1.3,0]);const b=Le(256,320,(B,W,j)=>{B.fillStyle="#0e3c66",B.fillRect(0,0,W,j),B.strokeStyle="rgba(230,242,250,0.8)",B.lineWidth=5,B.strokeRect(10,10,W-20,j-20),B.fillStyle="#f2f7fb",B.font='700 170px "Inter", sans-serif',B.textAlign="center",B.textBaseline="middle",B.fillText("P",W/2,120),B.font='500 24px "Noto Sans CJK SC", "PingFang SC", sans-serif',B.fillText("古德車房 · 停車場",W/2,236),B.font='400 17px "SF Mono", Menlo, monospace',B.fillStyle="rgba(220,235,245,0.6)",B.fillText("GOODWORK PARKING",W/2,276)}),N=new At(Ce,new Wt({map:b,toneMapped:!1,side:nn}));N.scale.set(.95,1.18,1),N.position.set(0,2.2,0),Q.add(N),A(Q,f.steel,[1.02,1.25,.05],[0,2.2,-.04],{cast:!1}),A(Q,f.steel,[1.02,.05,.05],[0,2.82,-.02],{cast:!1}),A(Q,D,[1,.03,.08],[0,2.85,0],{cast:!1}).renderOrder=1,Fe(Q)}const ft=new ie;ft.position.set(10.8,0,6.7),i.add(ft);{A(ft,f.darkMetal,[3.4,2.25,2.15],[.75,1.65,0]),A(ft,f.corrugated,[3.36,2.2,2.16],[.75,1.65,0],{cast:!1}),A(ft,f.gold,[3.38,.08,2.18],[.75,2.74,0],{cast:!1}),A(ft,f.gold,[.05,1.4,.04],[-.88,1.65,1.09],{cast:!1}),A(ft,f.creamPaint,[1.85,1.65,2],[-2.05,1.28,0]),A(ft,f.carGlass,[.06,.65,1.65],[-2.97,1.72,0],{cast:!1}),A(ft,f.carGlass,[1.3,.6,.05],[-2.25,1.7,1],{cast:!1}),A(ft,f.gold,[.08,.5,1.9],[-2.96,1,0],{cast:!1});const b=new An(.42,.42,.26,18);[[-2.35,1.05],[-2.35,-1.05],[1.35,1.05],[1.35,-1.05]].forEach(([B,W])=>{const j=new At(b,f.rubber);j.rotation.x=Math.PI/2,j.position.set(B,.42,W),j.castShadow=!0,ft.add(j);const it=new At(new An(.22,.22,.28,14),f.chrome);it.rotation.x=Math.PI/2,it.position.set(B,.42,W),ft.add(it)}),A(ft,f.headlight,[.04,.18,.3],[-3,.9,.72],{cast:!1}),A(ft,f.headlight,[.04,.18,.3],[-3,.9,-.72],{cast:!1}),A(ft,f.redGlow,[.04,.16,.22],[2.46,1,.8],{cast:!1}),A(ft,f.redGlow,[.04,.16,.22],[2.46,1,-.8],{cast:!1});const N=new At(Ce,new Wt({map:kc(),toneMapped:!1}));N.scale.set(2.2,.42,1),N.position.set(.75,1.75,1.09),N.rotation.y=0,ft.add(N),A(ft,D,[3.3,.035,2.05],[.75,2.8,0],{cast:!1}).renderOrder=1,Fe(ft)}A(It,f.wood,[.9,.7,.8],[13.4,.45,3.3]),A(It,f.wood,[.75,.55,.65],[14.3,.4,3.4]),A(It,f.wood,[.6,.45,.55],[13.45,1.05,3.3]);for(let b=0;b<7;b++)A(It,f.black,[.7,.02,.34],[-24+b*8,.32,10.35],{cast:!1});function Et(b,N,B){const W=y_(b,N,B),j=new hl({map:W,transparent:!0,depthWrite:!1,depthTest:!0,opacity:.92,toneMapped:!1}),it=new Ah(j);return it.scale.set(3.9,.975,1),it.userData.baseOpacity=.92,it}function Ot(b){const N={...b,focus:new C(b.focus[0],b.focus[1],b.focus[2]),radius:b.radius||1},B=[];if(b.objects.forEach(W=>{W.traverse(j=>{(j.isMesh||j.isInstancedMesh)&&!j.userData.nonPickable&&(j.userData.entryId=b.id,B.push(j))})}),N.pickables=B,r.push(N),a.set(N.id,N),o.push(...B),b.label){const W=Et(b.code,b.label[0],b.label[1]);W.position.set(b.labelPos[0],b.labelPos[1],b.labelPos[2]),i.add(W),l.push(W),N.labelSprite=W}return N}function Zt(b){return Vc[b]}Ot({id:"garage",...Zt("garage"),objects:[gt],focus:[-1,5.4,3.6],radius:3.3,label:null,cameraStages:[[10.5,7.4,24],[3.2,5.6,16.5],[2,4.9,11.4]],cameraTargets:[[.4,4.8,2.2],[2,4.7,2.8],[2.3,4.5,2.9]]}),Ot({id:"finance",...Zt("finance"),objects:[dt],focus:[-18.75,5.4,2.7],radius:2.8,label:null,cameraStages:[[2,7,22],[-8,5.3,14.5]],cameraTargets:[[-8,4.2,.5],[-17.5,4.4,1.4]]}),Ot({id:"warehouse",...Zt("warehouse"),objects:[ot],focus:[15.2,4.4,1.8],radius:2.9,label:null,cameraStages:[[4,6.6,22],[9,5.2,15]],cameraTargets:[[4,3.8,1.8],[14,3.6,.8]]}),Ot({id:"dorm",...Zt("dorm"),objects:[Ct],focus:[27,6,2.8],radius:2.9,label:null,cameraStages:[[16,8.8,25],[22.5,7.2,16]],cameraTargets:[[16,4.6,0],[27,5,1]]}),Ot({id:"sign",...Zt("sign"),objects:[L],focus:[-1.35,6.58,3.4],radius:2.1,label:null}),Ot({id:"lightbox",...Zt("lightbox"),objects:[qt],focus:[5.72,4.9,3.6],radius:1.3}),Ot({id:"blade",...Zt("blade"),objects:[y],focus:[-9.86,5.45,4.3],radius:1.2}),Ot({id:"liftCar",...Zt("liftCar"),objects:[Y.children.find(b=>b.isGroup&&b.position.y===1.32)],focus:[-5.2,2.1,-2.8],radius:1.5}),Ot({id:"ticketBox",...Zt("ticketBox"),objects:[pt],focus:[2.3,.95,6.3],radius:.95,label:["票据箱","TICKET DROP"],labelPos:[2.3,2.55,5.6]}),Ot({id:"terminal",...Zt("terminal"),objects:[X],focus:[5.2,1.1,6.4],radius:.9,label:["审批终端","APPROVAL TERMINAL"],labelPos:[5.2,2.85,5.7]}),Ot({id:"parking",...Zt("parking"),objects:[Q],focus:[-6.7,1.7,7.6],radius:.95}),Ot({id:"lamp",...Zt("lamp"),objects:Pt,focus:[4.8,4.4,9.9],radius:1.4,dynamicFocus:!0}),Ot({id:"truck",...Zt("truck"),objects:[ft],focus:[10.8,1.8,6.7],radius:1.8}),Ot({id:"trees",...Zt("trees"),objects:It.children.filter(b=>b.isGroup&&O.some(N=>Math.abs(b.position.x-N)<.01)),focus:[7.3,3.4,7.3],radius:1.7,dynamicFocus:!0}),Ot({id:"workbench",...Zt("workbench"),objects:[Y.children.find(b=>b.isGroup&&b.position.x===2.9&&b.position.z===-3.55)],focus:[1.9,1.15,-5],radius:1.05}),Ot({id:"tires",...Zt("tires"),objects:Y.children.filter(b=>b.isMesh&&b.geometry.type==="TorusGeometry"),focus:[-7.2,.9,.9],radius:.9,dynamicFocus:!0}),Ot({id:"reception",...Zt("reception"),objects:[Y.children.find(b=>b.isGroup&&b.position.x===4.4&&b.position.z===-2.3)],focus:[3.4,1.15,-3.8],radius:1.05}),E_(i,new Set(o));const we=n?84:140,te=new Te,Ie=new Float32Array(we*3),We=new Float32Array(we*3),Mi=new Float32Array(we),ti=new Float32Array(we),Ze=new Float32Array(we*3);for(let b=0;b<we;b++)Ie[b*3+1]=-10,Mi[b]=.02;te.setAttribute("position",new se(Ie,3).setUsage(Xn)),te.setAttribute("aColor",new se(We,3).setUsage(Xn)),te.setAttribute("aSize",new se(Mi,1).setUsage(Xn));const Hi=new Re({transparent:!0,depthWrite:!1,blending:De,uniforms:{uScale:{value:900},uOpacity:{value:1}},vertexShader:`
      attribute vec3 aColor; attribute float aSize;
      varying vec3 vColor; uniform float uScale;
      void main(){
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = max(1.0, aSize * uScale / max(0.5, -mv.z));
      }`,fragmentShader:`
      varying vec3 vColor;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.02, d);
        gl_FragColor = vec4(vColor, a);
      }`}),Ds=new Ni(te,Hi);Ds.frustumCulled=!1,i.add(Ds);let Vi=0,ei=3.2;function ar(b){for(let N=0;N<b;N++){const B=Vi;Vi=(Vi+1)%we,Ie[B*3]=1.72+(Math.random()-.5)*.3,Ie[B*3+1]=1.12+Math.random()*.2,Ie[B*3+2]=-4.9+(Math.random()-.5)*.2;const W=Math.random()*Math.PI*2,j=.6+Math.random()*1.7;Ze[B*3]=Math.cos(W)*j*.5,Ze[B*3+1]=.8+Math.random()*1.8,Ze[B*3+2]=Math.sin(W)*j*.5,ti[B]=.5+Math.random()*.7;const it=Math.random();We[B*3]=1,We[B*3+1]=.55+it*.4,We[B*3+2]=.18+it*.5,Mi[B]=.022+Math.random()*.025}te.attributes.aColor.needsUpdate=!0,te.attributes.aSize.needsUpdate=!0}function Wi(b){for(let N=0;N<we;N++)if(ti[N]>0){ti[N]-=b,Ze[N*3+1]-=4.6*b,Ie[N*3]+=Ze[N*3]*b,Ie[N*3+1]+=Ze[N*3+1]*b,Ie[N*3+2]+=Ze[N*3+2]*b;const B=Math.max(0,ti[N]);We[N*3+1]*=.985,We[N*3+2]*=.97,(Ie[N*3+1]<.4||B<=0)&&(Ie[N*3+1]=-10,ti[N]=0),Mi[N]*=.996}te.attributes.position.needsUpdate=!0,te.attributes.aColor.needsUpdate=!0,te.attributes.aSize.needsUpdate=!0}const Xe=new ie;Xe.visible=!1,i.add(Xe);const ni=new Wt({color:15255674,transparent:!0,opacity:.9,side:nn,blending:De,depthWrite:!1,depthTest:!1,toneMapped:!1}),or=ni.clone();or.opacity=.32;const fa=new At(new ra(.9,.955,72),ni),pa=new At(new ra(1.045,1.06,72),or);Xe.add(fa,pa);for(let b=0;b<4;b++){const N=new At(new Gi(.16,.012),ni),B=b*Math.PI/2;N.position.set(Math.cos(B)*1.19,Math.sin(B)*1.19,0),N.rotation.z=B,Xe.add(N)}const ma=new At(new sa(.018,12),ni);Xe.add(ma),Xe.renderOrder=999;function ga(b,N){c=b,N?u.copy(N):u.copy(b.focus),Xe.visible=!0,Xe.scale.setScalar(b.radius)}function M(){c=null,Xe.visible=!1}function F(b){h=b,l.forEach(N=>{N.visible=b})}function H(b){s.skyUniforms&&(s.skyUniforms.uTop.value.copy(b.skyTop),s.skyUniforms.uMid.value.copy(b.skyMid),s.skyUniforms.uHorizon.value.copy(b.skyHorizon),s.skyUniforms.uGlow.value.copy(b.skyGlow)),i.fog.color.copy(b.fogColor),i.fog.density=b.fogDensity,I.color.copy(b.lightColor),I.intensity=b.lightIntensity,R.color.copy(b.hemiSky),R.groundColor.copy(b.hemiGround),R.intensity=b.hemiIntensity,s.starsMat&&(s.starsMat.opacity=b.starOpacity),s.moonSprite&&(s.moonSprite.material.color.copy(b.moonColor),s.moonSprite.material.opacity=b.moonOpacity,s.moonHalo.material.opacity=b.moonOpacity*.18),s.glassMats.forEach(N=>{N.color.copy(b.glassTint),N.opacity=b.glassOpacity}),s.foliageMats.forEach(({mat:N,base:B})=>{N.color.copy(B).lerp(b.foliage,.94)}),s.snowMats.forEach(({mat:N,base:B})=>{N.opacity=B*b.snow,N.visible=b.snow>.005}),s.groundSnowMats.forEach(({mat:N,base:B})=>{N.opacity=B*b.snow,N.visible=b.snow>.005}),s.roadMat&&(s.roadMat.color.copy(b.groundTint),s.roadMat.roughness=Oi.clamp(b.wet,.14,.42),s.roadMat.envMapIntensity=.9+(.42-b.wet)*2.4),s.sidewalkMat&&(s.sidewalkMat.color.copy(b.sidewalkTint),s.sidewalkMat.roughness=Oi.clamp(b.wet+.16,.24,.56)),s.cones.forEach(({mat:N,base:B})=>{N.uniforms.uOpacity.value=B*b.coneOpacity})}const G=new C;function k(b,N,B){if(lt.uTime.value=N,c){c.getFocus?c.getFocus(G):c.dynamicFocus?G.copy(u):G.copy(c.focus),Xe.position.copy(G),Xe.quaternion.copy(B.quaternion),Xe.rotation.z+=b*.35;const W=1+Math.sin(N*3.4)*.018;Xe.scale.setScalar(c.radius*W),ni.opacity=.72+Math.sin(N*4.1)*.16}if(h)for(const W of l){const j=B.position.distanceTo(W.position),it=Oi.clamp(1.25-j/75,.28,.92);W.material.opacity+=(it-W.material.opacity)*Math.min(1,b*3)}s.streaks.forEach(({mat:W,base:j,phase:it})=>{W.opacity=j*(.86+Math.sin(N*.9+it)*.14)}),s.nebulaMats.forEach(({mat:W,base:j,phase:it})=>{W.opacity=j*(.8+Math.sin(N*.12+it)*.2)}),V.intensity=9+Math.sin(N*2.1)*.9+Math.sin(N*7.3)*.4,x.intensity=27+Math.sin(N*1.4)*1.2,ei-=b,ei<=0&&(ar(n?8:14),ei=4.6+Math.random()*5.2),Wi(b)}function ct(b){Hi.uniforms.uScale.value=b}return{entries:r,entryById:a,pickables:o,refs:s,nav:{walkTargets:{garage:[2.2,4.9],finance:[-18.75,4.6],warehouse:[15.2,4.1],dorm:[27,4.5],ticketBox:[3.5,8],terminal:[6.4,8.2],liftCar:[-3.8,4.6],workbench:[-2.5,4.8],warehouseDock:[18.2,4],dormDoor:[24.6,4.6],wander:[[-11,8.6],[-2.5,9.2],[8.4,8.8],[21.5,8.7],[29.2,8.9],[-25,8.6],[1.8,9.2]]},blockedRects:[[-10.2,8.6,-7.5,4.4],[-26.2,-11.3,-6.5,3.3],[9.3,22.3,-10.5,2.2],[22.3,32.5,-6.5,3.4],[1.5,3.2,5.3,7.3],[4.1,6.2,5.4,7.4],[8.3,14,5.2,8.2],[-8,-5.4,6.8,8.4],[-7.6,-5.8,3.6,5.6],[5.2,7.2,3.6,5.4],[-14.1,-12.1,7,8.2],[-10.2,-9.4,7.9,9.4]],treeXs:O},setSeason:H,update:k,showHover:ga,hideHover:M,setLabelsVisible:F,setViewScale:ct,registerEntry:Ot,makeLabelSprite:Et,labels:l,scene:i,meta:Vc,npcMeta:T_}}const Ci={spring:{key:"spring",label:"春 · 樱瓣",en:"SPRING / CHERRY BLOSSOM",temp:"16.2°C",wind:"2.4 m/s",vis:"8.6 km",skyTop:528669,skyMid:1385526,skyHorizon:3752785,skyGlow:8020032,fog:1055011,fogDensity:.0096,lightColor:11849186,lightIntensity:1.5,moonColor:14674420,moonOpacity:.72,hemiSky:8232118,hemiGround:856085,hemiIntensity:.55,star:.55,glass:11061192,glassOpacity:.115,foliage:5008208,snow:0,ground:11910340,sidewalk:10330534,cone:1,wet:.3},summer:{key:"summer",label:"夏 · 骤雨",en:"SUMMER / SUDDEN RAIN",temp:"27.4°C",wind:"7.2 m/s",vis:"4.1 km",skyTop:396566,skyMid:924456,skyHorizon:2240314,skyGlow:4868666,fog:726045,fogDensity:.0122,lightColor:10139855,lightIntensity:1.35,moonColor:10466502,moonOpacity:.25,hemiSky:6587549,hemiGround:527119,hemiIntensity:.65,star:.12,glass:8892087,glassOpacity:.135,foliage:2244396,snow:0,ground:10199981,sidewalk:8685967,cone:1.15,wet:.16},autumn:{key:"autumn",label:"秋 · 落叶",en:"AUTUMN / FALLING LEAVES",temp:"12.8°C",wind:"3.8 m/s",vis:"7.2 km",skyTop:856088,skyMid:2170664,skyHorizon:4865588,skyGlow:9396019,fog:1578773,fogDensity:.0108,lightColor:13680804,lightIntensity:1.4,moonColor:14996404,moonOpacity:.62,hemiSky:9273714,hemiGround:1052172,hemiIntensity:.52,star:.5,glass:12893605,glassOpacity:.12,foliage:10119216,snow:0,ground:11709860,sidewalk:10262674,cone:1.05,wet:.28},winter:{key:"winter",label:"冬 · 细雪",en:"WINTER / FINE SNOW",temp:"-3.2°C",wind:"1.6 m/s",vis:"5.8 km",skyTop:330518,skyMid:1056046,skyHorizon:3095885,skyGlow:6707781,fog:857890,fogDensity:.0112,lightColor:12900588,lightIntensity:1.75,moonColor:15397884,moonOpacity:.9,hemiSky:9086658,hemiGround:856085,hemiIntensity:.62,star:.9,glass:12375e3,glassOpacity:.105,foliage:4346186,snow:1,ground:12568528,sidewalk:11186359,cone:1,wet:.36}},Wc={petals:{desktop:1100,mobile:760},rain:{desktop:900,mobile:660},leaves:{desktop:1e3,mobile:700},snow:{desktop:1300,mobile:860}},Nt={x0:-34,x1:36,z0:-14,z1:20,top:22},da=`
  uniform float uScale;
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpin;
  varying float vPhase;
  varying float vSpin;
  void main(){
    vPhase = aPhase;
    vSpin = aSpin;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize * uScale / max(0.4, -mv.z), 1.0, 42.0);
  }
`;function A_(){return new Re({transparent:!0,depthWrite:!1,blending:Kn,uniforms:{uTime:{value:0},uOpacity:{value:0},uScale:{value:900},uTint:{value:0}},vertexShader:da,fragmentShader:`
      uniform float uTime; uniform float uOpacity; uniform float uTint;
      varying float vPhase; varying float vSpin;
      void main(){
        if (uOpacity < 0.005) discard;
        float a = vPhase + uTime * (0.55 + vSpin * 0.5) + vSpin * 3.0;
        mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
        vec2 p = rot * (gl_PointCoord - 0.5);
        p.x *= 1.7;
        float d = length(p);
        float alpha = smoothstep(0.38, 0.02, d) * uOpacity;
        vec3 c1 = mix(vec3(0.95,0.32,0.5), vec3(1.0,0.62,0.72), smoothstep(0.0,0.3,d));
        vec3 c2 = mix(vec3(0.9,0.38,0.24), vec3(1.0,0.68,0.34), smoothstep(0.0,0.3,d));
        vec3 col = mix(c1, c2, uTint);
        gl_FragColor = vec4(col, alpha * 0.96);
      }
    `})}function C_(){return new Re({transparent:!0,depthWrite:!1,blending:Kn,uniforms:{uTime:{value:0},uOpacity:{value:0},uScale:{value:900}},vertexShader:da,fragmentShader:`
      uniform float uOpacity;
      varying float vPhase; varying float vSpin;
      void main(){
        if (uOpacity < 0.005) discard;
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p);
        float a = smoothstep(0.5, 0.12, d);
        float spark = max(0.0, 1.0 - abs(p.x) * 9.0) + max(0.0, 1.0 - abs(p.y) * 9.0);
        vec3 col = mix(vec3(0.72,0.82,0.94), vec3(1.0,1.0,1.0), a);
        gl_FragColor = vec4(col, a * (0.6 + spark * 0.12) * uOpacity);
      }
    `})}function R_(){return new Re({transparent:!0,depthWrite:!1,blending:Kn,uniforms:{uTime:{value:0},uOpacity:{value:0},uScale:{value:900}},vertexShader:da,fragmentShader:`
      uniform float uTime; uniform float uOpacity;
      varying float vPhase; varying float vSpin;
      void main(){
        if (uOpacity < 0.005) discard;
        float a = vPhase + uTime * (0.9 + vSpin * 0.9) + vSpin * 2.0;
        mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
        vec2 p = rot * (gl_PointCoord - 0.5);
        p.x *= 0.55;
        float d = length(p);
        float leaf = smoothstep(0.34, 0.02, d);
        float vein = smoothstep(0.02, 0.0, abs(p.y)) * leaf;
        vec3 col = mix(vec3(0.62,0.24,0.07), vec3(0.95,0.6,0.2), 1.0 - d * 2.2);
        col = mix(col, vec3(1.0,0.82,0.42), vein * 0.4);
        gl_FragColor = vec4(col, leaf * uOpacity);
      }
    `})}function P_(){return new Re({transparent:!0,depthWrite:!1,blending:De,uniforms:{uOpacity:{value:0},uColor:{value:new Rt(9418444)}},vertexShader:`
      attribute float aAlpha;
      varying float vAlpha;
      void main(){
        vAlpha = aAlpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform float uOpacity; uniform vec3 uColor;
      varying float vAlpha;
      void main(){
        gl_FragColor = vec4(uColor, vAlpha * uOpacity * 0.85);
      }
    `})}function D_(){return new Re({transparent:!0,depthWrite:!1,blending:De,uniforms:{uTime:{value:0},uOpacity:{value:.5},uScale:{value:900},uColor:{value:new Rt(15257764)}},vertexShader:da,fragmentShader:`
      uniform float uOpacity; uniform float uTime; uniform vec3 uColor;
      varying float vPhase; varying float vSpin;
      void main(){
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p);
        float a = smoothstep(0.5, 0.04, d);
        float twinkle = 0.55 + 0.45 * sin(uTime * (0.9 + vSpin) + vPhase * 4.0);
        gl_FragColor = vec4(uColor, a * twinkle * uOpacity);
      }
    `})}class L_{constructor(t,e,n,s,r={}){this.scene=t,this.world=e,this.renderer=n,this.camera=s,this.isMobile=!!r.isMobile,this.onSeasonChange=r.onSeasonChange||(()=>{}),this.onState=r.onState||(()=>{}),this.auto=!0,this.timer=20,this.nextSwitch=20+Math.random()*8,this.manualReset=18+Math.random()*10,this.currentKey="winter",this.targetKey="winter",this.state=this.makeState(Ci.winter),this.target=this.makeState(Ci.winter),this.weather={},this.weatherTarget={petals:0,rain:0,leaves:0,snow:1},this.buildWeather(),this.dust=this.buildDust(),this.reportedSecond=-1,this.update(.016,0)}makeState(t){return{skyTop:new Rt(t.skyTop),skyMid:new Rt(t.skyMid),skyHorizon:new Rt(t.skyHorizon),skyGlow:new Rt(t.skyGlow),fogColor:new Rt(t.fog),fogDensity:t.fogDensity,lightColor:new Rt(t.lightColor),lightIntensity:t.lightIntensity,moonColor:new Rt(t.moonColor),moonOpacity:t.moonOpacity,hemiSky:new Rt(t.hemiSky),hemiGround:new Rt(t.hemiGround),hemiIntensity:t.hemiIntensity,starOpacity:t.star,glassTint:new Rt(t.glass),glassOpacity:t.glassOpacity,foliage:new Rt(t.foliage),snow:t.snow,groundTint:new Rt(t.ground),sidewalkTint:new Rt(t.sidewalk),coneOpacity:t.cone,wet:t.wet}}buildWeather(){const t=e=>this.isMobile?Wc[e].mobile:Wc[e].desktop;{const e=t("petals"),n=new Te,s=new Float32Array(e*3),r=new Float32Array(e),a=new Float32Array(e),o=new Float32Array(e),l=new Float32Array(e),h=Math.random;for(let d=0;d<e;d++)s[d*3]=Nt.x0+h()*(Nt.x1-Nt.x0),s[d*3+1]=h()*Nt.top,s[d*3+2]=Nt.z0+h()*(Nt.z1-Nt.z0),r[d]=.115+h()*.15,a[d]=h()*6.28,o[d]=h(),l[d]=.45+h()*.8;n.setAttribute("position",new se(s,3).setUsage(Xn)),n.setAttribute("aSize",new se(r,1)),n.setAttribute("aPhase",new se(a,1)),n.setAttribute("aSpin",new se(o,1));const c=A_(),u=new Ni(n,c);u.frustumCulled=!1,u.visible=!1,this.scene.add(u),this.weather.petals={type:"points",count:e,points:u,geo:n,mat:c,arrays:{pos:s,speeds:l,phases:a},opacity:0}}{const e=t("rain"),n=new Te,s=new Float32Array(e*6),r=new Float32Array(e*2),a=new Float32Array(e),o=new Float32Array(e);for(let c=0;c<e;c++){const u=Nt.x0+Math.random()*(Nt.x1-Nt.x0),d=Math.random()*Nt.top,p=Nt.z0+Math.random()*(Nt.z1-Nt.z0);s[c*6]=u,s[c*6+1]=d,s[c*6+2]=p,s[c*6+3]=u+.1,s[c*6+4]=d-.9,s[c*6+5]=p,r[c*2]=.2+Math.random()*.55,r[c*2+1]=.02,a[c]=12+Math.random()*10,o[c]=.6+Math.random()*.9}n.setAttribute("position",new se(s,3).setUsage(Xn)),n.setAttribute("aAlpha",new se(r,1));const l=P_(),h=new Ad(n,l);h.frustumCulled=!1,h.visible=!1,this.scene.add(h),this.weather.rain={type:"rain",count:e,points:h,geo:n,mat:l,arrays:{pos:s,speed:a,len:o},opacity:0}}{const e=t("leaves"),n=new Te,s=new Float32Array(e*3),r=new Float32Array(e),a=new Float32Array(e),o=new Float32Array(e),l=new Float32Array(e);for(let u=0;u<e;u++)s[u*3]=Nt.x0+Math.random()*(Nt.x1-Nt.x0),s[u*3+1]=Math.random()*Nt.top,s[u*3+2]=Nt.z0+Math.random()*(Nt.z1-Nt.z0),r[u]=.11+Math.random()*.13,a[u]=Math.random()*6.28,o[u]=Math.random(),l[u]=.7+Math.random()*1.1;n.setAttribute("position",new se(s,3).setUsage(Xn)),n.setAttribute("aSize",new se(r,1)),n.setAttribute("aPhase",new se(a,1)),n.setAttribute("aSpin",new se(o,1));const h=R_(),c=new Ni(n,h);c.frustumCulled=!1,c.visible=!1,this.scene.add(c),this.weather.leaves={type:"points",count:e,points:c,geo:n,mat:h,arrays:{pos:s,speeds:l,phases:a},opacity:0}}{const e=t("snow"),n=new Te,s=new Float32Array(e*3),r=new Float32Array(e),a=new Float32Array(e),o=new Float32Array(e),l=new Float32Array(e);for(let u=0;u<e;u++)s[u*3]=Nt.x0+Math.random()*(Nt.x1-Nt.x0),s[u*3+1]=Math.random()*Nt.top,s[u*3+2]=Nt.z0+Math.random()*(Nt.z1-Nt.z0),r[u]=.035+Math.random()*.065,a[u]=Math.random()*6.28,o[u]=Math.random(),l[u]=.5+Math.random()*1.1;n.setAttribute("position",new se(s,3).setUsage(Xn)),n.setAttribute("aSize",new se(r,1)),n.setAttribute("aPhase",new se(a,1)),n.setAttribute("aSpin",new se(o,1));const h=C_(),c=new Ni(n,h);c.frustumCulled=!1,c.visible=!1,this.scene.add(c),this.weather.snow={type:"points",count:e,points:c,geo:n,mat:h,arrays:{pos:s,speeds:l,phases:a},opacity:0}}}buildDust(){const t=this.isMobile?180:280,e=new Te,n=new Float32Array(t*3),s=new Float32Array(t),r=new Float32Array(t),a=new Float32Array(t),o=new Float32Array(t);for(let c=0;c<t;c++)n[c*3]=Nt.x0+Math.random()*(Nt.x1-Nt.x0),n[c*3+1]=.3+Math.random()*10,n[c*3+2]=Nt.z0+Math.random()*(Nt.z1-Nt.z0),s[c]=.015+Math.random()*.035,r[c]=Math.random()*6.28,a[c]=Math.random()*2,o[c]=.08+Math.random()*.22;e.setAttribute("position",new se(n,3).setUsage(Xn)),e.setAttribute("aSize",new se(s,1)),e.setAttribute("aPhase",new se(r,1)),e.setAttribute("aSpin",new se(a,1));const l=D_(),h=new Ni(e,l);return h.frustumCulled=!1,this.scene.add(h),{count:t,points:h,geo:e,mat:l,arrays:{pos:n,speeds:o,phases:r}}}getInfo(){const t=Ci[this.targetKey];let e=this.dust.count;return Object.values(this.weather).forEach(n=>{n.opacity>.05&&(e+=n.count)}),{...t,auto:this.auto,countdown:Math.max(0,this.nextSwitch),particles:e,key:this.targetKey}}setSeason(t,e=!1){if(!Ci[t]||t===this.targetKey){e&&(this.nextSwitch=this.manualReset);return}this.targetKey=t,this.target=this.makeState(Ci[t]),this.weatherTarget={petals:0,rain:0,leaves:0,snow:0},this.weatherTarget[t==="spring"?"petals":t==="summer"?"rain":t==="autumn"?"leaves":"snow"]=1,this.manualReset=18+Math.random()*10,this.nextSwitch=this.manualReset,this.onSeasonChange(Ci[t])}setAuto(t){this.auto=t,t&&(this.nextSwitch=this.manualReset)}setViewScale(t){Object.values(this.weather).forEach(e=>{e.mat.uniforms&&e.mat.uniforms.uScale&&(e.mat.uniforms.uScale.value=t)}),this.dust.mat.uniforms.uScale.value=t}update(t,e){if(this.auto&&(this.nextSwitch-=t,this.nextSwitch<=0)){const u=Object.keys(Ci).filter(p=>p!==this.targetKey),d=u[Math.floor(Math.random()*u.length)];this.setSeason(d,!1)}const n=1-Math.exp(-t*1.15),s=this.state,r=this.target;s.skyTop.lerp(r.skyTop,n),s.skyMid.lerp(r.skyMid,n),s.skyHorizon.lerp(r.skyHorizon,n),s.skyGlow.lerp(r.skyGlow,n),s.fogColor.lerp(r.fogColor,n),s.lightColor.lerp(r.lightColor,n),s.moonColor.lerp(r.moonColor,n),s.hemiSky.lerp(r.hemiSky,n),s.hemiGround.lerp(r.hemiGround,n),s.glassTint.lerp(r.glassTint,n),s.foliage.lerp(r.foliage,n),s.groundTint.lerp(r.groundTint,n),s.sidewalkTint.lerp(r.sidewalkTint,n),s.fogDensity+=(r.fogDensity-s.fogDensity)*n,s.lightIntensity+=(r.lightIntensity-s.lightIntensity)*n,s.moonOpacity+=(r.moonOpacity-s.moonOpacity)*n,s.hemiIntensity+=(r.hemiIntensity-s.hemiIntensity)*n,s.starOpacity+=(r.starOpacity-s.starOpacity)*n,s.glassOpacity+=(r.glassOpacity-s.glassOpacity)*n,s.coneOpacity+=(r.coneOpacity-s.coneOpacity)*n,s.wet+=(r.wet-s.wet)*n,s.snow+=(r.snow-s.snow)*(1-Math.exp(-t*.75)),this.world.setSeason(s);for(const[u,d]of Object.entries(this.weather)){const p=this.weatherTarget[u]||0;if(d.opacity+=(p-d.opacity)*Math.min(1,t*1.7),d.opacity<.004&&p===0){d.points.visible=!1,d.opacity!==0&&(d.opacity=0,d.mat.uniforms.uOpacity.value=0);continue}d.points.visible=!0,d.mat.uniforms.uOpacity.value=d.opacity,d.mat.uniforms.uTime&&(d.mat.uniforms.uTime.value=e),this.simulateWeather(u,d,t,e)}const a=this.dust;a.mat.uniforms.uTime&&(a.mat.uniforms.uTime.value=e);const o=a.geo.attributes.position.array,{speeds:l,phases:h}=a.arrays;for(let u=0;u<a.count;u++)o[u*3+1]+=l[u]*t,o[u*3]+=Math.sin(e*.35+h[u])*.035*t,o[u*3+1]>11&&(o[u*3+1]=.3,o[u*3]=Nt.x0+Math.random()*(Nt.x1-Nt.x0),o[u*3+2]=Nt.z0+Math.random()*(Nt.z1-Nt.z0));a.geo.attributes.position.needsUpdate=!0;const c=Math.floor(this.nextSwitch);c!==this.reportedSecond&&(this.reportedSecond=c,this.onState(this.getInfo()))}simulateWeather(t,e,n,s){const r=e.geo.attributes.position.array;if(e.type==="rain"){const{speed:a,len:o}=e.arrays;for(let l=0;l<e.count;l++){const h=l*6,c=a[l]*n;if(r[h+1]-=c,r[h+4]-=c,r[h]-=2*n,r[h+3]-=2*n,r[h+1]<.1){const u=Nt.x0+Math.random()*(Nt.x1-Nt.x0),d=18+Math.random()*5,p=Nt.z0+Math.random()*(Nt.z1-Nt.z0);r[h]=u,r[h+1]=d,r[h+2]=p,r[h+3]=u+.12,r[h+4]=d-o[l],r[h+5]=p}}}else{const{speeds:a,phases:o}=e.arrays,l=t==="leaves"?.9:t==="petals"?.55:.22;for(let h=0;h<e.count;h++){const c=h*3;r[c+1]-=a[h]*n,r[c]+=Math.sin(s*.65+o[h])*l*n,r[c+2]+=Math.cos(s*.48+o[h]*1.7)*l*.55*n,r[c]>Nt.x1&&(r[c]=Nt.x0),r[c]<Nt.x0&&(r[c]=Nt.x1),r[c+2]>Nt.z1&&(r[c+2]=Nt.z0),r[c+2]<Nt.z0&&(r[c+2]=Nt.z1);const u=t==="leaves"?.15:.1;r[c+1]<u&&(r[c+1]=Nt.top-Math.random()*3,r[c]=Nt.x0+Math.random()*(Nt.x1-Nt.x0),r[c+2]=Nt.z0+Math.random()*(Nt.z1-Nt.z0))}}e.geo.attributes.position.needsUpdate=!0}}const En=32,hi=22,zr=2,Gr=1.35,Xc=-32,qc=-6,to=3.85,eo=10.25;class I_{constructor(){this.items=[]}get size(){return this.items.length}push(t){const e=this.items;e.push(t);let n=e.length-1;for(;n>0;){const s=n-1>>1;if(e[s].f<=e[n].f)break;[e[s],e[n]]=[e[n],e[s]],n=s}}pop(){const t=this.items;if(!t.length)return null;const e=t[0],n=t.pop();if(t.length){t[0]=n;let s=0;for(;;){const r=s*2+1,a=r+1;let o=s;if(r<t.length&&t[r].f<t[o].f&&(o=r),a<t.length&&t[a].f<t[o].f&&(o=a),o===s)break;[t[o],t[s]]=[t[s],t[o]],s=o}}return e}}class U_{constructor(t){this.blocked=new Uint8Array(En*hi),this.build(t)}idx(t,e){return e*En+t}inBounds(t,e){return t>=0&&t<En&&e>=0&&e<hi}center(t,e){return{x:Xc+(t+.5)*zr,z:qc+(e+.5)*Gr}}cellOf(t,e){return{c:Oi.clamp(Math.floor((t-Xc)/zr),0,En-1),r:Oi.clamp(Math.floor((e-qc)/Gr),0,hi-1)}}build(t){const e=t.treeXs||[];for(let n=0;n<hi;n++)for(let s=0;s<En;s++){const{x:r,z:a}=this.center(s,n);let o=a<to||a>eo;if(!o){for(const[l,h,c,u]of t.blockedRects)if(r>l-.35&&r<h+.35&&a>c-.35&&a<u+.35){o=!0;break}}if(!o){for(const l of e)if(Math.hypot(r-l,a-7.3)<1.15){o=!0;break}}if(!o){for(const l of[-20,-6.5,4.8,14.2,25])if(Math.hypot(r-l,a-9.62)<.55){o=!0;break}}this.blocked[this.idx(s,n)]=o?1:0}}isBlocked(t,e,n=null){return!!(!this.inBounds(t,e)||this.blocked[this.idx(t,e)]||n&&n.has(this.idx(t,e)))}nearestFree(t,e,n=null){if(!this.isBlocked(t,e,n))return{c:t,r:e};for(let s=1;s<12;s++)for(let r=-s;r<=s;r++)for(let a=-s;a<=s;a++){if(Math.max(Math.abs(a),Math.abs(r))!==s)continue;const o=t+a,l=e+r;if(!this.isBlocked(o,l,n))return{c:o,r:l}}return{c:t,r:e}}findPath(t,e,n,s,r=null){const a=this.nearestFree(this.cellOf(t,e).c,this.cellOf(t,e).r,r),o=this.nearestFree(this.cellOf(n,s).c,this.cellOf(n,s).r,r),l=this.idx(a.c,a.r),h=this.idx(o.c,o.r);if(l===h)return[this.center(a.c,a.r)];const c=new Float32Array(En*hi).fill(1/0),u=new Float32Array(En*hi).fill(1/0),d=new Int32Array(En*hi).fill(-1),p=new Uint8Array(En*hi),_=new I_,v=this.center(o.c,o.r),g=(f,D)=>{const R=this.center(f,D);return Math.hypot(R.x-v.x,R.z-v.z)};c[l]=0,u[l]=g(a.c,a.r),_.push({i:l,c:a.c,r:a.r,f:u[l]});const m=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];for(;_.size;){const f=_.pop();if(!p[f.i]){if(p[f.i]=1,f.i===h)break;for(const[D,R]of m){const P=f.c+D,I=f.r+R;if(!this.inBounds(P,I)||this.isBlocked(P,I,r)||D!==0&&R!==0&&(this.isBlocked(f.c+D,f.r,r)||this.isBlocked(f.c,f.r+R,r)))continue;const x=this.idx(P,I);if(p[x])continue;const S=D!==0&&R!==0?Math.hypot(zr,Gr):D!==0?zr:Gr,U=c[f.i]+S;U<c[x]&&(c[x]=U,u[x]=U+g(P,I),d[x]=f.i,_.push({i:x,c:P,r:I,f:u[x]}))}}}if(d[h]===-1&&h!==l)return[];const w=[];let T=h;for(;T!==-1;){const f=T%En,D=T/En|0;if(w.push(this.center(f,D)),T===l)break;T=d[T]}return w.reverse(),this.smooth(w,r)}lineOfSight(t,e,n=null){const s=Math.hypot(e.x-t.x,e.z-t.z),r=Math.max(2,Math.ceil(s/.3));for(let a=0;a<=r;a++){const o=a/r,l=t.x+(e.x-t.x)*o,h=t.z+(e.z-t.z)*o;if(h<to||h>eo)return!1;const{c,r:u}=this.cellOf(l,h);if(this.isBlocked(c,u,n))return!1}return!0}smooth(t,e=null){if(t.length<=2)return t;const n=[t[0]];let s=0;for(;s<t.length-1;){let r=t.length-1;for(;r>s+1&&!this.lineOfSight(t[s],t[r],e);)r--;n.push(t[r]),s=r}return n}isWalkableWorld(t,e){if(e<to||e>eo)return!1;const{c:n,r:s}=this.cellOf(t,e);return!this.blocked[this.idx(n,s)]}}function N_(){const i=document.createElement("canvas");i.width=i.height=128;const t=i.getContext("2d"),e=t.createRadialGradient(64,64,0,64,64,64);e.addColorStop(0,"rgba(0,0,0,0.55)"),e.addColorStop(.55,"rgba(0,0,0,0.24)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,128,128);const n=new Dh(i);return n.colorSpace=en,n}function O_(i){const t=new ie,e=new ie;t.add(e);const n=new ee({color:i.coat,roughness:.78,metalness:.06}),s=new ee({color:i.accent,roughness:.72,metalness:.08}),r=new ee({color:i.skin,roughness:.75}),a=new ee({color:i.hair,roughness:.9}),o=new ee({color:i.pants,roughness:.82}),l=new ee({color:1316378,roughness:.7}),h=new ie,c=new ie;h.position.set(-.11,.88,0),c.position.set(.11,.88,0),t.add(h,c),[h,c].forEach(D=>{const R=new At(new ys(.075,.38,3,8),o);R.position.y=-.25,R.castShadow=!0,D.add(R);const P=new At(new yn(.16,.09,.28),l);P.position.set(0,-.52,.06),P.castShadow=!0,D.add(P)});const u=new At(new ys(.185,.46,4,10),n);u.position.y=1.22,u.castShadow=!0,e.add(u);const d=new At(new yn(.3,.42,.05),s);d.position.set(0,1.12,.185),e.add(d);const p=new At(new yn(.13,.05,.02),new Wt({color:14203e3,toneMapped:!1}));p.position.set(0,1.36,.2),e.add(p);const _=new ie,v=new ie;_.position.set(-.265,1.4,0),v.position.set(.265,1.4,0),e.add(_,v),[_,v].forEach(D=>{const R=new At(new ys(.065,.34,3,8),n);R.position.y=-.22,R.castShadow=!0,D.add(R);const P=new At(new pi(.065,8,6),r);P.position.y=-.44,D.add(P)});const g=new At(new An(.06,.07,.08,8),r);g.position.y=1.52,e.add(g);const m=new At(new pi(.155,14,12),r);m.position.y=1.67,m.castShadow=!0,e.add(m);const w=new At(new pi(.16,14,10,0,Math.PI*2,0,Math.PI*.62),a);if(w.position.y=1.7,e.add(w),i.cap){const D=new At(new An(.17,.175,.1,14),s);D.position.y=1.79,e.add(D);const R=new At(new yn(.3,.025,.16),s);R.position.set(0,1.75,.18),e.add(R)}const T=new Wt({map:N_(),transparent:!0,opacity:.7,depthWrite:!1}),f=new At(new Gi(.9,.9),T);return f.rotation.x=-Math.PI/2,f.position.y=.01,t.add(f),{group:t,upper:e,legL:h,legR:c,armL:_,armR:v,torso:u,head:m}}class F_{constructor(t,e,n,s={}){this.scene=t,this.world=e,this.camera=n,this.nav=new U_(e.nav),this.onTaskUpdate=s.onTaskUpdate||(()=>{}),this.onStepComplete=s.onStepComplete||(()=>{}),this.npcs=[],this.entries=[],this.questSeq=7,this.chain={step:0,done:[!1,!1,!1],active:!1,cool:0},this.build(),this.questState={step:0,done:[!1,!1,!1],statuses:["active","pending","pending"],questNo:this.questNo()},this.startChainDelay=1.6}questNo(){return`GW-1122-${String(this.questSeq).padStart(2,"0")}`}build(){const t=[{id:"npc-lin",name:"林晓",role:"报销专员",code:"NPC-01",coat:3881530,accent:11569742,skin:13872528,hair:1512466,pants:2040617,start:[1.4,8.9],speed:1.45,cap:!1},{id:"npc-zheng",name:"郑野",role:"机修主管",code:"NPC-02",coat:2504776,accent:9071157,skin:12159079,hair:1315602,pants:1909288,start:[-3.4,5.6],speed:1.2,cap:!0},{id:"npc-su",name:"苏禾",role:"财务复核",code:"NPC-03",coat:2902600,accent:12953450,skin:14268059,hair:1709330,pants:2303789,start:[-16.6,6.4],speed:1.15,cap:!1},{id:"npc-kai",name:"阿凯",role:"仓储配送",code:"NPC-04",coat:4930092,accent:11110219,skin:12356458,hair:1315344,pants:2106410,start:[12.4,9.5],speed:1.3,cap:!0}],e=this.world.npcMeta;t.forEach(n=>{const s=O_(n);s.group.position.set(n.start[0],.15,n.start[1]),s.group.rotation.y=Math.PI*.15,this.scene.add(s.group);const r=this.world.makeLabelSprite(n.code,n.name,n.role.toUpperCase());r.scale.set(3,.75,1),r.position.set(n.start[0],2.5,n.start[1]),this.scene.add(r),this.world.labels.push(r);const a=this.world.registerEntry({id:n.id,...e[n.id],objects:[s.group],focus:[n.start[0],1.2,n.start[1]],radius:.85});a.getFocus=()=>new C(o.group.position.x,1.35,o.group.position.z);const o={...n,...s,label:r,pos:new C(n.start[0],.15,n.start[1]),path:[],pathIndex:0,state:"idle",waitTimer:0,waitCb:null,phase:Math.random()*6.28,angle:Math.PI*.15,stuck:0,lastX:n.start[0],lastZ:n.start[1],scheduleIndex:0,onArrive:null,entry:a};this.npcs.push(o),this.entries.push(a)}),this.lin=this.npcs[0],this.zheng=this.npcs[1],this.su=this.npcs[2],this.kai=this.npcs[3],this.schedules={"npc-zheng":[[-3.6,4.7],[14.8,4.3],[-1.8,4.7],[9,9.4]],"npc-su":[[-18.4,4.6],[5,8.1],[-2.2,8.7]],"npc-kai":[[12.8,4.3],[10.4,9.4],[25.6,4.5],[20.2,8.7]]},this.npcs.slice(1).forEach(n=>this.nextSchedule(n,!0))}nextSchedule(t,e=!1){const n=this.schedules[t.id],s=n[t.scheduleIndex%n.length];t.scheduleIndex++,this.goTo(t,s[0],s[1],()=>{this.wait(t,1.4+Math.random()*2.2,()=>this.nextSchedule(t))},e)}goTo(t,e,n,s=null,r=!1){const a=this.dynamicBlocked(t),o=this.nav.findPath(t.pos.x,t.pos.z,e,n,a);if(t.path=o,t.pathIndex=0,t.onArrive=s,t.stuck=0,!o.length){t.state="work",t.waitTimer=.8,t.waitCb=s;return}t.state="walk"}wait(t,e,n){t.state="work",t.waitTimer=e,t.waitCb=n}dynamicBlocked(t){const e=new Set;for(const n of this.npcs){if(n===t)continue;const{c:s,r}=this.nav.cellOf(n.pos.x,n.pos.z);e.add(this.nav.idx(s,r))}return e}startChain(){this.questSeq++,this.chain.step=0,this.chain.done=[!1,!1,!1],this.chain.active=!0,this.chain.cool=0,this.emitTask(),this.startStep(0)}startStep(t){this.chain.step=t,this.emitTask();const e=[[3.1,7.7],[5,8.1],[-18.4,4.6]],n=[2,2.2,2.8];this.lin.state="idle",this.wait(this.lin,.35,()=>{this.goTo(this.lin,e[t][0],e[t][1],()=>{this.wait(this.lin,n[t],()=>{this.chain.done[t]=!0,this.onStepComplete(t,this.questState.questNo),this.emitTask(),t<2?this.startStep(t+1):(this.chain.active=!1,this.chain.cool=11,this.emitTask())})})})}emitTask(){const t=this.chain.done.map((e,n)=>e?"done":n===this.chain.step&&this.chain.active?"active":"pending");this.questState={step:this.chain.step,done:[...this.chain.done],statuses:t,questNo:this.questNo(),active:this.chain.active},this.onTaskUpdate(this.questState)}triggerNewClaim(){this.startChain()}update(t,e){this.startChainDelay>0&&(this.startChainDelay-=t,this.startChainDelay<=0&&this.startChain()),this.chain.active||(this.chain.cool-=t,this.chain.cool<=0&&this.startChainDelay<=0&&this.startChain()),this.chain.active&&this.chain.step===2&&!this.su.chainAssigned&&(this.su.chainAssigned=!0,this.goTo(this.su,-21.2,4.6,()=>this.wait(this.su,4.2,()=>{this.su.chainAssigned=!1,this.nextSchedule(this.su)}))),this.chain.active||(this.su.chainAssigned=!1);for(const n of this.npcs)this.updateNPC(n,t,e)}updateNPC(t,e,n){let s=!1;const r=!this.nav.isWalkableWorld(t.pos.x,t.pos.z);if(t.blockedTime=(t.blockedTime||0)+(r?e:-e*2),t.blockedTime>1.2){const{c:a,r:o}=this.nav.nearestFree(this.nav.cellOf(t.pos.x,t.pos.z).c,this.nav.cellOf(t.pos.x,t.pos.z).r),l=this.nav.center(a,o);t.pos.set(l.x,.15,l.z),t.blockedTime=0,t.state==="walk"&&(t.path=this.nav.findPath(t.pos.x,t.pos.z,t.path[t.path.length-1]?.x??t.pos.x,t.path[t.path.length-1]?.z??t.pos.z),t.pathIndex=0),t.stuck=0}if(t.state==="walk"&&t.path.length){const a=t.path[t.pathIndex],o=a.x-t.pos.x,l=a.z-t.pos.z,h=Math.hypot(o,l);if(h<.22){if(t.pathIndex++,t.pathIndex>=t.path.length){t.state="idle",t.path=[];const u=t.onArrive;t.onArrive=null,u&&u()}}else{s=!0;let u=o/h,d=l/h,p=0,_=0;for(const f of this.npcs){if(f===t)continue;const D=t.pos.x-f.pos.x,R=t.pos.z-f.pos.z,P=Math.hypot(D,R);if(P>.001&&P<1.15){const I=(1.15-P)/1.15;p+=D/P*I*.9,_+=R/P*I*.9}}u+=p,d+=_;const v=Math.hypot(u,d)||1;u/=v,d/=v;const g=t.speed*e,m=t.pos.x+u*g,w=t.pos.z+d*g;this.nav.isWalkableWorld(m,w)&&this.nav.isWalkableWorld(m+.05,w+.05)?(t.pos.x=m,t.pos.z=w):t.stuck+=e*1.6;const T=Math.atan2(u,d);t.angle=this.lerpAngle(t.angle,T,1-Math.exp(-e*9)),t.group.rotation.y=t.angle,t.phase+=e*(5+t.speed*2.2),t.legL.rotation.x=Math.sin(t.phase)*.52,t.legR.rotation.x=-Math.sin(t.phase)*.52,t.armL.rotation.x=-Math.sin(t.phase)*.38,t.armR.rotation.x=Math.sin(t.phase)*.38,t.upper.position.y=Math.abs(Math.sin(t.phase))*.025,t.head.rotation.z=Math.sin(t.phase*.5)*.02}const c=Math.hypot(t.pos.x-t.lastX,t.pos.z-t.lastZ);if(t.lastX=t.pos.x,t.lastZ=t.pos.z,s&&c<.002?t.stuck+=e:t.stuck=Math.max(0,t.stuck-e*.4),t.stuck>1.1&&t.path.length){t.stuck=0;const u=t.path[t.path.length-1],d=t.onArrive;this.goTo(t,u.x,u.z,d),t.path.length||(t.state="idle",t.waitTimer=1)}}else if(t.state==="work"){if(t.waitTimer-=e,t.upper.position.y=Math.sin(n*1.8+t.phase)*.008,t.armL.rotation.x=-.12+Math.sin(n*1.2)*.03,t.armR.rotation.x=.18+Math.sin(n*1.1)*.03,t.legL.rotation.x=0,t.legR.rotation.x=0,t.waitTimer<=0){t.state="idle";const a=t.waitCb;t.waitCb=null,a&&a()}}else t.upper.position.y=Math.sin(n*1.6+t.phase)*.007,t.armL.rotation.x*=.96,t.armR.rotation.x*=.96,t.legL.rotation.x*=.92,t.legR.rotation.x*=.92,t.state==="idle"&&t.waitTimer>0&&(t.waitTimer-=e);t.group.position.set(t.pos.x,.15,t.pos.z),t.label.position.set(t.pos.x,2.42,t.pos.z),t.entry.focus.set(t.pos.x,1.35,t.pos.z)}lerpAngle(t,e,n){let s=(e-t+Math.PI)%(Math.PI*2)-Math.PI;return s<-Math.PI&&(s+=Math.PI*2),t+s*n}get entryCount(){return this.entries.length}}const Yc=[2568765,3942952,2240568,4866099,1843753,5451822,2964022];class B_{constructor(t,e){this.scene=t,this.world=e,this.count=12,this.cars=[],this.hoverInstance=-1,this.hoverFocus=new C,this.buildCars(),this.buildPedestrians(),this.registerEntry(),this.update(.016,0)}buildCars(){const t=this.count,e=new di(4.1,.58,1.88,3,.16),n=new di(2.1,.52,1.68,3,.14),s=new An(.3,.3,.24,14),r=new ee({color:16777215,metalness:.86,roughness:.3,envMapIntensity:1.3}),a=new Yr({color:659478,metalness:.6,roughness:.08,envMapIntensity:2,clearcoat:1}),o=new ee({color:921619,roughness:.9,metalness:.05});this.bodyMesh=new Gs(e,r,t),this.cabinMesh=new Gs(n,a,t),this.wheelMesh=new Gs(s,o,t*4),this.bodyMesh.castShadow=!1,this.bodyMesh.receiveShadow=!1,this.cabinMesh.castShadow=!1,this.wheelMesh.castShadow=!1,this.bodyMesh.frustumCulled=!1,this.cabinMesh.frustumCulled=!1,this.wheelMesh.frustumCulled=!1;for(let _=0;_<t;_++){const v=_<t/2?0:1,m={dir:v===0?1:-1,z:v===0?14.7:23.1,x:-46+_%(t/2)*15+Math.random()*8,speed:6.5+Math.random()*6.5,y:0,color:new Rt(Yc[Math.floor(Math.random()*Yc.length)])};this.cars.push(m),this.bodyMesh.setColorAt(_,m.color)}this.bodyMesh.instanceColor.needsUpdate=!0,this.scene.add(this.bodyMesh,this.cabinMesh,this.wheelMesh);const l=t*4,h=new Float32Array(l*3),c=new Float32Array(l*3),u=new Float32Array(l);for(let _=0;_<t;_++){const v=new Rt(16773327),g=new Rt(16731452);for(let m=0;m<4;m++){const w=_*4+m,T=m<2?v:g;c[w*3]=T.r,c[w*3+1]=T.g,c[w*3+2]=T.b,u[w]=m<2?.22:.16}}const d=new Te;d.setAttribute("position",new se(h,3).setUsage(Xn)),d.setAttribute("aColor",new se(c,3)),d.setAttribute("aSize",new se(u,1));const p=new Re({transparent:!0,depthWrite:!1,blending:De,uniforms:{uScale:{value:900},uOpacity:{value:1}},vertexShader:`
        attribute vec3 aColor; attribute float aSize;
        varying vec3 vColor; uniform float uScale;
        void main(){
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(aSize * uScale / max(0.5, -mv.z), 1.0, 48.0);
        }`,fragmentShader:`
        varying vec3 vColor;
        uniform float uOpacity;
        void main(){
          vec2 p = gl_PointCoord - 0.5;
          float d = length(p);
          float a = smoothstep(0.5, 0.04, d);
          gl_FragColor = vec4(vColor, a * 0.9 * uOpacity);
        }`});this.lightPoints=new Ni(d,p),this.lightPoints.frustumCulled=!1,this.scene.add(this.lightPoints),this.lightPositions=h,this._bodyDummy=new Ue,this._mat=new ce,this._quat=new Qn,this._pos=new C,this._scale=new C(1,1,1),this._local=new ce,this._wheelQuat=new Qn().setFromAxisAngle(new C(1,0,0),Math.PI/2)}buildPedestrians(){this.pedestrians=[];const e=new ys(.17,.55,4,8),n=new pi(.135,10,8),s=new ee({color:16777215,roughness:.85,metalness:.05}),r=new ee({color:16777215,roughness:.8});this.pedBody=new Gs(e,s,14),this.pedHead=new Gs(n,r,14),this.pedBody.frustumCulled=!1,this.pedHead.frustumCulled=!1;const a=[3884624,5127220,3029556,5591114,3879492,6309167,2899016],o=[13215115,11107939,14268059,9398098];for(let l=0;l<14;l++){const h=l%2===0?1:-1;this.pedestrians.push({x:-34+Math.random()*68,z:l%2===0?9.05:5.15,dir:h,speed:.35+Math.random()*.55,phase:Math.random()*6.28,color:new Rt(a[Math.floor(Math.random()*a.length)]),skin:new Rt(o[Math.floor(Math.random()*o.length)])}),this.pedBody.setColorAt(l,this.pedestrians[l].color),this.pedHead.setColorAt(l,this.pedestrians[l].skin)}this.pedBody.instanceColor.needsUpdate=!0,this.pedHead.instanceColor.needsUpdate=!0,this.scene.add(this.pedBody,this.pedHead)}registerEntry(){const t=this.world.registerEntry({id:"traffic",code:"GW-18",name:"夜间车流 · TRAFFIC",en:"NIGHT TRAFFIC / 主干道",category:"业务设施",tags:["通勤里程","差旅数据","实时车流"],desc:"门前主干道的车流由 GPU InstancedMesh 驱动，双向车道循环不息。车灯掠过湿柏油形成流动的反光，通勤里程与差旅数据同步进入报销中心。",specs:[["在途车辆","12 辆"],["通勤里程","1,284 km"],["车道","双向 4 车道"],["数据同步","实时"]],docs:[["01","本周通勤里程","TRF-2026-11-W4","实时"],["02","差旅补贴清单","TRF-2026-11-010","待审批"]],amount:0,amountNote:"本周通勤 1,284 km",preset:{category:"差旅与交通",entity:"仓储中心",vendor:"场景通勤数据",cost:"GW-DEPOT-03 · 仓储物流",note:"夜间班次通勤与配件配送里程补贴，按场景车流数据自动核算。"},objects:[this.bodyMesh,this.cabinMesh],focus:[0,1,19],radius:1.2,dynamicFocus:!0});t.onHoverInstance=e=>{this.hoverInstance=e},t.getFocus=()=>{const e=this.cars[this.hoverInstance];return e?this.hoverFocus.set(e.x,e.y+1.1,e.z):this.hoverFocus.set(0,1.1,19),this.hoverFocus},this.entry=t}setViewScale(t){this.lightPoints.material.uniforms.uScale.value=t}update(t,e){const n=this._bodyDummy,s=this._mat,r=this._quat,a=this._pos,o=this._scale,l=this._local;for(let c=0;c<this.cars.length;c++){const u=this.cars[c];u.x+=u.dir*u.speed*t,u.x>47&&(u.x=-47),u.x<-47&&(u.x=47),r.setFromAxisAngle(new C(0,1,0),u.dir>0?0:Math.PI),a.set(u.x,0,u.z),s.compose(a,r,o),l.makeTranslation(0,.62,0),this.bodyMesh.setMatrixAt(c,s.clone().multiply(l)),l.makeTranslation(-.15,1.13,0),this.cabinMesh.setMatrixAt(c,s.clone().multiply(l));const d=[-1.32,1.32],p=[-.82,.82];let _=0;for(const I of d)for(const x of p)l.compose(new C(I,.32,x),this._wheelQuat,new C(1,1,1)),this.wheelMesh.setMatrixAt(c*4+_,s.clone().multiply(l)),_++;const v=this.lightPositions,g=2.07,m=-2.03,w=u.dir,T=u.x+g*w,f=u.x+m*w,D=.66,R=u.z-.62,P=u.z+.62;v[c*12]=T,v[c*12+1]=D,v[c*12+2]=R,v[c*12+3]=T,v[c*12+4]=D,v[c*12+5]=P,v[c*12+6]=f,v[c*12+7]=D,v[c*12+8]=R,v[c*12+9]=f,v[c*12+10]=D,v[c*12+11]=P,c===this.hoverInstance&&this.hoverFocus.set(u.x,1.1,u.z)}this.bodyMesh.instanceMatrix.needsUpdate=!0,this.cabinMesh.instanceMatrix.needsUpdate=!0,this.wheelMesh.instanceMatrix.needsUpdate=!0,this.lightPoints.geometry.attributes.position.needsUpdate=!0;const h=n;for(let c=0;c<this.pedestrians.length;c++){const u=this.pedestrians[c];u.x+=u.dir*u.speed*t,u.x>34&&(u.x=-34,u.z=u.z===9.05?9.25:5.15),u.x<-34&&(u.x=34,u.z=u.z===9.05?9.25:5.15);const d=Math.sin(e*4.2+u.phase)*.025;h.position.set(u.x,.85+d,u.z),h.rotation.set(0,0,0),h.updateMatrix(),this.pedBody.setMatrixAt(c,h.matrix),h.position.set(u.x,1.5+d,u.z),h.updateMatrix(),this.pedHead.setMatrixAt(c,h.matrix)}this.pedBody.instanceMatrix.needsUpdate=!0,this.pedHead.instanceMatrix.needsUpdate=!0}}const Xs=i=>new Intl.NumberFormat("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2}).format(i);class k_{constructor(t,e,n,s,r={}){this.world=t,this.season=e,this.npcs=n,this.audio=s,this.handlers=r,this.selectedEntry=null,this.hoveredEntry=null,this.formOpen=!1,this.auto=!0,this.formEntry=null,this.claimSeq=82,this.kpiValue=286400,this.attachments=2,this.$=a=>document.getElementById(a),this.seasonButtons=[...document.querySelectorAll(".season-btn")],this.steps=[...document.querySelectorAll(".qstep")],this.qlineFill=this.$("qline-fill"),this.tooltip=this.$("tooltip"),this.toastStack=this.$("toast-stack"),this.dossier=this.$("dossier"),this.dossierInner=this.$("dossier-inner"),this.formDrawer=this.$("form-drawer"),this.bind(),this.clock(),setInterval(()=>this.clock(),2e4),this.updateKinetic()}updateKinetic(){clearInterval(this._clockTimer),this._clockTimer=setInterval(()=>this.clock(),1e3)}clock(){try{const t=new Date,e=new Intl.DateTimeFormat("zh-CN",{timeZone:"Asia/Shanghai",hour:"2-digit",minute:"2-digit",hour12:!1}).format(t),n=this.$("clock");n&&(n.textContent=e)}catch{}}bind(){this.seasonButtons.forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.season;this.season.setSeason(e,!0),this.audio.click(),this.audio.whoosh(),this.setActiveSeason(e)})}),this.$("auto-season").addEventListener("click",()=>{this.auto=!this.auto,this.season.setAuto(this.auto),this.$("auto-season").classList.toggle("is-on",this.auto),this.$("auto-season").classList.toggle("off",!this.auto),this.audio.click(),this.toast(this.auto?"季节已恢复自动轮转":"季节切换已锁定为手动"),this.updateSeason(this.season.getInfo())}),this.$("cinema-btn").addEventListener("click",()=>{const t=!this.handlers.getCinema();this.handlers.setCinema(t),this.$("cinema-btn").classList.toggle("is-on",t),this.audio.click()}),this.$("sound-btn").addEventListener("click",()=>{const t=!this.handlers.getSound();this.handlers.setSound(t),this.$("sound-btn").classList.toggle("is-on",t),t&&this.audio.click()}),this.$("label-btn").addEventListener("click",()=>{const t=!this.handlers.getLabels();this.handlers.setLabels(t),this.$("label-btn").classList.toggle("is-on",t),this.audio.click()}),this.$("reset-btn").addEventListener("click",()=>{this.audio.click(),this.handlers.onResetCamera()}),this.$("new-claim-btn").addEventListener("click",()=>{this.formOpen||(this.audio.click(),this.handlers.onOpenClaim(this.world.entryById.get("garage")))}),this.$("form-close").addEventListener("click",()=>this.closeForm()),this.$("form-cancel").addEventListener("click",()=>this.closeForm()),this.$("success-back").addEventListener("click",()=>this.closeForm()),document.addEventListener("keydown",t=>{t.key==="Escape"&&(this.formOpen?this.closeForm():this.selectedEntry&&this.closeDossier(!0))}),this.$("form-scrim").addEventListener("click",()=>this.closeForm()),this.$("f-amount").addEventListener("input",()=>{const t=parseFloat(this.$("f-amount").value)||0;this.$("form-total").textContent=`¥${Xs(t)}`,this.markFormStep(1)}),document.querySelectorAll(".pay-opt").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".pay-opt").forEach(e=>e.classList.remove("is-active")),t.classList.add("is-active"),this.audio.hover()})}),this.$("attach-btn").addEventListener("click",()=>{this.audio.click(),this.attachments+=1;const t=document.createElement("span");t.className="attach-chip",t.innerHTML=`INV-${4417+this.attachments*3}.pdf <i>已验真</i>`,this.$("attach-list").appendChild(t),this.toast("发票附件已验真并加入单据")}),this.$("claim-form").addEventListener("submit",t=>{t.preventDefault(),this.submitForm()}),this.$("form-submit").addEventListener("click",t=>{t.preventDefault(),this.submitForm()})}setActiveSeason(t){this.seasonButtons.forEach(e=>e.classList.toggle("is-active",e.dataset.season===t))}updateSeason(t){this.auto=t.auto;const e={spring:"春",summer:"夏",autumn:"秋",winter:"冬"};this.$("season-glyph").textContent=e[t.key]||"冬",this.$("season-name").textContent=t.label,this.$("season-en").textContent=t.en,this.$("wx-temp").textContent=t.temp,this.$("wx-wind").textContent=t.wind,this.$("wx-vis").textContent=t.vis,this.$("stat-particles").textContent=t.particles.toLocaleString("en-US"),this.$("auto-season").classList.toggle("is-on",t.auto),this.$("auto-season").classList.toggle("off",!t.auto),this.$("auto-count").textContent=t.auto?`${Math.ceil(t.countdown)}s`:"手动",this.$("auto-season").classList.toggle("off",!t.auto);const n=Math.max(0,Math.min(360,(1-t.countdown/28)*360));this.$("season-ring").style.background=`conic-gradient(#d8b878 ${n}deg, rgba(216,184,120,0.12) ${n}deg)`;const s=Math.max(0,Math.min(1,1-t.countdown/28));this.$("season-progress").style.width=`${s*100}%`,this.setActiveSeason(t.key)}updateQuest(t){this.$("quest-no").textContent=t.questNo,this.steps.forEach((n,s)=>{const r=t.statuses[s];n.classList.toggle("is-active",r==="active"),n.classList.toggle("is-done",r==="done");const a=n.querySelector(".qstate");a.textContent=r==="done"?"已完成":r==="active"?"进行中":"等待"});const e=t.done.filter(Boolean).length;this.qlineFill.style.width=`${e/3*100}%`}updatePerf(t,e){this.$("stat-fps").textContent=t,this.$("stat-calls").textContent=e,this.$("stat-entries").textContent=this.world.entries.length}updateKPI(t=0){this.kpiValue+=t,this.$("kpi-total").textContent=`¥${Math.round(this.kpiValue).toLocaleString("en-US")}`}showTooltip(t,e,n){this.tooltip.querySelector(".tt-code").textContent=t.code,this.tooltip.querySelector(".tt-name").textContent=t.name,this.tooltip.style.left=`${e}px`,this.tooltip.style.top=`${n}px`,this.tooltip.classList.add("show")}hideTooltip(){this.tooltip.classList.remove("show")}showDossier(t){this.selectedEntry=t;const e=this.world.entries.indexOf(t)+1,n=t.amount>0?`<span>建议报销额度</span><b>¥${Xs(t.amount)}</b>`:`<span>场景实时读数</span><b style="font-size:13px;letter-spacing:.06em">${t.amountNote||"—"}</b>`,s=(t.specs||[]).map(([o,l])=>`<div class="spec-row"><span>${o}</span><b>${l}</b></div>`).join(""),r=(t.docs||[]).map(([o,l,h,c])=>`
      <div class="doc-row">
        <i>${o}</i>
        <div><b>${l}</b><span>${h}</span></div>
        <em style="${c.includes("验真")||c.includes("归档")||c==="实时"?"color:var(--mint)":"color:var(--gold)"}">${c}</em>
      </div>`).join(""),a=t.npc?`
      <div class="npc-mini">
        <div class="npc-avatar">${t.name.slice(0,1)}</div>
        <div><b>${t.name.split(" · ")[0]}</b><span>32 × 22 网格 A* · 同伴分离</span></div>
        <em>LIVE</em>
      </div>`:"";this.dossierInner.innerHTML=`
      <div class="dossier-top">
        <div class="dossier-kicker">FACILITY DOSSIER / <b>${String(e).padStart(2,"0")}</b></div>
        <button class="close-btn" data-close aria-label="关闭档案">
          <svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5 5 15"/></svg>
        </button>
      </div>
      <div class="dossier-idx">${String(e).padStart(2,"0")}</div>
      <h3 class="dossier-title">${t.name}</h3>
      <div class="dossier-en">${t.en}</div>
      <div class="dossier-tags">${(t.tags||[]).map(o=>`<i>${o}</i>`).join("")}</div>
      <p class="dossier-desc">${t.desc}</p>
      ${a}
      <div class="dossier-sec">
        <div class="dossier-sec-head"><span>档案参数</span><em>SCENE READOUT</em></div>
        ${s}
      </div>
      <div class="dossier-sec">
        <div class="dossier-sec-head"><span>关联单据</span><em>LINKED DOCUMENTS</em></div>
        ${r}
      </div>
      <div class="dossier-total">${n}</div>
      <button class="dossier-cta" id="dossier-cta">${t.npc?"查看任务链":"发起报销"}</button>
      <button class="dossier-secondary" id="dossier-secondary">${t.npc?"定位到员工":"在场景中重新定位"}</button>
    `,this.dossier.classList.add("is-open"),this.audio.open(),this.dossierInner.querySelector("[data-close]").addEventListener("click",()=>this.closeDossier(!0)),this.dossierInner.querySelector("#dossier-cta").addEventListener("click",()=>{t.npc?(this.closeDossier(!1),this.handlers.onFocusQuest(t)):this.handlers.onOpenClaim(t)}),this.dossierInner.querySelector("#dossier-secondary").addEventListener("click",()=>{this.closeDossier(!1),this.handlers.onLocate(t)})}closeDossier(t=!0){this.dossier.classList.remove("is-open");const e=this.selectedEntry;this.selectedEntry=null,t&&e&&this.handlers.onDossierClose(e)}openForm(t){const e=this.world.entryById.get("garage"),n=t||e,s=n.preset||e.preset;this.formEntry=n,this.formOpen=!0,this.claimSeq+=1;const r=`GW-2026-1122-${String(this.claimSeq).padStart(3,"0")}`;this.currentFormNo=r,this.$("form-no").textContent=r,this.$("form-source-label").textContent=n.name,this.$("form-source-code").textContent=n.code,this.$("cap-title").textContent=n.name,this.$("cap-sub").textContent=`${n.category||"场景资产"} · ${s.category}科目`,this.$("cap-amount").textContent=n.amount>0?`¥ ${Xs(n.amount)}`:"待填写",this.$("f-category").value=s.category,this.$("f-entity").value=s.entity,this.$("f-amount").value=n.amount>0?String(n.amount):"",this.$("f-date").value="2026-11-22",this.$("f-invoice").value=`INV-2026-1122-${4100+this.claimSeq*7}`,this.$("f-vendor").value=s.vendor,this.$("f-cost").value=s.cost,this.$("f-note").value=s.note,this.$("form-total").textContent=`¥${Xs(n.amount||0)}`,this.$("form-success").classList.remove("show"),this.$("success-code").textContent=r,this.attachments=2,this.$("attach-list").innerHTML='<span class="attach-chip">INV-4417.pdf <i>已验真</i></span><span class="attach-chip">保养工单.jpg <i>已验真</i></span>',this.markFormStep(0),document.body.classList.add("form-open"),document.body.classList.remove("form-submitted"),this.formDrawer.classList.add("is-open"),this.$("form-body").scrollTop=0,this.hideTooltip(),this.closeDossier(!1)}markFormStep(t){[...document.querySelectorAll(".fstep")].forEach((n,s)=>n.classList.toggle("is-active",s===t))}submitForm(){if(document.body.classList.contains("form-submitted"))return;const t=parseFloat(this.$("f-amount").value)||0;if(t<=0){this.audio.error(),this.toast("请填入大于 0 的含税金额"),this.$("f-amount").focus();return}const e={formNo:this.currentFormNo,entryId:this.formEntry?.id,entryName:this.formEntry?.name,amount:t,category:this.$("f-category").value,entity:this.$("f-entity").value,vendor:this.$("f-vendor").value,note:this.$("f-note").value,invoice:this.$("f-invoice").value,pay:document.querySelector(".pay-opt.is-active")?.dataset.pay||"对公转账",attachments:this.attachments};document.body.classList.add("form-submitted"),this.$("form-success").classList.add("show"),this.$("form-success").querySelector("span").textContent=`${e.category} · ${e.attachments} 张发票 · ¥${Xs(e.amount)} 已锁定预算，NPC 林晓已接收取票任务。`,this.markFormStep(2),this.audio.success(),this.updateKPI(t),this.handlers.onSubmit(e),this.toast(`单据 ${e.formNo} 已提交，NPC 任务链重新启动`)}closeForm(){this.formOpen&&(this.formOpen=!1,document.body.classList.remove("form-open","form-submitted"),this.formDrawer.classList.remove("is-open"),this.$("form-success").classList.remove("show"),this.markFormStep(0),this.handlers.onFormClose())}toast(t,e=3600){const n=document.createElement("div");n.className="toast",n.textContent=t,this.toastStack.appendChild(n),setTimeout(()=>{n.classList.add("out"),setTimeout(()=>n.remove(),400)},e)}}class z_{constructor(){this.ctx=null,this.master=null,this.enabled=!0,this.noise=null}unlock(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=this.enabled?.5:0,this.master.connect(this.ctx.destination);const e=this.ctx.sampleRate*1.4,n=this.ctx.createBuffer(1,e,this.ctx.sampleRate),s=n.getChannelData(0);for(let r=0;r<e;r++)s[r]=Math.random()*2-1;this.noise=n}setEnabled(t){this.enabled=t,this.master&&this.ctx&&this.master.gain.setTargetAtTime(t?.5:0,this.ctx.currentTime,.05)}tone(t,e=.15,n="sine",s=.08,r=null,a=0){if(!this.ctx||!this.enabled)return;const o=this.ctx.currentTime+a,l=this.ctx.createOscillator(),h=this.ctx.createGain();l.type=n,l.frequency.setValueAtTime(t,o),r&&l.frequency.exponentialRampToValueAtTime(r,o+e),h.gain.setValueAtTime(1e-4,o),h.gain.exponentialRampToValueAtTime(s,o+.012),h.gain.exponentialRampToValueAtTime(1e-4,o+e),l.connect(h).connect(this.master),l.start(o),l.stop(o+e+.05)}noiseBurst(t=.45,e=.05,n=900,s=1.2){if(!this.ctx||!this.enabled||!this.noise)return;const r=this.ctx.currentTime,a=this.ctx.createBufferSource();a.buffer=this.noise;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(n,r),o.frequency.exponentialRampToValueAtTime(n*2.4,r+t),o.Q.value=s;const l=this.ctx.createGain();l.gain.setValueAtTime(1e-4,r),l.gain.exponentialRampToValueAtTime(e,r+t*.25),l.gain.exponentialRampToValueAtTime(1e-4,r+t),a.connect(o).connect(l).connect(this.master),a.start(r),a.stop(r+t+.05)}hover(){this.tone(1560,.05,"sine",.022,1280)}click(){this.tone(540,.08,"triangle",.045,480),this.tone(820,.12,"sine",.03,760,.03)}whoosh(){this.noiseBurst(.7,.055,420,.9)}step(){this.tone(660,.1,"sine",.04),this.tone(990,.16,"sine",.028,940,.09)}success(){[523.25,659.25,783.99,1046.5].forEach((t,e)=>this.tone(t,.5,"sine",.05,t*1.002,e*.11)),this.noiseBurst(.9,.03,1400,2)}error(){this.tone(190,.22,"sawtooth",.035,140)}open(){this.tone(110,.55,"sine",.035,165),this.noiseBurst(.55,.03,300,1)}}const Pn=document.getElementById("scene"),G_=new URLSearchParams(window.location.search),qn=G_.get("qa")==="1",$s=window.matchMedia("(pointer: coarse)").matches||window.innerWidth<760,qh=qn?1:$s?1.5:1.75,Ke={pos:new C(10.5,10.6,33.5),target:new C(-1.4,3.9,.8),introPos:new C(20.5,14.8,47),introTarget:new C(-1.8,4.6,.6)},Yh=40,K={cinematic:!0,sound:!0,labels:!0,intro:!1,formOpen:!1,claimActive:!1,dossierOpen:!1,hoveredEntry:null,selectedEntry:null,hoverPoint:new C,pointerDirty:!1,pointerClient:{x:0,y:0},cameraTween:null,savedCamera:null,pointerDown:null};let fe=null,Rn=null,Ee=null,Dt=null,dn=null,aa=null,be=null,on=null,Cs=null,Vn=null,oe=null;const gi=new z_,Ko=new Jd;Ko.far=90;const jo=new ut(-2,-2);let oa=performance.now(),Dn=0,$c=!1,no=0,io=0,so=0,Kc=0,qs=null;const $h=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2;function _i(i){return document.getElementById(i)}function Ri(i,t){_i("boot-fill").style.width=`${i}%`,_i("boot-pct").textContent=`${i}%`,_i("boot-text").textContent=t}function ds(){return new Promise(i=>requestAnimationFrame(()=>setTimeout(i,0)))}function H_(i){console.error(i);const t=_i("boot");t&&t.classList.add("hide"),_i("fatal").hidden=!1,_i("fatal-msg").textContent=i&&i.message?i.message:"当前浏览器需要开启 WebGL 2 与硬件加速。"}function rr(i,t,e,n=null,s=$h){K.cameraTween={fromPos:Ee.position.clone(),toPos:new C(i[0]??i.x,i[1]??i.y,i[2]??i.z),fromTarget:Dt.target.clone(),toTarget:new C(t[0]??t.x,t[1]??t.y,t[2]??t.z),duration:e,t:0,ease:s,onComplete:n},Dt.enabled=!1,Dt.autoRotate=!1}function Kh(i){const t=K.cameraTween;if(!t)return;t.t+=i;const e=Math.min(1,t.t/t.duration),n=t.ease(e);Ee.position.lerpVectors(t.fromPos,t.toPos,n),Dt.target.lerpVectors(t.fromTarget,t.toTarget,n),Ee.lookAt(Dt.target),e>=1&&(K.cameraTween=null,t.onComplete&&t.onComplete())}function V_(){K.intro=!0,Ee.position.copy(Ke.introPos),Dt.target.copy(Ke.introTarget),Ee.lookAt(Dt.target),Dt.enabled=!1,Dt.autoRotate=!1,rr(Ke.pos,Ke.target,5.2,()=>{K.intro=!1,Dt.enabled=!0,Dt.target.copy(Ke.target),Dt.autoRotate=K.cinematic,Dt.update()})}function la(){K.intro&&(K.intro=!1,K.cameraTween=null,Ee.position.copy(Ke.pos),Dt.target.copy(Ke.target),Ee.lookAt(Ke.target),Dt.enabled=!0,Dt.autoRotate=K.cinematic,Dt.update())}function W_(){K.formOpen||K.claimActive||(la(),oe.closeDossier(!1),K.selectedEntry=null,K.dossierOpen=!1,K.hoveredEntry=null,be.hideHover(),oe.hideTooltip(),rr(Ke.pos,Ke.target,1.25,()=>{Dt.enabled=!0,Dt.autoRotate=K.cinematic,Dt.update()}))}function Kr(i){if(!i||K.claimActive||K.formOpen)return;K.claimActive=!0,K.formOpen=!0,K.dossierOpen=!1,K.selectedEntry=null,K.hoveredEntry=null,oe.hideTooltip(),oe.closeDossier(!1),be.hideHover(),gi.open(),K.savedCamera={pos:Ee.position.clone(),target:Dt.target.clone()},Dt.autoRotate=!1,Dt.enabled=!1;const t=i.cameraStages,e=i.cameraTargets;let n=!1;const s=()=>{n||(n=!0,oe.openForm(i),K.formOpen=!0)};if(!t||!e){window.setTimeout(s,180);return}let r=0;const a=()=>{if(r>=t.length){s();return}const o=r===t.length-1;o&&s();const l=t[r],h=e[r],c=o?1.2:.95;r+=1,rr(l,h,c,()=>{r>=t.length?(Dt.enabled=!1,Dt.autoRotate=!1):a()})};a()}function jc(){K.formOpen=!1;const i=K.savedCamera;K.savedCamera=null,i?(Dt.autoRotate=!1,rr(i.pos,i.target,1.25,()=>{K.claimActive=!1,Dt.enabled=!0,Dt.autoRotate=K.cinematic,Dt.update()},$h)):(K.claimActive=!1,Dt.enabled=!0,Dt.autoRotate=K.cinematic,Dt.update()),K.hoveredEntry=null,K.selectedEntry=null,K.pointerDirty=!0}function X_(i){if(!i||K.formOpen||K.claimActive)return;K.selectedEntry=i,K.dossierOpen=!1;const t=i.cameraStages?i.cameraStages[i.cameraStages.length-1]:null,e=i.cameraTargets?i.cameraTargets[i.cameraTargets.length-1]:null;t&&e?rr(t,e,1.3,()=>{Dt.enabled=!0,Dt.autoRotate=K.cinematic,Dt.update()}):K.hoverPoint.copy(i.focus),be.showHover(i,K.hoverPoint),oe.toast(`已在场景中标记：${i.name}`)}function q_(){const i=_i("quest");i&&(i.style.transition="box-shadow .4s ease, border-color .4s ease",i.style.boxShadow="0 0 0 1px rgba(216,184,120,.65), 0 0 46px rgba(216,184,120,.28)",i.style.borderColor="rgba(216,184,120,.65)",window.setTimeout(()=>{i.style.boxShadow="",i.style.borderColor=""},1600),oe.toast("NPC 任务链：取票 → 提交 → 审批 · 正在场景中执行"),gi.click())}function Y_(i){if(!i.length)return null;const t=i[0],e=be.entryById.get(t.object.userData.entryId);if(!e)return null;if(!t.object.userData.glass)return{entry:e,hit:t};const n=new Set(["liftCar","workbench","tires","reception"]);for(let s=1;s<i.length;s++){const r=i[s];if(r.object.userData.glass)continue;const a=be.entryById.get(r.object.userData.entryId);if(a){if(n.has(a.id))return{entry:a,hit:r};break}}return{entry:e,hit:t}}function Sl(){Ko.setFromCamera(jo,Ee);const i=Ko.intersectObjects(be.pickables,!1);return Y_(i)}function Zo(){const i=K.hoveredEntry||K.selectedEntry;i?be.showHover(i,K.hoverPoint):be.hideHover()}function $_(){K.hoveredEntry&&K.hoveredEntry.onHoverInstance&&K.hoveredEntry.onHoverInstance(-1),K.hoveredEntry=null,oe.hideTooltip(),Pn.style.cursor="grab",Zo()}function jh(){if(K.formOpen||K.claimActive||K.intro||K.cameraTween)return;const i=Sl();if(i){const t=i.entry;K.hoveredEntry!==t&&(K.hoveredEntry&&K.hoveredEntry.onHoverInstance&&K.hoveredEntry.onHoverInstance(-1),K.hoveredEntry=t,t.onHoverInstance&&i.hit.instanceId!==void 0&&t.onHoverInstance(i.hit.instanceId),gi.hover(),Zo()),t.dynamicFocus&&K.hoverPoint.copy(i.hit.point),be.showHover(t,i.hit.point),oe.showTooltip(t,K.pointerClient.x+18,K.pointerClient.y+20),Pn.style.cursor="pointer"}else K.hoveredEntry&&(K.hoveredEntry.onHoverInstance&&K.hoveredEntry.onHoverInstance(-1),K.hoveredEntry=null,oe.hideTooltip(),Pn.style.cursor="grab"),Zo()}function Zh(){if(K.formOpen||K.claimActive)return;const i=Sl();if(!i){K.selectedEntry=null,K.dossierOpen=!1,be.hideHover(),oe.hideTooltip(),oe.selectedEntry&&oe.closeDossier(!0),K.cinematic&&(Dt.autoRotate=!0);return}const t=i.entry;if(t.id==="garage"){Kr(t);return}K.selectedEntry=t,K.dossierOpen=!0,K.hoverPoint.copy(i.hit.point),t.onHoverInstance&&i.hit.instanceId!==void 0&&t.onHoverInstance(i.hit.instanceId),Dt.autoRotate=!1,be.showHover(t,i.hit.point),oe.showDossier(t)}function Ks(){!fe||!Rn||(fe.info.reset(),dn?dn.render():fe.render(Rn,Ee),oe&&oe.updatePerf(60,fe.info.render.calls))}function ro(i){let t=Math.max(.1,i);const e=1/30;for(;t>0;){const n=Math.min(e,t);Dn+=n,Kh(n),on.update(n,Dn),Cs.update(n,Dn),Vn.update(n,Dn),be.update(n,Dn,Ee),t-=n}oe.updateSeason(on.getInfo()),oe.updateQuest(Vn.questState)}async function K_(){try{if(Ri(6,"初始化渲染管线"),await ds(),fe=new Fg({canvas:Pn,antialias:!1,alpha:!1,stencil:!1,powerPreference:"high-performance"}),fe.setPixelRatio(qn?1:Math.min(window.devicePixelRatio||1,qh)),fe.setSize(window.innerWidth,window.innerHeight,!1),fe.toneMapping=Qo,fe.toneMappingExposure=1.24,fe.outputColorSpace=en,fe.shadowMap.enabled=!qn,fe.shadowMap.type=Jc,fe.info.autoReset=!1,Rn=new Sd,Ee=new un(Yh,window.innerWidth/window.innerHeight,.1,320),Ee.position.copy(Ke.introPos),Ee.lookAt(Ke.introTarget),Dt=new kg(Ee,Pn),Dt.target.copy(Ke.introTarget),Dt.enableDamping=!0,Dt.dampingFactor=.055,Dt.enablePan=!1,Dt.minDistance=16,Dt.maxDistance=44,Dt.minPolarAngle=.72,Dt.maxPolarAngle=1.46,Dt.minAzimuthAngle=-.48,Dt.maxAzimuthAngle=.92,Dt.autoRotate=!1,Dt.autoRotateSpeed=.06,Dt.zoomSpeed=.72,Dt.rotateSpeed=.55,Dt.enabled=!1,!qn){const i=new Mn(1,1,{type:Un,samples:$s?0:2});dn=new i_(fe,i),dn.setPixelRatio(fe.getPixelRatio()),dn.setSize(window.innerWidth,window.innerHeight),dn.addPass(new s_(Rn,Ee)),aa=new As(new ut(window.innerWidth,window.innerHeight),$s?.5:.66,.56,.66),dn.addPass(aa),dn.addPass(new o_)}Ri(26,"构建双层玻璃车房"),await ds(),be=w_(Rn,fe,{isMobile:$s}),Ri(50,"接入四季天气与浮尘"),await ds(),on=new L_(Rn,be,fe,Ee,{isMobile:$s,onSeasonChange:()=>{oe&&oe.updateSeason(on.getInfo())},onState:i=>{oe&&oe.updateSeason(i)}}),Ri(68,"唤醒 NPC 与 GPU 车流"),await ds(),Cs=new B_(Rn,be),Vn=new F_(Rn,be,Ee,{onTaskUpdate:i=>{oe&&oe.updateQuest(i)},onStepComplete:(i,t)=>{if(!oe)return;const e=["取票","提交","审批"];oe.toast(`NPC 已抵达「${e[i]}」节点 · ${t}`),gi.step()}}),Ri(84,"映射 22 个可交互资产"),await ds(),oe=new k_(be,on,Vn,gi,{getCinema:()=>K.cinematic,setCinema:i=>{K.cinematic=i,!K.formOpen&&!K.claimActive&&!K.intro&&!K.dossierOpen&&(Dt.autoRotate=i)},getSound:()=>K.sound,setSound:i=>{K.sound=i,gi.setEnabled(i)},getLabels:()=>K.labels,setLabels:i=>{K.labels=i,be.setLabelsVisible(i)},onResetCamera:W_,onOpenClaim:Kr,onDossierClose:()=>{K.selectedEntry=null,K.dossierOpen=!1,K.hoveredEntry?be.showHover(K.hoveredEntry,K.hoverPoint):be.hideHover(),window.clearTimeout(qs),qs=window.setTimeout(()=>{K.cinematic&&!K.formOpen&&!K.dossierOpen&&!K.claimActive&&(Dt.autoRotate=!0)},1200)},onFocusQuest:q_,onLocate:X_,onSubmit:i=>{Vn.triggerNewClaim(),oe.updateQuest(Vn.questState),console.info("[GOODWORK] claim submitted",i)},onFormClose:jc}),oe.setActiveSeason(on.getInfo().key),oe.updateSeason(on.getInfo()),oe.updateQuest(Vn.questState),oe.updatePerf(60,0),j_(),Jh(),Ri(96,"校准镜头与色调"),await ds(),Ri(100,"场景就绪"),await new Promise(i=>setTimeout(i,420)),_i("boot").classList.add("hide"),qn?(K.intro=!1,Ee.position.copy(Ke.pos),Dt.target.copy(Ke.target),Ee.lookAt(Ke.target),Dt.enabled=!0,Dt.autoRotate=!1,Dt.update()):window.setTimeout(()=>V_(),220),qn&&(window.__GW_DEBUG={state:K,world:be,season:on,traffic:Cs,npcs:Vn,ui:oe,camera:Ee,controls:Dt,renderer:fe,beginClaim:Kr,closeFormFlow:jc,handleClick:Zh,updateHover:jh,raycastAtPointer:Sl,advance:ro,renderNow:Ks,selectEntry:i=>{const t=be.entryById.get(i);return t?(K.selectedEntry=t,K.dossierOpen=!0,K.hoverPoint.copy(t.focus),Dt.autoRotate=!1,be.showHover(t,t.focus),oe.showDossier(t),Ks(),t.name):null},setSeasonNow:i=>{on.setSeason(i,!0),on.setAuto(!1),ro(4.5),Ks()},focusGarage:()=>{Kr(be.entryById.get("garage")),ro(4),Ks()}}),oa=performance.now(),requestAnimationFrame(Qh),Dt.addEventListener("start",()=>{K.intro&&la(),Dt.autoRotate=!1,window.clearTimeout(qs)}),Dt.addEventListener("end",()=>{window.clearTimeout(qs),K.cinematic&&(qs=window.setTimeout(()=>{!K.formOpen&&!K.claimActive&&!K.dossierOpen&&(Dt.autoRotate=!0)},6500))})}catch(i){H_(i)}}function j_(){Pn.addEventListener("pointermove",i=>{const t=Pn.getBoundingClientRect();jo.set((i.clientX-t.left)/t.width*2-1,-((i.clientY-t.top)/t.height)*2+1),K.pointerClient.x=i.clientX,K.pointerClient.y=i.clientY,K.pointerDirty=!0,K.hoveredEntry&&oe.showTooltip(K.hoveredEntry,i.clientX+18,i.clientY+20)}),Pn.addEventListener("pointerleave",()=>{jo.set(-2,-2),K.pointerDirty=!1,$_()}),Pn.addEventListener("pointerdown",i=>{gi.unlock(),i.button===0&&(K.intro&&la(),K.pointerDown={x:i.clientX,y:i.clientY,t:performance.now()})}),Pn.addEventListener("pointerup",i=>{const t=K.pointerDown;K.pointerDown=null,t&&(Math.hypot(i.clientX-t.x,i.clientY-t.y)>6||performance.now()-t.t>750||(K.intro&&la(),!(K.formOpen||K.claimActive||K.cameraTween)&&(K.pointerDirty=!1,Zh())))}),window.addEventListener("keydown",()=>gi.unlock(),{once:!0}),document.addEventListener("visibilitychange",()=>{oa=performance.now()}),window.addEventListener("resize",Jh)}function Jh(){if(!fe)return;const i=window.innerWidth,t=window.innerHeight,e=i/t;Ee.aspect=e,Ee.fov=e<.95?54:Yh,Ee.updateProjectionMatrix(),fe.setPixelRatio(qn?1:Math.min(window.devicePixelRatio||1,qh)),fe.setSize(i,t,!1),dn&&(dn.setPixelRatio(fe.getPixelRatio()),dn.setSize(i,t)),aa&&aa.resolution.set(i*fe.getPixelRatio(),t*fe.getPixelRatio());const s=fe.domElement.height*.5/Math.tan(Oi.degToRad(Ee.fov*.5));be&&be.setViewScale(s),on&&on.setViewScale(s),Cs&&Cs.setViewScale(s)}function Qh(i){if(requestAnimationFrame(Qh),!fe||!Rn)return;fe.info.reset();const t=Math.min((i-oa)/1e3,.05);if(oa=i,Dn+=t,Kh(t),!K.intro&&!K.cameraTween&&Dt.update(),on.update(t,Dn),Cs.update(t,Dn),Vn.update(t,Dn),be.update(t,Dn,Ee),K.pointerDirty?(jh(),K.pointerDirty=!1):!K.formOpen&&!K.claimActive&&!K.cameraTween&&K.hoveredEntry&&i-Kc>300&&(Kc=i,K.pointerDirty=!0),qn?$c||($c=!0,Ks()):(fe.info.reset(),dn?dn.render():fe.render(Rn,Ee)),io+=1,no+=t,so+=t,so>=.6){const e=Math.max(1,Math.round(io/no));qn||oe.updatePerf(e,fe.info.render.calls),so=0,no=0,io=0,oe.updateSeason(on.getInfo())}}K_();
