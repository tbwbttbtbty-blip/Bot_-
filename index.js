const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * 👑 سِراجُ السُّنّة - الإصدار v18.0 (الإصدار السيادي المُحسَّن)
 * -------------------------------------------
 * ✅ تم إضافة أذكار كاملة (صباح/مساء/نوم)
 * ✅ تم إضافة قراء جدد (السديس، الشريم، الحصري، المعيقلي)
 * ✅ تم تحسين الإذاعة (إرسال متقطع)
 * ✅ تم إضافة /stats, /unban, /removeadmin
 * ✅ تم إضافة أزرار إدارية موسعة
 * -------------------------------------------
 */

const bot = new Telegraf('7901718338:AAF47zdZP1z0e71xYpyIggmUt1DrSO5KPBo');
const ADMIN_ID = 7953902172; // ← غيّر لرقم حسابك

// --- [ قاعدة البيانات ] ---
const DB_PATH = './users.json';
const ADMINS_PATH = './admins.json';
const BANNED_PATH = './banned.json';
const SETTINGS_PATH = './settings.json';

// تهيئة الملفات
[DB_PATH, ADMINS_PATH, BANNED_PATH, SETTINGS_PATH].forEach(p => {
    if (!fs.existsSync(p)) {
        if (p === ADMINS_PATH) fs.writeFileSync(p, JSON.stringify([ADMIN_ID]));
        else if (p === SETTINGS_PATH) fs.writeFileSync(p, JSON.stringify({ mode: 'none' }));
        else fs.writeFileSync(p, JSON.stringify([]));
    }
});

// --- [ أسماء السور كاملة ] ---
const allSurahs = [
    "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
    "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج",
    "المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب",
    "سبأ","فاطر","يس","الصافات","ص","الزمر","غافير","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف",
    "محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة",
    "الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة",
    "المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
    "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
    "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة",
    "التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص",
    "الفلق","الناس"
];

// --- [ أذكار الصباح كاملة ] ---
const AZKAR_SUBH = 
`🌅 *أذكار الصباح*
━━━━━━━━━━━━━━━━

*1- آية الكرسي*
{اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۚ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۚ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۚ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ}
━━━━━━━━━━━━━━━━

*2- سورة الإخلاص والمعوذتين (3 مرات)*
{قُلْ هُوَ اللَّهُ أَحَدٌ..} ×3
{قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ..} ×3
{قُلْ أَعُوذُ بِرَبِّ النَّاسِ..} ×3
━━━━━━━━━━━━━━━━

*3- أصبحنا وأصبح الملك لله*
{اللهم بك أصبحنا وبك أمسينا، وبك نحيا وبك نموت، وإليك النشور}
━━━━━━━━━━━━━━━━

*4- {اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك..}*
━━━━━━━━━━━━━━━━

*5- {رضيت بالله ربا، وبالإسلام دينا، وبمحمد ﷺ نبيا}* ×3
━━━━━━━━━━━━━━━━

*6- {اللهم إني أصبحت أشهدك وأشهد حملة عرشك..}* ×4
━━━━━━━━━━━━━━━━

*7- {حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم}* ×7
━━━━━━━━━━━━━━━━

*8- {اللهم ما أصبح بي من نعمة فمنك وحدك..}*
━━━━━━━━━━━━━━━━

*9- {بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء}* ×3
━━━━━━━━━━━━━━━━

*10- {اللهم إني أسألك العفو والعافية في الدنيا والآخرة}*
━━━━━━━━━━━━━━━━

*11- {لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير}* ×10
━━━━━━━━━━━━━━━━

*12- {سبحان الله وبحمده}* ×100
━━━━━━━━━━━━━━━━

*13- {أستغفر الله وأتوب إليه}* ×100
━━━━━━━━━━━━━━━━━

جزاك الله خيرًا يا صاحب الخير 🌸`;

// --- [ أذكار المساء كاملة ] ---
const AZKAR_MASA =
`🌙 *أذكار المساء*
━━━━━━━━━━━━━━━━

*1- آية الكرسي*
{اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ..}
━━━━━━━━━━━━━━━━

*2- سورة الإخلاص والمعوذتين (3 مرات)*
{قُلْ هُوَ اللَّهُ أَحَدٌ..} ×3
{قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ..} ×3
{قُلْ أَعُوذُ بِرَبِّ النَّاسِ..} ×3
━━━━━━━━━━━━━━━━

*3- أمسينا وأمسى الملك لله*
{اللهم بك أمسينا وبك أصبحنا، وبك نحيا وبك نموت، وإليك المصير}
━━━━━━━━━━━━━━━━

*4- {اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك..}*
━━━━━━━━━━━━━━━━

*5- {اللهم إني أمسيت أشهدك وأشهد حملة عرشك..}* ×4
━━━━━━━━━━━━━━━━

*6- {أمسينا على فطرة الإسلام وكلمة الإخلاص..}*
━━━━━━━━━━━━━━━━

*7- {اللهم إني أسألك خير هذه الليلة وخير ما فيها..}*
━━━━━━━━━━━━━━━━

*8- {بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء}* ×3
━━━━━━━━━━━━━━━━

*9- {حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم}* ×7
━━━━━━━━━━━━━━━━

*10- {اللهم إني أسألك العفو والعافية في الدنيا والآخرة}*
━━━━━━━━━━━━━━━━

*11- {اللهم صل وسلم على نبينا محمد}* ×10
━━━━━━━━━━━━━━━━

*12- {لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير}* ×10
━━━━━━━━━━━━━━━━

*13- {سبحان الله}* ×33
*{الحمد لله}* ×33
*{الله أكبر}* ×33
*ثم: {لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير}*
━━━━━━━━━━━━━━━━━

حفظكم الله ورعاكم 🌸`;

// --- [ أذكار النوم ] ---
const AZKAR_NAWM =
`🌙 *أذكار النوم*
━━━━━━━━━━━━━━━━

*1- {باسمك اللهم أموت وأحيا}*
━━━━━━━━━━━━━━━━

*2- {اللهم إني أسلمت نفسي إليك، وفوضت أمري إليك..}*
━━━━━━━━━━━━━━━━

*3- سورة الإخلاص والمعوذتين* (مرة واحدة)
━━━━━━━━━━━━━━━━

*4- آية الكرسي*
━━━━━━━━━━━━━━━━

*5- {سُبْحَانَ اللَّهِ}* ×33
*{الْحَمْدُ لِلَّهِ}* ×33
*{اللَّهُ أَكْبَرُ}* ×34
━━━━━━━━━━━━━━━━

*6- {اللهم رب السماوات ورب الأرض ورب العرش العظيم..}*
━━━━━━━━━━━━━━━━

*7- {اللهم قني عذابك يوم تبعث عبادك}* ×3
━━━━━━━━━━━━━━━━

*8- {بسم الله وضعت جنبي، اللهم اغفر لي ذنبي..}*
━━━━━━━━━━━━━━━━

*9- {الحمد لله الذي أطعمنا وسقانا وكفانا وآوانا..}*
━━━━━━━━━━━━━━━━

*10- {اللهم عالم الغيب والشهادة، فاطر السموات والأرض..}*
━━━━━━━━━━━━━━━━

*11- آخر آيتين من سورة البقرة*
{آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ..}
━━━━━━━━━━━━━━━━━

نوماً هنيئاً يا صاحب الخير 🌸`;

// --- [ لوحة المفاتيح الرئيسية ] ---
const mainKeyboard = (uid) => {
    const admins = JSON.parse(fs.readFileSync(ADMINS_PATH));
    let btns = [
        ['📖 المصحف الشريف', '🎧 الاستماع للقرآن'],
        ['🌅 أذكار الصباح', '🌙 أذكار المساء'],
        ['🌜 أذكار النوم', '📜 حديث نبوي شريف']
    ];
    if (admins.includes(uid)) btns.push(['⚙️ لوحة التحكم الإدارية']);
    return Markup.keyboard(btns).resize();
};

// --- [ المحرك ] ---
const Engine = {
    buildMenu: (prefix) => {
        const buttons = allSurahs.map((s, i) => Markup.button.callback(`${i + 1} - ${s}`, `${prefix}_${i + 1}`));
        return Markup.inlineKeyboard(buttons, { columns: 2 });
    },
    sendLong: async (ctx, text) => {
        const chunks = text.match(/[\s\S]{1,3900}/g) || [text];
        for (const c of chunks) {
            await ctx.reply(c, { parse_mode: 'Markdown' });
        }
    }
};

// --- [ القراء مع خوادمهم ] ---
const RECITERS = [
    { id: 'lhidan', name: 'الشيخ محمد اللحيدان', server: 'https://server15.mp3quran.net/lhidan/' },
    { id: 'duasary', name: 'الشيخ ياسر الدوسري', server: 'https://server11.mp3quran.net/yasser/' },
    { id: 'minsh', name: 'الشيخ محمد المنشاوي', server: 'https://server10.mp3quran.net/minsh/' },
    { id: 'basit', name: 'الشيخ عبد الباسط عبد الصمد', server: 'https://server7.mp3quran.net/basit/' },
    { id: 'sudais', name: 'الشيخ عبد الرحمن السديس', server: 'https://server8.mp3quran.net/sudais/' },
    { id: 'shuraym', name: 'الشيخ سعود الشريم', server: 'https://server8.mp3quran.net/shuraym/' },
    { id: 'husary', name: 'الشيخ محمود خليل الحصري', server: 'https://server13.mp3quran.net/husr/' },
    { id: 'maqal', name: 'الشيخ عادل الكلباني', server: 'https://server8.mp3quran.net/kalbani/' },
];

// --- [ حماية وتسجيل ] ---
bot.use((ctx, next) => {
    if (!ctx.from) return next();
    const banned = JSON.parse(fs.readFileSync(BANNED_PATH));
    if (banned.includes(ctx.from.id)) return;

    let users = JSON.parse(fs.readFileSync(DB_PATH));
    if (!users.includes(ctx.from.id)) {
        users.push(ctx.from.id);
        fs.writeFileSync(DB_PATH, JSON.stringify(users));
    }
    return next();
});

// --- [ البداية ] ---
bot.start(async (ctx) => {
    const firstName = ctx.from.first_name;
    const userId = ctx.from.id;
    const welcomeMsg = `⌬━❁⌯─ ╎⊱ ‹﷽› ⊰ ╎─⌯❁━⌬
السلام عليكم يا استاذ [${firstName}](tg://user?id=${userId}) 
مرحبا بك في بوت سِرَاجُ السُّنَّة
اتمني البوت يكون مفيد لك باذن الله تعالي
※ معلومه 🌺
في الاستماع عند اختيار سوره معينه و الصوت ياتي لك فارغا او السيرفر لا يستجيب اختار قارئ اخر جزيت خيرا باذن الله 
⌬━╌᯽╌ ─⌯─🍃─⌯─ ╌᯽╌━⌬`;

    const imagePath = path.join(__dirname, 'media', 'welcome.jpg');
    try {
        if (fs.existsSync(imagePath)) {
            await ctx.replyWithPhoto({ source: imagePath }, { caption: welcomeMsg, parse_mode: 'Markdown', ...mainKeyboard(ctx.from.id) });
        } else {
            await ctx.replyWithMarkdown(welcomeMsg, mainKeyboard(ctx.from.id));
        }
    } catch { await ctx.replyWithMarkdown(welcomeMsg, mainKeyboard(ctx.from.id)); }
});

// --- [ لوحة التحكم الإدارية ] ---
bot.hears('⚙️ لوحة التحكم الإدارية', (ctx) => {
    const admins = JSON.parse(fs.readFileSync(ADMINS_PATH));
    if (!admins.includes(ctx.from.id)) return;
    ctx.reply('👑 لوحة التحكم الإدارية:', Markup.inlineKeyboard([
        [Markup.button.callback('📢 إذاعة عامة', 'admin_bc')],
        [Markup.button.callback('🚫 حظر مستخدم', 'admin_ban'), Markup.button.callback('✅ فك حظر', 'admin_unban')],
        [Markup.button.callback('👤 إضافة مشرف', 'admin_mod'), Markup.button.callback('🗑️ إزالة مشرف', 'admin_remmod')],
        [Markup.button.callback('📊 إحصائيات', 'admin_stats')],
    ]));
});

// --- [ معالجة الأوامر الإدارية ] ---
bot.action('admin_bc', (ctx) => { setMode('bc'); ctx.reply('📢 أرسل الآن نص الإذاعة:'); });
bot.action('admin_ban', (ctx) => { setMode('ban'); ctx.reply('🚫 أرسل أيدي المستخدم لحظره:'); });
bot.action('admin_unban', (ctx) => { setMode('unban'); ctx.reply('✅ أرسل أيدي المستخدم لفك حظره:'); });
bot.action('admin_mod', (ctx) => { setMode('mod'); ctx.reply('👤 أرسل أيدي المستخدم لجعله مشرفاً:'); });
bot.action('admin_remmod', (ctx) => { setMode('remmod'); ctx.reply('🗑️ أرسل أيدي المشرف لإزالته:'); });
bot.action('admin_stats', async (ctx) => {
    const users = JSON.parse(fs.readFileSync(DB_PATH));
    const banned = JSON.parse(fs.readFileSync(BANNED_PATH));
    const admins = JSON.parse(fs.readFileSync(ADMINS_PATH));
    await ctx.replyWithMarkdown(
        `📊 *إحصائيات البوت*\n\n` +
        `👥 المستخدمين: \`${users.length}\`\n` +
        `🚫 المحظورين: \`${banned.length}\`\n` +
        `👑 المشرفين: \`${admins.length}\`\n` +
        `📅 آخر تحديث: ${new Date().toLocaleString('ar-EG')}`
    );
});

function setMode(m) { fs.writeFileSync(SETTINGS_PATH, JSON.stringify({ mode: m })); }

// --- [ معالجة النصوص ] ---
bot.on('text', async (ctx, next) => {
    const admins = JSON.parse(fs.readFileSync(ADMINS_PATH));
    const banned = JSON.parse(fs.readFileSync(BANNED_PATH));
    const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH));

    // -- الأوامر الإدارية --
    if (admins.includes(ctx.from.id) && settings.mode !== 'none') {
        const input = ctx.message.text;

        if (settings.mode === 'bc') {
            const users = JSON.parse(fs.readFileSync(DB_PATH));
            const msg = await ctx.reply(`⏳ جاري الإذاعة لـ ${users.length} مستخدم...`);
            let sent = 0, failed = 0;
            
            // إرسال بشكل متقطع (10 مستخدمين كل دفعة)
            for (let i = 0; i < users.length; i += 10) {
                const batch = users.slice(i, i + 10);
                await Promise.all(batch.map(u => 
                    bot.telegram.sendMessage(u, `📢 **رسالة من الإدارة:**\n\n${input}`)
                        .then(() => sent++)
                        .catch(() => failed++)
                ));
                await new Promise(r => setTimeout(r, 1000)); // تأخير ثانية بين كل دفعة
            }
            
            await ctx.reply(`✅ تم الإذاعة:\n• تم الإرسال لـ: ${sent}\n• فشل: ${failed}`);
            
        } else if (settings.mode === 'ban') {
            const targetId = parseInt(input);
            if (isNaN(targetId)) return ctx.reply('❌ أيدي غير صحيح.');
            if (admins.includes(targetId)) return ctx.reply('❌ لا يمكن حظر مشرف.');
            if (banned.includes(targetId)) return ctx.reply('⚠️ المستخدم محظور بالفعل.');
            
            banned.push(targetId);
            fs.writeFileSync(BANNED_PATH, JSON.stringify(banned));
            await ctx.reply(`🚫 تم حظر المستخدم \`${targetId}\``, { parse_mode: 'Markdown' });
            
        } else if (settings.mode === 'unban') {
            const targetId = parseInt(input);
            if (isNaN(targetId)) return ctx.reply('❌ أيدي غير صحيح.');
            if (!banned.includes(targetId)) return ctx.reply('⚠️ المستخدم غير محظور.');
            
            const newBanned = banned.filter(id => id !== targetId);
            fs.writeFileSync(BANNED_PATH, JSON.stringify(newBanned));
            await ctx.reply(`✅ تم فك حظر المستخدم \`${targetId}\``, { parse_mode: 'Markdown' });
            
        } else if (settings.mode === 'mod') {
            const targetId = parseInt(input);
            if (isNaN(targetId)) return ctx.reply('❌ أيدي غير صحيح.');
            if (admins.includes(targetId)) return ctx.reply('⚠️ المستخدم مشرف بالفعل.');
            
            admins.push(targetId);
            fs.writeFileSync(ADMINS_PATH, JSON.stringify(admins));
            await ctx.reply(`👤 تم إضافة \`${targetId}\` كمشرف.`, { parse_mode: 'Markdown' });
            
        } else if (settings.mode === 'remmod') {
            const targetId = parseInt(input);
            if (isNaN(targetId)) return ctx.reply('❌ أيدي غير صحيح.');
            if (targetId === ADMIN_ID) return ctx.reply('❌ لا يمكن إزالة المالك الأساسي.');
            if (!admins.includes(targetId)) return ctx.reply('⚠️ المستخدم ليس مشرفاً.');
            
            const newAdmins = admins.filter(id => id !== targetId);
            fs.writeFileSync(ADMINS_PATH, JSON.stringify(newAdmins));
            await ctx.reply(`🗑️ تم إزالة \`${targetId}\` من المشرفين.`, { parse_mode: 'Markdown' });
        }

        fs.writeFileSync(SETTINGS_PATH, JSON.stringify({ mode: 'none' }));
        return;
    }

    // -- الأزرار الأصلية --
    if (ctx.message.text === '📖 المصحف الشريف') {
        return ctx.reply('📖 **نور القرآن الكريم**\n\nتفضل باختيار السورة:', {
            parse_mode: 'Markdown',
            ...Engine.buildMenu('read')
        });
    }
    
    if (ctx.message.text === '🎧 الاستماع للقرآن') {
        return ctx.reply('🎧 **مكتبة التلاوات**\n\nاختر السورة:', {
            parse_mode: 'Markdown',
            ...Engine.buildMenu('audio')
        });
    }
    
    if (ctx.message.text === '📜 حديث نبوي شريف') {
        try {
            const res = await axios.get('https://ahadith-api.herokuapp.com/api/ahadith/random/ar');
            const h = res.data.Hadith;
            return ctx.replyWithMarkdown(
                `📜 **من مشكاة النبوة:**\n\n` +
                `${h.Arab}\n\n` +
                `👤 **الراوي:** ${h.Rawy || 'غير معروف'}\n` +
                `📚 **المصدر:** ${h.Reference || 'صحيح'}`
            );
        } catch {
            // في حال فشل الـ API
            const backupHadiths = [
                'قال رسول الله ﷺ: (إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى)',
                'قال رسول الله ﷺ: (بلغوا عني ولو آية)',
                'قال رسول الله ﷺ: (الدين النصيحة)',
                'قال رسول الله ﷺ: (من حسن إسلام المرء تركه ما لا يعنيه)',
                'قال رسول الله ﷺ: (اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن)'
            ];
            const random = backupHadiths[Math.floor(Math.random() * backupHadiths.length)];
            return ctx.replyWithMarkdown(`📜 **حديث شريف:**\n\n${random}`);
        }
    }
    
    if (ctx.message.text === '🌅 أذكار الصباح') {
        return await Engine.sendLong(ctx, AZKAR_SUBH);
    }
    
    if (ctx.message.text === '🌙 أذكار المساء') {
        return await Engine.sendLong(ctx, AZKAR_MASA);
    }
    
    if (ctx.message.text === '🌜 أذكار النوم') {
        return await Engine.sendLong(ctx, AZKAR_NAWM);
    }
});

// --- [ قراءة السور ] ---
bot.action(/read_(\d+)/, async (ctx) => {
    try {
        await ctx.answerCbQuery('📖 جاري تحميل السورة...').catch(() => {});
        const res = await axios.get(`https://api.alquran.cloud/v1/surah/${ctx.match[1]}`);
        const data = res.data.data;
        let text = `✨ **سورة ${data.name}** ✨\n\n`;
        data.ayahs.forEach(a => { text += `${a.text} ﴿${a.numberInSurah}﴾ `; });
        await Engine.sendLong(ctx, text);
    } catch (err) {
        await ctx.reply('❌ خطأ في الاتصال بخادم القرآن. حاول مرة أخرى لاحقاً.');
    }
});

// --- [ اختيار السورة للاستماع ] ---
bot.action(/audio_(\d+)/, async (ctx) => {
    const id = ctx.match[1];
    const buttons = RECITERS.map(r => [Markup.button.callback(r.name, `play_${id}_${r.id}`)]);
    buttons.push([Markup.button.callback('🔙 عودة', 'back_audio')]);
    
    try {
        await ctx.editMessageText(
            `🎧 **سورة ${allSurahs[id-1]}**\n\nاختر القارئ:`,
            Markup.inlineKeyboard(buttons)
        );
    } catch {
        await ctx.reply(
            `🎧 **سورة ${allSurahs[id-1]}**\n\nاختر القارئ:`,
            Markup.inlineKeyboard(buttons)
        );
    }
});

// --- [ تشغيل الصوت ] ---
bot.action(/play_(\d+)_(\w+)/, async (ctx) => {
    const sId = parseInt(ctx.match[1]);
    const rId = ctx.match[2];
    const reciter = RECITERS.find(r => r.id === rId);
    
    if (!reciter) {
        return ctx.answerCbQuery('❌ القارئ غير موجود.', { show_alert: true });
    }

    await ctx.answerCbQuery('🔊 جاري تجهيز الملف...').catch(() => {});
    
    const surahNumber = String(sId).padStart(3, '0');
    const audioUrl = `${reciter.server}${surahNumber}.mp3`;
    
    try {
        await ctx.replyWithAudio(audioUrl, {
            caption: `📖 **سورة:** ${allSurahs[sId-1]}\n🎙️ **القارئ:** ${reciter.name}`,
            parse_mode: 'Markdown'
        });
    } catch {
        try {
            // محاولة مرة أخرى مع رابط بديل
            await ctx.replyWithAudio(audioUrl, {
                caption: `📖 سورة: ${allSurahs[sId-1]}\n🎙️ القارئ: ${reciter.name}`
            });
        } catch {
            ctx.reply(
                `⚠️ السيرفر لا يستجيب حاليًا.\n` +
                `• السورة: ${allSurahs[sId-1]}\n` +
                `• القارئ: ${reciter.name}\n\n` +
                `🔄 جرب قارئ آخر أو ارجع لاحقاً.`,
                Markup.inlineKeyboard([
                    [Markup.button.callback('🔙 عودة للقراء', `audio_${sId}`)],
                    [Markup.button.callback('🏠 القائمة الرئيسية', 'back_home')]
                ])
            );
        }
    }
});

// --- [ أزرار العودة ] ---
bot.action('back_audio', async (ctx) => {
    try {
        await ctx.editMessageText(
            '🎧 **مكتبة التلاوات**\n\nاختر السورة:',
            { parse_mode: 'Markdown', ...Engine.buildMenu('audio') }
        );
    } catch {
        await ctx.reply(
            '🎧 **مكتبة التلاوات**\n\nاختر السورة:',
            { parse_mode: 'Markdown', ...Engine.buildMenu('audio') }
        );
    }
});

bot.action('back_home', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch {}
    await ctx.reply('🏠 **القائمة الرئيسية**', mainKeyboard(ctx.from.id));
});

// --- [ أوامر مكتوبة ] ---
bot.command('stats', async (ctx) => {
    const admins = JSON.parse(fs.readFileSync(ADMINS_PATH));
    if (!admins.includes(ctx.from.id)) return ctx.reply('⛔ غير مصرح.');
    
    const users = JSON.parse(fs.readFileSync(DB_PATH));
    const banned = JSON.parse(fs.readFileSync(BANNED_PATH));
    await ctx.replyWithMarkdown(
        `📊 *إحصائيات البوت*\n\n` +
        `👥 المستخدمين: \`${users.length}\`\n` +
        `🚫 المحظورين: \`${banned.length}\`\n` +
        `👑 المشرفين: \`${admins.length}\``
    );
});

bot.command('myid', async (ctx) => {
    await ctx.replyWithMarkdown(`🆔 *الأيدي الخاص بك:* \`${ctx.from.id}\``);
});

bot.command('help', async (ctx) => {
    await ctx.replyWithMarkdown(
        `*🆘 قائمة المساعدة*\n\n` +
        `• \`/start\` ← بدء البوت\n` +
        `• \`/help\` ← عرض المساعدة\n` +
        `• \`/myid\` ← عرض أيدي حسابك\n` +
        `• \`/stats\` ← إحصائيات (للمشرف)\n\n` +
        `_استخدم الأزرار للتصفح 👇_`,
        mainKeyboard(ctx.from.id)
    );
});

// --- [ التشغيل ] ---
bot.launch().then(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ سراج السنة V18.0 يعمل الآن');
    console.log(`👤 المشرف: ${ADMIN_ID}`);
    console.log(`📅 ${new Date().toLocaleString('ar-EG')}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// --- [ إيقاف آمن ] ---
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));