(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{318:function(e,t,r){"use strict";r.r(t);var n=r(0),o=(r(44),r(25),{layout:"page",name:"App",transition:{name:"page"},components:{},data:function(){return{foldername:"",corsproxy:"",secret:""}},computed:{currentFolder:function(){return this.$route.query.folder||""},currentFile:function(){return this.$store.state.player.currentFile},loginStatus:function(){return this.$store.state.app.loginStatus},server:function(){return this.$store.state.app.server},current:function(){return this.$store.state.player.current},folder:function(){return this.$store.state.app.folder},group:function(){return this.$store.state.app.group},rightbar:function(){return this.$store.state.app.rightbar},collections:function(){return this.$store.state.app.collections},currentCollection:function(){return this.$store.state.app.currentCollection},loginsecret:function(){return this.$store.state.app.loginsecret},player:function(){return this.$store.state.player.player},seek:function(){return this.$store.state.app.book.seek},playing:function(){return this.$store.state.player.playing},hash:function(){return this.$store.getters["app/hash"](this.$route.fullPath)}},watch:{$route:{handler:function(e,t){console.log("watch route triggered"),e!==t&&(e.query.collection>0?this.$store.commit("app/currentCollection",e.query.collection):this.$store.commit("app/currentCollection",0),e.query.folder?this.$store.dispatch("app/fetchFolder",e.query.folder):this.$store.dispatch("app/fetchFolder"))},immediate:!0},currentCollection:function(e,t){var r=this;return Object(n.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e===t){n.next=4;break}return console.log("collection changed"),n.next=4,r.$store.dispatch("app/selectFolder",{});case 4:case"end":return n.stop()}}),n)})))()},folder:{handler:function(e,t){var r=this;return Object(n.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(e.files.length>0)){t.next=5;break}return r.$store.commit("app/rightbar",!0),t.next=4,r.$store.dispatch("app/getBookDetails",r.hash);case 4:r.$store.dispatch("player/getCurrentFile",{files:r.folder.files,seek:r.$store.state.app.book.seek});case 5:case"end":return t.stop()}}),t)})))()},immediate:!0}},mounted:function(){this.$store.commit("app/activepage","library")},methods:{selectFile:function(e){var t=this;return Object(n.a)(regeneratorRuntime.mark((function r(){var n,o,data;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(e!==t.currentFile.index){r.next=8;break}if(!t.playing){r.next=5;break}return r.abrupt("return",t.$store.commit("app/player",!0));case 5:return r.next=7,t.$store.dispatch("player/load");case 7:return r.abrupt("return",t.player.play());case 8:return n=0,e>0&&(o=t.folder.files.slice(0,e),n=t.$store.getters["player/getStart"](o)),data={duration:t.folder.files[e].meta.duration,index:e,path:t.folder.files[e].path,start:n},t.$store.commit("player/currentFile",data),r.next=14,t.$store.dispatch("player/load",{file:t.folder.files[e].path,seek:0});case 14:t.player.play();case 15:case"end":return r.stop()}}),r)})))()},updateServer:function(input){this.$store.commit("app/server",input)}}}),l=r(6),component=Object(l.a)(o,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"p-16 lg:p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto lg:mr-4"},[e.folder&&e.folder.subfolders&&e.folder.subfolders.length>0?r("div",[r("BreadCrumbs"),e._v(" "),r("div",{staticClass:"my-6 text-xl font-bold"},[e._v("\n      Folders\n    ")]),e._v(" "),e._l(e.folder.subfolders,(function(t,n){return r("div",{key:n,staticClass:"bg-gray-50 dark:bg-gray-840 filter drop-shadow dark:drop-shadow-none dark:border-gray-860 dark:border rounded-lg my-2 w-full flex max-w-xl items-center cursor-pointer",on:{click:function(r){return e.$store.dispatch("app/selectFolder",t)}}},[e._m(0,!0),e._v(" "),r("div",{staticClass:"px-5 py-2"},[r("span",{staticClass:"text-sm font-medium"},[e._v(e._s(t.name))])])])}))],2):e._e(),e._v(" "),e.folder&&e.folder.files&&e.folder.files.length>0?r("div",[r("BreadCrumbs"),e._v(" "),r("div",{staticClass:"my-6 text-xl font-bold"},[e._v("\n      Files\n    ")]),e._v(" "),e._l(e.folder.files,(function(t,n){return r("div",{key:n,staticClass:"bg-gray-50 dark:bg-gray-840 min-h-[3.5rem] filter drop-shadow dark:drop-shadow-none dark:border-gray-860 dark:border rounded-lg hover:opacity-80 my-2 w-full flex max-w-xl items-center cursor-pointer",class:{"opacity-50":(e.seek>0||e.current>0||e.currentFile.index>0)&&e.currentFile.index!==n},on:{click:function(t){return e.selectFile(n)}}},[r("div",{staticClass:"p-4 flex self-stretch items-center text-gray-50 bg-blue-500 rounded-l-lg"},[r("svg",{staticClass:"svg-inline--fa fa-fw fa-book fa-lg",attrs:{"aria-hidden":"true",focusable:"false","data-prefix":"fal","data-icon":"book",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 448 512"}},[r("path",{attrs:{fill:"currentColor",d:"M448 368v-320C448 21.49 426.5 0 400 0h-320C35.82 0 0 35.82 0 80V448c0 35.35 28.65 64 64 64h368c8.844 0 16-7.156 16-16S440.8 480 432 480H416v-66.95C434.6 406.4 448 388.8 448 368zM32 80C32 53.49 53.49 32 80 32H96v352H64c-11.71 0-22.55 3.389-32 8.9V80zM384 480H64c-17.64 0-32-14.36-32-32s14.36-32 32-32h320V480zM400 384H128V32h272C408.8 32 416 39.17 416 48v320C416 376.8 408.8 384 400 384zM352 128H192C183.2 128 176 135.2 176 144S183.2 160 192 160h160c8.844 0 16-7.156 16-16S360.8 128 352 128zM352 224H192C183.2 224 176 231.2 176 240S183.2 256 192 256h160c8.844 0 16-7.156 16-16S360.8 224 352 224z"}})])]),e._v(" "),r("div",{staticClass:"flex justify-between w-full items-center"},[r("div",{staticClass:"px-5 py-2 flex flex-col"},[r("span",{staticClass:"text-sm font-medium"},[e._v(e._s(t.name))]),e._v(" "),r("span",{staticClass:"text-xs text-gray-500"},[r("span",{staticClass:"font-normal"},[e._v("Duration:")]),e._v(" "),r("span",{},[e._v(e._s(e.$formatToTime(t.meta.duration,3,!1)))]),e._v(" "),r("span",{staticClass:"ml-2 font-normal"},[e._v("Bitrate:")]),e._v(" "),r("span",{},[e._v(e._s(t.meta.bitrate))]),e._v("kbps")])]),e._v(" "),r("div",{staticClass:"px-4"},[r("div",{staticClass:"w-4 h-4 rounded-full",class:[!0===t.isCached?"bg-green-400":"bg-gray-200 dark:bg-gray-800"]})])])])}))],2):e._e()])}),[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"p-4 flex self-stretch text-gray-50 bg-pink-600 rounded-l-lg items-center"},[t("i",{staticClass:"fa-light fa-fw fa-folder fa-lg"})])}],!1,null,null,null);t.default=component.exports;installComponents(component,{BreadCrumbs:r(204).default})}}]);