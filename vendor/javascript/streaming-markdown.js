// streaming-markdown@0.2.15 downloaded from https://ga.jspm.io/npm:streaming-markdown@0.2.15/smd.js

const e=1,n=2,t=3,c=4,a=5,i=6,r=7,s=8,d=9,o=10,u=11,l=12,g=13,k=14,p=15,f=16,_=17,h=18,b=19,m=20,x=21,w=22,E=23,q=24,C=25,H=26,L=27,I=28,A=29,U=30,R=31,B=101,S=102,T=103,$=104,y=105;const N=/** @type {const} */{Document:e,Blockquote:m,Paragraph:n,Heading_1:t,Heading_2:c,Heading_3:a,Heading_4:i,Heading_5:r,Heading_6:s,Code_Block:d,Code_Fence:o,Code_Inline:u,Italic_Ast:l,Italic_Und:g,Strong_Ast:k,Strong_Und:p,Strike:f,Link:_,Raw_URL:h,Image:b,Line_Break:x,Rule:w,List_Unordered:E,List_Ordered:q,List_Item:C,Checkbox:H,Table:L,Table_Row:I,Table_Cell:A,Equation_Block:U,Equation_Inline:R};
/**
 * @param   {Token} type
 * @returns {string    } */function v(B){switch(B){case e:return"Document";case m:return"Blockquote";case n:return"Paragraph";case t:return"Heading_1";case c:return"Heading_2";case a:return"Heading_3";case i:return"Heading_4";case r:return"Heading_5";case s:return"Heading_6";case d:return"Code_Block";case o:return"Code_Fence";case u:return"Code_Inline";case l:return"Italic_Ast";case g:return"Italic_Und";case k:return"Strong_Ast";case p:return"Strong_Und";case f:return"Strike";case _:return"Link";case h:return"Raw URL";case b:return"Image";case x:return"Line_Break";case w:return"Rule";case E:return"List_Unordered";case q:return"List_Ordered";case C:return"List_Item";case H:return"Checkbox";case L:return"Table";case I:return"Table_Row";case A:return"Table_Cell";case U:return"Equation_Block";case R:return"Equation_Inline"}}const D=1,P=2,F=4,O=8,M=16;const W=/** @type {const} */{Href:D,Src:P,Lang:F,Checked:O,Start:M};
/**
 * @param   {Attr} type
 * @returns {string    } */function j(e){switch(e){case D:return"href";case P:return"src";case F:return"class";case O:return"checked";case M:return"start"}}
/**
 * @param   {number} level
 * @returns {Token } */const z=e=>{switch(e){case 1:return t;case 2:return c;case 3:return a;case 4:return i;case 5:return r;default:return s}};const G=z;
/**
 * @param   {Token} token
 * @returns {number} */const J=e=>{switch(e){case t:return 1;case c:return 2;case a:return 3;case i:return 4;case r:return 5;case s:return 6;default:return 0}};
/**
 * @typedef  {object      } Parser
 * @property {Any_Renderer} renderer        - {@link Renderer} interface
 * @property {string      } text            - Text to be added to the last token in the next flush
 * @property {string      } pending         - Characters for identifying tokens
 * @property {Uint32Array } tokens          - Current token and it's parents (a slice of a tree)
 * @property {number      } len             - Number of tokens in types without root
 * @property {number      } token           - Last token in the tree
 * @property {Uint8Array  } spaces
 * @property {string      } indent
 * @property {number      } indent_len
 * @property {number      } fence_end       - For {@link Token.Code_Fence} parsing
 * @property {number      } fence_start
 * @property {number      } blockquote_idx  - For Blockquote parsing
 * @property {string      } hr_char         - For horizontal rule parsing
 * @property {number      } hr_chars        - For horizontal rule parsing
 * @property {number      } table_state
 */const K=24;
/**
 * Makes a new Parser object.
 * @param   {Any_Renderer} renderer
 * @returns {Parser      } */function Q(n){const t=new Uint32Array(K);t[0]=e;return{renderer:n,text:"",pending:"",tokens:t,len:0,token:e,fence_end:0,blockquote_idx:0,hr_char:"",hr_chars:0,fence_start:0,spaces:new Uint8Array(K),indent:"",indent_len:0,table_state:0}}
/**
 * Finish rendering the markdown - flushes any remaining text.
 * @param   {Parser} p
 * @returns {void  } */function V(e){e.pending.length>0&&oe(e,"\n")}
/**
 * @param   {Parser} p
 * @returns {void  } */function X(e){if(e.text.length!==0){console.assert(e.len>0,"Never adding text to root");e.renderer.add_text(e.renderer.data,e.text);e.text=""}}
/**
 * @param   {Parser} p
 * @returns {void  } */
/**
 * @param   {Parser} p
 * @returns {void  } */
function Y(e){console.assert(e.len>0,"No nodes to end");e.len-=1;e.token=/** @type {Token} */e.tokens[e.len];e.renderer.end_token(e.renderer.data)}
/**
 * @param   {Parser} p
 * @param   {Token } token
 * @returns {void  } */function Z(e,n){e.tokens[e.len]!==q&&e.tokens[e.len]!==E||n===C||Y(e);e.len+=1;e.tokens[e.len]=n;e.token=n;e.renderer.add_token(e.renderer.data,n)}
/**
 * @param   {Parser} p
 * @param   {number} token
 * @param   {number} start_idx
 * @returns {number} */function ee(e,n,t){while(t<=e.len){if(e.tokens[t]===n)return t;t+=1}return-1}
/**
 * End tokens until the parser has the given length.
 * @param   {Parser} p
 * @param   {number} len
 * @returns {void  } */function ne(e,n){e.fence_start=0;while(e.len>n)Y(e)}
/**
 * @param   {Parser} p
 * @param   {number} indent
 * @returns {number} */function te(e,n){let t=0;for(let c=0;c<=e.len;c+=1){n-=e.spaces[c];if(n<0)break;switch(e.tokens[c]){case d:case o:case m:case C:t=c;break}}while(e.len>t)Y(e);return n}
/**
 * @param   {Parser } p
 * @param   {Token  } list_token
 * @returns {boolean} added a new list */function ce(e,n){let t=-1;let c=-1;for(let a=e.blockquote_idx+1;a<=e.len;a+=1)if(e.tokens[a]===C){if(e.indent_len<e.spaces[a]){c=-1;break}c=a}else e.tokens[a]===n&&(t=a);if(c===-1){if(t===-1){ne(e,e.blockquote_idx);Z(e,n);return true}ne(e,t);return false}ne(e,c);Z(e,n);return true}
/**
 * Create a new list
 * or continue the last one
 * @param   {Parser } p
 * @param   {number } prefix_length
 * @returns {void   } */function ae(e,n){Z(e,C);e.spaces[e.len]=e.indent_len+n;ie(e);e.token=T}
/**
 * @param   {Parser} p
 * @returns {void  } */function ie(e){e.indent="";e.indent_len=0;e.pending=""}
/**
 * @param   {number} charcode
 * @returns {boolean} */function re(e){switch(e){case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return true;default:return false}}
/**
 * @param   {number} charcode
 * @returns {boolean} */function se(e){switch(e){case 32:case 58:case 59:case 41:case 44:case 33:case 46:case 63:case 93:case 10:return true;default:return false}}
/**
 * @param   {number} charcode
 * @returns {boolean} */function de(e){return re(e)||se(e)}
/**
 * @param   {number} charcode
 * @returns {boolean} */
/**
 * Parse and render another chunk of markdown.
 * @param   {Parser} p
 * @param   {string} chunk
 * @returns {void  } */
function oe(N,v){for(const W of v){if(N.token===B){switch(W){case" ":N.indent_len+=1;continue;case"\t":N.indent_len+=4;continue}let e=te(N,N.indent_len);N.indent_len=0;N.token=N.tokens[N.len];e>0&&oe(N," ".repeat(e))}const v=N.pending+W;switch(N.token){case x:case e:case m:case q:case E:console.assert(N.text.length===0,"Root should not have any text");switch(N.pending[0]){case void 0:N.pending=W;continue;case" ":console.assert(N.pending.length===1);N.pending=W;N.indent+=" ";N.indent_len+=1;continue;case"\t":console.assert(N.pending.length===1);N.pending=W;N.indent+="\t";N.indent_len+=4;continue;case"\n":console.assert(N.pending.length===1);if(N.tokens[N.len]===C&&N.token===x){Y(N);ie(N);N.pending=W;continue}ne(N,N.blockquote_idx);ie(N);N.blockquote_idx=0;N.fence_start=0;N.pending=W;continue;case"#":switch(W){case"#":if(N.pending.length<6){N.pending=v;continue}break;case" ":te(N,N.indent_len);Z(N,G(N.pending.length));ie(N);continue}break;case">":{const e=ee(N,m,N.blockquote_idx+1);if(e===-1){ne(N,N.blockquote_idx);N.blockquote_idx+=1;N.fence_start=0;Z(N,m)}else N.blockquote_idx=e;ie(N);N.pending=W;continue}case"-":case"*":case"_":if(N.hr_chars===0){console.assert(N.pending.length===1,"Pending should be one character");N.hr_chars=1;N.hr_char=N.pending}if(N.hr_chars>0){switch(W){case N.hr_char:N.hr_chars+=1;N.pending=v;continue;case" ":N.pending=v;continue;case"\n":if(N.hr_chars<3)break;te(N,N.indent_len);N.renderer.add_token(N.renderer.data,w);N.renderer.end_token(N.renderer.data);ie(N);N.hr_chars=0;continue}N.hr_chars=0}if("_"!==N.pending[0]&&" "===N.pending[1]){ce(N,E);ae(N,2);oe(N,v.slice(2));continue}break;case"`":if(N.pending.length<3){if("`"===W){N.pending=v;N.fence_start=v.length;continue}N.fence_start=0;break}switch(W){case"`":if(N.pending.length===N.fence_start){N.pending=v;N.fence_start=v.length}else{Z(N,n);ie(N);N.fence_start=0;oe(N,v)}continue;case"\n":te(N,N.indent_len);Z(N,o);N.pending.length>N.fence_start&&N.renderer.set_attr(N.renderer.data,F,N.pending.slice(N.fence_start));ie(N);N.token=B;continue;default:N.pending=v;continue}case"+":if(" "!==W)break;ce(N,E);ae(N,2);continue;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":if("."===N.pending[N.pending.length-1]){if(" "!==W)break;ce(N,q)&&N.pending!=="1."&&N.renderer.set_attr(N.renderer.data,M,N.pending.slice(0,-1));ae(N,N.pending.length+1);continue}{const e=W.charCodeAt(0);if(46===e||re(e)){N.pending=v;continue}}break;case"|":ne(N,N.blockquote_idx);Z(N,L);Z(N,I);N.pending="";oe(N,W);continue}let t=v;if(N.token===x){N.token=N.tokens[N.len];N.renderer.add_token(N.renderer.data,x);N.renderer.end_token(N.renderer.data)}else if(N.indent_len>=4){let e=0;for(;e<4;e+=1)if(N.indent[e]==="\t"){e+=1;break}t=N.indent.slice(e)+v;Z(N,d)}else Z(N,n);ie(N);oe(N,t);continue;case L:if(N.table_state===1)switch(W){case"-":case" ":case"|":case":":N.pending=v;continue;case"\n":N.table_state=2;N.pending="";continue;default:Y(N);N.table_state=0;break}else switch(N.pending){case"|":Z(N,I);N.pending="";oe(N,W);continue;case"\n":Y(N);N.pending="";N.table_state=0;oe(N,W);continue}break;case I:switch(N.pending){case"":break;case"|":Z(N,A);Y(N);N.pending="";oe(N,W);continue;case"\n":Y(N);N.table_state=Math.min(N.table_state+1,2);N.pending="";oe(N,W);continue;default:Z(N,A);oe(N,W);continue}break;case A:if(N.pending==="|"){X(N);Y(N);N.pending="";oe(N,W);continue}break;case d:switch(v){case"\n    ":case"\n   \t":case"\n  \t":case"\n \t":case"\n\t":N.text+="\n";N.pending="";continue;case"\n":case"\n ":case"\n  ":case"\n   ":N.pending=v;continue;default:if(N.pending.length!==0){X(N);Y(N);N.pending=W}else N.text+=W;continue}case o:switch(W){case"`":N.pending=v;continue;case"\n":if(v.length===N.fence_start+N.fence_end+1){X(N);Y(N);N.pending="";N.fence_start=0;N.fence_end=0;N.token=B;continue}N.token=B;break;case" ":if(N.pending[0]==="\n"){N.pending=v;N.fence_end+=1;continue}break}N.text+=N.pending;N.pending=W;N.fence_end=1;continue;case u:switch(W){case"`":if(v.length===N.fence_start+Number(N.pending[0]===" ")){X(N);Y(N);N.pending="";N.fence_start=0}else N.pending=v;continue;case"\n":N.text+=N.pending;N.pending="";N.token=x;N.blockquote_idx=0;X(N);continue;case" ":N.text+=N.pending;N.pending=W;continue;default:N.text+=v;N.pending="";continue}case T:switch(N.pending.length){case 0:if("["!==W)break;N.pending=v;continue;case 1:if(" "!==W&&"x"!==W)break;N.pending=v;continue;case 2:if("]"!==W)break;N.pending=v;continue;case 3:if(" "!==W)break;N.renderer.add_token(N.renderer.data,H);"x"===N.pending[1]&&N.renderer.set_attr(N.renderer.data,O,"");N.renderer.end_token(N.renderer.data);N.pending=" ";continue}N.token=N.tokens[N.len];N.pending="";oe(N,v);continue;case k:case p:{
/** @type {string} */let e="*";
/** @type {Token } */let n=l;if(N.token===p){e="_";n=g}if(e===N.pending){X(N);if(e===W){Y(N);N.pending="";continue}Z(N,n);N.pending=W;continue}break}case l:case g:{
/** @type {string} */let e="*";
/** @type {Token } */let n=k;if(N.token===g){e="_";n=p}switch(N.pending){case e:if(e===W)if(N.tokens[N.len-1]===n)N.pending=v;else{X(N);Z(N,n);N.pending=""}else{X(N);Y(N);N.pending=W}continue;case e+e:const t=N.token;X(N);Y(N);Y(N);if(e!==W){Z(N,t);N.pending=W}else N.pending="";continue}break}case f:if("~~"===v){X(N);Y(N);N.pending="";continue}break;case y:if(W==="\n"){X(N);Z(N,U);N.pending=""}else{N.token=N.tokens[N.len];N.pending[0]==="\\"?N.text+="[":N.text+="$$";N.pending="";oe(N,W)}continue;case U:if("\\]"===v||"$$"===v){X(N);Y(N);N.pending="";continue}break;case R:if("\\)"===v||"$"===N.pending[0]){X(N);Y(N);N.pending=W===")"?"":W;continue}break;case S:if("http://"===v||"https://"===v){X(N);Z(N,h);N.pending=v;N.text=v}else if("http:/"[N.pending.length]===W||"https:/"[N.pending.length]===W)N.pending=v;else{N.token=N.tokens[N.len];oe(N,W)}continue;case _:case b:if("]"===N.pending){X(N);if("("===W)N.pending=v;else{Y(N);N.pending=W}continue}if("]"===N.pending[0]&&"("===N.pending[1]){if(")"===W){const e=N.token===_?D:P;const n=N.pending.slice(2);N.renderer.set_attr(N.renderer.data,e,n);Y(N);N.pending=""}else N.pending+=W;continue}break;case h:if(" "===W||"\n"===W||"\\"===W){N.renderer.set_attr(N.renderer.data,D,N.pending);X(N);Y(N);N.pending=W}else{N.text+=W;N.pending=v}continue;case $:if(v.startsWith("<br")){if(v.length===3||W===" "||W==="/"&&(v.length===4||N.pending[N.pending.length-1]===" ")){N.pending=v;continue}if(W===">"){X(N);N.token=N.tokens[N.len];N.renderer.add_token(N.renderer.data,x);N.renderer.end_token(N.renderer.data);N.pending="";continue}}N.token=N.tokens[N.len];N.text+="<";N.pending=N.pending.slice(1);oe(N,W);continue}switch(N.pending[0]){case"\\":if(N.token===b||N.token===U||N.token===R)break;switch(W){case"(":X(N);Z(N,R);N.pending="";continue;case"[":N.token=y;N.pending=v;continue;case"\n":N.pending=W;continue;default:let e=W.charCodeAt(0);N.pending="";N.text+=re(e)||e>=65&&e<=90||e>=97&&e<=122?v:W;continue}case"\n":switch(N.token){case b:case U:case R:break;case t:case c:case a:case i:case r:case s:X(N);ne(N,N.blockquote_idx);N.blockquote_idx=0;N.pending=W;continue;default:X(N);N.pending=W;N.token=x;N.blockquote_idx=0;continue}break;case"<":if(N.token!==b&&N.token!==U&&N.token!==R){X(N);N.pending=v;N.token=$;continue}break;case"`":if(N.token===b)break;if("`"===W){N.fence_start+=1;N.pending=v}else{N.fence_start+=1;X(N);Z(N,u);N.text=" "===W||"\n"===W?"":W;N.pending=""}continue;case"_":case"*":{if(N.token===b||N.token===U||N.token===R||N.token===k)break;
/** @type {Token} */let e=l;
/** @type {Token} */let n=k;const t=N.pending[0];if("_"===t){e=g;n=p}if(N.pending.length===1){if(t===W){N.pending=v;continue}if(" "!==W&&"\n"!==W){X(N);Z(N,e);N.pending=W;continue}}else{if(t===W){X(N);Z(N,n);Z(N,e);N.pending="";continue}if(" "!==W&&"\n"!==W){X(N);Z(N,n);N.pending=W;continue}}break}case"~":if(N.token!==b&&N.token!==f)if("~"===N.pending){if("~"===W){N.pending=v;continue}}else if(" "!==W&&"\n"!==W){X(N);Z(N,f);N.pending=W;continue}break;case"$":if(N.token!==b&&N.token!==f&&"$"===N.pending){if("$"===W){N.token=y;N.pending=v;continue}if(de(W.charCodeAt(0)))break;X(N);Z(N,R);N.pending=W;continue}break;case"[":if(N.token!==b&&N.token!==_&&N.token!==U&&N.token!==R&&"]"!==W){X(N);Z(N,_);N.pending=W;continue}break;case"!":if(!(N.token===b)&&"["===W){X(N);Z(N,b);N.pending="";continue}break;case" ":if(N.pending.length===1&&" "===W)continue;break}if(N.token===b||N.token===_||N.token===U||N.token===R||"h"!==W||" "!==N.pending&&""!==N.pending){N.text+=N.pending;N.pending=W}else{N.text+=N.pending;N.pending=W;N.token=S}}X(N)}
/**
 * @template T
 * @callback Renderer_Add_Token
 * @param   {T    } data
 * @param   {Token} type
 * @returns {void } */
/**
 * @template T
 * @callback Renderer_End_Token
 * @param   {T    } data
 * @returns {void } */
/**
 * @template T
 * @callback Renderer_Add_Text
 * @param   {T     } data
 * @param   {string} text
 * @returns {void  } */
/**
 * @template T
 * @callback Renderer_Set_Attr
 * @param   {T     } data
 * @param   {Attr  } type
 * @param   {string} value
 * @returns {void  } */
/**
 * The renderer interface.
 * @template T
 * @typedef  {object               } Renderer
 * @property {T                    } data      User data object. Available as first param in callbacks.
 * @property {Renderer_Add_Token<T>} add_token When the tokens starts.
 * @property {Renderer_End_Token<T>} end_token When the token ends.
 * @property {Renderer_Add_Text <T>} add_text  To append text to current token. Can be called multiple times or none.
 * @property {Renderer_Set_Attr <T>} set_attr  Set additional attributes of current token eg. the link url.
 */
/** @typedef {Renderer<any>} Any_Renderer */
/**
 * @typedef  {object} Default_Renderer_Data
 * @property {HTMLElement[]} nodes
 * @property {number       } index
 *
 * @typedef {Renderer          <Default_Renderer_Data>} Default_Renderer
 * @typedef {Renderer_Add_Token<Default_Renderer_Data>} Default_Renderer_Add_Token
 * @typedef {Renderer_End_Token<Default_Renderer_Data>} Default_Renderer_End_Token
 * @typedef {Renderer_Add_Text <Default_Renderer_Data>} Default_Renderer_Add_Text
 * @typedef {Renderer_Set_Attr <Default_Renderer_Data>} Default_Renderer_Set_Attr
 */
/**
 * @param   {HTMLElement     } root
 * @returns {Default_Renderer} */function ue(e){return{add_token:le,end_token:ge,add_text:ke,set_attr:pe,data:{nodes:/**@type {*}*/[e,,,,,],index:0}}}
/** @type {Default_Renderer_Add_Token} */function le(B,S){
/**@type {Element}*/let T=B.nodes[B.index];
/**@type {HTMLElement}*/let $;switch(S){case e:return;case m:$=document.createElement("blockquote");break;case n:$=document.createElement("p");break;case x:$=document.createElement("br");break;case w:$=document.createElement("hr");break;case t:$=document.createElement("h1");break;case c:$=document.createElement("h2");break;case a:$=document.createElement("h3");break;case i:$=document.createElement("h4");break;case r:$=document.createElement("h5");break;case s:$=document.createElement("h6");break;case l:case g:$=document.createElement("em");break;case k:case p:$=document.createElement("strong");break;case f:$=document.createElement("s");break;case u:$=document.createElement("code");break;case h:case _:$=document.createElement("a");break;case b:$=document.createElement("img");break;case E:$=document.createElement("ul");break;case q:$=document.createElement("ol");break;case C:$=document.createElement("li");break;case H:let B=$=document.createElement("input");B.type="checkbox";B.disabled=true;break;case d:case o:T=T.appendChild(document.createElement("pre"));$=document.createElement("code");break;case L:$=document.createElement("table");break;case I:switch(T.children.length){case 0:T=T.appendChild(document.createElement("thead"));break;case 1:T=T.appendChild(document.createElement("tbody"));break;default:T=T.children[1]}$=document.createElement("tr");break;case A:$=document.createElement(T.parentElement?.tagName==="THEAD"?"th":"td");break;case U:$=document.createElement("equation-block");break;case R:$=document.createElement("equation-inline");break}B.nodes[++B.index]=T.appendChild($)}
/** @type {Default_Renderer_End_Token} */function ge(e){e.index-=1}
/** @type {Default_Renderer_Add_Text} */function ke(e,n){e.nodes[e.index].appendChild(document.createTextNode(n))}
/** @type {Default_Renderer_Set_Attr} */function pe(e,n,t){e.nodes[e.index].setAttribute(j(n),t)}
/**
 * @typedef {undefined} Logger_Renderer_Data
 *
 * @typedef {Renderer          <Logger_Renderer_Data>} Logger_Renderer
 * @typedef {Renderer_Add_Token<Logger_Renderer_Data>} Logger_Renderer_Add_Token
 * @typedef {Renderer_End_Token<Logger_Renderer_Data>} Logger_Renderer_End_Token
 * @typedef {Renderer_Add_Text <Logger_Renderer_Data>} Logger_Renderer_Add_Text
 * @typedef {Renderer_Set_Attr <Logger_Renderer_Data>} Logger_Renderer_Set_Attr
 */
/** @returns {Logger_Renderer} */function fe(){return{data:void 0,add_token:_e,end_token:he,add_text:be,set_attr:me}}
/** @type {Logger_Renderer_Add_Token} */function _e(e,n){console.log("add_token:",v(n))}
/** @type {Logger_Renderer_End_Token} */function he(e){console.log("end_token")}
/** @type {Logger_Renderer_Add_Text} */function be(e,n){console.log('add_text: "%s"',n)}
/** @type {Logger_Renderer_Set_Attr} */function me(e,n,t){console.log('set_attr: %s="%s"',j(n),t)}export{W as Attr,m as BLOCKQUOTE,H as CHECKBOX,O as CHECKED,d as CODE_BLOCK,o as CODE_FENCE,u as CODE_INLINE,e as DOCUMENT,U as EQUATION_BLOCK,R as EQUATION_INLINE,t as HEADING_1,c as HEADING_2,a as HEADING_3,i as HEADING_4,r as HEADING_5,s as HEADING_6,D as HREF,b as IMAGE,l as ITALIC_AST,g as ITALIC_UND,F as LANG,x as LINE_BREAK,_ as LINK,C as LIST_ITEM,q as LIST_ORDERED,E as LIST_UNORDERED,$ as MAYBE_BR,y as MAYBE_EQ_BLOCK,T as MAYBE_TASK,S as MAYBE_URL,B as NEWLINE,n as PARAGRAPH,h as RAW_URL,w as RULE,P as SRC,M as START,f as STRIKE,k as STRONG_AST,p as STRONG_UND,L as TABLE,A as TABLE_CELL,I as TABLE_ROW,N as Token,j as attr_to_html_attr,ke as default_add_text,le as default_add_token,ge as default_end_token,ue as default_renderer,pe as default_set_attr,G as heading_from_level,J as heading_to_level,z as level_to_heading,be as logger_add_text,_e as logger_add_token,he as logger_end_token,fe as logger_renderer,me as logger_set_attr,Q as parser,V as parser_end,oe as parser_write,v as token_to_string};

