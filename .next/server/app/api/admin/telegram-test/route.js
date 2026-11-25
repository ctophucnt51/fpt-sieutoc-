"use strict";(()=>{var e={};e.id=6943,e.ids=[6943],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},594:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>l,patchFetch:()=>b,requestAsyncStorage:()=>m,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>p});var a={};n.r(a),n.d(a,{POST:()=>g});var i=n(3278),r=n(5002),o=n(4877),s=n(1309),c=n(808),h=n(4536);async function g(e){if(!(0,c.S)(e))return s.NextResponse.json({success:!1,message:"Kh\xf4ng c\xf3 quyền truy cập."},{status:401});try{let{botToken:t,chatId:n}=await e.json(),a=await (0,h.dh)(t,n);return s.NextResponse.json(a)}catch(e){return s.NextResponse.json({success:!1,message:e?.message||"Lỗi xử l\xfd y\xeau cầu"},{status:500})}}let u=new i.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/admin/telegram-test/route",pathname:"/api/admin/telegram-test",filename:"route",bundlePath:"app/api/admin/telegram-test/route"},resolvedPagePath:"/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/src/app/api/admin/telegram-test/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:p,serverHooks:d}=u,l="/api/admin/telegram-test/route";function b(){return(0,o.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:p})}},808:(e,t,n)=>{n.d(t,{C:()=>o,S:()=>r});var a=n(4770),i=n.n(a);function r(e){let t=e.cookies.get("fpt_admin_auth")?.value,n=e.headers.get("authorization")?.replace("Bearer ",""),a=function(){let e=process.env.SESSION_SECRET||"fpt_sieutoc_secret_key_2026";return i().createHmac("sha256",e).update("admin_authenticated").digest("hex")}();return t===a||n===a}let o=r},4536:(e,t,n)=>{n.d(t,{dh:()=>o,s7:()=>s,tk:()=>r});var a=n(1404);function i(){try{let e=(0,a.MJ)().telegram||{},t=e.botToken||process.env.TELEGRAM_BOT_TOKEN||"",n=e.chatId||process.env.TELEGRAM_CHAT_ID||"",i="boolean"!=typeof e.enabled||e.enabled;return{botToken:t.trim(),chatId:n.trim(),enabled:i}}catch{return{botToken:process.env.TELEGRAM_BOT_TOKEN||"",chatId:process.env.TELEGRAM_CHAT_ID||"",enabled:!0}}}async function r(e){let{botToken:t,chatId:n,enabled:a}=i();if(!a)return{success:!1,message:"Th\xf4ng b\xe1o Telegram đang tắt trong cấu h\xecnh."};if(!t||!n)return{success:!1,message:"Chưa cấu h\xecnh Telegram Bot Token hoặc Chat ID."};let r=new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",hour12:!1}),o=[e.address,e.area].filter(Boolean).join(", ")||"Chưa cung cấp",s=`
🔔 <b>C\xd3 ĐƠN ĐĂNG K\xdd LẮP MẠNG FPT MỚI!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Kh\xe1ch h\xe0ng:</b> ${c(e.fullName||"Kh\xe1ch h\xe0ng")}
📞 <b>Số điện thoại:</b> <a href="tel:${e.phone}">${e.phone}</a>
📍 <b>Địa chỉ:</b> ${c(o)}
📦 <b>G\xf3i quan t\xe2m:</b> ${c(e.packageInterested||"Chưa chọn g\xf3i")}
${e.note?`📝 <b>Ghi ch\xfa:</b> ${c(e.note)}
`:""}⏰ <b>Thời gian:</b> ${r}
🌐 <b>Trang tiếp nhận:</b> ${c(e.landingPage||"/")} (${c(e.leadLocation||"form")})
${e.utmTerm?`🔍 <b>Từ kh\xf3a t\xecm kiếm:</b> <code>${c(e.utmTerm)}</code>
`:""}${e.utmSource?`🎯 <b>Nguồn truy cập:</b> ${c(e.utmSource)} ${e.utmMedium?`(${c(e.utmMedium)})`:""} ${e.utmCampaign?`- ${c(e.utmCampaign)}`:""}
`:""}${e.gclid?`🔗 <b>Google Ads:</b> Kh\xe1ch từ quảng c\xe1o Google Search
`:""}━━━━━━━━━━━━━━━━━━
<i>Hệ thống tự động tiếp nhận từ gofpt.vn</i>
`.trim();try{let e=await fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:n,text:s,parse_mode:"HTML",disable_web_page_preview:!0}),signal:AbortSignal.timeout(8e3)}),a=await e.json();if(!e.ok||!a.ok)return console.warn("Telegram sendMessage error:",a),{success:!1,message:a.description||"Lỗi gửi Telegram Bot API"};return{success:!0}}catch(e){return console.error("sendTelegramNotification exception:",e),{success:!1,message:e?.message||"Lỗi kết nối tới Telegram API"}}}async function o(e,t){if(!e.trim()||!t.trim())return{success:!1,message:"Vui l\xf2ng nhập đầy đủ Bot Token v\xe0 Chat ID!"};let n=`
✅ <b>KẾT NỐI TELEGRAM BOT TH\xc0NH C\xd4NG!</b>
━━━━━━━━━━━━━━━━━━
Hệ thống tiếp nhận th\xf4ng b\xe1o đơn h\xe0ng của <b>gofpt.vn</b> đ\xe3 kết nối th\xe0nh c\xf4ng với Bot Telegram của bạn.
⏰ <b>Thời gian kiểm tra:</b> ${new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"})}
━━━━━━━━━━━━━━━━━━
<i>Khi kh\xe1ch h\xe0ng điền form, th\xf4ng tin sẽ được gửi tức th\xec v\xe0o nh\xf3m/k\xeanh n\xe0y!</i>
`.trim();try{let a=await fetch(`https://api.telegram.org/bot${e.trim()}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:t.trim(),text:n,parse_mode:"HTML"}),signal:AbortSignal.timeout(8e3)}),i=await a.json();if(a.ok&&i.ok)return{success:!0,message:"Đ\xe3 gửi tin nhắn thử nghiệm th\xe0nh c\xf4ng v\xe0o Telegram!"};return{success:!1,message:`Telegram b\xe1o lỗi: ${i.description||"Token hoặc Chat ID kh\xf4ng ch\xednh x\xe1c"}`}}catch(e){return{success:!1,message:`Kh\xf4ng thể kết nối Telegram API: ${e?.message||"Timeout hoặc lỗi mạng"}`}}}async function s(e){let{botToken:t,chatId:n,enabled:a}=i();if(!a||!t||!n)return!1;let r=new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",hour12:!1}),o=e.keywords.length>0?e.keywords.join(", "):"Kh\xf4ng r\xf5",s=`
🚨 <b>CẢNH B\xc1O NGHI VẤN CLICK TẶC GOOGLE ADS!</b>
━━━━━━━━━━━━━━━━━━
🌐 <b>IP nghi vấn:</b> <code>${c(e.ip)}</code>
📍 <b>Vị tr\xed:</b> ${c(e.location||"Kh\xf4ng x\xe1c định")}
🔁 <b>Tần suất:</b> ${e.totalAdsClicks} lượt truy cập Ads (${e.uniqueGclids>0?`${e.uniqueGclids} m\xe3 GCLID`:"c\xf9ng phi\xean/lặp"})
🔍 <b>Từ kh\xf3a:</b> <code>${c(o)}</code>
${e.campaign?`🎯 <b>Chiến dịch:</b> ${c(e.campaign)}
`:""}📱 <b>Thiết bị:</b> ${c(e.device)}
⏰ <b>Thời gian:</b> ${r}
━━━━━━━━━━━━━━━━━━
👉 <i>H\xe3y copy IP <code>${c(e.ip)}</code> đưa v\xe0o mục <b>Loại trừ IP</b> tr\xean Google Ads hoặc kiểm tra tại https://gofpt.vn/admin</i>
`.trim();try{return(await fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:n,text:s,parse_mode:"HTML",disable_web_page_preview:!0}),signal:AbortSignal.timeout(6e3)})).ok}catch{return!1}}function c(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),a=t.X(0,[9379,4833,1404],()=>n(594));module.exports=a})();