"use strict";(()=>{var e={};e.id=6943,e.ids=[6943],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},594:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>b,patchFetch:()=>d,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>l});var i={};n.r(i),n.d(i,{POST:()=>g});var a=n(3278),o=n(5002),r=n(4877),s=n(1309),c=n(808),h=n(4536);async function g(e){if(!(0,c.S)(e))return s.NextResponse.json({success:!1,message:"Kh\xf4ng c\xf3 quyền truy cập."},{status:401});try{let{botToken:t,chatId:n}=await e.json(),i=await (0,h.dh)(t,n);return s.NextResponse.json(i)}catch(e){return s.NextResponse.json({success:!1,message:e?.message||"Lỗi xử l\xfd y\xeau cầu"},{status:500})}}let p=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/telegram-test/route",pathname:"/api/admin/telegram-test",filename:"route",bundlePath:"app/api/admin/telegram-test/route"},resolvedPagePath:"/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/src/app/api/admin/telegram-test/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:l,serverHooks:m}=p,b="/api/admin/telegram-test/route";function d(){return(0,r.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:l})}},808:(e,t,n)=>{n.d(t,{C:()=>r,S:()=>o});var i=n(4770),a=n.n(i);function o(e){let t=e.cookies.get("fpt_admin_auth")?.value,n=e.headers.get("authorization")?.replace("Bearer ",""),i=function(){let e=process.env.SESSION_SECRET||"fpt_sieutoc_secret_key_2026";return a().createHmac("sha256",e).update("admin_authenticated").digest("hex")}();return t===i||n===i}let r=o},4536:(e,t,n)=>{n.d(t,{Db:()=>c,Hw:()=>h,dh:()=>r,s7:()=>s,tk:()=>o});var i=n(1404);function a(){try{let e=(0,i.MJ)().telegram||{},t=e.botToken||process.env.TELEGRAM_BOT_TOKEN||"",n=e.chatId||process.env.TELEGRAM_CHAT_ID||"",a="boolean"!=typeof e.enabled||e.enabled;return{botToken:t.trim(),chatId:n.trim(),enabled:a}}catch{return{botToken:process.env.TELEGRAM_BOT_TOKEN||"",chatId:process.env.TELEGRAM_CHAT_ID||"",enabled:!0}}}async function o(e){let{botToken:t,chatId:n,enabled:i}=a();if(!i)return{success:!1,message:"Th\xf4ng b\xe1o Telegram đang tắt trong cấu h\xecnh."};if(!t||!n)return{success:!1,message:"Chưa cấu h\xecnh Telegram Bot Token hoặc Chat ID."};let o=new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",hour12:!1}),r=[e.address,e.area].filter(Boolean).join(", ")||"Chưa cung cấp",s=`
🔔 <b>C\xd3 ĐƠN ĐĂNG K\xdd LẮP MẠNG FPT MỚI!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Kh\xe1ch h\xe0ng:</b> ${g(e.fullName||"Kh\xe1ch h\xe0ng")}
📞 <b>Số điện thoại:</b> <a href="tel:${e.phone}">${e.phone}</a>
📍 <b>Địa chỉ:</b> ${g(r)}
📦 <b>G\xf3i quan t\xe2m:</b> ${g(e.packageInterested||"Chưa chọn g\xf3i")}
${e.note?`📝 <b>Ghi ch\xfa:</b> ${g(e.note)}
`:""}⏰ <b>Thời gian:</b> ${o}
🌐 <b>Trang tiếp nhận:</b> ${g(e.landingPage||"/")} (${g(e.leadLocation||"form")})
${e.utmTerm?`🔍 <b>Từ kh\xf3a t\xecm kiếm:</b> <code>${g(e.utmTerm)}</code>
`:""}${e.utmSource?`🎯 <b>Nguồn truy cập:</b> ${g(e.utmSource)} ${e.utmMedium?`(${g(e.utmMedium)})`:""} ${e.utmCampaign?`- ${g(e.utmCampaign)}`:""}
`:""}${e.gclid?`🔗 <b>Google Ads:</b> Kh\xe1ch từ quảng c\xe1o Google Search
`:""}━━━━━━━━━━━━━━━━━━
<i>Hệ thống tự động tiếp nhận từ gofpt.vn</i>
`.trim();try{let e=await fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:n,text:s,parse_mode:"HTML",disable_web_page_preview:!0}),signal:AbortSignal.timeout(8e3)}),i=await e.json();if(!e.ok||!i.ok)return console.warn("Telegram sendMessage error:",i),{success:!1,message:i.description||"Lỗi gửi Telegram Bot API"};return{success:!0}}catch(e){return console.error("sendTelegramNotification exception:",e),{success:!1,message:e?.message||"Lỗi kết nối tới Telegram API"}}}async function r(e,t){if(!e.trim()||!t.trim())return{success:!1,message:"Vui l\xf2ng nhập đầy đủ Bot Token v\xe0 Chat ID!"};let n=`
✅ <b>KẾT NỐI TELEGRAM BOT TH\xc0NH C\xd4NG!</b>
━━━━━━━━━━━━━━━━━━
Hệ thống tiếp nhận th\xf4ng b\xe1o đơn h\xe0ng của <b>gofpt.vn</b> đ\xe3 kết nối th\xe0nh c\xf4ng với Bot Telegram của bạn.
⏰ <b>Thời gian kiểm tra:</b> ${new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"})}
━━━━━━━━━━━━━━━━━━
<i>Khi kh\xe1ch h\xe0ng điền form, th\xf4ng tin sẽ được gửi tức th\xec v\xe0o nh\xf3m/k\xeanh n\xe0y!</i>
`.trim();try{let i=await fetch(`https://api.telegram.org/bot${e.trim()}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:t.trim(),text:n,parse_mode:"HTML"}),signal:AbortSignal.timeout(8e3)}),a=await i.json();if(i.ok&&a.ok)return{success:!0,message:"Đ\xe3 gửi tin nhắn thử nghiệm th\xe0nh c\xf4ng v\xe0o Telegram!"};return{success:!1,message:`Telegram b\xe1o lỗi: ${a.description||"Token hoặc Chat ID kh\xf4ng ch\xednh x\xe1c"}`}}catch(e){return{success:!1,message:`Kh\xf4ng thể kết nối Telegram API: ${e?.message||"Timeout hoặc lỗi mạng"}`}}}async function s(e){let{botToken:t,chatId:n,enabled:i}=a();if(!i||!t||!n)return!1;let o=new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",hour12:!1}),r=e.keywords.length>0?e.keywords.join(", "):"Kh\xf4ng r\xf5",s=`
🚨 <b>CẢNH B\xc1O NGHI VẤN CLICK TẶC GOOGLE ADS!</b>
━━━━━━━━━━━━━━━━━━
🌐 <b>IP nghi vấn:</b> <code>${g(e.ip)}</code>
📍 <b>Vị tr\xed:</b> ${g(e.location||"Kh\xf4ng x\xe1c định")}
🔁 <b>Tần suất:</b> ${e.totalAdsClicks} lượt truy cập Ads (${e.uniqueGclids>0?`${e.uniqueGclids} m\xe3 GCLID`:"c\xf9ng phi\xean/lặp"})
🔍 <b>Từ kh\xf3a:</b> <code>${g(r)}</code>
${e.campaign?`🎯 <b>Chiến dịch:</b> ${g(e.campaign)}
`:""}📱 <b>Thiết bị:</b> ${g(e.device)}
⏰ <b>Thời gian:</b> ${o}
━━━━━━━━━━━━━━━━━━
👉 <i>H\xe3y copy IP <code>${g(e.ip)}</code> đưa v\xe0o mục <b>Loại trừ IP</b> tr\xean Google Ads hoặc kiểm tra tại https://gofpt.vn/admin</i>
`.trim();try{return(await fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:n,text:s,parse_mode:"HTML",disable_web_page_preview:!0}),signal:AbortSignal.timeout(6e3)})).ok}catch{return!1}}async function c(e){let{botToken:t,chatId:n,enabled:i}=a();if(!i||!t||!n)return!1;let o=new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",hour12:!1}),r=void 0!==e.totalClicks||void 0!==e.totalImpressions?`📊 <b>GSC:</b> ${e.totalClicks??0} Clicks | ${e.totalImpressions??0} Hiển thị${e.avgPosition?` | Top TB: ${e.avgPosition.toFixed(1)}`:""}
`:"",s=e.highlights.length>0?`📌 <b>Điểm nổi bật:</b>
${e.highlights.map(e=>`• ${g(e)}`).join("\n")}
`:"",c=e.actionItems&&e.actionItems.length>0?`🚀 <b>Đề xuất tối ưu:</b>
${e.actionItems.map(e=>`→ ${g(e)}`).join("\n")}
`:"",h=`
📈 <b>B\xc1O C\xc1O HỆ THỐNG AUTO-SEO (GOFPT.VN)</b>
━━━━━━━━━━━━━━━━━━
🏷️ <b>${g(e.summaryTitle)}</b>
${r}${s}${c}⏰ <b>Thời gian:</b> ${o}
━━━━━━━━━━━━━━━━━━
<i>Tự động tổng hợp bởi Hệ thống Multi-Agent SEO</i>
`.trim();try{return(await fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:n,text:h,parse_mode:"HTML",disable_web_page_preview:!0}),signal:AbortSignal.timeout(6e3)})).ok}catch{return!1}}async function h(e){let{botToken:t,chatId:n,enabled:i}=a();if(!i||!t||!n)return!1;let o=new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",hour12:!1}),r="Google Ads"===e.source,s="mobile"===e.device?"Điện thoại (Mobile)":"M\xe1y t\xednh (Desktop)",c=`https://gofpt.vn${e.path.startsWith("/")?e.path:`/${e.path}`}`,h=e.isp&&"Kh\xf4ng x\xe1c định"!==e.isp?`🏢 <b>Nh\xe0 mạng:</b> ${g(e.isp)}${e.asn?` (<code>${g(e.asn)}</code>)`:""}${"hosting"===e.ipCategory?" • ⚠️ <b>Datacenter/Bot</b>":"proxy"===e.ipCategory?" • \uD83D\uDEE1️ <b>VPN/Proxy</b>":""}
`:"",p=[e.networkType&&"Kh\xf4ng r\xf5"!==e.networkType?e.networkType:"",e.networkDetail||""].filter(Boolean).join(" • "),u=`
${r?"\uD83C\uDFAF":"\uD83D\uDD0E"} <b>${r?"KH\xc1CH TRUY CẬP TỪ GOOGLE ADS!":"KH\xc1CH TRUY CẬP TỪ GOOGLE SEARCH!"}</b>
━━━━━━━━━━━━━━━━━━
📡 <b>Nguồn:</b> ${g(e.source)} (${g(e.sourceDetail)})
🔗 <b>Trang đ\xedch:</b> ${g(c)}
${e.term?`🔍 <b>Từ kh\xf3a:</b> <code>${g(e.term)}</code>
`:""}${e.campaign?`📣 <b>Chiến dịch:</b> ${g(e.campaign)}
`:""}${e.gclid?`🏷️ <b>GCLID:</b> <code>${g(e.gclid.slice(0,32))}${e.gclid.length>32?"...":""}</code>
`:""}📍 <b>Vị tr\xed:</b> ${g(e.location||"Kh\xf4ng x\xe1c định")}
🌐 <b>IP:</b> <code>${g(e.ip)}</code>
${h}📱 <b>Thiết bị:</b> ${g(s)} • ${g(e.browser)} / ${g(e.os)}${p?` • ${g(p)}`:""}
⏰ <b>Thời gian:</b> ${o}
━━━━━━━━━━━━━━━━━━
<i>Th\xf4ng b\xe1o tự động theo thời gian thực • gofpt.vn</i>
`.trim();try{return(await fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:n,text:u,parse_mode:"HTML",disable_web_page_preview:!0}),signal:AbortSignal.timeout(6e3)})).ok}catch{return!1}}function g(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),i=t.X(0,[9379,4833,1404],()=>n(594));module.exports=i})();