"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([["1705"],{25995(e,t,n){n.d(t,{o:()=>x});var a=n(31085),o=n(77125),i=n(64947),s=n(58837),r=n(72501),l=n(62112),c=n(75202),m=n(56711),p=n(47250),d=n(89475);let h=`apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example
  description: example.com
  annotations:
    ANNOTATION: value
spec:
  type: website
  lifecycle: production
  owner: user:guest`,u=/^.*ANNOTATION.*$/m,g=h.match(u)[0],y=h.split("\n").findIndex(e=>u.test(e)),A=(0,s.A)(e=>({code:{borderRadius:6,margin:e.spacing(2,0),background:"dark"===e.palette.type?"#444":e.palette.common.white}}),{name:"BackstageMissingAnnotationEmptyState"});function x(e){let t,n,{annotation:s,readMoreUrl:u}=e,x=Array.isArray(s)?s:[s],j=A(),{t:N}=(0,p.i)(d.O);return(0,a.jsx)(m.p,{missing:"field",title:N("emptyState.missingAnnotation.title"),description:(t=x.length<=1,(0,a.jsxs)(a.Fragment,{children:["The ",t?"annotation":"annotations"," ",x.map(e=>(0,a.jsx)("code",{children:e})).reduce((e,t)=>(0,a.jsxs)(a.Fragment,{children:[e,", ",t]}))," ",t?"is":"are"," missing. You need to add the"," ",t?"annotation":"annotations"," to your component if you want to enable this tool."]})),action:(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(r.A,{variant:"body1",children:N("emptyState.missingAnnotation.actionTitle")}),(0,a.jsx)(o.A,{className:j.code,children:(0,a.jsx)(l.z,{text:(n=x.map(e=>g.replace("ANNOTATION",e)).join("\n"),h.replace(g,n)),language:"yaml",showLineNumbers:!0,highlightedNumbers:Array.from(Array(x.length+1).keys(),e=>e+y),customStyle:{background:"inherit",fontSize:"115%"}})}),(0,a.jsx)(i.A,{color:"primary",component:c.N_,to:u||"https://backstage.io/docs/features/software-catalog/well-known-annotations",children:N("emptyState.missingAnnotation.readMore")})]})})}},60192(e,t,n){n.d(t,{Router:()=>m});var a=n(31085),o=n(18690),i=n(53538),s=n(25995),r=n(32519),l=n(4768),c=n(80663);let m=()=>{let{entity:e}=(0,r.tN)();return(0,c.a)(e)?(0,a.jsx)(o.Routes,{children:(0,a.jsx)(o.Route,{path:"/",element:(0,a.jsx)(l.ArgoCDHistoryCard,{})})}):(0,a.jsx)(s.o,{annotation:i.TV})}}}]);
//# sourceMappingURL=1705.fbd862ef.chunk.js.map