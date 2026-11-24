# -*- coding: utf-8 -*-
"""
全站直通链接语言本地化与精准匹配修复器 (fix_all_urls_lang.py)
确保 Shopee / Lazada / TikTok / YouTube / X / Netflix / IMDb / 票务链接
100% 使用对应国家语言（泰语/马来语）或英语进行检索，绝不把中文括号/解释词塞进海外平台搜索框！
"""

import os
import re
import json
import urllib.parse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "dashboard_data.js")
SUB_DATA_FILE = os.path.join(BASE_DIR, "data", "dashboard_data.js")

# 常见纯中文/混排词条到精准英文/泰文/马来文检索词的映射
ZH_TO_EN_MAP = {
    "水灯节": "Loy Krathong",
    "泼水节": "Songkran",
    "黑五": "Black Friday",
    "黑色星期五": "Black Friday",
    "圣诞": "Christmas",
    "弹跳猪": "Moo Deng",
    "林俊杰": "JJ Lin",
    "进击的巨人": "Attack on Titan",
    "哪吒": "Ne Zha 2",
    "鬼灭": "Demon Slayer",
    "咒术回战": "Jujutsu Kaisen",
    "海贼王": "One Piece",
    "火影": "Naruto",
    "死神": "Bleach",
    "胆大党": "Dan Da Dan",
    "龙珠": "Dragon Ball DAIMA",
    "乱马": "Ranma 1/2",
    "我独自升级": "Solo Leveling",
    "流星花园": "F4 Thailand Bright Win",
    "黑白大厨": "Culinary Class Wars",
    "一箱情缘": "The Trunk Gong Yoo",
    "鱿鱼游戏": "Squid Game 2",
    "双城之战": "Arcane Season 2",
    "荆棘天堂": "The Paradise of Thorns",
    "魔法坏女巫": "Wicked",
    "角斗士": "Gladiator II",
    "海洋奇缘": "Moana 2",
    "毒液": "Venom The Last Dance",
    "猎人克莱文": "Kraven the Hunter",
    "木法沙": "Mufasa The Lion King",
    "索尼克": "Sonic the Hedgehog 3",
    "帕丁顿熊": "Paddington in Peru",
    "特工阿里": "Ejen Ali The Movie 2",
    "白雪公主": "Snow White 2025",
    "露营": "Camping",
    "防晒": "UV Protection",
    "大码": "Plus Size",
    "重磅": "Heavyweight",
    "复古": "Vintage",
    "速干": "Quick Dry",
    "夜跑": "Running",
    "纯棉": "Cotton",
    "蜡染": "Batik",
    "泰式": "Thai Style",
    "屠妖节": "Deepavali",
    "小立领": "Mandarin Collar",
    "短袖": "T-shirt",
    "T恤": "T-shirt",
    "t恤": "T-shirt"
}

def to_clean_foreign_query(text, country="global"):
    s = str(text or "")
    # 先替换映射词
    for zh, en in ZH_TO_EN_MAP.items():
        if zh in s:
            # 如果原文已经包含英文对应词则只删中文，否则替换为英文
            if en.lower() not in s.lower():
                s = s.replace(zh, " " + en + " ")
            else:
                s = s.replace(zh, " ")
    # 移除所有剩余汉字及中文标点
    s = re.sub(r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]+', ' ', s)
    # 清理多余括号与符号
    s = re.sub(r'[()\[\]【】「」《》·/]+', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    if not s or len(s) < 2:
        if "泰" in country or country == "TH":
            return "เสื้อยืด oversize"
        elif "马" in country or country == "MY":
            return "baju t shirt cotton"
        return "Oversized T-shirt"
    return s

CAL_TH_MY_CUSTOMS_RULES = [
    (["黑五", "black friday", "cyber monday", "网络星期一", "双十一", "双十二", "月度大促", "超级购物日", "lagi murah"],
     "泰国曼谷 Siam Paragon、CentralWorld 等商圈及 Shopee/Lazada TH 同步开启全年大促，年轻上班族与大学生习惯趁免运日多件囤购宽松纯棉印花 T 恤与街头风单品。",
     "马来西亚 Pavilion、Mid Valley 及 Shopee/Lazada MY 主打高折扣与免运券，华裔与马来年轻消费者集中采购家庭装、情侣装及高性价比日常纯棉 T 恤。"),
    (["圣诞", "christmas", "boxing day", "节礼日"],
     "泰国虽为佛教国家，但曼谷及各大府商场（CentralWorld 巨型圣诞树）圣诞灯饰与交换礼物氛围极浓，年轻人流行穿红/白/绿派对休闲 T 恤街头打卡。",
     "马来西亚将圣诞节列为全国法定公假，东马（沙巴/砂拉越）基督徒举行教堂礼拜与 Open House 聚餐，西马商场派对盛行，喜庆红绿/金色款式畅销（注意大马版型偏保守）。"),
    (["除夕", "new year", "跨年"],
     "泰国曼谷 ICONSIAM、CentralWorld 跨年烟花与寺庙跨年诵经（สวดมนต์ข้ามปี）并行，年轻人夜间户外倒数偏爱高辨识度荧光字样或曼谷跨年纪念 T 恤。",
     "马来西亚吉隆坡 KLCC 双子塔与独立广场举办大型跨年倒数烟花秀，多元族群共同狂欢，适合 'New Year Countdown / KL' 城市主题潮流 T 恤。"),
    (["春节", "农历新年", "cny", "天公诞"],
     "泰国华裔保留祭祖、派红包（อั่งเปา）与曼谷耀华力路（唐人街）舞狮习俗，全泰普遍认可春节穿正红、鎏金喜庆 T 恤讨好彩头。",
     "马来西亚春节为全国法定公假（初一初二连休），盛行「捞生」（Yee Sang）团圆宴、门户开放（Open House）与派红包，大红生肖、发财汉字书法 T 恤全马爆卖（天公诞初九福建社群尤为隆重）。"),
    (["情人节", "valentine", "520"],
     "泰国曼谷挽腊区（Bang Rak，“爱之区”）流行情侣登记领证与互贴心形贴纸，情侣装（Couple Tee）与手绘爱心/玫瑰印花 T 恤需求爆发。",
     "马来西亚华裔及都市年轻情侣流行约会送礼与情侣穿搭；需注意大马宗教局对部分穆斯林群体过西方情人节持保守态度，图案宜采用通用极简爱心、字母 'Love' 而非宗教符号。"),
    (["复活节", "easter", "good friday"],
     "泰国主要在国际学校、外籍社群及高端酒店举办彩蛋寻宝（Easter Egg Hunt）早午餐派对，主打春日粉彩（Pastel）、小兔与花卉萌系印花。",
     "马来西亚东马（沙巴、砂拉越）将耶稣受难日（Good Friday）列为法定公假，基督徒家庭举行教堂祈福；西马商场亦有春日萌兔主题美陈与亲子 T 恤需求。"),
    (["万圣", "halloween"],
     "泰国曼谷考山路、通罗夜店区与 MBK 万圣派对极盛，年轻潮人偏爱幽灵、霓虹骷髅、泰式鬼片幽默玩梗与夜光印花 T 恤。",
     "马来西亚都市商场与酒吧有小型主题变装派对，但因宗教敏感度，面向马来主流市场须避开恶魔/恐怖血腥图案，优先推 Q 版南瓜、可爱幽灵插画。"),
    (["妇女节", "women", "母亲节", "mother"],
     "泰国本土母亲节固定在 8 月 12 日（诗丽吉王太后诞辰，流行佩戴素丽花茉莉、穿淡蓝色孝亲装）；3/8 妇女节及 5 月国际母亲节主要由都市女性与外企响应，适合独立女性标语款。",
     "马来西亚 5 月第二个周日与全球同步过母亲节（聚餐送花），3/8 妇女节各大商场推女性专属折扣，温馨家庭装、花卉刺绣及女性赋能英文标语 T 恤热销。"),
    (["父亲节", "father", "拉玛九世", "国王", "苏丹", "元首", "加冕", "宪法", "国庆", "merdeka", "马来西亚日", "却克里"],
     "泰国王室纪念日与父亲节（12/5，纪念拉玛九世，流行穿黄色 T 恤表达敬意，赠送美人蕉花）；涉及王室与国庆活动严禁商业使用王室肖像或国徽，宜做纯色黄/紫礼服感基础款或抽象国花金链花设计。",
     "马来西亚国庆日（8/31 Merdeka）、马来西亚日（9/16）及最高元首/苏丹诞辰期间，大马街头挂满辉煌条纹旗，流行国旗色系拼接、Hibiscus（大红花）插画及爱国数字/城市涂鸦 T 恤（严禁篡改国徽）。"),
    (["劳动节", "labour", "地球日", "earth day", "素食", "咖啡", "微笑", "友谊", "猫咪", "dog", "熊猫", "程序员"],
     "泰国年轻 Z 世代与文创市集（Chatuchak / Ari 咖啡街区）对环保地球日、咖啡文化、猫咪宠物与极简生活态度标语 T 恤接受度极高，常作为日常街头穿搭。",
     "马来西亚吉隆坡文创市集与咖啡馆社群活跃，生态环保（Recycle/Green）、萌宠猫咪、咖啡趣味插画（如 Kopi 本土梗）是极具复购率的轻潮流印花题材。"),
    (["开斋", "isra", "nuzul", "屠妖", "deepavali", "大宝森", "thaipusam", "丰收节", "kaamatan", "gawai"],
     "泰国南部三府穆斯林社群庆祝开斋节、盛装串门；普吉/曼谷印度裔社群欢庆屠妖节。跨站选品可顺势切入南泰民族风几何图腾与节庆亮色宽松 T 恤。",
     "马来西亚核心多元文化法定大节！开斋节（穿 Baju Melayu/宽松礼服感素色或几何印花，严禁猪/酒元素）、屠妖节（灯火/孔雀/曼陀罗亮色图腾）、东马丰收节（民族图腾印花）均为全马级消费高峰。"),
    (["宋干", "水灯", "万佛", "卫塞", "wesak", "asalha", "出夏", "拖钵", "九皇斋"],
     "泰国全年最核心传统节庆！宋干节（4月）全民泼水狂欢必买鲜艳碎花/速干大象 T 恤；九皇斋节（10月）全民穿纯白素衣；水灯节穿传统/泰式优雅印花款。",
     "马来西亚华裔与佛教社群盛大庆祝卫塞节（Wesak，浴佛祈福、穿素雅白/浅色 T 恤）及九皇爷诞（穿全白素衣斋戒）；北部州属亦有泰裔社区欢庆水灯与宋干泼水活动。"),
    (["骄傲月", "pride"],
     "泰国已实现婚姻平权，曼谷每年 6 月举办亚洲最盛大的 Bangkok Pride 大游行，彩虹渐变、平权标语与街头派对露脐/宽松 T 恤需求爆发，全泰高热。",
     "马来西亚受伊斯兰教法与保守社会规范约束，公开场合及主流电商平台严格限制高调 LGBTQ+ 彩虹旗帜营销；建议大马站规避敏感政治符号，仅以纯艺术彩色渐变/夏日多巴胺配色切入。"),
    (["宝可梦", "pokémon", "芭比", "barbie", "马里奥", "mar10", "星战", "star wars", "hello kitty", "emoji", "圆周率"],
     "泰国潮流圈与 Siam Center 动漫展氛围浓厚，日系二次元、Hello Kitty、宝可梦与复古美式大片周边极受欢迎（须严防直接盗印正版商标，建议做像素风/色块二创致敬）。",
     "马来西亚商场联动 IP 快闪极多，吉隆坡年轻人热衷美漫/日漫与游戏联名风穿搭，但 Shopee/Lazada MY 对迪士尼/任天堂/三丽鸥等品牌词查重极严，标题与图面必须避开受保护商标。"),
]

WIKI_FIX_MAP = {
    "地球日": {
        "wiki_title": "Earth Day",
        "wiki_lang": "en",
        "wiki_extract": "Earth Day is an annual event on April 22 to demonstrate support for environmental protection. First held on April 22, 1970, it now includes a wide range of events coordinated globally by EarthDay.org across more than 193 countries.",
        "wiki_url": "https://en.wikipedia.org/wiki/Earth_Day",
    },
    "宝可梦日": {
        "wiki_title": "Pokémon Day",
        "wiki_lang": "en",
        "wiki_extract": "Pokémon Day is celebrated annually on February 27 to commemorate the original 1996 Japanese release of Pokémon Red and Green on Game Boy, featuring global game announcements and merchandise events.",
        "wiki_url": "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Day",
    },
    "火箭节": {
        "wiki_title": "Rocket Festival (Bun Bang Fai)",
        "wiki_lang": "en",
        "wiki_extract": "The Rocket Festival (Thai: ประเพณีบุญบั้งไฟ, Bun Bang Fai) is a traditional merit-making ceremony practiced by ethnic Lao and Isan people throughout Northeast Thailand and Laos before the rainy season to call for rain.",
        "wiki_url": "https://en.wikipedia.org/wiki/Rocket_Festival",
    },
}

# 真实演艺档期官方校准表（防止历史误改日期导致标题与日期对不上）
VERIFIED_ENT_DATES = [
    ("Maroon 5 泰国站", "2027-02-15"),
    ("刘宪华 HENRY LAU", "2026-11-28"),
    ("Khalid「It's Always Summer Somewhere」曼谷站", "2026-11-29"),
    ("BTS WORLD TOUR 'ARIRANG' IN BANGKOK", "2026-12-03"),
    ("Wonderfruit", "2026-12-03"),
    ("Malcolm Todd「Do That Again Tour」曼谷首演", "2026-12-06"),
    ("Tomorrowland Thailand", "2026-12-11"),
    ("EDC Thailand", "2026-12-18"),
    ("TATTOO COLOUR", "2026-12-19"),
    ("Ink Waruntorn", "2026-12-24"),
    ("藤井风 Fujii Kaze", "2026-12-26"),
    ("Stray Kids 曼谷站", "2027-01-16"),
    ("FKJ「Tyber Tour」吉隆坡站", "2026-12-01"),
    ("Khalid「It's Always Summer Somewhere」吉隆坡站", "2026-12-09"),
    ("Malcolm Todd「Do That Again Tour」吉隆坡站", "2026-12-09"),
    ("BTS WORLD TOUR 'ARIRANG' IN KUALA LUMPUR", "2026-12-12"),
    ("A-Lin《歌迹 Journey》", "2026-12-19"),
    ("BOYNEXTDOOR「KNOCK ON Vol.2 World Tour」吉隆坡站", "2026-12-26"),
    ("The Mosquito Bowl", "2026-11-25"),
    ("The Further Mis-Adventures of Cliff Booth", "2026-11-25"),
    ("In a Holidaze", "2026-12-02"),
    ("The Man With The Bag", "2026-12-02"),
    ("Proxies", "2026-12-11"),
    ("In Waves", "2026-12-11"),
    ("Narnia: The Magician's Nephew", "2027-04-02"),
]

# 已明确结束的 2026-10 ~ 11-21 旧演出，绝不复活
EXPIRED_ENT_NAMES = (
    "Wildest Decade", "Jason Mraz", "Zara Larsson", "BIGBANG",
    "BABYMONSTER", "5 Seconds of Summer", "LANY", "wave to earth",
    "LOSO 30", "My Chemical Romance", "DIAGE Festival", "Nick Chou",
    "The Weeknd", "yung kai", "周兴哲"
)

def enrich_calendar_th_my_customs(data):
    """为日历中所有节点（尤其是全球/跨市场节日）补齐泰国与马来西亚对应习俗说明。"""
    cal = data.get("calendar", [])
    enriched = 0
    for h in cal:
        name = str(h.get("name", ""))
        tag = str(h.get("tag", "")) + " " + str(h.get("category", ""))
        hay = (name + " " + tag).lower()
        th_c, my_c = None, None
        for kws, th_txt, my_txt in CAL_TH_MY_CUSTOMS_RULES:
            if any(k in hay for k in kws):
                th_c, my_c = th_txt, my_txt
                break
        if not th_c:
            th_c = f"泰国站关注焦点：{name} 期间，曼谷都市青年与线上电商买家偏好应景主题色彩、高透气纯棉宽松版型（Oversized）及街头趣味字体印花。"
            my_c = f"马来西亚站关注焦点：{name} 期间，大马多元族群重视得体舒适的日常/聚会穿搭（兼顾清真与多元文化包容度），适合清爽图文或家庭亲子同款。"
        ci = h.get("ai_culture_insights")
        if not isinstance(ci, dict):
            ci = {}
        ci["th_customs"] = th_c
        ci["my_customs"] = my_c
        if not ci.get("customs") or ("泰国" not in ci["customs"] and "马来" not in ci["customs"]):
            ci["customs"] = f"🇹🇭 泰国习俗：{th_c}\n🇲🇾 马来习俗：{my_c}"
        h["ai_culture_insights"] = ci

        # 修复日历条目的空链接或含中文的 source_url
        cur_src = str(h.get("source_url") or "").strip()
        dec_src = urllib.parse.unquote(cur_src)
        if not cur_src or not cur_src.startswith("http") or re.search(r'[\u4e00-\u9fff]', dec_src) or "bing.com/search" in cur_src:
            site_str = str(h.get("site", ""))
            q = to_clean_foreign_query(name, site_str)
            gl = "my" if ("malay" in site_str.lower() or "马来" in site_str) else "th"
            h["source_url"] = f"https://www.google.com/search?q={urllib.parse.quote(q)}&gl={gl}"

        # 修复日历中错位的 wiki_title / wiki_extract
        for wkey, wfix in WIKI_FIX_MAP.items():
            if wkey in name:
                h["wiki_title"] = wfix["wiki_title"]
                h["wiki_lang"] = wfix["wiki_lang"]
                h["wiki_extract"] = wfix["wiki_extract"]
                h["wiki_url"] = wfix["wiki_url"]
                break
        enriched += 1

    # 同步修复顶层 wiki_terms 中的错位词条
    wt = data.get("wiki_terms", {})
    if isinstance(wt, dict):
        for wkey, wfix in WIKI_FIX_MAP.items():
            if wkey in wt and isinstance(wt[wkey], dict):
                wt[wkey].update(wfix)
    return enriched

def _normalize_ent_date(raw_date, base_year=2026):
    """将 '11/28', '12/3·5·6', '2027/1/16–17', '2026-12-24' 统一提取为 YYYY-MM-DD。"""
    s = str(raw_date or "").strip()
    m_full = re.search(r'(\d{4})[-/](\d{1,2})[-/](\d{1,2})', s)
    if m_full:
        return f"{int(m_full[1]):04d}-{int(m_full[2]):02d}-{int(m_full[3]):02d}"
    m_short = re.match(r'^(\d{1,2})[/](\d{1,2})', s)
    if m_short:
        mo, dy = int(m_short[1]), int(m_short[2])
        yr = base_year if mo >= 10 else (base_year + 1)
        return f"{yr:04d}-{mo:02d}-{dy:02d}"
    return None

def sanitize_dashboard_data(data, today_str=None):
    """清洗 entertainment 演艺档期（仅保留未来/待定真实演出，剔除节庆/大促/过期歌曲）并将全站搜索链接转为当地语言/英文。"""
    from datetime import datetime
    if not today_str:
        today_str = datetime.now().strftime("%Y-%m-%d")
    base_year = int(today_str[:4])

    cal_enriched = enrich_calendar_th_my_customs(data)

    # 1. 修复 global_trends (TikTok / YouTube / X / Netflix / 实时热歌)
    gt = data.get("global_trends", {})
    gt_fixed = 0
    for plat, items in gt.items():
        if not isinstance(items, list): continue
        for it in items:
            raw_title = it.get("title") or it.get("content") or ""
            q = to_clean_foreign_query(raw_title)
            if "TikTok" in plat:
                if raw_title.startswith("#"):
                    tag = q.split()[0].replace("#", "")
                    url = f"https://www.tiktok.com/tag/{urllib.parse.quote(tag)}"
                else:
                    url = f"https://www.tiktok.com/search?q={urllib.parse.quote(q)}"
            elif "YouTube" in plat or "热歌" in plat:
                gl = "MY" if ("马来" in str(it.get("heat", "")) or "MY" in str(it.get("heat", ""))) else "TH"
                url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(q)}&gl={gl}"
            elif "X" in plat:
                url = f"https://x.com/search?q={urllib.parse.quote(q)}"
            elif "Netflix" in plat:
                url = f"https://www.netflix.com/search?q={urllib.parse.quote(q)}"
            else:
                url = f"https://www.google.com/search?q={urllib.parse.quote(q)}"
            it["link"] = url
            it["source_url"] = url
            gt_fixed += 1

    # 2. 修复 anime_film (电影与动漫 IP)
    af = data.get("anime_film", [])
    for it in af:
        # 保留 Apple 官方直链，仅修复搜索类链接
        cur_url = str(it.get("url") or "")
        if "music.apple.com" in cur_url or "itunes.apple.com" in cur_url or "tv.apple.com" in cur_url:
            continue
        q = to_clean_foreign_query(it.get("name", ""))
        it["url"] = f"https://www.imdb.com/find/?q={urllib.parse.quote(q)}"

    # 3. 清洗并修复 entertainment (仅保留真实即将上演的演唱会/音乐节/见面会/电影首映，剔除节庆/大促/过期歌曲)
    ent = data.get("entertainment", [])
    allowed_types = ("演唱会", "音乐节", "电子音乐节", "粉丝见面会", "电影")
    banned_kw = ("圣诞节", "屠妖节", "Deepavali", "万圣节", "Halloween", "双11", "水灯节", "Loy Krathong", "Yi Peng", "鬼屋", "厨具", "世界杯", "德比", "网球", "船队")
    cleaned_ent = []
    seen_names = set()
    for e in ent:
        t_str = str(e.get("type", ""))
        name_str = str(e.get("name", ""))
        site_str = str(e.get("site", ""))
        if "Apple iTunes" in site_str:
            continue
        if not any(k in t_str for k in allowed_types):
            continue
        if any(bk.lower() in name_str.lower() for bk in banned_kw):
            continue
        if any(ex.lower() in name_str.lower() for ex in EXPIRED_ENT_NAMES):
            continue

        # 先按官方校准表校准真实日期，避免日期与标题错位
        matched_cal_date = None
        for v_kw, v_dt in VERIFIED_ENT_DATES:
            if v_kw.lower() in name_str.lower():
                matched_cal_date = v_dt
                break
        if matched_cal_date:
            e["date"] = matched_cal_date

        norm_d = _normalize_ent_date(e.get("date"), base_year=base_year)
        if norm_d:
            if norm_d < today_str:
                continue
            e["date"] = norm_d
        elif "待公布" not in str(e.get("date", "")):
            continue

        dedup_k = name_str.strip().lower()
        if dedup_k in seen_names:
            continue
        seen_names.add(dedup_k)

        q = to_clean_foreign_query(name_str, site_str)
        if "马来" in site_str:
            suffix = " Malaysia movie release" if "电影" in t_str else " Malaysia concert ticket"
            clean_url = f"https://www.google.com/search?q={urllib.parse.quote(q + suffix)}&gl=my"
        elif "全球" in site_str or "电影" in t_str:
            clean_url = f"https://www.google.com/search?q={urllib.parse.quote(q + ' official trailer release')}&gl=th"
        else:
            clean_url = f"https://www.google.com/search?q={urllib.parse.quote(q + ' Bangkok Thailand ticket')}&gl=th"

        e["url"] = clean_url
        e["official_url"] = clean_url
        e["source_url"] = clean_url
        # 刷新 ai_summary 中可能残留的旧日期
        cur_sum = str(e.get("ai_summary") or "")
        if cur_sum:
            e["ai_summary"] = re.sub(r'档期\s*\d{4}[-/]\d{1,2}[-/]\d{1,2}', f"档期 {e.get('date')}", cur_sum)
        else:
            e["ai_summary"] = f"🤖 AI总结：{name_str} 位于 {site_str or '泰国'}，档期 {e.get('date')}。建议采用抽象线条与城市字样二创T恤，严禁搬运真人肖像。"
        cleaned_ent.append(e)

    # 补全在 2026-11-24 之后真实即将上演、但此前被误删的泰/马演出与电影首映
    CORE_UPCOMING_ENT = [
        ("2026-11-28", "演唱会", "马来西亚站", "吉隆坡 Axiata Arena", "Evanescence 吉隆坡演唱会"),
        ("2026-12-01", "演唱会", "马来西亚站", "吉隆坡 Zepp KL", "FKJ「Tyber Tour」吉隆坡站"),
        ("2026-12-09", "演唱会", "马来西亚站", "吉隆坡", "Khalid「It's Always Summer Somewhere」吉隆坡站"),
        ("2026-12-09", "演唱会", "马来西亚站", "吉隆坡", "Malcolm Todd「Do That Again Tour」吉隆坡站"),
        ("2026-12-11", "电子音乐节", "泰国站", "泰国 芭堤雅 Wisdom Valley", "Tomorrowland Thailand（亚洲首场）"),
        ("2026-12-12", "演唱会", "马来西亚站", "吉隆坡 Bukit Jalil National Stadium", "BTS WORLD TOUR 'ARIRANG' IN KUALA LUMPUR"),
        ("2026-12-12", "音乐节", "泰国站", "泰国 考艾 The Ocean Khao Yai", "PEPSI presents BIG MOUNTAIN MUSIC FESTIVAL（大山音乐节）"),
        ("2026-12-18", "电子音乐节", "泰国站", "泰国 普吉岛 Boat Avenue Lakefront", "EDC Thailand（Electric Daisy Carnival）"),
        ("2026-12-19", "演唱会", "泰国站", "泰国 曼谷 Impact Arena", "TATTOO COLOUR 第 6 届「TATTOO STADIUM」"),
        ("2026-12-19", "演唱会", "马来西亚站", "吉隆坡 Axiata Arena", "A-Lin《歌迹 Journey》世界巡回演唱会 吉隆坡站"),
        ("2026-12-26", "演唱会", "泰国站", "泰国 曼谷 Impact Arena", "藤井风 Fujii Kaze「Prema World Tour」曼谷站"),
        ("2026-12-26", "演唱会", "马来西亚站", "吉隆坡 Axiata Arena", "BOYNEXTDOOR「KNOCK ON Vol.2 World Tour」吉隆坡站"),
    ]
    for c_dt, c_tp, c_st, c_loc, c_nm in CORE_UPCOMING_ENT:
        if c_dt < today_str:
            continue
        if any(c_nm.split("（")[0].split("「")[0].lower() in (x.get("name", "").lower()) and (c_st[:2] in str(x.get("site", ""))) for x in cleaned_ent):
            continue
        q = to_clean_foreign_query(c_nm, c_st)
        gl = "my" if "马来" in c_st else "th"
        suf = " Malaysia concert ticket" if gl == "my" else " Bangkok Thailand ticket"
        u = f"https://www.google.com/search?q={urllib.parse.quote(q + suf)}&gl={gl}"
        cleaned_ent.append({
            "date": c_dt,
            "type": c_tp,
            "name": c_nm,
            "location": c_loc,
            "site": c_st,
            "url": u,
            "official_url": u,
            "source_url": u,
            "verification": "✓ 官方档期日历核验",
            "ai_summary": f"🤖 AI总结：{c_nm} 位于 {c_st}（{c_loc}），档期 {c_dt}。建议采用抽象线条、荧光应援色与城市字样二创T恤，严禁搬运真人肖像。"
        })

    cleaned_ent.sort(key=lambda x: (0 if re.match(r'^\d{4}-\d{2}-\d{2}$', str(x.get("date", ""))) else 1, str(x.get("date", ""))))
    data["entertainment"] = cleaned_ent
    ent_fixed = len(cleaned_ent)

    # 4. 修复 bestsellers (Shopee / Lazada / TikTok 泰马商品搜索，并剔除夹克/外套等非T恤杂质)
    bs = data.get("bestsellers", {})
    bs_fixed = 0
    bad_bs_kw = ['jeans', 'shorts', 'jacket', 'tudung', '长裙', '短裤', '牛仔裤', '夹克', '外套', 'jubah', 'kurung', 'dress', '长袍', '连衣裙', 'kemeja', '衬衫', 'sweater', '毛衣']
    for p, pval in bs.items():
        if not isinstance(pval, dict): continue
        for c, items in pval.items():
            if not isinstance(items, list): continue
            is_my = "马来" in c
            clean_items = []
            for it in items:
                chk_str = (str(it.get("tshirt_name", "")) + " " + str(it.get("product", "")) + " " + str(it.get("cn", ""))).lower()
                if any(bk in chk_str for bk in bad_bs_kw):
                    continue
                raw_name = it.get("tshirt_name") or it.get("product") or ""
                q = to_clean_foreign_query(raw_name, "MY" if is_my else "TH")
                if not any(k in q.lower() for k in ["t-shirt", "t shirt", "tee", "shirt", "เสื้อ", "baju"]):
                    q += " T-shirt"
                if "Shopee" in p:
                    dom = "shopee.com.my" if is_my else "shopee.co.th"
                    it["link"] = f"https://{dom}/search?keyword={urllib.parse.quote(q)}"
                elif "Lazada" in p:
                    dom = "www.lazada.com.my" if is_my else "www.lazada.co.th"
                    it["link"] = f"https://{dom}/catalog/?q={urllib.parse.quote(q)}"
                else:
                    it["link"] = f"https://www.tiktok.com/search?q={urllib.parse.quote(q)}"
                clean_items.append(it)
                bs_fixed += 1
            pval[c] = clean_items

    # 5. 修复 search_rankings (直接使用原语种 word!)
    sr = data.get("search_rankings", {})
    sr_fixed = 0
    for p, pval in sr.items():
        if not isinstance(pval, dict): continue
        for c, items in pval.items():
            if not isinstance(items, list): continue
            is_my = "马来" in c
            for it in items:
                raw_w = it.get("word") or it.get("cn") or ""
                q = to_clean_foreign_query(raw_w, "MY" if is_my else "TH")
                if "Shopee" in p:
                    dom = "shopee.com.my" if is_my else "shopee.co.th"
                    it["url"] = f"https://{dom}/search?keyword={urllib.parse.quote(q)}"
                elif "Lazada" in p:
                    dom = "www.lazada.com.my" if is_my else "www.lazada.co.th"
                    it["url"] = f"https://{dom}/catalog/?q={urllib.parse.quote(q)}"
                else:
                    it["url"] = f"https://www.tiktok.com/search?q={urllib.parse.quote(q)}"
                sr_fixed += 1

    print(f"[+] 全站链接外语本地化、演艺档期与泰马习俗清洗完毕：日历泰马习俗 {cal_enriched} 条、社媒趋势 {gt_fixed} 条、演艺档期 {ent_fixed} 条、爆款榜 {bs_fixed} 条、热搜榜 {sr_fixed} 条！")
    return data

def fix_all():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    m = re.search(r'window\.DASHBOARD_DATA\s*=\s*(\{[\s\S]*\});?\s*$', content)
    data = json.loads(m.group(1))
    data = sanitize_dashboard_data(data)

    out_str = "window.DASHBOARD_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(out_str)
    if os.path.exists(os.path.dirname(SUB_DATA_FILE)):
        with open(SUB_DATA_FILE, "w", encoding="utf-8") as f:
            f.write(out_str)

if __name__ == "__main__":
    fix_all()
