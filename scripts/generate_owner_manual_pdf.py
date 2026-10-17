import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing, Rect, Circle, Line, String, Polygon, Group
from PIL import Image as PILImage

def generate_pdf():
    pdf_path = r"docs\THEKKANATH_SOUPARNIKA_OWNER_MANUAL.pdf"
    os.makedirs("docs", exist_ok=True)
    
    # A4: 210 x 297 mm
    # Printable width: 210 - 2*12 = 186 mm
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=12 * mm,
        rightMargin=12 * mm,
        topMargin=10 * mm,
        bottomMargin=10 * mm
    )
    
    content_width = 186 * mm
    
    # Custom Brand Colors
    c_forest = colors.HexColor("#1b3328")
    c_forest_dark = colors.HexColor("#0d1f17")
    c_forest_light = colors.HexColor("#f0fdf4")
    c_forest_border = colors.HexColor("#86efac")
    c_gold = colors.HexColor("#c5a059")
    c_gold_dark = colors.HexColor("#8c671b")
    c_gold_light = colors.HexColor("#fdf8ed")
    c_gold_border = colors.HexColor("#fde68a")
    c_red = colors.HexColor("#dc2626")
    c_red_light = colors.HexColor("#fef2f2")
    c_red_border = colors.HexColor("#fca5a5")
    c_green = colors.HexColor("#16a34a")
    c_blue = colors.HexColor("#0284c7")
    c_blue_light = colors.HexColor("#f0f9ff")
    c_blue_border = colors.HexColor("#bae6fd")
    c_text = colors.HexColor("#1f2937")
    c_muted = colors.HexColor("#4b5563")
    c_card_bg = colors.HexColor("#f8faf9")
    c_border = colors.HexColor("#d5ded8")
    
    # Typography Styles
    style_badge = ParagraphStyle(
        'Badge',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        textColor=c_gold,
        spaceAfter=3,
        textTransform='uppercase'
    )
    
    style_header_title = ParagraphStyle(
        'HeaderTitle',
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.white,
        spaceAfter=3
    )
    
    style_header_sub = ParagraphStyle(
        'HeaderSub',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#e2ebd8")
    )
    
    style_h2 = ParagraphStyle(
        'SectionH2',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_forest,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    style_h3 = ParagraphStyle(
        'SectionH3',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_forest_dark,
        spaceBefore=4,
        spaceAfter=2,
        keepWithNext=True
    )
    
    style_body = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.8,
        textColor=c_text,
        spaceAfter=3
    )
    
    style_body_bold = ParagraphStyle(
        'BodyBold',
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.8,
        textColor=c_forest,
        spaceAfter=3
    )
    
    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=c_text
    )
    
    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )

    style_callout_box = ParagraphStyle(
        'CalloutText',
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=c_text
    )

    style_footer = ParagraphStyle(
        'Footer',
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=c_muted,
        alignment=1
    )

    story = []
    
    def create_page_header(page_num, title, subtitle):
        header_content = [
            [Paragraph(f"THEKKANATH SOUPARNIKA · BUSINESS OWNER'S MANUAL · PAGE {page_num} OF 10", style_badge)],
            [Paragraph(title, style_header_title)],
            [Paragraph(subtitle, style_header_sub)]
        ]
        t = Table(header_content, colWidths=[content_width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), c_forest_dark),
            ('PADDING', (0, 0), (-1, -1), 7),
            ('BOTTOMPADDING', (0, -1), (-1, -1), 8),
            ('LINEBELOW', (0, -1), (-1, -1), 2.5, c_gold),
        ]))
        return t

    def create_footer():
        return Paragraph(
            "Thekkanath Souparnika Hall & Events Venue · Nellikunnu, Thrissur, Kerala 680005 · +91 8129764370 · thekkanathsouparnika@gmail.com",
            style_footer
        )

    def make_screenshot_card(img_filename, target_width_mm=186, max_height_mm=None):
        img_path = os.path.join("docs", "manual_assets", "cropped", img_filename)
        if not os.path.exists(img_path):
            img_path = os.path.join("docs", "manual_assets", img_filename)
            
        with PILImage.open(img_path) as im:
            w, h = im.size
        aspect = h / w
        target_w = target_width_mm * mm
        target_h = target_w * aspect
        if max_height_mm and target_h > max_height_mm * mm:
            target_h = max_height_mm * mm
            target_w = target_h / aspect
        
        img_flowable = RLImage(img_path, width=target_w, height=target_h)
        t = Table([[img_flowable]], colWidths=[target_w])
        t.setStyle(TableStyle([
            ('PADDING', (0, 0), (-1, -1), 0),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#94a3b8")),
        ]))
        return t

    def make_tip_box(title, text, badge_type="tip"):
        if badge_type == "tip":
            bg = c_forest_light
            border = c_forest_border
            title_color = c_forest
            icon_text = "[PRO TIP FOR OWNERS]"
        elif badge_type == "alert":
            bg = c_gold_light
            border = c_gold
            title_color = c_gold_dark
            icon_text = "[IMPORTANT SAFEGUARD]"
        else:
            bg = c_blue_light
            border = c_blue_border
            title_color = c_blue
            icon_text = "[HOW IT WORKS]"

        content = [
            [Paragraph(f"<b>{icon_text} {title}</b><br/>{text}", style_callout_box)]
        ]
        t = Table(content, colWidths=[content_width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg),
            ('BOX', (0, 0), (-1, -1), 1, border),
            ('PADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, -1), (-1, -1), 5),
        ]))
        return t

    # =========================================================================
    # PAGE 1: COVER & EXECUTIVE LIFECYCLE OVERVIEW
    # =========================================================================
    story.append(create_page_header(1, "Thekkanath Souparnika Venue Management System", "Beginner-Friendly Executive Guide for Business Owners, Partners & Operations Staff"))
    story.append(Spacer(1, 6))

    intro_box = [
        [Paragraph("<b>WELCOME TO YOUR AUDITORIUM MANAGEMENT SYSTEM</b><br/>"
                   "This web software has been tailored specifically for <b>Thekkanath Souparnika</b> (Nellikunnu, Thrissur). "
                   "It replaces handwritten paper registers, prevents embarrassing double-bookings, tracks every rupee of guest advance payments, "
                   "and lets prospective hosts in Kerala submit booking inquiries 24/7 with zero commission middlemen.<br/>"
                   "You do not need any coding or technical knowledge to manage your venue. Everything can be operated from any laptop, tablet, or smartphone.", style_body)]
    ]
    t_intro = Table(intro_box, colWidths=[content_width])
    t_intro.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('BOX', (0, 0), (-1, -1), 1, c_border),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_intro)
    story.append(Spacer(1, 6))

    story.append(Paragraph("The Complete 5-Stage Venue Booking Lifecycle", style_h2))
    story.append(Paragraph("Every wedding, reception, or corporate seminar moves through these 5 simple steps:", style_body))

    # VECTOR DIAGRAM: 5-STAGE VENUE LIFECYCLE FLOWCHART
    d_life = Drawing(content_width, 42 * mm)
    d_life.add(Rect(0, 0, content_width, 40 * mm, rx=4, ry=4, fillColor=c_card_bg, strokeColor=c_border, strokeWidth=1))
    
    stages = [
        ("1. INBOUND LEAD", "Guest explores halls &", "submits web request", 20 * mm, c_blue, colors.HexColor("#0284c7")),
        ("2. DIRECT CHAT", "Owner opens WhatsApp", "& discusses pricing", 56 * mm, c_gold, colors.HexColor("#b45309")),
        ("3. LOCK & ADVANCE", "Select date & log token", "booking locked 100%", 92 * mm, c_green, colors.HexColor("#15803d")),
        ("4. STAGING CHECK", "Chiller AC pre-cools,", "audio & mics verified", 128 * mm, c_forest, colors.HexColor("#1b3328")),
        ("5. SETTLEMENT", "Collect final balance", "and issue GST receipt", 164 * mm, colors.HexColor("#7c3aed"), colors.HexColor("#6d28d9")),
    ]
    for title, line1, line2, x_c, bg_c, text_c in stages:
        w_b = 32 * mm
        d_life.add(Rect(x_c - w_b / 2, 4 * mm, w_b, 32 * mm, rx=3, ry=3, fillColor=colors.white, strokeColor=bg_c, strokeWidth=1.2))
        d_life.add(Rect(x_c - w_b / 2, 27 * mm, w_b, 9 * mm, rx=2, ry=2, fillColor=bg_c, strokeColor=None))
        d_life.add(String(x_c, 30.5 * mm, title, fontName="Helvetica-Bold", fontSize=5.5, fillColor=colors.white, textAnchor="middle"))
        d_life.add(String(x_c, 19 * mm, line1, fontName="Helvetica", fontSize=5.5, fillColor=c_text, textAnchor="middle"))
        d_life.add(String(x_c, 12 * mm, line2, fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
        # Arrow connecting to next
        if x_c < 160 * mm:
            d_life.add(Line(x_c + w_b / 2 + 1 * mm, 18 * mm, x_c + w_b / 2 + 3 * mm, 18 * mm, strokeColor=c_gold, strokeWidth=1.2))
            d_life.add(Polygon([x_c + w_b / 2 + 3 * mm, 19.5 * mm, x_c + w_b / 2 + 4.5 * mm, 18 * mm, x_c + w_b / 2 + 3 * mm, 16.5 * mm], fillColor=c_gold, strokeColor=None))

    story.append(d_life)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Key Business Advantages for Venue Owners", style_h2))
    
    ben_rows = [
        [Paragraph("Feature", style_table_header), Paragraph("How It Works for You", style_table_header), Paragraph("Business Benefit", style_table_header)],
        [Paragraph("<b>0% Booking Commission</b>", style_table_cell), Paragraph("Guests enquire and pay directly to your venue bank account or counter QR code.", style_table_cell), Paragraph("<b>Save Rs. 15,000–Rs. 40,000</b> per wedding compared to third-party aggregator portals.", style_table_cell)],
        [Paragraph("<b>Atomic Conflict Lock</b>", style_table_cell), Paragraph("Automatic algorithm prevents double-booking the same hall on the same date/time.", style_table_cell), Paragraph("<b>Zero accidental overlaps</b>—peace of mind even when multiple family members take calls.", style_table_cell)],
        [Paragraph("<b>Dynamic UPI Counter QR</b>", style_table_cell), Paragraph("Displays instantaneous payment QR on venue screen for walk-in deposits.", style_table_cell), Paragraph("<b>0% bank gateway MDR fees</b>; money clears straight into your HDFC current account.", style_table_cell)],
        [Paragraph("<b>Grounded AI Assistant</b>", style_table_cell), Paragraph("Ask questions in plain English: 'What are my bookings this week?'", style_table_cell), Paragraph("Get immediate answers, ledger calculations, and drafted WhatsApp messages in seconds.", style_table_cell)]
    ]
    t_ben = Table(ben_rows, colWidths=[42 * mm, 82 * mm, 62 * mm])
    t_ben.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_ben)
    story.append(Spacer(1, 6))

    story.append(make_tip_box("Quick Web Links", "Public Website: <code>http://localhost:5173/</code> | Management Dashboard: <code>http://localhost:5173/admin</code> | Works in Google Chrome on any PC, Android phone, iPhone, or iPad.", "how"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 2: CHAPTER 1 — THE PUBLIC WEBSITE
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(2, "Chapter 1: The Public Website (Customer Experience)", "What Guests See When Searching for Thekkanath Souparnika Online"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. Public Homepage & Transparent Venue Showcase", style_h2))
    story.append(Paragraph("Your public portal gives potential clients a polished first impression. Over 80% of Kerala wedding inquiries originate from mobile phones:", style_body))

    # SCREENSHOT 1: HOME PAGE
    story.append(make_screenshot_card("02_home_page.png", target_width_mm=186, max_height_mm=68))
    story.append(Spacer(1, 4))

    # ANNOTATIONS TABLE
    anno_rows = [
        [Paragraph("<b>[1] Instant WhatsApp Connect:</b> Button in top header connects guests directly to management WhatsApp without typing phone numbers.", style_table_cell)],
        [Paragraph("<b>[2] Real Capacity Stats:</b> Shows 1200+ floating capacity, 40-50 car parking on PWD road, and Rs. 0 booking fees.", style_table_cell)],
        [Paragraph("<b>[3] Interactive Hall Explorer:</b> Guests toggle between Stage Hall (Ground Floor AC), Welcome Hall, Dining Hall, and Open Hall Terrace.", style_table_cell)]
    ]
    t_anno = Table(anno_rows, colWidths=[content_width])
    t_anno.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 2.5),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_anno)
    story.append(Spacer(1, 5))

    story.append(Paragraph("2. The 3-Step Online Enquiry Wizard", style_h2))
    story.append(Paragraph("When guests click 'Enquire Now', a friendly 3-step wizard collects their exact event requirements:", style_body))

    # TWO COLUMNS: STEP 1 WIZARD & CONFIRMATION
    img_step1 = make_screenshot_card("03_enquire_step1.png", target_width_mm=90, max_height_mm=62)
    img_step3 = make_screenshot_card("04_enquire_success.png", target_width_mm=90, max_height_mm=62)
    
    t_wizard = Table([[img_step1, img_step3]], colWidths=[93 * mm, 93 * mm])
    t_wizard.setStyle(TableStyle([
        ('PADDING', (0, 0), (-1, -1), 0),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t_wizard)
    story.append(Spacer(1, 4))

    wiz_expl = [
        [Paragraph("<b>LEFT: Step 1 (Event Details)</b><br/>Host selects Event Type (Wedding, Reception, Seminar), desired Date, preferred Hall, and expected Guest Count (up to 300).", style_table_cell),
         Paragraph("<b>RIGHT: Step 3 (Instant Reference)</b><br/>System issues unique Reference Code (e.g. <code>TS-2026-ENQ-9182</code>). The lead immediately appears in your Admin Inquiries board!", style_table_cell)]
    ]
    t_wiz_expl = Table(wiz_expl, colWidths=[93 * mm, 93 * mm])
    t_wiz_expl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_wiz_expl)
    story.append(Spacer(1, 4))

    story.append(make_tip_box("Automatic Lead Generation", "You never have to manually retype website inquiries. Every submission lands directly in <b>/admin/enquiries</b> with the host's phone number ready for a 1-tap WhatsApp chat!", "tip"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 3: CHAPTER 2 — ADMIN DASHBOARD & STAFF ROLES
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(3, "Chapter 2: Daily Operations Command Center", "Understanding the Overview Dashboard, Morning Metrics & Staff Permissions"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. The Admin Overview Dashboard (/admin)", style_h2))
    story.append(Paragraph("This is your daily morning command center. Open this screen every morning to inspect occupancy, revenue, and pending tasks:", style_body))

    # SCREENSHOT: ADMIN DASHBOARD
    story.append(make_screenshot_card("01_admin_dashboard.png", target_width_mm=186, max_height_mm=74))
    story.append(Spacer(1, 4))

    dash_annos = [
        [Paragraph("<b>[1] KPI Metric Cards:</b> Shows Total Collected Revenue, Active Confirmed Events, Open Inquiries requiring attention, and Monthly Hall Occupancy.", style_table_cell)],
        [Paragraph("<b>[2] Quick Action Bar:</b> 1-click buttons to create a <b>New Booking</b> (when taking reservations over phone) or <b>Log an Expense</b> (cash payouts).", style_table_cell)],
        [Paragraph("<b>[3] Revenue & Hall Utilization Charts:</b> Visual bar graphs showing which halls are earning the most revenue this season.", style_table_cell)],
        [Paragraph("<b>[4] Upcoming Events Timeline:</b> Shows events scheduled for today, tomorrow, and this weekend with host contact numbers.", style_table_cell)]
    ]
    t_dash_annos = Table(dash_annos, colWidths=[content_width])
    t_dash_annos.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 2.5),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_dash_annos)
    story.append(Spacer(1, 5))

    story.append(Paragraph("2. Staff Role Switcher & Security Permissions", style_h2))
    story.append(Paragraph("To ensure operational security, staff members only see the tools relevant to their job duties:", style_body))

    role_table = [
        [Paragraph("Role Title", style_table_header), Paragraph("Allowed Permissions & Actions", style_table_header), Paragraph("Best Assigned To", style_table_header)],
        [Paragraph("<b>Super Admin</b>", style_table_cell), Paragraph("Full access: All bookings, finance ledgers, tax settings, staff management, and audit logs.", style_table_cell), Paragraph("Venue Proprietor / Managing Partner", style_table_cell)],
        [Paragraph("<b>Booking Manager</b>", style_table_cell), Paragraph("Customer inquiries pipeline, creating bookings, taking advances, checking calendar availability.", style_table_cell), Paragraph("Front Office Manager / Receptionist", style_table_cell)],
        [Paragraph("<b>Operations Manager</b>", style_table_cell), Paragraph("Event staging checklists, AC pre-cooling, audio check, cleaning logs, maintenance blackout creation.", style_table_cell), Paragraph("Hall Supervisor / Staging Coordinator", style_table_cell)],
        [Paragraph("<b>Accounts Officer</b>", style_table_cell), Paragraph("Recording advance payments, counter cash collections, operational expense logging, CSV tax exports.", style_table_cell), Paragraph("Accountant / Cashier", style_table_cell)]
    ]
    t_roles = Table(role_table, colWidths=[38 * mm, 98 * mm, 50 * mm])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_roles)
    story.append(Spacer(1, 4))

    story.append(make_tip_box("Switching Roles for Testing", "Click your profile avatar in the bottom-left sidebar of <code>/admin</code> to test the screen as a Booking Manager or Operations Supervisor anytime!", "how"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 4: CHAPTER 3 — CUSTOMER ENQUIRIES PIPELINE
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(4, "Chapter 3: Managing Inbound Leads & Enquiries", "How to Review Inquiries, Chat on WhatsApp & Convert Prospects into Bookings"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. The Inquiries Pipeline (/admin/enquiries)", style_h2))
    story.append(Paragraph("Every inquiry submitted online or noted by phone appears here in real time. Follow this pipeline to convert leads:", style_body))

    # SCREENSHOT: ENQUIRIES PIPELINE
    story.append(make_screenshot_card("06_enquiries_pipeline.png", target_width_mm=186, max_height_mm=74))
    story.append(Spacer(1, 4))

    story.append(Paragraph("2. Simple 4-Step Lead Conversion Workflow", style_h2))

    enq_steps = [
        [Paragraph("<b>Step 1: Check the 'New' Filter</b><br/>"
                   "Click <b>Enquiries</b> in the left sidebar. Inquiries with yellow <b>'New'</b> badges are prospective hosts waiting for your response. Check this twice daily (9:00 AM and 3:00 PM).", style_table_cell)],
        [Paragraph("<b>Step 2: 1-Click WhatsApp Follow-Up</b><br/>"
                   "Tap the green <b>WhatsApp</b> icon directly on the card. WhatsApp Web or your phone app will open with a polite, pre-formatted message introducing Thekkanath Souparnika and confirming their requested date.", style_table_cell)],
        [Paragraph("<b>Step 3: Record Visit & Customer Notes</b><br/>"
                   "When the bride or groom's parents visit the hall to inspect stage lighting and parking, open their card and type notes (e.g., <i>'Family visited; agreed on Stage Hall + Dining Hall; requested 200 chairs'</i>).", style_table_cell)],
        [Paragraph("<b>Step 4: 1-Click 'Convert to Booking'</b><br/>"
                   "Once the client confirms, simply click the green <b>'Convert to Booking'</b> button. The system transfers the customer's name, phone, chosen hall, and event date straight into the reservation engine—zero retyping required!", style_table_cell)]
    ]
    t_enq_steps = Table(enq_steps, colWidths=[content_width])
    t_enq_steps.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_enq_steps)
    story.append(Spacer(1, 4))

    enq_statuses = [
        [Paragraph("Badge", style_table_header), Paragraph("Meaning", style_table_header), Paragraph("What Action You Should Take", style_table_header)],
        [Paragraph("<font color='#b45309'><b>NEW</b></font>", style_table_cell), Paragraph("Fresh inquiry submitted by guest.", style_table_cell), Paragraph("Call or send WhatsApp within 2 hours.", style_table_cell)],
        [Paragraph("<font color='#0284c7'><b>CONTACTED</b></font>", style_table_cell), Paragraph("Staff have spoken with the family.", style_table_cell), Paragraph("Invite them for venue walkthrough.", style_table_cell)],
        [Paragraph("<font color='#16a34a'><b>CONVERTED</b></font>", style_table_cell), Paragraph("Host paid advance deposit.", style_table_cell), Paragraph("Converted to official confirmed booking.", style_table_cell)],
        [Paragraph("<font color='#6b7280'><b>ARCHIVED</b></font>", style_table_cell), Paragraph("Host cancelled or booked elsewhere.", style_table_cell), Paragraph("Retained in system for future marketing.", style_table_cell)]
    ]
    t_enq_stat = Table(enq_statuses, colWidths=[30 * mm, 60 * mm, 96 * mm])
    t_enq_stat.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 2.5),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_enq_stat)
    story.append(Spacer(1, 4))

    story.append(make_tip_box("Lead Response Speed", "Statistics show that wedding inquiries responded to within <b>30 minutes</b> are <b>4 times more likely</b> to book. Use the 1-click WhatsApp button for swift, personal replies!", "tip"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 5: CHAPTER 4 — THE BOOKING ENGINE & CONFLICT ENGINE
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(5, "Chapter 4: The Booking Engine & Conflict Safeguard", "How to Take Phone Reservations in 60 Seconds with Zero Double-Bookings"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. Taking a Phone Reservation in 60 Seconds", style_h2))
    story.append(Paragraph("When a customer calls your office or visits in person, click the <b>'New Booking'</b> button to open the booking dialog:", style_body))

    # TWO COLUMNS: MODAL IMAGE (LEFT) & STEP-BY-STEP GUIDE (RIGHT)
    img_modal = make_screenshot_card("08_new_booking_modal.png", target_width_mm=82, max_height_mm=95)
    
    bkg_guide = [
        [Paragraph("<b>HOW TO FILL THE FORM:</b>", style_body_bold)],
        [Paragraph("<b>1. Customer Name & Phone:</b><br/>Type the primary host's full name and WhatsApp mobile number.", style_table_cell)],
        [Paragraph("<b>2. Select Hall:</b><br/>Choose Stage Hall (AC), Welcome Hall, Dining Hall, or Open Hall Terrace.", style_table_cell)],
        [Paragraph("<b>3. Event Date & Slot:</b><br/>Select the date and pick the time window (e.g. <code>09:00 AM – 02:00 PM</code>).", style_table_cell)],
        [Paragraph("<b>4. Total Agreed Amount & Advance:</b><br/>Type total rental fee (e.g. Rs. 35,000) and token advance paid (e.g. Rs. 10,000).", style_table_cell)],
        [Paragraph("<b>5. Click 'Verify & Confirm Booking':</b><br/>The system runs an instant conflict check and creates the official reservation!", style_table_cell)]
    ]
    t_bkg_guide = Table(bkg_guide, colWidths=[98 * mm])
    t_bkg_guide.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
    ]))

    t_bkg_layout = Table([[img_modal, t_bkg_guide]], colWidths=[85 * mm, 101 * mm])
    t_bkg_layout.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_bkg_layout)
    story.append(Spacer(1, 4))

    story.append(Paragraph("2. The Atomic Conflict Prevention Safeguard", style_h2))
    story.append(Paragraph("What happens if two staff members attempt to book Stage Hall for the same date at the exact same moment?", style_body))

    # VECTOR DIAGRAM: CONFLICT SAFEGUARD
    d_conf = Drawing(content_width, 28 * mm)
    d_conf.add(Rect(0, 0, content_width, 26 * mm, rx=3, ry=3, fillColor=c_card_bg, strokeColor=c_border, strokeWidth=1))
    
    # Step 1: Staff submits
    d_conf.add(Rect(6 * mm, 4 * mm, 48 * mm, 18 * mm, rx=2, ry=2, fillColor=colors.white, strokeColor=c_forest, strokeWidth=1))
    d_conf.add(String(30 * mm, 15 * mm, "Staff Submits Booking", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_forest, textAnchor="middle"))
    d_conf.add(String(30 * mm, 9 * mm, "Date, Hall & Time Slot", fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
    # Arrow
    d_conf.add(Line(54 * mm, 13 * mm, 62 * mm, 13 * mm, strokeColor=c_gold, strokeWidth=1.5))
    
    # Step 2: Conflict Check
    d_conf.add(Rect(62 * mm, 4 * mm, 56 * mm, 18 * mm, rx=2, ry=2, fillColor=colors.HexColor("#fef3c7"), strokeColor=colors.HexColor("#f59e0b"), strokeWidth=1))
    d_conf.add(String(90 * mm, 15 * mm, "Mathematical Conflict Engine", fontName="Helvetica-Bold", fontSize=6.5, fillColor=colors.HexColor("#92400e"), textAnchor="middle"))
    d_conf.add(String(90 * mm, 9 * mm, "Checks Bookings + Holds + Maintenance", fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
    # Arrow
    d_conf.add(Line(118 * mm, 13 * mm, 126 * mm, 13 * mm, strokeColor=c_gold, strokeWidth=1.5))
    
    # Step 3: Result
    d_conf.add(Rect(126 * mm, 4 * mm, 54 * mm, 18 * mm, rx=2, ry=2, fillColor=c_forest_light, strokeColor=c_forest_border, strokeWidth=1))
    d_conf.add(String(153 * mm, 15 * mm, "Overlap = 0: Confirmed! [OK]", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_green, textAnchor="middle"))
    d_conf.add(String(153 * mm, 9 * mm, "Overlap > 0: Rejected + Alert! [X]", fontName="Helvetica-Bold", fontSize=5.5, fillColor=c_red, textAnchor="middle"))

    story.append(d_conf)
    story.append(Spacer(1, 4))

    story.append(make_tip_box("Tentative Holds for Astrological Timings", "Kerala families often need 24–48 hours to confirm auspicious Muhurtham timings with their astrologer. Create a booking with status <b>'Tentative Hold'</b>. The system holds the date and sends an alert before release!", "alert"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 6: CHAPTER 5 — VISUAL AVAILABILITY CALENDAR
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(6, "Chapter 5: Visual Calendar & Space Availability", "Color-Coded Month & Week View: Checking Available Dates in 5 Seconds"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. The Monthly Calendar View (/admin/calendar)", style_h2))
    story.append(Paragraph("When prospective clients call asking 'Is Stage Hall available on November 15?', use the calendar for immediate visual verification:", style_body))

    # SCREENSHOT: CALENDAR
    story.append(make_screenshot_card("09_calendar_view.png", target_width_mm=186, max_height_mm=78))
    story.append(Spacer(1, 4))

    cal_annos = [
        [Paragraph("<b>[1] Hall Filter Dropdown:</b> Filter by All Halls, or isolate Stage Hall, Welcome Hall, Dining Hall, or Open Hall Terrace.", style_table_cell)],
        [Paragraph("<b>[2] Color-Coded Event Pills:</b> Green indicates Confirmed Booking; Gold indicates Tentative Hold; Red indicates Maintenance Closure.", style_table_cell)],
        [Paragraph("<b>[3] Event Quick-Inspection:</b> Click any event pill to view customer name, phone number, balance due, and catering notes.", style_table_cell)],
        [Paragraph("<b>[4] Date Navigation:</b> Fast-forward to peak wedding seasons (Chingam, Dhanu, Medam) with single clicks.", style_table_cell)]
    ]
    t_cal_annos = Table(cal_annos, colWidths=[content_width])
    t_cal_annos.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 2.5),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_cal_annos)
    story.append(Spacer(1, 5))

    story.append(Paragraph("2. Color-Coding Reference Guide", style_h2))

    color_guide = [
        [Paragraph("Color Pill", style_table_header), Paragraph("Status Name", style_table_header), Paragraph("Operational Meaning & Availability", style_table_header)],
        [Paragraph("<font color='#16a34a'><b>■ GREEN</b></font>", style_table_cell), Paragraph("<b>Confirmed Booking</b>", style_table_cell), Paragraph("Advance paid, date firmly locked. Hall is completely unavailable for other bookings.", style_table_cell)],
        [Paragraph("<font color='#d97706'><b>■ GOLD</b></font>", style_table_cell), Paragraph("<b>Tentative Hold</b>", style_table_cell), Paragraph("Temporary 48-hour reservation awaiting token payment. Can be released if client cancels.", style_table_cell)],
        [Paragraph("<font color='#dc2626'><b>■ RED</b></font>", style_table_cell), Paragraph("<b>Maintenance Blackout</b>", style_table_cell), Paragraph("Hall closed for marble polishing, painting, or AC servicing. Cannot be booked.", style_table_cell)],
        [Paragraph("<font color='#94a3b8'><b>□ WHITE / CLEAR</b></font>", style_table_cell), Paragraph("<b>Open Available Date</b>", style_table_cell), Paragraph("Space is 100% available for reservation. Safe to quote standard pricing.", style_table_cell)]
    ]
    t_colors = Table(color_guide, colWidths=[32 * mm, 48 * mm, 106 * mm])
    t_colors.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_colors)
    story.append(Spacer(1, 4))

    story.append(make_tip_box("Filtering by Hall", "Always select a specific hall from the filter when a client asks about availability. Multiple events can run simultaneously in different halls (e.g. Stage Hall wedding while Welcome Hall hosts a reception)!", "tip"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 7: CHAPTER 6 — EVENT OPERATIONS & MAINTENANCE
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(7, "Chapter 6: Event Staging & Maintenance Protocols", "Delivering 5-Star Hospitality: Pre-Event Checklist & Maintenance Closures"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. Event Operations & Staging Checklists (/admin/operations)", style_h2))
    story.append(Paragraph("Flawless execution requires disciplined preparation. Your operations team follows this digital checklist for every function:", style_body))

    # SCREENSHOT: OPERATIONS
    story.append(make_screenshot_card("10_operations_checklists.png", target_width_mm=186, max_height_mm=74))
    story.append(Spacer(1, 4))

    story.append(Paragraph("2. Time-Critical Event Preparation Protocol", style_h2))

    ops_protocol = [
        [Paragraph("Countdown", style_table_header), Paragraph("Required Action Item", style_table_header), Paragraph("Responsible Staff", style_table_header), Paragraph("Check Item", style_table_header)],
        [Paragraph("<b>T - 2 Hours</b>", style_table_cell), Paragraph("<b>Sound & PA System Verification:</b> Test wireless microphones, replace AA batteries, check podium acoustic levels.", style_table_cell), Paragraph("AV Technician", style_table_cell), Paragraph("[  ] Done", style_table_cell)],
        [Paragraph("<b>T - 1 Hour</b>", style_table_cell), Paragraph("<b>AC Pre-Cooling Activation:</b> Switch on Stage Hall central AC chillers to bring hall to 22°C before guest arrival.", style_table_cell), Paragraph("HVAC Supervisor", style_table_cell), Paragraph("[  ] Done", style_table_cell)],
        [Paragraph("<b>T - 30 Mins</b>", style_table_cell), Paragraph("<b>Dressing Rooms & Generator:</b> Unlock VIP bride/groom suites; verify standby diesel generator fuel level.", style_table_cell), Paragraph("Operations Manager", style_table_cell), Paragraph("[  ] Done", style_table_cell)],
        [Paragraph("<b>Post-Event</b>", style_table_cell), Paragraph("<b>Dining & Sanitation:</b> Clear banquet tables, sanitize handwash stations, inspect hall for forgotten guest items.", style_table_cell), Paragraph("Cleaning Supervisor", style_table_cell), Paragraph("[  ] Done", style_table_cell)]
    ]
    t_ops = Table(ops_protocol, colWidths=[24 * mm, 98 * mm, 44 * mm, 20 * mm])
    t_ops.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_ops)
    story.append(Spacer(1, 5))

    story.append(Paragraph("3. Scheduled Maintenance Blackouts (/admin/maintenance)", style_h2))
    story.append(Paragraph("When scheduling annual floor polishing, electrical revamping, or repainting, navigate to <b>Maintenance</b> and click <b>'New Blackout Block'</b>:", style_body))

    maint_steps = [
        [Paragraph("<b>1. Pick Hall:</b> Select which specific space is being closed (e.g. Open Hall Terrace).<br/>"
                   "<b>2. Set Start & End Dates:</b> The conflict engine immediately blocks those dates from staff bookings and public web inquiries.<br/>"
                   "<b>3. Reason & Contractor:</b> Note the vendor performing the work (e.g. <i>'Marble floor crystalline polishing — Thrissur Floors'</i>).", style_table_cell)]
    ]
    t_maint = Table(maint_steps, colWidths=[content_width])
    t_maint.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_maint)
    story.append(Spacer(1, 4))

    story.append(make_tip_box("Summer AC Pre-Cooling", "During hot Thrissur summer months (March–May), always pre-cool the Stage Hall a full <b>1 hour before guests enter</b>. A pre-cooled hall maintains a comfortable 22°C even when filled with 300 guests!", "tip"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 8: CHAPTER 7 — FINANCE, PAYMENTS & 0% FEE UPI QR
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(8, "Chapter 7: Finance, Billing & Counter Payments", "Tracking Cash Collections, 0% Fee UPI QR Codes & Tax Exports"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. The Finance Dashboard & Ledger (/admin/finance)", style_h2))
    story.append(Paragraph("Maintain total financial control. Track advances, balances due, operational expenses, and net profit with zero discrepancies:", style_body))

    # SCREENSHOT: FINANCE
    story.append(make_screenshot_card("11_finance_ledger.png", target_width_mm=186, max_height_mm=74))
    story.append(Spacer(1, 4))

    story.append(Paragraph("2. Zero-Fee Dynamic UPI QR Codes for Counter Payments", style_h2))
    story.append(Paragraph("When clients visit the venue office to pay their advance token, you do not need an expensive card swiping machine or payment gateway:", style_body))

    # VECTOR DIAGRAM: 0% UPI FLOW
    d_upi = Drawing(content_width, 26 * mm)
    d_upi.add(Rect(0, 0, content_width, 24 * mm, rx=3, ry=3, fillColor=c_card_bg, strokeColor=c_border, strokeWidth=1))
    
    d_upi.add(Rect(6 * mm, 3 * mm, 50 * mm, 18 * mm, rx=2, ry=2, fillColor=colors.white, strokeColor=c_forest, strokeWidth=1))
    d_upi.add(String(31 * mm, 14 * mm, "1. Staff Generates QR", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_forest, textAnchor="middle"))
    d_upi.add(String(31 * mm, 8 * mm, "Amount: Rs. 15,000 | Ref: BKG-003", fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
    
    d_upi.add(Line(56 * mm, 12 * mm, 66 * mm, 12 * mm, strokeColor=c_gold, strokeWidth=1.5))
    
    d_upi.add(Rect(66 * mm, 3 * mm, 52 * mm, 18 * mm, rx=2, ry=2, fillColor=colors.HexColor("#fef3c7"), strokeColor=colors.HexColor("#f59e0b"), strokeWidth=1))
    d_upi.add(String(92 * mm, 14 * mm, "2. Guest Scans Phone", fontName="Helvetica-Bold", fontSize=6.5, fillColor=colors.HexColor("#92400e"), textAnchor="middle"))
    d_upi.add(String(92 * mm, 8 * mm, "Google Pay, PhonePe, Paytm", fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
    
    d_upi.add(Line(118 * mm, 12 * mm, 128 * mm, 12 * mm, strokeColor=c_gold, strokeWidth=1.5))
    
    d_upi.add(Rect(128 * mm, 3 * mm, 52 * mm, 18 * mm, rx=2, ry=2, fillColor=c_forest_light, strokeColor=c_forest_border, strokeWidth=1))
    d_upi.add(String(154 * mm, 14 * mm, "3. Zero-Fee Settlement", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_green, textAnchor="middle"))
    d_upi.add(String(154 * mm, 8 * mm, "0% MDR · Direct to HDFC Bank", fontName="Helvetica-Bold", fontSize=5.5, fillColor=c_forest, textAnchor="middle"))

    story.append(d_upi)
    story.append(Spacer(1, 4))

    story.append(Paragraph("3. Step-by-Step Payment & Accounting Actions", style_h2))

    fin_actions = [
        [Paragraph("Action", style_table_header), Paragraph("Exact Button to Click", style_table_header), Paragraph("What It Does for You", style_table_header)],
        [Paragraph("<b>Record Advance</b>", style_table_cell), Paragraph("Click <b>'Record Payment Receipt'</b> in Finance.", style_table_cell), Paragraph("Logs advance amount against the booking; updates customer balance due automatically.", style_table_cell)],
        [Paragraph("<b>Log Venue Expense</b>", style_table_cell), Paragraph("Click <b>'Log Operational Expense'</b> in Finance.", style_table_cell), Paragraph("Records daily costs (diesel, electricity bill, casual labour) to compute net profitability.", style_table_cell)],
        [Paragraph("<b>Export for CA / Tax</b>", style_table_cell), Paragraph("Click <b>'Export Financial Ledger (CSV)'</b>.", style_table_cell), Paragraph("Downloads complete transaction spreadsheet formatted for your Chartered Accountant.", style_table_cell)]
    ]
    t_fin = Table(fin_actions, colWidths=[36 * mm, 62 * mm, 88 * mm])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_fin)
    story.append(Spacer(1, 4))

    story.append(make_tip_box("0% Payment Gateway MDR Savings", "Traditional online card gateways charge 2% to 3% fees. On a Rs. 50,000 wedding booking, that loses you Rs. 1,500 per event! Using the built-in dynamic UPI QR costs <b>Rs. 0 in fees</b>—100% of the money stays in your account.", "alert"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 9: CHAPTER 8 — AI COPILOT & SETTINGS
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(9, "Chapter 8: Grounded AI Copilot & System Settings", "Your 24/7 Intelligent Venue Assistant & Configuration Settings"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. The Grounded AI Management Copilot (/admin/ai)", style_h2))
    story.append(Paragraph("The system includes an intelligent assistant that understands your auditorium records. Ask plain-English questions:", style_body))

    # SCREENSHOT: AI COPILOT
    story.append(make_screenshot_card("12_ai_copilot.png", target_width_mm=186, max_height_mm=74))
    story.append(Spacer(1, 4))

    ai_prompts = [
        [Paragraph("Sample Question You Can Type or Speak", style_table_header), Paragraph("What the AI Instantly Answers", style_table_header)],
        [Paragraph("<i>'What is our total revenue collected this month?'</i>", style_table_cell), Paragraph("Sums all cash, UPI, and bank receipts; computes outstanding balances.", style_table_cell)],
        [Paragraph("<i>'Are there any booking conflicts for next Sunday?'</i>", style_table_cell), Paragraph("Scans Stage Hall, Welcome Hall, and Dining Hall for overlapping reservations.", style_table_cell)],
        [Paragraph("<i>'Draft a courteous WhatsApp message confirming booking TS-2026-003.'</i>", style_table_cell), Paragraph("Creates polite, professional Malayalam or English message ready to copy & paste.", style_table_cell)],
        [Paragraph("<i>'What are the acoustic considerations for Open Hall?'</i>", style_table_cell), Paragraph("Summarizes ceiling fan noise, open cross-breeze, and speaker placement guidelines.", style_table_cell)]
    ]
    t_ai = Table(ai_prompts, colWidths=[90 * mm, 96 * mm])
    t_ai.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_ai)
    story.append(Spacer(1, 5))

    story.append(Paragraph("2. Venue Settings & Security Audit Trail (/admin/settings & /admin/audit)", style_h2))

    set_info = [
        [Paragraph("<b>VENUE SETTINGS (/admin/settings):</b><br/>"
                   "• <b>Contact Info:</b> Update phone numbers (+91 8129764370) and email anytime.<br/>"
                   "• <b>Base Rental Rates:</b> Adjust seasonal pricing for Stage Hall, Dining Hall, and packages.<br/>"
                   "• <b>Bank Settlement:</b> Configure current account details and official UPI VPA for receipts.", style_table_cell),
         Paragraph("<b>AUDIT SECURITY LOG (/admin/audit):</b><br/>"
                   "• <b>Tamper-Proof Records:</b> Every payment recorded, booking cancelled, or setting changed is saved with staff name and exact timestamp.<br/>"
                   "• <b>Complete Accountability:</b> Eliminates disputes regarding who took an advance or edited dates.", style_table_cell)]
    ]
    t_set = Table(set_info, colWidths=[93 * mm, 93 * mm])
    t_set.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_set)
    story.append(Spacer(1, 4))

    story.append(make_tip_box("Data Privacy & Security", "All venue records, host telephone numbers, and financial receipts are stored in an encrypted database. Backups occur automatically every day—your data is 100% secure.", "how"))
    story.append(Spacer(1, 8))
    story.append(create_footer())

    # =========================================================================
    # PAGE 10: CHAPTER 9 — OWNER'S DAILY ROUTINE & QUICK REFERENCE
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(10, "Chapter 9: Owner's Daily Routine & Quick Reference", "The 5-Minute Morning Routine, Common Scenarios & Emergency Support"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. The 5-Minute Daily Routine for Venue Owners", style_h2))
    story.append(Paragraph("Follow this simple 4-step checklist every morning to maintain complete operational control:", style_body))

    routine_items = [
        [Paragraph("Time", style_table_header), Paragraph("Daily Morning Action Item", style_table_header), Paragraph("Where to Look", style_table_header), Paragraph("Status", style_table_header)],
        [Paragraph("<b>09:00 AM</b>", style_table_cell), Paragraph("<b>Review Inbound Enquiries:</b> Check for new web leads. Tap WhatsApp to greet prospects.", style_table_cell), Paragraph("<code>/admin/enquiries</code>", style_table_cell), Paragraph("[  ] Done", style_table_cell)],
        [Paragraph("<b>09:30 AM</b>", style_table_cell), Paragraph("<b>Verify Today's Function:</b> Ensure AC pre-cooling, audio mics, and dressing rooms are ready.", style_table_cell), Paragraph("<code>/admin/operations</code>", style_table_cell), Paragraph("[  ] Done", style_table_cell)],
        [Paragraph("<b>12:00 PM</b>", style_table_cell), Paragraph("<b>Check Expiring Holds:</b> Follow up on 48-hr tentative holds to collect token advance.", style_table_cell), Paragraph("<code>/admin/bookings</code>", style_table_cell), Paragraph("[  ] Done", style_table_cell)],
        [Paragraph("<b>05:00 PM</b>", style_table_cell), Paragraph("<b>Reconcile Daily Cash:</b> Confirm cash drawer matches the receipts logged in Finance.", style_table_cell), Paragraph("<code>/admin/finance</code>", style_table_cell), Paragraph("[  ] Done", style_table_cell)]
    ]
    t_routine = Table(routine_items, colWidths=[20 * mm, 102 * mm, 44 * mm, 20 * mm])
    t_routine.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_routine)
    story.append(Spacer(1, 5))

    story.append(Paragraph("2. Common Real-World Scenarios FAQ", style_h2))

    faq_items = [
        [Paragraph("<b>Q: What if a client calls to postpone their wedding to a new date?</b><br/>"
                   "<b>A:</b> Open <code>/admin/bookings</code>, click on their booking card, and select the new date. The conflict engine will verify availability. If the new date is clear, click Save—the old date is automatically freed up for other clients!", style_table_cell)],
        [Paragraph("<b>Q: Can I use this software on my Android phone or iPhone?</b><br/>"
                   "<b>A:</b> Absolutely! Open Chrome or Safari on your phone, visit the website, and log into <code>/admin</code>. The entire interface rearranges into a mobile-friendly view.", style_table_cell)],
        [Paragraph("<b>Q: What if our office internet temporarily disconnects?</b><br/>"
                   "<b>A:</b> The system runs on high-speed cloud infrastructure. You can immediately open the admin panel on your mobile phone via cellular 4G/5G data with zero downtime.", style_table_cell)]
    ]
    t_faq = Table(faq_items, colWidths=[content_width])
    t_faq.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
    ]))
    story.append(t_faq)
    story.append(Spacer(1, 5))

    story.append(Paragraph("3. Venue Credentials & Technical Support Protocol", style_h2))

    contact_box = [
        [Paragraph("<b>THEKKANATH SOUPARNIKA AUDITORIUM & EVENTS VENUE</b><br/>"
                   "• <b>Address:</b> Nellikunnu, Thrissur, Kerala — 680005 (PWD Road Access, 40–50 Car Parking)<br/>"
                   "• <b>Official Telephone:</b> +91 8129764370 &nbsp;|&nbsp; <b>Email:</b> thekkanathsouparnika@gmail.com<br/>"
                   "• <b>Application Deployment:</b> Hosted on High-Speed Edge CDN with Automated Daily Database Snapshots<br/>"
                   "<i>Keep this manual printed in the venue management office for quick staff reference and training.</i>", style_body)]
    ]
    t_contact = Table(contact_box, colWidths=[content_width])
    t_contact.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_gold_light),
        ('BOX', (0, 0), (-1, -1), 1, c_gold),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_contact)
    story.append(Spacer(1, 8))
    story.append(create_footer())

    doc.build(story)
    print(f"Generated 10-Page Owner Manual successfully at {pdf_path}")

if __name__ == '__main__':
    generate_pdf()
