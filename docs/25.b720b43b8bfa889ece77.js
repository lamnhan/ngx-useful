(self.webpackChunk_lamnhan_ngx_useful=self.webpackChunk_lamnhan_ngx_useful||[]).push([[25],{1025:(n,e,t)=>{"use strict";t.r(e),t.d(e,{HomePageModule:()=>M});var o=t(1116),g=t(3486),a=t(3651),c=t(3206),i=t(8619),r=t(9315);const s=function(){return["guides"]},p=function(){return["services"]},m=function(){return["pipes"]},l=function(){return["directives"]},u=function(){return["guards"]},_=[{path:"",component:(()=>{class n{constructor(){this.installContent="Using NPM:\n```sh\nnpm install --save @lamnhan/ngx-useful@0.0.10\n```\n\nYou may also [@lamnhan/unistylus](https://unistylus.lamnhan.com) (for theming):\n```sh\nnpm install --save @lamnhan/unistylus@0.0.10\n```\n",this.usageContent="Three steps to use a service:\n```ts\n// 1. provide services in ---\x3e app.module.ts\n{ ..., providers: [AppService], ... }\n\n// 2. init services in ---\x3e app.component.ts\nthis.appService.init(...);\n\n// 3. inject where needed\nconstructor(private appService: AppService) {}\n```"}ngOnInit(){}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=i.Xpm({type:n,selectors:[["app-home-page"]],decls:99,vars:14,consts:[[1,"home-page"],[1,"heading"],[1,"image"],["src","/assets/images/featured.jpg","alt","Angular Useful"],[1,"text"],[1,"cta"],[1,"button-primary-xl",3,"usefulRouterLink"],["href","https://github.com/lamnhan/ngx-useful","target","_blank",1,"source-code","button-outline-medium-xl"],[1,"icon","icon-github"],[1,"features"],[1,"title"],[1,"content"],[1,"simple"],[1,"thumbnail"],["src","https://img.icons8.com/fluent/96/000000/flower.png"],[1,"truncate"],[1,"theming"],["src","https://img.icons8.com/fluent/96/000000/color-palette.png"],[1,"i18n"],["src","https://img.icons8.com/fluent/96/000000/language.png"],[1,"persona"],["src","https://img.icons8.com/fluent/96/000000/themes.png"],[1,"splashscreen"],["src","https://img.icons8.com/fluent/96/000000/wallpaper.png"],[1,"database"],["src","https://img.icons8.com/fluent/96/000000/database.png"],[1,"getting-started"],[1,"head"],[1,"body"],[3,"content"],[3,"usefulRouterLink"]],template:function(n,e){1&n&&(i.TgZ(0,"div",0),i.TgZ(1,"section",1),i.TgZ(2,"div",2),i._UZ(3,"img",3),i.qZA(),i.TgZ(4,"div",4),i.TgZ(5,"h1"),i._uU(6,"Angular Useful"),i.qZA(),i.TgZ(7,"p"),i._uU(8,"A collection of Angular useful services, pipes, ..."),i.qZA(),i.qZA(),i.TgZ(9,"div",5),i.TgZ(10,"a",6),i._uU(11,"Use it now!"),i.qZA(),i.TgZ(12,"a",7),i._UZ(13,"i",8),i.TgZ(14,"span"),i._uU(15,"Source code"),i.qZA(),i.qZA(),i.qZA(),i.qZA(),i.TgZ(16,"section",9),i.TgZ(17,"div",10),i._uU(18,"Why?"),i.qZA(),i.TgZ(19,"ul",11),i.TgZ(20,"li",12),i.TgZ(21,"div",13),i._UZ(22,"img",14),i.qZA(),i.TgZ(23,"div",4),i.TgZ(24,"h3"),i._uU(25,"Simple"),i.qZA(),i.TgZ(26,"p",15),i._uU(27,"Conventional project structure"),i.qZA(),i.qZA(),i.qZA(),i.TgZ(28,"li",16),i.TgZ(29,"div",13),i._UZ(30,"img",17),i.qZA(),i.TgZ(31,"div",4),i.TgZ(32,"h3"),i._uU(33,"Theming"),i.qZA(),i.TgZ(34,"p",15),i._uU(35,"Multiple themes"),i.qZA(),i.qZA(),i.qZA(),i.TgZ(36,"li",18),i.TgZ(37,"div",13),i._UZ(38,"img",19),i.qZA(),i.TgZ(39,"div",4),i.TgZ(40,"h3"),i._uU(41,"I18N"),i.qZA(),i.TgZ(42,"p",15),i._uU(43,"Template, URL and content localization."),i.qZA(),i.qZA(),i.qZA(),i.TgZ(44,"li",20),i.TgZ(45,"div",13),i._UZ(46,"img",21),i.qZA(),i.TgZ(47,"div",4),i.TgZ(48,"h3"),i._uU(49,"Persona"),i.qZA(),i.TgZ(50,"p",15),i._uU(51,"Monoapp with multiple personas."),i.qZA(),i.qZA(),i.qZA(),i.TgZ(52,"li",22),i.TgZ(53,"div",13),i._UZ(54,"img",23),i.qZA(),i.TgZ(55,"div",4),i.TgZ(56,"h3"),i._uU(57,"Splash screen"),i.qZA(),i.TgZ(58,"p",15),i._uU(59,"In-app loading screen."),i.qZA(),i.qZA(),i.qZA(),i.TgZ(60,"li",24),i.TgZ(61,"div",13),i._UZ(62,"img",25),i.qZA(),i.TgZ(63,"div",4),i.TgZ(64,"h3"),i._uU(65,"Database"),i.qZA(),i.TgZ(66,"p",15),i._uU(67,"Database and state management."),i.qZA(),i.qZA(),i.qZA(),i.qZA(),i.qZA(),i.TgZ(68,"section",26),i.TgZ(69,"div",10),i._uU(70,"How?"),i.qZA(),i.TgZ(71,"ul",11),i.TgZ(72,"li"),i.TgZ(73,"div",27),i._uU(74,"Installation"),i.qZA(),i.TgZ(75,"div",28),i._UZ(76,"app-content",29),i.qZA(),i.qZA(),i.TgZ(77,"li"),i.TgZ(78,"div",27),i._uU(79,"Basic usage"),i.qZA(),i.TgZ(80,"div",28),i._UZ(81,"app-content",29),i.TgZ(82,"p"),i._uU(83,"See "),i.TgZ(84,"a",30),i._uU(85,"guides"),i.qZA(),i._uU(86," for more articles. Also see the list of: "),i.TgZ(87,"a",30),i._uU(88,"services"),i.qZA(),i._uU(89,", "),i.TgZ(90,"a",30),i._uU(91,"pipes"),i.qZA(),i._uU(92,", "),i.TgZ(93,"a",30),i._uU(94,"directives"),i.qZA(),i._uU(95,", "),i.TgZ(96,"a",30),i._uU(97,"guards"),i.qZA(),i._uU(98,"."),i.qZA(),i.qZA(),i.qZA(),i.qZA(),i.qZA(),i.qZA()),2&n&&(i.xp6(10),i.Q6J("usefulRouterLink",i.DdM(8,s)),i.xp6(66),i.Q6J("content",e.installContent),i.xp6(5),i.Q6J("content",e.usageContent),i.xp6(3),i.Q6J("usefulRouterLink",i.DdM(9,s)),i.xp6(3),i.Q6J("usefulRouterLink",i.DdM(10,p)),i.xp6(3),i.Q6J("usefulRouterLink",i.DdM(11,m)),i.xp6(3),i.Q6J("usefulRouterLink",i.DdM(12,l)),i.xp6(3),i.Q6J("usefulRouterLink",i.DdM(13,u)))},directives:[g.jY,r.S],styles:['.home-page[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-family:var(--app-font-head);font-size:1.5rem;font-weight:700;text-transform:uppercase;padding-bottom:.5rem;display:flex;flex-wrap:nowrap;align-items:center}.home-page[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]:before{display:block;content:"";width:7rem;height:1.7rem;margin-right:2rem;background:var(--app-color-medium)}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]{margin-bottom:4rem;padding-bottom:4rem;background:var(--app-color-background-shade);border-bottom:.25rem solid var(--app-color-medium)}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .image[_ngcontent-%COMP%], .home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]{margin-top:2rem;padding:0 1rem}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:4rem;font-weight:700}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:2rem;color:var(--app-color-medium)}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .cta[_ngcontent-%COMP%]{padding:1rem;display:flex;flex-wrap:wrap;align-items:center}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .cta[_ngcontent-%COMP%]   a.source-code[_ngcontent-%COMP%]{display:flex;align-items:center;margin-top:1rem}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .cta[_ngcontent-%COMP%]   a.source-code[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]{opacity:.5}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .cta[_ngcontent-%COMP%]   a.source-code[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{margin-left:1rem}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]{padding:1rem}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]:before{background:var(--app-gradient-success)}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]{list-style:none;padding:0;margin:2rem 0 0;display:flex;flex-wrap:wrap}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{width:100%;display:flex;flex-wrap:nowrap;align-items:center;padding:1rem}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .thumbnail[_ngcontent-%COMP%]{width:5rem;height:5rem;padding:1rem;border-radius:100%;background:var(--app-color-background-shade)}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .thumbnail[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]{flex:1;max-width:calc(100% - 7rem);margin-left:2rem}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.5rem}.home-page[_ngcontent-%COMP%]   .getting-started[_ngcontent-%COMP%]{padding:1rem;margin-top:2rem}.home-page[_ngcontent-%COMP%]   .getting-started[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]:before{background:var(--app-gradient-secondary)}.home-page[_ngcontent-%COMP%]   .getting-started[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]{list-style:none;padding:0;margin:2rem 0 0;display:flex;flex-wrap:wrap}.home-page[_ngcontent-%COMP%]   .getting-started[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{width:100%;margin-bottom:2rem;border:1px solid var(--app-color-foreground)}.home-page[_ngcontent-%COMP%]   .getting-started[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .head[_ngcontent-%COMP%]{padding:.5rem 1rem;background:var(--app-color-foreground);color:var(--app-color-background)}.home-page[_ngcontent-%COMP%]   .getting-started[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]{padding:1rem}@media only screen and (min-width:480px){.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:5rem}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .cta[_ngcontent-%COMP%]{flex-wrap:nowrap}.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .cta[_ngcontent-%COMP%]   a.source-code[_ngcontent-%COMP%]{margin-top:0;margin-left:1rem}}@media only screen and (min-width:576px){.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:6rem}}@media only screen and (min-width:768px){.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:7rem}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]{margin-left:-1rem}.home-page[_ngcontent-%COMP%]   .features[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{width:calc(50% - 2rem);margin-left:1rem}}@media only screen and (min-width:992px){.home-page[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]   .text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:8rem}.home-page[_ngcontent-%COMP%]   .getting-started[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]{margin-left:-1rem}.home-page[_ngcontent-%COMP%]   .getting-started[_ngcontent-%COMP%]   ul.content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{width:calc(50% - 2rem);margin-left:1rem}}']}),n})()}];let d=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=i.oAB({type:n}),n.\u0275inj=i.cJS({imports:[[c.Bz.forChild(_)],c.Bz]}),n})(),M=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=i.oAB({type:n}),n.\u0275inj=i.cJS({imports:[[o.ez,g.Pf,a.Y,d]]}),n})()}}]);