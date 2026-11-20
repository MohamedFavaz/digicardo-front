/**
 * Static CSS for the "motion" template (no user text ever reaches it). Every animation sits
 * inside `prefers-reduced-motion: no-preference`; scroll-driven effects also need the root's
 * `mo-lively` class (owner's "Animation" control) and run off CSS variables written by fx.ts.
 */
export const MOTION_CSS = `
.mo-root{--mo-ease:cubic-bezier(.2,.8,.2,1);--mo-spring:cubic-bezier(.34,1.45,.64,1)}
.mo-glass{background:var(--mo-glass);border:1px solid var(--mo-line);box-shadow:var(--mo-shadow)}
.mo-blur{-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4)}
[data-ripple]{position:relative;overflow:hidden;isolation:isolate}
.mo-ripple{position:absolute;z-index:-1;border-radius:9999px;background:currentColor;opacity:.25;transform:scale(0);pointer-events:none;animation:mo-ripple .7s var(--mo-ease) forwards}
.mo-grid{background-image:linear-gradient(var(--mo-line) 1px,transparent 1px),linear-gradient(90deg,var(--mo-line) 1px,transparent 1px);background-size:28px 28px;-webkit-mask-image:radial-gradient(75% 65% at 50% 30%,#000 20%,transparent 75%);mask-image:radial-gradient(75% 65% at 50% 30%,#000 20%,transparent 75%)}
.mo-3d{transform-style:preserve-3d}
.mo-face{-webkit-backface-visibility:hidden;backface-visibility:hidden}
.mo-flip[data-flipped] {transform:rotateY(180deg)}
.mo-tilt{transform:rotateX(var(--ty,0deg)) rotateY(var(--tx,0deg))}
.mo-glare{background:radial-gradient(circle at var(--gx,50%) var(--gy,0%),rgba(255,255,255,.38),transparent 55%);opacity:0;transition:opacity .4s}
.mo-tilt[data-tilting] .mo-glare{opacity:1}
.mo-dial-item[data-closed]{opacity:0;transform:translateY(18px) scale(.5);pointer-events:none}
.mo-collapse{display:grid;grid-template-rows:0fr}
.mo-collapse[data-open]{grid-template-rows:1fr}
.mo-scrollbar-none{scrollbar-width:none}
.mo-scrollbar-none::-webkit-scrollbar{display:none}
@keyframes mo-ripple{to{transform:scale(1);opacity:0}}

@media (prefers-reduced-motion:no-preference){
  .mo-intro{animation:mo-rise .9s var(--mo-ease) both;animation-delay:calc(var(--i,0) * 90ms + 140ms)}
  .mo-word{display:inline-block;animation:mo-word 1s var(--mo-ease) both;animation-delay:calc(var(--i,0) * 85ms + 260ms)}
  .mo-logo{animation:mo-pop 1s var(--mo-spring) both}
  .mo-ring{animation:mo-spin 7s linear infinite}
  .mo-blob{animation:mo-drift 16s ease-in-out infinite alternate}
  .mo-blob:nth-child(2){animation-duration:21s;animation-delay:-6s}
  .mo-blob:nth-child(3){animation-duration:26s;animation-delay:-12s}
  .mo-ping::after{content:"";position:absolute;inset:0;border-radius:inherit;background:inherit;animation:mo-ping 1.8s cubic-bezier(0,0,.2,1) infinite}
  .mo-shimmer::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.32) 50%,transparent 70%);transform:translateX(-120%);animation:mo-sweep 4s ease-in-out 1.4s infinite}
  .mo-press{transition:transform .35s var(--mo-spring),box-shadow .3s,background-color .3s,color .3s}
  .mo-press:active{transform:scale(.95)}
  .mo-lift{transition:transform .35s var(--mo-spring),box-shadow .35s}
  .mo-lift:hover{transform:translateY(-3px)}
  .mo-zoom img{transition:transform .9s var(--mo-ease)}
  .mo-zoom:hover img{transform:scale(1.07)}
  .mo-arrow{transition:transform .35s var(--mo-spring)}
  a:hover>.mo-arrow,button:hover>.mo-arrow{transform:translateX(4px)}

  [data-motion=on] [data-reveal]{transition:opacity .8s var(--mo-ease),transform .8s var(--mo-ease),clip-path 1s var(--mo-ease),filter .8s var(--mo-ease);transition-delay:calc(min(var(--i,0),8) * 70ms)}
  [data-motion=on] [data-reveal]:not([data-shown]){opacity:0;transform:translateY(30px)}
  [data-motion=on] [data-reveal=pop]:not([data-shown]){transform:translateY(14px) scale(.8)}
  [data-motion=on] [data-reveal=left]:not([data-shown]){transform:translateX(-26px)}
  [data-motion=on] [data-reveal=blur]:not([data-shown]){filter:blur(10px);transform:translateY(18px)}
  [data-motion=on] [data-reveal=clip]:not([data-shown]){opacity:1;transform:none;clip-path:inset(16% 16% 16% 16% round 18px)}
  [data-motion=on] [data-reveal=clip] img{transition:transform 1.3s var(--mo-ease)}
  [data-motion=on] [data-reveal=clip]:not([data-shown]) img{transform:scale(1.35)}
  .mo-rule{transition:transform 1.1s var(--mo-ease) .25s;transform-origin:left}
  [data-motion=on] [data-reveal]:not([data-shown]) .mo-rule{transform:scaleX(0)}

  .mo-lively .mo-parallax{transform:translate3d(0,calc(var(--mo-hero,0) * 120px),0) scale(calc(1 + var(--mo-hero,0) * .14))}
  .mo-lively .mo-hero-content{transform:translate3d(0,calc(var(--mo-hero,0) * -40px),0);opacity:calc(1 - var(--mo-hero,0) * .9)}
  .mo-lively .mo-prod{transform:scale(calc(1 - var(--d,0) * .09));opacity:calc(1 - var(--d,0) * .35)}
  .mo-lively [data-shown] .mo-peek{animation:mo-peek 1.8s var(--mo-ease) .6s 1 both}

  .mo-tilt{transition:transform .6s var(--mo-ease)}
  .mo-tilt[data-tilting]{transition:transform .1s linear}
  .mo-flip{transition:transform 1s cubic-bezier(.3,1.35,.5,1)}
  .mo-collapse{transition:grid-template-rows .5s var(--mo-ease)}
  .mo-plus{transition:transform .45s var(--mo-spring)}
  .mo-dial-item{transition:transform .5s var(--mo-spring),opacity .3s ease;transition-delay:calc(var(--i,0) * 45ms)}
  .mo-dial-item[data-closed]{transition-delay:0s}
  .mo-dock{animation:mo-dock .7s var(--mo-spring) .8s both}
  .mo-fab-ring{animation:mo-fab-ring 2.2s ease-out 1.6s 3}
  .mo-burst>span{animation:mo-burst .8s var(--mo-ease) forwards}
  .mo-pop-in{animation:mo-pop .5s var(--mo-spring) both}
  .mo-bar{transition:transform .5s var(--mo-ease),opacity .4s}
}

@keyframes mo-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes mo-word{from{opacity:0;transform:translateY(.6em) rotate(4deg);filter:blur(8px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes mo-pop{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:scale(1)}}
@keyframes mo-spin{to{transform:rotate(360deg)}}
@keyframes mo-drift{0%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(16%,12%,0) scale(1.18)}100%{transform:translate3d(-12%,6%,0) scale(.92)}}
@keyframes mo-ping{75%,100%{transform:scale(2.6);opacity:0}}
@keyframes mo-sweep{0%{transform:translateX(-120%)}55%,100%{transform:translateX(120%)}}
@keyframes mo-peek{0%{transform:rotateY(0)}35%{transform:rotateY(-24deg) rotateX(4deg)}70%{transform:rotateY(9deg)}100%{transform:rotateY(0)}}
@keyframes mo-dock{from{opacity:0;transform:translateY(40px) scale(.6)}to{opacity:1;transform:none}}
@keyframes mo-fab-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.9);opacity:0}}
@keyframes mo-burst{0%{transform:rotate(var(--a)) translateY(0) scale(1);opacity:1}100%{transform:rotate(var(--a)) translateY(-52px) scale(.2);opacity:0}}
`;
