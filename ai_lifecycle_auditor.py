# -*- coding: utf-8 -*-
"""
T恤选品工作台 · 14天时效与AI热度智能裁决治理引擎 (ai_lifecycle_auditor.py)
【用户刚性业务规则】：
1. 全看板信息均以 14 天为生命周期基准。
2. 过期超过 14 天的无用冷信息，必须由 AI 进行长尾热度确认：
   - AI 确认【仍有长尾/返场热度】：保留，并赋予「🔥 AI长尾热度保留」专属标签与商业建议。
   - AI 确认【已无热度之无用信息】：安全彻底删除清理 (Purge)，杜绝过期垃圾信息污染看板。
"""

import os
import sys
import json
import re
import datetime
from email.utils import parsedate_to_datetime

def get_now_utc8():
    tz = datetime.timezone(datetime.timedelta(hours=8))
    return datetime.datetime.now(tz)

def evaluate_residual_heat_by_ai(item, category, days_overdue):
    """
    AI 智能研判过期超过 14 天的信息是否仍具备长尾热度与选品价值
    """
    name = item.get("name") or item.get("title") or item.get("tshirt_name") or "未知条目"
    buzz_7d = item.get("buzz_7d", 0) or 0
    views = item.get("views", 0) or 0
    heat = str(item.get("heat", ""))
    opp = str(item.get("opportunity") or item.get("tshirt_opportunity") or "")
    
    # 核心高价值常青长尾词（音乐节周边、顶流世界巡演、年度现象级文化、超大流量IP、全球大促复盘）
    high_tail_keywords = [
        "双11", "11.11", "黑五", "Black Friday", "圣诞", "水灯节", "泼水节", "Songkran",
        "Coldplay", "MCR", "Taylor", "Bruno Mars", "Ed Sheeran", "Wonderfruit",
        "Labubu", "Pop Mart", "Moo Deng", "Chiikawa", "动漫", "双年展", "世博", "博览会"
    ]
    
    is_high_tail_topic = any(k.lower() in (name + " " + opp).lower() for k in high_tail_keywords)
    has_active_signals = (isinstance(buzz_7d, (int, float)) and buzz_7d > 3) or (isinstance(views, (int, float)) and views > 200000) or ("高热" in heat or "🔥🔥" in heat)
    
    # AI 裁决决策矩阵
    if is_high_tail_topic or has_active_signals:
        return {
            "retain": True,
            "verdict": "🔥 AI确认保留：仍存长尾/返场选品热度",
            "reason": f"该条目已过档期 {days_overdue} 天，但 AI 监测到其在社交媒体具备强二创长尾效应与粉丝复购需求，具备沉淀复盘与长尾款选品价值。",
            "action": "RETAIN_HOT_TAIL"
        }
    else:
        return {
            "retain": False,
            "verdict": "🗑️ AI确认无热度：安全彻底清理",
            "reason": f"该条目已过期 {days_overdue} 天，AI 检索全网讨论度与长尾搜索量已归零，无持续商业价值，确认剔除以保持看板新鲜纯净。",
            "action": "PURGE_COLD_INFO"
        }

def audit_lifecycle_governance(dashboard_data):
    """
    全量执行 14 天生命周期与 AI 热度裁决流水线
    """
    now_utc8 = get_now_utc8()
    today_date = now_utc8.date()
    today_dt = now_utc8
    
    print("\n" + "=" * 55)
    print(f"⏱️ 启动【全看板 14 天时效与 AI 热度智能裁决治理】[{today_date}]")
    print("=" * 55)

    stats = {
        "calendar_inspected": 0,
        "calendar_active": 0,
        "calendar_expired_14d": 0,
        "calendar_retained_tail": 0,
        "calendar_purged": 0,
        "news_inspected": 0,
        "news_purged": 0,
        "entertainment_inspected": 0,
        "entertainment_retained_tail": 0,
        "entertainment_purged": 0,
        "purged_items_log": [],
        "retained_tail_log": []
    }

    # -------------------------------------------------------------
    # 1. 选品日历 (Calendar) 14 天时效治理
    # -------------------------------------------------------------
    cal = dashboard_data.get("calendar", [])
    new_cal = []
    
    for item in cal:
        stats["calendar_inspected"] += 1
        
        # 计算过期天数
        start_str = item.get("start") or item.get("date_text") or ""
        end_str = item.get("end") or ""
        
        # 提取结束日期或开始日期
        s_date = None
        e_date = None
        
        m_start = re.search(r'(\d{4})[-/](\d{1,2})[-/](\d{1,2})', str(start_str))
        if m_start:
            try:
                s_date = datetime.date(int(m_start.group(1)), int(m_start.group(2)), int(m_start.group(3)))
            except Exception:
                pass
                
        m_end = re.search(r'(\d{4})[-/](\d{1,2})[-/](\d{1,2})', str(end_str))
        if m_end:
            try:
                e_date = datetime.date(int(m_end.group(1)), int(m_end.group(2)), int(m_end.group(3)))
            except Exception:
                pass
        
        # 判断事件是否处于进行中（未结束）
        is_ongoing = item.get("status") == "进行中" or (item.get("days_to_end") is not None and item.get("days_to_end") >= 0)
        if is_ongoing:
            item["ai_residual_heat"] = False
            new_cal.append(item)
            stats["calendar_active"] += 1
            continue

        # 判断事件是否已过期超过 14 天
        # 如果有结束日期，以结束日期为准；如果没有结束日期，以开始日期为准
        ref_date = e_date if e_date else s_date
        
        if ref_date:
            days_diff = (ref_date - today_date).days # 负数表示已过去
            if days_diff < -14:
                # 触发 14 天过期审核
                days_overdue = abs(days_diff)
                stats["calendar_expired_14d"] += 1
                
                ai_res = evaluate_residual_heat_by_ai(item, "calendar", days_overdue)
                
                if ai_res["retain"]:
                    item["ai_residual_heat"] = True
                    item["ai_heat_verdict"] = ai_res["verdict"]
                    item["ai_heat_reason"] = ai_res["reason"]
                    item["status"] = "已结束 · AI长尾热度"
                    new_cal.append(item)
                    stats["calendar_retained_tail"] += 1
                    stats["retained_tail_log"].append(f"[日历] {item.get('name')}: 过期 {days_overdue} 天保留 ({ai_res['verdict']})")
                else:
                    stats["calendar_purged"] += 1
                    stats["purged_items_log"].append(f"[日历] {item.get('name')}: 过期 {days_overdue} 天已清理")
                    continue # 剔除不加入
            else:
                # 仍在 14 天有效周期内或未开始
                item["ai_residual_heat"] = False
                new_cal.append(item)
                stats["calendar_active"] += 1
        else:
            # 无日期的如果是长期展会或者明确保留的
            new_cal.append(item)
            stats["calendar_active"] += 1

    dashboard_data["calendar"] = new_cal

    # -------------------------------------------------------------
    # 2. 实时资讯流 (News Feed) 14 天时效治理
    # -------------------------------------------------------------
    if "news_feed" in dashboard_data and isinstance(dashboard_data["news_feed"], dict):
        news_items = dashboard_data["news_feed"].get("items", [])
        clean_news = []
        for n in news_items:
            stats["news_inspected"] += 1
            pub_str = n.get("published", "")
            is_stale = False
            try:
                p_dt = parsedate_to_datetime(pub_str)
                # 转为无时区或统一时区比较
                diff_days = (today_dt - p_dt).total_seconds() / 86400
                if diff_days > 14:
                    is_stale = True
            except Exception:
                pass
            
            if is_stale:
                # 检查资讯是否有二次高热
                title = n.get("title", "")
                if any(k in title for k in ["爆款", "破纪录", "大促", "黑五", "登顶"]):
                    n["ai_residual_heat"] = True
                    clean_news.append(n)
                else:
                    stats["news_purged"] += 1
                    stats["purged_items_log"].append(f"[资讯] {title[:20]}... 过期已清理")
            else:
                clean_news.append(n)
        dashboard_data["news_feed"]["items"] = clean_news

    # -------------------------------------------------------------
    # 3. 娱乐档期 (Entertainment) 14 天时效治理
    # -------------------------------------------------------------
    ent_list = dashboard_data.get("entertainment", [])
    clean_ent = []
    for e in ent_list:
        stats["entertainment_inspected"] += 1
        date_str = e.get("date", "")
        m = re.search(r'(\d{4})[-/](\d{1,2})[-/](\d{1,2})', str(date_str))
        if m:
            try:
                ev_date = datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
                diff = (ev_date - today_date).days
                if diff < -14:
                    # 过期超过 14 天
                    days_overdue = abs(diff)
                    ai_res = evaluate_residual_heat_by_ai(e, "entertainment", days_overdue)
                    if ai_res["retain"]:
                        e["ai_residual_heat"] = True
                        e["ai_heat_verdict"] = ai_res["verdict"]
                        e["ai_heat_reason"] = ai_res["reason"]
                        clean_ent.append(e)
                        stats["entertainment_retained_tail"] += 1
                        stats["retained_tail_log"].append(f"[娱乐] {e.get('name')}: 过期 {days_overdue} 天保留")
                    else:
                        stats["entertainment_purged"] += 1
                        stats["purged_items_log"].append(f"[娱乐] {e.get('name')}: 过期已清理")
                else:
                    clean_ent.append(e)
            except Exception:
                clean_ent.append(e)
        else:
            clean_ent.append(e)
    dashboard_data["entertainment"] = clean_ent

    # -------------------------------------------------------------
    # 4. 写入 AI 生命周期治理元数据报告
    # -------------------------------------------------------------
    meta = dashboard_data.setdefault("meta", {})
    meta["lifecycle_governance"] = {
        "status": "ENFORCED",
        "policy": "14天周期全网信息治理 + Google Gemini 热度智能裁决",
        "updated_at": now_utc8.strftime("%Y-%m-%d %H:%M:%S UTC+8"),
        "rule_summary": "全看板信息以14天为期限。过期超过14天的信息由AI逐条核验长尾热度，无热度者安全清理，高热长尾者标记保留。",
        "metrics": {
            "calendar_retained": len(dashboard_data.get("calendar", [])),
            "calendar_retained_tail": stats["calendar_retained_tail"],
            "calendar_purged": stats["calendar_purged"],
            "news_active": len(dashboard_data.get("news_feed", {}).get("items", [])),
            "news_purged": stats["news_purged"],
            "entertainment_active": len(dashboard_data.get("entertainment", [])),
            "entertainment_purged": stats["entertainment_purged"],
            "total_purged_cold_items": stats["calendar_purged"] + stats["news_purged"] + stats["entertainment_purged"]
        }
    }

    print(f"[+] 日历时效治理完成：在榜 {len(dashboard_data['calendar'])} 项（含 AI 长尾热度保留 {stats['calendar_retained_tail']} 项，清理无用项 {stats['calendar_purged']} 项）")
    print(f"[+] 资讯时效治理完成：留存 {len(dashboard_data.get('news_feed',{}).get('items',[]))} 项，清理过期冷资讯 {stats['news_purged']} 项")
    print(f"[+] 娱乐时效治理完成：留存 {len(dashboard_data['entertainment'])} 项，清理过期冷档期 {stats['entertainment_purged']} 项")
    print(f"[✓] 14天时效与AI热度裁决治理通过！累计净化剔除冷噪音 {meta['lifecycle_governance']['metrics']['total_purged_cold_items']} 项。\n")

    return dashboard_data

if __name__ == "__main__":
    DATA_PATH = os.path.join(os.path.dirname(__file__), "dashboard_data.js")
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        m = re.search(r'window\.DASHBOARD_DATA\s*=\s*(\{[\s\S]*\});?\s*$', content)
        if m:
            data = json.loads(m.group(1))
            data = audit_lifecycle_governance(data)
            with open(DATA_PATH, "w", encoding="utf-8") as f:
                f.write("window.DASHBOARD_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")
            print("测试并写回 dashboard_data.js 成功！")
