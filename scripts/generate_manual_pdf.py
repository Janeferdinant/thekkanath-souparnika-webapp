import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing, Rect, Circle, Line, String, Polygon

def generate_pdf():
    pdf_path = r"docs\THEKKANATH_SOUPARNIKA_360_PHOTOSPHERE_MANUAL.pdf"
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
    c_red = colors.HexColor("#dc2626")
    c_red_light = colors.HexColor("#fef2f2")
    c_red_border = colors.HexColor("#fca5a5")
    c_green = colors.HexColor("#16a34a")
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
        fontSize=16,
        leading=19,
        textColor=colors.white,
        spaceAfter=3
    )
    
    style_header_sub = ParagraphStyle(
        'HeaderSub',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#e2ebd8")
    )
    
    style_h2 = ParagraphStyle(
        'SectionH2',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_forest,
        spaceBefore=7,
        spaceAfter=4,
        keepWithNext=True
    )
    
    style_body = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_text,
        spaceAfter=4
    )
    
    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=c_text
    )
    
    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.white
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
    
    def create_page_header(page_num, subtitle):
        header_content = [
            [Paragraph(f"THEKKANATH SOUPARNIKA · 360° FIELD OPERATIONS MANUAL · PAGE {page_num} OF 3", style_badge)],
            [Paragraph("Android 360° Photo Sphere Capture Protocol", style_header_title)],
            [Paragraph(subtitle, style_header_sub)]
        ]
        t = Table(header_content, colWidths=[content_width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), c_forest_dark),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, -1), (-1, -1), 9),
            ('LINEBELOW', (0, -1), (-1, -1), 2.5, c_gold),
        ]))
        return t

    def create_footer():
        return Paragraph(
            "Thekkanath Souparnika Hall & Events Venue · Nellikunnu, Thrissur, Kerala 680005 · +91 8129764370 · thekkanathsouparnika@gmail.com",
            style_footer
        )

    # =========================================================================
    # PAGE 1: CORE PRINCIPLES & VIEWFINDER GUIDE
    # =========================================================================
    story.append(create_page_header(1, "Fundamentals: App Options, Nodal Pivot Physics & 3-Step Viewfinder Alignment"))
    story.append(Spacer(1, 6))
    
    # SECTION 1: APPS
    story.append(Paragraph("1. Recommended Android Applications (No Dedicated 360 Camera Required)", style_h2))
    
    app_rows = [
        [Paragraph("Application", style_table_header), Paragraph("Compatibility", style_table_header), Paragraph("Key Features & How to Launch", style_table_header)],
        [Paragraph("<b>Google Camera (GCam)</b>", style_table_cell), Paragraph("Pixel native / GCam port on Samsung, OnePlus, Xiaomi", style_table_cell), Paragraph("Select <b>Modes → Photo Sphere</b>. Automatically snaps frames as crosshair reaches floating target dots.", style_table_cell)],
        [Paragraph("<b>Panorama 360 & VR</b>", style_table_cell), Paragraph("Google Play Store (by TeliportMe)", style_table_cell), Paragraph("Universal Android support. Real-time gyroscope stitching, intuitive leveling guides, and equirectangular export.", style_table_cell)],
        [Paragraph("<b>Photosphere 360</b>", style_table_cell), Paragraph("Google Play Store", style_table_cell), Paragraph("Lightweight, zero-lag interface with automated shutter trigger on dot-alignment. Direct 2:1 JPEG output.", style_table_cell)]
    ]
    t_apps = Table(app_rows, colWidths=[42 * mm, 46 * mm, 98 * mm])
    t_apps.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_apps)
    story.append(Spacer(1, 6))
    
    # SECTION 2: GRAPHICAL DIAGRAM 1 — NODAL POINT
    story.append(Paragraph("2. The Golden Nodal Point Rule (Eliminating Stitching Faults & Parallax)", style_h2))
    story.append(Paragraph("Parallax distortion happens when nearby foreground objects shift against the background between shots. To prevent split pillars and broken stage steps, the phone lens must remain anchored to an imaginary stationary pin:", style_body))
    
    # DRAWING 1: NODAL POINT (Adjusted layout to avoid collisions)
    d_nodal = Drawing(content_width, 60 * mm)
    
    # LEFT BOX: WRONG
    d_nodal.add(Rect(0, 0, 90 * mm, 58 * mm, rx=4, ry=4, fillColor=c_red_light, strokeColor=c_red_border, strokeWidth=1))
    d_nodal.add(String(6 * mm, 51 * mm, "[X] WRONG: Arms Swing in Wide Circle", fontName="Helvetica-Bold", fontSize=8, fillColor=c_red))
    # Person at center
    d_nodal.add(Circle(45 * mm, 27 * mm, 6 * mm, fillColor=c_red, strokeColor=None))
    d_nodal.add(String(45 * mm, 25.5 * mm, "YOU", fontName="Helvetica-Bold", fontSize=6, fillColor=colors.white, textAnchor="middle"))
    # Orbiting path (radius 15 mm)
    d_nodal.add(Circle(45 * mm, 27 * mm, 15 * mm, fillColor=None, strokeColor=c_red, strokeWidth=1, strokeDashArray=[2, 2]))
    # Phone instances in orbit
    for angle_pos in [(60 * mm, 27 * mm), (30 * mm, 27 * mm), (45 * mm, 42 * mm), (45 * mm, 12 * mm)]:
        d_nodal.add(Rect(angle_pos[0] - 2.5 * mm, angle_pos[1] - 3.5 * mm, 5 * mm, 7 * mm, rx=1, ry=1, fillColor=colors.HexColor("#991b1b"), strokeColor=None))
        d_nodal.add(Circle(angle_pos[0], angle_pos[1] + 2 * mm, 1.2 * mm, fillColor=colors.HexColor("#fca5a5"), strokeColor=None))
    d_nodal.add(String(45 * mm, 3.5 * mm, "Lens moves in 3-ft radius: Stage pillars, tables & lights get cut in half", fontName="Helvetica-Bold", fontSize=6.2, fillColor=colors.HexColor("#7f1d1d"), textAnchor="middle"))
    
    # RIGHT BOX: CORRECT
    d_nodal.add(Rect(96 * mm, 0, 90 * mm, 58 * mm, rx=4, ry=4, fillColor=c_forest_light, strokeColor=c_forest_border, strokeWidth=1))
    d_nodal.add(String(102 * mm, 51 * mm, "[OK] CORRECT: Photographer Pivots Around Phone", fontName="Helvetica-Bold", fontSize=8, fillColor=c_green))
    # Fixed phone at center (y = 26 mm)
    d_nodal.add(Circle(141 * mm, 26 * mm, 3.5 * mm, fillColor=colors.HexColor("#bbf7d0"), strokeColor=c_green, strokeWidth=1))
    d_nodal.add(Rect(141 * mm - 2.5 * mm, 26 * mm - 3.5 * mm, 5 * mm, 7 * mm, rx=1, ry=1, fillColor=c_forest, strokeColor=None))
    d_nodal.add(Circle(141 * mm, 26 * mm + 2 * mm, 1.2 * mm, fillColor=c_gold, strokeColor=None))
    d_nodal.add(String(141 * mm, 42 * mm, "STATIONARY LENS AXIS", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_forest, textAnchor="middle"))
    # Person walking circle around phone (radius 15 mm)
    d_nodal.add(Circle(141 * mm, 26 * mm, 15 * mm, fillColor=None, strokeColor=c_green, strokeWidth=1, strokeDashArray=[2, 2]))
    d_nodal.add(Circle(141 * mm, 11 * mm, 5 * mm, fillColor=c_green, strokeColor=None))
    d_nodal.add(String(141 * mm, 9.5 * mm, "YOU", fontName="Helvetica-Bold", fontSize=5.5, fillColor=colors.white, textAnchor="middle"))
    d_nodal.add(String(141 * mm, 3.5 * mm, "Lens stays locked in 1 spot: Zero parallax displacement, flawless stitch", fontName="Helvetica-Bold", fontSize=6.2, fillColor=colors.HexColor("#14532d"), textAnchor="middle"))
    
    story.append(d_nodal)
    story.append(Spacer(1, 6))
    
    # SECTION 3: GRAPHICAL DIAGRAM 2 — 3-STEP VIEWFINDER UI WALKTHROUGH
    story.append(Paragraph("3. Viewfinder Capture System: Step-by-Step Dot Snapping UI", style_h2))
    story.append(Paragraph("The app guides you continuously through floating target points. Understand the 3-step capture cycle:", style_body))
    
    # 3-STEP VIEWFINDER CARDS
    d_vf = Drawing(content_width, 68 * mm)
    
    card_w = 58 * mm
    gap = 6 * mm
    
    # STEP 1: AIM & PAN
    x1 = 0
    d_vf.add(Rect(x1, 0, card_w, 66 * mm, rx=4, ry=4, fillColor=colors.white, strokeColor=c_border, strokeWidth=1))
    d_vf.add(Rect(x1, 55 * mm, card_w, 11 * mm, rx=4, ry=4, fillColor=c_forest, strokeColor=None))
    d_vf.add(Rect(x1, 55 * mm, card_w, 4 * mm, fillColor=c_forest, strokeColor=None))
    d_vf.add(String(x1 + card_w / 2, 59 * mm, "STEP 1: LOCATE BLUE DOT", fontName="Helvetica-Bold", fontSize=7, fillColor=colors.white, textAnchor="middle"))
    
    # Screen Graphic 1
    d_vf.add(Rect(x1 + 6 * mm, 18 * mm, 46 * mm, 33 * mm, rx=3, ry=3, fillColor=colors.HexColor("#0f172a"), strokeColor=colors.HexColor("#334155"), strokeWidth=1.5))
    d_vf.add(Line(x1 + 6 * mm, 34.5 * mm, x1 + 52 * mm, 34.5 * mm, strokeColor=colors.HexColor("#475569"), strokeWidth=0.5, strokeDashArray=[2, 2]))
    # Center ring searching
    d_vf.add(Circle(x1 + 22 * mm, 34.5 * mm, 5 * mm, fillColor=None, strokeColor=colors.HexColor("#f59e0b"), strokeWidth=1.5))
    d_vf.add(Circle(x1 + 22 * mm, 34.5 * mm, 1 * mm, fillColor=colors.HexColor("#f59e0b"), strokeColor=None))
    # Target dot to the right
    d_vf.add(Circle(x1 + 38 * mm, 34.5 * mm, 3 * mm, fillColor=colors.HexColor("#38bdf8"), strokeColor=colors.white, strokeWidth=1))
    # Motion Arrow
    d_vf.add(Line(x1 + 27 * mm, 34.5 * mm, x1 + 34 * mm, 34.5 * mm, strokeColor=colors.HexColor("#38bdf8"), strokeWidth=1))
    d_vf.add(Polygon([x1 + 34 * mm, 36 * mm, x1 + 36 * mm, 34.5 * mm, x1 + 34 * mm, 33 * mm], fillColor=colors.HexColor("#38bdf8"), strokeColor=None))
    d_vf.add(String(x1 + card_w / 2, 11 * mm, "Center reticle is empty.", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_text, textAnchor="middle"))
    d_vf.add(String(x1 + card_w / 2, 6 * mm, "Rotate your body slowly toward blue dot.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    
    # STEP 2: ALIGN & LOCK
    x2 = x1 + card_w + gap
    d_vf.add(Rect(x2, 0, card_w, 66 * mm, rx=4, ry=4, fillColor=colors.white, strokeColor=c_border, strokeWidth=1))
    d_vf.add(Rect(x2, 55 * mm, card_w, 11 * mm, rx=4, ry=4, fillColor=colors.HexColor("#0284c7"), strokeColor=None))
    d_vf.add(Rect(x2, 55 * mm, card_w, 4 * mm, fillColor=colors.HexColor("#0284c7"), strokeColor=None))
    d_vf.add(String(x2 + card_w / 2, 59 * mm, "STEP 2: RETICLE ALIGNMENT", fontName="Helvetica-Bold", fontSize=7, fillColor=colors.white, textAnchor="middle"))
    
    # Screen Graphic 2
    d_vf.add(Rect(x2 + 6 * mm, 18 * mm, 46 * mm, 33 * mm, rx=3, ry=3, fillColor=colors.HexColor("#0f172a"), strokeColor=colors.HexColor("#334155"), strokeWidth=1.5))
    d_vf.add(Line(x2 + 6 * mm, 34.5 * mm, x2 + 52 * mm, 34.5 * mm, strokeColor=colors.HexColor("#475569"), strokeWidth=0.5, strokeDashArray=[2, 2]))
    # Centered alignment
    d_vf.add(Circle(x2 + 29 * mm, 34.5 * mm, 6 * mm, fillColor=None, strokeColor=colors.HexColor("#38bdf8"), strokeWidth=2))
    d_vf.add(Circle(x2 + 29 * mm, 34.5 * mm, 3.5 * mm, fillColor=colors.HexColor("#38bdf8"), strokeColor=colors.white, strokeWidth=1))
    # Pulse waves
    d_vf.add(Circle(x2 + 29 * mm, 34.5 * mm, 9 * mm, fillColor=None, strokeColor=colors.HexColor("#38bdf8"), strokeWidth=0.8, strokeDashArray=[1.5, 1.5]))
    d_vf.add(String(x2 + card_w / 2, 11 * mm, "Target dot enters center ring.", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_text, textAnchor="middle"))
    d_vf.add(String(x2 + card_w / 2, 6 * mm, "Hold phone completely still for 0.5s.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))

    # STEP 3: AUTO SHUTTER & RING PROGRESS
    x3 = x2 + card_w + gap
    d_vf.add(Rect(x3, 0, card_w, 66 * mm, rx=4, ry=4, fillColor=colors.white, strokeColor=c_border, strokeWidth=1))
    d_vf.add(Rect(x3, 55 * mm, card_w, 11 * mm, rx=4, ry=4, fillColor=c_green, strokeColor=None))
    d_vf.add(Rect(x3, 55 * mm, card_w, 4 * mm, fillColor=c_green, strokeColor=None))
    d_vf.add(String(x3 + card_w / 2, 59 * mm, "STEP 3: SHUTTER & PROGRESS", fontName="Helvetica-Bold", fontSize=7, fillColor=colors.white, textAnchor="middle"))
    
    # Screen Graphic 3
    d_vf.add(Rect(x3 + 6 * mm, 18 * mm, 46 * mm, 33 * mm, rx=3, ry=3, fillColor=colors.HexColor("#0f172a"), strokeColor=colors.HexColor("#334155"), strokeWidth=1.5))
    d_vf.add(Line(x3 + 6 * mm, 34.5 * mm, x3 + 52 * mm, 34.5 * mm, strokeColor=colors.HexColor("#475569"), strokeWidth=0.5, strokeDashArray=[2, 2]))
    # Green checkmark circle
    d_vf.add(Circle(x3 + 29 * mm, 34.5 * mm, 6 * mm, fillColor=c_green, strokeColor=colors.white, strokeWidth=1.5))
    d_vf.add(String(x3 + 29 * mm, 32.5 * mm, "OK", fontName="Helvetica-Bold", fontSize=7, fillColor=colors.white, textAnchor="middle"))
    # Progress ring dots around border
    for px_offset in [10, 16, 22, 28, 34]:
        d_vf.add(Circle(x3 + px_offset * mm, 47 * mm, 1.2 * mm, fillColor=colors.HexColor("#22c55e"), strokeColor=None))
    for px_offset in [40, 46]:
        d_vf.add(Circle(x3 + px_offset * mm, 47 * mm, 1.2 * mm, fillColor=colors.HexColor("#64748b"), strokeColor=None))
    d_vf.add(String(x3 + card_w / 2, 11 * mm, "Camera clicks automatically!", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_green, textAnchor="middle"))
    d_vf.add(String(x3 + card_w / 2, 6 * mm, "New dot appears. Follow arrows to next.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    
    story.append(d_vf)
    story.append(Spacer(1, 10))
    story.append(create_footer())
    
    # =========================================================================
    # PAGE 2: 5-RING ELEVATION & VENUE MAP NODES
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(2, "Spherical Elevation Protocol & Venue Capture Map at Thekkanath Souparnika"))
    story.append(Spacer(1, 6))
    
    # SECTION 4: 5-RING ELEVATION
    story.append(Paragraph("4. The 5-Ring Vertical Elevation Protocol (Complete 360° × 180° Sphere)", style_h2))
    story.append(Paragraph("A full spherical panorama requires 5 distinct rings of photos from the exact same standing spot. Complete them in order:", style_body))
    
    d_rings = Drawing(content_width, 56 * mm)
    d_rings.add(Rect(0, 0, content_width, 54 * mm, rx=4, ry=4, fillColor=c_card_bg, strokeColor=c_border, strokeWidth=1))
    
    # Photographer Figure
    d_rings.add(Circle(36 * mm, 26 * mm, 4 * mm, fillColor=c_forest, strokeColor=None))
    d_rings.add(Line(36 * mm, 22 * mm, 36 * mm, 9 * mm, strokeColor=c_forest, strokeWidth=2))
    d_rings.add(Line(36 * mm, 9 * mm, 31 * mm, 2 * mm, strokeColor=c_forest, strokeWidth=1.5))
    d_rings.add(Line(36 * mm, 9 * mm, 41 * mm, 2 * mm, strokeColor=c_forest, strokeWidth=1.5))
    # Arm holding phone
    d_rings.add(Line(36 * mm, 20 * mm, 44 * mm, 26 * mm, strokeColor=c_forest, strokeWidth=1.5))
    # Holding Phone at eye level
    d_rings.add(Rect(43 * mm, 23.5 * mm, 3 * mm, 6.5 * mm, rx=1, ry=1, fillColor=c_gold, strokeColor=c_forest_dark, strokeWidth=0.8))
    
    # Pivot point is (44.5 mm, 27 mm)
    pv_x = 44.5 * mm
    pv_y = 27 * mm
    
    # RAY 3: ZENITH (+90)
    d_rings.add(Line(pv_x, pv_y, pv_x, 50 * mm, strokeColor=colors.HexColor("#f59e0b"), strokeWidth=1.5, strokeDashArray=[2, 2]))
    d_rings.add(Circle(pv_x, 50 * mm, 2.5 * mm, fillColor=colors.HexColor("#f59e0b"), strokeColor=None))
    d_rings.add(String(50 * mm, 47 * mm, "Pass 3: +90° Zenith (1–2 shots) · Ceiling center & chandeliers", fontName="Helvetica-Bold", fontSize=6.8, fillColor=colors.HexColor("#b45309")))
    
    # RAY 2: UPPER (+45)
    d_rings.add(Line(pv_x, pv_y, 82 * mm, 43 * mm, strokeColor=colors.HexColor("#10b981"), strokeWidth=1.8))
    d_rings.add(Circle(82 * mm, 43 * mm, 2.5 * mm, fillColor=colors.HexColor("#10b981"), strokeColor=None))
    d_rings.add(String(86 * mm, 41 * mm, "Pass 2: +45° Upper Ring (6–8 shots) · Stage lighting, upper walls & AC vents", fontName="Helvetica-Bold", fontSize=6.8, fillColor=colors.HexColor("#047857")))
    
    # RAY 1: HORIZON (0)
    d_rings.add(Line(pv_x, pv_y, 102 * mm, 27 * mm, strokeColor=colors.HexColor("#2563eb"), strokeWidth=2.2))
    d_rings.add(Circle(102 * mm, 27 * mm, 3 * mm, fillColor=colors.HexColor("#2563eb"), strokeColor=None))
    d_rings.add(String(107 * mm, 25.5 * mm, "Pass 1: 0° Horizon Eye-Level (8–10 shots) · START HERE (Full 360° circle)", fontName="Helvetica-Bold", fontSize=6.8, fillColor=colors.HexColor("#1d4ed8")))
    
    # RAY 4: LOWER (-45)
    d_rings.add(Line(pv_x, pv_y, 82 * mm, 12 * mm, strokeColor=colors.HexColor("#6366f1"), strokeWidth=1.8))
    d_rings.add(Circle(82 * mm, 12 * mm, 2.5 * mm, fillColor=colors.HexColor("#6366f1"), strokeColor=None))
    d_rings.add(String(86 * mm, 11 * mm, "Pass 4: -45° Lower Ring (6–8 shots) · Banquet chairs, stage base & carpet", fontName="Helvetica-Bold", fontSize=6.8, fillColor=colors.HexColor("#4338ca")))
    
    # RAY 5: NADIR (-90)
    d_rings.add(Line(pv_x, pv_y, pv_x, 4 * mm, strokeColor=colors.HexColor("#ef4444"), strokeWidth=1.5, strokeDashArray=[2, 2]))
    d_rings.add(Circle(pv_x, 4 * mm, 2.5 * mm, fillColor=colors.HexColor("#ef4444"), strokeColor=None))
    d_rings.add(String(50 * mm, 3 * mm, "Pass 5: -90° Nadir (1–2 shots) · Floor center (Step back 1 ft to keep feet out)", fontName="Helvetica-Bold", fontSize=6.8, fillColor=colors.HexColor("#b91c1c")))
    
    story.append(d_rings)
    story.append(Spacer(1, 6))
    
    # SECTION 5: VENUE FLOORPLAN & 6 TOUR NODES
    story.append(Paragraph("5. Venue Architectural Layout & 6 Vantage Nodes (Walkthrough Map)", style_h2))
    story.append(Paragraph("Follow this sequential navigation path through Thekkanath Souparnika to ensure seamless virtual tour connections:", style_body))
    
    # SCHEMATIC MAP DRAWING
    d_map = Drawing(content_width, 68 * mm)
    d_map.add(Rect(0, 0, content_width, 66 * mm, rx=5, ry=5, fillColor=colors.HexColor("#f8faf8"), strokeColor=c_border, strokeWidth=1))
    
    # OUTLINE HALLS
    # 1. COMPOUND & GATE (BOTTOM LEFT)
    d_map.add(Rect(6 * mm, 6 * mm, 44 * mm, 26 * mm, rx=3, ry=3, fillColor=colors.HexColor("#e2e8f0"), strokeColor=colors.HexColor("#94a3b8"), strokeWidth=1))
    d_map.add(String(28 * mm, 27 * mm, "ENTRY GATE & PARKING", fontName="Helvetica-Bold", fontSize=6.5, fillColor=colors.HexColor("#334155"), textAnchor="middle"))
    d_map.add(String(28 * mm, 10 * mm, "40–50 Cars · PWD Road", fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
    # Node 1 Pin
    d_map.add(Circle(28 * mm, 18 * mm, 5 * mm, fillColor=c_forest, strokeColor=c_gold, strokeWidth=1.5))
    d_map.add(String(28 * mm, 16 * mm, "1", fontName="Helvetica-Bold", fontSize=7, fillColor=colors.white, textAnchor="middle"))
    
    # Arrow 1 -> 2
    d_map.add(Line(50 * mm, 18 * mm, 58 * mm, 18 * mm, strokeColor=c_gold, strokeWidth=1.5))
    d_map.add(Polygon([58 * mm, 20 * mm, 61 * mm, 18 * mm, 58 * mm, 16 * mm], fillColor=c_gold, strokeColor=None))
    
    # 2. WELCOME HALL FOYER (BOTTOM MIDDLE)
    d_map.add(Rect(61 * mm, 6 * mm, 48 * mm, 26 * mm, rx=3, ry=3, fillColor=colors.HexColor("#fef3c7"), strokeColor=colors.HexColor("#fcd34d"), strokeWidth=1))
    d_map.add(String(85 * mm, 27 * mm, "WELCOME FOYER", fontName="Helvetica-Bold", fontSize=6.5, fillColor=colors.HexColor("#92400e"), textAnchor="middle"))
    d_map.add(String(85 * mm, 10 * mm, "Reception & Elder Access", fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
    # Node 2 Pin (Cleanly isolated)
    d_map.add(Circle(85 * mm, 18 * mm, 5 * mm, fillColor=c_forest, strokeColor=c_gold, strokeWidth=1.5))
    d_map.add(String(85 * mm, 16 * mm, "2", fontName="Helvetica-Bold", fontSize=7, fillColor=colors.white, textAnchor="middle"))
    
    # Arrow 2 -> 3
    d_map.add(Line(85 * mm, 32 * mm, 85 * mm, 37 * mm, strokeColor=c_gold, strokeWidth=1.5))
    d_map.add(Polygon([83 * mm, 37 * mm, 85 * mm, 40 * mm, 87 * mm, 37 * mm], fillColor=c_gold, strokeColor=None))
    
    # 3. STAGE HALL & AUDIENCE (TOP MIDDLE)
    d_map.add(Rect(61 * mm, 40 * mm, 58 * mm, 23 * mm, rx=3, ry=3, fillColor=colors.HexColor("#dcfce7"), strokeColor=colors.HexColor("#86efac"), strokeWidth=1))
    d_map.add(String(80 * mm, 57 * mm, "MAIN AUDITORIUM (AUDIENCE)", fontName="Helvetica-Bold", fontSize=6, fillColor=colors.HexColor("#166534"), textAnchor="middle"))
    d_map.add(String(80 * mm, 42 * mm, "Center Aisle · AC Seating", fontName="Helvetica", fontSize=5, fillColor=c_muted, textAnchor="middle"))
    # Node 3 Pin
    d_map.add(Circle(80 * mm, 49 * mm, 4.5 * mm, fillColor=c_forest, strokeColor=c_gold, strokeWidth=1.5))
    d_map.add(String(80 * mm, 47.5 * mm, "3", fontName="Helvetica-Bold", fontSize=6.5, fillColor=colors.white, textAnchor="middle"))
    
    # 4. ON STAGE (ELEVATED)
    d_map.add(Rect(102 * mm, 42 * mm, 15 * mm, 18 * mm, rx=2, ry=2, fillColor=c_forest, strokeColor=c_gold, strokeWidth=1))
    d_map.add(String(109.5 * mm, 56 * mm, "STAGE", fontName="Helvetica-Bold", fontSize=5, fillColor=c_gold, textAnchor="middle"))
    # Node 4 Pin
    d_map.add(Circle(109.5 * mm, 48 * mm, 4 * mm, fillColor=c_gold, strokeColor=colors.white, strokeWidth=1))
    d_map.add(String(109.5 * mm, 46.5 * mm, "4", fontName="Helvetica-Bold", fontSize=6, fillColor=c_forest_dark, textAnchor="middle"))
    
    # Arrow 3 -> 4
    d_map.add(Line(85 * mm, 49 * mm, 99 * mm, 49 * mm, strokeColor=c_gold, strokeWidth=1, strokeDashArray=[1.5, 1.5]))
    
    # 5. DINING HALL (1ST FLOOR)
    d_map.add(Rect(125 * mm, 38 * mm, 55 * mm, 25 * mm, rx=3, ry=3, fillColor=colors.HexColor("#ffedd5"), strokeColor=colors.HexColor("#fdba74"), strokeWidth=1))
    d_map.add(String(152 * mm, 57 * mm, "DINING HALL (1ST FLOOR)", fontName="Helvetica-Bold", fontSize=6.5, fillColor=colors.HexColor("#9a3412"), textAnchor="middle"))
    d_map.add(String(152 * mm, 42 * mm, "Banquet Seating & Wash Areas", fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
    # Node 5 Pin
    d_map.add(Circle(152 * mm, 49 * mm, 5 * mm, fillColor=c_forest, strokeColor=c_gold, strokeWidth=1.5))
    d_map.add(String(152 * mm, 47 * mm, "5", fontName="Helvetica-Bold", fontSize=7, fillColor=colors.white, textAnchor="middle"))
    
    # Staircase indicator
    d_map.add(Line(119 * mm, 30 * mm, 125 * mm, 42 * mm, strokeColor=colors.HexColor("#64748b"), strokeWidth=1, strokeDashArray=[2, 2]))
    d_map.add(String(122 * mm, 33 * mm, "Stairs", fontName="Helvetica", fontSize=5, fillColor=colors.HexColor("#64748b"), textAnchor="middle"))
    
    # 6. OPEN HALL (TERRACE)
    d_map.add(Rect(125 * mm, 6 * mm, 55 * mm, 26 * mm, rx=3, ry=3, fillColor=colors.HexColor("#e0e7ff"), strokeColor=colors.HexColor("#a5b4fc"), strokeWidth=1))
    d_map.add(String(152 * mm, 27 * mm, "OPEN HALL (TERRACE PAVILION)", fontName="Helvetica-Bold", fontSize=6.5, fillColor=colors.HexColor("#3730a3"), textAnchor="middle"))
    d_map.add(String(152 * mm, 10 * mm, "Marble Finish · Open Air Cross-Breeze", fontName="Helvetica", fontSize=5.5, fillColor=c_muted, textAnchor="middle"))
    # Node 6 Pin
    d_map.add(Circle(152 * mm, 18 * mm, 5 * mm, fillColor=c_forest, strokeColor=c_gold, strokeWidth=1.5))
    d_map.add(String(152 * mm, 16 * mm, "6", fontName="Helvetica-Bold", fontSize=7, fillColor=colors.white, textAnchor="middle"))
    
    # Arrow 5 -> 6
    d_map.add(Line(152 * mm, 38 * mm, 152 * mm, 32 * mm, strokeColor=c_gold, strokeWidth=1.5))
    d_map.add(Polygon([150 * mm, 32 * mm, 152 * mm, 29 * mm, 154 * mm, 32 * mm], fillColor=c_gold, strokeColor=None))
    
    story.append(d_map)
    story.append(Spacer(1, 6))
    
    # TABLE FOR NODES
    node_rows = [
        [Paragraph("#", style_table_header), Paragraph("Node Location", style_table_header), Paragraph("Exact Standing Spot", style_table_header), Paragraph("Key Features to Capture", style_table_header)],
        [Paragraph("1", style_table_cell), Paragraph("<b>Compound Front Gate</b>", style_table_cell), Paragraph("Center of front gate looking into parking lot", style_table_cell), Paragraph("40–50 car parking capacity, building facade, approach road.", style_table_cell)],
        [Paragraph("2", style_table_cell), Paragraph("<b>Welcome Hall Foyer</b>", style_table_cell), Paragraph("Just inside main glass entrance doors", style_table_cell), Paragraph("Reception desk, side sofa seating, ground floor step-free access.", style_table_cell)],
        [Paragraph("3", style_table_cell), Paragraph("<b>Stage Hall (Audience)</b>", style_table_cell), Paragraph("Center aisle, 15 ft back from stage", style_table_cell), Paragraph("Full decorated stage, warm LED lights, high ceiling AC.", style_table_cell)],
        [Paragraph("4", style_table_cell), Paragraph("<b>On the Stage</b>", style_table_cell), Paragraph("Center stage looking out over auditorium", style_table_cell), Paragraph("Host/VIP view across audience chairs and double entrance doors.", style_table_cell)],
        [Paragraph("5", style_table_cell), Paragraph("<b>Dining Hall</b>", style_table_cell), Paragraph("Center aisle between rows of banquet tables", style_table_cell), Paragraph("Long dining tables, window garden views, handwash counters.", style_table_cell)],
        [Paragraph("6", style_table_cell), Paragraph("<b>Open Hall Pavilion</b>", style_table_cell), Paragraph("Center floor of covered rooftop terrace", style_table_cell), Paragraph("Marble-finish flooring, ceiling fans, open perimeter ventilation.", style_table_cell)]
    ]
    t_nodes = Table(node_rows, colWidths=[7 * mm, 38 * mm, 50 * mm, 91 * mm])
    t_nodes.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_forest),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8faf8")]),
    ]))
    story.append(t_nodes)
    story.append(Spacer(1, 8))
    story.append(create_footer())
    
    # =========================================================================
    # PAGE 3: FIELD DOS & DONTS, EQUIRECTANGULAR FORMAT & HANDOVER
    # =========================================================================
    story.append(PageBreak())
    story.append(create_page_header(3, "Field Best Practices, 2:1 Format Verification & Handover Instructions"))
    story.append(Spacer(1, 6))
    
    # SECTION 6: GRAPHICAL DOs & DONTs (4 VISUAL CARDS)
    story.append(Paragraph("6. Practical Field Rules: Critical DOs & DON'Ts", style_h2))
    story.append(Paragraph("Follow these 4 practical field rules to avoid blurry photos, exposure mismatches, and ghost artifacts:", style_body))
    
    d_rules = Drawing(content_width, 48 * mm)
    rule_w = 43.5 * mm
    rule_gap = 4 * mm
    
    # CARD 1: CLEAN LENS (DO)
    r1_x = 0
    d_rules.add(Rect(r1_x, 0, rule_w, 46 * mm, rx=4, ry=4, fillColor=c_forest_light, strokeColor=c_forest_border, strokeWidth=1))
    d_rules.add(Circle(r1_x + rule_w / 2, 33 * mm, 7 * mm, fillColor=c_green, strokeColor=None))
    d_rules.add(String(r1_x + rule_w / 2, 30.5 * mm, "OK", fontName="Helvetica-Bold", fontSize=9, fillColor=colors.white, textAnchor="middle"))
    d_rules.add(String(r1_x + rule_w / 2, 20 * mm, "CLEAN CAMERA LENS", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_forest, textAnchor="middle"))
    d_rules.add(String(r1_x + rule_w / 2, 13 * mm, "Wipe lens with clean cloth.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    d_rules.add(String(r1_x + rule_w / 2, 8 * mm, "Skin oil causes heavy glare", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    d_rules.add(String(r1_x + rule_w / 2, 3.5 * mm, "around stage floodlights.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))

    # CARD 2: ALL LIGHTS ON (DO)
    r2_x = r1_x + rule_w + rule_gap
    d_rules.add(Rect(r2_x, 0, rule_w, 46 * mm, rx=4, ry=4, fillColor=c_forest_light, strokeColor=c_forest_border, strokeWidth=1))
    d_rules.add(Circle(r2_x + rule_w / 2, 33 * mm, 7 * mm, fillColor=c_green, strokeColor=None))
    d_rules.add(String(r2_x + rule_w / 2, 30.5 * mm, "OK", fontName="Helvetica-Bold", fontSize=9, fillColor=colors.white, textAnchor="middle"))
    d_rules.add(String(r2_x + rule_w / 2, 20 * mm, "TURN ALL LIGHTS ON", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_forest, textAnchor="middle"))
    d_rules.add(String(r2_x + rule_w / 2, 13 * mm, "Switch on chandeliers, LEDs,", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    d_rules.add(String(r2_x + rule_w / 2, 8 * mm, "and decorative wall sconces.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    d_rules.add(String(r2_x + rule_w / 2, 3.5 * mm, "Avoid half-dark halls.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))

    # CARD 3: NO MOVING PEOPLE (DON'T)
    r3_x = r2_x + rule_w + rule_gap
    d_rules.add(Rect(r3_x, 0, rule_w, 46 * mm, rx=4, ry=4, fillColor=c_red_light, strokeColor=c_red_border, strokeWidth=1))
    d_rules.add(Circle(r3_x + rule_w / 2, 33 * mm, 7 * mm, fillColor=c_red, strokeColor=None))
    d_rules.add(String(r3_x + rule_w / 2, 30.5 * mm, "NO", fontName="Helvetica-Bold", fontSize=9, fillColor=colors.white, textAnchor="middle"))
    d_rules.add(String(r3_x + rule_w / 2, 20 * mm, "NO MOVING PEOPLE", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_red, textAnchor="middle"))
    d_rules.add(String(r3_x + rule_w / 2, 13 * mm, "Ask staff to remain outside.", fontName="Helvetica", fontSize=6, fillColor=colors.HexColor("#7f1d1d"), textAnchor="middle"))
    d_rules.add(String(r3_x + rule_w / 2, 8 * mm, "Moving bodies create ghost", fontName="Helvetica", fontSize=6, fillColor=colors.HexColor("#7f1d1d"), textAnchor="middle"))
    d_rules.add(String(r3_x + rule_w / 2, 3.5 * mm, "clones & cut-off limbs.", fontName="Helvetica", fontSize=6, fillColor=colors.HexColor("#7f1d1d"), textAnchor="middle"))

    # CARD 4: MINIMUM CLEARANCE (DO)
    r4_x = r3_x + rule_w + rule_gap
    d_rules.add(Rect(r4_x, 0, rule_w, 46 * mm, rx=4, ry=4, fillColor=c_forest_light, strokeColor=c_forest_border, strokeWidth=1))
    d_rules.add(Circle(r4_x + rule_w / 2, 33 * mm, 7 * mm, fillColor=c_green, strokeColor=None))
    d_rules.add(String(r4_x + rule_w / 2, 30.5 * mm, "OK", fontName="Helvetica-Bold", fontSize=9, fillColor=colors.white, textAnchor="middle"))
    d_rules.add(String(r4_x + rule_w / 2, 20 * mm, "5-FT WALL DISTANCE", fontName="Helvetica-Bold", fontSize=6.5, fillColor=c_forest, textAnchor="middle"))
    d_rules.add(String(r4_x + rule_w / 2, 13 * mm, "Never stand right next to", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    d_rules.add(String(r4_x + rule_w / 2, 8 * mm, "pillars or door frames.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    d_rules.add(String(r4_x + rule_w / 2, 3.5 * mm, "Keep 5–6 ft open buffer.", fontName="Helvetica", fontSize=6, fillColor=c_muted, textAnchor="middle"))
    
    story.append(d_rules)
    story.append(Spacer(1, 6))
    
    # SECTION 7: EQUIRECTANGULAR 2:1 FORMAT GRAPHIC
    story.append(Paragraph("7. Output Format: Equirectangular 2:1 Projection & Web Tour Wrapping", style_h2))
    story.append(Paragraph("When finished, the app renders a flat rectangular image called an <b>Equirectangular Projection</b> with an exact <b>2:1 aspect ratio</b> (width = 2 × height):", style_body))
    
    d_eq = Drawing(content_width, 42 * mm)
    d_eq.add(Rect(0, 0, content_width, 40 * mm, rx=4, ry=4, fillColor=c_card_bg, strokeColor=c_border, strokeWidth=1))
    
    # Flat 2:1 Canvas Graphic
    d_eq.add(Rect(10 * mm, 6 * mm, 56 * mm, 28 * mm, rx=2, ry=2, fillColor=colors.HexColor("#0f172a"), strokeColor=c_gold, strokeWidth=1))
    # Curving grid lines inside to represent 360 projection
    d_eq.add(Line(10 * mm, 20 * mm, 66 * mm, 20 * mm, strokeColor=colors.HexColor("#38bdf8"), strokeWidth=0.8)) # Horizon
    d_eq.add(Line(38 * mm, 6 * mm, 38 * mm, 34 * mm, strokeColor=colors.HexColor("#64748b"), strokeWidth=0.8)) # Center
    d_eq.add(String(38 * mm, 29 * mm, "+90° Zenith (Ceiling)", fontName="Helvetica", fontSize=5, fillColor=colors.HexColor("#94a3b8"), textAnchor="middle"))
    d_eq.add(String(38 * mm, 21 * mm, "0° Eye Level Horizon (Center)", fontName="Helvetica-Bold", fontSize=5, fillColor=colors.HexColor("#38bdf8"), textAnchor="middle"))
    d_eq.add(String(38 * mm, 9 * mm, "-90° Nadir (Floor)", fontName="Helvetica", fontSize=5, fillColor=colors.HexColor("#94a3b8"), textAnchor="middle"))
    d_eq.add(String(38 * mm, 2 * mm, "FLAT EQUIRECTANGULAR JPEG (2:1 RATIO, e.g. 8192 × 4096 px)", fontName="Helvetica-Bold", fontSize=5.5, fillColor=c_forest, textAnchor="middle"))
    
    # Arrow to 3D Sphere (CORRECTLY ADDED TO d_eq!)
    d_eq.add(Line(70 * mm, 20 * mm, 84 * mm, 20 * mm, strokeColor=c_gold, strokeWidth=1.5))
    d_eq.add(Polygon([84 * mm, 22 * mm, 87 * mm, 20 * mm, 84 * mm, 18 * mm], fillColor=c_gold, strokeColor=None))
    d_eq.add(String(77 * mm, 23 * mm, "WebGL Wraps", fontName="Helvetica-Bold", fontSize=6, fillColor=c_gold_dark, textAnchor="middle"))
    
    # 3D Sphere Graphic
    d_eq.add(Circle(106 * mm, 20 * mm, 14 * mm, fillColor=colors.HexColor("#1e293b"), strokeColor=c_green, strokeWidth=1.5))
    d_eq.add(Circle(106 * mm, 20 * mm, 14 * mm, fillColor=None, strokeColor=colors.HexColor("#334155"), strokeWidth=0.5))
    # Equator ellipse
    d_eq.add(Line(92 * mm, 20 * mm, 120 * mm, 20 * mm, strokeColor=colors.HexColor("#22c55e"), strokeWidth=1, strokeDashArray=[1.5, 1.5]))
    d_eq.add(String(106 * mm, 21 * mm, "360° TOUR", fontName="Helvetica-Bold", fontSize=6.5, fillColor=colors.white, textAnchor="middle"))
    d_eq.add(String(106 * mm, 16 * mm, "Touch / Gyro", fontName="Helvetica", fontSize=5.5, fillColor=colors.HexColor("#86efac"), textAnchor="middle"))
    d_eq.add(String(106 * mm, 2 * mm, "INTERACTIVE 3D VIRTUAL TOUR", fontName="Helvetica-Bold", fontSize=5.5, fillColor=c_forest, textAnchor="middle"))
    
    # Right explanation box
    d_eq.add(Rect(126 * mm, 5 * mm, 52 * mm, 30 * mm, rx=3, ry=3, fillColor=colors.white, strokeColor=c_border, strokeWidth=0.8))
    d_eq.add(String(129 * mm, 30 * mm, "FILE SPECIFICATIONS:", fontName="Helvetica-Bold", fontSize=6, fillColor=c_forest))
    d_eq.add(String(129 * mm, 24 * mm, "• Format: High-res JPEG (.jpg)", fontName="Helvetica", fontSize=5.5, fillColor=c_text))
    d_eq.add(String(129 * mm, 19 * mm, "• Aspect Ratio: Exactly 2:1", fontName="Helvetica", fontSize=5.5, fillColor=c_text))
    d_eq.add(String(129 * mm, 14 * mm, "• Resolution: 4096×2048 or 8192×4096", fontName="Helvetica", fontSize=5.5, fillColor=c_text))
    d_eq.add(String(129 * mm, 9 * mm, "• File Size: ~8 MB – 18 MB per node", fontName="Helvetica", fontSize=5.5, fillColor=c_text))
    
    story.append(d_eq)
    story.append(Spacer(1, 6))
    
    # SECTION 8: HANDOVER & UPLOAD INSTRUCTIONS
    story.append(Paragraph("8. Quality Transfer & Handover to Web Team", style_h2))
    
    handover_box = [
        [
            Paragraph("<b>[CRITICAL RULE] DO NOT SEND VIA REGULAR WHATSAPP PHOTO SHARING</b><br/>"
                      "Standard WhatsApp photo sharing applies heavy lossy compression, shrinking images to 1600px and stripping 360° equirectangular metadata tags. The virtual tour will look degraded and pixelated.<br/>"
                      "<b>[APPROVED HIGH-RESOLUTION TRANSMISSION CHANNELS]</b><br/>"
                      "<b>1. WhatsApp 'Document' Mode:</b> In WhatsApp chat, tap the Attachment icon (paperclip) → Choose <b>Document</b> → Browse and select the original .jpg files from internal storage.<br/>"
                      "<b>2. Google Drive / WeTransfer:</b> Upload full uncompressed files to a Drive folder and share link with <code>thekkanathsouparnika@gmail.com</code>.<br/>"
                      "<b>3. Direct USB / PC Transfer:</b> Connect Android device to computer via USB cable, open <code>DCIM/Camera/</code> or <code>Pictures/Panoramas/</code>, and copy raw original JPEGs.<br/>"
                      "<i>When received, photos are placed into <code>public/assets/tour/</code> and the interactive WebGL 360° tour route is deployed instantly!</i>", style_body)
        ]
    ]
    t_handover = Table(handover_box, colWidths=[content_width])
    t_handover.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_gold_light),
        ('BOX', (0, 0), (-1, -1), 1, c_gold),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_handover)
    story.append(Spacer(1, 8))
    story.append(create_footer())

    doc.build(story)
    print(f"Generated 3-Page Illustrated PDF successfully at {pdf_path}")

if __name__ == '__main__':
    generate_pdf()
