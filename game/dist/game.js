(()=>{var ch=0,Cl=1,hh=2;var Pl=1,Ro=2,In=3,Gn=0,ke=1,be=2,$n=0,_i=1,Il=2,Ll=3,Dl=4,uh=5,ii=100,dh=101,fh=102,ph=103,mh=104,gh=200,yh=201,xh=202,vh=203,no=204,io=205,bh=206,_h=207,Mh=208,wh=209,Sh=210,Eh=211,Th=212,Ah=213,Rh=214,Co=0,Po=1,Io=2,Mi=3,Lo=4,Do=5,Uo=6,No=7,Ul=0,Ch=1,Ph=2,qn=0,Ih=1,Lh=2,Dh=3,Fo=4,Uh=5,Nh=6,Fh=7;var Nl=300,Ti=301,Ai=302,ko=303,Oo=304,lr=306,fn=1e3,ni=1001,so=1002,Ze=1003,kh=1004;var cr=1005;var rn=1006,Bo=1007;var Ln=1008;var bn=1009,Fl=1010,kl=1011,ds=1012,Ho=1013,ci=1014,_n=1015,fs=1016,zo=1017,Go=1018,ps=1020,Ol=35902,Bl=35899,Hl=1021,zl=1022,pn=1023,is=1026,ms=1027,Vo=1028,Wo=1029,Gl=1030,Xo=1031;var $o=1033,hr=33776,ur=33777,dr=33778,fr=33779,qo=35840,Yo=35841,Zo=35842,Jo=35843,Ko=36196,jo=37492,Qo=37496,ta=37808,ea=37809,na=37810,ia=37811,sa=37812,ra=37813,oa=37814,aa=37815,la=37816,ca=37817,ha=37818,ua=37819,da=37820,fa=37821,pa=36492,ma=36494,ga=36495,ya=36283,xa=36284,va=36285,ba=36286;var Os=2300,ro=2301,eo=2302,bl=2400,_l=2401,Ml=2402;var Oh=3200,Bh=3201;var Vl=0,Hh=1,mn="",Pe="srgb",wi="srgb-linear",Bs="linear",he="srgb";var bi=7680;var wl=519,zh=512,Gh=513,Vh=514,Wl=515,Wh=516,Xh=517,$h=518,qh=519,Sl=35044;var Xl="300 es",vn=2e3,Hs=2001;var Vn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Be=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Za=Math.PI/180,oo=180/Math.PI;function pr(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Be[s&255]+Be[s>>8&255]+Be[s>>16&255]+Be[s>>24&255]+"-"+Be[t&255]+Be[t>>8&255]+"-"+Be[t>>16&15|64]+Be[t>>24&255]+"-"+Be[e&63|128]+Be[e>>8&255]+"-"+Be[e>>16&255]+Be[e>>24&255]+Be[n&255]+Be[n>>8&255]+Be[n>>16&255]+Be[n>>24&255]).toLowerCase()}function ne(s,t,e){return Math.max(t,Math.min(e,s))}function fd(s,t){return(s%t+t)%t}function Ja(s,t,e){return(1-e)*s+e*t}function Ps(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ye(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var Gt=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ne=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],m=r[o+2],y=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=y;return}if(u!==y||c!==d||l!==f||h!==m){let g=1-a,p=c*d+l*f+h*m+u*y,x=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){let E=Math.sqrt(b),A=Math.atan2(E,p*x);g=Math.sin(g*A)/E,a=Math.sin(a*A)/E}let v=a*x;if(c=c*g+d*v,l=l*g+f*v,h=h*g+m*v,u=u*g+y*v,g===1-a){let E=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=E,l*=E,h*=E,u*=E}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+h*u+c*f-l*d,t[e+1]=c*m+h*d+l*u-a*f,t[e+2]=l*m+h*f+a*d-c*u,t[e+3]=h*m-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),d=c(n/2),f=c(i/2),m=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Fc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Fc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ka.copy(this).projectOnVector(t),this.sub(Ka)}reflect(t){return this.sub(Ka.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ka=new D,Fc=new Ne,zt=class s{constructor(t,e,n,i,r,o,a,c,l){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l)}set(t,e,n,i,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],y=i[0],g=i[3],p=i[6],x=i[1],b=i[4],v=i[7],E=i[2],A=i[5],w=i[8];return r[0]=o*y+a*x+c*E,r[3]=o*g+a*b+c*A,r[6]=o*p+a*v+c*w,r[1]=l*y+h*x+u*E,r[4]=l*g+h*b+u*A,r[7]=l*p+h*v+u*w,r[2]=d*y+f*x+m*E,r[5]=d*g+f*b+m*A,r[8]=d*p+f*v+m*w,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,m=e*u+n*d+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/m;return t[0]=u*y,t[1]=(i*l-h*n)*y,t[2]=(a*n-i*o)*y,t[3]=d*y,t[4]=(h*e-i*c)*y,t[5]=(i*r-a*e)*y,t[6]=f*y,t[7]=(n*c-l*e)*y,t[8]=(o*e-n*r)*y,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-i*l,i*c,-i*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ja.makeScale(t,e)),this}rotate(t){return this.premultiply(ja.makeRotation(-t)),this}translate(t,e){return this.premultiply(ja.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},ja=new zt;function $l(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function zs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Yh(){let s=zs("canvas");return s.style.display="block",s}var kc={};function ss(s){s in kc||(kc[s]=!0,console.warn(s))}function Zh(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Oc=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bc=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pd(){let s={enabled:!0,workingColorSpace:wi,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===he&&(i.r=zn(i.r),i.g=zn(i.g),i.b=zn(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===he&&(i.r=ns(i.r),i.g=ns(i.g),i.b=ns(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===mn?Bs:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return ss("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return ss("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[wi]:{primaries:t,whitePoint:n,transfer:Bs,toXYZ:Oc,fromXYZ:Bc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Pe},outputColorSpaceConfig:{drawingBufferColorSpace:Pe}},[Pe]:{primaries:t,whitePoint:n,transfer:he,toXYZ:Oc,fromXYZ:Bc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Pe}}}),s}var ie=pd();function zn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ns(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Vi,ao=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Vi===void 0&&(Vi=zs("canvas")),Vi.width=t.width,Vi.height=t.height;let i=Vi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Vi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=zs("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=zn(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zn(e[n]/255)*255):e[n]=zn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},md=0,rs=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:md++}),this.uuid=pr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Qa(i[o].image)):r.push(Qa(i[o]))}else r=Qa(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function Qa(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?ao.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var gd=0,tl=new D,Xe=class s extends Vn{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=ni,i=ni,r=rn,o=Ln,a=pn,c=bn,l=s.DEFAULT_ANISOTROPY,h=mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gd++}),this.uuid=pr(),this.name="",this.source=new rs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(tl).x}get height(){return this.source.getSize(tl).y}get depth(){return this.source.getSize(tl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Nl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case fn:t.x=t.x-Math.floor(t.x);break;case ni:t.x=t.x<0?0:1;break;case so:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case fn:t.y=t.y-Math.floor(t.y);break;case ni:t.y=t.y<0?0:1;break;case so:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=Nl;Xe.DEFAULT_ANISOTROPY=1;var Se=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],y=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let b=(l+1)/2,v=(f+1)/2,E=(p+1)/2,A=(h+d)/4,w=(u+y)/4,R=(m+g)/4;return b>v&&b>E?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=A/n,r=w/n):v>E?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=A/i,r=R/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=w/r,i=R/r),this.set(n,i,r,e),this}let x=Math.sqrt((g-m)*(g-m)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(u-y)/x,this.z=(d-h)/x,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},lo=class extends Vn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Se(0,0,t,e),this.scissorTest=!1,this.viewport=new Se(0,0,t,e);let i={width:t,height:e,depth:n.depth},r=new Xe(i);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:rn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new rs(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},En=class extends lo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Gs=class extends Xe{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var co=class extends Xe{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Tn=class{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(gn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(gn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=gn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,gn):gn.fromBufferAttribute(r,o),gn.applyMatrix4(t.matrixWorld),this.expandByPoint(gn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Lr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Lr.copy(n.boundingBox)),Lr.applyMatrix4(t.matrixWorld),this.union(Lr)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,gn),gn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Is),Dr.subVectors(this.max,Is),Wi.subVectors(t.a,Is),Xi.subVectors(t.b,Is),$i.subVectors(t.c,Is),Zn.subVectors(Xi,Wi),Jn.subVectors($i,Xi),gi.subVectors(Wi,$i);let e=[0,-Zn.z,Zn.y,0,-Jn.z,Jn.y,0,-gi.z,gi.y,Zn.z,0,-Zn.x,Jn.z,0,-Jn.x,gi.z,0,-gi.x,-Zn.y,Zn.x,0,-Jn.y,Jn.x,0,-gi.y,gi.x,0];return!el(e,Wi,Xi,$i,Dr)||(e=[1,0,0,0,1,0,0,0,1],!el(e,Wi,Xi,$i,Dr))?!1:(Ur.crossVectors(Zn,Jn),e=[Ur.x,Ur.y,Ur.z],el(e,Wi,Xi,$i,Dr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,gn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(gn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Fn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Fn=[new D,new D,new D,new D,new D,new D,new D,new D],gn=new D,Lr=new Tn,Wi=new D,Xi=new D,$i=new D,Zn=new D,Jn=new D,gi=new D,Is=new D,Dr=new D,Ur=new D,yi=new D;function el(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){yi.fromArray(s,r);let a=i.x*Math.abs(yi.x)+i.y*Math.abs(yi.y)+i.z*Math.abs(yi.z),c=t.dot(yi),l=e.dot(yi),h=n.dot(yi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var yd=new Tn,Ls=new D,nl=new D,An=class{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):yd.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ls.subVectors(t,this.center);let e=Ls.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ls,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(nl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ls.copy(t.center).add(nl)),this.expandByPoint(Ls.copy(t.center).sub(nl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},kn=new D,il=new D,Nr=new D,Kn=new D,sl=new D,Fr=new D,rl=new D,os=class{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(kn.copy(this.origin).addScaledVector(this.direction,e),kn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){il.copy(t).add(e).multiplyScalar(.5),Nr.copy(e).sub(t).normalize(),Kn.copy(this.origin).sub(il);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Nr),a=Kn.dot(this.direction),c=-Kn.dot(Nr),l=Kn.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*c-a,d=o*a-c,m=r*h,u>=0)if(d>=-m)if(d<=m){let y=1/h;u*=y,d*=y,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(il).addScaledVector(Nr,d),f}intersectSphere(t,e){kn.subVectors(t.center,this.origin);let n=kn.dot(this.direction),i=kn.dot(kn)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,i=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,i=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,kn)!==null}intersectTriangle(t,e,n,i,r){sl.subVectors(e,t),Fr.subVectors(n,t),rl.crossVectors(sl,Fr);let o=this.direction.dot(rl),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Kn.subVectors(this.origin,t);let c=a*this.direction.dot(Fr.crossVectors(Kn,Fr));if(c<0)return null;let l=a*this.direction.dot(sl.cross(Kn));if(l<0||c+l>o)return null;let h=-a*Kn.dot(rl);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Vt=class s{constructor(t,e,n,i,r,o,a,c,l,h,u,d,f,m,y,g){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l,h,u,d,f,m,y,g)}set(t,e,n,i,r,o,a,c,l,h,u,d,f,m,y,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/qi.setFromMatrixColumn(t,0).length(),r=1/qi.setFromMatrixColumn(t,1).length(),o=1/qi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,m=a*h,y=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=d-y*l,e[9]=-a*c,e[2]=y-d*l,e[6]=m+f*l,e[10]=o*c}else if(t.order==="YXZ"){let d=c*h,f=c*u,m=l*h,y=l*u;e[0]=d+y*a,e[4]=m*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-m,e[6]=y+d*a,e[10]=o*c}else if(t.order==="ZXY"){let d=c*h,f=c*u,m=l*h,y=l*u;e[0]=d-y*a,e[4]=-o*u,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*h,e[9]=y-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let d=o*h,f=o*u,m=a*h,y=a*u;e[0]=c*h,e[4]=m*l-f,e[8]=d*l+y,e[1]=c*u,e[5]=y*l+d,e[9]=f*l-m,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let d=o*c,f=o*l,m=a*c,y=a*l;e[0]=c*h,e[4]=y-d*u,e[8]=m*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+m,e[10]=d-y*u}else if(t.order==="XZY"){let d=o*c,f=o*l,m=a*c,y=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+y,e[5]=o*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=a*h,e[10]=y*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(xd,t,vd)}lookAt(t,e,n){let i=this.elements;return nn.subVectors(t,e),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),jn.crossVectors(n,nn),jn.lengthSq()===0&&(Math.abs(n.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),jn.crossVectors(n,nn)),jn.normalize(),kr.crossVectors(nn,jn),i[0]=jn.x,i[4]=kr.x,i[8]=nn.x,i[1]=jn.y,i[5]=kr.y,i[9]=nn.y,i[2]=jn.z,i[6]=kr.z,i[10]=nn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],y=n[6],g=n[10],p=n[14],x=n[3],b=n[7],v=n[11],E=n[15],A=i[0],w=i[4],R=i[8],M=i[12],_=i[1],P=i[5],N=i[9],B=i[13],F=i[2],z=i[6],q=i[10],et=i[14],$=i[3],ut=i[7],X=i[11],nt=i[15];return r[0]=o*A+a*_+c*F+l*$,r[4]=o*w+a*P+c*z+l*ut,r[8]=o*R+a*N+c*q+l*X,r[12]=o*M+a*B+c*et+l*nt,r[1]=h*A+u*_+d*F+f*$,r[5]=h*w+u*P+d*z+f*ut,r[9]=h*R+u*N+d*q+f*X,r[13]=h*M+u*B+d*et+f*nt,r[2]=m*A+y*_+g*F+p*$,r[6]=m*w+y*P+g*z+p*ut,r[10]=m*R+y*N+g*q+p*X,r[14]=m*M+y*B+g*et+p*nt,r[3]=x*A+b*_+v*F+E*$,r[7]=x*w+b*P+v*z+E*ut,r[11]=x*R+b*N+v*q+E*X,r[15]=x*M+b*B+v*et+E*nt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],y=t[7],g=t[11],p=t[15];return m*(+r*c*u-i*l*u-r*a*d+n*l*d+i*a*f-n*c*f)+y*(+e*c*f-e*l*d+r*o*d-i*o*f+i*l*h-r*c*h)+g*(+e*l*u-e*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-i*a*h-e*c*u+e*a*d+i*o*u-n*o*d+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],y=t[13],g=t[14],p=t[15],x=u*g*l-y*d*l+y*c*f-a*g*f-u*c*p+a*d*p,b=m*d*l-h*g*l-m*c*f+o*g*f+h*c*p-o*d*p,v=h*y*l-m*u*l+m*a*f-o*y*f-h*a*p+o*u*p,E=m*u*c-h*y*c-m*a*d+o*y*d+h*a*g-o*u*g,A=e*x+n*b+i*v+r*E;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let w=1/A;return t[0]=x*w,t[1]=(y*d*r-u*g*r-y*i*f+n*g*f+u*i*p-n*d*p)*w,t[2]=(a*g*r-y*c*r+y*i*l-n*g*l-a*i*p+n*c*p)*w,t[3]=(u*c*r-a*d*r-u*i*l+n*d*l+a*i*f-n*c*f)*w,t[4]=b*w,t[5]=(h*g*r-m*d*r+m*i*f-e*g*f-h*i*p+e*d*p)*w,t[6]=(m*c*r-o*g*r-m*i*l+e*g*l+o*i*p-e*c*p)*w,t[7]=(o*d*r-h*c*r+h*i*l-e*d*l-o*i*f+e*c*f)*w,t[8]=v*w,t[9]=(m*u*r-h*y*r-m*n*f+e*y*f+h*n*p-e*u*p)*w,t[10]=(o*y*r-m*a*r+m*n*l-e*y*l-o*n*p+e*a*p)*w,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*f-e*a*f)*w,t[12]=E*w,t[13]=(h*y*i-m*u*i+m*n*d-e*y*d-h*n*g+e*u*g)*w,t[14]=(m*a*i-o*y*i-m*n*c+e*y*c+o*n*g-e*a*g)*w,t[15]=(o*u*i-h*a*i+h*n*c-e*u*c-o*n*d+e*a*d)*w,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,m=r*u,y=o*h,g=o*u,p=a*u,x=c*l,b=c*h,v=c*u,E=n.x,A=n.y,w=n.z;return i[0]=(1-(y+p))*E,i[1]=(f+v)*E,i[2]=(m-b)*E,i[3]=0,i[4]=(f-v)*A,i[5]=(1-(d+p))*A,i[6]=(g+x)*A,i[7]=0,i[8]=(m+b)*w,i[9]=(g-x)*w,i[10]=(1-(d+y))*w,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=qi.set(i[0],i[1],i[2]).length(),o=qi.set(i[4],i[5],i[6]).length(),a=qi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],yn.copy(this);let l=1/r,h=1/o,u=1/a;return yn.elements[0]*=l,yn.elements[1]*=l,yn.elements[2]*=l,yn.elements[4]*=h,yn.elements[5]*=h,yn.elements[6]*=h,yn.elements[8]*=u,yn.elements[9]*=u,yn.elements[10]*=u,e.setFromRotationMatrix(yn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=vn,c=!1){let l=this.elements,h=2*r/(e-t),u=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i),m,y;if(c)m=r/(o-r),y=o*r/(o-r);else if(a===vn)m=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===Hs)m=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=vn,c=!1){let l=this.elements,h=2/(e-t),u=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i),m,y;if(c)m=1/(o-r),y=o/(o-r);else if(a===vn)m=-2/(o-r),y=-(o+r)/(o-r);else if(a===Hs)m=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},qi=new D,yn=new Vt,xd=new D(0,0,0),vd=new D(1,1,1),jn=new D,kr=new D,nn=new D,Hc=new Vt,zc=new Ne,on=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return zc.setFromEuler(this),this.setFromQuaternion(zc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};on.DEFAULT_ORDER="XYZ";var Vs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},bd=0,Gc=new D,Yi=new Ne,On=new Vt,Or=new D,Ds=new D,_d=new D,Md=new Ne,Vc=new D(1,0,0),Wc=new D(0,1,0),Xc=new D(0,0,1),$c={type:"added"},wd={type:"removed"},Zi={type:"childadded",child:null},ol={type:"childremoved",child:null},Re=class s extends Vn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bd++}),this.uuid=pr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new D,e=new on,n=new Ne,i=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Vt},normalMatrix:{value:new zt}}),this.matrix=new Vt,this.matrixWorld=new Vt,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Yi.setFromAxisAngle(t,e),this.quaternion.multiply(Yi),this}rotateOnWorldAxis(t,e){return Yi.setFromAxisAngle(t,e),this.quaternion.premultiply(Yi),this}rotateX(t){return this.rotateOnAxis(Vc,t)}rotateY(t){return this.rotateOnAxis(Wc,t)}rotateZ(t){return this.rotateOnAxis(Xc,t)}translateOnAxis(t,e){return Gc.copy(t).applyQuaternion(this.quaternion),this.position.add(Gc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Vc,t)}translateY(t){return this.translateOnAxis(Wc,t)}translateZ(t){return this.translateOnAxis(Xc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(On.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Or.copy(t):Or.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Ds.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?On.lookAt(Ds,Or,this.up):On.lookAt(Or,Ds,this.up),this.quaternion.setFromRotationMatrix(On),i&&(On.extractRotation(i.matrixWorld),Yi.setFromRotationMatrix(On),this.quaternion.premultiply(Yi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent($c),Zi.child=t,this.dispatchEvent(Zi),Zi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(wd),ol.child=t,this.dispatchEvent(ol),ol.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),On.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),On.multiply(t.parent.matrixWorld)),t.applyMatrix4(On),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($c),Zi.child=t,this.dispatchEvent(Zi),Zi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,t,_d),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,Md,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];i.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};Re.DEFAULT_UP=new D(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var xn=new D,Bn=new D,al=new D,Hn=new D,Ji=new D,Ki=new D,qc=new D,ll=new D,cl=new D,hl=new D,ul=new Se,dl=new Se,fl=new Se,ei=class s{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),xn.subVectors(t,e),i.cross(xn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){xn.subVectors(i,e),Bn.subVectors(n,e),al.subVectors(t,e);let o=xn.dot(xn),a=xn.dot(Bn),c=xn.dot(al),l=Bn.dot(Bn),h=Bn.dot(al),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-a*h)*d,m=(o*h-a*c)*d;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Hn)===null?!1:Hn.x>=0&&Hn.y>=0&&Hn.x+Hn.y<=1}static getInterpolation(t,e,n,i,r,o,a,c){return this.getBarycoord(t,e,n,i,Hn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Hn.x),c.addScaledVector(o,Hn.y),c.addScaledVector(a,Hn.z),c)}static getInterpolatedAttribute(t,e,n,i,r,o){return ul.setScalar(0),dl.setScalar(0),fl.setScalar(0),ul.fromBufferAttribute(t,e),dl.fromBufferAttribute(t,n),fl.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(ul,r.x),o.addScaledVector(dl,r.y),o.addScaledVector(fl,r.z),o}static isFrontFacing(t,e,n,i){return xn.subVectors(n,e),Bn.subVectors(t,e),xn.cross(Bn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return xn.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),xn.cross(Bn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;Ji.subVectors(i,n),Ki.subVectors(r,n),ll.subVectors(t,n);let c=Ji.dot(ll),l=Ki.dot(ll);if(c<=0&&l<=0)return e.copy(n);cl.subVectors(t,i);let h=Ji.dot(cl),u=Ki.dot(cl);if(h>=0&&u<=h)return e.copy(i);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Ji,o);hl.subVectors(t,r);let f=Ji.dot(hl),m=Ki.dot(hl);if(m>=0&&f<=m)return e.copy(r);let y=f*l-c*m;if(y<=0&&l>=0&&m<=0)return a=l/(l-m),e.copy(n).addScaledVector(Ki,a);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return qc.subVectors(r,i),a=(u-h)/(u-h+(f-m)),e.copy(i).addScaledVector(qc,a);let p=1/(g+y+d);return o=y*p,a=d*p,e.copy(n).addScaledVector(Ji,o).addScaledVector(Ki,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Jh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qn={h:0,s:0,l:0},Br={h:0,s:0,l:0};function pl(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var At=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Pe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=ie.workingColorSpace){return this.r=t,this.g=e,this.b=n,ie.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=ie.workingColorSpace){if(t=fd(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=pl(o,r,t+1/3),this.g=pl(o,r,t),this.b=pl(o,r,t-1/3)}return ie.colorSpaceToWorking(this,i),this}setStyle(t,e=Pe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Pe){let n=Jh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zn(t.r),this.g=zn(t.g),this.b=zn(t.b),this}copyLinearToSRGB(t){return this.r=ns(t.r),this.g=ns(t.g),this.b=ns(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Pe){return ie.workingToColorSpace(He.copy(this),t),Math.round(ne(He.r*255,0,255))*65536+Math.round(ne(He.g*255,0,255))*256+Math.round(ne(He.b*255,0,255))}getHexString(t=Pe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.workingToColorSpace(He.copy(this),e);let n=He.r,i=He.g,r=He.b,o=Math.max(n,i,r),a=Math.min(n,i,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.workingToColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=Pe){ie.workingToColorSpace(He.copy(this),t);let e=He.r,n=He.g,i=He.b;return t!==Pe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Qn),this.setHSL(Qn.h+t,Qn.s+e,Qn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Qn),t.getHSL(Br);let n=Ja(Qn.h,Br.h,e),i=Ja(Qn.s,Br.s,e),r=Ja(Qn.l,Br.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},He=new At;At.NAMES=Jh;var Sd=0,Rn=class extends Vn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sd++}),this.uuid=pr(),this.name="",this.type="Material",this.blending=_i,this.side=Gn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=no,this.blendDst=io,this.blendEquation=ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new At(0,0,0),this.blendAlpha=0,this.depthFunc=Mi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bi,this.stencilZFail=bi,this.stencilZPass=bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_i&&(n.blending=this.blending),this.side!==Gn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==no&&(n.blendSrc=this.blendSrc),this.blendDst!==io&&(n.blendDst=this.blendDst),this.blendEquation!==ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Mi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==wl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Fe=class extends Rn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new At(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=Ul,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ce=new D,Hr=new Gt,Ed=0,oe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ed++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Sl,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Hr.fromBufferAttribute(this,e),Hr.applyMatrix3(t),this.setXY(e,Hr.x,Hr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix4(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyNormalMatrix(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.transformDirection(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ps(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ye(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ps(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ps(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ps(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ps(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),n=Ye(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),n=Ye(n,this.array),i=Ye(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),n=Ye(n,this.array),i=Ye(i,this.array),r=Ye(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Sl&&(t.usage=this.usage),t}};var Ws=class extends oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Xs=class extends oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Wt=class extends oe{constructor(t,e,n){super(new Float32Array(t),e,n)}},Td=0,dn=new Vt,ml=new Re,ji=new D,sn=new Tn,Us=new Tn,Ue=new D,ce=class s extends Vn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Td++}),this.uuid=pr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new($l(t)?Xs:Ws)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return dn.makeRotationFromQuaternion(t),this.applyMatrix4(dn),this}rotateX(t){return dn.makeRotationX(t),this.applyMatrix4(dn),this}rotateY(t){return dn.makeRotationY(t),this.applyMatrix4(dn),this}rotateZ(t){return dn.makeRotationZ(t),this.applyMatrix4(dn),this}translate(t,e,n){return dn.makeTranslation(t,e,n),this.applyMatrix4(dn),this}scale(t,e,n){return dn.makeScale(t,e,n),this.applyMatrix4(dn),this}lookAt(t){return ml.lookAt(t),ml.updateMatrix(),this.applyMatrix4(ml.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ji).negate(),this.translate(ji.x,ji.y,ji.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Wt(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Tn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];sn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ue.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(Ue),Ue.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(Ue)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new An);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){let n=this.boundingSphere.center;if(sn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Us.setFromBufferAttribute(a),this.morphTargetsRelative?(Ue.addVectors(sn.min,Us.min),sn.expandByPoint(Ue),Ue.addVectors(sn.max,Us.max),sn.expandByPoint(Ue)):(sn.expandByPoint(Us.min),sn.expandByPoint(Us.max))}sn.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Ue.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ue));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ue.fromBufferAttribute(a,l),c&&(ji.fromBufferAttribute(t,l),Ue.add(ji)),i=Math.max(i,n.distanceToSquared(Ue))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new oe(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let R=0;R<n.count;R++)a[R]=new D,c[R]=new D;let l=new D,h=new D,u=new D,d=new Gt,f=new Gt,m=new Gt,y=new D,g=new D;function p(R,M,_){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,_),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,M),m.fromBufferAttribute(r,_),h.sub(l),u.sub(l),f.sub(d),m.sub(d);let P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(y.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(P),a[R].add(y),a[M].add(y),a[_].add(y),c[R].add(g),c[M].add(g),c[_].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let R=0,M=x.length;R<M;++R){let _=x[R],P=_.start,N=_.count;for(let B=P,F=P+N;B<F;B+=3)p(t.getX(B+0),t.getX(B+1),t.getX(B+2))}let b=new D,v=new D,E=new D,A=new D;function w(R){E.fromBufferAttribute(i,R),A.copy(E);let M=a[R];b.copy(M),b.sub(E.multiplyScalar(E.dot(M))).normalize(),v.crossVectors(A,M);let P=v.dot(c[R])<0?-1:1;o.setXYZW(R,b.x,b.y,b.z,P)}for(let R=0,M=x.length;R<M;++R){let _=x[R],P=_.start,N=_.count;for(let B=P,F=P+N;B<F;B+=3)w(t.getX(B+0)),w(t.getX(B+1)),w(t.getX(B+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new D,r=new D,o=new D,a=new D,c=new D,l=new D,h=new D,u=new D;if(t)for(let d=0,f=t.count;d<f;d+=3){let m=t.getX(d+0),y=t.getX(d+1),g=t.getX(d+2);i.fromBufferAttribute(e,m),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,g),a.add(h),c.add(h),l.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ue.fromBufferAttribute(t,e),Ue.normalize(),t.setXYZ(e,Ue.x,Ue.y,Ue.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),f=0,m=0;for(let y=0,g=c.length;y<g;y++){a.isInterleavedBufferAttribute?f=c[y]*a.data.stride+a.offset:f=c[y]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new oe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let c=i[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Yc=new Vt,xi=new os,zr=new An,Zc=new D,Gr=new D,Vr=new D,Wr=new D,gl=new D,Xr=new D,Jc=new D,$r=new D,Z=class extends Re{constructor(t=new ce,e=new Fe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){Xr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(gl.fromBufferAttribute(u,t),o?Xr.addScaledVector(gl,h):Xr.addScaledVector(gl.sub(e),h))}e.add(Xr)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zr.copy(n.boundingSphere),zr.applyMatrix4(r),xi.copy(t.ray).recast(t.near),!(zr.containsPoint(xi.origin)===!1&&(xi.intersectSphere(zr,Zc)===null||xi.origin.distanceToSquared(Zc)>(t.far-t.near)**2))&&(Yc.copy(r).invert(),xi.copy(t.ray).applyMatrix4(Yc),!(n.boundingBox!==null&&xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,xi)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){let g=d[m],p=o[g.materialIndex],x=Math.max(g.start,f.start),b=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let v=x,E=b;v<E;v+=3){let A=a.getX(v),w=a.getX(v+1),R=a.getX(v+2);i=qr(this,p,t,n,l,h,u,A,w,R),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let g=m,p=y;g<p;g+=3){let x=a.getX(g),b=a.getX(g+1),v=a.getX(g+2);i=qr(this,o,t,n,l,h,u,x,b,v),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){let g=d[m],p=o[g.materialIndex],x=Math.max(g.start,f.start),b=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let v=x,E=b;v<E;v+=3){let A=v,w=v+1,R=v+2;i=qr(this,p,t,n,l,h,u,A,w,R),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let g=m,p=y;g<p;g+=3){let x=g,b=g+1,v=g+2;i=qr(this,o,t,n,l,h,u,x,b,v),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}}};function Ad(s,t,e,n,i,r,o,a){let c;if(t.side===ke?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,t.side===Gn,a),c===null)return null;$r.copy(a),$r.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo($r);return l<e.near||l>e.far?null:{distance:l,point:$r.clone(),object:s}}function qr(s,t,e,n,i,r,o,a,c,l){s.getVertexPosition(a,Gr),s.getVertexPosition(c,Vr),s.getVertexPosition(l,Wr);let h=Ad(s,t,e,n,Gr,Vr,Wr,Jc);if(h){let u=new D;ei.getBarycoord(Jc,Gr,Vr,Wr,u),i&&(h.uv=ei.getInterpolatedAttribute(i,a,c,l,u,new Gt)),r&&(h.uv1=ei.getInterpolatedAttribute(r,a,c,l,u,new Gt)),o&&(h.normal=ei.getInterpolatedAttribute(o,a,c,l,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new D,materialIndex:0};ei.getNormal(Gr,Vr,Wr,d.normal),h.face=d,h.barycoord=u}return h}var ue=class s extends ce{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,i,o,2),m("x","z","y",1,-1,t,n,-e,i,o,3),m("x","y","z",1,-1,t,e,n,i,r,4),m("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new Wt(l,3)),this.setAttribute("normal",new Wt(h,3)),this.setAttribute("uv",new Wt(u,2));function m(y,g,p,x,b,v,E,A,w,R,M){let _=v/w,P=E/R,N=v/2,B=E/2,F=A/2,z=w+1,q=R+1,et=0,$=0,ut=new D;for(let X=0;X<q;X++){let nt=X*P-B;for(let Et=0;Et<z;Et++){let Yt=Et*_-N;ut[y]=Yt*x,ut[g]=nt*b,ut[p]=F,l.push(ut.x,ut.y,ut.z),ut[y]=0,ut[g]=0,ut[p]=A>0?1:-1,h.push(ut.x,ut.y,ut.z),u.push(Et/w),u.push(1-X/R),et+=1}}for(let X=0;X<R;X++)for(let nt=0;nt<w;nt++){let Et=d+nt+z*X,Yt=d+nt+z*(X+1),Zt=d+(nt+1)+z*(X+1),te=d+(nt+1)+z*X;c.push(Et,Yt,te),c.push(Yt,Zt,te),$+=6}a.addGroup(f,$,M),f+=$,d+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Ri(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ve(s){let t={};for(let e=0;e<s.length;e++){let n=Ri(s[e]);for(let i in n)t[i]=n[i]}return t}function Rd(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function ql(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ie.workingColorSpace}var Kh={clone:Ri,merge:Ve},Cd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,an=class extends Rn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cd,this.fragmentShader=Pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ri(t.uniforms),this.uniformsGroups=Rd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},$s=class extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Vt,this.projectionMatrix=new Vt,this.projectionMatrixInverse=new Vt,this.coordinateSystem=vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ti=new D,Kc=new Gt,jc=new Gt,ze=class extends $s{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=oo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Za*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return oo*2*Math.atan(Math.tan(Za*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ti.x,ti.y).multiplyScalar(-t/ti.z),ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ti.x,ti.y).multiplyScalar(-t/ti.z)}getViewSize(t,e){return this.getViewBounds(t,Kc,jc),e.subVectors(jc,Kc)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Za*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,e-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Qi=-90,ts=1,ho=class extends Re{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new ze(Qi,ts,t,e);i.layers=this.layers,this.add(i);let r=new ze(Qi,ts,t,e);r.layers=this.layers,this.add(r);let o=new ze(Qi,ts,t,e);o.layers=this.layers,this.add(o);let a=new ze(Qi,ts,t,e);a.layers=this.layers,this.add(a);let c=new ze(Qi,ts,t,e);c.layers=this.layers,this.add(c);let l=new ze(Qi,ts,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===vn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Hs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},qs=class extends Xe{constructor(t=[],e=Ti,n,i,r,o,a,c,l,h){super(t,e,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},uo=class extends En{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new qs(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ue(5,5,5),r=new an({name:"CubemapFromEquirect",uniforms:Ri(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ke,blending:$n});r.uniforms.tEquirect.value=e;let o=new Z(i,r),a=e.minFilter;return e.minFilter===Ln&&(e.minFilter=rn),new ho(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},$t=class extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}},Id={type:"move"},as=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $t,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $t,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $t,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let y of t.hand.values()){let g=e.getJointPose(y,n),p=this._getHandJoint(l,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Id)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new $t;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Ys=class s{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new At(t),this.density=e}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var ls=class extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var fo=class extends Xe{constructor(t=null,e=1,n=1,i,r,o,a,c,l=Ze,h=Ze,u,d){super(null,o,a,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var cs=class extends oe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},es=new Vt,Qc=new Vt,Yr=[],th=new Tn,Ld=new Vt,Ns=new Z,Fs=new An,Ge=class extends Z{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new cs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Ld)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Tn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,es),th.copy(t.boundingBox).applyMatrix4(es),this.boundingBox.union(th)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new An),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,es),Fs.copy(t.boundingSphere).applyMatrix4(es),this.boundingSphere.union(Fs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(Ns.geometry=this.geometry,Ns.material=this.material,Ns.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Fs.copy(this.boundingSphere),Fs.applyMatrix4(n),t.ray.intersectsSphere(Fs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,es),Qc.multiplyMatrices(n,es),Ns.matrixWorld=Qc,Ns.raycast(t,Yr);for(let o=0,a=Yr.length;o<a;o++){let c=Yr[o];c.instanceId=r,c.object=this,e.push(c)}Yr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new cs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new fo(new Float32Array(i*this.count),i,this.count,Vo,_n));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=i*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},yl=new D,Dd=new D,Ud=new zt,Sn=class{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=yl.subVectors(n,e).cross(Dd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(yl),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Ud.getNormalMatrix(t),i=this.coplanarPoint(yl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},vi=new An,Nd=new Gt(.5,.5),Zr=new D,hs=class{constructor(t=new Sn,e=new Sn,n=new Sn,i=new Sn,r=new Sn,o=new Sn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=vn,n=!1){let i=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],y=r[9],g=r[10],p=r[11],x=r[12],b=r[13],v=r[14],E=r[15];if(i[0].setComponents(l-o,f-h,p-m,E-x).normalize(),i[1].setComponents(l+o,f+h,p+m,E+x).normalize(),i[2].setComponents(l+a,f+u,p+y,E+b).normalize(),i[3].setComponents(l-a,f-u,p-y,E-b).normalize(),n)i[4].setComponents(c,d,g,v).normalize(),i[5].setComponents(l-c,f-d,p-g,E-v).normalize();else if(i[4].setComponents(l-c,f-d,p-g,E-v).normalize(),e===vn)i[5].setComponents(l+c,f+d,p+g,E+v).normalize();else if(e===Hs)i[5].setComponents(c,d,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vi)}intersectsSprite(t){vi.center.set(0,0,0);let e=Nd.distanceTo(t.center);return vi.radius=.7071067811865476+e,vi.applyMatrix4(t.matrixWorld),this.intersectsSphere(vi)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Zr.x=i.normal.x>0?t.max.x:t.min.x,Zr.y=i.normal.y>0?t.max.y:t.min.y,Zr.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Zr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Wn=class extends Rn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new At(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},po=new D,mo=new D,eh=new Vt,ks=new os,Jr=new An,xl=new D,nh=new D,si=class extends Re{constructor(t=new ce,e=new Wn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)po.fromBufferAttribute(e,i-1),mo.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=po.distanceTo(mo);t.setAttribute("lineDistance",new Wt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere),Jr.applyMatrix4(i),Jr.radius+=r,t.ray.intersectsSphere(Jr)===!1)return;eh.copy(i).invert(),ks.copy(t.ray).applyMatrix4(eh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let y=f,g=m-1;y<g;y+=l){let p=h.getX(y),x=h.getX(y+1),b=Kr(this,t,ks,c,p,x,y);b&&e.push(b)}if(this.isLineLoop){let y=h.getX(m-1),g=h.getX(f),p=Kr(this,t,ks,c,y,g,m-1);p&&e.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let y=f,g=m-1;y<g;y+=l){let p=Kr(this,t,ks,c,y,y+1,y);p&&e.push(p)}if(this.isLineLoop){let y=Kr(this,t,ks,c,m-1,f,m-1);y&&e.push(y)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Kr(s,t,e,n,i,r,o){let a=s.geometry.attributes.position;if(po.fromBufferAttribute(a,i),mo.fromBufferAttribute(a,r),e.distanceSqToSegment(po,mo,xl,nh)>n)return;xl.applyMatrix4(s.matrixWorld);let l=t.ray.origin.distanceTo(xl);if(!(l<t.near||l>t.far))return{distance:l,point:nh.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}var ih=new D,sh=new D,Zs=class extends si{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)ih.fromBufferAttribute(e,i),sh.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ih.distanceTo(sh);t.setAttribute("lineDistance",new Wt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var us=class extends Rn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new At(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},rh=new Vt,El=new os,jr=new An,Qr=new D,Js=class extends Re{constructor(t=new ce,e=new us){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(i),jr.radius+=r,t.ray.intersectsSphere(jr)===!1)return;rh.copy(i).invert(),El.copy(t.ray).applyMatrix4(rh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let m=d,y=f;m<y;m++){let g=l.getX(m);Qr.fromBufferAttribute(u,g),oh(Qr,g,c,i,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,y=f;m<y;m++)Qr.fromBufferAttribute(u,m),oh(Qr,m,c,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function oh(s,t,e,n,i,r,o){let a=El.distanceSqToPoint(s);if(a<e){let c=new D;El.closestPointToPoint(s,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Cn=class extends Xe{constructor(t,e,n,i,r,o,a,c,l){super(t,e,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ks=class extends Xe{constructor(t,e,n=ci,i,r,o,a=Ze,c=Ze,l,h=is,u=1){if(h!==is&&h!==ms)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new rs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},js=class extends Xe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Je=class s extends ce{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));let o=[],a=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,m=n*2+r,y=i+1,g=new D,p=new D;for(let x=0;x<=m;x++){let b=0,v=0,E=0,A=0;if(x<=n){let M=x/n,_=M*Math.PI/2;v=-h-t*Math.cos(_),E=t*Math.sin(_),A=-t*Math.cos(_),b=M*u}else if(x<=n+r){let M=(x-n)/r;v=-h+M*e,E=t,A=0,b=u+M*d}else{let M=(x-n-r)/n,_=M*Math.PI/2;v=h+t*Math.sin(_),E=t*Math.cos(_),A=t*Math.sin(_),b=u+d+M*u}let w=Math.max(0,Math.min(1,b/f)),R=0;x===0?R=.5/i:x===m&&(R=-.5/i);for(let M=0;M<=i;M++){let _=M/i,P=_*Math.PI*2,N=Math.sin(P),B=Math.cos(P);p.x=-E*B,p.y=v,p.z=E*N,a.push(p.x,p.y,p.z),g.set(-E*B,A,E*N),g.normalize(),c.push(g.x,g.y,g.z),l.push(_+R,w)}if(x>0){let M=(x-1)*y;for(let _=0;_<i;_++){let P=M+_,N=M+_+1,B=x*y+_,F=x*y+_+1;o.push(P,N,B),o.push(N,F,B)}}}this.setIndex(o),this.setAttribute("position",new Wt(a,3)),this.setAttribute("normal",new Wt(c,3)),this.setAttribute("uv",new Wt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Xn=class s extends ce{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let r=[],o=[],a=[],c=[],l=new D,h=new Gt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=n+u/e*i;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Wt(o,3)),this.setAttribute("normal",new Wt(a,3)),this.setAttribute("uv",new Wt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},qt=class s extends ce{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,y=[],g=n/2,p=0;x(),o===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new Wt(u,3)),this.setAttribute("normal",new Wt(d,3)),this.setAttribute("uv",new Wt(f,2));function x(){let v=new D,E=new D,A=0,w=(e-t)/n;for(let R=0;R<=r;R++){let M=[],_=R/r,P=_*(e-t)+t;for(let N=0;N<=i;N++){let B=N/i,F=B*c+a,z=Math.sin(F),q=Math.cos(F);E.x=P*z,E.y=-_*n+g,E.z=P*q,u.push(E.x,E.y,E.z),v.set(z,w,q).normalize(),d.push(v.x,v.y,v.z),f.push(B,1-_),M.push(m++)}y.push(M)}for(let R=0;R<i;R++)for(let M=0;M<r;M++){let _=y[M][R],P=y[M+1][R],N=y[M+1][R+1],B=y[M][R+1];(t>0||M!==0)&&(h.push(_,P,B),A+=3),(e>0||M!==r-1)&&(h.push(P,N,B),A+=3)}l.addGroup(p,A,0),p+=A}function b(v){let E=m,A=new Gt,w=new D,R=0,M=v===!0?t:e,_=v===!0?1:-1;for(let N=1;N<=i;N++)u.push(0,g*_,0),d.push(0,_,0),f.push(.5,.5),m++;let P=m;for(let N=0;N<=i;N++){let F=N/i*c+a,z=Math.cos(F),q=Math.sin(F);w.x=M*q,w.y=g*_,w.z=M*z,u.push(w.x,w.y,w.z),d.push(0,_,0),A.x=z*.5+.5,A.y=q*.5*_+.5,f.push(A.x,A.y),m++}for(let N=0;N<i;N++){let B=E+N,F=P+N;v===!0?h.push(F,F+1,B):h.push(F+1,F,B),R+=3}l.addGroup(p,R,v===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Si=class s extends qt{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Qs=class s extends ce{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),l(n),h(),this.setAttribute("position",new Wt(r,3)),this.setAttribute("normal",new Wt(r.slice(),3)),this.setAttribute("uv",new Wt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let b=new D,v=new D,E=new D;for(let A=0;A<e.length;A+=3)f(e[A+0],b),f(e[A+1],v),f(e[A+2],E),c(b,v,E,x)}function c(x,b,v,E){let A=E+1,w=[];for(let R=0;R<=A;R++){w[R]=[];let M=x.clone().lerp(v,R/A),_=b.clone().lerp(v,R/A),P=A-R;for(let N=0;N<=P;N++)N===0&&R===A?w[R][N]=M:w[R][N]=M.clone().lerp(_,N/P)}for(let R=0;R<A;R++)for(let M=0;M<2*(A-R)-1;M++){let _=Math.floor(M/2);M%2===0?(d(w[R][_+1]),d(w[R+1][_]),d(w[R][_])):(d(w[R][_+1]),d(w[R+1][_+1]),d(w[R+1][_]))}}function l(x){let b=new D;for(let v=0;v<r.length;v+=3)b.x=r[v+0],b.y=r[v+1],b.z=r[v+2],b.normalize().multiplyScalar(x),r[v+0]=b.x,r[v+1]=b.y,r[v+2]=b.z}function h(){let x=new D;for(let b=0;b<r.length;b+=3){x.x=r[b+0],x.y=r[b+1],x.z=r[b+2];let v=g(x)/2/Math.PI+.5,E=p(x)/Math.PI+.5;o.push(v,1-E)}m(),u()}function u(){for(let x=0;x<o.length;x+=6){let b=o[x+0],v=o[x+2],E=o[x+4],A=Math.max(b,v,E),w=Math.min(b,v,E);A>.9&&w<.1&&(b<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),E<.2&&(o[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,b){let v=x*3;b.x=t[v+0],b.y=t[v+1],b.z=t[v+2]}function m(){let x=new D,b=new D,v=new D,E=new D,A=new Gt,w=new Gt,R=new Gt;for(let M=0,_=0;M<r.length;M+=9,_+=6){x.set(r[M+0],r[M+1],r[M+2]),b.set(r[M+3],r[M+4],r[M+5]),v.set(r[M+6],r[M+7],r[M+8]),A.set(o[_+0],o[_+1]),w.set(o[_+2],o[_+3]),R.set(o[_+4],o[_+5]),E.copy(x).add(b).add(v).divideScalar(3);let P=g(E);y(A,_+0,x,P),y(w,_+2,b,P),y(R,_+4,v,P)}}function y(x,b,v,E){E<0&&x.x===1&&(o[b]=x.x-1),v.x===0&&v.z===0&&(o[b]=E/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.details)}},tr=class s extends Qs{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var ri=class s extends Qs{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var $e=class s extends ce{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=t/a,d=e/c,f=[],m=[],y=[],g=[];for(let p=0;p<h;p++){let x=p*d-o;for(let b=0;b<l;b++){let v=b*u-r;m.push(v,-x,0),y.push(0,0,1),g.push(b/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){let b=x+l*p,v=x+l*(p+1),E=x+1+l*(p+1),A=x+1+l*p;f.push(b,v,A),f.push(v,E,A)}this.setIndex(f),this.setAttribute("position",new Wt(m,3)),this.setAttribute("normal",new Wt(y,3)),this.setAttribute("uv",new Wt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},Pn=class s extends ce{constructor(t=.5,e=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],c=[],l=[],h=[],u=t,d=(e-t)/i,f=new D,m=new Gt;for(let y=0;y<=i;y++){for(let g=0;g<=n;g++){let p=r+g/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,h.push(m.x,m.y)}u+=d}for(let y=0;y<i;y++){let g=y*(n+1);for(let p=0;p<n;p++){let x=p+g,b=x,v=x+n+1,E=x+n+2,A=x+1;a.push(b,v,A),a.push(v,E,A)}}this.setIndex(a),this.setAttribute("position",new Wt(c,3)),this.setAttribute("normal",new Wt(l,3)),this.setAttribute("uv",new Wt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var ge=class s extends ce{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new D,d=new D,f=[],m=[],y=[],g=[];for(let p=0;p<=n;p++){let x=[],b=p/n,v=0;p===0&&o===0?v=.5/e:p===n&&c===Math.PI&&(v=-.5/e);for(let E=0;E<=e;E++){let A=E/e;u.x=-t*Math.cos(i+A*r)*Math.sin(o+b*a),u.y=t*Math.cos(o+b*a),u.z=t*Math.sin(i+A*r)*Math.sin(o+b*a),m.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),g.push(A+v,1-b),x.push(l++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){let b=h[p][x+1],v=h[p][x],E=h[p+1][x],A=h[p+1][x+1];(p!==0||o>0)&&f.push(b,v,A),(p!==n-1||c<Math.PI)&&f.push(v,E,A)}this.setIndex(f),this.setAttribute("position",new Wt(m,3)),this.setAttribute("normal",new Wt(y,3)),this.setAttribute("uv",new Wt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var oi=class s extends ce{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],c=[],l=[],h=new D,u=new D,d=new D;for(let f=0;f<=n;f++)for(let m=0;m<=i;m++){let y=m/i*r,g=f/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(y),u.y=(t+e*Math.cos(g))*Math.sin(y),u.z=e*Math.sin(g),a.push(u.x,u.y,u.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(m/i),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=i;m++){let y=(i+1)*f+m-1,g=(i+1)*(f-1)+m-1,p=(i+1)*(f-1)+m,x=(i+1)*f+m;o.push(y,g,x),o.push(g,p,x)}this.setIndex(o),this.setAttribute("position",new Wt(a,3)),this.setAttribute("normal",new Wt(c,3)),this.setAttribute("uv",new Wt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Ee=class extends Rn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new At(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new At(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vl,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var go=class extends Rn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Oh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},yo=class extends Rn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};var er=class extends Wn{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}};function to(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function Fd(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var Ei=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},xo=class extends Ei{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:bl,endingEnd:bl}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case _l:r=t,a=2*e-n;break;case Ml:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case _l:o=t,c=2*n-e;break;case Ml:o=1,c=n+i[1]-i[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-e)/(i-e),y=m*m,g=y*m,p=-d*g+2*d*y-d*m,x=(1+d)*g+(-1.5-2*d)*y+(-.5+d)*m+1,b=(-1-f)*g+(1.5+f)*y+.5*m,v=f*g-f*y;for(let E=0;E!==a;++E)r[E]=p*o[h+E]+x*o[l+E]+b*o[c+E]+v*o[u+E];return r}},vo=class extends Ei{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},bo=class extends Ei{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},ln=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=to(e,this.TimeBufferType),this.values=to(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:to(t.times,Array),values:to(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new bo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new vo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new xo(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Os:e=this.InterpolantFactoryMethodDiscrete;break;case ro:e=this.InterpolantFactoryMethodLinear;break;case eo:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Os;case this.InterpolantFactoryMethodLinear:return ro;case this.InterpolantFactoryMethodSmooth:return eo}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(i!==void 0&&Fd(i))for(let a=0,c=i.length;a!==c;++a){let l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===eo,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(i)c=!0;else{let u=a*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let y=e[u+m];if(y!==e[d+m]||y!==e[f+m]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};ln.prototype.ValueTypeName="";ln.prototype.TimeBufferType=Float32Array;ln.prototype.ValueBufferType=Float32Array;ln.prototype.DefaultInterpolation=ro;var ai=class extends ln{constructor(t,e,n){super(t,e,n)}};ai.prototype.ValueTypeName="bool";ai.prototype.ValueBufferType=Array;ai.prototype.DefaultInterpolation=Os;ai.prototype.InterpolantFactoryMethodLinear=void 0;ai.prototype.InterpolantFactoryMethodSmooth=void 0;var _o=class extends ln{constructor(t,e,n,i){super(t,e,n,i)}};_o.prototype.ValueTypeName="color";var Mo=class extends ln{constructor(t,e,n,i){super(t,e,n,i)}};Mo.prototype.ValueTypeName="number";var wo=class extends Ei{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(i-e),l=t*a;for(let h=l+a;l!==h;l+=4)Ne.slerpFlat(r,0,o,l-a,o,l,c);return r}},nr=class extends ln{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new wo(this.times,this.values,this.getValueSize(),t)}};nr.prototype.ValueTypeName="quaternion";nr.prototype.InterpolantFactoryMethodSmooth=void 0;var li=class extends ln{constructor(t,e,n){super(t,e,n)}};li.prototype.ValueTypeName="string";li.prototype.ValueBufferType=Array;li.prototype.DefaultInterpolation=Os;li.prototype.InterpolantFactoryMethodLinear=void 0;li.prototype.InterpolantFactoryMethodSmooth=void 0;var So=class extends ln{constructor(t,e,n,i){super(t,e,n,i)}};So.prototype.ValueTypeName="vector";var Eo=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],m=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},jh=new Eo,To=class{constructor(t){this.manager=t!==void 0?t:jh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};To.DEFAULT_MATERIAL_NAME="__DEFAULT";var ir=class extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new At(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},sr=class extends ir{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new At(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},vl=new Vt,ah=new D,lh=new D,Tl=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Gt(512,512),this.mapType=bn,this.map=null,this.mapPass=null,this.matrix=new Vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new hs,this._frameExtents=new Gt(1,1),this._viewportCount=1,this._viewports=[new Se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;ah.setFromMatrixPosition(t.matrixWorld),e.position.copy(ah),lh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lh),e.updateMatrixWorld(),vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vl,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var rr=class extends $s{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Al=class extends Tl{constructor(){super(new rr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},or=class extends ir{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new Al}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Ao=class extends ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},ar=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};var Yl="\\[\\]\\.:\\/",kd=new RegExp("["+Yl+"]","g"),Zl="[^"+Yl+"]",Od="[^"+Yl.replace("\\.","")+"]",Bd=/((?:WC+[\/:])*)/.source.replace("WC",Zl),Hd=/(WCOD+)?/.source.replace("WCOD",Od),zd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zl),Gd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zl),Vd=new RegExp("^"+Bd+Hd+zd+Gd+"$"),Wd=["material","materials","bones","map"],Rl=class{constructor(t,e,n){let i=n||xe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},xe=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(kd,"")}static parseTrackName(t){let e=Vd.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);Wd.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[i];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};xe.Composite=Rl;xe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};xe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};xe.prototype.GetterByBindingType=[xe.prototype._getValue_direct,xe.prototype._getValue_array,xe.prototype._getValue_arrayElement,xe.prototype._getValue_toArray];xe.prototype.SetterByBindingTypeAndVersioning=[[xe.prototype._setValue_direct,xe.prototype._setValue_direct_setNeedsUpdate,xe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_array,xe.prototype._setValue_array_setNeedsUpdate,xe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_arrayElement,xe.prototype._setValue_arrayElement_setNeedsUpdate,xe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_fromArray,xe.prototype._setValue_fromArray_setNeedsUpdate,xe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ay=new Float32Array(1);function Jl(s,t,e,n){let i=Xd(n);switch(e){case Hl:return s*t;case Vo:return s*t/i.components*i.byteLength;case Wo:return s*t/i.components*i.byteLength;case Gl:return s*t*2/i.components*i.byteLength;case Xo:return s*t*2/i.components*i.byteLength;case zl:return s*t*3/i.components*i.byteLength;case pn:return s*t*4/i.components*i.byteLength;case $o:return s*t*4/i.components*i.byteLength;case hr:case ur:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case dr:case fr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Yo:case Jo:return Math.max(s,16)*Math.max(t,8)/4;case qo:case Zo:return Math.max(s,8)*Math.max(t,8)/2;case Ko:case jo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Qo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ta:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ea:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case na:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case ia:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case sa:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ra:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case oa:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case aa:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case la:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case ca:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ha:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case ua:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case da:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case fa:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case pa:case ma:case ga:return Math.ceil(s/4)*Math.ceil(t/4)*16;case ya:case xa:return Math.ceil(s/4)*Math.ceil(t/4)*8;case va:case ba:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Xd(s){switch(s){case bn:case Fl:return{byteLength:1,components:1};case ds:case kl:case fs:return{byteLength:2,components:1};case zo:case Go:return{byteLength:2,components:4};case ci:case Ho:case _n:return{byteLength:4,components:1};case Ol:case Bl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Mu(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function jd(s){let t=new WeakMap;function e(a,c){let l=a.array,h=a.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(s.bindBuffer(l,a),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],y=u[f];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let y=u[f];s.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(s.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:r,update:o}}var Qd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tf=`#ifdef USE_ALPHAHASH
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
#endif`,ef=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,nf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,rf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,of=`#ifdef USE_AOMAP
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
#endif`,af=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lf=`#ifdef USE_BATCHING
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
#endif`,cf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,uf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,df=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ff=`#ifdef USE_IRIDESCENCE
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
#endif`,pf=`#ifdef USE_BUMPMAP
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
#endif`,mf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,gf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,vf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,bf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,_f=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Mf=`#if defined( USE_COLOR_ALPHA )
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
} // validated`,Sf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ef=`vec3 transformedNormal = objectNormal;
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
#endif`,Tf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Af=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Rf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pf="gl_FragColor = linearToOutputTexel( gl_FragColor );",If=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Lf=`#ifdef USE_ENVMAP
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
#endif`,Df=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Uf=`#ifdef USE_ENVMAP
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
#endif`,Nf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ff=`#ifdef USE_ENVMAP
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
#endif`,kf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Of=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zf=`#ifdef USE_GRADIENTMAP
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
}`,Gf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xf=`uniform bool receiveShadow;
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
#endif`,$f=`#ifdef USE_ENVMAP
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
#endif`,qf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Yf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Jf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Kf=`PhysicalMaterial material;
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
#endif`,jf=`struct PhysicalMaterial {
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
}`,Qf=`
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
#endif`,tp=`#if defined( RE_IndirectDiffuse )
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
#endif`,ep=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,np=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ip=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,op=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ap=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cp=`#if defined( USE_POINTS_UV )
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
#endif`,hp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,up=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mp=`#ifdef USE_MORPHTARGETS
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
#endif`,gp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,xp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,vp=`#ifndef FLAT_SHADED
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
#endif`,_p=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Mp=`#ifdef USE_NORMALMAP
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
#endif`,Sp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ep=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Tp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ap=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Cp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Pp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ip=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Up=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Np=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
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
#endif`,Fp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,kp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Op=`float getShadowMask() {
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
}`,Bp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hp=`#ifdef USE_SKINNING
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
#endif`,zp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gp=`#ifdef USE_SKINNING
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
#endif`,Vp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$p=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,qp=`#ifdef USE_TRANSMISSION
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
#endif`,Yp=`#ifdef USE_TRANSMISSION
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
#endif`,Zp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Qp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tm=`uniform sampler2D t2D;
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
}`,em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rm=`#include <common>
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
}`,om=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,am=`#define DISTANCE
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
}`,lm=`#define DISTANCE
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
}`,cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,um=`uniform float scale;
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
}`,dm=`uniform vec3 diffuse;
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
}`,fm=`#include <common>
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
}`,pm=`uniform vec3 diffuse;
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
}`,mm=`#define LAMBERT
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
}`,gm=`#define LAMBERT
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
}`,ym=`#define MATCAP
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
}`,xm=`#define MATCAP
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
}`,vm=`#define NORMAL
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
}`,bm=`#define NORMAL
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
}`,_m=`#define PHONG
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
}`,Mm=`#define PHONG
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
}`,wm=`#define STANDARD
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
}`,Sm=`#define STANDARD
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
}`,Em=`#define TOON
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
}`,Tm=`#define TOON
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
}`,Am=`uniform float size;
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
}`,Rm=`uniform vec3 diffuse;
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
}`,Cm=`#include <common>
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
}`,Pm=`uniform vec3 color;
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
}`,Im=`uniform float rotation;
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
}`,Lm=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:Qd,alphahash_pars_fragment:tf,alphamap_fragment:ef,alphamap_pars_fragment:nf,alphatest_fragment:sf,alphatest_pars_fragment:rf,aomap_fragment:of,aomap_pars_fragment:af,batching_pars_vertex:lf,batching_vertex:cf,begin_vertex:hf,beginnormal_vertex:uf,bsdfs:df,iridescence_fragment:ff,bumpmap_pars_fragment:pf,clipping_planes_fragment:mf,clipping_planes_pars_fragment:gf,clipping_planes_pars_vertex:yf,clipping_planes_vertex:xf,color_fragment:vf,color_pars_fragment:bf,color_pars_vertex:_f,color_vertex:Mf,common:wf,cube_uv_reflection_fragment:Sf,defaultnormal_vertex:Ef,displacementmap_pars_vertex:Tf,displacementmap_vertex:Af,emissivemap_fragment:Rf,emissivemap_pars_fragment:Cf,colorspace_fragment:Pf,colorspace_pars_fragment:If,envmap_fragment:Lf,envmap_common_pars_fragment:Df,envmap_pars_fragment:Uf,envmap_pars_vertex:Nf,envmap_physical_pars_fragment:$f,envmap_vertex:Ff,fog_vertex:kf,fog_pars_vertex:Of,fog_fragment:Bf,fog_pars_fragment:Hf,gradientmap_pars_fragment:zf,lightmap_pars_fragment:Gf,lights_lambert_fragment:Vf,lights_lambert_pars_fragment:Wf,lights_pars_begin:Xf,lights_toon_fragment:qf,lights_toon_pars_fragment:Yf,lights_phong_fragment:Zf,lights_phong_pars_fragment:Jf,lights_physical_fragment:Kf,lights_physical_pars_fragment:jf,lights_fragment_begin:Qf,lights_fragment_maps:tp,lights_fragment_end:ep,logdepthbuf_fragment:np,logdepthbuf_pars_fragment:ip,logdepthbuf_pars_vertex:sp,logdepthbuf_vertex:rp,map_fragment:op,map_pars_fragment:ap,map_particle_fragment:lp,map_particle_pars_fragment:cp,metalnessmap_fragment:hp,metalnessmap_pars_fragment:up,morphinstance_vertex:dp,morphcolor_vertex:fp,morphnormal_vertex:pp,morphtarget_pars_vertex:mp,morphtarget_vertex:gp,normal_fragment_begin:yp,normal_fragment_maps:xp,normal_pars_fragment:vp,normal_pars_vertex:bp,normal_vertex:_p,normalmap_pars_fragment:Mp,clearcoat_normal_fragment_begin:wp,clearcoat_normal_fragment_maps:Sp,clearcoat_pars_fragment:Ep,iridescence_pars_fragment:Tp,opaque_fragment:Ap,packing:Rp,premultiplied_alpha_fragment:Cp,project_vertex:Pp,dithering_fragment:Ip,dithering_pars_fragment:Lp,roughnessmap_fragment:Dp,roughnessmap_pars_fragment:Up,shadowmap_pars_fragment:Np,shadowmap_pars_vertex:Fp,shadowmap_vertex:kp,shadowmask_pars_fragment:Op,skinbase_vertex:Bp,skinning_pars_vertex:Hp,skinning_vertex:zp,skinnormal_vertex:Gp,specularmap_fragment:Vp,specularmap_pars_fragment:Wp,tonemapping_fragment:Xp,tonemapping_pars_fragment:$p,transmission_fragment:qp,transmission_pars_fragment:Yp,uv_pars_fragment:Zp,uv_pars_vertex:Jp,uv_vertex:Kp,worldpos_vertex:jp,background_vert:Qp,background_frag:tm,backgroundCube_vert:em,backgroundCube_frag:nm,cube_vert:im,cube_frag:sm,depth_vert:rm,depth_frag:om,distanceRGBA_vert:am,distanceRGBA_frag:lm,equirect_vert:cm,equirect_frag:hm,linedashed_vert:um,linedashed_frag:dm,meshbasic_vert:fm,meshbasic_frag:pm,meshlambert_vert:mm,meshlambert_frag:gm,meshmatcap_vert:ym,meshmatcap_frag:xm,meshnormal_vert:vm,meshnormal_frag:bm,meshphong_vert:_m,meshphong_frag:Mm,meshphysical_vert:wm,meshphysical_frag:Sm,meshtoon_vert:Em,meshtoon_frag:Tm,points_vert:Am,points_frag:Rm,shadow_vert:Cm,shadow_frag:Pm,sprite_vert:Im,sprite_frag:Lm},dt={common:{diffuse:{value:new At(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new At(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new At(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new At(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},Dn={basic:{uniforms:Ve([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ve([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new At(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ve([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new At(0)},specular:{value:new At(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ve([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new At(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ve([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new At(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ve([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ve([dt.points,dt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ve([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ve([dt.common,dt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ve([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ve([dt.sprite,dt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ve([dt.common,dt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ve([dt.lights,dt.fog,{color:{value:new At(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Dn.physical={uniforms:Ve([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new At(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new At(0)},specularColor:{value:new At(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};var _a={r:0,b:0,g:0},Ci=new on,Dm=new Vt;function Um(s,t,e,n,i,r,o){let a=new At(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function m(b){let v=b.isScene===!0?b.background:null;return v&&v.isTexture&&(v=(b.backgroundBlurriness>0?e:t).get(v)),v}function y(b){let v=!1,E=m(b);E===null?p(a,c):E&&E.isColor&&(p(E,1),v=!0);let A=s.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function g(b,v){let E=m(v);E&&(E.isCubeTexture||E.mapping===lr)?(h===void 0&&(h=new Z(new ue(1,1,1),new an({name:"BackgroundCubeMaterial",uniforms:Ri(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Ci.copy(v.backgroundRotation),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Dm.makeRotationFromEuler(Ci)),h.material.toneMapped=ie.getTransfer(E.colorSpace)!==he,(u!==E||d!==E.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=E,d=E.version,f=s.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new Z(new $e(2,2),new an({name:"BackgroundMaterial",uniforms:Ri(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=ie.getTransfer(E.colorSpace)!==he,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||d!==E.version||f!==s.toneMapping)&&(l.material.needsUpdate=!0,u=E,d=E.version,f=s.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,v){b.getRGB(_a,ql(s)),n.buffers.color.setClear(_a.r,_a.g,_a.b,v,o)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,v=1){a.set(b),c=v,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(a,c)},render:y,addToRenderList:g,dispose:x}}function Nm(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,o=!1;function a(_,P,N,B,F){let z=!1,q=u(B,N,P);r!==q&&(r=q,l(r.object)),z=f(_,B,N,F),z&&m(_,B,N,F),F!==null&&t.update(F,s.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,v(_,P,N,B),F!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return s.createVertexArray()}function l(_){return s.bindVertexArray(_)}function h(_){return s.deleteVertexArray(_)}function u(_,P,N){let B=N.wireframe===!0,F=n[_.id];F===void 0&&(F={},n[_.id]=F);let z=F[P.id];z===void 0&&(z={},F[P.id]=z);let q=z[B];return q===void 0&&(q=d(c()),z[B]=q),q}function d(_){let P=[],N=[],B=[];for(let F=0;F<e;F++)P[F]=0,N[F]=0,B[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:N,attributeDivisors:B,object:_,attributes:{},index:null}}function f(_,P,N,B){let F=r.attributes,z=P.attributes,q=0,et=N.getAttributes();for(let $ in et)if(et[$].location>=0){let X=F[$],nt=z[$];if(nt===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(nt=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(nt=_.instanceColor)),X===void 0||X.attribute!==nt||nt&&X.data!==nt.data)return!0;q++}return r.attributesNum!==q||r.index!==B}function m(_,P,N,B){let F={},z=P.attributes,q=0,et=N.getAttributes();for(let $ in et)if(et[$].location>=0){let X=z[$];X===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(X=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(X=_.instanceColor));let nt={};nt.attribute=X,X&&X.data&&(nt.data=X.data),F[$]=nt,q++}r.attributes=F,r.attributesNum=q,r.index=B}function y(){let _=r.newAttributes;for(let P=0,N=_.length;P<N;P++)_[P]=0}function g(_){p(_,0)}function p(_,P){let N=r.newAttributes,B=r.enabledAttributes,F=r.attributeDivisors;N[_]=1,B[_]===0&&(s.enableVertexAttribArray(_),B[_]=1),F[_]!==P&&(s.vertexAttribDivisor(_,P),F[_]=P)}function x(){let _=r.newAttributes,P=r.enabledAttributes;for(let N=0,B=P.length;N<B;N++)P[N]!==_[N]&&(s.disableVertexAttribArray(N),P[N]=0)}function b(_,P,N,B,F,z,q){q===!0?s.vertexAttribIPointer(_,P,N,F,z):s.vertexAttribPointer(_,P,N,B,F,z)}function v(_,P,N,B){y();let F=B.attributes,z=N.getAttributes(),q=P.defaultAttributeValues;for(let et in z){let $=z[et];if($.location>=0){let ut=F[et];if(ut===void 0&&(et==="instanceMatrix"&&_.instanceMatrix&&(ut=_.instanceMatrix),et==="instanceColor"&&_.instanceColor&&(ut=_.instanceColor)),ut!==void 0){let X=ut.normalized,nt=ut.itemSize,Et=t.get(ut);if(Et===void 0)continue;let Yt=Et.buffer,Zt=Et.type,te=Et.bytesPerElement,J=Zt===s.INT||Zt===s.UNSIGNED_INT||ut.gpuType===Ho;if(ut.isInterleavedBufferAttribute){let tt=ut.data,St=tt.stride,Ft=ut.offset;if(tt.isInstancedInterleavedBuffer){for(let bt=0;bt<$.locationSize;bt++)p($.location+bt,tt.meshPerAttribute);_.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let bt=0;bt<$.locationSize;bt++)g($.location+bt);s.bindBuffer(s.ARRAY_BUFFER,Yt);for(let bt=0;bt<$.locationSize;bt++)b($.location+bt,nt/$.locationSize,Zt,X,St*te,(Ft+nt/$.locationSize*bt)*te,J)}else{if(ut.isInstancedBufferAttribute){for(let tt=0;tt<$.locationSize;tt++)p($.location+tt,ut.meshPerAttribute);_.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let tt=0;tt<$.locationSize;tt++)g($.location+tt);s.bindBuffer(s.ARRAY_BUFFER,Yt);for(let tt=0;tt<$.locationSize;tt++)b($.location+tt,nt/$.locationSize,Zt,X,nt*te,nt/$.locationSize*tt*te,J)}}else if(q!==void 0){let X=q[et];if(X!==void 0)switch(X.length){case 2:s.vertexAttrib2fv($.location,X);break;case 3:s.vertexAttrib3fv($.location,X);break;case 4:s.vertexAttrib4fv($.location,X);break;default:s.vertexAttrib1fv($.location,X)}}}}x()}function E(){R();for(let _ in n){let P=n[_];for(let N in P){let B=P[N];for(let F in B)h(B[F].object),delete B[F];delete P[N]}delete n[_]}}function A(_){if(n[_.id]===void 0)return;let P=n[_.id];for(let N in P){let B=P[N];for(let F in B)h(B[F].object),delete B[F];delete P[N]}delete n[_.id]}function w(_){for(let P in n){let N=n[P];if(N[_.id]===void 0)continue;let B=N[_.id];for(let F in B)h(B[F].object),delete B[F];delete N[_.id]}}function R(){M(),o=!0,r!==i&&(r=i,l(r.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:R,resetDefaultState:M,dispose:E,releaseStatesOfGeometry:A,releaseStatesOfProgram:w,initAttributes:y,enableAttribute:g,disableUnusedAttributes:x}}function Fm(s,t,e){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let m=0;for(let y=0;y<u;y++)m+=h[y]*d[y];e.update(m,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function km(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let w=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(w){return!(w!==pn&&n.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){let R=w===fs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==bn&&n.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==_n&&!R)}function c(w){if(w==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=m>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:v,vertexTextures:E,maxSamples:A}}function Om(s){let t=this,e=null,n=0,i=!1,r=!1,o=new Sn,a=new zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,y=u.clipIntersection,g=u.clipShadows,p=s.get(u);if(!i||m===null||m.length===0||r&&!g)r?h(null):l();else{let x=r?0:n,b=x*4,v=p.clippingState||null;c.value=v,v=h(m,d,b,f);for(let E=0;E!==b;++E)v[E]=e[E];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,m){let y=u!==null?u.length:0,g=null;if(y!==0){if(g=c.value,m!==!0||g===null){let p=f+y*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let b=0,v=f;b!==y;++b,v+=4)o.copy(u[b]).applyMatrix4(x,a),o.normal.toArray(g,v),g[v+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,g}}function Bm(s){let t=new WeakMap;function e(o,a){return a===ko?o.mapping=Ti:a===Oo&&(o.mapping=Ai),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ko||a===Oo)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new uo(c.height);return l.fromEquirectangularTexture(s,o),t.set(o,l),o.addEventListener("dispose",i),e(l.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var ys=4,Qh=[.125,.215,.35,.446,.526,.582],Li=20,Kl=new rr,tu=new At,jl=null,Ql=0,tc=0,ec=!1,Ii=(1+Math.sqrt(5))/2,gs=1/Ii,eu=[new D(-Ii,gs,0),new D(Ii,gs,0),new D(-gs,0,Ii),new D(gs,0,Ii),new D(0,Ii,-gs),new D(0,Ii,gs),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],Hm=new D,vs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,r={}){let{size:o=256,position:a=Hm}=r;jl=this._renderer.getRenderTarget(),Ql=this._renderer.getActiveCubeFace(),tc=this._renderer.getActiveMipmapLevel(),ec=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,i,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=su(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=iu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(jl,Ql,tc),this._renderer.xr.enabled=ec,t.scissorTest=!1,Ma(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ti||t.mapping===Ai?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),jl=this._renderer.getRenderTarget(),Ql=this._renderer.getActiveCubeFace(),tc=this._renderer.getActiveMipmapLevel(),ec=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:fs,format:pn,colorSpace:wi,depthBuffer:!1},i=nu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=nu(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=zm(r)),this._blurMaterial=Gm(r,t,e)}return i}_compileMaterial(t){let e=new Z(this._lodPlanes[0],t);this._renderer.compile(e,Kl)}_sceneToCubeUV(t,e,n,i,r){let c=new ze(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(tu),u.toneMapping=qn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));let y=new Fe({name:"PMREM.Background",side:ke,depthWrite:!1,depthTest:!1}),g=new Z(new ue,y),p=!1,x=t.background;x?x.isColor&&(y.color.copy(x),t.background=null,p=!0):(y.color.copy(tu),p=!0);for(let b=0;b<6;b++){let v=b%3;v===0?(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[b],r.y,r.z)):v===1?(c.up.set(0,0,l[b]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[b],r.z)):(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[b]));let E=this._cubeSize;Ma(i,v*E,b>2?E:0,E,E),u.setRenderTarget(i),p&&u.render(g,c),u.render(t,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=x}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===Ti||t.mapping===Ai;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=su()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=iu());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new Z(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;Ma(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Kl)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=eu[(i-r-1)%eu.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Z(this._lodPlanes[i],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Li-1),y=r/m,g=isFinite(r)?1+Math.floor(h*y):Li;g>Li&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Li}`);let p=[],x=0;for(let w=0;w<Li;++w){let R=w/y,M=Math.exp(-R*R/2);p.push(M),w===0?x+=M:w<g&&(x+=2*M)}for(let w=0;w<p.length;w++)p[w]=p[w]/x;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:b}=this;d.dTheta.value=m,d.mipInt.value=b-n;let v=this._sizeLods[i],E=3*v*(i>b-ys?i-b+ys:0),A=4*(this._cubeSize-v);Ma(e,E,A,3*v,2*v),c.setRenderTarget(e),c.render(u,Kl)}};function zm(s){let t=[],e=[],n=[],i=s,r=s-ys+1+Qh.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);e.push(a);let c=1/a;o>s-ys?c=Qh[o-s+ys-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,y=3,g=2,p=1,x=new Float32Array(y*m*f),b=new Float32Array(g*m*f),v=new Float32Array(p*m*f);for(let A=0;A<f;A++){let w=A%3*2/3-1,R=A>2?0:-1,M=[w,R,0,w+2/3,R,0,w+2/3,R+1,0,w,R,0,w+2/3,R+1,0,w,R+1,0];x.set(M,y*m*A),b.set(d,g*m*A);let _=[A,A,A,A,A,A];v.set(_,p*m*A)}let E=new ce;E.setAttribute("position",new oe(x,y)),E.setAttribute("uv",new oe(b,g)),E.setAttribute("faceIndex",new oe(v,p)),t.push(E),i>ys&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function nu(s,t,e){let n=new En(s,t,e);return n.texture.mapping=lr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ma(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Gm(s,t,e){let n=new Float32Array(Li),i=new D(0,1,0);return new an({name:"SphericalGaussianBlur",defines:{n:Li,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:uc(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function iu(){return new an({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:uc(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function su(){return new an({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function uc(){return`

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
	`}function Vm(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===ko||c===Oo,h=c===Ti||c===Ai;if(l||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new vs(s)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new vs(s)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Wm(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&ss("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Xm(s,t,e,n){let i={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let m in d.attributes)t.remove(d.attributes[m]);d.removeEventListener("dispose",o),delete i[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let f in d)t.update(d[f],s.ARRAY_BUFFER)}function l(u){let d=[],f=u.index,m=u.attributes.position,y=0;if(f!==null){let x=f.array;y=f.version;for(let b=0,v=x.length;b<v;b+=3){let E=x[b+0],A=x[b+1],w=x[b+2];d.push(E,A,A,w,w,E)}}else if(m!==void 0){let x=m.array;y=m.version;for(let b=0,v=x.length/3-1;b<v;b+=3){let E=b+0,A=b+1,w=b+2;d.push(E,A,A,w,w,E)}}else return;let g=new($l(d)?Xs:Ws)(d,1);g.version=y;let p=r.get(u);p&&t.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function $m(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*o),e.update(f,n,1)}function l(d,f,m){m!==0&&(s.drawElementsInstanced(n,f,r,d*o,m),e.update(f,n,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,n,1)}function u(d,f,m,y){if(m===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],y[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,y,0,m);let p=0;for(let x=0;x<m;x++)p+=f[x]*y[x];e.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function qm(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Ym(s,t,e){let n=new WeakMap,i=new Se;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let M=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],b=0;f===!0&&(b=1),m===!0&&(b=2),y===!0&&(b=3);let v=a.attributes.position.count*b,E=1;v>t.maxTextureSize&&(E=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let A=new Float32Array(v*E*4*u),w=new Gs(A,v,E,u);w.type=_n,w.needsUpdate=!0;let R=b*4;for(let _=0;_<u;_++){let P=g[_],N=p[_],B=x[_],F=v*E*4*_;for(let z=0;z<P.count;z++){let q=z*R;f===!0&&(i.fromBufferAttribute(P,z),A[F+q+0]=i.x,A[F+q+1]=i.y,A[F+q+2]=i.z,A[F+q+3]=0),m===!0&&(i.fromBufferAttribute(N,z),A[F+q+4]=i.x,A[F+q+5]=i.y,A[F+q+6]=i.z,A[F+q+7]=0),y===!0&&(i.fromBufferAttribute(B,z),A[F+q+8]=i.x,A[F+q+9]=i.y,A[F+q+10]=i.z,A[F+q+11]=B.itemSize===4?i.w:1)}}d={count:u,texture:w,size:new Gt(v,E)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let y=0;y<l.length;y++)f+=l[y];let m=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",m),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Zm(s,t,e,n){let i=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function o(){i=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var wu=new Xe,ru=new Ks(1,1),Su=new Gs,Eu=new co,Tu=new qs,ou=[],au=[],lu=new Float32Array(16),cu=new Float32Array(9),hu=new Float32Array(4);function bs(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=ou[i];if(r===void 0&&(r=new Float32Array(i),ou[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Ie(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Le(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Ea(s,t){let e=au[t];e===void 0&&(e=new Int32Array(t),au[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Jm(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Km(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2fv(this.addr,t),Le(e,t)}}function jm(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;s.uniform3fv(this.addr,t),Le(e,t)}}function Qm(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4fv(this.addr,t),Le(e,t)}}function t0(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;hu.set(n),s.uniformMatrix2fv(this.addr,!1,hu),Le(e,n)}}function e0(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;cu.set(n),s.uniformMatrix3fv(this.addr,!1,cu),Le(e,n)}}function n0(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;lu.set(n),s.uniformMatrix4fv(this.addr,!1,lu),Le(e,n)}}function i0(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function s0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2iv(this.addr,t),Le(e,t)}}function r0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;s.uniform3iv(this.addr,t),Le(e,t)}}function o0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4iv(this.addr,t),Le(e,t)}}function a0(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function l0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2uiv(this.addr,t),Le(e,t)}}function c0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;s.uniform3uiv(this.addr,t),Le(e,t)}}function h0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4uiv(this.addr,t),Le(e,t)}}function u0(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(ru.compareFunction=Wl,r=ru):r=wu,e.setTexture2D(t||r,i)}function d0(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Eu,i)}function f0(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Tu,i)}function p0(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Su,i)}function m0(s){switch(s){case 5126:return Jm;case 35664:return Km;case 35665:return jm;case 35666:return Qm;case 35674:return t0;case 35675:return e0;case 35676:return n0;case 5124:case 35670:return i0;case 35667:case 35671:return s0;case 35668:case 35672:return r0;case 35669:case 35673:return o0;case 5125:return a0;case 36294:return l0;case 36295:return c0;case 36296:return h0;case 35678:case 36198:case 36298:case 36306:case 35682:return u0;case 35679:case 36299:case 36307:return d0;case 35680:case 36300:case 36308:case 36293:return f0;case 36289:case 36303:case 36311:case 36292:return p0}}function g0(s,t){s.uniform1fv(this.addr,t)}function y0(s,t){let e=bs(t,this.size,2);s.uniform2fv(this.addr,e)}function x0(s,t){let e=bs(t,this.size,3);s.uniform3fv(this.addr,e)}function v0(s,t){let e=bs(t,this.size,4);s.uniform4fv(this.addr,e)}function b0(s,t){let e=bs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function _0(s,t){let e=bs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function M0(s,t){let e=bs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function w0(s,t){s.uniform1iv(this.addr,t)}function S0(s,t){s.uniform2iv(this.addr,t)}function E0(s,t){s.uniform3iv(this.addr,t)}function T0(s,t){s.uniform4iv(this.addr,t)}function A0(s,t){s.uniform1uiv(this.addr,t)}function R0(s,t){s.uniform2uiv(this.addr,t)}function C0(s,t){s.uniform3uiv(this.addr,t)}function P0(s,t){s.uniform4uiv(this.addr,t)}function I0(s,t,e){let n=this.cache,i=t.length,r=Ea(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||wu,r[o])}function L0(s,t,e){let n=this.cache,i=t.length,r=Ea(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Eu,r[o])}function D0(s,t,e){let n=this.cache,i=t.length,r=Ea(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Tu,r[o])}function U0(s,t,e){let n=this.cache,i=t.length,r=Ea(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Su,r[o])}function N0(s){switch(s){case 5126:return g0;case 35664:return y0;case 35665:return x0;case 35666:return v0;case 35674:return b0;case 35675:return _0;case 35676:return M0;case 5124:case 35670:return w0;case 35667:case 35671:return S0;case 35668:case 35672:return E0;case 35669:case 35673:return T0;case 5125:return A0;case 36294:return R0;case 36295:return C0;case 36296:return P0;case 35678:case 36198:case 36298:case 36306:case 35682:return I0;case 35679:case 36299:case 36307:return L0;case 35680:case 36300:case 36308:case 36293:return D0;case 36289:case 36303:case 36311:case 36292:return U0}}var ic=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=m0(e.type)}},sc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=N0(e.type)}},rc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},nc=/(\w+)(\])?(\[|\.)?/g;function uu(s,t){s.seq.push(t),s.map[t.id]=t}function F0(s,t,e){let n=s.name,i=n.length;for(nc.lastIndex=0;;){let r=nc.exec(n),o=nc.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){uu(e,l===void 0?new ic(a,s,t):new sc(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new rc(a),uu(e,u)),e=u}}}var xs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);F0(r,o,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function du(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var k0=37297,O0=0;function B0(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var fu=new zt;function H0(s){ie._getMatrix(fu,ie.workingColorSpace,s);let t=`mat3( ${fu.elements.map(e=>e.toFixed(4))} )`;switch(ie.getTransfer(s)){case Bs:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function pu(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+B0(s.getShaderSource(t),a)}else return r}function z0(s,t){let e=H0(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function G0(s,t){let e;switch(t){case Ih:e="Linear";break;case Lh:e="Reinhard";break;case Dh:e="Cineon";break;case Fo:e="ACESFilmic";break;case Nh:e="AgX";break;case Fh:e="Neutral";break;case Uh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var wa=new D;function V0(){ie.getLuminanceCoefficients(wa);let s=wa.x.toFixed(4),t=wa.y.toFixed(4),e=wa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function W0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mr).join(`
`)}function X0(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function $0(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function mr(s){return s!==""}function mu(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function gu(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var q0=/^[ \t]*#include +<([\w\d./]+)>/gm;function oc(s){return s.replace(q0,Z0)}var Y0=new Map;function Z0(s,t){let e=Xt[t];if(e===void 0){let n=Y0.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return oc(e)}var J0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yu(s){return s.replace(J0,K0)}function K0(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function xu(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function j0(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Pl?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Ro?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===In&&(t="SHADOWMAP_TYPE_VSM"),t}function Q0(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ti:case Ai:t="ENVMAP_TYPE_CUBE";break;case lr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function tg(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ai:t="ENVMAP_MODE_REFRACTION";break}return t}function eg(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ul:t="ENVMAP_BLENDING_MULTIPLY";break;case Ch:t="ENVMAP_BLENDING_MIX";break;case Ph:t="ENVMAP_BLENDING_ADD";break}return t}function ng(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function ig(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=j0(e),l=Q0(e),h=tg(e),u=eg(e),d=ng(e),f=W0(e),m=X0(r),y=i.createProgram(),g,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(mr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(mr).join(`
`),p.length>0&&(p+=`
`)):(g=[xu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mr).join(`
`),p=[xu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==qn?"#define TONE_MAPPING":"",e.toneMapping!==qn?Xt.tonemapping_pars_fragment:"",e.toneMapping!==qn?G0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,z0("linearToOutputTexel",e.outputColorSpace),V0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(mr).join(`
`)),o=oc(o),o=mu(o,e),o=gu(o,e),a=oc(a),a=mu(a,e),a=gu(a,e),o=yu(o),a=yu(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Xl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Xl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let b=x+g+o,v=x+p+a,E=du(i,i.VERTEX_SHADER,b),A=du(i,i.FRAGMENT_SHADER,v);i.attachShader(y,E),i.attachShader(y,A),e.index0AttributeName!==void 0?i.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(y,0,"position"),i.linkProgram(y);function w(P){if(s.debug.checkShaderErrors){let N=i.getProgramInfoLog(y)||"",B=i.getShaderInfoLog(E)||"",F=i.getShaderInfoLog(A)||"",z=N.trim(),q=B.trim(),et=F.trim(),$=!0,ut=!0;if(i.getProgramParameter(y,i.LINK_STATUS)===!1)if($=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,y,E,A);else{let X=pu(i,E,"vertex"),nt=pu(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(y,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+z+`
`+X+`
`+nt)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(q===""||et==="")&&(ut=!1);ut&&(P.diagnostics={runnable:$,programLog:z,vertexShader:{log:q,prefix:g},fragmentShader:{log:et,prefix:p}})}i.deleteShader(E),i.deleteShader(A),R=new xs(i,y),M=$0(i,y)}let R;this.getUniforms=function(){return R===void 0&&w(this),R};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=i.getProgramParameter(y,k0)),_},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=O0++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=E,this.fragmentShader=A,this}var sg=0,ac=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new lc(t),e.set(t,n)),n}},lc=class{constructor(t){this.id=sg++,this.code=t,this.usedTimes=0}};function rg(s,t,e,n,i,r,o){let a=new Vs,c=new ac,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures,f=i.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return l.add(M),M===0?"uv":`uv${M}`}function g(M,_,P,N,B){let F=N.fog,z=B.geometry,q=M.isMeshStandardMaterial?N.environment:null,et=(M.isMeshStandardMaterial?e:t).get(M.envMap||q),$=et&&et.mapping===lr?et.image.height:null,ut=m[M.type];M.precision!==null&&(f=i.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));let X=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,nt=X!==void 0?X.length:0,Et=0;z.morphAttributes.position!==void 0&&(Et=1),z.morphAttributes.normal!==void 0&&(Et=2),z.morphAttributes.color!==void 0&&(Et=3);let Yt,Zt,te,J;if(ut){let le=Dn[ut];Yt=le.vertexShader,Zt=le.fragmentShader}else Yt=M.vertexShader,Zt=M.fragmentShader,c.update(M),te=c.getVertexShaderID(M),J=c.getFragmentShaderID(M);let tt=s.getRenderTarget(),St=s.state.buffers.depth.getReversed(),Ft=B.isInstancedMesh===!0,bt=B.isBatchedMesh===!0,Jt=!!M.map,Ae=!!M.matcap,I=!!et,ee=!!M.aoMap,It=!!M.lightMap,Pt=!!M.bumpMap,gt=!!M.normalMap,Kt=!!M.displacementMap,Mt=!!M.emissiveMap,Ht=!!M.metalnessMap,ve=!!M.roughnessMap,pe=M.anisotropy>0,C=M.clearcoat>0,S=M.dispersion>0,H=M.iridescence>0,Y=M.sheen>0,j=M.transmission>0,G=pe&&!!M.anisotropyMap,ct=C&&!!M.clearcoatMap,rt=C&&!!M.clearcoatNormalMap,yt=C&&!!M.clearcoatRoughnessMap,vt=H&&!!M.iridescenceMap,Q=H&&!!M.iridescenceThicknessMap,lt=Y&&!!M.sheenColorMap,Ct=Y&&!!M.sheenRoughnessMap,_t=!!M.specularMap,at=!!M.specularColorMap,Ot=!!M.specularIntensityMap,U=j&&!!M.transmissionMap,it=j&&!!M.thicknessMap,ht=!!M.gradientMap,xt=!!M.alphaMap,st=M.alphaTest>0,K=!!M.alphaHash,Tt=!!M.extensions,Dt=qn;M.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Dt=s.toneMapping);let ae={shaderID:ut,shaderType:M.type,shaderName:M.name,vertexShader:Yt,fragmentShader:Zt,defines:M.defines,customVertexShaderID:te,customFragmentShaderID:J,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:bt,batchingColor:bt&&B._colorsTexture!==null,instancing:Ft,instancingColor:Ft&&B.instanceColor!==null,instancingMorph:Ft&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:tt===null?s.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:wi,alphaToCoverage:!!M.alphaToCoverage,map:Jt,matcap:Ae,envMap:I,envMapMode:I&&et.mapping,envMapCubeUVHeight:$,aoMap:ee,lightMap:It,bumpMap:Pt,normalMap:gt,displacementMap:d&&Kt,emissiveMap:Mt,normalMapObjectSpace:gt&&M.normalMapType===Hh,normalMapTangentSpace:gt&&M.normalMapType===Vl,metalnessMap:Ht,roughnessMap:ve,anisotropy:pe,anisotropyMap:G,clearcoat:C,clearcoatMap:ct,clearcoatNormalMap:rt,clearcoatRoughnessMap:yt,dispersion:S,iridescence:H,iridescenceMap:vt,iridescenceThicknessMap:Q,sheen:Y,sheenColorMap:lt,sheenRoughnessMap:Ct,specularMap:_t,specularColorMap:at,specularIntensityMap:Ot,transmission:j,transmissionMap:U,thicknessMap:it,gradientMap:ht,opaque:M.transparent===!1&&M.blending===_i&&M.alphaToCoverage===!1,alphaMap:xt,alphaTest:st,alphaHash:K,combine:M.combine,mapUv:Jt&&y(M.map.channel),aoMapUv:ee&&y(M.aoMap.channel),lightMapUv:It&&y(M.lightMap.channel),bumpMapUv:Pt&&y(M.bumpMap.channel),normalMapUv:gt&&y(M.normalMap.channel),displacementMapUv:Kt&&y(M.displacementMap.channel),emissiveMapUv:Mt&&y(M.emissiveMap.channel),metalnessMapUv:Ht&&y(M.metalnessMap.channel),roughnessMapUv:ve&&y(M.roughnessMap.channel),anisotropyMapUv:G&&y(M.anisotropyMap.channel),clearcoatMapUv:ct&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:rt&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:yt&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&y(M.sheenRoughnessMap.channel),specularMapUv:_t&&y(M.specularMap.channel),specularColorMapUv:at&&y(M.specularColorMap.channel),specularIntensityMapUv:Ot&&y(M.specularIntensityMap.channel),transmissionMapUv:U&&y(M.transmissionMap.channel),thicknessMapUv:it&&y(M.thicknessMap.channel),alphaMapUv:xt&&y(M.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(gt||pe),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!z.attributes.uv&&(Jt||xt),fog:!!F,useFog:M.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:St,skinning:B.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:Et,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Dt,decodeVideoTexture:Jt&&M.map.isVideoTexture===!0&&ie.getTransfer(M.map.colorSpace)===he,decodeVideoTextureEmissive:Mt&&M.emissiveMap.isVideoTexture===!0&&ie.getTransfer(M.emissiveMap.colorSpace)===he,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===be,flipSided:M.side===ke,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Tt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Tt&&M.extensions.multiDraw===!0||bt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ae.vertexUv1s=l.has(1),ae.vertexUv2s=l.has(2),ae.vertexUv3s=l.has(3),l.clear(),ae}function p(M){let _=[];if(M.shaderID?_.push(M.shaderID):(_.push(M.customVertexShaderID),_.push(M.customFragmentShaderID)),M.defines!==void 0)for(let P in M.defines)_.push(P),_.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(x(_,M),b(_,M),_.push(s.outputColorSpace)),_.push(M.customProgramCacheKey),_.join()}function x(M,_){M.push(_.precision),M.push(_.outputColorSpace),M.push(_.envMapMode),M.push(_.envMapCubeUVHeight),M.push(_.mapUv),M.push(_.alphaMapUv),M.push(_.lightMapUv),M.push(_.aoMapUv),M.push(_.bumpMapUv),M.push(_.normalMapUv),M.push(_.displacementMapUv),M.push(_.emissiveMapUv),M.push(_.metalnessMapUv),M.push(_.roughnessMapUv),M.push(_.anisotropyMapUv),M.push(_.clearcoatMapUv),M.push(_.clearcoatNormalMapUv),M.push(_.clearcoatRoughnessMapUv),M.push(_.iridescenceMapUv),M.push(_.iridescenceThicknessMapUv),M.push(_.sheenColorMapUv),M.push(_.sheenRoughnessMapUv),M.push(_.specularMapUv),M.push(_.specularColorMapUv),M.push(_.specularIntensityMapUv),M.push(_.transmissionMapUv),M.push(_.thicknessMapUv),M.push(_.combine),M.push(_.fogExp2),M.push(_.sizeAttenuation),M.push(_.morphTargetsCount),M.push(_.morphAttributeCount),M.push(_.numDirLights),M.push(_.numPointLights),M.push(_.numSpotLights),M.push(_.numSpotLightMaps),M.push(_.numHemiLights),M.push(_.numRectAreaLights),M.push(_.numDirLightShadows),M.push(_.numPointLightShadows),M.push(_.numSpotLightShadows),M.push(_.numSpotLightShadowsWithMaps),M.push(_.numLightProbes),M.push(_.shadowMapType),M.push(_.toneMapping),M.push(_.numClippingPlanes),M.push(_.numClipIntersection),M.push(_.depthPacking)}function b(M,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),_.gradientMap&&a.enable(22),M.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reversedDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),M.push(a.mask)}function v(M){let _=m[M.type],P;if(_){let N=Dn[_];P=Kh.clone(N.uniforms)}else P=M.uniforms;return P}function E(M,_){let P;for(let N=0,B=h.length;N<B;N++){let F=h[N];if(F.cacheKey===_){P=F,++P.usedTimes;break}}return P===void 0&&(P=new ig(s,_,M,r),h.push(P)),P}function A(M){if(--M.usedTimes===0){let _=h.indexOf(M);h[_]=h[h.length-1],h.pop(),M.destroy()}}function w(M){c.remove(M)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:E,releaseProgram:A,releaseShaderCache:w,programs:h,dispose:R}}function og(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,c){s.get(o)[a]=c}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function ag(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function vu(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function bu(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,m,y,g){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:y,group:g},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=y,p.group=g),t++,p}function a(u,d,f,m,y,g){let p=o(u,d,f,m,y,g);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function c(u,d,f,m,y,g){let p=o(u,d,f,m,y,g);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||ag),n.length>1&&n.sort(d||vu),i.length>1&&i.sort(d||vu)}function h(){for(let u=t,d=s.length;u<d;u++){let f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:h,sort:l}}function lg(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new bu,s.set(n,[o])):i>=r.length?(o=new bu,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function cg(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new At};break;case"SpotLight":e={position:new D,direction:new D,color:new At,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new At,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new At,groundColor:new At};break;case"RectAreaLight":e={color:new At,position:new D,halfWidth:new D,halfHeight:new D};break}return s[t.id]=e,e}}}function hg(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var ug=0;function dg(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function fg(s){let t=new cg,e=hg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);let i=new D,r=new Vt,o=new Vt;function a(l){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,m=0,y=0,g=0,p=0,x=0,b=0,v=0,E=0,A=0,w=0;l.sort(dg);for(let M=0,_=l.length;M<_;M++){let P=l[M],N=P.color,B=P.intensity,F=P.distance,z=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=N.r*B,u+=N.g*B,d+=N.b*B;else if(P.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(P.sh.coefficients[q],B);w++}else if(P.isDirectionalLight){let q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let et=P.shadow,$=e.get(P);$.shadowIntensity=et.intensity,$.shadowBias=et.bias,$.shadowNormalBias=et.normalBias,$.shadowRadius=et.radius,$.shadowMapSize=et.mapSize,n.directionalShadow[f]=$,n.directionalShadowMap[f]=z,n.directionalShadowMatrix[f]=P.shadow.matrix,x++}n.directional[f]=q,f++}else if(P.isSpotLight){let q=t.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(N).multiplyScalar(B),q.distance=F,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,n.spot[y]=q;let et=P.shadow;if(P.map&&(n.spotLightMap[E]=P.map,E++,et.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[y]=et.matrix,P.castShadow){let $=e.get(P);$.shadowIntensity=et.intensity,$.shadowBias=et.bias,$.shadowNormalBias=et.normalBias,$.shadowRadius=et.radius,$.shadowMapSize=et.mapSize,n.spotShadow[y]=$,n.spotShadowMap[y]=z,v++}y++}else if(P.isRectAreaLight){let q=t.get(P);q.color.copy(N).multiplyScalar(B),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=q,g++}else if(P.isPointLight){let q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){let et=P.shadow,$=e.get(P);$.shadowIntensity=et.intensity,$.shadowBias=et.bias,$.shadowNormalBias=et.normalBias,$.shadowRadius=et.radius,$.shadowMapSize=et.mapSize,$.shadowCameraNear=et.camera.near,$.shadowCameraFar=et.camera.far,n.pointShadow[m]=$,n.pointShadowMap[m]=z,n.pointShadowMatrix[m]=P.shadow.matrix,b++}n.point[m]=q,m++}else if(P.isHemisphereLight){let q=t.get(P);q.skyColor.copy(P.color).multiplyScalar(B),q.groundColor.copy(P.groundColor).multiplyScalar(B),n.hemi[p]=q,p++}}g>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=dt.LTC_FLOAT_1,n.rectAreaLTC2=dt.LTC_FLOAT_2):(n.rectAreaLTC1=dt.LTC_HALF_1,n.rectAreaLTC2=dt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let R=n.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==y||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==x||R.numPointShadows!==b||R.numSpotShadows!==v||R.numSpotMaps!==E||R.numLightProbes!==w)&&(n.directional.length=f,n.spot.length=y,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=v+E-A,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=w,R.directionalLength=f,R.pointLength=m,R.spotLength=y,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=x,R.numPointShadows=b,R.numSpotShadows=v,R.numSpotMaps=E,R.numLightProbes=w,n.version=ug++)}function c(l,h){let u=0,d=0,f=0,m=0,y=0,g=h.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){let b=l[p];if(b.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(g),u++}else if(b.isSpotLight){let v=n.spot[f];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(g),f++}else if(b.isRectAreaLight){let v=n.rectArea[m];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(g),o.identity(),r.copy(b.matrixWorld),r.premultiply(g),o.extractRotation(r),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),m++}else if(b.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(g),d++}else if(b.isHemisphereLight){let v=n.hemi[y];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(g),y++}}}return{setup:a,setupView:c,state:n}}function _u(s){let t=new fg(s),e=[],n=[];function i(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function pg(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new _u(s),t.set(i,[a])):r>=o.length?(a=new _u(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var mg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gg=`uniform sampler2D shadow_pass;
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
}`;function yg(s,t,e){let n=new hs,i=new Gt,r=new Gt,o=new Se,a=new go({depthPacking:Bh}),c=new yo,l={},h=e.maxTextureSize,u={[Gn]:ke,[ke]:Gn,[be]:be},d=new an({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:mg,fragmentShader:gg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new ce;m.setAttribute("position",new oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Z(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Pl;let p=this.type;this.render=function(A,w,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;let M=s.getRenderTarget(),_=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),N=s.state;N.setBlending($n),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let B=p!==In&&this.type===In,F=p===In&&this.type!==In;for(let z=0,q=A.length;z<q;z++){let et=A[z],$=et.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;i.copy($.mapSize);let ut=$.getFrameExtents();if(i.multiply(ut),r.copy($.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ut.x),i.x=r.x*ut.x,$.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ut.y),i.y=r.y*ut.y,$.mapSize.y=r.y)),$.map===null||B===!0||F===!0){let nt=this.type!==In?{minFilter:Ze,magFilter:Ze}:{};$.map!==null&&$.map.dispose(),$.map=new En(i.x,i.y,nt),$.map.texture.name=et.name+".shadowMap",$.camera.updateProjectionMatrix()}s.setRenderTarget($.map),s.clear();let X=$.getViewportCount();for(let nt=0;nt<X;nt++){let Et=$.getViewport(nt);o.set(r.x*Et.x,r.y*Et.y,r.x*Et.z,r.y*Et.w),N.viewport(o),$.updateMatrices(et,nt),n=$.getFrustum(),v(w,R,$.camera,et,this.type)}$.isPointLightShadow!==!0&&this.type===In&&x($,R),$.needsUpdate=!1}p=this.type,g.needsUpdate=!1,s.setRenderTarget(M,_,P)};function x(A,w){let R=t.update(y);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new En(i.x,i.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(w,null,R,d,y,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(w,null,R,f,y,null)}function b(A,w,R,M){let _=null,P=R.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)_=P;else if(_=R.isPointLight===!0?c:a,s.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let N=_.uuid,B=w.uuid,F=l[N];F===void 0&&(F={},l[N]=F);let z=F[B];z===void 0&&(z=_.clone(),F[B]=z,w.addEventListener("dispose",E)),_=z}if(_.visible=w.visible,_.wireframe=w.wireframe,M===In?_.side=w.shadowSide!==null?w.shadowSide:w.side:_.side=w.shadowSide!==null?w.shadowSide:u[w.side],_.alphaMap=w.alphaMap,_.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,_.map=w.map,_.clipShadows=w.clipShadows,_.clippingPlanes=w.clippingPlanes,_.clipIntersection=w.clipIntersection,_.displacementMap=w.displacementMap,_.displacementScale=w.displacementScale,_.displacementBias=w.displacementBias,_.wireframeLinewidth=w.wireframeLinewidth,_.linewidth=w.linewidth,R.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let N=s.properties.get(_);N.light=R}return _}function v(A,w,R,M,_){if(A.visible===!1)return;if(A.layers.test(w.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&_===In)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,A.matrixWorld);let B=t.update(A),F=A.material;if(Array.isArray(F)){let z=B.groups;for(let q=0,et=z.length;q<et;q++){let $=z[q],ut=F[$.materialIndex];if(ut&&ut.visible){let X=b(A,ut,M,_);A.onBeforeShadow(s,A,w,R,B,X,$),s.renderBufferDirect(R,null,B,X,A,$),A.onAfterShadow(s,A,w,R,B,X,$)}}}else if(F.visible){let z=b(A,F,M,_);A.onBeforeShadow(s,A,w,R,B,z,null),s.renderBufferDirect(R,null,B,z,A,null),A.onAfterShadow(s,A,w,R,B,z,null)}}let N=A.children;for(let B=0,F=N.length;B<F;B++)v(N[B],w,R,M,_)}function E(A){A.target.removeEventListener("dispose",E);for(let R in l){let M=l[R],_=A.target.uuid;_ in M&&(M[_].dispose(),delete M[_])}}}var xg={[Co]:Po,[Io]:Uo,[Lo]:No,[Mi]:Do,[Po]:Co,[Uo]:Io,[No]:Lo,[Do]:Mi};function vg(s,t){function e(){let U=!1,it=new Se,ht=null,xt=new Se(0,0,0,0);return{setMask:function(st){ht!==st&&!U&&(s.colorMask(st,st,st,st),ht=st)},setLocked:function(st){U=st},setClear:function(st,K,Tt,Dt,ae){ae===!0&&(st*=Dt,K*=Dt,Tt*=Dt),it.set(st,K,Tt,Dt),xt.equals(it)===!1&&(s.clearColor(st,K,Tt,Dt),xt.copy(it))},reset:function(){U=!1,ht=null,xt.set(-1,0,0,0)}}}function n(){let U=!1,it=!1,ht=null,xt=null,st=null;return{setReversed:function(K){if(it!==K){let Tt=t.get("EXT_clip_control");K?Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.ZERO_TO_ONE_EXT):Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.NEGATIVE_ONE_TO_ONE_EXT),it=K;let Dt=st;st=null,this.setClear(Dt)}},getReversed:function(){return it},setTest:function(K){K?tt(s.DEPTH_TEST):St(s.DEPTH_TEST)},setMask:function(K){ht!==K&&!U&&(s.depthMask(K),ht=K)},setFunc:function(K){if(it&&(K=xg[K]),xt!==K){switch(K){case Co:s.depthFunc(s.NEVER);break;case Po:s.depthFunc(s.ALWAYS);break;case Io:s.depthFunc(s.LESS);break;case Mi:s.depthFunc(s.LEQUAL);break;case Lo:s.depthFunc(s.EQUAL);break;case Do:s.depthFunc(s.GEQUAL);break;case Uo:s.depthFunc(s.GREATER);break;case No:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xt=K}},setLocked:function(K){U=K},setClear:function(K){st!==K&&(it&&(K=1-K),s.clearDepth(K),st=K)},reset:function(){U=!1,ht=null,xt=null,st=null,it=!1}}}function i(){let U=!1,it=null,ht=null,xt=null,st=null,K=null,Tt=null,Dt=null,ae=null;return{setTest:function(le){U||(le?tt(s.STENCIL_TEST):St(s.STENCIL_TEST))},setMask:function(le){it!==le&&!U&&(s.stencilMask(le),it=le)},setFunc:function(le,Nn,wn){(ht!==le||xt!==Nn||st!==wn)&&(s.stencilFunc(le,Nn,wn),ht=le,xt=Nn,st=wn)},setOp:function(le,Nn,wn){(K!==le||Tt!==Nn||Dt!==wn)&&(s.stencilOp(le,Nn,wn),K=le,Tt=Nn,Dt=wn)},setLocked:function(le){U=le},setClear:function(le){ae!==le&&(s.clearStencil(le),ae=le)},reset:function(){U=!1,it=null,ht=null,xt=null,st=null,K=null,Tt=null,Dt=null,ae=null}}}let r=new e,o=new n,a=new i,c=new WeakMap,l=new WeakMap,h={},u={},d=new WeakMap,f=[],m=null,y=!1,g=null,p=null,x=null,b=null,v=null,E=null,A=null,w=new At(0,0,0),R=0,M=!1,_=null,P=null,N=null,B=null,F=null,z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,et=0,$=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec($)[1]),q=et>=1):$.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),q=et>=2);let ut=null,X={},nt=s.getParameter(s.SCISSOR_BOX),Et=s.getParameter(s.VIEWPORT),Yt=new Se().fromArray(nt),Zt=new Se().fromArray(Et);function te(U,it,ht,xt){let st=new Uint8Array(4),K=s.createTexture();s.bindTexture(U,K),s.texParameteri(U,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(U,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Tt=0;Tt<ht;Tt++)U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY?s.texImage3D(it,0,s.RGBA,1,1,xt,0,s.RGBA,s.UNSIGNED_BYTE,st):s.texImage2D(it+Tt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,st);return K}let J={};J[s.TEXTURE_2D]=te(s.TEXTURE_2D,s.TEXTURE_2D,1),J[s.TEXTURE_CUBE_MAP]=te(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[s.TEXTURE_2D_ARRAY]=te(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),J[s.TEXTURE_3D]=te(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),tt(s.DEPTH_TEST),o.setFunc(Mi),Pt(!1),gt(Cl),tt(s.CULL_FACE),ee($n);function tt(U){h[U]!==!0&&(s.enable(U),h[U]=!0)}function St(U){h[U]!==!1&&(s.disable(U),h[U]=!1)}function Ft(U,it){return u[U]!==it?(s.bindFramebuffer(U,it),u[U]=it,U===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=it),U===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=it),!0):!1}function bt(U,it){let ht=f,xt=!1;if(U){ht=d.get(it),ht===void 0&&(ht=[],d.set(it,ht));let st=U.textures;if(ht.length!==st.length||ht[0]!==s.COLOR_ATTACHMENT0){for(let K=0,Tt=st.length;K<Tt;K++)ht[K]=s.COLOR_ATTACHMENT0+K;ht.length=st.length,xt=!0}}else ht[0]!==s.BACK&&(ht[0]=s.BACK,xt=!0);xt&&s.drawBuffers(ht)}function Jt(U){return m!==U?(s.useProgram(U),m=U,!0):!1}let Ae={[ii]:s.FUNC_ADD,[dh]:s.FUNC_SUBTRACT,[fh]:s.FUNC_REVERSE_SUBTRACT};Ae[ph]=s.MIN,Ae[mh]=s.MAX;let I={[gh]:s.ZERO,[yh]:s.ONE,[xh]:s.SRC_COLOR,[no]:s.SRC_ALPHA,[Sh]:s.SRC_ALPHA_SATURATE,[Mh]:s.DST_COLOR,[bh]:s.DST_ALPHA,[vh]:s.ONE_MINUS_SRC_COLOR,[io]:s.ONE_MINUS_SRC_ALPHA,[wh]:s.ONE_MINUS_DST_COLOR,[_h]:s.ONE_MINUS_DST_ALPHA,[Eh]:s.CONSTANT_COLOR,[Th]:s.ONE_MINUS_CONSTANT_COLOR,[Ah]:s.CONSTANT_ALPHA,[Rh]:s.ONE_MINUS_CONSTANT_ALPHA};function ee(U,it,ht,xt,st,K,Tt,Dt,ae,le){if(U===$n){y===!0&&(St(s.BLEND),y=!1);return}if(y===!1&&(tt(s.BLEND),y=!0),U!==uh){if(U!==g||le!==M){if((p!==ii||v!==ii)&&(s.blendEquation(s.FUNC_ADD),p=ii,v=ii),le)switch(U){case _i:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Il:s.blendFunc(s.ONE,s.ONE);break;case Ll:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Dl:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case _i:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Il:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Ll:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Dl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}x=null,b=null,E=null,A=null,w.set(0,0,0),R=0,g=U,M=le}return}st=st||it,K=K||ht,Tt=Tt||xt,(it!==p||st!==v)&&(s.blendEquationSeparate(Ae[it],Ae[st]),p=it,v=st),(ht!==x||xt!==b||K!==E||Tt!==A)&&(s.blendFuncSeparate(I[ht],I[xt],I[K],I[Tt]),x=ht,b=xt,E=K,A=Tt),(Dt.equals(w)===!1||ae!==R)&&(s.blendColor(Dt.r,Dt.g,Dt.b,ae),w.copy(Dt),R=ae),g=U,M=!1}function It(U,it){U.side===be?St(s.CULL_FACE):tt(s.CULL_FACE);let ht=U.side===ke;it&&(ht=!ht),Pt(ht),U.blending===_i&&U.transparent===!1?ee($n):ee(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let xt=U.stencilWrite;a.setTest(xt),xt&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Mt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?tt(s.SAMPLE_ALPHA_TO_COVERAGE):St(s.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(U){_!==U&&(U?s.frontFace(s.CW):s.frontFace(s.CCW),_=U)}function gt(U){U!==ch?(tt(s.CULL_FACE),U!==P&&(U===Cl?s.cullFace(s.BACK):U===hh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):St(s.CULL_FACE),P=U}function Kt(U){U!==N&&(q&&s.lineWidth(U),N=U)}function Mt(U,it,ht){U?(tt(s.POLYGON_OFFSET_FILL),(B!==it||F!==ht)&&(s.polygonOffset(it,ht),B=it,F=ht)):St(s.POLYGON_OFFSET_FILL)}function Ht(U){U?tt(s.SCISSOR_TEST):St(s.SCISSOR_TEST)}function ve(U){U===void 0&&(U=s.TEXTURE0+z-1),ut!==U&&(s.activeTexture(U),ut=U)}function pe(U,it,ht){ht===void 0&&(ut===null?ht=s.TEXTURE0+z-1:ht=ut);let xt=X[ht];xt===void 0&&(xt={type:void 0,texture:void 0},X[ht]=xt),(xt.type!==U||xt.texture!==it)&&(ut!==ht&&(s.activeTexture(ht),ut=ht),s.bindTexture(U,it||J[U]),xt.type=U,xt.texture=it)}function C(){let U=X[ut];U!==void 0&&U.type!==void 0&&(s.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function S(){try{s.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function H(){try{s.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Y(){try{s.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{s.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ct(){try{s.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function rt(){try{s.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function yt(){try{s.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function vt(){try{s.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{s.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function lt(U){Yt.equals(U)===!1&&(s.scissor(U.x,U.y,U.z,U.w),Yt.copy(U))}function Ct(U){Zt.equals(U)===!1&&(s.viewport(U.x,U.y,U.z,U.w),Zt.copy(U))}function _t(U,it){let ht=l.get(it);ht===void 0&&(ht=new WeakMap,l.set(it,ht));let xt=ht.get(U);xt===void 0&&(xt=s.getUniformBlockIndex(it,U.name),ht.set(U,xt))}function at(U,it){let xt=l.get(it).get(U);c.get(it)!==xt&&(s.uniformBlockBinding(it,xt,U.__bindingPointIndex),c.set(it,xt))}function Ot(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},ut=null,X={},u={},d=new WeakMap,f=[],m=null,y=!1,g=null,p=null,x=null,b=null,v=null,E=null,A=null,w=new At(0,0,0),R=0,M=!1,_=null,P=null,N=null,B=null,F=null,Yt.set(0,0,s.canvas.width,s.canvas.height),Zt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:tt,disable:St,bindFramebuffer:Ft,drawBuffers:bt,useProgram:Jt,setBlending:ee,setMaterial:It,setFlipSided:Pt,setCullFace:gt,setLineWidth:Kt,setPolygonOffset:Mt,setScissorTest:Ht,activeTexture:ve,bindTexture:pe,unbindTexture:C,compressedTexImage2D:S,compressedTexImage3D:H,texImage2D:vt,texImage3D:Q,updateUBOMapping:_t,uniformBlockBinding:at,texStorage2D:rt,texStorage3D:yt,texSubImage2D:Y,texSubImage3D:j,compressedTexSubImage2D:G,compressedTexSubImage3D:ct,scissor:lt,viewport:Ct,reset:Ot}}function bg(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Gt,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,S){return f?new OffscreenCanvas(C,S):zs("canvas")}function y(C,S,H){let Y=1,j=pe(C);if((j.width>H||j.height>H)&&(Y=H/Math.max(j.width,j.height)),Y<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let G=Math.floor(Y*j.width),ct=Math.floor(Y*j.height);u===void 0&&(u=m(G,ct));let rt=S?m(G,ct):u;return rt.width=G,rt.height=ct,rt.getContext("2d").drawImage(C,0,0,G,ct),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+G+"x"+ct+")."),rt}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),C;return C}function g(C){return C.generateMipmaps}function p(C){s.generateMipmap(C)}function x(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function b(C,S,H,Y,j=!1){if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let G=S;if(S===s.RED&&(H===s.FLOAT&&(G=s.R32F),H===s.HALF_FLOAT&&(G=s.R16F),H===s.UNSIGNED_BYTE&&(G=s.R8)),S===s.RED_INTEGER&&(H===s.UNSIGNED_BYTE&&(G=s.R8UI),H===s.UNSIGNED_SHORT&&(G=s.R16UI),H===s.UNSIGNED_INT&&(G=s.R32UI),H===s.BYTE&&(G=s.R8I),H===s.SHORT&&(G=s.R16I),H===s.INT&&(G=s.R32I)),S===s.RG&&(H===s.FLOAT&&(G=s.RG32F),H===s.HALF_FLOAT&&(G=s.RG16F),H===s.UNSIGNED_BYTE&&(G=s.RG8)),S===s.RG_INTEGER&&(H===s.UNSIGNED_BYTE&&(G=s.RG8UI),H===s.UNSIGNED_SHORT&&(G=s.RG16UI),H===s.UNSIGNED_INT&&(G=s.RG32UI),H===s.BYTE&&(G=s.RG8I),H===s.SHORT&&(G=s.RG16I),H===s.INT&&(G=s.RG32I)),S===s.RGB_INTEGER&&(H===s.UNSIGNED_BYTE&&(G=s.RGB8UI),H===s.UNSIGNED_SHORT&&(G=s.RGB16UI),H===s.UNSIGNED_INT&&(G=s.RGB32UI),H===s.BYTE&&(G=s.RGB8I),H===s.SHORT&&(G=s.RGB16I),H===s.INT&&(G=s.RGB32I)),S===s.RGBA_INTEGER&&(H===s.UNSIGNED_BYTE&&(G=s.RGBA8UI),H===s.UNSIGNED_SHORT&&(G=s.RGBA16UI),H===s.UNSIGNED_INT&&(G=s.RGBA32UI),H===s.BYTE&&(G=s.RGBA8I),H===s.SHORT&&(G=s.RGBA16I),H===s.INT&&(G=s.RGBA32I)),S===s.RGB&&(H===s.UNSIGNED_INT_5_9_9_9_REV&&(G=s.RGB9_E5),H===s.UNSIGNED_INT_10F_11F_11F_REV&&(G=s.R11F_G11F_B10F)),S===s.RGBA){let ct=j?Bs:ie.getTransfer(Y);H===s.FLOAT&&(G=s.RGBA32F),H===s.HALF_FLOAT&&(G=s.RGBA16F),H===s.UNSIGNED_BYTE&&(G=ct===he?s.SRGB8_ALPHA8:s.RGBA8),H===s.UNSIGNED_SHORT_4_4_4_4&&(G=s.RGBA4),H===s.UNSIGNED_SHORT_5_5_5_1&&(G=s.RGB5_A1)}return(G===s.R16F||G===s.R32F||G===s.RG16F||G===s.RG32F||G===s.RGBA16F||G===s.RGBA32F)&&t.get("EXT_color_buffer_float"),G}function v(C,S){let H;return C?S===null||S===ci||S===ps?H=s.DEPTH24_STENCIL8:S===_n?H=s.DEPTH32F_STENCIL8:S===ds&&(H=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ci||S===ps?H=s.DEPTH_COMPONENT24:S===_n?H=s.DEPTH_COMPONENT32F:S===ds&&(H=s.DEPTH_COMPONENT16),H}function E(C,S){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ze&&C.minFilter!==rn?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function A(C){let S=C.target;S.removeEventListener("dispose",A),R(S),S.isVideoTexture&&h.delete(S)}function w(C){let S=C.target;S.removeEventListener("dispose",w),_(S)}function R(C){let S=n.get(C);if(S.__webglInit===void 0)return;let H=C.source,Y=d.get(H);if(Y){let j=Y[S.__cacheKey];j.usedTimes--,j.usedTimes===0&&M(C),Object.keys(Y).length===0&&d.delete(H)}n.remove(C)}function M(C){let S=n.get(C);s.deleteTexture(S.__webglTexture);let H=C.source,Y=d.get(H);delete Y[S.__cacheKey],o.memory.textures--}function _(C){let S=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(S.__webglFramebuffer[Y]))for(let j=0;j<S.__webglFramebuffer[Y].length;j++)s.deleteFramebuffer(S.__webglFramebuffer[Y][j]);else s.deleteFramebuffer(S.__webglFramebuffer[Y]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[Y])}else{if(Array.isArray(S.__webglFramebuffer))for(let Y=0;Y<S.__webglFramebuffer.length;Y++)s.deleteFramebuffer(S.__webglFramebuffer[Y]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Y=0;Y<S.__webglColorRenderbuffer.length;Y++)S.__webglColorRenderbuffer[Y]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[Y]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let H=C.textures;for(let Y=0,j=H.length;Y<j;Y++){let G=n.get(H[Y]);G.__webglTexture&&(s.deleteTexture(G.__webglTexture),o.memory.textures--),n.remove(H[Y])}n.remove(C)}let P=0;function N(){P=0}function B(){let C=P;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),P+=1,C}function F(C){let S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function z(C,S){let H=n.get(C);if(C.isVideoTexture&&Ht(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&H.__version!==C.version){let Y=C.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(H,C,S);return}}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,H.__webglTexture,s.TEXTURE0+S)}function q(C,S){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){J(H,C,S);return}e.bindTexture(s.TEXTURE_2D_ARRAY,H.__webglTexture,s.TEXTURE0+S)}function et(C,S){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){J(H,C,S);return}e.bindTexture(s.TEXTURE_3D,H.__webglTexture,s.TEXTURE0+S)}function $(C,S){let H=n.get(C);if(C.version>0&&H.__version!==C.version){tt(H,C,S);return}e.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture,s.TEXTURE0+S)}let ut={[fn]:s.REPEAT,[ni]:s.CLAMP_TO_EDGE,[so]:s.MIRRORED_REPEAT},X={[Ze]:s.NEAREST,[kh]:s.NEAREST_MIPMAP_NEAREST,[cr]:s.NEAREST_MIPMAP_LINEAR,[rn]:s.LINEAR,[Bo]:s.LINEAR_MIPMAP_NEAREST,[Ln]:s.LINEAR_MIPMAP_LINEAR},nt={[zh]:s.NEVER,[qh]:s.ALWAYS,[Gh]:s.LESS,[Wl]:s.LEQUAL,[Vh]:s.EQUAL,[$h]:s.GEQUAL,[Wh]:s.GREATER,[Xh]:s.NOTEQUAL};function Et(C,S){if(S.type===_n&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===rn||S.magFilter===Bo||S.magFilter===cr||S.magFilter===Ln||S.minFilter===rn||S.minFilter===Bo||S.minFilter===cr||S.minFilter===Ln)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,ut[S.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,ut[S.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,ut[S.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,X[S.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,X[S.minFilter]),S.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,nt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Ze||S.minFilter!==cr&&S.minFilter!==Ln||S.type===_n&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");s.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function Yt(C,S){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",A));let Y=S.source,j=d.get(Y);j===void 0&&(j={},d.set(Y,j));let G=F(S);if(G!==C.__cacheKey){j[G]===void 0&&(j[G]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,H=!0),j[G].usedTimes++;let ct=j[C.__cacheKey];ct!==void 0&&(j[C.__cacheKey].usedTimes--,ct.usedTimes===0&&M(S)),C.__cacheKey=G,C.__webglTexture=j[G].texture}return H}function Zt(C,S,H){return Math.floor(Math.floor(C/H)/S)}function te(C,S,H,Y){let G=C.updateRanges;if(G.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,S.width,S.height,H,Y,S.data);else{G.sort((Q,lt)=>Q.start-lt.start);let ct=0;for(let Q=1;Q<G.length;Q++){let lt=G[ct],Ct=G[Q],_t=lt.start+lt.count,at=Zt(Ct.start,S.width,4),Ot=Zt(lt.start,S.width,4);Ct.start<=_t+1&&at===Ot&&Zt(Ct.start+Ct.count-1,S.width,4)===at?lt.count=Math.max(lt.count,Ct.start+Ct.count-lt.start):(++ct,G[ct]=Ct)}G.length=ct+1;let rt=s.getParameter(s.UNPACK_ROW_LENGTH),yt=s.getParameter(s.UNPACK_SKIP_PIXELS),vt=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,S.width);for(let Q=0,lt=G.length;Q<lt;Q++){let Ct=G[Q],_t=Math.floor(Ct.start/4),at=Math.ceil(Ct.count/4),Ot=_t%S.width,U=Math.floor(_t/S.width),it=at,ht=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ot),s.pixelStorei(s.UNPACK_SKIP_ROWS,U),e.texSubImage2D(s.TEXTURE_2D,0,Ot,U,it,ht,H,Y,S.data)}C.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,rt),s.pixelStorei(s.UNPACK_SKIP_PIXELS,yt),s.pixelStorei(s.UNPACK_SKIP_ROWS,vt)}}function J(C,S,H){let Y=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Y=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Y=s.TEXTURE_3D);let j=Yt(C,S),G=S.source;e.bindTexture(Y,C.__webglTexture,s.TEXTURE0+H);let ct=n.get(G);if(G.version!==ct.__version||j===!0){e.activeTexture(s.TEXTURE0+H);let rt=ie.getPrimaries(ie.workingColorSpace),yt=S.colorSpace===mn?null:ie.getPrimaries(S.colorSpace),vt=S.colorSpace===mn||rt===yt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let Q=y(S.image,!1,i.maxTextureSize);Q=ve(S,Q);let lt=r.convert(S.format,S.colorSpace),Ct=r.convert(S.type),_t=b(S.internalFormat,lt,Ct,S.colorSpace,S.isVideoTexture);Et(Y,S);let at,Ot=S.mipmaps,U=S.isVideoTexture!==!0,it=ct.__version===void 0||j===!0,ht=G.dataReady,xt=E(S,Q);if(S.isDepthTexture)_t=v(S.format===ms,S.type),it&&(U?e.texStorage2D(s.TEXTURE_2D,1,_t,Q.width,Q.height):e.texImage2D(s.TEXTURE_2D,0,_t,Q.width,Q.height,0,lt,Ct,null));else if(S.isDataTexture)if(Ot.length>0){U&&it&&e.texStorage2D(s.TEXTURE_2D,xt,_t,Ot[0].width,Ot[0].height);for(let st=0,K=Ot.length;st<K;st++)at=Ot[st],U?ht&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,at.width,at.height,lt,Ct,at.data):e.texImage2D(s.TEXTURE_2D,st,_t,at.width,at.height,0,lt,Ct,at.data);S.generateMipmaps=!1}else U?(it&&e.texStorage2D(s.TEXTURE_2D,xt,_t,Q.width,Q.height),ht&&te(S,Q,lt,Ct)):e.texImage2D(s.TEXTURE_2D,0,_t,Q.width,Q.height,0,lt,Ct,Q.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){U&&it&&e.texStorage3D(s.TEXTURE_2D_ARRAY,xt,_t,Ot[0].width,Ot[0].height,Q.depth);for(let st=0,K=Ot.length;st<K;st++)if(at=Ot[st],S.format!==pn)if(lt!==null)if(U){if(ht)if(S.layerUpdates.size>0){let Tt=Jl(at.width,at.height,S.format,S.type);for(let Dt of S.layerUpdates){let ae=at.data.subarray(Dt*Tt/at.data.BYTES_PER_ELEMENT,(Dt+1)*Tt/at.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,Dt,at.width,at.height,1,lt,ae)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,0,at.width,at.height,Q.depth,lt,at.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,st,_t,at.width,at.height,Q.depth,0,at.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ht&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,0,at.width,at.height,Q.depth,lt,Ct,at.data):e.texImage3D(s.TEXTURE_2D_ARRAY,st,_t,at.width,at.height,Q.depth,0,lt,Ct,at.data)}else{U&&it&&e.texStorage2D(s.TEXTURE_2D,xt,_t,Ot[0].width,Ot[0].height);for(let st=0,K=Ot.length;st<K;st++)at=Ot[st],S.format!==pn?lt!==null?U?ht&&e.compressedTexSubImage2D(s.TEXTURE_2D,st,0,0,at.width,at.height,lt,at.data):e.compressedTexImage2D(s.TEXTURE_2D,st,_t,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ht&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,at.width,at.height,lt,Ct,at.data):e.texImage2D(s.TEXTURE_2D,st,_t,at.width,at.height,0,lt,Ct,at.data)}else if(S.isDataArrayTexture)if(U){if(it&&e.texStorage3D(s.TEXTURE_2D_ARRAY,xt,_t,Q.width,Q.height,Q.depth),ht)if(S.layerUpdates.size>0){let st=Jl(Q.width,Q.height,S.format,S.type);for(let K of S.layerUpdates){let Tt=Q.data.subarray(K*st/Q.data.BYTES_PER_ELEMENT,(K+1)*st/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,K,Q.width,Q.height,1,lt,Ct,Tt)}S.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,lt,Ct,Q.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,_t,Q.width,Q.height,Q.depth,0,lt,Ct,Q.data);else if(S.isData3DTexture)U?(it&&e.texStorage3D(s.TEXTURE_3D,xt,_t,Q.width,Q.height,Q.depth),ht&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,lt,Ct,Q.data)):e.texImage3D(s.TEXTURE_3D,0,_t,Q.width,Q.height,Q.depth,0,lt,Ct,Q.data);else if(S.isFramebufferTexture){if(it)if(U)e.texStorage2D(s.TEXTURE_2D,xt,_t,Q.width,Q.height);else{let st=Q.width,K=Q.height;for(let Tt=0;Tt<xt;Tt++)e.texImage2D(s.TEXTURE_2D,Tt,_t,st,K,0,lt,Ct,null),st>>=1,K>>=1}}else if(Ot.length>0){if(U&&it){let st=pe(Ot[0]);e.texStorage2D(s.TEXTURE_2D,xt,_t,st.width,st.height)}for(let st=0,K=Ot.length;st<K;st++)at=Ot[st],U?ht&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,lt,Ct,at):e.texImage2D(s.TEXTURE_2D,st,_t,lt,Ct,at);S.generateMipmaps=!1}else if(U){if(it){let st=pe(Q);e.texStorage2D(s.TEXTURE_2D,xt,_t,st.width,st.height)}ht&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,lt,Ct,Q)}else e.texImage2D(s.TEXTURE_2D,0,_t,lt,Ct,Q);g(S)&&p(Y),ct.__version=G.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function tt(C,S,H){if(S.image.length!==6)return;let Y=Yt(C,S),j=S.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+H);let G=n.get(j);if(j.version!==G.__version||Y===!0){e.activeTexture(s.TEXTURE0+H);let ct=ie.getPrimaries(ie.workingColorSpace),rt=S.colorSpace===mn?null:ie.getPrimaries(S.colorSpace),yt=S.colorSpace===mn||ct===rt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);let vt=S.isCompressedTexture||S.image[0].isCompressedTexture,Q=S.image[0]&&S.image[0].isDataTexture,lt=[];for(let K=0;K<6;K++)!vt&&!Q?lt[K]=y(S.image[K],!0,i.maxCubemapSize):lt[K]=Q?S.image[K].image:S.image[K],lt[K]=ve(S,lt[K]);let Ct=lt[0],_t=r.convert(S.format,S.colorSpace),at=r.convert(S.type),Ot=b(S.internalFormat,_t,at,S.colorSpace),U=S.isVideoTexture!==!0,it=G.__version===void 0||Y===!0,ht=j.dataReady,xt=E(S,Ct);Et(s.TEXTURE_CUBE_MAP,S);let st;if(vt){U&&it&&e.texStorage2D(s.TEXTURE_CUBE_MAP,xt,Ot,Ct.width,Ct.height);for(let K=0;K<6;K++){st=lt[K].mipmaps;for(let Tt=0;Tt<st.length;Tt++){let Dt=st[Tt];S.format!==pn?_t!==null?U?ht&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,Tt,0,0,Dt.width,Dt.height,_t,Dt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,Tt,Ot,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,Tt,0,0,Dt.width,Dt.height,_t,at,Dt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,Tt,Ot,Dt.width,Dt.height,0,_t,at,Dt.data)}}}else{if(st=S.mipmaps,U&&it){st.length>0&&xt++;let K=pe(lt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,xt,Ot,K.width,K.height)}for(let K=0;K<6;K++)if(Q){U?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,lt[K].width,lt[K].height,_t,at,lt[K].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ot,lt[K].width,lt[K].height,0,_t,at,lt[K].data);for(let Tt=0;Tt<st.length;Tt++){let ae=st[Tt].image[K].image;U?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,Tt+1,0,0,ae.width,ae.height,_t,at,ae.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,Tt+1,Ot,ae.width,ae.height,0,_t,at,ae.data)}}else{U?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,_t,at,lt[K]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ot,_t,at,lt[K]);for(let Tt=0;Tt<st.length;Tt++){let Dt=st[Tt];U?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,Tt+1,0,0,_t,at,Dt.image[K]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,Tt+1,Ot,_t,at,Dt.image[K])}}}g(S)&&p(s.TEXTURE_CUBE_MAP),G.__version=j.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function St(C,S,H,Y,j,G){let ct=r.convert(H.format,H.colorSpace),rt=r.convert(H.type),yt=b(H.internalFormat,ct,rt,H.colorSpace),vt=n.get(S),Q=n.get(H);if(Q.__renderTarget=S,!vt.__hasExternalTextures){let lt=Math.max(1,S.width>>G),Ct=Math.max(1,S.height>>G);j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?e.texImage3D(j,G,yt,lt,Ct,S.depth,0,ct,rt,null):e.texImage2D(j,G,yt,lt,Ct,0,ct,rt,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),Mt(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Y,j,Q.__webglTexture,0,Kt(S)):(j===s.TEXTURE_2D||j>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Y,j,Q.__webglTexture,G),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Ft(C,S,H){if(s.bindRenderbuffer(s.RENDERBUFFER,C),S.depthBuffer){let Y=S.depthTexture,j=Y&&Y.isDepthTexture?Y.type:null,G=v(S.stencilBuffer,j),ct=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,rt=Kt(S);Mt(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,rt,G,S.width,S.height):H?s.renderbufferStorageMultisample(s.RENDERBUFFER,rt,G,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,G,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ct,s.RENDERBUFFER,C)}else{let Y=S.textures;for(let j=0;j<Y.length;j++){let G=Y[j],ct=r.convert(G.format,G.colorSpace),rt=r.convert(G.type),yt=b(G.internalFormat,ct,rt,G.colorSpace),vt=Kt(S);H&&Mt(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,vt,yt,S.width,S.height):Mt(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,vt,yt,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,yt,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function bt(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Y=n.get(S.depthTexture);Y.__renderTarget=S,(!Y.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),z(S.depthTexture,0);let j=Y.__webglTexture,G=Kt(S);if(S.depthTexture.format===is)Mt(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,j,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,j,0);else if(S.depthTexture.format===ms)Mt(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,j,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Jt(C){let S=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){let Y=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Y){let j=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Y.removeEventListener("dispose",j)};Y.addEventListener("dispose",j),S.__depthDisposeCallback=j}S.__boundDepthTexture=Y}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");let Y=C.texture.mipmaps;Y&&Y.length>0?bt(S.__webglFramebuffer[0],C):bt(S.__webglFramebuffer,C)}else if(H){S.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[Y]),S.__webglDepthbuffer[Y]===void 0)S.__webglDepthbuffer[Y]=s.createRenderbuffer(),Ft(S.__webglDepthbuffer[Y],C,!1);else{let j=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=S.__webglDepthbuffer[Y];s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,j,s.RENDERBUFFER,G)}}else{let Y=C.texture.mipmaps;if(Y&&Y.length>0?e.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=s.createRenderbuffer(),Ft(S.__webglDepthbuffer,C,!1);else{let j=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=S.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,j,s.RENDERBUFFER,G)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Ae(C,S,H){let Y=n.get(C);S!==void 0&&St(Y.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),H!==void 0&&Jt(C)}function I(C){let S=C.texture,H=n.get(C),Y=n.get(S);C.addEventListener("dispose",w);let j=C.textures,G=C.isWebGLCubeRenderTarget===!0,ct=j.length>1;if(ct||(Y.__webglTexture===void 0&&(Y.__webglTexture=s.createTexture()),Y.__version=S.version,o.memory.textures++),G){H.__webglFramebuffer=[];for(let rt=0;rt<6;rt++)if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer[rt]=[];for(let yt=0;yt<S.mipmaps.length;yt++)H.__webglFramebuffer[rt][yt]=s.createFramebuffer()}else H.__webglFramebuffer[rt]=s.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer=[];for(let rt=0;rt<S.mipmaps.length;rt++)H.__webglFramebuffer[rt]=s.createFramebuffer()}else H.__webglFramebuffer=s.createFramebuffer();if(ct)for(let rt=0,yt=j.length;rt<yt;rt++){let vt=n.get(j[rt]);vt.__webglTexture===void 0&&(vt.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&Mt(C)===!1){H.__webglMultisampledFramebuffer=s.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let rt=0;rt<j.length;rt++){let yt=j[rt];H.__webglColorRenderbuffer[rt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,H.__webglColorRenderbuffer[rt]);let vt=r.convert(yt.format,yt.colorSpace),Q=r.convert(yt.type),lt=b(yt.internalFormat,vt,Q,yt.colorSpace,C.isXRRenderTarget===!0),Ct=Kt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ct,lt,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+rt,s.RENDERBUFFER,H.__webglColorRenderbuffer[rt])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=s.createRenderbuffer(),Ft(H.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(G){e.bindTexture(s.TEXTURE_CUBE_MAP,Y.__webglTexture),Et(s.TEXTURE_CUBE_MAP,S);for(let rt=0;rt<6;rt++)if(S.mipmaps&&S.mipmaps.length>0)for(let yt=0;yt<S.mipmaps.length;yt++)St(H.__webglFramebuffer[rt][yt],C,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt);else St(H.__webglFramebuffer[rt],C,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0);g(S)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ct){for(let rt=0,yt=j.length;rt<yt;rt++){let vt=j[rt],Q=n.get(vt),lt=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(lt=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(lt,Q.__webglTexture),Et(lt,vt),St(H.__webglFramebuffer,C,vt,s.COLOR_ATTACHMENT0+rt,lt,0),g(vt)&&p(lt)}e.unbindTexture()}else{let rt=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(rt=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(rt,Y.__webglTexture),Et(rt,S),S.mipmaps&&S.mipmaps.length>0)for(let yt=0;yt<S.mipmaps.length;yt++)St(H.__webglFramebuffer[yt],C,S,s.COLOR_ATTACHMENT0,rt,yt);else St(H.__webglFramebuffer,C,S,s.COLOR_ATTACHMENT0,rt,0);g(S)&&p(rt),e.unbindTexture()}C.depthBuffer&&Jt(C)}function ee(C){let S=C.textures;for(let H=0,Y=S.length;H<Y;H++){let j=S[H];if(g(j)){let G=x(C),ct=n.get(j).__webglTexture;e.bindTexture(G,ct),p(G),e.unbindTexture()}}}let It=[],Pt=[];function gt(C){if(C.samples>0){if(Mt(C)===!1){let S=C.textures,H=C.width,Y=C.height,j=s.COLOR_BUFFER_BIT,G=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=n.get(C),rt=S.length>1;if(rt)for(let vt=0;vt<S.length;vt++)e.bindFramebuffer(s.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ct.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ct.__webglMultisampledFramebuffer);let yt=C.texture.mipmaps;yt&&yt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ct.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ct.__webglFramebuffer);for(let vt=0;vt<S.length;vt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(j|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(j|=s.STENCIL_BUFFER_BIT)),rt){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ct.__webglColorRenderbuffer[vt]);let Q=n.get(S[vt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Q,0)}s.blitFramebuffer(0,0,H,Y,0,0,H,Y,j,s.NEAREST),c===!0&&(It.length=0,Pt.length=0,It.push(s.COLOR_ATTACHMENT0+vt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(It.push(G),Pt.push(G),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Pt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,It))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),rt)for(let vt=0;vt<S.length;vt++){e.bindFramebuffer(s.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.RENDERBUFFER,ct.__webglColorRenderbuffer[vt]);let Q=n.get(S[vt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ct.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.TEXTURE_2D,Q,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ct.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){let S=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function Kt(C){return Math.min(i.maxSamples,C.samples)}function Mt(C){let S=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Ht(C){let S=o.render.frame;h.get(C)!==S&&(h.set(C,S),C.update())}function ve(C,S){let H=C.colorSpace,Y=C.format,j=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==wi&&H!==mn&&(ie.getTransfer(H)===he?(Y!==pn||j!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),S}function pe(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=N,this.setTexture2D=z,this.setTexture2DArray=q,this.setTexture3D=et,this.setTextureCube=$,this.rebindTextures=Ae,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ee,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=Jt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=Mt}function _g(s,t){function e(n,i=mn){let r,o=ie.getTransfer(i);if(n===bn)return s.UNSIGNED_BYTE;if(n===zo)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Go)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Ol)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Bl)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Fl)return s.BYTE;if(n===kl)return s.SHORT;if(n===ds)return s.UNSIGNED_SHORT;if(n===Ho)return s.INT;if(n===ci)return s.UNSIGNED_INT;if(n===_n)return s.FLOAT;if(n===fs)return s.HALF_FLOAT;if(n===Hl)return s.ALPHA;if(n===zl)return s.RGB;if(n===pn)return s.RGBA;if(n===is)return s.DEPTH_COMPONENT;if(n===ms)return s.DEPTH_STENCIL;if(n===Vo)return s.RED;if(n===Wo)return s.RED_INTEGER;if(n===Gl)return s.RG;if(n===Xo)return s.RG_INTEGER;if(n===$o)return s.RGBA_INTEGER;if(n===hr||n===ur||n===dr||n===fr)if(o===he)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===hr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===hr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ur)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===fr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===qo||n===Yo||n===Zo||n===Jo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===qo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Yo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Zo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Jo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ko||n===jo||n===Qo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ko||n===jo)return o===he?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Qo)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ta||n===ea||n===na||n===ia||n===sa||n===ra||n===oa||n===aa||n===la||n===ca||n===ha||n===ua||n===da||n===fa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ta)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ea)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===na)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ia)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===sa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ra)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===oa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===aa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===la)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ca)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ha)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ua)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===da)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===fa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===pa||n===ma||n===ga)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===pa)return o===he?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ma)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ga)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ya||n===xa||n===va||n===ba)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ya)return r.COMPRESSED_RED_RGTC1_EXT;if(n===xa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===va)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ba)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ps?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var Mg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,wg=`
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

}`,cc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new js(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new an({vertexShader:Mg,fragmentShader:wg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Z(new $e(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},hc=class extends Vn{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null,y=typeof XRWebGLBinding<"u",g=new cc,p={},x=e.getContextAttributes(),b=null,v=null,E=[],A=[],w=new Gt,R=null,M=new ze;M.viewport=new Se;let _=new ze;_.viewport=new Se;let P=[M,_],N=new Ao,B=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let tt=E[J];return tt===void 0&&(tt=new as,E[J]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(J){let tt=E[J];return tt===void 0&&(tt=new as,E[J]=tt),tt.getGripSpace()},this.getHand=function(J){let tt=E[J];return tt===void 0&&(tt=new as,E[J]=tt),tt.getHandSpace()};function z(J){let tt=A.indexOf(J.inputSource);if(tt===-1)return;let St=E[tt];St!==void 0&&(St.update(J.inputSource,J.frame,l||o),St.dispatchEvent({type:J.type,data:J.inputSource}))}function q(){i.removeEventListener("select",z),i.removeEventListener("selectstart",z),i.removeEventListener("selectend",z),i.removeEventListener("squeeze",z),i.removeEventListener("squeezestart",z),i.removeEventListener("squeezeend",z),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",et);for(let J=0;J<E.length;J++){let tt=A[J];tt!==null&&(A[J]=null,E[J].disconnect(tt))}B=null,F=null,g.reset();for(let J in p)delete p[J];t.setRenderTarget(b),f=null,d=null,u=null,i=null,v=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(b=t.getRenderTarget(),i.addEventListener("select",z),i.addEventListener("selectstart",z),i.addEventListener("selectend",z),i.addEventListener("squeeze",z),i.addEventListener("squeezestart",z),i.addEventListener("squeezeend",z),i.addEventListener("end",q),i.addEventListener("inputsourceschange",et),x.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(w),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let St=null,Ft=null,bt=null;x.depth&&(bt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,St=x.stencil?ms:is,Ft=x.stencil?ps:ci);let Jt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Jt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),v=new En(d.textureWidth,d.textureHeight,{format:pn,type:bn,depthTexture:new Ks(d.textureWidth,d.textureHeight,Ft,void 0,void 0,void 0,void 0,void 0,void 0,St),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let St={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,St),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new En(f.framebufferWidth,f.framebufferHeight,{format:pn,type:bn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),te.setContext(i),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function et(J){for(let tt=0;tt<J.removed.length;tt++){let St=J.removed[tt],Ft=A.indexOf(St);Ft>=0&&(A[Ft]=null,E[Ft].disconnect(St))}for(let tt=0;tt<J.added.length;tt++){let St=J.added[tt],Ft=A.indexOf(St);if(Ft===-1){for(let Jt=0;Jt<E.length;Jt++)if(Jt>=A.length){A.push(St),Ft=Jt;break}else if(A[Jt]===null){A[Jt]=St,Ft=Jt;break}if(Ft===-1)break}let bt=E[Ft];bt&&bt.connect(St)}}let $=new D,ut=new D;function X(J,tt,St){$.setFromMatrixPosition(tt.matrixWorld),ut.setFromMatrixPosition(St.matrixWorld);let Ft=$.distanceTo(ut),bt=tt.projectionMatrix.elements,Jt=St.projectionMatrix.elements,Ae=bt[14]/(bt[10]-1),I=bt[14]/(bt[10]+1),ee=(bt[9]+1)/bt[5],It=(bt[9]-1)/bt[5],Pt=(bt[8]-1)/bt[0],gt=(Jt[8]+1)/Jt[0],Kt=Ae*Pt,Mt=Ae*gt,Ht=Ft/(-Pt+gt),ve=Ht*-Pt;if(tt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(ve),J.translateZ(Ht),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),bt[10]===-1)J.projectionMatrix.copy(tt.projectionMatrix),J.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let pe=Ae+Ht,C=I+Ht,S=Kt-ve,H=Mt+(Ft-ve),Y=ee*I/C*pe,j=It*I/C*pe;J.projectionMatrix.makePerspective(S,H,Y,j,pe,C),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function nt(J,tt){tt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(tt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let tt=J.near,St=J.far;g.texture!==null&&(g.depthNear>0&&(tt=g.depthNear),g.depthFar>0&&(St=g.depthFar)),N.near=_.near=M.near=tt,N.far=_.far=M.far=St,(B!==N.near||F!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),B=N.near,F=N.far),N.layers.mask=J.layers.mask|6,M.layers.mask=N.layers.mask&3,_.layers.mask=N.layers.mask&5;let Ft=J.parent,bt=N.cameras;nt(N,Ft);for(let Jt=0;Jt<bt.length;Jt++)nt(bt[Jt],Ft);bt.length===2?X(N,M,_):N.projectionMatrix.copy(M.projectionMatrix),Et(J,N,Ft)};function Et(J,tt,St){St===null?J.matrix.copy(tt.matrixWorld):(J.matrix.copy(St.matrixWorld),J.matrix.invert(),J.matrix.multiply(tt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(tt.projectionMatrix),J.projectionMatrixInverse.copy(tt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=oo*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(J){c=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(J){return p[J]};let Yt=null;function Zt(J,tt){if(h=tt.getViewerPose(l||o),m=tt,h!==null){let St=h.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let Ft=!1;St.length!==N.cameras.length&&(N.cameras.length=0,Ft=!0);for(let I=0;I<St.length;I++){let ee=St[I],It=null;if(f!==null)It=f.getViewport(ee);else{let gt=u.getViewSubImage(d,ee);It=gt.viewport,I===0&&(t.setRenderTargetTextures(v,gt.colorTexture,gt.depthStencilTexture),t.setRenderTarget(v))}let Pt=P[I];Pt===void 0&&(Pt=new ze,Pt.layers.enable(I),Pt.viewport=new Se,P[I]=Pt),Pt.matrix.fromArray(ee.transform.matrix),Pt.matrix.decompose(Pt.position,Pt.quaternion,Pt.scale),Pt.projectionMatrix.fromArray(ee.projectionMatrix),Pt.projectionMatrixInverse.copy(Pt.projectionMatrix).invert(),Pt.viewport.set(It.x,It.y,It.width,It.height),I===0&&(N.matrix.copy(Pt.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Ft===!0&&N.cameras.push(Pt)}let bt=i.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&y){u=n.getBinding();let I=u.getDepthInformation(St[0]);I&&I.isValid&&I.texture&&g.init(I,i.renderState)}if(bt&&bt.includes("camera-access")&&y){t.state.unbindTexture(),u=n.getBinding();for(let I=0;I<St.length;I++){let ee=St[I].camera;if(ee){let It=p[ee];It||(It=new js,p[ee]=It);let Pt=u.getCameraImage(ee);It.sourceTexture=Pt}}}}for(let St=0;St<E.length;St++){let Ft=A[St],bt=E[St];Ft!==null&&bt!==void 0&&bt.update(Ft,tt,l||o)}Yt&&Yt(J,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),m=null}let te=new Mu;te.setAnimationLoop(Zt),this.setAnimationLoop=function(J){Yt=J},this.dispose=function(){}}},Pi=new on,Sg=new Vt;function Eg(s,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,ql(s)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function i(g,p,x,b,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),y(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,x,b):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===ke&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===ke&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let x=t.get(p),b=x.envMap,v=x.envMapRotation;b&&(g.envMap.value=b,Pi.copy(v),Pi.x*=-1,Pi.y*=-1,Pi.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Pi.y*=-1,Pi.z*=-1),g.envMapRotation.value.setFromMatrix4(Sg.makeRotationFromEuler(Pi)),g.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,x,b){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=b*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,x){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===ke&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){let x=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Tg(s,t,e,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,b){let v=b.program;n.uniformBlockBinding(x,v)}function l(x,b){let v=i[x.id];v===void 0&&(m(x),v=h(x),i[x.id]=v,x.addEventListener("dispose",g));let E=b.program;n.updateUBOMapping(x,E);let A=t.render.frame;r[x.id]!==A&&(d(x),r[x.id]=A)}function h(x){let b=u();x.__bindingPointIndex=b;let v=s.createBuffer(),E=x.__size,A=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,v),s.bufferData(s.UNIFORM_BUFFER,E,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,v),v}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){let b=i[x.id],v=x.uniforms,E=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let A=0,w=v.length;A<w;A++){let R=Array.isArray(v[A])?v[A]:[v[A]];for(let M=0,_=R.length;M<_;M++){let P=R[M];if(f(P,A,M,E)===!0){let N=P.__offset,B=Array.isArray(P.value)?P.value:[P.value],F=0;for(let z=0;z<B.length;z++){let q=B[z],et=y(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,s.bufferSubData(s.UNIFORM_BUFFER,N+F,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,F),F+=et.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,N,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,b,v,E){let A=x.value,w=b+"_"+v;if(E[w]===void 0)return typeof A=="number"||typeof A=="boolean"?E[w]=A:E[w]=A.clone(),!0;{let R=E[w];if(typeof A=="number"||typeof A=="boolean"){if(R!==A)return E[w]=A,!0}else if(R.equals(A)===!1)return R.copy(A),!0}return!1}function m(x){let b=x.uniforms,v=0,E=16;for(let w=0,R=b.length;w<R;w++){let M=Array.isArray(b[w])?b[w]:[b[w]];for(let _=0,P=M.length;_<P;_++){let N=M[_],B=Array.isArray(N.value)?N.value:[N.value];for(let F=0,z=B.length;F<z;F++){let q=B[F],et=y(q),$=v%E,ut=$%et.boundary,X=$+ut;v+=ut,X!==0&&E-X<et.storage&&(v+=E-X),N.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=v,v+=et.storage}}}let A=v%E;return A>0&&(v+=E-A),x.__size=v,x.__cache={},this}function y(x){let b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=48,b.storage=48):x.isMatrix4?(b.boundary=64,b.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),b}function g(x){let b=x.target;b.removeEventListener("dispose",g);let v=o.indexOf(b.__bindingPointIndex);o.splice(v,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function p(){for(let x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:c,update:l,dispose:p}}var Sa=class{constructor(t={}){let{canvas:e=Yh(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let m=new Uint32Array(4),y=new Int32Array(4),g=null,p=null,x=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,E=!1;this._outputColorSpace=Pe;let A=0,w=0,R=null,M=-1,_=null,P=new Se,N=new Se,B=null,F=new At(0),z=0,q=e.width,et=e.height,$=1,ut=null,X=null,nt=new Se(0,0,q,et),Et=new Se(0,0,q,et),Yt=!1,Zt=new hs,te=!1,J=!1,tt=new Vt,St=new D,Ft=new Se,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Jt=!1;function Ae(){return R===null?$:1}let I=n;function ee(T,k){return e.getContext(T,k)}try{let T={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",xt,!1),e.addEventListener("webglcontextcreationerror",st,!1),I===null){let k="webgl2";if(I=ee(k,T),I===null)throw ee(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let It,Pt,gt,Kt,Mt,Ht,ve,pe,C,S,H,Y,j,G,ct,rt,yt,vt,Q,lt,Ct,_t,at,Ot;function U(){It=new Wm(I),It.init(),_t=new _g(I,It),Pt=new km(I,It,t,_t),gt=new vg(I,It),Pt.reversedDepthBuffer&&d&&gt.buffers.depth.setReversed(!0),Kt=new qm(I),Mt=new og,Ht=new bg(I,It,gt,Mt,Pt,_t,Kt),ve=new Bm(v),pe=new Vm(v),C=new jd(I),at=new Nm(I,C),S=new Xm(I,C,Kt,at),H=new Zm(I,S,C,Kt),Q=new Ym(I,Pt,Ht),rt=new Om(Mt),Y=new rg(v,ve,pe,It,Pt,at,rt),j=new Eg(v,Mt),G=new lg,ct=new pg(It),vt=new Um(v,ve,pe,gt,H,f,c),yt=new yg(v,H,Pt),Ot=new Tg(I,Kt,Pt,gt),lt=new Fm(I,It,Kt),Ct=new $m(I,It,Kt),Kt.programs=Y.programs,v.capabilities=Pt,v.extensions=It,v.properties=Mt,v.renderLists=G,v.shadowMap=yt,v.state=gt,v.info=Kt}U();let it=new hc(v,I);this.xr=it,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let T=It.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=It.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(T){T!==void 0&&($=T,this.setSize(q,et,!1))},this.getSize=function(T){return T.set(q,et)},this.setSize=function(T,k,V=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=T,et=k,e.width=Math.floor(T*$),e.height=Math.floor(k*$),V===!0&&(e.style.width=T+"px",e.style.height=k+"px"),this.setViewport(0,0,T,k)},this.getDrawingBufferSize=function(T){return T.set(q*$,et*$).floor()},this.setDrawingBufferSize=function(T,k,V){q=T,et=k,$=V,e.width=Math.floor(T*V),e.height=Math.floor(k*V),this.setViewport(0,0,T,k)},this.getCurrentViewport=function(T){return T.copy(P)},this.getViewport=function(T){return T.copy(nt)},this.setViewport=function(T,k,V,W){T.isVector4?nt.set(T.x,T.y,T.z,T.w):nt.set(T,k,V,W),gt.viewport(P.copy(nt).multiplyScalar($).round())},this.getScissor=function(T){return T.copy(Et)},this.setScissor=function(T,k,V,W){T.isVector4?Et.set(T.x,T.y,T.z,T.w):Et.set(T,k,V,W),gt.scissor(N.copy(Et).multiplyScalar($).round())},this.getScissorTest=function(){return Yt},this.setScissorTest=function(T){gt.setScissorTest(Yt=T)},this.setOpaqueSort=function(T){ut=T},this.setTransparentSort=function(T){X=T},this.getClearColor=function(T){return T.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor(...arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha(...arguments)},this.clear=function(T=!0,k=!0,V=!0){let W=0;if(T){let O=!1;if(R!==null){let ot=R.texture.format;O=ot===$o||ot===Xo||ot===Wo}if(O){let ot=R.texture.type,ft=ot===bn||ot===ci||ot===ds||ot===ps||ot===zo||ot===Go,Rt=vt.getClearColor(),wt=vt.getClearAlpha(),Nt=Rt.r,kt=Rt.g,Lt=Rt.b;ft?(m[0]=Nt,m[1]=kt,m[2]=Lt,m[3]=wt,I.clearBufferuiv(I.COLOR,0,m)):(y[0]=Nt,y[1]=kt,y[2]=Lt,y[3]=wt,I.clearBufferiv(I.COLOR,0,y))}else W|=I.COLOR_BUFFER_BIT}k&&(W|=I.DEPTH_BUFFER_BIT),V&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",xt,!1),e.removeEventListener("webglcontextcreationerror",st,!1),vt.dispose(),G.dispose(),ct.dispose(),Mt.dispose(),ve.dispose(),pe.dispose(),H.dispose(),at.dispose(),Ot.dispose(),Y.dispose(),it.dispose(),it.removeEventListener("sessionstart",wn),it.removeEventListener("sessionend",Pc),pi.stop()};function ht(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function xt(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let T=Kt.autoReset,k=yt.enabled,V=yt.autoUpdate,W=yt.needsUpdate,O=yt.type;U(),Kt.autoReset=T,yt.enabled=k,yt.autoUpdate=V,yt.needsUpdate=W,yt.type=O}function st(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function K(T){let k=T.target;k.removeEventListener("dispose",K),Tt(k)}function Tt(T){Dt(T),Mt.remove(T)}function Dt(T){let k=Mt.get(T).programs;k!==void 0&&(k.forEach(function(V){Y.releaseProgram(V)}),T.isShaderMaterial&&Y.releaseShaderCache(T))}this.renderBufferDirect=function(T,k,V,W,O,ot){k===null&&(k=bt);let ft=O.isMesh&&O.matrixWorld.determinant()<0,Rt=ad(T,k,V,W,O);gt.setMaterial(W,ft);let wt=V.index,Nt=1;if(W.wireframe===!0){if(wt=S.getWireframeAttribute(V),wt===void 0)return;Nt=2}let kt=V.drawRange,Lt=V.attributes.position,jt=kt.start*Nt,de=(kt.start+kt.count)*Nt;ot!==null&&(jt=Math.max(jt,ot.start*Nt),de=Math.min(de,(ot.start+ot.count)*Nt)),wt!==null?(jt=Math.max(jt,0),de=Math.min(de,wt.count)):Lt!=null&&(jt=Math.max(jt,0),de=Math.min(de,Lt.count));let Te=de-jt;if(Te<0||Te===1/0)return;at.setup(O,W,Rt,V,wt);let ye,me=lt;if(wt!==null&&(ye=C.get(wt),me=Ct,me.setIndex(ye)),O.isMesh)W.wireframe===!0?(gt.setLineWidth(W.wireframeLinewidth*Ae()),me.setMode(I.LINES)):me.setMode(I.TRIANGLES);else if(O.isLine){let Ut=W.linewidth;Ut===void 0&&(Ut=1),gt.setLineWidth(Ut*Ae()),O.isLineSegments?me.setMode(I.LINES):O.isLineLoop?me.setMode(I.LINE_LOOP):me.setMode(I.LINE_STRIP)}else O.isPoints?me.setMode(I.POINTS):O.isSprite&&me.setMode(I.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ss("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),me.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(It.get("WEBGL_multi_draw"))me.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Ut=O._multiDrawStarts,Me=O._multiDrawCounts,se=O._multiDrawCount,tn=wt?C.get(wt).bytesPerElement:1,Gi=Mt.get(W).currentProgram.getUniforms();for(let en=0;en<se;en++)Gi.setValue(I,"_gl_DrawID",en),me.render(Ut[en]/tn,Me[en])}else if(O.isInstancedMesh)me.renderInstances(jt,Te,O.count);else if(V.isInstancedBufferGeometry){let Ut=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Me=Math.min(V.instanceCount,Ut);me.renderInstances(jt,Te,Me)}else me.render(jt,Te)};function ae(T,k,V){T.transparent===!0&&T.side===be&&T.forceSinglePass===!1?(T.side=ke,T.needsUpdate=!0,Ir(T,k,V),T.side=Gn,T.needsUpdate=!0,Ir(T,k,V),T.side=be):Ir(T,k,V)}this.compile=function(T,k,V=null){V===null&&(V=T),p=ct.get(V),p.init(k),b.push(p),V.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),T!==V&&T.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();let W=new Set;return T.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let ot=O.material;if(ot)if(Array.isArray(ot))for(let ft=0;ft<ot.length;ft++){let Rt=ot[ft];ae(Rt,V,O),W.add(Rt)}else ae(ot,V,O),W.add(ot)}),p=b.pop(),W},this.compileAsync=function(T,k,V=null){let W=this.compile(T,k,V);return new Promise(O=>{function ot(){if(W.forEach(function(ft){Mt.get(ft).currentProgram.isReady()&&W.delete(ft)}),W.size===0){O(T);return}setTimeout(ot,10)}It.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let le=null;function Nn(T){le&&le(T)}function wn(){pi.stop()}function Pc(){pi.start()}let pi=new Mu;pi.setAnimationLoop(Nn),typeof self<"u"&&pi.setContext(self),this.setAnimationLoop=function(T){le=T,it.setAnimationLoop(T),T===null?pi.stop():pi.start()},it.addEventListener("sessionstart",wn),it.addEventListener("sessionend",Pc),this.render=function(T,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(k),k=it.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,k,R),p=ct.get(T,b.length),p.init(k),b.push(p),tt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),Zt.setFromProjectionMatrix(tt,vn,k.reversedDepth),J=this.localClippingEnabled,te=rt.init(this.clippingPlanes,J),g=G.get(T,x.length),g.init(),x.push(g),it.enabled===!0&&it.isPresenting===!0){let ot=v.xr.getDepthSensingMesh();ot!==null&&qa(ot,k,-1/0,v.sortObjects)}qa(T,k,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(ut,X),Jt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,Jt&&vt.addToRenderList(g,T),this.info.render.frame++,te===!0&&rt.beginShadows();let V=p.state.shadowsArray;yt.render(V,T,k),te===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=g.opaque,O=g.transmissive;if(p.setupLights(),k.isArrayCamera){let ot=k.cameras;if(O.length>0)for(let ft=0,Rt=ot.length;ft<Rt;ft++){let wt=ot[ft];Lc(W,O,T,wt)}Jt&&vt.render(T);for(let ft=0,Rt=ot.length;ft<Rt;ft++){let wt=ot[ft];Ic(g,T,wt,wt.viewport)}}else O.length>0&&Lc(W,O,T,k),Jt&&vt.render(T),Ic(g,T,k);R!==null&&w===0&&(Ht.updateMultisampleRenderTarget(R),Ht.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(v,T,k),at.resetDefaultState(),M=-1,_=null,b.pop(),b.length>0?(p=b[b.length-1],te===!0&&rt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function qa(T,k,V,W){if(T.visible===!1)return;if(T.layers.test(k.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(k);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Zt.intersectsSprite(T)){W&&Ft.setFromMatrixPosition(T.matrixWorld).applyMatrix4(tt);let ft=H.update(T),Rt=T.material;Rt.visible&&g.push(T,ft,Rt,V,Ft.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Zt.intersectsObject(T))){let ft=H.update(T),Rt=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ft.copy(T.boundingSphere.center)):(ft.boundingSphere===null&&ft.computeBoundingSphere(),Ft.copy(ft.boundingSphere.center)),Ft.applyMatrix4(T.matrixWorld).applyMatrix4(tt)),Array.isArray(Rt)){let wt=ft.groups;for(let Nt=0,kt=wt.length;Nt<kt;Nt++){let Lt=wt[Nt],jt=Rt[Lt.materialIndex];jt&&jt.visible&&g.push(T,ft,jt,V,Ft.z,Lt)}}else Rt.visible&&g.push(T,ft,Rt,V,Ft.z,null)}}let ot=T.children;for(let ft=0,Rt=ot.length;ft<Rt;ft++)qa(ot[ft],k,V,W)}function Ic(T,k,V,W){let O=T.opaque,ot=T.transmissive,ft=T.transparent;p.setupLightsView(V),te===!0&&rt.setGlobalState(v.clippingPlanes,V),W&&gt.viewport(P.copy(W)),O.length>0&&Pr(O,k,V),ot.length>0&&Pr(ot,k,V),ft.length>0&&Pr(ft,k,V),gt.buffers.depth.setTest(!0),gt.buffers.depth.setMask(!0),gt.buffers.color.setMask(!0),gt.setPolygonOffset(!1)}function Lc(T,k,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[W.id]===void 0&&(p.state.transmissionRenderTarget[W.id]=new En(1,1,{generateMipmaps:!0,type:It.has("EXT_color_buffer_half_float")||It.has("EXT_color_buffer_float")?fs:bn,minFilter:Ln,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ie.workingColorSpace}));let ot=p.state.transmissionRenderTarget[W.id],ft=W.viewport||P;ot.setSize(ft.z*v.transmissionResolutionScale,ft.w*v.transmissionResolutionScale);let Rt=v.getRenderTarget(),wt=v.getActiveCubeFace(),Nt=v.getActiveMipmapLevel();v.setRenderTarget(ot),v.getClearColor(F),z=v.getClearAlpha(),z<1&&v.setClearColor(16777215,.5),v.clear(),Jt&&vt.render(V);let kt=v.toneMapping;v.toneMapping=qn;let Lt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),p.setupLightsView(W),te===!0&&rt.setGlobalState(v.clippingPlanes,W),Pr(T,V,W),Ht.updateMultisampleRenderTarget(ot),Ht.updateRenderTargetMipmap(ot),It.has("WEBGL_multisampled_render_to_texture")===!1){let jt=!1;for(let de=0,Te=k.length;de<Te;de++){let ye=k[de],me=ye.object,Ut=ye.geometry,Me=ye.material,se=ye.group;if(Me.side===be&&me.layers.test(W.layers)){let tn=Me.side;Me.side=ke,Me.needsUpdate=!0,Dc(me,V,W,Ut,Me,se),Me.side=tn,Me.needsUpdate=!0,jt=!0}}jt===!0&&(Ht.updateMultisampleRenderTarget(ot),Ht.updateRenderTargetMipmap(ot))}v.setRenderTarget(Rt,wt,Nt),v.setClearColor(F,z),Lt!==void 0&&(W.viewport=Lt),v.toneMapping=kt}function Pr(T,k,V){let W=k.isScene===!0?k.overrideMaterial:null;for(let O=0,ot=T.length;O<ot;O++){let ft=T[O],Rt=ft.object,wt=ft.geometry,Nt=ft.group,kt=ft.material;kt.allowOverride===!0&&W!==null&&(kt=W),Rt.layers.test(V.layers)&&Dc(Rt,k,V,wt,kt,Nt)}}function Dc(T,k,V,W,O,ot){T.onBeforeRender(v,k,V,W,O,ot),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),O.onBeforeRender(v,k,V,W,T,ot),O.transparent===!0&&O.side===be&&O.forceSinglePass===!1?(O.side=ke,O.needsUpdate=!0,v.renderBufferDirect(V,k,W,O,T,ot),O.side=Gn,O.needsUpdate=!0,v.renderBufferDirect(V,k,W,O,T,ot),O.side=be):v.renderBufferDirect(V,k,W,O,T,ot),T.onAfterRender(v,k,V,W,O,ot)}function Ir(T,k,V){k.isScene!==!0&&(k=bt);let W=Mt.get(T),O=p.state.lights,ot=p.state.shadowsArray,ft=O.state.version,Rt=Y.getParameters(T,O.state,ot,k,V),wt=Y.getProgramCacheKey(Rt),Nt=W.programs;W.environment=T.isMeshStandardMaterial?k.environment:null,W.fog=k.fog,W.envMap=(T.isMeshStandardMaterial?pe:ve).get(T.envMap||W.environment),W.envMapRotation=W.environment!==null&&T.envMap===null?k.environmentRotation:T.envMapRotation,Nt===void 0&&(T.addEventListener("dispose",K),Nt=new Map,W.programs=Nt);let kt=Nt.get(wt);if(kt!==void 0){if(W.currentProgram===kt&&W.lightsStateVersion===ft)return Nc(T,Rt),kt}else Rt.uniforms=Y.getUniforms(T),T.onBeforeCompile(Rt,v),kt=Y.acquireProgram(Rt,wt),Nt.set(wt,kt),W.uniforms=Rt.uniforms;let Lt=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Lt.clippingPlanes=rt.uniform),Nc(T,Rt),W.needsLights=cd(T),W.lightsStateVersion=ft,W.needsLights&&(Lt.ambientLightColor.value=O.state.ambient,Lt.lightProbe.value=O.state.probe,Lt.directionalLights.value=O.state.directional,Lt.directionalLightShadows.value=O.state.directionalShadow,Lt.spotLights.value=O.state.spot,Lt.spotLightShadows.value=O.state.spotShadow,Lt.rectAreaLights.value=O.state.rectArea,Lt.ltc_1.value=O.state.rectAreaLTC1,Lt.ltc_2.value=O.state.rectAreaLTC2,Lt.pointLights.value=O.state.point,Lt.pointLightShadows.value=O.state.pointShadow,Lt.hemisphereLights.value=O.state.hemi,Lt.directionalShadowMap.value=O.state.directionalShadowMap,Lt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Lt.spotShadowMap.value=O.state.spotShadowMap,Lt.spotLightMatrix.value=O.state.spotLightMatrix,Lt.spotLightMap.value=O.state.spotLightMap,Lt.pointShadowMap.value=O.state.pointShadowMap,Lt.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=kt,W.uniformsList=null,kt}function Uc(T){if(T.uniformsList===null){let k=T.currentProgram.getUniforms();T.uniformsList=xs.seqWithValue(k.seq,T.uniforms)}return T.uniformsList}function Nc(T,k){let V=Mt.get(T);V.outputColorSpace=k.outputColorSpace,V.batching=k.batching,V.batchingColor=k.batchingColor,V.instancing=k.instancing,V.instancingColor=k.instancingColor,V.instancingMorph=k.instancingMorph,V.skinning=k.skinning,V.morphTargets=k.morphTargets,V.morphNormals=k.morphNormals,V.morphColors=k.morphColors,V.morphTargetsCount=k.morphTargetsCount,V.numClippingPlanes=k.numClippingPlanes,V.numIntersection=k.numClipIntersection,V.vertexAlphas=k.vertexAlphas,V.vertexTangents=k.vertexTangents,V.toneMapping=k.toneMapping}function ad(T,k,V,W,O){k.isScene!==!0&&(k=bt),Ht.resetTextureUnits();let ot=k.fog,ft=W.isMeshStandardMaterial?k.environment:null,Rt=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:wi,wt=(W.isMeshStandardMaterial?pe:ve).get(W.envMap||ft),Nt=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,kt=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Lt=!!V.morphAttributes.position,jt=!!V.morphAttributes.normal,de=!!V.morphAttributes.color,Te=qn;W.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Te=v.toneMapping);let ye=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,me=ye!==void 0?ye.length:0,Ut=Mt.get(W),Me=p.state.lights;if(te===!0&&(J===!0||T!==_)){let We=T===_&&W.id===M;rt.setState(W,T,We)}let se=!1;W.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==Me.state.version||Ut.outputColorSpace!==Rt||O.isBatchedMesh&&Ut.batching===!1||!O.isBatchedMesh&&Ut.batching===!0||O.isBatchedMesh&&Ut.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ut.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ut.instancing===!1||!O.isInstancedMesh&&Ut.instancing===!0||O.isSkinnedMesh&&Ut.skinning===!1||!O.isSkinnedMesh&&Ut.skinning===!0||O.isInstancedMesh&&Ut.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ut.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ut.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ut.instancingMorph===!1&&O.morphTexture!==null||Ut.envMap!==wt||W.fog===!0&&Ut.fog!==ot||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==rt.numPlanes||Ut.numIntersection!==rt.numIntersection)||Ut.vertexAlphas!==Nt||Ut.vertexTangents!==kt||Ut.morphTargets!==Lt||Ut.morphNormals!==jt||Ut.morphColors!==de||Ut.toneMapping!==Te||Ut.morphTargetsCount!==me)&&(se=!0):(se=!0,Ut.__version=W.version);let tn=Ut.currentProgram;se===!0&&(tn=Ir(W,k,O));let Gi=!1,en=!1,Cs=!1,we=tn.getUniforms(),hn=Ut.uniforms;if(gt.useProgram(tn.program)&&(Gi=!0,en=!0,Cs=!0),W.id!==M&&(M=W.id,en=!0),Gi||_!==T){gt.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),we.setValue(I,"projectionMatrix",T.projectionMatrix),we.setValue(I,"viewMatrix",T.matrixWorldInverse);let qe=we.map.cameraPosition;qe!==void 0&&qe.setValue(I,St.setFromMatrixPosition(T.matrixWorld)),Pt.logarithmicDepthBuffer&&we.setValue(I,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&we.setValue(I,"isOrthographic",T.isOrthographicCamera===!0),_!==T&&(_=T,en=!0,Cs=!0)}if(O.isSkinnedMesh){we.setOptional(I,O,"bindMatrix"),we.setOptional(I,O,"bindMatrixInverse");let We=O.skeleton;We&&(We.boneTexture===null&&We.computeBoneTexture(),we.setValue(I,"boneTexture",We.boneTexture,Ht))}O.isBatchedMesh&&(we.setOptional(I,O,"batchingTexture"),we.setValue(I,"batchingTexture",O._matricesTexture,Ht),we.setOptional(I,O,"batchingIdTexture"),we.setValue(I,"batchingIdTexture",O._indirectTexture,Ht),we.setOptional(I,O,"batchingColorTexture"),O._colorsTexture!==null&&we.setValue(I,"batchingColorTexture",O._colorsTexture,Ht));let un=V.morphAttributes;if((un.position!==void 0||un.normal!==void 0||un.color!==void 0)&&Q.update(O,V,tn),(en||Ut.receiveShadow!==O.receiveShadow)&&(Ut.receiveShadow=O.receiveShadow,we.setValue(I,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(hn.envMap.value=wt,hn.flipEnvMap.value=wt.isCubeTexture&&wt.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&k.environment!==null&&(hn.envMapIntensity.value=k.environmentIntensity),en&&(we.setValue(I,"toneMappingExposure",v.toneMappingExposure),Ut.needsLights&&ld(hn,Cs),ot&&W.fog===!0&&j.refreshFogUniforms(hn,ot),j.refreshMaterialUniforms(hn,W,$,et,p.state.transmissionRenderTarget[T.id]),xs.upload(I,Uc(Ut),hn,Ht)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(xs.upload(I,Uc(Ut),hn,Ht),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&we.setValue(I,"center",O.center),we.setValue(I,"modelViewMatrix",O.modelViewMatrix),we.setValue(I,"normalMatrix",O.normalMatrix),we.setValue(I,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let We=W.uniformsGroups;for(let qe=0,Ya=We.length;qe<Ya;qe++){let mi=We[qe];Ot.update(mi,tn),Ot.bind(mi,tn)}}return tn}function ld(T,k){T.ambientLightColor.needsUpdate=k,T.lightProbe.needsUpdate=k,T.directionalLights.needsUpdate=k,T.directionalLightShadows.needsUpdate=k,T.pointLights.needsUpdate=k,T.pointLightShadows.needsUpdate=k,T.spotLights.needsUpdate=k,T.spotLightShadows.needsUpdate=k,T.rectAreaLights.needsUpdate=k,T.hemisphereLights.needsUpdate=k}function cd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,k,V){let W=Mt.get(T);W.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),Mt.get(T.texture).__webglTexture=k,Mt.get(T.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:V,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,k){let V=Mt.get(T);V.__webglFramebuffer=k,V.__useDefaultFramebuffer=k===void 0};let hd=I.createFramebuffer();this.setRenderTarget=function(T,k=0,V=0){R=T,A=k,w=V;let W=!0,O=null,ot=!1,ft=!1;if(T){let wt=Mt.get(T);if(wt.__useDefaultFramebuffer!==void 0)gt.bindFramebuffer(I.FRAMEBUFFER,null),W=!1;else if(wt.__webglFramebuffer===void 0)Ht.setupRenderTarget(T);else if(wt.__hasExternalTextures)Ht.rebindTextures(T,Mt.get(T.texture).__webglTexture,Mt.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Lt=T.depthTexture;if(wt.__boundDepthTexture!==Lt){if(Lt!==null&&Mt.has(Lt)&&(T.width!==Lt.image.width||T.height!==Lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ht.setupDepthRenderbuffer(T)}}let Nt=T.texture;(Nt.isData3DTexture||Nt.isDataArrayTexture||Nt.isCompressedArrayTexture)&&(ft=!0);let kt=Mt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(kt[k])?O=kt[k][V]:O=kt[k],ot=!0):T.samples>0&&Ht.useMultisampledRTT(T)===!1?O=Mt.get(T).__webglMultisampledFramebuffer:Array.isArray(kt)?O=kt[V]:O=kt,P.copy(T.viewport),N.copy(T.scissor),B=T.scissorTest}else P.copy(nt).multiplyScalar($).floor(),N.copy(Et).multiplyScalar($).floor(),B=Yt;if(V!==0&&(O=hd),gt.bindFramebuffer(I.FRAMEBUFFER,O)&&W&&gt.drawBuffers(T,O),gt.viewport(P),gt.scissor(N),gt.setScissorTest(B),ot){let wt=Mt.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+k,wt.__webglTexture,V)}else if(ft){let wt=k;for(let Nt=0;Nt<T.textures.length;Nt++){let kt=Mt.get(T.textures[Nt]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Nt,kt.__webglTexture,V,wt)}}else if(T!==null&&V!==0){let wt=Mt.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,wt.__webglTexture,V)}M=-1},this.readRenderTargetPixels=function(T,k,V,W,O,ot,ft,Rt=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let wt=Mt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ft!==void 0&&(wt=wt[ft]),wt){gt.bindFramebuffer(I.FRAMEBUFFER,wt);try{let Nt=T.textures[Rt],kt=Nt.format,Lt=Nt.type;if(!Pt.textureFormatReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pt.textureTypeReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=T.width-W&&V>=0&&V<=T.height-O&&(T.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Rt),I.readPixels(k,V,W,O,_t.convert(kt),_t.convert(Lt),ot))}finally{let Nt=R!==null?Mt.get(R).__webglFramebuffer:null;gt.bindFramebuffer(I.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(T,k,V,W,O,ot,ft,Rt=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let wt=Mt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ft!==void 0&&(wt=wt[ft]),wt)if(k>=0&&k<=T.width-W&&V>=0&&V<=T.height-O){gt.bindFramebuffer(I.FRAMEBUFFER,wt);let Nt=T.textures[Rt],kt=Nt.format,Lt=Nt.type;if(!Pt.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pt.textureTypeReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let jt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,jt),I.bufferData(I.PIXEL_PACK_BUFFER,ot.byteLength,I.STREAM_READ),T.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Rt),I.readPixels(k,V,W,O,_t.convert(kt),_t.convert(Lt),0);let de=R!==null?Mt.get(R).__webglFramebuffer:null;gt.bindFramebuffer(I.FRAMEBUFFER,de);let Te=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Zh(I,Te,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,jt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ot),I.deleteBuffer(jt),I.deleteSync(Te),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,k=null,V=0){let W=Math.pow(2,-V),O=Math.floor(T.image.width*W),ot=Math.floor(T.image.height*W),ft=k!==null?k.x:0,Rt=k!==null?k.y:0;Ht.setTexture2D(T,0),I.copyTexSubImage2D(I.TEXTURE_2D,V,0,0,ft,Rt,O,ot),gt.unbindTexture()};let ud=I.createFramebuffer(),dd=I.createFramebuffer();this.copyTextureToTexture=function(T,k,V=null,W=null,O=0,ot=null){ot===null&&(O!==0?(ss("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ot=O,O=0):ot=0);let ft,Rt,wt,Nt,kt,Lt,jt,de,Te,ye=T.isCompressedTexture?T.mipmaps[ot]:T.image;if(V!==null)ft=V.max.x-V.min.x,Rt=V.max.y-V.min.y,wt=V.isBox3?V.max.z-V.min.z:1,Nt=V.min.x,kt=V.min.y,Lt=V.isBox3?V.min.z:0;else{let un=Math.pow(2,-O);ft=Math.floor(ye.width*un),Rt=Math.floor(ye.height*un),T.isDataArrayTexture?wt=ye.depth:T.isData3DTexture?wt=Math.floor(ye.depth*un):wt=1,Nt=0,kt=0,Lt=0}W!==null?(jt=W.x,de=W.y,Te=W.z):(jt=0,de=0,Te=0);let me=_t.convert(k.format),Ut=_t.convert(k.type),Me;k.isData3DTexture?(Ht.setTexture3D(k,0),Me=I.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Ht.setTexture2DArray(k,0),Me=I.TEXTURE_2D_ARRAY):(Ht.setTexture2D(k,0),Me=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,k.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,k.unpackAlignment);let se=I.getParameter(I.UNPACK_ROW_LENGTH),tn=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Gi=I.getParameter(I.UNPACK_SKIP_PIXELS),en=I.getParameter(I.UNPACK_SKIP_ROWS),Cs=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,ye.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ye.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Nt),I.pixelStorei(I.UNPACK_SKIP_ROWS,kt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Lt);let we=T.isDataArrayTexture||T.isData3DTexture,hn=k.isDataArrayTexture||k.isData3DTexture;if(T.isDepthTexture){let un=Mt.get(T),We=Mt.get(k),qe=Mt.get(un.__renderTarget),Ya=Mt.get(We.__renderTarget);gt.bindFramebuffer(I.READ_FRAMEBUFFER,qe.__webglFramebuffer),gt.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ya.__webglFramebuffer);for(let mi=0;mi<wt;mi++)we&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Mt.get(T).__webglTexture,O,Lt+mi),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Mt.get(k).__webglTexture,ot,Te+mi)),I.blitFramebuffer(Nt,kt,ft,Rt,jt,de,ft,Rt,I.DEPTH_BUFFER_BIT,I.NEAREST);gt.bindFramebuffer(I.READ_FRAMEBUFFER,null),gt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(O!==0||T.isRenderTargetTexture||Mt.has(T)){let un=Mt.get(T),We=Mt.get(k);gt.bindFramebuffer(I.READ_FRAMEBUFFER,ud),gt.bindFramebuffer(I.DRAW_FRAMEBUFFER,dd);for(let qe=0;qe<wt;qe++)we?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,un.__webglTexture,O,Lt+qe):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,un.__webglTexture,O),hn?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,We.__webglTexture,ot,Te+qe):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,We.__webglTexture,ot),O!==0?I.blitFramebuffer(Nt,kt,ft,Rt,jt,de,ft,Rt,I.COLOR_BUFFER_BIT,I.NEAREST):hn?I.copyTexSubImage3D(Me,ot,jt,de,Te+qe,Nt,kt,ft,Rt):I.copyTexSubImage2D(Me,ot,jt,de,Nt,kt,ft,Rt);gt.bindFramebuffer(I.READ_FRAMEBUFFER,null),gt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else hn?T.isDataTexture||T.isData3DTexture?I.texSubImage3D(Me,ot,jt,de,Te,ft,Rt,wt,me,Ut,ye.data):k.isCompressedArrayTexture?I.compressedTexSubImage3D(Me,ot,jt,de,Te,ft,Rt,wt,me,ye.data):I.texSubImage3D(Me,ot,jt,de,Te,ft,Rt,wt,me,Ut,ye):T.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ot,jt,de,ft,Rt,me,Ut,ye.data):T.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ot,jt,de,ye.width,ye.height,me,ye.data):I.texSubImage2D(I.TEXTURE_2D,ot,jt,de,ft,Rt,me,Ut,ye);I.pixelStorei(I.UNPACK_ROW_LENGTH,se),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,tn),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Gi),I.pixelStorei(I.UNPACK_SKIP_ROWS,en),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Cs),ot===0&&k.generateMipmaps&&I.generateMipmap(Me),gt.unbindTexture()},this.initRenderTarget=function(T){Mt.get(T).__webglFramebuffer===void 0&&Ht.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Ht.setTextureCube(T,0):T.isData3DTexture?Ht.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Ht.setTexture2DArray(T,0):Ht.setTexture2D(T,0),gt.unbindTexture()},this.resetState=function(){A=0,w=0,R=null,gt.reset(),at.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ie._getDrawingBufferColorSpace(t),e.unpackColorSpace=ie._getUnpackColorSpace()}};function dc(s){let t=new ge(9e3,48,24),e=fc(s),n=new an({side:ke,depthWrite:!1,fog:!1,uniforms:{top:{value:new At(s.sky[0])},horizon:{value:new At(s.sky[1])},sunDir:{value:e},sunColor:{value:new At(s.sun.color)},cloudiness:{value:s.links?.75:s.fogDensity>.0014?.6:.4},time:{value:0}},vertexShader:`
      varying vec3 vDir;
      void main(){
        vDir = normalize(position);
        vec4 p = modelViewMatrix * vec4(position,1.0);
        gl_Position = projectionMatrix * p;
        gl_Position.z = gl_Position.w * 0.99999;
      }`,fragmentShader:`
      uniform vec3 top; uniform vec3 horizon; uniform vec3 sunDir; uniform vec3 sunColor;
      uniform float cloudiness; uniform float time;
      varying vec3 vDir;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
      float fbm(vec2 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5;} return v; }
      void main(){
        vec3 d = normalize(vDir);
        float h = max(d.y, 0.0);
        vec3 col = mix(horizon, top, pow(h, 0.55));
        // below horizon: haze
        if (d.y < 0.0) col = horizon * 0.95;
        float sd = max(dot(d, sunDir), 0.0);
        col += sunColor * (pow(sd, 900.0) * 6.0 + pow(sd, 24.0) * 0.25 + pow(sd, 4.0) * 0.08);
        // clouds
        if (d.y > 0.0) {
          vec2 uv = d.xz / (d.y + 0.12) * 1.6 + vec2(time * 0.004, time * 0.002);
          float c = fbm(uv);
          float cov = smoothstep(1.0 - cloudiness, 1.0 - cloudiness + 0.35, c);
          vec3 cc = mix(vec3(1.0), horizon * 0.92, 0.35) + sunColor * pow(sd, 6.0) * 0.3;
          col = mix(col, cc, cov * smoothstep(0.0, 0.18, d.y) * 0.85);
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),i=new Z(t,n);return i.renderOrder=-1,i.frustumCulled=!1,i}function fc(s){let t=s.sun.elev*Math.PI/180,e=s.sun.az*Math.PI/180;return new D(Math.sin(e)*Math.cos(t),Math.sin(t),Math.cos(e)*Math.cos(t)).normalize()}function Au(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function De(s){let t=s>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Ta=class{constructor(t=1){let e=De(t);this.perm=new Uint8Array(512),this.gx=new Float32Array(256),this.gy=new Float32Array(256);let n=new Uint8Array(256);for(let i=0;i<256;i++){n[i]=i;let r=e()*Math.PI*2;this.gx[i]=Math.cos(r),this.gy[i]=Math.sin(r)}for(let i=255;i>0;i--){let r=Math.floor(e()*(i+1)),o=n[i];n[i]=n[r],n[r]=o}for(let i=0;i<512;i++)this.perm[i]=n[i&255]}noise(t,e){let n=Math.floor(t),i=Math.floor(e),r=t-n,o=e-i,a=n&255,c=i&255,l=this.perm,h=(b,v,E,A)=>{let w=l[l[b]+v];return this.gx[w]*E+this.gy[w]*A},u=r*r*r*(r*(r*6-15)+10),d=o*o*o*(o*(o*6-15)+10),f=h(a,c,r,o),m=h(a+1,c,r-1,o),y=h(a,c+1,r,o-1),g=h(a+1,c+1,r-1,o-1),p=f+u*(m-f),x=y+u*(g-y);return p+d*(x-p)}fbm(t,e,n=4){let i=1,r=1,o=0,a=0;for(let c=0;c<n;c++)o+=this.noise(t*r,e*r)*i,a+=i,i*=.5,r*=2.03;return o/a*1.6}n1(t){return this.noise(t,.5)}},re=(s,t,e)=>s<t?t:s>e?e:s,Ke=(s,t,e)=>s+(t-s)*e,Oe=(s,t,e)=>{let n=re((e-s)/(t-s),0,1);return n*n*(3-2*n)};var Di={augusta:{fairway:"#4e9a34",fairway2:"#5aa83d",rough:"#2f6e22",deep:"#2a5e1f",green:"#5fb043",fringe:"#4f9f38",sand:"#f4f1ea",waste:"#e8dcc0",water:"#1f4d4a",brush:"#6d5a36",straw:"#8a5a2b",tee:"#57a53b",sky:["#4f8fd6","#cfe4f5"],fog:"#c9dcea",fogDensity:.0011,sun:{elev:48,az:210,color:"#fff4e0",intensity:3.1},undulation:7,undFreq:.007692307692307693,lateralRise:.06,trees:{types:["pine","pine","pine","oak"],density:1,near:16,lines:!0},extras:["azalea","straw"],birds:"songbird",crowd:.6,roughType:"rough",building:"antebellum"},pebble:{fairway:"#6a9a3e",fairway2:"#76a646",rough:"#4d7a2e",deep:"#5a6b35",green:"#6aa446",fringe:"#5f9a3c",sand:"#e9dcc0",waste:"#dccda8",water:"#1a4e6e",brush:"#7a7048",straw:"#7a6a45",tee:"#6aa040",sky:["#6f9cc9","#e1e8ee"],fog:"#d5dfe6",fogDensity:.0016,sun:{elev:38,az:230,color:"#fff2dc",intensity:2.9},undulation:4,undFreq:.011111111111111112,lateralRise:.02,trees:{types:["cypress","cypress","pine"],density:.35,near:26,lines:!1},extras:["rocks"],birds:"gull",crowd:.4,roughType:"rough",cartPath:!0,building:"lodge",seaLevel:-11},sawgrass:{fairway:"#4f9636",fairway2:"#5ca33f",rough:"#3a7a28",deep:"#2f6a22",green:"#5dab41",fringe:"#4e9c38",sand:"#f1eadb",waste:"#d9c9a2",water:"#1d4f53",brush:"#6d5a36",straw:"#8a5a2b",tee:"#55a03a",sky:["#3d86d8","#d7e8f5"],fog:"#d3e3ee",fogDensity:.001,sun:{elev:55,az:200,color:"#fff6e6",intensity:3.3},undulation:2.2,undFreq:.016666666666666666,lateralRise:.035,trees:{types:["palm","oak","pine","palm"],density:.75,near:18,lines:!0},extras:["straw"],birds:"songbird",crowd:.7,roughType:"rough",cartPath:!0,building:"mediterranean"},torrey:{fairway:"#6c9a3c",fairway2:"#79a646",rough:"#56822f",deep:"#687a36",green:"#65a444",fringe:"#5a9a3b",sand:"#eadfc6",waste:"#d7c7a0",water:"#285f7a",brush:"#8a7a4c",straw:"#7a6a45",tee:"#68a03e",sky:["#86a9c8","#e6e9ea"],fog:"#dfe3e3",fogDensity:.0019,sun:{elev:42,az:220,color:"#fff0da",intensity:2.7},undulation:3.5,undFreq:.01,lateralRise:.02,trees:{types:["torreypine","eucalyptus"],density:.3,near:30,lines:!1},extras:[],birds:"gull",crowd:.4,roughType:"kikuyu",cartPath:!0,building:"modern",seaLevel:-30},bethpage:{fairway:"#4d8e33",fairway2:"#579a3b",rough:"#35712a",deep:"#607a38",green:"#5aa33f",fringe:"#4d9536",sand:"#efe6d3",waste:"#e4d6b5",water:"#23443e",brush:"#6d5a36",straw:"#6d4d2b",tee:"#529a38",sky:["#7b9cbf","#dfe6ec"],fog:"#d5dde3",fogDensity:.0013,sun:{elev:40,az:210,color:"#fff1dc",intensity:2.8},undulation:8,undFreq:.008333333333333333,lateralRise:.07,trees:{types:["oak","oak","maple","pine"],density:1,near:20,lines:!0},extras:["fescue"],birds:"songbird",crowd:.7,roughType:"thick",building:"colonial"},pinehurst:{fairway:"#679b3c",fairway2:"#72a644",rough:"#8e8a55",deep:"#8e8a55",green:"#63a443",fringe:"#5b9a3c",sand:"#efe3c7",waste:"#e2d0a6",water:"#2a4d48",brush:"#8a7a4c",straw:"#8a5a2b",tee:"#60a03c",sky:["#5b95d0","#dbe8f2"],fog:"#d9e3ea",fogDensity:.0011,sun:{elev:50,az:205,color:"#fff3dd",intensity:3.1},undulation:3.2,undFreq:.011111111111111112,lateralRise:.02,trees:{types:["longleaf","longleaf","pine"],density:.6,near:34,lines:!0},extras:["wiregrass","straw"],birds:"songbird",crowd:.5,fairwayFrom:95,roughType:"sandy",building:"colonial",sandyRough:!0},standrews:{fairway:"#7aa447",fairway2:"#88b050",rough:"#768a3c",deep:"#9a8f55",green:"#74ab48",fringe:"#6fa244",sand:"#d9c9a0",waste:"#6f7a34",water:"#35505a",brush:"#6b7a30",straw:"#7a6a45",tee:"#7aa048",sky:["#7f9ab3","#dfe5e8"],fog:"#d3dade",fogDensity:.0011,sun:{elev:34,az:200,color:"#f7f0e2",intensity:2.8},undulation:2.4,undFreq:.03571428571428571,lateralRise:0,trees:{types:[],density:0,near:999,lines:!1},extras:["gorse","fescue","town"],birds:"gull",crowd:.5,roughType:"links",building:"rna",links:!0},valhalla:{fairway:"#4a9435",fairway2:"#56a03e",rough:"#327328",deep:"#2d6522",green:"#58aa40",fringe:"#4a9a37",sand:"#f2ebdb",waste:"#e4d6b5",water:"#2b5550",brush:"#6d5a36",straw:"#6d4d2b",tee:"#50a03a",sky:["#4a88cf","#d5e6f3"],fog:"#cfe0ec",fogDensity:.0011,sun:{elev:52,az:200,color:"#fff4e2",intensity:3.2},undulation:5,undFreq:.00909090909090909,lateralRise:.04,trees:{types:["oak","maple","oak"],density:.75,near:22,lines:!0},extras:[],birds:"songbird",crowd:.7,roughType:"thick",cartPath:!0,building:"modern"},oakmont:{fairway:"#5a9a3a",fairway2:"#65a542",rough:"#3c7a2c",deep:"#4f7a32",green:"#62ac48",fringe:"#55a03c",sand:"#e3d5b5",waste:"#dccca8",water:"#2b4a45",brush:"#6d5a36",straw:"#6d4d2b",tee:"#58a03c",sky:["#6c95c4","#dde6ee"],fog:"#d4dde6",fogDensity:.0012,sun:{elev:44,az:210,color:"#fff2de",intensity:3},undulation:6,undFreq:.00909090909090909,lateralRise:.03,trees:{types:["oak","maple"],density:.25,near:45,lines:!1},extras:["fescue"],birds:"songbird",crowd:.6,roughType:"thick",building:"tudor"},riviera:{fairway:"#679a3a",fairway2:"#72a543",rough:"#557f2c",deep:"#4d7428",green:"#5fa443",fringe:"#579a3b",sand:"#efe3c8",waste:"#8a7a4c",water:"#2a5566",brush:"#8a7a4c",straw:"#7a6a45",tee:"#63a03d",sky:["#4f92d8","#e9e6dc"],fog:"#e3e0d6",fogDensity:.0012,sun:{elev:46,az:225,color:"#fff0d6",intensity:3.2},undulation:4.5,undFreq:.01,lateralRise:.05,trees:{types:["eucalyptus","eucalyptus","sycamore","palm"],density:.65,near:22,lines:!0},extras:[],birds:"songbird",crowd:.7,roughType:"kikuyu",cartPath:!0,building:"spanish"}},pc={tee:{name:"TEE",dist:[1,1],spin:1,disp:1,color:"#7fd06b"},fairway:{name:"FAIRWAY",dist:[.97,1],spin:1,disp:1,color:"#7fd06b"},fringe:{name:"FRINGE",dist:[.95,.99],spin:.9,disp:1,color:"#9bdc7a"},green:{name:"GREEN",dist:[1,1],spin:1,disp:1,color:"#b6f09a"},firstcut:{name:"FIRST CUT",dist:[.92,.97],spin:.85,disp:1.1,color:"#c9d86b"},rough:{name:"ROUGH",dist:[.8,.9],spin:.55,disp:1.35,color:"#e0c050"},deep:{name:"DEEP ROUGH",dist:[.6,.75],spin:.4,disp:1.8,color:"#e08a40"},sand:{name:"BUNKER",dist:[.72,.85],spin:.6,disp:1.4,color:"#f0dca0"},waste:{name:"WASTE AREA",dist:[.85,.93],spin:.7,disp:1.2,color:"#e8cf90"},straw:{name:"PINE STRAW",dist:[.84,.92],spin:.65,disp:1.25,color:"#d69a58"},path:{name:"ROAD",dist:[.9,.96],spin:.8,disp:1.1,color:"#c0c0c0"},water:{name:"WATER",dist:[0,0],spin:0,disp:1,color:"#4aa3ff"},brush:{name:"PENALTY AREA",dist:[0,0],spin:0,disp:1,color:"#ff6a4a"}};var L={DEEP:0,ROUGH:1,FIRSTCUT:2,FAIRWAY:3,FRINGE:4,GREEN:5,TEE:6,SAND:7,WASTE:8,WATER:9,BRUSH:10,STRAW:11,PATH:12},Ru=["deep","rough","firstcut","fairway","fringe","green","tee","sand","waste","water","brush","straw","path"],Aa=Math.PI/180,_s=2,Ui=class{constructor(t,e,n={}){this.course=t,this.idx=e,this.def=t.holes[e],this.number=e+1,this.par=this.def.p,this.theme=Di[t.theme],this.teeFactor=n.teeFactor??1,this.seed=Au(t.id+":"+e),this.rng=De(this.seed),this.noise=new Ta(this.seed),this.links=!!this.theme.links,this.cartSide=this.seed&1?1:-1,this.L=this.def.y,this.buildCenterline(),this.buildGreen(),this.buildHazards(),this.buildTees(),this.buildGrid(),this.placeTrees(),this.buildDecor(),this.setPin(n.pinSeed??1,n.pinDifficulty??.5),this.yards=Math.round(this.L-this.teeS)}buildCenterline(){let t=this.def,e=this.L,n=(t.ang||0)*Aa,i=[[0,0]],r=0,o=0,a=w=>{for(let R=0;R<w;R++)r+=Math.sin(n),o+=Math.cos(n),i.push([r,o])},c=0;t.p>3&&t.dl&&t.at&&(a(t.at),c=t.at,n+=t.dl*Aa,t.dl2&&t.at2&&(a(t.at2-t.at),c=t.at2,n+=t.dl2*Aa)),a(Math.max(10,e-c));let l=i;for(let w=0;w<4;w++){let R=l.map(_=>_.slice()),M=22;for(let _=1;_<l.length-1;_++){let P=0,N=0,B=0;for(let F=-M;F<=M;F++){let z=re(_+F,0,l.length-1);P+=l[z][0],N+=l[z][1],B++}R[_][0]=P/B,R[_][1]=N/B}l=R}let h=0;for(let w=1;w<l.length;w++)h+=Math.hypot(l[w][0]-l[w-1][0],l[w][1]-l[w-1][1]);let u=e/h;l=l.map(w=>[w[0]*u,w[1]*u]);let d=[],f=gr(l[1][0]-l[0][0],l[1][1]-l[0][1]),m=l.length,y=gr(l[m-1][0]-l[m-6][0],l[m-1][1]-l[m-6][1]),g=60,p=90;for(let w=-g;w<0;w+=_s)d.push([f[0]*w,f[1]*w,w]);let x=0,b=1,v=0;for(d.push([l[0][0],l[0][1],0]),v=_s;b<m;){let w=Math.hypot(l[b][0]-l[b-1][0],l[b][1]-l[b-1][1]);for(;x+w>=v&&v<=e;){let R=(v-x)/w;d.push([Ke(l[b-1][0],l[b][0],R),Ke(l[b-1][1],l[b][1],R),v]),v+=_s}x+=w,b++}let E=l[m-1];d[d.length-1][2]<e-.01&&d.push([E[0],E[1],e]);for(let w=_s;w<=p;w+=_s)d.push([E[0]+y[0]*w,E[1]+y[1]*w,e+w]);let A=d.length;this.cx=new Float32Array(A),this.cy=new Float32Array(A),this.cs=new Float32Array(A),this.tx=new Float32Array(A),this.ty=new Float32Array(A);for(let w=0;w<A;w++)this.cx[w]=d[w][0],this.cy[w]=d[w][1],this.cs[w]=d[w][2];for(let w=0;w<A;w++){let R=Math.max(0,w-2),M=Math.min(A-1,w+2),_=gr(this.cx[M]-this.cx[R],this.cy[M]-this.cy[R]);this.tx[w]=_[0],this.ty[w]=_[1]}this.nC=A,this.endT=y,this.chordLen=Math.hypot(E[0],E[1]),this.chordDir=gr(E[0],E[1])}at(t){let e=this.indexAt(t),n=Math.min(this.nC-1,e+1),i=re((t-this.cs[e])/Math.max(1e-6,this.cs[n]-this.cs[e]),0,1);return{x:Ke(this.cx[e],this.cx[n],i),y:Ke(this.cy[e],this.cy[n],i),tx:Ke(this.tx[e],this.tx[n],i),ty:Ke(this.ty[e],this.ty[n],i)}}indexAt(t){let e=Math.floor((t-this.cs[0])/_s);for(e=re(e,0,this.nC-2);e>0&&this.cs[e]>t;)e--;for(;e<this.nC-2&&this.cs[e+1]<t;)e++;return e}offset(t,e){let n=this.at(t);return[n.x+n.ty*e,n.y-n.tx*e]}nearest(t,e,n=[0,0]){let i=this.cx,r=this.cy,o=this.nC,a=1e18,c=0;for(let f=0;f<o;f+=5){let m=t-i[f],y=e-r[f],g=m*m+y*y;g<a&&(a=g,c=f)}let l=Math.max(0,c-6),h=Math.min(o-2,c+6);a=1e18;let u=0,d=0;for(let f=l;f<=h;f++){let m=i[f],y=r[f],g=i[f+1],p=r[f+1],x=g-m,b=p-y,v=x*x+b*b,E=((t-m)*x+(e-y)*b)/v;E=E<0?0:E>1?1:E;let A=m+x*E,w=y+b*E,R=t-A,M=e-w,_=R*R+M*M;if(_<a){a=_,u=this.cs[f]+E*(this.cs[f+1]-this.cs[f]);let P=R*b-M*x>=0?1:-1;d=Math.sqrt(_)*P}}return n[0]=u,n[1]=d,n}fwHalf(t){return(this.def.fw||32)/2*(1+.16*this.noise.n1(t/38+11.3))}buildGreen(){let t=this.def,e=this.rng,n=t.gw||1,i=this.at(this.L);this.G=[i.x,i.y],this.gT=[this.endT[0],this.endT[1]],this.gN=[this.endT[1],-this.endT[0]],this.grx=(12.5+e()*3)*n*(t.p===3?.95:1),this.gry=(15.5+e()*4)*n*(t.p===3?.9:1),this.grot=(e()-.5)*.5,this.gcos=Math.cos(this.grot),this.gsin=Math.sin(this.grot);let r=t.gs??1,o=e()*Math.PI*2,a=(.008+e()*.013)*r;this.gTilt=[Math.cos(o)*a*.7,0],this.gTilt[1]=-(.006+e()*.01)*r,this.gTier=e()<.3*r?{off:(e()-.3)*this.gry*.7,h:(.14+e()*.14)*Math.min(1.4,r),ang:(e()-.5)*.8}:null,this.gUnd=.1*r,this.dome=!!t.dome}greenLocal(t,e){let n=t-this.G[0],i=e-this.G[1],r=n*this.gN[0]+i*this.gN[1],o=n*this.gT[0]+i*this.gT[1],a=r*this.gcos-o*this.gsin,c=r*this.gsin+o*this.gcos;return[a,c]}greenSdf(t,e){let n=Math.hypot(t-this.G[0],e-this.G[1]),i=Math.max(this.grx,this.gry);if(n>i*1.35+14)return n-i*1.2;let[r,o]=this.greenLocal(t,e),a=r/this.grx,c=o/this.gry,l=Math.sqrt(a*a+c*c)+1e-6,h=1+.09*this.noise.noise(a/l*1.3+40,c/l*1.3+40)*1.6;return(l/h-1)*Math.min(this.grx,this.gry)}greenEdgeDist(t,e){let n=t*this.gN[0]+e*this.gN[1],i=t*this.gT[0]+e*this.gT[1],r=n*this.gcos-i*this.gsin,o=n*this.gsin+i*this.gcos;return 1/Math.sqrt((r/this.grx)**2+(o/this.gry)**2)}greenDir(t){let e=t*Aa;return gr(-this.gT[0]*Math.cos(e)+this.gN[0]*Math.sin(e),-this.gT[1]*Math.cos(e)+this.gN[1]*Math.sin(e))}buildHazards(){let t=this.rng;this.shapes=[],this.fixedTrees=[],this.decorSpec=[],this.oceanSide=0;let e=this.theme,n=l=>l,i=(l,h,u,d,f,m=.12)=>{let y=Math.cos(f),g=Math.sin(f),p=this.noise,x=t()*100,b=Math.min(u,d);return(v,E)=>{let A=v-l,w=E-h,R=(A*y-w*g)/u,M=(A*g+w*y)/d,_=Math.sqrt(R*R+M*M)+1e-6,P=1+m*p.noise(R/_*1.4+x,M/_*1.4+x)*1.8;return(_/P-1)*b}},r=l=>{let h=this.at(l);return Math.atan2(h.tx,h.ty)},o=l=>(this.shapes.push(l),l),a=(l,h)=>this.baseHeight(l,h);for(let l of this.def.hz||[]){let h=l[0];if(h==="fb"||h==="pot"||h==="waste"){let u=l[1],d=l[2],[f,m]=this.offset(u,d),y,g,p,x=L.SAND,b=.14;h==="fb"?(y=l[3]||6+t()*3,g=l[4]||9+t()*5,p=.7):h==="pot"?(y=g=2.2+t()*.6,p=1.3,b=.05):(y=l[3],g=l[4],p=.2,x=L.WASTE,b=.25),h==="waste"&&this.links&&(x=L.DEEP,p=-.6,this.decorSpec.push({kind:"gorse",x:f,y:m,rx:y,ry:g,rot:r(u)})),o({surf:x,depth:p,kind:h,cx:f,cy:m,rad:Math.max(y,g)*1.3,sdf:i(f,m,y,g,r(u)+(t()-.5)*.4,b)})}else if(h==="gb"){let u=l[2]||1,d=this.greenDir(l[1]+(t()-.5)*10),f=this.greenEdgeDist(d[0],d[1]),m=(4.5+t()*2)*u,y=(8+t()*4)*u,g=f+1.6+m*.85,p=this.G[0]+d[0]*g,x=this.G[1]+d[1]*g,b=Math.atan2(d[0],d[1])+Math.PI/2;o({surf:L.SAND,depth:.9*Math.min(1.3,u),kind:"gb",cx:p,cy:x,rad:y*1.3,sdf:i(p,x,y,m,b,.16)})}else if(h==="xb"){let u=l[1],d=l[2],[f,m]=this.offset(u,(t()-.5)*8),y=this.fwHalf(u)+10;o({surf:L.SAND,depth:.9,kind:"xb",cx:f,cy:m,rad:y*1.3,sdf:i(f,m,y,d/2+2,r(u)+(t()-.5)*.5,.2)})}else if(h==="pews"){let[u,d,f]=[l[1],l[2],l[3]],m=(u+d)/2,[y,g]=this.offset(m,f*(this.fwHalf(m)+14)),p=r(m),x=i(y,g,13,(d-u)/2,p,.08);o({surf:L.SAND,depth:.6,kind:"pews",cx:y,cy:g,rad:(d-u)*.7,s1:u,sdf:x})}else if(h==="pond"){let[u,d]=this.offset(l[1],l[2]),f=o({surf:L.WATER,depth:1.5,kind:"pond",cx:u,cy:d,rad:Math.max(l[3],l[4])*1.3,sdf:i(u,d,l[3],l[4],r(l[1]),.15)});f.levelAt=[u,d]}else if(h==="gpond"){let u=l[2]||1,d=this.greenDir(l[1]),f=this.greenEdgeDist(d[0],d[1]),m=16*u,y=11*u,g=f+3+y*.8,p=this.G[0]+d[0]*g,x=this.G[1]+d[1]*g,b=Math.atan2(d[0],d[1])+Math.PI/2,v=o({surf:L.WATER,depth:1.5,kind:"pond",cx:p,cy:x,rad:m*1.4,sdf:i(p,x,m,y,b,.12)});v.levelAt=[p,x]}else if(h==="lat"||h==="ocean"||h==="canyon"){let u=l[1],d=h==="lat"?l[4]:l[2],f=h==="lat"?l[2]:l[3]??-1e5,m=h==="lat"?l[3]:l[4]??1e5;h==="ocean"&&(m>=this.L&&(m=1e5),f<=0&&(f=-1e5));let y=h==="lat"?38:2e3,g=this.noise,p=t()*50,x=(E,A,w,R)=>{let M=d+4*g.n1(w/45+p)-u*R;return M=Math.max(M,f-w,w-m),h==="lat"&&(M=Math.max(M,u*R-(d+y))),M};h==="ocean"&&(this.oceanSide=u,this.oceanOff=d);let b=o({surf:h==="canyon"?L.BRUSH:L.WATER,depth:h==="canyon"?7:1.6,kind:h,sdf:x,band:!0,side:u,off:d,s1:f,s2:m}),v=re((Math.max(f,-50)+Math.min(m,this.L+50))/2,0,this.L);b.levelAt=this.offset(v,u*(d+8))}else if(h==="cross"||h==="xcanyon"){let u=l[1],d=l[2],f=this.noise,m=t()*50,y=(p,x,b,v)=>{let E=b+3*f.n1(v/18+m);return Math.max(u-E,E-d,Math.abs(v)-110)},g=o({surf:h==="cross"?L.WATER:L.BRUSH,depth:h==="cross"?1.3:3,kind:h,sdf:y,band:!0,s1:u,s2:d});g.levelAt=this.offset((u+d)/2,0),h==="cross"&&(this.crossings=(this.crossings||[]).concat([[u,d]]))}else if(h==="island"){let u=Math.max(this.grx,this.gry)+24,d=this.G,f=(g,p)=>Math.max(Math.hypot(g-d[0],p-d[1])-u,-(this.greenSdf(g,p)-3.2)),m=o({surf:L.WATER,depth:1.8,kind:"island",cx:d[0],cy:d[1],rad:u+4,sdf:f}),y=this.greenDir(0);m.levelAt=[d[0]+y[0]*(u-4),d[1]+y[1]*(u-4)],this.island=!0}else if(h==="tree"){let[u,d]=this.offset(l[1],l[2]);this.fixedTrees.push({x:u,y:d,r:l[3]||7})}else if(h==="gcb"){let u=this.G[0]+this.gN[0]*1.5,d=this.G[1]+this.gN[1]*1.5;o({surf:L.SAND,depth:.9,kind:"gcb",cx:u,cy:d,rad:5,sdf:i(u,d,3.4,2.8,0,.05),inGreen:!0})}else if(h==="road"){let u=this.G,d=this.gT,f=this.gN,m=this.gry,y=(p,x)=>{let b=p-u[0],v=x-u[1],E=b*d[0]+v*d[1],A=b*f[0]+v*f[1];return Math.max(Math.abs(E-(m+6))-2.5,Math.abs(A)-60)};o({surf:L.PATH,depth:.1,kind:"road",cx:u[0]+d[0]*(m+6),cy:u[1]+d[1]*(m+6),rad:70,sdf:y}),this.decorSpec.push({kind:"wall",x:u[0]+d[0]*(m+10),y:u[1]+d[1]*(m+10),dir:[f[0],f[1]],len:110});let g=this.offset(150,45);this.decorSpec.push({kind:"hotel",x:g[0],y:g[1],rot:r(150)})}else if(h==="valley")this.valley=!0;else if(h==="stands"){let u=this.greenDir(l[1]),d=this.greenEdgeDist(u[0],u[1])+24;this.decorSpec.push({kind:"stands",x:this.G[0]+u[0]*d,y:this.G[1]+u[1]*d,face:[-u[0],-u[1]]})}else if(h==="bridge"){let u=this.at(l[1]),[d,f]=this.offset(l[1],-this.fwHalf(l[1])*.6);this.decorSpec.push({kind:"bridge",x:d,y:f,dir:[u.tx,u.ty]})}else if(h==="target"){let[u,d]=this.offset(l[1],l[2]);this.decorSpec.push({kind:"target",x:u,y:d,dist:l[1]})}else if(h==="flowers"){let[u,d]=this.offset(l[1],l[2]);this.decorSpec.push({kind:"flowers",x:u,y:d,r:14})}}let c=this.def.p;this.fStart=this.def.range?12:c===3?this.L-40:this.links?30:Math.min(e.fairwayFrom??150,this.L*.38);for(let l of this.shapes)if(l.surf===L.WATER)if(l.kind==="ocean")l.level=e.seaLevel??-8;else{let[h,u]=l.levelAt;l.level=this.baseHeight(h,u)-.9,l.kind==="island"&&(l.level=Math.min(l.level,this.baseHeight(this.G[0],this.G[1])-1.2))}else if(l.surf===L.BRUSH&&l.levelAt){let[h,u]=l.levelAt;l.level=this.baseHeight(h,u)}this.waterShapes=this.shapes.filter(l=>l.surf===L.WATER)}buildTees(){this.teeS=this.L*(1-this.teeFactor),this.teeBoxes=[1,.93,.86,.75].map(e=>({s:this.L*(1-e),f:e}));let t=this.at(this.teeS);this.tee=[t.x,t.y],this.teeDir=[t.tx,t.ty]}baseHeight(t,e){let n=this.theme,i=(this.def.el||0)/3,r=(t*this.chordDir[0]+e*this.chordDir[1])/this.chordLen,o=i*Oe(.1,.92,r),a=n.undFreq,c=n.undulation*this.noise.fbm(t*a+17.3,e*a-4.1,4);return this.links&&(c+=1.1*this.noise.fbm(t/11+3.1,e/11+8.7,3)),o+c}heightFeatures(t,e,n,i,r=!1){let o=this.theme,a=this.baseHeight(t,e),c=r?a-1:a,l=Math.abs(i),h=this.fwHalf(n),u=n>-30&&n<this.L+40,d=99;if(!r){let f=u?Ke(.45,1,Oe(h,h+40,l)):1,m=(t*this.chordDir[0]+e*this.chordDir[1])/this.chordLen,y=(this.def.el||0)/3*Oe(.1,.92,m);if(c=y+(a-y)*f,c+=(o.lateralRise||0)*re(l-(h+10),0,70),d=this.greenSdf(t,e),d<12){let g=1-Oe(0,10,d);c=Ke(c,this.greenHeight(t,e),g)}for(let g of this.teeBoxes){let p=Math.max(Math.abs(n-g.s)-6,l-5);if(p<4){let x=this.at(g.s),b=this.teeHeight(g);c=Ke(c,b,1-Oe(0,4,p))}}if(this.valley){let g=this.G[0]-this.gT[0]*(this.gry+5),p=this.G[1]-this.gT[1]*(this.gry+5),x=(t-g)**2+(e-p)**2;c-=1.3*Math.exp(-x/72)*Oe(-6,2,d)}}for(let f of this.shapes){if(f.rad&&!f.band){let g=t-f.cx,p=e-f.cy;if(g*g+p*p>(f.rad+8)**2)continue}let m=f.sdf(t,e,n,i),y=f.inGreen?1:Oe(0,2.5,d);if(f.surf===L.WATER){let g=f.level;m<0?c=Math.min(c,g-.05-f.depth*Oe(0,4,-m)):f.kind==="ocean"?m<3.5?c=Ke(g-1.2,Math.max(c,g+3),Oe(0,3.5,m)):c=Math.max(c,g+3+(m-3.5)*.05):m<6&&(c=Ke(c,Math.max(c,g+.12+m*.07),y))}else{if(r)continue;if(f.surf===L.BRUSH){if(m<0){let g=f.depth*Oe(0,10,-m);c-=g+.8*this.noise.noise(t/5,e/5)*Oe(0,4,-m)}}else if(f.surf===L.SAND){if(y<=0)continue;m<0?(c-=f.depth*Oe(0,2,-m)*y,f.kind==="pews"&&(n-f.s1)/7%1>.72&&(c+=f.depth*.9)):m<1.6&&(c+=.22*(1-m/1.6)*(f.inGreen?.3:y))}else f.surf===L.WASTE?m<0&&(c-=f.depth*Oe(0,3,-m)):f.surf===L.DEEP&&f.depth<0&&m<0&&(c-=f.depth*Oe(0,5,-m))}}return c}greenHeight(t,e){this._gh0===void 0&&(this._gh0=this.baseHeight(this.G[0],this.G[1])+.35);let[n,i]=this.greenLocal(t,e),r=this._gh0+this.gTilt[0]*n+this.gTilt[1]*i;if(r+=this.gUnd*this.noise.fbm(t/17+91,e/17+7,2),this.gTier){let o=this.gTier,a=i*Math.cos(o.ang)+n*Math.sin(o.ang)-o.off;r+=o.h*Oe(-3.2,3.2,a)}if(this.dome){let o=n/this.grx,a=i/this.gry;r-=.42*(o*o+a*a)}return r}teeHeight(t){if(!t.h){let e=this.at(t.s);t.h=this.baseHeight(e.x,e.y)+(this.par===3?1.4:.6)}return t.h}classify(t,e,n,i){let r=Math.abs(i),o=!1,a=!1,c=!1,l=!1;for(let m of this.shapes){if(m.rad&&!m.band){let g=t-m.cx,p=e-m.cy;if(g*g+p*p>m.rad*m.rad)continue}if(!(m.sdf(t,e,n,i)>=0)){if(m.surf===L.WATER)return L.WATER;if(m.surf===L.BRUSH)return L.BRUSH;if(m.surf===L.SAND){if(m.inGreen)return L.SAND;m.kind==="pews"&&(n-m.s1)/7%1>.72?l=!0:o=!0}else if(m.surf===L.WASTE)a=!0;else if(m.surf===L.PATH)c=!0;else if(m.surf===L.DEEP)return L.DEEP}}let h=this.greenSdf(t,e);if(h<0)return L.GREEN;if(o)return L.SAND;if(l)return L.ROUGH;if(c)return L.PATH;if(h<1.8)return L.FRINGE;if(a)return L.WASTE;for(let m of this.teeBoxes)if(Math.abs(n-m.s)<6&&r<5)return L.TEE;let u=this.fwHalf(n);if(this.theme.cartPath&&n>12&&n<this.L-30&&!this.def.range){let m=this.cartSide*(u+21+3*this.noise.n1(n/60+3));if(Math.abs(i-m)<1.3)return L.PATH}let d=n>this.fStart&&n<this.L+4;if(d&&r<u)return L.FAIRWAY;if(h<5.5||d&&r<u+2.2||this.links&&n>-10&&n<this.L+30&&r<u+3)return L.FIRSTCUT;let f=22+7*this.noise.n1(n/30+5);return r<u+f&&n>-25&&n<this.L+40?this.theme.sandyRough&&this.noise.noise(t/14,e/14)>.05?L.WASTE:L.ROUGH:this.theme.sandyRough?L.WASTE:L.DEEP}buildGrid(){let t=1e9,e=-1e9,n=1e9,i=-1e9;for(let u=0;u<this.nC;u++)this.cs[u]<-40||this.cs[u]>this.L+70||(t=Math.min(t,this.cx[u]),e=Math.max(e,this.cx[u]),n=Math.min(n,this.cy[u]),i=Math.max(i,this.cy[u]));let r=140;t=Math.floor(t-r),e=Math.ceil(e+r),n=Math.floor(n-90),i=Math.ceil(i+100),this.gx0=t,this.gy0=n,this.gnx=e-t+1,this.gny=i-n+1;let o=this.gnx,a=this.gny,c=o*a;this.gS=new Float32Array(c),this.gD=new Float32Array(c),this.gH=new Float32Array(c);let l=[0,0],h=34;for(let u=0;u<a;u++){let d=n+u;for(let f=0;f<o;f++){let m=t+f;this.nearest(m,d,l);let y=u*o+f;this.gS[y]=l[0],this.gD[y]=l[1];let g=this.heightFeatures(m,d,l[0],l[1]),p=Math.min(f,u,o-1-f,a-1-u);if(p<h){let x=this.heightFeatures(m,d,l[0],l[1],!0);g=Ke(x,g,Oe(2,h,p))}this.gH[y]=g}}this.snx=o*2-1,this.sny=a*2-1,this.surf=new Uint8Array(this.snx*this.sny),this.stripe=new Uint8Array(this.snx*this.sny);for(let u=0;u<this.sny;u++){let d=n+u*.5,f=u>>1,m=Math.min(a-1,f+(u&1));for(let y=0;y<this.snx;y++){let g=t+y*.5,p=y>>1,x=Math.min(o-1,p+(y&1)),b=f*o+p,v=f*o+x,E=m*o+p,A=m*o+x,w=(this.gS[b]+this.gS[v]+this.gS[E]+this.gS[A])*.25,R=(this.gD[b]+this.gD[v]+this.gD[E]+this.gD[A])*.25;Math.sign(this.gD[b])!==Math.sign(this.gD[A])&&Math.abs(this.gD[b])>5&&(w=this.gS[b],R=this.gD[b]);let M=u*this.snx+y;this.surf[M]=this.classify(g,d,w,R),this.stripe[M]=Math.floor(w/9)&1}}}classifyAt(t,e){let n=re(t-this.gx0,0,this.gnx-1.001),i=re(e-this.gy0,0,this.gny-1.001),r=Math.floor(n),o=Math.floor(i),a=n-r,c=i-o,l=this.gnx,h=o*l+r,u=this.gS,d=this.gD;if(Math.sign(d[h])!==Math.sign(d[h+l+1])&&Math.abs(d[h])>5)return this.classify(t,e,u[h],d[h]);let f=(u[h]*(1-a)+u[h+1]*a)*(1-c)+(u[h+l]*(1-a)+u[h+l+1]*a)*c,m=(d[h]*(1-a)+d[h+1]*a)*(1-c)+(d[h+l]*(1-a)+d[h+l+1]*a)*c;return this.classify(t,e,f,m)}inGrid(t,e){return t>=this.gx0&&e>=this.gy0&&t<=this.gx0+this.gnx-1&&e<=this.gy0+this.gny-1}heightAt(t,e){let n=re(t-this.gx0,0,this.gnx-1.001),i=re(e-this.gy0,0,this.gny-1.001),r=Math.floor(n),o=Math.floor(i),a=n-r,c=i-o,l=this.gnx,h=this.gH,u=o*l+r,d=h[u],f=h[u+1],m=h[u+l],y=h[u+l+1];return(d*(1-a)+f*a)*(1-c)+(m*(1-a)+y*a)*c}gradAt(t,e){return[(this.heightAt(t+.5,e)-this.heightAt(t-.5,e))/(2*.5),(this.heightAt(t,e+.5)-this.heightAt(t,e-.5))/(2*.5)]}surfAt(t,e){if(!this.inGrid(t,e))return L.DEEP;let n=Math.round((t-this.gx0)*2),i=Math.round((e-this.gy0)*2);return this.surf[re(i,0,this.sny-1)*this.snx+re(n,0,this.snx-1)]}sdAt(t,e){return this.nearest(t,e,[0,0])}isOB(t,e){if(t<this.gx0+6||e<this.gy0+6||t>this.gx0+this.gnx-6||e>this.gy0+this.gny-6)return!0;let[i,r]=this.nearest(t,e),o=this.links?120:100;return Math.abs(r)>o+(this.def.fw||32)/2||i<-45||i>this.L+75}waterLevelAt(t,e){let[n,i]=this.nearest(t,e);for(let r of this.waterShapes)if(r.sdf(t,e,n,i)<0)return r.level;return null}placeTrees(){let t=this.theme.trees,e=De(this.seed^2654435769);this.trees=[];let n=t.types,i=(r,o,a,c=1)=>{let l=Rg(a,r,o,e,c);l.h0=this.heightAt(r,o),this.trees.push(l)};for(let r of this.fixedTrees)i(r.x,r.y,n[0]==="palm"||n.includes("oak")?"oak":n[0]||"cypress",r.r/7);if(n.length&&t.density>0){let r=8.5/Math.sqrt(t.density);for(let o=this.gy0+4;o<this.gy0+this.gny-4;o+=r)for(let a=this.gx0+4;a<this.gx0+this.gnx-4;a+=r){let c=a+(e()-.5)*r*.9,l=o+(e()-.5)*r*.9,h=Math.round(c-this.gx0),d=Math.round(l-this.gy0)*this.gnx+h,f=this.gS[d],m=this.gD[d],y=this.surfAt(c,l);if(!(y===L.ROUGH||y===L.DEEP||y===L.WASTE))continue;let g=this.fwHalf(re(f,0,this.L)),p=Math.abs(m)-g,x=t.near+6*this.noise.noise(c/40,l/40);if(f>-15&&f<this.L+25&&p<x||f<-15&&Math.abs(m)<14||Math.hypot(c-this.G[0],l-this.G[1])<Math.max(this.grx,this.gry)+20||Math.hypot(c-this.tee[0],l-this.tee[1])<14)continue;let v=!0;for(let w of this.shapes)if((w.surf===L.WATER||w.surf===L.SAND||w.surf===L.BRUSH)&&w.sdf(c,l,f,m)<4){v=!1;break}if(!v)continue;let E=.5+this.noise.noise(c/55+3,l/55+9)*1.2,A=(t.lines?p<x+40?.8:.45:.3)*E;if(!(e()>A)&&(i(c,l,n[Math.floor(e()*n.length)]),this.trees.length>2600))break}}if(this.theme.extras.includes("straw"))for(let r of this.trees){let o=r.cr*1.25;for(let a=-o;a<=o;a+=.5)for(let c=-o;c<=o;c+=.5){if(c*c+a*a>o*o)continue;let l=Math.round((r.x+c-this.gx0)*2),h=Math.round((r.y+a-this.gy0)*2);if(l<0||h<0||l>=this.snx||h>=this.sny)continue;let u=h*this.snx+l;(this.surf[u]===L.ROUGH||this.surf[u]===L.DEEP)&&(this.surf[u]=L.STRAW)}}this.treeHash=new Map;for(let r of this.trees){let o=r.cr+1;for(let a=Math.floor((r.x-o)/10);a<=Math.floor((r.x+o)/10);a++)for(let c=Math.floor((r.y-o)/10);c<=Math.floor((r.y+o)/10);c++){let l=a*100003+c;this.treeHash.has(l)||this.treeHash.set(l,[]),this.treeHash.get(l).push(r)}}}treesNear(t,e){return this.treeHash.get(Math.floor(t/10)*100003+Math.floor(e/10))||Ag}buildDecor(){let t=De(this.seed^5370206);this.decor=this.decorSpec.slice();let e=this.number,n=this.course;if(e===18||e===9){let r=this.G,o=this.gT,a=this.gN,c=e===18?1:-1;this.decor.push({kind:"clubhouse",x:r[0]+o[0]*(this.gry+70)+a[0]*c*20,y:r[1]+o[1]*(this.gry+70)+a[1]*c*20,face:[-o[0],-o[1]],big:e===18})}if(e===1||e===10){let r=this.at(-40);this.decor.push({kind:"clubhouse",x:r.x-r.ty*45,y:r.y+r.tx*45-20,face:[r.tx,r.ty],big:e===1})}let i=this.at(this.teeS-10);for(let r=0;r<2;r++)this.decor.push({kind:"cart",x:i.x+i.ty*(13+r*2.2),y:i.y-i.tx*(13+r*2.2)-r*.5,rot:Math.atan2(i.tx,i.ty)+(t()-.5)*.3});if(this.decor.push({kind:"bench",x:i.x-i.ty*9,y:i.y+i.tx*9,rot:Math.atan2(i.tx,i.ty)}),this.theme.extras.includes("azalea"))for(let r=0;r<18;r++){let o=t()*this.L,a=t()<.5?-1:1,[c,l]=this.offset(o,a*(this.fwHalf(o)+this.theme.trees.near+2+t()*6));this.surfAt(c,l)!==L.WATER&&this.decor.push({kind:"flowers",x:c,y:l,r:5+t()*5})}if((this.def.sig||e===18)&&!this.def.range){let r=this.greenDir(t()<.5?125:-125),o=this.greenEdgeDist(r[0],r[1])+38;this.decor.push({kind:"board",x:this.G[0]+r[0]*o,y:this.G[1]+r[1]*o,face:[-this.gT[0],-this.gT[1]]})}if(this.def.sig)for(let r=0;r<2;r++){let o=r?1:-1,a=this.L-60,[c,l]=this.offset(a,o*(this.fwHalf(a)+16));this.decor.push({kind:"crowd",x:c,y:l,len:60,dir:[this.gT[0],this.gT[1]]})}}setPin(t,e=.5){let n=De(this.seed^Math.imul(t,2654435761)),i=null,r=1e9;for(let o=0;o<40;o++){let a=n()*Math.PI*2,c=Math.sqrt(n())*Ke(.35,.72,e),l=Math.cos(a)*c*this.grx,h=Math.sin(a)*c*this.gry,u=l*this.gcos+h*this.gsin,d=-l*this.gsin+h*this.gcos,f=this.G[0]+this.gN[0]*u+this.gT[0]*d,m=this.G[1]+this.gN[1]*u+this.gT[1]*d;if(this.surfAt(f,m)!==L.GREEN||this.greenSdf(f,m)>-3)continue;let y=!0;for(let b of this.shapes)b.inGreen&&b.sdf(f,m)<3&&(y=!1);if(!y)continue;let g=this.gradAt(f,m),p=Math.hypot(g[0],g[1]),x=Math.max(0,p-.025)*100+n()*.5;x<r&&(r=x,i=[f,m])}this.pin=i||[this.G[0],this.G[1]],this.pinH=this.heightAt(this.pin[0],this.pin[1])}distToPin(t,e){return Math.hypot(this.pin[0]-t,this.pin[1]-e)}},Ag=[];function gr(s,t){let e=Math.hypot(s,t)||1;return[s/e,t/e]}function Rg(s,t,e,n,i=1){let r,o,a,c=.35;switch(s){case"pine":r=22+n()*10,o=3.5+n()*1.5,a=r*.55,c=.4;break;case"longleaf":r=20+n()*8,o=3.2+n()*1.3,a=r*.68,c=.32;break;case"oak":r=12+n()*6,o=6+n()*3,a=4+n()*1.5,c=.55;break;case"maple":r=13+n()*5,o=5+n()*2,a=4,c=.45;break;case"cypress":r=9+n()*4,o=6+n()*3,a=4.5,c=.6;break;case"palm":r=11+n()*6,o=3.2+n()*1,a=r-3,c=.3;break;case"eucalyptus":r=18+n()*8,o=5+n()*2,a=7,c=.5;break;case"sycamore":r=14+n()*5,o=6+n()*2,a=5,c=.5;break;case"torreypine":r=9+n()*4,o=5+n()*2,a=4,c=.4;break;default:r=14,o=5,a=5}return r*=i,o*=i,a*=i,{type:s,x:t,y:e,ht:r,cr:o,cb:a,tr:c,rot:n()*Math.PI*2,seed:n()}}function je(s){let t=parseInt(s.replace("#",""),16);return[t>>16&255,t>>8&255,t&255]}function Pu(s){let t=s.theme,e=s.snx,n=s.sny,i=document.createElement("canvas");i.width=e,i.height=n;let r=i.getContext("2d"),o=r.createImageData(e,n),a=o.data,c=[];c[L.DEEP]=je(t.deep),c[L.ROUGH]=je(t.rough),c[L.FIRSTCUT]=Cu(je(t.rough),je(t.fairway),.55),c[L.FAIRWAY]=je(t.fairway),c[L.FRINGE]=je(t.fringe),c[L.GREEN]=je(t.green),c[L.TEE]=je(t.tee),c[L.SAND]=je(t.sand),c[L.WASTE]=je(t.waste),c[L.WATER]=Cu(je(t.water),[60,70,40],.4),c[L.BRUSH]=je(t.brush),c[L.STRAW]=je(t.straw),c[L.PATH]=[150,146,138];let l=je(t.fairway2),h=De(s.seed),u=s.noise,d=s.surf,f=s.stripe;for(let p=0;p<n;p++){let x=s.gy0+p*.5;for(let b=0;b<e;b++){let v=s.gx0+b*.5,E=p*e+b,A=d[E],w=c[A],R=w[0],M=w[1],_=w[2],P=u.noise(v/23,x/23),N=u.noise(v/5.3+50,x/5.3+50),B=h()-.5,F=1+P*.12+N*.05;switch(A){case L.FAIRWAY:case L.TEE:f[E]&&(R=l[0],M=l[1],_=l[2]),F+=B*.03;break;case L.GREEN:{let z=Math.floor(v/3.5)+Math.floor(x/3.5)&1?1.035:.975;F=F*.35+.65,F*=z,F+=B*.02;break}case L.FRINGE:F+=B*.03;break;case L.SAND:F=1+N*.04+B*.07;break;case L.WASTE:F=1+P*.15+B*.16,h()<.08&&(R*=.6,M*=.75,_*=.45);break;case L.ROUGH:F+=B*.1;break;case L.DEEP:F+=B*.18+N*.08,t.links&&h()<.05&&(R+=30,M+=22);break;case L.STRAW:F=1+N*.2+B*.3;break;case L.BRUSH:F=1+N*.3+B*.3,h()<.2&&(R*=.7,M*=.9,_*=.6);break;default:F+=B*.05}a[E*4]=Fi(R*F),a[E*4+1]=Fi(M*F),a[E*4+2]=Fi(_*F),a[E*4+3]=255}}let m=p=>c[p]||c[L.ROUGH],y=[[-.17,-.17],[.17,-.17],[-.17,.17],[.17,.17],[0,0]];for(let p=1;p<n-1;p++)for(let x=1;x<e-1;x++){let b=p*e+x,v=d[b];if(v===d[b-1]&&v===d[b+1]&&v===d[b-e]&&v===d[b+e]||v===L.STRAW||d[b-1]===L.STRAW||d[b+1]===L.STRAW)continue;let E=s.gx0+x*.5,A=s.gy0+p*.5,w=[a[b*4]/m(v)[0],a[b*4+1]/m(v)[1],a[b*4+2]/m(v)[2]],R=0,M=0,_=0;for(let[N,B]of y){let F=N===0&&B===0?v:s.classifyAt(E+N,A+B),z=m(F);R+=z[0],M+=z[1],_+=z[2]}let P=y.length;a[b*4]=Fi(R/P*Math.min(1.3,w[0]||1)),a[b*4+1]=Fi(M/P*Math.min(1.3,w[1]||1)),a[b*4+2]=Fi(_/P*Math.min(1.3,w[2]||1))}Cg(a,e,n),r.putImageData(o,0,0);let g=new Cn(i);return g.flipY=!1,g.colorSpace=Pe,g.anisotropy=8,g.generateMipmaps=!0,g.minFilter=Ln,g.magFilter=rn,g.userData.canvas=i,g}function Cg(s,t,e){let n=new Uint8ClampedArray(s);for(let i=1;i<e-1;i++)for(let r=1;r<t-1;r++){let o=(i*t+r)*4;for(let a=0;a<3;a++){let c=n[o+a]*4+n[o+a-4]+n[o+a+4]+n[o+a-t*4]+n[o+a+t*4];s[o+a]=c>>3}}}function Cu(s,t,e){return[s[0]+(t[0]-s[0])*e,s[1]+(t[1]-s[1])*e,s[2]+(t[2]-s[2])*e]}function Fi(s){return s<0?0:s>255?255:s}var ui=null;function Iu(){if(ui)return ui;let s=256,t=document.createElement("canvas");t.width=t.height=s;let e=t.getContext("2d"),n=e.createImageData(s,s),i=De(77),r=[];for(let o=0;o<14;o++)r.push([Math.floor(i()*12)+1,Math.floor(i()*12)+1,i()*6.28,.5/(o*.4+1)]);for(let o=0;o<s;o++)for(let a=0;a<s;a++){let c=0;for(let[h,u,d,f]of r)c+=Math.sin((a*h+o*u)/s*Math.PI*2+d)*f;c=128+c*26+(i()-.5)*70;let l=(o*s+a)*4;n.data[l]=n.data[l+1]=n.data[l+2]=Fi(c),n.data[l+3]=255}return e.putImageData(n,0,0),ui=new Cn(t),ui.wrapS=ui.wrapT=fn,ui.colorSpace=mn,ui.anisotropy=8,ui}var Ni=null;function Lu(){if(Ni)return Ni;let s=256,t=document.createElement("canvas");t.width=t.height=s;let e=t.getContext("2d"),n=e.createImageData(s,s),i=De(5),r=[];for(let a=0;a<18;a++)r.push([Math.floor(i()*16)-8,Math.floor(i()*16)-8,i()*6.28,1/(a*.3+1)]);let o=(a,c)=>{let l=0;for(let[h,u,d,f]of r)l+=Math.sin((a*h+c*u)/s*Math.PI*2+d)*f;return l};for(let a=0;a<s;a++)for(let c=0;c<s;c++){let l=o(c+1,a)-o(c-1,a),h=o(c,a+1)-o(c,a-1),u=-l*1.2,d=-h*1.2,f=1,m=Math.hypot(u,d,f),y=(a*s+c)*4;n.data[y]=(u/m*.5+.5)*255,n.data[y+1]=(d/m*.5+.5)*255,n.data[y+2]=(f/m*.5+.5)*255,n.data[y+3]=255}return e.putImageData(n,0,0),Ni=new Cn(t),Ni.wrapS=Ni.wrapT=fn,Ni.colorSpace=mn,Ni}function Ra(s,t,e){let n=document.createElement("canvas");n.width=s,n.height=t,e(n.getContext("2d"),s,t);let i=new Cn(n);return i.colorSpace=Pe,i}function Uu(s,t=!1){let e=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,c=new ce,l=0;for(let h=0;h<s.length;++h){let u=s[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0,u=[];for(let d=0;d<s.length;++d){let f=s[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=s[d].attributes.position.count}c.setIndex(u)}for(let h in r){let u=Du(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let y=0;y<o[h].length;++y)f.push(o[h][y][d]);let m=Du(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function Du(s){let t,e,n,i=-1,r=0;for(let l=0;l<s.length;++l){let h=s[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new oe(o,e,n),c=0;for(let l=0;l<s.length;++l){let h=s[l];if(h.isInterleavedBufferAttribute){let u=c/e;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<e;m++){let y=h.getComponent(d,m);a.setComponent(d+u,m,y)}}else o.set(h.array,c);c+=h.count*e}return i!==void 0&&(a.gpuType=i),a}var Pg={pine:"#2d4a25",longleaf:"#3c5b29",oak:"#3b5d28",maple:"#4a6b2a",cypress:"#2a4a2d",palm:"#4f7c32",eucalyptus:"#667c4c",sycamore:"#557a38",torreypine:"#3b5a33"},Ig={pine:"#5a3d28",longleaf:"#5b412c",oak:"#4a3a2a",maple:"#4d3b2b",cypress:"#4a3a30",palm:"#8a7458",eucalyptus:"#b7ab98",sycamore:"#bfb4a2",torreypine:"#5a4535"};function Nu(s,t,e,n=.55){let i=s.attributes.position,r=new Float32Array(i.count*3),o=new At(t),a=1/0,c=-1/0;for(let l=0;l<i.count;l++)a=Math.min(a,i.getY(l)),c=Math.max(c,i.getY(l));for(let l=0;l<i.count;l++){let h=(i.getY(l)-a)/Math.max(.001,c-a),u=Math.min(1,Math.hypot(i.getX(l),i.getZ(l))),d=(n+(1-n)*h)*(.8+.25*u)*(.9+e()*.2);r[l*3]=o.r*d,r[l*3+1]=o.g*d,r[l*3+2]=o.b*d}return s.setAttribute("color",new oe(r,3)),s}function Lg(s,t,e){let n=s.attributes.position,i=new Map;for(let r=0;r<n.count;r++){let o=`${n.getX(r).toFixed(3)},${n.getY(r).toFixed(3)},${n.getZ(r).toFixed(3)}`;i.has(o)||i.set(o,[(e()-.5)*t,(e()-.5)*t,(e()-.5)*t]);let a=i.get(o);n.setXYZ(r,n.getX(r)+a[0],n.getY(r)+a[1],n.getZ(r)+a[2])}return s.computeVertexNormals(),s}function ki(s,t,e,n,i=1,r=1,o=1,a=1,c){let l=new ri(s,a);return l=(l.toNonIndexed,l),l.scale(i,r,o),l.translate(t,e,n),l}function Fu(s,t){let e=De(s.length*131+t*17),n=[];switch(s){case"pine":{for(let o=0;o<4;o++){let a=o*.22,c=.42,l=1-o*.22,h=new Si(l,c,8,1,!0);h.translate((e()-.5)*.1,a+c/2,(e()-.5)*.1),n.push(h)}break}case"longleaf":{for(let o=0;o<5;o++)n.push(ki(.45,(e()-.5)*1.1,.35+e()*.45,(e()-.5)*1.1,1.1,.6,1.1,1,e));break}case"cypress":{let o=(e()-.5)*.6;for(let a=0;a<4;a++)n.push(ki(.55,o*a*.4+(e()-.5)*.7,.2+a*.22,(e()-.5)*.7,1.6,.45,1.3,1,e));break}case"palm":{for(let o=0;o<10;o++){let a=o/10*Math.PI*2+e()*.3,c=new $e(1,.22,4,1),l=c.attributes.position;for(let u=0;u<l.count;u++){let d=l.getX(u)+.5;l.setY(u,l.getY(u)),l.setZ(u,-d*d*.55),l.setX(u,d)}c.rotateX(-Math.PI/2),c.rotateZ(0);let h=new Vt().makeRotationY(a);c.applyMatrix4(h),c.translate(0,.75,0),n.push(c)}n.push(ki(.16,0,.72,0,1,1,1,0,e));break}case"eucalyptus":case"torreypine":{for(let a=0;a<5;a++)n.push(ki(.5,(e()-.5)*1.1,.3+e()*.5,(e()-.5)*1.1,1,.75,1,1,e));break}default:{n.push(ki(.62,0,.5,0,1.05,.85,1.05,1,e));for(let o=0;o<5;o++){let a=o/5*Math.PI*2+e()*.5;n.push(ki(.42+e()*.12,Math.cos(a)*.52,.35+e()*.35,Math.sin(a)*.52,1,.85,1,1,e))}n.push(ki(.4,0,.8,0,1,.8,1,1,e))}}let i=n.map(o=>o.index?o.toNonIndexed():o);i.forEach(o=>{o.attributes.uv||o.setAttribute("uv",new oe(new Float32Array(o.attributes.position.count*2),2))});let r=Uu(i.map(o=>{let a=o.clone();return a.deleteAttribute("uv"),a}));return s!=="palm"?Lg(r,.12,e):r.computeVertexNormals(),Nu(r,Pg[s]||"#3b5d28",e,s==="palm"?.75:.5),r}function Dg(s){let t=s==="palm"?new qt(.75,1,1,6,4,!0):new qt(.55,1,1,6,1,!0);if(t.translate(0,.5,0),s==="palm"){let n=t.attributes.position;for(let i=0;i<n.count;i++){let r=n.getY(i);n.setX(i,n.getX(i)+r*r*3)}t.computeVertexNormals()}let e=De(3);return Nu(t,Ig[s]||"#4a3a2a",e,.7),t}function ku(s,t){let e=new $t,n=new Map;for(let d of s.trees)n.has(d.type)||n.set(d.type,[]),n.get(d.type).push(d);let i=new Ee({vertexColors:!0,roughness:.92,metalness:0,side:be}),r=new Ee({vertexColors:!0,roughness:.95}),o=new Vt,a=new Ne,c=new D,l=new D,h=new At,u=new D(0,1,0);for(let[d,f]of n)for(let y=0;y<3;y++){let g=f.filter((E,A)=>A%3===y);if(!g.length)continue;let p=Fu(d,y),x=new Ge(p,i,g.length),b=Dg(d),v=new Ge(b,r,g.length);g.forEach((E,A)=>{let w=t(E.x,E.y,E.h0-.3),R=d==="palm"?E.ht*.97:E.cb+(E.ht-E.cb)*.35;a.setFromAxisAngle(u,E.rot);let M=d==="palm"?.06:0;c.set(E.tr*(d==="palm"?1:1.2),R,E.tr*(d==="palm"?1:1.2)),o.compose(w,a,c),v.setMatrixAt(A,o),l.copy(w),l.y+=E.cb,d==="palm"&&(l.x+=Math.cos(-E.rot)*R*0+0);let _=E.ht-E.cb;if(c.set(E.cr,d==="palm"?Math.max(3,_):_,E.cr),d==="palm"){let N=new D(3*E.tr*1,0,0).applyQuaternion(a);l.copy(w).add(N),l.y+=R-2.2,c.set(E.cr,3,E.cr)}o.compose(l,a,c),x.setMatrixAt(A,o);let P=.85+E.seed*.3;h.setRGB(P,P*(.95+E.seed*.1),P*.95),x.setColorAt(A,h)}),x.castShadow=!0,x.receiveShadow=!0,v.castShadow=!0,x.instanceMatrix.needsUpdate=!0,x.instanceColor&&(x.instanceColor.needsUpdate=!0),e.add(x,v)}return e}function Ou(s,t,e){let n=s.theme.trees;if(!n.types.length)return null;let i=De(s.seed^1234),r=n.types[0],o=Fu(r==="palm"?"oak":r,0),a=new Ee({vertexColors:!0,roughness:1}),c=900,l=new Ge(o,a,c),h=new Vt,u=new Ne,d=new D,f=s.gx0+s.gnx/2,m=s.gy0+s.gny/2,y=0;for(let g=0;g<c*3&&y<c;g++){let p=i()*Math.PI*2,x=s.gnx/2+10+i()*260,b=s.gny/2+10+i()*260,v=f+Math.cos(p)*x,E=m+Math.sin(p)*b;if(s.inGrid(v,E))continue;let A=e(v,E);if(A<(s.theme.seaLevel??-1e9)+1)continue;let w=(r==="pine"?24:15)*(.8+i()*.5);u.setFromAxisAngle(new D(0,1,0),i()*6.28),d.set(w*.4,w,w*.4),h.compose(t(v,E,A),u,d),l.setMatrixAt(y++,h)}return l.count=y,l}var Qt=(s,t=.8,e={})=>new Ee({color:s,roughness:t,...e}),Bu={antebellum:{wall:"#f4f2ea",roof:"#3f4a3f",trim:"#2f5d3a"},lodge:{wall:"#d9cdb8",roof:"#5a4b3c",trim:"#3d4a3a"},mediterranean:{wall:"#efe4d0",roof:"#b0553a",trim:"#6b5a44"},modern:{wall:"#d8d4cc",roof:"#4a4a4a",trim:"#2a2a2a"},colonial:{wall:"#f1eee6",roof:"#3a3a3a",trim:"#2a3a55"},rna:{wall:"#bfae8e",roof:"#4c4c50",trim:"#3a3a3a"},tudor:{wall:"#ece6d6",roof:"#4a3a30",trim:"#3a2a20"},spanish:{wall:"#f3eadb",roof:"#b4553a",trim:"#5a4430"}};function Hu(s,t){return Ra(256,128,(e,n,i)=>{e.fillStyle=s,e.fillRect(0,0,n,i);for(let r=0;r<2;r++)for(let o=0;o<8;o++){let a=10+o*31,c=18+r*58;e.fillStyle=t,e.fillRect(a-2,c-2,20,36),e.fillStyle="#28333d",e.fillRect(a,c,16,32),e.fillStyle="rgba(255,255,255,0.15)",e.fillRect(a,c,16,10)}})}function zu(s,t,e={}){let n=new $t,i=De(s.seed^999),r=(l,h)=>s.heightAt(l,h),o=Bu[s.theme.building]||Bu.colonial;for(let l of s.decor)switch(l.kind){case"clubhouse":n.add(Ug(l,t,r,o,i));break;case"stands":n.add(Ng(l,t,r,i));break;case"cart":n.add(Hg(l,t,r));break;case"bench":n.add(zg(l,t,r));break;case"bridge":n.add(Gg(l,t,r,s));break;case"flowers":n.add(Vg(l,t,r,i,s));break;case"gorse":n.add(Wg(l,t,r,i));break;case"wall":n.add(Xg(l,t,r));break;case"hotel":n.add($g(l,t,r));break;case"crowd":n.add(Fg(l,t,r,i));break;case"target":n.add(Bg(l,t,r));break;case"board":n.add(Og(l,t,r,s,e,i));break}let a=["#111111","#1e56b8","#f2f2f2","#c62828"];if(s.teeBoxes.forEach((l,h)=>{let u=s.at(l.s+1.5);for(let d of[-1,1]){let f=u.x+u.ty*d*3.2,m=u.y-u.tx*d*3.2,y=new Z(new ge(.1,12,8),Qt(a[h],.4));y.position.copy(t(f,m,r(f,m)+.08)),y.castShadow=!0,n.add(y)}}),s.theme.extras.includes("town")&&(s.number===18||s.number===1)){let l=s.G,h=s.gT,u=s.gN,d=s.number===18?[l[0]+h[0]*70,l[1]+h[1]*70]:s.at(-60),f=Array.isArray(d)?d[0]:d.x,m=Array.isArray(d)?d[1]:d.y;for(let y=-6;y<=6;y++){let g=f+u[0]*y*14,p=m+u[1]*y*14,x=9+i()*6,b=new Z(new ue(12,x,10),Qt(["#b8a88a","#a89878","#c7b89a","#9f9480"][y&3],.9));b.position.copy(t(g,p,r(g,p)+x/2-.5)),b.rotation.y=Math.atan2(u[0],u[1]),b.castShadow=!0,b.receiveShadow=!0,n.add(b);let v=new Z(new qt(.01,7.5,5,4),Qt("#4b4d52",.8));v.position.copy(b.position),v.position.y+=x/2+2.5,v.rotation.y=b.rotation.y+Math.PI/4,v.scale.set(1.1,1,.9),n.add(v)}}let c=s.theme.extras;return(c.includes("fescue")||c.includes("wiregrass"))&&n.add(qg(s,t,r,i,c.includes("wiregrass"))),s.oceanSide&&n.add(Yg(s,t,r,i)),n}function Ug(s,t,e,n,i){let r=new $t,o=s.big?60:36,a=s.big?26:18,c=s.big?14:10,l=new Ee({map:Hu(n.wall,n.trim),roughness:.85});l.map.wrapS=fn,l.map.repeat.set(o/30,1);let h=new Z(new ue(o,c,a),[l,l,Qt(n.roof),Qt(n.wall),l,l]);h.position.y=c/2,h.castShadow=!0,h.receiveShadow=!0,r.add(h);let u=new Z(new qt(.01,1,1,4,1),Qt(n.roof,.7));u.scale.set(o*.75,7,a*.78),u.rotation.y=Math.PI/4,u.position.y=c+3.5,u.castShadow=!0,r.add(u);for(let f=0;f<8;f++){let m=new Z(new qt(.35,.35,c*.55,8),Qt("#ffffff",.5));m.position.set(-o/2+4+f*(o-8)/7,c*.275,a/2+3),m.castShadow=!0,r.add(m)}let d=new Z(new ue(o-4,.6,7),Qt(n.roof));if(d.position.set(0,c*.56,a/2+3),r.add(d),s.big){let f=new Z(new qt(2.5,2.5,5,12),Qt("#ffffff",.6));f.position.set(0,c+8,0),r.add(f);let m=new Z(new ge(2.6,12,8,0,Math.PI*2,0,Math.PI/2),Qt(n.trim,.5));m.position.set(0,c+10.5,0),r.add(m);let y=new Z(new qt(.1,.1,8),Qt("#dddddd"));y.position.set(0,c+15,0),r.add(y)}for(let f=0;f<6;f++){let m=new $t,y=new Z(new Si(2.2,1,10),Qt(["#2f7d3a","#ffffff","#1c2a44"][f%3],.6));y.position.y=2.6,m.add(y);let g=new Z(new qt(.05,.05,2.6),Qt("#ddd"));g.position.y=1.3,m.add(g);let p=new Z(new qt(1,1,.1,12),Qt("#ffffff"));p.position.y=.9,m.add(p),m.position.set(-o/2+6+f*9,0,a/2+12+f%2*5),m.traverse(x=>{x.castShadow=!0}),r.add(m)}return r.position.copy(t(s.x,s.y,e(s.x,s.y)-.3)),r.rotation.y=Math.atan2(s.face[0],-s.face[1]),r}var Ca=null,mc=null;function Gu(s,t,e){Ca||(Ca=new Je(.22,.95,4,8),Ca.translate(0,.72,0),mc=new ge(.13,8,6),mc.translate(0,1.52,0));let n=new Ge(Ca,Qt("#ffffff",.8),s),i=new Ge(mc,Qt("#ffffff",.7),s),r=new Vt,o=new At,a=["#ffffff","#1c2a44","#c1121f","#2f7d3a","#f2c94c","#7fb3d5","#f2b8c6","#111111","#e6e2d9","#3a6ea5"],c=["#f3d2b3","#e0ac85","#c68863","#9b6a47","#6b4630"];for(let h=0;h<s;h++){let[u,d,f,m]=t[h];r.makeRotationY(m),r.setPosition(u,d,f);let y=.92+e()*.16;r.scale(new D(y,y,y)),n.setMatrixAt(h,r),i.setMatrixAt(h,r),n.setColorAt(h,o.set(a[Math.floor(e()*a.length)])),i.setColorAt(h,o.set(c[Math.floor(e()*c.length)]))}n.castShadow=!0;let l=new $t;return l.add(n,i),l.userData.crowd=n,l}function Ng(s,t,e,n){let i=new $t,r=7,o=34,a=Math.atan2(s.face[0],s.face[1]),c=t(s.x,s.y,e(s.x,s.y)),l=Qt("#e8e8e8",.6),h=Qt("#1f5a33",.8),u=[];for(let m=0;m<r;m++){let y=new Z(new ue(o,.6,1.4),m%2?l:h);y.position.set(0,m*.75+.3,m*1.4),y.castShadow=!0,y.receiveShadow=!0,i.add(y);for(let g=0;g<26;g++)n()<.85&&u.push([-o/2+.8+g*(o-1.6)/25+(n()-.5)*.3,m*.75+.6,m*1.4,Math.PI])}let d=new Z(new ue(o,6,.4),h);d.position.set(0,3,r*1.4),i.add(d);let f=Gu(u.length,u,n);return f.rotation.y=0,i.add(f),i.position.copy(c),i.rotation.y=Math.atan2(-s.face[0],s.face[1]),i}function Fg(s,t,e,n){let i=[],r=new $t,o=Math.atan2(s.dir[1],-s.dir[0]);for(let c=0;c<s.len;c++)for(let l=0;l<2;l++){if(n()<.3)continue;let h=c-s.len/2,u=s.x+s.dir[0]*h+(n()-.5)*.8+s.dir[1]*l*1.1*Math.sign(s.x||1)*0,d=s.y+s.dir[1]*h+(n()-.5)*.8,f=t(u,d,e(u,d)-.05);i.push([f.x+l*.9*s.dir[1],f.y,f.z+l*.9*s.dir[0],n()*.6-.3+o])}r.add(Gu(i.length,i,n));let a=Qt("#f0f0f0",.5);for(let c=0;c<s.len;c+=6){let l=c-s.len/2,h=s.x+s.dir[0]*l,u=s.y+s.dir[1]*l,d=new Z(new qt(.04,.04,1),a);d.position.copy(t(h,u,e(h,u)+.5)),r.add(d)}return r}var kg=["S. SCHEFFLER","R. MCILROY","J. RAHM","X. SCHAUFFELE","C. MORIKAWA","L. ABERG","B. DECHAMBEAU","J. SPIETH","V. HOVLAND","J. THOMAS"];function Og(s,t,e,n,i,r){let o=new $t,a=n.course.id==="augusta",c=a?"#1d5b33":"#15243d",l=(i.name||"YOU").toUpperCase().slice(0,14),h=i.toPar??0,u=kg.filter(y=>!l.includes(y.split(" ")[1])).slice(0,7).map(y=>({n:y,tp:Math.round(h-3+r()*7)}));u.push({n:l,tp:h,me:!0}),u.sort((y,g)=>y.tp-g.tp);let d=Ra(512,400,(y,g,p)=>{y.fillStyle=c,y.fillRect(0,0,g,p),y.strokeStyle="#e8e2c8",y.lineWidth=6,y.strokeRect(6,6,g-12,p-12),y.fillStyle="#ffffff",y.font="bold 40px Georgia, serif",y.textAlign="center",y.fillText("LEADERS",g/2,52),y.font="bold 30px Arial, sans-serif",y.textAlign="left",u.slice(0,8).forEach((x,b)=>{let v=98+b*38;y.fillStyle=x.me?"#ffd54a":"#ffffff",y.fillText(`${b+1}`,30,v),y.fillText(x.n,80,v),y.textAlign="right",y.fillStyle=x.tp<0?a?"#ff4d4d":"#ff6b6b":"#ffffff",y.fillText(x.tp===0?"E":x.tp>0?`+${x.tp}`:`${x.tp}`,g-30,v),y.textAlign="left"})}),f=new Z(new $e(10,7.8),new Ee({map:d,roughness:.8}));f.position.y=6.5,o.add(f);let m=new Z(new ue(10.6,8.4,.4),Qt(c,.9));m.position.set(0,6.5,-.25),m.castShadow=!0,o.add(m);for(let y of[-4.2,4.2]){let g=new Z(new ue(.4,3,.4),Qt("#3a3a3a"));g.position.set(y,1.5,-.3),o.add(g)}return o.position.copy(t(s.x,s.y,e(s.x,s.y))),o.rotation.y=Math.atan2(s.face[0],-s.face[1]),o}function Bg(s,t,e){let n=new $t,r={50:"#e53935",100:"#fdd835",150:"#1e88e5",200:"#ffffff",250:"#8e24aa",300:"#fb8c00"}[s.dist]||"#ffffff",o=new Z(new Pn(5.5,6.2,40),new Fe({color:r,side:be}));o.rotation.x=-Math.PI/2,n.add(o);let a=new Z(new Pn(2.6,3,32),new Fe({color:r,side:be}));a.rotation.x=-Math.PI/2,n.add(a);let c=new Z(new qt(.03,.03,2.6),Qt("#ffffff"));c.position.y=1.3,n.add(c);let l=new Z(new $e(.8,.5),new Ee({color:r,side:be}));l.position.set(.4,2.3,0),n.add(l);let h=new Z(new $e(3,1.5),new Fe({map:Ra(128,64,(u,d,f)=>{u.fillStyle="#1c2a44",u.fillRect(0,0,d,f),u.fillStyle="#fff",u.font="bold 40px sans-serif",u.textAlign="center",u.fillText(String(s.dist),d/2,46)}),side:be}));return h.position.set(-4,1.2,0),n.add(h),n.position.copy(t(s.x,s.y,e(s.x,s.y)+.05)),n}function Hg(s,t,e){let n=new $t,i=Qt("#f4f4f4",.35,{metalness:.1}),r=Qt("#222222",.6),o=new Z(new ue(1.25,.55,2.4),i);o.position.y=.55,n.add(o);let a=new Z(new ue(1.15,.3,.6),Qt("#6b4a2b",.7));a.position.set(0,.95,.15),n.add(a);let c=new Z(new ue(1.3,.08,2),i);c.position.set(0,2,.1),n.add(c);for(let[h,u]of[[-.6,-.8],[.6,-.8],[-.6,.9],[.6,.9]]){let d=new Z(new qt(.03,.03,1.2),r);d.position.set(h,1.4,u*.9),n.add(d);let f=new Z(new qt(.22,.22,.18,12),r);f.rotation.z=Math.PI/2,f.position.set(h*1.05,.22,u),n.add(f)}let l=new Z(new qt(.2,.2,.9,10),Qt("#1c2a44",.6));return l.position.set(.3,1.1,1.1),l.rotation.x=.3,n.add(l),n.traverse(h=>{h.castShadow=!0}),n.position.copy(t(s.x,s.y,e(s.x,s.y))),n.rotation.y=s.rot,n}function zg(s,t,e){let n=new $t,i=Qt("#7a5a3a",.8),r=new Z(new ue(2,.08,.5),i);r.position.y=.5,n.add(r);let o=new Z(new ue(2,.5,.06),i);o.position.set(0,.8,-.25),n.add(o);let a=new Z(new qt(.12,.12,1.1,8),Qt("#1f5a33",.5));return a.position.set(1.6,.55,0),n.add(a),n.traverse(c=>{c.castShadow=!0}),n.position.copy(t(s.x,s.y,e(s.x,s.y))),n.rotation.y=s.rot,n}function Gg(s,t,e,n){let i=new $t,r=Qt("#8f877a",.95),o=new Z(new oi(4,.9,6,16,Math.PI),r);o.scale.set(1,.45,1.3),i.add(o);let a=new Z(new ue(8.5,.35,2.4),r);a.position.y=1.9,a.scale.set(1,1,1),i.add(a),i.traverse(l=>{l.castShadow=!0,l.receiveShadow=!0});let c=n.waterLevelAt(s.x,s.y)??e(s.x,s.y);return i.position.copy(t(s.x,s.y,c-.2)),i.rotation.y=Math.atan2(s.dir[0],s.dir[1])+Math.PI/2,i}function Vg(s,t,e,n,i){let o=new ri(1,1),a=new Ge(o,Qt("#ffffff",.85),40),c=new Vt,l=new At,h=["#e0457b","#f06aa0","#c2185b","#ffffff","#f8bbd0","#d81b60"],u=0;for(let d=0;d<40;d++){let f=n()*6.28,m=Math.sqrt(n())*s.r,y=s.x+Math.cos(f)*m,g=s.y+Math.sin(f)*m,p=i.surfAt(y,g);if(p===L.WATER||p===L.FAIRWAY||p===L.GREEN||p===L.SAND)continue;let x=.7+n()*.9;c.makeScale(x*1.2,x*.8,x*1.2),c.setPosition(t(y,g,e(y,g)+x*.4)),a.setMatrixAt(u,c),a.setColorAt(u,l.set(h[Math.floor(n()*h.length)])),u++}return a.count=u,a.castShadow=!0,a}function Wg(s,t,e,n){let i=Math.min(160,Math.floor(s.rx*s.ry/8)),r=new ri(1,1),o=new Ge(r,Qt("#ffffff",.95),i),a=new Vt,c=new At;for(let l=0;l<i;l++){let h=n()*6.28,u=Math.sqrt(n()),d=Math.cos(h)*u*s.rx,f=Math.sin(h)*u*s.ry,m=Math.cos(s.rot),y=Math.sin(s.rot),g=s.x+d*m+f*y,p=s.y-d*y+f*m,x=1+n()*1.4;a.makeScale(x*1.3,x*.8,x*1.3),a.setPosition(t(g,p,e(g,p)+x*.3)),o.setMatrixAt(l,a),o.setColorAt(l,c.set(n()<.35?"#b5a52a":"#3f5626"))}return o.castShadow=!0,o}function Xg(s,t,e){let n=new $t,i=Qt("#8a7f70",.95),r=Math.floor(s.len/4);for(let o=0;o<r;o++){let a=(o-r/2)*4,c=s.x+s.dir[0]*a,l=s.y+s.dir[1]*a,h=new Z(new ue(4.1,1.5,.6),i);h.position.copy(t(c,l,e(c,l)+.6)),h.rotation.y=Math.atan2(s.dir[1],-s.dir[0])+Math.PI/2,h.castShadow=!0,n.add(h)}return n}function $g(s,t,e){let n=new $t,i=Hu("#8f7a60","#4a3a2a");i.wrapS=i.wrapT=fn,i.repeat.set(3,2);let r=new Z(new ue(70,20,22),Qt("#ffffff",.9,{map:i}));r.position.y=10,r.castShadow=!0,n.add(r);let o=new Z(new ue(40,6,10),Qt("#2f4f2f",.8));return o.position.set(0,3,-25),o.castShadow=!0,n.add(o),n.position.copy(t(s.x,s.y,e(s.x,s.y))),n.rotation.y=s.rot,n}function qg(s,t,e,n,i){let o=[];for(let d=0;d<7;d++){let f=d/7*Math.PI*2,m=.25+d%3*.12,y=Math.cos(f),g=Math.sin(f),p=.05;o.push(-g*p,0,y*p,g*p,0,-y*p,y*m,1-d%2*.25,g*m)}let a=new ce;a.setAttribute("position",new Wt(o,3)),a.computeVertexNormals();let c=new Ge(a,Qt(i?"#a39a5a":"#b3a563",1,{side:be}),2500),l=new Vt,h=new At,u=0;for(let d=0;d<2500*6&&u<2500;d++){let f=s.gx0+n()*s.gnx,m=s.gy0+n()*s.gny,y=s.surfAt(f,m);if(!(y===L.DEEP||i&&y===L.WASTE))continue;let g=.6+n()*.9;l.makeScale(g*1.4,g*(i?.9:1.3),g*1.4),l.setPosition(t(f,m,e(f,m)-.05)),c.setMatrixAt(u,l),c.setColorAt(u,h.setHSL(.14+n()*.05,.35,.45+n()*.15)),u++}return c.count=u,c}function Yg(s,t,e,n){let r=new tr(1,0),o=new Ge(r,Qt("#6f675d",.95,{flatShading:!0}),300),a=new Vt,c=new Ne,l=new D,h=0,u=s.oceanSide,d=s.oceanOff;for(let f=0;f<300*3&&h<300;f++){let m=-40+n()*(s.L+120),[y,g]=s.offset(m,u*(d+1+n()*6)),p=s.theme.seaLevel??-8,x=.8+n()*3;c.setFromEuler(new on(n()*3,n()*3,n()*3)),l.set(x,x*.8,x),a.compose(t(y,g,Math.max(p,e(y,g))-x*.2),c,l),o.setMatrixAt(h++,a)}return o.count=h,o.castShadow=!0,o.receiveShadow=!0,o}var Bt=(s,t,e)=>new D(s,e,-t),yr=class{constructor(t){this.canvas=t;let e=this.renderer=new Sa({canvas:t,antialias:!0,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.outputColorSpace=Pe,e.toneMapping=Fo,e.toneMappingExposure=1,e.shadowMap.enabled=!0,e.shadowMap.type=Ro,this.scene=new ls,this.camera=new ze(55,1,.05,12e3),this.clock=new ar,this.time=0,this.holeGroup=new $t,this.scene.add(this.holeGroup),this.fx=[],this.pmrem=new vs(e),this.setupLights(),this.setupBall(),this.resize(),window.addEventListener("resize",()=>this.resize())}setQuality(t){this.quality=t;let e=window.devicePixelRatio||1,n=this.renderer;n.setPixelRatio(t==="high"?Math.min(e,2):t==="medium"?Math.min(e,1.25):1),n.shadowMap.enabled=t!=="low";let i=t==="high"?2048:1024;this.sun.shadow.mapSize.x!==i&&(this.sun.shadow.mapSize.set(i,i),this.sun.shadow.map&&(this.sun.shadow.map.dispose(),this.sun.shadow.map=null)),this.scene.traverse(r=>{r.material&&(Array.isArray(r.material)?r.material:[r.material]).forEach(a=>{a.needsUpdate=!0})}),this.resize()}resize(){let t=window.innerWidth,e=window.innerHeight;this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix()}setupLights(){this.hemi=new sr(13625087,4872752,1.1),this.scene.add(this.hemi);let t=this.sun=new or(16777215,3);t.castShadow=!0,t.shadow.mapSize.set(2048,2048);let e=t.shadow.camera;e.left=-70,e.right=70,e.top=70,e.bottom=-70,e.near=1,e.far=900,t.shadow.bias=-4e-4,t.shadow.normalBias=.05,this.scene.add(t,t.target)}setupBall(){let t=new ge(.0233,20,14);this.ballMat=new Ee({color:16777215,roughness:.35,emissive:2236962}),this.ball=new Z(t,this.ballMat),this.ball.castShadow=!0,this.scene.add(this.ball);let e=new Z(new ge(1,12,8),new Fe({color:16777215,transparent:!0,opacity:0,depthWrite:!1}));this.ballHalo=e,this.scene.add(e),this.trailMax=1200;let n=new ce;n.setAttribute("position",new oe(new Float32Array(this.trailMax*3),3)),n.setAttribute("color",new oe(new Float32Array(this.trailMax*3),3)),n.setDrawRange(0,0),this.trail=new si(n,new Wn({vertexColors:!0,transparent:!0,opacity:.9,depthWrite:!1})),this.trail.frustumCulled=!1,this.scene.add(this.trail),this.trailN=0,this.tee=new Z(new qt(.004,.002,.06,6),new Ee({color:15921906})),this.scene.add(this.tee)}setBallStyle(t){this.ballMat.color.set(t||"#ffffff")}setCourseEnv(t,e){this.theme=e,this.sky&&(this.scene.remove(this.sky),this.sky.geometry.dispose(),this.sky.material.dispose()),this.sky=dc(e),this.scene.add(this.sky),this.scene.fog=new Ys(new At(e.fog),e.fogDensity*.7);let n=fc(e);this.sunDir=n,this.sun.color.set(e.sun.color),this.sun.intensity=e.sun.intensity,this.hemi.color.set(e.sky[1]),this.hemi.groundColor.set(e.rough).multiplyScalar(.6);let i=new ls,r=dc(e);r.scale.setScalar(.01),i.add(r),this.envRT&&this.envRT.dispose(),this.envRT=this.pmrem.fromScene(i,.02),this.scene.environment=this.envRT.texture,this.scene.environmentIntensity=.55}clearHole(){let t=this.holeGroup;for(t.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(i=>{i.map&&i.map!==this._detail&&i.map.dispose(),i.dispose()})});t.children.length;)t.remove(t.children[0]);this.water=[]}loadHole(t,e={}){this.clearHole(),this.hideGrass(),this.hole=t;let n=this.holeGroup;n.add(this.buildTerrain(t)),n.add(this.buildFarTerrain(t));for(let o of this.buildWater(t))n.add(o);n.add(ku(t,Bt));let i=Ou(t,Bt,(o,a)=>t.heightFeatures(o,a,...t.nearest(o,a),!0));i&&n.add(i);let r=zu(t,Bt,e);n.add(r),this.crowds=[],r.traverse(o=>{o.userData.crowd&&this.crowds.push(o)}),n.add(this.buildFlag(t)),this.aimGroup=new $t,n.add(this.aimGroup),this.clearTrail()}buildTerrain(t){let n=Math.floor((t.gnx-1)/1.5)+1,i=Math.floor((t.gny-1)/1.5)+1,r=new Float32Array(n*i*3),o=new Float32Array(n*i*2);for(let f=0;f<i;f++)for(let m=0;m<n;m++){let y=t.gx0+m*1.5,g=t.gy0+f*1.5,p=f*n+m;r[p*3]=y,r[p*3+1]=t.heightAt(y,g),r[p*3+2]=-g,o[p*2]=(y-t.gx0)/(t.gnx-1),o[p*2+1]=(g-t.gy0)/(t.gny-1)}let a=new Uint32Array((n-1)*(i-1)*6),c=0;for(let f=0;f<i-1;f++)for(let m=0;m<n-1;m++){let y=f*n+m,g=y+1,p=y+n,x=p+1;a[c++]=y,a[c++]=g,a[c++]=p,a[c++]=g,a[c++]=x,a[c++]=p}let l=new ce;l.setAttribute("position",new oe(r,3)),l.setAttribute("uv",new oe(o,2)),l.setIndex(new oe(a,1)),l.computeVertexNormals();let h=Pu(t);this.terrainCanvas=h.userData.canvas;let u=new Ee({map:h,roughness:.93,metalness:0});this.addDetail(u,1);let d=new Z(l,u);return d.receiveShadow=!0,this.terrain=d,d}addDetail(t,e){let n=this._detail=Iu();t.onBeforeCompile=i=>{i.uniforms.detailMap={value:n},i.uniforms.detailStrength={value:e},i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
vWPos = (modelMatrix * vec4(transformed,1.0)).xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;
uniform sampler2D detailMap;
uniform float detailStrength;`).replace("#include <map_fragment>",`#include <map_fragment>
          float d1 = texture2D(detailMap, vWPos.xz * 0.9).r;
          float d2 = texture2D(detailMap, vWPos.xz * 0.11).r;
          float d3 = texture2D(detailMap, vWPos.xz * 0.013).r;
          float camDist = length(vWPos - cameraPosition);
          float nearF = 1.0 - smoothstep(10.0, 60.0, camDist);
          diffuseColor.rgb *= mix(1.0, 0.72 + d1 * 0.56, detailStrength * (0.35 + 0.65 * nearF));
          diffuseColor.rgb *= mix(1.0, 0.86 + d2 * 0.28, detailStrength);
          diffuseColor.rgb *= 0.92 + d3 * 0.16;`)}}buildFarTerrain(t){let i=new $e(5200,5200,160,160);i.rotateX(-Math.PI/2);let r=t.gx0+t.gnx/2,o=t.gy0+t.gny/2;i.translate(r,0,-o);let a=i.attributes.position,c=new Float32Array(a.count*3),l=new At(t.theme.deep).lerp(new At(t.theme.rough),.5),h=[0,0];for(let f=0;f<a.count;f++){let m=a.getX(f),y=-a.getZ(f);t.nearest(m,y,h);let g=t.heightFeatures(m,y,h[0],h[1],!0);t.inGrid(m,y)&&Math.min(m-t.gx0,t.gx0+t.gnx-1-m,y-t.gy0,t.gy0+t.gny-1-y)>12&&(g-=4),a.setY(f,g);let p=.85+.15*t.noise.noise(m/90,y/90);c[f*3]=l.r*p,c[f*3+1]=l.g*p,c[f*3+2]=l.b*p}i.setAttribute("color",new oe(c,3)),i.computeVertexNormals();let u=new Ee({vertexColors:!0,roughness:1});this.addDetail(u,.8);let d=new Z(i,u);return d.receiveShadow=!0,d}buildWater(t){let e=[],n=t.theme,i=Lu(),r=(a,c)=>{let l=new At(c),h={};l.getHSL(h),l.setHSL(h.h,Math.min(1,h.s*1.1),Math.min(.5,h.l*1.35));let u=new Ee({color:l,roughness:.1,metalness:.35,normalMap:i,normalScale:new Gt(.3,.3),envMapIntensity:1.6}),d=new Z(a,u);return d.receiveShadow=!0,this.water.push(d),d},o=!1;for(let a of t.waterShapes){if(a.kind==="ocean"){o=!0;continue}let c=2,l=[],h=[],u=t.gx0,d=t.gx0+t.gnx-1,f=t.gy0,m=t.gy0+t.gny-1;a.rad&&!a.band&&(u=Math.max(u,a.cx-a.rad-6),d=Math.min(d,a.cx+a.rad+6),f=Math.max(f,a.cy-a.rad-6),m=Math.min(m,a.cy+a.rad+6));let y=Math.ceil((d-u)/c)+1,g=Math.ceil((m-f)/c)+1,p=new Uint8Array(y*g),x=[0,0];for(let w=0;w<g;w++)for(let R=0;R<y;R++){let M=u+R*c,_=f+w*c;t.nearest(M,_,x),p[w*y+R]=a.sdf(M,_,x[0],x[1])<2.5?1:0}let b=new Int32Array(y*g).fill(-1),v=(w,R)=>{let M=R*y+w;return b[M]<0&&(b[M]=l.length/3,l.push(u+w*c,a.level,-(f+R*c))),b[M]};for(let w=0;w<g-1;w++)for(let R=0;R<y-1;R++){if(!(p[w*y+R]||p[w*y+R+1]||p[(w+1)*y+R]||p[(w+1)*y+R+1]))continue;let M=v(R,w),_=v(R+1,w),P=v(R,w+1),N=v(R+1,w+1);h.push(M,_,P,_,N,P)}if(!h.length)continue;let E=new ce;E.setAttribute("position",new Wt(l,3));let A=new Float32Array(l.length/3*2);for(let w=0;w<l.length/3;w++)A[w*2]=l[w*3]/30,A[w*2+1]=l[w*3+2]/30;E.setAttribute("uv",new oe(A,2)),E.setIndex(h),E.computeVertexNormals(),e.push(r(E,n.water))}if(o){let a=n.seaLevel??-8,c=new $e(9e3,9e3,1,1);c.rotateX(-Math.PI/2);let l=c.attributes.uv;for(let u=0;u<l.count;u++)l.setXY(u,l.getX(u)*300,l.getY(u)*300);let h=r(c,n.water);h.position.set(t.G[0],a,-t.G[1]),e.push(h)}return e}buildFlag(t){let e=new $t,[n,i]=t.pin,r=t.pinH,o=new Z(new qt(.012,.012,2.4,8),new Ee({color:16053492,roughness:.4}));o.position.copy(Bt(n,i,r+1.2)),o.castShadow=!0,e.add(o);let a=new $e(.6,.4,10,4);a.translate(.3,0,0);let c={augusta:"#f2c94c",pebble:"#c1121f",sawgrass:"#f2c94c",standrews:"#c1121f",oakmont:"#f2c94c",riviera:"#c1121f"}[t.course.id]||"#c1121f",l=new Z(a,new Ee({color:c,side:be,roughness:.8}));l.position.copy(Bt(n,i,r+2.15)),l.castShadow=!0,this.flag=l,this.flagBase=a.attributes.position.array.slice(),e.add(l);let h=new Z(new Xn(.059,20),new Fe({color:657930}));h.rotation.x=-Math.PI/2,h.position.copy(Bt(n,i,r+.006));let[u,d]=t.gradAt(n,i);h.lookAt(h.position.clone().add(new D(-u,1,d))),e.add(h);let f=new Z(new Pn(.059,.066,24),new Fe({color:16777215}));return f.position.copy(h.position),f.quaternion.copy(h.quaternion),e.add(f),this.pinMarker=new Z(new qt(.4,.4,.1,16),new Fe({color:16777215,transparent:!0,opacity:0})),this.pinMarker.position.copy(Bt(n,i,r+.05)),e.add(this.pinMarker),e}placeGrass(t,e,n){if(this.quality==="low")return;let i=9e3;if(!this.grass){let m=new ce,y=new Float32Array([-.03,0,0,.03,0,0,0,1,.02,0,0,-.03,0,0,.03,.02,1,0]),g=new Float32Array([.55,.55,.55,.55,.55,.55,1.1,1.1,1,.55,.55,.55,.55,.55,.55,1.1,1.1,1]);m.setAttribute("position",new oe(y,3)),m.setAttribute("color",new oe(g,3)),m.computeVertexNormals();let p=new Ee({vertexColors:!0,side:be,roughness:.9});p.onBeforeCompile=x=>{x.uniforms.uTime={value:0},this.grassUniforms=x.uniforms,x.vertexShader=x.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
            vec4 ip = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
            float sway = sin(uTime * 2.2 + ip.x * 0.7 + ip.z * 0.5) * 0.12 * position.y;
            transformed.x += sway; transformed.z += sway * 0.6;`)},this.grass=new Ge(m,p,i),this.grass.frustumCulled=!1,this.grass.receiveShadow=!0,this.scene.add(this.grass)}let r=t.theme,o=new Vt,a=new Ne,c=new D,l=new At,h={[L.ROUGH]:.09,[L.DEEP]:.22,[L.FIRSTCUT]:.05,[L.FAIRWAY]:.025,[L.TEE]:.02,[L.FRINGE]:.03,[L.STRAW]:.02},u={[L.ROUGH]:r.rough,[L.DEEP]:r.deep,[L.FIRSTCUT]:r.rough,[L.FAIRWAY]:r.fairway,[L.TEE]:r.tee,[L.FRINGE]:r.fringe,[L.STRAW]:r.straw},d=0,f=14;for(let m=0;m<i*1.5&&d<i;m++){let y=Math.random()*Math.PI*2,g=Math.sqrt(Math.random())*f,p=e+Math.cos(y)*g,x=n+Math.sin(y)*g,b=t.surfAt(p,x),v=h[b];if(!v)continue;let E=v*(.6+Math.random()*.8);a.setFromAxisAngle(new D(0,1,0),Math.random()*6.28),c.set(1+Math.random(),E,1),o.compose(new D(p,t.heightAt(p,x)-.005,-x),a,c),this.grass.setMatrixAt(d,o),l.set(u[b]).multiplyScalar(.8+Math.random()*.4),this.grass.setColorAt(d,l),d++}this.grass.count=d,this.grass.instanceMatrix.needsUpdate=!0,this.grass.instanceColor&&(this.grass.instanceColor.needsUpdate=!0),this.grass.visible=!0}hideGrass(){this.grass&&(this.grass.visible=!1)}setBall(t,e,n,i=!1){this.ball.position.copy(Bt(t,e,n+.0233+(i?.03:0))),this.tee.visible=i,i&&this.tee.position.copy(Bt(t,e,n+.02))}clearTrail(){this.trailN=0,this.trail.geometry.setDrawRange(0,0)}pushTrail(t,e,n,i){if(this.trailN>=this.trailMax)return;let r=this.trail.geometry.attributes.position,o=this.trail.geometry.attributes.color;r.setXYZ(this.trailN,t,n+.02,-e),o.setXYZ(this.trailN,i[0],i[1],i[2]),this.trailN++,r.needsUpdate=!0,o.needsUpdate=!0,this.trail.geometry.setDrawRange(0,this.trailN)}clearAim(){let t=this.aimGroup;if(t)for(t.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()});t.children.length;)t.remove(t.children[0])}showAim({path:t,landing:e,radius:n,color:i="#ffffff",ground:r=[]}){this.clearAim();let o=this.aimGroup;if(t&&t.length>1){let a=t.map(u=>Bt(u[0],u[1],u[2])),c=new ce().setFromPoints(a),l=new er({color:i,dashSize:1.6,gapSize:1.2,transparent:!0,opacity:.85,depthTest:!1}),h=new si(c,l);h.computeLineDistances(),h.renderOrder=10,o.add(h)}if(r.length>1){let a=r.map(h=>Bt(h[0],h[1],h[2]+.03)),c=new ce().setFromPoints(a),l=new si(c,new Wn({color:"#ffffff",transparent:!0,opacity:.55,depthTest:!1}));l.renderOrder=10,o.add(l)}if(e){let[a,c,l]=e,h=new Z(new Pn(n*.9,n,48),new Fe({color:i,transparent:!0,opacity:.9,side:be,depthTest:!1}));h.rotation.x=-Math.PI/2,h.position.copy(Bt(a,c,l+.15)),h.renderOrder=11,o.add(h);let u=new Z(new Xn(n*.9,48),new Fe({color:i,transparent:!0,opacity:.18,side:be,depthTest:!1}));u.rotation.x=-Math.PI/2,u.position.copy(h.position),u.renderOrder=11,o.add(u);let d=new Z(new Xn(Math.max(.3,n*.08),16),new Fe({color:i,depthTest:!1}));d.rotation.x=-Math.PI/2,d.position.copy(h.position),d.renderOrder=12,o.add(d),this.landingRing=h}}showSlopeGrid(t,e,n,i,r=1){let o=this.aimGroup,a=[],c=[],l=i>12?1.5:1;for(let d=n-i;d<=n+i;d+=l)for(let f=e-i;f<=e+i;f+=l){if((f-e)**2+(d-n)**2>i*i)continue;let m=t.surfAt(f,d);if(m!==L.GREEN&&m!==L.FRINGE)continue;let[y,g]=t.gradAt(f,d),p=Math.hypot(y,g);if(p<.002)continue;let x=Math.min(.9,p*22)*l*r,b=-y/p*x,v=-g/p*x,E=t.heightAt(f,d)+.03,A=Math.min(1,p/.04),w=new At().setHSL(.6-A*.6,.9,.6);a.push(f-b/2,E,-(d-v/2),f+b/2,t.heightAt(f+b/2,d+v/2)+.03,-(d+v/2)),c.push(w.r*.5,w.g*.5,w.b*.5,w.r,w.g,w.b)}let h=new ce;h.setAttribute("position",new Wt(a,3)),h.setAttribute("color",new Wt(c,3));let u=new Zs(h,new Wn({vertexColors:!0,transparent:!0,opacity:.85,depthTest:!0}));o.add(u)}spawnBurst(t,e,n,i){let r=i==="splash"?70:i==="sand"?50:i==="confetti"?220:20,o=new ce,a=new Float32Array(r*3),c=[],l=new Float32Array(r*3),h=i==="splash"?new At("#e8f4ff"):i==="sand"?new At(this.theme?.sand||"#eee"):i==="leaves"?new At("#3d5a2a"):new At("#8a6a4a");for(let f=0;f<r;f++){a[f*3]=t,a[f*3+1]=n,a[f*3+2]=-e;let m=Math.random()*Math.PI*2,y=i==="confetti"?3+Math.random()*6:1+Math.random()*3;c.push([Math.cos(m)*y*.6,(i==="confetti"?8:3)+Math.random()*(i==="splash"?6:3),Math.sin(m)*y*.6]);let g=i==="confetti"?new At().setHSL(Math.random(),.85,.6):h;l[f*3]=g.r,l[f*3+1]=g.g,l[f*3+2]=g.b}o.setAttribute("position",new oe(a,3)),o.setAttribute("color",new oe(l,3));let u=new us({size:i==="confetti"?.25:i==="splash"?.18:.12,vertexColors:!0,transparent:!0,opacity:1,depthWrite:!1}),d=new Js(o,u);if(d.frustumCulled=!1,this.scene.add(d),this.fx.push({pts:d,vel:c,life:i==="confetti"?4:1.6,t:0,floor:n}),i==="splash"){let f=new Z(new Pn(.2,.35,32),new Fe({color:16777215,transparent:!0,opacity:.8,side:be}));f.rotation.x=-Math.PI/2,f.position.set(t,n+.02,-e),this.scene.add(f),this.fx.push({ring:f,life:2,t:0})}}updateFx(t){for(let e=this.fx.length-1;e>=0;e--){let n=this.fx[e];if(n.t+=t,n.pts){let i=n.pts.geometry.attributes.position;for(let r=0;r<n.vel.length;r++){let o=n.vel[r];o[1]-=9*t,i.setXYZ(r,i.getX(r)+o[0]*t,Math.max(n.floor-.5,i.getY(r)+o[1]*t),i.getZ(r)+o[2]*t)}i.needsUpdate=!0,n.pts.material.opacity=Math.max(0,1-n.t/n.life)}if(n.ring){let i=1+n.t*4;n.ring.scale.set(i,i,i),n.ring.material.opacity=Math.max(0,.8-n.t/n.life)}if(n.t>n.life){let i=n.pts||n.ring;this.scene.remove(i),i.geometry.dispose(),i.material.dispose(),this.fx.splice(e,1)}}}update(t,e){this.time+=t,this.sky&&(this.sky.material.uniforms.time.value=this.time),this.grassUniforms&&(this.grassUniforms.uTime.value=this.time);for(let r of this.water||[]){let o=r.material.normalMap;o&&(o.offset.x=this.time*.01,o.offset.y=this.time*.006)}if(this.flag){let r=this.flag.geometry.attributes.position,o=this.flagBase,a=this.windStrength??.5;for(let c=0;c<r.count;c++){let l=o[c*3];r.setZ(c,Math.sin(l*6-this.time*(4+a*6))*.05*l*(.5+a))}r.needsUpdate=!0,this.windDir!==void 0&&(this.flag.rotation.y=this.windDir)}if(e){let r=this.sun,o=2,a=Math.round(e.x/o)*o,c=Math.round(e.z/o)*o;r.target.position.set(a,e.y,c),r.position.set(a+this.sunDir.x*400,e.y+this.sunDir.y*400,c+this.sunDir.z*400),r.target.updateMatrixWorld()}let n=this.camera.position.distanceTo(this.ball.position),i=Math.max(.0233,n*.0035);this.ball.scale.setScalar(i/.0233>1?Math.min(6,i/.0233):1),this.updateFx(t)}render(){this.renderer.render(this.scene,this.camera)}};var Pa=()=>new D,Ia=class{constructor(t){this.cam=t,this.pos=Pa(),this.look=Pa(),this.dPos=Pa(),this.dLook=Pa(),this.mode="address",this.rate=4,this.orbitYaw=0,this.orbitPitch=0,this.zoom=1,this.preview=0,this.fov=55,this.snapNext=!0}snap(){this.snapNext=!0}set(t,e={}){this.mode=t,this.opts=e,e.snap&&(this.snapNext=!0),this.rate=e.rate??4}update(t,e){let n=e.hole,i=(d,f)=>n.heightAt(d,f),[r,o,a]=e.ball,c=Math.sin(e.heading),l=Math.cos(e.heading),h=55;switch(this.mode){case"address":{let d=e.putt,f=e.heading+this.orbitYaw,m=Math.sin(f),y=Math.cos(f),g=this.preview,p=(d?3.8:6.8)*this.zoom,x=(d?1.6:2.6)*this.zoom+this.orbitPitch*4;if(g>.01&&e.aimDist){let b=e.aimDist*g,v=r+c*b,E=o+l*b,A=Math.max(i(v-m*25,E-y*25),i(v,E));this.dPos.copy(Bt(v-m*(25+10*g),E-y*(25+10*g),A+10+18*g));let w=r+c*Math.min(e.aimDist*1.05,b+40),R=o+l*Math.min(e.aimDist*1.05,b+40);this.dLook.copy(Bt(w,R,i(w,R)))}else{let b=Math.cos(f),v=-Math.sin(f),E=d?.3:.55,A=r-m*p+b*E,w=o-y*p+v*E,R=Math.max(i(A,w)+.6,a+x);this.dPos.copy(Bt(A,w,R));let M=d?Math.min(e.aimDist||6,6):40,_=r+m*M,P=o+y*M;this.dLook.copy(Bt(_,P,d?i(_,P)-.2:a-4.5+this.orbitPitch*-3))}h=d?50:52;break}case"player":{let d=Math.cos(e.heading),f=-Math.sin(e.heading),m=r+d*4.5+c*2.2,y=o+f*4.5+l*2.2;this.dPos.copy(Bt(m,y,Math.max(i(m,y),a)+1.3)),this.dLook.copy(Bt(r-d*.8,o-f*.8,a+.9)),h=45;break}case"follow":{let[d,f,m]=e.vel||[c,l,0],y=Math.hypot(d,f)+.001,g=d/y,p=f/y,x=e.putt?2.5:9,b=r-g*x,v=o-p*x,E=Math.max(i(b,v)+1.5,a+(e.putt?1:2.5));this.dPos.copy(Bt(b,v,E)),this.dLook.copy(Bt(r+g*3,o+p*3,a)),h=55;break}case"launch":{let d=this.opts,f=d.from[0]-c*7,m=d.from[1]-l*7;this.dPos.copy(Bt(f,m,i(f,m)+2.2)),this.dLook.copy(Bt(r,o,a)),h=50;break}case"landing":{let d=this.opts.at;if(this.opts.cam){let x=this.opts.cam;this.dPos.copy(Bt(x[0],x[1],x[2])),this.dLook.copy(Bt(r,o,a)),h=42;break}let f=this.opts.side||1,m=Math.cos(e.heading),y=-Math.sin(e.heading),g=d[0]+c*16+m*11*f,p=d[1]+l*16+y*11*f;this.dPos.copy(Bt(g,p,Math.max(i(g,p),d[2])+3.5)),this.dLook.copy(Bt(r,o,a)),h=42;break}case"green":{let d=n.pin,f=d[0]-r,m=d[1]-o,y=Math.hypot(f,m)||1;f/=y,m/=y;let g=d[0]+f*7,p=d[1]+m*7;this.dPos.copy(Bt(g,p,i(g,p)+2.4)),this.dLook.copy(Bt((r+d[0])/2,(o+d[1])/2,i((r+d[0])/2,(o+d[1])/2))),h=48;break}case"overhead":{let d=e.target||[n.pin[0],n.pin[1]],f=(r+d[0])/2,m=(o+d[1])/2,y=Math.max(40,Math.hypot(d[0]-r,d[1]-o)),g=y*1.05+20;this.dPos.copy(Bt(f-c*y*.18,m-l*y*.18,i(f,m)+g)),this.dLook.copy(Bt(f+c*2,m+l*2,i(f,m))),h=55;break}case"flyover":{let d=this.opts,f=Math.min(1,d.t),m=-30+(n.L+10)*f,y=n.at(Math.min(n.L+30,m)),g=n.at(Math.min(n.L+20,m+80)),p=45-25*f;this.dPos.copy(Bt(y.x-y.tx*20,y.y-y.ty*20,Math.max(i(y.x,y.y),0)+p)),this.dLook.copy(Bt(g.x,g.y,i(g.x,g.y))),this.rate=3,h=55;break}case"orbitGolfer":{let d=this.opts.t||0,f=3.4,m=d*.3,y=this.opts.center[0],g=this.opts.center[1],p=this.opts.center[2];this.dPos.copy(Bt(y+Math.sin(m)*f,g+Math.cos(m)*f,p+1.35));let x=window.innerWidth>900?.95:0;this.dLook.copy(Bt(y+Math.cos(m)*x,g-Math.sin(m)*x,p+.95)),h=38;break}case"menu":{let d=this.opts.t||0,f=n.L*(.25+.5*(.5+.5*Math.sin(d*.03))),m=n.at(f),y=Math.sin(d*.05);this.dPos.copy(Bt(m.x+m.ty*60*y,m.y-m.tx*60*y-40,i(m.x,m.y)+28));let g=n.at(n.L);this.dLook.copy(Bt(g.x,g.y,i(g.x,g.y))),this.rate=.8,h=50;break}case"thumb":{let d=this.opts;this.dPos.copy(d.pos),this.dLook.copy(d.look),h=d.fov||50;break}}if(this.snapNext)this.pos.copy(this.dPos),this.look.copy(this.dLook),this.fov=h,this.snapNext=!1;else{let d=1-Math.exp(-this.rate*t);this.pos.lerp(this.dPos,d),this.look.lerp(this.dLook,Math.min(1,d*1.6)),this.fov+=(h-this.fov)*d}let u=n.heightAt(this.pos.x,-this.pos.z);this.pos.y<u+.4&&(this.pos.y=u+.4),this.cam.position.copy(this.pos),this.cam.lookAt(this.look),Math.abs(this.cam.fov-this.fov)>.01&&(this.cam.fov=this.fov,this.cam.updateProjectionMatrix())}};var gc=[{id:"scheffler",name:"Scottie Scheffler",country:"USA",hand:"R",power:91,accuracy:94,shortGame:91,putting:87,recovery:93,look:{skin:1,hair:"short",hairColor:"#4a3322",hat:"cap",hatColor:"#1c2a44",shirt:"#dfe7ef",shirtStyle:"polo",pants:"#2b2f38",legs:"trousers",shoes:"#f4f4f4",glove:"#ffffff",beard:!1,glasses:!1}},{id:"mcilroy",name:"Rory McIlroy",country:"NIR",hand:"R",power:97,accuracy:85,shortGame:86,putting:85,recovery:88,look:{skin:1,hair:"curly",hairColor:"#2a1d15",hat:"cap",hatColor:"#ffffff",shirt:"#2a2a2a",shirtStyle:"polo",pants:"#bfc3c8",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1}},{id:"rahm",name:"Jon Rahm",country:"ESP",hand:"R",power:93,accuracy:89,shortGame:91,putting:86,recovery:90,look:{skin:2,hair:"short",hairColor:"#1c1510",hat:"cap",hatColor:"#0e1a33",shirt:"#0e1a33",shirtStyle:"polo",pants:"#e6e2d9",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!0,glasses:!1,build:1.15}},{id:"dechambeau",name:"Bryson DeChambeau",country:"USA",hand:"R",power:100,accuracy:80,shortGame:82,putting:87,recovery:82,look:{skin:0,hair:"short",hairColor:"#8a6a45",hat:"flatcap",hatColor:"#d9d4c7",shirt:"#f4f4f4",shirtStyle:"polo",pants:"#1c1c1c",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1,build:1.2}},{id:"spieth",name:"Jordan Spieth",country:"USA",hand:"R",power:85,accuracy:80,shortGame:94,putting:93,recovery:96,look:{skin:0,hair:"short",hairColor:"#4a3322",hat:"cap",hatColor:"#ffffff",shirt:"#3a6ea5",shirtStyle:"polo",pants:"#2b2f38",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1}},{id:"thomas",name:"Justin Thomas",country:"USA",hand:"R",power:89,accuracy:87,shortGame:92,putting:86,recovery:88,look:{skin:0,hair:"short",hairColor:"#3b2a1c",hat:"cap",hatColor:"#111111",shirt:"#111111",shirtStyle:"polo",pants:"#9aa0a6",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1}},{id:"morikawa",name:"Collin Morikawa",country:"USA",hand:"R",power:86,accuracy:97,shortGame:86,putting:82,recovery:85,look:{skin:3,hair:"short",hairColor:"#111111",hat:"cap",hatColor:"#ffffff",shirt:"#ffffff",shirtStyle:"polo",pants:"#1c2a44",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1}},{id:"hovland",name:"Viktor Hovland",country:"NOR",hand:"R",power:91,accuracy:89,shortGame:80,putting:83,recovery:84,look:{skin:0,hair:"short",hairColor:"#6d5237",hat:"cap",hatColor:"#2a2a2a",shirt:"#c7d7e6",shirtStyle:"polo",pants:"#2b2f38",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1}},{id:"schauffele",name:"Xander Schauffele",country:"USA",hand:"R",power:91,accuracy:90,shortGame:88,putting:87,recovery:89,look:{skin:2,hair:"short",hairColor:"#1a1410",hat:"cap",hatColor:"#ffffff",shirt:"#7b1f2b",shirtStyle:"polo",pants:"#ffffff",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1}},{id:"aberg",name:"Ludvig \xC5berg",country:"SWE",hand:"R",power:94,accuracy:90,shortGame:84,putting:84,recovery:85,look:{skin:0,hair:"short",hairColor:"#7a5a3a",hat:"cap",hatColor:"#1c2a44",shirt:"#1c2a44",shirtStyle:"quarterzip",pants:"#d4d0c5",legs:"trousers",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1}},{id:"korda",name:"Nelly Korda",country:"USA",hand:"R",power:84,accuracy:91,shortGame:88,putting:87,recovery:86,look:{skin:0,gender:"F",hair:"ponytail",hairColor:"#d9b77a",hat:"visor",hatColor:"#ffffff",shirt:"#f2b8c6",shirtStyle:"polo",pants:"#ffffff",legs:"skirt",shoes:"#ffffff",glove:"#ffffff",beard:!1,glasses:!1}},{id:"woods",name:"Tiger Woods",country:"USA",hand:"R",power:88,accuracy:90,shortGame:97,putting:92,recovery:98,look:{skin:4,hair:"bald",hairColor:"#111",hat:"cap",hatColor:"#111111",shirt:"#c1121f",shirtStyle:"polo",pants:"#111111",legs:"trousers",shoes:"#111111",glove:"#ffffff",beard:!1,glasses:!1}}],xr=["#f3d2b3","#e0ac85","#c68863","#9b6a47","#6b4630","#4a3021"],Vu=[{id:"short",name:"Short"},{id:"buzz",name:"Buzz"},{id:"curly",name:"Curly"},{id:"long",name:"Long"},{id:"ponytail",name:"Ponytail"},{id:"bald",name:"Bald"}],Wu=["#111111","#2a1d15","#4a3322","#7a5a3a","#b58a55","#d9b77a","#9a3a1c","#9c9c9c","#e9e9e9"],Ms=["#ffffff","#111111","#1c2a44","#1e56b8","#3a6ea5","#7fb3d5","#0d6e6e","#2f7d3a","#9ccc65","#f2c94c","#f2994a","#c1121f","#7b1f2b","#f2b8c6","#8e44ad","#bfc3c8","#6b4a2b","#d4d0c5"],yc=[{id:"none",name:"No Hat",unlock:1},{id:"cap",name:"Tour Cap",unlock:1},{id:"visor",name:"Visor",unlock:1},{id:"bucket",name:"Bucket Hat",unlock:2},{id:"flatcap",name:"Flat Cap (Scottish)",unlock:3},{id:"panama",name:"Panama",unlock:5}],xc=[{id:"polo",name:"Tour Polo",unlock:1},{id:"stripe",name:"Striped Polo",unlock:1},{id:"quarterzip",name:"Quarter-Zip",unlock:2},{id:"vest",name:"Sweater Vest",unlock:3},{id:"greenjacket",name:"Green Jacket",unlock:8,fixedColor:"#1f6b3a"}],vc=[{id:"trousers",name:"Trousers",unlock:1},{id:"shorts",name:"Shorts",unlock:1},{id:"skirt",name:"Skort",unlock:1},{id:"plusfours",name:"Plus Fours",unlock:6}],bc=[{id:"fj",name:"FootJoy Premiere Series",unlock:1},{id:"ecco",name:"ECCO Biom H5",unlock:2},{id:"adidas",name:"adidas Tour360 24",unlock:3},{id:"jordan",name:"Air Jordan 1 Low G",unlock:5}],_c=[{id:"fj",name:"FootJoy StaSof",unlock:1},{id:"titleist",name:"Titleist Players",unlock:2},{id:"tm",name:"TaylorMade Tour Preferred",unlock:3},{id:"none",name:"No Glove",unlock:1}],Mc=[{id:"none",name:"None",unlock:1},{id:"sunglasses",name:"Oakley Sunglasses",unlock:2},{id:"watch",name:"Rolex Watch",unlock:4},{id:"both",name:"Sunglasses + Watch",unlock:7}],vr={name:"You",gender:"M",skin:1,hair:"short",hairColor:"#4a3322",hat:"cap",hatColor:"#1c2a44",shirt:"#ffffff",shirtStyle:"polo",shirtAlt:"#1c2a44",pants:"#2b2f38",legs:"trousers",shoes:"#ffffff",shoeModel:"fj",glove:"#ffffff",gloveModel:"fj",accessory:"none",beard:!1,build:1};function Xu(s){return{power:s.power,driving:Math.round((s.accuracy+s.power)/2),approach:s.accuracy,shortGame:s.shortGame,putting:s.putting,recovery:s.recovery}}var Zg=1/.9144,di=(s,t,e)=>{let n=Math.min(1,Math.max(0,(e-s)/(t-s)));return n*n*(3-2*n)},Qe=(s,t,e)=>s+(t-s)*e;function _e(s,t=.75,e={}){return new Ee({color:s,roughness:t,...e})}function Jg(s,t){let e=document.createElement("canvas");e.width=16,e.height=64;let n=e.getContext("2d");n.fillStyle=s,n.fillRect(0,0,16,64),n.fillStyle=t;for(let r=0;r<64;r+=16)n.fillRect(0,r,16,6);let i=new Cn(e);return i.colorSpace=Pe,i.wrapS=i.wrapT=fn,i.repeat.set(1,3),i}var ws=class{constructor(t){this.root=new $t,this.model=new $t,this.model.scale.setScalar(Zg),this.root.add(this.model),this.pose={turn:0,hip:0,arm:0,hinge:0,head:0,rise:0,lean:0},this.clubCat="iron",this.clubLen=.95,this.build(t),this.setClub("iron",.95)}build(t){let e=this.look={...t},n=this.model;for(;n.children.length;)n.remove(n.children[0]);let i=e.build||1,r=e.gender==="F",o=_e(xr[e.skin]??e.skin??xr[1],.6),a=e.shirtStyle==="greenjacket"?"#1f6b3a":e.shirt,c=e.shirtStyle==="stripe"?_e("#ffffff",.8,{map:Jg(e.shirt,e.shirtAlt||"#1c2a44")}):_e(a,.8),l=_e(e.pants,.85),h=_e(e.shoes,.4),u=_e(e.hatColor,.7),d=_e(e.hairColor,.9),f=_e(e.glove||"#ffffff",.6);this.mats={skin:o,shirt:c,pants:l,shoe:h};let m=(r?.9:1)*i,y=new $t;n.add(y);let g=e.legs==="shorts"||e.legs==="skirt";for(let X of[-1,1]){let nt=X*.12*i,Et=new Z(new Je(.085*i,.36,4,10),l);Et.position.set(nt,.72,.03),Et.rotation.x=-.12,y.add(Et);let Yt=new Z(new Je(.065*i,.38,4,10),g?o:l);if(Yt.position.set(nt*1.05,.3,.06),Yt.rotation.x=.16,y.add(Yt),e.legs==="plusfours"){let J=new Z(new Je(.07,.2,4,8),_e("#b43b3b",.9));J.position.set(nt*1.05,.22,.07),y.add(J)}let Zt=new Z(new ue(.11,.08,.28),h);Zt.position.set(nt*1.1,.04,.1),y.add(Zt);let te=new Z(new ue(.115,.02,.29),_e("#222"));te.position.set(nt*1.1,.005,.1),y.add(te)}if(e.legs==="skirt"){let X=new Z(new qt(.19,.27,.36,14),l);X.position.set(0,.82,.02),y.add(X)}if(e.legs==="shorts")for(let X of[-1,1]){let nt=new Z(new qt(.1*i,.11*i,.3,10),l);nt.position.set(X*.12*i,.72,.02),y.add(nt)}let p=this.pelvis=new $t;p.position.set(0,.95,0),n.add(p);let x=new Z(new Je(.15*i,.12*m,4,10),l);x.rotation.z=Math.PI/2,x.scale.set(1,1,.75),p.add(x);let b=new Z(new qt(.165*i,.165*i,.04,16),_e("#1a1a1a",.4));b.position.y=.08,b.scale.set(1.05,1,.8),p.add(b);let v=this.spine=new $t;p.add(v);let E=this.torso=new $t;v.add(E);let A=new Je(.17*m,.34,6,14),w=new Z(A,c);if(w.position.y=.3,w.scale.set(1.18,1,.72),E.add(w),e.shirtStyle==="vest"){let X=new Z(A,_e(e.shirtAlt||"#1c2a44",.9));X.position.y=.28,X.scale.set(1.22,.92,.76),E.add(X)}if(e.shirtStyle==="quarterzip"||e.shirtStyle==="greenjacket"){let X=new Z(new oi(.075,.025,6,14),c);X.rotation.x=Math.PI/2,X.position.y=.6,E.add(X)}let R=new Z(new Je(.09,.3*m,4,10),c);R.rotation.z=Math.PI/2,R.position.y=.5,R.scale.set(1,1,.9),E.add(R),this.shoulderL=new Re,this.shoulderL.position.set(.2*m,.5,.02),E.add(this.shoulderL),this.shoulderR=new Re,this.shoulderR.position.set(-.2*m,.5,.02),E.add(this.shoulderR);let M=new Z(new qt(.05,.06,.1,10),o);M.position.y=.64,E.add(M);let _=this.head=new $t;_.position.y=.76,E.add(_);let P=new Z(new ge(.105,20,16),o);P.scale.set(.92,1.08,1),_.add(P);let N=new Z(new ge(.018,8,6),o);N.position.set(0,-.01,.105),_.add(N);for(let X of[-1,1]){let nt=new Z(new ge(.022,8,6),o);nt.position.set(X*.097,0,0),nt.scale.set(.5,1,.8),_.add(nt);let Et=new Z(new ge(.012,8,6),_e("#1a1a1a",.3));Et.position.set(X*.035,.02,.095),_.add(Et)}if(e.beard){let X=new Z(new ge(.1,14,10,0,Math.PI*2,Math.PI*.45,Math.PI*.4),d);X.position.set(0,-.005,.01),X.scale.set(.95,1.05,1.02),_.add(X)}let B=e.hair;if(B!=="bald"){let X=new Z(new ge(.112,18,12,0,Math.PI*2,0,Math.PI*(B==="buzz"?.45:.55)),d);if(X.position.y=.012,X.rotation.x=-.25,X.scale.set(.95,1.08,1.04),_.add(X),B==="curly")for(let nt=0;nt<14;nt++){let Et=nt/14*Math.PI*2,Yt=new Z(new ge(.035,8,6),d);Yt.position.set(Math.cos(Et)*.09,.07+Math.sin(nt*1.7)*.02,Math.sin(Et)*.09-.01),_.add(Yt)}if(B==="long"){let nt=new Z(new Je(.09,.18,4,10),d);nt.position.set(0,-.08,-.05),nt.scale.set(1.1,1,.6),_.add(nt)}if(B==="ponytail"){let nt=new Z(new Je(.035,.16,4,8),d);nt.position.set(0,-.05,-.12),nt.rotation.x=.5,_.add(nt)}}let F=e.hat;if(F==="cap"||F==="visor"){if(F==="cap"){let Et=new Z(new ge(.118,18,12,0,Math.PI*2,0,Math.PI*.5),u);Et.position.y=.025,Et.scale.set(.97,.9,1.05),_.add(Et);let Yt=new Z(new ge(.012,6,4),u);Yt.position.y=.13,_.add(Yt)}else{let Et=new Z(new qt(.113,.113,.035,18,1,!0),u);Et.position.y=.045,_.add(Et)}let X=new Z(new qt(.1,.1,.012,16,1,!1,-Math.PI/2,Math.PI),u);X.position.set(0,.035,.08),X.scale.set(1,1,.95),X.rotation.x=.12,_.add(X);let nt=new Z(new Xn(.02,12),_e("#ffffff",.5));nt.position.set(0,.08,.108),nt.rotation.x=-.4,_.add(nt)}else if(F==="bucket"||F==="panama"){let X=new Z(new qt(.1,.118,.1,18),u);X.position.y=.09,_.add(X);let nt=new Z(new qt(.19,.19,.01,22),u);if(nt.position.y=.045,_.add(nt),F==="panama"){let Et=new Z(new qt(.119,.119,.025,18,1,!0),_e("#1a1a1a"));Et.position.y=.06,_.add(Et)}}else if(F==="flatcap"){let X=new Z(new ge(.125,18,10,0,Math.PI*2,0,Math.PI*.42),u);X.position.set(0,.03,.015),X.scale.set(1,.7,1.15),_.add(X);let nt=new Z(new qt(.09,.09,.01,16,1,!1,-Math.PI/2,Math.PI),u);nt.position.set(0,.04,.09),nt.scale.set(1,1,.6),_.add(nt)}if(e.accessory==="sunglasses"||e.accessory==="both"||e.glasses){let X=new Z(new ue(.15,.035,.02),_e("#101010",.1,{metalness:.6}));X.position.set(0,.02,.1),_.add(X)}let z=this.pivot=new $t;z.position.set(0,.47,.06),E.add(z);let q=this.hands=new $t;q.position.set(0,-.6,0),z.add(q);let et=new Z(new ge(.045,10,8),e.gloveModel==="none"?o:f);et.scale.set(1,1.3,1),et.position.y=.03,q.add(et);let $=new Z(new ge(.043,10,8),o);if($.scale.set(1,1.3,1),$.position.y=-.04,q.add($),e.accessory==="watch"||e.accessory==="both"){let X=new Z(new oi(.035,.01,6,12),_e("#c9b037",.3,{metalness:.9}));X.position.set(0,.1,0),X.rotation.x=Math.PI/2,q.add(X)}this.clubPivot=new $t,q.add(this.clubPivot);let ut=new qt(1,1,1,10);ut.translate(0,.5,0),this.arms=[];for(let X=0;X<2;X++){let nt=new Z(ut,e.shirtStyle==="vest"?_e(e.shirt,.8):c),Et=new Z(ut,e.shirtStyle==="quarterzip"||e.shirtStyle==="greenjacket"?c:o);n.add(nt,Et),this.arms.push({sleeve:nt,fore:Et})}this.root.traverse(X=>{X.isMesh&&(X.castShadow=!0,X.receiveShadow=!1)}),this.applyPose()}setClub(t,e){this.clubCat=t,this.clubLen=e;let n=this.clubPivot;for(;n.children.length;)n.remove(n.children[0]);let i=new $t,r=new Z(new qt(.0055,.008,e,8),_e("#cfd3d8",.25,{metalness:.9}));r.position.y=-e/2+.08,i.add(r);let o=new Z(new qt(.013,.011,.26,10),_e("#1b1b1b",.8));o.position.y=.02,i.add(o);let a;if(t==="wood"){let l=e>1.1;a=new Z(new ge(l?.062:.048,16,10),_e("#18191c",.25,{metalness:.6})),a.scale.set(1,.6,1.25),a.position.set(0,-e+.06,.045)}else t==="hybrid"?(a=new Z(new ge(.04,14,10),_e("#202226",.3,{metalness:.6})),a.scale.set(.8,.65,1.4),a.position.set(0,-e+.06,.04)):t==="putter"?(a=new Z(new ue(.03,.028,.11),_e("#b8bcc2",.2,{metalness:.95})),a.position.set(0,-e+.08,.035)):(a=new Z(new ue(.012,.05,.085),_e("#c9ccd1",.15,{metalness:.95})),a.position.set(0,-e+.08,.035),a.rotation.x=.2);a.castShadow=!0,r.castShadow=!0,i.add(a),this.clubHead=a;let c=t==="putter"?.14:t==="wood"?.42:t==="hybrid"?.36:t==="wedge"?.24:.3;i.rotation.x=-c,n.add(i),this.club=i,this.applyPose(),this.computeAddressOffset()}applyPose(){let t=this.pose,e=this.clubCat==="putter";this.pelvis.rotation.y=t.hip,this.pelvis.position.y=.95+t.rise*.05,this.pelvis.position.x=t.lean*.08,this.spine.rotation.x=e?.62:.52-t.rise*.25,this.torso.rotation.y=t.turn-t.hip,this.head.rotation.y=t.head,this.head.rotation.x=-.3+t.rise*.3;let n=e?.16:.42;this.pivot.rotation.x=-(n+this.spine.rotation.x),this.pivot.rotation.z=t.arm,this.clubPivot.rotation.z=t.hinge,this.root.updateMatrixWorld(!0);let i=new Vt().copy(this.model.matrixWorld).invert(),r=new D().setFromMatrixPosition(this.shoulderL.matrixWorld).applyMatrix4(i),o=new D().setFromMatrixPosition(this.shoulderR.matrixWorld).applyMatrix4(i),a=new D().setFromMatrixPosition(this.hands.matrixWorld).applyMatrix4(i),c=new D(0,1,0);[r,o].forEach((l,h)=>{let u=this.arms[h],d=new D().subVectors(a,l),f=d.length();d.normalize();let m=new Ne().setFromUnitVectors(c,d);u.sleeve.position.copy(l),u.sleeve.quaternion.copy(m),u.sleeve.scale.set(.058,f*.45,.058);let y=l.clone().addScaledVector(d,f*.45);u.fore.position.copy(y),u.fore.quaternion.copy(m),u.fore.scale.set(.043,f*.55,.043)})}computeAddressOffset(){let t={...this.pose};Object.assign(this.pose,{turn:0,hip:0,arm:0,hinge:0,head:0,rise:0,lean:0}),this.applyPose();let e=new D;this.clubHead.getWorldPosition(e),this.root.worldToLocal(e),this.addrOffset=e,Object.assign(this.pose,t),this.applyPose()}placeAtBall(t,e){let n=Math.atan2(-Math.cos(e),-Math.sin(e));this.root.rotation.set(0,n+Math.PI,0),this.root.rotation.y=-e+Math.PI/2-Math.PI/2,this.root.rotation.y=Math.PI/2-e,this.root.position.set(0,0,0),this.root.updateMatrixWorld(!0);let i=this.addrOffset.clone().applyEuler(this.root.rotation);this.root.position.set(t.x-i.x,t.y-this.addrOffset.y*0-.02,t.z-i.z),this.baseY=this.root.position.y}setBackswing(t){this.clubCat==="putter"?Object.assign(this.pose,{turn:-.12*t,hip:0,arm:-.42*t,hinge:0,head:.12*t,rise:0,lean:0}):Object.assign(this.pose,{turn:-1.45*t,hip:-.62*t,arm:-2.05*t,hinge:-1.55*di(.12,.8,t),head:1*t,rise:.05*t,lean:-.3*t}),this.applyPose()}setDownswing(t,e){if(this.clubCat==="putter"){this.setBackswing(t*e);return}let i={turn:-1.45*t,hip:-.62*t,arm:-2.05*t,hinge:-1.55*di(.12,.8,t),head:1*t,rise:.05*t,lean:-.3*t},r={turn:.3,hip:.55,arm:.05,hinge:0,head:-.2,rise:0,lean:.6},o=1-e,a=di(0,.6,o),c=o*o,l=di(.45,1,o);this.pose.turn=Qe(i.turn,r.turn,di(0,.85,o)),this.pose.hip=Qe(i.hip,r.hip,a),this.pose.arm=Qe(i.arm,r.arm,c*.4+o*.6),this.pose.hinge=Qe(i.hinge,r.hinge,l),this.pose.head=Qe(i.head,r.head,o),this.pose.rise=Qe(i.rise,r.rise,o),this.pose.lean=Qe(i.lean,r.lean,a),this.applyPose()}setFollow(t,e=this.clubCat==="putter",n=1){if(e)Object.assign(this.pose,{turn:.14*t*n,hip:0,arm:.5*t*n,hinge:0,head:t>.6?(t-.6)*1.2:0,rise:0,lean:0});else{let i=di(0,1,t);Object.assign(this.pose,{turn:Qe(.3,1.65,i),hip:Qe(.55,1.35,i),arm:Qe(.05,2.35*n+.2,i),hinge:Qe(0,1.45,di(.15,.85,t)),head:Qe(-.2,1.3,di(.25,.9,t)),rise:Qe(0,1,i),lean:Qe(.6,1.1,i)})}this.applyPose()}address(){this.setBackswing(0)}celebrate(t){let e=Math.max(0,Math.sin(t*7));Object.assign(this.pose,{turn:.9,hip:.6,arm:2.2+e*.5,hinge:.4,head:.5,rise:1,lean:.4}),this.applyPose()}idle(t){let e=Math.sin(t*1.4)*.03;this.pose.arm=-Math.max(0,Math.sin(t*.7))*.06,this.pose.hinge=e,this.applyPose()}dispose(){this.root.traverse(t=>{t.geometry&&t.geometry.dispose()})}};function $u(s,t){if(s==="putter")return .86;if(t==="DR")return 1.15;if(s==="wood")return 1.08;if(s==="hybrid")return 1;let e=parseInt(t,10);return isNaN(e)?.9:.99-(e-4)*.0125}var _r=9.81/.9144,fi=.5*1.225*Math.PI*.02134**2/.04593*.9144,Mr=.02134/.9144,Kg=.054/.9144,Sr=.44704/.9144,La=Math.PI*2/60,wr=[],cn=(s,t,e,n,i)=>{wr[s]={e:t,mu:e,grip:n,roll:i}};cn(L.DEEP,.07,.75,.15,.9);cn(L.ROUGH,.14,.55,.3,.45);cn(L.FIRSTCUT,.24,.4,.6,.26);cn(L.FAIRWAY,.3,.32,.8,.19);cn(L.FRINGE,.26,.38,.9,.12);cn(L.GREEN,.22,.3,1,.05);cn(L.TEE,.3,.35,.7,.19);cn(L.SAND,.03,.9,.2,1.4);cn(L.WASTE,.16,.5,.3,.4);cn(L.WATER,0,1,0,5);cn(L.BRUSH,.05,.9,0,2);cn(L.STRAW,.18,.5,.2,.42);cn(L.PATH,.55,.2,.4,.06);function Ss(s){let t=2.0002187226596675,e=s/3;return t*t/(2*e)}function qu(s){let t=.215+.26*s,e=Math.min(.32,1.9*s-2.6*s*s);return[t,Math.max(0,e)]}function Er(s,t,e,n,i={}){let r=.004166666666666667,o=4,a=[],c=[],l=n.rng||Math.random,h=t.x,u=t.y,d=t.h,f=Math.cos(e.angle),m=Math.sin(e.angle),y=Math.sin(e.heading),g=Math.cos(e.heading),p=e.speed*f*y,x=e.speed*f*g,b=e.speed*m,v=e.back*La,E=e.side*La,A=g,w=-y,R=i.putt||e.speed<.01?"roll":"fly";i.putt&&(b=0);let M=n.firmness??.6,_=Ss(n.stimp??12),P=Kg*(n.assist?.cupMul??1),N=1.78*(n.assist?.captureMul??1),B=n.wind||[0,0],F=s.pin,z=0,q=0,et=null,$=t.h,ut=!1,X={holed:!1,water:!1,ob:!1,penalty:!1},nt=0,Et=!1,Yt=s.surfAt(h,u),Zt=()=>a.push({t:z,x:h,y:u,h:d,mode:R});Zt();let te=i.flightOnly?15:40,J=s.heightAt(h,u),tt=!1,St=!1;for(;z<te;){if(z+=r,q++,R==="fly"){let bt=s.heightAt(h,u),Jt=Math.max(0,d-bt),Ae=.55+.45*Math.min(1,Jt/25),I=p-B[0]*Ae,ee=x-B[1]*Ae,It=b,Pt=Math.hypot(I,ee,It)+1e-6,gt=Math.hypot(v,E),Kt=Mr*gt/Pt,[Mt,Ht]=qu(Kt),ve=-fi*Mt*Pt*I,pe=-fi*Mt*Pt*ee,C=-fi*Mt*Pt*It-_r;if(gt>1){let G=v*A/gt,ct=v*w/gt,rt=-E/gt,yt=ct*It-rt*ee,vt=rt*I-G*It,Q=G*ee-ct*I,lt=fi*Ht*Pt;ve+=lt*yt,pe+=lt*vt,C+=lt*Q}p+=ve*r,x+=pe*r,b+=C*r,h+=p*r,u+=x*r,d+=b*r,v*=1-r/22,E*=1-r/22,d>$&&($=d);let S=s.treesNear(h,u),H=!1;for(let G=0;G<S.length;G++){let ct=S[G],rt=h-ct.x,yt=u-ct.y,vt=rt*rt+yt*yt;if(vt>ct.cr*ct.cr)continue;let Q=d-ct.h0;if(Q<0||Q>ct.ht)continue;let lt=Math.sqrt(vt);if(lt<ct.tr+Mr&&Q<ct.cb+1){let Ct=rt/(lt||1),_t=yt/(lt||1),at=p*Ct+x*_t;at<0&&(p-=1.6*at*Ct,x-=1.6*at*_t,p*=.5,x*=.5),c.push({t:z,type:"trunk",x:h,y:u,h:d});continue}if(Q>ct.cb){let Ct=(Q-ct.cb)/Math.max(1,ct.ht-ct.cb),_t=ct.type==="pine"||ct.type==="longleaf"?ct.cr*(1-Ct*.85):ct.cr*Math.sqrt(Math.max(0,1-(Ct*2-1)**2));if(lt<_t*.92){H=!0;let at=Math.pow(.12,r);p*=at,x*=at,b*=Math.pow(.4,r),p+=(l()-.5)*30*r,x+=(l()-.5)*30*r,v*=.98,E*=.95}}}if(H&&!Et&&c.push({t:z,type:"leaves",x:h,y:u,h:d}),Et=H,F&&!St){let G=h-F[0],ct=u-F[1];G*G+ct*ct<(.035+Mr)**2&&d-s.pinH<2.4&&d>s.pinH+.05&&G*p+ct*x<0&&(St=!0,p*=-.25,x*=-.25,b*=.3,c.push({t:z,type:"pin",x:h,y:u,h:d}))}let Y=s.heightAt(h,u),j=s.surfAt(h,u);if(j===L.WATER){let G=s.waterLevelAt(h,u);if(G!==null&&d<=G){d=G,c.push({t:z,type:"splash",x:h,y:u,h:d}),et===null&&(et=Math.hypot(h-t.x,u-t.y)),X.water=!0,X.penalty=!0,Zt();break}}if(d<=Y){if(d=Y,et===null){if(et=Math.hypot(h-t.x,u-t.y),c.push({t:z,type:"land",x:h,y:u,h:d,surf:j}),i.flightOnly){Zt();break}}else c.push({t:z,type:"bounce",x:h,y:u,h:d,surf:j,v:Math.hypot(p,x,b)});if(nt++,j===L.BRUSH){c.push({t:z,type:"brush",x:h,y:u,h:d}),X.penalty=!0,X.brush=!0,Zt();break}if(F&&Math.hypot(h-F[0],u-F[1])<P+Mr*.5&&Math.hypot(p,x)<9){X.holed=!0,c.push({t:z,type:"cup",x:F[0],y:F[1],h:s.pinH,dunk:!0}),h=F[0],u=F[1],d=s.pinH-.1,Zt();break}let G=wr[j]||wr[L.ROUGH],[ct,rt]=s.gradAt(h,u),yt=-ct,vt=-rt,Q=1,lt=Math.hypot(yt,vt,Q);yt/=lt,vt/=lt,Q/=lt;let Ct=p*yt+x*vt+b*Q,_t=p-Ct*yt,at=x-Ct*vt,Ot=b-Ct*Q,U=Math.abs(Ct),it=G.e*(.75+.5*M)*re(1.25-U/45,.45,1.2);(j===L.GREEN||j===L.FRINGE)&&(it*=.9+.3*M);let ht=G.mu*(1.15-.3*M),xt=Math.hypot(_t,at,Ot)||1,st=Math.hypot(p,x,b)||1,K=(U/st)**2,Tt=1.15-.45*M,Dt;if(nt===1){let ae=Math.min(1.1,v/La/1e4);Dt=1-ht-G.grip*Tt*(.55*K+.55*ae),Dt=Math.max(ae>.75&&G.grip>=.9?-.12:.02,Math.min(.92,Dt))}else Dt=Math.max(0,1-ht*.8-G.grip*Tt*.25*K);_t=_t/xt*xt*Dt,at=at/xt*xt*Dt,Ot=Ot/xt*xt*Dt,v*=.25,E*=.3,p=_t+yt*U*it,x=at+vt*U*it,b=Ot+Q*U*it,d=Y+.001,(U*it<1.2||nt>8)&&(R="roll",b=0),ut||(ut=!0)}}else{let bt=s.surfAt(h,u);Yt=bt;let Jt=wr[bt]||wr[L.ROUGH],[Ae,I]=s.gradAt(h,u),ee=bt===L.GREEN?_:Jt.roll*_r*(bt===L.FAIRWAY||bt===L.FRINGE||bt===L.FIRSTCUT?1.25-.5*M:1);bt===L.FRINGE&&(ee=Math.max(ee,_*2.2));let It=Math.hypot(p,x),Pt=-_r*Ae*5/7,gt=-_r*I*5/7;if(It>1e-4){let Kt=Math.min(ee,It/r);p+=(Pt-Kt*p/It)*r,x+=(gt-Kt*x/It)*r}else Math.hypot(Pt,gt)<ee*1.05?(p=0,x=0):(p+=Pt*r,x+=gt*r);if(h+=p*r,u+=x*r,d=s.heightAt(h,u),It=Math.hypot(p,x),F){let Kt=h-F[0],Mt=u-F[1],Ht=Math.hypot(Kt,Mt);if(Ht<P){if(It<N){X.holed=!0,c.push({t:z,type:"cup",x:F[0],y:F[1],h:s.pinH}),h=F[0],u=F[1],d=s.pinH-.08,Zt();break}else if(!tt){tt=!0;let ve=(l()-.5)*1.4,pe=Math.cos(ve),C=Math.sin(ve),S=(p*pe-x*C)*.55,H=(p*C+x*pe)*.55;p=S,x=H,c.push({t:z,type:"lip",x:h,y:u,h:d})}}else Ht>P*3&&(tt=!1)}if(bt===L.WATER){let Kt=s.waterLevelAt(h,u);if(Kt!==null&&d<=Kt+.05){d=Kt,c.push({t:z,type:"splash",x:h,y:u,h:d,roll:!0}),X.water=!0,X.penalty=!0,Zt();break}}if(bt===L.BRUSH){c.push({t:z,type:"brush",x:h,y:u,h:d}),X.penalty=!0,X.brush=!0,Zt();break}if(It<.01&&Math.hypot(Pt,gt)<ee*1.05){p=x=0,Zt();break}}q%o===0&&Zt()}et===null&&(et=Math.hypot(h-t.x,u-t.y));let Ft=s.surfAt(h,u);return!X.penalty&&!X.holed&&s.isOB(h,u)&&(X.ob=!0,X.penalty=!0),c.push({t:z,type:"rest",x:h,y:u,h:d}),{frames:a,events:c,duration:z,end:{x:h,y:u,h:d},surf:Ft,carry:et,apex:$-t.h,total:Math.hypot(h-t.x,u-t.y),...X}}function jg(s,t,e){let n=.008333333333333333,i=0,r=0,o=t*Math.PI/180,a=s*Math.cos(o),c=s*Math.sin(o),l=e*La,h=0;for(let u=0;u<2400;u++){let d=Math.hypot(a,c)+1e-6,f=Mr*l/d,[m,y]=qu(f),g=-fi*m*d*a+fi*y*d*-c,p=-fi*m*d*c+fi*y*d*a-_r;if(a+=g*n,c+=p*n,i+=a*n,r+=c*n,l*=1-n/22,r>h&&(h=r),r<0&&c<0)return{carry:i,apex:h,landAngle:Math.atan2(-c,a)*180/Math.PI,time:u*n}}return{carry:i,apex:h,landAngle:45,time:20}}var br=new Map;function Yu(s,t,e){if(s<=.5)return 0;let n=`${s.toFixed(1)}|${t.toFixed(1)}|${Math.round(e/50)}`;if(br.has(n))return br.get(n);let i=2,r=140;for(let a=0;a<28;a++){let c=(i+r)/2;jg(c,t,e).carry<s?i=c:r=c}let o=(i+r)/2;return br.size>5e3&&br.clear(),br.set(n,o),o}var Mn={normal:{id:"normal",name:"Normal",carryMul:1,launchAdd:0,launchMul:1,spinMul:1,windowMul:1,desc:"Full swing"},punch:{id:"punch",name:"Punch",carryMul:.78,launchAdd:-5,launchMul:1,spinMul:.55,windowMul:1.1,desc:"Low, under the wind & branches"},chip:{id:"chip",name:"Chip",carryMul:.36,launchAdd:0,launchMul:.6,spinMul:.45,windowMul:1.45,desc:"Low runner around the green"},pitch:{id:"pitch",name:"Pitch",carryMul:.62,launchAdd:1,launchMul:1.05,spinMul:.9,windowMul:1.25,desc:"Controlled partial wedge"},lob:{id:"lob",name:"Lob",carryMul:.55,launchAdd:9,launchMul:1,spinMul:1,windowMul:1,desc:"High & soft"},flop:{id:"flop",name:"Flop",carryMul:.4,launchAdd:20,launchMul:1,spinMul:.85,windowMul:.75,desc:"Sky-high, stops dead. Risky."},bunker:{id:"bunker",name:"Bunker",carryMul:.48,launchAdd:12,launchMul:1,spinMul:.75,windowMul:1.1,desc:"Splash it out on a cushion of sand"},putt:{id:"putt",name:"Putt",carryMul:0,launchAdd:0,launchMul:0,spinMul:0,windowMul:1,desc:"Roll it"}};function Es(s){let t=Ru[s];return{key:t,...pc[t]||pc.rough}}function Ts(s,t,e){let n=t.cat==="wedge";if(t.cat==="putter")return["putt"];let r;switch(s){case L.TEE:r=["normal","punch"],e<120&&r.push("pitch","lob");break;case L.GREEN:r=["chip"];break;case L.FRINGE:r=["chip","pitch","lob","flop"];break;case L.SAND:r=["bunker","normal","punch"];break;case L.DEEP:r=["normal","punch","pitch","chip"];break;case L.ROUGH:case L.STRAW:case L.WASTE:r=["normal","punch","pitch","chip","lob"];break;default:r=["normal","punch","pitch","chip","lob","flop"]}return r.filter(o=>!((o==="lob"||o==="flop")&&!n||o==="pitch"&&!(n||t.id==="9I"||t.id==="8I")||o==="bunker"&&t.cat==="wood"))}function Tr(s,t,e,n=50){if(s.cat==="putter")return 0;let i=Mn[t]||Mn.normal;return s.carry*i.carryMul*Da(e,t,s,n,.5)}function Da(s,t,e,n,i=Math.random()){if(s===L.SAND&&t==="bunker")return 1;let r=Es(s),[o,a]=r.dist;s===L.SAND&&e.cat==="wood"&&(o*=.7,a*=.75),s===L.TEE&&e.cat!=="wood"&&(o=a=1),(s===L.ROUGH||s===L.DEEP)&&(t==="chip"||t==="pitch")&&(o=o*.5+.5,a=a*.5+.5);let c=(n-50)/100*.6;return o=o+(a-o)*re(c+.2,0,.9),o+(a-o)*i}function Zu(s,t,e,n){if(s===L.GREEN)return"100%";let i=Math.round(Da(s,t,e,n,0)*100),r=Math.round(Da(s,t,e,n,1)*100);return i===r?`${i}%`:`${i}-${r}%`}var Qg=(s,t)=>s.cat==="wood"||s.cat==="hybrid"?t.driving:s.cat==="wedge"?t.shortGame:s.cat==="putter"?t.putting:t.approach;function Ua(s,t,e,n,i,r=1){let o=Mn[t]||Mn.normal,a=Qg(s,n),c=.075*i.window*(.7+a/100*.65)*(.75+s.forgiveness*.4)*o.windowMul;return c/=Math.sqrt(Es(e).disp),r>1&&(c*=Math.max(.35,1-(r-1)*4)),c}function wc(s=Math.random){let t=0,e=0;for(;t===0;)t=s();for(;e===0;)e=s();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*e)}function Na(s){let{club:t,typeId:e,power:n,timing:i,surf:r,attrs:o,diff:a}=s,c=s.rng||Math.random,l=s.noNoise?()=>0:wc,h=Mn[e]||Mn.normal,u=Es(r),d=Math.PI/180,f=Math.abs(i),m,y;f<.18?(m="PERFECT",y=1.015):f<.55?(m="GREAT",y=1-.02*f):f<=1?(m=i<0?"EARLY":"LATE",y=.985-.05*f):(m=i<0?"HOOK":"SLICE",y=Math.max(.62,.92-.12*(f-1))),f>2.2&&(m=i<0?"SNAP HOOK":"SHANK");let g=t.cat==="wood"?1:t.cat==="hybrid"?.85:t.cat==="iron"?.75:.45,p=t.forgiveness,x=re(i,-3,3),b=x*1*(1.35-p*.6),v=x*(Math.abs(x)>1?950:750)*g*(1.35-p*.6),E=t.cat==="wood"?1.15:t.cat==="hybrid"?1:t.cat==="iron"?.9:.35;b+=-s.shape*1.6*E,v+=s.shape*620*E;let A=s.spin||{x:0,y:0};v+=A.x*380*E;let w=t.accuracy,R=Math.max(0,n-1),M=(1-w)*5.5*a.disp*u.disp*(1+R*5)*(e==="chip"||e==="pitch"?.6:1);b+=l(c)*M*.6,v+=l(c)*M*70*g;let _=.022*a.disp*u.disp,P=t.launch*h.launchMul+h.launchAdd,N=t.spin*h.spinMul*u.spin;s.traj>0&&(P+=3.5*s.traj,N*=1+.12*s.traj),s.traj<0&&(P+=3.5*s.traj,N*=1+.15*s.traj),N*=1-.42*A.y,P-=1.5*A.y,r===L.SAND&&e==="bunker"&&(N*=.8),(r===L.ROUGH||r===L.DEEP)&&(P+=1.2),P=Math.max(e==="chip"?5:4,P),n<1&&(P*=.85+.15*n,N*=.6+.4*n);let B=o.recovery??50,F=Da(r,e,t,B,s.noNoise?.5:c()),z=s.traj?.97:1,q=t.carry*h.carryMul*n*F*y*z*(1+l(c)*_),et=Yu(Math.max(1,q),P,N);return{speed:et,heading:s.heading+b*d,angle:P*d,back:N,side:v,rating:m,quality:y,lieMul:F,targetCarry:q,ballMph:et/Sr,launchDeg:P}}function Fa(s){let{power:t,scaleYd:e,heading:n,attrs:i,diff:r,stimp:o}=s,a=s.rng||Math.random,c=Ss(o),l=Math.max(.05,t*e),h=i.putting??50,u=wc(a)*(1.25-h/100)*.55*r.putt*(.6+Math.min(1,l/15)*.6),d=1+wc(a)*.03*r.putt*(1.2-h/120),f=Math.sqrt(2*c*l)*d,m=Math.abs(u);return{speed:f,heading:n+u*Math.PI/180,angle:0,back:0,side:0,rating:m<.3?"PURE":m<.7?"GOOD":u<0?"PULLED":"PUSHED",quality:1}}var Oi=[8,15,25,40,60,90,130];function ka(s){let t=s*3*1.3;for(let e of Oi)if(e>=t)return e;return Oi[Oi.length-1]}function Oa(s,t,e){return s+t*1-e/Sr*s*.009}function Ju(s,t,e,n,i="normal"){let r=s.filter(c=>c.cat!=="putter"),o=r[r.length-1],a=r.slice().sort((c,l)=>c.carry-l.carry);for(let c of a){if(e!==L.TEE&&c.id==="DR")continue;if(Tr(c,i,e,n)>=t*.98){o=c;break}o=c}return o}var Sc=class{constructor(){this.ctx=null,this.enabled=!0,this.vol={master:.8,sfx:.9,amb:.6},this.timers=[]}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t){this.enabled=!1;return}let e=this.ctx=new t;this.master=e.createGain(),this.master.gain.value=this.vol.master,this.master.connect(e.destination),this.sfx=e.createGain(),this.sfx.gain.value=this.vol.sfx,this.sfx.connect(this.master),this.amb=e.createGain(),this.amb.gain.value=this.vol.amb,this.amb.connect(this.master),this.white=this.makeNoise("white"),this.brown=this.makeNoise("brown"),this.pink=this.makeNoise("pink")}setVolumes(t){Object.assign(this.vol,t),this.ctx&&(this.master.gain.value=this.vol.master,this.sfx.gain.value=this.vol.sfx,this.amb.gain.value=this.vol.amb)}makeNoise(t){let e=this.ctx,n=e.sampleRate*3,i=e.createBuffer(1,n,e.sampleRate),r=i.getChannelData(0),o=0,a=0,c=0,l=0;for(let h=0;h<n;h++){let u=Math.random()*2-1;t==="white"?r[h]=u:t==="brown"?(o=(o+.02*u)/1.02,r[h]=o*3.5):(a=.99765*a+u*.099,c=.963*c+u*.2965,l=.57*l+u*1.0527,r[h]=(a+c+l+u*.1848)*.2)}return i}noiseSrc(t,e=!0){let n=this.ctx.createBufferSource();return n.buffer=t,n.loop=e,n.loopStart=Math.random()*2,n}startAmbience(t,e,n){if(!this.ctx)return;this.stopAmbience();let i=this.ctx,r=i.currentTime,o=this.ambNodes=[],a=this.noiseSrc(this.brown),c=i.createBiquadFilter();c.type="lowpass",c.frequency.value=380+e*25;let l=i.createGain();l.gain.value=.05+Math.min(.35,e*.018);let h=i.createOscillator();h.frequency.value=.13;let u=i.createGain();if(u.gain.value=l.gain.value*.6,h.connect(u),u.connect(l.gain),a.connect(c),c.connect(l),l.connect(this.amb),a.start(),h.start(),o.push(a,h),!t.links){let f=this.noiseSrc(this.white),m=i.createBiquadFilter();m.type="bandpass",m.frequency.value=4200,m.Q.value=.7;let y=i.createGain();y.gain.value=.012+e*.0012;let g=i.createOscillator();g.frequency.value=.21;let p=i.createGain();p.gain.value=y.gain.value*.9,g.connect(p),p.connect(y.gain),f.connect(m),m.connect(y),y.connect(this.amb),f.start(),g.start(),o.push(f,g)}if(t.seaLevel!==void 0||n){let f=this.noiseSrc(this.pink),m=i.createBiquadFilter();m.type="lowpass",m.frequency.value=t.seaLevel!==void 0?900:1600;let y=i.createGain();y.gain.value=t.seaLevel!==void 0?.12:.025;let g=i.createOscillator();g.frequency.value=t.seaLevel!==void 0?.09:.3;let p=i.createGain();p.gain.value=y.gain.value*.85,g.connect(p),p.connect(y.gain),f.connect(m),m.connect(y),y.connect(this.amb),f.start(),g.start(),o.push(f,g)}if(t.crowd){let f=this.noiseSrc(this.pink),m=i.createBiquadFilter();m.type="bandpass",m.frequency.value=520,m.Q.value=1.2;let y=i.createGain();y.gain.value=.018*t.crowd,f.connect(m),m.connect(y),y.connect(this.amb),f.start(),o.push(f),this.crowdGain=y}let d=()=>{this.ambNodes&&(t.birds==="gull"?this.gull():this.songbird(),this.timers.push(setTimeout(d,1500+Math.random()*(t.birds==="gull"?7e3:3500))))};this.timers.push(setTimeout(d,800))}stopAmbience(){this.timers.forEach(t=>clearTimeout(t)),this.timers=[],this.ambNodes&&this.ambNodes.forEach(t=>{try{t.stop()}catch{}}),this.ambNodes=null}songbird(){let t=this.ctx,e=t.currentTime,n=2+Math.floor(Math.random()*5),i=2600+Math.random()*2200,r=t.createStereoPanner?t.createStereoPanner():null;r&&(r.pan.value=Math.random()*1.6-.8,r.connect(this.amb));for(let o=0;o<n;o++){let a=t.createOscillator();a.type="sine";let c=t.createGain(),l=e+o*(.09+Math.random()*.05),h=i*(.85+Math.random()*.4);a.frequency.setValueAtTime(h,l),a.frequency.exponentialRampToValueAtTime(h*(Math.random()<.5?1.35:.7),l+.07),c.gain.setValueAtTime(0,l),c.gain.linearRampToValueAtTime(.03+Math.random()*.03,l+.01),c.gain.exponentialRampToValueAtTime(5e-4,l+.09),a.connect(c),c.connect(r||this.amb),a.start(l),a.stop(l+.12)}}gull(){let t=this.ctx,e=t.currentTime,n=1+Math.floor(Math.random()*3);for(let i=0;i<n;i++){let r=e+i*.35,o=t.createOscillator();o.type="sawtooth";let a=t.createBiquadFilter();a.type="bandpass",a.frequency.value=1800,a.Q.value=3;let c=t.createGain();o.frequency.setValueAtTime(1300,r),o.frequency.linearRampToValueAtTime(1700,r+.08),o.frequency.linearRampToValueAtTime(1e3,r+.3),c.gain.setValueAtTime(0,r),c.gain.linearRampToValueAtTime(.02,r+.03),c.gain.exponentialRampToValueAtTime(5e-4,r+.32),o.connect(a),a.connect(c),c.connect(this.amb),o.start(r),o.stop(r+.35)}}env(t,e,n,i,r){t.gain.setValueAtTime(1e-4,e),t.gain.linearRampToValueAtTime(i,e+n),t.gain.exponentialRampToValueAtTime(1e-4,e+n+r)}whoosh(t=1){if(!this.ctx)return;let e=this.ctx,n=e.currentTime,i=this.noiseSrc(this.white,!1),r=e.createBiquadFilter();r.type="bandpass",r.Q.value=1.5,r.frequency.setValueAtTime(400,n),r.frequency.exponentialRampToValueAtTime(2500*(.6+t*.5),n+.18);let o=e.createGain();this.env(o,n,.12,.25*t,.12),i.connect(r),r.connect(o),o.connect(this.sfx),i.start(n),i.stop(n+.35)}impact(t,e=1,n=1){if(!this.ctx)return;let i=this.ctx,r=i.currentTime,o=this.noiseSrc(this.white,!1),a=i.createBiquadFilter();a.type="highpass",a.frequency.value=t==="wood"?1800:3e3;let c=i.createGain();this.env(c,r,.001,(t==="putter"?.25:.7)*(.6+n*.4),t==="wood"?.07:.04),o.connect(a),a.connect(c),c.connect(this.sfx),o.start(r),o.stop(r+.15);let l=i.createOscillator();l.type=t==="wood"?"triangle":"sine";let h=t==="wood"?1450:t==="putter"?1100:t==="hybrid"?1900:2600;l.frequency.setValueAtTime(h*(.9+e*.15),r),l.frequency.exponentialRampToValueAtTime(h*.7,r+.12);let u=i.createGain();if(this.env(u,r,.001,(t==="putter"?.12:.28)*e,t==="wood"?.22:.1),l.connect(u),u.connect(this.sfx),l.start(r),l.stop(r+.3),e<.8&&t!=="putter"){let d=i.createOscillator();d.type="square",d.frequency.value=180;let f=i.createGain();this.env(f,r,.001,.08,.08),d.connect(f),f.connect(this.sfx),d.start(r),d.stop(r+.1)}if(t!=="putter"&&n>.4&&(t==="iron"||t==="wedge")){let d=this.noiseSrc(this.brown,!1),f=i.createBiquadFilter();f.type="lowpass",f.frequency.value=500;let m=i.createGain();this.env(m,r+.01,.005,.35,.12),d.connect(f),f.connect(m),m.connect(this.sfx),d.start(r),d.stop(r+.2)}}land(t,e=10){if(!this.ctx)return;let n=this.ctx,i=n.currentTime,r=Math.min(.5,.05+e*.012),o=this.noiseSrc(t==="sand"?this.white:this.brown,!1),a=n.createBiquadFilter();a.type="lowpass",a.frequency.value=t==="sand"?1500:t==="path"?3e3:700;let c=n.createGain();this.env(c,i,.002,r,t==="sand"?.2:.08),o.connect(a),a.connect(c),c.connect(this.sfx),o.start(i),o.stop(i+.3)}rollStart(){if(!this.ctx||this.rollNode)return;let t=this.ctx,e=this.noiseSrc(this.pink),n=t.createBiquadFilter();n.type="lowpass",n.frequency.value=600;let i=t.createGain();i.gain.value=0,e.connect(n),n.connect(i),i.connect(this.sfx),e.start(),this.rollNode={s:e,g:i,f:n}}rollUpdate(t,e){if(!this.rollNode)return;let n=this.ctx.currentTime;this.rollNode.g.gain.setTargetAtTime(Math.min(.12,t*(e?.03:.015)),n,.05),this.rollNode.f.frequency.setTargetAtTime(e?900:450,n,.1)}rollStop(){if(!this.rollNode)return;let t=this.rollNode;this.rollNode=null,t.g.gain.setTargetAtTime(0,this.ctx.currentTime,.05),setTimeout(()=>{try{t.s.stop()}catch{}},300)}cup(){if(!this.ctx)return;let t=this.ctx,e=t.currentTime;[0,.07,.13].forEach((n,i)=>{let r=t.createOscillator();r.type="triangle",r.frequency.value=[520,440,380][i];let o=t.createGain();this.env(o,e+n,.001,.3-i*.07,.12),r.connect(o),o.connect(this.sfx),r.start(e+n),r.stop(e+n+.2)})}splash(){if(!this.ctx)return;let t=this.ctx,e=t.currentTime,n=this.noiseSrc(this.white,!1),i=t.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(3500,e),i.frequency.exponentialRampToValueAtTime(300,e+.6);let r=t.createGain();this.env(r,e,.01,.5,.6),n.connect(i),i.connect(r),r.connect(this.sfx),n.start(e),n.stop(e+.8);let o=t.createOscillator();o.frequency.setValueAtTime(900,e),o.frequency.exponentialRampToValueAtTime(200,e+.15);let a=t.createGain();this.env(a,e,.005,.15,.15),o.connect(a),a.connect(this.sfx),o.start(e),o.stop(e+.2)}leaves(){if(!this.ctx)return;let t=this.ctx,e=t.currentTime,n=this.noiseSrc(this.white,!1),i=t.createBiquadFilter();i.type="bandpass",i.frequency.value=3e3,i.Q.value=.8;let r=t.createGain();this.env(r,e,.02,.35,.4),n.connect(i),i.connect(r),r.connect(this.sfx),n.start(e),n.stop(e+.5)}knock(){if(!this.ctx)return;let t=this.ctx,e=t.currentTime,n=t.createOscillator();n.type="sine",n.frequency.setValueAtTime(320,e),n.frequency.exponentialRampToValueAtTime(140,e+.1);let i=t.createGain();this.env(i,e,.001,.4,.12),n.connect(i),i.connect(this.sfx),n.start(e),n.stop(e+.2)}crowd(t,e=1){if(!this.ctx)return;let n=this.ctx,i=n.currentTime,r=t==="roar"?4.5:t==="applause"?3:t==="groan"||t==="ooh"?1.4:2.8,o=this.noiseSrc(this.pink,!1),a=n.createBiquadFilter();a.type="bandpass",a.frequency.value=t==="applause"?2500:t==="groan"?350:800,a.Q.value=t==="applause"?.6:1.1;let c=n.createGain(),l=.3*e*(t==="roar"?1.4:1);if(c.gain.setValueAtTime(1e-4,i),c.gain.linearRampToValueAtTime(l,i+(t==="roar"?.25:.12)),c.gain.setTargetAtTime(l*.6,i+.6,.6),c.gain.exponentialRampToValueAtTime(1e-4,i+r),(t==="groan"||t==="ooh")&&(a.frequency.setValueAtTime(t==="ooh"?500:420,i),a.frequency.linearRampToValueAtTime(t==="ooh"?700:260,i+r)),o.connect(a),a.connect(c),c.connect(this.sfx),o.start(i),o.stop(i+r+.1),t==="applause"||t==="cheer"||t==="roar"){let h=this.noiseSrc(this.white,!1),u=n.createBiquadFilter();u.type="highpass",u.frequency.value=1500;let d=n.createGain();d.gain.value=0;let f=n.createOscillator();f.type="square",f.frequency.value=13;let m=n.createGain();m.gain.value=.06*e,f.connect(m),m.connect(d.gain);let y=n.createGain();this.env(y,i+.2,.2,1,r),h.connect(u),u.connect(d),d.connect(y),y.connect(this.sfx),h.start(i),f.start(i),h.stop(i+r+.3),f.stop(i+r+.3)}}jingle(t){if(!this.ctx)return;let e=this.ctx,n=e.currentTime,i={birdie:[[659,0],[784,.1],[988,.2],[1319,.32]],eagle:[[523,0],[659,.1],[784,.2],[1047,.3],[1319,.45],[1568,.6]],ace:[[523,0],[659,.08],[784,.16],[1047,.24],[784,.4],[1047,.48],[1319,.56],[1568,.7],[2093,.9]],par:[[523,0],[659,.12]],bogey:[[392,0],[330,.15]],great:[[784,0],[1175,.1]],unlock:[[880,0],[1109,.1],[1319,.2],[1760,.34]]},r=i[t]||i.par;for(let[o,a]of r){let c=e.createOscillator();c.type="triangle",c.frequency.value=o;let l=e.createOscillator();l.type="sine",l.frequency.value=o*2;let h=e.createGain();this.env(h,n+a,.01,.12,.45);let u=e.createGain();u.gain.value=.3,c.connect(h),l.connect(u),u.connect(h),h.connect(this.sfx),c.start(n+a),l.start(n+a),c.stop(n+a+.6),l.stop(n+a+.6)}}click(){if(!this.ctx)return;let t=this.ctx,e=t.currentTime,n=t.createOscillator();n.frequency.value=1400;let i=t.createGain();this.env(i,e,.001,.05,.03),n.connect(i),i.connect(this.sfx),n.start(e),n.stop(e+.05)}tick(t){if(!this.ctx)return;let e=this.ctx,n=e.currentTime,i=e.createOscillator();i.type="square",i.frequency.value=t?1760:880;let r=e.createGain();this.env(r,n,.001,.04,.04),i.connect(r),r.connect(this.sfx),i.start(n),i.stop(n+.06)}},mt=new Sc;var pt=(s,t=document)=>t.querySelector(s),Ec=(s,t,e)=>{let n=document.createElement(s);return t&&(n.className=t),e!=null&&(n.innerHTML=e),n},Ku=s=>s===0?"E":s>0?`+${s}`:`${s}`,Ba=class{constructor(t,e){this.app=e,this.root=t,t.innerHTML=`
      <div class="hud-top-left glass" id="hole-card">
        <div class="hc-num" id="hc-num">1</div>
        <div class="hc-body">
          <div class="hc-course" id="hc-course"></div>
          <div class="hc-title" id="hc-title">PAR 4</div>
          <div class="hc-sub" id="hc-sub">445 YDS</div>
        </div>
        <div class="hc-score">
          <div class="hc-stroke" id="hc-stroke">SHOT 1</div>
          <div class="hc-topar" id="hc-topar">E</div>
        </div>
      </div>
      <div class="hud-top-right">
        <div class="glass wind" id="wind">
          <div class="wind-label">WIND</div>
          <div class="wind-dial"><div class="wind-arrow" id="wind-arrow">\u27A4</div></div>
          <div class="wind-mph" id="wind-mph">0 MPH</div>
        </div>
        <div class="glass minimap"><canvas id="minimap" width="200" height="320"></canvas></div>
      </div>
      <div class="hud-bottom-left glass" id="info">
        <div class="info-row"><span>LIE</span><b id="i-lie">TEE</b><em id="i-liepct"></em></div>
        <div class="info-row"><span>TO PIN</span><b id="i-pin">0</b></div>
        <div class="info-row"><span>PLAYS LIKE</span><b id="i-plays">0</b></div>
        <div class="info-row"><span>ELEVATION</span><b id="i-elev">0 ft</b></div>
        <div class="info-row"><span>AIM</span><div class="aimbar" id="i-aimbar"><i></i><em>\u2691</em></div><em id="i-aim"></em></div>
        <div class="club-card">
          <div class="club-name" id="i-club">DRIVER</div>
          <div class="club-brand" id="i-brand">TaylorMade Qi10</div>
          <div class="club-carry"><span id="i-carry">255</span><small id="i-carry-unit">YDS</small></div>
        </div>
      </div>
      <div class="hud-bottom-center" id="shotbar">
        <div class="shot-controls glass">
          <div class="club-picker">
            <button class="icon-btn" id="club-prev" title="Previous club (\u2191)">\u2039</button>
            <div class="club-strip" id="club-strip"></div>
            <button class="icon-btn" id="club-next" title="Next club (\u2193)">\u203A</button>
          </div>
          <div class="ctrl-row">
            <div class="seg" id="type-seg"></div>
            <div class="seg" id="shape-seg">
              <button data-v="-1" title="Draw (Q)">DRAW</button><button data-v="0">STRAIGHT</button><button data-v="1" title="Fade (E)">FADE</button>
            </div>
            <div class="seg" id="traj-seg">
              <button data-v="-1" title="Trajectory (T)">LOW</button><button data-v="0">MID</button><button data-v="1">HIGH</button>
            </div>
            <div class="spin-ball" id="spin-ball" title="Click to set strike point / spin (I J K L)"><div class="spin-dot" id="spin-dot"></div></div>
          </div>
        </div>
        <div class="meter-wrap" id="meter-wrap">
          <div class="meter" id="meter">
            <div class="meter-zone" id="meter-zone"></div>
            <div class="meter-fill" id="meter-fill"></div>
            <div class="meter-over"></div>
            <div class="meter-target" id="meter-target"><span>\u2691</span></div>
            <div class="meter-marker" id="meter-marker"></div>
            <div class="meter-ticks" id="meter-ticks"></div>
          </div>
          <button class="swing-btn" id="swing-btn">HOLD <b>SPACE</b> TO SWING</button>
        </div>
      </div>
      <div class="aim-pad">
        <button class="icon-btn big" id="aim-left">\u27F2</button>
        <button class="icon-btn big" id="aim-right">\u27F3</button>
      </div>
      <div class="help glass" id="help">
        <div><kbd>\u2190</kbd><kbd>\u2192</kbd> Aim <kbd>\u2191</kbd><kbd>\u2193</kbd> Club <kbd>X</kbd> Shot</div>
        <div><kbd>Q</kbd>/<kbd>E</kbd> Draw/Fade <kbd>T</kbd> Height <kbd>R</kbd> Aim at pin</div>
        <div><kbd>C</kbd> Camera <kbd>M</kbd> Map <kbd>G</kbd> Putt guide <kbd>Tab</kbd> Card</div>
        <div>Drag to look \xB7 Wheel to scout ahead</div>
      </div>
      <div class="toast" id="toast"><div class="toast-main"></div><div class="toast-sub"></div></div>
      <div class="banner" id="banner"><div class="banner-main"></div><div class="banner-sub"></div></div>
      <div class="hole-intro" id="hole-intro"></div>
      <div class="practice-panel glass" id="practice-panel"></div>
      <div class="modal" id="hud-modal"></div>
      <div class="loading" id="loading"></div>
    `,this.bind()}bind(){let t=()=>this.app.play;this.root.addEventListener("click",()=>{let l=document.activeElement;l&&l!==document.body&&l.blur&&l.blur()}),pt("#club-prev",this.root).onclick=()=>t().cycleClub(-1),pt("#club-next",this.root).onclick=()=>t().cycleClub(1),pt("#shape-seg",this.root).onclick=l=>{let h=l.target.dataset.v;h!=null&&t().setShape(+h)},pt("#traj-seg",this.root).onclick=l=>{let h=l.target.dataset.v;h!=null&&t().setTraj(+h)},pt("#type-seg",this.root).onclick=l=>{let h=l.target.dataset.t;h&&t().setType(h)};let e=pt("#spin-ball",this.root);e.onclick=l=>{let h=e.getBoundingClientRect(),u=(l.clientX-h.left)/h.width*2-1,d=-((l.clientY-h.top)/h.height*2-1),f=Math.hypot(u,d);f>1&&(u/=f,d/=f),t().setSpin(Math.round(u*4)/4,Math.round(d*4)/4)};let n=pt("#swing-btn",this.root),i=l=>{l.preventDefault(),t().swingPress()},r=l=>{l.preventDefault(),t().state==="swing"&&t().swingRelease()};n.addEventListener("pointerdown",i),n.addEventListener("pointerup",r),n.addEventListener("pointerleave",r);let o=(l,h)=>{let u=pt(l,this.root);u.addEventListener("pointerdown",f=>{f.preventDefault(),t().keys.add(h)});let d=()=>t().keys.delete(h);u.addEventListener("pointerup",d),u.addEventListener("pointerleave",d)};o("#aim-left","left"),o("#aim-right","right");let a=pt("#minimap",this.root);a.addEventListener("click",l=>{if(!this.map)return;let h=a.getBoundingClientRect(),u=(l.clientX-h.left)*(a.width/h.width),d=(l.clientY-h.top)*(a.height/h.height),[f,m]=this.mapToPlan(u,d);t().aimAt(f,m)});let c=pt("#meter-ticks",this.root);for(let l of[0,.25,.5,.75,1]){let h=Ec("div","tick");h.style.left=this.mpos(l)+"%",h.dataset.v=l,h.innerHTML=`<span>${l===0?"":Math.round(l*100)}</span>`,c.appendChild(h)}}show(t){this.root.classList.toggle("visible",t),t||(this.closeModal(),this.practiceResult(null))}mpos(t){return(t+.35)/1.5*100}loading(t,e){let n=pt("#loading",this.root);if(!t){n.classList.remove("show");return}n.innerHTML=`
      <div class="load-card">
        <div class="load-course">${e.course.name}</div>
        <div class="load-hole">HOLE ${e.number}</div>
        <div class="load-meta">PAR ${e.par} \xB7 ${e.yards} YARDS${e.name?" \xB7 "+e.name.toUpperCase():""}</div>
        ${e.sig?'<div class="sig-badge">SIGNATURE HOLE</div>':""}
        <div class="load-tip">${e.tip||""}</div>
        <div class="spinner"></div>
      </div>`,n.classList.add("show")}holeIntro(t,e,n){let i=pt("#hole-intro",this.root);if(!t){i.classList.remove("show");return}i.innerHTML=`<div class="hi-num">${e.number}</div><div class="hi-body"><div class="hi-title">HOLE ${e.number} <span>PAR ${e.par}</span></div>
      <div class="hi-yds">${e.yards} YARDS${e.name?" \xB7 "+e.name:""}</div><div class="hi-tip">${n||""}</div><div class="hi-skip">Press SPACE to skip</div></div>`,i.classList.add("show")}setHoleInfo(t){pt("#hc-num",this.root).textContent=t.number,pt("#hc-course",this.root).textContent=t.course+(t.mode==="range"?" \xB7 DRIVING RANGE":t.mode==="practice"?" \xB7 PRACTICE":t.mode==="coursePractice"?" \xB7 COURSE PRACTICE":` \xB7 ${t.holeIdx+1}/${t.holeCount}`),pt("#hc-title",this.root).textContent=t.mode==="range"?"DRIVING RANGE":`PAR ${t.par}`,pt("#hc-sub",this.root).textContent=`${t.yards} YDS${t.name?" \xB7 "+t.name:""}`,pt("#hc-stroke",this.root).textContent=`SHOT ${t.stroke}`;let e=pt("#hc-topar",this.root);e.textContent=t.mode==="round"||t.mode==="round9"||t.mode==="round18"?Ku(t.toPar):"\u2014",e.className="hc-topar "+(t.toPar<0?"under":t.toPar>0?"over":"")}setWind(t,e){let n=pt("#wind-arrow",this.root);n.style.transform=`rotate(${t*180/Math.PI-90}deg)`;let i=Math.round(e);pt("#wind-mph",this.root).textContent=`${i} MPH`,pt("#wind",this.root).classList.toggle("strong",i>=15)}setInfo(t){pt("#i-lie",this.root).textContent=t.lie,pt("#i-lie",this.root).style.color=t.lieColor,pt("#i-liepct",this.root).textContent=t.liePct;let e=t.putt||t.toPin<30?`${Math.round(t.toPin*3)} FT`:`${Math.round(t.toPin)} YDS`;pt("#i-pin",this.root).textContent=e,pt("#i-plays",this.root).textContent=t.putt?"\u2014":`${Math.round(t.playsLike)} YDS`;let n=Math.round(t.elevFt);pt("#i-elev",this.root).textContent=`${n>0?"\u25B2 +":n<0?"\u25BC ":""}${n} FT`;let i=t.aimOff*180/Math.PI,r=Math.abs(i);pt("#i-aim",this.root).textContent=r<.4?"AT FLAG":`${r.toFixed(1)}\xB0 ${i<0?"L":"R"}`,pt("#i-aimbar i",this.root).style.left=`${50+Math.max(-48,Math.min(48,i*3))}%`,pt("#i-club",this.root).textContent=t.club.name.toUpperCase(),pt("#i-brand",this.root).textContent=`${t.club.brand} ${t.club.model}`,t.putt?(pt("#i-carry",this.root).textContent=t.puttScale,pt("#i-carry-unit",this.root).textContent="FT MAX"):(pt("#i-carry",this.root).textContent=Math.round(t.carry),pt("#i-carry-unit",this.root).textContent="YDS CARRY");let o=pt("#club-strip",this.root);o.innerHTML="";let a=t.bag.length;for(let u=-2;u<=2;u++){let d=t.clubIdx+u;if(d<0||d>=a){o.appendChild(Ec("div","club-chip empty"));continue}let f=t.bag[d],m=Ec("div","club-chip"+(u===0?" active":""),`<b>${f.short}</b>`);m.onclick=()=>this.app.play.selectClub(f),o.appendChild(m)}let c=pt("#type-seg",this.root);c.innerHTML=t.types.map(u=>`<button data-t="${u}" class="${u===t.typeId?"on":""}" title="${Mn[u].desc}">${Mn[u].name.toUpperCase()}</button>`).join("");let l=(u,d)=>pt(u,this.root).querySelectorAll("button").forEach(f=>f.classList.toggle("on",+f.dataset.v===d));l("#shape-seg",t.shape),l("#traj-seg",t.traj),pt("#shape-seg",this.root).style.display=t.putt?"none":"",pt("#traj-seg",this.root).style.display=t.putt?"none":"",pt("#spin-ball",this.root).style.display=t.putt?"none":"";let h=pt("#spin-dot",this.root);h.style.left=`${50+t.spin.x*38}%`,h.style.top=`${50-t.spin.y*38}%`,this.root.querySelectorAll("#meter-ticks .tick").forEach(u=>{let d=+u.dataset.v;u.querySelector("span").textContent=d===0?"":t.putt?`${Math.round(d*t.puttScale)}'`:Math.round(d*100)})}meterShow(t,e){let n=pt("#meter-wrap",this.root);n.classList.toggle("hidden",!t),n.classList.toggle("putt",!!e),pt("#shotbar .shot-controls",this.root).classList.toggle("hidden",!t),t&&this.meterReset()}meterReset(){pt("#meter-fill",this.root).style.width="0%",pt("#meter-fill",this.root).style.left=this.mpos(0)+"%",pt("#meter-marker",this.root).style.left=this.mpos(0)+"%",pt("#meter",this.root).classList.remove("hit-good","hit-bad")}meterWindow(t){let e=pt("#meter-zone",this.root);if(!t){e.style.display="none";return}e.style.display="",e.style.left=this.mpos(-t)+"%",e.style.width=this.mpos(t)-this.mpos(-t)+"%"}meterTarget(t,e){let n=pt("#meter-target",this.root);if(t==null||t>1.12){n.style.display="none";return}n.style.display="",n.style.left=this.mpos(Math.max(0,t))+"%"}meterUpdate(t,e,n,i){let r=pt("#meter-fill",this.root);r.style.left=this.mpos(0)+"%",r.style.width=this.mpos(Math.min(t,1.15))-this.mpos(0)+"%",r.classList.toggle("over",t>1),pt("#meter-marker",this.root).style.left=this.mpos(Math.max(-.35,e))+"%",n==="hit"&&pt("#meter",this.root).classList.add(i==="PERFECT"||i==="GREAT"||i==="PURE"||i==="GOOD"?"hit-good":"hit-bad")}toast(t,e="",n="info",i=1500){let r=pt("#toast",this.root);pt(".toast-main",r).textContent=t,pt(".toast-sub",r).textContent=e,r.className=`toast show ${n}`,clearTimeout(this.toastT),this.toastT=setTimeout(()=>r.classList.remove("show"),i)}banner(t,e,n){let i=pt("#banner",this.root);pt(".banner-main",i).textContent=t,pt(".banner-sub",i).textContent=e||"",i.className=`banner show ${n}`,clearTimeout(this.bannerT),this.bannerT=setTimeout(()=>i.classList.remove("show"),2500)}buildMap(t){let e=t.hole,n=pt("#minimap",this.root),i=n.width,r=n.height,o=e.at(e.teeS),a=e.G,c=a[0]-o.x,l=a[1]-o.y,h=Math.hypot(c,l),u=Math.atan2(c,l),d=Math.min((r-40)/(h+40),(i-20)/140),f=(o.x+a[0])/2,m=(o.y+a[1])/2,y=Math.cos(u),g=Math.sin(u);this.map={hole:e,scale:d,cx:f,cy:m,cos:y,sin:g,W:i,H:r,holeRef:e};let p=document.createElement("canvas");p.width=i,p.height=r;let x=p.getContext("2d");x.fillStyle="#1f3a1c",x.fillRect(0,0,i,r);let b=this.app.world.terrainCanvas;b&&(x.save(),x.translate(i/2,r/2),x.rotate(-u),x.scale(d,-d),x.translate(-f,-m),x.translate(e.gx0,e.gy0),x.scale(.5,.5),x.drawImage(b,0,0),x.restore()),x.fillStyle="rgba(20,45,18,0.75)";for(let v=0;v<e.trees.length;v+=1){let E=e.trees[v],[A,w]=this.planToMap(E.x,E.y);A<-5||w<-5||A>i+5||w>r+5||(x.beginPath(),x.arc(A,w,Math.max(1.2,E.cr*d*.8),0,Math.PI*2),x.fill())}this.mapBg=p}planToMap(t,e){let n=this.map,i=t-n.cx,r=e-n.cy,o=i*n.cos-r*n.sin,a=i*n.sin+r*n.cos;return[n.W/2+o*n.scale,n.H/2-a*n.scale]}mapToPlan(t,e){let n=this.map,i=(t-n.W/2)/n.scale,r=-(e-n.H/2)/n.scale,o=i*n.cos+r*n.sin,a=-i*n.sin+r*n.cos;return[o+n.cx,a+n.cy]}drawMap(t){(!this.map||this.map.holeRef!==t.hole)&&this.buildMap(t),this.drawMapBall(t,[t.ball.x,t.ball.y,t.ball.h])}drawMapBall(t,e){(!this.map||this.map.holeRef!==t.hole)&&this.buildMap(t);let n=pt("#minimap",this.root),i=n.getContext("2d");i.drawImage(this.mapBg,0,0);let r=t.hole,[o,a]=this.planToMap(r.pin[0],r.pin[1]),[c,l]=this.planToMap(e[0],e[1]);if(t.state==="aim"||t.state==="swing"){let u=t.previewLanding,d=u?Math.hypot(u[0]-t.ball.x,u[1]-t.ball.y):t.distPin,f=t.ball.x+Math.sin(t.heading)*d,m=t.ball.y+Math.cos(t.heading)*d,[y,g]=this.planToMap(f,m);if(i.strokeStyle="rgba(255,255,255,0.85)",i.lineWidth=1.5,i.setLineDash([4,3]),i.beginPath(),i.moveTo(c,l),i.lineTo(y,g),i.stroke(),i.setLineDash([]),u){let[p,x]=this.planToMap(u[0],u[1]);i.strokeStyle="#7dffb0",i.lineWidth=2,i.beginPath(),i.arc(p,x,5,0,Math.PI*2),i.stroke()}}i.fillStyle="#fff",i.fillRect(o-.5,a-12,1.5,12),i.fillStyle="#ff3b3b",i.beginPath(),i.moveTo(o+1,a-12),i.lineTo(o+8,a-9),i.lineTo(o+1,a-6),i.fill(),i.fillStyle="#fff",i.strokeStyle="#000",i.lineWidth=1,i.beginPath(),i.arc(c,l,3.5,0,Math.PI*2),i.fill(),i.stroke();let h=Math.hypot(r.pin[0]-e[0],r.pin[1]-e[1]);i.font="600 11px Inter, sans-serif",i.fillStyle="#fff",i.fillText(h<30?`${Math.round(h*3)} ft`:`${Math.round(h)} y`,6,n.height-8)}practiceResult(t,e,n){let i=pt("#practice-panel",this.root);if(!t){i.classList.remove("show");return}let r=n.launch,a=t.hole.distToPin(t.ball.x,t.ball.y),c=(()=>{let d=Math.sin(t.heading),f=Math.cos(t.heading),m=e.end.x-n.startBall.x,y=e.end.y-n.startBall.y;return m*f-y*d})(),l=t.isPutt()?[["Result",e.holed?"HOLED":`${Math.round(a*3)} ft left`],["Distance",`${(e.total*3).toFixed(1)} ft`],["Stroke",r.rating]]:[["Ball speed",`${Math.round(r.ballMph)} mph`],["Launch",`${r.launchDeg.toFixed(1)}\xB0`],["Spin",`${Math.round(r.back)} rpm`],["Carry",`${Math.round(e.carry)} yds`],["Total",`${Math.round(e.total)} yds`],["Apex",`${Math.round(e.apex*3)} ft`],["Offline",`${Math.abs(c).toFixed(0)} yds ${c>.5?"R":c<-.5?"L":""}`],["Strike",r.rating],[t.cfg.mode==="range"?"Club":"To pin",t.cfg.mode==="range"?t.club.name:a<30?`${Math.round(a*3)} ft`:`${Math.round(a)} yds`]];i.innerHTML=`<div class="pp-title">${t.cfg.mode==="range"?"LAUNCH MONITOR":"SHOT DATA"}</div>
      <div class="pp-grid">${l.map(([d,f])=>`<div><span>${d}</span><b>${f}</b></div>`).join("")}</div>
      <div class="pp-btns"><button class="btn primary" id="pp-next">${t.cfg.mode==="range"?"NEXT BALL":"RETRY SPOT"} <kbd>Enter</kbd></button>
      ${t.cfg.mode==="practice"?'<button class="btn" id="pp-new">NEW SPOT <kbd>N</kbd></button>':""}
      ${t.cfg.mode==="practice"&&!t.lastResult?.r?.holed?'<button class="btn" id="pp-continue">PLAY IT OUT</button>':""}</div>`,i.classList.add("show"),pt("#pp-next",i).onclick=()=>{t.playingOut=!1,t.continueAfterResult()};let h=pt("#pp-new",i);h&&(h.onclick=()=>t.newPracticeSpot());let u=pt("#pp-continue",i);u&&(u.onclick=()=>{i.classList.remove("show"),t.playingOut=!0,t.continueAfterResult()})}scorecardHtml(t){let e=t.course,n=t.round.cards,i=new Map(n.map(u=>[u.hole,u])),r=[],o=[...Array(9).keys()],a=[...Array(9).keys()].map(u=>u+9);for(let[u,d]of[["OUT",o],["IN",a]]){if(!d.some(w=>i.has(w)))continue;let f=d.map(w=>`<th>${w+1}</th>`).join(""),m=d.map(w=>`<td>${i.get(w)?.yards||Math.round(e.holes[w].y*t.tee.factor)}</td>`).join(""),y=d.map(w=>`<td>${e.holes[w].p}</td>`).join(""),g=d.map(w=>{let R=i.get(w);if(!R||R.strokes==null)return'<td class="empty">\xB7</td>';let M=R.strokes-R.par;return`<td><span class="sc ${M<=-2?"eagle":M===-1?"birdie":M===0?"par":M===1?"bogey":"dbl"}">${R.strokes}</span></td>`}).join(""),p=d.map(w=>{let R=i.get(w);return`<td class="dim">${R&&R.strokes!=null?R.putts:""}</td>`}).join(""),x=d.reduce((w,R)=>w+e.holes[R].p,0),b=d.reduce((w,R)=>w+Math.round(e.holes[R].y*t.tee.factor),0),v=d.map(w=>i.get(w)).filter(w=>w&&w.strokes!=null),E=v.reduce((w,R)=>w+R.strokes,0),A=v.reduce((w,R)=>w+R.putts,0);r.push(`<table class="scorecard">
        <tr class="hdr"><th>HOLE</th>${f}<th>${u}</th></tr>
        <tr><th>YARDS</th>${m}<td>${b}</td></tr>
        <tr><th>PAR</th>${y}<td>${x}</td></tr>
        <tr class="score"><th>SCORE</th>${g}<td><b>${v.length?E:""}</b></td></tr>
        <tr><th>PUTTS</th>${p}<td class="dim">${v.length?A:""}</td></tr>
      </table>`)}let c=n.filter(u=>u.strokes!=null),l=c.reduce((u,d)=>u+d.strokes,0),h=c.reduce((u,d)=>u+d.par,0);return`${r.join("")}
      <div class="sc-total"><div><span>TOTAL</span><b>${l||"-"}</b></div><div><span>PAR</span><b>${h||"-"}</b></div><div><span>TO PAR</span><b class="${l-h<0?"under":l-h>0?"over":""}">${c.length?Ku(l-h):"-"}</b></div></div>
      <div class="sc-legend"><span class="sc eagle">3</span> Eagle+ <span class="sc birdie">3</span> Birdie <span class="sc par">4</span> Par <span class="sc bogey">5</span> Bogey <span class="sc dbl">6</span> Double+</div>`}showScorecard(t,e=""){let n=pt("#hud-modal",this.root);n.innerHTML=`<div class="modal-card wide">
      <div class="modal-title">${t.course.name.toUpperCase()} <small>${t.tee.name} tees \xB7 ${t.diff.name}</small></div>
      ${this.scorecardHtml(t)}
      <div class="modal-btns">${e||'<button class="btn primary" id="sc-close">CLOSE <kbd>Tab</kbd></button>'}</div></div>`,n.classList.add("show");let i=pt("#sc-close",n);return i&&(i.onclick=()=>this.closeModal()),n}closeModal(){pt("#hud-modal",this.root).classList.remove("show")}modalOpen(){return pt("#hud-modal",this.root).classList.contains("show")}holeComplete(t,{last:e,practice:n}){let i=n?'<button class="btn" id="hc-replay">REPLAY HOLE</button><button class="btn primary" id="hc-next">NEXT HOLE \u25B8</button><button class="btn" id="hc-menu">MAIN MENU</button>':`<button class="btn primary" id="hc-next">${e?"FINISH ROUND \u25B8":"NEXT HOLE \u25B8"} <kbd>Enter</kbd></button>`,r=this.showScorecard(t,i),o=pt("#hc-next",r),a=()=>{if(this.closeModal(),n){let h=(t.round.holes[t.round.idx]+1)%18;t.round.holes[t.round.idx]=h,t.round.cards[t.round.idx]={hole:h,par:t.course.holes[h].p,yards:0,strokes:null,putts:0,fairway:null,gir:!1,penalties:0},t.loadHole(t.round.idx)}else t.nextHole()};o.onclick=a,this.pendingNext=a;let c=pt("#hc-replay",r);c&&(c.onclick=()=>{this.closeModal(),t.replayHole()});let l=pt("#hc-menu",r);l&&(l.onclick=()=>{this.closeModal(),this.app.quitToMenu()}),mt.click()}};var Un=[{id:"augusta",cardHole:11,name:"Augusta National Golf Club",short:"AUGUSTA NATIONAL",location:"Augusta, Georgia",designer:"Alister MacKenzie & Bobby Jones, 1933",blurb:"Towering loblolly pines, blooming azaleas and glass-fast greens. Amen Corner awaits.",theme:"augusta",wind:[2,10],stimp:13.5,firmness:.55,unlock:1,accent:"#2f7d3a",holes:[{p:4,y:445,name:"Tea Olive",dl:8,at:290,el:15,fw:34,hz:[["fb",305,18],["gb",-60]],tip:"Uphill finish. Bunker right catches drives that bail out."},{p:5,y:585,name:"Pink Dogwood",dl:-18,at:300,el:-55,fw:38,hz:[["fb",300,22],["gb",-50],["gb",60]],tip:"Big draw off the tee sets up a go for it in two."},{p:4,y:350,name:"Flowering Peach",dl:-6,at:240,el:18,fw:30,gs:1.4,hz:[["fb",235,-14,5,6],["fb",250,-6,4,5],["fb",262,-18,5,6],["fb",272,-9,4,5],["gb",-40]],tip:"Short but the green is a tabletop. Wedge must be precise."},{p:3,y:240,name:"Flowering Crab Apple",el:-20,gw:1.1,hz:[["gb",20,1.3],["gb",-150]],tip:"Long iron downhill. Front bunker is huge."},{p:4,y:495,name:"Magnolia",dl:-12,at:300,el:28,fw:32,gs:1.3,hz:[["fb",305,-16,7,10],["fb",325,-20,6,9],["gb",180]],tip:"Carry the left bunkers to shorten the hole."},{p:3,y:180,name:"Juniper",el:-45,gs:1.5,hz:[["gb",-30,1.2]],tip:"Dramatic downhill par 3 to a tiered green."},{p:4,y:450,name:"Pampas",dl:2,at:260,el:22,fw:26,gw:.8,hz:[["gb",-20],["gb",15],["gb",55],["gb",160],["gb",-150]],tip:"Narrow chute of pines. Green ringed by five bunkers."},{p:5,y:570,name:"Yellow Jasmine",dl:-8,at:330,el:55,fw:34,hz:[["fb",300,18,8,16]],tip:"Uphill all the way. Mounds guard the green."},{p:4,y:460,name:"Carolina Cherry",dl:-14,at:270,el:10,fw:34,gs:1.5,hz:[["gb",-30],["gb",-70]],tip:"Anything short rolls off the false front."},{p:4,y:495,name:"Camellia",dl:-16,at:270,el:-95,fw:40,hz:[["fb",415,-12,10,8],["gb",40]],tip:"Plunging dogleg left. Draw it down the hill."},{p:4,y:520,name:"White Dogwood",dl:-4,at:320,el:-40,fw:36,hz:[["gpond",-80,1.4],["gb",140],["stands",120]],tip:"Start of Amen Corner. Pond waits left of the green."},{p:3,y:155,name:"Golden Bell",sig:!0,ang:10,el:-8,gw:.9,gs:.8,hz:[["cross",118,134],["gb",-5,.9],["gb",150],["gb",-160],["bridge",125],["flowers",190,-30],["stands",-150]],tip:"Rae's Creek. The swirling wind makes this the most feared 155 yards in golf."},{p:5,y:545,name:"Azalea",sig:!0,dl:-38,at:285,el:5,fw:38,hz:[["lat",-1,170,470,24],["cross",468,482],["gb",150],["gb",175],["gb",-165],["flowers",150,-45],["flowers",290,-40]],tip:"Hug the creek off the tee and you can reach in two. Tributary of Rae's Creek fronts the green."},{p:4,y:440,name:"Chinese Fir",dl:-6,at:260,el:12,fw:38,gs:1.6,hz:[],tip:"No bunkers \u2014 the green does all the defending."},{p:5,y:550,name:"Firethorn",sig:!0,dl:3,at:300,el:-20,fw:38,hz:[["gpond",0,1.5],["gpond",150,1],["gb",90]],tip:"Risk-reward. Pond in front and behind the green."},{p:3,y:170,name:"Redbud",sig:!0,ang:-8,el:-12,gs:1.5,hz:[["lat",-1,20,200,4],["gb",70],["gb",120],["gb",-140,.7],["stands",60]],tip:"Water all the way down the left. Sunday pin feeds off the ridge."},{p:4,y:440,name:"Nandina",dl:4,at:260,el:18,fw:36,hz:[["gb",-15],["gb",20]],tip:"Straightforward drive, tough approach."},{p:4,y:465,name:"Holly",sig:!0,dl:16,at:250,el:55,fw:30,hz:[["fb",285,-15,7,12],["fb",310,-20,6,10],["gb",-30],["gb",40],["stands",-90],["stands",90]],tip:"Uphill chute to the clubhouse. Fairway bunkers left pinch the landing area."}]},{id:"pebble",cardHole:6,name:"Pebble Beach Golf Links",short:"PEBBLE BEACH",location:"Pebble Beach, California",designer:"Jack Neville & Douglas Grant, 1919",blurb:"Cliffs above Carmel Bay, tiny poa greens and the Pacific in play on nine holes.",theme:"pebble",wind:[6,16],stimp:11.5,firmness:.6,unlock:1,accent:"#1d5f8a",holes:[{p:4,y:380,dl:22,at:240,el:8,fw:34,gw:.75,hz:[["fb",250,18],["gb",-40],["gb",40]],tip:"Gentle opener. Dogleg right."},{p:5,y:511,el:6,fw:36,gw:.75,hz:[["xcanyon",405,425],["gb",-30],["gb",30]],tip:"Barranca crosses the fairway 100 yards out."},{p:4,y:404,dl:-32,at:250,el:4,fw:34,gw:.7,hz:[["fb",245,-20,8,10],["gb",-40],["gb",150]],tip:"Sharp dogleg left. Cut the corner at your peril."},{p:4,y:331,el:12,fw:30,gw:.6,hz:[["ocean",1,34],["fb",225,5,6,8],["gb",-40],["gb",40]],tip:"The ocean appears on the right. Tiny sloping green."},{p:3,y:195,ang:10,el:0,gw:.65,hz:[["ocean",1,36,60,240],["gb",-60],["gb",150]],tip:"Clifftop par 3 hugging Stillwater Cove."},{p:5,y:523,dl:-8,at:300,el:40,fw:34,gw:.7,hz:[["ocean",1,26],["fb",280,-18],["gb",-40]],tip:"Ocean right, then a steep climb to the headland."},{p:3,y:109,sig:!0,el:-40,gw:.55,gs:.8,hz:[["ocean",1,18,40,200],["ocean",-1,26,80,200],["gb",-70],["gb",60],["gb",150,.8],["gb",-140,.8],["gb",15,.7]],tip:"The most photographed par 3 in golf. Wedge downhill \u2014 wind is everything."},{p:4,y:428,sig:!0,dl:16,at:250,el:-10,fw:34,gw:.65,hz:[["ocean",1,30,160,480],["cross",275,330],["gb",-40],["gb",150]],tip:"Lay up to the cliff edge, then fire over the chasm. Nicklaus called it the best second shot in golf."},{p:4,y:505,el:-15,fw:32,gw:.65,hz:[["ocean",1,30],["gb",-40]],tip:"Downhill along the bay. Fairway slopes to the cliff."},{p:4,y:495,el:-10,fw:30,gw:.65,hz:[["ocean",1,28],["fb",270,-18],["gb",-40]],tip:"Everything slopes toward the beach on the right."},{p:4,y:390,dl:10,at:250,el:25,fw:32,gw:.6,hz:[["fb",260,-16],["gb",-40],["gb",40]],tip:"Uphill, turning away from the sea."},{p:3,y:202,el:4,gw:.6,hz:[["gb",0,1.2],["gb",-80]],tip:"Shallow green. Front bunker eats short shots."},{p:4,y:445,el:8,fw:34,gw:.65,gs:1.4,hz:[["fb",270,-16],["gb",-30],["gb",40]],tip:"Green slopes hard from back to front."},{p:5,y:580,dl:18,at:330,el:25,fw:34,gw:.6,gs:1.3,hz:[["fb",300,-18],["gb",-10,1.2],["gb",60]],tip:"Tiny elevated green guarded by a deep front bunker."},{p:4,y:397,el:-8,fw:34,gw:.65,hz:[["xcanyon",160,175],["gb",-40],["gb",40]],tip:"Barranca off the tee is only a hazard for weak shots."},{p:4,y:403,dl:12,at:260,el:6,fw:32,gw:.65,hz:[["xcanyon",265,285],["gb",-40],["gb",120]],tip:"Barranca in the landing zone. Club down off the tee."},{p:3,y:208,sig:!0,ang:-8,el:0,gw:.8,hz:[["ocean",-1,30,120,300],["ocean",1,38,170,300],["gb",-10,1.1],["gb",60],["gb",-80],["stands",120]],tip:"Hourglass green on the ocean. Watson's chip-in, Nicklaus's 1-iron."},{p:5,y:543,sig:!0,dl:-14,at:320,el:0,fw:32,gw:.7,hz:[["ocean",-1,24],["tree",280,16,5],["tree",520,22,6],["gb",50],["gb",-40],["stands",110]],tip:"The greatest finishing hole in golf. Carmel Bay down the entire left side."}]},{id:"sawgrass",cardHole:16,name:"TPC Sawgrass \u2014 Stadium Course",short:"TPC SAWGRASS",location:"Ponte Vedra Beach, Florida",designer:"Pete Dye, 1980",blurb:"Pete Dye's stadium design: waste areas, railroad ties and the Island Green.",theme:"sawgrass",wind:[4,14],stimp:12.5,firmness:.55,unlock:1,accent:"#0d6e6e",holes:[{p:4,y:423,dl:10,at:250,el:0,fw:32,hz:[["fb",250,18],["waste",180,-30,14,40],["gb",-40]],tip:"Slight dogleg right. Favor the left side."},{p:5,y:532,dl:-12,at:300,el:0,fw:32,hz:[["fb",270,18],["gb",-40],["gb",40],["tree",440,-16,6]],tip:"Reachable par 5 but the green is tiny and guarded."},{p:3,y:177,el:4,hz:[["gb",-40,1.2],["gb",150]],tip:"Elevated green, bunker front-left."},{p:4,y:384,el:0,fw:30,hz:[["pond",340,-22,20,26],["gb",50],["fb",250,16]],tip:"Water short-left of the green."},{p:4,y:471,dl:8,at:270,el:0,fw:32,hz:[["fb",280,18],["gb",-40],["waste",360,-24,10,40]],tip:"Long par 4, fairway bunker right."},{p:4,y:393,dl:10,at:250,el:0,fw:30,hz:[["lat",-1,60,250,24],["tree",110,18,7],["gb",-40]],tip:"Tree overhangs the right side of the tee chute."},{p:4,y:442,dl:-4,at:250,el:0,fw:30,hz:[["waste",230,-24,12,60],["lat",-1,330,440,26],["gb",40]],tip:"Waste area and water down the left."},{p:3,y:237,el:0,gw:1.1,hz:[["gb",-40],["gb",40],["gb",160]],tip:"Longest par 3 on the course."},{p:5,y:583,dl:-10,at:320,el:0,fw:34,hz:[["cross",450,462],["fb",300,18],["gb",-40],["gb",50]],tip:"Creek crosses in front of the green complex."},{p:4,y:424,dl:6,at:250,el:0,fw:32,hz:[["waste",220,-26,12,70],["fb",270,18],["gb",40]],tip:"Waste bunker runs down the entire left."},{p:5,y:558,dl:-8,at:300,el:0,fw:34,hz:[["lat",-1,380,580,20],["waste",250,26,12,50],["gb",40]],tip:"Water guards the left of the green. Go for it?"},{p:4,y:358,dl:-10,at:230,el:0,fw:32,hz:[["lat",-1,250,380,22],["fb",230,16],["gb",40]],tip:"Short par 4 with water left of the green."},{p:3,y:181,el:0,hz:[["gpond",-80,1.5],["gb",40],["gb",150]],tip:"Water all down the left of the green."},{p:4,y:481,dl:-8,at:270,el:0,fw:30,hz:[["lat",-1,150,420,26],["fb",290,18,8,16],["gb",40]],tip:"Tough driving hole. Water left, mound right."},{p:4,y:449,dl:6,at:260,el:0,fw:32,hz:[["fb",250,-16],["gb",40],["gb",-40]],tip:"Start of the famous finishing stretch."},{p:5,y:523,sig:!0,dl:-14,at:300,el:0,fw:34,hz:[["lat",1,380,540,18],["tree",450,-24,9],["gb",-40],["stands",150]],tip:"Go for it in two \u2014 water right, giant oak left."},{p:3,y:137,sig:!0,el:0,gw:.85,gs:.9,hz:[["island"],["gb",-10,.7],["stands",-120],["stands",120]],tip:"The Island Green. Pitching wedge to a target surrounded by water."},{p:4,y:462,sig:!0,dl:-18,at:270,el:0,fw:30,hz:[["lat",-1,60,490,18],["gb",60],["stands",110]],tip:"Water the entire left side. Aim at the trees and hold on."}]},{id:"torrey",cardHole:2,name:"Torrey Pines \u2014 South Course",short:"TORREY PINES SOUTH",location:"La Jolla, California",designer:"William F. Bell, 1957 \xB7 Rees Jones, 2001",blurb:"Clifftop municipal on the Pacific bluffs. Kikuyu rough, canyons and marine layer.",theme:"torrey",wind:[4,13],stimp:12,firmness:.5,unlock:1,accent:"#b0752e",holes:[{p:4,y:450,dl:-8,at:270,el:-6,fw:32,hz:[["fb",270,16],["gb",-40],["gb",40]],tip:"Downhill opener toward the ocean."},{p:4,y:389,dl:4,at:250,el:0,fw:32,hz:[["fb",240,-16],["fb",260,18],["gb",40]],tip:"Bunkers pinch the landing zone."},{p:3,y:200,sig:!0,ang:-10,el:-30,hz:[["canyon",-1,22,40,240],["gb",40],["gb",-60]],tip:"Downhill toward the Pacific. Canyon left."},{p:4,y:488,el:0,fw:30,hz:[["canyon",-1,24],["fb",280,18],["gb",40]],tip:"Clifftop par 4. Canyon lines the entire left side."},{p:4,y:453,dl:6,at:270,el:0,fw:30,hz:[["fb",280,-16],["gb",-40],["gb",40]],tip:"Tight driving hole."},{p:5,y:564,dl:-12,at:300,el:0,fw:32,hz:[["fb",290,18],["fb",460,-16],["gb",40]],tip:"Reachable for long hitters."},{p:4,y:462,dl:-6,at:280,el:6,fw:32,hz:[["fb",275,-16],["canyon",-1,42,200,480],["gb",40]],tip:"Canyon lurks left."},{p:3,y:177,el:-12,hz:[["gb",-40],["gb",40],["gb",150]],tip:"Downhill short iron."},{p:5,y:610,dl:10,at:300,dl2:-10,at2:460,el:0,fw:32,hz:[["fb",300,-18],["xb",440,10],["gb",-40],["gb",40]],tip:"Three-shotter with bunkers across the fairway."},{p:4,y:416,dl:-6,at:250,el:0,fw:32,hz:[["fb",250,18],["gb",-40]],tip:"Tee shot along the canyon edge."},{p:3,y:221,el:-8,hz:[["canyon",-1,22,30,240],["gb",-40],["gb",40]],tip:"Long par 3 over scrub. Canyon left."},{p:4,y:504,el:0,fw:32,hz:[["fb",280,-16],["fb",300,18],["gb",-30],["gb",40]],tip:"Monster par 4 into the prevailing breeze."},{p:5,y:614,dl:-10,at:330,el:-8,fw:32,hz:[["xcanyon",480,520],["fb",300,18],["gb",40]],tip:"Canyon crosses the fairway before the green."},{p:4,y:435,el:0,fw:32,hz:[["canyon",-1,30],["fb",270,16],["gb",40]],tip:"Canyon lines the left."},{p:4,y:478,dl:6,at:270,el:0,fw:32,hz:[["fb",280,-16],["gb",40]],tip:"Long, straight and demanding."},{p:3,y:227,sig:!0,ang:-6,el:-6,hz:[["canyon",-1,18,40,250],["gb",30],["gb",-40]],tip:"Pacific backdrop. Canyon left of the green."},{p:4,y:442,el:0,fw:30,hz:[["canyon",-1,22],["fb",270,18],["gb",40]],tip:"Clifftop again. Hang it out right."},{p:5,y:570,sig:!0,dl:-6,at:300,el:0,fw:34,hz:[["gpond",-20,1.4],["fb",290,18],["gb",60],["stands",110],["stands",-110]],tip:"Devlin's Billabong fronts the green. Tiger's 2008 putt."}]},{id:"bethpage",cardHole:3,name:"Bethpage State Park \u2014 Black Course",short:"BETHPAGE BLACK",location:"Farmingdale, New York",designer:"A.W. Tillinghast, 1936",blurb:'"WARNING: The Black Course is an extremely difficult course." Believe the sign.',theme:"bethpage",wind:[3,12],stimp:12.5,firmness:.5,unlock:2,accent:"#3a3a3a",holes:[{p:4,y:430,dl:28,at:240,el:-5,fw:30,hz:[["fb",250,-18,8,14],["gb",-40],["gb",40]],tip:"Sharp dogleg right past the trees."},{p:4,y:389,dl:-8,at:240,el:25,fw:30,hz:[["fb",240,16],["gb",-40],["gb",40]],tip:"Uphill to a hidden green."},{p:3,y:230,el:0,hz:[["gb",-20,1.3],["gb",40],["gb",150]],tip:"Bunkers wrap around the green."},{p:5,y:517,sig:!0,dl:-18,at:290,el:35,fw:34,hz:[["xb",330,18],["fb",260,18,10,20],["xb",460,10],["gb",-40],["gb",40]],tip:"Tillinghast masterpiece. Massive cross bunkers climb the hill."},{p:4,y:478,dl:18,at:250,el:20,fw:30,hz:[["waste",200,8,32,26],["gb",-40],["gb",40]],tip:"Carry the giant bunker from the elevated tee."},{p:4,y:408,dl:-10,at:240,el:10,fw:30,hz:[["fb",250,16],["gb",-40],["gb",40]],tip:"Bunkers on both sides of the landing area."},{p:4,y:524,dl:22,at:270,el:10,fw:30,hz:[["xb",250,18],["fb",320,18],["gb",-40]],tip:"Longest par 4 \u2014 cross bunker from the tee."},{p:3,y:210,el:-20,hz:[["gpond",0,1.3],["gb",150],["gb",60]],tip:"Downhill over a pond."},{p:4,y:460,dl:-18,at:260,el:15,fw:30,hz:[["fb",260,18],["gb",-40]],tip:"Dogleg left, uphill approach."},{p:4,y:502,dl:-6,at:280,el:10,fw:28,hz:[["fb",280,-16],["fb",300,18],["gb",-40],["gb",40]],tip:"Long, with punishing fescue off the tee."},{p:4,y:435,dl:6,at:250,el:10,fw:30,hz:[["fb",250,-18],["gb",-40],["gb",40]],tip:"Elevated green, bunkers left."},{p:4,y:515,dl:-12,at:280,el:8,fw:30,hz:[["xb",270,14],["gb",-40],["gb",40]],tip:"Must carry the diagonal bunker."},{p:5,y:608,dl:8,at:300,el:5,fw:32,hz:[["fb",300,-18],["fb",460,18],["gb",-40]],tip:"Three-shot par 5."},{p:3,y:161,el:-15,hz:[["gb",-30],["gb",30],["gb",150]],tip:"Short, downhill, well bunkered."},{p:4,y:478,dl:-8,at:260,el:45,fw:30,gs:1.5,hz:[["fb",270,18],["gb",-20],["gb",30]],tip:"Brutal uphill approach to a severe green."},{p:4,y:490,dl:-6,at:280,el:-25,fw:32,hz:[["fb",260,-18],["gb",-40],["gb",40]],tip:"Downhill drive, uphill finish."},{p:3,y:207,sig:!0,el:0,gw:1,hz:[["gb",-20,1.2],["gb",30,1.2],["gb",90],["gb",-90],["gb",170],["stands",-120],["stands",120]],tip:"The amphitheater. Bunkers everywhere, and the crowd is loud."},{p:4,y:411,sig:!0,el:25,fw:26,hz:[["fb",250,-18],["fb",250,18],["fb",275,-16],["fb",275,17],["gb",-40],["gb",40],["stands",110]],tip:"Bunkers pinch the fairway like a funnel. Uphill finish."}]},{id:"pinehurst",cardHole:17,name:"Pinehurst Resort \u2014 No. 2",short:"PINEHURST NO. 2",location:"Pinehurst, North Carolina",designer:"Donald Ross, 1907 \xB7 Coore & Crenshaw, 2011",blurb:"Donald Ross's turtle-back greens repel everything. Sandy waste and wiregrass line every hole.",theme:"pinehurst",wind:[2,10],stimp:12.5,firmness:.75,unlock:2,accent:"#a1814f",holes:[{p:4,y:402,dl:6,at:250,el:0,fw:36,dome:!0,hz:[["waste",220,-32,14,60],["waste",250,32,12,50],["gb",40]],tip:"Welcome to the turtle-backs. Middle of the green is always good."},{p:4,y:469,dl:-4,at:270,el:6,fw:36,dome:!0,hz:[["waste",260,34,14,70],["gb",-40]],tip:"Long, with a green that sheds shots left and right."},{p:4,y:387,dl:-12,at:240,el:4,fw:34,dome:!0,hz:[["waste",200,-30,14,50],["gb",40]],tip:"Short par 4. Precision over power."},{p:4,y:529,dl:8,at:290,el:-12,fw:36,dome:!0,hz:[["waste",270,-34,16,80],["fb",290,18],["gb",-40]],tip:"Former par 5, now a brute."},{p:5,y:576,dl:-10,at:300,el:10,fw:34,dome:!0,hz:[["waste",300,32,16,90],["gb",-40]],tip:"Reachable, but the green falls off on all sides."},{p:3,y:220,el:4,dome:!0,hz:[["gb",-40],["gb",40],["waste",150,24,10,30]],tip:"Long par 3 to a crowned green."},{p:4,y:424,dl:20,at:240,el:6,fw:34,dome:!0,hz:[["waste",220,26,16,40],["gb",-40]],tip:"Dogleg right around the sandy scrub."},{p:4,y:502,dl:-6,at:280,el:10,fw:34,dome:!0,hz:[["waste",270,-32,14,70],["gb",40]],tip:"Uphill, into the breeze."},{p:3,y:191,el:0,dome:!0,hz:[["gb",0,1.2],["gb",-60]],tip:"Tricky green, bunker fronting."},{p:5,y:617,dl:-8,at:320,el:-10,fw:36,dome:!0,hz:[["waste",290,34,16,90],["waste",470,-30,14,60],["gb",40]],tip:"Longest hole on the course."},{p:4,y:483,dl:4,at:280,el:0,fw:34,dome:!0,hz:[["waste",260,-32,14,60],["gb",40]],tip:"Straight, but the green is a mushroom."},{p:4,y:484,dl:-6,at:260,el:0,fw:34,dome:!0,hz:[["waste",250,32,14,60],["gb",-40]],tip:"Long iron approach to an elevated green."},{p:4,y:380,dl:8,at:240,el:12,fw:34,dome:!0,hz:[["waste",210,-32,14,50],["gb",40],["gb",-40]],tip:"Uphill short par 4."},{p:4,y:473,dl:-8,at:270,el:0,fw:34,dome:!0,hz:[["waste",250,32,16,70],["gb",40]],tip:"Fairway tilts toward the waste."},{p:3,y:206,el:0,dome:!0,hz:[["gb",-40],["gb",40],["gb",150]],tip:"Turtle-back green \u2014 anything long runs away."},{p:4,y:528,dl:-10,at:270,el:-5,fw:34,dome:!0,hz:[["waste",220,0,22,24],["gb",40]],tip:"Carry the waste area off the tee."},{p:3,y:205,sig:!0,el:0,dome:!0,hz:[["gb",-30],["gb",40],["gb",90],["stands",-120]],tip:"Long par 3 with a green shaped like an overturned bowl."},{p:4,y:451,sig:!0,dl:12,at:260,el:20,fw:32,dome:!0,hz:[["waste",240,32,14,50],["gb",-30],["gb",40],["stands",110],["stands",-110]],tip:"Payne Stewart's putt. Uphill to the clubhouse."}]},{id:"standrews",cardHole:17,name:"St Andrews Links \u2014 Old Course",short:"ST ANDREWS OLD COURSE",location:"St Andrews, Fife, Scotland",designer:"Nature, 15th century \xB7 Old Tom Morris",blurb:"The Home of Golf. Double greens, 112 pot bunkers, firm turf and the Road Hole.",theme:"standrews",wind:[8,22],stimp:10.5,firmness:.9,unlock:1,accent:"#7a6a3a",holes:[{p:4,y:376,name:"Burn",el:0,fw:90,gw:1.3,gs:.7,hz:[["cross",350,358],["bridge",60],["stands",150]],tip:"The widest fairway in golf, but the Swilcan Burn guards the green."},{p:4,y:453,name:"Dyke",dl:6,at:250,el:0,fw:60,gw:1.6,gs:.8,hz:[["pot",260,18],["pot",310,-12],["gb",-30,.6],["waste",220,45,20,50]],tip:"Gorse right. Huge double green."},{p:4,y:397,name:"Cartgate (Out)",el:0,fw:60,gw:1.6,gs:.8,hz:[["pot",210,4],["pot",230,8],["pot",300,-8],["gb",-30,.9]],tip:"Pot bunkers dot the line."},{p:4,y:480,name:"Ginger Beer",dl:-4,at:260,el:0,fw:50,gw:1.6,gs:.8,hz:[["pot",260,10],["pot",350,-8],["gb",0,.8]],tip:"Valley fairway between mounds."},{p:5,y:568,name:"Hole O'Cross (Out)",dl:-4,at:300,el:0,fw:60,gw:2,gs:.8,hz:[["pot",250,6],["pot",262,12],["pot",330,0],["pot",420,-6],["gb",0,.6]],tip:"Enormous double green."},{p:4,y:412,name:"Heathery (Out)",el:0,fw:55,gw:1.6,gs:.8,hz:[["pot",240,-8],["pot",250,4],["waste",200,42,20,60]],tip:"Blind drive over gorse."},{p:4,y:371,name:"High (Out)",dl:12,at:240,el:4,fw:55,gw:1.8,gs:.8,hz:[["pot",250,8],["gb",0,1.1]],tip:"Shell bunker guards the shared green with 11."},{p:3,y:175,name:"Short",el:2,gw:1.3,gs:.8,hz:[["gb",-10,.7]],tip:"First par 3. Small pot guards the front."},{p:4,y:352,name:"End",el:0,fw:70,gw:1.3,gs:.6,hz:[["pot",230,-6],["pot",260,10]],tip:"Driveable in the right wind."},{p:4,y:386,name:"Bobby Jones",el:0,fw:70,gw:1.4,gs:.7,hz:[["pot",250,6],["gb",-20,.6]],tip:"Named for Bobby Jones."},{p:3,y:174,name:"High (In)",el:4,gw:1.8,gs:1.4,hz:[["gb",-20,.8],["gb",20,.7]],tip:"Hill and Strath bunkers. Estuary behind."},{p:4,y:348,name:"Heathery (In)",el:2,fw:60,gw:1.6,gs:1,hz:[["pot",200,0],["pot",230,6],["pot",250,-4],["pot",290,4]],tip:"Hidden pot bunkers dot the fairway."},{p:4,y:465,name:"Hole O'Cross (In)",dl:4,at:270,el:0,fw:60,gw:2,gs:.8,hz:[["pot",270,-8],["pot",290,0],["gb",0,.7],["waste",250,44,20,60]],tip:"Coffin bunkers in the fairway."},{p:5,y:618,name:"Long",sig:!0,dl:-6,at:300,el:0,fw:60,gw:1.8,gs:.8,hz:[["pot",250,12],["pot",262,6],["pot",270,14],["fb",450,0,13,11],["waste",220,40,20,60]],tip:"Beware the Beardies and Hell Bunker at 450."},{p:4,y:455,name:"Cartgate (In)",el:0,fw:60,gw:1.6,gs:.8,hz:[["pot",260,-10],["pot",290,8]],tip:"Aim at the church spire."},{p:4,y:418,name:"Corner of the Dyke",dl:-4,at:250,el:0,fw:50,gw:1.4,gs:.8,hz:[["pot",250,0],["pot",255,6],["lat",1,200,400,28],["gb",-30,.6]],tip:"Principal's Nose in the middle, OB railway right."},{p:4,y:495,name:"Road",sig:!0,dl:18,at:250,el:0,fw:45,gw:1,gs:1.2,hz:[["road"],["gb",-40,.7],["waste",120,25,18,40]],tip:"Drive over the hotel sheds. The Road Bunker eats anything left."},{p:4,y:357,name:"Tom Morris",sig:!0,el:0,fw:100,gw:1.6,gs:.6,hz:[["cross",25,33],["bridge",29],["valley"],["stands",-90],["stands",150]],tip:"Over the Swilcan Bridge and home. Avoid the Valley of Sin."}]},{id:"valhalla",cardHole:12,name:"Valhalla Golf Club",short:"VALHALLA",location:"Louisville, Kentucky",designer:"Jack Nicklaus, 1986",blurb:"Nicklaus parkland in bluegrass country. Floyds Fork creek winds through the front.",theme:"valhalla",wind:[3,12],stimp:12.5,firmness:.5,unlock:3,accent:"#55357a",holes:[{p:4,y:484,dl:-10,at:280,el:-5,fw:32,hz:[["fb",280,18],["cross",440,450],["gb",-40]],tip:"Creek fronts the green."},{p:4,y:500,dl:-14,at:280,el:5,fw:32,hz:[["lat",-1,300,520,22],["gb",40]],tip:"Floyds Fork runs down the left."},{p:3,y:207,el:-10,hz:[["gpond",-40,1.2],["gb",40]],tip:"Water left of the green."},{p:4,y:372,dl:10,at:240,el:0,fw:30,hz:[["lat",1,220,390,22],["gb",-40]],tip:"Creek down the right."},{p:4,y:463,dl:-6,at:260,el:8,fw:30,hz:[["fb",260,16],["gb",-40],["gb",40]],tip:"Uphill approach."},{p:4,y:495,dl:12,at:280,el:0,fw:30,hz:[["cross",300,320],["fb",260,-16],["gb",40]],tip:"Creek crosses the fairway \u2014 lay up or carry."},{p:5,y:597,dl:-8,at:300,el:0,fw:28,hz:[["lat",1,180,380,30],["fb",460,-14],["gb",40]],tip:"Split fairway: the island route saves a shot."},{p:3,y:190,el:5,hz:[["gb",0,1.3],["gb",150]],tip:"Deep bunker short of the green."},{p:4,y:415,dl:6,at:250,el:10,fw:30,hz:[["fb",260,-16],["gb",40]],tip:"Elevated green."},{p:5,y:590,dl:-8,at:300,el:-10,fw:32,hz:[["fb",290,18],["gb",-40]],tip:"Downhill par 5 \u2014 reachable."},{p:3,y:212,el:0,hz:[["gb",-40],["gb",40]],tip:"Two-tier green."},{p:4,y:467,dl:6,at:270,el:15,fw:30,hz:[["fb",270,-16],["gb",40]],tip:"Uphill all the way."},{p:4,y:350,sig:!0,dl:-6,at:250,el:0,fw:30,gw:.8,hz:[["island"],["stands",120]],tip:"The rock-walled island green. Short, but no margin."},{p:3,y:254,el:-10,hz:[["gb",0,1.4],["gb",-40],["gb",40]],tip:"Big carry over the front bunker."},{p:4,y:435,dl:6,at:250,el:0,fw:30,hz:[["lat",1,300,460,16],["gb",-40]],tip:"Creek right of the green."},{p:4,y:508,dl:-6,at:280,el:5,fw:30,hz:[["fb",270,16],["gb",40]],tip:"Long, uphill finish to the stretch."},{p:4,y:472,dl:4,at:260,el:0,fw:30,hz:[["fb",280,-16],["gb",-40],["gb",40]],tip:"Fairway bunkers both sides."},{p:5,y:570,sig:!0,dl:12,at:300,el:10,fw:32,hz:[["lat",1,380,570,20],["fb",300,-18],["gb",-40],["stands",90],["stands",-90]],tip:"Water right of the green. Grandstands await the finish."}]},{id:"oakmont",cardHole:2,name:"Oakmont Country Club",short:"OAKMONT",location:"Oakmont, Pennsylvania",designer:"Henry Fownes, 1903",blurb:"The ultimate test. Greens at 14+ on the Stimpmeter, 175 bunkers and the Church Pews.",theme:"oakmont",wind:[2,10],stimp:14.5,firmness:.7,unlock:4,accent:"#6b4a2b",holes:[{p:4,y:482,el:-20,fw:30,gs:1.4,hz:[["fb",270,-16],["fb",290,16],["gb",-40],["gb",40]],tip:"Green slopes away from you. Brutal opener."},{p:4,y:341,dl:-4,at:230,el:10,fw:28,gs:1.3,hz:[["fb",230,16],["fb",250,-16],["gb",0]],tip:"Short but severe green."},{p:4,y:428,sig:!0,el:5,fw:28,gs:1.2,hz:[["pews",220,310,-1],["fb",260,18],["gb",-40],["gb",40]],tip:"The Church Pews \u2014 twelve grass ridges inside a giant bunker, left."},{p:5,y:609,dl:6,at:300,el:5,fw:30,gs:1.2,hz:[["pews",240,320,-1],["fb",310,18],["gb",-40]],tip:"The Pews again, from the other side."},{p:4,y:382,dl:8,at:240,el:0,fw:28,gs:1.3,hz:[["fb",240,-16],["gb",40]],tip:"Narrow with a ditch."},{p:3,y:194,el:0,gs:1.3,hz:[["gb",-40],["gb",40]],tip:"Green falls away left."},{p:4,y:479,dl:-6,at:260,el:10,fw:28,gs:1.3,hz:[["fb",260,16],["fb",280,-16],["gb",40]],tip:"Uphill par 4."},{p:3,y:289,el:0,gw:1.1,hz:[["waste",180,-24,14,60],["gb",40]],tip:"Longest par 3 in championship golf. Sahara bunker left."},{p:4,y:477,dl:4,at:260,el:20,fw:30,gw:1.5,gs:1.2,hz:[["fb",260,-16],["gb",40]],tip:"Blind uphill drive to a huge green."},{p:4,y:462,dl:-4,at:260,el:-10,fw:28,gs:1.3,hz:[["fb",260,16],["gb",-40],["gb",40]],tip:"Downhill, green slopes away."},{p:4,y:379,dl:8,at:240,el:10,fw:28,gs:1.3,hz:[["fb",240,-16],["gb",0]],tip:"Uphill, small target."},{p:5,y:667,dl:-6,at:320,dl2:6,at2:480,el:0,fw:30,gs:1.2,hz:[["fb",300,18],["fb",460,-16],["gb",40]],tip:"Monstrous par 5."},{p:3,y:183,el:0,gs:1.3,hz:[["gb",-40],["gb",40],["gb",0]],tip:"Mid-iron to a tricky green."},{p:4,y:358,dl:6,at:230,el:5,fw:28,gs:1.3,hz:[["fb",230,-14],["fb",250,16],["gb",0]],tip:"Short but deadly."},{p:4,y:500,dl:-6,at:270,el:0,fw:28,gs:1.2,hz:[["pews",250,310,-1],["fb",290,18],["gb",40]],tip:"Long, with bunkers left."},{p:3,y:231,el:0,gs:1.2,hz:[["gb",-40],["gb",40],["gb",150]],tip:"Long par 3."},{p:4,y:313,sig:!0,el:15,fw:26,gw:.8,gs:1.2,hz:[["fb",230,-8],["fb",245,8],["gb",-40],["gb",40],["gb",0,.8]],tip:"Driveable \u2014 if you can find the needle-thin green."},{p:4,y:484,sig:!0,dl:6,at:260,el:10,fw:28,gs:1.3,hz:[["fb",260,-16],["fb",280,16],["gb",-40],["gb",40],["stands",110],["stands",-110]],tip:"Uphill to the clubhouse. Green slopes hard."}]},{id:"riviera",cardHole:5,name:"Riviera Country Club",short:"RIVIERA",location:"Pacific Palisades, California",designer:"George C. Thomas Jr., 1927",blurb:"Hogan's Alley. Kikuyu grass, eucalyptus, a barranca and a bunker in the middle of the 6th green.",theme:"riviera",wind:[2,9],stimp:12.5,firmness:.6,unlock:3,accent:"#9a3b2c",holes:[{p:5,y:503,el:-60,fw:36,hz:[["fb",290,18],["gb",-40],["gb",40]],tip:"Tee sits below the clubhouse. Birdie chance."},{p:4,y:471,dl:-6,at:270,el:10,fw:30,hz:[["xcanyon",380,395],["fb",270,16],["gb",40]],tip:"Barranca crosses short of the green."},{p:4,y:434,dl:6,at:260,el:0,fw:30,hz:[["fb",260,-16],["gb",40]],tip:"Tight driving hole."},{p:3,y:236,el:-10,hz:[["gb",0,1.5],["gb",150]],tip:"Ben Hogan's favorite par 3. Huge bunker short."},{p:4,y:434,dl:-6,at:260,el:5,fw:30,hz:[["fb",260,16],["gb",-40]],tip:"Hill to the right of the green."},{p:3,y:199,sig:!0,el:0,gw:1.2,hz:[["gcb"],["gb",-40],["gb",40],["gb",160]],tip:"The famous bunker in the MIDDLE of the green."},{p:4,y:408,dl:8,at:250,el:0,fw:30,hz:[["xcanyon",300,312],["fb",250,-16],["gb",40]],tip:"Barranca in play off the tee."},{p:4,y:433,dl:-8,at:260,el:0,fw:32,hz:[["waste",220,0,8,30],["gb",40]],tip:"Split fairway divided by the barranca."},{p:4,y:458,dl:6,at:260,el:5,fw:30,hz:[["fb",260,-16],["gb",40],["gb",-40]],tip:"Uphill par 4."},{p:4,y:315,sig:!0,dl:-6,at:200,el:0,fw:32,gw:.8,gs:1.4,hz:[["fb",230,-8,10,12],["fb",250,10],["gb",-40],["gb",40,.8],["gb",150]],tip:"The best short par 4 in the world. Driveable \u2014 but the green is a knife-edge."},{p:5,y:583,dl:-6,at:300,el:10,fw:30,hz:[["fb",290,18],["tree",540,-20,7],["gb",-40]],tip:"Eucalyptus and kikuyu everywhere."},{p:4,y:479,dl:6,at:270,el:5,fw:30,hz:[["fb",270,-16],["tree",440,16,8],["xcanyon",410,420],["gb",40]],tip:"Bogey's Tree guards the right."},{p:4,y:459,dl:-8,at:260,el:0,fw:30,hz:[["fb",260,18],["gb",-40]],tip:"Barranca left."},{p:3,y:192,el:0,hz:[["gb",0],["gb",40],["gb",-40]],tip:"Bunkers front and sides."},{p:4,y:487,dl:-6,at:270,el:5,fw:30,gs:1.3,hz:[["fb",270,16],["gb",-40],["gb",40]],tip:"Tough green with tiers."},{p:3,y:166,el:0,gw:.8,hz:[["gb",-40],["gb",40],["gb",0]],tip:"Short iron to a small, bunkered green."},{p:5,y:590,dl:-10,at:320,el:10,fw:30,hz:[["fb",300,18],["fb",480,-16],["gb",40]],tip:"Uphill three-shotter."},{p:4,y:475,sig:!0,dl:16,at:250,el:35,fw:30,hz:[["fb",280,-18],["gb",-40],["stands",110],["stands",-110],["stands",180]],tip:"Blind uphill drive, then the amphitheater green below the clubhouse."}]}],Ar=[{id:"champ",name:"Championship",color:"#111111",factor:1},{id:"tour",name:"Tournament",color:"#1e56b8",factor:.93},{id:"member",name:"Member",color:"#f2f2f2",factor:.86},{id:"forward",name:"Forward",color:"#c62828",factor:.75}];function ju(s,t=s.holes){return t.reduce((e,n)=>e+n.p,0)}function Tc(s,t=1){return s.holes.reduce((e,n)=>e+Math.round(n.y*t),0)}var ty={id:"range",name:"Championship Practice Range",short:"PRACTICE RANGE",location:"Golf.ai Academy",designer:"",blurb:"Target greens every 50 yards.",theme:"valhalla",wind:[2,10],stimp:12,firmness:.55,unlock:1,accent:"#2f7d3a",holes:[{p:5,y:340,fw:120,el:0,gw:1.4,range:!0,hz:[["target",50,-12],["target",100,10],["target",150,-14],["target",200,12],["target",250,-10],["target",300,8]],tip:"Hit every club and study the launch monitor."}]};function Yn(s){return s==="range"?ty:Un.find(t=>t.id===s)||Un[0]}var Ha=[{id:"DR",name:"Driver",short:"DR",cat:"wood",loft:10.5,carry:252,launch:11.5,spin:2600,accuracy:.62,forgiveness:.7,teeOnly:!1},{id:"3W",name:"3 Wood",short:"3W",cat:"wood",loft:15,carry:232,launch:11.5,spin:3500,accuracy:.68,forgiveness:.65},{id:"5W",name:"5 Wood",short:"5W",cat:"wood",loft:18,carry:218,launch:12.5,spin:4300,accuracy:.71,forgiveness:.72},{id:"7W",name:"7 Wood",short:"7W",cat:"wood",loft:21,carry:206,launch:14,spin:4800,accuracy:.73,forgiveness:.76},{id:"3H",name:"3 Hybrid",short:"3H",cat:"hybrid",loft:19,carry:208,launch:13,spin:4500,accuracy:.73,forgiveness:.75},{id:"4H",name:"4 Hybrid",short:"4H",cat:"hybrid",loft:22,carry:198,launch:14,spin:4900,accuracy:.75,forgiveness:.76},{id:"2I",name:"2 Iron",short:"2i",cat:"iron",loft:18,carry:212,launch:10.5,spin:4200,accuracy:.66,forgiveness:.45},{id:"3I",name:"3 Iron",short:"3i",cat:"iron",loft:21,carry:203,launch:11.5,spin:4500,accuracy:.69,forgiveness:.5},{id:"4I",name:"4 Iron",short:"4i",cat:"iron",loft:23,carry:195,launch:12.5,spin:4800,accuracy:.72,forgiveness:.55},{id:"5I",name:"5 Iron",short:"5i",cat:"iron",loft:26,carry:185,launch:13.5,spin:5300,accuracy:.75,forgiveness:.6},{id:"6I",name:"6 Iron",short:"6i",cat:"iron",loft:29,carry:174,launch:15,spin:6200,accuracy:.78,forgiveness:.65},{id:"7I",name:"7 Iron",short:"7i",cat:"iron",loft:33,carry:162,launch:16.5,spin:7e3,accuracy:.8,forgiveness:.7},{id:"8I",name:"8 Iron",short:"8i",cat:"iron",loft:37,carry:150,launch:18.5,spin:7800,accuracy:.82,forgiveness:.72},{id:"9I",name:"9 Iron",short:"9i",cat:"iron",loft:41,carry:138,launch:21,spin:8500,accuracy:.84,forgiveness:.74},{id:"PW",name:"Pitching Wedge",short:"PW",cat:"wedge",loft:46,carry:126,launch:24,spin:9200,accuracy:.86,forgiveness:.76},{id:"GW",name:"Gap Wedge",short:"GW",cat:"wedge",loft:50,carry:112,launch:27,spin:9700,accuracy:.87,forgiveness:.76},{id:"SW",name:"Sand Wedge",short:"SW",cat:"wedge",loft:56,carry:97,launch:31,spin:10100,accuracy:.88,forgiveness:.78},{id:"LW",name:"Lob Wedge",short:"LW",cat:"wedge",loft:60,carry:82,launch:35,spin:10400,accuracy:.88,forgiveness:.7},{id:"PT",name:"Putter",short:"PT",cat:"putter",loft:3,carry:0,launch:0,spin:0,accuracy:.95,forgiveness:.9}],za={wood:[{id:"tm-qi10",brand:"TaylorMade",model:"Qi10 Max",dist:1,acc:.03,forg:.12,spin:1.05,launch:.5,unlock:1},{id:"cw-ai",brand:"Callaway",model:"Paradym Ai Smoke",dist:1.01,acc:0,forg:.08,spin:1,launch:.2,unlock:1},{id:"ti-gt3",brand:"Titleist",model:"GT3",dist:1.02,acc:.04,forg:-.04,spin:.95,launch:0,unlock:3},{id:"pg-g430",brand:"Ping",model:"G430 Max 10K",dist:.99,acc:.06,forg:.16,spin:1.06,launch:.6,unlock:2},{id:"cb-ds",brand:"Cobra",model:"Darkspeed LS",dist:1.035,acc:-.03,forg:-.08,spin:.9,launch:-.4,unlock:5}],hybrid:[{id:"tm-qi10h",brand:"TaylorMade",model:"Qi10 Rescue",dist:1,acc:.02,forg:.08,spin:1,launch:.3,unlock:1},{id:"ti-gt2h",brand:"Titleist",model:"GT2 Hybrid",dist:1.01,acc:.03,forg:.04,spin:.98,launch:0,unlock:2},{id:"pg-g430h",brand:"Ping",model:"G430 Hybrid",dist:.995,acc:.05,forg:.12,spin:1.03,launch:.5,unlock:3}],iron:[{id:"tm-p790",brand:"TaylorMade",model:"P790",dist:1.02,acc:0,forg:.08,spin:.97,launch:.3,unlock:1},{id:"ti-t100",brand:"Titleist",model:"T100",dist:.99,acc:.06,forg:-.06,spin:1.04,launch:0,unlock:2},{id:"mz-243",brand:"Mizuno",model:"Pro 243",dist:1,acc:.05,forg:-.02,spin:1.03,launch:0,unlock:3},{id:"sx-zx7",brand:"Srixon",model:"ZX7 Mk II",dist:1,acc:.04,forg:0,spin:1.02,launch:.1,unlock:2},{id:"pg-i230",brand:"Ping",model:"i230",dist:1,acc:.03,forg:.05,spin:1,launch:.2,unlock:1},{id:"cw-apex",brand:"Callaway",model:"Apex Ai200",dist:1.03,acc:-.01,forg:.1,spin:.96,launch:.4,unlock:4}],wedge:[{id:"ti-sm10",brand:"Titleist",model:"Vokey SM10",dist:1,acc:.05,forg:0,spin:1.06,launch:0,unlock:1},{id:"cl-rtx6",brand:"Cleveland",model:"RTX 6 ZipCore",dist:1,acc:.04,forg:.04,spin:1.05,launch:0,unlock:1},{id:"cw-jaws",brand:"Callaway",model:"Jaws Raw",dist:1,acc:.03,forg:.02,spin:1.08,launch:.2,unlock:2},{id:"tm-mg4",brand:"TaylorMade",model:"MG4",dist:1,acc:.04,forg:.02,spin:1.07,launch:0,unlock:3}],putter:[{id:"sc-np2",brand:"Scotty Cameron",model:"Newport 2",dist:1,acc:.04,forg:0,spin:1,launch:0,unlock:1},{id:"bt-bb8",brand:"Bettinardi",model:"BB8 Flow",dist:1,acc:.05,forg:.04,spin:1,launch:0,unlock:2},{id:"od-7",brand:"Odyssey",model:"White Hot OG #7",dist:1,acc:.05,forg:.06,spin:1,launch:0,unlock:1},{id:"pg-anser",brand:"Ping",model:"Anser",dist:1,acc:.03,forg:.02,spin:1,launch:0,unlock:1},{id:"tm-spider",brand:"TaylorMade",model:"Spider Tour X",dist:1,acc:.06,forg:.08,spin:1,launch:0,unlock:4},{id:"sc-ph",brand:"Scotty Cameron",model:"Phantom 11",dist:1,acc:.07,forg:.07,spin:1,launch:0,unlock:6}]},Rr=[{id:"prov1",brand:"Titleist",model:"Pro V1",dist:1,spin:1.03,unlock:1,color:"#ffffff"},{id:"prov1x",brand:"Titleist",model:"Pro V1x",dist:1.01,spin:1.06,unlock:2,color:"#ffffff"},{id:"tp5",brand:"TaylorMade",model:"TP5x",dist:1.012,spin:1,unlock:3,color:"#ffffff"},{id:"chrome",brand:"Callaway",model:"Chrome Soft",dist:1,spin:1,unlock:1,color:"#fff8d0"},{id:"zstar",brand:"Srixon",model:"Z-Star XV",dist:1.008,spin:1.04,unlock:4,color:"#ffffff"},{id:"bxs",brand:"Bridgestone",model:"Tour B XS",dist:1.004,spin:1.05,unlock:5,color:"#ffffff"},{id:"optic",brand:"Srixon",model:"Q-Star Tour Divide",dist:1,spin:1,unlock:2,color:"#f6ff3c"}],Qu=["DR","3W","5W","3H","5I","6I","7I","8I","9I","PW","GW","SW","LW","PT"],td={wood:"tm-qi10",hybrid:"tm-qi10h",iron:"tm-p790",wedge:"ti-sm10",putter:"sc-np2",ball:"prov1"};function ey(s){return Ha.find(t=>t.id===s)}function ny(s,t){let e=za[s];return e.find(n=>n.id===t[s])||e[0]}function Ga(s,t,e){let n=Rr.find(r=>r.id===t.ball)||Rr[0],i=Ha.map(r=>r.id);return s.slice().sort((r,o)=>i.indexOf(r)-i.indexOf(o)).map(r=>{let o=ey(r),a=ny(o.cat,t),l=.82+(e.power??50)/100*.32,u=o.cat==="wood"||o.cat==="hybrid"?e.driving??e.accuracy??50:o.cat==="wedge"?e.shortGame??50:e.approach??e.accuracy??50;return{id:r,name:o.name,short:o.short,cat:o.cat,loft:o.loft,brand:a.brand,model:a.model,carry:o.carry*a.dist*n.dist*(o.cat==="putter"?1:l),launch:o.launch+a.launch,spin:o.spin*a.spin*n.spin,accuracy:Math.min(.99,o.accuracy+a.acc+(u-50)/500),forgiveness:Math.min(.99,o.forgiveness+a.forg)}})}var Ac="golfai.profile.v1",Bi={easy:{name:"Easy",window:1.8,disp:.5,putt:.4,wind:.6,cupMul:1.45,captureMul:1.35,landing:"wind",puttPreview:1,xp:.7,gimme:2},normal:{name:"Normal",window:1,disp:.85,putt:.8,wind:1,cupMul:1.15,captureMul:1.15,landing:"nowind",puttPreview:.6,xp:1,gimme:0},hard:{name:"Hard",window:.72,disp:1.1,putt:1.1,wind:1.15,cupMul:1,captureMul:1,landing:"line",puttPreview:.3,xp:1.3,gimme:0},realistic:{name:"Realistic",window:.55,disp:1.4,putt:1.4,wind:1.35,cupMul:1,captureMul:.95,landing:"none",puttPreview:0,xp:1.6,gimme:0}},As=s=>500+(s-1)*300,iy=30;function Va(){return{version:1,look:{...vr},level:1,xp:0,skillPoints:0,skills:{driving:50,approach:50,shortGame:50,putting:50,recovery:50},bag:Qu.slice(),equipment:{...td},settings:{difficulty:"normal",puttGuide:!0,landingMarker:!0,tracer:!0,flyover:!0,autoCamera:!0,quality:"high",master:.8,sfx:.9,amb:.6,windSetting:"normal",pins:"medium",lastCourse:"augusta",lastTee:"tour"},career:{rounds:0,rounds18:0,holes:0,strokes:0,parSum:0,score18Sum:0,fairways:0,fairwayChances:0,gir:0,girChances:0,putts:0,puttHoles:0,drives:0,driveSum:0,longestDrive:0,longestPutt:0,aces:0,albatross:0,eagles:0,birdies:0,pars:0,bogeys:0,doubles:0,worse:0,sandSaves:0,sandChances:0,upDowns:0,upDownChances:0,penalties:0,best:{}},history:[]}}function ed(){try{let s=localStorage.getItem(Ac);if(!s)return Va();let t=JSON.parse(s),e=Va();return{...e,...t,look:{...e.look,...t.look},skills:{...e.skills,...t.skills},equipment:{...e.equipment,...t.equipment},settings:{...e.settings,...t.settings},career:{...e.career,...t.career,best:{...t.career?.best||{}}}}}catch(s){return console.warn("profile load failed",s),Va()}}function nd(s){try{localStorage.setItem(Ac,JSON.stringify(s))}catch(t){console.warn("save failed",t)}}function id(){try{localStorage.removeItem(Ac)}catch{}return Va()}function Wa(s){let t=s.skills;return{power:t.driving,driving:t.driving,approach:t.approach,shortGame:t.shortGame,putting:t.putting,recovery:t.recovery}}function sd(s,t,e,n){let i=Bi[e]||Bi.normal,r=n*18+t.pars*10+t.birdies*45+t.eagles*140+t.aces*600+(t.albatross||0)*800+t.fairways*6+t.gir*9+t.sandSaves*20+t.upDowns*15,o=t.toPar;n>=9&&(r+=Math.max(0,n/18*200-Math.max(0,o)*8)),r=Math.round(r*i.xp);let a=s.level;s.xp+=r;let c=[];for(;s.level<iy&&s.xp>=As(s.level);)s.xp-=As(s.level),s.level++,s.skillPoints+=3,c.push(s.level);let l=s.skills,h=(u,d)=>{l[u]=Math.min(99,Math.round((l[u]+d)*10)/10)};return t.fairwayChances&&h("driving",.4*t.fairways/t.fairwayChances),t.girChances&&h("approach",.5*t.gir/t.girChances),t.upDownChances&&h("shortGame",.6*t.upDowns/Math.max(1,t.upDownChances)),t.puttHoles&&h("putting",Math.max(0,.6*(2.1-t.putts/t.puttHoles))),(t.sandChances||t.recoveries)&&h("recovery",.3),{xp:r,levelUps:c,from:a,to:s.level}}function Rc(s,t){let e=s.career,n=t.stats;e.rounds++,e.holes+=n.holes,e.strokes+=n.strokes,e.parSum+=n.par,n.holes===18&&(e.rounds18++,e.score18Sum+=n.strokes);for(let o of["fairways","fairwayChances","gir","girChances","putts","aces","eagles","birdies","pars","bogeys","doubles","worse","sandSaves","sandChances","upDowns","upDownChances","penalties","albatross"])e[o]+=n[o]||0;e.puttHoles+=n.puttHoles||n.holes,e.drives+=n.drives,e.driveSum+=n.driveSum,e.longestDrive=Math.max(e.longestDrive,n.longestDrive),e.longestPutt=Math.max(e.longestPutt,n.longestPutt);let i=`${t.courseId}:${n.holes}`,r=e.best[i];(!r||n.toPar<r.toPar)&&(e.best[i]={score:n.strokes,toPar:n.toPar,date:Date.now(),golfer:t.golferName,tee:t.tee}),s.history.unshift({course:t.courseId,holes:n.holes,score:n.strokes,toPar:n.toPar,date:Date.now(),golfer:t.golferName,diff:t.difficulty}),s.history=s.history.slice(0,30)}var Rs=(s,t=document)=>t.querySelector(s),Cr=s=>s===0?"E":s>0?`+${s}`:`${s}`,fe=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),Hi={round18:{name:"Quick Round",sub:"18 holes \xB7 full round"},round9:{name:"9 Holes",sub:"Front or back nine"},coursePractice:{name:"Course Practice",sub:"Pick any hole and replay it"},practice:{name:"Practice",sub:"Chipping \xB7 bunker \xB7 putting \xB7 approach"},range:{name:"Driving Range",sub:"Launch monitor \xB7 test every club"}};function rd(s){return[...Un.filter(t=>t.unlock===s).map(t=>`\u26F3 ${t.short}`),...Object.values(za).flat().filter(t=>t.unlock===s).map(t=>`\u{1F3CC} ${t.brand} ${t.model}`),...Rr.filter(t=>t.unlock===s).map(t=>`\u26AA ${t.brand} ${t.model}`),...[...yc,...xc,...vc,...bc,..._c,...Mc].filter(t=>t.unlock===s).map(t=>`\u{1F455} ${t.name}`)]}var Xa=class{constructor(t,e){this.root=t,this.app=e,this.setup=null}get profile(){return this.app.profile}show(t){this.root.classList.toggle("visible",t)}render(t,e=""){this.root.innerHTML=`<div class="screen ${e}">${t}</div>`,this.root.scrollTop=0,this.root.querySelectorAll("[data-go]").forEach(n=>n.addEventListener("click",()=>{mt.init(),mt.click(),this.go(n.dataset.go)}))}go(t){switch(t!=="golfer"&&this.app.menuScene(),t){case"main":return this.main();case"career":return this.career();case"golfer":return this.golfer();case"bag":return this.bag();case"settings":return this.settings();case"stats":return this.career();default:if(Hi[t])return this.startSetup(t)}}profileBadge(){let t=this.profile,e=As(t.level);return`<div class="badge glass">
      <div class="avatar" style="background:${t.look.shirt}">${fe((t.look.name||"Y")[0])}</div>
      <div><div class="b-name">${fe(t.look.name)}</div><div class="b-lvl">LEVEL ${t.level}${t.skillPoints?` \xB7 <span class="pts">${t.skillPoints} skill pts</span>`:""}</div>
      <div class="xpbar"><i style="width:${Math.min(100,t.xp/e*100)}%"></i></div></div></div>`}main(){this.app.menuScene();let e=this.profile.history[0];this.render(`
      <div class="main-layout">
        <div class="logo">
          <div class="logo-mark">\u26F3</div>
          <div><div class="logo-title">GOLF<span>.AI</span></div><div class="logo-sub">CHAMPIONSHIP GOLF</div></div>
        </div>
        ${this.profileBadge()}
        <div class="main-menu">
          <button class="menu-item hero" data-go="round18"><b>QUICK ROUND</b><span>18 holes at a famous course</span></button>
          <button class="menu-item" data-go="round9"><b>9 HOLES</b><span>${Hi.round9.sub}</span></button>
          <button class="menu-item" data-go="coursePractice"><b>COURSE PRACTICE</b><span>${Hi.coursePractice.sub}</span></button>
          <button class="menu-item" data-go="practice"><b>PRACTICE</b><span>${Hi.practice.sub}</span></button>
          <button class="menu-item" data-go="range"><b>DRIVING RANGE</b><span>${Hi.range.sub}</span></button>
          <div class="menu-split">
            <button class="menu-item small" data-go="career"><b>CAREER</b><span>Skills \xB7 stats \xB7 unlocks</span></button>
            <button class="menu-item small" data-go="golfer"><b>MY GOLFER</b><span>Customize</span></button>
            <button class="menu-item small" data-go="bag"><b>MY BAG</b><span>Clubs & ball</span></button>
            <button class="menu-item small" data-go="settings"><b>SETTINGS</b><span>Difficulty \xB7 audio</span></button>
          </div>
        </div>
        ${e?`<div class="last-round glass">LAST ROUND \xB7 ${fe(Yn(e.course).short)} \xB7 ${e.holes} holes \xB7 <b>${e.score}</b> (${Cr(e.toPar)})</div>`:""}
        <div class="credits">Personal-use project. Course layouts are approximations of the real courses.</div>
      </div>`,"main")}startSetup(t){let e=this.profile.settings;this.setup={mode:t,step:0,golfer:this.setup?.golfer||"custom",courseId:e.lastCourse||"augusta",teeId:e.lastTee||"tour",difficulty:e.difficulty,wind:e.windSetting,pins:e.pins,nine:"front",hole:0,practiceKind:"approach"},this.renderSetup()}renderSetup(){let t=this.setup,e=t.mode==="range"?["GOLFER","SETUP"]:["GOLFER","COURSE","SETUP"],n=e[t.step],i="";n==="GOLFER"?i=this.golferPicker():n==="COURSE"?i=this.coursePicker():i=this.setupOptions();let r=t.step===e.length-1;this.render(`
      <div class="setup">
        <div class="setup-head">
          <button class="btn ghost" id="back">\u2039 BACK</button>
          <div class="setup-title">${Hi[t.mode].name.toUpperCase()}<small>${Hi[t.mode].sub}</small></div>
          <div class="steps">${e.map((o,a)=>`<div class="step ${a===t.step?"on":a<t.step?"done":""}">${a+1}. ${o}</div>`).join("")}</div>
          <button class="btn primary" id="next">${r?"TEE IT UP \u25B8":"NEXT \u25B8"}</button>
        </div>
        <div class="setup-body">${i}</div>
      </div>`,"setup-screen"),Rs("#back",this.root).onclick=()=>{mt.click(),t.step===0?this.main():(t.step--,this.renderSetup())},Rs("#next",this.root).onclick=()=>{mt.init(),mt.click(),r?this.launch():(t.step++,this.renderSetup())},this.bindSetup(n)}golferPicker(){let t=this.setup,e=this.profile,n=(o,a,c,l,h,u="")=>`
      <div class="golfer-card ${t.golfer===o?"sel":""}" data-golfer="${o}">
        <div class="gc-avatar" style="background:linear-gradient(160deg, ${h.shirt}, ${h.pants})"><span>${fe(a.split(" ").map(d=>d[0]).join("").slice(0,2))}</span></div>
        <div class="gc-name">${fe(a)}</div><div class="gc-sub">${c}</div>
        <div class="attr-bars">${[["PWR",l.power],["ACC",l.accuracy??l.approach],["SHT",l.shortGame],["PUT",l.putting],["REC",l.recovery]].map(([d,f])=>`<div><span>${d}</span><i><b style="width:${f}%"></b></i><em>${Math.round(f)}</em></div>`).join("")}</div>${u}
      </div>`,i=Wa(e),r='<div class="section-title">YOUR GOLFER</div><div class="golfer-grid">';r+=n("custom",e.look.name,`Career golfer \xB7 Level ${e.level}`,{power:i.power,accuracy:i.approach,shortGame:i.shortGame,putting:i.putting,recovery:i.recovery},e.look,'<div class="gc-tag">EARNS XP</div>'),r+='</div><div class="section-title">TOUR PROS</div><div class="golfer-grid">';for(let o of gc)r+=n(o.id,o.name,o.country,o,{...vr,...o.look});return r+="</div>",r}coursePicker(){let t=this.setup,e=this.profile,n='<div class="course-grid">';for(let i of Un){let r=i.unlock>e.level,o=e.career.best[`${i.id}:18`],a=this.app.thumbs[i.id];n+=`<div class="course-card ${t.courseId===i.id?"sel":""} ${r?"locked":""}" data-course="${i.id}" style="--accent:${i.accent}">
        <div class="cc-img" style="${a?`background-image:url(${a})`:""}">${a?"":'<div class="shimmer"></div>'}</div>
        <div class="cc-body">
          <div class="cc-name">${fe(i.short)}</div>
          <div class="cc-loc">${fe(i.location)}</div>
          <div class="cc-meta"><span>18 HOLES</span><span>PAR ${ju(i)}</span><span>${Tc(i).toLocaleString()} YDS</span></div>
          <div class="cc-blurb">${fe(i.blurb)}</div>
          ${o?`<div class="cc-best">BEST ${o.score} (${Cr(o.toPar)})</div>`:""}
        </div>
        ${r?`<div class="lock">\u{1F512} UNLOCKS AT LEVEL ${i.unlock}</div>`:""}
      </div>`}return n+="</div>",n}setupOptions(){let t=this.setup,e=Yn(t.courseId),n=(r,o,a,c="")=>`<button class="opt ${t[r]===o?"on":""}" data-k="${r}" data-v="${o}"><b>${a}</b>${c?`<span>${c}</span>`:""}</button>`,i="";return t.mode!=="range"&&(i+=`<div class="section-title">${fe(e.name.toUpperCase())}</div><div class="setup-course-banner" style="--accent:${e.accent}"><div class="scb-img" style="background-image:url(${this.app.thumbs[e.id]||""})"></div><div><b>${fe(e.location)}</b><div>${fe(e.designer)}</div><div>Stimp ${e.stimp} \xB7 Firmness ${Math.round(e.firmness*10)}/10 \xB7 Wind ${e.wind[0]}\u2013${e.wind[1]} mph</div></div></div>`,i+=`<div class="section-title">TEES</div><div class="opts">${Ar.map(r=>n("teeId",r.id,`<i class="tee-dot" style="background:${r.color}"></i>${r.name}`,`${Tc(e,r.factor).toLocaleString()} yds`)).join("")}</div>`),t.mode==="round9"&&(i+=`<div class="section-title">NINE</div><div class="opts">${n("nine","front","Front Nine","Holes 1\u20139")}${n("nine","back","Back Nine","Holes 10\u201318")}</div>`),(t.mode==="coursePractice"||t.mode==="practice")&&(i+=`<div class="section-title">HOLE</div><div class="hole-grid">${e.holes.map((r,o)=>`<button class="hole-btn ${t.hole===o?"on":""} ${r.sig?"sig":""}" data-hole="${o}"><b>${o+1}</b><span>Par ${r.p} \xB7 ${r.y}</span>${r.name?`<em>${fe(r.name)}</em>`:""}</button>`).join("")}</div>`),t.mode==="practice"&&(i+=`<div class="section-title">DRILL</div><div class="opts">${n("practiceKind","approach","Approach","90\u2013180 yds, fairway")}${n("practiceKind","chipping","Chipping","Around the green")}${n("practiceKind","bunker","Bunker","Greenside sand")}${n("practiceKind","putting","Putting","6\u201340 ft")}${n("practiceKind","tee","Tee Shot","From the tee box")}</div>`),i+=`<div class="section-title">DIFFICULTY</div><div class="opts">${Object.entries(Bi).map(([r,o])=>n("difficulty",r,o.name,{easy:"Big sweet spot, full assist",normal:"Balanced",hard:"Small window, less assist",realistic:"Minimal assist, real dispersion"}[r])).join("")}</div>`,i+=`<div class="section-title">CONDITIONS</div><div class="opts">${n("wind","calm","Calm","Light breeze")}${n("wind","normal","Normal Wind","Course typical")}${n("wind","windy","Windy","Bring your low ball")}</div>`,t.mode!=="range"&&(i+=`<div class="opts">${n("pins","easy","Easy Pins","Center of greens")}${n("pins","medium","Medium Pins")}${n("pins","sunday","Sunday Pins","Tucked & tough")}</div>`),i}bindSetup(t){let e=this.setup;this.root.querySelectorAll("[data-golfer]").forEach(n=>n.onclick=()=>{e.golfer=n.dataset.golfer,mt.click(),this.renderSetup()}),this.root.querySelectorAll("[data-course]").forEach(n=>n.onclick=()=>{let i=Yn(n.dataset.course);if(i.unlock>this.profile.level){mt.tick(!1);return}e.courseId=i.id,mt.click(),this.renderSetup()}),this.root.querySelectorAll(".opt[data-k]").forEach(n=>n.onclick=()=>{e[n.dataset.k]=n.dataset.v,mt.click(),this.renderSetup()}),this.root.querySelectorAll("[data-hole]").forEach(n=>n.onclick=()=>{e.hole=+n.dataset.hole,mt.click(),this.renderSetup()}),t==="COURSE"&&this.app.ensureThumbs(()=>{this.setup&&this.root.querySelector(".course-grid")&&this.refreshThumbs()})}refreshThumbs(){this.root.querySelectorAll(".course-card").forEach(t=>{let e=this.app.thumbs[t.dataset.course],n=t.querySelector(".cc-img");e&&!n.style.backgroundImage&&(n.style.backgroundImage=`url(${e})`,n.innerHTML="")})}launch(){let t=this.setup,e=this.profile;e.settings.lastCourse=t.courseId,e.settings.lastTee=t.teeId,e.settings.difficulty=t.difficulty,e.settings.windSetting=t.wind,e.settings.pins=t.pins,this.app.save();let n,i,r;if(t.golfer==="custom")n=Wa(e),i=e.look,r=e.look.name;else{let c=gc.find(l=>l.id===t.golfer);n=Xu(c),i={...vr,...c.look,name:c.name},r=c.name}let o=[...Array(18).keys()];t.mode==="round9"&&(o=t.nine==="front"?o.slice(0,9):o.slice(9)),(t.mode==="coursePractice"||t.mode==="practice")&&(o=[t.hole]);let a={mode:t.mode,courseId:t.mode==="range"?"range":t.courseId,teeId:t.teeId,holes:t.mode==="range"?[0]:o,difficulty:t.difficulty,attrs:n,look:i,golferName:r,custom:t.golfer==="custom",practiceKind:t.practiceKind};this.app.startRound(a)}career(){let t=this.profile,e=t.career,n=As(t.level),i=(l,h)=>h?`${Math.round(l/h*100)}%`:"\u2014",r=(l,h,u)=>`<div class="skill"><div class="sk-head"><b>${h}</b><span>${Math.round(t.skills[l])}</span></div>
      <div class="sk-bar"><i style="width:${t.skills[l]}%"></i></div><div class="sk-desc">${u}</div>
      <button class="btn small" data-skill="${l}" ${t.skillPoints&&t.skills[l]<99?"":"disabled"}>+ UPGRADE</button></div>`,o=[];for(let l=t.level+1;l<=t.level+6;l++){let h=rd(l);h.length&&o.push(`<div class="unl"><b>LEVEL ${l}</b>${h.map(u=>`<span>${fe(u)}</span>`).join("")}</div>`)}let a=Object.entries(e.best).map(([l,h])=>{let[u,d]=l.split(":");return`<tr><td>${fe(Yn(u).short)}</td><td>${d}</td><td><b>${h.score}</b></td><td>${Cr(h.toPar)}</td><td>${fe(h.golfer||"")}</td></tr>`}).join(""),c=t.history.slice(0,10).map(l=>`<tr><td>${new Date(l.date).toLocaleDateString()}</td><td>${fe(Yn(l.course).short)}</td><td>${l.holes}</td><td><b>${l.score}</b></td><td>${Cr(l.toPar)}</td><td>${fe(l.golfer||"")}</td></tr>`).join("");this.render(`
      <div class="page">
        <div class="page-head"><button class="btn ghost" data-go="main">\u2039 MENU</button><div class="page-title">CAREER</div></div>
        <div class="career-top glass">
          <div class="lvl-big">${t.level}<small>LEVEL</small></div>
          <div class="lvl-info"><div class="xpbar big"><i style="width:${t.xp/n*100}%"></i></div><div>${t.xp} / ${n} XP to level ${t.level+1}</div>
          <div class="pts-left">${t.skillPoints} skill point${t.skillPoints===1?"":"s"} available</div></div>
        </div>
        <div class="cols">
          <div class="col glass"><div class="section-title">SKILLS</div>
            ${r("driving","DRIVING","Distance & accuracy with woods")}
            ${r("approach","APPROACH","Iron accuracy & sweet spot")}
            ${r("shortGame","SHORT GAME","Wedges, chips, pitches, bunkers")}
            ${r("putting","PUTTING","Stroke consistency on the greens")}
            ${r("recovery","RECOVERY","Less penalty from rough, sand, straw")}
          </div>
          <div class="col glass"><div class="section-title">CAREER STATS</div>
            <div class="stat-grid">
              ${[["Rounds",e.rounds],["Holes",e.holes],["Scoring avg (18)",e.rounds18?(e.score18Sum/e.rounds18).toFixed(1):"\u2014"],["Fairways hit",i(e.fairways,e.fairwayChances)],["Greens in reg.",i(e.gir,e.girChances)],["Putts / hole",e.puttHoles?(e.putts/e.puttHoles).toFixed(2):"\u2014"],["Avg drive",e.drives?`${Math.round(e.driveSum/e.drives)} yds`:"\u2014"],["Longest drive",e.longestDrive?`${Math.round(e.longestDrive)} yds`:"\u2014"],["Longest putt",e.longestPutt?`${Math.round(e.longestPutt)} ft`:"\u2014"],["Aces",e.aces],["Eagles",e.eagles],["Birdies",e.birdies],["Pars",e.pars],["Bogeys",e.bogeys],["Double+",e.doubles+e.worse],["Sand saves",`${e.sandSaves}/${e.sandChances}`],["Up & downs",`${e.upDowns}/${e.upDownChances}`],["Penalties",e.penalties]].map(([l,h])=>`<div><span>${l}</span><b>${h}</b></div>`).join("")}
            </div>
            <div class="section-title">BEST ROUNDS</div>
            <table class="list">${a||'<tr><td class="dim">No rounds yet \u2014 get out there!</td></tr>'}</table>
            <div class="section-title">RECENT</div>
            <table class="list">${c||'<tr><td class="dim">\u2014</td></tr>'}</table>
          </div>
          <div class="col glass"><div class="section-title">UPCOMING UNLOCKS</div>${o.join("")||'<div class="dim">Everything unlocked!</div>'}</div>
        </div>
      </div>`,"page-screen"),this.root.querySelectorAll("[data-skill]").forEach(l=>l.onclick=()=>{let h=l.dataset.skill;t.skillPoints>0&&t.skills[h]<99&&(t.skillPoints--,t.skills[h]=Math.min(99,t.skills[h]+3),this.app.save(),mt.jingle("great"),this.career())})}golfer(){let t=this.profile,e=t.look;this.app.golferPreview(e);let n=t.level,i=(o,a,c)=>`<div class="cust-row"><label>${c}</label><div class="chips">${a.map(l=>`<button class="chip ${e[o]===l.id?"on":""} ${l.unlock>n?"locked":""}" data-set="${o}" data-val="${l.id}" ${l.unlock>n?`title="Unlocks at level ${l.unlock}"`:""}>${fe(l.name)}${l.unlock>n?` \u{1F512}${l.unlock}`:""}</button>`).join("")}</div></div>`,r=(o,a,c)=>`<div class="cust-row"><label>${c}</label><div class="swatches">${a.map(l=>`<button class="sw ${e[o]===l?"on":""}" style="background:${l}" data-set="${o}" data-val="${l}"></button>`).join("")}</div></div>`;this.render(`
      <div class="page cust">
        <div class="page-head"><button class="btn ghost" data-go="main">\u2039 MENU</button><div class="page-title">MY GOLFER</div></div>
        <div class="cust-panel glass">
          <div class="cust-row"><label>Name</label><input id="g-name" maxlength="20" value="${fe(e.name)}"></div>
          <div class="cust-row"><label>Gender</label><div class="chips">${[["M","Male"],["F","Female"]].map(([o,a])=>`<button class="chip ${e.gender===o?"on":""}" data-set="gender" data-val="${o}">${a}</button>`).join("")}</div></div>
          <div class="cust-row"><label>Skin tone</label><div class="swatches">${xr.map((o,a)=>`<button class="sw ${e.skin===a?"on":""}" style="background:${o}" data-set="skin" data-val="${a}" data-num="1"></button>`).join("")}</div></div>
          ${i("hair",Vu.map(o=>({...o,unlock:1})),"Hair")}
          ${r("hairColor",Wu,"Hair color")}
          <div class="cust-row"><label>Beard</label><div class="chips"><button class="chip ${e.beard?"":"on"}" data-set="beard" data-val="0" data-bool="1">None</button><button class="chip ${e.beard?"on":""}" data-set="beard" data-val="1" data-bool="1">Beard</button></div></div>
          ${i("hat",yc,"Hat")}
          ${r("hatColor",Ms,"Hat color")}
          ${i("shirtStyle",xc,"Top")}
          ${r("shirt",Ms,"Shirt color")}
          ${r("shirtAlt",Ms,"Accent / vest")}
          ${i("legs",vc,"Bottoms")}
          ${r("pants",Ms,"Pants color")}
          ${i("shoeModel",bc,"Shoes")}
          ${r("shoes",Ms,"Shoe color")}
          ${i("gloveModel",_c,"Glove")}
          ${r("glove",["#ffffff","#111111","#1c2a44","#c1121f","#f2c94c"],"Glove color")}
          ${i("accessory",Mc,"Accessories")}
          <div class="cust-row"><label>Build</label><input type="range" id="g-build" min="0.85" max="1.2" step="0.05" value="${e.build||1}"></div>
        </div>
      </div>`,"page-screen transparent"),Rs("#g-name",this.root).oninput=o=>{e.name=o.target.value||"You",this.app.save()},Rs("#g-build",this.root).oninput=o=>{e.build=+o.target.value,this.app.save(),this.app.golferPreview(e)},this.root.querySelectorAll("[data-set]").forEach(o=>o.onclick=()=>{if(o.classList.contains("locked")){mt.tick(!1);return}let a=o.dataset.val;o.dataset.num&&(a=+a),o.dataset.bool&&(a=a==="1"),e[o.dataset.set]=a,this.app.save(),mt.click(),this.golfer()})}bag(){let t=this.profile,e=t.level,n=Ga(t.bag,t.equipment,Wa(t)),i=(r,o)=>`<div class="cust-row"><label>${o}</label><div class="chips">${za[r].map(a=>`<button class="chip ${t.equipment[r]===a.id?"on":""} ${a.unlock>e?"locked":""}" data-eq="${r}" data-val="${a.id}">${fe(a.brand)} <b>${fe(a.model)}</b>${a.unlock>e?` \u{1F512}${a.unlock}`:""}</button>`).join("")}</div></div>`;this.render(`
      <div class="page">
        <div class="page-head"><button class="btn ghost" data-go="main">\u2039 MENU</button><div class="page-title">MY BAG</div><div class="bag-count">${t.bag.length}/14 CLUBS</div></div>
        <div class="cols two">
          <div class="col glass">
            <div class="section-title">CLUBS IN BAG <small>(max 14, putter required)</small></div>
            <div class="club-toggle">${Ha.map(r=>`<button class="chip ${t.bag.includes(r.id)?"on":""}" data-club="${r.id}" ${r.id==="PT"?"disabled":""}>${r.name}</button>`).join("")}</div>
            <div class="section-title">EQUIPMENT</div>
            ${i("wood","Woods")}${i("hybrid","Hybrids")}${i("iron","Irons")}${i("wedge","Wedges")}${i("putter","Putter")}
            <div class="cust-row"><label>Golf ball</label><div class="chips">${Rr.map(r=>`<button class="chip ${t.equipment.ball===r.id?"on":""} ${r.unlock>e?"locked":""}" data-eq="ball" data-val="${r.id}">${fe(r.brand)} <b>${fe(r.model)}</b>${r.unlock>e?` \u{1F512}${r.unlock}`:""}</button>`).join("")}</div></div>
          </div>
          <div class="col glass">
            <div class="section-title">YARDAGES <small>(your career golfer)</small></div>
            <table class="list yardage">
              <tr class="hdr"><td>CLUB</td><td>MODEL</td><td>CARRY</td><td>LAUNCH</td><td>SPIN</td><td>ACCURACY</td></tr>
              ${n.map(r=>`<tr><td><b>${r.name}</b></td><td class="dim">${fe(r.brand)} ${fe(r.model)}</td><td><b>${r.cat==="putter"?"\u2014":Math.round(r.carry)}</b></td><td>${r.cat==="putter"?"\u2014":r.launch.toFixed(1)+"\xB0"}</td><td>${r.cat==="putter"?"\u2014":Math.round(r.spin)}</td><td><div class="minibar"><i style="width:${r.accuracy*100}%"></i></div></td></tr>`).join("")}
            </table>
          </div>
        </div>
      </div>`,"page-screen"),this.root.querySelectorAll("[data-club]").forEach(r=>r.onclick=()=>{let o=r.dataset.club;if(o==="PT")return;let a=t.bag.indexOf(o);if(a>=0)t.bag.length>2&&t.bag.splice(a,1);else if(t.bag.length<14)t.bag.push(o);else{mt.tick(!1);return}this.app.save(),mt.click(),this.bag()}),this.root.querySelectorAll("[data-eq]").forEach(r=>r.onclick=()=>{if(r.classList.contains("locked")){mt.tick(!1);return}t.equipment[r.dataset.eq]=r.dataset.val,this.app.save(),mt.click(),this.bag()})}settings(){let t=this.profile.settings,e=(i,r,o)=>`<div class="set-row"><div><b>${r}</b><span>${o}</span></div><button class="toggle ${t[i]?"on":""}" data-tog="${i}"><i></i></button></div>`,n=(i,r)=>`<div class="set-row"><div><b>${r}</b></div><input type="range" min="0" max="1" step="0.05" value="${t[i]}" data-vol="${i}"></div>`;this.render(`
      <div class="page narrow">
        <div class="page-head"><button class="btn ghost" data-go="main">\u2039 MENU</button><div class="page-title">SETTINGS</div></div>
        <div class="col glass">
          <div class="section-title">GAMEPLAY</div>
          <div class="set-row"><div><b>Default difficulty</b><span>Timing window, dispersion, assists</span></div><div class="chips">${Object.entries(Bi).map(([i,r])=>`<button class="chip ${t.difficulty===i?"on":""}" data-diff="${i}">${r.name}</button>`).join("")}</div></div>
          ${e("puttGuide","Putting guide","Break preview line & slope arrows (G in game)")}
          ${e("landingMarker","Landing marker","Show predicted carry & landing circle")}
          ${e("tracer","Shot tracer","TV-style ball flight trail")}
          ${e("flyover","Hole flyover","Preview each hole from the air")}
          ${e("autoCamera","Broadcast camera","Automatic follow & landing cameras")}
          <div class="set-row"><div><b>Graphics quality</b><span>Lower it if the game stutters</span></div><div class="chips">${[["high","High"],["medium","Medium"],["low","Low"]].map(([i,r])=>`<button class="chip ${(t.quality||"high")===i?"on":""}" data-q="${i}">${r}</button>`).join("")}</div></div>
          <div class="section-title">AUDIO</div>
          ${n("master","Master volume")}${n("sfx","Effects")}${n("amb","Ambience")}
          <div class="section-title">DATA</div>
          <div class="set-row"><div><b>Reset progress</b><span>Deletes your golfer, XP, stats and unlocks</span></div><button class="btn danger" id="reset">RESET</button></div>
        </div>
        <div class="controls-help glass">
          <div class="section-title">CONTROLS</div>
          <table class="list">
            <tr><td><kbd>Space</kbd> hold</td><td>Backswing \u2014 power meter fills</td></tr>
            <tr><td><kbd>Space</kbd> release</td><td>Start downswing</td></tr>
            <tr><td><kbd>Space</kbd> tap</td><td>Strike when the marker crosses the green sweet spot. Early = pull/hook, late = push/slice</td></tr>
            <tr><td><kbd>\u2190</kbd> <kbd>\u2192</kbd></td><td>Aim (hold to accelerate)</td></tr>
            <tr><td><kbd>\u2191</kbd> <kbd>\u2193</kbd></td><td>Change club \xB7 putting: change putt length scale</td></tr>
            <tr><td><kbd>X</kbd></td><td>Cycle shot type (Normal, Punch, Chip, Pitch, Lob, Flop, Bunker)</td></tr>
            <tr><td><kbd>Q</kbd> / <kbd>E</kbd></td><td>Draw / Fade</td></tr><tr><td><kbd>T</kbd></td><td>Trajectory low / mid / high</td></tr>
            <tr><td><kbd>I J K L</kbd></td><td>Strike point: topspin / backspin / sidespin</td></tr>
            <tr><td><kbd>R</kbd></td><td>Aim straight at the pin</td></tr>
            <tr><td><kbd>C</kbd> / <kbd>M</kbd></td><td>Cycle camera / overhead map \xB7 click minimap to aim</td></tr>
            <tr><td>Mouse drag / wheel</td><td>Look around / scout ahead along the aim line</td></tr>
            <tr><td><kbd>Tab</kbd> \xB7 <kbd>Esc</kbd></td><td>Scorecard \xB7 pause menu</td></tr>
          </table>
        </div>
      </div>`,"page-screen"),this.root.querySelectorAll("[data-tog]").forEach(i=>i.onclick=()=>{t[i.dataset.tog]=!t[i.dataset.tog],this.app.save(),mt.click(),this.settings()}),this.root.querySelectorAll("[data-q]").forEach(i=>i.onclick=()=>{t.quality=i.dataset.q,this.app.world.setQuality(t.quality),this.app.save(),mt.click(),this.settings()}),this.root.querySelectorAll("[data-diff]").forEach(i=>i.onclick=()=>{t.difficulty=i.dataset.diff,this.app.save(),mt.click(),this.settings()}),this.root.querySelectorAll("[data-vol]").forEach(i=>i.oninput=()=>{t[i.dataset.vol]=+i.value,mt.setVolumes({[i.dataset.vol]:+i.value}),this.app.save()}),Rs("#reset",this.root).onclick=()=>{confirm("Reset all progress? This cannot be undone.")&&(this.app.profile=id(),this.app.save(),this.main())}}results(t,e,n,i,r){let o=(c,l)=>l?`${c}/${l} (${Math.round(c/l*100)}%)`:"\u2014",a=Yn(t.courseId);this.render(`
      <div class="page">
        <div class="page-head"><div class="page-title">ROUND COMPLETE<small>${fe(a.name)} \xB7 ${fe(t.golferName)}</small></div></div>
        <div class="result-hero glass">
          <div class="rh-score">${e.strokes}<small>SCORE</small></div>
          <div class="rh-par ${e.toPar<0?"under":e.toPar>0?"over":""}">${Cr(e.toPar)}<small>TO PAR</small></div>
          ${n?`<div class="rh-xp"><b>+${n.xp} XP</b>${n.levelUps.length?`<div class="lvlup">LEVEL UP! \u2192 ${n.to} \xB7 +${n.levelUps.length*3} skill points</div><div class="unl">${n.levelUps.flatMap(rd).map(c=>`<span>${fe(c)}</span>`).join("")}</div>`:""}<div class="xpbar big"><i style="width:${this.profile.xp/As(this.profile.level)*100}%"></i></div></div>`:'<div class="rh-xp dim">Tour pro round \xB7 no XP</div>'}
        </div>
        <div class="glass sc-wrap">${r}</div>
        <div class="glass"><div class="section-title">STATISTICS</div><div class="stat-grid wide">
          ${[["Fairways hit",o(e.fairways,e.fairwayChances)],["Greens in regulation",o(e.gir,e.girChances)],["Total putts",e.putts],["Putts per hole",(e.putts/Math.max(1,e.holes)).toFixed(2)],["Avg driving distance",e.drives?`${Math.round(e.driveSum/e.drives)} yds`:"\u2014"],["Longest drive",e.longestDrive?`${Math.round(e.longestDrive)} yds`:"\u2014"],["Longest putt made",e.longestPutt?`${Math.round(e.longestPutt)} ft`:"\u2014"],["Eagles",e.eagles+e.albatross+e.aces],["Birdies",e.birdies],["Pars",e.pars],["Bogeys",e.bogeys],["Double bogey+",e.doubles+e.worse],["Sand saves",o(e.sandSaves,e.sandChances)],["Up & downs",o(e.upDowns,e.upDownChances)],["Penalty strokes",e.penalties],["Scoring average (career)",this.profile.career.rounds18?(this.profile.career.score18Sum/this.profile.career.rounds18).toFixed(1):"\u2014"]].map(([c,l])=>`<div><span>${c}</span><b>${l}</b></div>`).join("")}
        </div></div>
        <div class="center"><button class="btn primary big" data-go="main">CONTINUE \u25B8</button> <button class="btn big" id="again">PLAY AGAIN</button></div>
      </div>`,"page-screen"),Rs("#again",this.root).onclick=()=>this.app.startRound(i),n&&n.levelUps.length&&mt.jingle("unlock")}};var sy=Math.PI/180,zi=3;function ry(s,t){return t===1?"HOLE IN ONE":s<=-4?"CONDOR":s===-3?"ALBATROSS":s===-2?"EAGLE":s===-1?"BIRDIE":s===0?"PAR":s===1?"BOGEY":s===2?"DOUBLE BOGEY":s===3?"TRIPLE BOGEY":`+${s}`}var $a=class{constructor(t){this.app=t,this.world=t.world,this.rig=t.rig,this.hud=t.hud,this.state="off",this.keys=new Set,this.speedMul=1,this.golfer=null}start(t){let e=this.app,n=e.profile;this.cfg=t,this.course=Yn(t.courseId),this.theme=Di[this.course.theme],this.tee=Ar.find(r=>r.id===t.teeId)||Ar[1],this.diffKey=t.difficulty||n.settings.difficulty,this.diff=Bi[this.diffKey],this.attrs=t.attrs,this.look=t.look,this.golferName=t.golferName,this.bag=Ga(t.bagIds||n.bag,n.equipment,this.attrs),this.rng=De((Date.now()&4294967295)>>>0),this.pinSeed=Math.floor(this.rng()*1e6),this.round={courseId:this.course.id,tee:this.tee.id,holes:t.holes,idx:0,cards:t.holes.map(r=>({hole:r,par:this.course.holes[r].p,yards:0,strokes:null,putts:0,fairway:null,gir:!1,penalties:0})),stats:null,golferName:t.golferName,difficulty:this.diffKey},this.golfer?this.golfer.build(this.look):(this.golfer=new ws(this.look),this.world.scene.add(this.golfer.root)),this.golfer.root.visible=!0,this.world.setCourseEnv(this.course,this.theme);let i=e.profile.equipment.ball;this.world.setBallStyle(i==="optic"?"#f6ff3c":i==="chrome"?"#fff8d0":"#ffffff"),this.state="loading",this.hud.show(!0),this.loadHole(0)}stop(){this.state="off",mt.rollStop(),mt.stopAmbience(),this.hud.show(!1),this.golfer&&(this.golfer.root.visible=!1)}get card(){return this.round.cards[this.round.idx]}loadHole(t){this.round.idx=t;let e=this.round.holes[t],n=this.course.holes[e];this.state="loading",this.hud.loading(!0,{course:this.course,number:e+1,par:n.p,yards:Math.round(n.y*this.tee.factor),name:n.name,tip:n.tip,sig:n.sig}),setTimeout(()=>{let i=performance.now(),r=this.hole=new Ui(this.course,e,{teeFactor:this.tee.factor,pinSeed:this.pinSeed+e*7,pinDifficulty:{easy:.2,medium:.5,sunday:.95}[this.app.profile.settings.pins]??.5});this.world.loadHole(r,{name:this.golferName,toPar:this.roundToPar()}),console.log(`hole ${e+1} built in ${(performance.now()-i).toFixed(0)}ms`),this.card.yards=r.yards;let[o,a]=this.course.wind,c={calm:.3,normal:1,windy:1.7}[this.app.profile.settings.windSetting]??1,l=De(this.pinSeed^e*977);this.windBaseMph=(o+l()*(a-o))*c*this.diff.wind,this.windDirPlan=l()*Math.PI*2,this.hole.stimp=this.course.stimp+(this.diffKey==="realistic"?.5:this.diffKey==="easy"?-1:0),this.hole.firmness=this.course.firmness,this.strokes=0,this.holeLog={shots:[],sandFrom:null,aroundFrom:null,onGreenAt:null};let[h,u]=r.tee;if(this.ball={x:h,y:u,h:r.heightAt(h,u)},this.prevBall={...this.ball},this.teeShot=!0,this.shapeSel=0,this.trajSel=0,this.spin={x:0,y:0},this.hud.setHoleInfo(this.holeHeader()),mt.startAmbience(this.theme,this.windBaseMph,r.waterShapes.length>0),this.world.windStrength=Math.min(1,this.windBaseMph/20),this.hud.loading(!1),this.cfg.mode==="practice"){this.placePractice();return}this.app.profile.settings.flyover&&this.cfg.mode!=="range"?this.startFlyover():this.beginShot(!0)},60)}holeHeader(){let t=this.card,e=this.roundToPar();return{number:this.hole.number,par:this.hole.par,yards:this.hole.yards,name:this.hole.def.name,stroke:this.strokes+1,toPar:e,course:this.course.short,mode:this.cfg.mode,holeIdx:this.round.idx,holeCount:this.round.holes.length}}roundToPar(){let t=0;for(let e of this.round.cards)e.strokes!=null&&(t+=e.strokes-e.par);return t}startFlyover(){this.state="flyover",this.flyT=0,this.golfer.root.visible=!1,this.world.setBall(this.ball.x,this.ball.y,this.ball.h,!0),this.world.clearAim(),this.rig.set("flyover",{t:0,snap:!0}),this.hud.holeIntro(!0,this.holeHeader(),this.hole.def.tip)}beginShot(t=!1){let e=this.hole;this.state="aim",this.hud.holeIntro(!1),this.golfer.root.visible=!0,this.surf=e.surfAt(this.ball.x,this.ball.y),(this.surf===L.WATER||this.surf===L.BRUSH)&&(this.surf=L.ROUGH);let n=this.teeShot&&this.strokes===0;n&&(this.surf=L.TEE),this.distPin=e.distToPin(this.ball.x,this.ball.y),this.gust=.85+this.rng()*.3,this.wind=this.windVec();let i=this.attrs.recovery,r=this.surf===L.GREEN,o=this.surf===L.FRINGE&&this.distPin<16||r,a,c,l,h=Math.atan2(e.pin[0]-this.ball.x,e.pin[1]-this.ball.y);if(o)a=this.bag.find(u=>u.cat==="putter"),l="putt",c=h,this.puttScale=ka(this.distPin);else{let u=y=>y.cat!=="putter"&&(n||y.id!=="DR")&&!(this.surf===L.SAND&&(y.cat==="wood"||y.cat==="hybrid"))&&!((this.surf===L.DEEP||this.surf===L.BRUSH)&&y.cat==="wood")&&!((this.surf===L.ROUGH||this.surf===L.STRAW)&&y.id==="3W"),d=this.bag.filter(u).sort((y,g)=>g.carry-y.carry)[0]||this.bag[0],f=Tr(d,"normal",this.surf,i)*1.08,[m]=e.nearest(this.ball.x,this.ball.y);if(this.distPin<=f){c=h;let y=e.pinH-this.ball.h,g=Oa(this.distPin,y,this.windAlong(h)),p=!n&&this.surf!==L.SAND?this.shortGameChoice(this.distPin):null;p?(a=p.club,l=p.type):(a=Ju(this.bag,g,this.surf,i),l=this.defaultType(a,this.distPin)),n&&this.hole.par===3&&(l="normal")}else{a=n&&this.bag.find(x=>x.id==="DR")||d;let y=Tr(a,"normal",this.surf,i)+(n?18:10),g=Math.min(e.L-25,m+y),p=e.at(g);c=Math.atan2(p.x-this.ball.x,p.y-this.ball.y),l=(this.surf===L.SAND,"normal")}}this.club=a,this.heading=c,this.typeId=l,this.ensureType(),this.shapeSel=0,this.trajSel=0,this.spin={x:0,y:0},this.rig.orbitYaw=0,this.rig.orbitPitch=0,this.rig.zoom=1,this.rig.preview=0,this.meter={state:"idle",power:0,marker:0},this.placeGolfer(),this.world.clearTrail(),this.world.setBall(this.ball.x,this.ball.y,this.ball.h,n),this.world.placeGrass(e,this.ball.x,this.ball.y),this.rig.set("address",{snap:!0}),this.camMode="address",this.updateAim(),this.refreshHud(),this.hud.meterShow(!0,this.club.cat==="putter")}shortGameChoice(t){if(t>75)return null;let e=a=>a.map(c=>this.bag.find(l=>l.id===c)).find(Boolean),n=this.surf===L.FRINGE||this.surf===L.FIRSTCUT||this.surf===L.FAIRWAY,i,r;if(t<=32&&n?(i=e(t<16?["SW","GW","PW","LW"]:["PW","9I","GW","SW"]),r="chip"):t<=45?(i=e(["SW","LW","GW","PW"]),r="pitch"):(i=e(["GW","SW","PW"]),r=t>60?"normal":"pitch"),!i)return null;let o=Ts(this.surf,i,t);return o.includes(r)||(r=o.includes("pitch")?"pitch":o[0]),{club:i,type:r}}idealPower(t){let e=this.hole,n=this.isPutt(),i=[this.club.id,this.typeId,this.shapeSel,this.trajSel,this.spin.x,this.spin.y,Math.round(this.heading*200),n?this.puttScale:0,t].join("|");if(this._idealKey===i)return this._ideal;let r=c=>{let l;n?l=Fa({power:c,scaleYd:this.puttScale/zi,heading:this.heading,attrs:{putting:200},diff:{putt:0},stimp:e.stimp,rng:()=>.5}):l=Na({club:this.club,typeId:this.typeId,power:c,timing:0,heading:this.heading,shape:this.shapeSel,traj:this.trajSel,spin:this.spin,surf:this.surf,attrs:this.attrs,diff:{...this.diff,disp:0},rng:()=>.5,noNoise:!0}),n&&(l.heading=this.heading,l.speed=Math.sqrt(2*Ss(e.stimp)*c*this.puttScale/zi));let h=Er(e,this.ball,l,{...this.env(!t),assist:{cupMul:.01,captureMul:.01}},{putt:n}),u=e.pin[0]-this.ball.x,d=e.pin[1]-this.ball.y,f=Math.hypot(u,d)||1;return((h.end.x-this.ball.x)*u+(h.end.y-this.ball.y)*d)/f-f},o=.03,a=n?1:1.1;if(r(a)<0)return this._idealKey=i,this._ideal=null,null;for(let c=0;c<12;c++){let l=(o+a)/2;r(l)<0?o=l:a=l}return this._idealKey=i,this._ideal=(o+a)/2,this._ideal}defaultType(t,e){if(this.surf===L.SAND)return e<60?"bunker":"normal";let n=Ts(this.surf,t,e);return t.cat==="wedge"&&e<45&&n.includes("chip")&&(this.surf===L.FRINGE||this.surf===L.FIRSTCUT||this.surf===L.FAIRWAY)?"chip":t.cat==="wedge"&&e<t.carry*.7&&n.includes("pitch")?"pitch":n[0]}ensureType(){if(this.club.cat==="putter"){this.typeId="putt";return}let t=Ts(this.surf,this.club,this.distPin);t.includes(this.typeId)||(this.typeId=t[0])}placeGolfer(){let t=this.golfer;t.setClub(this.club.cat,$u(this.club.cat,this.club.id)),t.address(),t.placeAtBall(Bt(this.ball.x,this.ball.y,this.ball.h),this.heading)}windVec(){let t=this.windBaseMph*this.gust*Sr;return[Math.sin(this.windDirPlan)*t,Math.cos(this.windDirPlan)*t]}windAlong(t){let e=this.windVec();return e[0]*Math.sin(t)+e[1]*Math.cos(t)}isPutt(){return!!this.club&&this.club.cat==="putter"}env(t=!1){return{wind:t?[0,0]:this.wind,firmness:this.hole.firmness,stimp:this.hole.stimp,assist:{cupMul:this.diff.cupMul,captureMul:this.diff.captureMul},rng:this.rng}}updateAim(){let t=this.hole,e=this.world;e.clearAim();let n=this.app.profile.settings;if(this.isPutt()){this.puttScale=this.puttScale||ka(this.distPin);let l=this.diff.puttPreview;if(n.puttGuide){let h=this.distPin+.4,u=h/(this.puttScale/zi),d=Fa({power:u,scaleYd:this.puttScale/zi,heading:this.heading,attrs:{putting:200},diff:{putt:0},stimp:t.stimp,rng:()=>.5});d.heading=this.heading,d.speed=Math.sqrt(2*Ss(t.stimp)*Math.min(h,this.puttScale/zi));let f=Er(t,this.ball,d,this.env(!0),{putt:!0}),m=Math.max(2,Math.floor(f.frames.length*(l>0?l:.12))),y=f.frames.slice(0,m).map(g=>[g.x,g.y,g.h]);e.showAim({ground:y}),e.showSlopeGrid(t,(this.ball.x+t.pin[0])/2,(this.ball.y+t.pin[1])/2,Math.min(18,this.distPin/2+4))}else{let h=[];for(let u=0;u<=Math.min(3,this.distPin);u+=.25){let d=this.ball.x+Math.sin(this.heading)*u,f=this.ball.y+Math.cos(this.heading)*u;h.push([d,f,t.heightAt(d,f)])}e.showAim({ground:h})}this.previewLanding=null,this.hud.drawMap(this);return}let i=n.landingMarker?this.diff.landing:"line",r=Na({club:this.club,typeId:this.typeId,power:1,timing:0,heading:this.heading,shape:this.shapeSel,traj:this.trajSel,spin:this.spin,surf:this.surf,attrs:this.attrs,diff:{...this.diff,disp:0},rng:()=>.5,noNoise:!0}),o=Er(t,this.ball,r,this.env(i!=="wind"),{flightOnly:!0}),a=o.end;this.previewLanding=[a.x,a.y,a.h],this.aimDist=Math.hypot(a.x-this.ball.x,a.y-this.ball.y);let c=Math.max(2,o.carry*(1-this.club.accuracy)*.16*this.diff.disp+1.5);if(i==="wind"||i==="nowind"){let l=o.frames.filter((h,u)=>u%3===0).map(h=>[h.x,h.y,h.h]);l.push([a.x,a.y,a.h]),e.showAim({path:l,landing:[a.x,a.y,a.h],radius:c,color:i==="wind"?"#7dffb0":"#ffffff"})}else if(i==="line"){let l=[],h=o.carry;for(let u=2;u<=h;u+=4){let d=this.ball.x+Math.sin(this.heading)*u,f=this.ball.y+Math.cos(this.heading)*u;l.push([d,f,t.heightAt(d,f)+.1])}e.showAim({ground:l})}else{let l=[];for(let h=2;h<=25;h+=1){let u=this.ball.x+Math.sin(this.heading)*h,d=this.ball.y+Math.cos(this.heading)*h;l.push([u,d,t.heightAt(u,d)+.1])}e.showAim({ground:l})}this.hud.drawMap(this)}refreshHud(t=!1){let e=this.hole,n=Es(this.surf),i=e.pinH-this.ball.h,r=Math.atan2(e.pin[0]-this.ball.x,e.pin[1]-this.ball.y),o=Oa(this.distPin,i,this.windAlong(r)),a=this.isPutt(),c=a?0:Tr(this.club,this.typeId,this.surf,this.attrs.recovery);if(this.hud.setInfo({lie:this.teeShot&&this.strokes===0?"TEE":n.name,lieColor:n.color,liePct:Zu(this.surf,this.typeId,this.club,this.attrs.recovery),toPin:this.distPin,playsLike:o,elevFt:i*3,putt:a,club:this.club,carry:c,typeId:this.typeId,typeName:Mn[this.typeId].name,types:a?["putt"]:Ts(this.surf,this.club,this.distPin),shape:this.shapeSel,traj:this.trajSel,spin:this.spin,puttScale:this.puttScale,bag:this.bag,clubIdx:this.bag.indexOf(this.club),aimOff:Math.atan2(Math.sin(this.heading-r),Math.cos(this.heading-r))}),this.hud.setHoleInfo(this.holeHeader()),t)return;let l=null,h=this.diffKey;a?l=h==="easy"?this.idealPower(!1):this.distPin*zi/this.puttScale:c>0&&((h==="easy"||h==="normal")&&this.distPin<c*1.15?l=this.idealPower(h==="easy"):h!=="realistic"&&(l=Oa(this.distPin,i,this.windAlong(r))/c),l!=null&&l>1.12&&(l=null)),this.hud.meterTarget(l,a?this.puttScale:null),this.hud.meterWindow(a?0:Ua(this.club,this.typeId,this.surf,this.attrs,this.diff,1))}onKeyDown(t){if(this.state==="off"||this.state==="loading")return!1;let e=t.key;if(this.state==="flyover")return e===" "||e==="Enter"||e==="Escape"?(this.endFlyover(),!0):!1;if(this.state==="result"&&(e==="Enter"||e===" "))return this.continueAfterResult(),!0;if(this.state==="flight"&&(e===" "||e==="Enter"))return this.speedMul=this.speedMul>1?8:3,!0;if(this.state!=="aim"&&this.state!=="swing")return!1;if(e===" ")return t.repeat||this.swingPress(),!0;if(this.state!=="aim")return!1;switch(e.toLowerCase()){case"arrowleft":case"a":return this.keys.add("left"),!0;case"arrowright":case"d":return this.keys.add("right"),!0;case"arrowup":case"w":return this.cycleClub(-1),!0;case"arrowdown":case"s":return this.cycleClub(1),!0;case"q":return this.setShape(this.shapeSel===-1?0:-1),!0;case"e":return this.setShape(this.shapeSel===1?0:1),!0;case"t":return this.setTraj(this.trajSel===1?-1:this.trajSel+1),!0;case"x":return this.cycleType(),!0;case"c":return this.cycleCamera(),!0;case"v":case"m":return this.setCamera(this.camMode==="overhead"?"address":"overhead"),!0;case"g":return this.app.profile.settings.puttGuide=!this.app.profile.settings.puttGuide,this.app.save(),this.updateAim(),this.hud.toast(this.app.profile.settings.puttGuide?"Putting guide ON":"Putting guide OFF","","info",900),!0;case"i":return this.setSpin(this.spin.x,re(this.spin.y+.25,-1,1)),!0;case"k":return this.setSpin(this.spin.x,re(this.spin.y-.25,-1,1)),!0;case"j":return this.setSpin(re(this.spin.x-.25,-1,1),this.spin.y),!0;case"l":return this.setSpin(re(this.spin.x+.25,-1,1),this.spin.y),!0;case"r":return this.autoAim(),!0}return!1}onKeyUp(t){let e=t.key.toLowerCase();(e==="arrowleft"||e==="a")&&this.keys.delete("left"),(e==="arrowright"||e==="d")&&this.keys.delete("right"),t.key===" "&&this.state==="swing"&&this.swingRelease(),(t.key===" "||t.key==="Enter")&&this.state==="flight"&&(this.speedMul=1)}autoAim(){this.heading=Math.atan2(this.hole.pin[0]-this.ball.x,this.hole.pin[1]-this.ball.y),this.afterAimChange()}aimAt(t,e){this.state==="aim"&&(this.heading=Math.atan2(t-this.ball.x,e-this.ball.y),this.afterAimChange())}afterAimChange(){this.golfer.placeAtBall(Bt(this.ball.x,this.ball.y,this.ball.h),this.heading),this.updateAim(),this.refreshHud()}cycleClub(t){if(this.isPutt()&&this.surf===L.GREEN){let n=Oi.indexOf(this.puttScale);this.puttScale=Oi[re(n+t,0,Oi.length-1)],this.updateAim(),this.refreshHud(),mt.click();return}let e=this.bag.indexOf(this.club);for(let n=0;n<this.bag.length&&(e=(e+t+this.bag.length)%this.bag.length,this.bag[e].id==="DR"&&!(this.teeShot&&this.strokes===0)&&this.surf!==L.FAIRWAY&&this.surf!==L.TEE);n++);this.selectClub(this.bag[e])}selectClub(t){this.club=t,t.cat==="putter"?(this.typeId="putt",this.puttScale=ka(this.distPin)):(this.typeId==="putt"&&(this.typeId=this.defaultType(t,this.distPin)),this.ensureType()),this.placeGolfer(),this.hud.meterShow(!0,this.isPutt()),this.updateAim(),this.refreshHud(),mt.click()}cycleType(){if(this.isPutt())return;let t=Ts(this.surf,this.club,this.distPin),e=t.indexOf(this.typeId);this.setType(t[(e+1)%t.length])}setType(t){this.typeId=t,this.ensureType(),this.updateAim(),this.refreshHud(),mt.click()}setShape(t){this.shapeSel=t,this.updateAim(),this.refreshHud(),mt.click()}setTraj(t){this.trajSel=t,this.updateAim(),this.refreshHud(),mt.click()}setSpin(t,e){this.spin={x:t,y:e},this.updateAim(),this.refreshHud()}cycleCamera(){let t=["address","player","overhead","green"],e=t.indexOf(this.camMode);this.setCamera(t[(e+1)%t.length])}setCamera(t){this.camMode=t,this.rig.set(t,{rate:5}),this.hud.toast({address:"Shot Camera",player:"Player Camera",overhead:"Overhead Map",green:"Green Camera"}[t],"","info",700)}onDrag(t,e){this.state==="aim"&&(this.camMode!=="address"&&(this.camMode="address",this.rig.set("address",{rate:5})),this.rig.orbitYaw=re(this.rig.orbitYaw+t*.005,-Math.PI,Math.PI),this.rig.orbitPitch=re(this.rig.orbitPitch-e*.004,-.3,1.5))}onWheel(t){if(this.state==="aim"){if(this.camMode!=="address"&&(this.camMode="address",this.rig.set("address",{rate:5})),this.rig.preview<=.001&&t<0&&this.rig.zoom>.6){this.rig.zoom=re(this.rig.zoom+t*.0015,.6,3);return}this.rig.zoom=1,this.rig.preview=re(this.rig.preview+t*.0012,0,1)}}swingPress(){if(mt.init(),this.state==="aim"){this.state="swing",this.meter={state:"back",power:0,marker:0,t:0},this.rig.preview=0,this.rig.orbitYaw=0,this.rig.orbitPitch=0,(this.camMode==="overhead"||this.camMode==="green")&&(this.camMode="address",this.rig.set("address",{rate:6})),this.hud.meterReset();return}if(this.state==="swing"&&this.meter.state==="down"){let t=Ua(this.club,this.typeId,this.surf,this.attrs,this.diff,this.meter.power),e=-this.meter.marker/t;this.hit(e)}}swingRelease(){if(this.state!=="swing"||this.meter.state!=="back")return;let t=this.meter;if(t.power<.02){this.state="aim",t.state="idle",this.golfer.address(),this.hud.meterReset();return}if(this.isPutt()){this.hit(0);return}t.state="down",t.marker=t.power,mt.whoosh(t.power)}updateSwing(t){let e=this.meter,n=this.isPutt();if(e.state==="back"){e.t+=t;let i=n?.8:.95;e.power<1?e.power=Math.min(1,e.power+i*t):e.power+=i*.45*t;let r=n?1:1.12;if(e.power>=r){e.power=r,n?this.hit(0):this.swingRelease();return}this.golfer.setBackswing(n?e.power:Math.min(1.1,e.power)),this.hud.meterUpdate(e.power,e.power,"back")}else if(e.state==="down"){let i=1.3+e.power*.7;if(e.marker-=i*t,this.golfer.setDownswing(Math.min(1.1,e.power),re(e.marker/Math.max(.05,e.power),0,1)),this.hud.meterUpdate(e.power,e.marker,"down"),e.marker<-.32){let r=Ua(this.club,this.typeId,this.surf,this.attrs,this.diff,e.power);this.hit(Math.max(2.5,.32/r))}}}hit(t){let e=this.hole,n=this.meter;n.state="done";let i=this.isPutt(),r;i?r=Fa({power:n.power,scaleYd:this.puttScale/zi,heading:this.heading,attrs:this.attrs,diff:this.diff,stimp:e.stimp,rng:this.rng}):r=Na({club:this.club,typeId:this.typeId,power:n.power,timing:t,heading:this.heading,shape:this.shapeSel,traj:this.trajSel,spin:this.spin,surf:this.surf,attrs:this.attrs,diff:this.diff,rng:this.rng}),this.lastLaunch=r,this.lastTiming=t;let o=this.surf,a=Er(e,{...this.ball},r,this.env(!1),{putt:i});this.shot={launch:r,result:a,t:0,startBall:{...this.ball},startSurf:o,club:this.club,typeId:this.typeId,evIdx:0,landingCamSet:!1,power:n.power,rolling:!1},this.strokes++,this.prevBall={...this.ball},this.state="flight",this.speedMul=1,this.world.clearAim(),this.world.clearTrail(),this.world.tee.visible=!1,this.hud.meterUpdate(n.power,i?0:n.marker,"hit",r.rating),this.hud.meterShow(!1),mt.impact(this.club.cat,r.quality,i?n.power*.5:n.power),i||this.hud.toast(r.rating,"",oy(r.rating),1100),this.followT=0;let c=this.app.profile.settings.autoCamera;i||this.typeId==="chip"?this.rig.set(c?"follow":this.camMode,{rate:3}):this.rig.set("launch",{from:[this.ball.x,this.ball.y],rate:6}),this.hud.setHoleInfo(this.holeHeader())}updateFlight(t){let e=this.shot,n=e.result;e.t+=t*this.speedMul;let i=n.frames,r=Math.min(e.t,n.duration),o=Math.min(i.length-2,Math.floor(r*60));for(;o>0&&i[o].t>r;)o--;for(;o<i.length-2&&i[o+1].t<r;)o++;let a=i[o],c=i[o+1]||a,l=c.t>a.t?re((r-a.t)/(c.t-a.t),0,1):1,h=a.x+(c.x-a.x)*l,u=a.y+(c.y-a.y)*l,d=a.h+(c.h-a.h)*l,f=(c.x-a.x)*60,m=(c.y-a.y)*60,y=(c.h-a.h)*60;this.world.setBall(h,u,d),this.ballNow=[h,u,d],this.ballVel=[f,m,y];let g=this.isPutt();if(!g&&a.mode==="fly"&&this.app.profile.settings.tracer){let b=e.launch.quality;this.world.pushTrail(h,u,d,b>=1?[1,.85,.3]:[1,1,1])}let p=n.events;for(;e.evIdx<p.length&&p[e.evIdx].t<=r;)this.onEvent(p[e.evIdx]),e.evIdx++;a.mode==="roll"&&!e.rolling&&(e.rolling=!0,mt.rollStart()),e.rolling&&mt.rollUpdate(Math.hypot(f,m),this.hole.surfAt(h,u)===L.GREEN),this.followT+=t;let x=re(this.followT/(g?.9:1.1),0,1);if(this.golfer.setFollow(x,g,g?e.power:Math.min(1,.6+e.power*.4)),!g&&this.app.profile.settings.autoCamera){let b=n.events.find(E=>E.type==="land"||E.type==="splash"),v=b?b.t:n.duration;e.t>.9&&e.t<v-1.4&&this.rig.mode==="launch"&&v>2.5&&this.rig.set("follow",{rate:2.5}),!e.landingCamSet&&b&&e.t>v-1.4&&v>2&&(e.landingCamSet=!0,this.rig.set("landing",{at:[b.x,b.y,b.h],cam:this.pickLandingCam(b),rate:2}),this.rig.snap())}e.t>=n.duration+.25&&this.finishShot()}pickLandingCam(t){let e=this.hole,n=Math.sin(this.heading),i=Math.cos(this.heading),r=i,o=-n,a=null,c=-1e9,l=(h,u,d)=>{for(let f of e.treesNear(h,u))if(Math.hypot(h-f.x,u-f.y)<f.cr+1.5&&d>f.h0-1&&d<f.h0+f.ht+1)return!0;return!1};for(let h of[1,-1])for(let u of[18,10,26,2])for(let d of[12,7,18]){let f=t.x+n*u+r*d*h,m=t.y+i*u+o*d*h,y=Math.max(e.heightAt(f,m),t.h)+3.5,g=0;l(f,m,y)&&(g-=100);for(let x=1;x<8;x++){let b=x/8,v=f+(t.x-f)*b,E=m+(t.y-m)*b,A=y+(t.h+1-y)*b;l(v,E,A)&&(g-=12),e.heightAt(v,E)>A&&(g-=20)}e.surfAt(f,m)===L.WATER&&(g-=3),g-=Math.abs(u-16)*.1+Math.abs(d-11)*.1,g>c&&(c=g,a=[f,m,y])}return a}onEvent(t){let e=this.world;switch(t.type){case"land":case"bounce":{let n=t.surf===L.SAND?"sand":t.surf===L.PATH?"path":"grass";mt.land(n,t.v||12),t.surf===L.SAND&&t.type==="land"?e.spawnBurst(t.x,t.y,t.h,"sand"):t.type==="land"&&(t.surf===L.FAIRWAY||t.surf===L.ROUGH||t.surf===L.DEEP)&&e.spawnBurst(t.x,t.y,t.h,"dirt");break}case"splash":mt.splash(),e.spawnBurst(t.x,t.y,t.h,"splash"),this.theme.crowd&&mt.crowd("groan",.7);break;case"leaves":mt.leaves(),e.spawnBurst(t.x,t.y,t.h,"leaves");break;case"trunk":mt.knock();break;case"pin":mt.knock();break;case"lip":mt.knock(),this.theme.crowd&&mt.crowd("ooh",.8);break;case"cup":mt.rollStop(),mt.cup();break}}finishShot(){mt.rollStop();let t=this.shot,e=t.result,n=this.hole,i=n.distToPin(t.startBall.x,t.startBall.y),r=this.holeLog,o=t.startSurf===L.GREEN;r.shots.push({club:t.club.id,from:t.startSurf,dist:i,carry:e.carry,total:e.total,putt:this.isPutt()||o,holed:e.holed,penalty:e.penalty}),o&&this.card.putts++;let a="",c="",l="info";if(e.water||e.brush){this.strokes++,this.card.penalties++;let f=this.findDrop(e);this.ball=f,a=e.water?"WATER HAZARD":"PENALTY AREA",c="1-stroke penalty \xB7 Take a drop",l="bad",this.cfg.mode!=="range"&&(this.teeShot=!1)}else e.ob?(this.strokes++,this.card.penalties++,this.ball={...t.startBall},a="OUT OF BOUNDS",c="Stroke and distance",l="bad"):(this.ball={x:e.end.x,y:e.end.y,h:e.end.h},this.teeShot=!1);let h=n.surfAt(this.ball.x,this.ball.y),u=n.distToPin(this.ball.x,this.ball.y);if(!e.penalty&&r.shots.length===1&&n.par>=4&&(r.fairway=h===L.FAIRWAY,(t.club.cat==="wood"||t.club.cat==="hybrid")&&(r.drive=e.total)),r.onGreenAt==null&&(h===L.GREEN||e.holed)&&!e.penalty&&(r.onGreenAt=this.strokes),e.holed){this.holeOut(i,o);return}if(h===L.SAND&&u<45&&r.sandFrom==null&&(r.sandFrom=this.strokes),h!==L.GREEN&&u<55&&!e.penalty&&(r.aroundFrom=this.strokes),!a)if(this.isPutt()||o)a=u<.34?"TAP-IN":`${Math.round(u*3)} FT LEFT`,c=e.total>i?"Past the hole":"Short",l=u*3<3?"good":"info";else{a=Es(h).name;let f=Math.round(e.carry),m=Math.round(e.total);c=`Carry ${f} \xB7 Total ${m} yds \xB7 ${h===L.GREEN?Math.round(u*3)+" ft to pin":Math.round(u)+" yds to pin"}`,l=h===L.GREEN||h===L.FAIRWAY?"good":h===L.SAND||h===L.DEEP?"bad":"info",h===L.GREEN&&u*3<10&&(mt.crowd("applause",this.theme.crowd||.5),a="STIFFED IT!"),r.shots.length===1&&t.club.cat==="wood"&&e.total>Math.max(290,t.club.carry*1.15)&&(h===L.FAIRWAY||h===L.FIRSTCUT)?(a="WHAT A DRIVE!",l="great",mt.jingle("great"),mt.crowd("cheer",(this.theme.crowd||.5)*.8)):this.cfg.mode==="range"&&e.total>280&&mt.jingle("great")}this.hud.toast(a,c,l,2200),this.lastResult={r:e,toPin:u};let d=Math.max(.75,this.diff.gimme||0);if(h===L.GREEN&&u*3<=d&&this.cfg.mode!=="range"){this.strokes++,this.card.putts++,setTimeout(()=>{this.hud.toast(u*3<.8?"TAP-IN":"GIMME","","good",1e3),this.holeOut(u,!0,!0)},700),this.state="wait";return}if(this.strokes>=Math.max(10,n.par*2+2)&&this.cfg.mode!=="range"&&this.cfg.mode!=="practice"){this.hud.toast("PICKED UP","Maximum strokes reached","bad",1800),this.state="wait",setTimeout(()=>this.holeOut(0,!1,!0),1400);return}this.state="result",(this.cfg.mode==="range"||this.cfg.mode==="practice")&&this.hud.practiceResult(this,e,t),this.resultTimer=this.cfg.mode==="range"||this.cfg.mode==="practice"?99:1.9}findDrop(t){let e=this.hole,n=t.frames,i=(u,d)=>{let f=e.surfAt(u,d);return f===L.WATER||f===L.BRUSH},r=n.length-1;for(;r>0&&i(n[r].x,n[r].y);)r--;let o=n[r].x,a=n[r].y,c=n[Math.max(0,r-3)].x-o,l=n[Math.max(0,r-3)].y-a,h=Math.hypot(c,l);h<.001&&(c=this.shot.startBall.x-o,l=this.shot.startBall.y-a,h=Math.hypot(c,l)||1),c/=h,l/=h;for(let u=0;u<600;u++){let d=o+c*u*.5,f=a+l*u*.5,m=!i(d,f);for(let y=0;y<8&&m;y++)i(d+Math.cos(y)*2,f+Math.sin(y)*2)&&(m=!1);if(m&&!e.isOB(d,f))return{x:d,y:f,h:e.heightAt(d,f)}}return{...this.shot.startBall}}continueAfterResult(){if(this.state==="result"){if(this.hud.practiceResult(null),this.cfg.mode==="range"){let[t,e]=this.hole.tee;this.ball={x:t,y:e,h:this.hole.heightAt(t,e)},this.strokes=0,this.teeShot=!0;let n={club:this.club,typeId:this.typeId,heading:this.heading};this.beginShot(),n.club.cat!=="putter"&&(this.selectClub(n.club),this.heading=n.heading,this.afterAimChange());return}if(this.cfg.mode==="practice"&&this.practiceSpot&&!this.playingOut){this.ball={...this.practiceSpot.ball},this.strokes=0,this.teeShot=!!this.practiceSpot.tee,this.beginShot();return}this.beginShot()}}holeOut(t,e,n=!1){let i=this.hole,r=this.card,o=this.holeLog,a=this.strokes,c=a-i.par;if(this.cfg.mode==="practice"||this.cfg.mode==="range"){this.playingOut=!1,this.hud.toast(a===1?"IN THE HOLE!":"HOLED!","","great",1800),mt.jingle("birdie"),this.world.spawnBurst(i.pin[0],i.pin[1],i.pinH,"confetti"),this.state="result",this.hud.practiceResult(this,this.shot.result,this.shot);return}r.strokes=a,r.fairway=i.par>=4?!!o.fairway:null,r.gir=o.onGreenAt!=null&&o.onGreenAt<=i.par-2,r.drive=o.drive||0,r.longPutt=e&&!n?t*3:0,r.sandChance=o.sandFrom!=null,r.sandSave=o.sandFrom!=null&&a-o.sandFrom<=2,r.upDownChance=!r.gir&&o.aroundFrom!=null,r.upDown=r.upDownChance&&a-o.aroundFrom<=2;let l=ry(c,a);this.state="holed";let h=c<0?"great":c===0?"good":"bad",u=this.theme.crowd||.5;a===1?(mt.jingle("ace"),mt.crowd("roar",1.3),this.world.spawnBurst(i.pin[0],i.pin[1],i.pinH,"confetti"),setTimeout(()=>this.world.spawnBurst(i.pin[0],i.pin[1],i.pinH,"confetti"),700)):c<=-2?(mt.jingle("eagle"),mt.crowd("roar",u*1.2),this.world.spawnBurst(i.pin[0],i.pin[1],i.pinH,"confetti")):c===-1?(mt.jingle("birdie"),mt.crowd("cheer",u),this.world.spawnBurst(i.pin[0],i.pin[1],i.pinH,"confetti")):c===0?(mt.jingle("par"),mt.crowd("applause",u*.6)):(mt.jingle("bogey"),mt.crowd("applause",u*.3)),e&&t*3>25&&!n&&mt.crowd("roar",u);let d=n?"":e&&t>.5?`${Math.round(t*3)} ft putt`:a>1&&!e?`Holed from ${Math.round(t)} yds!`:"";this.hud.banner(l,d,h),this.celebrateT=c<0||e&&t*3>20?0:null,this.hud.setHoleInfo(this.holeHeader()),this.rig.set("green",{rate:1.5}),setTimeout(()=>{if(this.state!=="holed")return;let f=this.round.idx>=this.round.holes.length-1;this.cfg.mode==="coursePractice"?this.hud.holeComplete(this,{last:!1,practice:!0}):this.hud.holeComplete(this,{last:f})},2600)}nextHole(){if(this.round.idx>=this.round.holes.length-1){this.finishRound();return}this.loadHole(this.round.idx+1)}replayHole(){this.card.strokes=null,this.card.putts=0,this.card.penalties=0,this.loadHole(this.round.idx)}computeStats(){let t=this.round.cards.filter(n=>n.strokes!=null),e={holes:t.length,strokes:0,par:0,toPar:0,putts:0,puttHoles:t.length,fairways:0,fairwayChances:0,gir:0,girChances:t.length,drives:0,driveSum:0,longestDrive:0,longestPutt:0,aces:0,albatross:0,eagles:0,birdies:0,pars:0,bogeys:0,doubles:0,worse:0,sandSaves:0,sandChances:0,upDowns:0,upDownChances:0,penalties:0};for(let n of t){e.strokes+=n.strokes,e.par+=n.par,e.putts+=n.putts,e.penalties+=n.penalties,n.fairway!==null&&(e.fairwayChances++,n.fairway&&e.fairways++),n.gir&&e.gir++,n.drive&&(e.drives++,e.driveSum+=n.drive,e.longestDrive=Math.max(e.longestDrive,n.drive)),e.longestPutt=Math.max(e.longestPutt,n.longPutt||0);let i=n.strokes-n.par;n.strokes===1&&e.aces++,i<=-3?e.albatross++:i===-2?e.eagles++:i===-1?e.birdies++:i===0?e.pars++:i===1?e.bogeys++:i===2?e.doubles++:e.worse++,n.sandChance&&(e.sandChances++,n.sandSave&&e.sandSaves++),n.upDownChance&&(e.upDownChances++,n.upDown&&e.upDowns++)}return e.toPar=e.strokes-e.par,e}finishRound(){let t=this.round.stats=this.computeStats();this.state="final",this.app.onRoundComplete(this.round,t,this.cfg)}placePractice(){let t=this.hole,e=this.cfg.practiceKind||"approach",n=this.rng,i=null,r=400,o=t.pin;for(let a=0;a<r&&!i;a++){let c,l;if(e==="putting"){let h=n()*Math.PI*2,u=2+n()*12;if(c=o[0]+Math.cos(h)*u,l=o[1]+Math.sin(h)*u,t.surfAt(c,l)!==L.GREEN)continue}else if(e==="chipping"){let h=n()*Math.PI*2,u=12+n()*22;c=o[0]+Math.cos(h)*u,l=o[1]+Math.sin(h)*u;let d=t.surfAt(c,l);if(!(d===L.FRINGE||d===L.FIRSTCUT||d===L.ROUGH||d===L.FAIRWAY))continue}else if(e==="bunker"){let h=n()*Math.PI*2,u=8+n()*30;if(c=o[0]+Math.cos(h)*u,l=o[1]+Math.sin(h)*u,t.surfAt(c,l)!==L.SAND)continue}else if(e==="approach"){let h=90+n()*90,u=t.L-h;if([c,l]=t.offset(u,(n()-.5)*t.fwHalf(u)),t.surfAt(c,l)!==L.FAIRWAY)continue}else[c,l]=t.tee;i={ball:{x:c,y:l,h:t.heightAt(c,l)},tee:e==="tee"}}if(!i){let a=t.offset(Math.max(0,t.L-120),0);i={ball:{x:a[0],y:a[1],h:t.heightAt(a[0],a[1])}},this.hud.toast("No such lie on this hole","Placed on the fairway instead","info",1800)}this.practiceSpot=i,this.playingOut=!1,this.ball={...i.ball},this.teeShot=!!i.tee,this.strokes=0,this.beginShot(!0)}newPracticeSpot(){this.hud.practiceResult(null),this.cfg.mode==="practice"&&this.placePractice()}endFlyover(){this.state==="flyover"&&this.beginShot(!0)}update(t){if(this.state==="off"||this.state==="loading"||!this.hole)return;let e=this.hole;if(this.state==="flyover"&&(this.flyT+=t/7.5,this.rig.opts.t=this.flyT,this.flyT>=1.05&&this.endFlyover()),this.state==="aim"){let a=(this.isPutt()?.12:.35)*sy*60*t*(this.keys.size?1+Math.min(3,(this.aimHold=(this.aimHold||0)+t)*2):1);this.keys.has("left")||this.keys.has("right")?(this.heading+=this.keys.has("left")?-a:a,this.aimDirty=!0,this.golfer.placeAtBall(Bt(this.ball.x,this.ball.y,this.ball.h),this.heading),this.aimRefreshT>.06&&this.refreshHud(!0)):(this.aimHold=0,this.aimDirty&&(this.aimDirty=!1,this.updateAim(),this.refreshHud())),this.aimRefreshT=(this.aimRefreshT||0)+t,this.aimDirty&&this.aimRefreshT>.08&&(this.aimRefreshT=0,this.updateAim()),this.golfer.idle(this.world.time)}this.state==="swing"&&this.updateSwing(t),this.state==="flight"&&this.updateFlight(t),this.state==="holed"&&this.celebrateT!=null&&(this.celebrateT+=t,this.celebrateT<2.4&&this.golfer.celebrate(this.celebrateT)),this.state==="result"&&(this.resultTimer-=t,this.resultTimer<=0&&this.continueAfterResult());let n=this.state==="flight"?this.ballNow:[this.ball.x,this.ball.y,this.ball.h];this.rig.update(t,{hole:e,ball:n,heading:this.heading,vel:this.ballVel,putt:this.club&&this.isPutt(),aimDist:this.isPutt()?this.distPin:this.aimDist||150,target:this.previewLanding||e.pin});let i=this.world.camera,r=new D;i.getWorldDirection(r);let o=Math.atan2(r.x,-r.z);this.hud.setWind(this.windDirPlan-o,this.windBaseMph*(this.gust||1)),this.world.windDir=-this.windDirPlan+Math.PI/2,(this.state==="flight"||this.state==="aim"||this.state==="swing")&&this.hud.drawMapBall(this,n)}};function oy(s){return s==="PERFECT"||s==="PURE"?"great":s==="GREAT"||s==="GOOD"?"good":s==="EARLY"||s==="LATE"?"info":"bad"}var od="golfai.thumbs.v4",Cc=class{constructor(){this.profile=ed(),mt.setVolumes({master:this.profile.settings.master,sfx:this.profile.settings.sfx,amb:this.profile.settings.amb}),this.canvas=document.getElementById("scene"),this.world=new yr(this.canvas),this.world.setQuality(this.profile.settings.quality||"high"),this.rig=new Ia(this.world.camera),this.hud=new Ba(document.getElementById("hud"),this),this.menus=new Xa(document.getElementById("menu"),this),this.play=new $a(this),this.thumbs={};try{Object.assign(this.thumbs,JSON.parse(localStorage.getItem(od)||"{}"))}catch{}this.loadPhotoOverrides(),this.mode="menu",this.menuT=0,this.bindInput(),this.menus.show(!0),this.menus.main(),this.last=performance.now(),requestAnimationFrame(this.loop.bind(this)),window.__app=this}save(){nd(this.profile)}loadPhotoOverrides(){fetch("assets/courses/photos.json").then(t=>t.ok?t.json():[]).then(t=>{for(let e of t||[]){let n=e.replace(/\.[a-z]+$/i,"");if(!Un.find(r=>r.id===n))continue;let i=new Image;i.onload=()=>{this.thumbs[n]=i.src,this.photo=this.photo||{},this.photo[n]=!0,this.menus.refreshThumbs?.()},i.src=`assets/courses/${e}`}}).catch(()=>{})}menuScene(){if(this.mode="menu",this.previewGolfer&&(this.previewGolfer.root.visible=!1),this.menuHole&&this.world.hole===this.menuHole){this.rig.set("menu",{t:this.menuT});return}let t=Un.filter(r=>r.unlock<=this.profile.level),e=t[Math.floor(Math.random()*t.length)]||Un[0],n=e.holes.map((r,o)=>r.sig?o:-1).filter(r=>r>=0),i=n[Math.floor(Math.random()*n.length)]??0;this.world.setCourseEnv(e,Di[e.theme]),this.menuHole=new Ui(e,i,{pinSeed:3}),this.world.loadHole(this.menuHole),this.world.setBall(this.menuHole.tee[0],this.menuHole.tee[1],this.menuHole.heightAt(...this.menuHole.tee),!0),this.rig.set("menu",{t:0,snap:!0})}golferPreview(t){(this.world.hole!==this.menuHole||!this.menuHole)&&this.menuScene(),this.mode="golfer";let e=this.menuHole;this.previewGolfer?this.previewGolfer.build(t):(this.previewGolfer=new ws(t),this.world.scene.add(this.previewGolfer.root));let n=this.previewGolfer;n.root.visible=!0,n.setClub("wood",1.15);let[i,r]=e.tee,o=e.heightAt(i,r);n.address(),n.placeAtBall(Bt(i,r,o),Math.atan2(e.teeDir[0],e.teeDir[1]));let a=n.root.position,c=this.rig.mode==="orbitGolfer";this.rig.set("orbitGolfer",{t:this.menuT,center:[a.x,-a.z,o],rate:3,snap:!c})}ensureThumbs(t){if(this.thumbBusy){this.thumbCb=t;return}let e=Un.filter(o=>!this.thumbs[o.id]);if(!e.length)return;this.thumbBusy=!0,this.thumbCb=t;let n=document.createElement("canvas");n.width=640,n.height=360;let i=new yr(n);i.renderer.setPixelRatio(1),i.renderer.setSize(640,360,!1),i.camera.aspect=640/360,i.camera.updateProjectionMatrix(),i.renderer.preserveDrawingBuffer=!0;let r=()=>{let o=e.shift();if(!o){this.thumbBusy=!1,i.clearHole(),i.renderer.dispose(),i.renderer.forceContextLoss?.();try{localStorage.setItem(od,JSON.stringify(Object.fromEntries(Object.entries(this.thumbs).filter(([a])=>!this.photo?.[a]))))}catch{}return}try{let a=o.holes.map((m,y)=>m.sig?y:-1).filter(m=>m>=0),c=o.cardHole??a[0]??0,l=new Ui(o,c,{pinSeed:5});i.setCourseEnv(o,Di[o.theme]),i.loadHole(l),i.setBall(-9999,-9999,-9999);let h=Math.max(0,l.L-(l.par===3?l.L*.75:150)),u=l.at(h),d=Bt(u.x+u.ty*22,u.y-u.tx*22,l.heightAt(u.x,u.y)+(l.par===3?18:30)),f=Bt(l.G[0],l.G[1],l.heightAt(l.G[0],l.G[1]));i.camera.position.copy(d),i.camera.lookAt(f),i.update(.016,f),i.render(),this.thumbs[o.id]||(this.thumbs[o.id]=n.toDataURL("image/jpeg",.82))}catch(a){console.warn("thumb failed",o.id,a)}this.thumbCb?.(),setTimeout(r,30)};setTimeout(r,50)}startRound(t){mt.init(),this.menus.show(!1),this.previewGolfer&&(this.previewGolfer.root.visible=!1),this.menuHole=null,this.mode="play",this.play.start(t)}onRoundComplete(t,e,n){let i=null;n.custom&&(n.mode==="round18"||n.mode==="round9")?(i=sd(this.profile,e,n.difficulty,e.holes),Rc(this.profile,t)):(n.mode==="round18"||n.mode==="round9")&&Rc(this.profile,t),this.save();let r=this.hud.scorecardHtml(this.play);this.play.stop(),this.mode="menu",this.menus.show(!0),this.menus.results(t,e,i,n,r),this.menuScene()}quitToMenu(){this.play.stop(),this.hud.closeModal(),this.menus.show(!0),this.menus.main()}pauseMenu(){let t=this.play,e=this.hud.showScorecard(t,`
      <button class="btn primary" id="pm-resume">RESUME</button>
      ${t.cfg.mode==="coursePractice"||t.cfg.mode==="practice"?'<button class="btn" id="pm-restart">RESTART HOLE</button>':""}
      <button class="btn" id="pm-guide">PUTT GUIDE: ${this.profile.settings.puttGuide?"ON":"OFF"}</button>
      <button class="btn" id="pm-cam">BROADCAST CAM: ${this.profile.settings.autoCamera?"ON":"OFF"}</button>
      <button class="btn danger" id="pm-quit">QUIT TO MENU</button>`);e.querySelector(".modal-title").insertAdjacentHTML("afterbegin",'<div class="paused">PAUSED</div>'),e.querySelector("#pm-resume").onclick=()=>this.hud.closeModal();let n=e.querySelector("#pm-restart");n&&(n.onclick=()=>{this.hud.closeModal(),t.replayHole()}),e.querySelector("#pm-guide").onclick=()=>{this.profile.settings.puttGuide=!this.profile.settings.puttGuide,this.save(),t.state==="aim"&&t.updateAim(),this.pauseMenu()},e.querySelector("#pm-cam").onclick=()=>{this.profile.settings.autoCamera=!this.profile.settings.autoCamera,this.save(),this.pauseMenu()},e.querySelector("#pm-quit").onclick=()=>{confirm("Quit this round? Progress on this round will be lost.")&&this.quitToMenu()}}bindInput(){window.addEventListener("keydown",e=>{if(e.target&&(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")||(mt.init(),this.mode!=="play"))return;let n=this.play;if(e.key==="Tab"){if(e.preventDefault(),n.state==="holed"||n.state==="final")return;this.hud.modalOpen()?this.hud.closeModal():this.hud.showScorecard(n);return}if(this.hud.modalOpen()){if(e.key==="Escape"&&n.state!=="holed"&&this.hud.closeModal(),e.key==="Enter"&&n.state==="holed"&&this.hud.pendingNext){let i=this.hud.pendingNext;this.hud.pendingNext=null,i()}return}if(e.key==="Escape"&&n.state!=="flyover"){e.preventDefault(),this.pauseMenu();return}if((e.key==="n"||e.key==="N")&&n.cfg?.mode==="practice"&&(n.state==="result"||n.state==="aim")){n.newPracticeSpot();return}n.onKeyDown(e)&&e.preventDefault()}),window.addEventListener("keyup",e=>{this.mode==="play"&&this.play.onKeyUp(e)});let t=null;this.canvas.addEventListener("pointerdown",e=>{mt.init(),t={x:e.clientX,y:e.clientY,moved:!1},this.mode==="play"&&this.play.state==="flyover"&&this.play.endFlyover(),this.mode==="play"&&this.play.state==="result"&&this.play.continueAfterResult()}),window.addEventListener("pointermove",e=>{if(!t)return;let n=e.clientX-t.x,i=e.clientY-t.y;t.x=e.clientX,t.y=e.clientY,Math.abs(n)+Math.abs(i)>0&&(t.moved=!0),this.mode==="play"&&this.play.onDrag(n,i)}),window.addEventListener("pointerup",()=>{t=null}),this.canvas.addEventListener("wheel",e=>{this.mode==="play"&&(e.preventDefault(),this.play.onWheel(e.deltaY))},{passive:!1})}loop(t){let e=Math.min(.05,(t-this.last)/1e3);this.last=t,this.menuT+=e,this.frames=(this.frames||0)+1;let n=null;if(this.mode==="play"&&this.play.hole){this.play.update(e);let i=this.play.state==="flight"?this.play.ballNow:this.play.ball?[this.play.ball.x,this.play.ball.y,this.play.ball.h]:null;i&&(n=Bt(i[0],i[1],i[2]))}else this.world.hole&&(this.rig.opts&&(this.rig.opts.t=this.menuT),this.rig.update(e,{hole:this.world.hole,ball:[this.world.hole.tee[0],this.world.hole.tee[1],0],heading:0}),this.mode==="golfer"&&this.previewGolfer?(this.previewGolfer.idle(this.menuT),n=this.previewGolfer.root.position.clone()):n=this.rig.look.clone());this.world.hole&&(this.world.update(e,n),this.world.render()),requestAnimationFrame(this.loop.bind(this))}};window.addEventListener("DOMContentLoaded",()=>{try{new Cc}catch(s){console.error(s),document.body.insertAdjacentHTML("beforeend",`<div style="position:fixed;inset:0;display:grid;place-items:center;color:#fff;font:16px sans-serif;background:#111">Failed to start: ${s.message}. A WebGL-capable browser is required.</div>`)}});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
